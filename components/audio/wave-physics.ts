import * as THREE from "three"

/**
 * ממשק SoundWave - מייצג גל קול בודד בחדר
 * תואם לתוכנית היישום ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md
 */
export interface SoundWave {
  /** מזהה ייחודי של הגל */
  id: string
  
  /** מיקום הרמקול שממנו הגל נוצר [x, y, z] */
  origin: [number, number, number]
  
  /** רדיוס נוכחי של הגל (יחידות) */
  radius: number
  
  /** רדיוס מקסימלי לפני דעיכה מלאה (יחידות) */
  maxRadius: number
  
  /** עוצמת הגל (0-1), דועכת עם המרחק לפי חוק הפוך ריבועי */
  intensity: number
  
  /** תדר דומיננטי (0-1), 0=Bass, 1=Treble */
  frequency: number
  
  /** צבע הגל לפי התדר הדומיננטי */
  color: THREE.Color
  
  /** זמן חיים של הגל בשניות */
  age: number
  
  /** מהירות התפשטות הגל (יחידות/שנייה), בדרך כלל מהירות קול ~343 */
  speed: number
  
  /** כיוון הגל (אופציונלי, לשימוש עתידי בהתנגשויות) */
  direction?: [number, number, number]
  
  /** עיוות הגל (0-1), משתנה בהתנגשויות */
  distortion?: number
  
  /** מיקום יעד (למשל הדמות) - הגלים נעים לכיוון זה */
  targetPosition?: [number, number, number]
}

// גבולות החדר (מתוך showroom-environment.tsx)
export const ROOM_BOUNDS = {
  floor: -0.5,           // Y position של הרצפה
  ceiling: 20,           // Y position של התקרה (משוער)
  backWall: -10,         // Z position של הקיר האחורי
  frontWall: 10,         // Z position של הקיר הקדמי (משוער)
  leftWall: -15,         // X position של הקיר השמאלי
  rightWall: 15,         // X position של הקיר הימני
}

export const WAVE_CONFIG = {
  // יצירת גלים
  emitIntervalMin: 0.1,         // תדירות מקסימלית (גלים מהירים) - מוזיקה חזקה
  emitIntervalMax: 0.2,         // תדירות מינימלית (גלים איטיים) - מוזיקה חלשה
  emitInterval: 0.15,           // תדירות בסיסית (לשימוש ישן/ברירת מחדל)
  minIntensityThreshold: 0.05, // עוצמה מינימלית ליצירת גל (מוקטן כדי שגלים יווצרו גם במוזיקה חלשה)
  
  // התפשטות
  soundSpeed: 15,               // מהירות קול ביחידות/שנייה (מואטת לוויזואליזציה טובה יותר)
  maxRadius: 50,                // רדיוס מקסימלי לפני דעיכה מלאה
  reflectionDamping: 0.3,       // דעיכה בהתנגשות עם קיר (30% מהעוצמה נשארת)
  
  // ויזואליזציה
  // הגבלות לפי SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 7.1
  ringThickness: 0.1,           // עובי הטבעת (מוקטן כדי שהטבעות יהיו קטנות יותר)
  ringSegments: 64,             // מספר קטעים בטבעת (32-64 בטווח המומלץ)
  opacityBase: 1.0,             // שקיפות בסיסית (מקסימלית כדי שהגלים יראו טוב יותר)
  particleCount: 20,            // מספר חלקיקים לכל גל
  minRingRadius: 0.05,          // רדיוס מינימלי של הטבעת (קטן מאוד כדי שהטבעות יתחילו קטנות)
  maxRingRadius: 2.0,           // רדיוס מקסימלי של הטבעת (מוגבל כדי שהטבעות לא יהיו גדולות מדי)
  
  // אפקטים ויזואליים
  bloomIntensityBase: 2,        // עוצמת זוהר בסיסית
  bloomIntensityMultiplier: 3,  // מכפיל זוהר בעוצמות גבוהות
  distortionAmount: 0.05,       // כמות עיוות בהתנגשויות (0-1)
  distanceOpacityFalloff: 0.02, // דעיכת שקיפות עם מרחק
  
  // ביצועים
  // הגבלות לפי SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 7.1
  maxWaves: 25,                 // מקסימום גלים פעילים (20-30 בטווח המומלץ)
  cullingDistance: 50,          // מרחק הסתרה
}

