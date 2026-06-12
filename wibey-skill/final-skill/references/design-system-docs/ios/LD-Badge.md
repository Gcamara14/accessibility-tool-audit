# LD Badge — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/badge/index.md`
**Class:** `LDBadge`
**Platform:** iOS (UIKit/Swift)

## Overview
LDBadge highlights an object to visually indicate count or status. Badges are not interactive. Inherits from `LDRootView`.

Use when:
- Notifying users that an item's status has meaningfully changed.
- Associating a numeric count with an item.

Don't use when:
- A non-numeric text label would be required. Consider `LDTag` instead.

Color: Badge color is not customizable; colors are chosen to communicate brand and support users with color blindness or other vision impairments.

## Swift API

### Initialization

```swift
// Designated initializer
LDBadge(dataModel: LDBadge.Model, appearance: Appearance)

// Convenience initializer
LDBadge(variant: Variant, value: Int?)
```

### Model (`LDBadge.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Variant` | The color combination used in the badge |
| `value` | `Int?` | The integer value to display on the badge |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance used for theming |
| `dataModel` | `Model` | Instance of view model |
| `value` | `Int?` | Current value to be displayed |

### Variants / Enums
- `enum Variant: Equatable` — Controls badge color styling. Cases not explicitly listed in source; see `Variant` enum.

## A11Y Notes
Badges are not interactive (`LDRootView` base, no tap handling). Badge color is fixed to support color-blind users. When associating a badge count with a parent element, the parent element's `accessibilityLabel` (UIKit standard) should incorporate the badge value so VoiceOver users receive the count information.

## Usage Example

```swift
let badge = LDBadge(
    dataModel: .init(text: "1", variant: .brand)
)
```
