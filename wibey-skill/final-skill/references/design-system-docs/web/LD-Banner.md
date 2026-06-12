# LD Banner — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/banner/guidelines/BannerGuidelines.tsx`
**Import:** `import { Banner } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | ReactNode | YES | — | Banner message content |
| `onClose` | Function | YES | — | Called when close button is clicked |
| `variant` | string | no | `"info"` | `"error"` \| `"info"` \| `"success"` \| `"warning"` |

## Usage Examples

```tsx
// Info banner
<Banner onClose={() => setVisible(false)} variant="info">
  Photon torpedo inventory is low.
</Banner>

// Warning
<Banner onClose={() => setVisible(false)} variant="warning">
  Shuttle bay door 3 damaged.
</Banner>

// Error
<Banner onClose={() => setVisible(false)} variant="error">
  Communicator connection lost.
</Banner>

// Success
<Banner onClose={() => setVisible(false)} variant="success">
  Starbase 4077 shields repaired.
</Banner>
```

## A11Y Notes

- `onClose` is required — the Banner always has a close button. Never pass a no-op if the banner is dismissible.
- Banner is a page-level notification component. For inline contextual messages use `Alert` instead.
- For banners that appear after async operations, the component must render into a pre-existing `aria-live` region. See template `WA11Y-WEB-4.1.3-001`.
- `variant` affects icon and color only — not the accessible role. Include urgency in the message text.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.4.1 Use of Color | A | Variant uses icon + color, not color alone. |
| 4.1.2 Name, Role, Value | A | Close button has accessible label. |
