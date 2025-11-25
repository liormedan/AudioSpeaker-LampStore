# תוכנית יישום - גלי קול הנעים בחדר לפי המוזיקה

## סקירה כללית
יישום מערכת ויזואליזציה של גלי קול תלת-ממדיים שמתפשטים מהרמקולים בחדר ומגיבים למוזיקה בזמן אמת.

---

## 1. ארכיטקטורה טכנית

### 1.1 רכיבים עיקריים
- **SoundWaveEmitter** - רכיב שיוצר גלים מהרמקולים
- **SoundWaveParticle** - חלקיק בודד של גל קול
- **SoundWaveSystem** - מנהל את כל הגלים בחדר
- **WavePhysics** - חישוב התפשטות והתנגשויות

### 1.2 מיקום הרמקולים (קיים)
- רמקול שמאלי: `[-13, 0, -8]`
- רמקול ימני: `[13, 0, -8]`
- גובה: `0` (רצפה)
- כיוון: פונים לכיוון מרכז החדר

### 1.3 ממדי החדר
- רוחב: 40 יחידות (X: -20 עד 20)
- עומק: 40 יחידות (Z: -20 עד 20)
- גובה: 20 יחידות (Y: 0 עד 20)

---

## 2. מכניקת הגלים

### 2.1 יצירת גלים
- **תדירות**: גלים נוצרים כל 0.1-0.2 שניות (תלוי בעוצמת המוזיקה)
- **עוצמה**: נקבעת לפי `audioData` - ממוצע תדרים נמוכים/בינוניים/גבוהים
- **כיוון**: גלים מתפשטים בצורה כדורית מהרמקול

### 2.2 התפשטות גלים
- **מהירות**: ~343 יחידות/שנייה (מהירות קול)
- **דעיכה**: עוצמה יורדת עם המרחק (1/r²)
- **התנגשויות**: גלים משתקפים מהקירות והרצפה

### 2.3 פרמטרים של גל
```typescript
interface SoundWave {
  id: string
  origin: [number, number, number]  // מיקום הרמקול
  radius: number                    // רדיוס נוכחי
  maxRadius: number                 // רדיוס מקסימלי לפני דעיכה
  intensity: number                 // עוצמה 0-1
  frequency: number                 // תדר דומיננטי
  color: THREE.Color                // צבע לפי תדר
  age: number                       // זמן חיים
  speed: number                     // מהירות התפשטות
}
```

---

## 3. ויזואליזציה

### 3.1 צורה ויזואלית
- **טבעות כדוריות** (Sphere rings) - טבעות שמתפשטות מהרמקול
- **משטחי גל** (Wave surfaces) - משטחים תלת-ממדיים שמתעקמים לפי עוצמה
- **חלקיקים** (Particles) - חלקיקים שמתפזרים עם הגל

### 3.2 צבעים לפי תדר
- **תדרים נמוכים (Bass)**: אדום/כתום - `HSL(0-30, 100%, 50%)`
- **תדרים בינוניים (Mid)**: צהוב/ירוק - `HSL(60-120, 100%, 50%)`
- **תדרים גבוהים (Treble)**: כחול/סגול - `HSL(200-270, 100%, 50%)`

### 3.3 אפקטים ויזואליים
- **Transparency**: שקיפות משתנה לפי עוצמה ומרחק
- **Bloom Effect**: זוהר חזק יותר בעוצמות גבוהות
- **Distortion**: עיוות קל של הגל בהתנגשויות

---

## 4. אינטגרציה עם מערכת האודיו הקיימת

### 4.1 שימוש ב-`audioData`
- `audioData` מ-`useAudio()` מספק 128 bins של תדרים
- חלוקה לתדרים:
  - **Bass (0-20)**: תדרים נמוכים
  - **Mid (20-60)**: תדרים בינוניים
  - **Treble (60-128)**: תדרים גבוהים

### 4.2 חישוב עוצמה
```typescript
// ממוצע תדרים נמוכים
const bassIntensity = average(audioData.slice(0, 20)) / 255

// ממוצע תדרים בינוניים
const midIntensity = average(audioData.slice(20, 60)) / 255

// ממוצע תדרים גבוהים
const trebleIntensity = average(audioData.slice(60, 128)) / 255

// עוצמה כוללת
const totalIntensity = (bassIntensity + midIntensity + trebleIntensity) / 3
```

