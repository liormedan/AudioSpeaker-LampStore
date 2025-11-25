"use client"

import { useState, useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { useAudio } from "./audio-manager"
import { SoundWaveParticle } from "./sound-wave-particle"
import { SoundWaveInstanced } from "./sound-wave-instanced"
import {
  type SoundWave,
  createWave,
  updateWaveWithCollisions,
  isWaveActive,
  calculateIntensity,
  calculateEmitInterval,
  calculateWaveInterference,
  WAVE_CONFIG,
} from "./wave-physics"
import { getDriverPositionsAndDirections } from "./driver-positions"

interface SoundWaveEmitterProps {
  position: [number, number, number]
  rotation?: [number, number, number] // סיבוב הרמקול (לחישוב כיוון ה-drivers)
  enabled?: boolean
  visualizationType?: "rings" | "surfaces" | "particles" | "all"
  useInstanced?: boolean // שימוש ב-Instanced Rendering לאופטימיזציה
  onWavesChange?: (waves: SoundWave[]) => void // Callback להחזרת הגלים (לשימוש ב-Performance Monitor)
  targetPosition?: [number, number, number] // מיקום יעד (למשל הדמות) - הגלים נעים לכיוון זה (deprecated - משתמשים ב-drivers)
}

/**
 * SoundWaveEmitter - רכיב שיוצר גלי קול מרמקול ספציפי
 * כל רמקול יכול להיות עם Emitter משלו שיוצר גלים לפי המוזיקה
 */
export function SoundWaveEmitter({ 
  position,
  rotation = [0, 0, 0], // סיבוב הרמקול
  enabled = true,
  visualizationType = "rings",
  useInstanced = false, // ברירת מחדל: false (תמיכה בכל סוגי הויזואליזציה)
  onWavesChange,
  targetPosition // מיקום יעד - הגלים נעים לכיוון זה (deprecated)
}: SoundWaveEmitterProps) {
  const { audioData, isPlaying } = useAudio()
  const [waves, setWaves] = useState<SoundWave[]>([])
  const lastEmitTime = useRef<number>(0)
  const lastWavesCountRef = useRef<number>(0)
  const lastWavesIdsRef = useRef<string>("")
  const onWavesChangeRef = useRef(onWavesChange)
  const lastNotificationTimeRef = useRef<number>(0)

  // עדכון ה-ref של ה-callback כדי שהוא תמיד יהיה עדכני
  useEffect(() => {
    onWavesChangeRef.current = onWavesChange
  }, [onWavesChange])

  // פונקציה עוזרת לבדוק אם יש שינוי משמעותי ולעדכן את ה-callback
  // עם throttling כדי למנוע קריאות מיותרות
  const checkAndNotifyWavesChange = (currentWaves: SoundWave[], currentTime: number) => {
    if (!onWavesChangeRef.current) return
    
    const currentCount = currentWaves.length
    const currentIds = currentWaves.map(w => w.id).join(",")
    
    // עדכון רק אם מספר הגלים או ה-IDs השתנו
    const hasChanged = currentCount !== lastWavesCountRef.current || currentIds !== lastWavesIdsRef.current
    
    // Throttle: עדכון מקסימום פעם ב-100ms (10 FPS) כדי למנוע infinite loops
    const timeSinceLastNotification = currentTime - lastNotificationTimeRef.current
    const shouldNotify = hasChanged && timeSinceLastNotification >= 0.1
    
    if (shouldNotify) {
      lastWavesCountRef.current = currentCount
      lastWavesIdsRef.current = currentIds
      lastNotificationTimeRef.current = currentTime
      onWavesChangeRef.current(currentWaves)
    }
  }

  // תדירות עדכון: 60 FPS (useFrame) - תואם למפרט סעיף 7.1
  useFrame((state, delta) => {
    const currentTime = state.clock.elapsedTime
    
    if (!enabled || !isPlaying || audioData.length === 0) {
      // ניקוי גלים כשהמוזיקה לא מנגנת או כשה-Emitter מושבת
      if (waves.length > 0) {
        setWaves([])
        // עדכון callback כאשר הגלים מתנקים
        checkAndNotifyWavesChange([], currentTime)
      }
      return
    }
    const intensity = calculateIntensity(audioData)

    // חישוב תדירות דינמית לפי עוצמת המוזיקה
    // ככל שהמוזיקה חזקה יותר, הגלים נוצרים יותר מהר
    const emitInterval = calculateEmitInterval(intensity)

    let newWavesToAdd: SoundWave[] = []

    // יצירת גלים מכל driver אם עבר מספיק זמן והעוצמה מספיקה
    if (
      currentTime - lastEmitTime.current >= emitInterval &&
      intensity >= WAVE_CONFIG.minIntensityThreshold
    ) {
      // קבלת מיקומים וכיוונים של כל ה-drivers
      const drivers = getDriverPositionsAndDirections(position, rotation)
      
      // יצירת גל מכל driver - הגלים רוכבים על הקווים
      // כל driver יוצר גל עם גודל וצבע לפי התדר הספציפי שלו
      newWavesToAdd = drivers.map((driver) => {
        return createWave(
          driver.position, 
          audioData, 
          intensity, 
          undefined, 
          driver.direction, 
          driver.type,
          driver.frequencyIndex // שימוש בתדר הספציפי של ה-driver
        )
      })

      lastEmitTime.current = currentTime
    }

    // עדכון גלים קיימים (כולל התנגשויות עם קירות והחזרות)
    setWaves((prev) => {
      // הוספת גלים חדשים אם נוצרו
      const wavesWithNew = newWavesToAdd.length > 0 ? [...prev, ...newWavesToAdd] : prev
      
      const updatedWaves: SoundWave[] = []
      const reflectedWaves: SoundWave[] = []
      
      // עדכון כל הגלים
      // ניהול זיכרון: הסרת גלים ישנים אוטומטית (תואם למפרט סעיף 7.3)
      // גלים לא פעילים (דעכו או הגיעו למרחק מקסימלי) מוסרים אוטומטית דרך isWaveActive()
      wavesWithNew.forEach((wave) => {
        const { wave: updatedWave, reflectedWave } = updateWaveWithCollisions(wave, delta)
        
        // הוספת הגל המעודכן אם הוא עדיין פעיל
        // גלים לא פעילים לא מתווספים - זה מונע הצטברות בזיכרון
        if (isWaveActive(updatedWave)) {
          updatedWaves.push(updatedWave)
        }
        
        // הוספת גל מוחזר אם נוצר
        if (reflectedWave && isWaveActive(reflectedWave)) {
          reflectedWaves.push(reflectedWave)
        }
      })
      
      // אינטראקציה בין גלים (התאבכות)
      const wavesWithInterference: SoundWave[] = []
      const processedIndices = new Set<number>()
      
      updatedWaves.forEach((wave1, i) => {
        if (processedIndices.has(i)) return
        
        let finalWave = wave1
        let hasInterference = false
        
        // בדיקת אינטראקציה עם גלים אחרים
        updatedWaves.forEach((wave2, j) => {
          if (i === j || processedIndices.has(j)) return
          
          const interference = calculateWaveInterference(wave1, wave2)
          if (interference) {
            finalWave = interference.wave1
            processedIndices.add(j) // סמן את הגל השני כמעובד
            hasInterference = true
          }
        })
        
        wavesWithInterference.push(finalWave)
        processedIndices.add(i)
      })
      
      // שילוב גלים מעודכנים (עם אינטראקציה) וגלים מוחזרים
      const allWaves = [...wavesWithInterference, ...reflectedWaves]
      
      // הגבלת מספר הגלים לפי ביצועים (תואם למפרט סעיף 7.3)
      // מקסימום גלים פעילים: 20-30 גלים בו-זמנית (תואם למפרט סעיף 7.1)
      // שימוש ב-slice(-N) שומר רק על הגלים האחרונים, מונע הצטברות בזיכרון
      const finalWaves = allWaves.slice(-Math.floor(WAVE_CONFIG.maxWaves / 2))
      
      // עדכון callback עם הגלים הסופיים (עם throttling)
      checkAndNotifyWavesChange(finalWaves, currentTime)
      
      return finalWaves
    })
  })

  // Instanced Rendering לאופטימיזציה (רק לטבעות)
  if (useInstanced && visualizationType === "rings") {
    return <SoundWaveInstanced waves={waves} />
  }

  // רינדור רגיל (תמיכה בכל סוגי הויזואליזציה)
  return (
    <>
      {waves.map((wave) => (
        <SoundWaveParticle 
          key={wave.id} 
          wave={wave} 
          visualizationType={visualizationType}
        />
      ))}
    </>
  )
}

