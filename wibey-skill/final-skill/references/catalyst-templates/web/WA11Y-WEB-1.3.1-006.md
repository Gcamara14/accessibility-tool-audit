# Catalyst Template: Info: Missing Programmatic Label for Form Fields

**Template ID:** `WA11Y-WEB-1.3.1-006`
**Platform:** Web
**WCAG Criterion:** WCAG-1.3.1

---

## 🛑 The Problem
Form fields are missing programmatic labels, making them inaccessible to screen reader users.

**Expected Result:** All form fields should have associated labels to describe their purpose to assistive technologies.
**Actual Result:** Form fields lack &lt;label&gt; elements or appropriate ARIA labels, causing screen readers to announce them ambiguously or not at all.

---

## ✅ The Fix Patterns

> **Recommendation:** Ensure that every form field has an associated &lt;label&gt; element. Use the Living Design Form components because Living Design Forms are accessible. If building a custom form, Use the `for` attribute to link the label to the corresponding input.

### Standard Implementation
```html
// Best: LD Form Fields
        Use LD Form Fields, they all must have a visible <label> prop.
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
