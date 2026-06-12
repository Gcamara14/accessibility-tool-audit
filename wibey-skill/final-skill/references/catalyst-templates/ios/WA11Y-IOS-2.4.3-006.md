# Catalyst Template: Focus Order — VoiceOver Focus Not Restored After Modal Dismiss (`AccessibilityFocusManager`)

**Template ID:** `WA11Y-IOS-2.4.3-006`
**Platform:** iOS
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-IOS-2.4.3-006`
**Source Tickets:** CEPG-370357
**Source PRs:** [glass-app #158445](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/158445)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

In the Quick Start Basket (QSB) screen, a "View all" button opens a predictive cart modal. When the modal is dismissed, VoiceOver focus does not return to the "View all" button that originally opened it. Instead, focus lands at the top of the underlying screen.

Root cause: the `ctaButton` (`View all`) in `QuickStartBasketItemCell` had a generic `accessibilityIdentifier` (not unique per cell), and `AccessibilityFocusManager.saveAccessibilityFocus(of:)` was never called before the modal was presented. When the modal dismissed, `AccessibilityFocusManager.restoreAccessibilityFocus()` had no identifier to look up, so focus fell back to the screen's default first element.

Additionally, the `accessibilityIdentifier` was not unique across cells in the list — multiple "View all" buttons had the same identifier, making `findFocusTarget(in:)` unable to find the correct button even if focus had been saved.

**Symptom (Jira):** "VoiceOver focus goes to top of page after closing predictive cart", "View all modal loses focus position on dismiss", "Screen reader doesn't return to View All after closing cart modal", "QSB modal dismiss resets VoiceOver to beginning of page".

---

## ✅ The Fix Pattern

### Step 1 — Make `accessibilityIdentifier` unique per cell

```swift
// QuickStartBasketItemCell.swift

private func setupAccessibility() {
    // ✅ Append UUID to make identifier unique per cell instance
    //    AccessibilityFocusManager.findFocusTarget(in:) matches by exact ID string
    //    A generic ID like ".itemCardCtaButton" matches MULTIPLE cells → wrong button focused
    ctaButton.accessibilityIdentifier = .id(type: .itemCardCtaButton) + UUID().uuidString
    ctaButton.isAccessibilityElement = true
    header.accessibilityTraits.insert(.header)
}
```

---

### Step 2 — Save focus before presenting the modal

```swift
// QuickStartBasketItemCell.swift

@objc private func didTapCTAButton() {
    // ✅ Save the CTA button's unique accessibilityIdentifier before navigating
    //    so AccessibilityFocusManager can restore focus to this exact button on return
    if let accessibilityIdentifier = ctaButton.accessibilityIdentifier,
       accessibilityIdentifier.isNotEmpty {
        AccessibilityFocusManager.saveAccessibilityFocus(of: accessibilityIdentifier)
    }

    delegate?.didTapCTAButton(basketModel: basket)
}
```

---

### Step 3 — Restore focus on modal dismiss (in the presenting screen's coordinator/VC)

```swift
// In the view controller or coordinator that handles modal dismissal:

func predictiveCartModalDidDismiss() {
    // ✅ Restores VoiceOver focus to the last saved accessibilityIdentifier
    //    Traverses the window's view hierarchy to find the view with that ID
    //    Posts .screenChanged with that view as argument
    AccessibilityFocusManager.restoreAccessibilityFocus()
}
```

---

### `AccessibilityFocusManager` — platform utility reference

`AccessibilityFocusManager` is defined in `Platform/Modules/GlassUI/GlassUI/Accessibility/AccessibilityFocusManager.swift`:

```swift
// GlassUI / AccessibilityFocusManager.swift  (Platform utility — do not modify)

public enum AccessibilityFocusManager {

    /// Saves an accessibility identifier to restore later.
    /// Call right before navigating to a detail view or presenting a modal.
    /// No-op when VoiceOver is not running.
    public static func saveAccessibilityFocus(of accessibilityId: String) {
        guard isVoiceOverRunning else { return }
        accessibilityIds.append(accessibilityId)
    }

    /// Restores VoiceOver focus to the last saved accessibility identifier.
    /// Traverses window.rootViewController.view to find the view with the saved ID.
    /// Posts .screenChanged with the found view as argument.
    /// Call in viewDidAppear or in the modal dismiss completion handler.
    public static func restoreAccessibilityFocus(
        with notification: UIAccessibility.Notification = .screenChanged
    ) {
        guard isVoiceOverRunning else { return }
        guard let window = UIApplication.shared.delegate?.window
            ?? UIApplication.shared.activeWindow else { return }
        if let rootView = window.rootViewController?.view,
           let focusTarget = findFocusTarget(in: rootView) {
            UIAccessibility.post(notification: notification, argument: focusTarget)
        }
    }

