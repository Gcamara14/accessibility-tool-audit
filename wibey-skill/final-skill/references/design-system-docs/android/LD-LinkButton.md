# LD LinkButton — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/link-button/index.md`
**View Class:** `living.design.themed.LinkButton`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Link Button on Android, use the custom view `living.design.themed.LinkButton` and specify the text, color and size. The component is an extension of `MaterialButton`.

## XML Usage

```xml
<living.design.themed.LinkButton
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/design_demo_link_button"
    app:ldLinkButtonColor="subtle"
    app:ldButtonSize="small" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldButtonSize` | `small`, `medium`, `large` | The size of the Link Button |
| `app:ldLinkButtonColor` | `default`, `subtle`, `white` | The color of the Link Button |
| `android:text` | string | The text to be displayed in the Link Button |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var size` | `LinkButtonSize` | The size of the Link Button |
| `var color` | `LinkButtonColor` | The color of the Link Button |

### Methods

| Method | Notes |
|--------|-------|
| `fun setOnClickListener(listener: OnClickListener?)` | Sets the Link Button action. Set to `null` to remove the action. |

## Variants / Sizes

Color values (`app:ldLinkButtonColor`):
- `default`
- `subtle`
- `white`

Size values (`app:ldButtonSize`):
- `small`
- `medium`
- `large`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- `android:text` must be set to a meaningful label that describes the link destination or action
- Link Button extends `MaterialButton`; standard Material button accessibility behaviors apply
- Ensure link text is descriptive and not generic (e.g., avoid "Click here" or "Learn more" without context)

## References

- [Link Button source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/LinkButton.kt)
- [Link Button attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L109-L116)
