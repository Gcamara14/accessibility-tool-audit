# Catalyst Template: State — Checkbox Error State Not Communicated to Screen Reader

**Template ID:** `WA11Y-AND-4.1.2-008`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-008`
**Source Tickets:** CEPG-373492
**Source PRs:** [walmart-glass #138584](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138584)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A **required checkbox** (legal disclosure, consent, terms agreement) has a visible error message when the user tries to proceed without checking it. However, TalkBack users navigating the screen do not hear the error — only sighted users can see the red error text below the checkbox. Two failure modes:

1. **Error message never linked to the checkbox** — the error `TextView` is a separate view from the `CheckBox`. TalkBack reads them independently (or skips the error entirely). The checkbox itself never announces "Error: You must accept the terms to continue."
2. **`contentDescription` not updated on error state change** — `contentDescription` is set once on creation and never refreshed when the error appears or disappears.

**Symptom (Jira):** "TalkBack doesn't announce required checkbox error", "Screen reader misses consent checkbox validation", "Error message below checkbox not read by TalkBack", "User doesn't know they need to accept terms".

---

## ✅ The Fix Pattern

### Augment `contentDescription` with error text when validation fires

**❌ Bad Code:**
```kotlin
// Checkbox shows a visual error below it when the user tries to proceed
// without checking. The error message is a sibling TextView — TalkBack
// may or may not read it, and the checkbox itself provides no error context.
binding.membershipLegalDisclosureCheckbox.setOnCheckedChangeListener { isChecked ->
    if (!isChecked) {
        binding.membershipLegalDisclosureErrorMessage.isVisible = true
        // ← No contentDescription update — TalkBack user hears nothing about the error
    }
}
```

**✅ Good Code:**
```kotlin
// When validation fails (checkbox unchecked on submit): include error text in contentDescription.
// When checkbox is checked: clear the override so TalkBack reverts to normal label + "checked".
private fun updateCheckboxErrorAccessibility(isErrorVisible: Boolean) {
    contentBinding.membershipLegalDisclosureCheckbox.contentDescription =
        if (isErrorVisible) {
            // Combine: "[checkbox label]. Error: [error message text]"
            "${contentBinding.membershipLegalDisclosureCheckbox.text}. " +
                "${string(R.string.membership_accessibility_error_label)} " +
                "${contentBinding.membershipLegalDisclosureErrorMessage.text}"
            // → "I agree to the Terms and Conditions. Error: You must accept to continue."
        } else {
            null  // ← null resets to default: TalkBack reads the text property + "checked"
        }
}
```

```xml
<!-- strings.xml -->
<string name="membership_accessibility_error_label">Error:</string>
```

Call `updateCheckboxErrorAccessibility()` in both places the error state changes:

```kotlin
// On submit button tapped — show error if unchecked
onSubmitClicked {
    if (!binding.membershipLegalDisclosureCheckbox.isChecked) {
        binding.membershipLegalDisclosureErrorMessage.isVisible = true
        updateCheckboxErrorAccessibility(isErrorVisible = true)
    }
}

// On checkbox state change — clear error if user checks it
binding.membershipLegalDisclosureCheckbox.setOnCheckedChangeListener { isChecked ->
    updateCheckboxErrorAccessibility(isErrorVisible = isChecked.not())
    binding.membershipLegalDisclosureErrorMessage.isVisible = isChecked.not()
}
```

---

### Test assertions for checkbox error accessibility

```kotlin
@Test
fun `verify checkbox contentDescription includes Error label when unchecked`() {
    scenario.onFragment { fragment ->
        // User tries to submit without checking → error shown
        fragment.binding.membershipLegalDisclosureCheckbox.performClick() // check
        fragment.binding.membershipLegalDisclosureCheckbox.performClick() // uncheck → error visible

        val expectedDescription =
            "${fragment.binding.membershipLegalDisclosureCheckbox.text}. " +
            "${fragment.requireContext().getString(R.string.membership_accessibility_error_label)} " +
            "${fragment.binding.membershipLegalDisclosureErrorMessage.text}"

        assertThat(fragment.binding.membershipLegalDisclosureCheckbox.contentDescription)
            .isEqualTo(expectedDescription)
    }
}

@Test
fun `verify checkbox contentDescription is null when checked`() {
    scenario.onFragment { fragment ->
        fragment.binding.membershipLegalDisclosureCheckbox.performClick() // check
        assertThat(fragment.binding.membershipLegalDisclosureCheckbox.contentDescription)
            .isNull()
    }
}
```

---

### XML — keep error message as `gone` (not `invisible`) when not active

```xml
<!-- Legal disclosure checkbox -->
<CheckBox
    android:id="@+id/membership_legal_disclosure_checkbox"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/membership_legal_disclosure_text" />

<!-- Error message — must be GONE (not INVISIBLE) when not shown,
     so TalkBack does not focus it when invisible -->
<TextView
    android:id="@+id/membership_legal_disclosure_error_message"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/membership_legal_disclosure_error"
    android:visibility="gone"
    android:textColor="@color/error_red" />
```

---

## 🔑 Key Rules

- **Include error text directly in the checkbox's `contentDescription`** — sibling error `TextView` elements may be skipped by TalkBack depending on focus order and traversal mode. The most reliable pattern is to embed the error into the checkbox's own `contentDescription` so the user always hears it when focusing the checkbox.
- **Prefix with "Error: "** — sighted users see the red color/icon to understand severity. TalkBack users need an explicit "Error: " or "Required: " prefix since visual cues don't translate to audio.
- **`null` to reset** — setting `contentDescription = null` on a `CheckBox` reverts TalkBack to reading the view's `text` property + native "checked"/"not checked" state. Do not set `contentDescription = ""` (empty string) — that silences the entire announcement.
- **Update on both paths** — the `contentDescription` must be updated both when the error appears (validation fires) and when the error clears (user checks the box). Missing the "clear" path leaves a stale "Error:" announcement on a now-valid checkbox.
- **Prefer `gone` over `invisible`** for hidden error views — `INVISIBLE` views still occupy space and can receive TalkBack focus in some traversal modes. `GONE` removes them from the accessibility tree entirely.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The current state of user interface components — including error states — must be programmatically determinable. A required checkbox that shows a visual error message in a sibling `TextView` without updating its own `contentDescription` fails to surface that error state to assistive technologies. Screen-reader users cannot determine that their action (submitting the form) failed or that a checkbox is required.
