# LD Link — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/link/guidelines/LinkGuidelines.tsx`
**Import:** `import { Link } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | ReactNode | YES | — | Visible link text; also the accessible name |
| `href` | string | YES | — | Navigation destination |
| `color` | string | no | `"default"` | `"default"` \| `"subtle"` \| `"white"` — use `"white"` on dark backgrounds |

> Note: Additional props like `target`, `rel`, `disabled` may be passed as standard HTML attributes but are not shown in the official sandbox.

## Usage Examples

```tsx
// Basic link
<Link href="/components/link/">The Holodeck</Link>

// Colors
<Link href="/about" color="default">Default</Link>
<Link href="/about" color="subtle">Subtle</Link>
<Link href="/about" color="white">White (dark backgrounds)</Link>

// With supplemental "opens in new tab" for screen readers
import { VisuallyHidden } from "@livingdesign/react";
<Link href="https://external.com" target="_blank">
  External site <VisuallyHidden>(opens in new tab)</VisuallyHidden>
</Link>
```

## A11Y Notes

- `children` must describe the navigation destination — "Click here", "Learn more" alone fail WCAG 2.4.4.
- `Link` renders `<a>` — it is for navigation. For in-page actions, use `Button` or `LinkButton`.
- Do NOT use `Link href="#"` for actions — this is a role mismatch (WCAG 4.1.2).
- Icons inside links should have `aria-hidden="true"` to prevent double-announcement.

## ⚠️ WCAG Failure Patterns

### ❌ Link used for in-page action
```tsx
// BAD — role mismatch
<Link href="#" onClick={openModal}>Cancel</Link>

// GOOD — use Button for actions
<Button variant="tertiary" onClick={openModal}>Cancel</Button>
```

### ❌ Generic link text
```tsx
// BAD — no destination context
<Link href="/walmart-plus">Learn more</Link>

// GOOD
<Link href="/walmart-plus">Learn more about Walmart+</Link>
```

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.4.4 Link Purpose (In Context) | A | `children` text must describe the link destination. |
| 4.1.2 Name, Role, Value | A | `children` provides name; `<a>` provides role. |
