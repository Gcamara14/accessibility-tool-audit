# LD TextArea — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/text-area/index.md`
**View Class:** `living.design.themed.TextArea`
**Platform:** Android (Kotlin/XML)

## Overview

The `TextArea` component allows users to enter multi-line text input.

To create a `TextArea` on Android, use the custom view `living.design.themed.TextArea`. Configure the style, label, helper text, error text, and optional character counter with max length.

## XML Usage

```xml
<living.design.themed.TextArea
    style="?ld.textArea.small"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginTop="?ld.primitive.scale.space.100"
    android:layout_marginBottom="?ld.primitive.scale.space.100"
    android:label="@string/design_demo_text_area_small"
    app:ldHelperText="@string/design_demo_helper"
    app:ldCounterEnabled="true"
    app:ldCounterMaxLength="20" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `style` | `?ld.textArea.small`, `?ld.textArea.large` | Sets the size of the TextArea |
| `android:label` | string | The text label to be displayed |
| `app:ldCounterEnabled` | boolean | Enable/disable the character counter |
| `app:ldCounterMaxLength` | integer | Set the maximum character length |
| `app:ldHelperText` | string | The helper text message |
| `app:ldHelperTextEnabled` | boolean | The initial state for the helper text |
| `app:ldErrorEnabled` | boolean | The state for the error message |
| `app:ldErrorContentDescription` | string | Content description for the error view |
| `app:ldIsMagic` | boolean | Whether the component displays a magic style to indicate AI modification |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var label` | `CharSequence?` | Get/set the text label |
| `open var text` | `CharSequence?` | Get/set the text area value |
| `var counterMaxLength` | `Int` | Get/set the maximum character length |
| `var helperText` | `CharSequence?` | Get/set the helper text |
| `var isHelperTextEnabled` | `Boolean` | Get/set helper text state |
| `var error` | `CharSequence?` | Get/set the error message |
| `var errorContentDescription` | `CharSequence?` | Get/set the error content description |
| `var isErrorEnabled` | `Boolean` | Get/set error state |
| `var isMagic` | `Boolean` | Get/set whether the component displays a magic style to indicate AI modification |

## Variants / Sizes

**Sizes** (`style` attribute):
- `?ld.textArea.small`
- `?ld.textArea.large`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- `app:ldErrorContentDescription` / `var errorContentDescription` provides an accessible description for the error state — use this to give TalkBack users context about what is wrong (e.g., "Error: Field is required")
- The `android:label` text is the accessible label for the text area input
- When `isErrorEnabled` is true, TalkBack will announce the error; `errorContentDescription` should be set to give a clear, actionable error message
- The character counter is visible text; ensure `counterMaxLength` is set when `ldCounterEnabled` is true so users understand the limit

## References

- [Text area source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/TextArea.kt)
- [Field source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/field/Field.kt)
- [Field attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L104-L129)
