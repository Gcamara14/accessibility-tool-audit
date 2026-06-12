# Catalyst Template: Status Messages — Password Validation: Announce Only When a Requirement Newly Becomes Satisfied (Not Per-Keystroke)

**Template ID:** `WA11Y-IOS-4.1.3-008`
**Platform:** iOS
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-IOS-4.1.3-008`
**Source Tickets:** CEPG-370784
**Source PRs:** [glass-app #157623](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/157623)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Password validation fields update in real time as the user types. Each time the user types a character, the view updates the password policy indicators (length ✓, uppercase ✓, number ✓). Without VoiceOver announcements, these state changes are visual-only — VoiceOver users never know when a requirement is satisfied.

A naive fix — posting `.announcement` on every keystroke — causes the opposite problem: noisy interruptions on every character, overlapping with the user's typing rhythm. The announcement for character N fires before character N+1 is processed, creating an unreadable stream of overlapping speech.

**Symptom (Jira):** "VoiceOver doesn't tell me when password requirements are met", "Screen reader misses password policy validation feedback", "No announcement when '8 characters' requirement passes", "Password strength feedback silent for VoiceOver users".

---

## ✅ The Fix Pattern

### Capture previous states → update → detect transitions → announce only new satisfactions

```swift
// SignUpView.swift / SignUpV2View.swift

private func updatePasswordPolicyFields(password: String) {
    // ✅ Step 1: Capture states BEFORE the update
    let policyFields = [
        passwordPolicyLengthField,
        passwordPolicyCaseField,
        passwordPolicyNumberField
    ]
    let previousStates = policyFields.map { $0.state }

    // Step 2: Update all policy fields with the new password
    passwordPolicyLengthField.updateState(
        for: model.passwordPolicyLengthValidationBlock?(password) ?? .default
    )
    passwordPolicyCaseField.updateState(
        for: model.passwordPolicyCaseValidationBlock?(password) ?? .default
    )
    passwordPolicyNumberField.updateState(
        for: model.passwordPolicyNumberValidationBlock?(password) ?? .default
    )

    // Step 3: Update the combined accessibility label for the policy stack
    let updatedLabel = getPasswordAccessibilityText()
    passwordValidationFieldStack.accessibilityLabel = updatedLabel

    // ✅ Step 4: Detect fields that just transitioned to .success
    let newlyMetNames = zip(previousStates, policyFields).compactMap { prev, field -> String? in
        guard prev != .success, field.state == .success, let name = field.titleText else {
            return nil  // ← Not newly met: skip
        }
        return name
    }

    // ✅ Step 5: Announce only if at least one requirement newly became satisfied
    if !newlyMetNames.isEmpty {
        let joined = newlyMetNames.joined(separator: ", ")
        let announcement: String

        if newlyMetNames.count == policyFields.count {
            // ✅ Special case: all requirements passed at once
            announcement = LocalizedString
                .authenticationSignUpScenePasswordPolicyAllRequirementsMet
                .localizedString()
            // → "All password requirements met"
        } else {
            // ✅ Individual requirement(s) newly met
            announcement = LocalizedString
                .authenticationSignUpScenePasswordPolicyRequirementMet(criteria: joined)
                .localizedString()
            // → "Requirement met: 8 characters"
            // → "Requirement met: Upper & lowercase letters, Numbers"
        }

        UIAccessibility.post(notification: .announcement, argument: announcement)
    }
    // ✅ If no requirements newly met → no announcement → no noise
}
```

---

### Required localized strings

```
// Localizable.strings

// All requirements satisfied
"authentication.sign_up_scene.passwordPolicyAllRequirementsMet" = "All password requirements met";

// Individual requirement(s) newly met — {criteria} is a comma-joined list of requirement names
"authentication.sign_up_scene.passwordPolicyRequirementMet" = "Requirement met: {criteria}";
```

---

### ❌ Bad Code — per-keystroke or no announcement

```swift
// ❌ Before fix (version 1 — no announcement at all):
private func updatePasswordPolicyFields(password: String) {
    passwordPolicyLengthField.updateState(for: ...)
    // VoiceOver: complete silence on all state changes
}

