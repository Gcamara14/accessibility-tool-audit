# Catalyst Template: Focus Order: Dialog Focus is Not Managed to and from the Dialog

**Template ID:** `WA11Y-WEB-2.4.3-001`
**Platform:** Web
**WCAG Criterion:** WCAG-2.4.3

---

## 🛑 The Problem
Focus is not managed correctly when opening and closing a dialog, disrupting navigation for keyboard and screen reader users.

**Expected Result:** When a dialog is opened, focus should move to the dialog, and when dismissed, focus should return to the original triggering element.
**Actual Result:** Focus does not move to the dialog upon opening and does not return to the triggering element upon dismissal.

---

## ✅ The Fix Patterns

> **Recommendation:** Use the Living Design Modal. Or Implement focus management by moving focus to the dialog when it opens using the JavaScript Focus() method and ensure focus returns to the original triggering element when the dialog is closed.

### Standard Implementation
```html
// Best: LD Modal
        <Modal title="HelloWorld">
        
        // Good: JS eventlistener on close or open.
        TriggerButton.focus();
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

# Ingestion Draft: CEPG-367778 | PR #181887

**JIRA:** CEPG-367778
**PR:** #181887
**WCAG:** 2.4.3 Focus Order (Level A) — Dialog Focus is Not Managed to and from the Dialog
**Template ID:** WA11Y-WEB-2.4.3-001 (existing template — this PR is a concrete variation/example)
**Proposed Sub-ID or Variation Note:** WA11Y-WEB-2.4.3-001 (checkout-specific shared utility variant)
**Commit:** af8723df02b1fe68271e9b22411131d130e99658
**Author:** Gunjan Gidwani
**Date:** 2026-03-19
**Domain:** Transaction / Payments Checkout
**File Changed:** `libs/payments/more-ways-to-pay/src/lib/more-ways-to-pay.tsx`

---

## Summary

The `handleOpenOneCreditCardModal` handler for the DollarSavings action button in the More Ways to Pay section of Checkout did not use the shared ADA focus utility when opening the OneCreditCard modal. As a result, when the modal was dismissed, focus was lost — it did not return to the trigger button that opened the modal, breaking WCAG 2.4.3 Focus Order.

The fix threads the `event` object into `handleOpenOneCreditCardModal`, calls `addClassToEventTargetElement(event)` on open to mark the trigger button with a CSS class, and calls `removeClassNameAfterDelay()` on close to locate and `.focus()` that button after the modal dismisses.

---

## Bad Code (before)

```tsx
// handler had no event parameter — trigger element was never marked
const handleOpenOneCreditCardModal = () => {
  setIsOneCreditCardModalOpen(true);
  sendBeacon({ ... });
};

const handleCloseOneCreditCardModal = ({ status }: { status?: string }) => {
  setIsOneCreditCardModalOpen(false);
  // No focus restoration — focus was lost after modal close
  if (status === CREDIT_CARD_ADDED) {
    queryCache.invalidateQueries(walletCacheKey);
  }
};

// Type signature in getPaymentOptions options object
onOneCreditCardClick: () => void;

// Factory function signature
const createOnePayCreditCardOption = (
  onClick: () => void,
  tempoData?: TempoData,
  enableOneCreditDollarSavings?: boolean
): PaymentOption => ({ ... });
```

---

## Good Code (after)

```tsx
import {
  addClassToEventTargetElement,
  removeClassNameAfterDelay,
} from "@walmart-web/payments-shared-ada-utilities";

// On open: accept event, mark the trigger button with a CSS class
const handleOpenOneCreditCardModal = (
  event?: React.MouseEvent<HTMLElement, MouseEvent>
) => {
  if (event) {
    addClassToEventTargetElement(event);
    // Adds class "focus-visible-after-modal-close" to event.currentTarget
  }
  setIsOneCreditCardModalOpen(true);
  sendBeacon({ ... });
};

// On close: use removeClassNameAfterDelay to find the marked element and .focus() it
const handleCloseOneCreditCardModal = ({ status }: { status?: string }) => {
  setIsOneCreditCardModalOpen(false);
  removeClassNameAfterDelay();
  // After 200ms, finds element with class "focus-visible-after-modal-close",
  // calls .focus() on it, then removes the class
  if (status === CREDIT_CARD_ADDED) {
    queryCache.invalidateQueries(walletCacheKey);
  }
};

