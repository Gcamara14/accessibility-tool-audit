# LD Rating — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/rating/guidelines/RatingGuidelines.tsx`
**Import:** `import { Rating } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `value` | `number` | No | — | The rating value (e.g., `4.5`, `3`). |
| `size` | `"large" \| "small"` | No | `"small"` | Star size. `"small"` is the default use; `"large"` for increased prominence. |

## Usage Examples

```tsx
// Default (small) size
<Rating value={3} />

// Large size — for increased prominence
<Rating size="large" value={3} />

// Fractional value
<Rating value={4.5} />
```

## A11Y Notes

The `Rating` component displays star icons that convey a numeric value visually. Screen readers must be able to understand the rating without relying on the star icons.

- The component automatically generates an accessible name from the `value` (e.g., "4.5 out of 5 stars") — star icons are treated as decorative (`aria-hidden="true"`) internally.
- When rendering `Rating` near a review count or product name, ensure the surrounding context makes the rating unambiguous to AT users.
- Do not use custom star icon markup without providing an equivalent accessible name — AT will announce raw SVG or nothing.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.1.1 Non-text Content | A | Star icons are decorative (`aria-hidden`); the numeric value is provided via the component's accessible name. |
| 4.1.2 Name, Role, Value | A | The component generates an accessible name automatically from the `value` prop. |
