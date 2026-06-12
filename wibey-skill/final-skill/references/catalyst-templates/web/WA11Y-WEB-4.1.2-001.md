# Catalyst Template: Name: Missing or Empty Accessible Name

**Template ID:** `WA11Y-WEB-4.1.2-001`
**Platform:** Web
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Priority:** P1

---

## 🛑 The Problem
An interactive element (like a button) has no accessible name, making it completely invisible or confusing to screen reader users (it will announce as just "Button" or "Unlabelled").

---

## ✅ The Fix Patterns

When fixing this bug, the AI must evaluate the context of the codebase and apply the correct pattern. 

### Scenario A: Standard HTML/React (No Design System)
If the codebase is not using a specific Design System component, use standard `aria-label` or visible text.

**❌ Bad Code:**
```html
<!-- Fails: Icon only, no text, no aria-label -->
<button onClick={save}>
  <svg class="icon-heart" />
</button>
```

**✅ Good Code:**
```html
<button aria-label="Save to favorites" onClick={save}>
  <svg aria-hidden="true" class="icon-heart" />
</button>
```

---

### Scenario B: Living Design (LD) Components
*Consult the `component-map.json` and `design-system-docs/web/LD-Button.md` for full prop details.*

**❌ Bad Code (LD):**
```jsx
import { Button } from '@walmart-web/livingdesign-components';

// Fails: Standard LD Button should NOT be used for icon-only actions!
<Button onClick={closeModal}>
  <CloseIcon />
</Button>
```

**✅ Good Code (LD):**
```jsx
import { IconButton } from '@walmart-web/livingdesign-components';

// Fix: Swap to IconButton and use the standard aria-label prop
<IconButton aria-label="Close modal" onClick={closeModal}>
  <CloseIcon />
</IconButton>
```

---

## 🧠 Tier 1 Automated Fix Rules:
1. Always prefer **Visible Text** over `aria-label` if the design allows it.
2. If the button only contains an SVG/Icon, add a descriptive `aria-label` explaining the action (e.g., "Search", "Close menu").
3. Ensure the inner `<svg>` has `aria-hidden="true"` to prevent redundant screen reader announcements.
4. **Platform Specific:** If importing from Living Design, never hack an `aria-label` onto a standard `<Button>` if it only contains an icon. Swap the component to `<IconButton>`.

---

## 📦 Variation 1 — Incomplete `aria-labelledby` Omits Price Node on Rx Radio Button (Vision Center Lens Selection)
**Source:** CEPG-340528 / PR #163460 — `libs/item/buy-box/src/lib/lens-customization-buy-box/use-non-sunglasses-radio-a11y.ts` + `vision-non-sunglasses-options.tsx`

The radio button's accessible name was computed via `aria-labelledby`, but the price `<div>` had no `id` — it was silently dropped from the computed name. Screen readers announced the option label and features but never the price.

```tsx
// ❌ BAD — price div has no id; omitted from aria-labelledby computation
// Hook:
const rxRadioLabeledBy = `${radioGroupId} ${rxLabelA11yId}${getMultipleA11yIdResults([
  { condition: !!rxFeature1, id: rxFeature1LabelA11yId },
])}`;
// Component:
<div id={rxLabelA11yId}>{rxOptionLabel}</div>
<div className="f6">{rxPrice}</div>  {/* ← no id; never announced */}

// ✅ GOOD — SSR-safe id generated for price node; inserted between label + features
// Hook:
const rxPriceA11yId = useSSRSafeId();  // ← new
const rxRadioLabeledBy = `${radioGroupId} ${rxLabelA11yId} ${rxPriceA11yId}${getMultipleA11yIdResults([
  { condition: !!rxFeature1, id: rxFeature1LabelA11yId },
])}`;
// Component:
<div id={rxLabelA11yId}>{rxOptionLabel}</div>
<div className="f6" id={rxPriceA11yId}>{rxPrice}</div>  {/* ← id wired up */}
```

**Rule:** When building multi-part accessible names from `useSSRSafeId` hooks, every visible content node that should be announced (label, price, features, status) must receive an SSR-safe `id` and be explicitly listed in `aria-labelledby`. Omitting any node silently drops that content from the screen reader announcement — the browser gives no warning.

---

---

## Metadata

