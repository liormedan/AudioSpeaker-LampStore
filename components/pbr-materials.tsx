"use client"

import { RepeatWrapping, Texture, TextureLoader } from "three"
import { useMemo, useEffect, useState } from "react"

// Export loading state type for use in components
export type TextureLoadingState = {
  isLoading: boolean
  progress: number
}

type PBRMaterialProps = {
  colorMap?: string
  normalMap?: string
  roughnessMap?: string
  aoMap?: string
  color?: string
  roughness?: number
  metalness?: number
  repeat?: [number, number]
  [key: string]: any
}

// Helper function to create procedural textures as fallback
function createProceduralTexture(color: string, size: number = 256): Texture {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  
  // Parse color hex to RGB
  const hex = color.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  // Create a simple pattern
  ctx.fillStyle = color
  ctx.fillRect(0, 0, size, size)
  
  // Add some noise for texture
  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 15
    data[i] = Math.max(0, Math.min(255, r + noise))     // R
    data[i + 1] = Math.max(0, Math.min(255, g + noise)) // G
    data[i + 2] = Math.max(0, Math.min(255, b + noise)) // B
  }
  ctx.putImageData(imageData, 0, 0)
  
  const texture = new Texture(canvas)
  texture.needsUpdate = true
  return texture
}

// Hook to load texture with fallback
function useTextureWithFallback(paths: string[], fallbackColor: string) {
  const [textures, setTextures] = useState<Texture[]>([])
  const loader = useMemo(() => new TextureLoader(), [])

  useEffect(() => {
    const loadTextures = async () => {
      const loaded: Texture[] = []
      for (const path of paths) {
        try {
          const texture = await new Promise<Texture>((resolve, reject) => {
            loader.load(
              path,
              (texture) => resolve(texture),
              undefined,
              () => reject(new Error(`Failed to load ${path}`))
            )
          })
          loaded.push(texture)
        } catch (e) {
          // Use procedural texture as fallback
          loaded.push(createProceduralTexture(fallbackColor))
        }
      }
      setTextures(loaded)
    }
    loadTextures()
  }, [paths.join(","), fallbackColor, loader])

  return textures
}

// PBR Material component for floor
export function FloorPBRMaterial({ 
  color = "#4a3728", 
  roughness = 0.8, 
  repeat = [6, 6],
  ...props 
}: PBRMaterialProps) {
  // Try to load textures using useTexture from drei (will use fallback if not found)
  const texturePaths = useMemo(() => [
    "/textures/wood/color.jpg",
    "/textures/wood/normal.jpg",
    "/textures/wood/roughness.jpg",
    "/textures/wood/ao.jpg",
  ], [])

  // Use useTexture - it will handle errors gracefully
  // We'll use a simpler approach with conditional loading
  const [textures, setTextures] = useState<{
    map: Texture | null
    normalMap: Texture | null
    roughnessMap: Texture | null
    aoMap: Texture | null
  }>({
    map: null,
    normalMap: null,
    roughnessMap: null,
    aoMap: null,
  })

  useEffect(() => {
    const loader = new TextureLoader()
    const loadTexture = async (path: string, key: keyof typeof textures) => {
      try {
        const texture = await new Promise<Texture>((resolve, reject) => {
          loader.load(path, resolve, undefined, reject)
        })
        setTextures((prev) => ({ ...prev, [key]: texture }))
      } catch (e) {
        // Fallback to procedural texture
        if (key === "map") {
          setTextures((prev) => ({ ...prev, [key]: createProceduralTexture(color, 512) }))
        }
      }
    }

    loadTexture(texturePaths[0], "map")
    loadTexture(texturePaths[1], "normalMap")
    loadTexture(texturePaths[2], "roughnessMap")
    loadTexture(texturePaths[3], "aoMap")
  }, [texturePaths.join(","), color])

  // Configure texture repeat and wrapping
  useEffect(() => {
    if (textures.map) {
      textures.map.wrapS = RepeatWrapping
      textures.map.wrapT = RepeatWrapping
      textures.map.repeat.set(repeat[0], repeat[1])
      textures.map.anisotropy = 16
    }
    
    if (textures.normalMap) {
      textures.normalMap.wrapS = RepeatWrapping
      textures.normalMap.wrapT = RepeatWrapping
      textures.normalMap.repeat.set(repeat[0], repeat[1])
    }
    
    if (textures.roughnessMap) {
      textures.roughnessMap.wrapS = RepeatWrapping
      textures.roughnessMap.wrapT = RepeatWrapping
      textures.roughnessMap.repeat.set(repeat[0], repeat[1])
    }
    
    if (textures.aoMap) {
      textures.aoMap.wrapS = RepeatWrapping
      textures.aoMap.wrapT = RepeatWrapping
      textures.aoMap.repeat.set(repeat[0], repeat[1])
    }
  }, [textures, repeat])

  // Use procedural texture as fallback if map is not loaded - memoized
  const mapTexture = useMemo(() => {
    return textures.map || createProceduralTexture(color, 512)
  }, [textures.map, color])

  return (
    <meshStandardMaterial
      {...props}
      map={mapTexture}
      normalMap={textures.normalMap || undefined}
      roughnessMap={textures.roughnessMap || undefined}
      aoMap={textures.aoMap || undefined}
      color={color}
      roughness={roughness}
      metalness={0.1}
    />
  )
}

