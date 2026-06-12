# LD CheckboxButton — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/checkbox-button/index.md`
**Class:** `LDCheckboxButton`
**Platform:** iOS (UIKit/Swift)

## Overview
Checkboxes are selectable options presented in a group or on their own. When in a group, a user may select any number of Checkboxes, including all or none.

**Use when:**
- You have a list of options which are not mutually exclusive.
- Creating forms on a full page, modal, or side panel.
- Filtering data on a page, menu, or within a component.
- Creating lists with sub-selections or parent-child relationships.
- A user needs to indicate consent on a Terms & Conditions form.

**Don't use when:**
- Only one item can be selected from a list — use Radios instead.

## Swift API

### Initialization
```swift
// Designated initializer
LDCheckboxButton(dataModel: Model, appearance: Appearance)

// Convenience initializer
LDCheckboxButton(checkboxValue: Value, text: String?)

// Convenience initializer (used in LDFormGroup)
LDCheckboxButton(formGroupModel: ItemModel, groupModel: LDFormGroup.Model)
```

### Model (`LDCheckboxButton.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `value` | `Value` | Value selected for the checkbox upon initial display |
| `text` | `String?` | Text optionally displayed trailing the checkbox icon button |
| `allowIndeterminant` | `Bool` | Used to turn off the third selection state for checkbox buttons |

**Designated init parameters:**
- `checkboxValue`: Initial state of the checkbox
- `text`: Text optionally displayed trailing the checkbox icon button
- `allowIndeterminant`: Should checkbox allow the use of an indeterminant state

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used in Theming |
| `dataModel` | `Model` | View model used in `LDCheckboxButton` |
| `checkboxValue` | `Value` | Current checkbox value; emits messages to `LDCheckboxButtonDelegate` |
| `text` | `String?` | Text optionally displayed after the checkbox icon button |
| `isEnabled` | `Bool` | Switch to a disabled state |
| `isHighlighted` | `Bool` | Force button into its highlighted state |
| `isSelected` | `Bool` | Selection status provided by `checkboxValue` |

### Variants / Enums

#### `enum Value: Value`
Custom value to express checkbox state. Supports an `indeterminant` state in addition to standard selected/unselected — see `Value` enum.

### Delegate / Callbacks

#### `protocol LDCheckboxButtonDelegate: AnyObject`
Delegate to both receive and inform changes in Checkbox button selection.

| Method | Signature | Notes |
|--------|-----------|-------|
| `shouldChangeValue` | `func shouldChangeValue(value:sender:) -> Bool` | Return `true` if the value change should be allowed. Default implementation provided (optional). |
| `didChangeValue` | `func didChangeValue(value:sender:) -> Void` | Fires when selection did change with updated value. |

**Delegate property:**
```swift
var delegate: LDCheckboxButtonDelegate?
```

## A11Y Notes
- No explicit `accessibilityLabel` or `accessibilityHint` properties are documented in the source.
- The `checkboxValue` modifier reflects selection state including the indeterminate state — ensure VoiceOver context is correct when `allowIndeterminant` is `true`.
- Use `isEnabled` to communicate disabled state to assistive technologies via UIKit's standard accessibility system.

## Usage Example
```swift
let checkbox = LDCheckboxButton(
    dataModel: LDCheckboxButton.Model(
        checkboxValue: .unchecked,
        text: "I agree to the Terms & Conditions",
        allowIndeterminant: false
    )
)
checkbox.delegate = self

// Convenience form
let checkbox = LDCheckboxButton(checkboxValue: .unchecked, text: "Option A")
```
