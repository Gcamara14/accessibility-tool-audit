# LD LinkButton — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/link-button/guidelines/LinkButtonGuidelines.tsx`
**Import:** `import { LinkButton } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | ReactNode | YES | — | Visible label; also the accessible name |
| `color` | string | no | `"default"` | `"default"` \| `"subtle"` \| `"white"` — use `"white"` on dark backgrounds |
| `disabled` | boolean | no | `false` | |
| `href` | string | no | — | When provided, renders as `<a>` |
| `isFullWidth` | boolean | no | `false` | |
| `leading` | ReactNode | no | — | Icon before label |
| `size` | string | no | `"small"` | `"small"` \| `"medium"` \| `"large"` |
| `trailing` | ReactNode | no | — | Icon after label |

## Usage Examples

```tsx
// Default (button, in-page action)
<LinkButton onClick={openModal}>View details</LinkButton>

// Colors
<LinkButton color="default">Default</LinkButton>
<LinkButton color="subtle">Subtle</LinkButton>
<LinkButton color="white">White (dark backgrounds)</LinkButton>

// With icon
<LinkButton leading={<Icon.ArrowLeft />} onClick={handleBack}>Go back</LinkButton>

// As link (when provided with href, renders as <a>)
<LinkButton href="/profile">View profile</LinkButton>

// In TextField trailing slot (common pattern)
<TextField
  label="Password"
  trailing={
    <LinkButton UNSAFE_style={{marginInline: "1rem"}}>Hide</LinkButton>
  }
/>
```

## A11Y Notes

- `LinkButton` renders as `<button>` (role="button") unless `href` is provided.
- Looks like a link visually, IS a button semantically — correct for in-page actions.
- Do NOT use `LinkButton` for navigation; use `Link` instead.
- `children` must be descriptive — avoid "here", "more", "click".

## ⚠️ WCAG Failure Patterns

### ❌ Using LinkButton for navigation (role mismatch)
```tsx
// BAD — LinkButton is role="button"; navigation should be role="link"
<LinkButton href="/products">Browse products</LinkButton>

// GOOD — use Link for navigation
<Link href="/products">Browse products</Link>
```

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.1 Keyboard | A | Native `<button>` — Enter and Space activate. |
| 4.1.2 Name, Role, Value | A | `children` provides name; role="button" implicit. |