/**
 * חישוב עוצמות לפי טווחי תדרים
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 4.2
 * מחזיר אובייקט עם עוצמות נפרדות לכל טווח
 */
export function calculateFrequencyIntensities(audioData: Uint8Array): {
  bassIntensity: number
  midIntensity: number
  trebleIntensity: number
  totalIntensity: number
} {
  if (audioData.length === 0) {
    return {
      bassIntensity: 0,
      midIntensity: 0,
      trebleIntensity: 0,
      totalIntensity: 0,
    }
  }
  
  // ממוצע תדרים נמוכים (Bass: 0-20)
  const bassSlice = audioData.slice(0, Math.min(20, audioData.length))
  const bassSum = bassSlice.reduce((a, b) => a + b, 0)
  const bassIntensity = bassSlice.length > 0 ? bassSum / bassSlice.length / 255 : 0
  
  // ממוצע תדרים בינוניים (Mid: 20-60)
  const midSlice = audioData.slice(20, Math.min(60, audioData.length))
  const midSum = midSlice.reduce((a, b) => a + b, 0)
  const midIntensity = midSlice.length > 0 ? midSum / midSlice.length / 255 : 0
  
  // ממוצע תדרים גבוהים (Treble: 60-128)
  const trebleSlice = audioData.slice(60, audioData.length)
  const trebleSum = trebleSlice.reduce((a, b) => a + b, 0)
  const trebleIntensity = trebleSlice.length > 0 ? trebleSum / trebleSlice.length / 255 : 0
  
  // עוצמה כוללת - ממוצע פשוט של שלושתם (תואם למפרט)
  const totalIntensity = (bassIntensity + midIntensity + trebleIntensity) / 3
  
  return {
    bassIntensity: Math.min(1, Math.max(0, bassIntensity)),
    midIntensity: Math.min(1, Math.max(0, midIntensity)),
    trebleIntensity: Math.min(1, Math.max(0, trebleIntensity)),
    totalIntensity: Math.min(1, Math.max(0, totalIntensity)),
  }
}

/**
 * חישוב עוצמה כוללת מנתוני אודיו
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 4.2
 * 
 * @param audioData נתוני תדרים מ-AnalyserNode
 * @returns עוצמה כוללת בין 0-1
 */
export function calculateIntensity(audioData: Uint8Array): number {
  const intensities = calculateFrequencyIntensities(audioData)
  return intensities.totalIntensity
}

// חישוב תדר דומיננטי
export function calculateDominantFrequency(audioData: Uint8Array): number {
  if (audioData.length === 0) return 0.5
  
  let maxValue = 0
  let maxIndex = 0
  
  for (let i = 0; i < audioData.length; i++) {
    if (audioData[i] > maxValue) {
      maxValue = audioData[i]
      maxIndex = i
    }
  }
  
  // נרמול ל-0-1 (0 = Bass, 1 = Treble)
  return maxIndex / audioData.length
}

/**
 * חישוב תדירות יצירת גלים לפי עוצמת המוזיקה
 * ככל שהמוזיקה חזקה יותר, הגלים נוצרים יותר מהר
 * @param intensity עוצמה בין 0-1
 * @returns תדירות בשניות (0.1-0.2)
 */
export function calculateEmitInterval(intensity: number): number {
  // הפוך: עוצמה גבוהה = תדירות גבוהה (מרווח קטן יותר)
  // intensity = 1 -> 0.1 שניות (גלים מהירים)
  // intensity = 0 -> 0.2 שניות (גלים איטיים)
  const normalizedIntensity = Math.max(0, Math.min(1, intensity))
  const interval = WAVE_CONFIG.emitIntervalMax - 
    (normalizedIntensity * (WAVE_CONFIG.emitIntervalMax - WAVE_CONFIG.emitIntervalMin))
  
  return interval
}

/**
 * יצירת צבע לפי תדר דומיננטי - תואם לתדרי האור
 * תדר נמוך אודיו = תדר נמוך אור (אדום), תדר גבוה אודיו = תדר גבוה אור (כחול)
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 3.2
 * 
 * @param frequency תדר נורמלי בין 0-1 (0 = Bass, 1 = Treble)
 * @param driverType סוג ה-driver (אופציונלי) - משפיע על הצבע המדויק
 * @returns צבע HSL לפי התדר - מיפוי מדויק לתדרי האור:
 *   - תדרים נמוכים (Bass): HSL(0-30, 100%, 50%) - אדום לכתום (תדר אור נמוך)
 *   - תדרים בינוניים (Mid): HSL(50-150, 100%, 50%) - כתום לצהוב לירוק (תדר אור בינוני)
 *   - תדרים גבוהים (Treble): HSL(200-280, 100%, 50%) - כחול לסגול (תדר אור גבוה)
 */
