# LD Alert — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/alert/index.md`
**Class:** `LDAlert`
**Platform:** iOS (UIKit/Swift)

## Overview
Alerts surface information within a flow that is important to the user's journey. They are system-created and non-dismissible. Use an Alert to relay errors, reinforce success, warn about a potential issue, or communicate details. Inherits from `LDRootControl`.

## Swift API

### Initialization

```swift
// Designated initializer
LDAlert(dataModel: LDAlert.Model, alertDelegate: LDAlertDelegate?, appearance: Appearance)

// Convenience initializer
LDAlert(messageType: AlertType, message: NSAttributedString, alertDelegate: LDAlertDelegate?)
```

### Model (`LDAlert.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `message` | `NSAttributedString` | Message displayed inside the alert |
| `messageType` | `AlertType` | Determines the color and icon for the alert |
| `detailsButtonTitle` | `String?` | If set, renders underlined text and makes the entire alert tappable; requires a `delegate` or `onTapAlert` |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance used for theming |
| `dataModel` | `Model` | Model of type `LDAlertModel` to set all properties |
| `onTapAlert` | `(() -> Void)?` | Closure called when the alert is tapped |

### Variants / Enums
- `enum AlertType: Equatable` — Controls color and icon. Cases not explicitly listed in source; see `AlertType` enum.

### Delegate / Callbacks

**Protocol: `LDAlertDelegate: AnyObject`**

| Method | Notes |
|--------|-------|
| `shouldAllowTap(sender: LDAlert) -> Bool` | Optional. Returns whether the alert is tappable. Defaults to `true`. If delegate is `nil`, defaults to non-tappable. |
| `didTapAlert(sender: LDAlert) -> Void` | Called when the alert is tapped |

**Modifier:**
| Property | Type | Notes |
|----------|------|-------|
| `delegate` | `LDAlertDelegate?` | Set to receive tap/interaction events; can be used alongside `onTapAlert` — both will be called |

## A11Y Notes
- When `detailsButtonTitle` is set, the alert announces as a **button** to VoiceOver (tappable).
- When no tap action is available (delegate is `nil` or `shouldAllowTap` returns `false`), the alert announces as **static text**.
- Implement `shouldAllowTap` to correctly toggle the accessibility role between button and static text depending on context.
- Uses standard UIKit `accessibilityLabel` (not the web `a11yLabel` prop).

## Usage Example

```swift
let alert = LDAlert(dataModel: LDAlert.Model(
    message: NSAttributedString(string: "Test Alert Message"),
    messageType: .error
))
```
