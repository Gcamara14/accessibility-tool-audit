# LD Metric — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/metric/index.md`
**View Class:** `living.design.themed.Metric`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Metric on Android, use the custom view `living.design.themed.Metric`, and specify the variant, title, timescope, value, unit and text label. Aside from variant, all other fields are strings.

## XML Usage

```xml
<living.design.themed.Metric
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Value [descriptor] label"
    android:title="Title"
    android:value="Value"
    app:ldMetricVariant="positiveUp"
    app:ldTimescope="Time"
    app:ldUnit="Unit" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:title` | string | The title of the Metric |
| `android:value` | string | The value of the Metric |
| `android:text` | string | The text label of the Metric |
| `app:ldMetricVariant` | `neutral`, `positiveUp`, `negativeUp`, `positiveDown`, `negativeDown` | The variant of the Metric |
| `app:ldTimescope` | string | The timescope of the Metric |
| `app:ldUnit` | string | The unit of the Metric |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var variant` | `MetricVariant` | Gets/sets variant of the Metric |
| `var title` | `String?` | Gets/sets title of the Metric |
| `var timescope` | `String?` | Gets/sets timescope of the Metric |
| `var value` | `String?` | Gets/sets value of the Metric |
| `var unit` | `String?` | Gets/sets unit of the Metric |
| `var text` | `String?` | Gets/sets text of the Metric |

### Methods

| Method | Notes |
|--------|-------|
| (none documented) | |

## Variants / Sizes

Variant values (`app:ldMetricVariant`):
- `neutral`
- `positiveUp`
- `negativeUp`
- `positiveDown`
- `negativeDown`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- The Metric component displays numeric data with directional indicators; ensure all meaningful fields (`title`, `value`, `unit`, `timescope`, `text`) are populated so TalkBack can announce the complete metric context
- Variant conveys trend direction visually (e.g., up/down arrows, color); this information may not be conveyed to screen readers through the variant alone — consider whether the `text` or `title` fields should include the trend context in plain language

## References

- [Metric source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Metric.kt)
- [Metric attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L130-L143)
