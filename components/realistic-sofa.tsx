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
        
        // Hover scale
        if (isHovered) {
          scaleRef.current = Math.min(scaleRef.current + 0.01, 1.05)
        }
        
        // Subtle floating animation
        meshRef.current.rotation.y += 0.0005
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
        roughness={0.6}
        metalness={0.1}
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

  // Animated rotation on hover
  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
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
      rotation={rotation}
      onPointerOver={() => handleHover(true)}
      onPointerOut={() => handleHover(false)}
    >
      {/* Sofa Base - with rounded edges */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[16.5, 1.2, 3]} />
        <meshStandardMaterial
          color={darkerColor.getHex()}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Sofa Frame - wooden structure */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[16.5, 0.2, 3]} />
        <meshStandardMaterial
          color="#3a2a1a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Back cushions - with individual animation */}
      {[-4.5, 0, 4.5].map((x, i) => (
        <Cushion
          key={`back-${i}`}
          position={[x, 1.8, -0.9]}
          size={[4.8, 2.4, 0.6]}
          color={selectedCushion === i ? lighterColor.getHex() : "#4a6b7f"}
          isHovered={hovered && selectedCushion === i}
          onClick={() => setSelectedCushion(selectedCushion === i ? null : i)}
        />
      ))}

      {/* Seat cushions - with bounce effect */}
      {[-4.5, 0, 4.5].map((x, i) => (
        <Cushion
          key={`seat-${i}`}
          position={[x, 0.9, 0.3]}
          size={[4.8, 0.6, 2.4]}
          color={selectedCushion === i + 3 ? lighterColor.getHex() : "#638ca1"}
          isHovered={hovered && selectedCushion === i + 3}
          onClick={() => setSelectedCushion(selectedCushion === i + 3 ? null : i + 3)}
        />
      ))}

      {/* Armrests - with rounded top */}
      <mesh position={[-8.25, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 1.8, 3]} />
        <meshStandardMaterial
          color={hovered ? lighterColor.getHex() : "#4a6b7f"}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[8.25, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 1.8, 3]} />
        <meshStandardMaterial
          color={hovered ? lighterColor.getHex() : "#4a6b7f"}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Decorative seams/stitching */}
      {[-4.5, 0, 4.5].map((x, i) => (
        <group key={`seam-${i}`} position={[x, 0.9, 0.3]}>
          {/* Vertical seam */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.02, 0.6, 2.4]} />
            <meshStandardMaterial color="#2a3a4a" roughness={0.9} />
          </mesh>
          {/* Horizontal seam */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[4.8, 0.02, 2.4]} />
            <meshStandardMaterial color="#2a3a4a" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Hover glow effect */}
      {hovered && (
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[17, 3, 4]} />
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

