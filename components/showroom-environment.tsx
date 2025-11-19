"use client"

import { Text } from "@react-three/drei"
import { FloorPBRMaterial, WallPBRMaterial } from "./pbr-materials"
import { PhysicalFloor } from "./physics/physical-floor"

export function ShowroomEnvironment() {
    return (
        <>
            {/* Physical Floor - collision surface */}
            <PhysicalFloor />

            {/* Floor - PBR Material (visual) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                <planeGeometry args={[40, 40]} />
                <FloorPBRMaterial color="#4a3728" roughness={0.8} repeat={[6, 6]} />
            </mesh>

            {/* Back Wall - PBR Material */}
            <mesh position={[0, 5, -10]}>
                <planeGeometry args={[40, 20]} />
                <WallPBRMaterial color="#2a3439" roughness={0.9} repeat={[1, 1]} />
            </mesh>

            {/* Side Walls - PBR Material */}
            <mesh position={[-15, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[40, 20]} />
                <WallPBRMaterial color="#2a3439" roughness={0.9} repeat={[1, 1]} />
            </mesh>
            <mesh position={[15, 5, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[40, 20]} />
                <WallPBRMaterial color="#2a3439" roughness={0.9} repeat={[1, 1]} />
            </mesh>

            <Text position={[0, 8, -9.9]} fontSize={1.5} color="#d4af37" anchorX="center" anchorY="middle">
                LUMIÈRE
            </Text>
            <Text position={[0, 6.8, -9.9]} fontSize={0.4} color="#c0c0c0" anchorX="center" anchorY="middle">
                Luxury Lighting Collection
            </Text>

            {/* Wooden Beam for Ceiling Pendant Lights */}
            <group position={[0, 9.5, 2]}>
                {/* Main beam - wooden texture */}
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[18, 0.3, 0.4]} />
                    <meshStandardMaterial
                        color="#8b6f47"
                        roughness={0.9}
                        metalness={0.1}
                    />
                </mesh>
                {/* Wood grain texture - subtle lines */}
                <mesh position={[0, 0.16, 0]} receiveShadow>
                    <boxGeometry args={[18, 0.02, 0.4]} />
                    <meshStandardMaterial
                        color="#6b5537"
                        roughness={0.95}
                        metalness={0.0}
                        transparent
                        opacity={0.3}
                    />
                </mesh>
                {/* Bottom edge detail */}
                <mesh position={[0, -0.16, 0]} castShadow>
                    <boxGeometry args={[18, 0.02, 0.42]} />
                    <meshStandardMaterial
                        color="#5a4a2f"
                        roughness={0.8}
                        metalness={0.2}
                    />
                </mesh>
            </group>
        </>
    )
}
