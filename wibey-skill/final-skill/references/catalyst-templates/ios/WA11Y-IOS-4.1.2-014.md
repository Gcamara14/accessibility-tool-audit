# Catalyst Template: Name, Role, Value — Hidden Arrow Button in Cell Not Focusable by VoiceOver; `accessibilityElements` Needed for Multi-Element Cells

**Template ID:** `WA11Y-IOS-4.1.2-014`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-014`
**Source Tickets:** CELISTS-31156
**Source PRs:** [glass-app #158428](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/158428)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`AddGenericItemsCell` renders autofill suggestion rows in the Buying List's "Add Items" search. Each row has:
1. A `displayNameLabel` (suggestion text, e.g., "Apple juice") — tapping it activates the suggestion
2. An `arrowButton` (→) — tapping it autofills the suggestion into the search field without activating it

The `arrowButton` had `isAccessibilityElement = false`, making it invisible to VoiceOver. VoiceOver users could tap the suggestion to activate it, but had **no way to autofill it into the search field** — the equivalent of the sighted "tap arrow to paste into search" action was inaccessible.

```swift
// ❌ Before fix:
arrowButton.isAccessibilityElement = false
// → VoiceOver sees only: "Apple juice, button"
// → Arrow button action (autofill) is completely hidden from VoiceOver users
```

Additionally, `displayNameLabel` had `accessibilityTraits = .button` set but the cell had no explicit `accessibilityElements` array — meaning VoiceOver may focus the cell as a single unit OR the label, inconsistently depending on UIKit's accessibility heuristics.

**Symptom (Jira):** "VoiceOver can't reach arrow button in search suggestions", "Autofill action missing for screen reader users on Buying List search", "Arrow button not announced by VoiceOver on Add Generic Items cell", "Screen reader only focuses suggestion name, not the fill-to-search button".

---

## ✅ The Fix Pattern

### Make arrow button accessible with contextual label + explicit `accessibilityElements`

```swift
// AddGenericItemsCell.swift

private func setupAccessibility(displayName: String) {
    // ✅ Label and suggestion name as primary focus target
    displayNameLabel.accessibilityTraits = .button
    displayNameLabel.accessibilityLabel = displayName

    // ✅ Arrow button made accessible with action-specific label
    arrowButton.isAccessibilityElement = true
    arrowButton.accessibilityTraits = .button
    arrowButton.accessibilityLabel = .localized(
        .addGenericItemsArrowButtonAccessibilityLabel(itemName: displayName)
    )
    // → "Add Apple juice to search field"

    // ✅ Explicitly define VoiceOver focus order within the cell
    //    Without this, UIKit may focus the cell as a single unit OR
    //    just the label, missing the arrow button entirely.
    accessibilityElements = [displayNameLabel, arrowButton]
}
```

---

### String resource

```swift
// LocalizedString.swift
enum LocalizedString {
    /// Add {itemName} to search field
    case addGenericItemsArrowButtonAccessibilityLabel(itemName: String)
}

// Localizable.strings
"addGenericItemsArrowButtonAccessibilityLabel" = "Add {itemName} to search field";
// → "Add Apple juice to search field"
```

---

### ❌ Bad Code — arrow button hidden from VoiceOver

```swift
// ❌ Before fix:
private func setupAccessibility(displayName: String) {
    // Previously: jira CELISTS-19345 decided the cell should announce as:
    // "Apple juice, button"
    arrowButton.isAccessibilityElement = false  // ← arrow hidden from VoiceOver
    displayNameLabel.accessibilityTraits = .button
    displayNameLabel.accessibilityLabel = displayName
    // ← No accessibilityElements → VoiceOver may or may not find displayNameLabel
    // ← Arrow button's action (autofill without activating) is inaccessible
}
```

---

### VoiceOver traversal after fix

```
Before fix:
  Swipe → "Apple juice, button"   ← single focus stop (label only)
           (no way to reach arrow button action)

