# LUMIÈRE - Luxury Lighting Collection

A modern 3D e-commerce showcase for premium lighting fixtures built with Next.js, React Three Fiber, and Three.js.

## Features

- 🎨 **3D Product Visualization** - Interactive 3D models of luxury lamps
- 💡 **Realistic Lighting** - IES lights, RectAreaLights, and dynamic lighting controls
- ⚡ **Physics Simulation** - Optional physics interactions with Rapier
- 🎯 **High-Poly Models** - Support for GLB/GLTF models with preloading
- 🌐 **VR Support** - WebXR integration for immersive experiences
- ♿ **Accessible** - Full ARIA labels and keyboard navigation
- 🔍 **SEO Optimized** - Comprehensive metadata and Open Graph tags

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
lamp-shop/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   └── contact/           # Contact page
├── components/            # React components
│   ├── lighting/          # Lighting components (IES, RectArea, Dynamic)
│   ├── models/            # 3D model components (GLB/GLTF)
│   ├── physics/           # Physics components (Rapier)
│   └── ...                # Other components
├── hooks/                 # Custom React hooks
│   ├── use-model-loader.ts
│   ├── use-lamp-lighting.ts
│   └── use-store-environment.ts
├── public/                # Static assets
│   ├── models/            # GLB/GLTF model files
│   ├── textures/          # PBR texture maps
│   └── hdr/               # HDRI environment maps
└── lib/                   # Utility functions
```

## Adding 3D Models

To add GLB/GLTF models for lamps:

1. Place model files in `public/models/`
2. Update `components/models/model-config.ts` with model paths:

```typescript
export const LAMP_MODELS: Record<string, LampModelConfig> = {
  "1": {
    id: "1",
    modelPath: "/models/lamp-modern-minimalist.glb",
    scale: 1,
    lightingPosition: [0, 1.2, 0],
  },
  // ... more models
}
```

The system will automatically:
- Preload models on app start
- Fall back to primitive geometry if models aren't found
- Apply proper lighting and shadows

## Features in Detail

### Lighting System
- **IES Lights**: Realistic light distribution patterns
- **RectAreaLights**: Efficient area lighting
- **Dynamic Lighting**: Responds to day/night slider
- **Optimized Shadows**: Adaptive shadow map quality

### Physics
- Enable/disable physics mode with toggle button
- Interactive lamps that can be knocked over
- Realistic collisions and gravity

### Performance
- LOD (Level of Detail) for distant objects
- Adaptive DPR and event handling
- Model preloading
- Texture optimization

## Technologies

- **Next.js 16** - React framework
- **React Three Fiber** - 3D rendering
- **Three.js** - 3D graphics library
- **@react-three/drei** - Useful helpers
- **@react-three/rapier** - Physics engine
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## License

MIT
