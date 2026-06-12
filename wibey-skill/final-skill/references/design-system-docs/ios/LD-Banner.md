# LD Banner — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/banner/index.md`
**Class:** `LDBanner`
**Platform:** iOS (UIKit/Swift)

## Overview
A Banner displays an important, succinct message to broad user-groups. Banners are system-generated (not user-generated) and require a user action to be dismissed. Inherits from `LDRootView`.

## Swift API

### Initialization

```swift
// Designated initializer
LDBanner(dataModel: LDBanner.Model, bannerDelegate: LDBannerDelegate?, appearance: Appearance)

// Convenience initializer
LDBanner(variant: Variant, text: String?)
```

### Model (`LDBanner.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `variant` | `Variant` | Variant of banner to be displayed |
| `text` | `String?` | Text to display in banner |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `dataModel` | `Model` | Modifier for the view model |
| `text` | `String?` | Text displayed in banner |

### Variants / Enums
- `enum Variant: Variant` — Types of `LDBanner` possible. Cases not explicitly listed in source; see `Variant` enum.

### Delegate / Callbacks

**Protocol: `LDBannerDelegate: AnyObject`**

| Method | Notes |
|--------|-------|
| `didCloseBanner(sender: LDBanner) -> Void` | Called when banner is closed via the close button |

### Actions
| Method | Notes |
|--------|-------|
| `closeTapped() -> Void` | Called when close button is tapped |

## A11Y Notes
Banners require a user action to be dismissed (close button). The close button should have an accessible label via the standard UIKit `accessibilityLabel`. Banners are system-generated; ensure the banner text conveys sufficient context without relying on color alone to communicate meaning (color-variant semantics).

## Usage Example

```swift
let banner = LDBanner(variant: .info, text: "This is an important notice.")
banner.dataModel = LDBanner.Model(variant: .info, text: "Updated message")
```
