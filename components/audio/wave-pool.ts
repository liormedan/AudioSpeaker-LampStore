/**
 * Object Pooling - שימוש חוזר באובייקטי גלים
 * תואם למפרט ב-SOUND_WAVES_IMPLEMENTATION_PLAN.md סעיף 7.2
 * 
 * Object Pooling משפר ביצועים על ידי שימוש חוזר באובייקטים במקום יצירה והשמדה תמידית
 */

import type { SoundWave } from "./wave-physics"

class WavePool {
  private pool: SoundWave[] = []
  private activeCount: number = 0
  private maxPoolSize: number = 50 // גודל מקסימלי של ה-pool

  /**
   * קבלת גל מה-pool או יצירת חדש אם ה-pool ריק
   */
  acquire(): SoundWave | null {
    if (this.pool.length > 0) {
      this.activeCount++
      return this.pool.pop()!
    }
    // אם ה-pool ריק, מחזירים null - ה-caller יצור גל חדש
    return null
  }

  /**
   * החזרת גל ל-pool לשימוש חוזר
   */
  release(wave: SoundWave): void {
    if (this.pool.length < this.maxPoolSize) {
      // איפוס הגל למצב בסיסי
      wave.radius = 0.5
      wave.intensity = 0
      wave.age = 0
      wave.distortion = 0
      this.pool.push(wave)
      this.activeCount--
    }
    // אם ה-pool מלא, פשוט נזרוק את הגל (GC ינקה אותו)
  }

  /**
   * ניקוי ה-pool
   */
  clear(): void {
    this.pool = []
    this.activeCount = 0
  }

  /**
   * קבלת מידע על ה-pool
   */
  getStats() {
    return {
      poolSize: this.pool.length,
      activeCount: this.activeCount,
      totalCapacity: this.maxPoolSize,
    }
  }
}

// Singleton instance
let wavePoolInstance: WavePool | null = null

export function getWavePool(): WavePool {
  if (!wavePoolInstance) {
    wavePoolInstance = new WavePool()
  }
  return wavePoolInstance
}

/**
 * Helper function ליצירת גל עם pool
 * אם יש גל זמין ב-pool, משתמשים בו, אחרת יוצרים חדש
 */
export function createWaveWithPool(
  origin: [number, number, number],
  audioData: Uint8Array,
  intensity: number,
  createWaveFn: (origin: [number, number, number], audioData: Uint8Array, intensity: number) => SoundWave
): SoundWave {
  const pool = getWavePool()
  const pooledWave = pool.acquire()
  
  if (pooledWave) {
    // שימוש חוזר בגל מה-pool
    return {
      ...pooledWave,
      id: `wave-${Date.now()}-${Math.random()}`,
      origin: [...origin] as [number, number, number],
      radius: 0.5,
      maxRadius: 50 * (0.7 + intensity * 0.3),
      intensity,
      frequency: 0.5, // יועדכן לפי audioData
      color: pooledWave.color, // יועדכן לפי audioData
      age: 0,
      speed: 343,
      distortion: 0,
    }
  }
  
  // יצירת גל חדש אם אין ב-pool
  return createWaveFn(origin, audioData, intensity)
}

/**
 * Helper function להחזרת גל ל-pool
 */
export function releaseWaveToPool(wave: SoundWave): void {
  const pool = getWavePool()
  pool.release(wave)
}

