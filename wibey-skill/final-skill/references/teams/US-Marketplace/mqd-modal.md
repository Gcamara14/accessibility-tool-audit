# Team Architecture: Marketplace — MQD Products Modal

**Domain Area:** Marketplace
**Jira Label Mapping:** `CEPG-*` (Marketplace/Checkout flow)
**Last Updated:** 2026-03-20

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **MQD Modal root:** `libs/payments/mqd-products-modal/src/lib/`

### Key Component Paths
| Component | Path |
|---|---|
| Tiered Promo Section | `libs/payments/mqd-products-modal/src/lib/mqd-tired-promo-section.tsx` |
| Products Wrapper | `libs/payments/mqd-products-modal/src/lib/mqd-products-wrapper.tsx` |

---

## 🛠️ Tech Stack & Constraints

- **Framework:** React (monorepo lib)
- **i18n:** Uses `m(messages, "key")` pattern from `@walmart-web/platform-i18n` for all user-facing strings
- **Modal pattern:** Content sections use visual hierarchy (bold text, section labels) that must be backed by semantic HTML heading elements

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-20] CEPG-353780 — `<div class="b">` section headers in MQD Tiered Promo Modal missing heading roles (WCAG 1.3.1):**
  `mqd-tired-promo-section.tsx` and `mqd-products-wrapper.tsx` used visually-bold `<div>` elements as section titles inside the modal. These have no heading role — screen reader users cannot navigate the modal using heading shortcuts. Fix: replace with native `<h2>`, `<h3>`, `<h4>` using `style={{ fontSize: "inherit" }}` and `ma0` to prevent visual size regression.

  ```tsx
  // ❌ WRONG — visually bold, no heading role
  <div className="b" data-testid="tiered-mqd-title">
    {m(messages, "tieredPromoHeader")}
  </div>

  // ✅ CORRECT — semantic h2 with inherited font size (no visual change)
  <h2 className="b ma0" style={{ fontSize: "inherit" }} data-testid="tiered-mqd-title">
    {m(messages, "tieredPromoHeader")}
  </h2>
  ```

  **Heading hierarchy used in this modal:**
  | Level | Element | Context |
  |---|---|---|
  | Top section title | `<h2>` | `tieredPromoHeader` |
  | Info sub-section | `<h3>` | `tieredPromoInfoHeader` |
  | Eligible items label | `<h4>` | `eligibleItemsMessage` |

  **Audit rule:** Any new section label added to the MQD modal must use a native heading element, not a styled `<div>`. Default to `<h2>` / `<h3>` / `<h4>` with `style={{ fontSize: "inherit" }}` to keep visual design intact.

  **See:** `WA11Y-WEB-1.3.1-001.md` Variation 2
File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Marketplace/mqd-modal.md
Content: A second Marketplace lib exists at `libs/reviewer-community/dashboard/` (component: `TaxSetupCta`, path: `src/lib/invite-to-program/tax-setup-cta.tsx`). This lib handles the reviewer community invite-to-program tax setup modal flow. It uses the same `m(messages, "key")` i18n pattern. Known ADA pitfall: LD `<Link>` components used as dismiss/close actions (no navigation) were rendered without `href`, making them non-focusable. Pattern fix: add `href="#"` + `role="button"` + `tabIndex={0}` + `onKeyDown` Enter/Space handler. This lib is distinct from `libs/payments/mqd-products-modal/` and may warrant its own team file under `teams/Marketplace/reviewer-community-dashboard.md`.
