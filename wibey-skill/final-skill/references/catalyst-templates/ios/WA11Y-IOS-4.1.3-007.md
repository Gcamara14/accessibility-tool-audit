# Catalyst Template: Status Messages — Guard Accessibility Layout-Change Notifications on Programmatic/Auto State Changes (`WCPQuantityStepper`)

**Template ID:** `WA11Y-IOS-4.1.3-007`
**Platform:** iOS
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-IOS-4.1.3-007`
**Source Tickets:** (WCPQuantityStepper component)
**Source PRs:** [glass-app #94936b4dd36c](https://gecgithub01.walmart.com/Walmart-iOS/glass-app)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`WCPQuantityStepper` transitions between two visual states: a `.stepper` layout (increment/decrement buttons visible) and a `.pill` layout (compact single-button display). When the quantity reaches zero, the component **auto-collapses** from `.stepper` to `.pill` programmatically — this is a visual convenience, not a user action.

The original implementation posted a `UIAccessibility.post(notification: .layoutChanged, ...)` notification on **every** `.stepper` → `.pill` transition, including auto-collapse. This had an unintended effect: VoiceOver focus was forcibly moved to the stepper component whenever a quantity dropped to zero — even if the user was reading an entirely different part of the screen.

**Scenario:** User is reading product descriptions with VoiceOver. The cart updates in the background and an item's quantity auto-decrements to zero. The stepper auto-collapses from `.stepper` to `.pill`. VoiceOver focus jumps to the stepper, interrupting the user's current position.

**Symptom:** "VoiceOver focus jumps to quantity stepper unexpectedly", "Screen reader interrupted by stepper collapse", "Focus moves to Add to Cart button when I didn't tap anything", "Quantity stepper interrupts VoiceOver reading on cart screen".

---

## ✅ The Fix Pattern

### Guard the `.layoutChanged` notification: skip if the transition is auto-collapse

```swift
// WCPQuantityStepper.swift  (Living Design component)

private var state: State = .pill(model: .init()) {
    didSet {
        guard oldValue != state else { return }
        updateUI(for: state)

        // ✅ Only post .layoutChanged when transitioning OUT of stepper to pill
        //    IF the pill is not auto-collapsing. Auto-collapse (quantity → 0) is
        //    a programmatic state change — do not steal VoiceOver focus.
        if case .pill = state,
           case .stepper = oldValue,
           case .pill(let pillModel) = state,
           !pillModel.isAutoCollapsed {
            postAccessibilityLayoutChanged(argument: mainButton)
        }

        // Post .layoutChanged when transitioning INTO stepper (user tapped "Add")
        if case .stepper = state, case .pill = oldValue {
            postAccessibilityLayoutChanged(argument: decrementButton)
        }
    }
}
```

---

### `isAutoCollapsed` — what it means and where it comes from

```swift
// WCPQuantityStepper+Model.swift

extension WCPQuantityStepper {
    public struct PillModel {
        public let title: String
        public let icon: WCPIcon?
        // ...

        /// `true` when the pill state was triggered by quantity reaching zero
        /// (auto-collapse), not by a direct user interaction.
        /// Used to suppress .layoutChanged notifications that would steal VoiceOver focus.
        public var isAutoCollapsed: Bool

        public init(
            title: String,
            icon: WCPIcon? = nil,
            // ...
            isAutoCollapsed: Bool = false  // ← callers set true when qty = 0
        ) {
            self.title = title
            self.isAutoCollapsed = isAutoCollapsed
            // ...
        }
    }
}
```

The caller sets `isAutoCollapsed: true` when programmatically collapsing the stepper (e.g., cart quantity reaching zero):

```swift
// CartItemCell.swift or equivalent

