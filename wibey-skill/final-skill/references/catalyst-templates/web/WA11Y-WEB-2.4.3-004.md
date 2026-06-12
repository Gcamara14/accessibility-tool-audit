# Catalyst Template: Focus Order: General Focus Order is Not Logical or Meaningful

**Template ID:** `WA11Y-WEB-2.4.3-004`
**Platform:** Web
**WCAG Criterion:** WCAG-2.4.3

---

## 🛑 The Problem
The tab order of interactive elements does not follow a logical sequence, causing confusion for users navigating via keyboard.

**Expected Result:** Interactive elements should receive focus in a logical and meaningful order that aligns with the visual layout and user expectations.
**Actual Result:** Focus moves in an illogical sequence, skipping elements or moving out of context, disrupting the navigation flow.

---

## ✅ The Fix Patterns

> **Recommendation:** Review and adjust the DOM structure to reflect the desired tab order. Focus should move from top to bottom left to right.

### Standard Implementation
**❌ Bad Code:**
```html
<!-- TODO: Add Failing Example -->
```

**✅ Good Code:**
```html
<!-- TODO: Add Passing Example -->
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

# Ingest Draft: CEPG-341100 | PR #164426

**JIRA:** CEPG-341100
**PR:** #164426
**WCAG:** 2.4.3 Focus Order (Level A) — General Focus Order is Not Logical or Meaningful
**Template ID:** WA11Y-WEB-2.4.3-004 (existing template — this PR is a concrete variation/example)
**Proposed Variation Note:** WA11Y-WEB-2.4.3-004 Variation 1 — page-level focus and scroll restoration on route/view mount
**Commit:** 7fc17a77bf2aa285a7146ac62447fa1f59762a98
**Author:** PremBalaji Baladandayutham (Prembalaji.Baladanda@walmart.com)
**Date:** 2025-10-17
**Domain:** Accounts — Create Tax Profile Page
**File Changed:** `libs/account/create-tax-profile-page/src/lib/components/page-title.tsx`

---

## Summary

The `PageTitle` component on the Create Tax Profile page did not manage focus when the page or multi-step view mounted. When a screen reader or keyboard user navigated to this page, focus remained wherever it was last (typically the navigation trigger) and did not move to the page heading. The user had no logical anchor to start reading the new page content — a direct WCAG 2.4.3 Focus Order failure.

Additionally, the heading could appear visually below a sticky header/progress bar, so even sighted keyboard users could lose context. The fix adds a `useEffect` that fires on component mount, focuses the heading wrapper via a `useRef`, and smoothly scrolls the heading into view accounting for the fixed header offset.

The `tabIndex={-1}` wrapper pattern is used: a `<div>` wraps the `<Heading>` component, receives `tabIndex={-1}` to be programmatically focusable, and `className="outline-0"` suppresses the browser's default focus ring on this structural wrapper (the `<Heading>` content itself remains semantically correct).

---

## Bad Code (before)

```tsx
// page-title.tsx — BEFORE
// No focus management, no ref, no useEffect
// When the page mounts, focus stays on the element that triggered navigation.
// Screen reader users have no heading anchor; they must manually browse to find page content.

import { Heading } from "@walmart-web/livingdesign-components";
import { m } from "@walmart-web/platform-i18n";
import * as messages from "../../locale/messages";

const PageTitle: React.FC = () => {
  return (
    <Heading
      as="h2"
      size="large"
      UNSAFE_className="mt3"
      data-testid="tax-profile-page-title"
    >
      {m(messages, "pageTitle")}
    </Heading>
  );
};
```

**Why this fails WCAG 2.4.3:**
- On page/view mount there is no programmatic focus move. Focus sits wherever it was (e.g., on the nav link that triggered the route change). The tab order from that point does not logically start at the top of the new page content.
- Screen reader users are not placed at the page heading; they must navigate manually to discover what page they are on.
- The heading element itself is not focusable (no `tabIndex`), so `.focus()` cannot be called on it programmatically.

---

## Good Code (after)

```tsx
// page-title.tsx — AFTER
// useRef + tabIndex={-1} wrapper + useEffect on mount to focus and scroll to heading.