// PBR Material component for walls
export function WallPBRMaterial({ 
  color = "#2a3439", 
  roughness = 0.9, 
  repeat = [1, 1],
  ...props 
}: PBRMaterialProps) {
  const texturePaths = useMemo(() => [
    "/textures/wall/color.jpg",
    "/textures/wall/normal.jpg",
    "/textures/wall/roughness.jpg",
    "/textures/wall/ao.jpg",
  ], [])

  const [textures, setTextures] = useState<{
    map: Texture | null
    normalMap: Texture | null
    roughnessMap: Texture | null
    aoMap: Texture | null
  }>({
    map: null,
    normalMap: null,
    roughnessMap: null,
    aoMap: null,
  })

  useEffect(() => {
    const loader = new TextureLoader()
    const loadTexture = async (path: string, key: keyof typeof textures) => {
      try {
        const texture = await new Promise<Texture>((resolve, reject) => {
          loader.load(path, resolve, undefined, reject)
        })
        setTextures((prev) => ({ ...prev, [key]: texture }))
      } catch (e) {
        if (key === "map") {
          setTextures((prev) => ({ ...prev, [key]: createProceduralTexture(color, 512) }))
        }
      }
    }

    loadTexture(texturePaths[0], "map")
    loadTexture(texturePaths[1], "normalMap")
    loadTexture(texturePaths[2], "roughnessMap")
    loadTexture(texturePaths[3], "aoMap")
  }, [texturePaths.join(","), color])

  useEffect(() => {
    if (textures.map) {
      textures.map.wrapS = RepeatWrapping
      textures.map.wrapT = RepeatWrapping
      textures.map.repeat.set(repeat[0], repeat[1])
    }
    
    if (textures.normalMap) {
      textures.normalMap.wrapS = RepeatWrapping
      textures.normalMap.wrapT = RepeatWrapping
      textures.normalMap.repeat.set(repeat[0], repeat[1])
    }
    
    if (textures.roughnessMap) {
      textures.roughnessMap.wrapS = RepeatWrapping
      textures.roughnessMap.wrapT = RepeatWrapping
      textures.roughnessMap.repeat.set(repeat[0], repeat[1])
    }
    
    if (textures.aoMap) {
      textures.aoMap.wrapS = RepeatWrapping
      textures.aoMap.wrapT = RepeatWrapping
      textures.aoMap.repeat.set(repeat[0], repeat[1])
    }
  }, [textures, repeat])

  const mapTexture = useMemo(() => {
    return textures.map || createProceduralTexture(color, 512)
  }, [textures.map, color])

  return (
    <meshStandardMaterial
      {...props}
      map={mapTexture}
      normalMap={textures.normalMap || undefined}
      roughnessMap={textures.roughnessMap || undefined}
      aoMap={textures.aoMap || undefined}
      color={color}
      roughness={roughness}
      metalness={0.05}
    />
  )
}

// PBR Material component for marble/stone (coffee table)
export function MarblePBRMaterial({ 
  color = "#d4c5b0", 
  roughness = 0.2, 
  metalness = 0.3,
  repeat = [1, 1],
  ...props 
}: PBRMaterialProps) {
  const texturePaths = useMemo(() => [
    "/textures/marble/color.jpg",
    "/textures/marble/normal.jpg",
    "/textures/marble/roughness.jpg",
    "/textures/marble/ao.jpg",
  ], [])

  const [textures, setTextures] = useState<{
    map: Texture | null
    normalMap: Texture | null
    roughnessMap: Texture | null
    aoMap: Texture | null
  }>({
    map: null,
    normalMap: null,
    roughnessMap: null,
    aoMap: null,
  })

  useEffect(() => {
    const loader = new TextureLoader()
    const loadTexture = async (path: string, key: keyof typeof textures) => {
      try {
        const texture = await new Promise<Texture>((resolve, reject) => {
          loader.load(path, resolve, undefined, reject)
        })
        setTextures((prev) => ({ ...prev, [key]: texture }))
      } catch (e) {
        if (key === "map") {
          setTextures((prev) => ({ ...prev, [key]: createProceduralTexture(color, 512) }))
        }
      }
    }

    loadTexture(texturePaths[0], "map")
    loadTexture(texturePaths[1], "normalMap")
    loadTexture(texturePaths[2], "roughnessMap")
    loadTexture(texturePaths[3], "aoMap")
  }, [texturePaths.join(","), color])

  useEffect(() => {
    if (textures.map) {
      textures.map.wrapS = RepeatWrapping
      textures.map.wrapT = RepeatWrapping
      textures.map.repeat.set(repeat[0], repeat[1])
      textures.map.anisotropy = 16
    }
    
    if (textures.normalMap) {
      textures.normalMap.wrapS = RepeatWrapping
      textures.normalMap.wrapT = RepeatWrapping
      textures.normalMap.repeat.set(repeat[0], repeat[1])
    }
    
    if (textures.roughnessMap) {
      textures.roughnessMap.wrapS = RepeatWrapping
      textures.roughnessMap.wrapT = RepeatWrapping
      textures.roughnessMap.repeat.set(repeat[0], repeat[1])
    }
    
    if (textures.aoMap) {
      textures.aoMap.wrapS = RepeatWrapping
      textures.aoMap.wrapT = RepeatWrapping
      textures.aoMap.repeat.set(repeat[0], repeat[1])
    }
  }, [textures, repeat])

  const mapTexture = useMemo(() => {
    return textures.map || createProceduralTexture(color, 512)
  }, [textures.map, color])

  return (
    <meshStandardMaterial
      {...props}
      map={mapTexture}
      normalMap={textures.normalMap || undefined}
      roughnessMap={textures.roughnessMap || undefined}
      aoMap={textures.aoMap || undefined}
      color={color}
      roughness={roughness}
      metalness={metalness}
    />
  )
}

