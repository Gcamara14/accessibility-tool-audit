# Catalyst Template: Non-Text Content — `accessibilityElementsHidden` for Complete Subtree Suppression (vs. `isAccessibilityElement = false` Leaf-Only)

**Template ID:** `WA11Y-IOS-1.1.1-005`
**Platform:** iOS
**WCAG Criterion:** 1.1.1 Non-Text Content
**Jira Label:** `WA11Y-IOS-1.1.1-005`
**Source Tickets:** CEPG-373446, CEPG-373447, CEPG-373448, CEPG-373449, CEPG-373450, CEPG-373451, CEPG-373452, CEPG-373453
**Source PRs:** [glass-app #157949](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/157949)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

The W+ splash page contained multiple decorative images and non-semantic containers causing eight VoiceOver defects:

1. Hero image (`imageView`) focused with no label — silent stop
2. Poster image focused with label replicating adjacent heading — duplicate
3. Background gradient/color view focused — irrelevant to content
4. Divider lines (`divider`) focused — no semantic meaning
5. `WCPRadio` button's **internal subviews** individually focused by VoiceOver, creating multiple spurious stops inside a single radio option
6. A duplicate action button (`actionButton`) inside a tenure option card focused alongside the intended CTA
7. Info banner container incorrectly marked with `.header` trait, causing false heading detection
8. Empty content label (`introductionLabel`) announced even when hidden

Setting `isAccessibilityElement = false` on the view itself removes the view as a focus stop but **does not prevent VoiceOver from traversing into its children**. For a view with complex internal subview hierarchies (like `WCPRadio`), the children can still receive individual focus stops even after the parent is hidden.

**Symptom (Jira):** "VoiceOver focuses inside WCPRadio button separately", "Screen reader announces internal radio subviews", "Ghost focus on hidden empty label", "Action button announced twice on W+ plan selection screen", "Section reads as a heading but it is not a heading".

---

## ✅ The Fix Pattern

### `accessibilityElementsHidden = true` — hides a view AND all of its descendants

```swift
// ✅ For containers with meaningful internal subviews that must ALL be hidden:
// (e.g., WCPRadio, duplicate action buttons, internal card structures)

// WCPRadio inside a tenure option — the containing stackView is the single focus target
radioButton.accessibilityElementsHidden = true
// → radioButton.isAccessibilityElement = false (view itself hidden)
// → ALL of radioButton's internal WCPLabel, checkmark UIImageView etc. also hidden
// → The parent stackView with isAccessibilityElement = true is the only focus stop

// Duplicate CTA that should never be reached
actionButton.isAccessibilityElement = false
actionButton.accessibilityElementsHidden = true  // belt-and-suspenders
// → Prevents the action button AND any subviews from being reached

// Dividers
divider.isAccessibilityElement = false
divider.accessibilityElementsHidden = true
```

---

### `isAccessibilityElement = false` alone — only hides the view, not its children

```swift
// ✅ Sufficient for leaf views (UIImageView, WCPLabel with no subviews):
heroImageView.isAccessibilityElement = false
// → UIImageView has no children — this is sufficient

backgroundColorView.isAccessibilityElement = false
// → If backgroundColorView has no accessibility-enabled children, this is sufficient

// ⚠️ NOT sufficient for container views with accessible children:
radioButton.isAccessibilityElement = false
// → VoiceOver may still traverse into radioButton's internal WCPLabel, UIImageView etc.
// → Use accessibilityElementsHidden = true instead
```

---

### Ghost focus on conditionally-visible labels

```swift
// WCPSplashBannerView.swift

// ✅ Only expose introductionLabel when it has content to announce
func configure(hasContent: Bool) {
    introductionLabel.isAccessibilityElement = hasContent
    accessibilityElementsHidden = !hasContent
    // → When empty/hidden: entirely absent from accessibility tree
    // → When visible with content: accessible normally
}
```

---

### Remove `.header` trait from non-heading containers

```swift
// ❌ Before — infoBannerContainer incorrectly marked as heading:
infoBannerContainer.accessibilityTraits = .header
// VoiceOver: "Info banner, heading" ← not a heading, misrepresents document structure

// ✅ After — .updatesFrequently for live content that refreshes:
infoBannerContainer.accessibilityTraits = .updatesFrequently
// Or simply remove the trait:
infoBannerContainer.accessibilityTraits = []
```

---

### Grouping a radio option as a single accessibility element

```swift
// ✅ Pattern for custom radio/checkbox with internal subviews:

// In the containing stackView (the row):
stackView.isAccessibilityElement = true
stackView.accessibilityLabel = model.accessibilityLabel  // full combined label
stackView.accessibilityTraits = model.radioButtonSelected ? [.button, .selected] : .button

// On the WCPRadio component itself:
radioButton.accessibilityElementsHidden = true
// → VoiceOver sees only the stackView (one focus stop)
// → All radio internal views (circle, dot, label) are invisible to VoiceOver

// On additional decorative/duplicate views inside the card:
creditValueLabel.isAccessibilityElement = false
bestValueImageView.isAccessibilityElement = false
giftIconImageView.isAccessibilityElement = false
actionButton.isAccessibilityElement = false
actionButton.accessibilityElementsHidden = true
```

---

### `isAccessibilityElement = false` vs `accessibilityElementsHidden` — decision table

| Situation | Use |
|---|---|
| Leaf view with no subviews (UIImageView, WCPLabel standalone) | `isAccessibilityElement = false` |
| Container with internal accessible subviews (WCPRadio, WCPCard, custom cells) | `accessibilityElementsHidden = true` |
| Duplicate interactive element (second button for same action) | Both: `isAccessibilityElement = false` + `accessibilityElementsHidden = true` |
| View hidden programmatically (`isHidden = true`) | No additional accessibility suppression needed — hidden views are already excluded |
| View with `alpha = 0` but `isHidden = false` | `accessibilityElementsHidden = true` — transparent views can still receive VoiceOver focus |

---

### `accessibilityElementsHidden` vs `UIAccessibilityContainer`

`accessibilityElementsHidden = true` is the inverse of `UIAccessibilityContainer`. When `accessibilityElementsHidden = true` on a container, UIKit completely removes that view and all its descendants from the accessibility tree — VoiceOver never visits them. This is the correct approach for:
- Complex Living Design components (`WCPRadio`, `WCPCard`) where the internal structure would create spurious focus stops
- Duplicate controls for the same action (one keyboard-accessible, one touch-only)
- Decorative composite views with multiple layers

---

## 🔑 Key Rules

- **Use `accessibilityElementsHidden = true` on any container whose entire subtree should be invisible to VoiceOver** — `isAccessibilityElement = false` only hides the view itself; its children are still traversed. For containers with Living Design internal subviews, always add `accessibilityElementsHidden = true`.
- **Apply belt-and-suspenders (`isAccessibilityElement = false` + `accessibilityElementsHidden = true`) to duplicate interactive elements** — a duplicate button that should never be accessed needs both flags: the first prevents the view from being a focus stop; the second prevents VoiceOver from descending into its subtree.
- **Never use `.header` trait on non-heading containers** — `.header` signals to VoiceOver users that an element is a navigable heading. Misusing it (e.g., on an info banner or subtitle) creates false heading navigation. Use `.staticText` or `.updatesFrequently` (for live-updating banners) instead.
- **Guard label visibility with `isAccessibilityElement = hasContent`** — an empty or conditionally-shown label should be `isAccessibilityElement = false` (or `accessibilityElementsHidden = true`) when it has no content to announce. Presenting an empty label creates a silent focus stop.
- **Apply `accessibilityElementsHidden = true` to transparent views (`alpha = 0, isHidden = false`)** — UIKit does not automatically suppress accessibility for transparent views. If a view is visually invisible due to alpha but still in the hierarchy, VoiceOver can still focus it. Explicitly suppress it.

---

## ⚠️ WCAG Failure Without This Fix

- **1.1.1 (Non-Text Content):** All non-text content that is presented to the user has a text alternative that serves the equivalent purpose, except for decorative non-text content, which should be implemented in a way that it can be ignored by assistive technology. Decorative images, dividers, and background elements that focus under VoiceOver are not being implemented in a way that can be ignored — they are actively presented. For complex components like `WCPRadio` whose internal subviews become individual focus stops, VoiceOver users encounter spurious silent stops and meaningless traversal. `accessibilityElementsHidden = true` on the component ensures VoiceOver ignores it entirely, treating the parent container's combined label as the sole announcement.

