"use client"

import { useMemo } from "react"
import type { Color } from "three"

export type LampLightConfig = {
  position: [number, number, number]
  intensity: number
  distance: number
  color: string | Color
}

export type LampLightingResult = {
  lights: LampLightConfig[]
  glowIntensity: number
  emissiveIntensity: number
}

/**
 * Custom hook for calculating lamp lighting properties
 * @param baseIntensity - Base light intensity (default: 50)
 * @param darkness - Darkness level (0-1) affecting light intensity
 * @returns Lamp lighting configuration
 */
export function useLampLighting(
  baseIntensity: number = 50,
  darkness: number = 0
): LampLightingResult {
  // Calculate light intensity based on darkness
  // When dark, lamps should be brighter to compensate
  const intensityMultiplier = 1 + darkness * 0.5 // Up to 50% brighter when dark
  
  const lights = useMemo<LampLightConfig[]>(() => [
    {
      position: [0, 1.2, 0],
      intensity: baseIntensity * intensityMultiplier,
      distance: 10,
      color: "#fff5e1",
    },
  ], [baseIntensity, intensityMultiplier])

  // Glow and emissive intensities also increase with darkness
  const glowIntensity = useMemo(() => 0.15 + darkness * 0.1, [darkness])
  const emissiveIntensity = useMemo(() => 1.5 + darkness * 0.5, [darkness])

  return {
    lights,
    glowIntensity,
    emissiveIntensity,
  }
}

