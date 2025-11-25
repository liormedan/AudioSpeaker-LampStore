"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei"
import { EffectComposer, Bloom, SSAO } from "@react-three/postprocessing"
import { StoreFurniture } from "./store-furniture"
import { LampDisplay } from "./lamp-display"
import { DimmerControl } from "./dimmer-control"
import { DynamicLighting } from "./lighting/dynamic-lighting"
import { IESLight } from "./lighting/ies-light"
import { useStoreEnvironment } from "@/hooks/use-store-environment"
import { ErrorBoundary } from "./error-boundary"
import { LoadingOverlay } from "./loading-overlay"
import { AnimatedGroup } from "./animated-group"
import { VRToggle } from "./vr-toggle"
import { PhysicsWorld } from "./physics/physics-world"
import { PhysicalLamp } from "./physics/physical-lamp"
import { ShowroomEnvironment } from "./showroom-environment"
import { ModelPreloader, useModelPreloader } from "./models/model-preloader"
import { getAllModelPaths } from "./models/model-config"
import { CeilingPendant } from "./ceiling-pendant"
import { DISPLAY_LAMPS } from "@/lib/constants"
import type { Lamp } from "./store-scene"
import type { Group } from "three"
import { Color } from "three"

// Audio Components
import { AudioProvider } from "./audio/audio-manager"
import { AudioUploader } from "./audio/audio-uploader"
import { FrequencyVisualizer } from "./audio/frequency-visualizer"
import { SoundWaveEmitter } from "./audio/sound-wave-emitter"
import { PerformanceMonitor as WavePerformanceMonitor } from "./audio/performance-monitor"
import { SoundWaveControls } from "./audio/sound-wave-controls"
import { SpeakerDirectionLines } from "./audio/speaker-direction-lines"
import { SpeakerModel } from "./models/speaker-model"
import type { SoundWave } from "./audio/wave-physics"

type StoreShowroomProps = {
  onSelectLamp: (lamp: Lamp | null) => void
}



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
  const detailLevel = distance > 10 ? "low" : "high"

  return (
    <group ref={groupRef} position={position}>
      <LampDisplay lamp={lamp} position={[0, 0, 0]} onClick={onClick} detailLevel={detailLevel} />
    </group>
  )
}

export function StoreShowroom({ onSelectLamp }: StoreShowroomProps) {
  const [darkness, setDarkness] = useState(0.9) // Start at 90% darkness (dark/night mode by default)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [physicsEnabled, setPhysicsEnabled] = useState(false) // Toggle for physics mode
  const [useInstancedRendering, setUseInstancedRendering] = useState(false) // Toggle for instanced rendering optimization
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false) // Toggle for performance monitor
  const [visualizationType, setVisualizationType] = useState<"rings" | "surfaces" | "particles" | "all">("rings")
  const [allWaves, setAllWaves] = useState<SoundWave[]>([]) // כל הגלים מכל ה-Emitters (לשימוש ב-Performance Monitor)
  const [showSpeakerDirectionLines, setShowSpeakerDirectionLines] = useState(false) // הצגת קווים מהרמקולים
  
  // Callbacks ל-onWavesChange עם useCallback כדי למנוע re-renders מיותרים
  const handleLeftSpeakerWavesChange = useCallback((waves: SoundWave[]) => {
    setAllWaves((prev) => {
      // עדכון הגלים מהרמקול השמאלי (הסרת גלים ישנים מאותו רמקול והוספת חדשים)
      const otherWaves = prev.filter(w => w.origin[0] !== -13)
      return [...otherWaves, ...waves]
    })
  }, [])
  
  const handleRightSpeakerWavesChange = useCallback((waves: SoundWave[]) => {
    setAllWaves((prev) => {
      // עדכון הגלים מהרמקול הימני (הסרת גלים ישנים מאותו רמקול והוספת חדשים)
      const otherWaves = prev.filter(w => w.origin[0] !== 13)
      return [...otherWaves, ...waves]
    })
  }, [])

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
      <AudioProvider>
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
        <SoundWaveControls
          visualizationType={visualizationType}
          onVisualizationTypeChange={setVisualizationType}
          useInstanced={useInstancedRendering}
          onUseInstancedChange={setUseInstancedRendering}
          showPerformanceMonitor={showPerformanceMonitor}
          onShowPerformanceMonitorChange={setShowPerformanceMonitor}
          showSpeakerDirectionLines={showSpeakerDirectionLines}
          onShowSpeakerDirectionLinesChange={setShowSpeakerDirectionLines}
        />
        <AudioUploader />

        <Canvas
          camera={{ position: [0, 8, 20], fov: 50 }}
          style={{ background: environment.backgroundColor }}
          shadows
        >
          {/* Performance monitoring - from @react-three/drei */}
          {/* Note: WavePerformanceMonitor is available but disabled by default */}

          {/* Adaptive performance - adjusts DPR and event handling based on FPS */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          {/* Dynamic lighting that responds to darkness level - using separated component */}
          <DynamicLighting config={{ darkness }} />

          {/* Physics World - wraps scene with physics simulation */}
          <PhysicsWorld>
            {/* Showroom Environment (Walls, Floor, Beam) */}
            <ShowroomEnvironment />

            {/* Ceiling Pendant Lights */}
            <CeilingPendant
              position={[-8, 8, 2]}
              type="minimalist"
              onSelect={onSelectLamp}
              darkness={darkness}
            />

            <CeilingPendant
              position={[0, 8, 2]}
              type="industrial"
              onSelect={onSelectLamp}
              darkness={darkness}
            />

            <CeilingPendant
              position={[8, 8, 2]}
              type="linear"
              onSelect={onSelectLamp}
              darkness={darkness}
            />

            <StoreFurniture onSelectLamp={onSelectLamp} />

            {/* Audio Speakers in Back Corners */}
            <SpeakerModel position={[-13, 0, -8]} rotation={[0, Math.PI / 4, 0]} />
            <SpeakerModel position={[13, 0, -8]} rotation={[0, -Math.PI / 4, 0]} />

            {/* Speaker Direction Lines - קווים אופקיים מכל האלמנטים של הרמקולים */}
            <SpeakerDirectionLines
              speakerPositions={[
                { position: [-13, 0, -8], rotation: [0, Math.PI / 4, 0] },
                { position: [13, 0, -8], rotation: [0, -Math.PI / 4, 0] }
              ]}
              enabled={showSpeakerDirectionLines}
            />

            {/* Sound Wave Emitters - גלי קול הנעים בחדר מכל רמקול (רוכבים על הקווים) */}
            <SoundWaveEmitter 
              position={[-13, 0, -8]}
              rotation={[0, Math.PI / 4, 0]}
              visualizationType={visualizationType}
              useInstanced={useInstancedRendering}
              onWavesChange={handleLeftSpeakerWavesChange}
            />
            <SoundWaveEmitter 
              position={[13, 0, -8]}
              rotation={[0, -Math.PI / 4, 0]}
              visualizationType={visualizationType}
              useInstanced={useInstancedRendering}
              onWavesChange={handleRightSpeakerWavesChange}
            />

            {/* Performance Monitor - מציג FPS וסטטיסטיקות גלים */}
            {showPerformanceMonitor && (
              <WavePerformanceMonitor 
                waves={allWaves}
                enabled={showPerformanceMonitor}
                position="top-right"
              />
            )}

            {/* Frequency Visualizer */}
            <FrequencyVisualizer position={[0, 5, -10]} />

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
      </AudioProvider>
    </ErrorBoundary>
  )
}
