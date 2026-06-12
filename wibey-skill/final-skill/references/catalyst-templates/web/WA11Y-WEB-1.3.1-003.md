# Catalyst Template: Info: Data Table Structure Issues - Use Semantic HTML5 Table, TH, and TDs

**Template ID:** `WA11Y-WEB-1.3.1-003`
**Platform:** Web
**WCAG Criterion:** WCAG-1.3.1

---

## 🛑 The Problem
Data tables are not properly structured using semantic HTML, making them inaccessible to assistive technologies.

**Expected Result:** Data should be presented in a semantic &lt;table&gt; structure with appropriate use of &lt;th&gt; for headers and &lt;td&gt; for data cells.
**Actual Result:** Tables are created using non-semantic elements like &lt;div&gt; or lack proper header associations, causing confusion for screen reader users.

---

## ✅ The Fix Patterns

> **Recommendation:** Use semantic HTML table elements (&lt;table&gt;, &lt;thead&gt;, &lt;tbody&gt;, &lt;tr&gt;, &lt;th&gt;, &lt;td&gt;) to structure data tables correctly. Ensure that headers are properly associated with their corresponding data cells.

### Standard Implementation
```html
// Best: Use LD data table
        <DataTable>
        
        // Good: Native HTML5 Table Markup
        <table>
        <thead><tr><th>Product</th><th>Price</th></tr></thead>
        <tbody><tr><td>Margherita</td><td>$9.99</td></tr></tbody>
        </table>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
