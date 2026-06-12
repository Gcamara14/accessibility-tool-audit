# Catalyst Template: Status Message: General Status Messages Not Announced (Notify screen reader about a change without moving focus)

**Template ID:** `WA11Y-WEB-4.1.3-004`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.3

---

## 🛑 The Problem
Status message is not announced to screen readers. Sometimes a visual change occurs that we need to notify the screen reader user about, BUT WITHOUT MOVING FOCUS.

**Expected Result:** All status messages should be announced to assistive technologies.
**Actual Result:** We need to notify the screen reader user about something. But the notification is not announced, making it inaccessible to screen reader users.

---

## ✅ The Fix Patterns

> **Recommendation:** Use ARIA live regions. Leverage the LDA11YAnnouncement utility.

### Standard Implementation
```html
// Best: Use LD LDA11YAnnouncement
        <A11YAnnouncementProvider>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
