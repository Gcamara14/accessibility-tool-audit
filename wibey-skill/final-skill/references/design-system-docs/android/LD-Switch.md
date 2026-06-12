# LD Switch — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/switch/index.md`
**View Class:** `living.design.themed.Switch`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Switch on Android, use the custom view `living.design.themed.Switch`. The only customizable property is the label, which is optional.

## XML Usage

```xml
<living.design.themed.Switch
  android:layout_width="wrap_content"
  android:layout_height="wrap_content"
  android:label="Label" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:checked` | boolean | The initial checked state of the Switch |
| `android:label` | string | The text label for the Switch |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var label` | `String` | Gets/sets the text label |

### Methods

| Method | Notes |
|--------|-------|
| `fun setLabel(@StringRes stringResId: Int)` | Sets the label from a string resource |
| `fun setOnCheckedChangeListener(onCheckedChanged: (Boolean) -> Unit)` | Sets a listener to the checked state of the Switch |
| `fun setChecked(checked: Boolean)` | Sets the checked state |
| `fun isChecked(): Boolean` | Gets the checked state |
| `fun toggle()` | Toggles the current checked state |

## Variants / Sizes

Switch has no size or variant customization. The label is the only optional visual property.

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- The `android:label` text serves as the accessible label for the Switch control; TalkBack will announce the label along with the checked state
- Ensure the label text is descriptive enough to communicate the purpose of the toggle without additional context
- The Switch communicates its checked/unchecked state automatically to accessibility services via the standard Android checked state API

## References

- [Switch source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Switch.kt)
- [Switch attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L195-L199)
