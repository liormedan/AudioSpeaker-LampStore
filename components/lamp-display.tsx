"use client"

import { useRef } from "react"
import type { Mesh } from "three"
import type { Lamp } from "./store-scene"

type LampDisplayProps = {
  lamp: Lamp
  position: [number, number, number]
  onClick: () => void
}

export function LampDisplay({ lamp, position, onClick }: LampDisplayProps) {
  const meshRef = useRef<Mesh>(null)

  return (
    <group position={position}>
      {/* Display pedestal */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.6]} />
        <meshStandardMaterial color="#d4c5b0" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Lamp model - simple placeholder for now */}
      <group
        ref={meshRef}
        position={[0, 1.2, 0]}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default"
        }}
      >
        {/* Base */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.4, 0.4]} />
          <meshStandardMaterial color={lamp.colors[0]} metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Pole */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.2]} />
          <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Shade */}
        <mesh position={[0, 1.6, 0]}>
          <coneGeometry args={[0.5, 0.7, 32]} />
          <meshStandardMaterial color={lamp.colors[0]} transparent opacity={0.8} />
        </mesh>

        {/* Light */}
        <pointLight position={[0, 1.4, 0]} intensity={50} distance={8} color="#fff5e1" />

        {/* Hover glow */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial color="#ffeb3b" transparent opacity={0.05} />
        </mesh>
      </group>

      {/* Price tag */}
      <mesh position={[1.2, 0.8, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <planeGeometry args={[0.6, 0.3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}
