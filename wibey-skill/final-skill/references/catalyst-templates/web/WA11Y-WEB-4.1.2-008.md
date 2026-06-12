# Catalyst Template: State: Pressed/Not Pressed State Not Announced (Toggle Button)

**Template ID:** `WA11Y-WEB-4.1.2-008`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem
Interactive elements like toggle buttons do not announce their pressed or not-pressed state to screen readers.

**Expected Result:** Pressed states should be communicated using ARIA attributes such as `aria-pressed`.
**Actual Result:** Screen readers do not announce whether the button is pressed or not after interaction.

---

## ✅ The Fix Patterns

> **Recommendation:** Implement `aria-pressed` to indicate the toggle state of the button. It toggles as a boolean, true/false.

### Standard Implementation
```html
// Best: Use checkbox instead...
        <input type="checkbox" id="favorite" name="favorites" />
        
        // Good: aria-pressed
        <button aria-label="Mark as favorite" aria-pressed="false">♡</button>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
