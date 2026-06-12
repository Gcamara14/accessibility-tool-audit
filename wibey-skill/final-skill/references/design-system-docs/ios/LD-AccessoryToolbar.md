# LD AccessoryToolbar — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/accessory-toolbar/index.md`
**Class:** `LDAccessoryToolbar`
**Platform:** iOS (UIKit/Swift)

## Overview
Accessory toolbar used over keyboard for switching between textfields with controls like ❮, ❯, Done and Cancel. Inherits from `LDRootToolbar`.

## Swift API

### Initialization

```swift
// Designated initializer — prev/next/done layout: ❮ ❯ _____ Done
LDAccessoryToolbar(doneAction: () -> Void, prevAction: () -> Void, nextAction: () -> Void)

// Designated initializer — cancel/done layout: Cancel _____ Done
LDAccessoryToolbar(doneAction: () -> Void, cancelAction: () -> Void)
```

### Model (`Button: Int`)
| Enum | Notes |
|------|-------|
| `enum Button: Int` | AccessoryToolbar BarButtonItem Types. Do not use this directly. |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance used for theming |

### Actions
| Property | Type | Notes |
|----------|------|-------|
| `cancelAction` | `(() -> Void)?` | Executed when cancel is pressed |
| `doneAction` | `(() -> Void)?` | Executed when done is pressed |
| `prevAction` | `(() -> Void)?` | Executed when previous (❮) is pressed |
| `nextAction` | `(() -> Void)?` | Executed when next (❯) is pressed |

### Variants / Enums
- `enum Button: Int` — BarButtonItem types for internal use; do not use directly.

## A11Y Notes
No explicit accessibility properties documented in the source. The toolbar sits above the keyboard as an input accessory view; each button (Done, Cancel, ❮, ❯) should be reachable via VoiceOver using standard UIToolbar accessibility behavior. Ensure `doneAction` and `cancelAction` properly call `endEditing(true)` to dismiss the keyboard.

## Usage Example

```swift
// Cancel / Done layout (pickers, single text fields, text views)
textField.customAccessoryToolbar = LDAccessoryToolbar(doneAction: {
    log("Done")
    self.endEditing(true)
}, cancelAction: {
    log("Cancel")
    self.endEditing(true)
})

// Prev / Next / Done layout (consecutive text fields)
textField.setCustomAccessoryToolbar(doneAction: {
    log("done clicked")
}, prevAction: {
    log("prev clicked")
}, nextAction: {
    log("next clicked")
})
```
