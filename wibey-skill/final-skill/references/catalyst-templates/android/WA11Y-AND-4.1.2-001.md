# Catalyst Template: Missing or Empty Accessible Name — Unlabelled Input Field or Custom View

**Template ID:** `WA11Y-AND-4.1.2-001`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-001`
**Source Tickets:** CEPG-370254, CEPG-342499
**Source PRs:** [walmart-glass #138535](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138535), [walmart-glass #139069](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139069)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A UI component has **no accessible name**, or its accessible name is **incomplete / incorrect**. Two common manifestations in Walmart Android code:

1. **`TextInputLayout` + `EditText` merge:** TalkBack reads the `AccessibilityNodeInfo` for the outer `TextInputLayout`, not the `EditText`'s `text` property. Without explicit handling, when the field is filled the user hears only the typed value with no label — e.g. "90210" instead of "Enter ZIP code, 90210".

2. **Custom promo/logo view with `AccessibilityDelegate`:** A static string template is used for `contentDescription` that no longer describes the visual layout accurately once the layout order changes (e.g. a logo repositioned relative to text).

**Symptom (Jira):** "Field announced without label", "TalkBack reads only value with no context", "icon not announced", or "wrong label read for [component]".

---

## ✅ The Fix Pattern

### Scenario A: `TextInputLayout` + `EditText` — field announced without its label

**❌ Bad Code:**
```kotlin
// EditText inside a TextInputLayout.
// TalkBack reads the TextInputLayout AccessibilityNodeInfo merge —
// the EditText's IME text is announced WITHOUT the hint/label.
// Result: "90210" with no "Enter ZIP code" label context.
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    // No accessibility setup — field label is silently dropped.
    binding.deliveryAddressBackButton.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED)
}
```

**✅ Good Code:**
```kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    setupZipCodeFieldAccessibility()  // ← add explicit a11y setup
    binding.deliveryAddressBackButton.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED)
}

/**
 * TalkBack reads [AccessibilityNodeInfo] for the [TextInputLayout] merge, not EditText
 * [AccessibilityEvent] text — so we follow [com.walmart.glass.ui.shared.country.CountryField]:
 * hide the inner EditText from the a11y tree and build the announcement on the TextField via
 * [setAccessibilityDescriptionParts]. Typing feedback still comes from IME/text events on the real EditText.
 */
private fun setupZipCodeFieldAccessibility() {
    val textField = binding.deliveryAddressZipCodeTextInput
    val editText = textField.editText

    // ✅ Hide inner EditText — prevent TalkBack from landing on the raw text
    editText.importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_NO
    // ✅ Ensure the outer TextInputLayout is always reachable
    textField.importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES

    // ✅ Build a complete, label-inclusive content description on the container
    textField.setAccessibilityDescriptionParts {
        val zip = editText.text?.toString().orEmpty()
        val error = textField.error
        listOfNotNull(
            if (zip.isEmpty()) {
                string(R.string.delivery_address_zip_code_ada_empty)        // "Enter ZIP code"
            } else {
                string(
                    R.string.delivery_address_zip_code_ada_filled,
                    "postalCode" to zip,                                     // "ZIP code, 90210"
                )
            },
            error?.takeIf { it.isNotBlank() },                              // append inline error if present
        )
    }

    // ✅ Re-trigger the description whenever text changes
    editText.addTextChangedListener(afterTextChanged = {
        textField.sendAccessibilityEvent(AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED)
    })
}
```

**Key imports:**
```kotlin
import android.view.View
import android.view.accessibility.AccessibilityEvent
import androidx.core.widget.addTextChangedListener
import com.walmart.glass.ui.shared.util.setAccessibilityDescriptionParts
```

---

### Scenario B: Custom promo view with `AccessibilityDelegate` — label doesn't match layout

This pattern applies when a custom compound view uses `AccessibilityDelegateCompat.onInitializeAccessibilityNodeInfo` to compose a content description from parts. If the visual layout order changes, the assembled label must reflect the new order.

**❌ Bad Code:**
```kotlin
// Single static template — does NOT account for new logo position.
// When isOnePayNewLogoFlow == true, the logo moves BEFORE the text,
// but the old string still announces them in the wrong order.
ViewCompat.setAccessibilityDelegate(
    binding.root,
    object : AccessibilityDelegateCompat() {
        override fun onInitializeAccessibilityNodeInfo(
            host: View,
            info: AccessibilityNodeInfoCompat
        ) {
            super.onInitializeAccessibilityNodeInfo(host, info)
            info.contentDescription = string(
                R.string.item_affirm_banana_accessibility_text,
                LocalizedStringKeys.DESCRIPTION to description,
                LocalizedStringKeys.AFFIRM_TEXT to offerText,
                LocalizedStringKeys.LEARN_MORE_TEXT to learnHowText
            )
        }
    }
)
```

**✅ Good Code:**
```kotlin
// Compose the label to match the actual visual reading order for each layout variant.
ViewCompat.setAccessibilityDelegate(
    binding.root,
    object : AccessibilityDelegateCompat() {
        override fun onInitializeAccessibilityNodeInfo(
            host: View,
            info: AccessibilityNodeInfoCompat
        ) {
            super.onInitializeAccessibilityNodeInfo(host, info)
            info.contentDescription = if (isOnePayNewLogoFlow) {
                // Logo appears BEFORE text: [OnePay logo] [description] [Learn how]
                // Announces: "OnePay. As low as $23/month. Learn how, button."
                listOf(offerText, description, learnHowText)
                    .filter { it.isNotBlank() }
                    .joinToString(". ")
                    .takeIf { it.isNotEmpty() }
                    ?.plus(".").orEmpty()
            } else {
                // Logo appears AFTER "with": [description] [with logo] [Learn how]
                string(
                    R.string.item_affirm_banana_accessibility_text,
                    LocalizedStringKeys.DESCRIPTION to description,
                    LocalizedStringKeys.AFFIRM_TEXT to offerText,
                    LocalizedStringKeys.LEARN_MORE_TEXT to learnHowText
                )
            }
        }
    }
)
```

---

## 🔑 Key Rules

- **`TextInputLayout` merges** its child `EditText` into one accessibility node. The `EditText` text events are not exposed through `AccessibilityNodeInfo`. Always suppress the inner `EditText` (`IMPORTANT_FOR_ACCESSIBILITY_NO`) and build the full label on the container.
- **`setAccessibilityDescriptionParts`** (Walmart platform utility) assembles multiple string parts into one `contentDescription` — use it instead of manual string concatenation to keep null-safety and formatting consistent.
- **Send `TYPE_WINDOW_CONTENT_CHANGED`** on the container whenever the text changes so TalkBack re-reads the updated description while the user types.
- **Never let layout order diverge from label order** in `AccessibilityDelegate` overrides. When the visual design changes which element appears first, update the `contentDescription` assembly logic to match.
- **Inline errors must be part of the description** — append `textField.error` to the `contentDescription` parts so TalkBack announces both the field label and the error in a single focus event.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The accessible name of every UI component must be programmatically determinable. A `TextInputLayout` with an inner `EditText` that has no `setAccessibilityDescriptionParts` provides no usable label to the accessibility tree. A custom view whose `contentDescription` does not match its visual reading order conveys a misleading name.
