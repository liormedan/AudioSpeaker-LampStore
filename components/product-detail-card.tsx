"use client"

import type { Lamp } from "./store-scene"
import { useState } from "react"

type ProductDetailCardProps = {
  lamp: Lamp
  onClose: () => void
}

export function ProductDetailCard({ lamp, onClose }: ProductDetailCardProps) {
  const [selectedColor, setSelectedColor] = useState(lamp.colors[0])
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-4 z-50">
      <div className="bg-background border border-border rounded-lg w-full max-w-2xl p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-block px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded mb-2">
              {lamp.type}
            </div>
            <h2 className="text-2xl font-bold">{lamp.name}</h2>
            <p className="text-3xl font-bold text-primary mt-2">${lamp.price.toLocaleString()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Description */}
        <p className="text-muted-foreground">{lamp.description}</p>

        {/* Color Selection */}
        <div>
          <h3 className="font-semibold mb-3">Available Colors</h3>
          <div className="flex gap-2">
            {lamp.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color ? "border-primary scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-semibold mb-3">Features</h3>
          <ul className="space-y-2">
            {lamp.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            {isFavorite ? "♥" : "♡"} {isFavorite ? "Saved" : "Save"}
          </button>
          <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
