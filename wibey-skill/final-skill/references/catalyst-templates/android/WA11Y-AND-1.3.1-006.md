# Catalyst Template: Info & Relationships — Superscript Footnote Characters Announced Incorrectly by TalkBack

**Template ID:** `WA11Y-AND-1.3.1-006`
**Platform:** Android
**WCAG Criterion:** 1.3.1 Info and Relationships
**Jira Label:** `WA11Y-AND-1.3.1-006`
**Source Tickets:** CEPG-336004
**Source PRs:** [walmart-glass #123038](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/123038)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Benefit text and legal disclaimers use superscript footnote characters (¹ ² ³) to mark that a phrase has a corresponding disclaimer. TalkBack announces these characters inconsistently — depending on the TTS engine:

- Some announce: *"superscript one"* — meaningless to users
- Some announce: *"one"* — sounds like a number in the text
- Some skip entirely — the footnote reference is silently dropped

In either case, the user cannot tell:
1. That the preceding text has an associated footnote
2. What footnote ID to look for in the disclaimer section

Example: `"Get FREE Express Delivery¹ and free shipping²"` is announced as:
> *"Get FREE Express Delivery superscript one and free shipping superscript two"*

or just:
> *"Get FREE Express Delivery and free shipping"* (footnotes silently skipped)

**Symptom (Jira):** "TalkBack says 'superscript one' on benefit text", "Footnote numbers read strangely by screen reader", "Membership benefits footnote characters not announced correctly", "TalkBack skips footnote references on plan pages".

---

## ✅ The Fix Pattern

### `getAccessibleTextWithFootnotes()` — replace superscripts with verbal footnote references

Two extension functions on `String` — one for body text (where the footnote reference appears inline) and one for the footnote definition section:

```kotlin
import java.text.Normalizer

object AccessibilityUtils {

    private const val NUMBER = "number"

    /**
     * Converts superscript footnote numbers to accessible text with "Has footnote ID: X" format.
     * Used on body text that contains inline superscript footnote markers.
     *
     * Example:
     *   Input:  "Get FREE Express Delivery¹ free shipping² & more"
     *   Output: "Get FREE Express Delivery, Has footnote ID: 1, free shipping, Has footnote ID: 2, & more"
     */
    fun String.getAccessibleTextWithFootnotes(): String {
        return replaceSuperscripts(this, R.string.membership_footnote_template)
    }

    /**
     * Converts superscript footnote numbers to accessible text with "Footnote ID: X description." format.
     * Used at the footnote definition section (the disclaimer at the bottom of the page).
     *
     * Example:
     *   Input:  "¹$35 order min. ²Restrictions apply."
     *   Output: "Footnote ID: 1 description. $35 order min. Footnote ID: 2 description. Restrictions apply."
     */
    fun String.getAccessibleFooterNotesDescription(): String {
        return replaceSuperscripts(this, R.string.membership_footnote_definition_template)
    }

    /**
     * Replaces Unicode superscript / footnote characters (Unicode category \p{No})
     * with a localized human-readable string.
     *
     * Process:
     * 1. Find all superscript runs using the \p{No} regex (Number, Other Unicode category)
     * 2. NFKD-normalize each match to convert e.g. ¹ → "1", ² → "2"
     * 3. Replace in reverse order to preserve string indices
     */
    private fun replaceSuperscripts(source: String, formatId: Int): String {
        val regex = Regex("\\p{No}+")  // matches ¹²³⁴⁵⁶⁷⁸⁹⁰ and Unicode fraction digits
        val matches = regex.findAll(source).toList().reversed()  // reverse to preserve indices
        var result = source
        matches.forEach { match ->
            val normalized = Normalizer.normalize(match.value, Normalizer.Form.NFKD)
            val replacement = string(formatId, NUMBER to normalized)
            result = result.replaceRange(match.range, replacement)
        }
        return result
    }
}
```

```xml
<!-- strings.xml — two templates -->
<!-- Body text: wraps the footnote ID with commas to read as a natural pause -->
<string name="membership_footnote_template">, Has footnote ID: {number},</string>

<!-- Footnote definition: precedes the ID with a full label -->
<string name="membership_footnote_definition_template">Footnote ID: {number} description.\u0020</string>
```

---

### Usage in the UI layer

```kotlin
// Body text (benefit title with inline footnote references)
binding.membershipBenefitTitle.contentDescription =
    configs.title?.getAccessibleTextWithFootnotes()
// Input:  "Free shipping¹"
// Output: "Free shipping, Has footnote ID: 1,"
// TalkBack: "Free shipping, Has footnote ID: 1"

// Footnote definition section (disclaimer text at bottom of page)
binding.membershipFootnoteText.contentDescription =
    configs.footnoteText?.getAccessibleFooterNotesDescription()
// Input:  "¹$35 minimum order required."
// Output: "Footnote ID: 1 description. $35 minimum order required."
// TalkBack: "Footnote ID: 1 description. $35 minimum order required."
```

---

### Why `\p{No}` and NFKD normalization

- **`\p{No}`** — Unicode property "Number, Other" includes superscript digits (¹²³...), subscript digits (₁₂₃...), fractions (½ ¼), and enclosed numerals. It matches all characters used as footnote markers without needing to enumerate them.
- **`Normalizer.Form.NFKD`** — "Compatibility Decomposition" converts superscript ¹ to the ASCII digit "1", ² to "2", etc. Without normalization, the numeric value embedded in the superscript character would not be human-readable.
- **Reverse order processing** — replacing matches from the end of the string prevents the replacement from invalidating the start/end indices of earlier matches.

---

### Verified transformation examples (from tests)

```kotlin
// Body text footnote:
"Get FREE Express Delivery¹ ²"
→ "Get FREE Express Delivery, Has footnote ID: 1, , Has footnote ID: 2,"

// Footnote definition:
"¹$35 order min. ²Restrictions apply."
→ "Footnote ID: 1 description. $35 order min. Footnote ID: 2 description. Restrictions apply."

// Unicode accent characters are preserved:
"Café¹ résumé²"
→ "Café, Has footnote ID: 1, résumé, Has footnote ID: 2,"
```

---

## 🔑 Key Rules

- **Superscript characters are presentation-only** — `¹²³` are Unicode characters that visually look like small elevated numbers, but their semantic meaning ("this text has footnote #1") is a relationship, not a character. Use `contentDescription` to convey the relationship, not the raw character.
- **Two different templates for two different contexts** — inline references use `"Has footnote ID: X"` (so TalkBack says there's a footnote to find). Definitions use `"Footnote ID: X description."` (so users know they've arrived at the footnote content).
- **Process before setting `contentDescription`** — call `.getAccessibleTextWithFootnotes()` on the string before assigning to `contentDescription`. Do not call it on the `text` property (visual text should keep the superscript for sighted users).
- **Sighted users keep the superscript visually** — `binding.textView.text` keeps `"Free shipping¹"`. Only `contentDescription` gets the expanded text. This preserves visual design while fixing AT.
- **`\p{No}` catches all Unicode footnote markers** — it handles ¹²³ (Latin), ⁴⁵⁶⁷ (more Latin), fractions (½¼¾), and enclosed numbers (①②③). Do not hardcode a character class.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.1 (Info and Relationships):** Information, structure, and relationships conveyed through presentation must be programmatically determinable or available in text. A superscript footnote marker is a presentational indicator of a relationship: "this text is qualified by footnote N". When TalkBack announces the marker as "superscript one" or silently skips it, the relationship is not communicated to the user. A TalkBack user cannot know whether the benefit text they just heard has a restriction or qualifier. The fix expresses the footnote relationship as explicit text: "Has footnote ID: 1", making the relationship programmatically determinable.
