"use client"

export function ScrollIndicator() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 animate-bounce">
      <span className="text-xs text-white/80 uppercase tracking-wider drop-shadow-lg font-medium">
        Scroll to explore
      </span>
      <div className="w-7 h-11 border-2 border-white/40 rounded-full flex items-start justify-center p-2 bg-black/10 backdrop-blur-sm shadow-lg">
        <div className="w-1.5 h-3 bg-white/80 rounded-full shadow-lg" />
      </div>
    </div>
  )
}
