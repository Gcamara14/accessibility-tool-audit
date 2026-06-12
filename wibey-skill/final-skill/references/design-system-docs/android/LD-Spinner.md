# LD Spinner — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/spinner/index.md`
**View Class:** `living.design.themed.Spinner`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Spinner on Android, use the custom view `living.design.themed.Spinner`. It can be customized for size and appearance against light/dark backgrounds.

## XML Usage

```xml
<living.design.themed.Spinner
    android:id="@+id/spinner_announce"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    app:ldSize="small"
    app:ldSpinnerColor="neutral"  />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldSize` | `small`, `large` | Size of the Spinner |
| `app:ldSpinnerColor` | `neutral`, `white` | Color of the Spinner |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var size` | `Size` | The size of the Spinner |
| `var color` | `Color` | The color of the Spinner |

## Variants / Sizes

**Sizes** (`app:ldSize`):
- `small`
- `large`

**Colors** (`app:ldSpinnerColor`):
- `neutral`
- `white`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- The Spinner is an indeterminate loading indicator; ensure surrounding context provides accessible announcement of loading state (e.g., via `View.announceForAccessibility` or a live region on a parent view)

## References

- [Spinner source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Spinner.kt)
- [Spinner attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L174-L180)
