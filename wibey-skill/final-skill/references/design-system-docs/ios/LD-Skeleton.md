# LD Skeleton — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/skeleton/index.md`
**Class:** `LDSkeleton`
**Platform:** iOS (UIKit/Swift)

## Overview
Used to show a highlighted area as an alternative to a loading indicator. It is important to make the skeleton views appear similar to the structure after loading is complete. Use the size and shape values in the model to draw the views for your custom purpose.

## Swift API

### Initialization
```swift
// Designated initializer
LDSkeleton(dataModel: LDSkeleton.Model, appearance: Appearance)

// Convenience initializer
LDSkeleton(shape: Shape, size: CGSize)
```

### Model (`LDSkeleton.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `shape` | `Shape` | Uses corner radii provided from theming |
| `size` | `CGSize` | Specify the exact size to display; lays out using constraints |

### Properties
| Property | Type | Notes |
|----------|------|-------|
| `isAnimating` | `Bool` | Toggle used to start and stop the animation |
| `hidesWhenStopped` | `Bool` | Sets if the skeleton view should hide when animation is not running |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `dataModel` | `Model` | Sets the size and shape of the skeleton view |

### Variants / Enums
- `enum Shape: Shape` — Defines the shape of the skeleton view. Cases include `.rounded(.small)` (seen in examples; see Shape enum for all cases). Corner radius values come from the theme package and should not be overridden.

### Delegate / Callbacks
Not applicable.

## A11Y Notes
No explicit accessibility properties are documented in the source. Skeleton views are decorative loading placeholders and should typically have `isAccessibilityElement = false` so VoiceOver users are not presented with meaningless placeholder content. The consuming view should manage accessibility presentation during and after the loading state transitions.

## Usage Example
```swift
// Designated initializer
let skeleton = LDSkeleton(
    dataModel: LDSkeleton.Model(
        shape: .rounded(.small),
        size: CGSize(width: 150, height: 25)),
        isAnimating: true,
    )
)

// Convenience initializer
let skeleton = LDSkeleton(
    shape: .rounded(.small),
    size: CGSize(width: 150, height: 25),
    isAnimating: true
)
```
