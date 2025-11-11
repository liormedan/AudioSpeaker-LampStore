"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text } from "@react-three/drei"
import { EffectComposer, Bloom, SSAO, ToneMapping } from "@react-three/postprocessing"
import { StoreFurniture } from "./store-furniture"
import { LampDisplay } from "./lamp-display"
import { DimmerControl } from "./dimmer-control"
import type { Lamp } from "./store-scene"
import type { DirectionalLight } from "three"
import { Color } from "three"

type StoreShowroomProps = {
  onSelectLamp: (lamp: Lamp | null) => void
}

const DISPLAY_LAMPS: Array<{ lamp: Lamp; position: [number, number, number] }> = [
  {
    lamp: {
      id: "1",
      name: "Modern Minimalist",
      price: 1890,
      description: "Clean and elegant table lamp with cylindrical shade and dark metal base",
      type: "Table Lamp",
      colors: ["#ffffff", "#1a1a1a", "#2a2a2a"],
      features: ["Minimalist design", "Metal construction", "Warm LED lighting", "Modern aesthetic"],
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

// Black color for SSAO
const blackColor = new Color(0, 0, 0)

// Lighting component that responds to darkness level
function DynamicLighting({ darkness }: { darkness: number }) {
  // Interpolate between bright and dark with very dramatic range
  // darkness: 0 = bright (normal), 1 = dark (almost no ambient)
  // Using exponential curve for more dramatic effect
  const darknessCurve = Math.pow(darkness, 1.8) // More pronounced curve
  
  // Very dark base lighting when dark - almost completely off
  // This allows ceiling light to be the main light source
  const ambientIntensity = 0.005 + (0.3 - 0.005) * (1 - darknessCurve)
  const directionalIntensity = 0.01 + (0.8 - 0.01) * (1 - darknessCurve)
  const directional2Intensity = 0.005 + (0.3 - 0.005) * (1 - darknessCurve)
  const spotIntensity = 0.005 + (0.4 - 0.005) * (1 - darknessCurve)
  const rimIntensity = 0.005 + (0.2 - 0.005) * (1 - darknessCurve)

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={directionalIntensity} 
        castShadow
      />
      <directionalLight position={[-5, 8, -5]} intensity={directional2Intensity} />
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.4} 
        penumbra={1} 
        intensity={spotIntensity} 
        castShadow
        shadow-mapSize={1024}
      />
      {/* Additional rim light for depth */}
      <pointLight position={[-10, 5, 10]} intensity={rimIntensity} color="#fff5e1" />
    </>
  )
}

export function StoreShowroom({ onSelectLamp }: StoreShowroomProps) {
  const [darkness, setDarkness] = useState(0.2) // Start at 20% darkness (mostly bright, slight dim)

  // Calculate background color based on darkness - much darker base
  // darkness: 0 = brighter, 1 = very dark
  const bgBrightness = Math.round(10 + (40 - 10) * (1 - darkness))
  const backgroundColor = `rgb(${bgBrightness}, ${bgBrightness + 3}, ${bgBrightness + 5})`

  return (
    <>
      <DimmerControl darkness={darkness} onDarknessChange={setDarkness} />
      <Canvas camera={{ position: [0, 8, 20], fov: 50 }} style={{ background: backgroundColor }}>
        {/* Dynamic lighting that responds to darkness level */}
        <DynamicLighting darkness={darkness} />

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

      <StoreFurniture onSelectLamp={onSelectLamp} />

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

      {/* Environment controlled by dimmer - dims as darkness increases */}
      <Environment 
        preset="city" 
        environmentIntensity={1 - darkness * 0.9}
      />

      {/* Post-processing effects for realistic rendering */}
      <EffectComposer enableNormalPass={true}>
        <SSAO
          samples={31}
          radius={0.1}
          intensity={30}
          luminanceInfluence={0.6}
          color={blackColor}
        />
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
      </Canvas>
    </>
  )
}
