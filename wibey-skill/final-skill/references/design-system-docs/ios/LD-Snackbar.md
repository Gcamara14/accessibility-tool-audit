# LD Snackbar — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/snackbar/index.md`
**Class:** `LDSnackbar`
**Platform:** iOS (UIKit/Swift)

## Overview
Snackbars provide brief messages at the bottom of the screen regarding app processes. Snackbars contain brief text directly related to the operation performed. They may contain an action, but no icons.

## Swift API

### Initialization
```swift
// Designated initializer
LDSnackbar(dataModel: Model, action: (() -> Void)?, onDismiss: (() -> Void)?)

// Convenience initializer
LDSnackbar(message: String, actionButtonTitle: String?)
```

### Model (`LDSnackbar.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `message` | `String` | The message to be displayed inside the snackbar. |
| `actionButtonTitle` | `String?` | The title of the action button. |
| `duration` | `TimeInterval` | Duration to show snackbar. Defaults to 3.5 seconds. |
| `hidesAfterPerformingAction` | `Bool` | Whether the snackbar hides after performing its action. Defaults to false. |
| `needsAccessibilityAnnouncement` | `Bool` | Indicates whether to announce view's content when VoiceOver is ON. Defaults to true. |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming. |
| `dataModel` | `Model` | Snackbar datamodel for UI properties. |

### Actions / Callbacks
| Property | Type | Notes |
|----------|------|-------|
| `action` | `(() -> Void)?` | The action to perform when the user taps the button. |
| `onCloseTap` | `(() -> Void)?` | The action to perform when the user taps the close button. |
| `onDismiss` | `(() -> Void)?` | Called when the snackbar dismisses and is removed from view. |

### Presentation Methods
| Method | Notes |
|--------|-------|
| `showSnackbar(view:layoutInsets:)` | Presents the snackbar at the bottom of a given view. |
| `showSnackbar(viewController:additionalInsets:)` | Presents the snackbar at the bottom of a given view controller. |
| `showSnackbar(view:constraints:snackbar:) -> NSLayoutConstraint` | Presents snackbar with a custom layout closure. |
| `hideSnackbar()` | Hides the snackbar that was showing on UI. |

## A11Y Notes
- `needsAccessibilityAnnouncement: Bool` (on `Model`) controls whether VoiceOver announces the snackbar content when it appears. Defaults to `true`.
- Standard iOS UIKit accessibility properties apply: `accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`.
- The snackbar is a transient notification element; the `needsAccessibilityAnnouncement` flag is the primary accessibility hook for ensuring screen reader users receive the message.

## Usage Example
```swift
let snackbar = LDSnackbar(
    dataModel: LDSnackbar.Model(
        message: "Item added to cart",
        actionButtonTitle: "Undo",
        duration: 3.5,
        hidesAfterPerformingAction: true,
        needsAccessibilityAnnouncement: true
    ),
    action: {
        // handle undo
    },
    onDismiss: {
        // handle dismissal
    }
)
snackbar.showSnackbar(viewController: self, additionalInsets: .zero)
```
