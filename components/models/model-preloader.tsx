"use client"

import { useEffect, useState } from "react"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

// Create a shared loader instance with caching
// This improves performance by reusing the same loader and caching models
const sharedLoader = new GLTFLoader()

type ModelPreloaderProps = {
  /**
   * Array of model paths to preload
   */
  modelPaths: string[]
  /**
   * Callback when all models are loaded
   */
  onComplete?: () => void
  /**
   * Callback for loading progress
   */
  onProgress?: (progress: number) => void
}

/**
 * Model Preloader component
 * Preloads multiple GLB/GLTF models before they're needed
 * Useful for improving performance and reducing loading times
 */
export function ModelPreloader({ 
  modelPaths, 
  onComplete, 
  onProgress 
}: ModelPreloaderProps) {
  const [loadedCount, setLoadedCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (modelPaths.length === 0) {
      setIsLoading(false)
      onComplete?.()
      return
    }

    let completed = 0
    const total = modelPaths.length

    // Preload models using shared GLTFLoader instance for better caching
    const loadPromises = modelPaths.map((path) => {
      return new Promise<void>((resolve) => {
        // Check if file exists first (optional - will fail gracefully anyway)
        // Using shared loader for better caching
        sharedLoader.load(
          path,
          () => {
            completed++
            setLoadedCount(completed)
            const progress = (completed / total) * 100
            onProgress?.(progress)
            
            if (completed === total) {
              setIsLoading(false)
              onComplete?.()
            }
            resolve()
          },
          undefined,
          (error: unknown) => {
            // Silently handle 404s - models are optional
            // Only log if it's not a 404 (file not found)
            const errorMessage = error instanceof Error ? error.message : String(error)
            if (error && !errorMessage.includes("404") && !errorMessage.includes("Not Found")) {
              console.warn(`Failed to preload model ${path}:`, error)
            }
            completed++
            setLoadedCount(completed)
            const progress = (completed / total) * 100
            onProgress?.(progress)
            
            if (completed === total) {
              setIsLoading(false)
              onComplete?.()
            }
            resolve() // Resolve anyway to not block other loads
          }
        )
      })
    })

    // Cleanup function
    return () => {
      // Cancel loading if component unmounts
      loadPromises.forEach((promise) => {
        // Note: preload doesn't return a cancellable promise
        // This is just for cleanup structure
      })
    }
  }, [modelPaths, onComplete, onProgress])

  // This component doesn't render anything
  return null
}

/**
 * Hook to preload models
 * Returns loading state and progress
 */
export function useModelPreloader(modelPaths: string[]) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (modelPaths.length === 0) {
      setIsLoading(false)
      setProgress(100)
      return
    }

    let completed = 0
    const total = modelPaths.length

    // Use shared loader for better caching
    modelPaths.forEach((path) => {
      sharedLoader.load(
        path,
        () => {
          completed++
          const newProgress = (completed / total) * 100
          setProgress(newProgress)
          
          if (completed === total) {
            setIsLoading(false)
          }
        },
        undefined,
        (error: unknown) => {
          // Silently handle 404s - models are optional
          // Only log if it's not a 404 (file not found)
          const errorMessage = error instanceof Error ? error.message : String(error)
          if (error && !errorMessage.includes("404") && !errorMessage.includes("Not Found")) {
            console.warn(`Failed to preload model ${path}:`, error)
          }
          completed++
          const newProgress = (completed / total) * 100
          setProgress(newProgress)
          
          if (completed === total) {
            setIsLoading(false)
          }
        }
      )
    })
  }, [modelPaths])

  return { isLoading, progress }
}

