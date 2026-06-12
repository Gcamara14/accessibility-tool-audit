# Catalyst Template: Role: Generic Interactive Role is Missing (Generic No Role)

**Template ID:** `WA11Y-WEB-4.1.2-006`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem
An interactive element lacks a semantic role, preventing screen readers from announcing its functionality.

**Expected Result:** Interactive elements should have appropriate semantic roles to convey their purpose to assistive technologies.
**Actual Result:** Elements like clickable &lt;div&gt; or &lt;span&gt; do not have semantic roles assigned.

---

## ✅ The Fix Patterns

> **Recommendation:** Replace non-semantic elements with semantic HTML5 elements, or use Living Design alternative, or as a last resort, use an appropriate ARIA roles

### Standard Implementation
```html
Use native semantic HTML5 elements such as <a>, <button>, <img>, <h1>, etc... Do NOT use <divs> those are not semantic.
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
