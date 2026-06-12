# Catalyst Template: Label in Name — Accessible Name Does Not Contain Visible Label Text

**Template ID:** `WA11Y-IOS-2.5.3-001`
**Platform:** iOS (UIKit / SwiftUI)
**WCAG Criterion:** 2.5.3 Label in Name
**Component:** WcpQuantityStepper / UIButton with visible label
**Source PRs:**
- [#154214](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/154214) | [COMM-1813](https://jira.walmart.com/browse/COMM-1813) — WcpQuantityStepper "Add to registry" button missing quantity in accessible name
**Ingested:** 2026-04-14

---

## The Problem

WCAG 2.5.3 requires that if a UI component has a visible text label, the accessible name (i.e. `accessibilityLabel`) must **contain** that visible text. This matters for speech input users (Voice Control on iOS) who activate controls by speaking their visible label — if the `accessibilityLabel` doesn't match what's visible, the spoken command won't activate the control.

**Failure pattern 1 — Completely different accessible name:** Visible label says "Add to registry" but `accessibilityLabel` is set to something like "Add button" or omits the word "registry".

**Failure pattern 2 — Missing visual context in the accessible name:** A `WcpQuantityStepper` displays both a quantity number and an action label (e.g., "3 · Add to registry"), but the `accessibilityLabel` is set to just "Add to registry" — omitting the quantity that appears visually. While "Add to registry" IS contained in the displayed text, the full visible composite label "3 · Add to registry" must be represented. The accessible name should lead with or contain all visible text.

**Failure pattern 3 — Programmatic label overrides visible text with synonyms:** Visible text "Remove" is overridden with `accessibilityLabel = "Delete item"` — semantically related but a different string, so Voice Control users saying "tap Remove" cannot activate it.

**Rule:** `accessibilityLabel` must START WITH or CONTAIN the visible text exactly as displayed. Additional context (hint, state, quantity) may be appended AFTER the visible label text.

---

## Fix Patterns

### Pattern A: WcpQuantityStepper — Accessible Name Includes Quantity + Action (COMM-1813)

**Bad Code:**
```swift
// WcpQuantityStepper configured for "Add to registry" — stepper shows quantity chip
addToRegistryButton.accessibilityLabel = NSLocalizedString(
    "Add to registry",
    comment: "Accessible name for Add to registry button"
)
// ❌ Visible label shows "3  Add to registry" (quantity + action text)
// Accessible name omits the "3" — quantity is visible but not in accessible name
// Voice Control users: saying "tap 3 Add to registry" fails to match
```

**Good Code:**
```swift
var quantity: Int = 1 {
    didSet { updateAccessibilityLabel() }
}

private func updateAccessibilityLabel() {
    // ✅ Include the quantity that appears visually in the stepper chip
    let visibleText = "\(quantity) Add to registry"
    addToRegistryButton.accessibilityLabel = NSLocalizedString(
        visibleText,
        comment: "Accessible name: quantity plus Add to registry action"
    )
}
// VoiceControl: user says "tap 3 Add to registry" → activates correctly ✅
```

---

### Pattern B: UIButton — Accessible Name Must Start with Visible Label

**Bad Code:**
```swift
// Visible button text: "Save for later"
saveButton.setTitle(NSLocalizedString("Save for later", comment: ""), for: .normal)
saveButton.accessibilityLabel = NSLocalizedString(
    "Save this item for later purchase",   // ❌ Starts with "Save this item" not "Save for later"
    comment: ""
)
// Voice Control: "tap Save for later" fails — accessible name mismatch
```

**Good Code:**
```swift
saveButton.setTitle(NSLocalizedString("Save for later", comment: ""), for: .normal)
// ✅ Pattern: visible text + optional descriptive suffix
saveButton.accessibilityLabel = NSLocalizedString(
    "Save for later, \(productName)",   // ✅ Starts with exact visible label
    comment: "Save for later followed by product name for disambiguation"
)
// Voice Control: "tap Save for later" matches ✅
```

---

### Pattern C: Dynamic Label — Quantity/Count State in Visible Text

**Bad Code:**
```swift
// Chip button shows "2 items" visually; accessible label is just "Items in cart"
cartChipButton.titleLabel?.text = "\(itemCount) items"
cartChipButton.accessibilityLabel = NSLocalizedString("Items in cart", comment: "")
// ❌ Visible text "2 items" is not present in accessible name "Items in cart"
```

**Good Code:**
```swift
var itemCount: Int = 0 {
    didSet { updateChipAccessibility() }
}

private func updateChipAccessibility() {
    let visibleTitle = "\(itemCount) item\(itemCount == 1 ? "" : "s")"
    cartChipButton.titleLabel?.text = visibleTitle
    // ✅ Accessible name contains the visible text
    cartChipButton.accessibilityLabel = NSLocalizedString(
        "\(visibleTitle) in cart",  // e.g. "2 items in cart" — contains visible "2 items"
        comment: "Cart chip button accessible name with count"
    )
}
```

---

### Pattern D: SwiftUI — `.accessibilityLabel` Must Contain Button Text

**Bad Code:**
```swift
Button(action: addToRegistry) {
    Label("Add to registry", systemImage: "plus.circle")
}
.accessibilityLabel("Registry add")  // ❌ Does not contain "Add to registry"
```

**Good Code:**
```swift
Button(action: addToRegistry) {
    Label("Add to registry", systemImage: "plus.circle")
}
// ✅ Option A: No override — SwiftUI uses visible label text automatically
// ✅ Option B: Augment with context while preserving visible label
.accessibilityLabel("Add \(quantity) to registry")  // contains "to registry" ✅
// For Voice Control: user says "tap Add to registry" → matches ✅
```

---

### Pattern E: "Remove" / "Delete" Synonym Trap

**Bad Code:**
```swift
// Visible: "Remove" — accessible name uses synonym
removeButton.setTitle("Remove", for: .normal)
removeButton.accessibilityLabel = "Delete item from list"  // ❌ "Remove" ≠ "Delete"
// Voice Control: "tap Remove" fails
```

**Good Code:**
```swift
removeButton.setTitle("Remove", for: .normal)
// ✅ Keep accessible name starting with exact visible text
removeButton.accessibilityLabel = NSLocalizedString(
    "Remove \(productName) from list",  // starts with "Remove" ✅
    comment: ""
)
```

---

## Var 1: WCPQuantityStepper "Add to Registry" — Missing Quantity in Accessible Name and VoiceOver Element (COMM-1813)

**Context:** COMM domain — Consumer Registry. `WCPQuantityStepper` component (`WCPQuantityStepper+Model.swift`, `WCPStepperInnerView.swift`) renders a quantity selector with decrement/increment buttons and a `titleLabel` showing the current quantity. Two failures: (1) When the stepper auto-collapses (quantity > 0), the collapsed button's accessible name was computed without the quantity — so "3 Add to registry" would be announced as just "Add to registry". (2) `titleLabel` (the quantity count) was excluded from `accessibilityElements`, so VoiceOver users could not navigate to the quantity as a separate element.

**Bad Code:**
```swift
// WCPQuantityStepper+Model.swift
// ❌ Auto-collapsed label only has button text + product name, no quantity
if (isEmpty && collapsedStyle != .disabled) || autoCollapsed {
    let buttonAccessibilityLabel = accessibilityModel.collapsedAccessibilityLabel ?? collapsedStyle.text ?? ""
    let accessibilityLabel = "\(buttonAccessibilityLabel) \(accessibilityModel.productName)"  // ❌ no quantity when auto-collapsed
    ...
}

// WCPStepperInnerView.swift
// ❌ titleLabel (quantity label) missing — VoiceOver cannot read the current count separately
case .stepper:
    accessibilityElements = [decrementButton, incrementButton]  // ❌ quantity label missing
```

**Good Code:**
```swift
// WCPQuantityStepper+Model.swift
// ✅ Auto-collapsed state uses quantity-inclusive label
if (isEmpty && collapsedStyle != .disabled) || autoCollapsed {
    let buttonAccessibilityLabel = accessibilityModel.collapsedAccessibilityLabel ?? collapsedStyle.text ?? ""
    let isAutoCollapsed = !isEmpty && autoCollapsed
    let autoCollapsedLabel = autoCollapsedAccessibilityLabel(quantityText: quantityText)
    let accessibilityLabel = isAutoCollapsed
        ? autoCollapsedLabel                          // ✅ e.g. "3 Add to registry"
        : "\(buttonAccessibilityLabel) \(accessibilityModel.productName)"
    ...
}

// ✅ Separate method for auto-collapsed label via localized string
private func autoCollapsedAccessibilityLabel(quantityText: String) -> String {
    LocalizedStrings.stepperCollapsedAccessibilityLabel(
        value: quantityText,
        title: accessibilityModel.productName
    ).value
}

// WCPStepperInnerView.swift
// ✅ titleLabel (shows quantity) included as a separate VoiceOver stop
case .stepper:
    accessibilityElements = [decrementButton, titleLabel, incrementButton]  // ✅ quantity readable
```

**Why This Works:** WCAG 2.5.3 requires the accessible name to contain the visible label. In the auto-collapsed state the stepper displays a quantity number alongside the action text — both together are the visible label. The `autoCollapsedAccessibilityLabel()` method computes the correct quantity-inclusive string via a localized format. Adding `titleLabel` to `accessibilityElements` gives VoiceOver a separate focus stop for the quantity, matching what sighted users see. Voice Control users can say "tap 3 Add to registry" and activate the correct button.

**Key Signals:** `WCPQuantityStepper` auto-collapsed state where accessible name omits the current quantity; `accessibilityElements = [decrementButton, incrementButton]` with `titleLabel` missing; composite stepper where quantity chip is visible but absent from accessible name; COMM / Registry domain; audit finding "Label in Name" or "Voice Control" failure.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Voice Control activation | "tap Add to registry" fails (quantity not in accessible name) | "tap 3 Add to registry" succeeds — quantity included |
| VoiceOver announcement | "Add to registry, button" — quantity silent | "3 Add to registry, button" — full visible context |
| WCAG 2.5.3 compliance | Accessible name missing portion of visible label | Accessible name contains all visible text |
| Dynamic state | `accessibilityLabel` static / never updated | Updated in `configure(with:)` / `didSet` when quantity changes |
| Localization | May use bare string | `NSLocalizedString` with `comment` for translator context |

---

## Key Signals (For Pattern Matching)

- `UIButton.accessibilityLabel` set to a string that does NOT contain `UIButton.titleLabel?.text`
- `WcpQuantityStepper` or similar composite stepper + action button where quantity is visible
- Visible label includes a dynamic number (quantity, count, price) but accessible name uses a static label
- Accessible name uses a synonym for the visible text (e.g., "Delete" for "Remove", "Registry add" for "Add to registry")
- Audit finding: "Label in Name" / "Voice Control" / "accessible name does not match visible text"
- Domains: Registry, Cart, Subscriptions, Product Item Page quantity selectors

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | COMM-1813 / PR #154214 | WCPQuantityStepper "Add to registry" | `autoCollapsedAccessibilityLabel()` + `titleLabel` in `accessibilityElements` | Ingested |

---

## Related Templates

- `WA11Y-WEB-2.5.3-001` — Web: `aria-label` must start with visible text; phantom label on decorative icon
- `WA11Y-IOS-4.1.2-002` — iOS: Missing accessible name on icon-only buttons (no visible label)
- `WA11Y-IOS-4.1.2-001` — iOS: Missing `.button` trait on interactive controls
- `WA11Y-IOS-1.3.1-001` — iOS: Grouping split labels into one accessibility element
