# LD TabNavigation — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/tab-navigation/guidelines/TabNavigationGuidelines.tsx`
**Import:** `import { TabNavigation, TabNavigationItem } from "@livingdesign/react"`

---

## Overview

The LD `TabNavigation` implements link-based tab navigation — each tab is an anchor link (`href`), not a JS-controlled panel switcher. It renders a navigation bar where the current page/view is marked with `isCurrent`. The sub-component is `TabNavigationItem` (NOT `Tab`). Items support a leading icon via `leadingIcon`. The active item uses `isCurrent` (NOT `isActive`, NOT `selected`).

---

## Props (SOURCE-VERIFIED)

### `TabNavigation`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | `TabNavigationItem` components |

### `TabNavigationItem`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | Visible text label for the tab (rendered as text content, not a `label` prop) |
| `href` | `string` | Yes | — | Navigation destination URL |
| `isCurrent` | `boolean` | No | — | Marks this item as the active/current tab. Sets `aria-current="page"` on the link. |
| `leadingIcon` | `ReactNode` | No | — | Icon rendered before the label text (note: `leadingIcon`, NOT `leading`) |

---

## Usage Examples

```tsx
<TabNavigation>
  <TabNavigationItem
    href="/components/tab-navigation/"
    isCurrent
    leadingIcon={<Icon.Wrench />}
  >
    Engineering
  </TabNavigationItem>
  <TabNavigationItem
    href="/components/tab-navigation/"
    leadingIcon={<Icon.Home />}
  >
    Quarters
  </TabNavigationItem>
  <TabNavigationItem
    href="/components/tab-navigation/react/"
    leadingIcon={<Icon.Lock />}
  >
    Brig
  </TabNavigationItem>
</TabNavigation>
```

---

## A11Y Notes

- `TabNavigation` is a **link-based navigation pattern** (not the ARIA tab panel pattern with `role="tablist"` / `role="tab"`). Each item is an anchor link. The current page/section is marked with `isCurrent` which sets `aria-current="page"`.
- `leadingIcon` renders the icon before the label text. Leading icons should have `aria-hidden="true"` to prevent double-announcement with the item text.
- The label text is passed as `children` to `TabNavigationItem` — there is no separate `label` prop.
- Only one `TabNavigationItem` should have `isCurrent` set at a time — it must reflect the actual current page.

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.1 Keyboard | A | Tab navigation items are standard anchor links, keyboard operable. |
| 2.4.4 Link Purpose | A | Each `TabNavigationItem` text content provides the accessible name for the link. |
| 2.4.8 Location | AAA | `isCurrent` sets `aria-current="page"` communicating the user's current location. |
| 4.1.2 Name, Role, Value | A | `aria-current="page"` on the active item; link semantics via `href`. |
