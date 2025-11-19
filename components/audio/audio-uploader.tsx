"use client"

import { useAudio } from "./audio-manager"
import { Upload, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { useRef } from "react"

export function AudioUploader() {
    const {
        isReady,
        isPlaying,
        volume,
        duration,
        currentTime,
        loadAudio,
        togglePlay,
        setVolume,
        seek
    } = useAudio()

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            loadAudio(file)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white w-[400px] z-50 shadow-2xl">
            <div className="flex flex-col gap-4">
                {/* Top Row: Controls */}
                <div className="flex items-center justify-between gap-4">
                    {/* Upload Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Upload Audio"
                    >
                        <Upload size={20} />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        disabled={!isReady}
                        className={`p-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2 group">
                        <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="p-1">
                            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                </div>

                {/* Bottom Row: Seek Bar */}
                <div className="flex items-center gap-3 text-xs font-medium text-white/60">
                    <span className="w-10 text-right">{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={(e) => seek(parseFloat(e.target.value))}
                        disabled={!isReady}
                        className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer disabled:opacity-50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                    <span className="w-10">{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    )
}
