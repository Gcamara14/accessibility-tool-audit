# Team Architecture: Payments Checkout

**Domain Area:** Transaction
**Jira Label Mapping:** `CEPG-*` (Payments / Checkout Experience)
**Last Updated:** 2026-03-20

---

## 📍 Where the Code Lives

When fixing bugs for this team, start your search here (priority routing) before falling back to global grep: this monorepo path:
- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Checkout UI root:** `libs/payments/checkout/src/`

### Key Component Paths
| Component | Path |
|---|---|
| DsClarityDialog | `libs/payments/checkout/src/lib/components/ds-clarity/ds-clarity-dialog.tsx` |

---

## 🛠️ Tech Stack & Constraints

- **Framework:** Next.js (SSR) / React
- **Design System:** Living Design (LD) — uses LD Modal as the base for `DsClarityDialog`
- **LD Modal wrapper pattern:** `DsClarityDialog` wraps `@walmart/living-design` Modal; consumers call `<DsClarityDialog title={...}>` directly

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-20] CEPG-337717 — LD Modal `title` render-prop contract (WCAG 4.1.2):**
  When the `title` prop is a render function, it **must** destructure `{ titleId }` and apply `id={titleId}` to the visible title element. Without this, `aria-labelledby` on the dialog points to a non-existent DOM ID and the dialog has no accessible name.

  ```tsx
  // ✅ CORRECT — always destructure { titleId }
  title={({ titleId }) => <div id={titleId}>My Title</div>}

  // ❌ WRONG — titleId is never applied; aria-labelledby is broken
  title={() => <div>My Title</div>}
  ```

  See `RECOMMENDED_TEMPLATES.md` Draft #1 (proposed `WA11Y-WEB-4.1.2-012`) for the full pattern and unit test.

- **[2026-03-20] CEPG-367463 — Feature-flag conditional alt text missing on product-variant payment card images (WCAG 1.1.1):**
  When `enableOneCreditDollarSavings` flag is `true`, the UI shows the "CashRewards Card" product but alt text was hardcoded to "OnePay CashRewards Card" (wrong product name). Fix: thread the flag into `getAltTextForIcon`, `getAriaLabelForOnePayCreditCard`, and all `<Image alt={...}>` expressions. Add new locale key `oneCashRewardsCard` in all 6 locale YAML files.

  ```tsx
  // ❌ WRONG — static alt, wrong product name under flag
  <Image alt={m(messages, "onePayCard")} />

  // ✅ CORRECT — conditional alt matches the active product variant
  <Image alt={enableOneCreditDollarSavings ? m(messages, "oneCashRewardsCard") : m(messages, "onePayCard")} />
  ```

  **Rule:** `alt` must be conditional whenever `src` is conditional (feature-flag variant images).
  **Files:** `libs/payments/one-pay/src/lib/one-credit-banner.tsx`, `libs/payments/more-ways-to-pay/src/lib/more-ways-to-pay.tsx`

  See `RECOMMENDED_TEMPLATES.md` Draft #4.
Content: This PR is Cart-team owned (libs/cart/common-components/), not payments/checkout. A separate Cart team file may be warranted. Architectural note: LD `ProgressIndicator` has an `a11yLabelledBy` prop for associating an external label element by DOM `id`. Interactive elements (buttons, links) must NEVER be placed inside LD component `label` prop slots — they become keyboard-inaccessible. Always place sibling interactive controls outside the LD component in normal document flow.
File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Transaction/payments-checkout.md
Content: Add new architectural note:

**[2026-03-19] CEPG-367778 — Shared ADA focus-return utility for modal triggers (WCAG 2.4.3):**
All modal open/close handler pairs in the checkout payments UI use a CSS-class bookmark pattern via `@walmart-web/payments-shared-ada-utilities`:
- On open: call `addClassToEventTargetElement(event)` to stamp `focus-visible-after-modal-close` onto the trigger button
- On close: call `removeClassNameAfterDelay()` (200ms delay) to locate the stamped element and `.focus()` it

This pattern is established and already used for `PayByBank` and other modals in `more-ways-to-pay.tsx`. Any new modal handler pairs in checkout payment components MUST follow this same pattern. The utility lives at `libs/payments-shared/ada-utilities/src/lib/ada-focus-utils.ts`.

```tsx
// On open
const handleOpenSomeModal = (event?: React.MouseEvent<HTMLElement, MouseEvent>) => {
  if (event) { addClassToEventTargetElement(event); }
  setIsModalOpen(true);
};

// On close
const handleCloseSomeModal = () => {
  setIsModalOpen(false);
  removeClassNameAfterDelay();
};
```
File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Transaction/payments-checkout.md
Content: **[2026-03-23] CEPG-339304 — Cart AOS Modal: focus must land on panel heading (not action button) when transitioning between modal views (WCAG 2.4.3):**
  The AOS (Add-On Services) modal in `libs/cart/add-on-services/src/lib/aos-modal.tsx` is a right-drawer LD Modal with two internal panels (selection / details). When transitioning to the details panel, focus must move to the `<h2>` heading of the new panel, not to an action button. Pattern: `useRef<HTMLHeadingElement>` on both DesktopHeader and MobileHeader `<h2>` elements, with `tabIndex={-1}` on the heading, and `requestAnimationFrame(() => titleRef.current?.focus())` called after `setDetailsContentShown(true)`. Also: blur the trigger button before the transition (`viewDetailsRef.current?.blur(); setTimeout(() => viewDetails(), 100)`).

  Secondary finding: `<VisuallyHidden><legend>text</legend></VisuallyHidden>` is invalid — correct nesting is `<legend><VisuallyHidden>text</VisuallyHidden></legend>`.

  Note: No dedicated teams file exists for `libs/cart/`. Consider creating `/teams/Transaction/cart-add-on-services.md`.

