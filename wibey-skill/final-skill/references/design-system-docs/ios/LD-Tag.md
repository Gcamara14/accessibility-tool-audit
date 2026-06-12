# LD Tag — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/tag/index.md`
**Class:** `LDTag`
**Platform:** iOS (UIKit/Swift)

## Overview
Tags are used to draw a customer's focus to item traits such as availability, status, or media rating. Items may be products, fulfillment slots, or something else. They are visual only and non-interactive.

Use Tags to call out an attribute of an item, status, or group that an item belongs to. Tag content should be short — a few words maximum.

There are three Tag variants with increasing levels of visual prominence and several color options.

Guidelines:
- Do consider the meaning of color and choose Tags that reinforce the meaning.
- Do not apply interactions to Tags — they are static elements. Consider using `LDButton` instead.
- Do not replace copy with an icon or use an icon alone.

## Swift API

### Initialization
```swift
// Designated initializer
LDTag(
    dataModel: LDTag.Model(
        style: .primary,
        variant: .brand,
        text: "Tag Text",
        icon: LDIcon.barcode.image
    )
)

// Convenience initializer (creates tag using brand colors)
LDTag(text: "Tag Text")
```

### Model (`LDTag.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `style` | `Style` | Sets the style of the tag. |
| `variant` | `Variant` | Sets the color variant for the tag. |
| `text` | `String?` | Sets the text to display. If nil, ensure an icon is set. |
| `icon` | `UIImage?` | Optionally sets the icon for the tag. If nil, ensure text is set. |

### Variants / Enums
| Enum | Notes |
|------|-------|
| `Style` | Style of tag. Cases not explicitly listed in source — see `Style` enum. |
| `Variant` | Color variant for tag. Cases not explicitly listed in source — see `Variant` enum. |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming. |
| `dataModel` | `Model` | View model used to configure `LDTag`. |
| `text` | `String?` | Text to display. |
| `icon` | `UIImage?` | Optional icon to display. |

## A11Y Notes
- Tags are static, non-interactive elements. Standard iOS UIKit accessibility properties apply: `accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`.
- Because tags convey meaningful status/attribute information, `isAccessibilityElement` should generally be `true`.
- If a tag uses only an icon (no text), provide an `accessibilityLabel` that describes the icon's meaning — the source warns against icon-only usage for this reason.
- When tags appear alongside product or content items, consider whether the tag label should be part of the parent element's `accessibilityLabel` to reduce VoiceOver navigation steps.

## Usage Example
```swift
// Default initializer
let tag = LDTag(
    dataModel: LDTag.Model(
        style: .primary,
        variant: .brand,
        text: "New",
        icon: LDIcon.barcode.image
    )
)

// Convenience initializer
let tag = LDTag(text: "On Sale")
```
