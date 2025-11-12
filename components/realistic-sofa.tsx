"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Mesh } from "three"
import * as THREE from "three"

type RealisticSofaProps = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  onHover?: (hovered: boolean) => void
}

// Helper function to create rounded box geometry
function createRoundedBoxGeometry(width: number, height: number, depth: number, radius: number = 0.1) {
  const shape = new THREE.Shape()
  const w = width / 2
  const h = height / 2
  shape.moveTo(-w + radius, -h)
  shape.lineTo(w - radius, -h)
  shape.quadraticCurveTo(w, -h, w, -h + radius)
  shape.lineTo(w, h - radius)
  shape.quadraticCurveTo(w, h, w - radius, h)
  shape.lineTo(-w + radius, h)
  shape.quadraticCurveTo(-w, h, -w, h - radius)
  shape.lineTo(-w, -h + radius)
  shape.quadraticCurveTo(-w, -h, -w + radius, -h)
  
  const extrudeSettings = {
    depth: depth - radius * 2,
    bevelEnabled: true,
    bevelThickness: radius,
    bevelSize: radius,
    bevelSegments: 8,
  }
  
  return new THREE.ExtrudeGeometry(shape, extrudeSettings)
}

// Cushion component with bounce animation
function Cushion({ 
  position, 
  size, 
  color, 
  isHovered, 
  onClick 
}: { 
  position: [number, number, number]
  size: [number, number, number]
  color: string
  isHovered: boolean
  onClick?: () => void
}) {
  const meshRef = useRef<Mesh>(null)
  const [pressed, setPressed] = useState(false)
  const scaleRef = useRef(1)
  const yOffsetRef = useRef(0)
  const bounceTimeRef = useRef(0)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Bounce animation when pressed
      if (pressed) {
        bounceTimeRef.current += delta * 10
        const bounce = Math.sin(bounceTimeRef.current) * 0.05
        scaleRef.current = 0.95 + bounce
        yOffsetRef.current = -0.05 + bounce * 0.1
      } else {
        // Smooth return to normal
        scaleRef.current += (1 - scaleRef.current) * 0.1
        yOffsetRef.current *= 0.9
        
        // Hover scale - very subtle
        if (isHovered) {
          scaleRef.current = Math.min(scaleRef.current + 0.005, 1.02)
        }
      }
      
      meshRef.current.scale.setScalar(scaleRef.current)
      meshRef.current.position.y = position[1] + yOffsetRef.current
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
      onClick={() => {
        setPressed(true)
        bounceTimeRef.current = 0
        setTimeout(() => setPressed(false), 300)
        onClick?.()
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default"
      }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        metalness={0.05}
      />
    </mesh>
  )
}

export function RealisticSofa({
  position = [0, -0.5, 0],
  rotation = [0, 0, 0],
  color = "#5a7b8f",
  onHover,
}: RealisticSofaProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const [selectedCushion, setSelectedCushion] = useState<number | null>(null)

  // Create texture variations for fabric
  const fabricColor = new THREE.Color(color)
  const darkerColor = fabricColor.clone().multiplyScalar(0.8)
  const lighterColor = fabricColor.clone().multiplyScalar(1.2)

  // Subtle scale on hover - no rotation
  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle scale effect on hover
      if (hovered) {
        groupRef.current.scale.setScalar(1.01)
      } else {
        groupRef.current.scale.setScalar(1)
      }
    }
  })

  const handleHover = (isHovering: boolean) => {
    setHovered(isHovering)
    onHover?.(isHovering)
  }

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, 0, 0]}
      onPointerOver={() => handleHover(true)}
      onPointerOut={() => handleHover(false)}
    >
      {/* Sofa Base - with rounded edges */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[10.5, 1.2, 3.2]} />
        <meshStandardMaterial
          color={darkerColor.getHex()}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Sofa Frame - wooden structure */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[10.5, 0.15, 3.2]} />
        <meshStandardMaterial
          color="#2a1a0a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Back cushions - perfectly aligned in straight line, no gaps */}
      {[-3.5, 0, 3.5].map((x, i) => (
        <group key={`back-${i}`} position={[x, 1.8, -0.95]} rotation={[0, 0, 0]}>
          <Cushion
            position={[0, 0, 0]}
            size={[3.5, 2.4, 0.65]}
            color={selectedCushion === i ? `#${lighterColor.getHexString()}` : "#4a6b7f"}
            isHovered={hovered && selectedCushion === i}
            onClick={() => setSelectedCushion(selectedCushion === i ? null : i)}
          />
        </group>
      ))}

      {/* Seat cushions - perfectly aligned in straight line, no gaps */}
      {[-3.5, 0, 3.5].map((x, i) => (
        <group key={`seat-${i}`} position={[x, 0.9, 0.25]} rotation={[0, 0, 0]}>
          <Cushion
            position={[0, 0, 0]}
            size={[3.5, 0.65, 2.5]}
            color={selectedCushion === i + 3 ? `#${lighterColor.getHexString()}` : "#638ca1"}
            isHovered={hovered && selectedCushion === i + 3}
            onClick={() => setSelectedCushion(selectedCushion === i + 3 ? null : i + 3)}
          />
        </group>
      ))}

      {/* Armrests - integrated with base */}
      <mesh position={[-5.25, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 1.8, 3.2]} />
        <meshStandardMaterial
          color={hovered ? `#${lighterColor.getHexString()}` : "#4a6b7f"}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[5.25, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 1.8, 3.2]} />
        <meshStandardMaterial
          color={hovered ? `#${lighterColor.getHexString()}` : "#4a6b7f"}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Decorative seams/stitching - subtle, between cushions */}
      {[-1.75, 1.75].map((x, i) => (
        <group key={`seam-${i}`} position={[x, 0.9, 0.25]}>
          {/* Vertical seam - very subtle divider between cushions */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.02, 0.65, 2.5]} />
            <meshStandardMaterial color="#3a4a5a" roughness={0.95} />
          </mesh>
        </group>
      ))}
      {[-1.75, 1.75].map((x, i) => (
        <group key={`back-seam-${i}`} position={[x, 1.8, -0.95]}>
          {/* Vertical seam on back cushions */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.02, 2.4, 0.65]} />
            <meshStandardMaterial color="#3a4a5a" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Hover glow effect */}
      {hovered && (
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[11, 3, 4]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  )
}

