import type { Lamp } from "@/components/store-scene"

export const DISPLAY_LAMPS: Array<{ lamp: Lamp; position: [number, number, number] }> = [
    {
        lamp: {
            id: "1",
            name: "Modern Minimalist",
            price: 189,
            description: "Clean and elegant table lamp with cylindrical shade and dark metal base",
            type: "Table Lamp",
            colors: ["#ffffff", "#1a1a1a", "#2a2a2a"],
            features: ["Minimalist design", "Metal construction", "Warm LED lighting", "Modern aesthetic"],
        },
        position: [-6, -0.5, 8],
    },
    {
        lamp: {
            id: "2",
            name: "Modern Arc",
            price: 195,
            description: "Contemporary arc floor lamp with marble base",
            type: "Floor Lamp",
            colors: ["#2a2a2a", "#b8860b", "#ffffff"],
            features: ["Adjustable height", "Marble base", "Energy efficient", "360° rotation"],
        },
        position: [6, -0.5, 8],
    },
]
