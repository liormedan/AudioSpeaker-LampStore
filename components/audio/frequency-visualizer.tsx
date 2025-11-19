"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useAudio } from "./audio-manager"
import * as THREE from "three"

export function FrequencyVisualizer({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
    const { audioData } = useAudio()
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const count = 64 // Number of bars
    const radius = 4 // Radius of the circle

    // Create dummy object for positioning instances
    const dummy = useMemo(() => new THREE.Object3D(), [])

    // Initialize positions
    useMemo(() => {
        if (!meshRef.current) return

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius

            dummy.position.set(x, 0, z)
            dummy.rotation.y = -angle
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true
    }, [count, radius, dummy])

    useFrame(() => {
        if (!meshRef.current || audioData.length === 0) return

        // Map audio data to bars
        // We have 128 bins (fftSize/2), we use 64 bars
        // So we step by 2 roughly

        for (let i = 0; i < count; i++) {
            const dataIndex = Math.floor(i * (audioData.length / count))
            const value = audioData[dataIndex] / 255.0 // Normalize 0-1

            const angle = (i / count) * Math.PI * 2
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius

            // Scale height based on audio value
            // Base height 0.1, max height adds 3
            const height = 0.1 + (value * 3)

            dummy.position.set(x, height / 2, z)
            dummy.scale.set(1, height, 1)
            dummy.rotation.y = -angle
            dummy.updateMatrix()

            meshRef.current.setMatrixAt(i, dummy.matrix)

            // Optional: Update color based on intensity
            const color = new THREE.Color()
            color.setHSL(0.6 + (value * 0.4), 1, 0.5) // Blue to Purple
            meshRef.current.setColorAt(i, color)
        }

        meshRef.current.instanceMatrix.needsUpdate = true
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
    })

    return (
        <group position={position}>
            <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
                <boxGeometry args={[0.2, 1, 0.2]} />
                <meshStandardMaterial
                    toneMapped={false}
                    emissive="blue"
                    emissiveIntensity={2}
                />
            </instancedMesh>
        </group>
    )
}
