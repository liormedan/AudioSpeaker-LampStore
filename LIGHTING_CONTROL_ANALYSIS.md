# ניתוח פרמטרי התאורה הכללית

## מקורות תאורה בסצנה הראשית (store-showroom.tsx)

### 1. DynamicLighting Component (שורות 115-151)
**כבר מחובר למתג** ✅
- `ambientIntensity` - שורה 124
- `directionalIntensity` - שורה 125  
- `directional2Intensity` - שורה 126
- `spotIntensity` - שורה 127
- `rimIntensity` - שורה 128

### 2. CeilingLight Component (שורות 48-113)
**כבר מחובר למתג** ✅
- `lightIntensity` - שורה 54
- `emissiveIntensity` - שורה 55

### 3. Environment Component (שורה ~220)
**לא מחובר למתג** ❌
- `<Environment preset="city" />` - זה יוצר תאורה סביבתית HDRI
- זה יכול להיות מקור תאורה חזק שלא נשלט על ידי המתג

### 4. Post-processing Effects (שורות ~137-151)
**לא משפיעים על עוצמת תאורה** ℹ️
- `SSAO` - רק אפקט עומק
- `Bloom` - רק אפקט זוהר
- לא משפיעים על עוצמת התאורה הכללית

## הבעיה

**Environment preset="city"** יוצר תאורה סביבתית חזקה שלא נשלטת על ידי המתג!

## פתרון מוצע

### אפשרות 1: להסיר את Environment בחושך
```typescript
{darkness < 0.5 && <Environment preset="city" />}
```

### אפשרות 2: לשלוט על Environment intensity
```typescript
<Environment preset="city" environmentIntensity={1 - darkness} />
```

### אפשרות 3: להחליף Environment בהתאם לחושך
```typescript
{darkness < 0.3 ? (
  <Environment preset="city" />
) : (
  <Environment preset="night" />
)}
```

## פרמטרים נוספים שצריך לבדוק

1. **Background color** - כבר מחובר (שורה 158)
2. **מנורות הרהיטים** - ב-store-furniture.tsx - לא מחוברות למתג
3. **מנורות התצוגה** - ב-lamp-display.tsx - לא מחוברות למתג

## המלצה

לחבר את `Environment` למתג - זה כנראה המקור העיקרי לתאורה שלא נשלטת!

