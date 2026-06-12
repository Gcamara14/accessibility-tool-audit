# LD IconButton — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/icon-button/index.md`
**Class:** `LDIconButton`
**Platform:** iOS (UIKit/Swift)

## Overview
The Icon Button triggers an action or invokes navigation to another screen, similar to Button. It should be used in scenarios where space is limited.

Even the simplest icons, like an "x", can be understood in different ways. When selecting an icon, ensure there is enough context to make the action universally understood.

## Swift API

### Initialization
```swift
// Designated initializer
LDIconButton(dataModel: Model, appearance: Appearance)

// Convenience initializer
LDIconButton(size: Size, image: UIImage)
```

### Model (`LDIconButton.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `size` | `Size` | Size of the icon button |
| `image` | `UIImage` | Image to be displayed |

**Designated init parameters:**
- `size`: Size of the icon button
- `image`: Image to be displayed

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming; changes applied immediately |
| `dataModel` | `Model` | View model for `LDIconButton`; setting a new model immediately updates UI |

### Variants / Enums

#### `enum Size: Size`
Sizes for icon button — see `Size` enum for full case list.

### Delegate / Callbacks
None documented.

## A11Y Notes
- `LDIconButton` uses the UIKit standard `accessibilityLabel` property — NOT `a11yLabel` (which is web-only).
- Because icon-only buttons lack visible text, an `accessibilityLabel` **must** be set to describe the button's action for VoiceOver users (e.g., `button.accessibilityLabel = "Close"`).
- The source explicitly notes that even simple icons like "x" can be ambiguous — this reinforces the need for a descriptive `accessibilityLabel` on every `LDIconButton` instance.
- Set `accessibilityHint` when the button's action requires additional context beyond the label.

## Usage Example
```swift
// Designated initializer
let button = LDIconButton(
    dataModel: Model(size: .medium, image: LDIcon.home.image)
)
button.accessibilityLabel = "Home"

// Convenience initializer
let button = LDIconButton(size: .medium, image: LDIcon.home.image)
button.accessibilityLabel = "Home"
```
