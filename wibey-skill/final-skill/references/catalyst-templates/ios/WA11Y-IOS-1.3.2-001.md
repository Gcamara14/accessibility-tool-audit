# Catalyst Template: Meaningful Sequence — Map Annotations Behind Card Overlay Remain VoiceOver Focusable

**Template ID:** `WA11Y-IOS-1.3.2-001`
**Platform:** iOS
**WCAG Criterion:** 1.3.2 Meaningful Sequence
**Jira Label:** `WA11Y-IOS-1.3.2-001`
**Source Tickets:** CEPG-370779
**Source PRs:** [glass-app #158418](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/158418)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`StoreSelectionMapViewController` renders a store list map with interactive annotation pins. When the user taps a pin, a `cardView` overlay slides up from the bottom and covers most of the map. The annotations beneath the card remain focusable by VoiceOver — but double-tapping them does nothing because the card is on top.

Two failures occur:

**Failure 1 — Accessible but unreachable:** VoiceOver can swipe to the covered annotations and announce them, but activating them (double-tap) is blocked by the card overlay. VoiceOver users encounter dead controls.

**Failure 2 — `accessibilityElements` array included covered annotations:** The array was built from all `annotationViews`, inserting `cardView` after the selected pin — but covered pins stayed in the array and were still reachable by VoiceOver swipe.

```
Before fix:
  Swipe → Pin A (covered) → Pin B (covered) → cardView → Pin C (visible) → ...
                ^^^^^^^^^^^^^^^^^^^^^^^^^^^ focusable but unreachable
```

**Symptom (Jira):** "VoiceOver can focus store pins hidden behind the card overlay", "Tapping covered annotation with VoiceOver does nothing", "Screen reader traverses pins that are not visible on map", "Map accessibility order includes covered stores".

---

## ✅ The Fix Pattern

### Part 1 — Frame-based filtering: set `isAccessibilityElement = false` on covered annotations

```swift
// StoreSelectionMapViewController.swift

func updateAccessibilityOrderForCardAfterSelectedAnnotation() {
    guard !annotationViews.isEmpty else { return }

    // ✅ Convert the card's frame into the map view's coordinate space
    let cardFrameInView = view.convert(cardView.frame, from: cardView.superview)

    for annotationView in annotationViews {
        // ✅ Always keep the selected (tapped) annotation accessible
        if annotationView === selectedView {
            annotationView.isAccessibilityElement = true
            continue
        }

        // ✅ Convert each annotation's center to map view coordinates
        let annotationCenter = view.convert(
            annotationView.center,
            from: annotationView.superview
        )

        // ✅ Hide annotation from VoiceOver if its center falls inside the card frame
        annotationView.isAccessibilityElement = !cardFrameInView.contains(annotationCenter)
    }

    // Build accessibilityElements: only the visible annotations + cardView after selected
    let visibleAnnotations = annotationViews.filter(\.isAccessibilityElement)
    var elements: [Any] = []
    var foundSelected = false

    for annotationView in visibleAnnotations {
        elements.append(annotationView)
        if annotationView === selectedView {
            elements.append(cardView as Any)
            foundSelected = true
        }
    }
    if !foundSelected {
        elements.append(cardView as Any)
    }

    view.accessibilityElements = elements
}
```

---

### Part 2 — Restore on card dismiss

```swift
// StoreSelectionMapViewController.swift

var cardView: UIView = UIView() {
    didSet {
        // When card is dismissed (set to empty view or hidden):
        restoreAnnotationAccessibility()
    }
}

/// Restores isAccessibilityElement on all annotation views when the card overlay is dismissed.
private func restoreAnnotationAccessibility() {
    for annotationView in mapView.orderedAnnotationViews {
        annotationView.isAccessibilityElement = true
    }
    // ✅ Nil out the custom array — MKMapView manages its own traversal again
    view.accessibilityElements = nil
}
```

Call site — dismiss handler:

```swift
// StoreSelectionMapViewController.swift

func storeCardViewDidDismiss() {
    // ✅ Restore accessibility on all annotations when the card is dismissed
    restoreAnnotationAccessibility()
}
```

---

### ❌ Bad Code — all annotations in `accessibilityElements` regardless of visibility

```swift
// ❌ Before fix:
func updateAccessibilityOrderForCardAfterSelectedAnnotation() {
    guard !annotationViews.isEmpty else { return }
    // ❌ Iterates ALL annotationViews — no frame check for card overlap
    var elements: [Any] = []
    var foundSelected = false
    for view in annotationViews {
        elements.append(view)
        if view === selectedView {
            elements.append(cardView as Any)
            foundSelected = true
        }
    }
    if !foundSelected { elements.append(cardView as Any) }
    view.accessibilityElements = elements
    // ← Covered annotations are in the array → VoiceOver can swipe to them
    // ← Double-tap on covered annotation is blocked by card → dead control
}
// No restoreAnnotationAccessibility call on card dismiss
// → After dismissal, annotationViews behind where card was may still have
//   isAccessibilityElement = false from a previous filtering attempt
```

---

### VoiceOver traversal after fix

```
Before fix (card open):
  Swipe → Pin A (covered, dead) → Pin B (covered, dead) → Card → Pin C (visible) → ...

After fix (card open):
  Swipe → Pin C (selected, visible) → Card → Pin D (visible) → Pin E (visible) → ...
          ^^^^^^^^^^^^^^^^^^^^^^^^
          covered pins hidden from VoiceOver

After fix (card dismissed):
  view.accessibilityElements = nil → MKMapView manages its own order
  All pins: isAccessibilityElement = true → all focusable again
```

---

### Why `cardFrameInView.contains(annotationCenter)` works

`MKMapView` renders annotation views at known screen positions. The card slides up from the bottom covering a portion of the map. By converting both frames to the same coordinate space (`view`), we can test whether each pin's center point is visually inside the card rectangle.

```swift
let cardFrameInView = view.convert(cardView.frame, from: cardView.superview)
// cardFrameInView = CGRect(x: 0, y: 350, width: 390, height: 450)  (example)

let annotationCenter = view.convert(annotationView.center, from: annotationView.superview)
// annotationCenter = CGPoint(x: 195, y: 500)  → inside card → isAccessibilityElement = false
// annotationCenter = CGPoint(x: 80, y: 300)   → above card → isAccessibilityElement = true
```

The selected pin is always exempted from suppression — VoiceOver users need to reach the selected pin to understand which store the card refers to.

---

### `view.accessibilityElements = nil` — restoring MKMapView's own management

When `view.accessibilityElements` is set to a non-nil array, UIKit uses that array as the complete accessibility tree and ignores MKMapView's internal accessibility management. Setting it back to `nil` hands control back to MKMapView, which manages annotation focus order natively.

---

## 🔑 Key Rules

- **Filter covered annotations by frame intersection, not by index** — the card's position varies by device size and content. A hard-coded index cutoff will be wrong on different screen sizes.
- **Always exempt the selected annotation from suppression** — the selected annotation is the one the card relates to. VoiceOver users need it accessible so they can navigate from the pin to the card.
- **Set `isAccessibilityElement = false` directly on annotation views** — `MKMapView` manages its own accessibility tree independently of the parent view controller's `accessibilityElements` array. Setting elements on `view` is not enough; each covered `MKAnnotationView` must also have `isAccessibilityElement = false`.
- **Call `restoreAnnotationAccessibility()` on every dismiss path** — if there are multiple ways to close the card (back swipe, explicit dismiss, navigation), each must call `restoreAnnotationAccessibility()` or VoiceOver will not be able to reach previously-covered pins.
- **`view.accessibilityElements = nil` is the correct reset** — setting it to an empty array `[]` would produce an empty traversal (no accessible elements at all). `nil` restores MKMapView's built-in management.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.2 (Meaningful Sequence):** When the presentation sequence of content affects its meaning, the correct reading sequence can be programmatically determined. Allowing VoiceOver to traverse annotation pins that are visually covered by an overlay creates a mismatch between the visual layout and the accessibility order. Users encounter pins they cannot activate and must navigate past controls that have no usable function in the current state. The accessibility order must reflect the current visual reality — only visible, actionable pins should be present in the traversal sequence when the card is open.
