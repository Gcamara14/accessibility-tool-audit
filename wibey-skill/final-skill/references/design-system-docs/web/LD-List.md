# LD List — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/list/guidelines/ListGuidelines.tsx`
**Import:** `import { List, ListItem } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

### List

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | `ListItem` components. |

### ListItem (used within List, from sandbox usage)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | No | — | Body content of the list item. |
| `leading` | `ReactNode` | No | — | Icon or element before the content (e.g., `<Icon.Note size="medium" />`). |
| `title` | `string` | No | — | Title/primary text of the list item. |
| `trailing` | `ReactNode` | No | — | Content after the main content (e.g., a `LinkButton`). |

> Note: The sandbox `props` object for `List` defines only `children`. Props `ordered`, `onClick`, and `href` on `ListItem` are not verified sandbox props. The `ListItem` props above are derived from sandbox usage examples, not the `props` configuration object.

## Usage Examples

```tsx
import * as Icon from "@livingdesign/icons";
import { LinkButton, List, ListItem } from "@livingdesign/react";

<List>
  <ListItem
    leading={<Icon.Note size="medium" />}
    title="James T. Kirk"
    trailing={<LinkButton>Vote for Jim</LinkButton>}
  >
    The Original Series
  </ListItem>
  <ListItem
    leading={<Icon.History size="medium" />}
    title="Jean-Luc Picard"
    trailing={<LinkButton>Vote for Jean-Luc</LinkButton>}
  >
    The Next Generation
  </ListItem>
  <ListItem
    leading={<Icon.Gear size="medium" />}
    title="Benjamin Sisko"
    trailing={<LinkButton>Vote for Ben</LinkButton>}
  >
    Deep Space Nine
  </ListItem>
</List>
```

### Leading Icon Alignment

```tsx
// Center-align icons when text is short (single line)
<ListItem leading={<Icon.Car size="small" />} UNSAFE_style={{ alignItems: "center" }}>
  Car
</ListItem>

// Top-align icons when text is longer (wraps to multiple lines)
<ListItem leading={<Icon.Car size="small" />} UNSAFE_style={{ alignItems: "first baseline" }}>
  Add a vehicle to track your service and easily shop for parts.
</ListItem>
```

## A11Y Notes

- `List` renders semantic `<ul>` + `<li>` structure so AT announces the total item count and user's position (e.g., "Item 2 of 5").
- Do not suppress list semantics with `role="none"` unless the list is used purely for visual layout with no semantic grouping meaning. Removing list semantics breaks count/position announcement for AT users.
- Leading icons that are decorative must have `aria-hidden="true"` so AT does not announce them as unlabeled images (WCAG 1.1.1).
- When `trailing` contains an interactive element (e.g., `LinkButton`), ensure it has a descriptive accessible name that identifies the specific item — avoid repeating generic text like "More info" for every row.
- If list items are interactive, each must have a unique, descriptive accessible name so AT users can distinguish between items.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.1.1 Non-text Content | A | Decorative leading icons should have `aria-hidden="true"`. |
| 1.3.1 Info and Relationships | A | `<ul>`/`<li>` semantics communicate list structure, count, and position to AT. |
| 4.1.2 Name, Role, Value | A | Interactive elements within list items must have accessible names. |