| Field | Value |
|---|---|
| Jira | CRUISE-17627 |
| PR | #174225 |
| Commit | `1b21a0e3f6d52f89143d0b376731bf200ba67211` |
| Author | Prakhar Mittal (Prakhar.Mittal@walmart.com) |
| WCAG Criterion | 4.1.2 Name, Role, Value — Missing or Empty Accessible Name (Unlabelled) |
| Template ID | WA11Y-WEB-4.1.2-001 |
| Domain | Subscriptions |
| Team | Subscription Shared Components (CRUISE-* Jira prefix) |
| Primary File | `libs/subscription/shared-components/avoid-fee-heading/src/lib/avoid-fee-heading.tsx` |

---

## Template Routing Decision

**Decision: EXISTING VARIATION**

This fix is a variation of `WA11Y-WEB-4.1.2-001` (Scenario A — Standard React with no standalone icon-button swap needed). The `InlineButton` chevron element in the `AvoidFeeHeading` component had no accessible name. It rendered an icon-only affordance that drove navigation to the "My Items" page, but exposed no label to screen readers — announcing as just "button". The fix adds a descriptive `aria-label` sourced from the Walmart i18n platform (`@walmart-web/platform-i18n`) so the label is fully localized across all supported locales.

This is distinct from the LD `IconButton` swap pattern (Scenario B) because `InlineButton` is a custom internal component (`@walmart-web/ui-inline-button`), not a standard LD `Button`. The correct fix is to pass `aria-label` directly as a prop, backed by a typed i18n message key — not to swap the component.

**Proposed Variation Number:** Variation 2

---

## Variation 2 — Icon-Only `InlineButton` Missing `aria-label`; Fixed via i18n Message Key (Subscription Avoid-Fee Heading Chevron)

**Source:** CRUISE-17627 / PR #174225 — `libs/subscription/shared-components/avoid-fee-heading/src/lib/avoid-fee-heading.tsx`

**Context:**

The `AvoidFeeHeading` component displays a heading row with a chevron `InlineButton` that navigates the user to the "My Items" page when a minimum-fee eligibility condition (`isMinFeeEligible`) is true. The button contained only an icon (chevron) with no visible text and no `aria-label`. Screen readers announced it as "button" with no description of its action.

The fix adds:
1. `aria-label={m(messages, "viewMoreEligibleItemsAriaLabel")}` on the `InlineButton`.
2. A new `viewMoreEligibleItemsAriaLabel` message key in all 6 locale YAML files (`en-US`, `en-CA`, `es-US`, `es-MX`, `es-CL`, `fr-CA`) and the TypeScript messages barrel (`messages.ts`).
3. The `m` helper import from `@walmart-web/platform-i18n` and the `messages` barrel import to the component file.

---

### Bad Code

```tsx
// libs/subscription/shared-components/avoid-fee-heading/src/lib/avoid-fee-heading.tsx
// ❌ WCAG 4.1.2 VIOLATION: InlineButton contains only a chevron icon; no accessible name provided.
// Screen reader announces: "button" — action and destination are completely opaque.

import InlineButton from "@walmart-web/ui-inline-button";
// Missing: import { m } from "@walmart-web/platform-i18n";
// Missing: import * as messages from "./locale/messages";

{isMinFeeEligible && (
  <InlineButton
    onClick={handleGoToMyItemsPage}
    // ❌ No aria-label — icon-only button is unlabelled
    data-dca-id="B:DA3FAA84BA"
    data-dca-intent="__DCA_TBD__"
    onLinkName={AV.CLICK_DELIVERY_CARD}
    // ... (chevron icon rendered as child)
  />
)}
```

```typescript
// libs/subscription/shared-components/avoid-fee-heading/src/lib/locale/messages.ts
// ❌ No message key exists for this button's accessible name
// (viewMoreEligibleItemsAriaLabel key is absent)
```

---

### Good Code

```tsx
// libs/subscription/shared-components/avoid-fee-heading/src/lib/avoid-fee-heading.tsx
// ✅ FIXED: aria-label added via i18n message key — localized for all supported locales.
// Screen reader announces: "View more eligible items to subscribe, button"

import { m } from "@walmart-web/platform-i18n";          // ← added
import * as messages from "./locale/messages";             // ← added
import InlineButton from "@walmart-web/ui-inline-button";

{isMinFeeEligible && (
  <InlineButton
    onClick={handleGoToMyItemsPage}
    aria-label={m(messages, "viewMoreEligibleItemsAriaLabel")}  // ✅ descriptive, localized label
    data-dca-id="B:DA3FAA84BA"
    data-dca-intent="__DCA_TBD__"
    onLinkName={AV.CLICK_DELIVERY_CARD}
    // ... (chevron icon rendered as child)
  />
)}
```

