# Team Architecture: Health & Vision Center — Order Management

**Domain Area:** Health-Vision
**Jira Label Mapping:** `HVCE-*` (Health & Vision Center Experience)
**Last Updated:** 2026-03-20

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Vision Center UI root:** `libs/vision-center/ui/src/`

### Key Component Paths
| Component | Path |
|---|---|
| OrderCard / OrderHeader | `libs/vision-center/ui/src/lib/OrderCard/order-card.tsx` |

---

## 🛠️ Tech Stack & Constraints

- **Framework:** React (Next.js monorepo lib)
- **Icon system:** WCP `<Icon>` component — SVGs with no implicit a11y attributes
- **Pattern:** Card-based UI; icons used decoratively alongside text spans

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-20] HVCE-13794 — Decorative `<Icon name="Store" />` missing `aria-hidden="true"` (WCAG 1.1.1):**
  The Store icon in `OrderHeader` was exposed to the accessibility tree with no accessible name. The adjacent `<span>` already provides the full store name/address — the icon is purely decorative. Fix: add `aria-hidden="true"` to the `<Icon>`.

  ```tsx
  // ❌ WRONG — SVG noise in reading order
  <Icon name="Store" size="small" className="mr1" />

  // ✅ CORRECT — hidden from AT; text span provides full context
  <Icon name="Store" size="small" className="mr1" aria-hidden="true" />
  ```

  **Audit note:** The commit message referenced "icons" plural — check all icons in `OrderCard` for the same missing attribute.

  **See:** `RECOMMENDED_TEMPLATES.md` Draft #6 · `WA11Y-WEB-1.1.1-001.md` Variation 1 rules table

- **[2026-03-20] HVCE-13625 — WCP `<Heading>` components missing `as="h2"` in `ErrorPage` (WCAG 1.3.1):**
  All four `title` entries in `textVariantMap` (`libs/vision-center/ui/src/lib/ErrorPage/index.tsx`) used `<Heading>` without the `as` prop. The WCP Heading component is **polymorphic** — omitting `as` renders a visually styled but semantically empty node (no heading role in DOM). Fix: add `as="h2"` to every `<Heading>` usage.
  ```tsx
  // ❌ WRONG — renders as <div>; no heading role
  <Heading size="medium" UNSAFE_style={{ lineHeight: "32px" }}>

  // ✅ CORRECT — renders as <h2>; heading navigation works
  <Heading as="h2" size="medium" UNSAFE_style={{ lineHeight: "32px" }}>
  ```
  **See:** `WA11Y-WEB-1.3.1-001.md` Variation 1 · File: `libs/vision-center/ui/src/lib/ErrorPage/index.tsx`

- **[2026-03-20] CEPG-340528 — Rx radio button `aria-labelledby` omits price node in lens customization buy-box (WCAG 4.1.2):**
  In `libs/item/buy-box/src/lib/lens-customization-buy-box/`, the `rxPrice` `<div>` had no `id` in the `use-non-sunglasses-radio-a11y.ts` hook, so the price was silently dropped from the `aria-labelledby` computed name — screen readers never announced the price when navigating Rx lens options. Fix: generate a `useSSRSafeId()` for the price node and insert its ID into the `aria-labelledby` string between the label and features IDs.
  ```tsx
  // ❌ WRONG — price div has no id; never announced
  <div className="f6">{rxPrice}</div>
  // ✅ CORRECT — id wired into aria-labelledby
  <div className="f6" id={rxPriceA11yId}>{rxPrice}</div>
  ```
  **Rule:** When building multi-part labels via `aria-labelledby`, every content node that should be announced must have an SSR-safe `id` explicitly listed in the string.
  **See:** `WA11Y-WEB-4.1.2-001.md` Variation 1 · Files: `use-non-sunglasses-radio-a11y.ts`, `vision-non-sunglasses-options.tsx`

### HVCE-12342 — 4.1.3 Status Message: Success Messages Not Announced | PR #163872
- **File:** `libs/extended-reality/realtime-vto/optical/try-them-on-wrapper/src/lib/components/InformationCard/InformationCard.tsx`
- **Fix:** Added `aria-live="assertive"` and `tabIndex={-1}` to `InformationCard` container div, plus `useRef`/`useEffect` to programmatically focus the card when `title`/`children` props update, ensuring face-scan status messages are immediately announced by screen readers.
- **Pattern:** WA11Y-WEB-4.1.3-001 Var 2
