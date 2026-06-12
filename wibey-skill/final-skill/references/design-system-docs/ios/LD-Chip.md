# LD Chip — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/chip/index.md`
**Class:** `LDChipButton`
**Platform:** iOS (UIKit/Swift)

## Overview
LD chip button for displaying selections in single row and multiline. Supports leading and trailing icons with borders showing selection.

## Swift API

### Initialization
```swift
// Designated initializer
LDChipButton(dataModel: LDChipButton.Model, appearance: Appearance)

// Convenience initializer
LDChipButton(size: Size, text: String?)
```

### Model (`LDChipButton.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `size` | `Size` | Specify the size of the button |
| `text` | `String?` | Specify the text to be displayed |
| `leadingImage` | `UIImage?` | Optional leading image |
| `trailingImage` | `UIImage?` | Optional trailing image |

**Designated init parameters:**
- `size`: Size of the button
- `text`: Text to be displayed
- `leadingImage`: Leading image
- `trailingImage`: Trailing image

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `dataModel` | `Model` | View model for Chip |
| `text` | `String?` | Text to be set on the Chip |
| `leadingImage` | `UIImage?` | Left icon image to set leading image |
| `trailingImage` | `UIImage?` | Right icon image to set trailing image |
| `isEnabled` | `Bool` | Switch to a disabled state |
| `isHighlighted` | `Bool` | Force button into its highlighted state |
| `isSelected` | `Bool` | Allows access to selection status |

### Variants / Enums

#### `enum Size: Size`
Size of the Chip. Convenience initializer documents cases: `.small`, `.medium` (inferred), `.large` — see `Size` enum for full case list.

### Delegate / Callbacks

#### `protocol LDChipButtonDelegate: LDChipButton`
Delegate to both receive and inform changes in Chip button selection. See protocol definition for methods.

## A11Y Notes
- No explicit `accessibilityLabel` or `accessibilityHint` properties are documented in the source.
- `isSelected` reflects chip selection state — UIKit will surface this via `accessibilityTraits` when the view is an accessibility element.
- `isEnabled` maps to UIKit's disabled state, which is communicated automatically to VoiceOver.

## Usage Example
```swift
// Designated initializer
let chipView = LDChipButton(
    dataModel: LDChipButton.Model(
        size: .large, text: "Title", leadingImage: LDIcon.star.image
    )
)

// Convenience initializer
let chipView = LDChipButton(size: .small, text: "Title")
```
