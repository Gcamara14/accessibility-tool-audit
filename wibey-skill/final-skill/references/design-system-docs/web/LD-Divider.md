# LD Divider — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/divider/guidelines/DividerGuidelines.tsx`
**Import:** `import { Divider } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `title` | `string` | No | — | Optional text label displayed on the divider (e.g., "or", "Title"). |

> Note: Props `orientation`, `decorative`, and `label` do not appear in the sandbox. The only prop in the verified sandbox is `title`.

## Usage Examples

```tsx
import { Divider } from "@livingdesign/react";

// Plain divider
<Divider />

// Divider with a title label
<Divider title="Title" />

// Common use: "or" separator between login options
<Divider title="or" />
```

## A11Y Notes

- The `Divider` renders a visual separator between content sections. When used as a thematic break, it communicates structure to AT users.
- When `title` is provided (e.g., "or"), AT reads the label as part of the divider, ensuring the text is not conveyed visually only.
- Use `Divider` for meaningful content separation. For purely decorative spacing, consider whether the divider adds structural meaning that AT should announce.
- The `title` text ensures that content like "or" on a login form is not conveyed through visual position alone (WCAG 1.3.1).

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | The `title` prop ensures any text on the divider (e.g., "or") is part of the accessible content, not conveyed through visual placement alone. |
