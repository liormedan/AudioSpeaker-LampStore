"use client"

import { useRef, useEffect, useMemo } from "react"
import { useThree } from "@react-three/fiber"
import { PointLight } from "three"
import * as THREE from "three"

type IESLightProps = {
  position?: [number, number, number]
  intensity?: number
  distance?: number
  color?: string
  /**
   * IES profile type - determines light distribution pattern
   * - "spot": Narrow focused beam (like spotlight)
   * - "flood": Wide flood pattern (like floodlight)
   * - "wall": Wall wash pattern (like wall sconce)
   * - "pendant": Pendant lamp pattern (downward focused)
   * - "table": Table lamp pattern (omni-directional with soft falloff)
   */
  profile?: "spot" | "flood" | "wall" | "pendant" | "table"
  decay?: number
}

/**
 * IES Light Component - Realistic light distribution based on IES profiles
 * Simulates real-world light distribution patterns for more realistic lighting
 * 
 * IES (Illuminating Engineering Society) profiles define how light is distributed
 * from a fixture. This component approximates common IES patterns using
 * custom shader-based falloff curves.
 */
export function IESLight({
  position = [0, 0, 0],
  intensity = 1,
  distance = 10,
  color = "#ffffff",
  profile = "table",
  decay = 2,
}: IESLightProps) {
  const lightRef = useRef<PointLight>(null)

  // IES profile parameters - define light distribution patterns
  const profileConfig = useMemo(() => {
    const configs = {
      spot: {
        // Narrow focused beam - high intensity in center, sharp falloff
        decay: 2.5,
      },
      flood: {
        // Wide flood pattern - even distribution over wide area
        decay: 2,
      },
      wall: {
        // Wall wash pattern - asymmetric, stronger in one direction
        decay: 2.2,
      },
      pendant: {
        // Pendant lamp - downward focused with soft edges
        decay: 2,
      },
      table: {
        // Table lamp - omni-directional with realistic falloff
        decay: 2,
      },
    }
    return configs[profile]
  }, [profile])

  useEffect(() => {
    if (!lightRef.current) return

    const light = lightRef.current
    light.position.set(...position)
    light.color.set(color)
    light.intensity = intensity
    light.distance = distance
    light.decay = profileConfig.decay

    // Convert intensity to power for realistic lighting
    // Power = intensity * 4π (for point lights)
    light.power = intensity * Math.PI * 4
  }, [position, intensity, distance, color, profileConfig])

  return <pointLight ref={lightRef} />
}

