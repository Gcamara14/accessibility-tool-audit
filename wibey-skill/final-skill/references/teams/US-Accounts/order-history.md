# Team Architecture: Accounts — Order History / Order Item Tile

**Domain Area:** Accounts
**Jira Label Mapping:** `CEPG-*` (Orders / Post-transaction area)
**Last Updated:** 2026-03-20

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Order Item Tile root:** `libs/orders/ui/order-item-tile/src/lib/`

### Key Component Paths
| Component | Path |
|---|---|
| Add-Ons section (section title) | `libs/orders/ui/order-item-tile/src/lib/add-ons/index.tsx` |

---

## 🛠️ Tech Stack & Constraints

- **Framework:** React (monorepo lib)
- **Design System:** Living Design (`@walmart-web/livingdesign-components`) — use `<Heading>` with `as` prop for semantic headings
- **Utility classes:** Tachyons (`b`, `pb2`, `f5`, `light-gray` etc.) — use `UNSAFE_className` to pass through to LD components
- **Conditional styling:** Cancelled-state uses `classNames` conditional with `light-gray` — preserve in `UNSAFE_className` when converting `<div>` to `<Heading>`

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-20] CEPG-344615 — Add-On Services section title in Order Item Tile was a styled `<div>` with no heading role (WCAG 1.3.1):**
  `libs/orders/ui/order-item-tile/src/lib/add-ons/index.tsx` used a `<div className="b pb2 f5 ...">` as the section title for the Add-On Services module. This had no semantic heading role — screen reader users could not navigate to the section or understand its structure. Fix: replace with Living Design `<Heading as="h2" size="small">`, moving all styling to `UNSAFE_className` to preserve visual appearance including the cancelled-state colour conditional.

  ```tsx
  // ❌ WRONG — styled div; no heading role; screen reader skips section
  <div className={classNames("b pb2 f5", headerClass, { "light-gray": isCancelled })}>
    {ADD_ON_MODULE_TITLE}
  </div>

  // ✅ CORRECT — Living Design Heading preserves all styling via UNSAFE_className
  import { Heading } from "@walmart-web/livingdesign-components";

  <Heading
    size="small"
    as="h2"
    UNSAFE_className={classNames("b pb2 f5", headerClass, { "light-gray": isCancelled })}
  >
    {ADD_ON_MODULE_TITLE}
  </Heading>
  ```

  **Audit note:** The Order Item Tile contains multiple module sections (Add-Ons, Returns, etc.) that may follow the same `<div>` heading pattern. Audit all section title elements in `libs/orders/ui/order-item-tile/` and confirm they use `<Heading as="hN">` or native heading elements.

  **See:** `WA11Y-WEB-1.3.1-001.md` Variation 4
