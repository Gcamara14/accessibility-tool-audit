# Catalyst Template: Info: Incorrect Heading Structure - Heading Levels Are Skipped

**Template ID:** `WA11Y-WEB-2.4.6-001`
**Platform:** Web
**WCAG Criterion:** WCAG-2.4.6

---

## 🛑 The Problem
Heading levels are skipped, disrupting the logical structure and navigation for screen reader users.

**Expected Result:** Headings follow a logical sequence without skipping levels, ensuring a coherent structure for assistive technologies.
**Actual Result:** Heading levels are skipped (e.g., jumping from &lt;h1&gt; to &lt;h3&gt;), disrupting the document structure.

---

## ✅ The Fix Patterns

> **Recommendation:** Ensure that headings follow a logical order without skipping levels. Use appropriate heading tags (&lt;h1&gt; to &lt;h6&gt;) to represent the document structure accurately.

### Standard Implementation
```html
// Best: heading levels in ascending order
        <h1>TV Products</h1>
        <h2>All Brands</h2>
        <h3>LG Brand</h3>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
