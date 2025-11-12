"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody, RapierRigidBody } from "@react-three/rapier"
import type { Mesh } from "three"
import type { Lamp } from "../store-scene"
import { LampDisplay } from "../lamp-display"

type PhysicalLampProps = {
  lamp: Lamp
  position: [number, number, number]
  onClick: () => void
  /**
   * Enable physics interactions (can be knocked over)
   */
  interactive?: boolean
  /**
   * Initial velocity for falling effect
   */
  initialVelocity?: [number, number, number]
}

/**
 * Physical Lamp component - lamp with physics body
 * Can be knocked over or fall when interacted with
 */
export function PhysicalLamp({ 
  lamp, 
  position, 
  onClick,
  interactive = false,
  initialVelocity = [0, 0, 0]
}: PhysicalLampProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const [isFalling, setIsFalling] = useState(false)

  // Apply initial velocity if provided
  useFrame(() => {
    if (rigidBodyRef.current && initialVelocity.some(v => v !== 0) && !isFalling) {
      rigidBodyRef.current.setLinvel(
        { x: initialVelocity[0], y: initialVelocity[1], z: initialVelocity[2] },
        true
      )
      setIsFalling(true)
    }
  })

  const handleInteraction = (e?: any) => {
    // Stop event propagation to prevent multiple triggers
    if (e) {
      e.stopPropagation()
    }
    
    if (interactive && rigidBodyRef.current && !isFalling) {
      // Apply a random impulse to knock over the lamp
      const impulse = {
        x: (Math.random() - 0.5) * 3,
        y: Math.random() * 1.5 + 0.5,
        z: (Math.random() - 0.5) * 3,
      }
      rigidBodyRef.current.applyImpulse(impulse, true)
      
      // Also apply some angular velocity for rotation
      const angularVel = {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 2,
      }
      rigidBodyRef.current.setAngvel(angularVel, true)
      
      setIsFalling(true)
    }
    onClick()
  }

  // Determine physics type based on lamp type
  const isFloorLamp = lamp.type === "Floor Lamp"
  const mass = isFloorLamp ? 5 : 2 // Floor lamps are heavier
  const restitution = 0.3 // Bounciness
  const friction = 0.7 // Friction coefficient

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={position}
      mass={mass}
      restitution={restitution}
      friction={friction}
      type={interactive ? "dynamic" : "kinematicPositionBased"} // Dynamic when interactive, kinematic otherwise
      colliders="hull" // Use convex hull for better performance
      onCollisionEnter={(e) => {
        // Optional: handle collision events
        if (e.other.rigidBody) {
          console.log("Lamp collided with:", e.other.rigidBody)
        }
      }}
    >
      <group 
        onClick={handleInteraction}
        onPointerDown={handleInteraction}
      >
        <LampDisplay lamp={lamp} position={[0, 0, 0]} onClick={handleInteraction} />
      </group>
    </RigidBody>
  )
}