// Updated type signatures
onOneCreditCardClick: (
  event?: React.MouseEvent<HTMLElement, MouseEvent>
) => void;

const createOnePayCreditCardOption = (
  onClick: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  tempoData?: TempoData,
  enableOneCreditDollarSavings?: boolean
): PaymentOption => ({ ... });
```

---

## The Shared Utility (payments-shared-ada-utilities)

Located at: `libs/payments-shared/ada-utilities/src/lib/ada-focus-utils.ts`
Package: `@walmart-web/payments-shared-ada-utilities`

```ts
// On modal open — tags the triggering element
export const addClassToEventTargetElement = (
  event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  className?: string
): void => {
  const defaultClassName = "focus-visible-after-modal-close";
  const target = event.currentTarget as HTMLElement;
  if (target && target.classList) {
    target.classList.add(className || defaultClassName);
  }
};

// On modal close — finds the tagged element and returns focus to it
export const removeClassNameAfterDelay = (
  className?: string,
  delay = 200
): void => {
  const removeClassName = className || "focus-visible-after-modal-close";
  setTimeout(() => {
    const elements = document.getElementsByClassName(`${removeClassName}`);
    if (elements[0]) {
      (elements[0] as HTMLElement).focus();
      if (elements[0]) {
        elements[0].classList.remove(removeClassName);
      }
    }
    if (elements.length > 0) {
      Array.from(elements).forEach((element: Element) => {
        (element as HTMLElement).classList.remove(removeClassName);
      });
    }
  }, delay);
};
```

---

## Why It Fixes WCAG 2.4.3 — Focus Order

WCAG 2.4.3 requires that focus moves in a meaningful, logical order. For dialogs this means:

1. **Trigger button clicked** → focus is on the trigger button
2. **Modal opens** → focus moves INTO the modal (handled by LD Modal built-in focus management)
3. **Modal dismissed** → focus MUST return to the element that opened the modal (the trigger button)

Without the fix, step 3 was missing. Focus was dropped to the `<body>` or wherever the browser defaulted after modal unmount. Screen reader and keyboard users had no way to orient themselves after the dialog closed.

**The fix mechanism:**
- On open: `addClassToEventTargetElement(event)` stamps the CSS class `focus-visible-after-modal-close` onto `event.currentTarget` (the trigger button). This class acts as a "bookmark" since the modal uses `event.currentTarget`, not `event.target`, so the correct element in the React component tree is always marked.
- On close: `removeClassNameAfterDelay()` uses a 200ms `setTimeout` to wait for the modal's exit animation / DOM cleanup to complete, then queries `document.getElementsByClassName("focus-visible-after-modal-close")`, calls `.focus()` on the first result, and removes the class.

This is a DOM-class-based focus bookmarking pattern — not useRef, not FocusTrap, not LD Modal `initialFocus` prop.

---

## Pattern Classification

| Attribute | Value |
|---|---|
| Mechanism | CSS class bookmark + `setTimeout` + `.focus()` |
| Shared utility | `@walmart-web/payments-shared-ada-utilities` |
| Trigger → Dialog | LD Modal built-in focus management (automatic) |
| Dialog → Trigger | `removeClassNameAfterDelay()` after modal close state |
| New or Variation | Variation of WA11Y-WEB-2.4.3-001 (existing template is generic; this is the checkout-specific shared utility implementation) |

---

## Team / Domain Notes

- **Domain:** Transaction — Payments Checkout
- **Jira prefix:** CEPG-*
- **File:** `libs/payments/more-ways-to-pay/src/lib/more-ways-to-pay.tsx`
- This is NOT an isolated fix. The same utility pair (`addClassToEventTargetElement` + `removeClassNameAfterDelay`) is already used in the same file for the `handleOpenPayByBankModal` / `handleClosePayByBankModal` handlers (lines 342-381 in the current file). This PR applies the same established pattern to `handleOpenOneCreditCardModal` / `handleCloseOneCreditCardModal`, which had been missed.
- The pattern is formalized in `libs/payments-shared/ada-utilities/` — a dedicated ADA utilities library for the payments checkout domain.
- Any new modal open/close handler pair in `more-ways-to-pay.tsx` or other checkout payment components should follow this same pattern.

---

## Bonus Cross-Criterion Findings

- **WCAG 2.1.1 (Keyboard):** The event handler accepts `React.MouseEvent` — keyboard (Enter/Space) invocation paths via the LD Button component would also fire the same handler, so keyboard users benefit equally from the focus restoration.
- **No 4.1.2 issues found** in this diff. The LD Modal title prop contract (documented in CEPG-337717) was not touched.

---


---

# Ingest Draft: CEPG-339304 / PR #163562

**JIRA:** CEPG-339304 | **PR:** #163562
**WCAG:** 2.4.3 Focus Order — Dialog Focus is Not Managed to and from the Dialog (Level A)
**Template ID / Proposed ID:** Variation of WA11Y-WEB-2.4.3-001
**Commit:** fbaefc7c3a20b4917d7d98983dda7b1ab5c09b34
**Author:** Cliff Wright (c0w0eig)
**Merge Title:** fix(cart): tile redesign AOS ada fixes (#163562)
**Primary Source File:** libs/cart/add-on-services/src/lib/aos-modal.tsx
**Supporting File:** libs/cart/add-on-services/src/lib/aos-modal-headers.tsx

---

## Summary

The Add-On Services (AOS) modal in Cart has two internal panels: a **selection panel** (choose a service/protection plan) and a **details panel** (view plan details). When the user clicked "View Details," focus was moved to the Okay button inside the details panel using a `okayButtonRef`. This is wrong for two reasons: (1) the Okay button is an action element, not the logical reading start for a new panel; (2) when the user triggered the view-details transition, the triggering button itself was not blurred first, causing race conditions with screen readers.

This fix replaces the `okayButtonRef → okayButton.focus()` pattern with `titleRef → h2.focus()` — focus lands on the panel heading, which is the correct semantic anchor for a new view.

---

## Bad Code (before)

### aos-modal.tsx — wrong focus target (Okay button) and no blur before transition

```tsx
// BAD: ref pointed at the action button, not the heading
const okayButtonRef = useRef<HTMLButtonElement>(null);