import { Heading } from "@walmart-web/livingdesign-components";
import { m } from "@walmart-web/platform-i18n";
import { useEffect, useRef } from "react";
import * as messages from "../../locale/messages";

const PageTitle: React.FC = () => {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus and scroll to the heading when component mounts
    if (headingRef.current) {
      // Set focus to the heading for screen readers
      headingRef.current.focus();

      // Scroll the heading into view with offset to account for sticky header
      const headerOffset = 200; // Adjust this value based on header + progress bar height
      const elementPosition = headingRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div ref={headingRef} tabIndex={-1} className="outline-0">
      <Heading
        as="h2"
        size="large"
        UNSAFE_className="mt3"
        data-testid="tax-profile-page-title"
      >
        {m(messages, "pageTitle")}
      </Heading>
    </div>
  );
};
```

---

## Why It Fixes WCAG 2.4.3 — Focus Order

WCAG 2.4.3 (Level A) requires that focusable components receive focus in an order that preserves meaning and operability. For a multi-step form or page-view transition (without a full browser navigation), focus does not automatically reset to the top of the new content — the browser retains focus on wherever it was. The result is an illogical focus order: the user is on a new page but their focus position still refers to something on the previous page or in the navigation chrome.

The fix mechanism:

1. **`tabIndex={-1}` on the wrapper `<div>`** — Makes a non-interactive element programmatically focusable (via `.focus()`) without inserting it into the sequential tab order. This is the canonical pattern for programmatic-only focus destinations (heading anchors, skip-link targets, panel headings on view transitions).

2. **`useRef<HTMLDivElement>`** — Holds a stable reference to the heading wrapper element across renders, enabling the `useEffect` to call `.focus()` on it.

3. **`useEffect(() => { ... }, [])`** — The empty dependency array means this runs exactly once: on component mount. For a route-level page title component (rendered once when the page view mounts), this is the correct trigger point. When the user navigates to this step of the tax profile flow, focus moves immediately to the heading — establishing a logical starting point for all subsequent tab/read navigation.

4. **`window.scrollTo` with offset** — The Create Tax Profile page has a sticky header + progress bar. If the heading is rendered below this fixed chrome and the page has scroll position from a previous step, the heading may be visually obscured. The offset calculation (`getBoundingClientRect().top + window.scrollY - 200`) accounts for the approximate combined height of sticky elements and ensures the heading is visible in the viewport before focus lands on it.

5. **`className="outline-0"` on wrapper** — Suppresses the browser's default focus outline on the structural `<div>` wrapper. The `<Heading>` child element is the visible content and should not gain a focus ring. This is acceptable because the `.focus()` call here is programmatic (mount-time) — not a user-initiated tab, so no visible focus indicator is required for this specific moment.

---

## Fix Mechanism Summary

| Mechanism | Used? |
|---|---|
| `useRef` + `.focus()` | YES — `useRef<HTMLDivElement>` + `headingRef.current.focus()` |
| `tabIndex={-1}` on non-interactive wrapper | YES — makes heading wrapper programmatically focusable |
| `useEffect` with empty deps array (on-mount) | YES — fires once at page/view mount |
| `window.scrollTo` with sticky header offset | YES — scrolls heading into viewport accounting for fixed chrome |
| `className="outline-0"` to suppress focus ring | YES — programmatic focus; no visual indicator needed |
| FocusTrap / LD Modal built-in | NO |
| Positive `tabindex` | NO |
| CSS `order` property | NO |
| DOM reordering | NO |

---

## Pattern Classification

**WCAG hint match:** "General Focus Order is Not Logical or Meaningful" → WA11Y-WEB-2.4.3-004

**New pattern vs. existing template:** This is the **first concrete example for WA11Y-WEB-2.4.3-004**, which currently has placeholder `<!-- TODO: Add Failing Example -->` sections. This PR provides both the bad and good code to fill those placeholders.

The pattern — `tabIndex={-1}` wrapper + `useRef` + `useEffect([], [])` to focus the page heading on mount — is the canonical React solution for page-level focus management in SPA / multi-step form flows. It is distinct from the dialog focus patterns in WA11Y-WEB-2.4.3-001 (modal open/close) and the error focus patterns in WA11Y-WEB-2.4.3-002.

**Proposed addition to WA11Y-WEB-2.4.3-004:**

> ### Variation 1: Page/View Mount Focus Management (SPA Route Transitions)
>
> When a multi-step form or SPA route renders a new view/page, focus must be moved to the page heading on mount. Use `tabIndex={-1}` on a wrapper `<div>` around the heading, `useRef<HTMLDivElement>`, and `useEffect(() => { headingRef.current?.focus(); }, [])`. Optionally combine with `window.scrollTo` if a sticky header may obscure the heading.

---

## Domain / Team Notes

- **Repo path:** `libs/account/create-tax-profile-page/src/lib/components/`
- **Domain:** Accounts — Create Tax Profile Page
- **Jira prefix:** CEPG-*
- **Design System:** Living Design (`@walmart-web/livingdesign-components`) — `<Heading as="h2" size="large">` with `UNSAFE_className` for Tachyons utility classes. This matches the same LD + Tachyons pattern seen in `libs/account/protection-plans-page/`.
- **i18n:** Uses `m(messages, "key")` pattern — consistent with other Accounts domain components.
- **No existing teams file for `create-tax-profile-page`:** The closest file is `teams/Accounts/protection-plans.md` which maps CEPG-* to the Accounts domain. The `create-tax-profile-page` library is a new sub-area within the Accounts domain not yet documented.
- **Component role:** `PageTitle` is a route-level component rendered at the top of the tax profile page view. It is the correct place to own focus management for this page — equivalent to a skip-link target or h1 for the view.
- **Multi-step form pattern risk:** Any other multi-step form component in `libs/account/` that renders a page-level title without focus management on mount is a candidate for the same WCAG 2.4.3 failure. Audit pattern: look for `<Heading as="h1|h2">` inside page-level components in `libs/account/` that have no `useRef` + `useEffect` focus logic.

---

## Bonus Cross-Criterion Findings

- No WCAG 1.3.1 or 4.1.2 issues found in this diff. The `<Heading as="h2">` correctly uses the `as` prop for semantic level.
- The `data-testid="tax-profile-page-title"` attribute is preserved in the refactor — existing test selectors are unaffected.
- The `headerOffset = 200` magic number is a known approximation. A more robust approach would compute the actual height of all fixed-position ancestors (e.g., `document.querySelector('.sticky-header')?.offsetHeight`), but 200px is a pragmatic constant that avoids layout-query overhead in this context.

---


---

# Ingest Draft: CEPG-338329 | PR #165684

**JIRA:** CEPG-338329
**PR:** #165684
**WCAG:** 2.4.3 Focus Order (Level A) — General Focus Order is Not Logical or Meaningful
**Template ID:** WA11Y-WEB-2.4.3-004 (existing template — this PR is a concrete variation)
**Proposed Sub-ID or Variation Note:** WA11Y-WEB-2.4.3-004 Variation 1 — post-state-change focus management via `forwardRef` + `useRef` + `useEffect`
**Commit:** 0743c5fe06d9f149db51a1d61a49e9f9f68ce6cc
**Author:** Griffin Koss (g0k02y7)
**Date:** 2025-10-30
**Domain:** Shared UI / Product Tile (`libs/ui/product-tile/`)
**Primary Source Files:**
- `libs/ui/product-tile/src/lib/vertical/sub-components/product-reward-icon-text.tsx`
- `libs/ui/product-tile/src/lib/vertical/sub-components/product-reward-toggle-clip.tsx`

---

## Summary

The `ProductRewardToggleClip` component renders a "clip reward" checkbox. When a user activates the checkbox to claim an offer, the component transitions from an unclaimed state to a "CLIPPED" (claimed) state — at which point the checkbox is replaced by a `ProductRewardIconText` component showing a "Reward saved" message.

Before this fix, after the state transition occurred, focus was dropped entirely. The interactive checkbox was replaced by a non-interactive text span with no programmatic focus management. A keyboard or screen reader user who activated the checkbox would find their focus position destroyed with no indication of what happened — a clear WCAG 2.4.3 violation.

The fix uses a three-part mechanism:
1. `ProductRewardIconText` is converted to use `React.forwardRef`, exposing the inner `<span>` via a ref, and `tabIndex={-1}` is added to the `<span>` to make it programmatically focusable.
2. `ProductRewardToggleClip` adds a `shouldFocusAfterClip` boolean state flag, set to `true` on checkbox change.
3. A `useEffect` watches both `shouldFocusAfterClip` and `rewardStateWithoutContext`. When both conditions are met (the flag is true and the state has transitioned to `CLIPPED`), `productRewardIconTextRef.current?.focus()` is called, moving focus to the reward confirmation text. The flag is then reset to `false`.

---

## Bad Code (before)

### product-reward-icon-text.tsx — not a forwardRef, span not focusable

```tsx
// BAD: plain functional component — no ref exposure, no tabIndex
export const ProductRewardIconText: React.FC<ProductRewardIconTextProps> = ({
  baseClass,
  iconName,
  iconSize,
  iconClass,
  textClass,
  textMessage,
}) => {
  return (
    <div className={baseClass}>
      {iconName && (
        <Icon
          name={iconName}
          size={iconSize}
          className={iconClass}
          aria-hidden
        />
      )}
      <span className={textClass}>{textMessage}</span>
      {/* BAD: span has no tabIndex — cannot receive programmatic focus */}
    </div>
  );
};
```

### product-reward-toggle-clip.tsx — no focus management on state change

```tsx
// BAD: state change from UNCLIPPED to CLIPPED triggers re-render
//      that replaces the checkbox with reward text — focus is dropped
const [isRewardClipped, setRewardClipped] = useState(false);
// No ref, no focus-restoration state, no useEffect for focus

