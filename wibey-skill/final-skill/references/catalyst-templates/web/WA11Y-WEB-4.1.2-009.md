# Catalyst Template: State: Checked/Unchecked State Not Announced (Checkbox)

**Template ID:** `WA11Y-WEB-4.1.2-009`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem
Checkboxes and radio buttons do not announce their checked or unchecked state to screen readers.

**Expected Result:** The checked state should be conveyed by using native HTML5 form elements.
**Actual Result:** Screen readers do not announce the selection status of checkboxes or radio buttons.

---

## ✅ The Fix Patterns

> **Recommendation:** Use native `&lt;input type='checkbox'&gt;` or `&lt;input type='radio'&gt;` elements. Confirm the accessibilityTree shows the state of checked:true.

### Standard Implementation
```html
// Best: LD Checkbox
    <Checkbox>
    
    // Good: Native HTMl5 checkbox
    <input type="checkbox" checked>
    
    // Last Resort: Add keyboard event handlers
    <div role="checkbox" tabindex="0" aria-checked="true"> Extra Cheese</div>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
