# Catalyst Template: Focus Order — VoiceOver Focus Lost After Bottom Sheet Dismiss (Express Check-In)

**Template ID:** `WA11Y-IOS-2.4.3-005`
**Platform:** iOS
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-IOS-2.4.3-005`
**Source Tickets:** ACCNG-31719
**Source PRs:** [glass-app #144585](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/144585)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

In the Auto Care Center Express Check-In flow, tapping the close (×) button on the address bottom sheet dismisses it and returns the user to the workflow selection screen. When a VoiceOver user dismisses the sheet:

1. The modal bottom sheet is dismissed with `navigation?.dismiss(animated: true)`
2. VoiceOver focus is **lost** — it does not automatically move to any meaningful element
3. The underlying Tempo module (rendered by the workflow selection screen) still has `isAccessibilityElement = true`, so VoiceOver may land somewhere arbitrary in the Tempo content

Expected behavior: after dismissing the address sheet, VoiceOver focus should move directly to the **Continue** (`ctaButton`) on the workflow selection footer, which is the primary action the user should take next.

**Symptom (Jira):** "VoiceOver focus lost when closing address bottom sheet", "Screen reader doesn't return to previous screen after modal dismiss", "Focus disappears after closing Express Check-In sheet", "VoiceOver lands on wrong element after dismissing Auto Care modal".

---

## ✅ The Fix Pattern

### Dismiss handler — suppress Tempo content, focus CTA button

```swift
// AccExpressCheckInCoordinator+Actions.swift

func handleClose() {
    // ✅ Store original accessibility state of the Tempo module before dismissing
    let tempoVC = expressCheckInProtocol.navigation?.topViewController
    let tempoViewOriginalAccessibility = tempoVC?.view.isAccessibilityElement ?? true

    // ✅ Temporarily suppress the Tempo module to prevent VoiceOver from landing there
    tempoVC?.view.isAccessibilityElement = false

    expressCheckInProtocol.navigation?.dismiss(animated: true) { [weak self] in
        guard let self else { return }

        if let workflowSelectionView = self.flow.currentWorkflowSelectionView {
            // ✅ Suppress all subviews in the workflow selection view
            workflowSelectionView.isAccessibilityElement = false
            workflowSelectionView.subviews.forEach { subview in
                subview.isAccessibilityElement = false
                subview.subviews.forEach { $0.isAccessibilityElement = false }
            }

            // ✅ Explicitly expose only the Continue (CTA) button
            workflowSelectionView.footerView.isAccessibilityElement = false
            workflowSelectionView.footerView.ctaButton.isAccessibilityElement = true

            // ✅ Post .screenChanged after a short delay to let the dismiss animation complete
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                UIAccessibility.post(
                    notification: .screenChanged,
                    argument: workflowSelectionView.footerView.ctaButton
                )
            }

            // ✅ Restore original accessibility state after VoiceOver has moved to CTA
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                tempoVC?.view.isAccessibilityElement = tempoViewOriginalAccessibility
            }
        }
    }
}
```

---

### Coordinator setup — track the workflow selection view

```swift
// AutoCareCenterFlow.swift

final class AutoCareCenterFlow {
    // ✅ Weak reference so the coordinator can post focus after modal dismiss
    weak var currentWorkflowSelectionView: WorkflowSelectionModuleView?
    // ...
}
```

```swift
// WorkflowSelectionModule+Actions.swift

extension WorkflowSelectionModuleView {
    func didTapFooterCta(isSelectionRequired: Bool) {
        // ✅ Register this view with the flow before presenting the address sheet
        flow?.currentWorkflowSelectionView = self

        // ✅ Save the CTA button's accessibility ID for the focus manager
        AccessibilityFocusManager.saveAccessibilityFocus(
            of: footerView.ctaButton.accessibilityIdentifier ?? ""
        )

        // ✅ Post .layoutChanged immediately so VoiceOver is aware of layout state
        UIAccessibility.post(notification: .layoutChanged, argument: footerView.ctaButton)
        // ... present the address bottom sheet ...
    }
}
```

---

### CTA button accessibility configuration

```swift
// SelectionScreenFooterView.swift