export function getColorByFrequency(frequency: number, driverType?: "tweeter" | "mid" | "woofer"): THREE.Color {
  const color = new THREE.Color()
  
  // נרמול התדר ל-0-1
  const normalizedFreq = Math.max(0, Math.min(1, frequency))
  
  // אם יש driverType, משתמשים בו לקביעת הצבע המדויק לפי תדר האור
  // מיפוי מדויק: תדר אודיו נמוך = תדר אור נמוך (אדום), תדר אודיו גבוה = תדר אור גבוה (כחול)
  if (driverType) {
    if (driverType === "woofer") {
      // תדרים נמוכים (Bass/Sub) - תדר אור נמוך: אדום לכתום
      // Hue: 0-30 (אדום לכתום) - תואם לתדר אור נמוך (700-600nm)
      // תדר נמוך יותר = אדום יותר עמוק
      const hue = normalizedFreq * 30 // 0-30 (אדום לכתום)
      const saturation = 0.9 + normalizedFreq * 0.1 // 0.9-1.0 (רוויה גבוהה)
      const lightness = 0.4 + normalizedFreq * 0.1 // 0.4-0.5 (בהירות בינונית)
      color.setHSL(hue / 360, saturation, lightness)
    } else if (driverType === "mid") {
      // תדרים בינוניים (Mid) - תדר אור בינוני: כתום לצהוב לירוק
      // Hue: 30-150 (כתום לצהוב לירוק) - תואם לתדר אור בינוני (600-550nm)
      // תדר בינוני = צבעים חמים (כתום/צהוב) עד קרירים (ירוק)
      const hue = 30 + normalizedFreq * 120 // 30-150 (כתום לצהוב לירוק)
      const saturation = 0.85 + normalizedFreq * 0.15 // 0.85-1.0 (רוויה גבוהה)
      const lightness = 0.45 + normalizedFreq * 0.05 // 0.45-0.5 (בהירות בינונית)
      color.setHSL(hue / 360, saturation, lightness)
    } else { // tweeter
      // תדרים גבוהים (Treble) - תדר אור גבוה: כחול לסגול
      // Hue: 200-280 (כחול לסגול) - תואם לתדר אור גבוה (450-400nm)
      // תדר גבוה יותר = כחול יותר עמוק/סגול
      const hue = 200 + normalizedFreq * 80 // 200-280 (כחול לסגול)
      const saturation = 0.9 + normalizedFreq * 0.1 // 0.9-1.0 (רוויה גבוהה)
      const lightness = 0.45 + normalizedFreq * 0.05 // 0.45-0.5 (בהירות בינונית)
      color.setHSL(hue / 360, saturation, lightness)
    }
    return color
  }
  
  // מיפוי רציף לכל הספקטרום - תדר אודיו נמוך = תדר אור נמוך (אדום), תדר אודיו גבוה = תדר אור גבוה (כחול)
  // חלוקה לשלושה טווחים עם מעברים חלקים יותר ותואמים לתדרי האור
  const bassRange = 0.33      // 0 - 0.33 (תדרים נמוכים)
  const midRange = 0.66       // 0.33 - 0.66 (תדרים בינוניים)
  
  if (normalizedFreq < bassRange) {
    // תדרים נמוכים (Bass): HSL(0-30, 90-100%, 40-50%) - אדום לכתום (תדר אור נמוך: 700-600nm)
    const relativeFreq = normalizedFreq / bassRange // 0-1
    const hue = relativeFreq * 30 // 0-30 (אדום לכתום)
    const saturation = 0.9 + relativeFreq * 0.1 // 0.9-1.0 (רוויה גבוהה)
    const lightness = 0.4 + relativeFreq * 0.1 // 0.4-0.5 (בהירות בינונית)
    color.setHSL(hue / 360, saturation, lightness)
  } else if (normalizedFreq < midRange) {
    // תדרים בינוניים (Mid): HSL(30-150, 85-100%, 45-50%) - כתום לצהוב לירוק (תדר אור בינוני: 600-550nm)
    const relativeFreq = (normalizedFreq - bassRange) / (midRange - bassRange) // 0-1
    const hue = 30 + relativeFreq * 120 // 30-150 (כתום לצהוב לירוק)
    const saturation = 0.85 + relativeFreq * 0.15 // 0.85-1.0 (רוויה גבוהה)
    const lightness = 0.45 + relativeFreq * 0.05 // 0.45-0.5 (בהירות בינונית)
    color.setHSL(hue / 360, saturation, lightness)
  } else {
    // תדרים גבוהים (Treble): HSL(200-280, 90-100%, 45-50%) - כחול לסגול (תדר אור גבוה: 450-400nm)
    const relativeFreq = (normalizedFreq - midRange) / (1 - midRange) // 0-1
    const hue = 200 + relativeFreq * 80 // 200-280 (כחול לסגול)
    const saturation = 0.9 + relativeFreq * 0.1 // 0.9-1.0 (רוויה גבוהה)
    const lightness = 0.45 + relativeFreq * 0.05 // 0.45-0.5 (בהירות בינונית)
    color.setHSL(hue / 360, saturation, lightness)
  }
  
  return color
}

