"use client"

import { useState, useEffect, useMemo } from "react"
import { useGLTF } from "@react-three/drei"
import type { GLTF } from "three-stdlib"

type ModelLoadState = {
  isLoading: boolean
  error: Error | null
  progress: number
}

type UseModelLoaderResult = {
  scene: THREE.Group | null
  isLoading: boolean
  error: Error | null
  progress: number
}

/**
 * Hook for loading GLB/GLTF models with preloading support
 * Provides loading state, progress, and error handling
 * 
 * @param modelPath - Path to the GLB/GLTF model file
 * @param preloadModel - Whether to preload the model (default: true)
 * @returns Model loading state and scene
 */
export function useModelLoader(
  modelPath: string | null,
  preloadModel: boolean = true
): UseModelLoaderResult {
  const [loadState, setLoadState] = useState<ModelLoadState>({
    isLoading: true,
    error: null,
    progress: 0,
  })

  // Preload model if requested
  useEffect(() => {
    if (modelPath && preloadModel) {
      // Preloading is handled by useGLTF automatically when the model is used
      // No explicit preload needed here
    }
  }, [modelPath, preloadModel])

  // Load model using useGLTF
  const gltf = useGLTF(modelPath || "", true) as GLTF | null

  useEffect(() => {
    if (!modelPath) {
      setLoadState({ isLoading: false, error: null, progress: 100 })
      return
    }

    if (gltf) {
      setLoadState({ isLoading: false, error: null, progress: 100 })
    } else {
      setLoadState((prev) => ({ ...prev, isLoading: true, progress: 0 }))
    }
  }, [gltf, modelPath])

  return {
    scene: gltf?.scene || null,
    isLoading: loadState.isLoading,
    error: loadState.error,
    progress: loadState.progress,
  }
}

/**
 * Preload multiple models at once
 * Useful for preloading all lamp models before they're needed
 */
export function preloadModels(modelPaths: string[]): Promise<void[]> {
  if (typeof window === "undefined") {
    return Promise.resolve([])
  }

  const { GLTFLoader } = require("three/addons/loaders/GLTFLoader.js")
  const loader = new GLTFLoader()

  return Promise.all(
    modelPaths.map((path) => {
      return new Promise<void>((resolve) => {
        loader.load(
          path,
          () => resolve(),
          undefined,
          (error: Error) => {
            console.warn(`Failed to preload model ${path}:`, error)
            resolve() // Resolve anyway to not block other loads
          }
        )
      })
    })
  )
}

