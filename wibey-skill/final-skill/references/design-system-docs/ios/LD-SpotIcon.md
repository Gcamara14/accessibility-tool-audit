# LD SpotIcon — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/spot-icon/index.md`
**Class:** `LDSpotIcon`
**Platform:** iOS (UIKit/Swift)

## Overview
Spot Icons are decorative elements that add visual interest to messaging or other screen elements such as list items.

## Swift API

### Initialization
```swift
// Designated initializer
LDSpotIcon(dataModel: Model(variant: .brand, size: .large, icon: LDIcon.home.image))

// Convenience initializer
LDSpotIcon(variant: .brand, size: .large, icon: LDIcon.home.image)
```

### Model (`LDSpotIcon.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Variant` | Either brand colors or neutral colors. |
| `size` | `Size` | Size for the Spot Icon element. |
| `icon` | `UIImage` | Icon to be featured in the middle of the Spot Icon element. |

### Variants / Enums
| Enum | Notes |
|------|-------|
| `Variant` | Provides two variants: brand version and neutral version. Cases not explicitly listed in source — see `Variant` enum. |
| `Size` | Determines the size of the Spot Icon. Cases not explicitly listed in source — see `Size` enum. |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming. |
| `dataModel` | `Model` | DataModel for `LDSpotIcon` UI setup. |

## A11Y Notes
- Spot Icons are described as decorative elements. When used purely decoratively, set `isAccessibilityElement = false` so VoiceOver ignores them.
- Standard iOS UIKit accessibility properties apply: `accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`.
- If a Spot Icon conveys meaningful context (e.g., status), set `isAccessibilityElement = true` and provide a descriptive `accessibilityLabel`.

## Usage Example
```swift
// Designated initializer
let icon = LDSpotIcon(dataModel: LDSpotIcon.Model(variant: .brand, size: .large, icon: LDIcon.home.image))

// Convenience initializer
let icon = LDSpotIcon(variant: .brand, size: .large, icon: LDIcon.home.image)

// Decorative usage — hide from VoiceOver
icon.isAccessibilityElement = false
```