---

## 5. מבנה קבצים

```
components/
├── audio/
│   ├── audio-manager.tsx           # מנהל אודיו (קיים מראש)
│   ├── audio-uploader.tsx          # העלאת קבצי אודיו (קיים מראש)
│   ├── frequency-visualizer.tsx    # ויזואליזציית תדרים (קיים מראש)
│   │
│   ├── sound-wave-emitter.tsx      # יוצר גלים מהרמקולים (מיושם)
│   ├── sound-wave-particle.tsx     # רכיב גל בודד - טבעות (מיושם)
│   ├── sound-wave-surface.tsx     # משטח גל תלת-ממדי (מיושם)
│   ├── sound-wave-particles.tsx    # חלקיקי גל (מיושם)
│   ├── sound-wave-system.tsx       # מנהל את כל הגלים (מיושם, אופציונלי)
│   └── wave-physics.ts             # חישובי פיזיקה וממשקים (מיושם)
```

### תיאור קבצים:

#### קבצים קיימים (מערכת האודיו המקורית):
- **audio-manager.tsx**: 
  - Context Provider (`AudioProvider`) לניהול אודיו מלא
  - Hook `useAudio()` - מספק גישה לנתוני אודיו
  - ניתוח תדרים בזמן אמת (`audioData: Uint8Array` - 128 bins)
  - ניהול Play/Pause/Volume/Seek
  - **אינטגרציה**: כל רכיבי גלי הקול משתמשים ב-`useAudio()` לקבלת נתוני תדרים

- **audio-uploader.tsx**: 
  - רכיב UI מלא להעלאת ושליטה בקבצי אודיו
  - **תכונות**:
    - העלאת קבצי אודיו (תמיכה בכל פורמטי אודיו)
    - בקרי Play/Pause עם אייקונים
    - בקר Volume עם slider ו-Mute toggle
    - Seek bar עם זמן נוכחי וזמן כולל (MM:SS)
    - UI מעוצב: רקע כהה עם blur, גבולות מעודנים, אנימציות
    - מיקום: פינה ימנית תחתונה (absolute positioning)
  - **טכנולוגיות**: 
    - משתמש ב-`useAudio()` hook לקבלת כל הפונקציונליות
    - Lucide React icons לאייקונים
    - Tailwind CSS לעיצוב
  - **אינטגרציה**: 
    - נקודת הכניסה הראשית למשתמש להפעלת המוזיקה
    - כאשר משתמש מעלה ומפעיל מוזיקה, כל רכיבי גלי הקול מתחילים להגיב אוטומטית
    - השינויים ב-Volume משפיעים גם על עוצמת גלי הקול (דרך audio-manager)

- **frequency-visualizer.tsx**: 
  - ויזואליזציה של תדרים כעמודים במעגל
  - **טכנולוגיה**: 
    - משתמש ב-`InstancedMesh` לביצועים טובים (64 instances)
    - `boxGeometry` כצורת בסיס לכל עמוד
    - עדכון בזמן אמת ב-`useFrame`
  - **פונקציונליות**:
    - מיפוי 128 frequency bins ל-64 עמודים (כל 2 bins → עמוד אחד)
    - גובה עמודים משתנה לפי עוצמת התדר (0.1 עד 3.1 יחידות)
    - צבעים דינמיים: HSL(216-288) - כחול לסגול לפי עוצמה
    - מיקום במעגל: רדיוס 4 יחידות, עמודים מסודרים במעגל
    - Emissive material עם זוהר כחול (intensity: 2)
  - **תכונות**:
    - מיקום ניתן להגדרה (default: [0, 0, 0])
    - עדכון צבעים דינמי לפי עוצמת כל תדר
    - עדכון גובה ומיקום כל פריים
  - **אינטגרציה**: 
    - משתמש ב-`useAudio()` hook לקבלת `audioData`
    - ויזואליזציה נוספת לצד גלי הקול (לא תלויה במערכת הגלים)
    - מציג את התדרים בצורה שונה מגלי הקול (עמודים vs טבעות/משטחים)

