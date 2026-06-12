# LD Radio — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/radio/index.md`
**View Class:** `living.design.themed.Radio`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Radio on Android, use the custom view `living.design.themed.Radio`. The component is mostly an extension of `AppCompatRadioButton` with some custom styling.

## XML Usage

```xml
<living.design.themed.Radio
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Radio" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:text` | string | The text to be displayed in the Radio |
| `android:checked` | boolean | The checked state of the Radio |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `text` | `CharSequence?` | Set the text of the Radio |

### Methods

| Method | Notes |
|--------|-------|
| `override fun setChecked(checked: Boolean)` | Set the checked state of the Radio |

## Observing Radio Selection

Radios should be used inside an `android.widget.RadioGroup`. To observe changes on the checked state:

```kotlin
val radioGroup = view.findViewById<RadioGroup>(R.id.radio_group)
radioGroup.setOnCheckedChangeListener { group, checkedId ->
    val radio = group.findViewById<Radio>(checkedId)
    doSomethingWithSelectedRadio(radio)
}
```

## Variants / Sizes

No LD-specific variants or sizes. Inherits standard `AppCompatRadioButton` behavior.

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Use `android.widget.RadioGroup` to group related radio buttons — this provides correct accessibility semantics (only one selection allowed)
- `android:text` serves as the accessible label for each radio option

## References

- [Radio source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Radio.kt)
