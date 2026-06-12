# LD SpotIcon — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/spot-icon/guidelines/SpotIconGuidelines.tsx`
**Import:** `import { SpotIcon } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | The icon element to render inside the spot container (e.g., `<Icon.Car />`). |
| `color` | `"brand" \| "neutral"` | No | `"brand"` | Background color of the spot container. `"brand"` for white/light surfaces; `"neutral"` for non-white surfaces (e.g., inside a Nudge). |
| `size` | `"large" \| "small"` | No | `"small"` | Size of the spot container. |

## Usage Examples

```tsx
import * as Icon from "@livingdesign/icons";
import { SpotIcon } from "@livingdesign/react";

// Brand color (default) — for use on white/light backgrounds
<SpotIcon color="brand">
  <Icon.Check />
</SpotIcon>

// Neutral color — for use on non-white surfaces (e.g., inside Nudge)
<SpotIcon color="neutral">
  <Icon.Check />
</SpotIcon>

// Small size (default)
<SpotIcon size="small">
  <Icon.Check />
</SpotIcon>

// Large size
<SpotIcon size="large">
  <Icon.Check />
</SpotIcon>

// Decorative use (adjacent text conveys the meaning)
<SpotIcon color="brand" aria-hidden="true">
  <Icon.Truck />
</SpotIcon>
<p>Free shipping on orders over $35</p>

// Informative use (icon conveys meaning not in adjacent text)
<SpotIcon color="brand" aria-label="Free shipping" role="img">
  <Icon.Truck />
</SpotIcon>
```

## A11Y Notes

SpotIcons are typically decorative — they visually reinforce nearby text but do not add unique information on their own.

- When the meaning is fully conveyed by adjacent text: add `aria-hidden="true"` to prevent AT from announcing the icon redundantly.
- When the icon conveys meaning NOT present in adjacent text: add `aria-label="[description]"` and `role="img"` so AT announces the icon's meaning.
- The inner icon element passed as `children` is always decorative within the SpotIcon context — do not add `aria-label` to the icon itself when the SpotIcon already has one.
- `"neutral"` color is designed for use on non-white surfaces or backgrounds (e.g., the `Nudge` component uses it for its leading SpotIcon).

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.1.1 Non-text Content | A | Decorative SpotIcons use `aria-hidden="true"`; informative SpotIcons use `aria-label` + `role="img"`. |
