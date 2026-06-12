# LD Banner — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/banner/index.md`
**View Class:** `living.design.themed.Banner`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Banner on Android, use the custom view `living.design.themed.Banner` and specify the text to display and what variant to use.

## XML Usage

```xml
<living.design.themed.Banner
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/design_demo_banner_text1"
    app:ldBannerVariant="positive" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldBannerVariant` | `success`, `info`, `warning`, `error` | The variant of the Banner |
| `android:text` | string | The text to be displayed in the Banner |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `variant` | `BannerVariant` | The variant of the Banner |
| `text` | `String?` | Gets/sets the current text |

### Methods

| Method | Notes |
|--------|-------|
| `fun setCloseListener(listener: ((View) -> Unit)?)` | Sets the listener to be invoked when the user taps the "close" icon, if/when available |

## Variants

- `success`
- `info`
- `warning`
- `error`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- The Banner's close icon button should have an `android:contentDescription` to label its action for screen readers
- Ensure `android:text` is meaningful and describes the banner message

## References

- [Banner source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Banner.kt)
- [Banner attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L51-L59)