func updateQuantity(_ quantity: Int) {
    if quantity == 0 {
        // ✅ Auto-collapse: suppress .layoutChanged so VoiceOver focus is not stolen
        stepper.state = .pill(model: .init(title: addToCartTitle, isAutoCollapsed: true))
    } else {
        // ✅ User-initiated: allow .layoutChanged to report the state change
        stepper.state = .stepper(model: .init(quantity: quantity))
    }
}
```

---

### ❌ Bad Code — posts `.layoutChanged` on all stepper→pill transitions

```swift
// ❌ Before fix:
private var state: State = .pill(model: .init()) {
    didSet {
        guard oldValue != state else { return }
        updateUI(for: state)

        // ← Posts .layoutChanged on ALL stepper→pill transitions
        // ← Includes auto-collapse (quantity=0) triggered by background cart updates
        // ← VoiceOver focus stolen from wherever user was reading
        if case .pill = state, case .stepper = oldValue {
            postAccessibilityLayoutChanged(argument: mainButton)
        }
        if case .stepper = state, case .pill = oldValue {
            postAccessibilityLayoutChanged(argument: decrementButton)
        }
    }
}
// PillModel had no isAutoCollapsed property — no way to distinguish intent
```

---

### The four state transitions and their notification policy

| Transition | Triggered by | Post `.layoutChanged`? | Reason |
|---|---|---|---|
| `.pill` → `.stepper` | User taps "Add" button | ✅ Yes | User action — move focus to decrement button so user can adjust |
| `.stepper` → `.pill` (user-initiated) | User decrements to zero with button | ✅ Yes | User action — acknowledge the transition |
| `.stepper` → `.pill` (auto-collapse) | `isAutoCollapsed: true` | ❌ No | Programmatic — do NOT interrupt VoiceOver |
| `.pill` → `.pill` (model update) | Data refresh | ❌ No | No structural change |

---

### Distinguishing user-initiated vs. programmatic state changes

This pattern applies broadly beyond `WCPQuantityStepper`. Any component that changes state both from user interaction and programmatically must distinguish the two:

```swift
// General pattern for suppressing notifications on programmatic state changes:

enum StateChangeReason {
    case userInitiated
    case programmatic
}

private func setState(_ newState: State, reason: StateChangeReason) {
    let old = state
    state = newState
    if reason == .userInitiated {
        postAccessibilityNotification(for: old, new: newState)
    }
    // programmatic changes: no notification → VoiceOver focus not disturbed
}
```

For `WCPQuantityStepper` specifically, `isAutoCollapsed` on `PillModel` serves as the `reason` flag embedded in the model.

---

### Why `.layoutChanged` steals focus (and when to use it)

`UIAccessibility.post(notification: .layoutChanged, argument: view)` does two things:
1. Tells VoiceOver "the layout has changed — rescan elements"
2. **Moves VoiceOver focus to `view`** (the `argument`)

For user-initiated transitions (user tapped "Add"), moving focus to the decrement button is correct — the user just added an item and should be able to immediately adjust quantity.

For programmatic transitions (cart background update auto-collapses stepper), moving focus is wrong — the user is doing something else. The VoiceOver interrupt is disorienting and violates 4.1.3 (status messages should not require focus).

**Rule:** Only post `(notification: .layoutChanged, argument: view)` when the state change resulted from a **direct user action in the current context**. Background updates, auto-state management, and data-driven transitions must not post `.layoutChanged` with a view argument.

---

## 🔑 Key Rules

- **Never post `.layoutChanged` for programmatic/automatic state changes** — if a component collapses, expands, or changes state due to data updates or background logic (not a direct user tap), do not post `.layoutChanged` with a view argument. VoiceOver focus must not be stolen from the user's current position.
- **Use an `isAutoCollapsed` (or equivalent) flag on the model** — embed the intent of the state change in the model data so the component can distinguish user-initiated from programmatic transitions without needing extra parameters.
- **Post `.layoutChanged` only for user-initiated transitions in the current interaction** — when the user taps "Add" and the stepper expands, posting `.layoutChanged(argument: decrementButton)` correctly moves focus to the new interactive element.
- **Apply this pattern to all auto-collapsing, auto-expanding, or auto-updating components** — any `didSet` or state observer that unconditionally posts `.layoutChanged` is a potential focus-theft site. Audit all such sites when VoiceOver focus unexpectedly moves.
- **Test with VoiceOver active during background data refreshes** — simulate a cart update while reading elsewhere on screen and verify that VoiceOver focus does not jump to the stepper.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus. When a stepper auto-collapses due to a programmatic state change and `.layoutChanged` is posted with a view argument, VoiceOver focus is forcibly moved — the user does receive focus on the component. This violates the spirit of 4.1.3, which requires that status information (including state transitions) be communicated *without* moving focus. The auto-collapse transition is not triggered by the user and does not require their attention; posting it as a focus-moving notification interrupts the user's current reading position for no informational benefit.

