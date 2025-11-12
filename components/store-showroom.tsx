"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Text, PerformanceMonitor, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei"
import { EffectComposer, Bloom, SSAO } from "@react-three/postprocessing"
import { StoreFurniture } from "./store-furniture"
import { LampDisplay } from "./lamp-display"
import { DimmerControl } from "./dimmer-control"
import { FloorPBRMaterial, WallPBRMaterial } from "./pbr-materials"
import { DynamicLighting } from "./lighting/dynamic-lighting"
import { useStoreEnvironment } from "@/hooks/use-store-environment"
import { ErrorBoundary } from "./error-boundary"
import { LoadingOverlay } from "./loading-overlay"
import { AnimatedGroup } from "./animated-group"
import { VRToggle } from "./vr-toggle"
import { PhysicsWorld } from "./physics/physics-world"
import { PhysicalFloor } from "./physics/physical-floor"
import { PhysicalLamp } from "./physics/physical-lamp"
import { ModelPreloader, useModelPreloader } from "./models/model-preloader"
import { getAllModelPaths } from "./models/model-config"
import type { Lamp } from "./store-scene"
import type { Group } from "three"
import { Color } from "three"

type StoreShowroomProps = {
  onSelectLamp: (lamp: Lamp | null) => void
}

const DISPLAY_LAMPS: Array<{ lamp: Lamp; position: [number, number, number] }> = [
  {
    lamp: {
      id: "1",
      name: "Modern Minimalist",
      price: 1890,
      description: "Clean and elegant table lamp with cylindrical shade and dark metal base",
      type: "Table Lamp",
      colors: ["#ffffff", "#1a1a1a", "#2a2a2a"],
      features: ["Minimalist design", "Metal construction", "Warm LED lighting", "Modern aesthetic"],
    },
    position: [-6, -0.5, 8],
  },
  {
    lamp: {
      id: "2",
      name: "Modern Arc",
      price: 1950,
      description: "Contemporary arc floor lamp with marble base",
      type: "Floor Lamp",
      colors: ["#2a2a2a", "#b8860b", "#ffffff"],
      features: ["Adjustable height", "Marble base", "Energy efficient", "360° rotation"],
    },
    position: [6, -0.5, 8],
  },
]

// Black color for SSAO
const blackColor = new Color(0, 0, 0)

// LOD wrapper component for LampDisplay - reduces detail for distant objects
function LampDisplayWithLOD({ lamp, position, onClick }: { lamp: Lamp; position: [number, number, number]; onClick: () => void }) {
  const { camera } = useThree()
  const groupRef = useRef<Group>(null)
  const [distance, setDistance] = useState(0)

  useFrame(() => {
    if (groupRef.current) {
      const dist = camera.position.distanceTo(groupRef.current.position)
      setDistance(dist)
    }
  })

  // Use lower detail for lamps far away - reduces geometry complexity
  // For now, we render all lamps at full detail, but the distance tracking is in place
  // Future optimization: implement actual LOD with different geometry levels
  return (
    <group ref={groupRef} position={position}>
      <LampDisplay lamp={lamp} position={[0, 0, 0]} onClick={onClick} />
    </group>
  )
}

export function StoreShowroom({ onSelectLamp }: StoreShowroomProps) {
  const [darkness, setDarkness] = useState(0.9) // Start at 90% darkness (dark/night mode by default)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [physicsEnabled, setPhysicsEnabled] = useState(false) // Toggle for physics mode

  // Use custom hook for environment settings
  const environment = useStoreEnvironment({ darkness })
  
  // Preload all lamp models (only if they exist in config)
  const modelPaths = getAllModelPaths()
  // Only preload if we have actual model paths (not null)
  const { isLoading: modelsLoading, progress: modelsProgress } = useModelPreloader(
    modelPaths.length > 0 ? modelPaths : []
  )

  // Track loading progress (textures + models)
  useEffect(() => {
    // Combine texture loading and model loading progress
    const totalProgress = (loadingProgress * 0.5) + (modelsProgress * 0.5)
    
    if (totalProgress >= 100 && !modelsLoading) {
      setIsLoading(false)
    }
  }, [loadingProgress, modelsProgress, modelsLoading])

  // Simulate texture loading progress (in real app, this would track actual texture loading)
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          return 100
        }
        return prev + 10
      })
    }, 200)

    return () => clearInterval(timer)
  }, [])
  
  // Model preloading is handled by useModelPreloader hook

  return (
    <ErrorBoundary>
      <LoadingOverlay isLoading={isLoading} progress={loadingProgress} message="Loading textures and models..." />
      {/* Preload models in background */}
      {modelPaths.length > 0 && (
        <ModelPreloader 
          modelPaths={modelPaths}
          onComplete={() => {
            console.log("All models preloaded")
          }}
        />
      )}
      <DimmerControl darkness={darkness} onDarknessChange={setDarkness} />
      <Canvas 
        camera={{ position: [0, 8, 20], fov: 50 }} 
        style={{ background: environment.backgroundColor }}
        shadows
      >
        {/* Performance monitoring */}
        <PerformanceMonitor />
        
        {/* Adaptive performance - adjusts DPR and event handling based on FPS */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        {/* Dynamic lighting that responds to darkness level - using separated component */}
        <DynamicLighting config={{ darkness }} />

        {/* Physics World - wraps scene with physics simulation */}
        <PhysicsWorld>
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

      <StoreFurniture onSelectLamp={onSelectLamp} />

      {DISPLAY_LAMPS.map(({ lamp, position }) => {
        // Use PhysicalLamp if physics is enabled, otherwise use regular display
        if (physicsEnabled) {
          return (
            <PhysicalLamp
              key={lamp.id}
              lamp={lamp}
              position={position}
              onClick={() => onSelectLamp(lamp)}
              interactive={true} // Allow physics interactions
            />
          )
        }
        return (
          <AnimatedGroup key={lamp.id} position={position} hoverScale={1.08} floatIntensity={0.03}>
            <LampDisplayWithLOD lamp={lamp} position={[0, 0, 0]} onClick={() => onSelectLamp(lamp)} />
          </AnimatedGroup>
        )
      })}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={35}
        maxPolarAngle={Math.PI / 2}
      />

      {/* VR Toggle - only shows if VR is supported */}
      <VRToggle />

      {/* Environment controlled by dimmer - dims as darkness increases */}
      <Environment 
        preset="city" 
        environmentIntensity={environment.environmentIntensity}
      />

      {/* Post-processing effects for realistic rendering */}
      <EffectComposer enableNormalPass={true}>
        <SSAO
          samples={31}
          radius={0.1}
          intensity={30}
          luminanceInfluence={0.6}
          color={blackColor}
        />
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
        </PhysicsWorld>
      </Canvas>
      
      {/* Physics Toggle Button - outside Canvas */}
      <button
        onClick={() => setPhysicsEnabled(!physicsEnabled)}
        className="fixed bottom-6 right-6 z-50 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-white hover:bg-black/60 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent"
        aria-label={physicsEnabled ? "Disable physics mode" : "Enable physics mode"}
      >
        {physicsEnabled ? "🔒 Lock Physics" : "⚡ Enable Physics"}
      </button>
    </ErrorBoundary>
  )
}
