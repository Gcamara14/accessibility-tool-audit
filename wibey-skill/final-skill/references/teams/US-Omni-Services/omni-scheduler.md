# Team Architecture: Omni Scheduler

**Domain Area:** Omni-Services
**Jira Label Mapping:** `A11Y-US-Team-OmniScheduler` (likely — confirm with team)
**Last Updated:** 2026-03-20

---

## 📍 Where the Code Lives (The Monorepo)

The Omni Scheduler is a service-scheduling UI used across service verticals (e.g., Auto Care / Oil Changes). Primary library path:

```
libs/omni-scheduler/scheduler-components/src/lib/ui/
```

### Key Component Locations

- **Oil Package Selection UI:** `libs/omni-scheduler/scheduler-components/src/lib/ui/oil-packages/`
  - `ServiceInfo.tsx` — Inclusive services list, disclaimer, CTA link
  - `Packages.tsx` — Package card grid container
  - `PackageDetails.tsx` — Individual package card (renders as `<li>` inside `Packages.tsx`)

---

## 🛠️ Tech Stack & Constraints

- **Architecture:** Monorepo (`libs/omni-scheduler/`)
- **CSS:** Tachyons utility classes (same palette as rest of monorepo — `gray`/`mid-gray`/`dark-gray` contrast rules apply)
- **Component pattern:** Cross-component `<ul>` / `<li>` split — parent renders `<ul>`, child component returns `<li>` directly. Any accessibility fix to list structure must be coordinated across both files.
- **i18n:** Uses `m(messages, key)` pattern for localised strings (same pattern as Discovery team)

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-20] CEPG-330551 — Missing list semantics in Oil Package "Inclusive Services" section (WCAG 1.3.1):**
  The inclusive services list inside `ServiceInfo.tsx` was rendered as `<div>` / `<div>` instead of `<ul>` / `<li>`. Screen readers could not identify the items as a list, count members, or navigate with list shortcuts. Fix: replace outer `<div>` with `<ul className="pa0 mv1 list">` and each child `<div>` with `<li>`. The Tachyons class `list` resets default bullet/padding so the visual layout is preserved.

  **Cross-component coordination required:** `Packages.tsx` wraps `PackageDetails.tsx` children. The `<ul>` lives in `Packages.tsx`; the `<li>` return lives in `PackageDetails.tsx`. Both files must be updated together or the `ul > li` semantic contract is broken.

  ```tsx
  // ServiceInfo.tsx ❌ BEFORE
  <div className="pb1">
    {inclusiveServices.servicesList.map((service, index) => (
      <div key={index} className="mt1">...</div>
    ))}
  </div>

  // ServiceInfo.tsx ✅ AFTER
  <ul className="pa0 mv1 list">
    {inclusiveServices.servicesList.map((service, index) => (
      <li key={index} className="mt1">...</li>
    ))}
  </ul>
  ```

  See `RECOMMENDED_TEMPLATES.md` Draft #10 for full diff including Packages.tsx and PackageDetails.tsx changes.

- **[2026-03-20] CEPG-330551 — Bonus: Tachyons `gray` contrast failure in disclaimer text (WCAG 1.4.3):**
  The same PR also swapped `gray` → `mid-gray` on the `<span>` disclaimer and `<Link>` CTA in `ServiceInfo.tsx`. `gray` = `#777777` (~4.48:1, fails); `mid-gray` = `#555555` (~7.35:1, passes). This is the same Tachyons pattern documented in Discovery `item-page.md` and `WA11Y-ALL-1.4.3-001.md` Variation 1.

  **Implication:** The `gray` → `mid-gray`/`dark-gray` problem is not confined to item-page components — it appears in service scheduling UI too. Any Tachyons-based component using `gray` for body or supplementary text should be audited.

  ```tsx
  // ❌ <span className="f6 mt1 gray">
  // ✅ <span className="f6 mt1 mid-gray">
  ```

- **[2026-03-20] CEPG-330551 — `<Link>` missing accessible name for CTA (WCAG 4.1.2):**
  The "View Details" link in `ServiceInfo.tsx` had no `aria-label`, making its accessible name the visible link text only. The fix added `role="button"` and `aria-label={m(messages, "viewDetail")}` to provide a clear, localised accessible name.

  ⚠️ **Watch for semantic conflict:** `role="button"` on a `<Link>` component may render as `<a role="button">` — verify the LD component does not already set `role="link"` internally, which could create a conflicting role.

  See `RECOMMENDED_TEMPLATES.md` Draft #10 human review checklist.

