"use client"

import { useRef, useEffect, useMemo } from "react"
import { useThree } from "@react-three/fiber"
import { RectAreaLight } from "three"
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js"

type RectAreaLightProps = {
  position?: [number, number, number]
  width?: number
  height?: number
  intensity?: number
  color?: string
  rotation?: [number, number, number]
}

// Initialize RectAreaLightUniformsLib once
let initialized = false

/**
 * RectAreaLight component - more efficient than point lights for area lighting
 * Provides realistic area lighting with better performance
 */
export function RectAreaLightComponent({
  position = [0, 0, 0],
  width = 1,
  height = 1,
  intensity = 1,
  color = "#ffffff",
  rotation = [0, 0, 0],
}: RectAreaLightProps) {
  const { gl } = useThree()
  const lightRef = useRef<RectAreaLight>(null)

  // Initialize RectAreaLightUniformsLib once
  useEffect(() => {
    if (!initialized) {
      RectAreaLightUniformsLib.init(gl.getContext() as WebGLRenderingContext)
      initialized = true
    }
  }, [gl])

  // Create light instance
  const light = useMemo(() => {
    return new RectAreaLight(color, intensity, width, height)
  }, [color, intensity, width, height])

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.position.set(...position)
      lightRef.current.rotation.set(...rotation)
    }
  }, [position, rotation, light])

  return <primitive ref={lightRef} object={light} />
}

