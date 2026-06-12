# LD IconButton — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/icon-button/index.md`
**View Class:** `living.design.themed.IconButton`
**Platform:** Android (Kotlin/XML)

## Overview

To create an Icon Button on Android, use the custom view `living.design.themed.IconButton` and specify the icon and size.

## XML Usage

```xml
<living.design.themed.IconButton
    android:contentDescription="@string/design_demo_iconbutton_content_description"
    android:layout_height="wrap_content"
    android:layout_width="wrap_content"
    app:iconButtonIcon="?walmartIconPencil"
    app:iconButtonSize="large" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:contentDescription` | string | REQUIRED accessible label for the icon button |
| `app:ldButtonSize` | `small`, `medium`, `large` | The size of the Button |
| `android:icon` | drawable ref | The icon of the Button |
| `android:enabled` | boolean | To enable/disable the Button |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var size` | `Size` | The size of the Button |

### Methods

| Method | Notes |
|--------|-------|
| `fun setIcon(...)` | Sets the icon to display over the background of the icon button |
| `fun setOnClickListener(listener: OnClickListener?)` | Sets the Button action. Set to `null` to remove the action. |

## Variants / Sizes

Size values (`app:ldButtonSize`):
- `small`
- `medium`
- `large`

## A11Y Notes

- `android:contentDescription` is REQUIRED on `IconButton` — it is the only accessible label for an icon-only button. Without it, TalkBack has nothing meaningful to announce.
- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- The source example explicitly sets `android:contentDescription="@string/design_demo_iconbutton_content_description"` — this pattern must always be followed
- The content description should describe the action the button performs, not the icon itself (e.g., "Edit item" not "Pencil icon")

## References

- [Icon Button source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/IconButton.kt)
- [Icon Button attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L104-L108)
