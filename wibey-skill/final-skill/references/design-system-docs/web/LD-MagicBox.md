# LD MagicBox — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/magic-box/guidelines/MagicBoxGuidelines.tsx`
**Import:** `import { MagicBox } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | No | — | Content to render inside the layout container. |
| `borderRadius` | `"25" \| "50" \| "100" \| "200" \| "round"` | No | `"100"` | Border radius using LD design tokens. |
| `height` | `string` | No | — | Height of the container. |
| `width` | `string` | No | — | Width of the container. |

## Usage Examples

```tsx
// Basic usage
<MagicBox height="100%" width="100%" borderRadius="100">
  <div style={{ padding: "1rem" }}>
    Lorem ipsum dolor sit amet consectetur adipisicing elit.
  </div>
</MagicBox>
```

## A11Y Notes

`MagicBox` is a pure layout primitive rendered as a generic `<div>` container. It has no semantic role and no intrinsic accessibility impact. All accessibility responsibility lies with its children.

- Do not rely on `MagicBox` for semantic structure — use appropriate HTML elements inside it.
- If wrapping a meaningful page section, add an explicit landmark element (e.g., `<section>` or `<article>`) inside or alongside it with a proper `aria-label`.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | MagicBox itself adds no semantic structure. Children must carry all semantic meaning. |
