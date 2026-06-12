# LD Radio — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/radio/index.md`
**Class:** `LDRadio`
**Platform:** iOS (UIKit/Swift)

## Overview
Complex icon used for radio buttons throughout the app. This class implements a special `LDMediaProtocol` used to display complex icons that use multiple colors.

## Swift API

### Initialization
```swift
// Designated initializer
LDRadio(dataModel: Model, appearance: Appearance)

// Convenience initializer
LDRadio(value: Value)
```

### Model (`LDRadio.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `value` | `Value` | Either checked or unchecked |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `dataModel` | `Model` | View model for configuring `LDRadio` |

### Variants / Enums
- `Value` — Either checked or unchecked (see Value enum; explicit cases not listed in source).

### Delegate / Callbacks
Not applicable.

## A11Y Notes
No explicit accessibility properties are documented in the source. `LDRadio` is an icon-level component used as part of a larger radio button (see `LDRadioButton`). Standard iOS UIKit accessibility (`accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`) should be managed by the parent `LDRadioButton` component.

## Usage Example
```swift
// Designated initializer
let radio = LDRadio(dataModel: LDRadio.Model(value: .checked))

// Convenience initializer
let radio = LDRadio(value: .unchecked)
```
