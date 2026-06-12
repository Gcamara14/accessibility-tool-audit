# Catalyst Template: Info & Relationships — Form Field Announces Value Before Label (Wrong Announcement Order)

**Template ID:** `WA11Y-AND-1.3.1-005`
**Platform:** Android
**WCAG Criterion:** 1.3.1 Info and Relationships
**Jira Label:** `WA11Y-AND-1.3.1-005`
**Source Tickets:** CEPG-370255
**Source PRs:** [walmart-glass #138654](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138654)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A `TextInputLayout` accessibility extension function (`sendAccessibilityAutoFillTextDescription`) builds the announced string by concatenating **value before label**: `"$text,$hint"`. When a field is filled (e.g., first name "Jose"), TalkBack announces:

> **"Jose,First name required"** ← value first, no space separator

Instead of the correct label-first format:

> **"First name required, Jose"** ← label first, value second, proper separator

Two direct consequences:

1. **Context arrives after the value** — users hear the typed value ("Jose") before understanding which field it belongs to ("First name required"). On screens with many similar-looking fields (address forms), this is disorienting.
2. **The comma separator without spaces** (`"$text,$hint"`) is not recognized as a pause by TalkBack's text-to-speech engine. On some devices the announcement is run together: "JoseFirst name required" — the value and label merge into a single unintelligible string.

**Symptom (Jira):** "Multiple fields on Add address bottom sheet announce without entered values", "TalkBack announces first name as 'Jose,First name required'", "Address form fields read in wrong order with TalkBack", "Screen reader doesn't separate label and value", "Horizontal layout TalkBack announces values without context".

---

## ✅ The Fix Pattern

### One-line fix in `sendAccessibilityAutoFillTextDescription`

**❌ Bad Code (`ViewUtils.kt` — `TextInputLayout` extension):**
```kotlin
fun TextInputLayout.sendAccessibilityAutoFillTextDescription(v: View? = null) {
    var hint: String = this.hint.toString()
    hint = hint.replace("*", " required")
    var text: String = this.editText?.text.orEmpty().toString()

    // ❌ Value before label, no space around separator.
    // TalkBack: "Jose,First name required" — value context-free, labels run together
    text = if (text.isEmpty()) hint else "$text,$hint"

    this.editText?.accessibilityDelegate = setTextFieldAnnouncement(
        text = text,
        v = v
    )
}
```

**✅ Good Code:**
```kotlin
fun TextInputLayout.sendAccessibilityAutoFillTextDescription(v: View? = null) {
    var hint: String = this.hint.toString()
    hint = hint.replace("*", " required")
    var text: String = this.editText?.text.orEmpty().toString()

    // ✅ Label before value, comma+space separator.
    // TalkBack: "First name required, Jose" — label provides context, value follows
    text = if (text.isEmpty()) hint else "$hint, $text"

    this.editText?.accessibilityDelegate = setTextFieldAnnouncement(
        text = text,
        v = v
    )
}
```

---

### Verified expected output (from test assertions)

```kotlin
// After fix — verified accessibility text format for filled fields:
assertThat(firstNameAccessibilityText).isEqualTo("First name required, Jose")
assertThat(lastNameAccessibilityText).isEqualTo("Last name required, Abraham")
assertThat(phoneNumberAccessibilityText).isEqualTo("Phone number required, (949) 290-3619")

// When field is empty — hint alone (unchanged, correct):
// "First name required"
```

---

### Test: verify hint-before-value ordering

```kotlin
@Test
fun `sendAccessibilityAutoFillTextDescription announces hint before value for filled fields`() {
    launchFragmentWithConfig(AddEditAddressConfig(), ...).onFragment { fragment ->
        // Fill in values
        fragment.binding.firstNameLayout.editText?.setText("Jose")
        Shadows.shadowOf(Looper.getMainLooper()).idle()

        // Trigger accessibility description update
        fragment.binding.firstNameLayout.sendAccessibilityAutoFillTextDescription()
        Shadows.shadowOf(Looper.getMainLooper()).idle()

        // Verify: hint STARTS the string, value FOLLOWS
        val accessibilityText = getAccessibilityText(fragment.binding.firstNameLayout.editText)
        assertThat(accessibilityText).startsWith("First name required")
        assertThat(accessibilityText).isEqualTo("First name required, Jose")
    }
}

private fun getAccessibilityText(view: View?): String? {
    if (view == null) return null
    val nodeInfo = android.view.accessibility.AccessibilityNodeInfo.obtain()
    return try {
        view.accessibilityDelegate?.onInitializeAccessibilityNodeInfo(view, nodeInfo)
        nodeInfo.text?.toString()
    } finally {
        nodeInfo.recycle()
    }
}
```

---

### ⚠️ Watch for the same pattern in related functions

The same `"$text,$hint"` bug pattern appears in other extension functions in the same file. Apply the same fix wherever `sendAccessibilityAutoFillTextDescription` or similar helpers concatenate field value and hint:

```kotlin
// ❌ Same bug pattern in WcpTextField variant — value before label, no space
fun WcpTextField.sendAccessibilityAutoFillTextDescription(v: View? = null) {
    var hint: String = this.label.toString()
    hint = hint.replace("*", " required")
    var text: String = this.editText.text.orEmpty().toString()
    text = if (text.isEmpty()) hint else "$text,$hint"  // ← same bug
    ...
}

// ✅ Apply the same hint-first fix:
text = if (text.isEmpty()) hint else "$hint, $text"
```

---

## 🔑 Key Rules

- **Label always before value in accessibility text** — the convention TalkBack users expect mirrors the visual layout: label (hint) first, then the entered value. Reversing this order means users hear data without knowing which field produced it.
- **Use `", "` (comma-space) as the separator, not `","` (comma only)** — TalkBack's TTS treats a comma followed by a space as a natural pause. A comma without a space either runs the words together or is spoken as "comma" by some TTS engines.
- **When field is empty, announce only the hint** — `if (text.isEmpty()) hint else "$hint, $text"` — an empty field should say "First name required", not "First name required, " with a trailing comma.
- **Audit all accessibility helper extension functions in `ViewUtils.kt`** — `sendAccessibilityAutoFillTextDescription` exists for both `TextInputLayout` and `WcpTextField`, and `sendAccessibilityUpdateOnFocusChange` has its own concatenation logic. Apply the same label-first fix to all of them.
- **The `*` → ` required` replacement is intentional** — `hint.replace("*", " required")` converts hint strings like "First name *" to "First name  required". This is correct — the asterisk (mandatory field indicator) is not meaningful to TalkBack, and " required" provides the semantics.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.1 (Info and Relationships):** Information, structure, and relationships conveyed through presentation must be programmatically determinable. In a form field, the label-to-value relationship is a structural association: the hint text is the label, and the `editText` content is the value. Announcing the value before its label breaks this association — a TalkBack user hears "Jose" with no preceding context to identify which field "Jose" belongs to. The fix restores the correct `"[label], [value]"` sequence that matches both the visual layout and the semantic relationship of a labelled input control.
