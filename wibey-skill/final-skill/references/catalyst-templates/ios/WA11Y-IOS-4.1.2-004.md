# Catalyst Template: Button Silenced by Over-Grouping — Interactive Child Not Activatable

**Template ID:** `WA11Y-IOS-4.1.2-004`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Confluence Rule:** Accessibility Not Enabled: Element Not Focusable or Recognized by VoiceOver
**Component:** Pharmacy Preference Center — row with UISwitch + "View Authorization" UIButton
**Source PRs:**
- [#43278](https://gecgithub01.walmart.com/walmart-web/walmart/pull/43278) | [PGSPHARM-59761](https://jira.walmart.com/browse/PGSPHARM-59761) — "View Authorization" button read but not operable due to incorrect accessibility grouping
**Ingested:** 2026-04-23

---

## The Problem

When a parent `UIView` has `isAccessibilityElement = true`, iOS hides ALL of its children from the accessibility tree. If those children include interactive controls (a `UIButton`, a `UISwitch`), those controls become completely inaccessible to VoiceOver — they may still appear in the container's `accessibilityLabel` as text, but double-tapping the container does NOT activate them.

**Failure scenario (PGSPHARM-59761):** A Pharmacy Preference Center row contains:
1. A `UILabel` showing the person's name
2. A `UISwitch` for enabling/disabling delivery
3. A `UIButton` labelled "View Authorization"

The developer set `isAccessibilityElement = true` on the row container and composed a combined label:
`"Orange Garden, Switch On, View Authorization"`.

VoiceOver reads this combined string — users hear "View Authorization" — but double-tapping does nothing for the button action. The container has no `accessibilityActivate()` override, so the activation silently fails. The button is **audibly present but entirely inoperable**.

**Why this is distinct from over-grouping for display labels (see `WA11Y-IOS-1.3.1-001`):**
- `WA11Y-IOS-1.3.1-001` covers grouping *static* sub-labels into one VoiceOver stop (correct pattern for display-only content)
- This template covers grouping a container that **also contains interactive controls** — the critical difference is that grouping + interactive children = broken activation

**Root cause:** `isAccessibilityElement = true` on a container is appropriate ONLY when the container's content is purely informational (labels/images). It is NEVER appropriate when any child is an independently interactive element (button, switch, link, stepper).

---

## Fix Patterns

### Pattern A: Use `accessibilityElements` to Preserve Each Interactive Control (PGSPHARM-59761)

**Bad Code:**
```swift
class PreferenceCenterRowView: UIView {
    let nameLabel = UILabel()
    let deliverySwitch = UISwitch()
    let viewAuthButton = UIButton(type: .system)

    private func setupAccessibility() {
        // ❌ Combines all children into one non-activatable element
        isAccessibilityElement = true
        let switchState = deliverySwitch.isOn ? "Switch On" : "Switch Off"
        accessibilityLabel = "\(nameLabel.text ?? ""), \(switchState), View Authorization"
        // VoiceOver: reads combined string — but double-tap does NOT activate viewAuthButton
    }
}
```

**Good Code:**
```swift
class PreferenceCenterRowView: UIView {
    let nameLabel = UILabel()
    let deliverySwitch = UISwitch()
    let viewAuthButton = UIButton(type: .system)

    private func setupAccessibility() {
        // ✅ Container is NOT an accessibility element — managed via accessibilityElements
        isAccessibilityElement = false

        // ✅ Each interactive control gets its own label with person-name context
        deliverySwitch.isAccessibilityElement = true
        deliverySwitch.accessibilityLabel = NSLocalizedString(
            "Enable delivery for \(nameLabel.text ?? "")",
            comment: "Delivery switch for a specific person"
        )
        // UISwitch automatically exposes On/Off value — no accessibilityValue override needed

        viewAuthButton.isAccessibilityElement = true
        viewAuthButton.accessibilityLabel = NSLocalizedString(
            "View Authorization for \(nameLabel.text ?? "")",
            comment: "Button to view prescription authorization"
        )
        viewAuthButton.accessibilityTraits = .button

        // ✅ Suppress static name label — covered by switch and button labels above
        nameLabel.isAccessibilityElement = false

        // ✅ Expose exactly 2 VoiceOver stops: switch, then button
        accessibilityElements = [deliverySwitch, viewAuthButton]
    }
}
// VoiceOver: "Enable delivery for Orange Garden, switch, on" (stop 1)
// VoiceOver: "View Authorization for Orange Garden, button" (stop 2)
```

---

### Pattern B: `accessibilityActivate()` Override — When One Primary Action Exists

If the container has **exactly one** actionable child and a static summary label is the correct VoiceOver presentation, override `accessibilityActivate()`:

```swift
class SingleActionRowView: UIView {
    let summaryLabel = UILabel()   // "Premium plan, $9.99/mo"
    let detailsButton = UIButton() // "View details"

    private func setupAccessibility() {
        // ✅ One combined element with the summary — but activation routes to button
        isAccessibilityElement = true
        accessibilityLabel = summaryLabel.text
        accessibilityTraits = .button

        summaryLabel.isAccessibilityElement = false
        detailsButton.isAccessibilityElement = false  // Container handles activation
    }

    // ✅ Routes double-tap to the button's action
    override func accessibilityActivate() -> Bool {
        detailsButton.sendActions(for: .touchUpInside)
        return true
    }
}
// Use only when there is ONE primary action — never for mixed switch + button rows
```

---

### Pattern C: Mixed Row — Static Group + Separate Interactive Controls

For rows that have both a descriptive summary block AND interactive controls, combine Pattern A with grouping for the static portion:

```swift
class MixedContentRowView: UIView {
    let nameLabel = UILabel()
    let statusLabel = UILabel()        // "Authorized since Jan 2026"
    let deliverySwitch = UISwitch()
    let viewAuthButton = UIButton()

    // ✅ Summary container groups ONLY the static labels
    let summaryContainer = UIView()

    private func setupAccessibility() {
        // Static summary: group name + status into one VoiceOver stop
        summaryContainer.isAccessibilityElement = true
        summaryContainer.accessibilityLabel = "\(nameLabel.text ?? ""). \(statusLabel.text ?? "")"
        summaryContainer.accessibilityTraits = .staticText
        nameLabel.isAccessibilityElement = false
        statusLabel.isAccessibilityElement = false

        // Interactive controls: each exposed independently
        deliverySwitch.accessibilityLabel = "Enable delivery for \(nameLabel.text ?? "")"
        viewAuthButton.accessibilityLabel = "View Authorization for \(nameLabel.text ?? "")"

        // ✅ Container not an accessibility element — managed via accessibilityElements
        isAccessibilityElement = false
        accessibilityElements = [summaryContainer, deliverySwitch, viewAuthButton]
    }
}
// VoiceOver: 3 stops — summary, switch, button — all independently operable
```

---

### Pattern D: SwiftUI — Avoid `.accessibilityElement(children: .combine)` on Mixed Content

```swift
// ❌ BAD: combines switch and button into one non-interactive element
HStack {
    Text(personName)
    Toggle("Enable delivery", isOn: $isEnabled)
    Button("View Authorization") { viewAuth() }
}
.accessibilityElement(children: .combine)
// VoiceOver reads all text together — neither toggle nor button is activatable

// ✅ GOOD: let each interactive control remain independent
HStack {
    Text(personName)
        .accessibilityHidden(true)  // Static label — covered by switch label
    Toggle("Enable delivery for \(personName)", isOn: $isEnabled)
    Button("View Authorization for \(personName)") { viewAuth() }
}
// .accessibilityElement(children: .combine) NOT used — preserves individual control interactions
```

---

## Var 1: Pharmacy Preference Center — "View Authorization" Button Absorbed by Grouped Row (PGSPHARM-59761)

**Context:** Prescription delivery Preference Center (Pharmacy domain). Each row shows a person's name, a delivery-enable switch, and a "View Authorization" tappable label/button. The row container had `isAccessibilityElement = true` with a composite label including all three pieces. VoiceOver announced "Orange Garden, Switch On, View Authorization" as one element — but double-tapping triggered nothing for the button because the container lacked `accessibilityActivate()` and the button was hidden from the accessibility tree.

**Bad Code:**
```swift
// PreferenceCenterCell.swift — before fix
func configure(with person: PersonModel) {
    nameLabel.text = person.name
    deliverySwitch.isOn = person.isDeliveryEnabled

    // ❌ One grouped element — button is absorbed and inoperable
    isAccessibilityElement = true
    let switchState = deliverySwitch.isOn ? "Switch On" : "Switch Off"
    accessibilityLabel = "\(person.name), \(switchState), View Authorization"
    // Double-tap result: nothing — no accessibilityActivate() override
}
```

**Good Code:**
```swift
// PreferenceCenterCell.swift — after fix
func configure(with person: PersonModel) {
    nameLabel.text = person.name
    deliverySwitch.isOn = person.isDeliveryEnabled

    // ✅ Container is not an accessibility element
    isAccessibilityElement = false
    nameLabel.isAccessibilityElement = false

    // ✅ Switch: contextual label with person name + automatic On/Off value from UISwitch
    deliverySwitch.isAccessibilityElement = true
    deliverySwitch.accessibilityLabel = NSLocalizedString(
        "Enable delivery for \(person.name)",
        comment: "Delivery toggle for a named person in Preference Center"
    )

    // ✅ Button: focusable and independently activatable
    viewAuthButton.isAccessibilityElement = true
    viewAuthButton.accessibilityLabel = NSLocalizedString(
        "View Authorization for \(person.name)",
        comment: "View prescription authorization for a named person"
    )
    viewAuthButton.accessibilityTraits = .button

    // ✅ Explicitly ordered: switch first, then action button
    accessibilityElements = [deliverySwitch, viewAuthButton]
}
```

**Why This Works:** Setting `accessibilityElements = [deliverySwitch, viewAuthButton]` on the container causes VoiceOver to expose exactly those two controls as independent accessibility elements. Each has the correct role (`UISwitch` auto-reports `.button` + on/off value; `viewAuthButton` is `.button`). Double-tapping the switch toggles delivery; double-tapping the button opens the authorization screen. The person's name is embedded in each label for context without requiring a separate static-text stop.

**Key Signals:** Row container with `isAccessibilityElement = true` AND child `UISwitch` or `UIButton`; composite `accessibilityLabel` that concatenates visible text from multiple interactive children; VoiceOver announces the combined label but activation does nothing; Pharmacy, Preference Center, delivery/authorization domains.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| VoiceOver activation | Container absorbs button — double-tap triggers nothing | Each control independent — double-tap activates its own action |
| Switch operability | Switch absorbed — cannot be toggled via VoiceOver | `UISwitch` exposed directly — standard swipe-up/down toggle works |
| Button operability | "View Authorization" text readable but inactivatable | `viewAuthButton` exposed as `.button` — double-tap opens auth screen |
| WCAG 4.1.2 compliance | Role and value of switch/button not determinable by AT | Each element has correct role, label, and value |
| Name context | Combined label: "Orange Garden, Switch On, View Authorization" | Per-element: "Enable delivery for Orange Garden" / "View Authorization for Orange Garden" |

---

## Key Signals (For Pattern Matching)

- `isAccessibilityElement = true` on a container that has `UISwitch`, `UIButton`, or `UIControl` children
- `accessibilityLabel` composed by concatenating text from multiple interactive children with commas
- VoiceOver reads a combined string including a button name (e.g., "View Authorization", "Edit", "Remove") but double-tap does nothing
- No `accessibilityActivate()` override on the container
- No `accessibilityElements` array override on the container
- Domains: Pharmacy preference/permission screens; list rows with a toggle + action button; profile/account management

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | PGSPHARM-59761 / PR #43278 | Pharmacy Preference Center delivery row | `accessibilityElements = [switch, button]` — separates switch + View Auth button | Ingested |

---

## Related Templates

- `WA11Y-IOS-1.3.1-001` Var 2 — Plan card over-grouping silencing a "Details" button (`accessibilityElements = [summaryContainer, detailsButton]`)
- `WA11Y-IOS-4.1.2-001` — Button role missing on `UIView` + tap gesture (different: role present here, activation broken)
- `WA11Y-IOS-4.1.2-003` — Expanded/collapsed state via `accessibilityValue`
- `WA11Y-WEB-4.1.2-010` — Web accordion: `aria-expanded` + `aria-controls` triad
