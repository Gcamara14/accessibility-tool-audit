# LD Skeleton — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/skeleton/guidelines/SkeletonGuidelines.tsx`
**Import:** `import { Skeleton, SkeletonText } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

### Skeleton

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `variant` | `"rectangle" \| "rounded"` | No | `"rectangle"` | Shape of the skeleton placeholder. `"rectangle"` has sharp corners; `"rounded"` has fully rounded corners. |
| `height` | `string \| number` | No | `"16px"` | Height of the skeleton shape. |
| `width` | `string` | No | — | Width of the skeleton shape. |
| `isMagic` | `boolean` | No | `false` | Enables the magic (shimmer) animation treatment. |

### SkeletonText

`SkeletonText` is a companion component (also exported from `@livingdesign/react`) that renders a multi-line text skeleton placeholder.

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `isMagic` | `boolean` | No | `false` | Enables the magic animation treatment. |
| `lines` | `number` | No | — | Number of text lines to render. |
| `UNSAFE_style` | `object` | No | — | Style override (e.g., `{ width: "100%" }`). |

## Usage Examples

```tsx
import { Skeleton, SkeletonText } from "@livingdesign/react";

// Rectangle skeleton
<Skeleton variant="rectangle" height={32} width="100%" />

// Rounded skeleton
<Skeleton variant="rounded" height={32} width="100%" />

// Magic (shimmer) rectangle skeleton
<Skeleton variant="rectangle" height={32} isMagic width="100%" />

// Magic rounded skeleton
<Skeleton variant="rounded" height={32} isMagic width="100%" />

// Text skeleton
<SkeletonText UNSAFE_style={{ width: "100%" }} />

// Magic text skeleton with multiple lines
<SkeletonText isMagic lines={3} UNSAFE_style={{ width: "100%" }} />

// Loading pattern — container marked busy
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? (
    <Skeleton variant="rectangle" height={32} width="100%" />
  ) : (
    <ProductDetails />
  )}
</div>
```

## A11Y Notes

Skeletons are purely decorative placeholders — they must be hidden from assistive technology.

- LD applies `aria-hidden="true"` to skeleton elements automatically; they are never announced by screen readers.
- The container holding the skeleton should be marked `aria-busy="true"` while loading, and `aria-live="polite"` so AT announces when real content replaces the skeleton.
- LD respects `prefers-reduced-motion` — the shimmer/pulse animation is disabled automatically when the user has enabled reduced motion.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | Skeleton is `aria-hidden`; does not pollute the AT tree with meaningless shapes. |
| 2.3.3 Animation from Interactions | AAA | LD respects `prefers-reduced-motion`; animation disabled automatically. |
| 4.1.3 Status Messages | AA | Container with `aria-busy` + `aria-live` communicates loading state to AT. |
