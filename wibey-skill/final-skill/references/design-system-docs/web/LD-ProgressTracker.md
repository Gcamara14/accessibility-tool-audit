# LD ProgressTracker — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/progress-tracker/guidelines/ProgressTrackerGuidelines.tsx`
**Import:** `import { ProgressTracker, ProgressTrackerItem } from "@livingdesign/react"`

---

## Overview

The LD `ProgressTracker` is a step indicator showing a multi-step flow (e.g., checkout steps, onboarding wizard). It uses a composable pattern: `children` are `ProgressTrackerItem` components. The active step is indicated by `activeIndex` (zero-based). The `variant` prop controls the visual/semantic state of the active step node (info, success, warning, error). The component should communicate step position and current step status to AT via `aria-current="step"`.

---

## Props (SOURCE-VERIFIED)

### `ProgressTracker`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | `ProgressTrackerItem` components defining each step |
| `activeIndex` | `number` | No | — | Zero-based index of the currently active step |
| `variant` | `"error" \| "info" \| "success" \| "warning"` | No | `"info"` | Visual/semantic state of the active step |

### `ProgressTrackerItem`

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | Visible text label for this step |

---

## Usage Examples

```tsx
<ProgressTracker activeIndex={2} variant="info">
  <ProgressTrackerItem>Fetch a hyper-spanner</ProgressTrackerItem>
  <ProgressTrackerItem>Crawl through Jeffries tubes</ProgressTrackerItem>
  <ProgressTrackerItem>Scrub the plasma conduits</ProgressTrackerItem>
  <ProgressTrackerItem>Realign the warp core</ProgressTrackerItem>
</ProgressTracker>
```

### Variants

```tsx
// Info — default, showing progress toward completion
<ProgressTracker activeIndex={1} variant="info">...</ProgressTracker>

// Success — showing completion
<ProgressTracker activeIndex={3} variant="success">...</ProgressTracker>

// Warning — progress with a warning
<ProgressTracker activeIndex={2} variant="warning">...</ProgressTracker>

// Error — progress blocked or at risk
<ProgressTracker activeIndex={0} variant="error">...</ProgressTracker>
```

---

## A11Y Notes

- `activeIndex` drives `aria-current="step"` on the active step node — this is what AT announces as the current step in the flow. Without `activeIndex`, no step is marked as current.
- Steps are rendered in a list structure so AT announces position (e.g., "step 2 of 4").
- The `variant` communicates semantic state for the active step (error, warning, success) — use the appropriate variant to match the actual state, not just visually.
- If multiple progress trackers exist on a page, consider wrapping in a `<nav>` or adding an `aria-label` via a wrapping element to distinguish them for landmark navigation.

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | Step list semantics convey position and order. |
| 2.4.8 Location | AAA | `aria-current="step"` communicates the user's position in the multi-step flow. |
| 4.1.2 Name, Role, Value | A | Active step marked with `aria-current`; variant states (error/warning/success) are programmatic. |