#### קבצים חדשים (מערכת גלי הקול):
- **sound-wave-emitter.tsx**: 
  - רכיב שיוצר גלים מרמקול ספציפי, כל רמקול עם Emitter משלו
  - **תכונות**:
    - יצירת גלים דינמית לפי עוצמת המוזיקה
    - תמיכה ב-4 סוגי ויזואליזציה (rings/surfaces/particles/all)
    - תמיכה ב-Instanced Rendering לאופטימיזציה (`useInstanced`)
    - ניהול גלים מוחזרים מהקירות
    - אינטראקציה בין גלים (התאבכות)
    - הגבלת מספר גלים אוטומטית
  - **Props**: `position`, `enabled`, `visualizationType`, `useInstanced`
  - **אינטגרציה**: משתמש ב-`useAudio()` לקבלת נתוני תדרים

- **sound-wave-particle.tsx**: 
  - רכיב גל בודד עם תמיכה ב-4 סוגי ויזואליזציה (rings/surfaces/particles/all)
  - **תכונות**:
    - טבעות על הרצפה (rings) - ברירת מחדל
    - משטחים תלת-ממדיים (surfaces) - דרך `SoundWaveSurface`
    - חלקיקים (particles) - דרך `SoundWaveParticles`
    - כל הסוגים יחד (all) - אפקט מרשים
  - **אפקטים**: שקיפות דינמית, Bloom, Distortion בהתנגשויות
  - **Props**: `wave`, `visualizationType`

- **sound-wave-surface.tsx**: 
  - משטח גל תלת-ממדי כדורי עם עיוות לפי עוצמה
  - **תכונות**:
    - `SphereGeometry` עם 32x32 segments
    - עיוות דינמי לפי עוצמה (דחיסה/מתיחה)
    - עיוות בהתנגשויות עם קירות
    - שקיפות גבוהה יותר (0.5) כי זה משטח מלא
    - Bloom effect דינמי
  - **Props**: `wave`

- **sound-wave-particles.tsx**: 
  - חלקיקים שמתפזרים עם הגל על פני הכדור
  - **תכונות**:
    - 20 חלקיקים ברירת מחדל (ניתן להתאים)
    - מיקום אקראי על פני כדור
    - צבעים עם וריאציה קלה
    - גודל ושקיפות משתנים לפי עוצמה
    - עיוות בהתנגשויות
  - **Props**: `wave`, `particleCount`
  - **טכנולוגיה**: `THREE.Points` עם `PointsMaterial`

- **sound-wave-system.tsx**: 
  - מנהל גלים מרובה רמקולים (אופציונלי)
  - **תכונות**:
    - ניהול גלים מכמה רמקולים במקביל
    - תמיכה בהחזרות ואינטראקציות
    - הגבלת מספר גלים כוללת
  - **שימוש**: אלטרנטיבה ל-`SoundWaveEmitter` נפרד לכל רמקול
  - **Props**: `speakerPositions` (מערך של מיקומים)

- **sound-wave-instanced.tsx** (נוסף בשלב 5):
  - גרסה מאופטמזת עם Instanced Rendering
  - **תכונות**:
    - `InstancedMesh` לרינדור יעיל
    - LOD system (פחות פרטים לגלים רחוקים)
    - Frustum culling אוטומטי
    - עדכון צבעים דינמי
  - **שימוש**: דרך `useInstanced={true}` ב-`SoundWaveEmitter`

- **wave-physics.ts**: 
  - כל חישובי הפיזיקה, ממשקים, ופונקציות עזר:
    - `SoundWave` interface - ממשק הגל המלא
    - `calculateIntensity()` - חישוב עוצמה כוללת
    - `calculateFrequencyIntensities()` - עוצמות לפי טווחי תדרים (Bass/Mid/Treble)
    - `calculateEmitInterval()` - תדירות דינמית לפי עוצמה
    - `createWave()` - יצירת גל חדש
    - `updateWave()` - עדכון פיזיקה (התפשטות, דעיכה)
    - `updateWaveWithCollisions()` - עדכון מלא כולל התנגשויות
    - `checkWallCollisions()` - התנגשויות עם קירות והחזרות
    - `createReflectedWave()` - יצירת גל מוחזר
    - `calculateWaveInterference()` - אינטראקציה בין גלים
    - `getColorByFrequency()` - צבעים לפי תדר
    - `getBassColor()`, `getMidColor()`, `getTrebleColor()` - פונקציות עזר
    - `isWaveActive()` - בדיקה אם גל פעיל
    - `WAVE_CONFIG` - כל הפרמטרים הניתנים להגדרה
    - `ROOM_BOUNDS` - גבולות החדר

