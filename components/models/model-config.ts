/**
 * Model configuration for lamp models
 * Maps lamp IDs to their GLB/GLTF model paths
 */

export type LampModelConfig = {
  id: string
  modelPath: string | null
  scale?: number | [number, number, number]
  lightingPosition?: [number, number, number]
}

/**
 * Configuration for all lamp models
 * Set modelPath to null to use primitive geometry fallback
 * 
 * NOTE: Models are optional - if modelPath is null or model doesn't exist,
 * the system will automatically fall back to primitive geometry
 */
export const LAMP_MODELS: Record<string, LampModelConfig> = {
  "1": {
    id: "1",
    modelPath: null, // Set to null to use primitive geometry until model is added
    scale: 1,
    lightingPosition: [0, 1.2, 0],
  },
  "2": {
    id: "2",
    modelPath: null, // Set to null to use primitive geometry until model is added
    scale: 1,
    lightingPosition: [0, 0.9, 0],
  },
  "3": {
    id: "3",
    modelPath: null, // Set to null to use primitive geometry until model is added
    scale: 1,
    lightingPosition: [0, 5.35, 0],
  },
  "4": {
    id: "4",
    modelPath: null, // Set to null to use primitive geometry until model is added
    scale: 1,
    lightingPosition: [3, 5.3, 0],
  },
}

/**
 * Get model configuration for a lamp
 */
export function getLampModelConfig(lampId: string): LampModelConfig | null {
  return LAMP_MODELS[lampId] || null
}

/**
 * Get all model paths that should be preloaded
 */
export function getAllModelPaths(): string[] {
  return Object.values(LAMP_MODELS)
    .map((config) => config.modelPath)
    .filter((path): path is string => path !== null)
}

