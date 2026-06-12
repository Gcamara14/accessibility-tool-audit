# Catalyst Template: Status Message — Secure Input Field Announces Digits Instead of Values (CVV / PIN / Password)

**Template ID:** `WA11Y-AND-4.1.3-005`
**Platform:** Android
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-AND-4.1.3-005`
**Source Tickets:** CEPG-372996
**Source PRs:** [walmart-glass #139502](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139502)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Two opposite failures occur on secure input fields (CVV, PIN, password):

1. **No feedback at all** — a CVV or PIN field gives TalkBack no confirmation as the user types. Users cannot tell whether their keystrokes are being registered, how many digits they've entered, or whether the field is correct length.
2. **Actual digits announced** — a password field with no security consideration announces every character as the user types (e.g., "4", "2", "7"). This is a **PCI-DSS and security violation** — TalkBack would broadcast the actual CVV or PIN in any environment where device audio can be heard.

**Symptom (Jira):** "TalkBack users don't know how many CVV digits they've entered", "Screen reader announces actual CVV digits", "No feedback when typing PIN", "CVV field silent on TalkBack", "Security issue: card security code announced aloud".

---

## ✅ The Fix Pattern

### `CvvAccessibilityTextWatcher` — announce digit count, never the value

The solution is a `TextWatcher` that fires `announceForAccessibility()` after each keystroke, announcing the **number of digits entered** rather than the digit itself:

```kotlin
/**
 * TextWatcher that provides real-time accessibility announcements for CVV input
 * without revealing the actual CVV digits.
 *
 * Announces digit count as the user types — e.g., "1 digit entered", "3 digits entered".
 * Never announces the actual digit values (PCI-DSS compliance).
 *
 * Complies with:
 * - WCAG 2.2 SC 4.1.3 (Status Messages)
 * - PCI-DSS security requirements
 */
class CvvAccessibilityTextWatcher(
    private val context: Context,
    private val editText: EditText
) : TextWatcher {

    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}

    override fun afterTextChanged(s: Editable?) {
        val digitCount = s?.length ?: 0
        val announcement = when (digitCount) {
            0 -> string(R.string.payment_ui_cvv_accessibility_empty)
            // → "CVV field, empty"
            1 -> string(R.string.payment_ui_cvv_accessibility_one_digit)
            // → "1 digit entered"
            else -> string(R.string.payment_ui_cvv_accessibility_n_digits, "digitCount" to digitCount)
            // → "3 digits entered"
        }
        editText.announceForAccessibility(announcement)
    }
}
```

```xml
<!-- strings.xml -->
<string name="payment_ui_cvv_accessibility_empty">CVV field, empty</string>
<string name="payment_ui_cvv_accessibility_hint">Enter your card security code, 3 or 4 digits</string>
<string name="payment_ui_cvv_accessibility_one_digit">1 digit entered</string>
<string name="payment_ui_cvv_accessibility_n_digits">{digitCount} digits entered</string>
```

---

### Wiring the watcher + delegate

Apply the `TextWatcher` alongside a `TextFieldAccessibilityDelegate` that handles the field-level accessibility description:

```kotlin
@VisibleForTesting
internal fun addCvvAccessibilityDelegate(cvvTextField: TextField) {
    // Delegate handles the field's own label and role
    WalmartAccessibilityCompat.setAccessibilityDelegate(
        view = cvvTextField,
        delegate = TextFieldAccessibilityDelegate()
    )
    // TextWatcher announces digit count as user types
    val cvvEditText = cvvTextField.editText
    cvvEditText?.addTextChangedListener(
        CvvAccessibilityTextWatcher(requireContext(), cvvEditText)
    )
}
```

Call at field setup time:
```kotlin
// In onViewCreated / bind:
addCvvAccessibilityDelegate(cvvTextField = paymentMethodsSecurityCodeField)
```

---

### Generalising to PIN and password fields

The same `TextWatcher` pattern applies to any field where:
- User needs progress feedback while typing
- Actual characters must not be announced (security)

```kotlin
/**
 * Generic secure input watcher — use for PIN, password, security code.
 * Replace string resources with context-appropriate messages.
 */
class SecureInputAccessibilityTextWatcher(
    private val editText: EditText,
    private val fieldName: String       // e.g., "PIN", "Password", "Security code"
) : TextWatcher {
    override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
    override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}

    override fun afterTextChanged(s: Editable?) {
        val count = s?.length ?: 0
        val message = when (count) {
            0 -> "$fieldName field, empty"
            1 -> "1 character entered"
            else -> "$count characters entered"
        }
        editText.announceForAccessibility(message)
    }
}
```

> **Use localized string resources** (not string concatenation) in production — the example above uses hard-coded strings for clarity.

---

### What NOT to do

**❌ Never announce actual characters:**
```kotlin
// SECURITY VIOLATION — announces actual CVV digits aloud via TalkBack
editText.addTextChangedListener { text ->
    text?.lastOrNull()?.let { digit ->
        editText.announceForAccessibility(digit.toString())
        // → "4", "2", "7" — the actual CVV value
    }
}
```

**❌ No announcement at all:**
```kotlin
// Silent field — TalkBack user gets no feedback while typing CVV
// They cannot tell if the field is receiving input or how far along they are
cvvEditText.inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_VARIATION_PASSWORD
// ← No TextWatcher, no announceForAccessibility
```

---

## 🔑 Key Rules

- **Announce digit/character count, never the value** — the status message after each keystroke should be `"N digits entered"`, not the digit itself. This satisfies WCAG 4.1.3 (the user gets a status update) while satisfying PCI-DSS (the value is never broadcast).
- **Use `afterTextChanged()`** — not `onTextChanged()`. `afterTextChanged` fires after the `Editable` is updated and reflects the final state including deletions. `onTextChanged` fires during the change and may see intermediate states.
- **Announce on deletion too** — when the user deletes a digit, `afterTextChanged` fires with the new (shorter) length. The announcement "2 digits entered" after a delete tells the user the deletion was registered.
- **`"CVV field, empty"` for zero digits** — when the field is cleared or focused fresh, announce the empty state so the user knows the field is ready for input.
- **Provide a hint `contentDescription`** on the TextField for initial focus — users focusing the CVV field for the first time should hear "Enter your card security code, 3 or 4 digits" (the hint) before they start typing.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** Real-time status messages that are not given focus must be programmatically determinable by assistive technologies so that users are informed of the change. Typing into a CVV field is a real-time state change — the field's content is changing and the user needs confirmation. A silent field with no `announceForAccessibility()` call fails 4.1.3 because no status message is provided. Announcing the actual digit fails both 4.1.3 intent (secure feedback) and PCI-DSS.