const handleOnChangeCheckbox = () => {
  safeSetItem("digitalRewardsClick", Date.now().toString());
  if (setRewardState) {
    // ... reward state update logic ...
  }
  if (onToggleCheckbox) {
    onToggleCheckbox();
  }
  // BAD: no setShouldFocusAfterClip(true) — focus is abandoned after clip
};

// In JSX — ProductRewardIconText receives no ref
<ProductRewardIconText
  ...
  // BAD: no ref prop — cannot be programmatically focused
/>
```

---

## Good Code (after)

### product-reward-icon-text.tsx — converted to forwardRef, span is focusable

```tsx
import { forwardRef } from "react";

// GOOD: forwardRef exposes the inner <span> to the parent via ref
export const ProductRewardIconText = forwardRef<
  HTMLSpanElement,
  ProductRewardIconTextProps
>(
  (
    { baseClass, iconName, iconSize, iconClass, textClass, textMessage },
    ref
  ) => {
    return (
      <div className={baseClass}>
        {iconName && (
          <Icon
            name={iconName}
            size={iconSize}
            className={iconClass}
            aria-hidden
          />
        )}
        {/* GOOD: tabIndex={-1} makes span programmatically focusable without
            entering the natural tab order; ref forwarded from parent */}
        <span className={textClass} ref={ref} tabIndex={-1}>
          {textMessage}
        </span>
      </div>
    );
  }
);
```

### product-reward-toggle-clip.tsx — ref + flag + useEffect manages post-clip focus

```tsx
import { useEffect, useRef, useState } from "react";

