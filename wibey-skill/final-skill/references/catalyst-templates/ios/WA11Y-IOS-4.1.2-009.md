# Catalyst Template: Custom Checkbox Missing Checked/Unchecked State Announcement

**Template ID:** `WA11Y-IOS-4.1.2-009`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Component:** Bundle checkbox accessibilityLabel / OnePayCardEditView default-payment checkbox
**Source PRs:**
- [CEPG-343557](https://jira.walmart.com/browse/CEPG-343557) | commit `e1ac3f0e10c6` — bundle checkbox `accessibilityLabel` missing price; `checkboxAccessibilityString` missing composite info
- `Plugins/AccountWallet/AccountWallet/Sources/Edit/OnePayCardEditView.swift` line 288 — `defaultCheckBox` trait pattern
**Ingested:** 2026-04-30

---

## The Problem

Custom checkbox views do not announce their checked/unchecked state to VoiceOver. VoiceOver reads the label text but says nothing about whether the checkbox is selected — failing WCAG 4.1.2's requirement that the current **value** (state) of a form control be programmatically determinable. Additionally, composite checkbox labels sometimes omit visible information (price, quantity) that sighted users can see, forcing VoiceOver users to navigate away to find it.

**Root cause:** Only `UISwitch` and `UIButton(type: .checkbox)` (iOS 14+) expose state automatically. Any custom checkbox `UIView` must manually update `accessibilityTraits` (`.selected` for checked, no `.selected` for unchecked) on every state change. Separately, `LDCheckbox` / `WCPCheckbox` prepend "checked, checkbox," or "unchecked, checkbox," automatically from `checkboxAccessibilityString` — so the string set by callers must contain all meaningful descriptive content.

---

## Fix Patterns

### Pattern A: Custom Checkbox — Reflect State via `accessibilityTraits` (OnePayCardEditView)

**Bad Code:**
```swift
// ❌ No state announced — VoiceOver just says "Default payment method, button"
defaultCheckBox.isAccessibilityElement = true
defaultCheckBox.accessibilityLabel = Text.defaultText
// Missing: trait update on state change
```

**Good Code:**
```swift
// ✅ Trait reflects current state: "Default payment method, selected, button" when checked
private func configureAccessibility() {
    defaultCheckBox.isAccessibilityElement = true
    defaultCheckBox.accessibilityLabel = Text.defaultText
    defaultCheckBox.accessibilityTraits = defaultCheckBox.isBoxChecked
        ? [.button, .selected]
        : [.button]
}
```

**Why This Works:** `accessibilityTraits = [.button, .selected]` causes VoiceOver to announce "selected" after the label when the box is checked, and omits it when unchecked — matching the standard iOS switch and checkbox pattern. `configureAccessibility()` must be called every time `isBoxChecked` changes (in `didSet` or after model update) so traits stay in sync with visual state.

---

### Pattern B: Composite Checkbox Label Missing Price (CEPG-343557)

**Bad Code:**
```swift
// ❌ Price not included — VoiceOver says "checked, checkbox, Bought together, Samsung TV"
//    (missing price, user must navigate away to find it)
checkboxAccessibilityString = [moduleTitle, product.name].compacted().joined(separator: " ")
```

**Good Code:**
```swift
// ✅ Price appended — "checked, checkbox, Bought together, Samsung TV, $20.00"
let nameAccessibilityString = [moduleTitle, product.name].compacted().joined(separator: " ")
checkboxAccessibilityString = [nameAccessibilityString, product.priceInfo?.current].compacted()
    .joined(separator: ", ")
```

**Why This Works:** `LDCheckbox` / `WCPCheckbox` prepends "checked, checkbox," or "unchecked, checkbox," automatically when `checkboxAccessibilityString` is set — callers supply only the descriptive content. Appending `product.priceInfo?.current` to the label string means VoiceOver users hear price alongside name in a single focus stop, eliminating the need to navigate away.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Checked state announced | Never — VoiceOver says "button" only | `.selected` trait announces "selected" when checked |
| Unchecked state announced | Never | Absence of `.selected` trait is silent (correct for unchecked) |
| Price in composite label | Omitted — user must navigate away | `product.priceInfo?.current` appended to `checkboxAccessibilityString` |
| State stays in sync | N/A | `configureAccessibility()` called in `didSet` / after model update |

---

## Key Signals (For Pattern Matching)

- Custom `UIView` checkbox with no `.selected` trait toggling on state change
- `accessibilityTraits = .button` set once at init and never updated when checked state changes
- `checkboxAccessibilityString` or `accessibilityLabel` that includes name but not price, quantity, or other visible data
- Standard `UISwitch` and `UIButton(type: .checkbox)` handle state automatically — only custom views need manual trait management
- VoiceOver says "button" with no state word when landing on a checkbox

---

## Key Rules

- Use `accessibilityTraits = [.button, .selected]` when checked, `[.button]` when unchecked — `.selected` is the standard iOS trait for checked state
- Call `configureAccessibility()` every time the checkbox state changes (in `didSet` or after model update)
- Standard `UISwitch` and `UIButton(type: .checkbox)` handle state automatically — only custom views need manual trait management
- Include all visible information (price, quantity) in the composite `accessibilityLabel` so VoiceOver users don't need to navigate away

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | CEPG-343557 / commit e1ac3f0e10c6 | Bundle checkbox — `checkboxAccessibilityString` | Price appended to composite label | Ingested |
| Var 2 | AccountWallet / OnePayCardEditView | Default-payment checkbox trait | `[.button, .selected]` / `[.button]` toggled in `configureAccessibility()` | Ingested |

---

## Related Templates

- `WA11Y-IOS-4.1.2-001` — iOS: Button role missing on custom tappable view
- `WA11Y-IOS-4.1.2-003` — iOS: Toggle / switch state not announced
- `WA11Y-IOS-1.1.1-001` — iOS: Missing `accessibilityLabel` on informative image
