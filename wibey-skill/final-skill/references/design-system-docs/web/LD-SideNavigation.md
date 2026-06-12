# LD SideNavigation — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/side-navigation/guidelines/SideNavigationGuidelines.tsx`
**Import:** `import { SideNavigation, SideNavigationItem } from "@livingdesign/react"`

---

## Overview

The LD `SideNavigation` renders a vertical navigation menu, typically in a sidebar. It uses `<nav>` semantics (landmark role `navigation`) and marks the currently active page item with `isCurrent` (which sets `aria-current="page"`). Each navigation item renders as an anchor link (`href`). The item text is passed as `children` (not a `label` prop). Icons are passed via the `leading` prop (note: `leading`, NOT `leadingIcon`).

The nav landmark should have an accessible name (via `aria-label` or `aria-labelledby`) when multiple `<nav>` elements exist on the page.

---

## Props (SOURCE-VERIFIED)

### `SideNavigation`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | `SideNavigationItem` components that make up the nav links |
| `aria-label` | `string` | No | — | Accessible name for the `<nav>` landmark. Required when multiple nav regions exist on the page (e.g., "Main navigation") |
| `aria-labelledby` | `string` | No | — | Alternative to `aria-label` — references an existing heading by `id` |

### `SideNavigationItem`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | Visible text label for the nav link (rendered as text content, not a `label` prop) |
| `href` | `string` | Yes | — | Navigation destination URL |
| `isCurrent` | `boolean` | No | — | Marks this item as the current page. Sets `aria-current="page"` on the link. (NOT `isActive`) |
| `leading` | `ReactNode` | No | — | Icon rendered before the label text. Should have `aria-hidden="true"`. |

---

## Usage Examples

```tsx
<SideNavigation aria-label="Main navigation">
  <SideNavigationItem
    href="/components/side-navigation/"
    leading={<Icon.Location />}
    isCurrent
  >
    Transporter room
  </SideNavigationItem>
  <SideNavigationItem
    href="/components/side-navigation/"
    leading={<Icon.Keyboard />}
  >
    Bridge
  </SideNavigationItem>
  <SideNavigationItem
    href="/components/side-navigation/"
    leading={<Icon.Wrench />}
  >
    Engineering
  </SideNavigationItem>
</SideNavigation>
```

---

## A11Y Notes

- `isCurrent` is the correct prop name for marking the active page (NOT `isActive`). It sets `aria-current="page"` on the link. Only one item should have `isCurrent` at a time — it must reflect the actual current page URL.
- The link text is passed as `children` to `SideNavigationItem` — there is no `label` prop.
- Icons use the `leading` prop (NOT `leadingIcon`). Leading icons should have `aria-hidden="true"` to prevent double-announcement alongside the link text.
- Add `aria-label` to `SideNavigation` whenever there are multiple `<nav>` landmarks on the page (e.g., a top nav and a side nav). Without distinct labels, AT announces both as "navigation" with no differentiation.

> `aria-current="page"` must reflect the actual current page — not just the selected/focused item. Applying it to multiple items or the wrong item is a WCAG 2.4.8 failure.

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | `<nav>` landmark and list semantics are applied automatically. |
| 2.4.1 Bypass Blocks | A | `<nav>` landmark allows AT users to jump directly to navigation via landmark navigation. |
| 2.4.8 Location | AAA | `isCurrent` sets `aria-current="page"` communicating the current page within the navigation. |
| 4.1.2 Name, Role, Value | A | Nav landmark has accessible name; each link has a descriptive label from `children`; active state is programmatic via `aria-current`. |
