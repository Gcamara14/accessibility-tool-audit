# Team Architecture: Marketplace — About Seller (LMP)

**Domain Area:** Marketplace / Seller Details
**Jira Label Mapping:** `CEPG-*` (Marketplace accessibility fixes)
**Last Updated:** 2026-04-01

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **About Seller root:** `libs/marketplace/about-seller-lmp/`
- **Shared seller details:** `libs/tempo-shared-modules/seller-details/`

### Key Component Paths

| Area | Path |
|---|---|
| Store Open / Opening Hours | `libs/marketplace/about-seller-lmp/src/lib/store-open/store-open.tsx` |
| Seller Address | `libs/tempo-shared-modules/seller-details/src/lib/seller-info-lmp/seller-address-lmp/seller-address-lmp.tsx` |
| Seller Info (LMP container) | `libs/tempo-shared-modules/seller-details/src/lib/seller-info-lmp/` |
| Locale messages | `libs/tempo-shared-modules/seller-details/src/lib/seller-info-lmp/locale/messages.ts` |

---

## 🐛 Known Accessibility Pitfalls

### Pitfall 1 — `<Icon aria-label>` duplicates sibling text
**PR:** #183468 | **Commit:** `1ee1968b1d8` | **Author:** Lakshmi Pothini

Using `aria-label` directly on a `<Icon>` component when the icon's purpose is already communicated by sibling visible text causes double-announcement (AT reads "Clock icon, Opening Hours, Open Now" instead of "Opening Hours, Open Now").

**Pattern:** Remove `aria-label` from the Icon, add `aria-hidden`, introduce a `WcpVisuallyHidden` sibling with a stable `id`, and apply `role="group" aria-labelledby` on the wrapper container.

```tsx
// ❌ BAD — Icon aria-label + sibling text = double-announcement
import { Icon } from "@walmart-web/ui-icons";

<div className="flex flex-row mb3-l mb2 flex items-center" data-testid="store-open">
  <Icon name="Clock" size="small" className="mr2" aria-label={m(messages, "openingHours")} />
  <div className="green b">{openNowTxt}</div>
</div>

// ✅ GOOD — aria-hidden + WcpVisuallyHidden group label
import { WcpVisuallyHidden } from "@walmart-web/design-components-wcp-visually-hidden";
import { Icon } from "@walmart-web/ui-icons";

<div
  className="flex flex-row mb3-l mb2 flex items-center"
  data-testid="store-open"
  role="group"
  aria-labelledby="store-open-label"
>
  <Icon name="Clock" size="small" className="mr2" aria-hidden />
  <WcpVisuallyHidden id="store-open-label">
    {m(messages, "openingHours")}
  </WcpVisuallyHidden>
  <div className="green b">{openNowTxt}</div>
</div>
```

**Key rules:**
1. The `WcpVisuallyHidden` `id` must be semantically named and stable (not a generated key).
2. Apply `role="group"` + `aria-labelledby` on the *container* so the group gets a label.
3. This pattern applies to any icon that duplicates an immediately adjacent text label.
4. Related template: `WA11Y-WEB-1.1.1-003` Variation 1

---

## 🔗 Catalyst Templates Used

| WCAG | Template | Fix Applied |
|---|---|---|
| 1.1.1 | `WA11Y-WEB-1.1.1-003` | Icon `aria-label` → `aria-hidden` + `WcpVisuallyHidden` group label (Var 1) |
