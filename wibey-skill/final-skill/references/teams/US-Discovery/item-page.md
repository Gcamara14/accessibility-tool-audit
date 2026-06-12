# Team Architecture: Item Page (PDP)

**Domain Area:** Discovery
**Jira Label Mapping:** `A11Y-US-Team-ItemPage`
**Last Updated:** 2026-03-19

---

## 📍 Where the Code Lives (The Monorepo)
The core Item Page experience (Product Detail Page) is housed within a large frontend monorepo. When fixing bugs for this team, start your search here (priority routing) before falling back to global grep: the `libs/item/` directory.

### Key Component Locations:
- **The Main Page Wrapper:** `libs/item/detail-page`
- **Buying Actions:** `libs/item/buy-box`, `libs/item/sticky-buy-box`, `libs/item/secondary-buy-box`
- **Product Information:** `libs/item/item-snapshot`, `libs/item/product-description-atf`, `libs/item/product-highlights`
- **Customer Feedback:** `libs/item/ratings-and-reviews`
- **Cross-Selling:** `libs/item/complete-the-look`, `libs/item/shop-similar`

*(Note: Shared generic UI pieces like `product-tile` and `product-badge` live in `libs/ui/`)*

## 🛠️ Tech Stack & Constraints
- **Architecture:** Monorepo (`apps/` and `libs/` structure)

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-20] CEPG-355995 — Tachyons `gray` class fails WCAG 1.4.3 contrast (buy-box OOS messaging):**
  The Tachyons utility class `gray` (`#777777`) achieves only ~4.48:1 contrast against white — just below the 4.5:1 minimum for normal text. The approved fix is `dark-gray` (`#333333`, 12.63:1). This pattern is present in `libs/item/buy-box/src/lib/add-to-cart-section/atc-oos.tsx` and potentially other Tachyons-based components.

  ```tsx
  // ❌ FAILING — className="gray ..."
  // ✅ FIXED   — className="dark-gray ..."
  ```

  **Bulk fix candidate:** Any `className` string containing standalone `gray` (no `bg-gray` prefix) is a safe regex swap. See `WA11Y-ALL-1.4.3-001.md` Variation 1 for the full Tachyons color reference table.

- **[2026-03-20] CEPG-366913 — Inaccurate accessible name via i18n key (`oneLoans`) in `AffirmMessageCore` promotions (WCAG 1.1.1 + 4.1.2):**
  The `oneLoans` locale key contained "OnePay Loans" — concatenated into the accessible name of "Learn more" links and buttons. Announced: *"Learn more, 0% APR, As low as $45/mo with OnePay Loans"* (wrong). Fix: remove "Loans" from all 6 locale YAML files and `messages.ts`.

  ```ts
  // ❌ WRONG — messages.ts
  export const oneLoans = () => "OnePay Loans";

  // ✅ CORRECT
  export const oneLoans = () => "OnePay";
  ```

  **Key insight:** WCAG 1.1.1 inaccuracy can originate entirely in the i18n layer — audit `messages.ts` and locale YAMLs for product-name over-specifications, not just `img alt` attributes.
  **File:** `libs/item/promotions/src/lib/locale/messages.ts` + locale YAMLs

  See `RECOMMENDED_TEMPLATES.md` Draft #5.

- **[2026-03-20] CEPG-330816 — Missing list semantics for At-a-Glance product highlight tiles (WCAG 1.3.1):**
  The tile container in `libs/item/product-highlights/src/lib/at-a-glance-content.tsx` was a plain `<div>`, with each tile also a `<div>`. Screen readers announced each tile as isolated content with no list role or item count. Fix: replace outer `<div>` with `<ul className="flex flex-wrap dark-gray pa0">` and each tile `<div>` with `<li tabIndex={0}>`. The `pa0` class resets browser list padding to preserve visual layout.

  ⚠️ **`tabIndex={0}` on `<li>` is a known footgun** — subsequent PR #171966 (CEPG-348108) had to remove this because it adds non-interactive elements to the tab order. If you add `tabIndex={0}` to a non-interactive list item, confirm with the accessibility guild that keyboard focus on a non-actionable tile is intentional.

  ```tsx
  // ❌ BEFORE — no list semantics
  <div className="flex flex-wrap dark-gray">
    {tiles.map((highlight, index) => (
      <div key={index} className="f6 tc flex justify-center">...</div>
    ))}
  </div>

  // ✅ AFTER — semantic list
  <ul className="flex flex-wrap dark-gray pa0">
    {tiles.map((highlight, index) => (
      <li key={index} className="f6 tc flex justify-center" tabIndex={0}>...</li>
    ))}
  </ul>
  ```

  See `RECOMMENDED_TEMPLATES.md` Draft #9.

