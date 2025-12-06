"use client"

import { useState, lazy, Suspense } from "react"
import dynamic from "next/dynamic"
import { Navigation } from "./navigation"
import { ScrollIndicator } from "./scroll-indicator"
import { ErrorBoundary } from "./error-boundary"

// Lazy load heavy 3D components to improve initial load time
const StoreShowroom = dynamic(() => import("./store-showroom").then(mod => ({ default: mod.StoreShowroom })), {
  loading: () => null, // StoreShowroom has its own loading overlay
  ssr: false,
})

const ProductDetailCard = dynamic(() => import("./product-detail-card").then(mod => ({ default: mod.ProductDetailCard })), {
  ssr: false,
})

export type Lamp = {
  id: string
  name: string
  price: number
  description: string
  type: string
  colors: string[]
  features: string[]
}

export function StoreScene() {
  const [selectedLamp, setSelectedLamp] = useState<Lamp | null>(null)

  return (
    <ErrorBoundary>
      <Navigation />
      <div className="relative w-full h-screen">
        <StoreShowroom onSelectLamp={setSelectedLamp} />
        {selectedLamp && <ProductDetailCard lamp={selectedLamp} onClose={() => setSelectedLamp(null)} />}
      </div>
      <ScrollIndicator />
    </ErrorBoundary>
  )
}
