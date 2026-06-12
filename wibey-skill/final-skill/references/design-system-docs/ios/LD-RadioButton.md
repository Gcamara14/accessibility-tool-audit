# LD RadioButton — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/radio-button/index.md`
**Class:** `LDRadioButton`
**Platform:** iOS (UIKit/Swift)

## Overview
`LDRadioButton` is used for providing quick entry from users for boolean selection. Radio Buttons are usually placed in groups of two or more. They can be used in forms on a full page, in modals, or on side panels. They filter data on a page, in a menu, or within a component. See `LDFormGroup`.

**Use when:** You have a group of mutually exclusive choices and only one selection from the group is allowed.

**Do not use when:**
- A user may select multiple options, including all or none — use Checkbox instead.
- Enabling or disabling a state with immediate effect — use a Switch instead.
- For navigation — use a Button or Link instead.

## Swift API

### Initialization
```swift
// Designated initializer
LDRadioButton(dataModel: LDRadioButton.Model, appearance: Appearance)

// Convenience initializer
LDRadioButton(text: String?)

// FormGroup constructor
LDRadioButton(formGroupModel: LDFormGroupItemProtocol, groupModel: LDFormGroupModel)
```

### Model (`LDRadioButton.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `value` | `Value` | Value selected for radio on initial display |
| `text` | `String?` | Text to be displayed in the optional trailing text label |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `dataModel` | `Model` | View model to configure `LDRadioButton` |
| `text` | `String?` | Text to optionally be displayed trailing radio icon button |
| `isEnabled` | `Bool` | Switch to a disabled state |
| `isHighlighted` | `Bool` | Force button into its highlighted state |
| `isSelected` | `Bool` | Access to selection status |

### Variants / Enums
- `enum Value: Value` — Value of the radio; uses `.unchecked` and `.checked` for consistency with Checkbox (see Value enum for all cases).

### Delegate / Callbacks
- `protocol LDRadioButtonDelegate: LDRadioButton` — Delegate to both receive and inform changes in Radio button selection.
- `var delegate: any LDRadioButtonDelegate` — Set this delegate to receive radio events.

## A11Y Notes
No explicit accessibility property overrides are documented in the source. Standard iOS UIKit accessibility applies: `accessibilityLabel`, `accessibilityHint`, and `isAccessibilityElement` are the relevant properties. As a selectable button, the component inherits standard UIKit button accessibility traits. The trailing `text` property serves as the visible label and should reflect the accessible purpose of the option.

## Usage Example
```swift
// Designated initializer
let radioButton = LDRadioButton(
    dataModel: LDRadioButton.Model(text: "text", isSelected: true)
)

// Convenience initializer
let radioButton = LDRadioButton(value: .unchecked, text: "text")

// Receiving selection events via delegate
radioButton.delegate = self
```