```typescript
// libs/subscription/shared-components/avoid-fee-heading/src/lib/locale/messages.ts
// ✅ New message key added
export const viewMoreEligibleItemsAriaLabel = () =>
  "View more eligible items to subscribe";
```

```yaml
# libs/subscription/shared-components/avoid-fee-heading/src/lib/locale/en-US.yaml
# ✅ New entry added at end of file
viewMoreEligibleItemsAriaLabel: View more eligible items to subscribe
```

---

### Explanation

The `InlineButton` chevron is a navigation trigger that is only rendered when `isMinFeeEligible` is true. Because the button renders no visible text (icon only), it requires an explicit accessible name. The Walmart Web monorepo pattern for localized accessible names is to:

1. Add the message key to the TypeScript messages barrel (`messages.ts`) with a fallback English string.
2. Add the key to every supported locale YAML file so translation pipelines (Anuvad) can produce localized strings.
3. Import the `m()` helper from `@walmart-web/platform-i18n` and the messages barrel into the component.
4. Pass `aria-label={m(messages, "keyName")}` to the target element.

This pattern ensures the accessible name is translated consistently across all locales (en-US, en-CA, es-US, es-MX, es-CL, fr-CA) and participates in the standard Walmart i18n pipeline — unlike a hardcoded English string in a JSX attribute, which would be missed by translators.

Note: This fix does NOT require swapping `InlineButton` to an LD `IconButton` (Scenario B of the base template). `InlineButton` is the correct component for this usage; it accepts `aria-label` as a standard HTML prop.

---

### Human Review Checklist

- [ ] Screen reader test (VoiceOver/NVDA): navigate to the "Avoid Fee" heading section when `isMinFeeEligible` is true; verify the chevron button announces "View more eligible items to subscribe, button"
- [ ] Keyboard test: Tab to the chevron button; verify focus is visible and Enter activates `handleGoToMyItemsPage`
- [ ] i18n check: verify `viewMoreEligibleItemsAriaLabel` is present in all 6 locale YAML files (en-US, en-CA, es-US, es-MX, es-CL, fr-CA) — confirmed in this commit's diff
- [ ] Translation pipeline: Anuvad correlation IDs `anuvad-69711fac72dcc015db89a653` and `anuvad-69711fa60d3e72660fd21f85` were auto-generated in this PR; verify translated strings are populated in es-MX and es-CL YAML files post-merge
- [ ] Verify the chevron icon child element carries `aria-hidden="true"` to prevent screen readers from announcing the SVG/icon separately (check `InlineButton` implementation or rendered HTML)
- [ ] Confirm conditional render guard (`isMinFeeEligible &&`) means this button is absent when the condition is false — no unlabelled ghost button exists in the non-eligible state
- [ ] Regression test: confirm existing unit tests in `avoid-fee-heading.spec.tsx` (or equivalent) assert `aria-label` value on the `InlineButton`

---

## TEAMS_UPDATE

File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Subscriptions/manage-optimizations.md

Content:

Append the following entry to the "Known Accessibility Pitfalls (Historical Memory)" section:

```
- **[2026-01-27] CRUISE-17627 (PR #174225) — AvoidFeeHeading chevron InlineButton missing aria-label (WCAG 4.1.2):**
  The `AvoidFeeHeading` component rendered a chevron `InlineButton` (conditionally shown when `isMinFeeEligible` is true) with no accessible name. The button contained only an icon and announced as bare "button" to screen readers.

  The fix adds an i18n-backed `aria-label` via the standard `m(messages, key)` pattern:

  ```tsx
  // ❌ WRONG — icon-only InlineButton with no label
  <InlineButton onClick={handleGoToMyItemsPage} data-dca-id="B:DA3FAA84BA" ...>
    {/* chevron icon only */}
  </InlineButton>

  // ✅ CORRECT — aria-label sourced from i18n message key, localized across all locales
  import { m } from "@walmart-web/platform-i18n";
  import * as messages from "./locale/messages";

  <InlineButton
    onClick={handleGoToMyItemsPage}
    aria-label={m(messages, "viewMoreEligibleItemsAriaLabel")}
    data-dca-id="B:DA3FAA84BA"
    ...
  >
    {/* chevron icon only */}
  </InlineButton>
  ```

  **Architectural rule for this lib:** Any icon-only interactive element (InlineButton, button, anchor) in the `avoid-fee-heading` or peer shared-components that renders without visible text MUST have an `aria-label` provided via a typed i18n message key — never a hardcoded JSX string. The message key must be registered in `messages.ts` AND in every locale YAML file before merge.

  **i18n pattern:** `m(messages, "keyName")` with `messages.ts` export + locale YAML entries for en-US, en-CA, es-US, es-MX, es-CL, fr-CA.

  **Primary file:** `libs/subscription/shared-components/avoid-fee-heading/src/lib/avoid-fee-heading.tsx`
  **Messages barrel:** `libs/subscription/shared-components/avoid-fee-heading/src/lib/locale/messages.ts`
  **See:** `WA11Y-WEB-4.1.2-001.md` Variation 2
```