/**
 * פונקציות עזר לקבלת צבע לפי טווח תדרים ספציפי
 */
export function getBassColor(intensity: number = 1): THREE.Color {
  // תדר אור נמוך - אדום לכתום: HSL(0-30, 90-100%, 40-50%)
  // תואם לתדר אור נמוך (700-600nm) - אדום לכתום
  const hue = intensity * 30
  const saturation = 0.9 + intensity * 0.1 // 0.9-1.0
  const lightness = 0.4 + intensity * 0.1 // 0.4-0.5
  const color = new THREE.Color()
  color.setHSL(hue / 360, saturation, lightness)
  return color
}

export function getMidColor(intensity: number = 1): THREE.Color {
  // תדר אור בינוני - כתום לצהוב לירוק: HSL(30-150, 85-100%, 45-50%)
  // תואם לתדר אור בינוני (600-550nm) - כתום לצהוב לירוק
  const hue = 30 + intensity * 120
  const saturation = 0.85 + intensity * 0.15 // 0.85-1.0
  const lightness = 0.45 + intensity * 0.05 // 0.45-0.5
  const color = new THREE.Color()
  color.setHSL(hue / 360, saturation, lightness)
  return color
}

export function getTrebleColor(intensity: number = 1): THREE.Color {
  // תדר אור גבוה - כחול לסגול: HSL(200-280, 90-100%, 45-50%)
  // תואם לתדר אור גבוה (450-400nm) - כחול לסגול
  const hue = 200 + intensity * 80
  const saturation = 0.9 + intensity * 0.1 // 0.9-1.0
  const lightness = 0.45 + intensity * 0.05 // 0.45-0.5
  const color = new THREE.Color()
  color.setHSL(hue / 360, saturation, lightness)
  return color
}

