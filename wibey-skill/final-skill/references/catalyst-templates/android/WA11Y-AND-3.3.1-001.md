# Catalyst Template: Error Identification — `WcpTextField` Announces "Error" on First Render Before User Interaction

**Template ID:** `WA11Y-AND-3.3.1-001`
**Platform:** Android
**WCAG Criterion:** 3.3.1 Error Identification
**Jira Label:** `WA11Y-AND-3.3.1-001`
**Source Tickets:** HCVE-14622
**Source PRs:** [walmart-glass #138509](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138509)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A screen with an `WcpTextField` backed by a `WcpTextFieldState` shows an error annotation immediately when the screen first renders — before the user has touched or interacted with the field.

TalkBack announces:
> **"Error order number, Edit box"** — on first focus, before the user has typed anything

Root cause: `WcpTextFieldState` defaults `isValid = false`. The `updateField()` extension function checks:

```kotlin
// ❌ Bug: triggers error branch when errorMessage is blank (empty string "" ≠ null)
if (isValid.not() && errorMessage != error) {
    isErrorEnabled = true
    error = errorMessage
}
```

On first render, `isValid = false` (default) and `errorMessage = ""` (never set). The condition `errorMessage != error` evaluates to `"" != null` → `true`. So the error branch runs, setting `isErrorEnabled = true` and `error = ""` even though there is no real error. TalkBack reads the error state on the field's first focus event.

**Symptom (Jira):** "TalkBack says 'error order number' when screen opens", "Error announced before user interacts with field", "WcpTextField shows error on first render without user input", "'Error' announced incorrectly by screen reader on entry to form screen".

---

## ✅ The Fix Pattern

### Add `errorMessage.isNotBlank()` guard to `updateField()`

```kotlin
// ViewExt.kt

fun WcpTextField.updateField(state: WcpTextFieldState) {
    // ✅ Only enter the error branch when there is an actual non-empty error message.
    //    The `errorMessage.isNotBlank()` guard prevents the error state from being set
    //    when `errorMessage` is "" (empty string) or whitespace — which is the default
    //    before any user interaction or validation has run.
    if (isValid.not() && errorMessage.isNotBlank() && errorMessage != error) {
        isErrorEnabled = true
        error = errorMessage
        errorContentDescription = string(
            R.string.vision_center_error_ada,
            Constants.StringFormatter.ERROR_MESSAGE to label.toString()
        )
        // → "Error order number"  (only set when there IS an error message)
    }

    // ✅ Also clear the error when isValid is true OR errorMessage is blank.
    //    The original `if (isValid && isErrorEnabled)` would leave the error on-screen
    //    if the field became valid before a non-blank error was ever shown.
    if ((isValid || errorMessage.isBlank()) && isErrorEnabled) {
        isErrorEnabled = false
    }
}
```

---

### ❌ Bad Code — error fires on first render

```kotlin
// ❌ Before fix — no isNotBlank() guard
fun WcpTextField.updateField(state: WcpTextFieldState) {
    // isValid = false (default), errorMessage = "" (default)
    // → "".isNotBlank() == true is NOT checked → error branch runs immediately!
    if (isValid.not() && errorMessage != error) {  // ← "" != null → true
        isErrorEnabled = true
        error = errorMessage  // ← error = "" — looks blank but isErrorEnabled = true
        errorContentDescription = string(...)  // ← "Error order number" is set
    }
    // ← TalkBack announces "Error order number" on first focus

    if (isValid && isErrorEnabled) {
        isErrorEnabled = false
    }
    // ← If isValid becomes true without a non-blank error ever shown,
    //    the error clear branch also doesn't fire correctly
}
```

---

### The `WcpTextFieldState` contract

```kotlin
data class WcpTextFieldState(
    val isValid: Boolean = false,   // ← defaults to false
    val errorMessage: String = "",  // ← defaults to empty string
    val helperText: String = "",
    // …
)
```

The intent is that `isValid = false` + `errorMessage = ""` means "not yet validated" (neutral state). The fix enforces this: the error UI only activates when there is a non-blank error message to display.

---

### Two state machine paths

After the fix, the `updateField()` function correctly handles three states:

| `isValid` | `errorMessage` | Result |
|---|---|---|
| `false` | `""` (blank) | **Neutral** — `isErrorEnabled` stays `false` |
| `false` | `"Too short"` (non-blank) | **Error** — `isErrorEnabled = true`, `error = "Too short"` |
| `true` | any | **Valid** — `isErrorEnabled = false` (clear any previous error) |

---

## 🔑 Key Rules

- **`isNotBlank()` not `isNotEmpty()`** — `isNotBlank()` returns false for strings containing only whitespace (`"   "`), which should also not trigger the error state. `isNotEmpty()` would not catch whitespace-only error messages.
- **Mirror the `isBlank()` guard on the clear branch** — `if ((isValid || errorMessage.isBlank()) && isErrorEnabled)` ensures that transitioning from "neutral (blank error, isValid=false)" to "valid (isValid=true)" correctly clears any error that was set previously.
- **The same bug exists in any `WcpTextField.updateField()` variant** — if you copy this extension to another feature module, carry both `isNotBlank()` checks with it. The original defect pattern (`errorMessage != error` without a blank guard) is easy to re-introduce.
- **Test the "first render" case explicitly** — add a unit test that verifies calling `updateField(WcpTextFieldState(isValid = false, errorMessage = ""))` does NOT set `isErrorEnabled = true`. The default-state case is the most commonly missed in test coverage.
- **This is separate from "show errors on submit"** — the `updateField()` extension controls live validation feedback. If your flow only shows errors after the user submits the form, the fix is the same (`isNotBlank()` guard) but the call site differs (triggered by form submit rather than a text-change observer).

---

## ⚠️ WCAG Failure Without This Fix

- **3.3.1 (Error Identification):** If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text. A false error announcement on first render — before the user has made any input — presents a ghost error that does not exist. TalkBack users hear "Error order number" when no error has occurred, which is both confusing and misleading: it implies the field is in an invalid state before the user has done anything. It also undermines trust in real error announcements, since users may dismiss legitimate errors as another false positive.