---

## 6. אלגוריתם התפשטות

### 6.1 לולאת עדכון (useFrame)
```typescript
useFrame((state, delta) => {
  if (!enabled || !isPlaying || audioData.length === 0) {
    // ניקוי גלים כשהמוזיקה לא מנגנת או כשה-Emitter מושבת
    if (waves.length > 0) {
      setWaves([])
    }
    return
  }

  const currentTime = state.clock.elapsedTime
  const intensity = calculateIntensity(audioData)

  // חישוב תדירות דינמית לפי עוצמת המוזיקה
  // ככל שהמוזיקה חזקה יותר, הגלים נוצרים יותר מהר
  const emitInterval = calculateEmitInterval(intensity)

  // יצירת גל חדש אם עבר מספיק זמן והעוצמה מספיקה
  if (
    currentTime - lastEmitTime.current >= emitInterval &&
    intensity >= WAVE_CONFIG.minIntensityThreshold
  ) {
    const newWave = createWave(position, audioData, intensity)
    
    setWaves((prev) => {
      const updated = [...prev, newWave]
      // הגבלת מספר הגלים לכל רמקול
      return updated.slice(-Math.floor(WAVE_CONFIG.maxWaves / 2))
    })

    lastEmitTime.current = currentTime
  }

  // עדכון גלים קיימים (כולל התנגשויות עם קירות והחזרות)
  setWaves((prev) => {
    const updatedWaves: SoundWave[] = []
    const reflectedWaves: SoundWave[] = []
    
    // עדכון כל הגלים
    prev.forEach((wave) => {
      const { wave: updatedWave, reflectedWave } = updateWaveWithCollisions(wave, delta)
      
      // הוספת הגל המעודכן אם הוא עדיין פעיל
      if (isWaveActive(updatedWave)) {
        updatedWaves.push(updatedWave)
      }
      
      // הוספת גל מוחזר אם נוצר
      if (reflectedWave && isWaveActive(reflectedWave)) {
        reflectedWaves.push(reflectedWave)
      }
    })
    
    // אינטראקציה בין גלים (התאבכות)
    const wavesWithInterference: SoundWave[] = []
    const processedIndices = new Set<number>()
    
    updatedWaves.forEach((wave1, i) => {
      if (processedIndices.has(i)) return
      
      let finalWave = wave1
      let hasInterference = false
      
      // בדיקת אינטראקציה עם גלים אחרים
      updatedWaves.forEach((wave2, j) => {
        if (i === j || processedIndices.has(j)) return
        
        const interference = calculateWaveInterference(wave1, wave2)
        if (interference) {
          finalWave = interference.wave1
          processedIndices.add(j) // סמן את הגל השני כמעובד
          hasInterference = true
        }
      })
      
      wavesWithInterference.push(finalWave)
      processedIndices.add(i)
    })
    
    // שילוב גלים מעודכנים (עם אינטראקציה) וגלים מוחזרים
    const allWaves = [...wavesWithInterference, ...reflectedWaves]
    
    // הגבלת מספר הגלים (כולל מוחזרים)
    return allWaves.slice(-Math.floor(WAVE_CONFIG.maxWaves / 2))
  })
})
```

**הערות על היישום:**

**ניהול State:**
- שימוש ב-React state (`setWaves`) במקום מוטציה ישירה - מבטיח עדכון נכון של ה-UI
- שימוש ב-`useRef` למעקב אחר זמן יצירת הגל האחרון (`lastEmitTime`) - מונע re-renders מיותרים
- שני שלבי עדכון נפרדים: יצירת גלים חדשים ועדכון גלים קיימים

**יצירת גלים:**
- תדירות דינמית של יצירת גלים לפי עוצמת המוזיקה (`calculateEmitInterval`)
  - עוצמה גבוהה → מרווח קטן יותר (0.1 שניות) → גלים מהירים יותר
  - עוצמה נמוכה → מרווח גדול יותר (0.2 שניות) → גלים איטיים יותר
- בדיקת סף עוצמה מינימלית (`minIntensityThreshold`) לפני יצירת גל חדש
- הגבלת מספר גלים לכל רמקול: `maxWaves / 2` (כי יש 2 רמקולים)

