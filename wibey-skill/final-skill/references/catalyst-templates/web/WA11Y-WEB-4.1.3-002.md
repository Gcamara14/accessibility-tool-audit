# Catalyst Template: Status Message: Error Messages Not Announced (Error Status Message)

**Template ID:** `WA11Y-WEB-4.1.3-002`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.3

---

## 🛑 The Problem
Error message is not announced to screen readers. Error message not receiving focus as soon as it appears.

**Expected Result:** Focus should automatically move to the error message to ensure users are aware.
**Actual Result:** The error message is not announced or does not receive focus.

---

## ✅ The Fix Patterns

> **Recommendation:** Move focus to the error message to make it accessible to screen readers.

### Standard Implementation
```html
// Best: Use LD LDA11YAnnouncement
        <A11YAnnouncementProvider>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
