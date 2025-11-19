"use client"

import { IESLight } from "./lighting/ies-light"
import type { Lamp } from "./store-scene"

type PendantType = "minimalist" | "industrial" | "linear"

type CeilingPendantProps = {
    position: [number, number, number]
    type: PendantType
    onSelect: (lamp: Lamp) => void
    darkness?: number
}

export function CeilingPendant({ position, type, onSelect, darkness = 0 }: CeilingPendantProps) {
    const handleSelect = (e: any) => {
        e.stopPropagation()

        // Define lamp data based on type
        let lampData: Lamp

        switch (type) {
            case "minimalist":
                lampData = {
                    id: "pendant-1",
                    name: "Modern Pendant Light",
                    price: 150,
                    description: "Minimalist round pendant light with clean design",
                    type: "Ceiling Lamp",
                    colors: ["#ffffff", "#1a1a1a", "#b8860b"],
                    features: ["Minimalist design", "Uniform lighting", "Modern aesthetic", "Easy installation"],
                }
                break
            case "industrial":
                lampData = {
                    id: "pendant-2",
                    name: "Industrial Cage Pendant",
                    price: 180,
                    description: "Industrial style pendant with metal cage design",
                    type: "Ceiling Lamp",
                    colors: ["#1a1a1a", "#8b7355", "#b8860b"],
                    features: ["Industrial design", "Focused lighting", "Metal construction", "Vintage aesthetic"],
                }
                break
            case "linear":
                lampData = {
                    id: "pendant-3",
                    name: "Multi-Light Linear Pendant",
                    price: 240,
                    description: "Linear pendant with multiple lights for wide area coverage",
                    type: "Ceiling Lamp",
                    colors: ["#1a1a1a", "#b8860b", "#ffffff"],
                    features: ["Multiple lights", "Wide coverage", "Linear design", "Modern style"],
                }
                break
        }

        onSelect(lampData)
    }

    const handlePointerOver = () => { document.body.style.cursor = "pointer" }
    const handlePointerOut = () => { document.body.style.cursor = "default" }

    // Dim lights based on darkness - reduce intensity by up to 70% in night mode
    const dimFactor = 1 - (darkness * 0.7)

    return (
        <group
            position={position}
            onClick={handleSelect}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        >
            {type === "minimalist" && (
                <>
                    {/* Ceiling mount */}
                    <mesh position={[0, 1.5, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 0.3]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* Cord */}
                    <mesh position={[0, 0.8, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 1.5]} />
                        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} />
                    </mesh>
                    {/* Pendant sphere */}
                    <mesh position={[0, 0.3, 0]}>
                        <sphereGeometry args={[0.4, 32, 32]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            roughness={0.2}
                            metalness={0.1}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>
                    {/* Inner glow */}
                    <mesh position={[0, 0.3, 0]}>
                        <sphereGeometry args={[0.35, 32, 32]} />
                        <meshStandardMaterial
                            color="#fffacd"
                            emissive="#fff5e1"
                            emissiveIntensity={1.2 * dimFactor}
                        />
                    </mesh>
                    {/* Light source */}
                    <IESLight
                        position={[0, 0.3, 0]}
                        intensity={25 * dimFactor}
                        distance={8}
                        color="#fff5e1"
                        profile="table"
                    />
                </>
            )}

            {type === "industrial" && (
                <>
                    {/* Ceiling mount */}
                    <mesh position={[0, 1.5, 0]}>
                        <cylinderGeometry args={[0.1, 0.1, 0.3]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
                    </mesh>
                    {/* Cord */}
                    <mesh position={[0, 0.8, 0]}>
                        <cylinderGeometry args={[0.025, 0.025, 1.5]} />
                        <meshStandardMaterial color="#2a2a2a" metalness={0.7} roughness={0.2} />
                    </mesh>
                    {/* Cage structure */}
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <mesh key={i} position={[0, 0.3, 0]} rotation={[0, (i * Math.PI) / 4, 0]}>
                            <boxGeometry args={[0.02, 0.6, 0.02]} />
                            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                        </mesh>
                    ))}
                    {/* Cage rings */}
                    <mesh position={[0, 0.6, 0]}>
                        <torusGeometry args={[0.35, 0.02, 16, 32]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <torusGeometry args={[0.35, 0.02, 16, 32]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* Inner bulb */}
                    <mesh position={[0, 0.3, 0]}>
                        <sphereGeometry args={[0.25, 16, 16]} />
                        <meshStandardMaterial
                            color="#fffacd"
                            emissive="#fff5e1"
                            emissiveIntensity={1.5 * dimFactor}
                        />
                    </mesh>
                    {/* Light source */}
                    <IESLight
                        position={[0, 0.3, 0]}
                        intensity={30 * dimFactor}
                        distance={10}
                        color="#fff5e1"
                        profile="table"
                    />
                </>
            )}

            {type === "linear" && (
                <>
                    {/* Ceiling mount */}
                    <mesh position={[0, 1.5, 0]}>
                        <boxGeometry args={[1.2, 0.1, 0.1]} />
                        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
                    </mesh>
                    {/* 3 lights */}
                    {[-0.4, 0, 0.4].map((x, i) => (
                        <group key={i}>
                            <mesh position={[x, 0.8, 0]}>
                                <cylinderGeometry args={[0.02, 0.02, 1.5]} />
                                <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} />
                            </mesh>
                            {/* Pendant sphere */}
                            <mesh position={[x, 0.3, 0]}>
                                <sphereGeometry args={[0.25, 32, 32]} />
                                <meshStandardMaterial
                                    color="#ffffff"
                                    roughness={0.2}
                                    metalness={0.1}
                                    transparent
                                    opacity={0.85}
                                />
                            </mesh>
                            {/* Inner glow */}
                            <mesh position={[x, 0.3, 0]}>
                                <sphereGeometry args={[0.22, 32, 32]} />
                                <meshStandardMaterial
                                    color="#fffacd"
                                    emissive="#fff5e1"
                                    emissiveIntensity={1.0 * dimFactor}
                                />
                            </mesh>
                            {/* Light source */}
                            <IESLight
                                position={[x, 0.3, 0]}
                                intensity={20 * dimFactor}
                                distance={8}
                                color="#fff5e1"
                                profile="table"
                            />
                        </group>
                    ))}
                </>
            )}
        </group>
    )
}
