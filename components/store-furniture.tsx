"use client"

import type { Lamp } from "./store-scene"
import { RealisticSofa } from "./realistic-sofa"
import { MarblePBRMaterial } from "./pbr-materials"
import { RectAreaLightComponent } from "./lighting/rect-area-light"
import { IESLight } from "./lighting/ies-light"
import { LampDisplay } from "./lamp-display"

type StoreFurnitureProps = {
  onSelectLamp: (lamp: Lamp | null) => void
}

export function StoreFurniture({ onSelectLamp }: StoreFurnitureProps) {
  const leftLamp: Lamp = {
    id: "3",
    name: "Classic Drum",
    price: 1650,
    description: "Elegant floor lamp with drum shade and brass accents",
    type: "Floor Lamp",
    colors: ["#f5f5dc", "#1a1a1a", "#b8860b"],
    features: ["Drum shade design", "Brass pole", "Decorative rings", "Warm LED lighting"],
  }

  const rightLamp: Lamp = {
    id: "4",
    name: "Arc Floor Light",
    price: 2250,
    description: "Modern arc floor lamp with adjustable arm and marble base",
    type: "Floor Lamp",
    colors: ["#2a2a2a", "#b8860b", "#ffffff"],
    features: ["Adjustable arc arm", "Marble base", "Gold accents", "Directional lighting"],
  }
  return (
    <group>
      {/* Rug */}
      <mesh position={[0, -0.485, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 12]} />
        <meshStandardMaterial color="#3d4f5c" roughness={0.9} />
      </mesh>

      {/* Main Sofa - Blue-gray - Realistic version */}
      <RealisticSofa 
        position={[0, -0.5, 0]}
        color="#5a7b8f"
      />

      {/* Coffee Table */}
      <group position={[0, -0.5, 5.4]}>
        {/* Table top - beige marble - PBR Material */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[6, 0.3, 3.6]} />
          <MarblePBRMaterial color="#d4c5b0" roughness={0.2} metalness={0.3} repeat={[1, 1]} />
        </mesh>

        {/* Brass legs */}
        {[
          [-2.7, 0.6, -1.5],
          [2.7, 0.6, -1.5],
          [-2.7, 0.6, 1.5],
          [2.7, 0.6, 1.5],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.15, 0.15, 1.2]} />
            <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Table Lamp on Coffee Table - Different design */}
        <group 
          position={[0, 1.35, 0]}
          onClick={(e) => {
            e.stopPropagation()
            onSelectLamp({
              id: "table-lamp-1",
              name: "Elegant Brass Table Lamp",
              price: 1650,
              description: "Classic table lamp with brass base and fabric shade",
              type: "Table Lamp",
              colors: ["#d4af37", "#2a2a2a", "#f5f5dc"],
              features: ["Brass base", "Fabric shade", "Warm lighting", "Classic design"],
            })
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer"
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default"
          }}
        >
          {/* Base - brass, circular/round design */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.2, 64]} />
            <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.9} />
          </mesh>

          {/* Decorative ring on base - circular (top ring only) */}
          <mesh position={[0, 0.1, 0]}>
            <torusGeometry args={[0.48, 0.02, 16, 64]} />
            <meshStandardMaterial color="#b8860b" roughness={0.2} metalness={0.95} />
          </mesh>

          {/* Pole - brass, slightly curved design */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
            <meshStandardMaterial color="#daa520" roughness={0.2} metalness={0.9} />
          </mesh>

          {/* Shade - fabric, bell-shaped (wider at bottom) */}
          <group position={[0, 1.1, 0]}>
            {/* Outer shade - fabric texture, cream color */}
            <mesh>
              <coneGeometry args={[0.5, 0.7, 32, 1, true]} />
              <meshStandardMaterial 
                color="#f5f5dc" 
                roughness={0.9} 
                metalness={0.0}
                transparent
                opacity={0.85}
                side={2}
              />
            </mesh>

            {/* Inner lining - gold/brass */}
            <mesh>
              <coneGeometry args={[0.48, 0.68, 32, 1, true]} />
              <meshStandardMaterial 
                color="#daa520" 
                emissive="#ffd700" 
                emissiveIntensity={0.3}
                roughness={0.4} 
                metalness={0.7}
                side={1}
              />
            </mesh>

            {/* Top ring - brass */}
            <mesh position={[0, 0.35, 0]}>
              <torusGeometry args={[0.49, 0.03, 16, 32]} />
              <meshStandardMaterial color="#b8860b" roughness={0.2} metalness={0.9} />
            </mesh>

            {/* Bottom ring - brass */}
            <mesh position={[0, -0.35, 0]}>
              <torusGeometry args={[0.5, 0.03, 16, 32]} />
              <meshStandardMaterial color="#b8860b" roughness={0.2} metalness={0.9} />
            </mesh>
          </group>

          {/* Light source - IES light */}
          <IESLight
            position={[0, 1.1, 0]}
            intensity={10}
            distance={10}
            color="#fff5e1"
            profile="table"
          />
          {/* Additional ambient glow */}
          <RectAreaLightComponent
            position={[0, 0.9, 0]}
            width={0.5}
            height={0.5}
            intensity={6}
            color="#fffacd"
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </group>
      </group>

      {/* Left Armchair - Wine red */}
      <group position={[-6.6, -0.5, 3]} rotation={[0, Math.PI / 4, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[2.7, 0.6, 2.7]} />
          <meshStandardMaterial color="#6b2c3e" roughness={0.6} />
        </mesh>

        {/* Back */}
        <mesh position={[0, 1.5, -1.05]}>
          <boxGeometry args={[2.7, 2.4, 0.6]} />
          <meshStandardMaterial color="#5a2333" roughness={0.6} />
        </mesh>

        {/* Armrests */}
        <mesh position={[-1.35, 0.9, 0]}>
          <boxGeometry args={[0.3, 1.2, 2.7]} />
          <meshStandardMaterial color="#5a2333" roughness={0.7} />
        </mesh>
        <mesh position={[1.35, 0.9, 0]}>
          <boxGeometry args={[0.3, 1.2, 2.7]} />
          <meshStandardMaterial color="#5a2333" roughness={0.7} />
        </mesh>
      </group>

      {/* Right Armchair - Emerald green */}
      <group position={[6.6, -0.5, 3]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[2.7, 0.6, 2.7]} />
          <meshStandardMaterial color="#2d5a4a" roughness={0.6} />
        </mesh>

        {/* Back */}
        <mesh position={[0, 1.5, -1.05]}>
          <boxGeometry args={[2.7, 2.4, 0.6]} />
          <meshStandardMaterial color="#234537" roughness={0.6} />
        </mesh>

        {/* Armrests */}
        <mesh position={[-1.35, 0.9, 0]}>
          <boxGeometry args={[0.3, 1.2, 2.7]} />
          <meshStandardMaterial color="#234537" roughness={0.7} />
        </mesh>
        <mesh position={[1.35, 0.9, 0]}>
          <boxGeometry args={[0.3, 1.2, 2.7]} />
          <meshStandardMaterial color="#234537" roughness={0.7} />
        </mesh>
      </group>

      {/* Left Floor Lamp - Drum shade style */}
      <group 
        position={[-8, -0.5, -5]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectLamp(leftLamp)
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default"
        }}
      >
        {/* Base */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Pole */}
        <mesh position={[0, 3, 0]}>
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
        <mesh position={[0, 5.7, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 1.5, 32]} />
          <meshStandardMaterial color="#f5f5dc" transparent opacity={0.9} side={2} />
        </mesh>

        {/* Inner glow */}
        <mesh position={[0, 5.7, 0]}>
          <cylinderGeometry args={[0.85, 0.85, 1.4, 32]} />
          <meshStandardMaterial color="#fffacd" emissive="#fff5e1" emissiveIntensity={0.8} />
        </mesh>

        {/* Light source - IES light for realistic pendant lamp */}
        <IESLight
          position={[0, 5.7, 0]}
          intensity={25}
          distance={12}
          color="#fff5e1"
          profile="pendant"
        />
        {/* Additional ambient glow - optimized: RectAreaLight */}
        <RectAreaLightComponent
          position={[0, 5.7, 0]}
          width={0.5}
          height={0.5}
          intensity={15}
          color="#fffacd"
          rotation={[-Math.PI / 2, 0, 0]}
        />
        
      </group>

      {/* Right Arc Floor Lamp */}
      <group 
        position={[8, -0.5, -5]}
        onClick={(e) => {
          e.stopPropagation()
          onSelectLamp(rightLamp)
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer"
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default"
        }}
      >
        {/* Base - marble */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.3]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.2} metalness={0.4} />
        </mesh>

        {/* Vertical pole */}
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 7]} />
          <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Joint sphere */}
        <mesh position={[0, 7, 0]}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial color="#daa520" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Horizontal arm with shade - rotated to point toward green armchair */}
        <group rotation={[0, (-2 * Math.PI) / 3, 0]}>
          {/* Horizontal arm */}
          <mesh position={[1.5, 7, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 3]} />
            <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Shade - cone pointing down */}
          <mesh position={[3, 6.25, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.75, 1.5, 32]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.3} side={2} />
          </mesh>

          {/* Inner gold lining */}
          <mesh position={[3, 6.25, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.7, 1.4, 32]} />
            <meshStandardMaterial color="#daa520" emissive="#ffeb3b" emissiveIntensity={0.5} side={1} />
          </mesh>

          {/* Light bulb visible */}
          <mesh position={[3, 5.8, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#fffacd" emissive="#fff9c4" emissiveIntensity={1.2} />
          </mesh>

          {/* Light source - IES light for realistic spot distribution */}
          <IESLight
            position={[3, 5.8, 0]}
            intensity={30}
            distance={15}
            color="#fff5e1"
            profile="spot"
          />
          {/* Additional ambient glow - optimized: RectAreaLight */}
          <RectAreaLightComponent
            position={[3, 5.8, 0]}
            width={0.4}
            height={0.4}
            intensity={18}
            color="#fffacd"
            rotation={[-Math.PI / 2, 0, 0]}
          />
        </group>
        
      </group>
    </group>
  )
}
