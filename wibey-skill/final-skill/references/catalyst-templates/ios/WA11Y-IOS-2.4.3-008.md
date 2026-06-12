# Catalyst Template: Focus Order — Focus Restoration With Retry Loop for Initially Hidden/Transparent Target Views

**Template ID:** `WA11Y-IOS-2.4.3-008`
**Platform:** iOS
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-IOS-2.4.3-008`
**Source Tickets:** GPUGC-20875
**Source PRs:** [glass-app #d4ed0b396fb3](https://gecgithub01.walmart.com/Walmart-iOS/glass-app)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

After a modal is dismissed, VoiceOver focus must return to the element that triggered the modal. When the target element (`verifiedPurchasedInfoButton`) is rendered in a card that performs a data-reload or animation after dismiss, the target view may be **hidden** (`isHidden = true`) or **transparent** (`alpha = 0`) at the moment the dismiss completion block fires. Posting `.layoutChanged` immediately with a hidden or transparent view causes VoiceOver to drop the focus request silently — the focus restoration call succeeds at runtime but VoiceOver does not move.

The result: VoiceOver focus lands on an unrelated element (often the top of the screen or the element that happens to receive a subsequent layout change), and the user loses their navigation position entirely.

**Symptom (Jira):** "VoiceOver focus does not return to 'Verified Purchase' info button after closing modal", "Screen reader loses position after dismissing review info sheet", "Focus goes to top of screen after dismissing bottom sheet from product review card".

---

## ✅ The Fix Pattern

### Retry loop with visibility guard + fallback to generic `restoreAccessibilityFocus()`

```swift
// ReviewCardViewController.swift (or equivalent product review card)

// AccessibilityFocusConfig constants (defined centrally):
// static let initialDelay: TimeInterval = 0.3
// static let maxRetries: Int = 5
// static let retryDelay: TimeInterval = 0.1
// static let alpha: CGFloat = 0.0

private func focusVerifiedPurchaseInfoButton(
    retries: Int = AccessibilityFocusConfig.maxRetries,
    view: UIView?
) {
    // ✅ Guard: only post .layoutChanged when the target is visible
    //    isHidden = false AND alpha > 0.0 confirms the button is visible to the user
    guard let button = view,
          !button.isHidden,
          button.alpha > AccessibilityFocusConfig.alpha else {
        // ✅ Retry if the view is not yet visible and retries remain
        guard retries > 0 else {
            // ✅ Fallback: generic focus restoration when target never becomes visible
            restoreAccessibilityFocus()
            return
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + AccessibilityFocusConfig.retryDelay) { [weak self] in
            self?.focusVerifiedPurchaseInfoButton(retries: retries - 1, view: view)
        }
        return
    }

    // ✅ Ensure the button is a VoiceOver focus target before posting
    button.isAccessibilityElement = true
    button.accessibilityTraits = [.button]

    // ✅ Post .layoutChanged with the target — moves VoiceOver cursor to button
    UIAccessibility.post(notification: .layoutChanged, argument: button)
}
```

---

### Trigger the retry loop from the dismiss completion block

```swift
// ReviewCardViewController.swift

private func setupModalDismiss() {
    // verifiedPurchaseInfoVC is the bottom sheet / modal
    verifiedPurchaseInfoVC.onDismiss = { [weak self] in
        // ✅ Initial delay: let the dismiss animation and any post-dismiss data
        //    reload settle before the first focus attempt
        DispatchQueue.main.asyncAfter(deadline: .now() + AccessibilityFocusConfig.initialDelay) {
            self?.focusVerifiedPurchaseInfoButton(
                view: self?.reviewCardView?.verifiedPurchasedInfoButton
            )
        }
    }
}
```

---

### ❌ Bad Code — immediate focus post without visibility check

```swift
// ❌ Before fix (approach 1 — no retry, target may be hidden):
viewController.onDismiss = { [weak self] in
    guard let button = self?.reviewCardView?.verifiedPurchasedInfoButton else { return }
    UIAccessibility.post(notification: .layoutChanged, argument: button)
    // ← If button.isHidden = true at this moment, VoiceOver drops the request silently
    // ← No fallback if the button is never visible
}

