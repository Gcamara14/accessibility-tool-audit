# Catalyst Template: Focus Order — Bottom Sheet Gesture Dismiss Does Not Restore VoiceOver Focus (Missing `dismissCompletion()` Implementation)

**Template ID:** `WA11Y-IOS-2.4.3-007`
**Platform:** iOS
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-IOS-2.4.3-007`
**Source Tickets:** CEPG-342789
**Source PRs:** [glass-app #154601](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/154601)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`SubscriptionIncentivesViewController` displays a bottom sheet. When a VoiceOver user dismisses it via the explicit close button, focus correctly returns to the "See Terms" button that opened it. When the user dismisses via **swipe down** or **backdrop tap** (gesture-based dismissal), VoiceOver focus lands on the back navigation button — the wrong element.

Root cause: `SubscriptionIncentivesViewController` conformed to `BottomSheetable` but did **not** override `dismissCompletion()`. The `BottomSheetable` protocol has a default no-op implementation for `dismissCompletion()`. The bottom sheet container calls `dismissCompletion()` when the sheet is dismissed via gesture — but without an override, the call was swallowed and the coordinator's `onFinish` callback (which contains `restoreVoiceOverFocus()`) was never triggered.

Additionally, the coordinator's `finish()` method called `dismiss(animated: true)` unconditionally, which caused a crash/double-dismiss when called during a gesture-driven dismissal (the sheet was already mid-dismissal).

**Symptom (Jira):** "VoiceOver focus goes to back button after swipe-dismiss of subscription sheet", "Screen reader loses position when bottom sheet is dismissed by swipe", "Gesture dismiss doesn't restore focus but button dismiss does", "Focus returns to wrong element after swiping away bottom sheet".

---

## ✅ The Fix Pattern

### Part 1 — Implement `dismissCompletion()` in every `BottomSheetable` VC that needs focus restoration

```swift
// SubscriptionIncentivesViewController.swift

extension SubscriptionIncentivesViewController: BottomSheetable {
    // ... existing BottomSheetable methods ...

    // ✅ Called by the bottom sheet container when dismissed via swipe/backdrop tap.
    //    Without this, gesture-based dismissals never notify the coordinator,
    //    and restoreVoiceOverFocus() is never called. WCAG 2.4.3 — CEPG-342789.
    func dismissCompletion() {
        delegate?.performAction(intent: .dismiss)
    }
}
```

This single method implementation ensures ALL dismiss paths (button tap, swipe, backdrop tap) reach the coordinator's `onFinish`, which calls `restoreVoiceOverFocus()`.

---

### Part 2 — Guard against double-dismiss in the coordinator

```swift
// SubscriptionIncentiveCoordinator.swift

override func finish(result: Void) {
    // ✅ Guard: if the sheet is already being dismissed (gesture-driven),
    //    dismiss(animated:) is a no-op from the bottom sheet's perspective.
    //    Calling dismiss() again would produce a warning or crash.
    if !bottomSheetNav.isBeingDismissed {
        bottomSheetNav.dismiss(animated: true, completion: nil)
    }
    super.finish(result)
}
```

---

### Part 3 — `accessibilityFocusRestoreTarget` for shared bottom sheet components

For shared bottom sheet components used from multiple call sites, add an `accessibilityFocusRestoreTarget` property that callers can set:

```swift
// SubscriptionHowItWorksBottomSheetController.swift

final class SubscriptionHowItWorksBottomSheetController: BaseViewController, BottomSheetable {

    /// The view to restore VoiceOver focus to after this sheet is dismissed.
    /// Set by the caller before presenting the sheet.
    var accessibilityFocusRestoreTarget: UIView?