// יצירת גל חדש
// הערה: Object Pooling זמין דרך wave-pool.ts (תואם למפרט סעיף 7.2)
// ניתן להשתמש ב-createWaveWithPool() במקום createWave() לשיפור ביצועים
export function createWave(
  origin: [number, number, number],
  audioData: Uint8Array,
  intensity: number,
  targetPosition?: [number, number, number], // מיקום יעד (למשל הדמות) - deprecated, משתמשים ב-direction
  direction?: [number, number, number], // כיוון ישיר (לשימוש עם drivers)
  driverType?: "tweeter" | "mid" | "woofer", // סוג ה-driver (להתאמת גודל הטבעת ולצבע לפי תדר האור)
  frequencyIndex?: number // אינדקס התדר הספציפי של ה-driver (לשימוש מדויק יותר)
): SoundWave {
  // חישוב תדר מדויק לפי driverType ו-frequencyIndex
  // אם יש frequencyIndex, משתמשים בו לחישוב מדויק יותר של התדר והצבע
  let frequency: number
  if (frequencyIndex !== undefined && audioData.length > 0) {
    // שימוש בתדר הספציפי של ה-driver
    const normalizedIndex = Math.min(frequencyIndex, audioData.length - 1)
    const frequencyValue = audioData[normalizedIndex] / 255.0 // נרמול ל-0-1
    
    // מיפוי האינדקס לתדר נורמלי לפי סוג ה-driver
    // כל driver מכסה טווח תדרים ספציפי, והאינדקס שלו מציין את המרכז של הטווח
    if (driverType === "woofer") {
      // תדרים נמוכים (Bass/Sub): אינדקס 0-20 -> תדר נורמלי 0-0.33
      // מיפוי מדויק יותר: אינדקס נמוך יותר = תדר נמוך יותר = אדום יותר עמוק
      const relativeIndex = normalizedIndex / 20.0 // 0-1 יחסית לטווח ה-woofer
      frequency = relativeIndex * 0.33 // 0-0.33
    } else if (driverType === "mid") {
      // תדרים בינוניים (Mid): אינדקס 20-60 -> תדר נורמלי 0.33-0.66
      // מיפוי מדויק יותר: אינדקס בינוני = תדר בינוני = צהוב/ירוק
      const relativeIndex = (normalizedIndex - 20) / 40.0 // 0-1 יחסית לטווח ה-mid
      frequency = 0.33 + relativeIndex * 0.33 // 0.33-0.66
    } else { // tweeter
      // תדרים גבוהים (Treble): אינדקס 60-128 -> תדר נורמלי 0.66-1.0
      // מיפוי מדויק יותר: אינדקס גבוה יותר = תדר גבוה יותר = כחול/סגול יותר עמוק
      const relativeIndex = (normalizedIndex - 60) / Math.max(1, audioData.length - 60) // 0-1 יחסית לטווח ה-tweeter
      frequency = 0.66 + relativeIndex * 0.34 // 0.66-1.0
    }
    
    // התדר נקבע לפי האינדקס, אבל העוצמה משפיעה על הבהירות והרוויה של הצבע
    // (לא על התדר עצמו - זה כבר נקבע לפי האינדקס)
    frequency = Math.max(0, Math.min(1, frequency))
  } else {
    // fallback - שימוש בתדר הדומיננטי הכללי
    frequency = calculateDominantFrequency(audioData)
  }
  
  // שימוש ב-driverType לקביעת הצבע המדויק לפי תדר האור
  // וידוא שה-color תמיד מאותחל כראוי
  let color: THREE.Color
  try {
    color = getColorByFrequency(frequency, driverType)
    // וידוא שה-color תקין
    if (!color || !(color instanceof THREE.Color)) {
      color = new THREE.Color(1, 1, 1) // fallback - לבן
    }
  } catch (error) {
    // אם יש שגיאה, משתמשים בצבע fallback
    color = new THREE.Color(1, 1, 1) // fallback - לבן
  }
  
  // חישוב כיוון - אם יש direction ישיר, משתמשים בו; אחרת מחשבים מ-targetPosition
  let finalDirection: [number, number, number] | undefined = direction
  if (!finalDirection && targetPosition) {
    const dx = targetPosition[0] - origin[0]
    const dy = targetPosition[1] - origin[1]
    const dz = targetPosition[2] - origin[2]
    const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
    if (length > 0) {
      finalDirection = [dx / length, dy / length, dz / length]
    }
  }
  
  // חישוב רדיוס התחלתי ומקסימלי לפי סוג ה-driver והתדר
  // תדרים גבוהים (tweeter) - טבעות קטנות יותר
  // תדרים בינוניים (mid) - טבעות בינוניות
  // תדרים נמוכים (woofer) - טבעות גדולות יותר
  let initialRadius = WAVE_CONFIG.minRingRadius
  let maxRingRadius = WAVE_CONFIG.maxRingRadius
  
  if (driverType) {
    // התאמת גודל לפי סוג ה-driver
    const sizeMultipliers = {
      tweeter: 0.5,   // קטן - תדרים גבוהים
      mid: 0.75,      // בינוני
      woofer: 1.0,    // גדול - תדרים נמוכים
    }
    const multiplier = sizeMultipliers[driverType]
    initialRadius = WAVE_CONFIG.minRingRadius * multiplier
    maxRingRadius = WAVE_CONFIG.maxRingRadius * multiplier
  } else {
    // אם אין driverType, משתמשים בתדר
    // תדרים גבוהים (frequency קרוב ל-1) - טבעות קטנות יותר
    // תדרים נמוכים (frequency קרוב ל-0) - טבעות גדולות יותר
    const sizeMultiplier = 0.5 + frequency * 0.5 // 0.5-1.0
    initialRadius = WAVE_CONFIG.minRingRadius * sizeMultiplier
    maxRingRadius = WAVE_CONFIG.maxRingRadius * sizeMultiplier
  }
  
  return {
    id: `wave-${Date.now()}-${Math.random()}`,
    origin: [...origin] as [number, number, number],
    radius: initialRadius, // התחלה קטנה מאוד - תלוי בסוג ה-driver
    maxRadius: maxRingRadius, // רדיוס מקסימלי מוגבל - תלוי בסוג ה-driver
    intensity,
    frequency,
    color,
    age: 0,
    speed: WAVE_CONFIG.soundSpeed, // מהירות קול (מואטת לוויזואליזציה)
    direction: finalDirection,
    targetPosition: targetPosition ? [...targetPosition] as [number, number, number] : undefined,
  }
}

