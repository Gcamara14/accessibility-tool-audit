# LD ProgressIndicator — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/progress-indicator/index.md`
**Class:** `LDProgressIndicator`
**Platform:** iOS (UIKit/Swift)

## Overview
Progress Indicators visually quantify the completion of a process. They can be used for both user and system tasks. When used for user-tasks they show completion of the total task and do not display the individual steps.

## Swift API

### Initialization
```swift
// Designated initializer
LDProgressIndicator(dataModel: Model, appearance: Appearance)

// Convenience initializer
LDProgressIndicator(variant: Variant, labelText: String, valueText: String)
```

### Model (`LDProgressIndicator.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Variant` | Sets the type of progress being made |
| `labelText` | `String` | Sets the label on the leading side. A11y requires this to be non-empty |
| `valueText` | `String` | Sets the text on the trailing label. A11y requires this to be non-empty |
| `progress` | `Double` | Percent complete of the fill for the indicator |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `dataModel` | `Model` | Model of type `LDProgressIndicator.Model` to set all properties |
| `progress` | `Double` | Adjusts the current progress shown by the receiver |
| `labelText` | `String` | Adjusts the current label text. A11y requires this to be non-empty |
| `valueText` | `String` | Adjusts the current value text. A11y requires this to be non-empty |

### Variants / Enums
- `enum Variant: Variant` — Progress Indicator style (e.g., `.information` seen in examples; see Variant enum for all cases).

### Delegate / Callbacks
Not applicable.

## A11Y Notes
The source explicitly calls out that `labelText` and `valueText` **must not be empty** per A11y requirements. Both the Model definition and the modifier documentation repeat this requirement. These two properties provide the accessible context for the progress indicator's current state and purpose. Standard iOS UIKit accessibility properties (`accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`) apply at the view level.

## Usage Example
```swift
// Designated initializer with progress modifier
let indicator = LDProgressIndicator(
    dataModel: Model(
        variant: .information,
        text: "Add $35 of items to your cart for free shipping",
        value: "$9 remaining"
    )
).with { indicator in
    indicator.progress = 67
}

// Convenience initializer
let indicator = LDProgressIndicator(
    variant: .information,
    text: "Add $35 of items to your cart for free shipping",
    value: "$9 remaining",
    progress: 67
)
```
