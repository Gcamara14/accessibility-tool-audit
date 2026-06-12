# Catalyst Template: Name, Role, Value — Selection State Hardcoded in `accessibilityLabel` Instead of `.selected` Trait

**Template ID:** `WA11Y-IOS-4.1.2-012`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-012`
**Source Tickets:** AMENDS-1548
**Source PRs:** [glass-app #155307](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/155307)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`Chip.swift` and `SelectableChipsView` render tappable chip buttons for delivery instruction options (dropoff location, property type, etc.). When a chip was selected, `setupAccessibility()` embedded the selection state as a string in `accessibilityLabel`:

```swift
// ❌ Before fix:
let selectedText = isSelected ? Text.selected : Text.notSelected
// Text.selected = "selected", Text.notSelected = "not selected" (hardcoded)
accessibilityLabel = (text ?? "") + ", " + selectedText
```

VoiceOver announced:
> **"Leave at my door, selected, button"** — selected chip
> **"Front door, not selected, button"** — unselected chip

Two failures:
1. **State string in label** — embedding "selected" or "not selected" in `accessibilityLabel` mixes the element's name with its value/state. The name ("Leave at my door") and the value (selected/unselected) are two separate accessibility properties — mixing them makes the label untranslatable without re-engineering.
2. **`SelectableChipsView` missing `isAccessibilityElement`** — chips created inside `SelectableChipsView` did not set `isAccessibilityElement = true` explicitly, relying on implicit accessibility detection, which failed for some configurations.

**Expected:**
> **"Leave at my door, selected, button"** — from `.button` + `.selected` traits
> **"Front door, button"** — from `.button` trait only (no state suffix)

**Symptom (Jira):** "VoiceOver says 'not selected' for delivery chips", "Chip accessibility label includes state text instead of trait", "Delivery instruction chip selection announced incorrectly", "Screen reader reads 'not selected, button' instead of using selected trait".

---

## ✅ The Fix Pattern

### `Chip.swift` — use `[.button, .selected]` trait, clear state from label

```swift
// Chip.swift

private func setupAccessibility() {
    // ✅ Label is the chip title only — no state words appended
    accessibilityLabel = text

    // ✅ .selected trait communicates selection state
    //    VoiceOver: "[label], selected, button" when selected
    //    VoiceOver: "[label], button" when not selected
    accessibilityTraits = isSelected ? [.button, .selected] : .button
}
```

Before fix:
```swift
// ❌ Embeds "selected" / "not selected" as text in the label
let selectedText = isSelected ? Text.selected : Text.notSelected
accessibilityLabel = (text ?? "") + ", " + selectedText
```

---

### `SelectableChipsView` — set `isAccessibilityElement` and `accessibilityTraits` when creating chips

```swift
// SelectableChipsView.swift

private func addChips(for model: Model) {
    model.items.forEach { item in
        let chip = WCPChip()
        chip.model = item.chipModel

        // ✅ Explicit label from chip title
        chip.accessibilityLabel = item.chipTitle
        // ✅ Required: WCPChip default may not expose itself to VoiceOver
        chip.isAccessibilityElement = true

        chip.wcpDelegate = self
        // ... layout ...
    }
}

private func updateSelection(for model: Model) {
    // ... update chip selection state ...
    model.items.forEach { item in
        let selected = (item == model.selectedItem)
        chip.isSelected = selected

        // ✅ Toggle .selected trait to reflect current selection state
        chip.accessibilityTraits = selected ? [.button, .selected] : .button
    }
}
```

---

### ❌ Bad Code — state in label, no explicit element flag

```swift
// ❌ Chip.swift before fix:
private func setupAccessibility() {
    let selectedText = isSelected ? Text.selected : Text.notSelected
    accessibilityLabel = (text ?? "") + ", " + selectedText
    // ← "Leave at my door, selected" — state embedded in name
    // ← No accessibilityTraits set → no ".button" role announced (relying on default)
}

// ❌ SelectableChipsView.swift before fix:
let chip = WCPChip()
chip.model = item.chipModel
// ← No accessibilityLabel
// ← No isAccessibilityElement = true
// ← No accessibilityTraits
chip.wcpDelegate = self
```

---

### VoiceOver announcement comparison

```
// Chip: "Leave at my door" — selected

Before fix:
  VoiceOver: "Leave at my door, selected, button"
                                ^^^^^^^^
                                embedded in accessibilityLabel string

After fix:
  VoiceOver: "Leave at my door, selected, button"
                                ^^^^^^^^ ^^^^^^^
                                from .selected  from .button trait

(Same final announcement, but state now comes from trait — correct semantic layer)

// Chip: "Front door" — not selected

Before fix:
  VoiceOver: "Front door, not selected, button"
                          ^^^^^^^^^^^^
                          "not selected" string adds noise for unselected state

After fix:
  VoiceOver: "Front door, button"
  (VoiceOver omits state when .selected is absent — cleaner for unselected elements)
```

---

### The state layers in UIAccessibility

| Property | What it communicates | VoiceOver announces |
|---|---|---|
| `accessibilityLabel` | The element's **name** | Always read first |
| `accessibilityValue` | The element's current **value** | After label |
| `accessibilityTraits` | The element's **role and state** | After value |
| `.selected` in `accessibilityTraits` | Selected state | "selected" (when present) |
| `.button` in `accessibilityTraits` | Interactive role | "button" |

Embedding "selected" or "not selected" in `accessibilityLabel` puts state information in the name layer. This:
- Prevents the state from being toggled independently (must rebuild the entire label string)
- Makes the label non-translatable without understanding the state logic
- Creates "not selected, button" noise for every unselected option (`.selected` being absent is the natural "not selected" — no announcement needed)

---

### When to use each state approach

| Scenario | Approach |
|---|---|
| Toggle/checkbox-like state | `[.button, .selected]` or `[.button]` |
| Numeric value (e.g., quantity) | `accessibilityValue = "3"` |
| Custom state descriptor | `accessibilityValue = "Available until 10pm"` |
| Never appropriate | Hardcoding "selected"/"not selected" in `accessibilityLabel` |

---

## 🔑 Key Rules

- **Never embed "selected" or "not selected" in `accessibilityLabel`** — use `accessibilityTraits` with `.selected` for selection state. VoiceOver announces "selected" when the trait is present and nothing for its absence (which is the correct "not selected" behaviour).
- **Set `accessibilityTraits` every time selection state changes** — if `isSelected` is updated via `updateSelection()`, the traits must be updated in the same method. Stale traits will announce the wrong state.
- **Explicitly set `isAccessibilityElement = true` on custom components** — `WCPChip` and similar custom components may not be VoiceOver-accessible by default. Never rely on implicit detection when creating chips programmatically.
- **`accessibilityLabel = text` — not `text + state`** — the label should be the stable, locale-independent name of the element. State changes should never mutate the label.
- **Combine `.button` and `.selected` as a set** — `accessibilityTraits = [.button, .selected]` preserves the button role while adding selected state. Setting only `.selected` removes the button role announcement.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** For all user interface components, the name and role can be programmatically determined; states, properties, and values that can be set by the user can be programmatically determined. The `.selected` accessibility trait is the programmatic mechanism for conveying selection state. Embedding state words in `accessibilityLabel` puts value information in the name layer, preventing assistive technologies from programmatically distinguishing the element's name from its current state. VoiceOver announcing "not selected, button" also creates unnecessary verbosity — the `.selected` trait being absent is the implicit "unselected" state.
