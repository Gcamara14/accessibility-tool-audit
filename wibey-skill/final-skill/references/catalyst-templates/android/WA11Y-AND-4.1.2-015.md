# Catalyst Template: Role — Password / Auth Input Field Not Reachable by TalkBack (`importantForAccessibility="no"` / `NO_HIDE_DESCENDANTS`)

**Template ID:** `WA11Y-AND-4.1.2-015`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-015`
**Source Tickets:** CINEXT-17132
**Source PRs:** [walmart-glass #138804](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138804)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Two related misuses of `importantForAccessibility` on password and auth input fields:

1. **`IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS` on the password field container** — this flag suppresses the entire subtree, making the password `TextInputLayout` and its inner `EditText` completely invisible to TalkBack. The user cannot focus the field, cannot type into it via TalkBack, and receives no feedback that the field exists.

2. **`IMPORTANT_FOR_ACCESSIBILITY_NO` on the password field itself** — this removes just the field from the accessibility tree. TalkBack skips it. Combined with missing `android:focusable="true"`, TalkBack cannot reach the field even during sequential navigation.

Both failures mean authentication screens (sign-in, OTP, account creation) are **unusable** with TalkBack. A user cannot log in or create an account without sighted assistance.

**Symptom (Jira):** "TalkBack skips password field", "Cannot type in password using screen reader", "OTP field not announced on login screen", "Password input not focusable with TalkBack", "Screen reader jumps past enter password field".

---

## ✅ The Fix Pattern

### Pattern A: Fix `IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS` on password view

**❌ Bad Code (`NewPasswordWithRulesView.kt`):**
```kotlin
// NO_HIDE_DESCENDANTS suppresses the entire accessibility subtree.
// The password TextInputLayout AND all its children (EditText, show/hide icon)
// become invisible to TalkBack. The user cannot access the field at all.
binding.authFieldPassword.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS
```

**✅ Good Code:**
```kotlin
// YES makes the field explicitly accessible.
// The EditText inside is now reachable and TalkBack announces: "Password, edit box"
binding.authFieldPassword.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES
```

---

### Pattern B: Fix `IMPORTANT_FOR_ACCESSIBILITY_NO` + missing `focusable` in Kotlin + XML

**❌ Bad Code (`LoginChoiceComponent.kt`):**
```kotlin
// Programmatic override blocks TalkBack from seeing the password field.
authFieldPassword.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO
authFieldPassword.accessibilityDelegate = object : AccessibilityDelegate() {
    override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfo) {
        super.onInitializeAccessibilityNodeInfo(host, info)
        // delegate code that never fires — field is suppressed before it gets here
    }
}
```

**❌ Bad Code (`auth_login_choice_component.xml`):**
```xml
<!-- Missing android:focusable="true" and android:importantForAccessibility="yes".
     TalkBack cannot navigate to this field. -->
<glass.platform.design.components.WcpTextField
    android:id="@+id/auth_field_password"
    android:imeOptions="actionDone"
    android:importantForAutofill="yes"
    android:inputType="textPassword"
    android:label="@string/auth_password"
    app:endIconContentDescription="@string/auth_sign_in_show_password_content_description"
    app:ldTrailingMode="password_toggle" />
```

**✅ Good Code (`LoginChoiceComponent.kt`):**
```kotlin
// YES makes the field accessible — delegate fires normally.
authFieldPassword.importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES
authFieldPassword.accessibilityDelegate = object : AccessibilityDelegate() {
    override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfo) {
        super.onInitializeAccessibilityNodeInfo(host, info)
        // custom node info (e.g., password input type, edit role)
    }
}
```

**✅ Good Code (`auth_login_choice_component.xml`):**
```xml
<!-- Add focusable + importantForAccessibility so TalkBack can find and enter the field -->
<glass.platform.design.components.WcpTextField
    android:id="@+id/auth_field_password"
    android:focusable="true"
    android:imeOptions="actionDone"
    android:importantForAccessibility="yes"
    android:importantForAutofill="yes"
    android:inputType="textPassword"
    android:label="@string/auth_password"
    app:endIconContentDescription="@string/auth_sign_in_show_password_content_description"
    app:ldTrailingMode="password_toggle" />
```

---

### Pattern C: Live region `TextView` for password error announcements

When a password validation error needs to be announced (e.g., "Password cannot be empty"), use a **polite live region** `TextView` with zero alpha rather than calling `announceForAccessibility()` directly — this ensures the announcement fires even when focus is elsewhere and survives orientation changes:

**✅ Good Code (XML layout addition):**
```xml
<!-- Invisible live region — announces password errors to TalkBack without
     moving focus. alpha="0" hides it visually; live region fires on text change. -->
<TextView
    android:id="@+id/auth_password_error_announcement"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:accessibilityLiveRegion="polite"
    android:alpha="0"
    android:importantForAccessibility="yes"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toBottomOf="@id/auth_field_password" />
```

**✅ Good Code (Kotlin — `LoginChoiceComponent.kt`):**
```kotlin
fun announcePasswordError(errorMessage: String) {
    announceForTalkBack(errorMessage)
}

// Reset → post → set pattern ensures the live region fires
// even if the same message is posted twice in a row.
private fun announceForTalkBack(message: String) {
    binding.authPasswordErrorAnnouncement.text = ""
    Handler(Looper.getMainLooper()).post {
        binding.authPasswordErrorAnnouncement.text = message
    }
}
```

**Call site (`OtpGenerateFragmentV2.kt` — fires when password field is empty on submit):**
```kotlin
} else {
    binding.loginChoiceComponent.announcePasswordError(
        string(R.string.auth_error_password_empty)
    )
}
```

---

## 🔑 Key Rules

- **`IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS` must never be used on a form field or its container** — this flag is for decorative non-interactive containers only (backgrounds, overlays). On a `TextInputLayout` it removes the entire field tree from accessibility.
- **`IMPORTANT_FOR_ACCESSIBILITY_NO` on an input field is also wrong** — use `NO` only on non-interactive decorative views. Any field the user must interact with needs `YES` or `AUTO`.
- **XML and Kotlin must agree** — if `importantForAccessibility` is set to `NO` in Kotlin code, setting `android:importantForAccessibility="yes"` in XML has no effect; the programmatic override wins. Fix both.
- **`android:focusable="true"` is required for custom views** — `WcpTextField` and similar custom components may not inherit `focusable` from their parent. Explicitly set `android:focusable="true"` in XML to ensure TalkBack can navigate to the field.
- **Live region pattern for error announcements** — a hidden `TextView` with `accessibilityLiveRegion="polite"` and `alpha="0"` is more reliable than `announceForAccessibility()` for error messages. Use the reset→post→set pattern to guarantee the announcement fires for repeated identical errors.
- **Verify the password show/hide toggle is also accessible** — `app:endIconContentDescription="@string/auth_sign_in_show_password_content_description"` must be set so TalkBack can announce "Show password" / "Hide password" on the trailing icon button.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** All user interface components must have a role that can be programmatically determined and must be operable by assistive technologies. A password field with `importantForAccessibility="NO"` or `"NO_HIDE_DESCENDANTS"` has been removed from the accessibility tree — it has no programmatically determinable role, value, or state. A TalkBack user cannot focus the field, cannot type into it, and cannot complete sign-in. This is a complete barrier to access for the authentication flow.
