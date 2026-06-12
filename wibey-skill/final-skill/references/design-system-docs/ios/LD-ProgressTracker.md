# LD ProgressTracker — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/progress-tracker/index.md`
**Class:** `LDProgressTracker`
**Platform:** iOS (UIKit/Swift)

## Overview
Progress Trackers show the steps of a process and highlight the current, completed, and future steps. It can also have a state used to indicate warnings related to the process or completion of the process. It is a good fit for a process with three to six well-defined steps. Each step requires a short text label to describe the action or task being completed.

Has a segmented or linear presentation style. Segmented style depicts tickmarks at equal intervals with optional text labels. Tick marks are determined by the `tickMarkTitles` array.

## Swift API

### Initialization
```swift
// Designated initializer
LDProgressTracker(dataModel: LDProgressTracker.Model, appearance: Appearance)

// Convenience initializer
LDProgressTracker(variant: Variant, tickMarkTitles: [String], progress: Int)
```

### Model (`LDProgressTracker.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Variant` | Type of progress to indicate |
| `progress` | `Int` | Index of the currently selected tick mark |
| `announceProgressOnVoiceOver` | `Bool` | Will announce progress changes to VoiceOver users |
| `tickMarkTitles` | `[String]` | Title text to show at each tick mark |
| `showHighlightedLabelOnly` | `Bool` | Specify if all other labels should be hidden |
| `showCurrentPositionRing` | `Bool` | Specify if the selected tick should have a large position ring around it |
| `shouldWrapText` | `Bool` | Specify if the labels should wrap to multiple lines |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `dataModel` | `Model` | View model for `LDProgressTracker` |
| `tickMarkTitles` | `[String]` | Titles displayed beneath each tick mark; excess titles beyond `maxTickMarkCount + 1` are ignored |
| `progress` | `Int` | Current progress value; automatically clamped between 0 and `maxTickMarkCount` |

### Variants / Enums
- `enum Variant: Equatable` — Supports styling of the ProgressTracker. Cases include `.information`, `.success` (seen in examples; see Variant enum for all cases).

### Constants
| Constant | Notes |
|----------|-------|
| `maxTickMarkCount` | Maximum possible number of tick marks (initial tick mark at position 0 not included) |

### Delegate / Callbacks
Not applicable.

## A11Y Notes
The source documents a dedicated `announceProgressOnVoiceOver: Bool` model property that, when `true`, causes the component to announce progress changes to VoiceOver users. This is a first-class accessibility feature built into the component.

The `constructSubviewHierarchy` internal method also sets up accessibility properties for tick mark labels when the subview hierarchy is built.

Standard iOS UIKit properties (`accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`) apply at the view level.

## Usage Example
```swift
// Designated initializer
let model = LDProgressTracker.Model(
    variant: .information,
    progress: 2,
    announceProgressOnVoiceOver: true,
    tickMarkTitles: ["Start", "Middle", "End"],
    showHighlightedLabelOnly: false,
    showCurrentPositionRing: true,
    shouldWrapText: true
)
let tracker = LDProgressTracker(dataModel: model)

// Convenience initializer
let tracker = LDProgressTracker(
    variant: .success,
    tickMarkTitles: ["Step 1", "Step 2", "Step 3", "Step 4"],
    progress: 1
)
```
