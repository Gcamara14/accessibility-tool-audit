# LD Callout — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/callout/index.md`
**Class:** `LDCallout`
**Platform:** iOS (UIKit/Swift)

## Overview
Use a Callout to display system-generated onboarding or other coaching content targeted at a specific, interactive interface element. Inherits from `LDRootView`.

Use when coaching users on product features or the usage of an interface element.

Do not use when:
- The message contains information required for the user to complete their current task.
- Displaying general information not related to coaching.
- The information does not relate to a particular interface element.
- Displaying information as the result of interaction with an interface element.

## Swift API

### Initialization

```swift
// Designated initializer
LDCallout(
    model: LDCallout.Model,
    sourceView: UIView,
    parentView: UIView,
    delegate: LDCalloutViewDelegate?,
    appearance: Appearance
)
```

Parameters:
- `model` — Describes the desired style of the callout view.
- `sourceView` — The `UIView` the callout tip will point to.
- `parentView` — A view in the `sourceView`'s superview hierarchy. Pass the view controller's view (recommended) to display within the main window.
- `delegate` — Set to receive event updates.
- `appearance` — Object used for theming.

### Model (`LDCallout.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `text` | `String` | Text displayed in the callout |
| `closeButtonText` | `String` | Text displayed on the close button |
| `preferredArrowDirection` | `ArrowDirection` | Preferred arrow direction of the callout |
| `visibilityThreshold` | `ViewVisibilityThreshold` | Preferred visibility threshold; default is `half` |
| `dismissBehavior` | `DismissBehavior` | How the callout is dismissed; default is `automatic` |
| `closeAccessibilityLabel` | `String?` | `accessibilityLabel` for the close button |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used for theming |
| `model` | `Model` | View model used to build the callout |

### Variants / Enums

**`enum ArrowDirection: ArrowDirection`** — Direction of the callout arrow:
| Case | Description |
|------|-------------|
| `top` | Arrow pointing upward, centered |
| `topLeft` | Arrow pointing upward, left-aligned |
| `topRight` | Arrow pointing upward, right-aligned |
| `bottom` | Arrow pointing downward, centered |
| `bottomLeft` | Arrow pointing downward, left-aligned |
| `bottomRight` | Arrow pointing downward, right-aligned |
| `right` | Arrow pointing right |
| `left` | Arrow pointing left |
| `any` | Defaults to arrow upward |

**`enum DismissBehavior: DismissBehavior`** — How the callout can be dismissed:
- `automatic` (default) — dismissed when scrolled away or removed from a window.
- Cases for user-only dismissal also available; see `DismissBehavior` enum.

### Delegate / Callbacks

**Protocol: `LDCalloutViewDelegate: AnyObject`**

| Method | Notes |
|--------|-------|
| `calloutViewDidAppear() -> Void` | Callout view appeared |
| `didTapCloseButton() -> Void` | Called on dismissal via close button |
| `didTapOnCallout() -> Void` | Called on tap of the callout body |
| `didAutoDismiss() -> Void` | Called when the callout auto-dismisses |

**Modifier:**
| Property | Type | Notes |
|----------|------|-------|
| `delegate` | `LDCalloutViewDelegate?` | Delegate to receive callbacks on callout dismissal and interaction |

### Actions
| Method | Notes |
|--------|-------|
| `showCalloutView() -> Void` | Setup and display the callout tip view from the reference view |
| `dismissCallout() -> Void` | Dismiss the callout |

## A11Y Notes
- `closeAccessibilityLabel: String?` — explicitly sets the UIKit `accessibilityLabel` for the close button. Set this to a localized string (e.g., "Close coaching tip") so VoiceOver announces a meaningful label rather than the default button title.
- When `dismissBehavior` is not `automatic`, the user must tap the close button to dismiss — ensure `closeAccessibilityLabel` is always provided in this case.
- Callouts point to a `sourceView`; VoiceOver focus should logically flow to the callout when it appears. Consider managing VoiceOver focus via `UIAccessibility.post(notification:argument:)` after calling `showCalloutView()`.
- Uses standard UIKit `accessibilityLabel` (not the web `a11yLabel` prop).

## Usage Example

```swift
let calloutView = LDCallout(
    model: .init(
        text: "Callout message",
        preferredArrowDirection: self.direction
    ),
    sourceView: self.button,
    parentView: self.parentView,
    delegate: nil
)
calloutView.showCalloutView()
```
