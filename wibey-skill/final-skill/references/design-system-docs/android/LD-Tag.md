# LD Tag — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/tag/index.md`
**View Class:** `living.design.themed.Tag`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Tag on Android, use the custom view `living.design.themed.Tag`.

## XML Usage

```xml
<living.design.themed.Tag
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/design_demo_tag_label"
    app:ldTagColor="blue"
    app:ldTagVariant="primary" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:icon` | drawable resource | The icon to be displayed in the Tag |
| `android:text` | string | The text to be displayed in the Tag |
| `app:ldTagVariant` | `primary`, `secondary`, `tertiary` | The variant of the Tag |
| `app:ldTagColor` | `blue`, `green`, `spark`, `red`, `purple`, `gray`, `cyan`, `orange`, `pink`, `brand`, `positive`, `warning`, `negative`, `info`, `edited` | The color of the Tag |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var color` | `Color` | Get/set the current color |
| `var text` | `CharSequence?` | Get/set the current text |
| `var variant` | `Variant` | Get/set the current variant |

### Methods

| Method | Notes |
|--------|-------|
| `fun setIcon(iconResId: Int)` | Set the icon to be displayed |
| `fun setIcon(icon: Drawable?)` | Set the icon to be displayed; set `null` to hide the icon |
| `fun setValues(iconResId: Int? = null, text: String = "", variant: Variant = Variant.PRIMARY, color: Color = Color.BLUE)` | Allows setting all properties at once |

## Variants / Sizes

**Variants** (`app:ldTagVariant`):
- `primary`
- `secondary`
- `tertiary`

**Colors** (`app:ldTagColor`):
- `blue`
- `green`
- `spark`
- `red`
- `purple`
- `gray`
- `cyan`
- `orange`
- `pink`
- `brand`
- `positive`
- `warning`
- `negative`
- `info`
- `edited`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- The `android:text` value is read by TalkBack as the accessible label for the Tag
- If the Tag includes an icon via `android:icon`, the icon is decorative when text is also present — no separate content description is needed for the icon in that case
- Tags are typically non-interactive labels; if a Tag is interactive (tappable), ensure it has an appropriate role and content description

## References

- [Tag source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Tag.kt)
- [Tag attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L208-L233)
