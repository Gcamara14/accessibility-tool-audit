# LD ProgressIndicator — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/progress-indicator/index.md`
**View Class:** `living.design.themed.ProgressIndicator`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Progress Indicator on Android, use the custom view `living.design.themed.ProgressIndicator`. It is added to layouts and then programmatically configured to render a particular state and step as data is updated.

## XML Usage

```xml
<living.design.themed.ProgressIndicator
  android:layout_width="match_parent"
  android:layout_height="wrap_content"
  android:value="100"
  app:ldTextLabel="Label" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldIndicatorVariant` | `info`, `warning`, `success`, `error` | The variant of the Progress Indicator |
| `app:ldTextLabel` | string | The text label (left-most label) of the Progress Indicator |
| `app:ldValueLabel` | string | The value label (right-most label) of the Progress Indicator |
| `android:value` | integer | The value of the Progress Indicator |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Variant` | Gets/sets variant. Controls the indicator bar color only. |
| `value` | `Int` | Gets/sets the progress value as a percentage (e.g., 10 for 10%) |
| `textLabel` | `String` | Gets/sets the text of the left-most label |
| `valueLabel` | `String` | Gets/sets the text of the right-most label, typically describing the progress |

### Methods

| Method | Notes |
|--------|-------|
| `fun setProgress(progress: Int, animated: Boolean = false)` | Updates the progress value. `animated` controls whether the change is animated. |

## Variants / Sizes

### Variants (`app:ldIndicatorVariant`)

- `info`
- `warning`
- `success`
- `error`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Use `textLabel` and `valueLabel` to provide meaningful context for assistive technologies

## References

- [Progress Indicator source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/ProgressIndicator.kt)
- [Progress Indicator attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L148-L158)
