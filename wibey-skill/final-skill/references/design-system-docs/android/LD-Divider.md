# LD Divider — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/divider/index.md`
**View Class:** `living.design.themed.Divider`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Divider on Android, use the custom view `living.design.themed.Divider` and apply the `?ld.divider` style.

## XML Usage

```xml
<living.design.themed.Divider style="?ld.divider" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `style` | `?ld.divider` | Required style attribute for the Divider |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| (none documented) | | |

### Methods

| Method | Notes |
|--------|-------|
| (none documented) | |

## Variants / Sizes

No variants or sizes documented in source.

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Dividers are decorative separators; they are typically not focusable and do not require a content description
- Avoid making dividers focusable with TalkBack — they convey no meaningful information to screen reader users

## References

- [Divider source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Divider.kt)