// BAD: focus sent to an action button when view transitions
viewDetails={() =>
  callWithRequestAnimationFrame(() => {
    setDetailsContentShown(true);
    okayButtonRef.current?.focus();  // action button is wrong semantic anchor
  })
}

// BAD: DetailsOkayButton received the ref
<DetailsOkayButton
  onDetailsClose={onDetailsClose}
  buttonRef={okayButtonRef}
/>

// BAD: "View Details" button onClick had no blur — could cause double-firing issues
<Button
  onClick={viewDetails}
  ...
>
  {m(messages, "viewDetails")}
</Button>
```

### aos-modal-headers.tsx — h2 was not focusable

```tsx
// BAD: plain h2, cannot receive programmatic focus
<h2 className="ma0 dib v-mid f3" id={titleId}>
  {title}
</h2>
```

### aos-modal.tsx — fieldset/legend — legend was wrapped inside VisuallyHidden (wrong nesting)

```tsx
// BAD: VisuallyHidden wraps the entire legend — AT may not read the legend text
<fieldset tabIndex={-1} className="pointer bn w-100 pa0 ma0">
  <VisuallyHidden>
    <legend>
      {isCarePlan
        ? m(messages, "selectAProtectionPlan")
        : m(messages, "selectAService")}
    </legend>
  </VisuallyHidden>
```

---

## Good Code (after)

### aos-modal.tsx — ref moved to h2 heading; rAF wraps focus call; blur before transition

```tsx
// GOOD: ref targets the heading, which is the semantic start of the new panel
const titleRef = useRef<HTMLHeadingElement>(null);

// GOOD: blur the trigger first, then defer the transition + focus to avoid
//       race conditions with screen readers announcing stale content
<Button
  onClick={() => {
    viewDetailsRef.current?.blur();
    setTimeout(() => viewDetails(), 100);
  }}
  ...