// ❌ Before fix (version 2 — naive per-keystroke announcement):
func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
    // After updating:
    UIAccessibility.post(notification: .announcement, argument: getPasswordAccessibilityText())
    // ← Posts on every single keystroke
    // ← Fires while user is still typing
    // ← Overlapping speech interrupts VoiceOver user's editing rhythm
    // ← Even announces when nothing changed (user typed a character that didn't cross any threshold)
}
```

---

### The announcement strategy

```
User types: "Passw"
  → Length field: .default → .default (no change)
  → Case field:   .default → .default (no change)
  → Number field: .default → .default (no change)
  → No newly met requirements → no announcement ✅ (silence is correct)

User types: "Password"
  → Length field: .default → .success (8+ chars) ← NEWLY MET
  → Case field:   .default → .success (has uppercase) ← NEWLY MET
  → Number field: .default → .default (no number yet)
  → newlyMetNames = ["8 or more characters", "Upper & lowercase letters"]
  → announcement: "Requirement met: 8 or more characters, Upper & lowercase letters" ✅

User types: "Password1"
  → Length field: .success → .success (no change)
  → Case field:   .success → .success (no change)
  → Number field: .default → .success ← NEWLY MET
  → announcement: "All password requirements met" ✅ (all 3 now satisfied)

User deletes: "Password"
  → Number field: .success → .default (requirement lost)
  → newlyMetNames = [] (no NEW satisfactions)
  → No announcement ✅ (do not announce when requirements are lost — confusing)
```

---

### Why not announce when a requirement is lost

When a user deletes characters and a requirement becomes unsatisfied, the visual indicators update but no VoiceOver announcement fires. This is intentional:
- The user is actively deleting — they know their input changed
- Announcing "Requirement no longer met" on every deletion would be extremely noisy
- WCAG 4.1.3 focuses on status messages that communicate outcomes, not every intermediate state change during editing
- The combined `passwordValidationFieldStack.accessibilityLabel` is updated regardless, so a user who re-reads the field will see current state

---

### Accessibility label for the combined policy stack

Always maintain an up-to-date `accessibilityLabel` on the policy stack, regardless of announcements:

```swift
// ✅ Always update the combined label (whether or not an announcement fires)
let updatedLabel = getPasswordAccessibilityText()
passwordValidationFieldStack.accessibilityLabel = updatedLabel
// → VoiceOver can swipe back to re-read the full policy status at any time

// Example label values:
// "Password must contain: 8 or more characters — not met. Upper & lowercase letters — not met. Numbers — not met."
// "Password must contain: 8 or more characters ✓. Upper & lowercase letters ✓. Numbers — not met."
// "Password must contain: 8 or more characters ✓. Upper & lowercase letters ✓. Numbers ✓."
```

---

## 🔑 Key Rules

- **Capture previous states before updating** — `let previousStates = fields.map { $0.state }` must run before any `updateState()` calls. Capturing after defeats the comparison.
- **Announce only on `.default → .success` transitions** — the guard `prev != .success && field.state == .success` ensures announcements fire only when a requirement newly passes, not on every keystroke.
- **Use a special "all requirements met" announcement** — when all requirements satisfy simultaneously (e.g., pasted password), a single "All password requirements met" is clearer than listing each requirement individually.
- **Never announce when a requirement is lost** — do not post `.announcement` when `state` transitions from `.success` back to `.default`. Update the accessibility label on the stack, but stay silent about individual regressions.
- **Always update `accessibilityLabel` on the policy stack** — the combined label must reflect current state even when no announcement fires. Users who swipe back to the policy stack should get accurate feedback.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus. Password validation indicators that change state in real time are status messages — they inform the user of the outcome of their input without requiring navigation. When these visual state changes are not accompanied by a VoiceOver `.announcement` notification, VoiceOver users have no way to know their password meets or fails requirements without leaving the text field and navigating to the policy stack. The `UIAccessibility.post(notification: .announcement, ...)` call on newly-satisfied requirements fulfills the "programmatically determined without focus" requirement of 4.1.3.

