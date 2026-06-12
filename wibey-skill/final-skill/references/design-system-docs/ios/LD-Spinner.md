# LD Spinner — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/spinner/index.md`
**Class:** `LDSpinner`
**Platform:** iOS (UIKit/Swift)

## Overview
Spinners visually indicate that a process is taking place for an indeterminate amount of time.

## Swift API

### Initialization
```swift
// Designated initializer
LDSpinner(dataModel: Model, media: LDMediaAnimating)

// Convenience initializer
LDSpinner(style: .neutral, size: .large)
```

### Model (`LDSpinner.Model`)
The model is configured via `style` and `size` parameters. The source documents `enum Size: Size` which determines the size and rendering style of the activity indicator.

### Variants / Enums
| Enum | Notes |
|------|-------|
| `Size` | Determines the size and rendering style of the activity indicator. Cases not explicitly listed in source — see `Size` enum. |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming. |
| `dataModel` | `Model` | View model configuration for `LDSpinner`. |
| `media` | `LDMediaAnimating` | Used to swap the animating view. |
| `hidesWhenStopped` | `Bool` | Controls whether the receiver is hidden when animation is stopped. |

### Animation Methods
| Method | Notes |
|--------|-------|
| `startAnimating()` | Wrapper method for `LDMediaAnimating` start. |
| `stopAnimating()` | Wrapper method for `LDMediaAnimating` stop. |

### Protocols
`LDMediaAnimating` — public protocol that a custom media animation must implement to be passed as the `media` parameter.

## A11Y Notes
- Spinners are indeterminate progress indicators. Standard iOS UIKit accessibility properties apply: `accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`.
- When the spinner is active, consider posting a `UIAccessibility.post(notification: .announcement, argument: "Loading")` from the host view controller to inform VoiceOver users that a process is in progress.

## Usage Example
```swift
// Convenience initializer
let spinner = LDSpinner(style: .neutral, size: .large)
spinner.startAnimating()

// Custom media animation
let spinner = LDSpinner(
    dataModel: LDSpinner.Model(style: .neutral, size: .large),
    media: CustomMediaAnimation()
)
spinner.hidesWhenStopped = true
spinner.startAnimating()
```
