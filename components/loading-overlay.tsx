"use client"

import { useState, useEffect } from "react"

type LoadingOverlayProps = {
  isLoading: boolean
  progress?: number
  message?: string
}

/**
 * Loading overlay component for texture/model loading
 * Shows progress indicator and loading message
 */
export function LoadingOverlay({ isLoading, progress = 0, message = "Loading..." }: LoadingOverlayProps) {
  const [show, setShow] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setShow(true)
    } else {
      // Delay hiding to allow smooth fade out
      const timer = setTimeout(() => setShow(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center space-y-6">
        {/* Spinner */}
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
          <div
            className="absolute inset-0 border-4 border-transparent border-t-amber-500 rounded-full animate-spin"
            style={{ animationDuration: "1s" }}
          />
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Message */}
        <p className="text-white text-lg font-medium">{message}</p>
        {progress > 0 && (
          <p className="text-gray-400 text-sm">{Math.round(progress)}%</p>
        )}
      </div>
    </div>
  )
}