// GOOD: ref targets the reward text span exposed via forwardRef
const [isRewardClipped, setRewardClipped] = useState(false);
const [shouldFocusAfterClip, setShouldFocusAfterClip] = useState(false);
const productRewardIconTextRef = useRef<HTMLSpanElement | null>(null);

// GOOD: effect fires when both the flag is set AND the state has reached CLIPPED
//       This guards against race conditions between state update and render
useEffect(() => {
  if (
    shouldFocusAfterClip &&
    rewardStateWithoutContext === RewardState.CLIPPED
  ) {
    productRewardIconTextRef?.current?.focus();
    setShouldFocusAfterClip(false);
  }
}, [shouldFocusAfterClip, rewardStateWithoutContext]);

const handleOnChangeCheckbox = () => {
  safeSetItem("digitalRewardsClick", Date.now().toString());
  if (setRewardState) {
    // ... reward state update logic ...
  }
  if (onToggleCheckbox) {
    onToggleCheckbox();
  }
  // GOOD: flag is set on checkbox activation — focus will follow when CLIPPED
  setShouldFocusAfterClip(true);
};

// In JSX — ref is wired to the ProductRewardIconText span
<ProductRewardIconText
  baseClass={...}
  iconName={...}
  textMessage={savedRewardsMessage}
  ref={productRewardIconTextRef}   // GOOD: ref passed through forwardRef
