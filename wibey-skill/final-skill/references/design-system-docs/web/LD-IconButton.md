# LD IconButton — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/icon-button/guidelines/IconButtonGuidelines.tsx`
**Import:** `import { IconButton } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `a11yLabel` | string | YES | — | Accessible name announced by screen readers (`aria-label` on the button) |
| `children` | ReactNode | YES | — | Icon element (e.g. `<Icon.Trash />`) |
| `disabled` | boolean | no | `false` | |
| `href` | string | no | — | When provided, renders as `<a>` |
| `color` | string | no | `"default"` | `"default"` \| `"white"` — use `"white"` on dark backgrounds |
| `size` | string | no | `"small"` | `"xsmall"` \| `"small"` \| `"medium"` \| `"large"` |
| `variant` | string | no | `"round"` | `"round"` \| `"full"` |

## Usage Examples

```tsx
// Basic icon button — a11yLabel is REQUIRED
<IconButton a11yLabel="Delete item" onClick={handleDelete}>
  <Icon.Trash />
</IconButton>

// With size and color
<IconButton a11yLabel="Delete" size="medium" color="default" variant="round">
  <Icon.Trash />
</IconButton>

// White color for dark backgrounds
<IconButton a11yLabel="Close" size="small" color="white" variant="round">
  <Icon.Close />
</IconButton>

// Full variant (square, use in dense spaces / near container edges)
<IconButton a11yLabel="More options" size="medium" color="default" variant="full">
  <Icon.Overflow />
</IconButton>

// As link
<IconButton a11yLabel="Go to cart" href="/cart">
  <Icon.Cart />
</IconButton>
```

## A11Y Notes

- **`a11yLabel` is the ONLY supported accessible name prop.** Do NOT pass `aria-label` directly — use `a11yLabel`. (The old inferred prop name `accessibleLabel` does NOT exist.)
- **`a11yLabel` is REQUIRED** — omitting it leaves the button with no accessible name (WCAG 4.1.2 failure).
- `a11yLabel` must describe the **action**, not the icon: "Delete item" ✓, "Trash icon" ✗.
- For icon-only actions, always prefer `IconButton` over `Button` (which has no `a11yLabel` support).
- When `href` is provided, `a11yLabel` must describe the navigation destination.

## ⚠️ WCAG Failure Patterns

### ❌ Wrong prop name (accessibleLabel does NOT exist)
```tsx
// BAD — accessibleLabel is NOT a valid prop; button silently has no accessible name
<IconButton accessibleLabel="Close" onClick={onClose}>
  <Icon.Close />
</IconButton>

// GOOD — correct prop is a11yLabel
<IconButton a11yLabel="Close" onClick={onClose}>
  <Icon.Close />
</IconButton>
```

### ❌ Missing a11yLabel entirely
```tsx
// BAD — WCAG 4.1.2 failure
<IconButton onClick={handleSearch}>
  <Icon.Search />
</IconButton>

// GOOD
<IconButton a11yLabel="Search products" onClick={handleSearch}>
  <Icon.Search />
</IconButton>
```

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.1 Keyboard | A | Button is natively keyboard operable. |
| 4.1.2 Name, Role, Value | A | `a11yLabel` provides the accessible name. |