>
  {m(messages, "viewDetails")}
</Button>

// GOOD: focus the panel title on view transition, inside rAF for DOM stability
viewDetails={() =>
  callWithRequestAnimationFrame(() => {
    setDetailsContentShown(true);
    requestAnimationFrame(() => titleRef.current?.focus());
  })
}

// GOOD: DetailsOkayButton no longer receives a ref — it does not need one
<DetailsOkayButton onDetailsClose={onDetailsClose} />

// GOOD: titleRef passed to both DesktopHeader and MobileHeader
title={({ titleId }) => (
  <ModalHeader
    ...
    titleRef={titleRef}
  />
)}
```

### aos-modal-headers.tsx — h2 made programmatically focusable

```tsx
// GOOD: tabIndex={-1} allows programmatic focus without adding to tab order
//       ref forwarded from AOSModal so the caller controls when focus lands
<h2
  className="ma0 dib v-mid f3"
  id={titleId}
  ref={titleRef}
  tabIndex={-1}
>
  {title}
</h2>
```

Applied to both DesktopHeader and MobileHeader. Both components now accept:
```tsx
titleRef?: React.Ref<HTMLHeadingElement>;
```

### aos-modal.tsx — fieldset/legend nesting corrected

```tsx
// GOOD: VisuallyHidden is INSIDE the legend, not wrapping it
//       Screen readers read the legend content correctly
<fieldset className="pointer bn w-100 pa0 ma0">
  <legend>
    <VisuallyHidden>
      {isCarePlan
        ? m(messages, "selectAProtectionPlan")
        : m(messages, "selectAService")}
    </VisuallyHidden>
  </legend>
```

Note: `tabIndex={-1}` was also removed from the fieldset — fieldsets should not receive programmatic focus; only the legend text matters.

### aos-modal.tsx — aria-label added to Modal root

```tsx
// GOOD: aria-label gives the dialog an accessible name independent of the title render-prop
<Modal
  position="right"
  size="medium"
  onClose={onClose}
  aria-label={currentTitle}   // <-- added
  title={({ titleId }) => (
    ...
  )}
```

### aos-tiles.tsx — same legend/VisuallyHidden fix applied (same pattern)

```tsx
// BEFORE — wrong nesting
<fieldset className="pointer bn ma0 pa0" style={{ minInlineSize: 0 }}>
  <VisuallyHidden>
    <legend>{m(messages, "selectAService")}</legend>
  </VisuallyHidden>

// AFTER — correct nesting + care-plan conditional
<fieldset className="pointer bn ma0 pa0" style={{ minInlineSize: 0 }}>
  <legend>
    <VisuallyHidden>
      {m(messages, isCarePlan ? "selectAProtectionPlan" : "selectAService")}
    </VisuallyHidden>
  </legend>
```

### aos-toggle.tsx — decorative icon made aria-hidden

```tsx
// GOOD: purely decorative icon in a button that already has a text label
<Icon
  name={isCarePlan ? "WalmartShield" : "Wrench"}
  className="mr2"
  aria-hidden="true"   // <-- added
