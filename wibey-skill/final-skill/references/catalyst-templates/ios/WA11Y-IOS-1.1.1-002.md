# Catalyst Template: Informative Image Not Exposed to VoiceOver (Alt Text from Backend)

**Template ID:** `WA11Y-IOS-1.1.1-002`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 1.1.1 Non-text Content
**Component:** Benefits Hub NBA banner header / custom accessibility container with informative image
**Source PRs:**
- [#158790](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/158790) | [OAMFD-10836](https://jira.walmart.com/browse/OAMFD-10836) | commits `f8880eab210f` / `5cfcf94b4cd3` — NBA banner header image not focusable by VoiceOver on Benefits Hub; no alt text threaded from backend
**Ingested:** 2026-04-30

---

## The Problem

An informative image (hero banner, product photo, promotional graphic) is either:
1. Not an accessibility element — VoiceOver skips it entirely (the image is invisible to screen reader users)
2. Exposed with a generic or raw label (`"image"`, `"banner_image_01.jpg"`, raw API identifier) — fails to convey the image's meaning

WCAG 1.1.1 requires all informative non-text content to have a text alternative that serves the same purpose. When alt text comes from the backend/API, it must be threaded through the full data chain (GraphQL → parse → model → view).

**Root cause:** In a custom `UIView` container that builds its own `accessibilityElements` array, a hero image is simply not added to the array — VoiceOver never discovers it. For `UIImageView`-based layouts, `isAccessibilityElement` defaults to `false` for images without an `accessibilityLabel`, so informative images are silently skipped.

---

## Fix Patterns

### Pattern A: Custom Container — Add Image Accessibility Element (CEPG-370975 / OAMFD-10836)

**Bad Code:**
```swift
// ❌ Image is not an accessibility element — VoiceOver skips it entirely
// OR: imageView.accessibilityLabel = "banner_image_01.jpg"  (raw identifier)
private func createAccessibilityElements() -> [Any] {
    var elements: [Any] = []
    // ❌ No image element added — informative banner invisible to VoiceOver
    if let combinedElement = createCombinedAccessibilityElement() {
        elements.append(combinedElement)
    }
    return elements
}
```

**Good Code:**
```swift
// ✅ Informative image exposed with meaningful alt text from backend/model
private func createAccessibilityElements() -> [Any] {
    var elements: [Any] = []

    // CEPG-370975: Expose the informative header image to VoiceOver
    if let imageElement = createImageAccessibilityElement() {
        elements.append(imageElement)
    }
    if let combinedElement = createCombinedAccessibilityElement() {
        elements.append(combinedElement)
    }
    return elements
}

/// Create an accessibility element for an informative header image
/// when the backend supplies non-empty alt text.
private func createImageAccessibilityElement() -> UIAccessibilityElement? {
    guard let altText = model?.prismImage?.alt, !altText.isEmpty else {
        return nil  // Image is decorative when no alt text — skip it
    }
    let imageElement = UIAccessibilityElement(accessibilityContainer: self)
    imageElement.accessibilityLabel = altText
    imageElement.accessibilityTraits = .image
    imageElement.accessibilityFrameInContainerSpace = imageContainerView.frame
    return imageElement
}
```

**Why This Works:** `UIAccessibilityElement(accessibilityContainer: self)` creates a virtual accessibility element whose frame is set to the image container's frame, making it discoverable by VoiceOver even though the image is a subview rather than a standalone `UIImageView`. Setting `accessibilityTraits = .image` causes VoiceOver to announce "image" after the label (e.g. "Spark sale banner, image"). Returning `nil` when `altText` is nil or empty treats the image as decorative and skips it — the correct behavior when the backend sends no alt text.

---

### Pattern B: Simple `UIImageView` — Expose with Descriptive Label

For simple `UIImageView` cases (not custom containers):
```swift
// ✅ Simple informative image fix
productImageView.isAccessibilityElement = true
productImageView.accessibilityLabel = item.imageAltText ?? item.title  // descriptive, not filename
productImageView.accessibilityTraits = .image
```

**Why This Works:** Setting `isAccessibilityElement = true` adds the image to VoiceOver's navigation order. A descriptive `accessibilityLabel` (e.g. "Spark sale — up to 50% off electronics") conveys purpose rather than a raw filename. The `accessibilityTraits = .image` role signals to VoiceOver that this is an image, not a button or static text.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Image discoverable by VoiceOver | No — not in `accessibilityElements` array | Yes — `UIAccessibilityElement` added to array |
| Label content | None / raw filename | Alt text from backend (`model.prismImage.alt`) |
| Decorative handling | N/A | Returns `nil` when `altText` is nil or empty — image treated as decorative |
| Image role announced | Not announced | `accessibilityTraits = .image` → VoiceOver says "image" after label |
| Frame | N/A | `accessibilityFrameInContainerSpace` set to `imageContainerView.frame` |

---

## Key Signals (For Pattern Matching)

- `createAccessibilityElements()` or `accessibilityElements` array that omits a hero/banner/product image
- `UIImageView` with `isAccessibilityElement` not set and no `accessibilityLabel` — informative image silently skipped
- `accessibilityLabel` set to a raw filename, asset key, or API identifier instead of descriptive text
- Alt text present in backend API / GraphQL response but not threaded through to the view layer
- `accessibilityValue` used for the image role instead of `accessibilityTraits = .image` (OAMFD-10836 fix)

---

## Key Rules

- `accessibilityTraits = .image` tells VoiceOver to announce "image" after the label, e.g. "Spark sale banner, image"
- `accessibilityLabel` must be descriptive ("Spark sale — up to 50% off electronics") not a file name or raw ID
- When alt text comes from the backend/API, thread it through the full data chain: GraphQL field → parse → model → view
- Return `nil` from `createImageAccessibilityElement()` when `altText` is nil or empty — the image is then treated as decorative
- Use `UIAccessibilityElement(accessibilityContainer: self)` for custom container views where the image is a subview, not a standalone `UIImageView`
- Use `accessibilityTraits = .image` (not `accessibilityValue` with a string) for the image role

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | CEPG-370975 / OAMFD-10836 / PR #158790 | Benefits Hub NBA banner header | `UIAccessibilityElement` with `.image` trait + alt text from `model.prismImage.alt` | Ingested |

---

## Related Templates

- `WA11Y-IOS-1.1.1-001` — iOS: Missing `accessibilityLabel` on informative image (generic + wallet/subscription patterns)
- `WA11Y-IOS-1.1.1-003` — iOS: Decorative image or banner incorrectly exposed to VoiceOver
- `WA11Y-IOS-4.1.2-001` — iOS: Button role missing on custom tappable view
