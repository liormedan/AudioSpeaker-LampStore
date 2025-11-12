"use client"

import { useState, useEffect } from "react"
import { TextureLoader, Texture } from "three"

type TextureLoadState = {
  isLoading: boolean
  progress: number
  error: Error | null
  textures: Record<string, Texture | null>
}

/**
 * Hook for loading textures with progress tracking
 * @param texturePaths - Object mapping texture names to paths
 * @returns Loading state and loaded textures
 */
export function useTextureLoader(texturePaths: Record<string, string>) {
  const [state, setState] = useState<TextureLoadState>({
    isLoading: true,
    progress: 0,
    error: null,
    textures: {},
  })

  useEffect(() => {
    const loader = new TextureLoader()
    const textureEntries = Object.entries(texturePaths)
    const total = textureEntries.length
    let loaded = 0
    const loadedTextures: Record<string, Texture | null> = {}

    const loadAll = async () => {
      try {
        for (const [name, path] of textureEntries) {
          try {
            const texture = await new Promise<Texture>((resolve, reject) => {
              loader.load(path, resolve, undefined, reject)
            })
            loadedTextures[name] = texture
          } catch (e) {
            loadedTextures[name] = null
          }
          loaded++
          setState((prev) => ({
            ...prev,
            progress: (loaded / total) * 100,
            textures: { ...loadedTextures },
          }))
        }

        setState({
          isLoading: false,
          progress: 100,
          error: null,
          textures: loadedTextures,
        })
      } catch (error) {
        setState({
          isLoading: false,
          progress: 0,
          error: error instanceof Error ? error : new Error("Failed to load textures"),
          textures: {},
        })
      }
    }

    loadAll()
  }, [JSON.stringify(texturePaths)])

  return state
}

