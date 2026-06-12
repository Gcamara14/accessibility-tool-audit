# LD ProgressIndicator — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/progress-indicator/guidelines/ProgressIndicatorGuidelines.tsx`
**Import:** `import { ProgressIndicator } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `label` | string | YES | — | Visible label describing what's being tracked |
| `valueLabel` | string | YES | — | Human-readable progress text (e.g., "15 of 20 episodes", "$9 remaining") |
| `value` | number | no | — | Numeric progress 0–100 |
| `variant` | string | no | `"info"` | `"error"` \| `"info"` \| `"success"` \| `"warning"` |

> **⚠️ CRITICAL:** `label` and `valueLabel` are BOTH REQUIRED. Props like `min`, `max`, `aria-label`, `aria-labelledby`, `showValue` do NOT exist in this component.

## Usage Examples

```tsx
// Basic progress — label and valueLabel REQUIRED
<ProgressIndicator
  label="Deep Space Nine: Season 1"
  value={75}
  valueLabel="15 of 20 episodes"
/>

// E-commerce free shipping progress
<ProgressIndicator
  label="Add $35 of items to your cart for free shipping"
  value={75}
  valueLabel="$9 remaining"
  variant="info"
/>

// Success (100% complete)
<ProgressIndicator
  label="Account setup is complete"
  value={100}
  valueLabel="10 of 10"
  variant="success"
/>

// Warning
<ProgressIndicator
  label="Your membership will expire soon"
  value={90}
  valueLabel="3 days left"
  variant="warning"
/>

// Error (blocked)
<ProgressIndicator
  label="Trailer loading blocked by conveyor downtime"
  value={50}
  valueLabel="50% loaded"
  variant="error"
/>
```

## A11Y Notes

- `label` describes what is being progressed — this IS the accessible name for AT.
- `valueLabel` communicates current progress in human-readable terms — do not use a raw number.
- `variant` follows the same options as Alert/Banner: "error"|"info"|"success"|"warning".
- The component does NOT accept raw `aria-*` props — `label` and `valueLabel` ARE the a11y mechanism.
- There is also a `label` slot that can accept interactive children (e.g., a `ProgressIndicator.label` render prop) — but placing focusable elements inside it can trap keyboard focus. See template `WA11Y-WEB-2.1.1-004`.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.4.1 Use of Color | A | Variant uses icon + color, not color alone. |
| 4.1.2 Name, Role, Value | A | `label` provides name; `valueLabel` provides current state for AT. |
