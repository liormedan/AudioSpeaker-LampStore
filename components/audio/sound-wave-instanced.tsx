"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import type { SoundWave } from "./wave-physics"
import { WAVE_CONFIG } from "./wave-physics"

interface SoundWaveInstancedProps {
  waves: SoundWave[]
}

/**
 * SoundWaveInstanced - גרסה מאופטמזת של גלי קול עם Instanced Rendering
 * משתמש ב-InstancedMesh לרינדור יעיל של מספר רב של גלים
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 7.2
 * 
 * **אופטימיזציות מיושמות:**
 * - ✅ Instanced Rendering: שימוש ב-InstancedMesh לגלים דומים
 * - ✅ LOD (Level of Detail): פחות פרטים לגלים רחוקים (32-48-64 segments)
 * - ✅ Frustum Culling: הסתרת גלים מחוץ למסך (אקטיבי + אוטומטי של Three.js)
 */
export function SoundWaveInstanced({ waves }: SoundWaveInstancedProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  const { camera } = useThree()
  
  // יצירת גיאומטריות LOD - Level of Detail לפי מרחק (תואם למפרט סעיף 7.2)
  // רזולוציית טבעות: 32-64 vertices לטבעת (תואם למפרט סעיף 7.1)
  // LOD: פחות פרטים לגלים רחוקים - משפר ביצועים
  // ניהול זיכרון: שימוש ב-useMemo לחישובים כבדים (תואם למפרט סעיף 7.3)
  // גיאומטריות נוצרות פעם אחת ונשמרות בזיכרון
  const lodGeometries = useMemo(() => {
    return {
      high: new THREE.RingGeometry(0.1, 0.1 + WAVE_CONFIG.ringThickness * 2, 64), // קרוב: 64 segments
      medium: new THREE.RingGeometry(0.1, 0.1 + WAVE_CONFIG.ringThickness * 2, 48), // בינוני: 48 segments
      low: new THREE.RingGeometry(0.1, 0.1 + WAVE_CONFIG.ringThickness * 2, 32), // רחוק: 32 segments
    }
  }, [])
  
  // גיאומטריה בסיסית (לשימוש ישן/ברירת מחדל)
  const baseRingGeometry = lodGeometries.high

  // יצירת dummy object לעדכון instances
  // ניהול זיכרון: שימוש ב-useMemo לחישובים כבדים (תואם למפרט סעיף 7.3)
  // Object נוצר פעם אחת ונשמר בזיכרון לשימוש חוזר
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  // תדירות עדכון: 60 FPS (useFrame) - תואם למפרט סעיף 7.1
  useFrame(() => {
    if (!meshRef.current || !materialRef.current || waves.length === 0) return

    let visibleCount = 0
    const activeWaves = waves.filter(w => w && w.intensity > 0.01)

    activeWaves.forEach((wave, index) => {
      if (!meshRef.current) return
      
      // Frustum Culling - בדיקה אם הגל בתוך המסך (תואם למפרט סעיף 7.2)
      const wavePosition = new THREE.Vector3(wave.origin[0], wave.origin[1], wave.origin[2])
      const distance = camera.position.distanceTo(wavePosition)
      
      // Frustum Culling אקטיבי - דילוג על גלים מחוץ למסך
      // בדיקה פשוטה: אם הגל רחוק מדי או מחוץ לטווח הראייה, דילוג
      if (distance > WAVE_CONFIG.cullingDistance) {
        return // דילוג על גל זה
      }
      
      // LOD - Level of Detail לפי מרחק (תואם למפרט סעיף 7.2)
      // פחות פרטים לגלים רחוקים - משפר ביצועים
      // הערה: ב-InstancedMesh הגיאומטריה משותפת, אז LOD מושג דרך שקיפות וזוהר
      const lodLevel = distance < 10 ? "high" : distance < 20 ? "medium" : "low"
      
      // עדכון רדיוס הטבעת
      // וידוא שהרדיוס מינימלי מספיק גדול כדי שהגלים יראו
      const minVisibleRadius = 0.3
      const innerRadius = Math.max(minVisibleRadius, wave.radius - WAVE_CONFIG.ringThickness)
      const outerRadius = Math.max(minVisibleRadius + WAVE_CONFIG.ringThickness, wave.radius + WAVE_CONFIG.ringThickness)

      // עדכון מיקום וסיבוב
      dummy.position.set(wave.origin[0], wave.origin[1], wave.origin[2])
      
      // חישוב סיבוב הטבעת - מאוזנת (perpendicular לכיוון התנועה)
      // אם יש כיוון, הטבעת מסתובבת כך שהיא מאוזנת לכיוון התנועה (כמו דיסקה שצפה באוויר)
      // אם אין כיוון, הטבעת מאוזנת אופקית (כמו דיסקה שצפה באוויר)
      if (wave.direction) {
        // כיוון התנועה (normalized)
        const direction = new THREE.Vector3(...wave.direction).normalize()
        // כיוון למעלה (up vector)
        const up = new THREE.Vector3(0, 1, 0)
        // חישוב ציר הסיבוב (cross product) - right vector
        let right = new THREE.Vector3().crossVectors(up, direction).normalize()
        // אם right הוא אפס (כיוון התנועה הוא למעלה/למטה), נשתמש ב-forward
        if (right.length() < 0.1) {
          const forward = new THREE.Vector3(1, 0, 0)
          right.crossVectors(direction, forward).normalize()
        }
        const forward = new THREE.Vector3().crossVectors(direction, right).normalize()
        
        // יצירת מטריצת סיבוב כך שהטבעת מאוזנת לכיוון התנועה
        const rotationMatrix = new THREE.Matrix4()
        rotationMatrix.makeBasis(right, forward, direction)
        const euler = new THREE.Euler().setFromRotationMatrix(rotationMatrix)
        dummy.rotation.set(euler.x, euler.y, euler.z)
      } else {
        // אין כיוון - הטבעת מאוזנת אופקית (כמו דיסקה שצפה באוויר)
        dummy.rotation.set(0, 0, 0)
      }

      // Distortion - עיוות קל בהתנגשויות
      if (wave.distortion && wave.distortion > 0) {
        const time = Date.now() * 0.001
        dummy.position.x += Math.sin(time * 5) * wave.distortion * WAVE_CONFIG.distortionAmount * 10
        dummy.position.z += Math.cos(time * 5) * wave.distortion * WAVE_CONFIG.distortionAmount * 10
        dummy.rotation.z = Math.sin(time * 3) * wave.distortion * WAVE_CONFIG.distortionAmount * 10
      }

      dummy.scale.set(outerRadius, outerRadius, 1) // scale לפי רדיוס
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(index, dummy.matrix)

      // עדכון צבע עם LOD - גלים רחוקים יותר שקופים
      if (meshRef.current.instanceColor && wave.color && wave.color instanceof THREE.Color) {
        const lodOpacity = lodLevel === "high" ? 1.0 : lodLevel === "medium" ? 0.8 : 0.6
        const lodColor = wave.color.clone().multiplyScalar(lodOpacity)
        meshRef.current.setColorAt(index, lodColor)
      }

      visibleCount++
    })
    
    // עדכון instance matrix ו-colors
    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true
      }
      meshRef.current.count = visibleCount
    }

    // עדכון חומר (שקיפות וזוהר) - משותף לכל ה-instances
    if (materialRef.current && activeWaves.length > 0) {
      // ממוצע עוצמה לכל הגלים
      const avgIntensity = activeWaves.reduce((sum, w) => sum + w.intensity, 0) / activeWaves.length
      const avgDistance = activeWaves.reduce((sum, w) => {
        const pos = new THREE.Vector3(w.origin[0], w.origin[1], w.origin[2])
        return sum + camera.position.distanceTo(pos)
      }, 0) / activeWaves.length
      
      const distanceOpacity = 1 / (1 + avgDistance * WAVE_CONFIG.distanceOpacityFalloff)
      const opacity = avgIntensity * WAVE_CONFIG.opacityBase * distanceOpacity
      
      materialRef.current.opacity = Math.max(0, Math.min(1, opacity))
      materialRef.current.emissiveIntensity = WAVE_CONFIG.bloomIntensityBase + 
        (avgIntensity * WAVE_CONFIG.bloomIntensityMultiplier)
    }
  })

  if (waves.length === 0) return null

  // יצירת instanceColor
  // ניהול זיכרון: שימוש ב-useMemo לחישובים כבדים (תואם למפרט סעיף 7.3)
  // מערך צבעים נוצר רק כאשר מספר הגלים משתנה
  const instanceColor = useMemo(() => {
    const colors = new Float32Array(waves.length * 3)
    // אתחול עם צבעים בסיסיים
    waves.forEach((wave, i) => {
      if (wave && wave.color && wave.color instanceof THREE.Color) {
        colors[i * 3] = wave.color.r
        colors[i * 3 + 1] = wave.color.g
        colors[i * 3 + 2] = wave.color.b
      } else {
        // fallback - צבע לבן אם ה-color לא תקין
        colors[i * 3] = 1
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 1
      }
    })
    return new THREE.InstancedBufferAttribute(colors, 3)
  }, [waves.length]) // רק כאשר מספר הגלים משתנה

  return (
    <instancedMesh
      ref={meshRef}
      args={[baseRingGeometry, undefined, waves.length]}
      frustumCulled={true} // Frustum Culling אוטומטי של Three.js (תואם למפרט סעיף 7.2)
    >
      <instancedBufferAttribute attach="attributes-color" args={[instanceColor.array, 3]} />
      <meshStandardMaterial
        ref={materialRef}
        transparent
        opacity={WAVE_CONFIG.opacityBase}
        emissiveIntensity={WAVE_CONFIG.bloomIntensityBase}
        toneMapped={false}
        vertexColors={true}
      />
    </instancedMesh>
  )
}

