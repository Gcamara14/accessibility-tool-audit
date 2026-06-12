# LD SpotIcon — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/spot-icon/index.md`
**View Class:** `living.design.themed.SpotIcon`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Spot Icon on Android, use the custom view `living.design.themed.SpotIcon`. It can be customized for size and color.

## XML Usage

```xml
<living.design.themed.SpotIcon
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:icon="@drawable/ld_ic_close"
    app:ldSize="large"
    app:ldSpotIconColor="brand" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:icon` | drawable resource | The icon to display |
| `app:ldSize` | `small`, `large` | Size of the Spot Icon |
| `app:ldSpotIconColor` | `neutral`, `brand` | Color of the Spot Icon |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var size` | `Size` | The size of the Spot Icon |
| `var color` | `SpotIconColor` | The color of the Spot Icon |

### Methods

| Method | Notes |
|--------|-------|
| `fun setIcon(@DrawableRes iconResId: Int? = null)` | Sets the icon from a drawable resource |
| `fun setIcon(icon: Drawable?)` | Sets the icon from a drawable |

## Variants / Sizes

**Sizes** (`app:ldSize`):
- `small`
- `large`

**Colors** (`app:ldSpotIconColor`):
- `neutral`
- `brand`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- SpotIcon is a decorative/illustrative icon component; if used as a meaningful image, set `android:contentDescription` on the view
- If purely decorative, mark as not important for accessibility via `android:importantForAccessibility="no"`

## References

- [Spot Icon source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/SpotIcon.kt)
- [Spot Icon attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L186-L193)
