# LD Badge — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/badge/guidelines/BadgeGuidelines.tsx`
**Import:** `import { Badge } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | No | — | Content displayed inside the badge (e.g., a number like "42"). When omitted the badge renders as a dot indicator. |
| `color` | `string` | No | — | Visual color of the badge. See valid values below. |

### Valid `color` values

`"blue"` `"brand"` `"brandBold"` `"cyan"` `"gray"` `"green"` `"edited"` `"info"` `"negative"` `"neutral"` `"orange"` `"pink"` `"positive"` `"purple"` `"red"` `"spark"` `"teal"` `"warning"` `"yellow"`

## Usage Examples

```tsx
// Numeric badge
<Badge color="negative">42</Badge>

// Dot indicator (no children)
<Badge color="info" />

// On a host element — host must carry the count in its accessible name
<Badge color="negative">3</Badge>
```

## A11Y Notes

The `Badge` is a visual indicator. The sandbox exposes only `children` (the displayed value) and `color`. There is no built-in `aria-hidden` enforcement documented in the sandbox — teams must ensure the badge's information is also present in the accessible name of the host interactive element.

- When showing a count, include the count in the host element's accessible name (e.g., `aria-label="Cart, 3 items"`).
- When used as a dot indicator (no `children`), the host element's accessible name must communicate the implied status (e.g., "Notifications, unread messages").
- Color alone does not convey meaning (WCAG 1.4.1) — the host element's text/label must also express the state.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.4.1 Use of Color | A | Color is supplemental. The host element's accessible name must also communicate the count or status. |
| 4.1.2 Name, Role, Value | A | Badge content is decorative; count/status must be in the host element's accessible name. |