    /// Variant for views not in window.rootViewController (e.g., a presented VC
    /// that dismissed another modal on top of itself).
    public static func restoreAccessibilityFocus(in view: UIView?) {
        guard isVoiceOverRunning, let view,
              let focusTarget = findFocusTarget(in: view)
        else { return }
        UIAccessibility.post(
            notification: .screenChanged,
            argument: focusTarget
        )
    }

    /// Removes the most recently saved accessibility ID without restoring focus.
    /// Use when the navigation that saved the ID was cancelled.
    public static func removeLastAddedAccessibilityFocus() { ... }
}
```

`findFocusTarget(in:)` recursively traverses the view hierarchy matching `view.accessibilityIdentifier` to the saved IDs. When found, it removes the ID from the list and returns the view.

---

### Full save/restore lifecycle

```
User taps "View all" button on QSB cell:
  1. didTapCTAButton() fires
  2. AccessibilityFocusManager.saveAccessibilityFocus(of: "itemCardCtaButton_<UUID>")
                                          ↑ unique ID appended in setupAccessibility
  3. delegate?.didTapCTAButton() → modal presented
  4. VoiceOver moves to modal content

User dismisses modal:
  5. predictiveCartModalDidDismiss() fires
  6. AccessibilityFocusManager.restoreAccessibilityFocus()
     → traverses rootView for "itemCardCtaButton_<UUID>"
     → finds the correct QSB cell's ctaButton
     → UIAccessibility.post(.screenChanged, argument: ctaButton)
     → VoiceOver announces "View all, button" and focuses it
```

---

### Why UUID-suffixed identifiers are required

If multiple cells share the same `accessibilityIdentifier`, `findFocusTarget(in:)` returns the **first matching view** it encounters in the traversal — which may not be the cell that was tapped. Appending `UUID().uuidString` guarantees the identifier is unique to the cell instance at the time of presentation.

```swift
// ❌ Generic identifier — matches multiple cells
ctaButton.accessibilityIdentifier = .id(type: .itemCardCtaButton)
// → findFocusTarget finds cell[0]'s button even if cell[3]'s button was tapped

// ✅ Unique per-instance identifier
ctaButton.accessibilityIdentifier = .id(type: .itemCardCtaButton) + UUID().uuidString
// → findFocusTarget finds exactly the cell that was tapped
```

The UUID is generated once in `setupAccessibility()` (called when the cell is configured) and remains stable for the cell's lifetime. It changes on cell reuse, but the new UUID is saved when the user next taps that cell.

---

### ❌ Bad Code — no save, generic identifier

```swift
// ❌ Before fix:
private func setupAccessibility() {
    ctaButton.accessibilityIdentifier = .id(type: .itemCardCtaButton)
    // ← Not unique → findFocusTarget finds wrong cell
    ctaButton.isAccessibilityElement = true
}

@objc private func didTapCTAButton() {
    // ← No saveAccessibilityFocus call
    delegate?.didTapCTAButton(basketModel: basket)
    // → Modal presented, VoiceOver moves to it
    // → On dismiss, restoreAccessibilityFocus finds no matching ID
    // → VoiceOver lands at top of QSB screen
}
```

---

### When to use `restoreAccessibilityFocus(in:)` instead

```swift
// Use restoreAccessibilityFocus(in:) when:
// — The presenting view controller dismissed a second modal (not from root hierarchy)
// — The view with the saved ID is in a presented VC's view, not window.rootViewController.view

func secondModalDidDismiss() {
    // The presenting VC's view is not window.rootViewController.view
    AccessibilityFocusManager.restoreAccessibilityFocus(in: self.view)
}
```

---

## 🔑 Key Rules

- **Always save focus with `AccessibilityFocusManager.saveAccessibilityFocus(of:)` before presenting a modal** — call it in the action handler right before `delegate?.` or navigation, not in `viewWillDisappear`.
- **Use unique `accessibilityIdentifier` per cell instance** — append `UUID().uuidString` to identifiers on reusable cells. A shared identifier causes `findFocusTarget` to match the wrong view in a list with multiple cells of the same type.
- **Restore focus in the dismiss completion handler or `viewDidAppear`** — the restore must happen after the presenting screen's view is fully in the hierarchy. `viewDidAppear` is the standard placement for `restoreAccessibilityFocus()`.
- **`AccessibilityFocusManager` is a no-op when VoiceOver is off** — `saveAccessibilityFocus` and `restoreAccessibilityFocus` both check `isVoiceOverRunning` and return early. No special guarding needed at call sites.
- **Call `removeLastAddedAccessibilityFocus()` if navigation is cancelled** — if the user's action does not result in a modal being presented (e.g., validation failed), the saved ID should be removed to avoid stale state.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation. When a modal is dismissed and VoiceOver focus is not restored to the control that opened it, the user's navigation context is broken. A sighted user dismisses the modal and sees the "View all" button — they instantly know where they are. VoiceOver users, without focus restoration, restart traversal from the top of the page and must find their previous position from scratch. `AccessibilityFocusManager` provides the platform mechanism for preserving this navigation context.
