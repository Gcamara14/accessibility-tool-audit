# Catalyst Template: Info: Strikethrough Text is Not Accessible - Use Screen Reader Only Text

**Template ID:** `WA11Y-WEB-1.3.1-005`
**Platform:** Web
**WCAG Criterion:** WCAG-1.3.1

---

## 🛑 The Problem
Strikethrough text is not conveyed properly to screen reader users, leading to misinterpretation of content.

**Expected Result:** Strikethrough text should be accessible and provide context to users, indicating removed or deprecated content.
**Actual Result:** Strikethrough text is visually apparent but not announced or lacks proper context for screen reader users.

---

## ✅ The Fix Patterns

> **Recommendation:** Provide additional context for strikethrough text by using screen reader-only text. Leverage the Living Design Utility, Visually Hidden Utility.

### Standard Implementation
```html
// Best: LD Visually Hidden Utility, then mark other text as hidden.
        <VisuallyHidden as="p">Was $20.99, Now $9.99</VisuallyHidden>
        <div aria-hidden="true"><span><s>$20.99</s></span> <span>$9.99</span></div>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