/>
```

---

## Why This Fixes WCAG 2.4.3

WCAG 2.4.3 (Level A) requires that focusable components receive focus in an order that preserves meaning and operability. In a state-driven interaction where one interactive element (checkbox) is replaced by a confirmation message (text span), focus must be explicitly moved to the new content. Without this, the focus order is broken: the user activates a control, the control disappears, and focus is stranded — no logical next element is announced.

**The three-part fix mechanism:**

1. **`forwardRef` + `tabIndex={-1}` on the text span:** Non-interactive elements (`<span>`) cannot receive programmatic focus by default. `tabIndex={-1}` makes the span focusable via `.focus()` without inserting it into the sequential tab order. `forwardRef` allows the parent to hold a stable `useRef` handle to this span.

2. **Boolean state flag (`shouldFocusAfterClip`):** The checkbox `onChange` handler cannot directly call `.focus()` on the reward text because the reward text does not exist in the DOM yet at that point — it is only rendered after `rewardStateWithoutContext` transitions to `CLIPPED` (which is driven by external state). The flag decouples "user intent to focus" from "DOM readiness."

3. **`useEffect` as a post-render focus gate:** `useEffect` fires after React has committed the state changes to the DOM. By depending on both `shouldFocusAfterClip` and `rewardStateWithoutContext`, the effect only fires when (a) the user has activated the checkbox AND (b) the rendered state confirms the reward text is now in the DOM. This prevents `.focus()` being called on a not-yet-rendered element.

---

## Focus Mechanism Summary

| Mechanism | Used? |
|---|---|
| `React.forwardRef` to expose child ref | YES |
| `tabIndex={-1}` on non-interactive element | YES — `<span>` in `ProductRewardIconText` |
| `useRef<HTMLSpanElement>` | YES — `productRewardIconTextRef` |
| Boolean flag state to coordinate focus intent | YES — `shouldFocusAfterClip` |
| `useEffect` as post-render focus gate | YES — guards against calling `.focus()` before DOM update |
| `requestAnimationFrame` | NO — `useEffect` is sufficient since state and render are synchronous in this flow |
| FocusTrap | NO |
| `setTimeout` deferral | NO |

---

## Pattern Classification

**New or Variation:** This is a **new variation for WA11Y-WEB-2.4.3-004** (General Focus Order is Not Logical or Meaningful). The base template is currently empty (no bad/good code examples). This PR provides the first concrete implementation example.

**Proposed addition to WA11Y-WEB-2.4.3-004:**

> ### Variation 1: Post-State-Change Focus Management (Checkbox-to-Confirmation Pattern)
>
> When a user interaction replaces an interactive element (checkbox, button) with a non-interactive confirmation element (text, icon+text), focus must be explicitly moved to the new content. Use `React.forwardRef` + `tabIndex={-1}` on the target element, `useRef` in the parent, a boolean flag state set on user action, and a `useEffect` that fires focus only after the new state has committed to the DOM.

---

## Team / Domain Notes

- **Repo path:** `libs/ui/product-tile/src/lib/vertical/sub-components/`
- **Domain:** Shared UI (`libs/ui/`) — the product-tile component is a shared UI library, not owned by one feature team. The Discovery / Item Page team notes already reference `libs/ui/product-tile` as a shared generic UI piece.
- **CEPG prefix:** This Jira ticket uses the CEPG prefix. Based on the file path (`libs/ui/product-tile/`), this is a shared UI component that surfaces on the Item Page (PDP), Search Results, and any other surface using the vertical product tile.
- **Pattern applicability:** Any component that toggles between an interactive state (with a focusable element) and a confirmation/success state (with a non-interactive element) must implement this same three-part pattern. Examples: "Add to cart" → "Item added" text, "Subscribe" → "Subscribed" text, any toggle-then-confirm UX.
- **`forwardRef` upgrade:** Converting `ProductRewardIconText` from a plain `React.FC` to `forwardRef` is a safe, non-breaking change. The component's public API is unchanged — the `ref` prop is new and optional.

---


---

# Ingest Draft: CEPG-306542 | PR #142253

**JIRA:** CEPG-306542
**PR:** #142253
**WCAG:** 2.4.3 Focus Order (Level A) — General Focus Order is Not Logical or Meaningful
**Template ID:** WA11Y-WEB-2.4.3-004 (existing template — this PR fills the currently-empty bad/good code examples)
**Proposed Sub-ID or Variation Note:** WA11Y-WEB-2.4.3-004 (GIC DrawerWrapper DOM order fix — concrete example for empty template)
**Commit:** b31602906f48960183d54fad00f2355a1c0b64b9
**Author:** Sathish Bere (s1b0hoe)
**Date:** 2025-05-08
**Domain:** Transaction / Checkout — Global Intent Center (GIC) UI
**File Changed:** `libs/ui/global-intent-center/component/src/lib/drawer-wrapper.tsx`

---

## Summary

The `DrawerWrapper` component in the Global Intent Center (GIC) renders a `<Button>` (the "skip to main" / close button with a `CloseCircleFill` icon) before the `<DrawerBottom>` component in the JSX tree. Because browsers assign tab focus in DOM order, keyboard and screen reader users reached the close button before encountering the drawer's bottom-section content (`DrawerBottom`). This violated the expected visual reading order — the drawer bottom content (upsell banners, drone delivery, errors) should be traversable before the close/skip control.

The fix moves `<DrawerBottom>` above `<Button>` in the JSX so the DOM order matches the visual/logical reading order: content first, then the dismiss control.

---

## Bad Code (before)

```tsx
// ❌ WRONG DOM ORDER: Close button appears in the DOM BEFORE DrawerBottom content
// Tab order: [...drawer content...] → [Close Button] → [DrawerBottom interactive elements]
// The close button interrupts navigation before bottom content is reached.

      </div>
    )}
    <Button
      className="slider skip-main bg-primary bg-transparent bn lh-solid pa0 tc underline inline-button pointer right-0 skip-btn"
      variant="primary"
      size="medium"
      onClick={onCloseWithFocusReturn}
      aria-label={m(messages, "close")}
      useLDButton={false}
    >
      <Icon
        name="CloseCircleFill"
        size="medium"
        className="white"
        aria-hidden
      />
    </Button>
    <DrawerBottom
      shouldShowDroneDelivery={!!shouldShowDroneDelivery}
      cartCheckoutableErrors={cartCheckoutableErrors}
      reservation={reservation}
      isValidReservation={isValidReservation}
      isGicDrawerOpen={isGicDrawerOpen}
      selectedIntent={selectedIntent}
      upsellBannerDetails={upsellBannerDetails}
      isMember={!!shouldShowWplusLogo}
    />
