"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface ListenerCharacterProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * ListenerCharacter - דמות יושבת על הספה שמאזינה למוזיקה
 * הגלים נעים מהרמקולים לכיוון הדמות
 */
export function ListenerCharacter({ 
  position = [0, 1.2, 0], 
  rotation = [0, 0, 0] 
}: ListenerCharacterProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  // אנימציה עדינה של הראש
  useFrame((state) => {
    if (groupRef.current) {
      // תנועה עדינה של הראש לפי המוזיקה
      const time = state.clock.elapsedTime
      groupRef.current.children.forEach((child, index) => {
        if (index === 0) { // הראש
          child.rotation.x = Math.sin(time * 0.5) * 0.05
          child.rotation.y = Math.sin(time * 0.3) * 0.1
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* ראש - כדור פשוט */}
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color="#fdbcb4" 
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* גוף - גליל */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.5, 16]} />
        <meshStandardMaterial 
          color="#4a5568" 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* ידיים - פשוטות */}
      <mesh position={[-0.3, 0.1, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial 
          color="#fdbcb4" 
          roughness={0.7}
        />
      </mesh>
      <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial 
          color="#fdbcb4" 
          roughness={0.7}
        />
      </mesh>

      {/* רגליים - פשוטות */}
      <mesh position={[-0.15, -0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial 
          color="#2d3748" 
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0.15, -0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial 
          color="#2d3748" 
          roughness={0.8}
        />
      </mesh>
    </group>
  )
}

