## שיפורים מומלצים

### 1. אופטימיזציה של ביצועים
- [x] הוספת Perf מ-drei למעקב FPS
- [x] שימוש ב-AdaptiveDpr ו-AdaptiveEvents להתאמה אוטומטית
- [x] שימוש ב-LOD (Level of Detail) לאובייקטים רחוקים
- [x] אופטימיזציה של תאורה: יש הרבה pointLight — אפשר להחליף חלקם ב-RectAreaLight או IES lights

### 2. טקסטורות PBR אמיתיות
- [x] הוספת טקסטורות PBR לרצפה, קירות וריהוט (color, normal, roughness, ao)
- [x] שימוש ב-useTexture עם מפות מלאות במקום צבעים פשוטים

### 3. איכות קוד ותחזוקה
- [x] הפרדת לוגיקת תאורה לקומפוננטה נפרדת
- [x] יצירת hooks מותאמים (useLampLighting, useStoreEnvironment)
- [x] הוספת טיפול בשגיאות (Error Boundaries)
- [x] שיפור TypeScript: הוספת types מלאים, הסרת ignoreBuildErrors

### 4. חוויית משתמש
- [x] הוספת loading states לטעינת מודלים/טקסטורות
- [x] שיפור אינטראקטיביות: אנימציות מעבר חלקות, hover effects משופרים
- [x] הוספת קונטרול לתאורה (day/night slider) — כבר יש DimmerControl, אפשר לשפר
- [x] הוספת מצב VR/AR (אופציונלי)

### 5. אופטימיזציה של תאורה
- [x] החלפת חלק מה-pointLight ב-RectAreaLight (יעיל יותר)
- [x] שימוש ב-IES lights למנורות ריאליסטיות
- [x] אופטימיזציה של shadow maps (גודל ואיכות)

### 6. נגישות ו-SEO
- [x] הוספת metadata ל-Next.js (metadata API)
- [x] שיפור נגישות: ARIA labels, keyboard navigation
- [x] הוספת alt texts ותיאורים

### 7. פיזיקה (אופציונלי)
- [x] התקנת @react-three/rapier והוספת פיזיקה בסיסית
- [x] הוספת אינטראקציות פיזיקליות (למשל מנורות שנופלות)

### 8. מודלים High-Poly
- [x] החלפת פרימיטיבים במודלים GLB/GLTF מפורטים
- [x] שימוש ב-useGLTF עם preloading

### 9. סביבה דינמית
- [ ] הוספת מצבי מזג אוויר (בהיר/מעונן/ערפל)
- [ ] שיפור ה-Environment עם HDRI אמיתי

### 10. בדיקות ותיעוד
- [ ] הוספת בדיקות (Jest + React Testing Library)
- [ ] עדכון README עם הוראות התקנה והרצה
- [ ] תיעוד קומפוננטות