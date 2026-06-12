# LD Checkbox — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/checkbox/index.md`
**Class:** `LDCheckbox`
**Platform:** iOS (UIKit/Swift)

## Overview
Complex icon used for checkbox throughout the app. Implements `LDMediaProtocol`, which is used to display complex icons that use multiple colors.

## Swift API

### Initialization
The source does not document explicit initializer parameters for `LDCheckbox` beyond the class declaration.

### Model
No `Model` struct documented in the source for this component.

### Modifiers
No modifiers explicitly documented in the source for this component.

### Variants / Enums
No variant enums documented in the source for this component.

### Delegate / Callbacks
No delegate or callbacks documented in the source for this component.

## A11Y Notes
- `LDCheckbox` implements `LDMediaProtocol` for multi-color complex icon rendering. It functions as a visual icon, not a standalone interactive control.
- When used as part of a selectable item, the parent interactive element should carry the `accessibilityLabel` (UIKit standard), `accessibilityTraits` (e.g., `.button` or custom selection traits), and `accessibilityValue` (e.g., "checked" / "unchecked") — not the checkbox icon itself.
- Uses standard UIKit `accessibilityLabel` (not the web `a11yLabel` prop).

## Usage Example

```swift
// Source does not provide an explicit usage example.
// LDCheckbox is a complex icon component via LDMediaProtocol.
let checkbox = LDCheckbox()
```
