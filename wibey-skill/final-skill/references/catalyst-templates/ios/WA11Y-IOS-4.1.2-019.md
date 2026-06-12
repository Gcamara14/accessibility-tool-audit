# Catalyst Template: Name, Role, Value — WCPLabel Silent to VoiceOver (Requires `isAccessibilityElement = true`); UIStackView in `accessibilityElements` Swallows Children

**Template ID:** `WA11Y-IOS-4.1.2-019`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-019`
**Source Tickets:** CEPG-371037
**Source PRs:** [glass-app #157623](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/157623)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Two related VoiceOver failures appear together in forms and sign-in screens:

**Problem 1 — `WCPLabel` is a `UIView` subclass, not `UILabel`.**
`UILabel` defaults to `isAccessibilityElement = true`. `UIView` defaults to `isAccessibilityElement = false`. Because `WCPLabel` extends `UIView` (not `UILabel`), every `WCPLabel` instance is invisible to VoiceOver unless explicitly marked.

```swift
// ❌ Before fix — WCPLabel with no isAccessibilityElement = true
// VoiceOver completely skips these labels
private let directionsLabel = WCPLabel(style: .bodyMedium)
private let rememberYourPasswordLabel = WCPLabel(style: .bodySmall)
// → "Sign in" and other elements are announced, but instructions/labels are skipped entirely
```

**Problem 2 — `UIStackView` in `accessibilityElements` silently swallows its children.**
When a `UIStackView` is added to `accessibilityElements`, VoiceOver tries to focus it as a leaf node. Because `UIStackView.isAccessibilityElement = false` by default, the stack receives no focus and neither do its children — the button/label inside is effectively unreachable.

```swift
// ❌ Before fix — stack view listed instead of the button inside it
accessibilityElements.append(forgotPasswordStackView)
// → forgotPasswordLinkButton inside the stack is never reachable by VoiceOver
```

**Symptom (Jira):** "VoiceOver skips directions text on Forgot Password screen", "Instructions not read aloud on sign-in page", "'Remember your password?' link missing from VoiceOver traversal", "Forgot password button unreachable by VoiceOver".

---

## ✅ The Fix Pattern

### Fix 1 — Explicitly set `isAccessibilityElement = true` on all `WCPLabel` instances

```swift
// ForgotYourPasswordView.swift

apply(directionsLabel) {
    $0.isAccessibilityElement = true  // ✅ WCPLabel is UIView — must be explicit
    $0.numberOfLines = 0
    $0.text = model.directionsText
}

apply(rememberYourPasswordLabel) {
    $0.isAccessibilityElement = true  // ✅ Required for all WCPLabel instances
    $0.text = LocalizedString.rememberPasswordLabel.localizedString()
}
```

### Fix 2 — List the actual interactive element, not the container stack view

```swift
// AuthChoiceView.swift

// ❌ Before — stack view in accessibilityElements
accessibilityElements.append(forgotPasswordStackView)

// ✅ After — the button itself, with visibility guard
if !forgotPasswordStackView.isHidden {
    accessibilityElements.append(forgotPasswordLinkButton)
    // → forgotPasswordLinkButton is a WCPLinkButton directly inside the stack
    // → VoiceOver focuses and announces the button correctly
}
```

---

### Complete example: building a corrected `accessibilityElements` list

```swift
// ForgotYourPasswordView.swift

private func getAccessibilityElements() -> [Any] {
    var accessibilityElements: [Any] = []

    // ✅ WCPLabel: always set isAccessibilityElement = true at construction
    if !directionsLabel.isHidden {
        accessibilityElements.append(directionsLabel)
    }

    accessibilityElements.append(emailField)

    if !phoneOptionStack.isHidden {
        accessibilityElements.append(phoneOptionLabel)  // WCPLabel — isAccessibilityElement = true required
        accessibilityElements.append(phoneOptionStack)
    }

    // ✅ List the label directly, not its rememberPasswordStack container
    accessibilityElements.append(rememberYourPasswordLabel)

    // ✅ List the button directly, not its forgotPasswordStackView container
    if !forgotPasswordStackView.isHidden {
        accessibilityElements.append(forgotPasswordLinkButton)
    }

    accessibilityElements.append(signInButton)
    return accessibilityElements
}
```

---

### ❌ Bad Code summary

```swift
// ❌ WCPLabel without isAccessibilityElement = true — invisible to VoiceOver
let headerLabel = WCPLabel(style: .headingLarge)
// headerLabel.isAccessibilityElement is false by default — VoiceOver skips it

