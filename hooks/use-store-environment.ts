"use client"

import { useMemo } from "react"

export type EnvironmentConfig = {
  preset?: "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "city" | "park" | "lobby"
  environmentIntensity?: number
  darkness?: number
}

export type StoreEnvironmentResult = {
  environmentIntensity: number
  backgroundColor: string
  fogColor: string
  fogNear: number
  fogFar: number
}

/**
 * Custom hook for managing store environment settings
 * Calculates environment properties based on darkness level
 * @param config - Environment configuration
 * @returns Environment properties
 */
export function useStoreEnvironment(config: EnvironmentConfig = {}): StoreEnvironmentResult {
  const {
    preset = "city",
    darkness = 0.2,
  } = config

  // Calculate environment intensity - dims as darkness increases
  const environmentIntensity = useMemo(() => {
    return 1 - darkness * 0.9
  }, [darkness])

  // Calculate background color based on darkness
  // darkness: 0 = brighter, 1 = very dark
  const backgroundColor = useMemo(() => {
    const bgBrightness = Math.round(10 + (40 - 10) * (1 - darkness))
    return `rgb(${bgBrightness}, ${bgBrightness + 3}, ${bgBrightness + 5})`
  }, [darkness])

  // Fog color matches background
  const fogColor = useMemo(() => {
    const bgBrightness = Math.round(10 + (40 - 10) * (1 - darkness))
    return `rgb(${bgBrightness}, ${bgBrightness + 3}, ${bgBrightness + 5})`
  }, [darkness])

  // Fog distance - closer fog when darker for atmosphere
  const fogNear = useMemo(() => 10, [])
  const fogFar = useMemo(() => {
    return 60 - darkness * 20 // Closer fog when darker
  }, [darkness])

  return {
    environmentIntensity,
    backgroundColor,
    fogColor,
    fogNear,
    fogFar,
  }
}

