# Catalyst Template: Keyboard — `UITextView` VoiceOver Double-Tap Fails to Open Keyboard; Fix With `accessibilityActivate()` Override

**Template ID:** `WA11Y-IOS-2.1.1-002`
**Platform:** iOS
**WCAG Criterion:** 2.1.1 Keyboard
**Jira Label:** `WA11Y-IOS-2.1.1-002`
**Source Tickets:** GPUGC-31641
**Source PRs:** [glass-app #156793](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/156793)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`SimplifiedWARTextArea` is a custom text area component that wraps a `UITextView` inside a container view. The container exposes the inner `UITextView` via `accessibilityElements`. When VoiceOver focuses the `UITextView` and the user double-taps to activate it, `accessibilityActivate()` is called on the **container** (because the container is in the accessibility tree), not on the `UITextView` itself.

The container's `accessibilityActivate()` called `textView.becomeFirstResponder()`. This silently failed intermittently on real devices, because `becomeFirstResponder()` called on a `UIView` from a context where VoiceOver has already moved the system's responder chain can fail depending on the current focus state.

Additionally, the `accessibilityValue` was set to the placeholder text as part of the label — causing VoiceOver to announce the placeholder as if it were user-entered content.

**Symptom (Jira):** "VoiceOver double-tap on text area doesn't open keyboard", "Can't enter text in review text field with VoiceOver", "Text area not editable via VoiceOver", "Keyboard doesn't appear when I double-tap the text field with VoiceOver on".

---

## ✅ The Fix Pattern

### Create a `UITextView` subclass that overrides `accessibilityActivate()`

```swift
// SimplifiedWARTextArea.swift

/// UITextView subclass that ensures VoiceOver double-tap opens the keyboard.
/// When a parent container exposes this view via `accessibilityElements`,
/// VoiceOver focuses the inner UITextView — but calls accessibilityActivate()
/// on the outermost responder in the tree. By overriding it here, the double-tap
/// directly triggers becomeFirstResponder() on the text view that was focused.
private final class VoiceOverEditableTextView: UITextView {
    override func accessibilityActivate() -> Bool {
        let result = becomeFirstResponder()
        if result {
            // ✅ Notify VoiceOver that layout changed after keyboard appears
            UIAccessibility.post(notification: .layoutChanged, argument: self)
        }
        return result
    }
}
```

Replace the plain `UITextView` with the subclass:

```swift
// SimplifiedWARTextArea.swift

// ❌ Before:
let view = UITextView()

// ✅ After:
let view = VoiceOverEditableTextView()
```

---

### Separate `accessibilityLabel` (field header) from `accessibilityValue` (current text + limit)

```swift
// SimplifiedWARTextArea.swift

private func updateAccessibility() {
    // ✅ accessibilityLabel = field header + error (not placeholder)
    var labelParts: [String] = []
    if let header = model.headerLabelText {
        labelParts.append(header)
    }
    if isShowingError, let errorText = errorLabel.text {
        labelParts.append(.localized(.textError(description: errorText)))
    }
    // ← Placeholder text is NOT included in the label
    // ← Including placeholder makes VoiceOver announce it even when the field is empty,
    //    sounding like user content is present

    // ✅ accessibilityValue = current text + character count
    var valueParts: [String] = []
    if let currentText = textView.text, currentText.isNotEmpty {
        valueParts.append(currentText)
    }
    if let limit = model.allowedCharacterLimit {
        valueParts.append("\(textView.text?.count ?? 0) of \(limit) characters")
    }

    let accessibilityLabel = labelParts.joined(separator: ". ")
    let accessibilityValue = valueParts.joined(separator: ". ")

    textView.accessibilityLabel = accessibilityLabel.isEmpty ? nil : accessibilityLabel
    textView.accessibilityValue = accessibilityValue.isEmpty ? nil : accessibilityValue
    textView.accessibilityHint = nil
}
```

---

### Keyboard toolbar navigation: resignFirstResponder before transitioning fields

```swift
// SimplifiedWARTextArea.swift

private lazy var inputToolbar = WARInputToolbar(
    previousAction: { [weak self] in
        // ✅ Explicitly resign before moving to the previous field
        self?.textView.resignFirstResponder()
        self?.focus(field: self?.previousField)
    },
    nextAction: { [weak self] in
        // ✅ Explicitly resign before moving to the next field
        self?.textView.resignFirstResponder()
        self?.focus(field: self?.nextField)
    }
)

@discardableResult
private func focus(field: UIResponder?) -> Bool {
    guard let field else { return false }
    let didBecomeFirstResponder = field.becomeFirstResponder()
    guard didBecomeFirstResponder, let accessibleTarget = field as? UIView else {
        return didBecomeFirstResponder
    }
    // ✅ Post .layoutChanged so VoiceOver moves to the newly focused field
    UIAccessibility.post(notification: .layoutChanged, argument: accessibleTarget)
    return true
}
```

---

### ❌ Bad Code — plain `UITextView` with placeholder in label

```swift
// ❌ Before:
let view = UITextView()  // ← accessibilityActivate() on this silently fails via wrapper

// ❌ Before: placeholder text in accessibilityLabel
var parts: [String] = []
if let header = model.headerLabelText { parts.append(header) }
if text.isEmpty, let placeholder = model.placeholderText {
    parts.append(placeholder)  // ← Announces placeholder as if it were actual content
}
textView.accessibilityLabel = parts.joined(separator: ". ")
// → VoiceOver: "Your review, Write your review here" (even when empty)
// → After typing: "Your review, Write your review here" (still, even though field has text)

// ❌ Before: no resignFirstResponder on toolbar navigation
previousAction: { [weak self] in
    self?.previousField?.becomeFirstResponder()
    // ← Missing resignFirstResponder — keyboard may flash or fail to transfer
}
```

---

### VoiceOver announcement comparison

```
Before fix:
  VoiceOver focuses text area
  User double-taps
  → "accessibilityActivate() called on wrapper"
  → textView.becomeFirstResponder() (sometimes fails silently)
  → Keyboard does not appear
  → VoiceOver user cannot enter text

After fix:
  VoiceOver focuses VoiceOverEditableTextView
  User double-taps
  → accessibilityActivate() override calls becomeFirstResponder() directly on textView
  → Keyboard appears reliably
  → .layoutChanged notification moves VoiceOver cursor to text insertion point
```

---

### `accessibilityLabel` vs `accessibilityValue` for text fields

| Property | Content | VoiceOver announcement |
|---|---|---|
| `accessibilityLabel` | Field name + error state | "Your review, Error: Review is required" |
| `accessibilityValue` | Current text + character count | "Great product. 15 of 500 characters" |
| `accessibilityHint` | Instructions (if any) | "Double tap to edit" (system default) |

Placeholder text belongs in neither `accessibilityLabel` nor `accessibilityValue`. It appears visually when the field is empty to suggest what to type. VoiceOver does not need a placeholder — the `accessibilityLabel` (the field name) already indicates the field's purpose.

---

## 🔑 Key Rules

- **Override `accessibilityActivate()` on `UITextView` subclasses exposed via `accessibilityElements`** — when a container view exposes inner views via `accessibilityElements`, VoiceOver's activation routing can fail to reach the inner view's responder chain. A `UITextView` subclass that overrides `accessibilityActivate()` ensures the keyboard activation is handled directly by the focused view.
- **Post `.layoutChanged(argument: self)` after `becomeFirstResponder()` succeeds** — this moves VoiceOver focus to the text view's cursor position and announces the field's label+value.
- **Never include placeholder text in `accessibilityLabel`** — placeholder is visual guidance for sighted users; it is confusing as an accessibility label because it sounds like user-entered content. Use `accessibilityLabel` for the field name and `accessibilityValue` for the current text.
- **Always call `resignFirstResponder()` before `becomeFirstResponder()` on the next field** in toolbar prev/next navigation — failing to resign before transitioning can cause the keyboard to flash, the text field focus ring to persist, or the `becomeFirstResponder()` on the next field to fail.
- **Post `.layoutChanged(argument: nextField)` after toolbar field navigation** — this moves VoiceOver focus to the newly active field so the user doesn't have to manually navigate.

---

## ⚠️ WCAG Failure Without This Fix

- **2.1.1 (Keyboard):** All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes. VoiceOver's switch access and keyboard-equivalent activation model relies on `accessibilityActivate()` reliably opening the keyboard when a text field is activated. When `accessibilityActivate()` fails to trigger `becomeFirstResponder()` reliably, VoiceOver users cannot enter text in the field — a complete keyboard accessibility failure for that form element.

