"use client"

import { useEffect, useState } from "react"
import { useThree } from "@react-three/fiber"
import { createPortal } from "react-dom"

type VRToggleProps = {
  className?: string
}

/**
 * Internal VR Toggle component - must be used inside Canvas
 * Uses useThree to access the renderer
 */
function VRToggleInternal({ className = "" }: VRToggleProps) {
  const { gl } = useThree()
  const [isSupported, setIsSupported] = useState(false)
  const [isPresenting, setIsPresenting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if WebXR is supported
    if (typeof navigator !== "undefined" && navigator.xr) {
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        setIsSupported(supported)
      })
    }

    // Listen for session end
    const handleSessionEnd = () => {
      setIsPresenting(false)
    }

    if (gl.xr) {
      gl.xr.addEventListener("sessionend", handleSessionEnd)
    }

    return () => {
      if (gl.xr) {
        gl.xr.removeEventListener("sessionend", handleSessionEnd)
      }
    }
  }, [gl])

  const handleClick = async () => {
    if (!gl.xr || !isSupported || typeof navigator === "undefined" || !navigator.xr) return

    try {
      if (isPresenting) {
        // Exit VR
        const session = gl.xr.getSession()
        if (session) {
          await session.end()
        }
      } else {
        // Enter VR
        const session = await navigator.xr.requestSession("immersive-vr", {
          requiredFeatures: ["local-floor"],
        })
        await gl.xr.setSession(session)
        setIsPresenting(true)
      }
    } catch (error) {
      console.error("Failed to toggle VR:", error)
      setIsPresenting(false)
    }
  }

  // Don't render if VR is not supported or not mounted
  if (!isSupported || !mounted) {
    return null
  }

  const button = (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 left-6 z-50 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2 text-white hover:bg-black/60 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-transparent ${className}`}
      aria-label={isPresenting ? "Exit VR mode" : "Enter VR mode"}
    >
      {isPresenting ? "Exit VR" : "Enter VR"}
    </button>
  )

  // Render button outside Canvas using portal
  return mounted && typeof document !== "undefined"
    ? createPortal(button, document.body)
    : null
}

/**
 * VR/AR Toggle component - must be used inside Canvas
 * Allows users to enter/exit VR mode using WebXR API
 */
export function VRToggle(props: VRToggleProps) {
  return <VRToggleInternal {...props} />
}