func configure(with model: FooterModel) {
    ctaButton.text = model.ctaTitle
    // ✅ Required: VoiceOver can only focus this button as a modal-level element
    ctaButton.accessibilityViewIsModal = true
    // ✅ Store title as identifier for AccessibilityFocusManager lookup
    ctaButton.accessibilityIdentifier = ctaButton.text
}
```

---

### ❌ Bad Code — dismiss without focus restoration

```swift
// ❌ Before fix:
func handleClose() {
    expressCheckInProtocol.navigation?.dismiss(animated: true)
    // ← No focus restoration
    // ← Tempo module stays accessible → VoiceOver may land anywhere in Tempo content
    // ← No .screenChanged notification → VoiceOver cursor stays where the sheet was
}
```

---

### Why `DispatchQueue.main.asyncAfter(deadline: .now() + 0.3)` for `.screenChanged`

The dismiss animation runs on the main thread and takes approximately 0.25–0.35 seconds. Posting `.screenChanged` synchronously inside the dismiss completion handler fires before the animation has fully settled — VoiceOver may not yet see the button in its final position. A 0.3-second delay ensures the view hierarchy is stable when VoiceOver processes the notification.

A second delay of 1.5 seconds is used to restore the Tempo module's accessibility state — long enough for VoiceOver to have moved to and announced the CTA button, but short enough that the user can continue navigating normally afterward.

```
Timeline:
  t=0.0s   dismiss(animated: true) called — sheet begins animating out
  t=0.25s  dismiss completion closure fires
  t=0.55s  .screenChanged posted → VoiceOver moves to ctaButton (0.3s delay)
  t=1.75s  tempoVC.isAccessibilityElement restored (1.5s delay)
```

---

### `.screenChanged` vs `.layoutChanged`

| Notification | VoiceOver behaviour | When to use |
|---|---|---|
| `.screenChanged` | Moves cursor to `argument`, reads page as new screen | After full modal dismiss — completely new context |
| `.layoutChanged` | Moves cursor to `argument` if it changed | After partial layout update — same screen context |
| `.announcement` | Reads `argument` string, cursor stays | Status messages, no focus change needed |

Use `.screenChanged` when dismissing a modal that consumed the full screen. Use `.layoutChanged` for in-page updates (e.g., a section appearing/disappearing without navigation).

---

### When to suppress subviews before posting `.screenChanged`

Suppressing `workflowSelectionView.subviews` before posting `.screenChanged` is necessary when:
- The underlying screen's Tempo module contains many accessible elements
- Without suppression, VoiceOver may see the Tempo elements before `argument` (the CTA button) and land there instead
- Restoring after 1.5s gives the user a focused entry point, then full navigation

If the underlying screen has simple content (a few elements, no Tempo module), suppression may not be needed — just posting `.screenChanged` with the target view as `argument` is sufficient.

---

## 🔑 Key Rules

- **Always restore VoiceOver focus after dismissing a modal** — `dismiss(animated:)` does not automatically move VoiceOver to any element on the presenting screen. Post `.screenChanged` with the target element in the completion handler.
- **Use `DispatchQueue.main.asyncAfter` with ~0.3s delay** — posting immediately in the completion handler can fire before the dismiss animation completes. The 0.3s delay ensures the view hierarchy is stable when VoiceOver processes the notification.
- **Temporarily suppress competing accessible elements** — if the underlying screen has many accessible elements (especially Tempo-rendered content), suppress them before posting `.screenChanged` so VoiceOver is directed to the intended element.
- **Restore suppressed elements after ~1.5s** — never permanently suppress accessibility on live screen content. Restore `isAccessibilityElement` after VoiceOver has moved to the focus target.
- **`weak var currentWorkflowSelectionView`** — the coordinator must hold a weak reference to avoid retaining the view. The view may be dealloc'd if navigation moves away; the guard `if let workflowSelectionView` handles this safely.
- **`accessibilityViewIsModal = true` on the CTA button** — required for VoiceOver to treat the button as a focus-level element when used as a `.screenChanged` argument.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation. When a modal bottom sheet is dismissed and VoiceOver focus is not explicitly restored, users lose their navigation context. They must restart traversal from the top of the underlying screen to find the Continue button. For sighted users, dismissing the sheet immediately reveals the workflow selection screen with the Continue button visible — an effortless context switch. VoiceOver users deserve equivalent navigation continuity.
