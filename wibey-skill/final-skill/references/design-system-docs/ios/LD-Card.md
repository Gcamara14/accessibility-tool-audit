# LD Card — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/card/index.md`
**Class:** `LDCard`
**Platform:** iOS (UIKit/Swift)

## Overview
A vertical stack view with a custom shadowed background layer that creates the appearance of a card. Consumers can add custom content or action slots as needed. Inherits from `LDRootView`.

## Swift API

### Initialization

```swift
// Designated initializer
LDCard(dataModel: LDCard.Model, appearance: Appearance)

// Convenience initializer
LDCard(style: Size, headerModel: LDCard.Model.HeaderModel?)
```

### Model (`LDCard.Model`)
| Parameter | Type | Notes |
|-----------|------|-------|
| `style` | `Size` | Size of the card; defaults to `small` |
| `image` | `UIImage?` | Optional card image |
| `headerModel` | `HeaderModel?` | Optional header view model |
| `contentModel` | `ContentModel?` | Optional content slot view model |
| `actionModel` | `ActionModel?` | Optional action slot view model |

Sub-models documented in source via init parameters:
- `HeaderModel` — `icon`, `title`, `customView`
- `ContentModel` — `customView`
- `ActionModel` — `customView`

### Properties
| Property | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `dataModel` | `Model` | Model to set all properties for `LDCard` |

### Variants / Enums
- `enum Size: Size` — The style/width of the card relative to the screen. `small` adds `16px` inset; `large` adds `24px` inset. Cases not explicitly listed in source; see `Size` enum.

## A11Y Notes
- `LDCard` uses custom content and action slots (`customView`). Ensure any custom views placed in these slots have appropriate `accessibilityLabel` (UIKit standard) and `isAccessibilityElement` settings.
- The card itself is a container; avoid making the whole card a single accessibility element if it contains multiple interactive sub-elements.
- Uses standard UIKit `accessibilityLabel` (not the web `a11yLabel` prop).

## Usage Example

```swift
// Designated initializer
let card = LDCard(
    dataModel: .init(
        style: .small,
        image: LDIcon.spark.image,
        headerModel: .init(
            icon: .spark,
            title: "text",
            customView: UIView()
        ),
        contentModel: .init(customView: UIView()),
        actionModel: .init(customView: UIView())
    )
)

// Convenience initializer
let card = LDCard(style: .large, headerModel: .init(title: "header title"))
```
