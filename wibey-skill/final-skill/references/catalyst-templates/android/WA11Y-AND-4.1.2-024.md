# Catalyst Template: Name/Value — Password Field Announces Bullet Dots and Missing Error State in TalkBack

**Template ID:** `WA11Y-AND-4.1.2-024`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-024`
**Source Tickets:** CINEXT-17082
**Source PRs:** [walmart-glass #138490](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138490)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A `TextInputLayout` password field (`authFieldPassword`) has three separate accessibility failures:

### Failure 1 — Inner `EditText` announces bullet dot characters

`TextInputLayout` contains an inner `EditText` that renders masked password characters as bullets (•••). Without intervention, TalkBack focuses the inner `EditText` and announces each bullet character as "dot" — or a long string of "dot dot dot dot…" — rather than the field's label or character count.

> **"dot dot dot dot dot dot dot dot, Edit text"**

### Failure 2 — Error state reads character count instead of error message

When the password fails validation, the `AccessibilityDelegate` previously announced a character count label even in the error state:

> **"8 characters, Edit text"** — instead of **"Create a password, Error, Password must include 8-100 characters"**

TalkBack users cannot tell that the field is in an error state.

### Failure 3 — Show/Hide password toggle button has a static label

The eye icon (end icon) that toggles password visibility has a static `contentDescription` that does not update when toggled. TalkBack always says "Show password" even after the password has been revealed — the current action is wrong.

**Symptom (Jira):** "TalkBack reads 'dot dot dot' on password field", "Password field says 'Show password' when password is already visible", "Error message not announced for password validation", "Password error state not accessible to screen reader".

---

## ✅ The Fix Pattern

### Three-part fix in `NewPasswordWithRulesView.setupPasswordPrivacyAccessibility()`

```kotlin
@SuppressLint("VisibleForTests")
private fun setupPasswordPrivacyAccessibility() {
    // ✅ FIX 1: Keep the TextInputLayout accessible (label + end icon button reachable)
    binding.authFieldPassword.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES

    // ✅ FIX 1 (continued): Hide ONLY the inner EditText from AT so TalkBack never reads
    // the "•••" bullet characters. All speech is handled by the delegate on the parent.
    binding.authFieldPassword.editText?.importantForAccessibility =
        IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS

    // ✅ FIX 2: Override AccessibilityDelegate to handle error state correctly.
    binding.authFieldPassword.accessibilityDelegate = object : AccessibilityDelegate() {
        override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfo) {
            super.onInitializeAccessibilityNodeInfo(host, info)

            val fieldLabel = binding.authFieldPassword.label
            val hasError = !binding.authFieldPassword.error.isNullOrEmpty()
            val passwordLength = binding.authFieldPassword.text?.length ?: 0

            // When there is an error, always use the field label (not character count)
            // so TalkBack reads: "Create a password, Error, <rules>"
            val labelPart = if (!hasError && passwordLength > 0) {
                // No error: announce character count ("1 character" or "8 characters")
                string(
                    if (passwordLength == 1) {
                        R.string.auth_password_character_count_singular
                    } else {
                        R.string.auth_password_character_count_plural
                    },
                    "count" to passwordLength
                )
            } else {
                // Error or empty: announce the field label
                fieldLabel
            }

            val rulesDescription =
                binding.authFieldPassword.errorContentDescription?.toString().orEmpty()

            info.contentDescription = buildString {
                append(labelPart)
                if (hasError) {
                    // ✅ Explicit error announcement: "Create a password, Error, rules"
                    append(", ")
                    append(string(R.string.auth_field_error_label))  // → "Error"
                    if (rulesDescription.isNotEmpty()) {
                        append(", ").append(rulesDescription)
                    }
                } else if (rulesDescription.isNotEmpty()) {
                    append(". ").append(rulesDescription)
                }
            }
        }
    }

    // ✅ FIX 3: Update Show/Hide password toggle label on every click
    binding.authFieldPassword.addEndIconOnClickListener { onEndIconClicked() }
}

/** Tracks whether password text is currently visible (eye icon toggled on). */
private var isPasswordVisible = false

/**
 * Toggles password visibility and updates the end icon content description.
 * Extracted as [internal] for unit-testable toggle logic.
 */
