"use client"

import { useState } from "react"
import { Waves, Monitor, Zap, Eye, Navigation } from "lucide-react"

type VisualizationType = "rings" | "surfaces" | "particles" | "all"

interface SoundWaveControlsProps {
  visualizationType: VisualizationType
  onVisualizationTypeChange: (type: VisualizationType) => void
  useInstanced: boolean
  onUseInstancedChange: (enabled: boolean) => void
  showPerformanceMonitor: boolean
  onShowPerformanceMonitorChange: (enabled: boolean) => void
  showSpeakerDirectionLines: boolean
  onShowSpeakerDirectionLinesChange: (enabled: boolean) => void
  position?: "fixed" | "relative" | "absolute"
  className?: string
}

const VISUALIZATION_OPTIONS: { value: VisualizationType; label: string; icon: React.ReactNode }[] = [
  { value: "rings", label: "Rings", icon: <Waves size={16} /> },
  { value: "surfaces", label: "Surfaces", icon: <Eye size={16} /> },
  { value: "particles", label: "Particles", icon: <Zap size={16} /> },
  { value: "all", label: "All", icon: <Waves size={16} /> },
]

export function SoundWaveControls({
  visualizationType,
  onVisualizationTypeChange,
  useInstanced,
  onUseInstancedChange,
  showPerformanceMonitor,
  onShowPerformanceMonitorChange,
  showSpeakerDirectionLines,
  onShowSpeakerDirectionLinesChange,
  position = "fixed",
  className = "",
}: SoundWaveControlsProps) {
  const positionClass =
    position === "fixed"
      ? "fixed left-6 top-1/2 -translate-y-1/2 z-50"
      : position === "absolute"
      ? "absolute left-2 top-1/2 -translate-y-1/2 z-10"
      : "relative"

  return (
    <div
      className={`${positionClass} flex flex-col items-center gap-3 bg-black/60 backdrop-blur-md rounded-lg p-4 border border-white/10 ${className}`}
      role="group"
      aria-label="Sound wave visualization controls"
    >
      {/* Title */}
      <div className="text-white text-xs font-semibold mb-1">Sound Waves</div>

      {/* Visualization Type Selector */}
      <div className="flex flex-col gap-2 w-full">
        <div className="text-white/70 text-[10px] uppercase tracking-wide">Visualization</div>
        <div className="grid grid-cols-2 gap-1.5">
          {VISUALIZATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onVisualizationTypeChange(option.value)}
              className={`flex flex-col items-center gap-1 p-2 rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent ${
                visualizationType === option.value
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
              aria-label={`Set visualization to ${option.label}`}
              aria-pressed={visualizationType === option.value}
              title={option.label}
            >
              {option.icon}
              <span className="text-[10px]">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-2 w-full pt-2 border-t border-white/10">
        {/* Instanced Rendering Toggle */}
        <button
          onClick={() => onUseInstancedChange(!useInstanced)}
          className={`flex items-center justify-between gap-2 p-2 rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent ${
            useInstanced
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 border border-transparent"
          }`}
          aria-label={`${useInstanced ? "Disable" : "Enable"} instanced rendering`}
          aria-pressed={useInstanced}
          title="Instanced Rendering (Performance)"
        >
          <div className="flex items-center gap-1.5">
            <Zap size={14} />
            <span className="text-[10px]">Instanced</span>
          </div>
          <div
            className={`w-3 h-3 rounded-full transition-all ${
              useInstanced ? "bg-green-400" : "bg-white/30"
            }`}
          />
        </button>

        {/* Performance Monitor Toggle */}
        <button
          onClick={() => onShowPerformanceMonitorChange(!showPerformanceMonitor)}
          className={`flex items-center justify-between gap-2 p-2 rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent ${
            showPerformanceMonitor
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 border border-transparent"
          }`}
          aria-label={`${showPerformanceMonitor ? "Hide" : "Show"} performance monitor`}
          aria-pressed={showPerformanceMonitor}
          title="Performance Monitor"
        >
          <div className="flex items-center gap-1.5">
            <Monitor size={14} />
            <span className="text-[10px]">Monitor</span>
          </div>
          <div
            className={`w-3 h-3 rounded-full transition-all ${
              showPerformanceMonitor ? "bg-blue-400" : "bg-white/30"
            }`}
          />
        </button>

        {/* Speaker Direction Lines Toggle */}
        <button
          onClick={() => onShowSpeakerDirectionLinesChange(!showSpeakerDirectionLines)}
          className={`flex items-center justify-between gap-2 p-2 rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent ${
            showSpeakerDirectionLines
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-white/10 text-white/70 hover:bg-white/20 border border-transparent"
          }`}
          aria-label={`${showSpeakerDirectionLines ? "Hide" : "Show"} speaker direction lines`}
          aria-pressed={showSpeakerDirectionLines}
          title="Speaker Direction Lines"
        >
          <div className="flex items-center gap-1.5">
            <Navigation size={14} />
            <span className="text-[10px]">Direction</span>
          </div>
          <div
            className={`w-3 h-3 rounded-full transition-all ${
              showSpeakerDirectionLines ? "bg-cyan-400" : "bg-white/30"
            }`}
          />
        </button>
      </div>
    </div>
  )
}

