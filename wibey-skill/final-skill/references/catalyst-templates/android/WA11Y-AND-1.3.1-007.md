# Catalyst Template: Info & Relationships — Unicode Icon Character in Text Announced Incorrectly by TalkBack

**Template ID:** `WA11Y-AND-1.3.1-007`
**Platform:** Android
**WCAG Criterion:** 1.3.1 Info and Relationships
**Jira Label:** `WA11Y-AND-1.3.1-007`
**Source Tickets:** CEPG-335421
**Source PRs:** [walmart-glass #123310](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/123310)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A delivery instructions disclaimer `TextView` contains a Unicode circled information icon character (`ⓘ`) inline with text:

```
"Learn more about delivery instructions ⓘ"
```

TalkBack announces the `ⓘ` character differently depending on the TTS engine:
- Some announce: *"circled latin small letter i"* — not meaningful
- Some announce: *"information"* — closer, but does not convey that it's a button/interactive
- Some skip it entirely — the interactive affordance is silently dropped

In none of these cases does the user understand that `ⓘ` represents an interactive "information button" they can activate to learn more.

**Symptom (Jira):** "TalkBack reads 'circled latin small letter i' on disclaimer text", "Info icon character announced incorrectly by screen reader", "ⓘ unicode announced as a letter not as a button", "Delivery instructions info icon inaccessible to TalkBack".

---

## ✅ The Fix Pattern

### `getDeliveryInstructionsDisclaimerContentDescription()` — replace Unicode icon with verbal label

A utility function that replaces the Unicode icon string with a human-readable accessible label, applied to `contentDescription` before setting it on the `TextView`. The visual text retains the icon for sighted users.

```kotlin
// AccessibilityUtils.kt

/**
 * Replaces the info icon unicode character with a human-readable accessible label.
 * This ensures that screen readers can properly interpret the presence of an info icon
 * embedded in inline text.
 *
 * @param text The text to process, may be null.
 * @param infoIconUnicode The unicode string representing the info icon (e.g., "ⓘ").
 * @return The processed content description string with the icon replaced by its label.
 *
 * Example:
 *   Input:  "Learn more about delivery instructions ⓘ"
 *   Output: "Learn more about delivery instructions information, button"
 */
fun getDeliveryInstructionsDisclaimerContentDescription(
    text: CharSequence?,
    infoIconUnicode: String
): String {
    val accessibleLabel = string(R.string.checkout_delivery_instructions_disclaimer_info_icon_accessible_label)
    // → "information, button"
    val rawContent = text?.toString() ?: ""
    return rawContent.replace(infoIconUnicode, accessibleLabel)
}
```

```xml
<!-- strings.xml -->
<string name="checkout_delivery_instructions_disclaimer_info_icon_accessible_label">information, button</string>
<!-- The comma-space creates a natural spoken pause: "instructions information, button" -->
```

---

### Call site

```kotlin
// DeliveryInstructionsDelegate.kt

private fun TextView.setDeliveryInstructionsDisclaimerText(item: DeliveryInstructions) {
    // ✅ Visual text keeps the Unicode icon for sighted users
    text = item.disclaimerText
    // → "Learn more about delivery instructions ⓘ"

    // ✅ contentDescription replaces the icon with its accessible label
    contentDescription = getDeliveryInstructionsDisclaimerContentDescription(
        text,
        string(R.string.checkout_delivery_instructions_disclaimer_learn_more_unicode)
        // → "ⓘ"
    )
    // → "Learn more about delivery instructions information, button"
    // TalkBack: "Learn more about delivery instructions information, button"
}
```

---

### Verified transformation examples (from tests)

```kotlin
// Null input returns empty string
getDeliveryInstructionsDisclaimerContentDescription(null, "ⓘ")
→ ""

// Icon present — replaced with label
getDeliveryInstructionsDisclaimerContentDescription("Some text ⓘ more text", "ⓘ")
→ "Some text information, button more text"

// Icon not present — text returned unchanged
getDeliveryInstructionsDisclaimerContentDescription("No icon here", "ⓘ")
→ "No icon here"
```

---

### Pattern generalisation

The same technique applies to any inline Unicode symbol used as a visual affordance indicator:

| Unicode character | Visual meaning | Accessible replacement |
|---|---|---|
| `ⓘ` (U+24D8) | Information/help button | `"information, button"` |
| `★` (U+2605) | Rating indicator | `"rated X stars"` (with count) |
| `♥` (U+2665) | Favourite / heart | `"favorited"` or `"add to favourites"` |
| `⚠` (U+26A0) | Warning indicator | `"warning"` |
| `→` (U+2192) | Navigation arrow | `""` (suppress if decorative) or `"navigate"` |

The `replace(unicode, label)` approach works for single-character icons. For icons that appear multiple times with different meanings, use a more targeted replacement (e.g., Regex with index tracking as in `WA11Y-AND-1.3.1-006` for superscripts).

---

## 🔑 Key Rules

- **Apply to `contentDescription` only — keep `text` unchanged** — `binding.disclaimerTextView.text = item.text` preserves the icon for sighted users. Only `contentDescription` gets the replaced string. This is the same visual-vs-accessible split used in the superscript footnote pattern (WA11Y-AND-1.3.1-006).
- **Store the Unicode character in a string resource** — `R.string.checkout_delivery_instructions_disclaimer_learn_more_unicode` holds `"ⓘ"`. This makes the replacement testable and avoids literal Unicode in Kotlin source code, which can be mangled by editors or build tooling.
- **The accessible label "information, button" uses a comma** — the comma produces a short spoken pause between "information" and "button", making TalkBack read: "information... button" as two related words. Without the comma, "informationbutton" runs together.
- **Handle null input** — `text?.toString() ?: ""` returns an empty string for null text. Do not crash or return a partial replacement.
- **This pattern is complementary to `WA11Y-AND-1.3.1-006` (superscripts)** — both fix inline Unicode characters that are misannounced by TalkBack. For characters that repeat in a document with different values (¹²³), use the NFKD normalization approach. For single-purpose icons (ⓘ), a simple `String.replace()` is sufficient.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.1 (Info and Relationships):** Information, structure, and relationships conveyed through presentation must be programmatically determinable or available in text. The `ⓘ` character conveys a relationship — "this text has an associated information/help action". When TalkBack announces it as "circled latin small letter i" or skips it, the relationship between the disclaimer text and the available interactive action is not communicated. Users cannot know an information button exists without the explicit label "information, button" in the accessible description.