// ❌ Stack view listed in accessibilityElements — children unreachable
accessibilityElements = [
    headerLabel,          // silently skipped (not set)
    emailTextField,
    forgotPasswordStackView, // ← contains forgotPasswordLinkButton but VoiceOver can't reach it
    signInButton
]
```

---

### Why `UIStackView.isAccessibilityElement = false` by default

`UIStackView` is a layout container. Apple designed it with `isAccessibilityElement = false` because its purpose is arranging children, not communicating content. Unlike `UILabel` or `UIButton`, which carry meaningful accessible content by default, a stack view has no intrinsic accessible name.

When you add a `UIStackView` to `accessibilityElements`, VoiceOver sees it as a potential focus target. It then reads `UIStackView.accessibilityLabel` (nil) and announces nothing. Its children are not traversed because adding the parent to `accessibilityElements` signals to VoiceOver that the parent should be the leaf.

**Rule:** Never add a `UIStackView`, `UIView`, or `UIScrollView` container to `accessibilityElements` unless it has `isAccessibilityElement = true` and an explicit `accessibilityLabel`. Always add the leaf interactive elements (labels, buttons, text fields) directly.

---

### `WCPLabel` vs `UILabel` default accessibility

| Type | Superclass | Default `isAccessibilityElement` | VoiceOver behavior without explicit setting |
|---|---|---|---|
| `UILabel` | `UIView` (but Apple special-cases it) | `true` | ✅ Announced by default |
| `WCPLabel` | `UIView` | `false` | ❌ Skipped entirely |
| `UIButton` | `UIControl` | `true` | ✅ Announced by default |
| `UIStackView` | `UIView` | `false` | ❌ Skipped (or swallows children) |
| `WCPButton` | varies | varies | ⚠️ Must verify |

Any Living Design component that extends `UIView` directly must be assumed to have `isAccessibilityElement = false` until verified.

---

### Verification approach

Use Xcode Accessibility Inspector or add a unit test:

```swift
// Unit test pattern (CEPG-371037 approach):
func testDirectionsLabelIsAccessibilityElement() {
    let view = ForgotYourPasswordView(model: makeModel(flow: .accountVerification))
    XCTAssertTrue(
        view.testHooks._directionsLabel.isAccessibilityElement,
        "directionsLabel must be an accessibility element so VoiceOver can focus it"
    )
}

func testForgotPasswordButtonIsReachable() {
    let view = AuthChoiceView(model: makeModel())
    let elements = view.getAccessibilityElements() as? [UIView] ?? []
    XCTAssertTrue(
        elements.contains(view.testHooks._forgotPasswordLinkButton),
        "forgotPasswordLinkButton must be in accessibilityElements, not its container stack"
    )
    XCTAssertFalse(
        elements.contains(view.testHooks._forgotPasswordStackView),
        "forgotPasswordStackView (UIStackView) must not be in accessibilityElements"
    )
}
```

---

## 🔑 Key Rules

- **Set `isAccessibilityElement = true` on every `WCPLabel` instance** — `WCPLabel` is a `UIView` subclass. It is invisible to VoiceOver unless explicitly marked. Apply this at the point of construction (the `apply($0)` block) — do not rely on call-site or model-update code to set it.
- **Never add `UIStackView` or bare `UIView` containers to `accessibilityElements`** — always add the leaf elements (the `WCPLabel`, `UIButton`, `WCPLinkButton`, etc.) directly. The container provides no accessible content and blocks traversal of its children.
- **Audit all Living Design components that extend `UIView`** — `WCPLabel`, `WCPTag`, `WCPCard`, and similar components extend `UIView` and default to `isAccessibilityElement = false`. Treat all such components as invisible to VoiceOver until verified.
- **Add a visibility guard when adding dynamic elements** — when a button or label lives inside a stack that may be hidden, check `!stackView.isHidden` before adding the button to `accessibilityElements`. Avoid adding an element that is currently invisible.
- **Add unit tests verifying `isAccessibilityElement = true`** — accessibility regression tests for Living Design component focusability should be part of every ADA fix.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name of user interface components must be programmatically determinable. A `WCPLabel` with `isAccessibilityElement = false` has no programmatically determinable name — it is completely absent from the accessibility tree. A `UIStackView` added to `accessibilityElements` that contains a `WCPLinkButton` means the link's name is also not programmatically determinable via normal traversal. VoiceOver users cannot access the directions text, the "Remember your password?" label, or the "Forgot password?" link — essential content for completing the sign-in flow.