/>
```

---

## Why This Fixes WCAG 2.4.3

WCAG 2.4.3 (Level A) requires that if a Web page can be navigated sequentially, the focusable components receive focus in an order that preserves meaning and operability.

For modal/dialog panel transitions:

1. **Heading as focus target** — When a new view loads inside a modal, focus should land on the heading of that view. This is the correct semantic anchor: it tells the user "you are now in the Details panel." Landing focus on an action button (Okay) skips the content and confuses screen reader users about their location.

2. **`tabIndex={-1}` on `<h2>`** — Non-interactive elements cannot receive programmatic focus by default. Adding `tabIndex={-1}` makes the heading focusable via `.focus()` without inserting it into the sequential tab order. This is the canonical pattern for programmatic-only focus destinations.

3. **`requestAnimationFrame` wrapping** — React state changes (`setDetailsContentShown(true)`) do not synchronously commit to the DOM. Wrapping `.focus()` in `requestAnimationFrame` (inside `callWithRequestAnimationFrame`) ensures the heading is rendered before focus is moved. Without this, `.focus()` on a not-yet-rendered element silently fails.

4. **Blur + setTimeout before transition** — Blurring the "View Details" button before calling `viewDetails()` prevents screen readers from announcing both the old focused element and the new one. The 100ms `setTimeout` gives the browser time to process the blur before the panel swap occurs.

5. **`aria-label` on Modal root** — Adds a stable accessible name for the dialog, ensuring that when a screen reader announces entry into the dialog, it reads the current title even if the `title` render-prop wiring is partially broken.

---

## Focus Management Mechanism

| Mechanism | Used? |
|---|---|
| `useRef` + `.focus()` | YES — `useRef<HTMLHeadingElement>` + `titleRef.current?.focus()` |
| FocusTrap component | NO |
| LD Modal built-in | PARTIAL — LD Modal handles open/close; manual focus for internal panel transitions |
| `initialFocus` prop | NO |
| `requestAnimationFrame` deferral | YES — double-rAF pattern (`callWithRequestAnimationFrame` + inner `requestAnimationFrame`) |

---

## Pattern Classification

**New pattern vs. existing template:** This is a **variation of WA11Y-WEB-2.4.3-001** (Dialog Focus Not Managed).

The base template covers open/close focus management for dialogs. This variation covers **internal panel/view transitions within an already-open dialog** (a wizard or multi-step modal pattern). The specific technique — `tabIndex={-1}` on the panel heading + `rAF(() => headingRef.current?.focus())` — is distinct from the Okay-button-ref pattern and should be added to WA11Y-WEB-2.4.3-001 as a new variation section.

**Proposed addition to WA11Y-WEB-2.4.3-001:**

> ### Variation 2: Internal Panel Transitions Within an Open Modal
>
> When a modal has multiple views/panels (e.g., selection → details), focus must be moved to the heading of the new panel, not an action button. Use `tabIndex={-1}` on the `<h2>` and `useRef<HTMLHeadingElement>` + `rAF(() => ref.current?.focus())`.

---

## Bonus Findings

1. **Legend/VisuallyHidden nesting bug** — Both `aos-modal.tsx` and `aos-tiles.tsx` had `<VisuallyHidden><legend>...</legend></VisuallyHidden>` which is incorrect. The `<legend>` must be a direct child of `<fieldset>`; wrapping it in `VisuallyHidden` can make the legend inaccessible to some AT. The correct pattern is `<legend><VisuallyHidden>text</VisuallyHidden></legend>`. This bug was fixed in the same PR and is worth adding to the 1.3.1 or 4.1.2 template knowledge.

2. **Decorative icon aria-hidden** — `aos-toggle.tsx` added `aria-hidden="true"` to an Icon component that is a sibling of visible button label text. This is a WCAG 1.1.1 fix bundled into a 2.4.3 PR — worth noting for template cross-reference.

3. **`tabIndex={-1}` removed from fieldset** — The `<fieldset tabIndex={-1}>` was removed. Fieldsets should not be programmatically focused. This was likely a leftover from an earlier (also wrong) attempt to manage focus.

4. **Care-plan conditional text** — The legend text in `aos-tiles.tsx` was hardcoded to "selectAService" regardless of `isCarePlan`. The fix adds a conditional: `isCarePlan ? "selectAProtectionPlan" : "selectAService"`. This is both an i18n accuracy fix and an accessible name correctness fix.

---

## Team / Domain Notes

- **Repo path:** `libs/cart/add-on-services/src/lib/`
- **Domain:** Cart — no existing teams file covers `libs/cart/`. The closest is Transaction (payments-checkout.md) which covers `libs/payments/`. This is a gap — the Cart/AOS domain has no teams file.
- **Design System:** Living Design (LD) Modal — `<Modal position="right" size="medium">` — right-drawer style modal. The `title` prop uses the render-prop pattern `({ titleId }) => <ModalHeader ... />`.
- **i18n:** Uses `m(messages, "key")` pattern throughout.
- **Framework:** React with Nx monorepo.
- **Focus pattern context:** AOS is a right-side drawer modal with two inner views. The pattern here (heading-ref focus on view transition) will apply to any other multi-panel LD Modal drawer in the codebase.

---

