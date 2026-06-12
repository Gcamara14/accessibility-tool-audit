# LD Rating — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/rating/index.md`
**View Class:** `living.design.themed.Rating`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Rating on Android, use the custom view `living.design.themed.Rating`. There are two sizes available.

## XML Usage

```xml
<living.design.themed.Rating
  android:layout_width="wrap_content"
  android:layout_height="wrap_content"
  android:value="0.5"
  app:ldSize="small" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:value` | float (0.0–5.0) | The rating value |
| `app:ldSize` | `small`, `large` | The size of the Rating |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `size` | `RatingSize` | The size of the Rating |
| `value` | `Double` | Gets/sets the rating value between 0.0 and 5.0 |

## Variants / Sizes

### Sizes (`app:ldSize`)

- `small`
- `large`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Consider setting `android:contentDescription` to convey the numeric rating value to screen reader users (e.g., "4.5 out of 5 stars")

## References

- [Rating source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Rating.kt)
- [Rating attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#173-L176)