- **[2026-03-23] CEPG-330592 (PR #156721) — Phantom `aria-label` on decorative icons/images in Oil Package Selection (WCAG 2.5.3):**
  `ServiceFooter.tsx` check icon carried `role="img" aria-label={m(messages, "includedServices")}` — a fabricated accessible name from an i18n key with no visible text counterpart. `PackageDetails.tsx` thumbnail image carried `alt={m(messages, "altTextForImage")}` — same pattern, different element type. Fix: `aria-hidden="true"` on the icon, `alt="" aria-hidden="true"` on the image.

  ```tsx
  // ❌ Phantom label — icon announces text that is invisible on screen
  <Icon name="Check" role="img" aria-label={m(messages, "includedServices")} />
  <span>{service.servicesDetail}</span>   // actual description already lives here

  // ✅ Decorative icon — hide from AT
  <Icon name="Check" aria-hidden="true" />
  <span>{service.servicesDetail}</span>
  ```

  **Pitfall pattern:** Using i18n keys to manufacture `aria-label`/`alt` for decorative elements that already have visible sibling text. If an icon/image has no visible text of its own and its sibling already describes it, hide it from AT — do not label it with a phantom string.

  **Open 4.1.2 follow-up:** `PackageDetails.tsx` now renders `role="option"` inside a plain `<ul>` in `Packages.tsx`. ARIA spec requires `role="option"` to be owned by `role="listbox"`. If AT reports orphaned options, add `role="listbox"` + accessible name to the `<ul>` in `Packages.tsx`.

  **See:** `WA11Y-WEB-2.5.3-001.md` Variation · Files: `libs/omni-scheduler/scheduler-components/src/lib/ui/oil-packages/ServiceFooter.tsx` + `PackageDetails.tsx`

- **[2026-03-23] CEPG-337758 (PR #165691) — Store Finder map pins and result tile have no accessible name (WCAG 4.1.2):**
  The `createMarker()` helper in `libs/store-pages/finder-page/src/lib/map-helpers.tsx` constructed `google.maps.Marker` objects without a `title` property — every store pin on the map was nameless to screen readers. Result tile store address `<p>` had no state indication for focused/selected stores.

  Fix — mandatory `title` in all Marker constructors:
  ```tsx
  new google.maps.Marker({
    position: { lat, lng },
    map: ariaHidden ? null : map,
    icon: getMarkerIcon(markerIconUrl),
    // title IS the accessible name for Google Maps markers
    title: `${ariaLabel}${ariaPressed ? ` ${m(messages, "selected")}` : ""}`,
  });
  ```

  Fix — selection state in non-interactive paragraph:
  ```tsx
  <p aria-label={`${storeAddress}${isFocused ? `, ${m(messages, "selected")}` : ""}`}>
    {storeAddress}
  </p>
  ```

  **Rule:** `aria-pressed` / `aria-selected` are invalid on plain `<p>` elements — embed state into the `aria-label` string using a localised message key instead. Never hardcode English strings into accessible name constructions; always use `m(messages, key)`.
  **Files:** `libs/store-pages/finder-page/src/lib/map-helpers.tsx` + `result-tile.tsx` + `locale/messages.ts`
  **See:** `WA11Y-WEB-4.1.2-001.md` Variation

### CEPG-337628 — 4.1.2 State: State Information Not Announced | PR #164835
- **File:** `libs/auto-care-center/components/src/lib/auto-workflow/auto-workflow-list.tsx`
- **Fix:** Added `aria-disabled={isDisabled}` to native `<button>` workflow list items whose disabled state was previously enforced only through visual CSS (Tachyons opacity/border) and JS event guards, with no programmatic announcement to AT.
- **Pattern:** WA11Y-WEB-4.1.2-007 Var 1

### CEPG-337392 — 4.1.2 State: Toggle Button Pressed/Not Pressed | PR #161195
- **File:** `libs/omni-scheduler/scheduler-components/src/lib/ui/service-screen/service-screen.tsx`
- **Fix:** Replaced hardcoded `aria-pressed="false"` on the service-type selection `role="button"` div with a dynamic `aria-label` that prepends `"Selected"` when `checkIsSelected(service)` returns true, wiring the `useState<schedulerService>` selection state into the accessible name.
- **Pattern:** WA11Y-WEB-4.1.2-013 Var 1
