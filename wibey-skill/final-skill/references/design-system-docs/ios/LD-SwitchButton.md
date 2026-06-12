# LD SwitchButton — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/switch-button/index.md`
**Class:** `LDSwitchButton`
**Platform:** iOS (UIKit/Swift)

## Overview
`LDSwitchButton` allows for a version of the switch with a text label next to it.

## Swift API

### Initialization
```swift
// Designated initializer
LDSwitchButton(dataModel: LDSwitchButton.Model(text: "text"), appearance: Appearance)

// Convenience initializer
LDSwitchButton(text: "text")
```

### Model (`LDSwitchButton.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `value` | `Value` | Value selected for switch on initial display. |
| `text` | `String?` | Text to be displayed in the optional trailing text label. |

Model designated init parameters:
- `mode`: If button is displayed on light or dark background.
- `text`: Optional text to be displayed trailing switch selector icon button.
- `isSelected`: If switch button should initially be displayed selected or not.

### Variants / Enums
| Enum | Notes |
|------|-------|
| `Value` | Represents the current value of the switch button. Cases not explicitly listed in source — see `Value` enum. |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming. |
| `dataModel` | `Model` | View model to configure `LDSwitchButton`. |
| `text` | `String?` | Text to optionally be displayed trailing switch icon button. |
| `isEnabled` | `Bool` | Provided to switch to a disabled state. |
| `isHighlighted` | `Bool` | Provided to force the button into its highlighted state. |
| `isSelected` | `Bool` | Allows access to selection status. |

### Delegate / Callbacks
| Protocol / Property | Notes |
|---------------------|-------|
| `LDSwitchButtonDelegate` | Delegate to both receive and inform changes in switch button selection. |
| `delegate` | `any LDSwitchButtonDelegate` — set to receive switch events. |
| `shouldChangeSelection() -> Bool` | Default implementation to provide optionality for the delegate. |

## A11Y Notes
- Standard iOS UIKit accessibility properties apply: `accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`.
- The trailing text label should provide context about what the switch controls. VoiceOver will read the combined label + state.
- Ensure `accessibilityLabel` reflects the text content when a custom label is not supplied.

## Usage Example
```swift
// Default initializer
let switchButton = LDSwitchButton(
    dataModel: LDSwitchButton.Model(text: "Receive notifications")
)
switchButton.delegate = self

// Convenience initializer
let switchButton = LDSwitchButton(text: "Receive notifications")
```