**עדכון גלים:**
- עדכון פיזיקה מלא דרך `updateWaveWithCollisions()` - כולל התפשטות, דעיכה והתנגשויות
- בדיקת פעילות גל דרך `isWaveActive()` לפני הוספה לרשימה
- טיפול מלא בגלים מוחזרים מהקירות (`reflectedWave`) - כל גל מוחזר הוא גל חדש עם ID ייחודי

**אינטראקציה בין גלים:**
- חישוב התאבכות דרך `calculateWaveInterference()` - כאשר שני גלים חופפים
- אלגוריתם יעיל עם `Set` למעקב אחר גלים שכבר עובדו (`processedIndices`)
- חיבור עוצמות וצבעים משולבים כאשר גלים מתאבכים
- מניעת כפילות עיבוד של אותו גל

**ניהול ביצועים:**
- ניקוי אוטומטי של גלים כשהמוזיקה לא מנגנת או כשה-Emitter מושבת
- הגבלת מספר גלים אוטומטית לביצועים טובים - שימוש ב-`slice(-N)` לשמירה על הגלים האחרונים
- הסרת גלים לא פעילים אוטומטית דרך `isWaveActive()`

**פרטים טכניים:**
- שימוש ב-`state.clock.elapsedTime` למעקב מדויק אחר זמן
- הפרדה בין גלים מעודכנים (`updatedWaves`) וגלים מוחזרים (`reflectedWaves`)
- שילוב סופי של כל הגלים לפני הגבלת המספר

### 6.2 התנגשויות עם קירות
```typescript
export function checkWallCollisions(wave: SoundWave): {
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
  if (!hasCollision && newDistortion > 0) {
    newDistortion = Math.max(0, newDistortion - 0.01)
  }
  
  const updatedWave: SoundWave = {
    ...wave,
    intensity: hasCollision ? wave.intensity * WAVE_CONFIG.reflectionDamping : wave.intensity,
    distortion: newDistortion,
  }
  
  // יצירת גל מוחזר אם יש התנגשות
  const reflectedWave = hasCollision && reflectionNormal
    ? createReflectedWave(updatedWave, reflectionNormal)
    : null
  
  return {
    wave: updatedWave,
    reflectedWave,
  }
}
```

**תכונות מתקדמות:**
- החזרת גל חדש מוחזר (`reflectedWave`) במקום מוטציה של הגל המקורי
- עיוות (`distortion`) של הגל בהתנגשויות
- דעיכת עוצמה בהתנגשות (`reflectionDamping`)
- תמיכה בכל הקירות: אחורי, קדמי, שמאלי, ימני, רצפה ותקרה
- דעיכת עיוות אוטומטית עם הזמן

---

## 7. ביצועים ואופטימיזציה

### 7.1 הגבלות
- **מקסימום גלים פעילים**: 20-30 גלים בו-זמנית
- **רזולוציית טבעות**: 32-64 vertices לטבעת
- **תדירות עדכון**: 60 FPS (useFrame)

### 7.2 אופטימיזציות
- **Instanced Rendering**: שימוש ב-`InstancedMesh` לגלים דומים
- **LOD (Level of Detail)**: פחות פרטים לגלים רחוקים
- **Frustum Culling**: הסתרת גלים מחוץ למסך
- **Object Pooling**: שימוש חוזר באובייקטי גלים

### 7.3 ניהול זיכרון
- הסרת גלים ישנים אוטומטית
- הגבלת מספר הגלים לפי ביצועים
- שימוש ב-`useMemo` לחישובים כבדים

---

## 8. שלבי יישום

### שלב 1: רכיב בסיסי ✅
- [x] יצירת `SoundWaveParticle` - גל בודד פשוט
- [x] התפשטות בסיסית (כדורית)
- [x] דעיכה עם מרחק

### שלב 2: אינטגרציה עם אודיו ✅
- [x] חיבור ל-`useAudio()`
- [x] יצירת גלים לפי עוצמת המוזיקה
- [x] צבעים לפי תדר

### שלב 3: פיזיקה מתקדמת ✅
- [x] התנגשויות עם קירות
- [x] החזרות והשתקפויות מלאות (יצירת גלים מוחזרים בהתנגשויות)
- [x] אינטראקציה בין גלים (התאבכות, חיבור עוצמות) - פונקציה זמינה, ניתן להפעיל ב-Emitter

