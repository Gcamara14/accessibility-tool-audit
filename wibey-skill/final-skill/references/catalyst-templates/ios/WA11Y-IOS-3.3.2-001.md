# Catalyst Template: Labels or Instructions — Hide Inline Error Label With `accessibilityElementsHidden` When Error Is Already Announced via Text Field's `accessibilityLabel`

**Template ID:** `WA11Y-IOS-3.3.2-001`
**Platform:** iOS
**WCAG Criterion:** 3.3.2 Labels or Instructions
**Jira Label:** `WA11Y-IOS-3.3.2-001`
**Source Tickets:** HVCE-13884
**Source PRs:** [glass-app #153332](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/153332)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Form fields that display inline error messages often have two sources of error information:

1. **The text field's `accessibilityLabel`** — updated to include the error message (e.g., "Last name, Error: Required")
2. **An inline error label** — a `UILabel` or `WCPLabel` displayed visually below the text field with the same error text

When VoiceOver traverses the form, both elements are focused separately:
- Focus 1: Text field → "Last name, Error: Required, text field"
- Focus 2: Inline error label → "Required" ← duplicate announcement

The duplicate announcement is confusing. It interrupts traversal and makes VoiceOver users feel as though the form is broken or that two separate errors exist on the same field.

**Symptom (Jira):** "VoiceOver announces error message twice for the same field", "Screen reader reads 'Required' separately below the text field it already announced it for", "Duplicate error announcement in form fields".

---

## ✅ The Fix Pattern

### Hide the inline error label with `accessibilityElementsHidden = true`

```swift
// SMSOrderLookupFormView.swift

private func configureAccessibility() {
    // Text fields use accessibilityText to carry the field label
    // (e.g., "Last name required" — includes the required indicator context)
    lastNameTextField.accessibilityText = .localized(.accessibilityLastNameLabel)
    dobTextField.accessibilityText = .localized(.accessibilityDOBFieldRequiredTitle)

    // ✅ Hide inline error labels from VoiceOver.
    // Errors are already announced via the text field's accessibilityLabel when
    // an error state is applied (e.g., "Last name, Error: Required").
    // Leaving the error label visible to VoiceOver causes a duplicate announcement.
    [lastNameTextField, dobTextField].forEach { textField in
        if let containerStack = textField.subviews.first as? UIStackView,
           let helperView = containerStack.arrangedSubviews.last {
            helperView.accessibilityElementsHidden = true
        }
    }
}
```

---

### When to apply this fix

| Error communication strategy | Apply `accessibilityElementsHidden`? |
|---|---|
| Text field `accessibilityLabel` contains error text AND inline error label exists | ✅ Yes — suppress inline label |
| Text field `accessibilityLabel` contains error text only (no inline label) | N/A — no label to suppress |
| Inline error label is the ONLY error communication | ❌ No — the label is the accessibility path |
| Text field uses `UIAccessibilityCustomContent` for error | ✅ Yes if inline label duplicates it |

---

### Full pattern: text field with error in label + suppressed inline label

```swift
// MyFormViewController.swift

// Error state: update text field accessibility AND suppress the inline error
private func showError(_ error: String, on textField: WCPTextField, errorLabel: UILabel) {
    // ✅ Step 1: Include error in the text field's accessible label
    textField.accessibilityLabel = "\(textField.fieldName), \(String.localized(.textError(description: error)))"
    // → VoiceOver: "Last name, Error: Required, text field"

    // ✅ Step 2: Show the inline error visually (for sighted users)
    errorLabel.text = error
    errorLabel.isHidden = false

    // ✅ Step 3: Hide the inline error from VoiceOver (already in text field label)
    errorLabel.isAccessibilityElement = false
    errorLabel.accessibilityElementsHidden = true
}

// Clearing error state: restore both
private func clearError(on textField: WCPTextField, errorLabel: UILabel) {
    textField.accessibilityLabel = textField.fieldName
    errorLabel.isHidden = true
    errorLabel.isAccessibilityElement = false  // remains hidden
    errorLabel.accessibilityElementsHidden = true
}
```

---

### Alternative: use `accessibilityElementsHidden` at construction time for deep helpers

When the error label is a subview of a complex text field component (e.g., `WCPTextField`, `WCPLDTextField`), traversal into the helper/error area is controlled by the component's container. Suppress it at the container level:

```swift
// For WCPTextField or similar complex components where error is in a nested stack:
textField.subviews.first(where: { $0 is UIStackView })
    .flatMap { ($0 as? UIStackView)?.arrangedSubviews.last }
    .map { $0.accessibilityElementsHidden = true }
```

Or, if your component exposes a dedicated `errorView` property:
```swift
textField.errorView?.accessibilityElementsHidden = true
```

---

### ❌ Bad Code — both error sources visible to VoiceOver

```swift
// ❌ Before fix: both the text field and its inline error label are accessible
lastNameTextField.accessibilityText = .localized(.accessibilityLastNameLabel)
// ← When validation fails, accessibilityLabel becomes "Last name, Error: Required"

// ← The inline error label (from the text field component's internal structure)
//    has isAccessibilityElement = true by default (if it's a UILabel)
// ← VoiceOver traversal:
//   "Last name, Error: Required, text field"  ← text field
//   "Required"                                ← inline error label (duplicate)
```

---

### VoiceOver traversal comparison

```
Before fix (validation error state):
  Swipe → "Last name, Error: Required, text field"  ← textField (error in label)
  Swipe → "Required"                                ← inline error label (DUPLICATE)
  Swipe → "Date of birth, Error: Invalid date, text field"
  Swipe → "Invalid date"                            ← inline error label (DUPLICATE)

After fix:
  Swipe → "Last name, Error: Required, text field"  ← textField
  Swipe → "Date of birth, Error: Invalid date, text field"
  ← Inline error labels suppressed; no duplicates
```

---

### Component-level suppression (Living Design components)

If you are fixing a Living Design component (`WCPTextField`, `WCPLDTextField`), add the suppression inside the component so all call sites benefit:

```swift
// WCPTextField.swift (Living Design)

private func configureErrorAccessibility() {
    // ✅ Error text is merged into the text field's accessibilityLabel by the component.
    //    Suppress the visual error label from VoiceOver to prevent duplication.
    errorMessageLabel.isAccessibilityElement = false
    errorMessageLabel.accessibilityElementsHidden = true
    // Callers rely on the text field's accessibilityLabel to carry the error.
}
```

---

## 🔑 Key Rules

- **When a form field includes error text in its `accessibilityLabel`, suppress any inline error label with `accessibilityElementsHidden = true`** — two announcements for the same error from two different elements is a VoiceOver double-announcement bug. The text field's label is the authoritative error source; the inline label is redundant.
- **Use `accessibilityElementsHidden = true` (not `isAccessibilityElement = false` alone)** — for complex component error views (which may have child views), `accessibilityElementsHidden = true` ensures the entire subtree is suppressed, not just the top-level label.
- **Apply the suppression to the error view at construction time, not conditionally** — the error label is only visible when there's an error. Since it's also hidden (`isHidden = true`) in the normal state, suppressing it permanently via `accessibilityElementsHidden = true` has no impact in the normal state and prevents duplication in the error state.
- **Prefer fixing this in the Living Design component** — if `WCPTextField` consistently causes error duplication, add the suppression inside the component once. This is better than fixing it in every call site that shows validation errors.
- **Always keep at least one accessibility path for errors** — never suppress the inline error label unless you are certain the error is communicated elsewhere (e.g., in the text field's `accessibilityLabel` or via `UIAccessibility.post`). Do not suppress the only error communication path.

---

## ⚠️ WCAG Failure Without This Fix

- **3.3.2 (Labels or Instructions):** Labels or instructions are provided when content requires user input. This template is primarily a VoiceOver usability improvement, but duplicate error announcements can confuse users into thinking there are two separate errors or two separate fields with errors. More broadly, a clear, single error announcement (through the field's `accessibilityLabel`) without duplication is necessary to meet the spirit of 3.3.2 — that error instructions are clear and unambiguous. The double announcement violates the principle that error messages should be directly associated with the field they describe, presented once and clearly.