---

---

## Metadata

| Field            | Value                                                                                     |
|------------------|-------------------------------------------------------------------------------------------|
| **Jira**         | CEPG-337758                                                                               |
| **PR**           | #165691                                                                                   |
| **Commit**       | `baf76a37fc90`                                                                            |
| **Author**       | Kyrin Du — XINGYUN.DU@walmart.com                                                         |
| **WCAG**         | 4.1.2 Name, Role, Value (Level A)                                                         |
| **WCAG Hint**    | Missing or Empty Accessible Name (Unlabelled)                                             |
| **Template ID**  | WA11Y-WEB-4.1.2-001 — New Variation                                                       |
| **Domain**       | Omni-Services                                                                             |
| **Team**         | Store Pages / Store Finder                                                                |
| **Primary File** | `libs/store-pages/finder-page/src/lib/map-helpers.tsx`                                   |
| **Secondary File** | `libs/store-pages/finder-page/src/lib/result-tile.tsx`                                 |

---

## Template Routing Decision

**EXISTING VARIATION** — Append to `WA11Y-WEB-4.1.2-001`

This PR is a compound fix covering two related missing-name issues in the Store Finder feature:

1. **Google Maps Marker — missing `title`:** The `createMarker()` helper in `map-helpers.tsx`
   constructed a Google Maps `Marker` object without a `title` property. Google Maps exposes
   `Marker.title` as the accessible name for map pins — without it, every store pin on the map
   announces as an unnamed/unlabelled interactive element to screen reader users. The fix builds a
   localised `title` string from the marker's `ariaLabel` prop and conditionally appends the
   translated `"selected"` string when `ariaPressed` is truthy.

2. **Result tile address paragraph — selection state absent from accessible name:** The `<p>`
   element in `result-tile.tsx` displaying the store address had an `aria-label` set to the bare
   address string. When the tile was focused/selected (`isFocused === true`), no state information
   was communicated to assistive technology. The fix appends `", selected"` (via `m(messages,
   "selected")`) to the `aria-label` when `isFocused` is true, so screen reader users know which
   result is currently selected without needing to rely on visual styling alone.

**Root cause class:** Missing accessible name on a third-party map marker object (Google Maps API),
and missing selection-state context in an `aria-label` string — both addressed by wiring existing
i18n message infrastructure (`@walmart-web/platform-i18n`) into the name/label construction.

---

## Variation 2 — Google Maps Marker Missing `title` + Selection State in Result Tile `aria-label` (Store Finder)

**Source:** CEPG-337758 / PR #165691 — `libs/store-pages/finder-page/src/lib/map-helpers.tsx` + `result-tile.tsx`

The Store Finder map rendered multiple store-location pins via the Google Maps JavaScript API.
Each pin was constructed through a `createMarker()` helper that already accepted `ariaLabel` and
`ariaPressed` as destructured properties from the `marker` argument — but never forwarded them to
the `Marker` constructor's `title` field. Google Maps uses `title` as the accessible name for
`Marker` objects in the DOM; omitting it left every pin labelled as an unnamed interactive element.
Simultaneously, the corresponding result-list tile showed the store address in a `<p>` element
with an `aria-label` that did not reflect selected state, meaning focused/selected stores were
indistinguishable from unselected ones by assistive technology.

---

### Bad Code

