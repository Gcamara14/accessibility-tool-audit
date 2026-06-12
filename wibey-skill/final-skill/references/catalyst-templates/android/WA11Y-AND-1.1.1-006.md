# Catalyst Template: Alt Text — Product Image Alt Text Missing or Overflow Counter Has No Description

**Template ID:** `WA11Y-AND-1.1.1-006`
**Platform:** Android
**WCAG Criterion:** 1.1.1 Non-text Content
**Jira Label:** `WA11Y-AND-1.1.1-006`
**Source Tickets:** CEPG-370110, CEPG-370119
**Source PRs:** [walmart-glass #138392](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138392)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Two common failures in image carousels and product tile lists:

1. **Product image missing alt text with no fallback** — when the backend returns `alt: null` for an image, the code does nothing (or previously only set `contentDescription` when `alt != null`). TalkBack either reads nothing or announces an internal resource name. Users cannot tell what product the image depicts.

2. **"+N" overflow counter has no accessible description** — a tile showing 4 product images uses a `"+3"` badge to indicate there are additional items. TalkBack reads `"+3"` with no context — the user cannot tell if this means "+3 more items", "+3 discount", or something else entirely.

**Symptom (Jira):** "TalkBack skips product image in basket carousel", "'+3' badge not described to screen reader", "Image in Quick Start Basket not accessible", "Product photo has no alt text when API returns null".

---

## ✅ The Fix Pattern

### Pattern A: API `alt` text with ICU-format fallback

**❌ Bad Code:**
```kotlin
// Only sets contentDescription when the API provides an alt string.
// When alt is null, contentDescription stays as whatever it was before (often null/empty).
// TalkBack: silent, or reads resource ID.
currentImage.alt?.let { alt ->
    imageView.contentDescription = alt
}
// ← When alt == null, imageView.contentDescription is never set
```

**✅ Good Code:**
```kotlin
// Set contentDescription unconditionally:
// - Use the API alt text when provided (meaningful CMS-authored description)
// - Fall back to an ordinal label when null ("Item image 1", "Item image 2", ...)
// - Always set importantForAccessibility=YES to guarantee TalkBack discovers the view
imageView.contentDescription = currentImage.alt
    ?: string(
        R.string.reorder_quick_start_basket_item_image_description,
        "itemNumber" to (index + 1)
    )
    // → "Organic Whole Milk" (from API) or "Item image 1" (fallback)
imageView.importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES

// When the image slot is empty (index >= images.size), hide it from AT entirely:
imageView.visibility = ConstraintLayout.GONE
imageView.contentDescription = null
imageView.importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_AUTO
```

```xml
<!-- strings.xml — ordinal fallback and overflow counter -->
<string name="reorder_quick_start_basket_item_image_description">Item image {itemNumber}</string>
<string name="reorder_quick_start_basket_additional_items_a11y">+{additionalItems} more items</string>
```

---

### Pattern B: "+N more items" overflow counter `contentDescription`

**❌ Bad Code:**
```kotlin
// Badge shows "+3" visually but has no accessible description.
// TalkBack reads "+3" — no context that this means "3 more items".
reorderQuickStartBasketItemNumber.text = "+$additionalItems"
reorderQuickStartBasketItemNumber.visibility = VISIBLE
// ← No contentDescription
```

**✅ Good Code:**
```kotlin
// Set a localized contentDescription so TalkBack announces
// "+3 more items" instead of just "+3".
reorderQuickStartBasketItemNumber.text = "+$additionalItems"
reorderQuickStartBasketItemNumber.contentDescription = string(
    R.string.reorder_quick_start_basket_additional_items_a11y,
    "additionalItems" to additionalItems
)
// → TalkBack: "+3 more items"
reorderQuickStartBasketItemNumber.visibility = VISIBLE
```

---

### Pattern C: `importantForAccessibility = YES` on programmatically loaded images

Images loaded by Glide/Coil/Picasso into an `ImageView` are sometimes not discovered by TalkBack when they're nested inside a container that was previously `GONE`. Explicitly setting `importantForAccessibility = YES` ensures TalkBack can find the image regardless of the loading path:

```kotlin
// Load image and make it explicitly accessible
imageView.load(imageUrl) {
    // image loading callback
}
imageView.contentDescription = altText ?: fallbackDescription
imageView.importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES
imageView.visibility = View.VISIBLE
```

---

## 🔑 Key Rules

- **Always provide a fallback `contentDescription`** — never use `?.let { alt -> imageView.contentDescription = alt }` without handling the `null` case. A product image silently missing its description is a regression from the user's perspective.
- **Fallback should be ordinal and meaningful** — "Item image 1", "Item image 2" is always better than silence. Users know they're on a product tile; an ordinal label at minimum tells them there are multiple images.
- **Set `contentDescription = null` when hiding an image slot** — when `imageView.visibility = GONE`, also clear `contentDescription`. Stale descriptions from previous bind cycles can be announced even when the image is hidden.
- **Pair `importantForAccessibility = YES` with every programmatic `contentDescription` assignment** — for images that are not always visible (carousel tiles, basket overlays), the `importantForAccessibility` default may be `AUTO` which defers to the framework. `YES` is explicit and prevents TalkBack discovery failures.
- **"+N" badges always need a contextual `contentDescription`** — a numeric badge with no description is meaningless to screen-reader users. Pattern: `"+{count} more items"` or `"+{count} more images"` depending on context.

---

## ⚠️ WCAG Failure Without This Fix

- **1.1.1 (Non-text Content):** All non-text content presented to the user — including product images in a carousel — must have a text alternative. An `ImageView` whose `contentDescription` is null because the API returned a null `alt` field has no text alternative. A "+3" badge with no `contentDescription` presents a numeric symbol with no text equivalent. Both cases are WCAG 1.1.1 failures.
