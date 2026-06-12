# LD Error — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/error/index.md`
**Class:** `LDError`
**Platform:** iOS (UIKit/Swift)

## Overview
Error Messages provide a familiar layout with descriptive content and suggested actions for error scenarios.

## Swift API

### Initialization
```swift
// Designated initializer
LDError(dataModel: LDError.Model, actionContentView: UIView?)
```

### Model (`LDError.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `image` | `UIImage?` | Optional image |
| `header` | `String` | Header text to display |
| `body` | `String` | Subheading text to display |

**Designated init parameters:**
- `image`: Optional image
- `header`: Header text to display
- `body`: Subheading text to display

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `dataModel` | `Model` | View model modifier |

### Variants / Enums
None documented.

### Delegate / Callbacks
None documented.

## A11Y Notes
- No explicit `accessibilityLabel` or `accessibilityHint` properties are documented in the source.
- The `header` and `body` fields carry the primary error messaging — ensure these strings are descriptive enough for VoiceOver users to understand the error and suggested action.
- When an `actionContentView` (e.g., a `LDButton`) is provided, ensure the action button has a clear `accessibilityLabel` describing the recovery action.

## Usage Example
```swift
let error = LDError(
    dataModel: .init(
        image: LDIcon.associate.image,
        header: "Header",
        body: "Body"
    ),
    actionContentView: UIStackView(arrangedSubviews: [
        LDButton(variant: .primary, style: .medium)
    ])
)
```
