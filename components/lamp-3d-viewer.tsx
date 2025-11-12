"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { RectAreaLightComponent } from "./lighting/rect-area-light"
import { IESLight } from "./lighting/ies-light"
import type { Lamp } from "./store-scene"

type Lamp3DViewerProps = {
  lamp: Lamp
  selectedColor: string
}

function LampModel({ lamp, selectedColor }: { lamp: Lamp; selectedColor: string }) {
  // Classic Drum (id: 3)
  if (lamp.id === "3") {
    return (
      <group scale={0.5} position={[0, 0.15, 0]}>
        {/* Base - on ground */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Pole */}
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 5.7]} />
          <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Decorative rings */}
        {[1.5, 3, 4.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.15, 0.03, 16, 32]} />
            <meshStandardMaterial color="#daa520" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* Shade - drum */}
        <mesh position={[0, 5.35, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 1.5, 32]} />
          <meshStandardMaterial color={selectedColor} transparent opacity={0.9} side={2} />
        </mesh>

        {/* Inner glow - brighter in darkness */}
        <mesh position={[0, 5.35, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 1.4, 32]} />
          <meshStandardMaterial color="#fffacd" emissive="#fff5e1" emissiveIntensity={1.5} />
        </mesh>

        {/* Light source - IES light for realistic pendant lamp distribution */}
        <IESLight
          position={[0, 5.35, 0]}
          intensity={80}
          distance={20}
          color="#fff5e1"
          profile="pendant"
        />
        {/* Additional soft glow - RectAreaLight for ambient fill */}
        <RectAreaLightComponent
          position={[0, 5.35, 0]}
          width={0.6}
          height={0.6}
          intensity={25}
          color="#fffacd"
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </group>
    )
  }

  // Arc Floor Light (id: 4)
  if (lamp.id === "4") {
    return (
      <group scale={0.5} position={[0, 0.15, 0]}>
        {/* Base - marble - on ground */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.3]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.4} />
        </mesh>

        {/* Vertical pole */}
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 7]} />
          <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Joint sphere */}
        <mesh position={[0, 6.5, 0]}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial color="#daa520" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Horizontal arm with shade */}
        <group rotation={[0, (-2 * Math.PI) / 3, 0]}>
          {/* Horizontal arm */}
          <mesh position={[1.5, 6.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 3]} />
            <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Shade - cone pointing down */}
          <mesh position={[3, 5.75, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.75, 1.5, 32]} />
            <meshStandardMaterial color={selectedColor} roughness={0.3} side={2} />
          </mesh>

          {/* Inner gold lining */}
          <mesh position={[3, 5.75, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.7, 1.4, 32]} />
            <meshStandardMaterial color="#daa520" emissive="#ffeb3b" emissiveIntensity={0.5} side={1} />
          </mesh>

          {/* Light bulb visible - brighter in darkness */}
          <mesh position={[3, 5.3, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#fffacd" emissive="#fff9c4" emissiveIntensity={2.0} />
          </mesh>

          {/* Light source - IES light for realistic spot distribution */}
          <IESLight
            position={[3, 5.3, 0]}
            intensity={90}
            distance={22}
            color="#fff5e1"
            profile="spot"
          />
          {/* Additional soft glow */}
          <RectAreaLightComponent
            position={[3, 5.3, 0]}
            width={0.4}
            height={0.4}
            intensity={30}
            color="#fffacd"
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </group>
      </group>
    )
  }

  // Modern Minimalist (id: 1) - Clean modern table lamp
  if (lamp.id === "1") {
    return (
      <group scale={0.8} position={[0, 0.2, 0]}>
        {/* Circular base - dark metal, sitting on ground */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.08, 32]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Thin vertical pole - dark metal */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 1.0, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Shade - modern cylindrical design, white translucent */}
        <group position={[0, 1.2, 0]}>
          {/* Outer shade - white matte */}
          <mesh>
            <cylinderGeometry args={[0.45, 0.45, 0.6, 32]} />
            <meshStandardMaterial 
              color="#ffffff" 
              roughness={0.6} 
              metalness={0.1}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Inner glow layer */}
          <mesh>
            <cylinderGeometry args={[0.43, 0.43, 0.58, 32]} />
            <meshStandardMaterial 
              color="#fffacd" 
              emissive="#fff9c4" 
              emissiveIntensity={1.5}
              transparent
              opacity={0.7}
            />
          </mesh>

          {/* Top cap - dark metal */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.47, 0.47, 0.05, 32]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>

        {/* Warm light from inside - IES light for realistic table lamp distribution */}
        <IESLight
          position={[0, 1.2, 0]}
          intensity={80}
          distance={15}
          color="#fff5e1"
          profile="table"
        />
        <RectAreaLightComponent
          position={[0, 1.0, 0]}
          width={0.4}
          height={0.4}
          intensity={40}
          color="#fffacd"
          rotation={[-Math.PI / 2, 0, 0]}
        />

        {/* Soft glow around lamp */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.7, 16, 16]} />
          <meshBasicMaterial color="#fffacd" transparent opacity={0.2} />
        </mesh>
      </group>
    )
  }

  // Modern Arc (id: 2) - Modern LED ring table lamp
  if (lamp.id === "2") {
    return (
      <group scale={0.8} position={[0, 0.2, 0]}>
        {/* Rectangular base - wooden, sitting on ground */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.6, 0.15, 0.4]} />
          <meshStandardMaterial 
            color="#8B4513" 
            roughness={0.8} 
            metalness={0.1}
          />
        </mesh>

        {/* Wood grain texture on base */}
        <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.55, 0.01, 0.35]} />
          <meshStandardMaterial 
            color="#654321" 
            roughness={0.9} 
            metalness={0.05}
          />
        </mesh>

        {/* Small square connection block between base and ring - wooden */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.12, 0.3, 0.12]} />
          <meshStandardMaterial 
            color="#8B4513" 
            roughness={0.7} 
            metalness={0.1}
          />
        </mesh>

        {/* Large vertical circular ring - facing the viewer, sitting on base */}
        <group position={[0, 0.9, 0]} rotation={[0, 0, 0]}>
          {/* Outer metallic frame - brushed bronze/dark gold, perfect circle */}
          <mesh>
            <torusGeometry args={[0.9, 0.08, 64, 128]} />
            <meshStandardMaterial 
              color="#8B6914" 
              roughness={0.4} 
              metalness={0.8}
            />
          </mesh>

          {/* Inner LED strip - glowing halo effect, perfect circle */}
          <mesh>
            <torusGeometry args={[0.9, 0.04, 64, 128]} />
            <meshStandardMaterial 
              color="#fffacd" 
              emissive="#fff9c4" 
              emissiveIntensity={4.0}
              transparent
              opacity={0.95}
            />
          </mesh>

          {/* Additional inner glow layer for brighter effect, perfect circle */}
          <mesh>
            <torusGeometry args={[0.9, 0.06, 64, 128]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#fffacd" 
              emissiveIntensity={2.5}
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>

        {/* Warm LED light from the ring - optimized: fewer RectAreaLights for better performance */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => {
          const radius = 0.9
          const x = Math.cos(angle) * radius
          const z = Math.sin(angle) * radius
          return (
            <RectAreaLightComponent
              key={i}
              position={[x, 0.9, z]}
              width={0.3}
              height={0.1}
              intensity={60}
              color="#fff5e1"
              rotation={[0, angle + Math.PI / 2, 0]}
            />
          )
        })}
        
        {/* Additional ambient glow from ring - optimized: RectAreaLight */}
        <RectAreaLightComponent
          position={[0, 0.9, 0]}
          width={0.5}
          height={0.5}
          intensity={50}
          color="#fffacd"
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </group>
    )
  }

  // Default fallback
  return (
    <group scale={0.8} position={[0, 0.2, 0]}>
      {/* Base - on ground */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.4]} />
        <meshStandardMaterial color={selectedColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Pole */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2]} />
        <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Shade */}
      <mesh position={[0, 1.6, 0]}>
        <coneGeometry args={[0.5, 0.7, 32]} />
        <meshStandardMaterial color={selectedColor} transparent opacity={0.8} />
      </mesh>

      {/* Light - IES light for realistic table lamp distribution */}
      <IESLight
        position={[0, 1.4, 0]}
        intensity={50}
        distance={15}
        color="#fff5e1"
        profile="table"
      />
      {/* Additional soft glow */}
      <RectAreaLightComponent
        position={[0, 1.4, 0]}
        width={0.3}
        height={0.3}
        intensity={20}
        color="#fffacd"
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Ambient glow - more visible in darkness */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#ffeb3b" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export function Lamp3DViewer({ lamp, selectedColor }: Lamp3DViewerProps) {
  // Adjust height and camera for floor lamps
  const isFloorLamp = lamp.id === "2" || lamp.id === "3" || lamp.id === "4"
  const viewerHeight = isFloorLamp ? "h-64" : "h-48"
  // Move camera further back and adjust angle
  const cameraY = isFloorLamp ? 3 : 2
  const cameraZ = isFloorLamp ? 10 : 7

  return (
    <div 
      className={`w-full ${viewerHeight} rounded-lg overflow-hidden bg-black border border-border relative`}
      role="img"
      aria-label={`3D interactive viewer for ${lamp.name} lamp. Use mouse or touch to rotate and zoom.`}
    >
      <Canvas camera={{ position: [0, cameraY, cameraZ], fov: 45 }}>
        {/* Dark ambient - very low */}
        <ambientLight intensity={0.1} />
        {/* Very dim directional light */}
        <directionalLight position={[5, 5, 5]} intensity={0.2} />
        {/* Remove bright spot light */}
        
        {/* Ground plane - very dark base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
        
        {/* Dark background walls for depth */}
        <mesh rotation={[0, 0, 0]} position={[0, 5, -5]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        <LampModel lamp={lamp} selectedColor={selectedColor} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={isFloorLamp ? 6 : 5}
          maxDistance={isFloorLamp ? 14 : 10}
          autoRotate={false}
        />
        
        {/* No environment - pure darkness */}
      </Canvas>
    </div>
  )
}

