# Catalyst Template: Alt Text: Complex Image Needs Detailed Description (Complex)

**Template ID:** `WA11Y-WEB-1.1.1-004`
**Platform:** Web
**WCAG Criterion:** WCAG-1.1.1

---

## 🛑 The Problem
Complex images like a graph requires a detailed description via paragraph or data table.

**Expected Result:** Complex images should be accompanied by a detailed text description, either inline or in a data table, to convey information.
**Actual Result:** Complex image lacks a descriptive paragraph or data table to accurately convey its content.

---

## ✅ The Fix Patterns

> **Recommendation:** Provide a detailed description of the complex image, either as inline text or in a data table adjacent to the image. Or have a dialog available so that we can provide a data table inside the dialog.

### Standard Implementation
```html
// Best:
        The alt text does not adequately describe it. Provide a data table for screen reader users.
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