```tsx
// --- map-helpers.tsx (BEFORE) ---
// createMarker receives ariaLabel + ariaPressed but never uses them for the map Marker title.
// Every store pin is unlabelled to screen readers.

import { DEFAULT_MAP_CENTER, FOCUSED_STORE_MARKER_URL } from "./constants";
import { GoogleGeoPoint, Marker } from "./google-maps";

export const createMarker = ({ map, marker }: CreateMarkerProps) => {
  const {
    onClick,
    tabIndex,
    "aria-hidden": ariaHidden,
    // ariaLabel and ariaPressed are NOT destructured — they are silently ignored
  } = marker;

  // ...

  return new google.maps.Marker({
    position: { lat, lng },
    map: ariaHidden ? null : map,
    icon: getMarkerIcon(markerIconUrl),
    // ❌ title property is absent — Google Maps Marker has no accessible name
    zIndex: markerIconUrl === FOCUSED_STORE_MARKER_URL
      ? google.maps.Marker.MAX_ZINDEX
      : undefined,
  });
};

// --- result-tile.tsx (BEFORE) ---
// aria-label on the address <p> is the bare address string.
// When the tile is selected/focused, no state information reaches assistive technology.

<p
  className="ma0 lh-copy"
  aria-label={`${storeAddress}`}
  // ❌ isFocused state is not reflected in the accessible name
>
  {storeAddress}
</p>
```

---

### Good Code

```tsx
// --- map-helpers.tsx (AFTER) ---
// ariaLabel and ariaPressed are now destructured and used to build the Marker title.
// The title is localised: when selected, it appends the translated "selected" string.

import { m } from "@walmart-web/platform-i18n";
import * as messages from "./locale/messages";

export const createMarker = ({ map, marker }: CreateMarkerProps) => {
  const {
    onClick,
    tabIndex,
    "aria-hidden": ariaHidden,
    "aria-label": ariaLabel,      // ✅ now destructured
    "aria-pressed": ariaPressed,  // ✅ now destructured
  } = marker;

  // ...

  return new google.maps.Marker({
    position: { lat, lng },
    map: ariaHidden ? null : map,
    icon: getMarkerIcon(markerIconUrl),
    // ✅ title provides the accessible name for the map pin.
    //    When the pin is in a pressed/selected state, the localised "selected"
    //    string is appended so screen readers announce the full state.
    title: `${ariaLabel} ${ariaPressed ? m(messages, "selected") : ""}`,
    zIndex: markerIconUrl === FOCUSED_STORE_MARKER_URL
      ? google.maps.Marker.MAX_ZINDEX
      : undefined,
  });
};

// --- result-tile.tsx (AFTER) ---
// aria-label now includes selection state when the tile is focused.
// Screen readers announce e.g. "123 Walmart Dr, Bentonville AR, selected"

<p
  className="ma0 lh-copy"
  aria-label={`${storeAddress}, ${isFocused ? m(messages, "selected") : ""}`}
  // ✅ isFocused is reflected in the accessible name — AT users know which store is active
>
  {storeAddress}
</p>

// --- locale/messages.ts (ADDED) ---
// New i18n message key used by both map-helpers and result-tile.
export const selected = () => "selected";

// en-US.yaml addition:
// selected: "selected"
// (Also added to en-CA, es-US, es-CL, es-MX, fr-CA for full locale coverage)
```

---

### Explanation

**Why `Marker.title` is the correct fix for Google Maps pins:**
Google Maps JavaScript API `Marker` objects are not standard DOM elements during construction —
they are imperative API objects. The accessible name for a `Marker` is set via the `title`
property, which Google Maps writes into the pin's underlying DOM element as an `aria-label` or
`title` attribute when it renders. Attempting to set `aria-label` directly on the API object has
no effect; `title` is the only supported accessible-name hook. Any codebase using the Google Maps
JS API for interactive map pins must always populate `title` to satisfy WCAG 4.1.2.

**Why state belongs in the accessible name here (not `aria-pressed` alone):**
The `<p>` element showing the store address is a non-interactive paragraph — it does not have a
role that supports `aria-pressed`, `aria-selected`, or `aria-current`. Embedding the selection
indicator directly into the `aria-label` string (`", selected"`) is the correct approach for
non-interactive content that needs to convey associated state. For the Google Maps Marker (which
renders as a button in the DOM), the `title` string also carries this state because Google Maps
does not support separate ARIA state attributes on Marker objects via the imperative API.

