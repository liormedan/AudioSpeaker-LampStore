"use client"

import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react"

type AudioContextType = {
  isReady: boolean
  isPlaying: boolean
  volume: number
  duration: number
  currentTime: number
  audioData: Uint8Array
  loadAudio: (file: File) => Promise<void>
  togglePlay: () => void
  setVolume: (val: number) => void
  seek: (time: number) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.5)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  // Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  
  // Playback state refs
  const startTimeRef = useRef<number>(0)
  const pauseTimeRef = useRef<number>(0)
  const animationFrameRef = useRef<number>(0)

  // Frequency data
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0))

  // Initialize AudioContext
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    audioContextRef.current = new AudioContextClass()
    
    // Create Gain Node
    gainNodeRef.current = audioContextRef.current.createGain()
    gainNodeRef.current.gain.value = volume
    gainNodeRef.current.connect(audioContextRef.current.destination)

    // Create Analyser Node
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 256 // Resolution of bars
    analyserRef.current.connect(gainNodeRef.current)
    
    setAudioData(new Uint8Array(analyserRef.current.frequencyBinCount))

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  // Update volume
  const setVolume = (val: number) => {
    setVolumeState(val)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = val
    }
  }

  // Load Audio File
  const loadAudio = async (file: File) => {
    if (!audioContextRef.current) return

    // Stop current if playing
    if (isPlaying) {
      stop()
    }

    const arrayBuffer = await file.arrayBuffer()
    const decodedBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
    
    audioBufferRef.current = decodedBuffer
    setDuration(decodedBuffer.duration)
    setCurrentTime(0)
    pauseTimeRef.current = 0
    setIsReady(true)
  }

  // Play Audio
  const play = () => {
    if (!audioContextRef.current || !audioBufferRef.current || !gainNodeRef.current || !analyserRef.current) return

    // Resume context if suspended (browser policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    const source = audioContextRef.current.createBufferSource()
    source.buffer = audioBufferRef.current
    source.connect(analyserRef.current)
    
    sourceNodeRef.current = source

    // Calculate start time
    const offset = pauseTimeRef.current
    startTimeRef.current = audioContextRef.current.currentTime - offset
    
    source.start(0, offset)
    setIsPlaying(true)

    // Start analysis loop
    updateAnalysis()
    
    source.onended = () => {
      // Only reset if we reached the end naturally (not stopped manually)
      // We can check this by comparing currentTime to duration roughly
      // But for simplicity, we'll just handle the loop/stop logic elsewhere or let it stop
    }
  }

  // Stop/Pause Audio
  const stop = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop()
        sourceNodeRef.current.disconnect()
      } catch (e) {
        // Ignore error if already stopped
      }
      sourceNodeRef.current = null
    }
    
    // Save pause time
    if (audioContextRef.current) {
      pauseTimeRef.current = audioContextRef.current.currentTime - startTimeRef.current
    }
    
    setIsPlaying(false)
    cancelAnimationFrame(animationFrameRef.current)
  }

  const togglePlay = () => {
    if (isPlaying) {
      stop()
    } else {
      play()
    }
  }

  const seek = (time: number) => {
    const wasPlaying = isPlaying
    if (isPlaying) {
      stop()
    }
    pauseTimeRef.current = time
    setCurrentTime(time)
    if (wasPlaying) {
      play()
    }
  }

  // Analysis Loop
  const updateAnalysis = () => {
    if (!analyserRef.current || !audioContextRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)
    setAudioData(dataArray)

    // Update current time
    if (isPlaying) {
      const current = audioContextRef.current.currentTime - startTimeRef.current
      if (current >= duration) {
        stop()
        pauseTimeRef.current = 0
        setCurrentTime(0)
      } else {
        setCurrentTime(current)
        animationFrameRef.current = requestAnimationFrame(updateAnalysis)
      }
    }
  }

  return (
    <AudioContext.Provider
      value={{
        isReady,
        isPlaying,
        volume,
        duration,
        currentTime,
        audioData,
        loadAudio,
        togglePlay,
        setVolume,
        seek
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}
