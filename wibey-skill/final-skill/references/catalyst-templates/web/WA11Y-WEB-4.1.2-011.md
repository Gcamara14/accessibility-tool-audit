# Catalyst Template: State: On/Off State Not Announced (Switch)

**Template ID:** `WA11Y-WEB-4.1.2-011`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem
Toggle switches do not announce their on or off state to screen readers, making it unclear if the setting is enabled or disabled.

**Expected Result:** Toggle states should be communicated using ARIA attributes like `aria-checked`.
**Actual Result:** Screen readers do not announce whether the toggle is on or off.

---

## ✅ The Fix Patterns

> **Recommendation:** Use role of 'switch' with an appropriate ARIA attributes of `aria-checked` to convey the toggle state to assistive technologies. It is a boolean, that goes from true/false.

### Standard Implementation
```html
// Best: LD Switch
    <Switch label="My Switch">
    
    // Good: Native HTMl5 Switch but with CSS
    <input type="checkbox" role="switch">
    
    // Last Resort: Add keyboard event handlers
    <button role="switch" tabindex="0" aria-checked="false">Gift Wrap</button>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
