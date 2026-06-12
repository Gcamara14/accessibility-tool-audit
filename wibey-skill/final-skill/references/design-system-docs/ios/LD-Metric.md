# LD Metric — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/metric/index.md`
**Class:** `LDMetric`
**Platform:** iOS (UIKit/Swift)

## Overview
Metric emphasizes a single, specific value that informs users of a critical data point. It allows users to identify meaningful changes and act on them. Leverage Metric to show point-in-time data, trends over time, key performance indicators, or progress against a goal.

## Swift API

### Initialization
```swift
// Designated initializer
LDMetric(dataModel: LDMetric.Model, appearance: Appearance)

// Convenience initializer
LDMetric(variant: Variant, title: String, value: String, unit: String?)
```

### Model (`LDMetric.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Variant` | Type of metric to be displayed |
| `title` | `String` | Title text |
| `scopeText` | `String?` | Optional time table for when the metric is relevant |
| `value` | `String` | String value to be displayed |
| `unit` | `String?` | Optional text indicating the units of the value |
| `direction` | `Direction?` | Optional indicator for if the metric is rising or falling |
| `trendText` | `String?` | Optional text to display next to the trend indicator |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `dataModel` | `Model` | Model of type `LDMetric.Model` to set all properties for the Metric view |

### Variants / Enums
- `enum Variant: Variant` — Metric types with associated trending color and icon. Cases include `.neutral`, `.positive` (seen in examples).
- `enum Direction` — Indicates if the metric is rising or falling (see Direction enum; cases not explicitly listed in source).

### Delegate / Callbacks
Not applicable.

## A11Y Notes
No explicit accessibility properties are documented in the source. Standard iOS UIKit accessibility applies: `accessibilityLabel`, `accessibilityHint`, and `isAccessibilityElement` should be configured by the consuming view controller as needed.

## Usage Example
```swift
// Designated initializer
let metric = LDMetric(
    dataModel: LDMetric.Model(
        variant: .neutral,
        title: "Test title string",
        scopeText: "Test scope string",
        value: "Test value string",
        unit: "Test unit string",
        trendText: "Test trend string"
    )
)

// Convenience initializer
let view = LDMetric(variant: .positive, title: "Sales", value: "$500")
```
