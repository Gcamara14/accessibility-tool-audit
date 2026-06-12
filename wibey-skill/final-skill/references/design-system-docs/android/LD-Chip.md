# LD Chip — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/chip/index.md`
**View Class:** `living.design.themed.Chip`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Chip on Android, use the custom view `living.design.themed.Chip`. The component is mostly an extension of `com.google.android.material.chip.Chip` with some custom styling. If a Chip Group is needed, a `com.google.android.material.chip.ChipGroup` can be used.

## XML Usage

```xml
<living.design.themed.Chip
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/design_demo_chip"
    app:ldSize="small" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:text` | string | The text for the Chip |
| `app:ldLeading` | drawable | The leading icon for the Chip |
| `app:ldSize` | `small`, `large` | The size of the Chip |
| `app:ldTrailing` | drawable | The trailing icon for the Chip |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var leading` | `Drawable?` | Get/set the leading icon for the Chip |
| `var text` | `CharSequence?` | Get/set the text for the Chip |
| `var trailing` | `Drawable?` | Get/set the trailing icon for the Chip |

### Methods

| Method | Notes |
|--------|-------|
| (none documented) | |

## Variants / Sizes

Size values (`app:ldSize`):
- `small`
- `large`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- The Chip extends `com.google.android.material.chip.Chip`; standard Material chip accessibility behaviors apply
- Ensure `android:text` is set to a meaningful label for screen reader announcement

## References

- [Chip source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Chip.kt)
- [Chip attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L71-L75)
