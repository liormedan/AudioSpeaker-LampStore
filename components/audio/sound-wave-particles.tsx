"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { SoundWave } from "./wave-physics"
import { WAVE_CONFIG } from "./wave-physics"

interface SoundWaveParticlesProps {
  wave: SoundWave
  particleCount?: number
}

/**
 * SoundWaveParticles - חלקיקים שמתפזרים עם הגל
 * יוצרים אפקט של חלקיקי קול שמתפשטים מהרמקול
 */
export function SoundWaveParticles({ wave, particleCount = 20 }: SoundWaveParticlesProps) {
  const particlesRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const basePositionsRef = useRef<Float32Array | null>(null)

  // יצירת חלקיקים על פני הכדור
  // ניהול זיכרון: שימוש ב-useMemo לחישובים כבדים (תואם למפרט סעיף 7.3)
  // חישוב מיקומי חלקיקים וצבעים מתבצע רק כאשר particleCount או wave.color משתנים
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    // וידוא שה-color תקין
    const color = wave.color && wave.color instanceof THREE.Color 
      ? new THREE.Color(wave.color) 
      : new THREE.Color(1, 1, 1) // fallback - לבן

    for (let i = 0; i < particleCount; i++) {
      // מיקום אקראי על פני כדור
      const theta = Math.random() * Math.PI * 2 // זווית אופקית
      const phi = Math.acos(2 * Math.random() - 1) // זווית אנכית
      
      const x = Math.sin(phi) * Math.cos(theta)
      const y = Math.sin(phi) * Math.sin(theta)
      const z = Math.cos(phi)
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      // צבע עם וריאציה קלה
      const colorVariation = 0.8 + Math.random() * 0.2
      colors[i * 3] = color.r * colorVariation
      colors[i * 3 + 1] = color.g * colorVariation
      colors[i * 3 + 2] = color.b * colorVariation
    }

    return { positions, colors }
  }, [particleCount, wave.color])

  // ניהול זיכרון: שימוש ב-useMemo לחישובים כבדים (תואם למפרט סעיף 7.3)
  // יצירת BufferGeometry מתבצעת רק כאשר particleCount או wave.color משתנים
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const posArray = new Float32Array(positions)
    const colorArray = new Float32Array(colors)
    geom.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
    return geom
  }, [particleCount, wave.color])

  useFrame(() => {
    if (!particlesRef.current || !materialRef.current) return

    // עדכון מיקום החלקיקים לפי רדיוס הגל
    const positionAttribute = particlesRef.current.geometry.attributes.position
    const positionArray = positionAttribute.array as Float32Array
    
    // שמירת מיקומי הבסיס (נורמליזציה) ב-ref
    if (!basePositionsRef.current) {
      basePositionsRef.current = new Float32Array(positionArray)
    }
    
    const time = Date.now() * 0.001
    const hasDistortion = wave.distortion && wave.distortion > 0
    
    for (let i = 0; i < particleCount; i++) {
      const baseX = basePositionsRef.current[i * 3]
      const baseY = basePositionsRef.current[i * 3 + 1]
      const baseZ = basePositionsRef.current[i * 3 + 2]
      
      // מיקום על פני הכדור לפי הרדיוס הנוכחי
      const radius = wave.radius * (0.95 + (i % 10) * 0.01) // וריאציה דטרמיניסטית
      
    // Distortion - עיוות קל של החלקיקים בהתנגשויות (תואם למפרט סעיף 3.3)
    if (hasDistortion && wave.distortion) {
      const distortion = wave.distortion * WAVE_CONFIG.distortionAmount * 5
        const distX = Math.sin(time * 5 + i) * distortion
        const distY = Math.cos(time * 5 + i) * distortion
        const distZ = Math.sin(time * 3 + i) * distortion
        
        positionArray[i * 3] = baseX * radius + distX
        positionArray[i * 3 + 1] = baseY * radius + distY
        positionArray[i * 3 + 2] = baseZ * radius + distZ
      } else {
        positionArray[i * 3] = baseX * radius
        positionArray[i * 3 + 1] = baseY * radius
        positionArray[i * 3 + 2] = baseZ * radius
      }
    }
    
    positionAttribute.needsUpdate = true

    // שקיפות דינמית לפי עוצמה ומרחק (תואם למפרט סעיף 3.3)
    const distanceOpacity = 1 / (1 + wave.radius * WAVE_CONFIG.distanceOpacityFalloff)
    const opacity = wave.intensity * WAVE_CONFIG.opacityBase * distanceOpacity
    materialRef.current.opacity = Math.max(0, Math.min(1, opacity))
    
    // Bloom Effect - גודל חלקיקים גדול יותר בעוצמות גבוהות
    const size = 0.1 + wave.intensity * 0.2
    materialRef.current.size = size
  })

  return (
    <points
      ref={particlesRef}
      position={wave.origin}
      geometry={geometry}
    >
      <pointsMaterial
        ref={materialRef}
        size={0.1 + wave.intensity * 0.2}
        transparent
        opacity={wave.intensity * WAVE_CONFIG.opacityBase}
        vertexColors={true}
        toneMapped={false}
      />
    </points>
  )
}

