# LD BottomSheet — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/bottom-sheet/index.md`
**Class:** `LDBottomSheetNavigationController`
**Platform:** iOS (UIKit/Swift)

## Overview
A container view controller that adopts the `LDBottomSheetable` protocol and defines a stack-based scheme for navigating hierarchical content. Any view controller wishing to be displayed inside the bottom sheet **must** implement `LDBottomSheetable`. Inherits from `LDRootNavigationViewController`.

## Swift API

### Initialization

```swift
// Designated initializer
let rootViewController = LDBottomSheetableViewController()
let nav = LDBottomSheetNavigationController(rootBottomSheet: rootViewController)
presentingViewController.present(bottomSheet: nav, as: .modal)
```

> Do **not** present `LDBottomSheetNavigationController` as `.child` — this presentation style is experimental and may have unexpected effects.

### Protocol: `LDBottomSheetable`

Any view controller presented inside the bottom sheet must conform to `LDBottomSheetable`. The protocol provides configuration properties — most have default values; essential ones must be provided.

| Property / Method | Type | Notes |
|-------------------|------|-------|
| `maxBottomSheetHeight` | `CGFloat` | Max height of the bottom sheet. Default: `LDBottomSheetDefaults().maxHeight(isEmbeddedInNav:)` |
| `startingTier` | `LDBottomSheetTier` | Starting tier for tiered presentations. Default: `.minimum`. Only needed for tiered presentations. |
| `tiersType` | `LDBottomSheetTierType` | Defines snapping tiers. Example: `.oneHeight(300)`. Use `oneTierAutomatic` to auto-size from constraints. |
| `verticalScrollViews` | `[UIScrollView]` | Scroll views inside the content that the bottom sheet should be aware of |
| `backgroundColor` | `UIColor` | Background color override. Default: `.white` |
| `shouldHideGrabber` | `Bool` | Whether to hide the grab handle. Default: `false` |
| `isKeyboardObserver` | `Bool` | Whether to internally adjust for keyboard presentation. Default: `true` |
| `dismissCompletion()` | `func` | **Must** be implemented to handle taps outside the bottom sheet |

### Variants / Enums
- `LDBottomSheetTier` — Defines tier snapping points. Default starting tier: `.minimum`.
- `LDBottomSheetTierType` — Defines the tier configuration (e.g., `.oneHeight(_:)`, `.oneTierAutomatic`).

## A11Y Notes
- `dismissCompletion()` must be implemented; without it, taps outside the sheet will not be handled and the sheet may become undismissable, blocking VoiceOver focus from reaching content behind it.
- When using `isKeyboardObserver: true`, the sheet adjusts for keyboard presentation — important for forms and text input within the sheet.
- `shouldHideGrabber: false` (default) keeps the drag handle visible, providing a tactile affordance; hiding it may reduce discoverability.
- Uses standard UIKit `accessibilityLabel` and related properties (not the web `a11yLabel` prop).

## Usage Example

```swift
let rootViewController = LDBottomSheetableViewController()
let nav = LDBottomSheetNavigationController(rootBottomSheet: rootViewController)
presentingViewController.present(bottomSheet: nav, as: .modal)
```