**Localisation is non-negotiable:**
The `"selected"` suffix must go through the i18n pipeline (`m(messages, "selected")`) so it is
translated for all supported locales. Hard-coding `"selected"` as a raw string in `aria-label`
or `title` produces English-only output for Spanish, French-Canadian, and other locale users —
a separate WCAG failure. The `messages.ts` addition + YAML locale entries ensure this scales
correctly.

---

### Human Review Checklist

- [ ] **Screen reader test (map):** Focus a store pin on the Store Finder map with a screen reader
  (NVDA+Chrome, VoiceOver+Safari). Confirm the pin announces the store name. Confirm a selected/
  pressed pin announces the name followed by "selected" (or translated equivalent).
- [ ] **Screen reader test (result list):** Navigate the result tile list. Confirm the selected
  store's address paragraph announces `"<address>, selected"`. Confirm unselected tiles do NOT
  include "selected" in the announcement.
- [ ] **Locale coverage:** Verify that `selected` key is present and correctly translated in all
  6 locale files: `en-US.yaml`, `en-CA.yaml`, `es-US.yaml`, `es-CL.yaml`, `es-MX.yaml`,
  `fr-CA.yaml`. (PR includes all 6 — confirm no locale is missing.)
- [ ] **`ariaHidden` marker exclusion:** Confirm that markers with `"aria-hidden": true` continue
  to pass `map: null` (hiding them from the map / AT) and are not given a `title` value that
  could cause AT to discover them through another path.
- [ ] **Trailing space in title string:** When `ariaPressed` is false/undefined, the template
  string `${ariaLabel} ${""}` produces a trailing space. Verify this does not cause AT to
  announce a spurious pause or empty token on unselected pins. Consider trimming:
  `title: \`\${ariaLabel}\${ariaPressed ? \` \${m(messages, "selected")}\` : ""}\``
- [ ] **Unit test coverage:** Add a test asserting that `createMarker()` returns a Marker with
  a non-empty `title` equal to the input `ariaLabel`, and a separate case confirming the
  `" selected"` suffix when `ariaPressed` is true.
- [ ] **result-tile comma punctuation:** When `isFocused` is false, `aria-label` becomes
  `"<address>, "` (trailing comma + space). Confirm this does not produce an audible artefact
  in screen reader output. Consider: `aria-label={\`\${storeAddress}\${isFocused ? \`, \${m(messages, "selected")}\` : ""}\`}`

---

## TEAMS_UPDATE

File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Omni-Services/omni-scheduler.md

Content: Append the following architectural insight for the Store Finder / store-pages team:

---

### Store Finder — Google Maps Marker Accessible Name Pattern

**Jira:** CEPG-337758 | **PR:** #165691 | **Commit:** `baf76a37fc90`
**File paths:**
- `libs/store-pages/finder-page/src/lib/map-helpers.tsx`
- `libs/store-pages/finder-page/src/lib/result-tile.tsx`
- `libs/store-pages/finder-page/src/lib/locale/messages.ts`

**Pitfall pattern — Google Maps Marker has no accessible name by default:**
The `createMarker()` helper constructs `google.maps.Marker` objects imperatively. The Marker API
does not automatically inherit `aria-label` from the caller's props object — `title` must be
explicitly set in the Marker constructor options. Any team member adding a new Marker type or
refactoring `createMarker()` must include `title` populated from the caller-supplied label.

```tsx
// REQUIRED pattern for any google.maps.Marker in this codebase:
new google.maps.Marker({
  position: { lat, lng },
  map: ariaHidden ? null : map,
  icon: getMarkerIcon(markerIconUrl),
  // Always populate title — this IS the accessible name for the pin:
  title: `${ariaLabel}${ariaPressed ? ` ${m(messages, "selected")}` : ""}`,
});
```

**State in accessible name — non-interactive paragraphs:**
When a `<p>` or other non-interactive element must convey selection/focused state (e.g., result
tile store address), embed the state into the `aria-label` string using a localised message key.
Do NOT attempt `aria-pressed` or `aria-selected` on non-interactive elements — those attributes
are only valid on elements with matching ARIA roles.

```tsx
// Correct pattern for selection state on a non-interactive paragraph:
<p
  aria-label={`${storeAddress}${isFocused ? `, ${m(messages, "selected")}` : ""}`}
>
  {storeAddress}
</p>
```

**i18n requirement:** Any string appended to an `aria-label` or `title` must use `m(messages, key)`
— never hard-code English strings into accessible name constructions. See `messages.ts` for the
`selected` key.
