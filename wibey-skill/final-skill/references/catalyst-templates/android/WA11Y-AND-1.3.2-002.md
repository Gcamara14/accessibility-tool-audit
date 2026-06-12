# Catalyst Template: Meaningful Sequence — Composite `contentDescription` Reading Order Mismatches Visual Layout When Logo Position Varies

**Template ID:** `WA11Y-AND-1.3.2-002`
**Platform:** Android
**WCAG Criterion:** 1.3.2 Meaningful Sequence
**Jira Label:** `WA11Y-AND-1.3.2-002`
**Source Tickets:** CEPG-342499
**Source PRs:** [walmart-glass #139069](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139069)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

An OnePay offer card (`OnePayOfferView`) contains three text segments and a logo image:
- **Logo** (visual: Pay-in-4 logo / one-pay new branding logo)
- **Offer text** (e.g., "4 interest-free payments of $12.50")
- **Description** (e.g., "with")
- **Learn more text** (e.g., "Learn more")

The visual layout renders the logo either **before** or **after** the text depending on the variant:
- `isPayIn4Variant = true` → logo appears **before** the text group
- `isOnePayNewLogoFlow = true` → logo appears **before** the text group
- Default (neither flag) → logo appears **after** the text group

The `contentDescription` was built using a single hardcoded string template that always placed the text in the **same order** regardless of which layout was actually rendered:

```kotlin
// ❌ Before fix — always "offerText description learnMoreText" regardless of logo position
contentDescription = string(
    R.string.one_pay_offer_accessibility_label,
    Constants.ONE_PAY_OFFER_TEXT to offerText,
    Constants.ONE_PAY_DESCRIPTION to description,
    Constants.ONE_PAY_LEARN_MORE to learnMoreText
)
```

When the logo was displayed **before** the text (Pay-in-4 / new logo variants), sighted users read the offer in this order:
> **[Logo] → 4 interest-free payments of $12.50 → with → Learn more**

But TalkBack announced (in the old fixed order):
> **"4 interest-free payments of $12.50, with, Learn more"** — logo announced after text even though it renders before

The announcement sequence does not match the visual reading order, violating meaningful sequence.

**Symptom (Jira):** "TalkBack reading order doesn't match visual layout on OnePay card", "Pay-in-4 offer logo announced after text but renders before it", "Screen reader sequence doesn't match visual sequence on payment offer", "OnePayOfferView content description wrong order for new logo variant".

---

## ✅ The Fix Pattern

### `getOfferDescriptionForAccessibility(data, isLogoBeforeText)` — dynamically order segments based on layout

Extract the announcement builder into a standalone function that takes `isLogoBeforeText: Boolean`. When the logo renders first, concatenate segments in visual order using `joinToString`. When the logo renders last, use the existing string template (which naturally appended the logo label at the end).

```kotlin
// OnePayOfferView.kt  (or OnePayOfferAccessibilityHelper.kt)

/**
 * Returns the composite contentDescription for the OnePay offer card,
 * with segments in the same order they appear visually.
 *
 * @param data             The offer data (offer text, description, learn-more text, logo label).
 * @param isLogoBeforeText True when the logo renders BEFORE the text block
 *                         (Pay-in-4 variant or new logo flow).
 *                         False when the logo renders AFTER the text block (default).
 */
fun getOfferDescriptionForAccessibility(
    data: OnePayOfferData,
    isLogoBeforeText: Boolean
): String {
    val offerText = data.offerText.orEmpty()
    val description = data.description.orEmpty()
    val learnMoreText = data.learnMoreText.orEmpty()

    return if (isLogoBeforeText) {
        // ✅ Logo renders first — announce text in left-to-right visual order.
        // Filter blank segments to avoid orphan separators ("4 payments, , Learn more").
        listOf(offerText, description, learnMoreText)
            .filter { it.isNotBlank() }
            .joinToString(". ")
            .takeIf { it.isNotEmpty() }
            ?.plus(".")          // trailing period closes the announcement naturally
            .orEmpty()
    } else {
        // ✅ Logo renders last — use original string template which appends logo label at end.
        string(
            R.string.one_pay_offer_accessibility_label,
            Constants.ONE_PAY_OFFER_TEXT to offerText,
            Constants.ONE_PAY_DESCRIPTION to description,
            Constants.ONE_PAY_LEARN_MORE to learnMoreText
        )
    }
}
```

---

### Call site — determine `isLogoBeforeText` from variant flags

```kotlin
// OnePayOfferView.kt

private fun bindOffer(data: OnePayOfferData) {
    // ✅ Determine logo position from active variant flags
    val isLogoBeforeText = data.isPayIn4Variant || data.isOnePayNewLogoFlow

    // ✅ Build contentDescription matching the actual visual layout
    contentDescription = getOfferDescriptionForAccessibility(data, isLogoBeforeText)

    // Existing visual layout logic (unchanged):
    if (isLogoBeforeText) {
        // Logo rendered first (before text block) by the layout
        binding.logoImageView.visibility = View.VISIBLE
        binding.logoBeforeTextGroup.visibility = View.VISIBLE
        binding.logoAfterTextGroup.visibility = View.GONE
    } else {
        binding.logoAfterTextGroup.visibility = View.VISIBLE
        binding.logoBeforeTextGroup.visibility = View.GONE
    }

    binding.offerTextView.text = data.offerText
    binding.descriptionTextView.text = data.description
    binding.learnMoreTextView.text = data.learnMoreText
}
```

---

### ❌ Bad Code — fixed order ignores logo position

```kotlin
// ❌ Before fix — contentDescription always in same order regardless of layout
private fun bindOffer(data: OnePayOfferData) {
    // isPayIn4Variant and isOnePayNewLogoFlow correctly move logo to first position visually,
    // but the contentDescription is built from a hardcoded template that never changes order.
    contentDescription = string(
        R.string.one_pay_offer_accessibility_label,
        Constants.ONE_PAY_OFFER_TEXT to data.offerText.orEmpty(),
        Constants.ONE_PAY_DESCRIPTION to data.description.orEmpty(),
        Constants.ONE_PAY_LEARN_MORE to data.learnMoreText.orEmpty()
    )
    // ← When isPayIn4Variant=true:
    //   Visual:   [PayIn4 logo] "4 payments" "with" "Learn more"
    //   TalkBack: "4 payments, with, Learn more" — logo position not reflected
}
```

---

### Verified announcement sequences

```
// isPayIn4Variant = true  (logo BEFORE text):
Visual:   [Pay-in-4 logo] → "4 interest-free payments of $12.50" → "with" → "Learn more"
TalkBack: "4 interest-free payments of $12.50. with. Learn more."

// isOnePayNewLogoFlow = true  (logo BEFORE text):
Visual:   [OnePay new logo] → "4 interest-free payments of $12.50" → "with" → "Learn more"
TalkBack: "4 interest-free payments of $12.50. with. Learn more."

// Default (neither flag — logo AFTER text):
Visual:   "4 payments" → "with" → "Learn more" → [OnePay logo]
TalkBack: "<one_pay_offer_accessibility_label template output>"
           e.g. "4 payments with OnePay. Learn more."
```

---

### Why `joinToString(". ")` with a trailing `.plus(".")`

The period separator is used (not comma) to produce natural pauses between the three announcement segments. TTS engines read `. ` with a longer pause than `, `, which matches the visual separation between the text elements. The trailing `.plus(".")` closes the final segment — without it, TTS sometimes runs the last word into the next focusable element's announcement.

---

### Why `filter { it.isNotBlank() }`

`data.description` may be empty for some offer configurations (e.g., "4 payments of $12.50" with no "with" connector). Without filtering, `listOf("4 payments", "", "Learn more").joinToString(". ")` produces `"4 payments. . Learn more."` — TTS says "four payments. full stop. learn more" which is jarring. Filtering removes empty/blank segments before joining.

---

## 🔑 Key Rules

- **Drive `isLogoBeforeText` from the same variant flags that drive the visual layout** — `val isLogoBeforeText = data.isPayIn4Variant || data.isOnePayNewLogoFlow`. The flag must be derived from the same source of truth used by the layout code; do not independently detect logo position from view visibility.
- **`joinToString(". ")` not `joinToString(", ")`** — period separators produce natural speech pauses that match the visual grouping of the text elements. Comma separators make the segments run together.
- **Filter blank segments before joining** — `filter { it.isNotBlank() }` prevents double-period artefacts (`"payments. . Learn more."`) when optional text fields are empty.
- **Close with a trailing period** — `.takeIf { it.isNotEmpty() }?.plus(".")` appends a terminal period so TTS ends the announcement cleanly before moving to the next focusable view.
- **Extract to a standalone function for testability** — `getOfferDescriptionForAccessibility(data, isLogoBeforeText)` is pure (no view references) and can be unit-tested with all flag combinations without inflating a view.
- **The string template path (logo-after) remains unchanged** — only the logo-before path uses `joinToString`. The default string template already produced the correct order for the logo-after layout; changing it would introduce a regression.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.2 (Meaningful Sequence):** If the sequence in which content is presented affects its meaning, a correct reading sequence must be programmatically determinable. When the Pay-in-4 or new logo variant renders the logo before the offer text, sighted users read the visual layout left-to-right: logo → offer → description → action. TalkBack users, relying on `contentDescription`, received the text segments in a fixed order that did not match the visual layout. The sequence of the announcement affects the perceived meaning — a logo first signals the payment provider before the offer details; reversing this order changes the information hierarchy a screen reader user receives.
