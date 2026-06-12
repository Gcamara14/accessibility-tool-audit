# Catalyst Template: Name, Role, Value — `WcpSelect` Accessible Name Missing Helper Text and Error State

**Template ID:** `WA11Y-AND-4.1.2-025`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-025`
**Source Tickets:** HCVE-14626
**Source PRs:** [walmart-glass #138563](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138563)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`WcpSelect` (the Living Design drop-down / picker component) renders as a non-editable view — it is not a `TextInputLayout` backed by a real `EditText`. TalkBack reads only the default node info, which includes the Living Design trailing role suffix (e.g., "callapse, Drop-down menu") but omits:

1. **Helper text** — the instructional or hint text below the field is never announced
2. **Error state** — when the field has a validation error, TalkBack does not say "Error" and does not read the error description; it continues to announce as if the field were valid
3. **Selected value** — on some Living Design versions the selected value is absent from the announcement

Without the fix, a TalkBack user hears:
> **"Pupil distance, callapse, Drop-down menu"** — whether valid, errored, or empty

With the fix:
> **"Error Pupil distance, Please enter a valid PD"** — when in error
> **"Pupil distance, 63 mm, Measure your PD, callapse, Drop-down menu"** — when value selected with helper text

**Symptom (Jira):** "WcpSelect error not announced by TalkBack", "Drop-down field helper text not read by screen reader", "TalkBack misses error state on WcpSelect picker", "Screen reader announces drop-down without error message".

---

## ✅ The Fix Pattern

### `WcpTextField.updateAccessibilityNodeInfoText()` — override the node info text via `WcpAccessibilityCompat`

`WcpSelect` is backed by a Living Design component that uses its own internal delegate. Setting an `AccessibilityDelegate` directly with `setAccessibilityDelegate()` would clobber the Living Design delegate and break the role/state announcements. Instead, use `WcpAccessibilityCompat.addAccessibilityListener` — the Living Design utility that chains an `AccessibilityListener` on top of the existing delegate.

```kotlin
// WcpSelectExt.kt  (extension functions for WcpSelect / WcpTextField used as picker)

/**
 * Attaches an AccessibilityListener to this WcpSelect field that overrides the
 * node info text to include: label, selected value, helper text, error state,
 * and the Living Design trailing suffix (role/collapse indicator).
 *
 * Must be called after the view is attached and the field state is known.
 *
 * @param state  Current field state (selected value, helper text, error, isValid).
 */
fun WcpTextField.updateAccessibilityNodeInfoText(state: WcpTextFieldState) {
    WcpAccessibilityCompat.addAccessibilityListener(
        this,
        object : AccessibilityListener {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfo
            ) {
                // Living Design appends a suffix like ", callapse, Drop-down menu"
                // Preserve it by extracting it from the default text before overriding.
                val defaultText = info.text?.toString().orEmpty()
                val ldSuffix = extractLivingDesignSuffix(defaultText)

                val label = hint?.toString().orEmpty()
                val hasError = !state.isValid && state.errorMessage.isNotBlank()
                val selectedValue = state.text.orEmpty()          // current selected option
                val helperText = state.helperText.orEmpty()

                info.text = buildString {
                    if (hasError) {
                        // ✅ Error branch: "Error {label}, {errorMessage}{ldSuffix}"
                        append(string(R.string.wcp_select_error_prefix))  // → "Error"
                        append(" ").append(label)
                        append(", ").append(state.errorMessage)
                    } else {
                        // ✅ No-error branch: "{label}[, {selectedValue}][, {helperText}]{ldSuffix}"
                        append(label)
                        if (selectedValue.isNotBlank()) {
                            append(", ").append(selectedValue)
                        }
                        if (helperText.isNotBlank()) {
                            append(", ").append(helperText)
                        }
                    }
                    // ✅ Always append the Living Design suffix so role/state is preserved
                    if (ldSuffix.isNotBlank()) {
                        append(ldSuffix)
                    }
                }
            }
        }
    )
}

/**
 * Extracts the Living Design-appended suffix from the node text.
 * The suffix starts at the last occurrence of ", callapse" or similar LD separator.
 *
 * Example: "Pupil distance, callapse, Drop-down menu"
 *          → ldSuffix = ", callapse, Drop-down menu"
 */
