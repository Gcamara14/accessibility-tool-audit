# Catalyst Template: Focus Order — Cross-Hierarchy `accessibilityElements` Injection Defers Tooltip Focus to End of Page

**Template ID:** `WA11Y-IOS-2.4.3-009`
**Platform:** iOS
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-IOS-2.4.3-009`
**Source Tickets:** CEPG-369665
**Source PRs:** [glass-app #155997](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/155997)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`GicHighlightView` is a location tooltip that appears directly below a GIC banner. The tooltip contains a text label and a close button. The original implementation injected these elements into `targetView.accessibilityElements` — a reference to an ancestor view in a different hierarchy branch:

```swift
// ❌ Before fix:
private func setAccessibilityLabel() {
    guard let targetView else { return }
    contentView.isAccessibilityElement = false
    closeButton.isAccessibilityElement = true
    textLabel.isAccessibilityElement = true
    // ← Injecting elements from THIS view into targetView's accessibilityElements
    // ← textLabel and closeButton live in GicHighlightView's hierarchy
    // ← targetView is a different ancestor view
    targetView.accessibilityElements = (targetView.accessibilityElements ?? []) + [textLabel, closeButton]
}
```

**Root cause:** VoiceOver orders elements using two signals: explicit `accessibilityElements` arrays and on-screen position (frame). When elements from view A are injected into view B's `accessibilityElements`, VoiceOver processes them in view B's context — but their screen frames belong to view A's coordinate system. VoiceOver cannot correctly position them in the traversal order and defers them to the **end of the page** (after all normally-ordered elements).

Additionally, the dismiss cleanup searched for `contentView` in the injected list but `contentView` was never added — only `textLabel` and `closeButton` were. The cleanup never found anything and leaked stale elements in `targetView.accessibilityElements`.

**Symptom (Jira):** "GIC tooltip is focused after 'Give Feedback' at the end of the page", "Location tooltip VoiceOver focus order wrong — appears at end", "Tooltip close button announced last instead of immediately after banner".

---

## ✅ The Fix Pattern

### Make the tooltip view its own accessibility container — never inject into a foreign view

```swift
// GicHighlightView.swift

private func setAccessibilityLabel() {
    contentView.isAccessibilityElement = false
    closeButton.isAccessibilityElement = true
    textLabel.isAccessibilityElement = true

    if model.linkText != nil {
        textLabel.accessibilityTraits = .button
    }

    // ✅ Make GicHighlightView itself an accessibility container for its children.
    //    VoiceOver uses the view's screen frame to determine where it falls in the
    //    traversal order. Since GicHighlightView is positioned directly below the
    //    GIC banner via Auto Layout constraints, VoiceOver's position-based ordering
    //    naturally places it immediately after the banner — no targetView manipulation needed.
    isAccessibilityElement = false
    accessibilityElements = [textLabel, closeButton]

    // ← NOT: targetView.accessibilityElements = [...] (cross-hierarchy injection)
}
```

---

### Cleanup: clear your own container on dismiss

```swift
// GicHighlightView.swift

private func dismiss() {
    guard let targetView else { return }
    UIAccessibility.post(notification: .screenChanged, argument: targetView)

    // ✅ Clear this view's own accessibility container.
    //    removeFromSuperview() removes GicHighlightView from the visible hierarchy entirely,
    //    which removes it from VoiceOver traversal automatically.
    //    Clearing accessibilityElements here is belt-and-suspenders cleanup.
    accessibilityElements = nil

    // ← NOT: searching targetView.accessibilityElements for contentView (never worked)
    removeFromSuperview()
}
```

---

### ❌ Bad Code — cross-hierarchy injection and broken cleanup

```swift
// ❌ Before fix:
private func setAccessibilityLabel() {
    guard let targetView else { return }
    // ← VoiceOver sees textLabel and closeButton as children of targetView
    // ← But their screen frames are in GicHighlightView's position, not targetView
    // ← Mismatch between accessibility parent and visual position → deferred to end of page
    targetView.accessibilityElements = (targetView.accessibilityElements ?? []) + [textLabel, closeButton]
}

