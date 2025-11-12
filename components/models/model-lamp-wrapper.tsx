"use client"

import { Suspense } from "react"
import { ModelLampInternal } from "./model-lamp"
import type { Lamp } from "../store-scene"

type ModelLampWrapperProps = {
  lamp: Lamp
  position: [number, number, number]
  onClick: () => void
  modelPath?: string | null
  scale?: number | [number, number, number]
  addLighting?: boolean
}

/**
 * Model Lamp wrapper with Suspense
 * Handles loading and errors gracefully
 * Only renders ModelLampInternal when modelPath is provided
 */
export function ModelLampWrapper(props: ModelLampWrapperProps) {
  if (!props.modelPath) {
    return null
  }

  return (
    <Suspense 
      fallback={null}
      // Suspense will catch async errors (like 404s from useGLTF)
      // If model doesn't exist, Suspense will catch the error and return null
      // The parent component (LampDisplay) will then fall back to primitives
    >
      <ModelLampInternal {...props} modelPath={props.modelPath} />
    </Suspense>
  )
}

