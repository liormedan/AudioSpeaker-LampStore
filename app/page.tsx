import { lazy, Suspense } from "react"
import dynamic from "next/dynamic"

// Lazy load the heavy 3D scene component to improve initial page load
const StoreScene = dynamic(() => import("@/components/store-scene").then(mod => ({ default: mod.StoreScene })), {
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-[#1a1d23]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">Loading LUMIÈRE...</p>
      </div>
    </div>
  ),
  ssr: false, // Disable SSR for 3D components as they require browser APIs
})

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-[#1a1d23]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading LUMIÈRE...</p>
        </div>
      </div>
    }>
      <StoreScene />
    </Suspense>
  )
}