/**
 * עדכון גל (פיזיקה)
 * כולל התפשטות במהירות קול, דעיכה לפי 1/r², והתנגשויות עם קירות
 * אם יש direction, הגל נע לאורך הכיוון הזה (רוכב על הקו) במקום רק להתפשט בצורה ספירית
 */
export function updateWave(wave: SoundWave, delta: number): SoundWave {
  // אם יש כיוון, הגל נע לאורך הכיוון (רוכב על הקו) והרדיוס גדל לאט
  // אם אין כיוון, הגל מתפשט בצורה ספירית והרדיוס גדל מהר
  let newRadius: number
  let newOrigin = wave.origin
  
  if (wave.direction) {
    // גל עם כיוון - נע לאורך הקו והרדיוס גדל לאט (רק כדי שהטבעת תהיה נראית)
    // הרדיוס מוגבל ל-maxRingRadius כדי שהטבעות לא יהיו גדולות מדי
    const maxRingRadius = WAVE_CONFIG.maxRingRadius || 2.0
    newRadius = Math.min(wave.radius + wave.speed * delta * 0.1, maxRingRadius) // גדל לאט מאוד
    
    // המיקום החדש של הגל הוא origin + direction * speed * delta
    newOrigin = [
      wave.origin[0] + wave.direction[0] * wave.speed * delta,
      wave.origin[1] + wave.direction[1] * wave.speed * delta,
      wave.origin[2] + wave.direction[2] * wave.speed * delta,
    ] as [number, number, number]
  } else {
    // גל ללא כיוון - מתפשט בצורה ספירית והרדיוס גדל מהר
    newRadius = wave.radius + wave.speed * delta
  }
  
  // חישוב דעיכה לפי חוק הפוך ריבועי (1/r²)
  // I = I₀ / r² כאשר r הוא המרחק מהמקור
  // נוסיף קבוע קטן כדי למנוע חלוקה ב-0
  const minRadius = 0.5
  const effectiveRadius = Math.max(minRadius, newRadius)
  const distanceFactor = (minRadius * minRadius) / (effectiveRadius * effectiveRadius)
  
  // דעיכה נוספת עם הזמן (אטרנואציה) - חלקה יותר
  const ageFactor = Math.exp(-wave.age * 0.5) // דעיכה אקספוננציאלית חלקה יותר
  
  // דעיכה חלקה יותר - שילוב של מרחק וזמן
  const newIntensity = wave.intensity * distanceFactor * ageFactor
  
  return {
    ...wave,
    origin: newOrigin, // עדכון המיקום אם יש כיוון
    radius: newRadius,
    intensity: newIntensity,
    age: wave.age + delta,
  }
}

/**
 * בדיקה אם גל צריך להישאר פעיל
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 7.3
 * 
 * **ניהול זיכרון:**
 * - הסרת גלים ישנים אוטומטית - גלים עם עוצמה נמוכה או רדיוס גדול מדי מוסרים
 * - זה מונע הצטברות של גלים מתים בזיכרון
 */
export function isWaveActive(wave: SoundWave): boolean {
  // גל נחשב לא פעיל אם:
  // 1. עוצמה נמוכה מדי (< 0.01) - גל דעך
  // 2. רדיוס גדול מדי (> maxRadius) - גל הגיע למרחק מקסימלי
  return wave.intensity > 0.01 && wave.radius < wave.maxRadius
}

