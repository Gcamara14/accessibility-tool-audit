# Catalyst Template: Focus Order — Error Message Focus Not Managed: Focus Does Not Land on the Error

**Template ID:** `WA11Y-AND-2.4.3-002`
**Platform:** Android
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-AND-2.4.3-002`
**Source Tickets:** CEPG-372733, CEPG-372734, CEPG-372735, CEPG-372736
**Source PR:** [walmart-glass #138836](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138836)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

After a form validation failure, **TalkBack focus stays on the submit button** (or wherever it was) and **does not move to the error message**. Screen-reader users have no indication anything went wrong — they hear nothing about the error unless they manually swipe back through the form.

Two error presentation patterns, both broken without fix:

1. **Banner/alert error** (`WcpAlert` at the top of the form) — appears visually but TalkBack focus never moves to it.
2. **Inline field errors** (individual `WcpTextField` or `WcpSelect` with `.error` set) — the first field with an error is never focused.

**Symptom (Jira):** "After tapping submit, TalkBack doesn't announce error", "Error message not read", "Validation error not reachable via TalkBack", or "Focus does not land on error after form submit".

---

## ✅ The Fix Pattern

### Scenario A: Banner Error (`WcpAlert`) — request focus + announce

**❌ Bad Code:**
```kotlin
// Validation fails — error banner is shown visually, but TalkBack
// focus stays on the submit button. Screen-reader user hears nothing.
if (!isValid) {
    binding.farmersDogStepErrorBanner.apply {
        visibility = View.VISIBLE
        setMessage(string(R.string.myprofile_farmers_dog_select_body_type_error))
    }
    trackStep2ValidationErrors()
}
```

**✅ Good Code:**
```kotlin
if (!isValid) {
    binding.farmersDogStepErrorBanner.apply {
        visibility = View.VISIBLE
        setMessage(string(R.string.myprofile_farmers_dog_select_body_type_error))
    }
    // ✅ ADA: Move TalkBack focus to the error banner immediately
    binding.farmersDogStepErrorBanner.requestFocus()
    binding.farmersDogStepErrorBanner.postAccessibilityAnnouncement(
        string(R.string.myprofile_farmers_dog_select_body_type_error)
    )
    trackStep2ValidationErrors()
}
```

**Required XML change** — the banner view must be focusable and use an assertive live region:
```xml
<!-- Error banner view (WcpAlert or equivalent) -->
<com.walmart.design.components.WcpAlert
    android:id="@+id/farmersDogStepErrorBanner"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:focusable="true"
    android:accessibilityLiveRegion="assertive"
    android:visibility="gone"
    app:wcpAlertVariant="error" />
```

---

### Scenario B: Inline Field Errors — move focus to the first failing field

**❌ Bad Code:**
```kotlin
// Step validation fires, inline errors are set on WcpTextField / WcpSelect,
// but TalkBack focus is never moved to the first failing field.
fun validateStep1(): Boolean {
    val isNameValid = validateName()
    val isDobValid = validateDateOfBirth()
    if (!isNameValid || !isDobValid) {
        trackStep1ValidationErrors()
        return false
    }
    return true
}
```

**✅ Good Code:**
```kotlin
fun validateStep1(): Boolean {
    val isNameValid = validateName()
    val isDobValid = validateDateOfBirth()
    if (!isNameValid || !isDobValid) {
        // ✅ ADA: Move TalkBack focus to the first field that has an inline error
        announceFirstFieldError(
            binding.farmersDogFirstNameField,
            binding.farmersDogLastNameField,
            binding.farmersDogBirthdayField,
        )
        trackStep1ValidationErrors()
        return false
    }
    return true
}

/**
 * Finds the first field with a non-null [error], requests focus on it,
 * and announces the error message for TalkBack. Supports [WcpTextField]
 * and [WcpSelect] field types.
 *
 * CEPG-372733, CEPG-372736: Ensures screen-reader users are informed
 * when inline validation errors appear.
 */
private fun announceFirstFieldError(vararg fields: View) {
    for (field in fields) {
        val error: CharSequence? = when (field) {
            is WcpTextField -> field.error
            is WcpSelect -> field.error
            else -> null
        }
        if (error != null) {
            field.requestFocus()
            field.postAccessibilityAnnouncement(error)
            return
        }
    }
}
```

**Key imports:**
```kotlin
import android.view.View
import glass.platform.design.components.WcpSelect
import glass.platform.design.components.WcpTextField
```

---

### Scenario C: Focus restoration after snackbar dismiss (related pattern)

When a snackbar confirming success/failure is dismissed, TalkBack focus must return to the trigger element (e.g. the "Save" button or the container that triggered the action).

**✅ Good Code:**
```kotlin
wcpSnackbar.addCallback(object : BaseTransientBottomBar.BaseCallback<WcpSnackbar>() {
    override fun onDismissed(transientBottomBar: WcpSnackbar?, event: Int) {
        if (requireContext().isTouchExplorationEnabled) {
            restoreFocusAfterUpdate(category)
        }
    }
})

private fun restoreFocusAfterUpdate(category: PersonalInformationCategory) {
    val targetContainer = when (category) {
        PersonalInformationCategory.PHONE_NUMBER -> binding.personalInformationPhoneContainer
        PersonalInformationCategory.ADDRESS -> binding.personalInformationAddressContainer
        PersonalInformationCategory.SECONDARY_ADDRESS,
        PersonalInformationCategory.SECONDARY_ADDRESS_REMOVED ->
            binding.personalInformationSecondaryAddressContainer
        PersonalInformationCategory.EMERGENCY_CONTACT,
        PersonalInformationCategory.DELETE_EMERGENCY_CONTACT ->
            binding.personalInformationEmergencyContactContainer
    }
    targetContainer.setFocusForAccessibility()
}
```

---

## 🔑 Key Rules

- **Always call `requestFocus()` on the error view** (banner or inline field) immediately after showing a validation error. Without this call, TalkBack focus remains wherever it was before submission.
- **Pair `requestFocus()` with `postAccessibilityAnnouncement()`** to guarantee the error text is announced even if focus has already landed on the view (focus alone is not always sufficient).
- **Mark error banner views as `android:focusable="true"` in XML** — non-focusable views cannot receive programmatic focus from `requestFocus()`.
- **`android:accessibilityLiveRegion="assertive"`** on the banner catches cases where the view was already visible — live regions re-read when content changes, even if focus doesn't move.
- **`isTouchExplorationEnabled` guard** — only apply TalkBack-specific focus logic when TalkBack is active. Unconditional `requestFocus()` changes the visual focus ring for sighted users.
- **`announceFirstFieldError`** must iterate fields **in visual top-to-bottom order** so the focus jump feels natural for the screen-reader user.
- **Snackbar dismiss** requires separate focus restoration because the snackbar lives in the decor view and focus is lost when it exits the hierarchy. Use `BaseTransientBottomBar.BaseCallback.onDismissed` to restore it.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a screen includes an error message that becomes visible after a user action, keyboard/TalkBack focus must move to that error message (or to the first field with an error). Leaving focus on the submit button fails the criterion because the error is not in logical reading/navigation order from the current focus point.
