# LD Card — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/card/guidelines/CardGuidelines.tsx`
**Import:** `import { Card, CardActions, CardContent, CardHeader, CardMedia } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

### `Card`
| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | ReactNode | YES | — | Typically `CardMedia`, `CardHeader`, `CardContent`, `CardActions` |
| `size` | string | no | `"small"` | `"small"` \| `"large"` |

### `CardHeader`
| Prop | Type | Notes |
|------|------|-------|
| `title` | string | Header title text |
| `leadingIcon` | ReactNode | Icon before title (e.g. `<Icon.InfoCircle size="medium" />`) |
| `trailing` | ReactNode | Content after title (e.g. `<LinkButton>`) |

### `CardContent` / `CardActions` / `CardMedia`
- `CardContent`: body content wrapper
- `CardActions`: footer actions wrapper (e.g. `<ButtonGroup>`)
- `CardMedia`: media wrapper (e.g. `<img>`)

## Usage Examples

```tsx
import {
  Button, ButtonGroup, Card, CardActions, CardContent,
  CardHeader, CardMedia, LinkButton
} from "@livingdesign/react";

// Full card with all sub-components
<Card size="small">
  <CardMedia>
    <img
      alt="A placeholder image"
      src="/celebration.svg"
      width="100%"
      style={{ display: "block", maxHeight: 340, objectFit: "cover" }}
    />
  </CardMedia>
  <CardHeader
    leadingIcon={<Icon.InfoCircle size="medium" />}
    title="Damage report"
    trailing={<LinkButton>Run diagnostics</LinkButton>}
  />
  <CardContent>
    Unidentified vessel travelling at sub warp speed, bearing 235.7.
  </CardContent>
  <CardActions>
    <ButtonGroup>
      <Button variant="secondary">Hailing frequencies</Button>
      <Button variant="primary">Engage</Button>
    </ButtonGroup>
  </CardActions>
</Card>

// Simple card
<Card size="large">
  <CardContent>Content here</CardContent>
</Card>
```

## A11Y Notes

- `CardMedia img` must have a meaningful `alt` attribute (or `alt=""` if decorative).
- If a card has multiple interactive elements (link + button), each needs a unique accessible name.
- Do not nest interactive elements inside a whole-card `<a>` or `<button>` wrapper.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.1.1 Non-text Content | A | Images in `CardMedia` must have descriptive `alt`. |
| 2.4.4 Link Purpose | A | Card CTAs must have unique, descriptive accessible names. |
| 4.1.2 Name, Role, Value | A | All interactive elements within card have accessible names. |
