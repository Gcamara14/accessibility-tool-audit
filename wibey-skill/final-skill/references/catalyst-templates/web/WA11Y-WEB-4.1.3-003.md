# Catalyst Template: Status Message: Snackbar Messages Not Announced to Screen Reader (Snackbar)

**Template ID:** `WA11Y-WEB-4.1.3-003`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.3

---

## 🛑 The Problem
Snackbar message is not announced to screen readers.

**Expected Result:** Snackbar messages should be announced using a status message for assistive technology.
**Actual Result:** The snackbar message appears without being announced to screen readers.

---

## ✅ The Fix Patterns

> **Recommendation:** Ensure the snackbar announces. Use LD Snackbar. If needed, add a 1-2 second delay. As a last resort, leverage LDA11YAnnouncement Utility.

### Standard Implementation
```html
// Best: Use LD Snackbar
        LD addSnack
        
        // Good: LD A11Y Announcement
        <A11YAnnouncementProvider>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.


## Variation 1 — LD `useA11yAnnouncement` hook with `setTimeout` delay (Snackbar + `announcePolite`)

**Ingested by:** Wibey Swarm Agent (Step 8 — CEPG-338731)
**Date:** 2026-03-23
**JIRA:** CEPG-338731 | **PR:** #166745
**Commit:** `f1c55d4a24076765068189d8d0313f5a8fae20f2`

---

### Classification: variation

- **Template:** `WA11Y-WEB-4.1.3-003` — Snackbar Messages Not Announced to Screen Reader
- **Variation:** 1
- **WCAG Criterion:** 4.1.3 Status Messages (Level AA)
- **Sub-criterion label:** Snackbar add-to-cart confirmation not announced — LD `useSnackbar` alone does not trigger a live region announcement for the message string
- **Platform:** Web
- **Component:** `useATCSnackbar` hook — `libs/cart/deal-recommendation-container/src/lib/hooks/use-atc-snackbar.tsx`
- **Domain:** Transaction / Cart

---

### Problem Description

When a user adds a deal recommendation item to cart, a snackbar confirmation appears ("Added: [Product Name]"). The snackbar is rendered by LD's `useSnackbar` / `addSnack`, which handles the visual toast — but the message string itself is never piped into a live region, so screen reader users receive no announcement that the add-to-cart action succeeded.

**Expected:** Screen reader announces "Added: [Product Name]" (or equivalent) when the snackbar fires.
**Actual:** Snackbar appears visually; screen reader is silent. Users cannot confirm the cart action completed.

---

### Bad Pattern (❌)

```tsx
// WCAG 4.1.3 VIOLATION: addSnack renders the snackbar visually but does not
// announce the message string via a live region. Screen readers are silent.

import { useSnackbar } from "@walmart-web/livingdesign-components";

export const useATCSnackbar = () => {
  const { addSnack } = useSnackbar();

  // ...inside handler:
  if ((quantity as number) === 1 && clickedItem && quantity) {
    addSnack({
      message: `${m(messages, "added")}: ${trimProductName(
        clickedItem.product.name
      )}`,
      actionButtonProps: {
        children: m(messages, "undo"),
        onClick: () => { /* undo handler */ },
      },
      UNSAFE_className: "mw6-m",
      UNSAFE_style: snackbarPlacement(),
    });
    // ❌ No live region announcement — screen reader never hears the message
  }
};
```

---

### Good Pattern (✅)

```tsx
// WCAG 4.1.3 FIX: Pair addSnack with announcePolite (from useA11yAnnouncement).
// A 1-second setTimeout prevents the snackbar mount animation from racing the
// live region injection, ensuring AT has a stable DOM node to read.

import {
  useSnackbar,
  useA11yAnnouncement,
} from "@walmart-web/livingdesign-components";

export const useATCSnackbar = () => {
  const { addSnack } = useSnackbar();
  const { announcePolite } = useA11yAnnouncement();

  // ...inside handler:
  if ((quantity as number) === 1 && clickedItem && quantity) {
    // Hoist message string so it can be reused by both addSnack and announcePolite
    const message = `${m(messages, "added")}: ${trimProductName(
      clickedItem.product.name
    )}`;

    addSnack({
      message,
      actionButtonProps: {
        children: m(messages, "undo"),
        onClick: () => { /* undo handler */ },
      },
      UNSAFE_className: "mw6-m",
      UNSAFE_style: snackbarPlacement(),
    });

    // ✅ Polite announcement after 1s delay — gives snackbar time to mount
    // before the live region fires so AT does not miss the message string
    setTimeout(() => {
      announcePolite(message);
    }, 1000);
  }
};
```

---

### Why It Works

LD's `useSnackbar` / `addSnack` renders the visual toast UI but does not implicitly create or update a live region for the message text. `useA11yAnnouncement` from `@walmart-web/livingdesign-components` provides a persistent off-screen `aria-live="polite"` region managed by the LD design system; calling `announcePolite(message)` injects the message string into that region, triggering an AT announcement without requiring focus movement. The 1-second `setTimeout` staggers the live region update from the snackbar mount animation, preventing a race condition where some screen reader / browser combinations silently drop live region updates that fire during DOM churn.

**Key details:**
- Hoist the message string into a `const` before passing to both `addSnack` and `announcePolite` — this guarantees the visual snackbar and the AT announcement are always identical.
- `announcePolite` (not `announceAssertive`) is correct here: the add-to-cart confirmation is informational, not time-critical, so it should not interrupt an ongoing screen reader utterance.
- The LD `A11YAnnouncementProvider` must be present in the React tree above this hook's consumer for `useA11yAnnouncement` to work. Confirm it is mounted at the app shell level.

---

### Source References
- **Jira:** https://jira.walmart.com/browse/CEPG-338731
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/166745
- **Commit:** `f1c55d4a24076765068189d8d0313f5a8fae20f2`
- **File:** `libs/cart/deal-recommendation-container/src/lib/hooks/use-atc-snackbar.tsx`

---

### Related Patterns
- `WA11Y-WEB-4.1.3-001` — Success status message: inline `aria-live="polite" role="status"` on WCP `<Alert>`
- `WA11Y-WEB-4.1.3-004` — General notify-without-focus pattern via LD `A11YAnnouncementProvider`

---

### Checklist
- [ ] Verify `A11YAnnouncementProvider` is mounted at app shell level for all consumers of `useA11yAnnouncement` in `libs/cart/`
- [ ] Consider auditing other `useSnackbar` call sites in `libs/cart/` to confirm they also pair with `announcePolite` where the snackbar message is user-action feedback

---

