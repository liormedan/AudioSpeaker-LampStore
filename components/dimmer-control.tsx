"use client"

import { useState, useRef, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

type DimmerControlProps = {
  darkness: number // 0 = bright, 1 = dark
  onDarknessChange: (darkness: number) => void
  position?: "fixed" | "relative" | "absolute" // Positioning type
  className?: string // Additional className
}

type TimePreset = "day" | "night" | "custom"

const TIME_PRESETS: Record<TimePreset, number> = {
  day: 0.0, // Very bright (0 = maximum brightness)
  night: 0.9,
  custom: -1, // Custom means use current darkness value
}

export function DimmerControl({ darkness, onDarknessChange, position = "fixed", className = "" }: DimmerControlProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [activePreset, setActivePreset] = useState<TimePreset>("custom")
  const sliderRef = useRef<HTMLDivElement>(null)

  // Determine active preset based on current darkness value
  useEffect(() => {
    const closestPreset = Object.entries(TIME_PRESETS).reduce((closest, [preset, value]) => {
      if (preset === "custom") return closest
      const currentDiff = Math.abs(darkness - TIME_PRESETS[closest as TimePreset])
      const newDiff = Math.abs(darkness - value)
      return newDiff < currentDiff ? (preset as TimePreset) : closest
    }, "day" as TimePreset)

    // Only update if significantly different (more than 0.1)
    if (Math.abs(darkness - TIME_PRESETS[closestPreset]) < 0.1) {
      setActivePreset(closestPreset)
    } else {
      setActivePreset("custom")
    }
  }, [darkness])

  const handlePresetClick = (preset: TimePreset) => {
    if (preset !== "custom" && TIME_PRESETS[preset] !== undefined) {
      onDarknessChange(TIME_PRESETS[preset])
      setActivePreset(preset)
    }
  }

  const calculateDarkness = (clientY: number) => {
    if (!sliderRef.current) return 0.5
    const rect = sliderRef.current.getBoundingClientRect()
    const y = clientY - rect.top
    // Inverted: top = bright (darkness low), bottom = dark (darkness high)
    const percentage = Math.max(0, Math.min(1, y / rect.height))
    return percentage
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    const newDarkness = calculateDarkness(e.clientY)
    onDarknessChange(newDarkness)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newDarkness = calculateDarkness(e.clientY)
        onDarknessChange(newDarkness)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, onDarknessChange])

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      const newDarkness = calculateDarkness(e.clientY)
      onDarknessChange(newDarkness)
    }
  }

  const percentage = Math.round(darkness * 100)

  const positionClass = position === "fixed" ? "fixed right-6 top-1/2 -translate-y-1/2 z-50" : position === "absolute" ? "absolute right-2 top-1/2 -translate-y-1/2 z-10" : "relative"

  return (
    <div
      className={`${positionClass} flex flex-col items-center gap-2 ${className}`}
      role="group"
      aria-label="Lighting control"
    >
      {/* Slider Control */}
      <div
        className="relative h-48 w-8 bg-black/40 backdrop-blur-md rounded-full border border-white/10 overflow-hidden cursor-pointer touch-none"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        role="slider"
        aria-label="Light dimmer"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-orientation="vertical"
        tabIndex={0}
      >
        {/* Fill - Light level (Top=Full/Bright, Bottom=Empty/Dark) */}
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-75 ease-out opacity-80"
          style={{ height: `${(1 - darkness) * 100}%` }}
        />

        {/* Thumb/Indicator */}
        <div
          className="absolute left-1 right-1 h-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-full transition-all duration-75 ease-out pointer-events-none z-10"
          style={{ top: `${darkness * 100}%`, transform: 'translateY(-50%)' }}
        />

        {/* Icons */}
        <div className="absolute top-3 left-0 right-0 flex justify-center pointer-events-none z-20 mix-blend-difference">
          <Sun size={14} className="text-white" />
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none opacity-50 z-20">
          <Moon size={14} className="text-indigo-200" />
        </div>
      </div>

      {/* Percentage Label */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md text-white text-xs font-medium py-1 px-2 rounded border border-white/10 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {Math.round((1 - darkness) * 100)}% Light
      </div>

      {/* Time Presets - Only buttons, no slider */}
      <div className="flex flex-col gap-2 bg-black/40 backdrop-blur-md rounded-lg p-2 border border-white/10" role="group" aria-label="Time presets">
        <button
          onClick={() => handlePresetClick("day")}
          className={`p-2 rounded transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent ${activePreset === "day"
            ? "bg-amber-500 text-white"
            : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          aria-label="Set lighting to day mode"
          aria-pressed={activePreset === "day"}
          title="Day"
        >
          <Sun size={16} aria-hidden="true" />
        </button>
        <button
          onClick={() => handlePresetClick("night")}
          className={`p-2 rounded transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent ${activePreset === "night"
            ? "bg-amber-500 text-white"
            : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          aria-label="Set lighting to night mode"
          aria-pressed={activePreset === "night"}
          title="Night"
        >
          <Moon size={16} className="fill-current" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

