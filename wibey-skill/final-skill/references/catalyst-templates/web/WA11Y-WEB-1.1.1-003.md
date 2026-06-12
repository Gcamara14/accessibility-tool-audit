# Catalyst Template: Alt Text: Decorative Image Announced to Screen Readers

**Template ID:** `WA11Y-WEB-1.1.1-003`
**Platform:** Web
**WCAG Criterion:** 1.1.1 Non-text Content

---

## 🛑 The Problem
An image is purely decorative (e.g., a visual flourish or an icon next to text that already explains the action), but it is being announced to screen readers because it lacks `alt=""` or `aria-hidden="true"`.

---

## ✅ The Fix Patterns

**❌ Bad Code:**
```html
<button>
  <img src="/spark.png" alt="Walmart Spark" />
  Shop Now
</button>
```

**✅ Good Code:**
```html
<button>
  <img src="/spark.png" alt="" aria-hidden="true" />
  Shop Now
</button>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Search for `<Icon ... aria-label={...}` or `<img ... alt="[non-empty]"` inside a container where sibling text already describes the action.
2. If the icon/image is purely decorative (clock icon next to opening hours text, location pin next to address text), it qualifies for this pattern.
3. Replace `aria-label` on the Icon with `aria-hidden`.
4. Add a `WcpVisuallyHidden` sibling with the label text and a stable `id`.
5. Add `role="group" aria-labelledby="<id>"` to the container `<div>` so AT announces the group with the hidden label.
6. Never add `aria-hidden` to an icon that carries unique information not present in any sibling element.

---

## 📦 Variation 1 — Marketplace About Seller: Opening Hours & Location Icons
**Source:** PR #183468 — `libs/marketplace/about-seller-lmp/src/lib/store-open/store-open.tsx` + `libs/tempo-shared-modules/seller-details/src/lib/seller-info-lmp/seller-address-lmp/seller-address-lmp.tsx`
**Author:** Lakshmi Pothini | **Commit:** `1ee1968b1d8`
**Date:** 2026-03-31

Two icons (`Clock` and `Location`) each had `aria-label` applied directly. The sibling text already provided the same label verbally, causing double-announcement. Fix: remove `aria-label`, add `aria-hidden`, wrap label in `WcpVisuallyHidden`, and apply `role="group" aria-labelledby` on the container.

```tsx
// ❌ BAD — Icon aria-label duplicates sibling text
<div className="flex flex-row mb3-l mb2 flex items-center" data-testid="store-open">
  <Icon name="Clock" size="small" className="mr2" aria-label={m(messages, "openingHours")} />
  {storeIsOpen ? <div className="green b">{openNowTxt}</div> : ...}
</div>

// ✅ GOOD — aria-hidden on icon + WcpVisuallyHidden group label
import { WcpVisuallyHidden } from "@walmart-web/design-components-wcp-visually-hidden";

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
  {storeIsOpen ? <div className="green b">{openNowTxt}</div> : ...}
</div>

// Same pattern for SellerAddressLMP (Location icon):
// ❌ BAD
<div className={classNames("mr5 flex flex-row", { mb2: !isQSRSeller })}>
  <Icon className="mr2" name="Location" aria-label={m(messages, "Location")} />
  ...
</div>

// ✅ GOOD
<div
  aria-labelledby="store-location-label"
  className={classNames("mr5 flex flex-row", { mb2: !isQSRSeller })}
>
  <Icon className="mr2" name="Location" aria-hidden="true" />
  <WcpVisuallyHidden id="store-location-label">
    {m(messages, "Location")}
  </WcpVisuallyHidden>
  ...
</div>
```

**Key Rules:**
1. `WcpVisuallyHidden` needs a stable `id` attribute — use a semantic name, not a generated key.
2. The container `role="group"` + `aria-labelledby` ensures AT announces the hidden label when focusing into the group.
3. Import: `@walmart-web/design-components-wcp-visually-hidden`.
