"use client"

import { useEffect } from "react"
import { useThree } from "@react-three/fiber"
import type { DirectionalLight, SpotLight } from "three"

type ShadowOptimizationConfig = {
  directionalLight?: {
    mapSize?: number
    camera?: {
      left?: number
      right?: number
      top?: number
      bottom?: number
      near?: number
      far?: number
    }
    radius?: number
    blurSamples?: number
  }
  spotLight?: {
    mapSize?: number
    radius?: number
    blurSamples?: number
  }
  quality?: "low" | "medium" | "high" | "ultra"
}

/**
 * Hook to optimize shadow maps based on quality setting
 * Automatically adjusts shadow map sizes and camera settings
 */
export function useOptimizedShadows(config: ShadowOptimizationConfig = {}) {
  const { scene } = useThree()
  const { quality = "high" } = config

  useEffect(() => {
    // Quality presets with optimized shadow settings
    const qualitySettings = {
      low: {
        directional: { 
          mapSize: 512, 
          camera: { left: -20, right: 20, top: 20, bottom: -20, near: 0.5, far: 50 },
          radius: 2,
          blurSamples: 8,
        },
        spot: { 
          mapSize: 512,
          radius: 2,
          blurSamples: 8,
        },
      },
      medium: {
        directional: { 
          mapSize: 1024, 
          camera: { left: -20, right: 20, top: 20, bottom: -20, near: 0.5, far: 50 },
          radius: 4,
          blurSamples: 16,
        },
        spot: { 
          mapSize: 1024,
          radius: 4,
          blurSamples: 16,
        },
      },
      high: {
        directional: { 
          mapSize: 2048, 
          camera: { left: -20, right: 20, top: 20, bottom: -20, near: 0.5, far: 50 },
          radius: 8,
          blurSamples: 25,
        },
        spot: { 
          mapSize: 2048,
          radius: 8,
          blurSamples: 25,
        },
      },
      ultra: {
        directional: { 
          mapSize: 4096, 
          camera: { left: -20, right: 20, top: 20, bottom: -20, near: 0.5, far: 50 },
          radius: 12,
          blurSamples: 32,
        },
        spot: { 
          mapSize: 4096,
          radius: 12,
          blurSamples: 32,
        },
      },
    }

    const settings = qualitySettings[quality]

    // Apply settings to all lights in scene
    scene.traverse((object) => {
      if (object.type === "DirectionalLight") {
        const light = object as DirectionalLight
        if (light.castShadow) {
          // Shadow map size
          light.shadow.mapSize.width = config.directionalLight?.mapSize || settings.directional.mapSize
          light.shadow.mapSize.height = config.directionalLight?.mapSize || settings.directional.mapSize
          
          // Shadow camera settings
          const camera = light.shadow.camera
          const camConfig = config.directionalLight?.camera || settings.directional.camera
          camera.left = camConfig.left!
          camera.right = camConfig.right!
          camera.top = camConfig.top!
          camera.bottom = camConfig.bottom!
          camera.near = camConfig.near!
          camera.far = camConfig.far!
          
          // Shadow quality settings
          light.shadow.bias = -0.0001
          light.shadow.normalBias = 0.02
          light.shadow.radius = config.directionalLight?.radius || settings.directional.radius
          
          // Update shadow map
          light.shadow.needsUpdate = true
        }
      } else if (object.type === "SpotLight") {
        const light = object as SpotLight
        if (light.castShadow) {
          // Shadow map size
          light.shadow.mapSize.width = config.spotLight?.mapSize || settings.spot.mapSize
          light.shadow.mapSize.height = config.spotLight?.mapSize || settings.spot.mapSize
          
          // Shadow quality settings
          light.shadow.bias = -0.0001
          light.shadow.normalBias = 0.02
          light.shadow.radius = config.spotLight?.radius || settings.spot.radius
          
          // Update shadow map
          light.shadow.needsUpdate = true
        }
      }
    })
  }, [scene, quality, config])
}

