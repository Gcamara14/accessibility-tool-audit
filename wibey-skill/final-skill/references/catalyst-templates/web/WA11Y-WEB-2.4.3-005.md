# Catalyst Template: Focus Order: Focus Trapped in Specific Areas

**Template ID:** `WA11Y-WEB-2.4.3-005`
**Platform:** Web
**WCAG Criterion:** WCAG-2.4.3

---

## 🛑 The Problem
Focus becomes trapped within certain elements preventing users from navigating away using standard keyboard shortcuts.

**Expected Result:** Users should be able to navigate freely out of interactive elements without getting trapped. They should always be able to escape.
**Actual Result:** Focus cycles within a specific section, making it impossible to exit using the keyboard alone.

---

## ✅ The Fix Patterns

> **Recommendation:** Provide clear exit mechanisms so that keyboard users do not get stuck. This often happens with JS causing an issue..

### Standard Implementation
```html
// Best
        Remove the JS that is trapping focus and keeping the keyboard stuck... JS is the culprit.
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