After fix:
  Swipe → "Apple juice, button"             ← suggestion name, tap to activate
  Swipe → "Add Apple juice to search field, button"  ← arrow, tap to autofill
```

---

### Why `accessibilityElements = [displayNameLabel, arrowButton]` is required

Setting `isAccessibilityElement = true` on both `displayNameLabel` and `arrowButton` is not sufficient. The cell (`UITableViewCell`) may claim both as its accessible children but still present itself as a single focus node if UIKit's accessibility heuristic decides the cell should be a leaf node.

Explicitly assigning `accessibilityElements` to the cell overrides UIKit's heuristic:
- `accessibilityElements` is non-nil → UIKit uses this array as the complete focus list for this subtree
- Both `displayNameLabel` and `arrowButton` appear as independent focus stops
- The order of elements in the array defines the VoiceOver traversal order

```swift
// accessibilityElements on a UITableViewCell
accessibilityElements = [displayNameLabel, arrowButton]
// → VoiceOver: "Apple juice, button" then "Add Apple juice to search field, button"
// → Each element is a separate swipe stop

// Without accessibilityElements
// → VoiceOver may treat the cell as a single element ("Apple juice, button")
//    and never traverse to arrowButton even when it has isAccessibilityElement = true
```

---

### Descriptive labels for icon-only buttons

The `arrowButton` is an icon-only button (→ chevron icon, no visible label). Icon-only buttons are silent to VoiceOver without an explicit `accessibilityLabel`. The label must describe what the button **does** in context:

```swift
// ❌ Too generic
arrowButton.accessibilityLabel = "Arrow"      // what does it do?
arrowButton.accessibilityLabel = "Fill"       // fill what?
arrowButton.accessibilityLabel = "→"          // symbol, meaningless

// ✅ Action + context
arrowButton.accessibilityLabel = "Add Apple juice to search field"
//                                ^^^                 ^^^^^^^^^^^^
//                                action              what it fills into
```

The string resource template `"Add {itemName} to search field"` ensures every arrow button in every suggestion row produces a unique, actionable label.

---

### When `accessibilityElements` is needed vs optional

| Scenario | `accessibilityElements` needed? |
|---|---|
| Single accessible element in cell | Optional — UIKit usually finds it |
| Multiple elements that must be individually focusable | **Required** |
| Icon-only button that must be hidden | Set `isAccessibilityElement = false` (not in `accessibilityElements`) |
| Custom traversal order | **Required** — determines order |
| Cell is a single interactive unit | Set on the cell itself; `accessibilityElements` not needed |

---

## 🔑 Key Rules

- **Never set `isAccessibilityElement = false` on an interactive button** — if a button has a visible action that sighted users can perform (e.g., arrow to autofill), VoiceOver users must be able to perform the same action. `isAccessibilityElement = false` removes the action entirely.
- **Set `accessibilityElements` when a cell has multiple independently-accessible elements** — without an explicit `accessibilityElements` array, UIKit may collapse the cell into a single focus node, hiding individual child elements from VoiceOver.
- **Give icon-only buttons a descriptive `accessibilityLabel` that includes context** — "Add {itemName} to search field" is preferable to "Arrow" or "Insert" because it describes the exact action and what is being operated on.
- **Include the item name in the arrow button's label** — the label must match the suggestion it acts on. "Add Apple juice to search field" is distinguishable from "Add Almond milk to search field" when multiple suggestions appear in the list.
- **Mirror the `displayName` in both elements' labels** — the suggestion label reads `displayName` and the arrow button reads "Add {displayName} to search field". Both use the same name, creating consistent identity for the VoiceOver user: "this arrow acts on the Apple juice I just heard".

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name and role of user interface components must be programmatically determinable. An interactive button with `isAccessibilityElement = false` has no programmatically determinable name or role — it is invisible to all assistive technologies. VoiceOver users cannot determine the button exists, cannot activate it, and have no accessible alternative to the autofill action it provides. Setting `isAccessibilityElement = false` on an interactive control is a complete 4.1.2 failure for that control.
