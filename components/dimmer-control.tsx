"use client"

import { useState, useRef, useEffect } from "react"

type DimmerControlProps = {
  darkness: number // 0 = bright, 1 = dark
  onDarknessChange: (darkness: number) => void
}

export function DimmerControl({ darkness, onDarknessChange }: DimmerControlProps) {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

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

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2">
      {/* Label */}
      <div className="text-white text-sm font-medium opacity-80">
        {percentage}%
      </div>

      {/* Slider Track */}
      <div
        ref={sliderRef}
        className="relative w-12 h-64 bg-gray-800 rounded-full border-2 border-gray-700 cursor-pointer shadow-lg select-none"
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {/* Active Track (darkness indicator) - fills from top when dark */}
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400 rounded-full transition-all duration-200"
          style={{ height: `${darkness * 100}%` }}
        />

        {/* Slider Handle */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full border-2 border-gray-400 shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110"
          style={{
            top: `calc(${darkness * 100}% - 20px)`,
          }}
        >
          {/* Inner circle */}
          <div className="absolute inset-2 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full" />
        </div>

        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((value) => (
          <div
            key={value}
            className="absolute left-0 w-full h-0.5 bg-gray-600 opacity-50"
            style={{ bottom: `${value * 100}%` }}
          />
        ))}
      </div>

      {/* Icons */}
      <div className="flex flex-col items-center gap-1 text-white opacity-60 text-xs">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      </div>
    </div>
  )
}

