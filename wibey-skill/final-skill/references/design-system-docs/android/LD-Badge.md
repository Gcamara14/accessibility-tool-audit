# LD Badge — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/badge/index.md`
**View Class:** `living.design.themed.Badge`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Badge on Android, use the custom view `living.design.themed.Badge` and specify the text (if applicable) and color.

## XML Usage

```xml
<living.design.themed.Badge
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="2"
    app:ldBadgeColor="blue" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldBadgeColor` | `brandBold`, `brand`, `positive`, `negative`, `warning`, `info`, `edited`, `blue`, `purple`, `gray`, `white`, `green`, `red`, `spark`, `cyan`, `orange`, `pink`, `yellow` | The variant and color of the Badge |
| `android:text` | string | The text to be displayed in the Badge |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `color` | `BadgeColor` | Gets/sets the current color |
| `text` | `String` | Gets/sets the current text |

### Methods

| Method | Notes |
|--------|-------|
| — | No additional methods documented |

## Colors / Variants

There are 18 badge colors:

- `brandBold`
- `brand`
- `positive`
- `negative`
- `warning`
- `info`
- `edited`
- `blue`
- `purple`
- `gray`
- `white`
- `green`
- `red`
- `spark`
- `cyan`
- `orange`
- `pink`
- `yellow`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Badge is typically decorative/supplemental; when used alongside other content, ensure the parent or associated view conveys the badge's meaning via `android:contentDescription`

## References

- [Badge source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Badge.kt)
- [Badge attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L27-L49)
