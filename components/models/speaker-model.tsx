"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import { useAudio } from "../audio/audio-manager"
import * as THREE from "three"

function SpeakerDriver({
    position,
    size,
    type = "woofer",
    frequencyIndex
}: {
    position: [number, number, number],
    size: number,
    type?: "tweeter" | "mid" | "woofer",
    frequencyIndex: number
}) {
    const { audioData } = useAudio()
    const coneRef = useRef<THREE.Mesh>(null)

    // Create cone geometry
    const coneGeometry = useMemo(() => {
        // Lathe geometry for a curved cone
        const points = []
        for (let i = 0; i < 10; i++) {
            const x = (size * 0.8) * (i / 10)
            const y = - (size * 0.3) * (1 - i / 10)
            points.push(new THREE.Vector2(x, y))
        }
        return new THREE.LatheGeometry(points, 32)
    }, [size])

    useFrame(() => {
        if (!coneRef.current || audioData.length === 0) return

        // Get frequency data
        const value = audioData[frequencyIndex] / 255.0

        // Vibrate based on intensity
        // Move in/out on Z axis
        const excursion = value * (type === "woofer" ? 0.15 : 0.05)
        coneRef.current.position.z = excursion
    })

    return (
        <group position={position}>
            {/* Frame/Surround */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[size * 0.8, size * 0.1, 16, 32]} />
                <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>

            {/* Cone */}
            <mesh ref={coneRef} geometry={coneGeometry} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}>
                <meshStandardMaterial
                    color={type === "tweeter" ? "#222" : "#1a1a1a"}
                    roughness={0.4}
                    metalness={0.5}
                />
            </mesh>

            {/* Dust Cap */}
            <mesh position={[0, 0, 0.05]} ref={coneRef}>
                <sphereGeometry args={[size * 0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                <meshStandardMaterial color="#111" roughness={0.3} />
            </mesh>
        </group>
    )
}

export function SpeakerModel({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Cabinet - Wood Finish */}
            <group position={[0, 2.5, 0]}>
                <RoundedBox args={[1.4, 5, 1.6]} radius={0.05} smoothness={4} castShadow receiveShadow>
                    <meshStandardMaterial
                        color="#3e2723" // Dark Walnut
                        roughness={0.2}
                        metalness={0.1}
                    />
                </RoundedBox>

                {/* Front Baffle - Black Matte */}
                <mesh position={[0, 0, 0.81]}>
                    <planeGeometry args={[1.2, 4.8]} />
                    <meshStandardMaterial color="#050505" roughness={0.8} />
                </mesh>
            </group>

            {/* Drivers */}
            {/* Tweeter - High Freq */}
            <SpeakerDriver position={[0, 4.2, 0.82]} size={0.15} type="tweeter" frequencyIndex={40} />

            {/* Mid-Range - Mid Freq */}
            <SpeakerDriver position={[0, 3.4, 0.82]} size={0.35} type="mid" frequencyIndex={20} />

            {/* Woofer 1 - Low Freq */}
            <SpeakerDriver position={[0, 2.2, 0.82]} size={0.5} type="woofer" frequencyIndex={5} />

            {/* Woofer 2 - Sub Freq */}
            <SpeakerDriver position={[0, 1.0, 0.82]} size={0.5} type="woofer" frequencyIndex={2} />

            {/* Bass Port */}
            <mesh position={[0, 0.4, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
                <meshStandardMaterial color="black" />
            </mesh>
            <mesh position={[0, 0.4, 0.81]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.2, 0.25, 32]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Spikes / Feet */}
            <group position={[0, 0, 0]}>
                {[
                    [0.6, 0, 0.7], [-0.6, 0, 0.7],
                    [0.6, 0, -0.7], [-0.6, 0, -0.7]
                ].map((pos, i) => (
                    <mesh key={i} position={pos as [number, number, number]}>
                        <coneGeometry args={[0.08, 0.2, 16]} />
                        <meshStandardMaterial color="#silver" metalness={1} roughness={0.2} />
                    </mesh>
                ))}
            </group>

            {/* Floor Plinth */}
            <mesh position={[0, 0.05, 0]} receiveShadow>
                <boxGeometry args={[1.5, 0.1, 1.7]} />
                <meshStandardMaterial color="#111" roughness={0.5} />
            </mesh>
        </group>
    )
}
