"use client"

import { useOptimizedShadows } from "./optimized-shadows"
import { RectAreaLightComponent } from "./rect-area-light"
import type { ReactNode } from "react"

export type LightingConfig = {
  darkness: number
  ambientIntensity?: {
    min: number
    max: number
  }
  directionalIntensity?: {
    min: number
    max: number
  }
  spotIntensity?: {
    min: number
    max: number
  }
}

type DynamicLightingProps = {
  config: LightingConfig
}

/**
 * Dynamic lighting component that responds to darkness level
 * Calculates light intensities based on darkness curve (0 = bright, 1 = dark)
 */
export function DynamicLighting({ config }: DynamicLightingProps) {
  const {
    darkness,
    ambientIntensity = { min: 0.005, max: 0.3 },
    directionalIntensity = { min: 0.01, max: 0.8 },
    spotIntensity = { min: 0.005, max: 0.4 },
  } = config

  // Optimize shadow maps based on performance
  useOptimizedShadows({ quality: "high" })

  // Interpolate between bright and dark with exponential curve for dramatic effect
  const darknessCurve = Math.pow(darkness, 1.8)
  
  // Calculate intensities based on darkness curve
  const ambient = ambientIntensity.min + (ambientIntensity.max - ambientIntensity.min) * (1 - darknessCurve)
  const directional = directionalIntensity.min + (directionalIntensity.max - directionalIntensity.min) * (1 - darknessCurve)
  const directional2 = ambientIntensity.min + (0.3 - ambientIntensity.min) * (1 - darknessCurve)
  const spot = spotIntensity.min + (spotIntensity.max - spotIntensity.min) * (1 - darknessCurve)
  const rim = ambientIntensity.min + (0.2 - ambientIntensity.min) * (1 - darknessCurve)

  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={directional} 
        castShadow
        shadow-mapSize={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-5, 8, -5]} intensity={directional2} />
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.4} 
        penumbra={1} 
        intensity={spot} 
        castShadow
        shadow-mapSize={2048}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />
      {/* Additional rim light for depth - optimized: RectAreaLight */}
      <RectAreaLightComponent
        position={[-10, 5, 10]}
        width={2}
        height={2}
        intensity={rim * 2}
        color="#fff5e1"
        rotation={[0, Math.PI / 4, 0]}
      />
    </>
  )
}

