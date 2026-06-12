# LD Checkbox — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/checkbox/index.md`
**View Class:** `living.design.themed.Checkbox`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Checkbox on Android, use the custom view `living.design.themed.Checkbox`. The component is an extension of `AppCompatCheckBox` with custom styling and enhancements to support indeterminate state.

## XML Usage

```xml
<living.design.themed.Checkbox
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Checkbox" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:checked` | boolean | The checked state of the Checkbox |
| `android:text` | string | The text to be displayed in the Checkbox |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `isChecked` | `Boolean` | Gets whether or not the checkbox is checked |
| `text` | `CharSequence?` | Set the text of the Checkbox |

### Methods

| Method | Notes |
|--------|-------|
| `fun setChecked(checked: Boolean)` | Sets whether or not the checkbox is checked |
| `fun setOnCheckedChangeListener { checkbox, checked -> }` | Observe checked state changes; provides reference to checkbox and boolean checked value |
| `fun setCheckedState(newState: Int)` | Sets the checkbox state using state constants (see below) |
| `fun getCheckedState(): Int` | Gets the current state of the checkbox |
| `fun setOnStateChangeListener { checkbox, previousState, newState -> }` | Observe all state changes including indeterminate; provides previous and new state |

## State Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `Checkbox.STATE_UNCHECKED` | `0` | Unchecked state |
| `Checkbox.STATE_CHECKED` | `1` | Checked state |
| `Checkbox.STATE_INDETERMINATE` | `2` | Indeterminate/mixed state |

### Indeterminate Behavior

- When Checkbox state is indeterminate, `isChecked` will be `false`
- In the default behavior, toggling an indeterminate Checkbox will update the state to checked
- Indeterminate state is only set programmatically (not via XML)

### State Observation Example

```kotlin
val checkbox = view.findViewById<Checkbox>(R.id.field_check_box)
checkbox.setOnStateChangeListener { checkbox, previousState, newState ->
    when (newState) {
        Checkbox.STATE_UNCHECKED -> handleUnchecked()
        Checkbox.STATE_CHECKED -> handleChecked()
        Checkbox.STATE_INDETERMINATE -> handleIndeterminate()
    }
}
```

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- `android:text` is the visible label for the Checkbox; ensure it is descriptive
- The indeterminate state (`STATE_INDETERMINATE`) represents a mixed/partial selection — screen readers will announce the checked state as false when indeterminate; consider supplementing with a `android:contentDescription` if the indeterminate state needs explicit announcement
- `AppCompatCheckBox` base class handles standard checked/unchecked accessibility announcements automatically

## References

- [Checkbox source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Checkbox.kt)