- **[2026-03-23] CEPG-306542 — GIC DrawerWrapper DOM order violation (WCAG 2.4.3):**
  The Global Intent Center drawer (`libs/ui/global-intent-center/component/src/lib/drawer-wrapper.tsx`) rendered `<Button>` (close/skip button) BEFORE `<DrawerBottom>` in JSX, causing keyboard/screen reader users to reach the close button before the drawer's bottom content (upsell banners, drone delivery, errors). Fix: pure JSX reorder — move `<DrawerBottom>` above `<Button>`. DOM order = tab order; no `tabIndex` overrides or CSS reordering should ever be used to mask DOM order issues.

  ```tsx
  // ❌ WRONG — close button before content
  <Button ...>close</Button>
  <DrawerBottom ... />

  // ✅ CORRECT — content before dismiss control
  <DrawerBottom ... />
  <Button ...>close</Button>
  ```

  **Rule:** In any drawer/panel component, the dismiss/close button must appear LAST in JSX/DOM order relative to the content it closes. Audit JSX order in all drawer/modal components in `libs/ui/global-intent-center/`.
  **Note:** The GIC library (`libs/ui/global-intent-center/`) is CEPG-owned (checkout experience org) but lives in the shared UI libs path — no dedicated GIC teams file exists yet.
  **See:** `WA11Y-WEB-2.4.3-004.md` Variation 3 · File: `libs/ui/global-intent-center/component/src/lib/drawer-wrapper.tsx`

- **[2026-03-13] CEPG-366918 (PR #180582) — Stale BNPL product-brand name in `aria-label` after OnePay→OnePay Later rebrand (WCAG 4.1.2):**
  When a financial product is rebranded, every `aria-label` referencing the old brand must be updated. PR #180582 added NEW locale keys for the renamed product behind the same CCM flags gating the visual rename (`enableOnePayLaterKlarnaRedesign`, `enableOnePayLaterAppleTradeIn`) — without overwriting the legacy key (needed as flag-off fallback). Applied to ALL ARIA surfaces: CTA buttons, Learn More links, WcpAlert title and body text.

  ```tsx
  // ❌ STALE — flag not consulted; old brand name announced after visual rename
  aria-label={m(messages, "applyNowForOnePayLoans")}

  // ✅ CORRECT — flag-conditional brand-accurate label
  aria-label={
    enableOnePayLaterKlarnaRedesign
      ? m(messages, "applyNowForOneLater")
      : m(messages, "applyNowForOnePayLoans")
  }
  ```

  **Rule:** Any product-name rebrand gated by CCM must include a matching accessible name update in the same PR. Missing even one ARIA surface leaves a stale accessible name that mismatches the visible label (WCAG 2.5.3 risk).
  **Locale files:** `libs/payments/one-bnpl/src/locale/` + `libs/cart/affirm-container/src/lib/locale/` (6 YAML files each)
  **Primary files:** `libs/payments/one-bnpl/src/lib/apply-now-oneloans.tsx`, `libs/cart/affirm-container/src/lib/oneloans-message.tsx`, `libs/cart/modal-container/src/lib/one-eligible-items-modal.tsx`
  **See:** `WA11Y-WEB-4.1.2-002.md` Variation

- **[2026-03-23] CEPG-330515-B (PR #157006) — Duplicate CTA names across ProductPromo tiles fixed via parameterized `getCtaAriaLabel()` (WCAG 4.1.2):**
  `libs/ui/product-tile/src/lib/vertical/product-promo.tsx` rendered multiple CTA buttons per tile. Across a page with multiple promos, all buttons shared the same generic name (`ctaText` with no product context). Fix: refactor `getCtaAriaLabel()` from a zero-argument closure to a parameterized function that appends `productName` to every non-suppressed label.

  Two established suppression cases (return `undefined` — don't override with aria-label):
  1. `actionText === m(messages, "signIn")` — Sign In button: already descriptive
  2. `wholeBannerClickable === true` — entire banner is the interactive target

  ```tsx
  // Always append productName to non-suppressed CTA aria-labels
  aria-label={getCtaAriaLabel(actionText, ..., productName)}

  // Suppression pattern
  if (actionText === m(messages, "signIn") || wholeBannerClickable) return undefined;
  ```

  **Rule for all product-tile CTAs:** Every button that shares a generic label with peer buttons on the same page MUST include unique product context in the accessible name. Use the parameterized `getCtaAriaLabel()` function — never pass raw `ctaText` as the full `aria-label`.
  **File:** `libs/ui/product-tile/src/lib/vertical/product-promo.tsx`
  **See:** `WA11Y-WEB-4.1.2-003.md` Variation

### CEPG-330761 — 4.1.2 Role: Link Role is Missing | PR #156900
- **File:** `libs/checkout/thankyou/src/lib/thankyou-banner/thankyou-generic-banner.tsx`
- **Fix:** Replaced `<Button onClick={redirectToUrl}>` with `<Button href={redirectUrl ?? ""}>` so the navigation CTA renders as `<a role="link">` instead of `<button role="button">`
- **Pattern:** WA11Y-WEB-4.1.2-004 Var 3
```

### CEPG-338731 — 4.1.3 Status Messages: Snackbar Not Announced | PR #166745
- **File:** `libs/cart/deal-recommendation-container/src/lib/hooks/use-atc-snackbar.tsx`
- **Fix:** Paired LD `addSnack` with `useA11yAnnouncement().announcePolite(message)` (1-second `setTimeout` delay) so the add-to-cart snackbar confirmation is announced to screen readers via an LD-managed `aria-live="polite"` region
- **Pattern:** WA11Y-WEB-4.1.3-003 Var 1
