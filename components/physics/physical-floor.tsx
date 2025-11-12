"use client"

import { RigidBody } from "@react-three/rapier"

type PhysicalFloorProps = {
  position?: [number, number, number]
  size?: [number, number]
  rotation?: [number, number, number]
}

/**
 * Physical Floor component - static physics body for the floor
 * Objects will collide with and rest on this surface
 */
export function PhysicalFloor({ 
  position = [0, -0.5, 0],
  size = [40, 40],
  rotation = [-Math.PI / 2, 0, 0]
}: PhysicalFloorProps) {
  return (
    <RigidBody
      type="fixed" // Static body - doesn't move
      position={position}
      rotation={rotation}
      colliders="cuboid" // Use cuboid for floor (more efficient than mesh)
      friction={0.8} // High friction so objects don't slide
      restitution={0.1} // Low bounciness
    >
      {/* Invisible floor - the visual floor is rendered separately */}
      <mesh visible={false}>
        <planeGeometry args={size} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </RigidBody>
  )
}

