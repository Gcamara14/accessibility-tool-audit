# Catalyst Template: Stale Accessibility Tree in Dynamic Notification / Nudge View

**Template ID:** `WA11Y-IOS-2.4.3-002`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 2.4.3 Focus Order
**Component:** `FloatingAddToOrderView` (Pharmacy RX Amends basket nudge)
**Source PR:** [#140485](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/140485) | [PGSPHARM-55747](https://jira.walmart.com/browse/PGSPHARM-55747) | File: `FloatingAddToOrderView.swift`
**Merged:** glass-app

---

## The Problem

A nudge card appears after the user adds an RX item to their delivery basket. On the **first** appearance, VoiceOver correctly focuses the **Edit** button after the images. On **every subsequent** add action, the same nudge view updates in-place (without being torn down), but VoiceOver skips the Edit button entirely. If the user manually navigates to Edit, VoiceOver becomes **trapped** cycling between Edit and Add to Order — neither forward nor backward swipe can exit.

**Root cause — two compounding issues:**

1. **Stale `accessibilityElements` cache.** After the nudge view updates its content, iOS caches the previous accessibility tree. The Edit button's accessibility node is present on first render but silently dropped from VoiceOver's traversal on subsequent renders because the container never re-signals a layout change. Posting `UIAccessibility.layoutChanged` (with a target element) forces iOS to re-evaluate the tree.

2. **Incorrect container `isAccessibilityElement = true`.** A parent container wrapping Edit + Add to Order has `isAccessibilityElement = true`. iOS promotes the container as a single VoiceOver element that internally cycles through its children — creating the trap. Setting `isAccessibilityElement = false` and providing an explicit `accessibilityElements` array on the nudge view fixes both the skip and the trap simultaneously.

**Expected reading order:** Heading label → Close button → Thumbnail images → **Edit order button** → Add to Order button

---

## The Fix Pattern

1. Set `isAccessibilityElement = false` on any container that wraps multiple interactive elements
2. Define an explicit `accessibilityElements` array on the nudge view with the correct traversal order
3. After every state update (each time the nudge content refreshes), call `UIAccessibility.post(notification: .layoutChanged, object: editButton)` to force VoiceOver to rebuild its tree starting at the Edit button

---

## Fix Patterns

### Pattern A: Real Diff — `FloatingAddToOrderView.swift` (PGSPHARM-55747 / PR #140485)

**Bad Code:**
```swift
class FloatingAddToOrderView: BaseView {
    func updateAccessibility() {
        // ❌ editButton and reviewItemsButton included even when successStack is visible
        // VoiceOver skips the success state content and lands on stale CTA buttons
        accessibilityElements = [timerView, previewStack, editButton, reviewItemsButton, addToOrderButton]
            .filter { !$0.isHidden }
    }
}
```

**Good Code:**
```swift
class FloatingAddToOrderView: BaseView {
    func updateAccessibility() {
        // ✅ successStack included; editButton/reviewItemsButton removed from explicit array
        // VoiceOver correctly traverses the success state when it is visible
        accessibilityElements = [timerView, previewStack, successStack].filter { !$0.isHidden }
    }
}
```

---

### Pattern B: Single `UIAccessibility.screenChanged` for Full Nudge Re-appearance

Use `screenChanged` (instead of `layoutChanged`) when the nudge is **dismissed and reshown** as a whole — not just updated in-place. `screenChanged` resets VoiceOver to the beginning of the new screen context, while `layoutChanged` preserves context and targets a specific element.

```swift
// Nudge dismissed then re-presented from scratch:
func presentNudge(with items: [RxItem]) {
    nudgeView.isHidden = false
    nudgeView.configure(with: items)
    nudgeView.configureAccessibility()

    // screenChanged: nudge is a new context; direct VoiceOver to the heading
    UIAccessibility.post(
        notification: .screenChanged,
        argument: nudgeView.headingLabel
    )
}

// Nudge updated in-place (same presentation, new items):
func updateExistingNudge(with items: [RxItem]) {
    nudgeView.configure(with: items)
    nudgeView.configureAccessibility()

    // layoutChanged: same context, just refreshing — direct to Edit button
    UIAccessibility.post(
        notification: .layoutChanged,
        argument: nudgeView.editButton
    )
}
```

---

### Pattern C: Re-evaluate `accessibilityElements` After `setNeedsLayout`

When the nudge view uses Auto Layout and its subview hierarchy changes (e.g., thumbnail count changes), `accessibilityElements` must be recomputed after layout pass:

```swift
func configure(with items: [RxItem]) {
    // Update thumbnail images (may add/remove subviews)
    updateThumbnails(items)

    // Force layout so subview references are valid before rebuilding accessibilityElements
    setNeedsLayout()
    layoutIfNeeded()

    // Rebuild accessibility tree with fresh subview references
    configureAccessibility()

    // Re-target VoiceOver at Edit button
    UIAccessibility.post(
        notification: .layoutChanged,
        argument: editButton
    )
}
```

---

### Pattern D: SwiftUI Dynamic Notification View

In SwiftUI, use `@AccessibilityFocusState` to programmatically drive focus to the Edit button after each state update:

```swift
struct RxNudgeView: View {
    let items: [RxItem]
    let onEdit: () -> Void
    let onAddToOrder: () -> Void

    @AccessibilityFocusState private var focusedField: FocusField?

    enum FocusField { case editButton }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text(NSLocalizedString("You have items to add", comment: ""))
                    .accessibilityAddTraits(.isHeader)
                Spacer()
                Button(action: { /* dismiss */ }) {
                    Image(systemName: "xmark")
                }
                .accessibilityLabel(NSLocalizedString("Close nudge", comment: ""))
            }

            ThumbnailRowView(items: items)
                .accessibilityElement(children: .contain)

            HStack {
                Button(NSLocalizedString("Edit order", comment: ""), action: onEdit)
                    .accessibilityFocused($focusedField, equals: .editButton)

                Button(NSLocalizedString("Add to order", comment: ""), action: onAddToOrder)
            }
        }
        .onChange(of: items) { _ in
            // ✅ Redirect focus to Edit button whenever items update
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                focusedField = .editButton
            }
        }
    }
}
```

---

## Why This Works

| Symptom | Root Cause | Fix |
|---|---|---|
| Edit button skipped on 2nd+ nudge update | `accessibilityElements` cache stale; no `layoutChanged` posted | Post `.layoutChanged` targeting `editButton` after every `configure()` call |
| Focus trapped between Edit + Add to Order | Container `UIView` has `isAccessibilityElement = true`, creating a cycling scope | Set `isAccessibilityElement = false` on container; define `accessibilityElements` on nudge root |
| Reading order: images appear after CTAs | No `accessibilityElements` defined; UIKit uses z-order | Explicit array: `[heading, close, thumbnails, edit, addToOrder]` |
| SwiftUI: focus doesn't redirect on update | No `@AccessibilityFocusState` binding | Drive `focusedField = .editButton` in `.onChange(of: items)` |

---

## Key Signals (For Pattern Matching)

Use this template when you see ANY of these in an iOS codebase:

- A VoiceOver-accessible element is reachable on **first interaction** but skipped on subsequent appearances of the same view
- A notification, toast, nudge card, or banner that updates in-place (not torn down and recreated)
- VoiceOver gets **trapped** cycling between two interactive elements in the same card
- A container wrapping multiple `UIButton` elements has `isAccessibilityElement = true`
- No `UIAccessibility.post(.layoutChanged)` call after a view's content is refreshed
- Desired reading order doesn't match what VoiceOver traverses (e.g., buttons before images)

---

## Var 1: Pharmacy RX Amends — `FloatingAddToOrderView` Stale Accessibility Tree (PGSPHARM-55747)

**Context:** The Pharmacy RX Amends basket nudge in glass-app. `FloatingAddToOrderView` is a floating action view that shows a timer, a preview stack of items, and action buttons including `editButton`, `reviewItemsButton`, `addToOrderButton`, and a `successStack` shown after the order is submitted. The explicit `accessibilityElements` array included stale CTA buttons (`editButton`, `reviewItemsButton`) even when `successStack` was visible, causing VoiceOver to read stale controls after order submission.

**Bad Code:**
```swift
class FloatingAddToOrderView: BaseView {
    func updateAccessibility() {
        // ❌ Includes editButton and reviewItemsButton even when successStack is showing
        // VoiceOver reads stale CTA buttons after order is submitted
        accessibilityElements = [timerView, previewStack, editButton, reviewItemsButton, addToOrderButton]
            .filter { !$0.isHidden }
    }
}
```

**Good Code:**
```swift
class FloatingAddToOrderView: BaseView {
    func updateAccessibility() {
        // ✅ successStack included; editButton/reviewItemsButton removed from explicit array
        // When successStack is visible, VoiceOver correctly traverses the success state
        accessibilityElements = [timerView, previewStack, successStack].filter { !$0.isHidden }
    }
}
```

**Why This Works:** By removing `editButton` and `reviewItemsButton` from the explicit `accessibilityElements` array and adding `successStack`, the accessibility tree always reflects the current visual state of the view. The `.filter { !$0.isHidden }` guard ensures that only visible elements are traversable — so when `successStack` is shown (and the CTA buttons hidden), VoiceOver correctly reads the success state rather than stale action buttons.

**Key Signals:** `FloatingAddToOrderView` in the Amends plugin; `accessibilityElements` array hardcoded with button references that may be hidden; VoiceOver reads stale "Edit" or "Review Items" buttons after order confirmation; `successStack` not included in the accessibility tree.

---

## Variations

| Var | Description | Status |
|---|---|---|
| Var 1 (PGSPHARM-55747 / PR #140485) | Pharmacy RX Amends — `FloatingAddToOrderView` stale `accessibilityElements` includes hidden CTA buttons; `successStack` missing from tree | Ingested |

---

## Decision Tree: `layoutChanged` vs `screenChanged`

```
Is the nudge view being shown for the first time / after being hidden?
├── YES → UIAccessibility.post(.screenChanged, argument: headingLabel)
└── NO (updating in-place) → UIAccessibility.post(.layoutChanged, argument: editButton)
```

---

## Related Templates

- `WA11Y-IOS-2.4.3-001` — iOS: Focus management after `UICollectionView` `reloadData()` (batch-updates fix)
- `WA11Y-IOS-4.1.2-004` — iOS: Button silenced by `isAccessibilityElement = true` on over-grouped container
- `WA11Y-IOS-4.1.2-003` — iOS: `accessibilityValue` state + `.layoutChanged` after toggle
- `WA11Y-WEB-2.4.3-004` — Web: Post-state-change focus with `useRef` + `useEffect`
