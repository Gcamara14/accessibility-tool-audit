# LD Alert — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/alert/index.md`
**View Class:** `living.design.themed.Alert`
**Platform:** Android (Kotlin/XML)

## Overview

To create an Alert on Android, use the custom view `living.design.themed.Alert` and specify the message to display and what variant to use.

## XML Usage

```xml
<living.design.themed.Alert
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="This is a success message!"
    app:ldAlertVariant="success" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldAlertVariant` | `success`, `info`, `warning`, `error` | The variant of the Alert |
| `android:text` | string | The text to be displayed in the Alert |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Variant` | The variant of the Alert |
| `text` | `CharSequence?` | Get/set the current text |

### Methods

| Method | Notes |
|--------|-------|
| `fun setAction(@StringRes actionTextRes: Int, action: () -> Unit)` | Adds an action button with the text set by the resource provided |
| `fun setAction(actionText: CharSequence?, action: () -> Unit)` | Adds an action button with the text set by the `CharSequence` provided. Set to `null` to remove the action button. |

## Variants

- `success`
- `info`
- `warning`
- `error`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- The Alert displays a text message; ensure `android:text` is meaningful and descriptive for screen readers

## References

- [Alert source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Alert.kt)
- [Alert attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L17-L25)