/**
 * חישוב אינטראקציה בין גלים (התאבכות)
 * כאשר שני גלים נפגשים, העוצמות שלהם מתחברות
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 3
 */
export function calculateWaveInterference(
  wave1: SoundWave,
  wave2: SoundWave,
  threshold: number = 2.0 // מרחק מינימלי לאינטראקציה
): { wave1: SoundWave; wave2: SoundWave } | null {
  const pos1 = new THREE.Vector3(wave1.origin[0], wave1.origin[1], wave1.origin[2])
  const pos2 = new THREE.Vector3(wave2.origin[0], wave2.origin[1], wave2.origin[2])
  
  const distance = pos1.distanceTo(pos2)
  const combinedRadius = wave1.radius + wave2.radius
  
  // בדיקה אם הגלים חופפים
  if (distance < combinedRadius && distance < threshold) {
    // חישוב עוצמה משולבת (התאבכות בונה)
    const interferenceFactor = 1 - (distance / combinedRadius) * 0.3 // עד 30% תוספת עוצמה
    const combinedIntensity = Math.min(1, (wave1.intensity + wave2.intensity) * (1 + interferenceFactor))
    
    // חישוב צבע משולב (ממוצע לפי עוצמה)
    const intensity1 = wave1.intensity / (wave1.intensity + wave2.intensity)
    const intensity2 = wave2.intensity / (wave1.intensity + wave2.intensity)
    const combinedColor = new THREE.Color()
    combinedColor.r = wave1.color.r * intensity1 + wave2.color.r * intensity2
    combinedColor.g = wave1.color.g * intensity1 + wave2.color.g * intensity2
    combinedColor.b = wave1.color.b * intensity1 + wave2.color.b * intensity2
    
    return {
      wave1: {
        ...wave1,
        intensity: combinedIntensity * 0.6, // חלוקת עוצמה
        color: combinedColor,
      },
      wave2: {
        ...wave2,
        intensity: combinedIntensity * 0.6,
        color: combinedColor,
      },
    }
  }
  
  return null
}

/**
 * עדכון גל מלא כולל בדיקת התנגשויות
 * זו הפונקציה הראשית שיש לקרוא לה בעדכון גלים
 * מחזיר את הגל המעודכן ואת הגל המוחזר (אם יש)
 */
export function updateWaveWithCollisions(wave: SoundWave, delta: number): {
  wave: SoundWave
  reflectedWave: SoundWave | null
} {
  // עדכון בסיסי (התפשטות ודעיכה)
  const updatedWave = updateWave(wave, delta)
  
  // בדיקת התנגשויות עם קירות (כולל יצירת גלים מוחזרים)
  const collisionResult = checkWallCollisions(updatedWave, delta)
  
  return collisionResult
}

/**
 * יצירת גל מוחזר מהקיר
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 6.2
 */
export function createReflectedWave(
  originalWave: SoundWave,
  normal: [number, number, number]
): SoundWave | null {
  // יצירת גל חדש עם עוצמה מוחלשת
  const reflectedIntensity = originalWave.intensity * WAVE_CONFIG.reflectionDamping
  
  // אם העוצמה נמוכה מדי, לא יוצרים גל מוחזר
  if (reflectedIntensity < 0.05) {
    return null
  }
  
  // חישוב מיקום הגל המוחזר (נקודת ההתנגשות)
  const collisionPoint: [number, number, number] = [
    originalWave.origin[0] + normal[0] * originalWave.radius,
    originalWave.origin[1] + normal[1] * originalWave.radius,
    originalWave.origin[2] + normal[2] * originalWave.radius,
  ]
  
  return {
    ...originalWave,
    id: `reflected-${originalWave.id}-${Date.now()}`,
    origin: collisionPoint,
    radius: 0.5, // התחלה מחדש
    intensity: reflectedIntensity,
    age: 0, // גל חדש
    distortion: WAVE_CONFIG.distortionAmount, // עיוות קל בהתחלה
  }
}

