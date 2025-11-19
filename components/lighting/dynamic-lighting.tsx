"use client"

import { SoftShadows } from "@react-three/drei"
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
    // Day mode (darkness=0): ambient=6.0, directional=12.0, spot=7.0
    // Night mode (darkness=1): ambient=0, directional=0, spot=0
    ambientIntensity = { min: 0.0, max: 6.0 },
    directionalIntensity = { min: 0.0, max: 12.0 },
    spotIntensity = { min: 0.0, max: 7.0 },
  } = config

  // Soft shadows applied via SoftShadows component
  // Exponential curve for dramatic darkening
  const darknessCurve = Math.pow(darkness, 6)

  // Calculate intensities based on darkness curve
  const ambient = ambientIntensity.min + (ambientIntensity.max - ambientIntensity.min) * (1 - darknessCurve)
  const directional = directionalIntensity.min + (directionalIntensity.max - directionalIntensity.min) * (1 - darknessCurve)
  const directional2 = ambientIntensity.min + (ambientIntensity.max * 0.5 - ambientIntensity.min) * (1 - darknessCurve)
  const spot = spotIntensity.min + (spotIntensity.max - spotIntensity.min) * (1 - darknessCurve)
  // Reduce rim contribution for darker night
  const rim = ambientIntensity.min + (ambientIntensity.max * 0.2 - ambientIntensity.min) * (1 - darknessCurve)

  return (
    <>
      <SoftShadows size={1024} samples={8} />
      <ambientLight intensity={ambient} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={directional}
        castShadow
        shadow-mapSize={1024}
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
        shadow-mapSize={1024}
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
