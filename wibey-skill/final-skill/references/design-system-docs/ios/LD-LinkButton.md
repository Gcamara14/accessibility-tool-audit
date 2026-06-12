# LD LinkButton — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/link-button/index.md`
**Class:** `LDLinkButton`
**Platform:** iOS (UIKit/Swift)

## Overview
Link buttons are used when designs call for a bit of underlined text to trigger an action. Link buttons can also display leading and trailing icons to help convey purpose to the action.

## Swift API

### Initialization
```swift
// Designated initializer
LDLinkButton(dataModel: Model, appearance: Appearance)

// Convenience initializer
LDLinkButton(size: Size, text: String?)
```

### Model (`LDLinkButton.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `size` | `Size` | Sets the size of the link button |
| `text` | `String?` | Sets the text to display |
| `variant` | `Variant` | Choose from a small set of variants that will adjust with theme changes |
| `width` | `Width` | Expands to full width with centered text, or uses smallest space available |
| `leadingImage` | `UIImage?` | Optional leading image |
| `trailingImage` | `UIImage?` | Optional trailing image |

**Designated init parameters:**
- `size`: Sizes available for link button
- `text`: Title text to display
- `textColor`: Optional override for text color (does not theme)
- `variant`: Choose from a set of possible usages (text, subtle, inverse)
- `width`: Should the button expand for full width or just be the width of the text + icons
- `leadingImage`: Optional leading image
- `trailingImage`: Optional trailing image

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for Theming |
| `dataModel` | `Model` | Model used for `LDLinkButton` |
| `size` | `Size` | Size of `LDLinkButton` |
| `text` | `String?` | Message text displayed in the `LDLinkButton` |
| `isEnabled` | `Bool` | Switch to a disabled state |
| `isHighlighted` | `Bool` | Force button into its highlighted state |

### Variants / Enums

#### `enum Variant: Variant`
Type of link button to display. Init docs note possible values include: `text`, `subtle`, `inverse` — see `Variant` enum for full case list.

#### `enum Width: Width`
Indicates if the button should fill the full width of the screen or not — see `Width` enum for full case list.

#### `enum Size: Size`
Sizes available for `LDLinkButton` — see `Size` enum for full case list.

### Delegate / Callbacks
None documented.

## A11Y Notes
- No explicit `accessibilityLabel` or `accessibilityHint` properties are documented in the source.
- The `text` property serves as the visible label — VoiceOver will use button text for its accessible name automatically via UIKit.
- When `leadingImage` or `trailingImage` are used alongside text, ensure the combination is still clearly understandable for VoiceOver users.
- `isEnabled` communicates disabled state to VoiceOver via UIKit's standard accessibility system.
- The `textColor` init parameter does not theme — be cautious of color contrast when overriding the default color.

## Usage Example
```swift
// Designated initializer
let button = LDLinkButton(
    dataModel: Model(size: .medium, text: "Link text")
)

// Convenience initializer
let button = LDLinkButton(size: .medium, text: "Link text")
```
