# LD Button — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/button/index.md`
**View Class:** `living.design.themed.Button`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Button on Android, use the custom view `living.design.themed.Button` and specify the text, variant and size. The component is an extension of `MaterialButton`.

## XML Usage

```xml
<living.design.themed.Button
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/button_text"
    app:ldButtonSize="small"
    app:ldButtonVariant="primary" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldButtonVariant` | `primary`, `secondary`, `tertiary`, `destructive` | The variant of the Button |
| `app:ldButtonSize` | `small`, `medium`, `large` | The size of the Button |
| `android:text` | string | The text to be displayed in the Button |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Variant` | The variant of the Button |
| `size` | `Size` | The size of the Button |
| `text` | `CharSequence?` | Get/set the current text |

### Methods

| Method | Notes |
|--------|-------|
| `fun setOnClickListener(listener: OnClickListener?)` | Sets the Button action. Set to `null` to remove the action. |

## Variants

- `primary`
- `secondary`
- `tertiary`
- `destructive`

## Sizes

- `small`
- `medium`
- `large`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Ensure `android:text` is descriptive; avoid generic labels like "Click here"
- Disabled state is inherited from `MaterialButton` via `android:enabled`

## References

- [Button source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Button.kt)
- [Button attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L61-L69)
