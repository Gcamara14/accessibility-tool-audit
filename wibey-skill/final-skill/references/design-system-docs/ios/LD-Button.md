# LD Button — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/button/index.md`
**Class:** `LDButton`
**Platform:** iOS (UIKit/Swift)

## Overview
The fundamental interactive component, adjusted primarily via `LDButton.Variant`. Inherits from `LDRootButton`.

Variants:
- **Primary** — The primary action on screen. Only one per screen.
- **Secondary** — Non-primary actions; medium "loudness."
- **Tertiary** — Lower-emphasis actions. Note: in LD 3.5, consider `LDLinkButton` instead.
- **Destructive** — Actions with dangerous or negative connotation.

Use when adding interaction to key behaviors: form submission, cancellation, resetting, closing containers, opening popovers, steppers, creating objects, applying non-critical actions.

## Swift API

### Initialization

```swift
// Designated initializer
LDButton(dataModel: LDButton.Model, appearance: Appearance)

// Convenience initializer
LDButton(variant: Variant, size: Size, text: String?)
```

### Model (`LDButton.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Variant` | Visual characteristics of the button |
| `size` | `Size` | Size of the button |
| `text` | `String?` | Text displayed in the button |
| `leadingImage` | `UIImage?` | Leading icon |
| `trailingImage` | `UIImage?` | Trailing icon |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object for theming |
| `dataModel` | `Model` | View model object; defaults to primary and small |
| `text` | `String?` | Changes the title text |
| `isEnabled` | `Bool` | Switches to a disabled state |
| `isHighlighted` | `Bool` | Forces button into highlighted state |
| `isSelected` | `Bool` | Not used in Living Design; no selected state provided, but can be overridden by a subsystem |
| `media` | `LDMediaAnimating` | Access to the spinner's animation view |
| `isAnimating` | `Bool` | Convenience toggle for animation status |

### Variants / Enums
- `enum Variant: Variant` — Determines button expression (`primary`, `secondary`, `tertiary`, `destructive`). Cases not explicitly listed in source; see `Variant` enum.
- `enum Size: Size` — Determines button size. Cases not explicitly listed in source; see `Size` enum.

## A11Y Notes
- Button text should be descriptive enough to convey the action without surrounding context.
- Destructive buttons should be clearly labeled so VoiceOver users understand the potentially negative consequence before activating.
- Use standard UIKit `accessibilityLabel` (not the web `a11yLabel` prop) to override the default label when the visible text is insufficient.
- `isEnabled = false` will communicate a disabled state to assistive technologies via UIKit's built-in accessibility traits.
- When `isAnimating = true` (loading spinner), consider updating `accessibilityLabel` to reflect the loading state.

## Usage Example

```swift
// Designated initializer
let button = LDButton(
    dataModel: Model(variant: .primary,
                     size: .large,
                     text: "Click me!",
                     leadingImage: LDIcon.check.image)
)

// Convenience initializer
let button = LDButton(variant: .primary, size: .large, text: "Click me!")
```
