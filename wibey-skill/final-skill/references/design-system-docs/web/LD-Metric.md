# LD Metric — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/metric/guidelines/MetricGuidelines.tsx`
**Import:** `import { Metric } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `title` | `string` | Yes | — | Descriptive label for the metric (e.g., "Deflector power", "Sales"). |
| `value` | `string \| number` | Yes | — | The primary metric value displayed prominently (e.g., `"42"`, `"$500"`). |
| `textLabel` | `string` | No | — | Secondary label text (e.g., "Goal: 40%", "50K (3.21%) more from last month"). |
| `timescope` | `string` | No | — | Time period for the metric (e.g., "Today", "YTD", "MTD"). |
| `unit` | `string` | No | — | Unit of measurement displayed alongside the value (e.g., `"%"`, `"M"`, `"minutes"`). |
| `variant` | `"negativeDown" \| "negativeUp" \| "neutral" \| "positiveDown" \| "positiveUp"` | No | `"neutral"` | Trend variant. Controls the directional arrow and color treatment. |

## Usage Examples

```tsx
// Neutral — point-in-time value, no trend
<Metric
  textLabel="Goal: 7.5%"
  timescope="Today"
  title="Click-thru rate"
  unit="%"
  value={6.7}
  variant="neutral"
/>

// Positive Up — increase in value that is a good thing
<Metric
  textLabel="50K (3.21%) more from last month"
  timescope="Today"
  title="Sales"
  unit="M"
  value="$500"
  variant="positiveUp"
/>

// Positive Down — decrease in value that is a good thing
<Metric
  textLabel="4% faster YoY"
  timescope="YTD"
  title="Oil average"
  unit="minutes"
  value={16}
  variant="positiveDown"
/>

// Negative Up — increase in value that is a bad thing
<Metric
  timescope="MTD"
  textLabel="6% slower than last month"
  title="Tire average"
  unit="minutes"
  value={27}
  variant="negativeUp"
/>

// Negative Down — decrease in value that is a bad thing
<Metric
  timescope="MTD"
  textLabel="13k (3.7%) less than last month"
  title="Sales"
  unit="M"
  value="$1.23"
  variant="negativeDown"
/>
```

## A11Y Notes

Metric values that include trend indicators (up/down arrows, color changes) must not convey meaning through color or icon alone. The `variant` prop controls both the visual arrow direction and color treatment. The `textLabel` prop should always include a plain-text description of the trend so AT users understand the meaning without relying on color or iconography.

- Always provide a descriptive `textLabel` when using a non-neutral `variant` — this is the text equivalent for screen reader users.
- The trend arrow icon rendered by the component should be treated as decorative (`aria-hidden="true"`) internally by LD.
- Color-only trend indication (green = good, red = bad) is a WCAG 1.4.1 failure without supporting text.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.1.1 Non-text Content | A | Trend icons are decorative; meaning conveyed via `textLabel`. |
| 1.3.1 Info and Relationships | A | `title` is programmatically associated with the metric `value`. |
| 1.4.1 Use of Color | A | Trend direction conveyed by text (`textLabel`), not color/icon alone. |
