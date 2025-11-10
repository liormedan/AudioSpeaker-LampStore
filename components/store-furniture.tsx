"use client"

export function StoreFurniture() {
  return (
    <group>
      {/* Rug */}
      <mesh position={[0, -0.485, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 12]} />
        <meshStandardMaterial color="#3d4f5c" roughness={0.9} />
      </mesh>

      {/* Main Sofa - Blue-gray */}
      <group position={[0, -0.5, 0]}>
        {/* Sofa base */}
        <mesh position={[0, 0.6, 0]}>
          <boxGeometry args={[16.5, 1.2, 3]} />
          <meshStandardMaterial color="#5a7b8f" roughness={0.7} />
        </mesh>

        {/* Sofa back cushions */}
        {[-4.5, 0, 4.5].map((x, i) => (
          <mesh key={i} position={[x, 1.8, -0.9]}>
            <boxGeometry args={[4.8, 2.4, 0.6]} />
            <meshStandardMaterial color="#4a6b7f" roughness={0.6} />
          </mesh>
        ))}

        {/* Seat cushions */}
        {[-4.5, 0, 4.5].map((x, i) => (
          <mesh key={i} position={[x, 0.9, 0.3]}>
            <boxGeometry args={[4.8, 0.6, 2.4]} />
            <meshStandardMaterial color="#638ca1" roughness={0.6} />
          </mesh>
        ))}

        {/* Armrests */}
        <mesh position={[-8.25, 0.9, 0]}>
          <boxGeometry args={[0.75, 1.8, 3]} />
          <meshStandardMaterial color="#4a6b7f" roughness={0.7} />
        </mesh>
        <mesh position={[8.25, 0.9, 0]}>
          <boxGeometry args={[0.75, 1.8, 3]} />
          <meshStandardMaterial color="#4a6b7f" roughness={0.7} />
        </mesh>
      </group>

      {/* Coffee Table */}
      <group position={[0, -0.5, 5.4]}>
        {/* Table top - beige marble */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[6, 0.3, 3.6]} />
          <meshStandardMaterial color="#d4c5b0" roughness={0.2} metalness={0.3} />
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
      <group position={[-8, -0.5, -5]}>
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

        {/* Light source */}
        <pointLight position={[0, 5.7, 0]} intensity={150} distance={15} color="#fff5e1" />
      </group>

      {/* Right Arc Floor Lamp */}
      <group position={[8, -0.5, -5]}>
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

          {/* Light source */}
          <pointLight position={[3, 5.8, 0]} intensity={180} distance={18} color="#fff5e1" />
        </group>
      </group>
    </group>
  )
}
