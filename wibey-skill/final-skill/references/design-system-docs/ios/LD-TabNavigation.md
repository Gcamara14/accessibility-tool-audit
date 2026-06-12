# LD TabNavigation — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/tab-navigation/index.md`
**Class:** `LDTabNavigation`
**Platform:** iOS (UIKit/Swift)

## Overview
Use Tab Navigation to allow users to navigate easily between views within the same context. `fullWidth` — if set to true, each tab will stretch to fill the available width (useful for a small number of tabs). A value of false will align tabs to the left.

## Swift API

### Initialization
```swift
// Designated initializer
LDTabNavigation(dataModel: Model, appearance: Appearance)

// Convenience initializer
LDTabNavigation(segments: [Segment], selectedIndex: Int?)
```

### Model (`LDTabNavigation.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `segments` | `[Segment]` | List of segments to be displayed as tabs. |
| `selectedIndex` | `Int?` | Selected segment index. Keep in sync with list of segments. |
| `fullWidth` | `Bool` | Setting to true will stretch each tab to fill available width. |

### Segment (`LDTabNavigation.Segment`)
| Property | Type | Notes |
|----------|------|-------|
| `title` | `String` | Will display this text on the tab itself. |
| `icon` | `UIImage?` | Will display in the icon slot preceding the title. |
| `badge` | `LDBadge.Model?` | Will display after the text giving the formatting described in `LDBadge`. |

Segment designated init parameters:
- `title`: Title of the tab.
- `icon`: Optional leading icon for the tab.
- `badge`: Optional trailing badge.

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming. |
| `dataModel` | `Model` | View model to configure `LDTabNavigation`. Setting a new model immediately updates the UI. |
| `selectedIndex` | `Constants.defaultSelectedIndex` | Allows programmatic tab selection. Updates visual state, `dataModel.selectedIndex`, notifies delegate, and scrolls selected tab into view. A value of -1 or less indicates no selection. |

### Delegate / Callbacks
| Protocol / Property | Notes |
|---------------------|-------|
| `LDTabNavigationSelectionDelegate` | Delegate protocol for interactive selection events. |
| `delegate` | `LDTabNavigationSelectionDelegate?` — set to receive selection events. |
| `tabNavigation(didSelectItemAt:)` | Delegate method called when user selects a segment; provides `selectedSegmentIndex` value. |

### Accessor Methods
| Method | Notes |
|--------|-------|
| `viewForSegment(at index: Int) -> UIView?` | Returns the view for a specific segment. Intended for advanced use (e.g., attaching callouts). Do not modify the returned view directly. |

## A11Y Notes
- Standard iOS UIKit accessibility properties apply: `accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`.
- Each tab segment should have a meaningful `title` — this serves as the accessible label for VoiceOver users navigating tabs.
- Badges (`LDBadge.Model`) on tabs should convey count information; ensure the badge text is exposed via the segment's accessibility label or VoiceOver will not announce it.
- `selectedIndex` changes notify the delegate and update visual state — ensure hosting view controllers respond to selection changes to keep VoiceOver focus logical.

## Usage Example
```swift
let tabNav: LDTabNavigation = LDTabNavigation()
let dataModel = LDTabNavigation.Model(
    segments: [
        .init(title: "Fruits & Vegetables"),
        .init(title: "Frozen"),
        .init(title: "Meat", icon: LDIcon.menu),
        .init(title: "Dairy", badge: LDBadge.Model(text: "1", badgeStyle: .blue)),
        .init(title: "Electronics", icon: LDIcon.spark, badge: LDBadge.Model(text: "2", badgeStyle: .spark))
    ],
    fullWidth: true
)
tabNav.dataModel = dataModel
tabNav.delegate = self
```
