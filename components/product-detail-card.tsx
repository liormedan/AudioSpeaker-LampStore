"use client"

import type { Lamp } from "./store-scene"
import { useState } from "react"
import { Lamp3DViewer } from "./lamp-3d-viewer"

type ProductDetailCardProps = {
  lamp: Lamp
  onClose: () => void
}

export function ProductDetailCard({ lamp, onClose }: ProductDetailCardProps) {
  const [selectedColor, setSelectedColor] = useState(lamp.colors[0])
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-title"
      aria-describedby="product-description"
    >
      <div className="bg-background border border-border rounded-lg w-full max-w-lg p-4 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between sticky top-0 bg-background pb-2 z-10">
          <div className="flex-1">
            <div className="inline-block px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded mb-1" aria-label={`Product type: ${lamp.type}`}>
              {lamp.type}
            </div>
            <h2 id="product-title" className="text-xl font-bold">{lamp.name}</h2>
            <p className="text-2xl font-bold text-primary mt-1" aria-label={`Price: ${lamp.price.toLocaleString()} dollars`}>
              ${lamp.price.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors text-xl leading-none font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* 3D Viewer */}
        <Lamp3DViewer lamp={lamp} selectedColor={selectedColor} />

        {/* Description */}
        <p id="product-description" className="text-sm text-muted-foreground">{lamp.description}</p>

        {/* Color Selection */}
        <div>
          <h3 className="font-semibold mb-2 text-sm">Available Colors</h3>
          <div className="flex gap-2" role="radiogroup" aria-label="Available colors">
            {lamp.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  selectedColor === color ? "border-primary scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
                aria-pressed={selectedColor === color}
                role="radio"
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-semibold mb-2 text-sm">Features</h3>
          <ul className="space-y-1" aria-label="Product features">
            {lamp.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-0.5 text-xs" aria-hidden="true">•</span>
                <span className="text-xs text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 sticky bottom-0 bg-background pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={isFavorite}
            >
              <span aria-hidden="true">{isFavorite ? "♥" : "♡"}</span> {isFavorite ? "Saved" : "Save"}
            </button>
            <button 
              className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`Add ${lamp.name} to cart`}
            >
              <span aria-hidden="true">🛒</span> Add to Cart
            </button>
          </div>
          <button
            onClick={() => {
              // Handle purchase
              alert(`Thank you for your purchase! ${lamp.name} has been added to your order.`)
              onClose()
            }}
            className="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`Buy ${lamp.name} now for ${lamp.price.toLocaleString()} dollars`}
          >
            <span aria-hidden="true">💳</span> Buy Now - ${lamp.price.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  )
}
