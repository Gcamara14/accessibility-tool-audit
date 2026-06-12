# Catalyst Template: Status Message: Success Messages Not Announced (Success Status Message)

**Template ID:** `WA11Y-WEB-4.1.3-001`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.3

---

## 🛑 The Problem
Success message is not announced to screen readers.

**Expected Result:** Success messages should be announced to users by moving focus or using a status message announcement.
**Actual Result:** The success message is not announced, and focus remains on the initial element.

---

## ✅ The Fix Patterns

> **Recommendation:** Recommended: Move focus to the success message, if not possible, use a status message announcement for screen reader visibility.

### Standard Implementation
```html
// Best: Use LD LDA11YAnnouncement
        <A11YAnnouncementProvider>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.


---

# Ingestion Draft: GPUGC-21456 — New Variation of WA11Y-WEB-4.1.3-001

**Ingested by:** Wibey Swarm Agent (Step 8 Protocol)
**Date:** 2026-03-23
**Jira:** GPUGC-21456
**PR:** #157085
**Commit:** 6f0740c8b1048d1be2ef25339e1aec0537adf0bc
**Author:** Vamshi Maddur (VAMSHI.MADDUR@walmart.com)
**File Fixed:** `libs/reviewer-community/all-reviews/src/lib/reviews-list.tsx`
**Classification:** NEW VARIATION of existing template WA11Y-WEB-4.1.3-001 (Var 3)

---

## WCAG Criterion

**4.1.3 Status Messages (Level AA)**
Sub-criterion label: **Success Status Message — Success Messages Not Announced**

After a user successfully deletes a draft review in the Reviewer Community "All Reviews" list,
no success feedback was surfaced to screen readers. The snackbar that confirms "Draft successfully
deleted" was rendered visually but contained no mechanism to announce it to assistive technology.

---

## Component / File Context

- **Component:** `ReviewList` — `libs/reviewer-community/all-reviews/src/lib/reviews-list.tsx`
- **Helper hook added:** `useSnackBarPlacementWeb` — `libs/reviewer-community/all-reviews/src/lib/utils.ts`
- **Design system:** Living Design (`@walmart-web/livingdesign-components`)
- **Hooks used:** `useSnackbar` (LD) + `useA11yAnnouncement` (LD)
- **Trigger:** `deleteDraftReview` `onSuccess` callback — fires after the delete API call resolves

---

## Bad Pattern

```tsx
// WCAG 4.1.3 VIOLATION: onSuccess callback only closes the modal and clears error state.
// No snackbar is shown, and no AT announcement is made — screen readers receive zero feedback
// confirming that the draft was deleted successfully.

const deleteDraftReview = useDeleteDraftReviewHandlers({
  onSuccess: () => {
    setOpenDeleteDraftModal({
      isOpen: false,
      draftReview: undefined,
    });
    // ❌ Missing: no success message, no aria-live announcement, no snackbar
    setError(undefined);
  },
  onError: (apiErrors) => {
    // ...
  },
});
```

---

## Good Pattern

```tsx
// FIXED: useA11yAnnouncement + useSnackbar from LD are imported and used together.
// announceAssertive() pushes the message into the LD A11YAnnouncementProvider's
// aria-live="assertive" region, ensuring immediate screen reader pickup.
// addSnack() renders the visual snackbar with the same message string.

import {
  useA11yAnnouncement,
  useSnackbar,
} from "@walmart-web/livingdesign-components";

// ... inside ReviewList component body:

const { addSnack } = useSnackbar();
const { snackbarPlacement } = useSnackBarPlacementWeb();   // responsive positioning helper
const { announceAssertive } = useA11yAnnouncement();

// Unified helper — keeps AT announcement and visual snackbar in sync:
const showSnackMessage = (message: string) => {
  announceAssertive(message);          // ✅ AT announcement via aria-live="assertive"
  addSnack({
    UNSAFE_className: "mw6-m",
    UNSAFE_style: snackbarPlacement(), // responsive: absolute on mobile, relative on desktop
    message,
  });
};

const deleteDraftReview = useDeleteDraftReviewHandlers({
  onSuccess: () => {
    setOpenDeleteDraftModal({
      isOpen: false,
      draftReview: undefined,
    });
    showSnackMessage(String(m(messages, "draftDeleteSuccess")));  // ✅ "Draft successfully deleted"
    setError(undefined);
  },
  onError: (apiErrors) => {
    // ...
  },
});
```

**Locale string added (en-US.yaml):**
```yaml
draftDeleteSuccess: "Draft successfully deleted"
```

**Responsive placement hook (utils.ts):**
```ts
export const useSnackBarPlacementWeb = () => {
  const isMobile = useMediaQuery(LESS_THAN_600_PX_QUERY);

  const snackbarPlacement = () => {
    const commonStyles: CSSProperties = {
      position: isMobile ? "absolute" : "relative",
      left: 0,
      right: 0,
      bottom: isMobile ? "1rem" : "4rem",
    };
    return isMobile ? commonStyles : { ...commonStyles, maxWidth: "none" };
  };
  return { snackbarPlacement };
};
```

---

## Why It Works

`useA11yAnnouncement` from Living Design injects the message string into the LD-managed
`aria-live="assertive"` region, causing screen readers to immediately interrupt and announce
the success message — satisfying WCAG 4.1.3's requirement that status messages be
programmatically determinable without receiving focus. Pairing `announceAssertive()` with
`addSnack()` in a single `showSnackMessage` helper guarantees that the visual and AT
experiences remain identical and are never accidentally decoupled in future refactors.

---

## Variation Notes (Var 3 vs Earlier Variations)

| Var | Jira | Component | AT Mechanism | Trigger Context |
|-----|------|-----------|--------------|-----------------|
| Var 1 | CEPG-335616 | `manage-dashboard` (Subscriptions) | LD A11YAnnouncement | Subscription success alert |
| Var 2 | HVCE-12342 | `vision-center-orders` (Health-Vision) | LD A11YAnnouncement | Order status success |
| Var 3 | GPUGC-21456 | `reviews-list` (Reviewer Community) | `announceAssertive` + `addSnack` | Delete draft success snackbar |

Var 3 is notable because it introduces a **dual-mechanism pattern**: `announceAssertive` for
immediate AT announcement AND `addSnack` for the visual snackbar, wrapped in a single
`showSnackMessage` helper. Previous variations used A11YAnnouncement without a snackbar, or
added a snackbar without an explicit assertive announcement. This var is the first to combine both.

---

