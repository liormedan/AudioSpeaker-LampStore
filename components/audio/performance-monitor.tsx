"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import type { SoundWave } from "./wave-physics"

interface PerformanceMonitorProps {
  waves?: SoundWave[]
  enabled?: boolean
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

/**
 * PerformanceMonitor - מעקב אחר ביצועי מערכת גלי הקול
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 7.3
 */
export function PerformanceMonitor({ 
  waves = [], 
  enabled = false,
  position = "top-left"
}: PerformanceMonitorProps) {
  const { size } = useThree()
  const [fps, setFps] = useState(60)
  const [waveCount, setWaveCount] = useState(0)
  const [avgIntensity, setAvgIntensity] = useState(0)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    if (!enabled) return

    frameCount.current++
    const now = performance.now()
    const delta = now - lastTime.current

    // עדכון FPS כל שנייה
    if (delta >= 1000) {
      const currentFps = Math.round((frameCount.current * 1000) / delta)
      setFps(currentFps)
      frameCount.current = 0
      lastTime.current = now
    }

    // עדכון סטטיסטיקות (אם יש גלים)
    if (waves && waves.length > 0) {
      setWaveCount(waves.length)
      const avg = waves.reduce((sum, w) => sum + w.intensity, 0) / waves.length
      setAvgIntensity(Math.round(avg * 100) / 100)
    } else {
      setWaveCount(0)
      setAvgIntensity(0)
    }
  })

  if (!enabled) return null

  // מיקום על המסך (מיקום בתוך Canvas - ממיר מ-pixels ל-world coordinates)
  // נשתמש ב-camera projection כדי למקם את ה-HTML בצורה נכונה
  const aspect = size.width / size.height
  const cameraDistance = 20 // מרחק מהמצלמה
  
  // חישוב מיקום ב-world coordinates
  const positionMap = {
    "top-left": { x: -aspect * cameraDistance * 0.4, y: cameraDistance * 0.4, z: -cameraDistance },
    "top-right": { x: aspect * cameraDistance * 0.4, y: cameraDistance * 0.4, z: -cameraDistance },
    "bottom-left": { x: -aspect * cameraDistance * 0.4, y: -cameraDistance * 0.4, z: -cameraDistance },
    "bottom-right": { x: aspect * cameraDistance * 0.4, y: -cameraDistance * 0.4, z: -cameraDistance },
  }

  const pos = positionMap[position]

  // צבע FPS לפי ביצועים
  const fpsColor = fps >= 55 ? "text-green-400" : fps >= 30 ? "text-yellow-400" : "text-red-400"

  return (
    <Html position={[pos.x, pos.y, pos.z]} transform occlude style={{ pointerEvents: "none" }}>
      <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white text-xs font-mono">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-sm mb-1">Performance Monitor</div>
          <div className={`${fpsColor}`}>
            FPS: <span className="font-bold">{fps}</span>
          </div>
          {waves && waves.length > 0 && (
            <>
              <div className="text-white/80">
                Waves: <span className="font-bold">{waveCount}</span> / {waves.length}
              </div>
              <div className="text-white/80">
                Avg Intensity: <span className="font-bold">{avgIntensity}</span>
              </div>
            </>
          )}
          <div className="text-white/60 text-[10px] mt-1">
            {fps >= 55 ? "✓ Excellent" : fps >= 30 ? "⚠ Good" : "✗ Poor"}
          </div>
        </div>
      </div>
    </Html>
  )
}

