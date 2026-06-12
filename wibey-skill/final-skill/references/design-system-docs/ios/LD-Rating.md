# LD Rating — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/rating/index.md`
**Class:** `LDRating`
**Platform:** iOS (UIKit/Swift)

## Overview
Ratings provide insight into how well a product or service has been received by those who have bought or used it previously.

## Swift API

### Initialization
```swift
// Designated initializer
LDRating(dataModel: LDRating.Model)

// Convenience initializer
LDRating(size: Size, rating: Double)
```

### Model (`LDRating.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `size` | `Size` | The style of stars to be displayed |
| `rating` | `Double` | The rating corresponding to the active stars |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `dataModel` | `Model` | Data model for Rating view set up |

### Variants / Enums
- `enum Size: Size` — Rating size; sets the icon to size 12 or 21 px (see Size enum for all cases; examples show `.large`).

### Delegate / Callbacks
Not applicable.

## A11Y Notes
No explicit accessibility properties are documented in the source. Standard iOS UIKit accessibility applies: `accessibilityLabel`, `accessibilityHint`, and `isAccessibilityElement` should be configured by the consuming view. The numeric `rating` value should be surfaced via `accessibilityLabel` or `accessibilityValue` so VoiceOver users receive the rating information.

## Usage Example
```swift
// Designated initializer
let rating: LDRating = LDRating(
    dataModel: Model(size: .large, rating: 3.5)
)

// Convenience initializer
let rating: LDRating = LDRating(size: .large, rating: 3.5)
```