### שלב 4: ויזואליזציה משופרת ✅
- [x] טבעות כדוריות חלקות
- [x] אפקטי Bloom ושקיפות
- [x] אנימציות חלקות

### שלב 5: אופטימיזציה ✅
- [x] Instanced rendering
- [x] LOD system
- [x] Performance monitoring

---

## 9. פרמטרים להגדרה

```typescript
const WAVE_CONFIG = {
  // יצירת גלים
  emitInterval: 0.15,           // שניות בין גלים
  minIntensityThreshold: 0.1,  // עוצמה מינימלית ליצירת גל
  
  // התפשטות
  baseSpeed: 10,                // מהירות בסיס (יחידות/שנייה)
  maxRadius: 30,                // רדיוס מקסימלי לפני דעיכה
  
  // ויזואליזציה
  ringThickness: 0.1,           // עובי הטבעת
  ringSegments: 64,             // מספר קטעים בטבעת
  opacityBase: 0.6,             // שקיפות בסיסית
  
  // ביצועים
  maxWaves: 25,                 // מקסימום גלים פעילים
  cullingDistance: 50,          // מרחק הסתרה
}
```

---

## 10. דוגמאות קוד ראשוניות

### 10.1 SoundWaveParticle
```typescript
function SoundWaveParticle({ wave }: { wave: SoundWave }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame(() => {
    if (!meshRef.current) return
    
    // עדכון רדיוס
    meshRef.current.scale.setScalar(wave.radius)
    
    // עדכון שקיפות
    const material = meshRef.current.material as THREE.MeshStandardMaterial
    material.opacity = wave.intensity * WAVE_CONFIG.opacityBase
  })
  
  return (
    <mesh ref={meshRef}>
      <ringGeometry 
        args={[
          wave.radius - WAVE_CONFIG.ringThickness,
          wave.radius + WAVE_CONFIG.ringThickness,
          WAVE_CONFIG.ringSegments
        ]} 
      />
      <meshStandardMaterial
        color={wave.color}
        transparent
        opacity={wave.intensity * WAVE_CONFIG.opacityBase}
        emissive={wave.color}
        emissiveIntensity={wave.intensity * 2}
      />
    </mesh>
  )
}
```

### 10.2 SoundWaveSystem
```typescript
export function SoundWaveSystem({ speakerPositions }: { speakerPositions: [number, number, number][] }) {
  const { audioData, isPlaying } = useAudio()
  const [waves, setWaves] = useState<SoundWave[]>([])
  const lastEmitTime = useRef<number>(0)
  
  useFrame((state, delta) => {
    if (!isPlaying || audioData.length === 0) return
    
    const currentTime = state.clock.elapsedTime
    
    // יצירת גלים חדשים
    if (currentTime - lastEmitTime.current >= WAVE_CONFIG.emitInterval) {
      const intensity = calculateIntensity(audioData)
      
      if (intensity >= WAVE_CONFIG.minIntensityThreshold) {
        speakerPositions.forEach(position => {
          const newWave = createWave(position, audioData, intensity)
          setWaves(prev => [...prev, newWave].slice(-WAVE_CONFIG.maxWaves))
        })
        lastEmitTime.current = currentTime
      }
    }
    
    // עדכון גלים קיימים
    setWaves(prev => prev.map(wave => updateWave(wave, delta)).filter(wave => wave.intensity > 0.01))
  })
  
  return (
    <>
      {waves.map(wave => (
        <SoundWaveParticle key={wave.id} wave={wave} />
      ))}
    </>
  )
}
```

---

## 11. שיפורים עתידיים אפשריים

1. **גלים תלת-ממדיים מלאים** - משטחים כדוריים במקום טבעות
2. **אפקטי Doppler** - שינוי תדר בתנועה
3. **התאבכות גלים** - אינטראקציה בין גלים שונים
4. **אקוסטיקה ריאליסטית** - הדים והשתקפויות מדויקות יותר
5. **VR/AR Support** - חוויה תלת-ממדית מלאה

---

## סיכום

תוכנית זו מספקת מסגרת מלאה ליישום מערכת גלי קול תלת-ממדית שמגיבה למוזיקה בזמן אמת. המערכת תתחבר למערכת האודיו הקיימת ותיצור חוויה ויזואלית מרשימה של התפשטות קול בחדר.

**השלב הבא**: התחלת יישום החל משלב 1 - רכיב בסיסי של גל בודד.

