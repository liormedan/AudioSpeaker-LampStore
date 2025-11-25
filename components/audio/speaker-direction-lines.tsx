"use client"

import { useMemo } from "react"
import * as THREE from "three"
import React from "react"

interface SpeakerDriverPosition {
  position: [number, number, number]
  type: "tweeter" | "mid" | "woofer"
}

interface SpeakerDirectionLinesProps {
  speakerPositions: Array<{ position: [number, number, number], rotation?: [number, number, number] }>
  enabled: boolean
}

/**
 * SpeakerDirectionLines - מציג קווים מכל האלמנטים של הרמקולים (drivers) לכיוון מסוים
 * עוזר להבין את הזוויות שהרמקולים מכוונים אליהן
 */
export function SpeakerDirectionLines({
  speakerPositions,
  enabled,
}: SpeakerDirectionLinesProps) {
  if (!enabled) return null

  // מיקומי כל ה-drivers בכל רמקול (יחסית ל-group [0, 2.5, 0])
  // ה-drivers נמצאים בתוך group position={[0, 2.5, 0]} יחסית לרמקול
  // המיקומים הם המיקום המדויק של כל driver כפי שמוגדר ב-SpeakerModel
  // ה-SpeakerDriver הוא group עם position, והאלמנטים שלו נמצאים במרכז (position [0,0,0] יחסית ל-group)
  // אז המיקום של driver.position הוא המרכז המדויק של ה-driver
  const driverPositions: SpeakerDriverPosition[] = [
    { position: [0, 4.2, 0.82], type: "tweeter" }, // מיקום מדויק מה-SpeakerModel
    { position: [0, 3.4, 0.82], type: "mid" }, // מיקום מדויק מה-SpeakerModel
    { position: [0, 2.2, 0.82], type: "woofer" }, // מיקום מדויק מה-SpeakerModel
    { position: [0, 1.0, 0.82], type: "woofer" }, // מיקום מדויק מה-SpeakerModel
  ]

  // יצירת קווים מכל ה-drivers של כל הרמקולים
  const lines = useMemo(() => {
    const allLines: React.ReactElement[] = []
    let lineIndex = 0

    speakerPositions.forEach((speaker, speakerIndex) => {
      // חישוב מטריצת סיבוב של הרמקול
      const rotation = speaker.rotation || [0, 0, 0]
      const rotationMatrix = new THREE.Matrix4()
      rotationMatrix.makeRotationFromEuler(new THREE.Euler(...rotation))

      driverPositions.forEach((driver) => {
        // מיקום ה-driver ב-world space (עם סיבוב הרמקול)
        // המבנה המדויק ב-SpeakerModel:
        // <group position={position} rotation={rotation}>  // SpeakerModel (position=[-13, 0, -8])
        //   <group position={[0, 2.5, 0]}>  // Cabinet group
        //   <SpeakerDriver position={[0, 4.2, 0.82]} />  // Driver - ישירות בתוך SpeakerModel!
        //     <group position={[0, 4.2, 0.82]}>  // Driver group
        //       <mesh rotation={[Math.PI/2, 0, 0]} position={[0, 0, 0]}>  // torus - המרכז שלו הוא [0, 0, 0] יחסית ל-driver group
        //
        // אז המיקום האבסולוטי של המרכז של ה-driver יחסית לרמקול הוא:
        // driver.position = [0, 4.2, 0.82] (כי הוא ישירות בתוך SpeakerModel)
        // המיקום האבסולוטי ב-world space: speaker.position + driver.position
        
        // המיקום של ה-driver יחסית לרמקול (ה-driver נמצא ישירות בתוך SpeakerModel)
        // המיקום [0, 4.2, 0.82] הוא המרכז המדויק של ה-driver group
        // אבל ה-torus (המסגרת) נמצא ב-[0, 0, 0] יחסית ל-group, והוא מסובב ב-90 מעלות
        // אז המרכז הפיזי של ה-driver הוא במיקום driver.position
        const driverLocalPos = new THREE.Vector3(...driver.position)
        
        // הורדת הגובה כדי שהקו יהיה במרכז הפיזי המדויק של ה-driver
        // ה-driver הוא torus מסובב ב-90 מעלות, והמרכז שלו הוא במיקום driver.position
        // אבל בגלל שהמיקומים גבוהים מדי, נוריד את הגובה קצת
        // Tweeter: size 0.15, radius ≈ 0.12, נוריד 0.05
        // Mid: size 0.35, radius ≈ 0.28, נוריד 0.12
        // Woofer: size 0.5, radius ≈ 0.4, נוריד 0.18
        const heightAdjustments: Record<string, number> = {
          tweeter: -0.05,   // הורדה קלה
          mid: -0.12,       // הורדה בינונית
          woofer: -0.18,    // הורדה גדולה יותר
        }
        driverLocalPos.y += heightAdjustments[driver.type] || 0
        
        // החלת סיבוב הרמקול על המיקום היחסי
        driverLocalPos.applyMatrix4(rotationMatrix)
        
        // חישוב מיקום ה-driver ב-world space
        // speaker.position הוא המיקום של הרמקול ב-world space
        const driverWorldPos = new THREE.Vector3(
          speaker.position[0] + driverLocalPos.x,
          speaker.position[1] + driverLocalPos.y,
          speaker.position[2] + driverLocalPos.z
        )

        // כיוון הקו - קו ישר קדימה מהרמקול (לפי הסיבוב שלו)
        // הכיוון הוא קדימה (Z חיובי) ב-local space, ואז מסובב לפי הרמקול
        const forwardDirection = new THREE.Vector3(0, 0, 1) // כיוון קדימה ב-local space
        forwardDirection.applyMatrix4(rotationMatrix) // החלת סיבוב הרמקול
        
        // אורך הקו - ארוך מספיק כדי לעבור את הספה (כ-20 יחידות)
        const lineLength = 20
        
        // יצירת קו אופקי (בגובה של ה-driver) שיוצא ישר קדימה
        const points = [
          driverWorldPos,
          new THREE.Vector3(
            driverWorldPos.x + forwardDirection.x * lineLength,
            driverWorldPos.y, // אותו גובה - קו אופקי
            driverWorldPos.z + forwardDirection.z * lineLength
          ),
        ]
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        
        // צבע שונה לפי סוג ה-driver
        const color = driver.type === "tweeter" ? "#ff00ff" : driver.type === "mid" ? "#00ff00" : "#00ffff"
        
        allLines.push(
          <line key={`line-${speakerIndex}-${lineIndex++}`} geometry={geometry}>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={0.6}
              linewidth={2}
            />
          </line>
        )
      })
    })

    return allLines
  }, [speakerPositions])

  return <>{lines}</>
}

