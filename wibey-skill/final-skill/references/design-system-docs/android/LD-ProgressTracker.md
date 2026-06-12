# LD ProgressTracker — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/progress-tracker/index.md`
**View Class:** `living.design.themed.ProgressTracker`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Progress Tracker on Android, use the custom view `living.design.themed.ProgressTracker`. It is added to layouts and then programmatically configured to render a particular state and step as data is updated.

## XML Usage

```xml
<living.design.themed.ProgressTracker
    android:id="@+id/progressTracker"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:ldVariant="info" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldVariant` | `info`, `warning`, `success`, `error` | The variant of the Progress Tracker |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `currentStep` | `Int` | Get/set current step. 0 indicates no step is selected, not even the first one. |
| `labels` | `Array<String>` | Get/set labels to be displayed for each step. Count defines the number of steps. |
| `variant` | `Variant` | Get/set the variant of the Progress Tracker |

### Methods

| Method | Notes |
|--------|-------|
| `fun updateLayout(labels: Array<String>? = null, currentStep: Int? = null, variant: Variant? = null)` | Configures all values simultaneously. `null` values do not affect the view. |

## Variants / Sizes

### Variants (`app:ldVariant`)

- `info`
- `warning`
- `success`
- `error`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Use `labels` to provide meaningful step descriptions for assistive technologies
- `currentStep` value of 0 means no step is selected

## References

- [Progress Tracker source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/ProgressTracker.kt)
- [Progress Tracker attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L160-L167)
