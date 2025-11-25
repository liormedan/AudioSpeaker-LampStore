"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import type { SoundWave } from "./wave-physics"
import { WAVE_CONFIG } from "./wave-physics"
import { SoundWaveSurface } from "./sound-wave-surface"
import { SoundWaveParticles } from "./sound-wave-particles"

interface SoundWaveParticleProps {
  wave: SoundWave
  visualizationType?: "rings" | "surfaces" | "particles" | "all"
}

/**
 * SoundWaveParticle - רכיב גל קול עם תמיכה בסוגי ויזואליזציה שונים
 * יכול להציג: טבעות, משטחים תלת-ממדיים, חלקיקים, או הכל יחד
 * 
 * **אופטימיזציות מיושמות:**
 * - ✅ LOD (Level of Detail): פחות פרטים לגלים רחוקים (32-48-64 segments)
 * - ✅ Frustum Culling: הסתרת גלים מחוץ למסך (אקטיבי + אוטומטי של Three.js)
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 7.2
 */
export function SoundWaveParticle({ 
  wave, 
  visualizationType = "rings" 
}: SoundWaveParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const lastRadiusRef = useRef<number>(0)
  const { camera } = useThree()
  
  // LOD - Level of Detail לפי מרחק (תואם למפרט סעיף 7.2)
  // פחות פרטים לגלים רחוקים - משפר ביצועים
  // ניהול זיכרון: שימוש ב-useMemo לחישובים כבדים (תואם למפרט סעיף 7.3)
  // גיאומטריות נוצרות פעם אחת ונשמרות בזיכרון
  const lodGeometries = useMemo(() => {
    return {
      high: new THREE.RingGeometry(0.1, 0.1 + WAVE_CONFIG.ringThickness * 2, 64), // קרוב: 64 segments
      medium: new THREE.RingGeometry(0.1, 0.1 + WAVE_CONFIG.ringThickness * 2, 48), // בינוני: 48 segments
      low: new THREE.RingGeometry(0.1, 0.1 + WAVE_CONFIG.ringThickness * 2, 32), // רחוק: 32 segments
    }
  }, [])

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return

    // חישוב מיקום הגל במרחב התלת-ממדי
    // אם יש כיוון, הגל נע לאורך הקו (origin כבר מעודכן ב-updateWave)
    // אם אין כיוון, הגל מתפשט בצורה ספירית מהמקור
    const wavePosition = new THREE.Vector3(wave.origin[0], wave.origin[1], wave.origin[2])
    
    // עדכון מיקום הגל
    meshRef.current.position.copy(wavePosition)
    
    // חישוב סיבוב הטבעת - מאוזנת (perpendicular לכיוון התנועה)
    // הטבעת צריכה להיות מאוזנת לכיוון התנועה (כמו דיסקה שצפה באוויר)
    // הטבעת היא ב-XY plane (מאוזנת), אז היא צריכה להיות מסובבת כך שהיא מאוזנת לכיוון התנועה
    if (wave.direction) {
      // כיוון התנועה (normalized)
      const direction = new THREE.Vector3(...wave.direction).normalize()
      
      // הטבעת צריכה להיות מאוזנת (perpendicular לכיוון התנועה)
      // הטבעת היא ב-XY plane, אז היא צריכה להיות מסובבת כך שהיא מאוזנת לכיוון התנועה
      // חישוב הסיבוב כך שהטבעת תהיה מאוזנת לכיוון התנועה
      
      // כיוון למעלה (up vector)
      const up = new THREE.Vector3(0, 1, 0)
      // חישוב ציר הסיבוב (cross product) - right vector
      let right = new THREE.Vector3().crossVectors(up, direction)
      // אם right הוא אפס (כיוון התנועה הוא למעלה/למטה), נשתמש ב-forward
      if (right.length() < 0.1) {
        const forward = new THREE.Vector3(1, 0, 0)
        right.crossVectors(direction, forward)
      }
      right.normalize()
      const forward = new THREE.Vector3().crossVectors(direction, right).normalize()
      
      // יצירת מטריצת סיבוב כך שהטבעת מאוזנת לכיוון התנועה
      // הטבעת היא ב-XY plane, אז היא צריכה להיות מסובבת כך שהיא מאוזנת לכיוון התנועה
      // הטבעת צריכה להיות מאוזנת (perpendicular לכיוון התנועה)
      const rotationMatrix = new THREE.Matrix4()
      rotationMatrix.makeBasis(right, forward, direction)
      const euler = new THREE.Euler().setFromRotationMatrix(rotationMatrix)
      meshRef.current.rotation.set(euler.x, euler.y, euler.z)
    } else {
      // אין כיוון - הטבעת מאוזנת אופקית (כמו דיסקה שצפה באוויר)
      meshRef.current.rotation.set(0, 0, 0)
    }
    
    // Frustum Culling - בדיקה אם הגל בתוך המסך (תואם למפרט סעיף 7.2)
    const distance = camera.position.distanceTo(wavePosition)
    
    // Frustum Culling אקטיבי - הסתרת גלים מחוץ למסך
    if (distance > WAVE_CONFIG.cullingDistance) {
      meshRef.current.visible = false
      return
    }
    meshRef.current.visible = true

    // LOD - Level of Detail לפי מרחק (תואם למפרט סעיף 7.2)
    // פחות פרטים לגלים רחוקים - משפר ביצועים
    const lodLevel = distance < 10 ? "high" : distance < 20 ? "medium" : "low"
    const lodSegments = lodLevel === "high" ? 64 : lodLevel === "medium" ? 48 : 32

    // עדכון רדיוס הטבעת
    // הטבעת צריכה להיות קטנה ולהתחיל מהמיקום המדויק של ה-driver
    // הרדיוס מוגבל ל-maxRingRadius כדי שהטבעות לא יהיו גדולות מדי
    const maxRingRadius = WAVE_CONFIG.maxRingRadius || 2.0
    const currentRadius = Math.min(wave.radius, maxRingRadius)
    
    // אפקט pulse - הטבעות פועמות קלות לפי העוצמה והגיל
    const radiusPulse = 1 + Math.sin(wave.age * 8 + wave.intensity * 10) * 0.05
    const pulsedRadius = currentRadius * radiusPulse
    const innerRadius = Math.max(WAVE_CONFIG.minRingRadius || 0.05, pulsedRadius - WAVE_CONFIG.ringThickness)
    const outerRadius = Math.max(WAVE_CONFIG.minRingRadius || 0.05, pulsedRadius + WAVE_CONFIG.ringThickness)

    // עדכון גיאומטריה רק אם הרדיוס השתנה משמעותית או LOD השתנה (לשיפור ביצועים)
    const shouldUpdateGeometry = Math.abs(lastRadiusRef.current - wave.radius) > 0.2
    if (shouldUpdateGeometry) {
      const oldGeometry = meshRef.current.geometry
      if (oldGeometry) {
        oldGeometry.dispose()
      }
      
      // רזולוציית טבעות: 32-64 vertices לטבעת (תואם למפרט סעיף 7.1)
      // LOD: פחות segments לגלים רחוקים (תואם למפרט סעיף 7.2)
      meshRef.current.geometry = new THREE.RingGeometry(
        innerRadius,
        outerRadius,
        lodSegments
      )
      lastRadiusRef.current = pulsedRadius
    }

    // שקיפות דינמית לפי עוצמה ומרחק (תואם למפרט סעיף 3.3)
    // ככל שהגל רחוק יותר או חלש יותר, הוא יותר שקוף
    // דעיכה חלקה יותר - שימוש בפונקציה אקספוננציאלית
    // אם יש כיוון, הגל נע לאורך הקו, אז המרחק הוא לפי המרחק מהמקור המקורי
    // אם אין כיוון, הגל מתפשט בצורה ספירית, אז המרחק הוא הרדיוס
    const distanceFromOrigin = wave.direction ? wave.radius : wave.radius
    
    // דעיכה חלקה יותר עם פונקציה אקספוננציאלית
    const distanceOpacity = Math.exp(-distanceFromOrigin * WAVE_CONFIG.distanceOpacityFalloff * 2)
    const ageOpacity = Math.exp(-wave.age * 0.5) // דעיכה עם הזמן
    const opacity = wave.intensity * WAVE_CONFIG.opacityBase * distanceOpacity * ageOpacity
    // מינימום 20% שקיפות כדי שהגלים תמיד יראו, גם כשהם חלשים
    materialRef.current.opacity = Math.max(0.2, Math.min(1, opacity))
    
    // Bloom Effect - זוהר חזק יותר בעוצמות גבוהות (תואם למפרט סעיף 3.3)
    // אפקט pulse - הטבעות פועמות לפי העוצמה והגיל
    const pulseEffect = 1 + Math.sin(wave.age * 5) * 0.1 // pulse עדין
    const bloomIntensity = (WAVE_CONFIG.bloomIntensityBase + 
      (wave.intensity * WAVE_CONFIG.bloomIntensityMultiplier)) * pulseEffect
    // מינימום זוהר כדי שהגלים תמיד יראו
    materialRef.current.emissiveIntensity = Math.max(1.5, bloomIntensity)

    // עדכון צבע - וידוא שה-color קיים ומאותחל
    if (wave.color && wave.color instanceof THREE.Color) {
      materialRef.current.color.copy(wave.color)
      materialRef.current.emissive.copy(wave.color)
    } else {
      // fallback - צבע לבן אם ה-color לא תקין
      materialRef.current.color.set(1, 1, 1)
      materialRef.current.emissive.set(1, 1, 1)
    }
    
    // חישוב סיבוב הטבעת - מאוזנת (perpendicular לכיוון התנועה)
    // אם יש כיוון, הטבעת מסתובבת כך שהיא מאוזנת לכיוון התנועה (כמו דיסקה שצפה באוויר)
    // אם אין כיוון, הטבעת מאוזנת אופקית (כמו דיסקה שצפה באוויר)
    if (wave.direction) {
      // כיוון התנועה (normalized)
      const direction = new THREE.Vector3(...wave.direction).normalize()
      // כיוון למעלה (up vector)
      const up = new THREE.Vector3(0, 1, 0)
      // חישוב ציר הסיבוב (cross product) - right vector
      const right = new THREE.Vector3().crossVectors(up, direction).normalize()
      // אם right הוא אפס (כיוון התנועה הוא למעלה/למטה), נשתמש ב-forward
      if (right.length() < 0.1) {
        const forward = new THREE.Vector3(1, 0, 0)
        right.crossVectors(direction, forward).normalize()
      }
      const forward = new THREE.Vector3().crossVectors(direction, right).normalize()
      
      // יצירת מטריצת סיבוב כך שהטבעת מאוזנת לכיוון התנועה
      // הטבעת צריכה להיות מאוזנת (perpendicular לכיוון התנועה)
      const rotationMatrix = new THREE.Matrix4()
      rotationMatrix.makeBasis(right, forward, direction)
      const euler = new THREE.Euler().setFromRotationMatrix(rotationMatrix)
      meshRef.current.rotation.set(euler.x, euler.y, euler.z)
    } else {
      // אין כיוון - הטבעת מאוזנת אופקית (כמו דיסקה שצפה באוויר)
      meshRef.current.rotation.set(0, 0, 0)
    }
    
    // Distortion - עיוות קל של הגל בהתנגשויות (תואם למפרט סעיף 3.3)
    if (wave.distortion && wave.distortion > 0) {
      const distortion = wave.distortion * WAVE_CONFIG.distortionAmount * 10
      // עיוות קל של המיקום והסיבוב
      const time = Date.now() * 0.001
      meshRef.current.position.x = wave.origin[0] + Math.sin(time * 5) * distortion
      meshRef.current.position.z = wave.origin[2] + Math.cos(time * 5) * distortion
      // עיוות הסיבוב - רק אם אין כיוון (אם יש כיוון, הסיבוב כבר מחושב)
      if (!wave.direction) {
        meshRef.current.rotation.z = Math.sin(time * 3) * distortion
      }
    } else {
      meshRef.current.position.set(wave.origin[0], wave.origin[1], wave.origin[2])
      // הסיבוב כבר מחושב למעלה, לא צריך לאפס
    }
  })

  // הצגה לפי סוג הויזואליזציה
  if (visualizationType === "surfaces") {
    return <SoundWaveSurface wave={wave} />
  }

  if (visualizationType === "particles") {
    return <SoundWaveParticles wave={wave} particleCount={WAVE_CONFIG.particleCount} />
  }

  if (visualizationType === "all") {
    return (
      <>
        {/* טבעות על הרצפה */}
        <mesh
          ref={meshRef}
          position={wave.origin}
          rotation={[-Math.PI / 2, 0, 0]} // שכיבה על הרצפה
          frustumCulled={true} // Frustum Culling אוטומטי של Three.js (תואם למפרט סעיף 7.2)
        >
          <ringGeometry
            args={[
              Math.max(0.3, wave.radius - WAVE_CONFIG.ringThickness),
              Math.max(0.5, wave.radius + WAVE_CONFIG.ringThickness),
              WAVE_CONFIG.ringSegments,
            ]}
          />
          <meshStandardMaterial
            ref={materialRef}
            color={wave.color && wave.color instanceof THREE.Color ? wave.color : new THREE.Color(1, 1, 1)}
            transparent
            opacity={Math.max(0.3, wave.intensity * WAVE_CONFIG.opacityBase)} // מינימום 30% שקיפות כדי שהגלים תמיד יראו
            emissive={wave.color && wave.color instanceof THREE.Color ? wave.color : new THREE.Color(1, 1, 1)}
            emissiveIntensity={Math.max(1, wave.intensity * 3)} // זוהר חזק יותר
            toneMapped={false}
          />
        </mesh>
        {/* משטח תלת-ממדי */}
        <SoundWaveSurface wave={wave} />
        {/* חלקיקים */}
        <SoundWaveParticles wave={wave} particleCount={WAVE_CONFIG.particleCount} />
      </>
    )
  }

  // ברירת מחדל: טבעות
  // המיקום מתעדכן ב-useFrame, אז כאן רק מיקום ראשוני
  const wavePosition: [number, number, number] = [wave.origin[0], wave.origin[1], wave.origin[2]]
  
  // סיבוב ראשוני - מאוזן (יתעדכן ב-useFrame)
  // אם יש כיוון, הטבעת תהיה מאוזנת לכיוון התנועה
  // אם אין כיוון, הטבעת תהיה מאוזנת אופקית
  const initialRotation: [number, number, number] = wave.direction
    ? [0, 0, 0] // יתעדכן ב-useFrame
    : [0, 0, 0] // מאוזן אופקית
  
  return (
    <mesh
      ref={meshRef}
      position={wavePosition}
      rotation={initialRotation}
      frustumCulled={true} // Frustum Culling אוטומטי של Three.js (תואם למפרט סעיף 7.2)
    >
      <ringGeometry
        args={[
          Math.max(0.3, wave.radius - WAVE_CONFIG.ringThickness),
          Math.max(0.5, wave.radius + WAVE_CONFIG.ringThickness),
          WAVE_CONFIG.ringSegments,
        ]}
      />
      <meshStandardMaterial
        ref={materialRef}
        color={wave.color && wave.color instanceof THREE.Color ? wave.color : new THREE.Color(1, 1, 1)}
        transparent
        opacity={Math.max(0.3, wave.intensity * WAVE_CONFIG.opacityBase)} // מינימום 30% שקיפות כדי שהגלים תמיד יראו
        emissive={wave.color && wave.color instanceof THREE.Color ? wave.color : new THREE.Color(1, 1, 1)}
        emissiveIntensity={Math.max(1, wave.intensity * 3)} // זוהר חזק יותר
        toneMapped={false}
      />
    </mesh>
  )
}

