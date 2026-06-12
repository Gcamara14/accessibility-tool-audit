# Catalyst Template: Color Contrast: Low Contrast Placeholder Text

**Template ID:** `WA11Y-ALL-1.4.3-002`
**Platform:** Web, iOS, Android
**WCAG Criterion:** WCAG-1.4.3

---

## 🛑 The Problem
Placeholder text contrast is too low, which may be hard for users to read.

**Expected Result:** Placeholder text should be avoided for instructional information; use helper text with sufficient contrast instead.
**Actual Result:** Placeholder text has a low contrast ratio and may not be readable.

---

## ✅ The Fix Patterns

> **Recommendation:** Replace placeholder text with helper text. Use the LD Form field, and use the helper text prop instead. Remove Placeholder.

### Standard Implementation
```html
// Best:
        Use an LD approved color/design token. Do not use a custom hex. Design support needed to choose an accessible color.
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
