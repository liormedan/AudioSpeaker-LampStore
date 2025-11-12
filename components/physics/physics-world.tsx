"use client"

import { Physics } from "@react-three/rapier"
import type { ReactNode } from "react"

type PhysicsWorldProps = {
  children: ReactNode
  gravity?: [number, number, number]
  paused?: boolean
}

/**
 * Physics World component - wraps the scene with Rapier physics engine
 * Provides realistic physics simulation for objects in the scene
 */
export function PhysicsWorld({ 
  children, 
  gravity = [0, -9.81, 0],
  paused = false 
}: PhysicsWorldProps) {
  return (
    <Physics
      gravity={gravity}
      paused={paused}
      debug={false} // Set to true for debugging physics bodies
      timeStep="vary" // Adaptive time step for better performance
    >
      {children}
    </Physics>
  )
}