```

---

## Good Code (after)

```tsx
// ✅ CORRECT DOM ORDER: DrawerBottom content appears BEFORE the Close button
// Tab order: [...drawer content...] → [DrawerBottom interactive elements] → [Close Button]
// Content is fully navigable before reaching the dismiss control.

      </div>
    )}
    <DrawerBottom
      shouldShowDroneDelivery={!!shouldShowDroneDelivery}
      cartCheckoutableErrors={cartCheckoutableErrors}
      reservation={reservation}
      isValidReservation={isValidReservation}
      isGicDrawerOpen={isGicDrawerOpen}
      selectedIntent={selectedIntent}
      upsellBannerDetails={upsellBannerDetails}
      isMember={!!shouldShowWplusLogo}
    />
    <Button
      className="slider skip-main bg-primary bg-transparent bn lh-solid pa0 tc underline inline-button pointer right-0 skip-btn"
      variant="primary"
      size="medium"
      onClick={onCloseWithFocusReturn}
      aria-label={m(messages, "close")}
      useLDButton={false}
    >
      <Icon
        name="CloseCircleFill"
        size="medium"
        className="white"
        aria-hidden
      />
    </Button>
```

---

## Why This Fixes WCAG 2.4.3 — Focus Order

WCAG 2.4.3 (Level A) states: "If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves their meaning and operability."

For a drawer/panel UI:

1. **DOM order = tab order** (when no `tabindex` overrides are present). React renders JSX top-to-bottom into the DOM; browser tab navigation follows that DOM order.

2. **The close/dismiss button is a terminal control.** Visually and logically, a dismiss button belongs at the end of a drawer's interactive flow — users first explore the content, then choose to dismiss. When the close button appears before `<DrawerBottom>` in the DOM, keyboard users encounter the dismiss action before they have reached all the actionable content in the drawer bottom (drone delivery links, upsell banner interactions, error acknowledgment buttons).

3. **No CSS or `tabindex` should be used to paper over DOM order issues.** The correct fix is always to reorder the JSX/DOM so the source order matches the intended reading/tab order. Using `tabindex` values greater than 0 to force a different tab sequence is an anti-pattern that creates maintenance debt and fragility.

4. **The fix is purely structural — zero logic changes.** Moving 10 lines of JSX up 10 lines restores logical order with no risk to functionality.

---

## Fix Mechanism Summary

| Attribute | Value |
|---|---|
| Root cause | JSX component order placed `<Button>` (close) before `<DrawerBottom>` (content) in DOM |
| Fix mechanism | Reorder JSX: move `<DrawerBottom>` above `<Button>` |
| `tabindex` used | No |
| CSS reordering used | No |
| Logic/state changes | None |
| Lines changed | 10 insertions, 10 deletions (pure reorder) |

---

## Template Match Rationale

Template WA11Y-WEB-2.4.3-004 ("General Focus Order is Not Logical or Meaningful") currently has placeholder `<!-- TODO: Add Failing Example -->` / `<!-- TODO: Add Passing Example -->` in its bad/good code sections. This PR is a clean, real-world example to fill those placeholders. The fix mechanism (reordering DOM/JSX nodes to match visual/logical order) is the canonical example of this template's guidance: "Review and adjust the DOM structure to reflect the desired tab order. Focus should move from top to bottom left to right."

---

## Team / Domain Notes

- **Jira prefix:** CEPG-*
- **Repo path:** `libs/ui/global-intent-center/component/src/lib/`
- **Domain:** Transaction — the GIC (Global Intent Center) is the fulfillment intent / delivery-option selection drawer used across checkout. CEPG tickets map to Transaction / Checkout Experience domain.
- **Existing teams file:** `teams/Transaction/payments-checkout.md` — currently covers `libs/payments/` paths. The GIC lives at `libs/ui/global-intent-center/`, which is a shared UI library, but is owned by the same checkout experience org (CEPG Jira prefix confirms this).
- **No dedicated GIC teams file exists.** This is a gap — `libs/ui/global-intent-center/` has no routing entry in the teams directory. The Transaction/payments-checkout.md file should be extended or a sibling `gic.md` file created.
- **ADA ticket naming convention:** The commit message uses `gic-ada fix` — ADA (Accessibility) fixes in the GIC component library follow the same CEPG prefix as payments/checkout ADA tickets.
- **Pattern applicability:** Any drawer, panel, or modal-adjacent UI where a dismiss/close button is rendered in JSX should be checked to ensure the close button appears last in DOM order relative to the content it closes.

---

