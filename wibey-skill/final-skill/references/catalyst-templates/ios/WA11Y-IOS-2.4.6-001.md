# Catalyst Template: Interactive Control Label Missing Context — Static Prefix Not Included

**Template ID:** `WA11Y-IOS-2.4.6-001`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 2.4.6 Headings and Labels
**Component:** `FulfillmentPickUpAndDropView` — Delivery Address Button (Item Page)
**Source PR:** [#143672](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/143672) | [CEPG-334701](https://jira.walmart.com/browse/CEPG-334701)
**File:** `Plugins/ItemDetails/ItemDetails/Sources/ItemDetailsViewController/Sections/FulfillmentControl/Views/ZoneTwoViews/FulfillmentPickUpAndDropView.swift`
**Ingested:** 2026-04-24 (real diff from glass-app)

---

## The Problem

A tappable control (link/button) is visually paired with a static context label — they form a single logical unit on screen. But in the accessibility tree, they are two separate elements:

1. **Static label** (non-interactive): "Delivery to"
2. **Button / link** (interactive): "123 Main St"

VoiceOver announces: *"Delivery to"* → pause → *"123 Main St, link"*

A VoiceOver user hearing "123 Main St, link" in isolation cannot determine what this link does. Is it a delivery address? A pickup store? A billing address? The context word "Delivery to" is detached on a separate focus stop before the actionable element. WCAG 2.4.6 requires that labels **describe the topic or purpose** of the control — "123 Main St" alone fails this requirement.

**Why this is 2.4.6, not 4.1.2:**
- **4.1.2** asks: *does the control have a programmatically determinable name?* — Yes, it does: "123 Main St". No 4.1.2 violation.
- **2.4.6** asks: *does the label describe the purpose?* — No. "123 Main St" does not communicate that this is a delivery address selector. The context word ("Delivery to") is missing from the label.

**Secondary issue:** When the context label (`dropCentre`) was also exposed as a separate accessibility element (`isAccessibilityElement = true`), users had to navigate through two stops for a single logical action — violating the principle that related label + control should form one VoiceOver stop.

---

## Fix Patterns

### Pattern A: Real Fix — Compose Context + Value into the Interactive Element's Label (CEPG-334701)

**File:** `FulfillmentPickUpAndDropView.swift` — `updateAccessibilityCCM()`

**Bad Code:**
```swift
// ❌ deliveryCentreButton.accessibilityLabel = only the address
// VoiceOver: "123 Main St, link" — no context; purpose is not described
deliveryCentreButton.isAccessibilityElement = true
deliveryCentreButton.accessibilityTraits = .link
deliveryCentreButton.accessibilityLabel = address  // just the address string

// ❌ dropCentre (the "Delivery to" static label) is ALSO an accessibility element
// VoiceOver: two stops — "Delivery to" then "123 Main St, link"
dropCentre.isAccessibilityElement = true
dropCentre.accessibilityTraits = .staticText
```

**Good Code:**
```swift
// ✅ Compose: static context label + address = descriptive accessible name
// VoiceOver: "Delivery to 123 Main St, link" — purpose fully described
if hasDeliveryIntent {
    dropCentre.isAccessibilityElement = false  // ✅ Suppress static label

    deliveryCentreButton.isAccessibilityElement = true
    deliveryCentreButton.accessibilityTraits = .link
    let deliveryTitle = dropCentre.text ?? ""    // "Delivery to"
    let deliveryAddress = deliveryCentreButton.text ?? ""  // "123 Main St"
    deliveryCentreButton.accessibilityLabel = deliveryTitle + " " + deliveryAddress
    // ✅ VoiceOver: "Delivery to 123 Main St, link" — one stop, full context
}
```

**Test assertions updated:**
```swift
// Before (broken)
XCTAssertEqual(view.testHooks.deliveryCentreButton.accessibilityLabel, "123 Main St")

// After (fixed)
XCTAssertEqual(view.testHooks.deliveryCentreButton.accessibilityLabel, "Delivery to 123 Main St")
```

---

### Pattern B: Missing Space in Composite Label

Also fixed in the same PR — the fallback stack view path concatenated title + address with no separator:

**Bad Code:**
```swift
// ❌ Missing space — reads "Delivery to123 Main St" (words fused)
dropCentreStackView.accessibilityLabel = (dropCentre.text ?? "") + (deliveryCentreButton.text ?? "")
```

**Good Code:**
```swift
// ✅ Space separator — reads "Delivery to 123 Main St"
let deliveryTitle = dropCentre.text ?? ""
let deliveryAddress = deliveryCentreButton.text ?? ""
dropCentreStackView.accessibilityLabel = deliveryTitle + " " + deliveryAddress
```

**Why:** VoiceOver speech synthesis does NOT automatically insert a pause or space between concatenated strings. String concatenation without a separator fuses words, producing unintelligible output.

---

### Pattern C: Static Label + Interactive Control — General Pattern

When a view has a static context label paired with an interactive control:

```swift
// ❌ BAD — two focus stops for one logical unit; interactive stop lacks context
contextLabel.isAccessibilityElement = true      // "Delivery to"
contextLabel.accessibilityTraits = .staticText

actionButton.isAccessibilityElement = true      // "123 Main St, link"
actionButton.accessibilityLabel = dynamicValue  // missing context

// ✅ GOOD — one focus stop; label carries full context + value
contextLabel.isAccessibilityElement = false     // suppressed — merged into button label

actionButton.isAccessibilityElement = true
actionButton.accessibilityLabel = contextLabel.text! + " " + dynamicValue
// VoiceOver: "Delivery to 123 Main St, link" ✅
```

**When NOT to suppress the context label:**
- If the context label has **independent informational value** beyond naming the interactive control (e.g., a section heading that applies to multiple controls below it)
- If the interactive control is a `UISwitch` (the control's own on/off value is announced separately — composing label + state gets complex)
- Use judgement: a static label that exists SOLELY to provide a prefix for one adjacent control should always be merged into that control's label

---

### Pattern D: SwiftUI — `accessibilityLabel` on Button Overrides Auto-Derived Name

```swift
// ❌ SwiftUI VoiceOver derives name from button's child Text("123 Main St") only
Button(action: selectDeliveryAddress) {
    VStack {
        Text("Delivery to")
            .font(.caption)
        Text(deliveryAddress)   // "123 Main St" — VoiceOver reads this alone
            .underline()
    }
}

// ✅ Override: compose label on the button itself
Button(action: selectDeliveryAddress) {
    VStack {
        Text("Delivery to")
            .font(.caption)
            .accessibilityHidden(true)  // suppress — covered by button label
        Text(deliveryAddress)
            .underline()
            .accessibilityHidden(true)  // suppress — covered by button label
    }
}
.accessibilityLabel("Delivery to \(deliveryAddress)")
// VoiceOver: "Delivery to 123 Main St, button" ✅
```

---

## Var 2: Accordion Show/Hide Button — Section Heading Missing from Label (CEPG-336887)

**Context:** Recipes / My Items — `CarouselAccordionView` has a show/hide toggle button that expands or collapses a carousel section. The button text was "Show" or "Hide" (toggling with accordion state). VoiceOver announced "Show, button" or "Hide, button" — with no indication of which section was being shown or hidden.

**File:** `Plugins/MyItems/MyItems/Sources/View/POVCard/CarouselAccordionView.swift`
**Source PR:** [#136412](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/136412) | [CEPG-336887](https://jira.walmart.com/browse/CEPG-336887)

**Bad Code (implicit — no `accessibilityLabel` override):**
```swift
// linkButton.text = "Show" or "Hide" — toggled by linkButtonModel
// No accessibilityLabel set — VoiceOver reads only button text
// VoiceOver: "Show, button" or "Hide, button" — WHAT section?
```

**Good Code — new `updateLinkButtonAccessibility()` method:**
```swift
private func updateLinkButtonAccessibility() {
    let buttonText = linkButtonModel.text ?? ""   // "Show" or "Hide"
    let headingText = model?.heading ?? ""         // e.g. "Recipes", "Saved Items"
    linkButton.accessibilityLabel = "\(buttonText) \(headingText)"
    // VoiceOver: "Show Recipes, button" or "Hide Recipes, button" ✅
}
```

**Called in two places — both required:**
```swift
// 1. On initial model apply — set label for current accordion state
func applyModel(_ model: Model) {
    // ... configure labels, subheading, linkButtonModel ...
    updateLinkButtonAccessibility()  // ✅ Initial label
}

// 2. After each toggle — update label to reflect new state
@objc private func toggleAccordionView() {
    isCollapsed.toggle()
    linkButton.model = linkButtonModel
    expandCollapseContent(shouldCollapse: isCollapsed, with: buttonName)
    updateLinkButtonAccessibility()  // ✅ Updated label after toggle
}
```

**Test (`CarouselAccordionViewTests.swift`):**
```swift
func test_accessibilityLabel_onToggle_showHideButton() throws {
    sut.model = CarouselAccordionView.Model(
        contentView: nil,
        heading: "Title",
        subHeading: "Sub title",
        isAccordionCollapsed: false
    )
    // Initially expanded → button text is "Hide"
    XCTAssertEqual(sut.testHooks.linkButton.accessibilityLabel, "Hide Title")

    sut.testHooks.linkButton.sendActions(for: .touchUpInside)

    // After toggle → collapsed → button text is "Show"
    XCTAssertEqual(sut.testHooks.linkButton.accessibilityLabel, "Show Title")
}
```

**Why This Works:** "Show" and "Hide" are generic action words — they describe the operation but not the target. Appending the section heading ("Recipes", "Title") makes the label self-describing: "Show Recipes" tells the user exactly what will be revealed. Crucially, `updateLinkButtonAccessibility()` is called after EVERY toggle — if it were only called on initial load, the label would become stale after the first toggle (e.g. still reading "Hide Title" when the button now says "Show").

**Key Signals for Var 2:**
- Show/hide, expand/collapse, see-more/see-less toggle buttons whose `accessibilityLabel` is only the action word ("Show", "Hide", "See more") without the section/content name
- Accordion views where the button label updates on toggle but accessibility label doesn't
- `linkButton.model = linkButtonModel` toggling button text without a corresponding `accessibilityLabel` update
- MyItems, Recipes, POVCard, any collapsible carousel section in the Home/MyItems plugins

---

## Why This Works

| Var | Aspect | Before (Broken) | After (Fixed) |
|---|---|---|---|
| Var 1 | VoiceOver announcement | "Delivery to" (stop 1) → "123 Main St, link" (stop 2) | "Delivery to 123 Main St, link" (single stop) |
| Var 1 | Label describes purpose | No — "123 Main St" alone has no delivery context | Yes — "Delivery to 123 Main St" is unambiguous |
| Var 1 | WCAG 2.4.6 compliance | Fails — label does not describe topic/purpose | Passes — label describes both context and value |
| Var 1 | Focus stops for one action | 2 stops (static label + button) | 1 stop (button with full composed label) |
| Var 2 | VoiceOver announcement | "Show, button" / "Hide, button" — no section context | "Show Recipes, button" / "Hide Recipes, button" ✅ |
| Var 2 | Label describes purpose | No — "Show" doesn't identify the target section | Yes — "Show Recipes" names both action and target |
| Var 2 | Label staleness risk | N/A (no label set) | `updateLinkButtonAccessibility()` called after every toggle — label always current |

---

## Key Signals (For Pattern Matching)

- `UILabel` (non-interactive) immediately adjacent to a `UIButton` / `WCPButton` / underlined link — both exposed as separate accessibility elements
- The static label exists solely to name or prefix the adjacent control (e.g., "Delivery to", "Change", "Pickup at", "Sold by")
- VoiceOver announces the control's `accessibilityLabel` using only the dynamic value (address, store name, action word) without the context prefix
- Show/hide, expand/collapse toggle buttons whose label is only the verb ("Show", "Hide") with no noun (section name)
- **Stale label risk on toggle:** `accessibilityLabel` set once on load but not updated on each state change — label and button text diverge after first toggle
- String concatenation in `accessibilityLabel` assignment with no `" "` separator: `(a ?? "") + (b ?? "")`
- Item Page fulfillment section, cart delivery rows, checkout address rows, accordion sections — any `"<verb> <noun>"` or `"<contextWord> <dynamicValue>"` pattern

---

## Variations

| Var | Ticket | Feature | Class | Pattern | Status |
|---|---|---|---|---|---|
| Var 1 (founding) | CEPG-334701 / PR #143672 | Item Page delivery address button | `FulfillmentPickUpAndDropView` | Compose `dropCentre.text + " " + button.text` → `deliveryCentreButton.accessibilityLabel`; suppress `dropCentre` | Ingested 2026-04-24 |
| Var 2 | CEPG-336887 / PR #136412 | Recipes / My Items accordion show/hide toggle | `CarouselAccordionView` | `updateLinkButtonAccessibility()` composing button text + heading; called on load AND every toggle | Ingested 2026-04-24 |

---

## Related Templates

- `WA11Y-IOS-4.1.2-002` — iOS: Missing accessible name on interactive control (name absent vs. name incomplete)
- `WA11Y-IOS-2.4.3-003` — iOS: Same file (`FulfillmentPickUpAndDropView`) — conditional `accessibilityElements` append for delivery date
- `WA11Y-IOS-1.3.1-001` — iOS: Grouping static labels for correct structure representation
- `WA11Y-WEB-2.4.6-001` — Web: `aria-label` on interactive control missing context prefix
