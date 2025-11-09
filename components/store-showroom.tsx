"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text } from "@react-three/drei"
import { StoreFurniture } from "./store-furniture"
import { LampDisplay } from "./lamp-display"
import type { Lamp } from "./store-scene"

type StoreShowroomProps = {
  onSelectLamp: (lamp: Lamp | null) => void
}

const DISPLAY_LAMPS: Array<{ lamp: Lamp; position: [number, number, number] }> = [
  {
    lamp: {
      id: "1",
      name: "Crystal Elegance",
      price: 2850,
      description: "Handcrafted crystal table lamp with brass accents",
      type: "Table Lamp",
      colors: ["#c0c0c0", "#ffd700", "#ffffff"],
      features: ["Hand-blown crystal", "Dimmable LED", "Brass base", "Premium fabric shade"],
    },
    position: [-6, -0.5, 8],
  },
  {
    lamp: {
      id: "2",
      name: "Modern Arc",
      price: 1950,
      description: "Contemporary arc floor lamp with marble base",
      type: "Floor Lamp",
      colors: ["#2a2a2a", "#b8860b", "#ffffff"],
      features: ["Adjustable height", "Marble base", "Energy efficient", "360° rotation"],
    },
    position: [6, -0.5, 8],
  },
]

export function StoreShowroom({ onSelectLamp }: StoreShowroomProps) {
  return (
    <Canvas camera={{ position: [0, 8, 20], fov: 50 }} style={{ background: "#1a1f24" }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={0.5} castShadow />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#4a3728" roughness={0.8} />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -10]}>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#2a3439" roughness={0.9} />
      </mesh>

      {/* Side Walls */}
      <mesh position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#2a3439" roughness={0.9} />
      </mesh>
      <mesh position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#2a3439" roughness={0.9} />
      </mesh>

      <Text position={[0, 8, -9.9]} fontSize={1.5} color="#d4af37" anchorX="center" anchorY="middle">
        LUMIÈRE
      </Text>
      <Text position={[0, 6.8, -9.9]} fontSize={0.4} color="#c0c0c0" anchorX="center" anchorY="middle">
        Luxury Lighting Collection
      </Text>

      <StoreFurniture />

      {DISPLAY_LAMPS.map(({ lamp, position }) => (
        <LampDisplay key={lamp.id} lamp={lamp} position={position} onClick={() => onSelectLamp(lamp)} />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={35}
        maxPolarAngle={Math.PI / 2}
      />

      <Environment preset="city" />
    </Canvas>
  )
}
