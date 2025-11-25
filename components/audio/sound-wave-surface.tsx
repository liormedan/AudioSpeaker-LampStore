"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { SoundWave } from "./wave-physics"
import { WAVE_CONFIG } from "./wave-physics"

interface SoundWaveSurfaceProps {
  wave: SoundWave
}

/**
 * SoundWaveSurface - משטח גל תלת-ממדי כדורי שמתעקם לפי עוצמה
 * יוצר אפקט ויזואלי של גל קול תלת-ממדי מלא
 */
export function SoundWaveSurface({ wave }: SoundWaveSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const lastRadiusRef = useRef<number>(0)

  // יצירת גיאומטריה של כדור
  // ניהול זיכרון: שימוש ב-useMemo לחישובים כבדים (תואם למפרט סעיף 7.3)
  // גיאומטריה נוצרת פעם אחת ונשמרת בזיכרון
  const sphereGeometry = useMemo(() => {
    return new THREE.SphereGeometry(1, 32, 32)
  }, [])

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return

    // עדכון רדיוס הכדור
    const scale = wave.radius
    meshRef.current.scale.set(scale, scale, scale)

    // עיוות הכדור לפי עוצמה - ככל שהעוצמה גבוהה יותר, הגל יותר "דחוס"
    const intensityDistortion = 1 + (wave.intensity * 0.1) * Math.sin(wave.age * 10)
    
    // Distortion - עיוות קל בהתנגשויות (תואם למפרט סעיף 3.3)
    const collisionDistortion = wave.distortion || 0
    const totalDistortion = intensityDistortion + collisionDistortion * 0.2
    meshRef.current.scale.y *= totalDistortion
    
    // שקיפות דינמית לפי עוצמה ומרחק (תואם למפרט סעיף 3.3)
    const distanceOpacity = 1 / (1 + wave.radius * WAVE_CONFIG.distanceOpacityFalloff)
    const opacity = wave.intensity * WAVE_CONFIG.opacityBase * 0.5 * distanceOpacity
    materialRef.current.opacity = Math.max(0, Math.min(1, opacity))
    
    // Bloom Effect - זוהר חזק יותר בעוצמות גבוהות (תואם למפרט סעיף 3.3)
    const bloomIntensity = WAVE_CONFIG.bloomIntensityBase + 
      (wave.intensity * WAVE_CONFIG.bloomIntensityMultiplier) * 0.7
    materialRef.current.emissiveIntensity = bloomIntensity

    // עדכון צבע - וידוא שה-color קיים ומאותחל
    if (wave.color && wave.color instanceof THREE.Color) {
      materialRef.current.color.copy(wave.color)
      materialRef.current.emissive.copy(wave.color)
    } else {
      // fallback - צבע לבן אם ה-color לא תקין
      materialRef.current.color.set(1, 1, 1)
      materialRef.current.emissive.set(1, 1, 1)
    }
    
    // עיוות מיקום בהתנגשויות
    if (collisionDistortion > 0) {
      const time = Date.now() * 0.001
      meshRef.current.position.x = wave.origin[0] + Math.sin(time * 5) * collisionDistortion * 0.5
      meshRef.current.position.y = wave.origin[1] + Math.cos(time * 5) * collisionDistortion * 0.5
      meshRef.current.position.z = wave.origin[2] + Math.sin(time * 3) * collisionDistortion * 0.5
    } else {
      meshRef.current.position.set(wave.origin[0], wave.origin[1], wave.origin[2])
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={wave.origin}
      geometry={sphereGeometry}
    >
      <meshStandardMaterial
        ref={materialRef}
        color={wave.color && wave.color instanceof THREE.Color ? wave.color : new THREE.Color(1, 1, 1)}
        transparent
        opacity={wave.intensity * WAVE_CONFIG.opacityBase * 0.5}
        emissive={wave.color && wave.color instanceof THREE.Color ? wave.color : new THREE.Color(1, 1, 1)}
        emissiveIntensity={wave.intensity * 1.5}
        toneMapped={false}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  )
}

