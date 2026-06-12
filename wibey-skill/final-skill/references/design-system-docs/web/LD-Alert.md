# LD Alert — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/alert/guidelines/AlertGuidelines.tsx`
**Import:** `import { Alert } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | ReactNode | YES | — | Alert message content |
| `variant` | string | no | `"info"` | `"error"` \| `"info"` \| `"success"` \| `"warning"` |
| `actionButtonProps` | Object | no | — | `{ children: "text", href: "/path/", target: "_blank" }` |

## Usage Examples

```tsx
// Error (no action)
<Alert variant="error">Warp drive offline due to coolant failure.</Alert>

// Info with action button
<Alert variant="info" actionButtonProps={{ href: "#", children: "Remind me" }}>
  Ship computer downtime scheduled in 12 hours.
</Alert>

// Warning with action
<Alert variant="warning" actionButtonProps={{ href: "#", children: "View report" }}>
  A member of the away team is missing.
</Alert>

// Success
<Alert variant="success">Ship sensors now online.</Alert>
```

## A11Y Notes

- `children` is the visible text — also the accessible description. Keep it meaningful.
- `variant` sets semantic color and icon. Screen readers do NOT auto-announce the variant — include severity in `children` if context requires it (e.g., "Error: your session expired").
- `actionButtonProps.href` renders a link — ensure link text (children) is descriptive.
- For dynamic alerts that appear after a user action, see template `WA11Y-WEB-4.1.3-001`.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 4.1.2 Name, Role, Value | A | `children` is the accessible content. |
| 4.1.3 Status Messages | AA | Alert used in a live region context for dynamic announcements. |
