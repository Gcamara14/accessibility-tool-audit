# LD List — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/list/index.md`
**Class:** `LDListItem`
**Platform:** iOS (UIKit/Swift)

## Overview
Lists are a continuous, vertical group of related information. They are composed of items containing text, icons, spot icons or images, and they should contain at least one action.

## Swift API

### Initialization
```swift
// Designated initializer
LDListItem(dataModel: LDListItem.Model, appearance: Appearance)

// Convenience initializer
LDListItem(title: String?, message: String)
```

### Model (`LDListItem.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `title` | `String?` | Optional title text to display |
| `message` | `String` | Non-optional subtitle text to display |
| `leadingView` | `AlignmentView?` | Optional leading view |
| `trailingView` | `AlignmentView?` | Optional trailing view |

**Designated init parameters:**
- `title`: Optional title text to display
- `message`: Non-optional subtitle text
- `leadingView`: Optional leading view
- `trailingView`: Optional trailing view

### `AlignmentView` (`LDListItem.AlignmentView`)
A wrapper for leading and trailing views to assist in layout.

| Property | Type | Notes |
|----------|------|-------|
| `view` | `UIView` | View to be wrapped and displayed in the list item |
| `width` | (init param) | Optional width desired for the view |
| `height` | (init param) | Optional height desired for the view |
| `alignToCenter` | (init param) | Should view be aligned to center or leading |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object for theming |
| `dataModel` | `LDListItem.Model` | View model to configure `LDListItem` |

### Variants / Enums
None documented.

### Delegate / Callbacks

#### `protocol LDListItemDelegate: AnyObject`

| Method | Signature | Notes |
|--------|-----------|-------|
| `didTapOnItem` | `func didTapOnItem(sender: LDListItem) -> Void` | Triggered when the list item is tapped |

**Delegate property:**
```swift
var delegate: LDListItemDelegate?
```

## A11Y Notes
- No explicit `accessibilityLabel` or `accessibilityHint` properties are documented in the source.
- The `title` and `message` properties form the text content of the list item — VoiceOver will read these as the accessible description of the row.
- When `leadingView` or `trailingView` are used (e.g., a `LDLinkButton`), ensure those embedded views have their own appropriate `accessibilityLabel` set.
- `LDListItem` inherits from `LDRootControl` — ensure `isAccessibilityElement` and `accessibilityTraits` are appropriate for the context (e.g., `.button` trait if the item is tappable).

## Usage Example
```swift
// Simple example with title and subtitle
let listItem = LDListItem(
    dataModel: LDListItem.Model(title: "Title", message: "Message")
)

// With a trailing LDLinkButton
let listItem = LDListItem(
    dataModel: LDListItem.Model(
        title: "Title",
        message: "Message",
        trailingView: AlignmentView(
            view: LDLinkButton(size: .medium, text: "Click me!")
        )
    )
)

// Convenience initializer
let listItem = LDListItem(title: "Title", message: "Message")
```
