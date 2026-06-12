# Catalyst Template: Non-Text Content — Decorative Background Image Made Accessible With Meaningful Label

**Template ID:** `WA11Y-IOS-1.1.1-004`
**Platform:** iOS
**WCAG Criterion:** 1.1.1 Non-Text Content
**Jira Label:** `WA11Y-IOS-1.1.1-004`
**Source Tickets:** CEPG-366487
**Source PRs:** [glass-app #154443](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/154443)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`SellerHeadingView` renders a background banner image (`backgroundView`) for the seller store header. The view had `isAccessibilityElement = true` with an `accessibilityLabel` set to a localized string:

```swift
// ❌ Before fix:
backgroundView.isAccessibilityElement = true
backgroundView.accessibilityLabel = .localized(.walmartLocalFinds)
// → VoiceOver: "Walmart Local Finds" (for a background banner/header image)
```

The `backgroundView` is a **decorative** background — it conveys no information beyond visual aesthetics (branded background color/image for the seller page). Making it accessible adds an unnecessary VoiceOver focus stop with a label that duplicates the page heading content already announced by the seller name header.

VoiceOver users encounter:
> **"Walmart Local Finds"** ← backgroundView (decorative, confusing)
> **"Walmart Local Finds"** ← actual page heading (duplicate)

**Symptom (Jira):** "VoiceOver announces seller page header twice", "Background banner creates duplicate focus stop on seller store page", "Decorative banner image unnecessary in VoiceOver traversal", "Screen reader reads 'Walmart Local Finds' twice on seller page".

---

## ✅ The Fix Pattern

### Hide decorative views from VoiceOver: `isAccessibilityElement = false` + `shouldGroupAccessibilityChildren = false`

```swift
// SellerHeadingView.swift

private func configureAccessibility() {
    // ✅ backgroundView is decorative — suppress from VoiceOver entirely
    backgroundView.isAccessibilityElement = false

    // ✅ Do not group children — prevents child views inside backgroundView
    //    from being grouped under a single accessible container
    backgroundView.shouldGroupAccessibilityChildren = false

    // backgroundView.accessibilityLabel not set (removed)
    // VoiceOver traversal skips backgroundView completely

    // Other non-decorative elements (seller name, logo, etc.)
    // remain accessible via their own isAccessibilityElement settings
}
```

---

### ❌ Bad Code — decorative background made accessible with redundant label

```swift
// ❌ Before fix:
backgroundView.isAccessibilityElement = true
// ← VoiceOver focuses the background banner
backgroundView.accessibilityLabel = .localized(.walmartLocalFinds)
// ← Same label as the page heading → duplicate announcement
// ← No semantic value for screen reader users
```

---

### VoiceOver traversal comparison

```
Before fix (seller page):
  Swipe → "Walmart Local Finds" ← backgroundView (decorative)
  Swipe → "Walmart Local Finds" ← actual heading label (meaningful)
  Swipe → "Save on home essentials" ← description
  → Two consecutive identical announcements — user confused

After fix:
  Swipe → "Walmart Local Finds" ← actual heading label (meaningful)
  Swipe → "Save on home essentials" ← description
  → Clean, single-stop announcement
```

---

### `isAccessibilityElement = false` vs `shouldGroupAccessibilityChildren = false`

These two properties control different aspects of accessibility:

| Property | Effect when `false` |
|---|---|
| `isAccessibilityElement = false` | The view itself is not a VoiceOver focus stop (children may still be traversed) |
| `shouldGroupAccessibilityChildren = false` | Children are not grouped into a single accessible unit (they stay independent) |

For a fully decorative container with no meaningful children:
```swift
// ✅ Both false: view is invisible to VoiceOver, children not grouped
decorativeView.isAccessibilityElement = false
decorativeView.shouldGroupAccessibilityChildren = false
```

For a container that groups meaningful children:
```swift
// ✅ isAccessibilityElement = false but shouldGroupAccessibilityChildren = true:
// Container is not a focus stop, but children are grouped into a single element
container.isAccessibilityElement = false
container.shouldGroupAccessibilityChildren = true
// → VoiceOver: treats children as a single unit, reads their combined content
```

---

### Identifying decorative views in code

A view is decorative (for accessibility purposes) if:
- It is a background, separator, or shadow image with no textual/semantic content
- Its content duplicates other accessible elements already in the hierarchy
- Removing it from VoiceOver would not cause any loss of information
- Its visual purpose is purely aesthetic (gradient, texture, banner background)

Indicators of incorrectly-decorated views:
```swift
// ❌ Background UIImageView with accessibilityLabel that matches page heading
// ❌ UIView container (header, footer, background) with accessibilityLabel
// ❌ decorativeView.isAccessibilityElement = true with no meaningful unique label
// ❌ Two consecutive same-text accessibility labels on different views
```

---

### Common decorative elements that should be hidden

```swift
// Separators
separatorLine.isAccessibilityElement = false

// Background banners
headerBannerView.isAccessibilityElement = false
headerBannerView.shouldGroupAccessibilityChildren = false

// Shadow/gradient overlays
gradientOverlay.isAccessibilityElement = false

// Decorative icons (when adjacent text already describes the content)
if hasAdjacentTextDescription {
    iconImageView.isAccessibilityElement = false
}

// Spacer/divider views
dividerView.isAccessibilityElement = false

// Background color views
backgroundColorView.isAccessibilityElement = false
```

---

### WCAG 1.1.1 — decorative images

WCAG 1.1.1 requires that non-text content that is **decorative** be implemented in a way that it can be ignored by assistive technology. For iOS:
- Decorative images: `isAccessibilityElement = false` (removes from VoiceOver)
- Decorative interactive images: not applicable (interactive elements must be accessible)

The key test: does the element convey any information or functionality that is not already communicated by other accessible elements in the same view? If not, suppress it.

---

## 🔑 Key Rules

- **Set `isAccessibilityElement = false` on all decorative background views** — background images, gradient overlays, separator lines, and branded banner backgrounds are decorative. They add visual hierarchy but no semantic content for VoiceOver users.
- **Set `shouldGroupAccessibilityChildren = false` on decorative containers** — prevents children from being accidentally grouped under the decorative view as a combined accessible element.
- **Remove `accessibilityLabel` assignments from decorative views** — if a view has a label that is identical to (or derived from) another accessible element on the same screen, it is producing a duplicate announcement. Remove the label and set `isAccessibilityElement = false`.
- **Test for duplicate announcements in VoiceOver** — if two consecutive swipes produce the same text, investigate whether one element is decorative. Duplicate announcements are a strong signal of accessibility over-marking.
- **Do not suppress meaningful content as "decorative"** — a seller's logo or brand image that conveys identity is not decorative. Only suppress views that are purely aesthetic with no information value.

---

## ⚠️ WCAG Failure Without This Fix

- **1.1.1 (Non-Text Content):** All non-text content that is presented to the user has a text alternative that serves the equivalent purpose, except for decorative non-text content, which should be implemented in a way that it can be ignored by assistive technology. A decorative background banner with `isAccessibilityElement = true` is not being "implemented in a way that it can be ignored" — it is actively being presented to VoiceOver with a label. The result is a duplicate focus stop that provides no additional information, violating the requirement that decorative content be ignorable.
