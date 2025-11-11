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

  // Modern Minimalist (id: 1) - Clean modern table lamp
  if (lamp.id === "1") {
    return (
      <group position={position}>
        {/* Display pedestal */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.6]} />
          <meshStandardMaterial color="#d4c5b0" roughness={0.2} metalness={0.3} />
        </mesh>

        <group
          ref={meshRef}
          position={[0, 0.6, 0]}
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
          {/* Circular base - dark metal */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.08, 32]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Thin vertical pole - dark metal */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.0, 16]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Shade - modern cylindrical design, white translucent */}
          <group position={[0, 1.2, 0]}>
            {/* Outer shade - white matte */}
            <mesh>
              <cylinderGeometry args={[0.45, 0.45, 0.6, 32]} />
              <meshStandardMaterial 
                color="#ffffff" 
                roughness={0.6} 
                metalness={0.1}
                transparent
                opacity={0.9}
              />
            </mesh>

            {/* Inner glow layer */}
            <mesh>
              <cylinderGeometry args={[0.43, 0.43, 0.58, 32]} />
              <meshStandardMaterial 
                color="#fffacd" 
                emissive="#fff9c4" 
                emissiveIntensity={1.5}
                transparent
                opacity={0.7}
              />
            </mesh>

            {/* Top cap - dark metal */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.47, 0.47, 0.05, 32]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
            </mesh>
          </group>

          {/* Warm light from inside */}
          <pointLight position={[0, 1.2, 0]} intensity={50} distance={10} color="#fff5e1" />
          <pointLight position={[0, 1.0, 0]} intensity={25} distance={12} color="#fffacd" />

          {/* Soft glow around lamp */}
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.7, 16, 16]} />
            <meshBasicMaterial color="#fffacd" transparent opacity={0.15} />
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

  // Modern Arc (id: 2) - Modern LED ring table lamp
  if (lamp.id === "2") {
    return (
      <group position={position}>
        {/* Display pedestal - wooden */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.6]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Wood grain texture on pedestal */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.82, 0.82, 0.6, 32]} />
          <meshStandardMaterial 
            color="#654321" 
            roughness={0.9} 
            metalness={0.05}
            transparent
            opacity={0.3}
          />
        </mesh>

        <group
          ref={meshRef}
          position={[0, 0.6, 0]}
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
          {/* Rectangular base - wooden, sitting on cylindrical base */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.6, 0.15, 0.4]} />
            <meshStandardMaterial 
              color="#8B4513" 
              roughness={0.8} 
              metalness={0.1}
            />
          </mesh>

          {/* Wood grain texture on base */}
          <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.55, 0.01, 0.35]} />
            <meshStandardMaterial 
              color="#654321" 
              roughness={0.9} 
              metalness={0.05}
            />
          </mesh>

          {/* Small square connection block between base and ring - wooden */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.12, 0.3, 0.12]} />
            <meshStandardMaterial 
              color="#8B4513" 
              roughness={0.7} 
              metalness={0.1}
            />
          </mesh>

          {/* Large vertical circular ring - facing the viewer, sitting on base */}
          <group position={[0, 0.9, 0]} rotation={[0, 0, 0]}>
            {/* Outer metallic frame - brushed bronze/dark gold, perfect circle */}
            <mesh>
              <torusGeometry args={[0.9, 0.08, 64, 128]} />
              <meshStandardMaterial 
                color="#8B6914" 
                roughness={0.4} 
                metalness={0.8}
              />
            </mesh>

            {/* Inner LED strip - glowing halo effect, perfect circle */}
            <mesh>
              <torusGeometry args={[0.9, 0.04, 64, 128]} />
              <meshStandardMaterial 
                color="#fffacd" 
                emissive="#fff9c4" 
                emissiveIntensity={3.0}
                transparent
                opacity={0.95}
              />
            </mesh>

            {/* Additional inner glow layer for brighter effect, perfect circle */}
            <mesh>
              <torusGeometry args={[0.9, 0.06, 64, 128]} />
              <meshStandardMaterial 
                color="#ffffff" 
                emissive="#fffacd" 
                emissiveIntensity={2.0}
                transparent
                opacity={0.4}
              />
            </mesh>
          </group>

          {/* Warm LED light from the ring - multiple point lights around the ring */}
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map((angle, i) => {
            const radius = 0.9
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            return (
              <pointLight 
                key={i}
                position={[x, 0.9, z]} 
                intensity={35} 
                distance={12} 
                color="#fff5e1" 
              />
            )
          })}
          
          {/* Additional ambient glow from ring */}
          <pointLight position={[0, 0.9, 0]} intensity={25} distance={15} color="#fffacd" />
        </group>

        {/* Price tag */}
        <mesh position={[1.2, 0.8, 0]} rotation={[0, -Math.PI / 4, 0]}>
          <planeGeometry args={[0.6, 0.3]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    )
  }

  // Default fallback
  return (
    <group position={position}>
      {/* Display pedestal */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.6]} />
        <meshStandardMaterial color="#d4c5b0" roughness={0.2} metalness={0.3} />
      </mesh>

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
