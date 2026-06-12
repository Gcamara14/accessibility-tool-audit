# LD Switch — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/switch/index.md`
**Class:** `LDSwitch`
**Platform:** iOS (UIKit/Swift)

## Overview
`LDSwitch` is intended to work well using the `isOn` modifier. To listen for changes to switch values, use the `.valueChanged` target action.

## Swift API

### Initialization
```swift
// Designated initializer
LDSwitch(dataModel: Model, appearance: Appearance)

// Convenience initializer
LDSwitch(isOn: Bool)
```

### Model (`LDSwitch.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `isOn` | `Bool` | Value of the switch: on = .checked, off = .unchecked. |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming. |
| `dataModel` | `Model` | View model object for configuring `LDSwitch`. |
| `isEnabled` | `Bool` | Provided to switch to a disabled state. |
| `isHighlighted` | `Bool` | Provided to force the button into its highlighted state. |
| `isOn` | `Bool` | Provided as part of the API for `UISwitch`. |
| `toggle()` | `Void` | Allows the value of the switch to swap programmatically. |

## A11Y Notes
- `LDSwitch` inherits from `LDRootSwitch` which is backed by UIKit's `UISwitch` semantics.
- VoiceOver automatically announces switch state ("on" / "off") for `UISwitch`-based controls.
- Standard iOS accessibility properties apply: `accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`.
- Provide a meaningful `accessibilityLabel` on the switch (or its enclosing label) so VoiceOver users understand what the switch controls.

## Usage Example
```swift
let sendUpdates = LDSwitch(isOn: true)
sendUpdates.addTarget(self, action: #selector(handleUpdates(sender:)), for: .valueChanged)

sendUpdates.isOn = false
sendUpdates.toggle()

@objc private func handleUpdates(sender: LDSwitch) {
    // do something for switch changing value
}
```
