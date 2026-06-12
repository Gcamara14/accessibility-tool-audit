# LD Select — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/select/index.md`
**Class:** `LDSelect`
**Platform:** iOS (UIKit/Swift)

## Overview
`LDSelect` is a subclass of `LDTextField`. Use when selecting a single option from a list of options. The text label should clearly provide instruction for the field. Add additional copy above the Select if more context is needed. When an error occurs, make sure the copy clearly explains what happened and how to fix or what to do next.

## Swift API

### Initialization
```swift
// Designated initializer
LDSelect(dataModel: Model, selectInputView: UIView)

// Convenience initializer
LDSelect(size: Size, headerLabelText: String, helperLabelText: String?, text: String?)
```

### Model
`LDSelect` uses the `LDTextField.Model`. See `LDTextField` documentation for the full model definition. The example shows the following fields used:

| Property | Type | Notes |
|----------|------|-------|
| `size` | `Size` | e.g., `.large` |
| `viewState` | `ViewState` | e.g., `.regular` |
| `headerLabelText` | `String` | Required text above field to describe the contents |
| `helperLabelText` | `String?` | Optional text below field to help user define input |
| `leadingIcon` | `LDIcon?` | Optional leading icon (e.g., `LDIcon.calendar`) |
| `text` | `String?` | Actual content of the field, if preset |

### Modifiers
Inherits all modifiers from `LDTextField`. See `LDTextField` documentation.

### Additional Properties
| Property | Type | Notes |
|----------|------|-------|
| `accessoryToolbar` | `LDAccessoryToolbar?` | Optional toolbar shown above the keyboard/picker (e.g., with a Done action) |

### Variants / Enums
Inherits `Size` and `ViewState` enums from `LDTextField` (see LDTextField documentation).

### Delegate / Callbacks
Inherits delegate pattern from `LDTextField`.

## A11Y Notes
No explicit accessibility properties are documented in the source beyond what is inherited from `LDTextField`. Standard iOS UIKit accessibility applies: `accessibilityLabel`, `accessibilityHint`, and `isAccessibilityElement`. The `headerLabelText` provides the visible label above the field and should be reflected in the accessible label. An `LDAccessoryToolbar` with a Done action is recommended to provide keyboard dismissal for VoiceOver and Switch Control users.

## Usage Example
```swift
let picker = UIDatePicker()
picker.datePickerMode = .date
picker.minimumDate = Date()
picker.preferredDatePickerStyle = .inline
picker.sizeToFit()

let select = LDSelect(
    dataModel: Model(size: .large,
                     viewState: .regular,
                     headerLabelText: "Large Select View",
                     helperLabelText: "Enter your date of travel",
                     leadingIcon: LDIcon.calendar,
                     text: "Some value in here"),
    selectInputView: picker)

select.accessoryToolbar = LDAccessoryToolbar(doneAction: { [weak self] in
    // done action
})
```
