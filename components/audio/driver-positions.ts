import * as THREE from "three"

export interface DriverInfo {
  position: [number, number, number] // מיקום ב-world space
  direction: [number, number, number] // כיוון התנועה (נורמליזציה)
  type: "tweeter" | "mid" | "woofer"
  frequencyIndex: number // אינדקס התדר הספציפי של ה-driver (מתוך SpeakerModel)
}

/**
 * מחזיר את המיקומים והכיוונים של כל ה-drivers לכל רמקול
 * תואם ל-SpeakerDirectionLines - משתמש באותה לוגיקה לחישוב מיקומים
 */
export function getDriverPositionsAndDirections(
  speakerPosition: [number, number, number],
  speakerRotation: [number, number, number] = [0, 0, 0]
): DriverInfo[] {
  // מיקומי כל ה-drivers יחסית לרמקול (כמו ב-SpeakerModel)
  // כולל frequencyIndex - האינדקס הספציפי של התדר לכל driver
  const driverRelativePositions: Array<{ 
    position: [number, number, number], 
    type: "tweeter" | "mid" | "woofer",
    frequencyIndex: number
  }> = [
    { position: [0, 4.2, 0.82], type: "tweeter", frequencyIndex: 40 }, // תדרים גבוהים
    { position: [0, 3.4, 0.82], type: "mid", frequencyIndex: 20 }, // תדרים בינוניים
    { position: [0, 2.2, 0.82], type: "woofer", frequencyIndex: 5 }, // תדרים נמוכים
    { position: [0, 1.0, 0.82], type: "woofer", frequencyIndex: 2 }, // תדרים נמוכים מאוד (sub)
  ]

  // חישוב מטריצת סיבוב של הרמקול
  const rotationMatrix = new THREE.Matrix4()
  rotationMatrix.makeRotationFromEuler(new THREE.Euler(...speakerRotation))

  // כיוון קדימה ב-local space (Z חיובי)
  const forwardDirection = new THREE.Vector3(0, 0, 1)
  forwardDirection.applyMatrix4(rotationMatrix)
  const normalizedDirection: [number, number, number] = [
    forwardDirection.x,
    forwardDirection.y,
    forwardDirection.z,
  ]

  // התאמות גובה לפי סוג ה-driver (כמו ב-SpeakerDirectionLines)
  const heightAdjustments: Record<string, number> = {
    tweeter: -0.05,
    mid: -0.12,
    woofer: -0.18,
  }

  return driverRelativePositions.map((driver) => {
    // מיקום ה-driver יחסית לרמקול
    const driverLocalPos = new THREE.Vector3(...driver.position)
    
    // הורדת הגובה לפי סוג ה-driver
    driverLocalPos.y += heightAdjustments[driver.type] || 0
    
    // החלת סיבוב הרמקול על המיקום היחסי
    driverLocalPos.applyMatrix4(rotationMatrix)
    
    // חישוב מיקום ה-driver ב-world space
    const driverWorldPos: [number, number, number] = [
      speakerPosition[0] + driverLocalPos.x,
      speakerPosition[1] + driverLocalPos.y,
      speakerPosition[2] + driverLocalPos.z,
    ]

    return {
      position: driverWorldPos,
      direction: normalizedDirection, // אותו כיוון לכל ה-drivers של אותו רמקול
      type: driver.type,
      frequencyIndex: driver.frequencyIndex, // אינדקס התדר הספציפי של ה-driver
    }
  })
}

