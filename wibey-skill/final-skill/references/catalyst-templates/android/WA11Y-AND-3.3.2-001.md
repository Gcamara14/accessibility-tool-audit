# Catalyst Template: Labels — Asterisk `*` in Required Field Label Announced Literally by TalkBack

**Template ID:** `WA11Y-AND-3.3.2-001`
**Platform:** Android
**WCAG Criterion:** 3.3.2 Labels or Instructions
**Jira Label:** `WA11Y-AND-3.3.2-001`
**Source Tickets:** CEPG-281002
**Source PRs:** [walmart-glass #130401](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/130401)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Form fields that use an asterisk (`*`) in their label to indicate "required" cause TalkBack to announce:

> **"Card number asterisk, Edit box"** or **"Card number star, Edit box"**

The visual convention (asterisk = required) is meaningless to TalkBack users. They hear a literal punctuation symbol with no explanation of what it means. Worse, on some TTS engines the asterisk is skipped entirely — TalkBack says "Card number" with no indication that the field is mandatory.

**Two sub-failures:**
1. TalkBack reads `*` as "asterisk" or "star" — confusing, not meaningful
2. If `*` is stripped by the TTS engine, no "required" indicator reaches the user at all

**Symptom (Jira):** "TalkBack says 'asterisk' on required payment fields", "Required indicator not communicated to screen reader", "Card number field says 'star' on TalkBack", "Screen reader users don't know fields are required", "Asterisk in label announced literally".

---

## ✅ The Fix Pattern

### `RequiredFieldAccessibilityDelegate` — strip asterisk, build semantic description

A reusable `AccessibilityDelegateCompat` that:
1. Removes the asterisk from the spoken label
2. Appends the word "required" explicitly
3. Includes the current field value (so TalkBack users know the field content)
4. Optionally includes a hint string and dynamic additional content

```kotlin
/**
 * Reusable accessibility delegate for required text fields with asterisks in their labels.
 *
 * Removes the asterisk (*) from the label and replaces it with the semantic word "required".
 * TalkBack announces: "Card number required, 4111 1111, Edit box"
 * instead of: "Card number asterisk, Edit box"
 *
 * WCAG 3.3.2: Instructions or labels that are required must be visible to AT.
 */
class RequiredFieldAccessibilityDelegate(
    @StringRes private val labelResId: Int,
    @StringRes private val editBoxHintResId: Int? = null,
    private val additionalContentProvider: (() -> String)? = null
) : AccessibilityDelegateCompat() {

    override fun onInitializeAccessibilityNodeInfo(
        host: View,
        info: AccessibilityNodeInfoCompat
    ) {
        super.onInitializeAccessibilityNodeInfo(host, info)

        val parts = buildList {
            // 1. Clean label — asterisk removed, trimmed
            add(getCleanLabel(labelResId))
            // → "Card number" (was "Card number *")

            // 2. Semantic "required" indicator
            add("required")

            // 3. Dynamic additional context (e.g., detected card type: "Visa")
            additionalContentProvider?.invoke()
                ?.takeIf { it.isNotEmpty() }
                ?.let { add(it) }

            // 4. Current field value (if TextField contains text)
            if (host is TextField) {
                host.editText.text?.toString()
                    ?.takeIf { it.isNotEmpty() }
                    ?.let { add(it) }
            }

            // 5. Optional edit-box hint for first-focus guidance
            editBoxHintResId?.let { add(string(it)) }
        }

        info.contentDescription = parts.joinToString(" ").trim()
        // → "Card number required, 4111 1111"
        // → "Card number required, Visa, 4111 1111, Enter your 16-digit card number"
    }

    internal fun getCleanLabel(@StringRes resId: Int): String {
        return try {
            string(resId).replace("*", "").trim()
        } catch (e: Resources.NotFoundException) {
            XLog.e(TAG, "String resource not found: $resId", e)
            ""
        }
    }

    companion object {
        private const val TAG = "RequiredFieldA11yDelegate"
    }
}
```

---

### Extension functions for easy wiring

```kotlin
// Extension for TextField (design system component)
fun TextField.setRequiredFieldAccessibility(
    @StringRes labelResId: Int,
    @StringRes editBoxHintResId: Int? = null,
    additionalContentProvider: (() -> String)? = null
) {
    ViewCompat.setAccessibilityDelegate(
        this,
        RequiredFieldAccessibilityDelegate(
            labelResId = labelResId,
            editBoxHintResId = editBoxHintResId,
            additionalContentProvider = additionalContentProvider
        )
    )
}

// Extension for generic View
fun View.setRequiredFieldAccessibility(
    @StringRes labelResId: Int,
    @StringRes editBoxHintResId: Int? = null,
    additionalContentProvider: (() -> String)? = null
) {
    ViewCompat.setAccessibilityDelegate(
        this,
        RequiredFieldAccessibilityDelegate(
            labelResId = labelResId,
            editBoxHintResId = editBoxHintResId,
            additionalContentProvider = additionalContentProvider
        )
    )
}
```

---

### Call site — payment form fields

```kotlin
// Card number field — static required label, no additional provider
binding.tfAdCardNumber.setRequiredFieldAccessibility(
    labelResId = R.string.payment_card_number_label  // → "Card number *"
    // Delegate strips "*", adds "required"
    // TalkBack: "Card number required"
)

// Card number with dynamic card-type detection
binding.tfAdCardNumber.setRequiredFieldAccessibility(
    labelResId = R.string.payment_card_number_label,
    additionalContentProvider = { detectedCardType }  // → "Visa", "Mastercard"
    // TalkBack: "Card number required Visa"
)

// WIN (Walmart Identification Number) field with hint
binding.tfAdWinNumber.setRequiredFieldAccessibility(
    labelResId = R.string.payment_win_label,
    editBoxHintResId = R.string.payment_win_hint  // → "Enter your 9-digit WIN"
    // TalkBack: "WIN required Enter your 9-digit WIN"
)
```

---

### ❌ Bad Code — raw asterisk in label reaches TalkBack

```kotlin
// TextField label is "Card number *" in strings.xml.
// No accessibility delegate → TalkBack announces:
// "Card number asterisk, Edit box"  ← asterisk announced literally
binding.tfAdCardNumber.label = string(R.string.payment_card_number_label)  // "Card number *"
// No delegate set → raw asterisk reaches TalkBack
```

---

## 🔑 Key Rules

- **Strip `*` from the spoken label, replace with the word "required"** — `label.replace("*", "").trim()` removes the symbol; adding "required" provides the semantic meaning TalkBack users need.
- **Do NOT use `*` in string resources intended for AT** — if a string resource is used only as a `contentDescription`, never put `*` in it. Use the word "required" or rely on `info.isRequired = true` (API 19+: `AccessibilityNodeInfo.setRequired(true)`).
- **Include the current field value in the description** — TalkBack users need to know what they've entered. The `host.editText.text?.toString()` check ensures the value is included in the composite description.
- **`additionalContentProvider` for dynamic content** — detected card type ("Visa"), selected country, or validation state can be injected dynamically without subclassing the delegate.
- **The delegate fires on every accessibility node initialization** — this means it automatically includes the latest field value on each TalkBack query. No need to re-set the delegate on text changes.
- **`buildList` approach keeps parts null-safe** — use `buildList { add(...) }` rather than string concatenation, so any null/empty optional parts (hint, additional content) are simply omitted.

---

## ⚠️ WCAG Failure Without This Fix

- **3.3.2 (Labels or Instructions):** Labels or instructions provided when content requires user input must be visible to assistive technologies. The asterisk convention ("* = required") is a visual instruction that relies on sighted users knowing this convention. TalkBack announces the asterisk literally as "asterisk" or "star" — neither communicates "this field must be filled". Worse, if the TTS engine silently skips the character, no required indication reaches the user at all. Both outcomes fail 3.3.2: the instruction that the field is required is not conveyed to AT.
