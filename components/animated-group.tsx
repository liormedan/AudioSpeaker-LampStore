"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"
import type { ReactNode } from "react"

type AnimatedGroupProps = {
  children: ReactNode
  hoverScale?: number
  clickScale?: number
  floatIntensity?: number
  floatSpeed?: number
  [key: string]: any
}

/**
 * Animated group component with smooth hover and click animations
 * Adds floating animation and interactive scaling
 */
export function AnimatedGroup({
  children,
  hoverScale = 1.05,
  clickScale = 0.95,
  floatIntensity = 0.02,
  floatSpeed = 1,
  ...props
}: AnimatedGroupProps) {
  const groupRef = useRef<Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const floatTime = useRef(0)

  useFrame((state, delta) => {
    if (groupRef.current) {
      floatTime.current += delta * floatSpeed
      
      // Floating animation
      const floatY = Math.sin(floatTime.current) * floatIntensity
      groupRef.current.position.y = (props.position?.[1] || 0) + floatY

      // Smooth scale transitions
      const targetScale = isClicked ? clickScale : isHovered ? hoverScale : 1
      groupRef.current.scale.lerp(
        { x: targetScale, y: targetScale, z: targetScale } as any,
        0.1
      )

      // Reset click state after animation
      if (isClicked) {
        setTimeout(() => setIsClicked(false), 200)
      }
    }
  })

  return (
    <group
      ref={groupRef}
      {...props}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      onClick={() => setIsClicked(true)}
    >
      {children}
    </group>
  )
}