- **[2026-03-20] CEPG-348108 — `aria-hidden="true"` incorrectly applied to visible tile text — NOVEL pattern (WCAG 1.3.1 + 1.1.1):**
  This is a **sequential fix** on the same file (`at-a-glance-content.tsx`) as CEPG-330816 above. PR #166589 (Draft #9) introduced `aria-label` on a wrapper `<div>` plus `aria-hidden="true"` on the name/value `<div>` elements — a "double-announcement prevention" strategy that silently fails:

  - `aria-label` on a plain `<div>` (no `role`) is **discarded by AT** — `<div>` is a generic container with no accessible role to attach the label to.
  - `aria-hidden="true"` on the content `<div>` elements **does take effect**, hiding all visible text from screen readers.
  - Net result: tiles are visually rich but **completely invisible to AT**.

  Fix (PR #171966): remove `aria-hidden` from name/value divs, remove the orphaned `aria-label` and `tabIndex={-1}` from the wrapper div, remove `tabIndex={0}` from the `<li>` (non-interactive items must not be in the tab order).

  ```tsx
  // ❌ BROKEN — aria-label discarded, aria-hidden active = invisible to AT
  <li tabIndex={0}>
    <div aria-label={`${highlight?.name}: ${highlight?.value}`} tabIndex={-1}>
      <div aria-hidden="true"><LineClamp>{highlight?.name}</LineClamp></div>
      <div aria-hidden="true"><LineClamp>{highlight?.value}</LineClamp></div>
    </div>
  </li>

  // ✅ CORRECT — natural DOM traversal, no ARIA overrides needed
  <li>
    <div>
      <div><LineClamp>{highlight?.name}</LineClamp></div>
      <div><LineClamp>{highlight?.value}</LineClamp></div>
    </div>
  </li>
  ```

  **Key rule:** `aria-label` on a `<div>` or `<span>` with no `role` is a no-op for most AT. If you need a label on a non-interactive grouping element, add `role="group"` or `role="region"` — or better yet, let content be read in natural DOM order without any override.

  See `RECOMMENDED_TEMPLATES.md` Draft #8 (proposed `WA11Y-WEB-1.3.1-007`).

- **[2026-03-20] CEPG-340974 — Styled `<div>` used as section subtitle in Direct Spends badging component (WCAG 1.3.1):**
  In `libs/item/direct-spends/src/lib/direct-spends-enhancements.tsx`, a bold `<div class="f5 b mb2">` was used as the label for a structured section list — visually heading-like, but with no semantic heading role. Fix: replace with `<h3 class="f5 b mb2 mt0">` (the `mt0` resets browser default top-margin to preserve layout).
  ```tsx
  // ❌ WRONG — styled div; no heading role
  <div className="f5 b mb2">{section.subTitle}</div>
  // ✅ CORRECT — <h3> with margin reset preserves visual layout
  <h3 className="f5 b mb2 mt0">{section.subTitle}</h3>
  ```
  **Audit note:** The direct-spends / badging area uses many styled `<div>` wrappers as visual section labels — audit all bold/large-font `<div>` elements that introduce a new content section and replace with the appropriate heading level.
  **See:** `WA11Y-WEB-1.3.1-001.md` Variation 5 · File: `libs/item/direct-spends/src/lib/direct-spends-enhancements.tsx`
File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Discovery/item-page.md
Content:
- Add `libs/item/reviews/` as a sub-path under the Item Page team's "Customer Feedback" section (already listed as `libs/item/ratings-and-reviews` but `write-review` sub-path was not enumerated).
- Add GPUGC as a known Jira prefix for this team (Discovery / Item Page / Reviews sub-team).
- Add the following accessibility pitfall entry:

  **[2026-03-23] GPUGC-24707 — Focus does not land on `[role="alert"]` in Write-a-Review error flow (WCAG 2.4.3):**
  The WAR flow called `.focus()` on the ref container wrapper rather than the inner `[role="alert"]` child — browsers silently ignore `.focus()` on non-focusable elements. Additionally, repeated same-error submissions did not re-fire the focus `useEffect` because no dependency changed.
  Fix pattern: `querySelector('[role="alert"]')` + dynamic `tabindex="-1"` + `document.activeElement.blur()` + monotonically-incrementing `validationAttemptCounter` in useEffect deps.
  File: `libs/item/reviews/write-review/write-review-page/src/lib/write-review-enhancement/index-item-review.tsx`
  See WA11Y-WEB-2.4.3-002 Variation 2.

NEW_DOMAIN: false
Domain: Discovery (existing)
Jira prefix: GPUGC → maps to Discovery / Item Page / Reviews sub-team

- **[2026-03-23] OAMD-7124 — `onKeyDown` bound to modal-open handler without key filtering traps focus (WCAG 2.1.2):**
  In `libs/item/modal-marketing-content/src/lib/modal-marketing-content.tsx`, a `<div role="button" tabIndex={0}>` had `onKeyDown={handleBannerClick}` where `handleBannerClick` opens a dialog unconditionally on every key event. Pressing Tab to navigate past the element triggered the handler and opened the modal, trapping keyboard focus. Fix: remove `onKeyDown` entirely (with `eslint-disable jsx-a11y/click-events-have-key-events`).

  ```tsx
  // ❌ TRAP — onKeyDown fires on Tab key, opens dialog, traps focus
  <div role="button" onClick={handleBannerClick} onKeyDown={handleBannerClick} tabIndex={0}>

  // ✅ FIXED — Tab/Shift+Tab pass through normally
  <div role="button" onClick={handleBannerClick} tabIndex={0}>
  ```

  **Ideal follow-up (not yet implemented):** Scope `onKeyDown` to `e.key === 'Enter' || e.key === ' '` only, rather than removing it entirely.
  **Detection pattern:** `onKeyDown={handler}` where handler does not check `e.key`, combined with `tabIndex={0}` on same element.
  **Jira prefix note:** OAMD- maps to Discovery / Item Page team (confirmed via `libs/item/modal-marketing-content/` path).
  **See:** `RECOMMENDED_TEMPLATES.md` Draft `WA11Y-WEB-2.1.2-001` · File: `libs/item/modal-marketing-content/src/lib/modal-marketing-content.tsx`

- **[2026-03-23] CEPG-338329 — Focus lost after reward offer is claimed in `ProductRewardToggleClip` (WCAG 2.4.3):**
  The shared `libs/ui/product-tile` component `ProductRewardToggleClip` replaced a checkbox with a "Reward saved" text span on claim — dropping keyboard/screen reader focus with no restoration. Fix: convert `ProductRewardIconText` to `forwardRef`, add `tabIndex={-1}` to the inner `<span>`, add `useRef` + `shouldFocusAfterClip` boolean state + `useEffect` in the parent to programmatically focus the reward text after state transitions to `CLIPPED`.
  Pattern: `forwardRef` + `tabIndex={-1}` + boolean flag + `useEffect` post-render gate.
  Files: `libs/ui/product-tile/src/lib/vertical/sub-components/product-reward-icon-text.tsx` and `product-reward-toggle-clip.tsx`
  **See:** `WA11Y-WEB-2.4.3-004.md` Variation 2

- **[2026-03-23] GPUGC-22861 — `aria-label` Does Not Match Visible Text in Reviews Bullet Summary (WCAG 2.5.3):**
  Two violations in `libs/item/reviews/ui-components/src/lib/reviews-summary/`:

  1. **Keyword pill links** (`bulleted-summary-content.tsx`): `aria-label` was `${pills} ${summary}` — appending the entire review body text to the pill label. Visible text = pill word only. Fix: `aria-label={pills}` (visible text only — exact match).

  2. **View More/Less CTA** (`bulleted-summary-cta.tsx`): dedicated i18n keys (`viewLessDetails`, `viewMoreInfo`) produced strings with no overlap with the visible button text ("View less" / "View more"). Speech-control users could not activate the button by voice. Fix: derive `buttonLabel` from the same keys rendering visible text → `aria-label={`${buttonLabel} - ${m(messages, "reviewsSummary")}`}`.

  **Rule:** When adding context to a button/link accessible name, always structure it as `"[visible text] [additional context]"`. Never use separate i18n keys that produce a different string as the full `aria-label`.
  **i18n cleanup:** Keys `viewLessDetails` and `viewMoreInfo` were deleted across all 6 locale YAMLs + `messages.tsx` — treat these as dead if found elsewhere.
  **New sub-library:** `libs/item/reviews/ui-components/` (reviews bullet summary, distinct from `libs/item/ratings-and-reviews`).
  **See:** `WA11Y-WEB-2.5.3-001.md` Variations 1 and 2
