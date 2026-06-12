# Catalyst Template: Keyboard: Link Not Keyboard Operable or Focusable

**Template ID:** `WA11Y-WEB-2.1.1-003`
**Platform:** Web
**WCAG Criterion:** WCAG-2.1.1

---

## 🛑 The Problem
A link element is neither focusable nor operable via keyboard, preventing keyboard users from navigating to it.

**Expected Result:** Link elements should be both focusable and operable using keyboard inputs.
**Actual Result:** The link does not receive keyboard focus and cannot be activated using keyboard inputs.

---

## ✅ The Fix Patterns

> **Recommendation:** Use semantic &lt;a href&gt; elements with valid `href` attributes for links to ensure they are inherently focusable and operable via keyboard.

### Standard Implementation
```html
// Best: LD Link
        <Link href="https://www.walmart.com">Default</Link>
        
        // Good: Semantic HTML5 link
        <a href="https://www.walmart.com">Default</a>
        
        // Last Resort: Must provide keyboard onclick/click event handlers too...
        <div role="link" tabindex="0">Checkout</div>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

# Ingestion Draft: CEPG-341082

**JIRA:** CEPG-341082 | **PR:** #163959
**WCAG:** 2.1.1 Keyboard (Level A)
**Template ID (existing):** WA11Y-WEB-2.1.1-003 — "Link Not Keyboard Operable or Focusable"
**Commit:** d3ab0736c3bc5cb80d1f748da164137d1b3ee0e0
**Author:** Vikram Golanukonda (v0g00t1)
**Date:** 2025-10-14

---

## Summary

In the Reviewer Community tax setup modal, a "Complete later" link (`<Link>`) was rendered without an `href` attribute. Because the LD/WCP `Link` component requires a valid `href` to be keyboard-focusable, omitting it meant the element was not reachable by Tab and not activatable by Enter or Space. The fix adds `href="#"`, `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler to make the element fully keyboard operable.

---

## File Path / Component

- **Repo:** `Walmart-Web-2` (walmart-web/walmart monorepo)
- **Source file:** `libs/reviewer-community/dashboard/src/lib/invite-to-program/tax-setup-cta.tsx`
- **Component:** `TaxSetupCta`
- **Context:** Tax setup modal — "Complete later" dismiss link inside the invite-to-program flow

---

## Bad Code (before)

```tsx
// ❌ Link without href — not keyboard focusable, not keyboard operable
<Link
  className="dark-gray underline"
  onClick={handleDialogClose}
  data-dca-id="L:E95255F0F8"
>
  {m(messages, "completeLater")}
</Link>
```

**Why it fails WCAG 2.1.1:**
The `Link` component relies on a valid `href` to render a native `<a>` element. Without `href`, many implementations render a non-focusable element (e.g., `<a>` with no href is not in the tab order per HTML spec). Keyboard users can never reach or activate the "Complete later" action.

---

## Good Code (after)

```tsx
// ✅ Link with href="#" + role="button" + tabIndex + onKeyDown handler
<Link
  className="dark-gray underline"
  href="#"
  role="button"
  tabIndex={0}
  onClick={handleDialogClose}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDialogClose();
    }
  }}
  data-dca-id="L:E95255F0F8"
>
  {m(messages, "completeLater")}
</Link>
```

**Why it fixes WCAG 2.1.1:**
1. `href="#"` ensures the underlying `<a>` element is natively focusable (part of the tab order).
2. `tabIndex={0}` explicitly confirms tab order inclusion (defensive against framework stripping).
3. `role="button"` communicates to assistive technology that this element acts as a button (dismiss action), not a navigation link — semantically accurate since it triggers `handleDialogClose` rather than navigating.
4. `onKeyDown` with Enter and Space handling replicates native button behavior: keyboard users can activate the dismiss via both keys. `e.preventDefault()` prevents spacebar from scrolling the page.

---

## Pattern Classification

This is a **variation of WA11Y-WEB-2.1.1-003** (Link Not Keyboard Operable or Focusable). The existing template covers adding `href` to a `<Link>` component. This PR extends the pattern with:

- Use of `role="button"` on a `<Link>` — appropriate when the link's action is a dismiss/close rather than navigation
- Explicit `onKeyDown` handler for both Enter and Space (Space is a button-specific affordance, not standard for `<a>`)
- `tabIndex={0}` as a defensive measure alongside `href`

This is a **hybrid link-as-button** fix pattern worth adding as a new code example (Variation 2) inside WA11Y-WEB-2.1.1-003.

---

## Test Evidence

The unit tests (`tax-setup-cta.spec.tsx`) were updated to:
- Query by `role="button"` instead of `getByText`, confirming the element is now exposed as a button in the accessibility tree.
- Add a dedicated keyboard interaction test that fires `keyDown` with `"Enter"` and `" "` and asserts `setIsOpen(false)` is called — direct regression protection for WCAG 2.1.1.

---

## Bonus Cross-Criterion Findings

- **WCAG 4.1.2 (Name, Role, Value):** Adding `role="button"` ensures the accessible role is correct (action element, not navigation). Without this, screen readers would announce it as "link" but it behaves as a dismiss button — a name/role mismatch.
- **WCAG 2.1.2 (No Keyboard Trap):** Not violated, but the `e.preventDefault()` on Space is important — without it, Space would scroll the page while also activating the handler, creating a confusing UX for keyboard users.

---

## Team / Domain Notes

- **Domain:** Marketplace (CEPG-* label mapping per `teams/Marketplace/README.md`)
- **Lib:** `libs/reviewer-community/dashboard` — separate from the MQD Products Modal lib documented in `teams/Marketplace/mqd-modal.md`
- **i18n pattern:** Uses `m(messages, "completeLater")` from `@walmart-web/platform-i18n` — consistent with Marketplace i18n conventions noted in mqd-modal.md
- **Framework:** React TSX, monorepo lib pattern

---