internal fun onEndIconClicked() {
    isPasswordVisible = !isPasswordVisible
    binding.authFieldPassword.endIconContentDescription = string(
        if (isPasswordVisible) {
            R.string.auth_password_hide_content_description  // → "Hide password"
        } else {
            R.string.auth_sign_in_show_password_content_description  // → "Show password"
        }
    )
}
```

```xml
<!-- strings.xml -->
<string name="auth_field_error_label">Error</string>
<string name="auth_password_hide_content_description">Hide password</string>
<!-- auth_sign_in_show_password_content_description already existed: "Show password" -->
```

---

### ❌ Bad Code — all three failures

```kotlin
private fun setupPasswordPrivacyAccessibility() {
    // ❌ Parent is accessible but inner EditText is also accessible
    // → TalkBack reads "dot dot dot" from the inner EditText
    binding.authFieldPassword.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES
    // ← No editText?.importantForAccessibility suppression

    binding.authFieldPassword.accessibilityDelegate = object : AccessibilityDelegate() {
        override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfo) {
            super.onInitializeAccessibilityNodeInfo(host, info)

            val passwordLength = binding.authFieldPassword.text?.length ?: 0
            // ❌ Uses character count even when the field is in error state
            val labelAndCount = if (passwordLength > 0) {
                string(R.string.auth_password_character_count_plural, "count" to passwordLength)
                // → "8 characters" — even when there's a validation error!
            } else {
                binding.authFieldPassword.label
            }

            val rulesDescription = binding.authFieldPassword.errorContentDescription?.toString().orEmpty()
            info.contentDescription = buildString {
                append(labelAndCount)
                // ❌ No error label inserted — TalkBack never says "Error"
                if (rulesDescription.isNotEmpty()) append(". ").append(rulesDescription)
            }
        }
    }
    // ❌ No addEndIconOnClickListener → eye button always says "Show password"
}
```

---

### Verified TalkBack announcements

```
// No text entered (empty):
TalkBack: "Create a password, Edit box"

// 8 characters typed, no error:
TalkBack: "8 characters, Edit box"

// Error state (e.g. password too short):
TalkBack: "Create a password, Error, Your password must include the following: 8-100 characters rule not met"

// After typing and toggleing visibility (Show → Hide):
Eye button before toggle: "Show password, Button"
Eye button after toggle:  "Hide password, Button"
```

---

## 🔑 Key Rules

- **Suppress the inner `EditText` with `IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS`** — `TextInputLayout.editText?.importantForAccessibility = NO_HIDE_DESCENDANTS` removes the DOT-character view from TalkBack while the parent `TextInputLayout` remains accessible. Never suppress the parent — the eye icon (end icon button) is a child of the parent and must remain reachable.
- **Three-state delegate: empty / typing / error** — the `contentDescription` should announce the field label when empty or in error, and the character count when there is text and no error. Mixing these states (e.g., character count during error) loses the error signal.
- **Error label must be an explicit string, not inferred** — insert `string(R.string.auth_field_error_label)` ("Error") between the field label and the rules description. Do not rely on `accessibilityDelegate.super` to append error — it may not fire, or may use a different phrasing.
- **Toggle `endIconContentDescription` on every click** — the eye button must be updated synchronously in `onEndIconClicked()` so TalkBack announces the current state immediately after the tap. Updating it after an animation delay means TalkBack reads the old label.
- **Extract `onEndIconClicked()` as `internal`** — `addEndIconOnClickListener { onEndIconClicked() }` vs `addEndIconOnClickListener { /* inline */ }` makes the toggle logic unit-testable in Robolectric, which cannot reliably simulate click events on Living Design end icons.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name, role, and value of user interface components must be programmatically determinable. Three distinct failures:
  1. **Bullet dot characters as value** — the inner `EditText` exposing "•••" characters as text content presents the presentation encoding of the password as its accessible value, not its semantic value (character count or field state).
  2. **Error state not determinable** — when `binding.authFieldPassword.error` is set, the field's error state must be announced. Announcing a character count instead of an error label means the error state is not programmatically determinable by screen reader users.
  3. **Eye button wrong action label** — a toggle button whose `contentDescription` does not reflect the current state fails to communicate the available action. "Show password" when the password is already visible describes the wrong action.