// ❌ Before fix (approach 2 — no retry, short delay but still racy):
viewController.onDismiss = { [weak self] in
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
        guard let button = self?.reviewCardView?.verifiedPurchasedInfoButton else { return }
        UIAccessibility.post(notification: .layoutChanged, argument: button)
        // ← 0.3s may not be enough if card is reloading data from network
        // ← Still no visibility guard
    }
}
```

---

### The retry decision tree

```
onDismiss fires
    │
    ├─ delay 0.3s (initialDelay)
    │
    └─ focusVerifiedPurchaseInfoButton(retries: 5, view: button)
        │
        ├─ button.isHidden || button.alpha == 0.0?
        │       │
        │       ├─ retries > 0 → delay 0.1s (retryDelay) → retry with retries-1
        │       │
        │       └─ retries == 0 → restoreAccessibilityFocus() [generic fallback]
        │
        └─ button visible (isHidden=false, alpha>0)
                │
                └─ post .layoutChanged(argument: button) ✅
```

Total maximum wait time: `initialDelay + (maxRetries × retryDelay)` = `0.3 + (5 × 0.1)` = `0.8s`

---

### `AccessibilityFocusConfig` constants

```swift
// AccessibilityFocusConfig.swift  (Platform/GlassUI — centralized constants)

enum AccessibilityFocusConfig {
    /// Initial delay after modal dismiss before first focus attempt
    static let initialDelay: TimeInterval = 0.3

    /// Maximum number of retries if target view is not yet visible
    static let maxRetries: Int = 5

    /// Delay between consecutive retry attempts
    static let retryDelay: TimeInterval = 0.1

    /// Delay used when posting notifications after layout changes
    static let layoutDelay: TimeInterval = 0.3

    /// Alpha threshold: view.alpha must exceed this to be considered visible
    static let alpha: CGFloat = 0.0
}
```

Use `AccessibilityFocusConfig` constants throughout — never hardcode delays or retry counts inline. Centralizing them allows project-wide tuning.

---

### When to use the retry loop vs. a single delayed post

| Situation | Approach |
|---|---|
| Target view is always visible by dismiss completion | Single `asyncAfter(initialDelay)` + `.layoutChanged` |
| Target view may be loading/animating in after dismiss | Retry loop with `maxRetries × retryDelay` + fallback |
| Target view involves network data reload | Retry loop — data reload is unbounded; use fallback |
| Target view is in a Tempo/LiveModules component | Retry loop — Tempo may re-render on dismiss |
| Target view is a static cell in a table | Single delayed post is sufficient |

---

### Generic fallback: `restoreAccessibilityFocus()`

When all retries are exhausted and the target view is still not visible, call `restoreAccessibilityFocus()` (via `AccessibilityFocusManager`). This attempts to find the previously saved focus ID in the view hierarchy. It is less precise than the direct `.layoutChanged(argument:)` call but ensures VoiceOver focus moves somewhere meaningful rather than remaining stranded.

```swift
// AccessibilityFocusManager.swift
static func restoreAccessibilityFocus(with notification: UIAccessibility.Notification = .screenChanged) {
    guard UIAccessibility.isVoiceOverRunning else { return }
    // traverses window.rootViewController?.view for saved accessibilityIdentifier
    // posts `notification` with matching view as argument
}
```

---

## 🔑 Key Rules

- **Guard `.layoutChanged` with visibility checks before posting** — `!button.isHidden && button.alpha > 0` confirms VoiceOver can focus the view. Posting to a hidden or transparent view is silently ignored.
- **Use `AccessibilityFocusConfig` constants for all delays and retry counts** — never hardcode `0.1`, `0.3`, or `5` inline. Centralizing allows project-wide tuning without searching call sites.
- **Set `isAccessibilityElement = true` and `accessibilityTraits` before posting** — a view that is visible but not yet marked as an accessibility element may still be ignored. Ensure the view is properly configured as a focus target before `.layoutChanged`.
- **Always provide a fallback** — when all retries are exhausted, call `restoreAccessibilityFocus()`. Never let the retry loop exhaust silently, leaving VoiceOver stranded.
- **Keep `[weak self]` in all `asyncAfter` closures** — the view controller may be deallocated during a long retry chain; retain cycles cause memory leaks and potential crashes.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation. When a modal is dismissed and VoiceOver focus does not return to the triggering element (because the focus restoration post was issued to a hidden view), the user's position in the page is lost. They must navigate from wherever focus landed back to the review card, re-find the "Verified Purchase" info button, and re-execute their workflow. A retry loop that waits for the view to become visible before posting `.layoutChanged` ensures that VoiceOver focus is restored in a way that preserves the user's navigation context.

