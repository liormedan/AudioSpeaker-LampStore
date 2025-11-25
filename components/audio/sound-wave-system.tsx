"use client"

import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useAudio } from "./audio-manager"
import { SoundWaveParticle } from "./sound-wave-particle"
import {
  type SoundWave,
  createWave,
  updateWaveWithCollisions,
  isWaveActive,
  calculateIntensity,
  calculateEmitInterval,
  WAVE_CONFIG,
} from "./wave-physics"

interface SoundWaveSystemProps {
  speakerPositions: [number, number, number][]
}

export function SoundWaveSystem({ speakerPositions }: SoundWaveSystemProps) {
  const { audioData, isPlaying } = useAudio()
  const [waves, setWaves] = useState<SoundWave[]>([])
  const lastEmitTime = useRef<number>(0)
  const waveIdCounter = useRef<number>(0)

  // תדירות עדכון: 60 FPS (useFrame) - תואם למפרט סעיף 7.1
  useFrame((state, delta) => {
    if (!isPlaying || audioData.length === 0) {
      // ניקוי גלים כשהמוזיקה לא מנגנת
      if (waves.length > 0) {
        setWaves([])
      }
      return
    }

    const currentTime = state.clock.elapsedTime
    const intensity = calculateIntensity(audioData)

    // חישוב תדירות דינמית לפי עוצמת המוזיקה
    const emitInterval = calculateEmitInterval(intensity)

    // יצירת גלים חדשים
    if (
      currentTime - lastEmitTime.current >= emitInterval &&
      intensity >= WAVE_CONFIG.minIntensityThreshold
    ) {
      const newWaves: SoundWave[] = []

      speakerPositions.forEach((position) => {
        const newWave = createWave(position, audioData, intensity)
        newWaves.push(newWave)
      })

      setWaves((prev) => {
        const combined = [...prev, ...newWaves]
        // הגבלת מספר הגלים
        // מקסימום גלים פעילים: 20-30 גלים בו-זמנית (תואם למפרט סעיף 7.1)
        // כאן: maxWaves = 25 (בטווח המומלץ)
        return combined.slice(-WAVE_CONFIG.maxWaves)
      })

      lastEmitTime.current = currentTime
    }

    // עדכון גלים קיימים (כולל התנגשויות עם קירות והחזרות)
    setWaves((prev) => {
      const updatedWaves: SoundWave[] = []
      const reflectedWaves: SoundWave[] = []
      
      // ניהול זיכרון: הסרת גלים ישנים אוטומטית (תואם למפרט סעיף 7.3)
      // גלים לא פעילים (דעכו או הגיעו למרחק מקסימלי) מוסרים אוטומטית דרך isWaveActive()
      prev.forEach((wave) => {
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
      
      // שילוב גלים מעודכנים וגלים מוחזרים
      const allWaves = [...updatedWaves, ...reflectedWaves]
      
      // הגבלת מספר הגלים לפי ביצועים (תואם למפרט סעיף 7.3)
      // מקסימום גלים פעילים: 20-30 גלים בו-זמנית (תואם למפרט סעיף 7.1)
      // שימוש ב-slice(-N) שומר רק על הגלים האחרונים, מונע הצטברות בזיכרון
      return allWaves.slice(-WAVE_CONFIG.maxWaves)
    })
  })

  return (
    <>
      {waves.map((wave) => (
        <SoundWaveParticle key={wave.id} wave={wave} />
      ))}
    </>
  )
}

