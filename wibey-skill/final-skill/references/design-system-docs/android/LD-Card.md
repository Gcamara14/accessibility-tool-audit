# LD Card — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/card/index.md`
**View Class:** `living.design.themed.Card`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Card on Android, use the custom view `living.design.themed.Card` and apply the `?ld.card` style. The component is mostly an extension of `MaterialCardView` with some custom styling.

The current Android version has only the container for the Card component. The rest of the functionality will be added in the future.

## XML Usage

```xml
<living.design.themed.Card
    style="?ld.card"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

</living.design.themed.Card>
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `style` | `?ld.card` | Required theme attribute to apply LD Card styling |
| `android:layout_width` | standard Android | Standard Android layout attribute |
| `android:layout_height` | standard Android | Standard Android layout attribute |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| — | — | No custom Kotlin API documented; inherits from `MaterialCardView` |

### Methods

| Method | Notes |
|--------|-------|
| — | No additional methods documented beyond `MaterialCardView` |

## Variants / Sizes

No LD-specific variants or sizes documented for the current Android implementation. The component currently provides only the container.

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Card is a container; child content is responsible for its own accessibility labels
- If the Card is interactive (tappable), set `android:clickable="true"` and provide a meaningful `android:contentDescription` on the Card itself

## References

- [Card source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Card.kt)