// ❌ Before fix — cleanup that never worked:
private func dismiss() {
    // ← Searched for contentView, but contentView was never added to the array
    // ← textLabel and closeButton were never removed
    // ← Stale references in targetView.accessibilityElements after tooltip dismissal
    if let index = targetView?.accessibilityElements?
        .firstIndex(where: { ($0 as? UIView) == contentView }) {
        targetView?.accessibilityElements?.remove(at: index)
    }
}
```

---

### How VoiceOver determines focus order

VoiceOver uses two mechanisms to order accessible elements:

1. **Explicit `accessibilityElements` array** — if a view has an `accessibilityElements` array, VoiceOver traverses those elements in order (overriding screen position within that container).
2. **Screen position** — within a view that does not have an explicit `accessibilityElements` array, VoiceOver orders children by their frame on screen (top-to-bottom, left-to-right for LTR layouts).

Cross-hierarchy injection breaks both mechanisms: the elements are registered under `targetView`'s accessibility context (mechanism 1), but their visual frames are in `GicHighlightView`'s position on screen (mechanism 2). VoiceOver's position-based heuristic cannot reconcile the mismatch and appends these elements after the last natively-ordered element on the page.

**Rule:** Only set `view.accessibilityElements` with elements that are direct descendants of `view` or live within `view`'s view hierarchy.

---

### When cross-hierarchy injection appears legitimate

There are cases where modifying an ancestor's `accessibilityElements` is intentional — for example, a modal overlay that must intercept VoiceOver traversal before the underlying screen. In those cases:
1. The overlay should use `UIAccessibilityContainer` protocol methods
2. The injected elements must have frames computed in the ancestor's coordinate space
3. Cleanup must reliably remove the injected elements (preferably via `deinit` or a matching dismiss method)

For a tooltip that is simply positioned below a banner, none of this complexity is needed — the tooltip's own `accessibilityElements` array, combined with its natural position on screen, is sufficient.

---

### Accessibility container cleanup checklist

When a tooltip, overlay, or popover is dismissed:
```swift
// ✅ Option A: view's own container (preferred)
self.accessibilityElements = nil
// removeFromSuperview() handles the rest

// ✅ Option B: if you did inject into an ancestor (discouraged but sometimes necessary)
// Remove by reference, not by a proxy view:
ancestorView.accessibilityElements?.removeAll { ($0 as? UIView) === self.textLabel }
ancestorView.accessibilityElements?.removeAll { ($0 as? UIView) === self.closeButton }
// ← Must match what was added, not a different view (contentView vs. textLabel/closeButton)
```

---

## 🔑 Key Rules

- **Never inject elements from one view's hierarchy into another view's `accessibilityElements`** — VoiceOver uses the owning view's coordinate context to position elements for traversal. Injecting elements whose frames live in a different hierarchy branch breaks position-based ordering and causes VoiceOver to defer them to the end of the page.
- **Make popup/tooltip views their own accessibility containers** — set `self.isAccessibilityElement = false` and `self.accessibilityElements = [textLabel, closeButton]` on the tooltip view itself. Auto Layout constraints that position the tooltip correctly on screen also position it correctly in VoiceOver traversal.
- **Cleanup must mirror setup** — if a view was added to `parentView.accessibilityElements`, removal must reference the same objects that were added. Searching for a different view (e.g., `contentView` when `textLabel` was added) silently fails and leaks stale references.
- **Use `removeFromSuperview()` as the primary cleanup** — when a tooltip is removed from the view hierarchy entirely, VoiceOver automatically excludes it from traversal. `accessibilityElements = nil` is belt-and-suspenders cleanup.
- **Test tooltip focus position with VoiceOver on a real device** — programmatic tests cannot detect cross-hierarchy ordering bugs. Manual verification with VoiceOver active is required to confirm the tooltip is focused immediately after the triggering element.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation. A tooltip that appears directly below a GIC banner and provides contextual information about it must be traversed immediately after the banner — this is the order that "preserves meaning and operation." When the tooltip is deferred to the end of the page (after "Give Feedback"), the user must navigate through the entire page content to reach the tooltip, then navigate back to their previous position. This disrupts the meaning of the tooltip as immediate contextual information for the banner.

