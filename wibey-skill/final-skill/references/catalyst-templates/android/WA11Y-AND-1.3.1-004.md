# Catalyst Template: Info — Strikethrough Price Text Not Accessible to Screen Readers

**Template ID:** `WA11Y-AND-1.3.1-004`
**Platform:** Android
**WCAG Criterion:** 1.3.1 Info and Relationships
**Jira Label:** `WA11Y-AND-1.3.1-004`
**Source Tickets:** CEPG-107208, CRUISE-13336, OAMD-8076
**Source PRs:** [walmart-glass #94746](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/94746), [walmart-glass #112252](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/112252)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A `TextView` displays a visually **crossed-out (strikethrough) price** using `Paint.STRIKE_THRU_TEXT_FLAG` or `STRIKE_THRU_TEXT_FLAG` styling to indicate an original/was price. When TalkBack reads the view it announces only the raw numeric string (e.g., `"$12.99"`) — there is **no indication that the value is a previous/reduced price**. The visual strikethrough style is applied purely via `Paint` flags; Android's accessibility framework has no mechanism to translate that visual property into speech.

**Symptom (Jira):** "TalkBack reads the original price as a current price", "Was price not announced as 'was'", "Strikethrough price missing context for screen reader users", "Screen reader doesn't convey price reduction".

---

## ✅ The Fix Pattern

### Pattern A: Set `contentDescription` when applying `STRIKE_THRU_TEXT_FLAG`

**❌ Bad Code:**
```kotlin
// Strikethrough applied visually — TalkBack announces "$12.99" with no context.
// User cannot tell this is the old/reduced-from price.
binding.wasPriceTextView.apply {
    text = localizedPrice
    paintFlags = Paint.STRIKE_THRU_TEXT_FLAG
}
```

**✅ Good Code:**
```kotlin
// Set content description BEFORE or alongside the paint flag so TalkBack
// announces "Was $12.99" instead of just "$12.99".
binding.wasPriceTextView.apply {
    text = localizedPrice
    contentDescription = string(
        R.string.subscriptions_was_price_content_description,
        SubscriptionStringKeys.ITEM_PRICE to localizedPrice,
        SubscriptionStringKeys.TEXT to ""
    ).trim()
    paintFlags = Paint.STRIKE_THRU_TEXT_FLAG
}
```

```xml
<!-- strings.xml -->
<string name="subscriptions_was_price_content_description">Was {itemPrice} {text}</string>
```

---

### Pattern B: Guard `contentDescription` on the `useStrikethrough` condition

When a price component switches between regular and strikethrough display based on a flag, guard the `contentDescription` override so it only fires when the strikethrough style is actually applied:

**✅ Good Code:**
```kotlin
// Only override contentDescription when the price is displayed as strikethrough.
// Do not override it for regular (non-strikethrough) price display.
if (useStrikethrough && originalPrice != null) {
    comparisonPriceTextView.contentDescription =
        string(
            R.string.ui_shared_grid_product_tile_original_price_description,
            ICU_KEY_ORIGINAL_PRICE to originalPrice
        )
    // → TalkBack: "Original price $12.99"
}
```

```xml
<!-- strings.xml -->
<string name="ui_shared_grid_product_tile_original_price_description">Original price {originalPrice}</string>
```

---

### Pattern C: Helper function for variant tile strikethrough price description

For components that build their content description from multiple parts (variant tile, product tile), extract strikethrough price description into a dedicated helper:

**✅ Good Code:**
```kotlin
@VisibleForTesting
internal fun getContentDescriptionWasPrice(
    validVariantSelection: ValidVariantSelection
): String {
    val strikethroughPrice = validVariantSelection.strikethroughPrice
    return when {
        strikethroughPrice.hasText() -> {
            string(
                R.string.item_variant_was_price_template,
                WAS_PRICE_STRING to strikethroughPrice
            )
            // → "Was $10.99"
        }
        else -> ""  // No strikethrough — no "Was" prefix needed
    }
}
```

```xml
<!-- strings.xml -->
<string name="item_variant_was_price_template">Was {wasPrice}</string>
```

The returned string is then concatenated into the full tile content description:

```kotlin
val fullDescription = buildString {
    append(variantName)
    append(", ")
    append(getContentDescriptionWasPrice(validVariantSelection))
    // → "Blue, Large, Was $10.99, $7.99"
}
host.contentDescription = fullDescription
```

---

## 🔑 Key Rules

- **`Paint.STRIKE_THRU_TEXT_FLAG` is invisible to TalkBack** — the Android accessibility framework reads `TextView.text` not visual styles. Setting `contentDescription = "Was $X.XX"` or `"Original price $X.XX"` is the only way to convey the strikethrough semantic to screen readers.
- **Set `contentDescription` in the same code path that applies `paintFlags`** — keeps them in sync. If you later remove the strikethrough flag, also remove the `contentDescription` override (or it will describe a strikethrough that no longer exists visually).
- **Use localized string resources** — hard-coding `"Was "` + price concatenation fails in RTL locales and ignores translations. Use an ICU string template with the price as a placeholder.
- **Guard on the strikethrough condition** — only override `contentDescription` when `useStrikethrough` / `paintFlags has STRIKE_THRU_TEXT_FLAG` is true. The regular (non-discounted) price should not announce "Was" prefix.
- **Trim whitespace** from the composed description (`string(...).trim()`) — ICU template substitution can leave trailing spaces when optional parts are empty.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.1 (Info and Relationships):** Information conveyed through visual formatting (in this case the strikethrough style that marks a price as "was" / "original") must be programmatically determinable. A price that is visually crossed out carries a semantic meaning — "this was the price, now it's cheaper" — that must be available to assistive technologies. A `TextView` with `Paint.STRIKE_THRU_TEXT_FLAG` and no `contentDescription` override provides no such programmatic meaning, causing screen-reader users to mistake a discounted "was price" for the current selling price.
