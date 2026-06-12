# LD Menu — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/menu/guidelines/MenuGuidelines.tsx`
**Import:** `import { Menu, MenuItem } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

### `Menu`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | ReactNode | YES | — | `<MenuItem>` elements |
| `trigger` | ReactNode | YES | — | The trigger element with a `ref` attached |
| `triggerRef` | Object | YES (hidden) | — | React ref for the trigger element — required for focus return on close |
| `onClose` | Function | YES | — | `() => setIsOpen(false)` |
| `isOpen` | boolean | no | `false` (stateful) | Controls menu visibility |
| `onOpen` | Function | no | — | `() => setIsOpen(true)` |
| `position` | string | no | `"bottomRight"` | `"bottomLeft"` \| `"bottomRight"` \| `"topLeft"` \| `"topRight"` |

> **⚠️ CRITICAL:** The prop is `position` (NOT `placement`). Options are camelCase (`"bottomLeft"`, `"bottomRight"`, `"topLeft"`, `"topRight"`) — NOT `"bottom-start"` etc.

### `MenuItem`

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `children` | ReactNode | YES | Visible label text |
| `leadingIcon` | ReactNode | no | Icon before label (from sandbox example: `<Icon.Globe />`) |
| `onClick` | Function | no | |
| `disabled` | boolean | no | |
| `href` | string | no | Renders as `<a role="menuitem">` |

## Usage Examples

```tsx
import * as React from "react";
import * as Icon from "@livingdesign/icons";
import { IconButton, Menu, MenuItem } from "@livingdesign/react";

const ref = React.createRef();
const [isOpen, setIsOpen] = React.useState(false);

<Menu
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onOpen={() => setIsOpen(true)}
  position="bottomRight"
  trigger={
    <IconButton a11yLabel="More actions" ref={ref}>
      <Icon.More />
    </IconButton>
  }
  triggerRef={ref}
>
  <MenuItem leadingIcon={<Icon.Globe />}>Activate transporter</MenuItem>
  <MenuItem leadingIcon={<Icon.Search />}>Engage tractor beam</MenuItem>
  <MenuItem leadingIcon={<Icon.Phone />}>Open a channel</MenuItem>
</Menu>
```

## A11Y Notes

- `triggerRef` ensures focus returns to the trigger when menu closes (WCAG 2.4.3).
- The trigger (`IconButton`) must use `a11yLabel` (NOT `accessibleLabel`) for its accessible name.
- `aria-haspopup="menu"` and `aria-expanded` are managed automatically by the Menu component.
- `MenuItem.leadingIcon` should have `aria-hidden="true"` on the icon itself (or pass it as decorative).

## ⚠️ WCAG Failure Patterns

### ❌ Wrong position options / prop name
```tsx
// BAD — placement and CSS-style options do NOT exist
<Menu placement="bottom-start" ...>

// GOOD — correct prop and camelCase options
<Menu position="bottomLeft" ...>
<Menu position="bottomRight" ...>
```

### ❌ Using accessibleLabel on trigger IconButton
```tsx
// BAD — accessibleLabel is not a real prop
<IconButton accessibleLabel="More actions" ref={ref}>

// GOOD — correct prop is a11yLabel
<IconButton a11yLabel="More actions" ref={ref}>
```

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.1 Keyboard | A | Arrow keys navigate items; Escape closes. |
| 2.4.3 Focus Order | A | Focus returns to trigger on close via `triggerRef`. |
| 4.1.2 Name, Role, Value | A | `role="menu"` + `aria-expanded` + `aria-haspopup` managed automatically. |
