# Catalyst Template: State: State Information Not Announced (Generic State)

**Template ID:** `WA11Y-WEB-4.1.2-007`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem
An element's state information (e.g., active/inactive) is not conveyed to screen readers, impacting accessibility.

**Expected Result:** State changes should be programmatically available to assistive technologies.
**Actual Result:** State information is not announced, leaving users unaware of the element's current state.

---

## ✅ The Fix Patterns

> **Recommendation:** If available, use a standard HTML5 component. However if a custom component needs to be built from scratch, use ARIA attributes like `aria-pressed`, `aria-checked`, or `aria-expanded` to convey state information.

### Standard Implementation
```html
Use a native HTML element that already convey state like checkboxes, disabled, radio, etc... However, if needed use aria-expanded, aria-selected, aria-pressed, etc...
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.


# Ingestion: CEPG-337628 — WA11Y-WEB-4.1.2-007 Variation 1

## Metadata
- **WCAG Criterion:** 4.1.2 Name, Role, Value — Sub-criterion: State Information Not Announced (Generic State)
- **Jira:** CEPG-337628
- **PR:** #164835
- **Commit:** 0841d9aa0775
- **Author:** Tianshu Guan (t0g0513)
- **Date:** 2025-10-22

---

## Component / File Context

**File:** `libs/auto-care-center/components/src/lib/auto-workflow/auto-workflow-list.tsx`

The `AutoWorkflowList` component renders a list of selectable vehicle/service items in the Auto Care Center workflow. Each item is a native `<button>` element. Items can be in one of three visual states:
- **Selected** — blue border (`b--blue bw1`)
- **Disabled** — light gray border + 60% opacity (`b--lighter-gray bw1`, `o-60`) when `item.isSelectable === false`
- **Default** — standard gray border

The `isDisabled` flag (`item.isSelectable === false`) conditionally suppressed the `onMouseDown` and `onKeyDown` callbacks to prevent interaction, and applied visual styling via Tachyons classes. However, the disabled state was **never communicated to assistive technologies** — no ARIA attribute was set, so screen readers announced the button as fully interactive regardless of its actual state.

---

## Bad Pattern (❌)

```tsx
// WCAG 4.1.2 VIOLATION: disabled state is only visual — AT cannot detect it
const isDisabled = item.isSelectable === false;

return (
  <button
    className={classNames(
      "w-100 bg-transparent pa3 pr3 br3 b--solid pointer",
      isSelected
        ? "b--blue bw1"
        : isDisabled
          ? "b--lighter-gray bw1"   // visual-only disabled cue
          : "b--light-gray ba"
    )}
    onMouseDown={() => {
      if (!isDisabled) {            // interaction blocked silently
        onClickCallback(item);
      }
    }}
    onKeyDown={(event) => {
      if (event.key === "Enter" && !isDisabled) {   // keyboard blocked silently
        onClickCallback(item);
      }
    }}
    data-dca-id="B:65357915EA"
    data-dca-intent="__DCA_TBD__"
    // ❌ No aria-disabled — screen reader announces "button" with no state
  >
    ...
  </button>
);
```

**Why it fails:** Visual cues (opacity, border color) communicate the disabled state to sighted users, but provide zero information to screen reader users. AT announces the button as interactive with no indication it is unavailable.

---

## Good Pattern (✅)

```tsx
// FIXED: aria-disabled={isDisabled} programmatically exposes the disabled state
const isDisabled = item.isSelectable === false;

return (
  <button
    className={classNames(
      "w-100 bg-transparent pa3 pr3 br3 b--solid pointer",
      isSelected
        ? "b--blue bw1"
        : isDisabled
          ? "b--lighter-gray bw1"
          : "b--light-gray ba"
    )}
    onMouseDown={() => {
      if (!isDisabled) {
        onClickCallback(item);
      }
    }}
    onKeyDown={(event) => {
      if (event.key === "Enter" && !isDisabled) {
        onClickCallback(item);
      }
    }}
    data-dca-id="B:65357915EA"
    data-dca-intent="__DCA_TBD__"
    aria-disabled={isDisabled}    // ✅ AT announces "dimmed" / "unavailable" state
  >
    ...
  </button>
);
```

---

## Why It Works

`aria-disabled={true}` exposes the disabled state in the accessibility tree so screen readers announce it (e.g., "button, dimmed" in VoiceOver; "button unavailable" in NVDA), ensuring parity between the visual experience and the AT experience.

Unlike the native HTML `disabled` attribute, `aria-disabled` intentionally preserves focusability — keyboard users can still tab to the button and hear its label and state, which is the correct UX pattern when items are temporarily unavailable but still discoverable (e.g., a vehicle that cannot be selected because a prerequisite step is incomplete).

---

## Key Decision: `aria-disabled` vs `disabled`

| Attribute | Focusable | AT announces state | Use when |
|---|---|---|---|
| `disabled` (HTML) | No — removed from tab order | Yes | Item should be completely unreachable |
| `aria-disabled={true}` | Yes — stays in tab order | Yes | Item is temporarily unavailable but should remain discoverable |

In this component, `aria-disabled` is the correct choice because the workflow item still communicates context (vehicle title, right title, icon) that helps users understand why it is unavailable.

---

## Ingested Variations (Self-Documented)

### Variation 1: `aria-disabled` on native `<button>` for workflow item list (CEPG-337628 · 2025-10-22)
**Context:** `libs/auto-care-center/components/src/lib/auto-workflow/auto-workflow-list.tsx` — Auto Care Center vehicle/service selection workflow list. Each list item is a native `<button>`. Items are disabled via `item.isSelectable === false`, which was enforced only visually (Tachyons opacity + border color) and via JS interaction guards.

**Fix:** Added `aria-disabled={isDisabled}` to the `<button>` element. `aria-disabled` (not `disabled`) is used deliberately to keep the item focusable — keyboard users can still reach the button, hear its name and state, and understand the workflow context.

**❌ Bad Code:**
```tsx
<button
  className={classNames("w-100 bg-transparent pa3 ...", isDisabled ? "b--lighter-gray bw1" : "...")}
  onMouseDown={() => { if (!isDisabled) { onClickCallback(item); } }}
  onKeyDown={(event) => { if (event.key === "Enter" && !isDisabled) { onClickCallback(item); } }}
  data-dca-id="B:65357915EA"
  data-dca-intent="__DCA_TBD__"
  {/* ❌ no aria-disabled — state invisible to AT */}
>
```

**✅ Good Code:**
```tsx
<button
  className={classNames("w-100 bg-transparent pa3 ...", isDisabled ? "b--lighter-gray bw1" : "...")}
  onMouseDown={() => { if (!isDisabled) { onClickCallback(item); } }}
  onKeyDown={(event) => { if (event.key === "Enter" && !isDisabled) { onClickCallback(item); } }}
  data-dca-id="B:65357915EA"
  data-dca-intent="__DCA_TBD__"
  aria-disabled={isDisabled}  {/* ✅ state now announced by AT */}
>
```

**Key Rule:** Whenever a `<button>` has conditional interaction logic driven by a boolean flag (`isDisabled`, `isSelectable`, `isAvailable`, etc.) that only enforces the restriction in JS event handlers and visual CSS, that boolean **must also** be surfaced via `aria-disabled={flag}`. Visual-only disabled patterns are a 4.1.2 violation.

---