/**
 * בדיקת התנגשויות עם קירות והרצפה
 * מחזיר את הגל המעודכן עם השתקפויות ועיוות אם יש התנגשויות
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 3.3 ו-6.2
 * 
 * **תכונות מתקדמות מיושמות:**
 * - ✅ החזרת גל חדש מוחזר (`reflectedWave`) במקום מוטציה של הגל המקורי
 * - ✅ עיוות (`distortion`) של הגל בהתנגשויות
 * - ✅ דעיכת עוצמה בהתנגשות (`reflectionDamping`)
 * - ✅ תמיכה בכל הקירות: אחורי, קדמי, שמאלי, ימני, רצפה ותקרה
 * - ✅ דעיכת עיוות אוטומטית עם הזמן (מבוססת על delta time)
 * 
 * @param wave הגל לבדיקה
 * @param delta זמן שעבר מאז הפריים הקודם (לשימוש בדעיכת עיוות חלקה)
 */
export function checkWallCollisions(wave: SoundWave, delta: number = 0.016): {
  wave: SoundWave
  reflectedWave: SoundWave | null
} {
  const { origin, radius } = wave
  const [x, y, z] = origin
  let hasCollision = false
  let newDistortion = wave.distortion || 0
  let reflectionNormal: [number, number, number] | null = null
  
  // בדיקת התנגשות עם קיר אחורי (Z = -10)
  if (z - radius <= ROOM_BOUNDS.backWall) {
    hasCollision = true
    reflectionNormal = [0, 0, 1] // החזרה בכיוון Z חיובי
    newDistortion = Math.min(1, (newDistortion || 0) + WAVE_CONFIG.distortionAmount)
  }
  
  // בדיקת התנגשות עם קיר קדמי (Z = 10)
  else if (z + radius >= ROOM_BOUNDS.frontWall) {
    hasCollision = true
    reflectionNormal = [0, 0, -1] // החזרה בכיוון Z שלילי
    newDistortion = Math.min(1, (newDistortion || 0) + WAVE_CONFIG.distortionAmount)
  }
  
  // בדיקת התנגשות עם קיר שמאלי (X = -15)
  else if (x - radius <= ROOM_BOUNDS.leftWall) {
    hasCollision = true
    reflectionNormal = [1, 0, 0] // החזרה בכיוון X חיובי
    newDistortion = Math.min(1, (newDistortion || 0) + WAVE_CONFIG.distortionAmount)
  }
  
  // בדיקת התנגשות עם קיר ימני (X = 15)
  else if (x + radius >= ROOM_BOUNDS.rightWall) {
    hasCollision = true
    reflectionNormal = [-1, 0, 0] // החזרה בכיוון X שלילי
    newDistortion = Math.min(1, (newDistortion || 0) + WAVE_CONFIG.distortionAmount)
  }
  
  // בדיקת התנגשות עם רצפה (Y = -0.5)
  else if (y - radius <= ROOM_BOUNDS.floor) {
    hasCollision = true
    reflectionNormal = [0, 1, 0] // החזרה בכיוון Y חיובי
    newDistortion = Math.min(1, (newDistortion || 0) + WAVE_CONFIG.distortionAmount)
  }
  
  // בדיקת התנגשות עם תקרה (Y = 20)
  else if (y + radius >= ROOM_BOUNDS.ceiling) {
    hasCollision = true
    reflectionNormal = [0, -1, 0] // החזרה בכיוון Y שלילי
    newDistortion = Math.min(1, (newDistortion || 0) + WAVE_CONFIG.distortionAmount)
  }
  
  // דעיכת עיוות עם הזמן (אם אין התנגשויות חדשות)
  // דעיכה חלקה המבוססת על delta time - כ-2 שניות לדעיכה מלאה
  if (!hasCollision && newDistortion > 0) {
    const distortionDecayRate = 0.5 // דעיכה של 50% לשנייה
    newDistortion = Math.max(0, newDistortion - distortionDecayRate * delta)
  }
  
  // עדכון הגל עם דעיכת עוצמה בהתנגשות (תכונה מתקדמת #3)
  const updatedWave: SoundWave = {
    ...wave,
    intensity: hasCollision ? wave.intensity * WAVE_CONFIG.reflectionDamping : wave.intensity,
    distortion: newDistortion, // עיוות (תכונה מתקדמת #2)
  }
  
  // יצירת גל מוחזר חדש אם יש התנגשות (תכונה מתקדמת #1)
  // במקום לשנות את הגל המקורי, יוצרים גל חדש עם ID ייחודי
  const reflectedWave = hasCollision && reflectionNormal
    ? createReflectedWave(updatedWave, reflectionNormal)
    : null
  
  return {
    wave: updatedWave,
    reflectedWave,
  }
}

