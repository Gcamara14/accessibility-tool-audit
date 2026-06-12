# LD Divider — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/divider/index.md`
**Class:** `LDDivider`
**Platform:** iOS (UIKit/Swift)

## Overview
A divider is a thin line that groups content in lists and layouts.

- When used horizontally within a card, Dividers span the entire width of the card, minus the card padding.
- Horizontal Dividers that delineate list items, when used outside of a card, can span the entire width of the containing element.
- In nested lists, horizontal Dividers are inset from the left margin.

**Use when:**
- Visual breaks between content or sections of content would enhance the flow of information or the customer's understanding of hierarchy and relationship between page elements.

**Don't use when:**
- Page elements are naturally associated or when additional space might suffice.
- The end of a content block is reached if the shift in content is a sufficient prompt for the user.

## Swift API

### Initialization
```swift
// Designated initializer
LDDivider(frame: CGRect, dataModel: LDDivider.Model)

// Convenience initializer
LDDivider(style: DividerStyle)
```

### Model (`LDDivider.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `style` | `DividerStyle` | Divider style (horizontal or vertical) |

**Designated init parameters:**
- `style`: Divider style (horizontal or vertical)

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for Theming |
| `dataModel` | `Model` | Data model for setting divider style |
| `style` | `DividerStyle` | Divider style (horizontal or vertical) |

### Variants / Enums

#### `enum DividerStyle: DividerStyle`
Describes the use for `LDDivider`. The convenience initializer example shows `.horizontal` and `.vertical(5.0)` — see `DividerStyle` enum for full case list.

### Delegate / Callbacks
None documented.

## A11Y Notes
- Dividers are decorative by nature. In UIKit, decorative views should typically have `isAccessibilityElement = false` so VoiceOver skips them.
- No accessibility-specific properties are documented in the source.

## Usage Example
```swift
// Designated initializer
let divider = LDDivider(frame: .zero, dataModel: LDDivider.Model(style: .horizontal))

// Convenience initializer
let divider = LDDivider(style: .vertical(5.0))
```