private fun extractLivingDesignSuffix(defaultText: String): String {
    // Living Design appends the accessibility suffix with a comma separator.
    // The label is the first segment; everything after the first ", " is the LD suffix.
    val firstComma = defaultText.indexOf(", ")
    return if (firstComma != -1) defaultText.substring(firstComma) else ""
}
```

---

### Call site

```kotlin
// ManualPdPickerFragment.kt  (or equivalent feature fragment)

private fun bindPdPickerState(state: PdPickerUiState) {
    // ✅ Call after state is updated so the listener captures current error/value
    binding.manualPdPicker.totalPdPicker.updateAccessibilityNodeInfoText(
        WcpTextFieldState(
            isValid = state.isPdValid,
            errorMessage = state.pdErrorMessage,
            text = state.selectedPd,
            helperText = state.pdHelperText
        )
    )
}
```

---

### ❌ Bad Code — no helper text, no error announcement

```kotlin
// ❌ Nothing — the field is left with only Living Design defaults.
// WcpSelect's default node info text = "<label>, callapse, Drop-down menu"
// → No error prefix
// → No selected value
// → No helper text
// TalkBack: "Pupil distance, callapse, Drop-down menu" (always, regardless of state)
```

---

### Verified TalkBack announcements

```
// Empty, no error:
TalkBack: "Pupil distance, Measure your PD, callapse, Drop-down menu"
           ──────────────  ───────────────────────────
           label           helperText                  LD suffix

// Value selected, no error:
TalkBack: "Pupil distance, 63 mm, Measure your PD, callapse, Drop-down menu"
                           ─────  ───────────────
                           selectedValue  helperText

// Error state:
TalkBack: "Error Pupil distance, Please enter a valid PD, callapse, Drop-down menu"
           ─────  ──────────────  ──────────────────────
           prefix label           errorMessage
```

---

### Three-state matrix

| `isValid` | `errorMessage` | `selectedValue` | TalkBack reads |
|---|---|---|---|
| `false` | `"Please enter a valid PD"` | any | `"Error {label}, {errorMessage}{suffix}"` |
| `true` | `""` | `"63 mm"` | `"{label}, 63 mm, {helperText}{suffix}"` |
| `true` | `""` | `""` | `"{label}, {helperText}{suffix}"` |

---

## 🔑 Key Rules

- **Use `WcpAccessibilityCompat.addAccessibilityListener`, not `setAccessibilityDelegate()`** — `WcpSelect` is a Living Design component with its own internal delegate that manages the role ("Drop-down menu") and collapse/expand state. Replacing it with `setAccessibilityDelegate()` destroys those announcements. `WcpAccessibilityCompat.addAccessibilityListener` chains the new listener on top of the existing one, preserving LD behaviour.
- **Preserve the Living Design suffix** — extract it from the default node info text (everything from the first `", "` to the end) and append it to your custom text. Without it TalkBack users lose the "Drop-down menu" role and "callapse" state announcements that LD provides.
- **Set `info.text`, not `info.contentDescription`** — `WcpSelect` uses `info.text` (not `contentDescription`) as the primary spoken label. Setting `contentDescription` may be ignored by the LD traversal; always override `info.text` in the `AccessibilityListener`.
- **Error prefix is `"Error"` as a separate word with a space** — `"Error {label}"` not `"Error: {label}"`. Colon is not spoken naturally by most TTS engines. A trailing space joins the prefix to the label cleanly: "Error Pupil distance".
- **Re-call `updateAccessibilityNodeInfoText()` on every state update** — the `AccessibilityListener` captures the latest `state` in its closure. If the state changes (user selects a value, validation fires), you must re-call the extension with the updated `WcpTextFieldState` to update the closure. Alternatively, hold state in a field and always read it fresh inside `onInitializeAccessibilityNodeInfo`.
- **Guard against null/blank fields** — `selectedValue.isNotBlank()` prevents an orphan `, ` separator when no value is selected. Same for `helperText.isNotBlank()`. An announcement like `"Pupil distance, , callapse"` (empty segment) confuses TTS.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name, role, and value of user interface components must be programmatically determinable. Two distinct failures:
  1. **Error state not programmatically determinable** — when `WcpSelect` is in an error state, no accessible cue signals the error. Screen reader users cannot determine that a field has failed validation without reading surrounding text visually. They may submit an invalid form without knowing any field is in error.
  2. **Helper text / selected value not in accessible name** — supplementary information (instructions, current selection) is present visually but absent from the accessibility node. Screen reader users receive an incomplete description of the control's current state compared to sighted users.
