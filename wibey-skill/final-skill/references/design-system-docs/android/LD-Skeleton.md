# LD Skeleton — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/skeleton/index.md`
**View Class:** `living.design.themed.Skeleton`
**Platform:** Android (Kotlin/XML)

## Overview

The `Skeleton` component is a placeholder that visually represents the shape of UI elements while content is loading. Add the custom view `living.design.themed.Skeleton` to your layout. You can configure its shape, number of lines, line height, and whether it uses a special "magic" animated style.

## XML Usage

```xml
<living.design.themed.Skeleton
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:ldSkeletonVariant="rectangle"
    app:ldIsMagic="false"
    app:android_lines="3"
    app:android_lineHeight="?ld.primitive.scale.space.200" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldSkeletonVariant` | `rectangle`, `rounded` | The border style of the skeleton |
| `app:ldIsMagic` | boolean | Whether the component displays a magic animated gradient to indicate AI or special loading |
| `app:android_lines` | integer | Number of lines to display (0 = fill parent height) |
| `app:android_lineHeight` | dimension | Height of each line (used when lines > 0) |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Skeleton.Variant` | Get/set the border style (`RECTANGLE` or `ROUNDED`) |
| `lines` | `Int` | Get/set the number of lines (0 = fill parent height) |
| `lineHeight` | `Int` | Get/set the height of each line in pixels |
| `isMagic` | `Boolean` | Get/set whether the component displays a magic animated gradient |
| `animatorFraction` | `Float` | The current animation progress (0–1) |

## Variants / Sizes

### Variants (`app:ldSkeletonVariant`)

- `rectangle` — Slightly rounded corners (default, `ld.primitive.scale.borderRadius.50`)
- `rounded` — Completely rounded corners (`ld.primitive.scale.borderRadius.round`)

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Skeleton's default content description is `"loading"`
- High contrast mode is supported for better visibility

## References

- [Skeleton source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Skeleton.kt)
