"use client"

import { useRef, useMemo, Suspense } from "react"
import { useGLTF } from "@react-three/drei"
import type { Group } from "three"
import { Mesh } from "three"
import type { GLTF } from "three-stdlib"
import type { Lamp } from "../store-scene"
import { IESLight } from "../lighting/ies-light"
import { RectAreaLightComponent } from "../lighting/rect-area-light"

type ModelLampProps = {
  lamp: Lamp
  position: [number, number, number]
  onClick: () => void
  /**
   * Path to GLB/GLTF model file
   * If not provided, falls back to primitive geometry
   */
  modelPath?: string | null
  /**
   * Scale factor for the model
   */
  scale?: number | [number, number, number]
  /**
   * Whether to add lighting to the model
   */
  addLighting?: boolean
}

/**
 * Model Lamp component - renders lamp from GLB/GLTF model
 * Falls back to primitive geometry if model is not available
 * 
 * NOTE: This component assumes modelPath is always provided when called
 * Use ModelLampWrapper for conditional loading
 */
export function ModelLampInternal({ 
  lamp, 
  position, 
  onClick,
  modelPath,
  scale = 1,
  addLighting = true
}: ModelLampProps) {
  const groupRef = useRef<Group>(null)

  // Load model - useGLTF hook must be called unconditionally
  // This component should only be rendered when modelPath exists
  // useGLTF will throw if model doesn't exist, which Suspense will catch
  let gltf: GLTF | null = null
  let modelScene: Group | null = null
  
  try {
    gltf = useGLTF(modelPath!, true) as GLTF
    modelScene = gltf?.scene || null
  } catch (error: any) {
    // If model doesn't exist (404), return null to trigger fallback
    // Suspense will catch the error, but we also handle it here
    if (error?.message?.includes("404") || error?.message?.includes("Not Found")) {
      console.debug(`Model ${modelPath} not found, using primitive geometry fallback`)
      return null
    }
    // Re-throw other errors
    throw error
  }

  // Clone and prepare the scene with useMemo for performance
  const preparedScene = useMemo(() => {
    if (!modelScene) return null

    const clonedScene = modelScene.clone()
    
    // Apply scale
    if (typeof scale === "number") {
      clonedScene.scale.set(scale, scale, scale)
    } else {
      clonedScene.scale.set(scale[0], scale[1], scale[2])
    }

    // Enable shadows
    clonedScene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    return clonedScene
  }, [modelScene, scale])


  // Handle click events
  const handleClick = (e: any) => {
    e.stopPropagation()
    onClick()
  }

  // If model is available, render it
  if (preparedScene) {
    return (
      <group ref={groupRef} position={position}>
        <primitive 
          object={preparedScene}
          onClick={handleClick}
          onPointerOver={() => {
            document.body.style.cursor = "pointer"
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default"
          }}
        />
        {addLighting && (
          <>
            {/* Add IES light based on lamp type */}
            {lamp.type === "Floor Lamp" ? (
              <IESLight
                position={[0, 2, 0]}
                intensity={80}
                distance={20}
                color="#fff5e1"
                profile="pendant"
              />
            ) : (
              <IESLight
                position={[0, 1.2, 0]}
                intensity={50}
                distance={15}
                color="#fff5e1"
                profile="table"
              />
            )}
            <RectAreaLightComponent
              position={[0, 1.0, 0]}
              width={0.4}
              height={0.4}
              intensity={20}
              color="#fffacd"
              rotation={[-Math.PI / 2, 0, 0]}
            />
          </>
        )}
      </group>
    )
  }

  // Fallback: return null (parent should handle fallback rendering)
  return null
}

/**
 * Model Lamp component with Suspense boundary
 * Handles loading states and errors gracefully
 * 
 * @deprecated Use ModelLampWrapper instead for conditional loading
 */
export function ModelLamp(props: ModelLampProps) {
  if (!props.modelPath) {
    return null
  }
  
  return (
    <Suspense fallback={null}>
      <ModelLampInternal {...props} />
    </Suspense>
  )
}

// Preload function for this component's models
export function preloadLampModel(modelPath: string) {
  if (typeof window !== "undefined") {
    try {
      const { GLTFLoader } = require("three/addons/loaders/GLTFLoader.js")
      const loader = new GLTFLoader()
      loader.load(
        modelPath,
        () => {
          // Model preloaded successfully
        },
        undefined,
        (error: Error) => {
          console.warn(`Failed to preload model ${modelPath}:`, error)
        }
      )
    } catch (error) {
      console.warn(`Failed to preload model ${modelPath}:`, error)
    }
  }
}

