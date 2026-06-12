# LD Tag — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/tag/guidelines/TagGuidelines.tsx`
**Import:** `import { Tag } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | Visible text content of the tag. Also serves as the accessible name. |
| `color` | `"blue" \| "brand" \| "cyan" \| "edited" \| "gray" \| "green" \| "info" \| "negative" \| "orange" \| "pink" \| "positive" \| "purple" \| "red" \| "spark" \| "teal" \| "warning" \| "yellow"` | No | — | Color theme of the tag. |
| `leading` | `ReactNode` | No | — | Icon rendered before the label (e.g., `<Icon.ThumbUp />`). Should have `aria-hidden="true"` if decorative. |
| `variant` | `"primary" \| "secondary" \| "tertiary"` | No | `"secondary"` | Visual style variant. |

> Note: Props `label`, `size`, and `onClose` do not appear in the sandbox. The tag text is passed as `children`, not a `label` prop. The `variant` options are `primary`, `secondary`, `tertiary` — not `neutral`, `info`, `positive`, `negative`, `warning`. The `color` prop carries semantic color meaning.

## Usage Examples

```tsx
import * as Icon from "@livingdesign/icons";
import { Tag } from "@livingdesign/react";

// Basic tag
<Tag color="blue" variant="secondary">
  Impulse engines
</Tag>

// Primary variant — high visual emphasis
<Tag color="blue" variant="primary">
  Critical alert
</Tag>

// Tertiary variant — low visual emphasis
<Tag color="blue" variant="tertiary">
  In progress
</Tag>

// Tag with leading icon
<Tag color="green" variant="secondary" leading={<Icon.ThumbUp />}>
  Approved
</Tag>

// Semantic color usage
<Tag color="negative" variant="primary">Out of stock</Tag>
<Tag color="positive" variant="secondary">In stock</Tag>
<Tag color="warning" variant="tertiary">Low stock</Tag>
```

## A11Y Notes

- Tag text is passed as `children` — this is the accessible name. Always include meaningful text; do not rely on color alone to convey status (WCAG 1.4.1).
- The `color` prop changes the visual color theme. Color alone does not convey meaning to AT — the `children` text must carry the meaning (e.g., "Out of stock", not just a red tag with no label).
- Leading icons in the `leading` prop should have `aria-hidden="true"` so AT does not announce them as separate unlabeled images. The `children` text provides the accessible meaning.
- Static (non-interactive) tags render as non-interactive elements — keyboard users do not tab to them, which is correct for display-only labels.
- The `variant` values (`primary`, `secondary`, `tertiary`) control visual weight/emphasis, not semantic meaning. Do not use variant as a substitute for a text label.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.1.1 Non-text Content | A | Leading icons should have `aria-hidden="true"`; `children` text carries the meaning. |
| 1.4.1 Use of Color | A | `children` text ensures meaning is conveyed via text, not color alone. A colored tag must always include a readable label. |
| 4.1.2 Name, Role, Value | A | Static tags are non-interactive; their text content is the accessible name. |
