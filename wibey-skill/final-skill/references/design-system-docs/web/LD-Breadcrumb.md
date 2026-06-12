# LD Breadcrumb — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/breadcrumb/guidelines/BreadcrumbGuidelines.tsx`
**Import:** `import { Breadcrumb, BreadcrumbItem } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

### `Breadcrumb`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | `BreadcrumbItem` components representing each level of the navigation hierarchy. |

### `BreadcrumbItem` (used inside `Breadcrumb`)

The sandbox uses `BreadcrumbItem` with `href` and `isCurrent` props, and text as `children`:

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | — | — | Visible text label for the breadcrumb item. |
| `href` | `string` | — | — | Navigation destination URL for the breadcrumb link. |
| `isCurrent` | `boolean` | — | `false` | Marks this item as the current page. Sets `aria-current="page"` and renders as non-interactive text. |

## Usage Examples

```tsx
<Breadcrumb>
  <BreadcrumbItem href="/components/breadcrumb/">Starfleet</BreadcrumbItem>
  <BreadcrumbItem href="/components/breadcrumb/">Constitution Class Vessel</BreadcrumbItem>
  <BreadcrumbItem href="/components/breadcrumb/" isCurrent>USS Enterprise</BreadcrumbItem>
</Breadcrumb>
```

## A11Y Notes

- `Breadcrumb` renders as a `<nav aria-label="Breadcrumb">` landmark so screen reader users can navigate directly to it and identify it among multiple nav landmarks on the page (WCAG 2.4.1).
- The `isCurrent` prop on the last `BreadcrumbItem` sets `aria-current="page"`, communicating the user's current location in the hierarchy (WCAG 2.4.8).
- Separator characters between items are decorative and should be hidden from assistive technology with `aria-hidden="true"` — LD handles this automatically (WCAG 1.1.1).
- Breadcrumb items are wrapped in an `<ol>` so screen readers communicate the total count and position (e.g., "link 2 of 3") (WCAG 1.3.1).
- The current page item should use `isCurrent` and not be a link — linking to the current page is redundant and confusing for AT users.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.1.1 Non-text Content | A | Decorative separators are `aria-hidden`; they add no meaning for AT users. |
| 1.3.1 Info and Relationships | A | `<ol>` communicates list count/position; `<nav>` landmark is applied. |
| 2.4.1 Bypass Blocks | A | `<nav>` landmark allows AT users to navigate directly to the breadcrumb. |
| 2.4.8 Location | AAA | `aria-current="page"` on the final item communicates current location in the hierarchy. |
| 4.1.2 Name, Role, Value | A | Each link has a descriptive label; current item has `aria-current`; separators are hidden from AT. |
