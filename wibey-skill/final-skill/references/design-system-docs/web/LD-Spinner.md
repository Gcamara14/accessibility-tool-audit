# LD Spinner — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/spinner/guidelines/SpinnerGuidelines.tsx`
**Import:** `import { Spinner } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `color` | `"neutral" \| "white"` | No | `"neutral"` | Spinner color. `"neutral"` for use on white/light backgrounds; `"white"` for use on dark backgrounds or scrims. |
| `size` | `"large" \| "small"` | No | `"large"` | Spinner size. `"large"` is the default for full-page overlays and cards; `"small"` for use within components such as buttons. |

## Usage Examples

```tsx
import { Spinner } from "@livingdesign/react";

// Default — neutral color, large size (full-page or card loading)
<Spinner color="neutral" size="large" />

// White — for use on dark backgrounds/scrims
<Spinner color="white" size="large" />

// Small — for use inside buttons or compact components
<Spinner color="neutral" size="small" />

// Loading pattern — container marked busy with aria-live
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? <Spinner color="neutral" size="large" /> : <ProductList data={data} />}
</div>
```

## A11Y Notes

The `Spinner` is an animated loading indicator for indeterminate wait states. It renders with `role="status"` so screen readers announce the loading state without requiring focus.

- LD renders the Spinner with `role="status"` and a built-in accessible label automatically — AT users are informed of the loading state politely.
- When the Spinner overlays a content region, add `aria-busy="true"` to that container so AT knows the region is updating.
- Pair with `aria-live="polite"` on the container so AT announces when loading completes and real content appears.
- LD respects `prefers-reduced-motion` — the spinning animation is paused/reduced when the user has enabled reduced motion.
- The `"white"` color is for use on dark scrims or backgrounds. Always verify sufficient contrast between the spinner and its background regardless of color choice.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.3.3 Animation from Interactions | AAA | LD respects `prefers-reduced-motion`; animation is paused/reduced when user preference is set. |
| 4.1.2 Name, Role, Value | A | `role="status"` with an accessible name built in by LD. |
| 4.1.3 Status Messages | AA | `role="status"` announces loading state to AT without requiring focus change. |
