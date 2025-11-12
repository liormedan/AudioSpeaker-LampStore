"use client"

import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { RapierRigidBody } from "@react-three/rapier"
import type { Vector3 } from "three"

type PhysicsInteractionProps = {
  /**
   * Function to trigger when object should fall
   */
  onFall?: () => void
  /**
   * Function to trigger when object is knocked over
   */
  onKnockOver?: () => void
}

/**
 * Hook for physics interactions
 * Provides utilities for making objects fall, get knocked over, etc.
 */
export function usePhysicsInteractions(rigidBodyRef: React.RefObject<RapierRigidBody>) {
  const [isFalling, setIsFalling] = useState(false)

  const makeFall = (velocity?: Vector3) => {
    if (!rigidBodyRef.current) return
    
    const fallVelocity = velocity || {
      x: (Math.random() - 0.5) * 2,
      y: Math.random() * 2,
      z: (Math.random() - 0.5) * 2,
    }
    
    rigidBodyRef.current.setLinvel(fallVelocity, true)
    setIsFalling(true)
  }

  const knockOver = (direction?: Vector3) => {
    if (!rigidBodyRef.current) return
    
    const knockDirection = direction || {
      x: (Math.random() - 0.5) * 3,
      y: Math.random() * 1.5,
      z: (Math.random() - 0.5) * 3,
    }
    
    // Apply impulse to knock over
    rigidBodyRef.current.applyImpulse(knockDirection, true)
    setIsFalling(true)
  }

  const reset = (position: Vector3) => {
    if (!rigidBodyRef.current) return
    
    rigidBodyRef.current.setTranslation(position, true)
    rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
    rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
    setIsFalling(false)
  }

  return {
    makeFall,
    knockOver,
    reset,
    isFalling,
  }
}

/**
 * Component that adds physics interactions to lamps
 * Allows lamps to be knocked over or fall when clicked
 */
export function PhysicsInteractions({ onFall, onKnockOver }: PhysicsInteractionProps) {
  // This is a utility component - actual interactions are handled in PhysicalLamp
  return null
}

