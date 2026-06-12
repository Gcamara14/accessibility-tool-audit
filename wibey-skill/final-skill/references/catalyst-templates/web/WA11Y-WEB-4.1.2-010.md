# Catalyst Template: State: Expanded/Collapsed State Not Announced (Accordion)

**Template ID:** `WA11Y-WEB-4.1.2-010`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem
Expandable elements like accordions do not announce their expanded or collapsed state to screen readers.

**Expected Result:** State changes should be communicated using ARIA attributes such as `aria-expanded`.
**Actual Result:** Screen readers do not inform users whether the content is expanded or collapsed.

---

## ✅ The Fix Patterns

> **Recommendation:** Implement `aria-expanded` to indicate the current state of expandable elements. It is an HTML5 attribute, that toggles between true/false. Search Google for 'aria-expanded' term for examples.

### Standard Implementation
```html
// Best: aria-expanded
    <button aria-expanded="false" aria-controls="XYZ">Ingredients</button>
    <div id="XYZ" hidden>...I am hidden content...</div>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.


---

## Metadata

| Field | Value |
|---|---|
| Jira | CRUISE-16218 |
| PR | #161792 |
| Commit | `42baa1a0b44a9f7a25ec1b33e6ecddb3062c2263` |
| Author | Nandini Karuturi (Nandini.Karuturi@walmart.com) |
| WCAG Criterion | 4.1.2 State — Expanded/Collapsed State Not Announced (Accordion) |
| Template ID | WA11Y-WEB-4.1.2-010 |
| Classification | EXISTING VARIATION |
| Domain | Subscriptions |
| Team | Subscription Manage Optimizations (CRUISE-* Jira prefix) |
| Primary File | `libs/subscription/manage-optimizations/src/lib/subscription-items-components/subscription-items-option.tsx` |

---

## Template Routing Decision

**Decision: EXISTING VARIATION** — Append to `WA11Y-WEB-4.1.2-010`

The `SubscriptionItemsOption` component renders a "more options" button that triggers a popup
menu for each subscription line item. The trigger button had an `aria-label` but was missing
`aria-expanded`, `aria-haspopup`, and `aria-controls`. The popup menu element (`LD Menu` or
equivalent) also had no `id`, so even if `aria-controls` had been present it could not have
resolved. The result: screen readers announced the button as a generic labeled button with no
indication that it controls an expandable popup, and could not follow the controls relationship
to the menu panel.

This is a variation of `WA11Y-WEB-4.1.2-010` (Expanded/Collapsed State Not Announced) applied
to a **popup menu trigger** pattern rather than a classic content accordion. The core violation
class is identical: a disclosure/trigger element is missing `aria-expanded` wired to the open
state of the controlled region.

**Proposed Variation Number:** Variation 1

---

## Variation 1 — Popup Menu Trigger Missing `aria-expanded`, `aria-haspopup`, `aria-controls` + Menu Panel Missing `id` (Subscription Items Option)

**Source:** CRUISE-16218 / PR #161792 — `libs/subscription/manage-optimizations/src/lib/subscription-items-components/subscription-items-option.tsx`

**Context:**

The `SubscriptionItemsOption` component displays a row for each subscription item. A "more options"
button (rendered via an LD or custom button component) opens a popup options menu
(`items-option-menu-${index}-${innerIndex}`) when clicked. The `isMenuOpen` boolean state already
existed in the component to drive the menu's open/closed rendering — it just was never wired to
any ARIA attributes on the trigger button. Additionally, the popup menu container had a
`data-testid` prop but no `id` attribute, so `aria-controls` could not point to it.

The fix adds three ARIA attributes to the trigger button and one `id` to the menu panel:

1. `aria-haspopup` — declares the button controls a popup (menu) to AT
2. `aria-expanded={isMenuOpen}` — communicates current open/closed state, updated on every toggle
3. `aria-controls={\`items-option-menu-${index}-${innerIndex}\`}` — links the button to its controlled panel
4. `id={\`items-option-menu-${index}-${innerIndex}\`}` on the menu panel — gives the panel a referenceable DOM id

---

### Bad Code

```tsx
// libs/subscription/manage-optimizations/src/lib/subscription-items-components/subscription-items-option.tsx

// ❌ WCAG 4.1.2 VIOLATION: trigger button has aria-label but no expanded/popup state attributes.
// Screen reader announces: "More options [product name], button" — gives no indication
// that the button controls a popup menu or what its current open/closed state is.

<SomeButton
  aria-label={m(messages, "moreOptionsAriaLabel", { productName })}
  // ❌ Missing: aria-haspopup
  // ❌ Missing: aria-expanded={isMenuOpen}
  // ❌ Missing: aria-controls={"items-option-menu-<index>-<innerIndex>"}
  onLinkName={AV.EDIT_SUBSCRIPTION_ITEMS}
  data-dca-id="B:C06FB2C98E"
  data-dca-intent="__DCA_TBD__"
/>

// The menu panel only has data-testid — no id attribute.
// aria-controls cannot resolve because no matching DOM id exists.
<MenuPanel
  triggerRef={ref}
  data-testid={`items-option-menu-${index}-${innerIndex}`}
  // ❌ Missing: id={`items-option-menu-${index}-${innerIndex}`}
>
  ...
</MenuPanel>
```

---

### Good Code

```tsx
// libs/subscription/manage-optimizations/src/lib/subscription-items-components/subscription-items-option.tsx

// ✅ FIXED: three ARIA state/relationship attributes added to the trigger button.
// Screen reader announces: "More options [product name], collapsed, has popup, button"
// On open: "More options [product name], expanded, has popup, button"

<SomeButton
  aria-label={m(messages, "moreOptionsAriaLabel", { productName })}
  aria-haspopup                                                   // ✅ declares popup role to AT
  aria-expanded={isMenuOpen}                                      // ✅ communicates current open/closed state
  aria-controls={`items-option-menu-${index}-${innerIndex}`}      // ✅ links button to its controlled panel
  onLinkName={AV.EDIT_SUBSCRIPTION_ITEMS}
  data-dca-id="B:C06FB2C98E"
  data-dca-intent="__DCA_TBD__"
/>

// ✅ FIXED: id added to the menu panel so aria-controls resolves correctly.
<MenuPanel
  triggerRef={ref}
  data-testid={`items-option-menu-${index}-${innerIndex}`}
  id={`items-option-menu-${index}-${innerIndex}`}                 // ✅ aria-controls target now resolvable
>
  ...
</MenuPanel>
```

---

### Why This Fix Works

The `aria-expanded` attribute is the standard ARIA mechanism for announcing the open/closed state
of a disclosure control. Without it, screen reader users hear only the button's label and role —
they receive no signal that the button controls a menu, and cannot determine whether the menu is
currently visible. Adding `aria-haspopup` tells AT that activating this button will open a popup
region; `aria-expanded={isMenuOpen}` keeps the announced state in sync with the actual DOM state.
The `aria-controls` + `id` pairing creates a programmatic relationship so AT can navigate directly
from the trigger to the controlled panel, satisfying the full WCAG 4.1.2 Name/Role/Value contract
for disclosure buttons.

**Key architectural rule for `SubscriptionItemsOption`:** Any trigger element that controls a
conditionally-rendered panel (menu, accordion, popover) MUST wire all three attributes together:
`aria-haspopup`, `aria-expanded={stateVar}`, and `aria-controls={panelId}`. The controlled panel
MUST have a matching `id`. Using only `data-testid` on the panel does not satisfy `aria-controls`.

---

### Human Review Checklist

- [ ] Screen reader test (NVDA+Chrome, VoiceOver+Safari): focus the "more options" button for a
  subscription item — confirm AT announces the button label AND "collapsed" / "expanded" state.
- [ ] Keyboard test: Tab to the button, press Enter — confirm menu opens; press Escape — confirm
  menu closes and focus returns to the trigger; confirm `aria-expanded` toggles with each action.
- [ ] Verify `isMenuOpen` is the correct state variable — confirm it is set to `true` when the
  menu panel is rendered open and `false` when hidden.
- [ ] Confirm the `id` template string `items-option-menu-${index}-${innerIndex}` is unique per
  item instance (no duplicate ids on the page when multiple subscription items are rendered).
- [ ] Verify `aria-haspopup` value — if the popup has a specific role (e.g., `menu`), prefer
  `aria-haspopup="menu"` over bare `aria-haspopup` (which defaults to `true` = generic popup).
- [ ] Check whether there are other trigger buttons in this component tree with the same pattern
  (menu trigger without `aria-expanded`) that were missed by this PR.

---