    func dismissCompletion() {
        // ✅ Restore VoiceOver focus to the triggering element
        if let target = accessibilityFocusRestoreTarget {
            UIAccessibility.post(notification: .layoutChanged, argument: target)
        }
    }
}
```

Call site:
```swift
// Caller that presents the shared bottom sheet:
let howItWorksVC = SubscriptionHowItWorksBottomSheetController()
// ✅ Set the focus restore target before presenting
howItWorksVC.accessibilityFocusRestoreTarget = seeTermsButton
present(howItWorksVC, animated: true)
```

---

### ❌ Bad Code — missing `dismissCompletion()` override

```swift
// ❌ Before fix:
extension SubscriptionIncentivesViewController: BottomSheetable {
    // ← No dismissCompletion() override
    // ← BottomSheetable default: func dismissCompletion() {} (no-op)
    // ← Gesture dismissal → no-op → coordinator.onFinish never fires
    // ← restoreVoiceOverFocus() never called
    // ← VoiceOver focus lands on back nav button (wrong element)
}

// ❌ Also before fix — coordinator unconditionally dismisses:
override func finish(result: Void) {
    bottomSheetNav.dismiss(animated: true, completion: nil)
    // ← If called during gesture dismissal, dismiss() on an already-dismissing nav
    //   produces "Unbalanced calls to begin/end appearance transitions" warning
    super.finish(result)
}
```

---

### The dismiss path matrix

| Dismiss trigger | `dismissCompletion()` called? | Before fix | After fix |
|---|---|---|---|
| Close (×) button tap | Yes (via button action → delegate → coordinator.finish()) | ✅ Focus restored | ✅ Focus restored |
| Swipe down gesture | Yes (by bottom sheet container) | ❌ No override → no-op | ✅ Restored via `dismissCompletion()` |
| Backdrop tap | Yes (by bottom sheet container) | ❌ No override → no-op | ✅ Restored via `dismissCompletion()` |
| Programmatic dismiss | Via `coordinator.finish()` directly | ✅ Focus restored | ✅ Focus restored |

---

### The `BottomSheetable` protocol — what `dismissCompletion()` is for

```swift
// BottomSheetable.swift (GlassUI protocol)

protocol BottomSheetable: UIViewController {
    /// Called by the bottom sheet container after a gesture-driven dismiss completes.
    /// Override in your view controller to notify coordinators and restore focus.
    func dismissCompletion()
}

extension BottomSheetable {
    // Default implementation is a no-op — MUST override if focus restoration is needed
    func dismissCompletion() {}
}
```

Any `BottomSheetable` view controller where the user can dismiss by gesture AND where VoiceOver focus restoration is needed must override `dismissCompletion()`.

---

## 🔑 Key Rules

- **Override `dismissCompletion()` in every `BottomSheetable` VC that needs focus restoration** — the default implementation is a no-op. Gesture-based dismissals (swipe, backdrop tap) only notify the VC via `dismissCompletion()`. Without an override, gesture dismissals are invisible to coordinators and focus is never restored.
- **Guard coordinator `finish()` with `!isBeingDismissed`** — when `dismissCompletion()` triggers coordinator `finish()`, which in turn calls `dismiss(animated:)`, the sheet may already be mid-dismissal. The guard prevents double-dismiss warnings.
- **Use `accessibilityFocusRestoreTarget` on shared components** — bottom sheet view controllers used by multiple callers should have a `accessibilityFocusRestoreTarget: UIView?` property. Each caller sets it to the button that triggered the sheet before presenting.
- **Test all three dismiss paths** — button tap, swipe down, and backdrop tap. VoiceOver focus restoration must work on all three. Writing a test for only the button tap path is insufficient.
- **Always restore to the **triggering element**, not a fallback** — `restoreAccessibilityFocus()` (generic) may focus the wrong element if the screen has changed since the sheet was opened. Prefer `UIAccessibility.post(notification: .layoutChanged, argument: triggeringButton)` with the explicit target.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation. When a bottom sheet is dismissed by gesture and VoiceOver focus lands on the back navigation button instead of the "See Terms" button that opened the sheet, the focus order does not preserve meaning or operation. The user is at the wrong position in the page, must re-find the "See Terms" button, and has lost their navigation context. VoiceOver users must be able to dismiss a bottom sheet by any gesture and return to their previous position.
