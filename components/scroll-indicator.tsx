"use client"

import { useState, useEffect } from "react"

export function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let interactionTimeout: NodeJS.Timeout

    const handleScroll = () => {
      // Hide immediately when user scrolls
      setIsVisible(false)
      setHasInteracted(true)
      
      // Clear any existing timeout
      clearTimeout(scrollTimeout)
    }

    const handleMouseMove = () => {
      // Hide after a short delay when user moves mouse (indicates they're exploring)
      if (!hasInteracted) {
        interactionTimeout = setTimeout(() => {
          setIsVisible(false)
          setHasInteracted(true)
        }, 2000) // Hide after 2 seconds of mouse movement
      }
    }

    const handleTouchStart = () => {
      // Hide immediately on touch (mobile)
      setIsVisible(false)
      setHasInteracted(true)
    }

    // Listen to scroll events
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("wheel", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })

    // Auto-hide after 5 seconds even if no interaction
    const autoHideTimeout = setTimeout(() => {
      setIsVisible(false)
      setHasInteracted(true)
    }, 5000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("wheel", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchstart", handleTouchStart)
      clearTimeout(scrollTimeout)
      clearTimeout(interactionTimeout)
      clearTimeout(autoHideTimeout)
    }
  }, [hasInteracted])

  // Don't render if not visible
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 animate-bounce transition-opacity duration-500">
      <span className="text-xs text-white/80 uppercase tracking-wider drop-shadow-lg font-medium">
        Scroll to explore
      </span>
      <div className="w-7 h-11 border-2 border-white/40 rounded-full flex items-start justify-center p-2 bg-black/10 backdrop-blur-sm shadow-lg">
        <div className="w-1.5 h-3 bg-white/80 rounded-full shadow-lg" />
      </div>
    </div>
  )
}
