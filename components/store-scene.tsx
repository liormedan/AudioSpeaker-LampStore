"use client"

import { StoreShowroom } from "./store-showroom"
import { ProductDetailCard } from "./product-detail-card"
import { useState } from "react"
import { Navigation } from "./navigation"
import { ScrollIndicator } from "./scroll-indicator"

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
    <>
      <Navigation />
      <div className="relative w-full h-screen">
        <StoreShowroom onSelectLamp={setSelectedLamp} />
        {selectedLamp && <ProductDetailCard lamp={selectedLamp} onClose={() => setSelectedLamp(null)} />}
      </div>
      <ScrollIndicator />
    </>
  )
}
