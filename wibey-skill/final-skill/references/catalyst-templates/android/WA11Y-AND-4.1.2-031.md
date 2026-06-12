# Catalyst Template: Name, Role, Value — Password `WcpTextField` Missing "Edit Box" Role: Delegate on Inner `EditText` with `info.roleDescription`

**Template ID:** `WA11Y-AND-4.1.2-031`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-031`
**Source Tickets:** CINEXT-17251
**Source PRs:** [walmart-glass (internal)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`LoginChoiceComponent` and `PasswordViewComponent` expose a password `WcpTextField` to TalkBack. When a user focuses the field, TalkBack does not announce the "Edit box" role:

> **"Create a password"** — field label only, no role

Expected:
> **"Create a password, Edit box"** — label + role

Root cause: the accessibility delegate was set on the `WcpTextField` container (`authFieldPassword`) rather than on its inner `EditText` (`authFieldPassword.editText`). Setting `importantForAccessibility = YES` on the container and a delegate on it does not communicate the `EditText` role — TalkBack treats it as a generic `ViewGroup`.

The correct approach is to hide the `WcpTextField` container from TalkBack (`importantForAccessibility = NO`) and expose the inner `EditText` with `importantForAccessibility = YES` and a delegate that sets `info.roleDescription = "Edit box"` explicitly.

**Symptom (Jira):** "TalkBack doesn't announce 'Edit box' for password field", "Password input field role missing for screen reader", "Sign-in password field no role in TalkBack", "WcpTextField not announced as editable by TalkBack".

---

## ✅ The Fix Pattern

### Suppress container, expose inner `EditText`, set `roleDescription`

```kotlin
// LoginChoiceComponent.kt / PasswordViewComponent.kt

@SuppressWarnings("VisibleForTests")
private fun configurePasswordField(label: CharSequence?, passwordType: ...) {
    with(binding) {
        // ✅ Suppress the WcpTextField container — TalkBack skips it
        authFieldPassword.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO

        // ✅ Expose and configure the inner EditText as the TalkBack focus target
        authFieldPassword.editText.let { editText ->
            editText.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES

            ViewCompat.setAccessibilityDelegate(
                editText,
                object : AccessibilityDelegateCompat() {
                    override fun onInitializeAccessibilityNodeInfo(
                        host: View,
                        info: AccessibilityNodeInfoCompat
                    ) {
                        super.onInitializeAccessibilityNodeInfo(host, info)
                        val text = authFieldPassword.text?.toString() ?: ""
                        if (text.isNotEmpty()) {
                            // ✅ Character count when text entered
                            info.contentDescription = if (text.length == 1) {
                                string(R.string.auth_password_character_count_singular, "count" to text.length)
                            } else {
                                string(R.string.auth_password_character_count, "count" to text.length)
                            }
                        } else {
                            // ✅ Field label when empty
                            info.contentDescription = label
                        }
                        // ✅ Suppress raw text (prevent bullet "•••" chars from being announced)
                        info.text = null
                        // ✅ Announce "Edit box" role explicitly
                        info.roleDescription = string(R.string.ada_edittext_role)
                    }
                }
            )
        }
    }
}
```

```kotlin
// PasswordViewComponent.kt — simpler variant (label only, no character count)

@SuppressWarnings("VisibleForTests")
private fun setupPasswordLayoutAccessibility(label: CharSequence?) {
    passwordLayout.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO
    passwordLayout.editText.let { editText ->
        editText.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES
        ViewCompat.setAccessibilityDelegate(
            editText,
            object : AccessibilityDelegateCompat() {
                override fun onInitializeAccessibilityNodeInfo(
                    host: View,
                    info: AccessibilityNodeInfoCompat
                ) {
                    super.onInitializeAccessibilityNodeInfo(host, info)
                    info.contentDescription = label
                    info.roleDescription = string(R.string.ada_edittext_role)
                }
            }
        )
    }
}
```

```xml
<!-- strings.xml -->
<string name="ada_edittext_role">Edit box</string>
```

---

### ❌ Bad Code — delegate on container, no role

```kotlin
// ❌ Before fix: delegate on WcpTextField container
authFieldPassword.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES
authFieldPassword.accessibilityDelegate = object : AccessibilityDelegate() {
    override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfo) {
        super.onInitializeAccessibilityNodeInfo(host, info)
        // ❌ No info.roleDescription → role = "ViewGroup" or empty → no "Edit box" announced
        // ❌ inner EditText still accessible → TalkBack may announce "•••" bullet dots
        info.contentDescription = "..."
    }
}
// TalkBack: "Create a password"  — no role
```

---

### The container vs inner `EditText` accessibility model

```
WcpTextField (container, ConstraintLayout)
├── TextInputLayout / WcpTextInputLayout
│   └── EditText (inner) ← this is what TalkBack reads as an input field
│       Role: "Edit box" (only when explicitly set or inherited from EditText widget class)
└── end icon button (eye, if present)
```

**Old approach (WA11Y-AND-4.1.2-024 pattern):**
- Suppress inner `EditText` (`NO_HIDE_DESCENDANTS`)
- Set delegate on the container (`WcpTextField`)
- Container acts as a leaf node

**New approach (this template):**
- Suppress container (`NO`) — removes the `ViewGroup` wrapping from TalkBack
- Expose inner `EditText` (`YES`) — Android's `EditText` widget class naturally provides "Edit box" role
- Set delegate on inner `EditText` with explicit `roleDescription`

**When to use which:**
| Scenario | Approach |
|---|---|
| Need eye button (show/hide) on same accessible parent | WA11Y-AND-4.1.2-024 (suppress editText, expose container) |
| Eye button handled separately or not present | This template (suppress container, expose editText) |
| Need explicit "Edit box" announcement | This template (roleDescription on editText) |

---

### `info.roleDescription` vs `info.className`

| Property | Effect | TalkBack announces |
|---|---|---|
| `info.className = EditText::class.java.name` | Sets widget class — TalkBack infers role | "Edit box" (inferred) |
| `info.roleDescription = "Edit box"` | Directly overrides what TalkBack says for the role | "Edit box" (explicit, language-matched string) |

`roleDescription` is preferred when you need the role in the user's locale (the string `ada_edittext_role` can be translated). `className` works but is locale-independent.

---

### `info.text = null` — suppressing bullet characters

```kotlin
info.text = null  // ← required when delegate is on the EditText
```

`EditText.text` normally exposes the raw text content in `info.text`. For a password field, this would be `"••••••"` — the masked characters. Setting `info.text = null` suppresses this from the accessibility node, preventing TalkBack from reading bullet characters even when the delegate is attached to the `EditText` directly.

Without `info.text = null`:
> TalkBack: "••••••, Create a password, Edit box" — bullet chars first

With `info.text = null`:
> TalkBack: "Create a password, Edit box"

---

## 🔑 Key Rules

- **Set `importantForAccessibility = NO` on the `WcpTextField` container** — otherwise TalkBack may traverse both the container and the inner `EditText`, creating duplicate focus.
- **Set `importantForAccessibility = YES` on the inner `editText`** — required to override the inherited suppression from the container (if the container is `NO`, children default to `NO`).
- **Always set `info.text = null` in the delegate** — prevents raw password content (bullets or actual characters) from leaking into the accessibility node info.
- **Use `AccessibilityDelegateCompat` / `ViewCompat.setAccessibilityDelegate()`** — use the Jetpack compat API, not the framework `View.setAccessibilityDelegate()`, for API-level safety and compat with Living Design components.
- **`info.roleDescription = string(R.string.ada_edittext_role)`** — use a string resource, not a hardcoded `"Edit box"`, so the string can be translated for international markets.
- **This approach breaks if the eye button must be on the same accessible parent** — if `WcpTextField` has an end icon (eye button) that must remain focusable alongside the edit node, use the WA11Y-AND-4.1.2-024 pattern instead (suppress `editText`, expose container). Suppressing the container removes the eye button from TalkBack too.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The role of user interface components must be programmatically determinable. A password input field without an "Edit box" (or "Edit text") role announcement gives TalkBack users no indication that the field is editable. Users may not know to switch to text input mode, attempt double-tap activation, or use the keyboard with the field. "Edit box" is the standard TalkBack cue for an editable text input and must be present on all interactive text entry fields.
