# Catalyst Template: Element Grouping — Split Labels for a Single Semantic Statement

**Template ID:** `WA11Y-IOS-1.3.1-001`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 1.3.1 Info and Relationships
**Component:** Recognized Reviewer Sampling Card (Discovery / Item Page domain)
**Source PR:** [#137811](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/137811) | [GPUGC-23161](https://jira.walmart.com/browse/GPUGC-23161)
**Merged:** 2026-04-14

---

## The Problem

When an iOS view contains multiple `UILabel` instances that together form one semantic statement — for example, a static label `"Free items remaining:"` alongside a dynamic value label `"3 items"` — VoiceOver announces each label as a separate accessibility element. Users must swipe twice to hear the complete phrase and hear them as two disconnected fragments rather than one meaningful sentence.

This violates WCAG 1.3.1 because the structural relationship between the labels (that they constitute a single unit of information) is not programmatically determinable by assistive technology.

**Root cause:** Each `UILabel` is an independent `UIAccessibilityElement` with `isAccessibilityElement = true` by default. Without explicit grouping, UIKit exposes every label individually to the accessibility tree.

---

## The Fix Pattern

Consolidate related labels into a single accessibility element with a unified `accessibilityLabel`. Three patterns apply depending on view structure complexity:

1. **Pattern A — Container `isAccessibilityElement = true`**: Set the parent `UIView` as the single accessibility element with a computed combined `accessibilityLabel`. Child labels become invisible to the accessibility tree.
2. **Pattern B — `shouldGroupAccessibilityChildren = true`**: For `UIStackView` layouts where UIKit can automatically group children under the container as one swipe-stop.
3. **Pattern C — Dynamic Count Label**: The container's `accessibilityLabel` is recomputed whenever the count changes.

---

## Fix Patterns

### Pattern A: Container `isAccessibilityElement = true` (Combine Related Labels)

**Bad Code:**
```swift
let titleLabel = UILabel()
titleLabel.text = "Free items remaining:"

let countLabel = UILabel()
countLabel.text = "3 items"

containerView.addSubview(titleLabel)
containerView.addSubview(countLabel)
// VoiceOver: "Free items remaining:" (stop) "3 items" (stop) — fragmented
```

**Good Code:**
```swift
let titleLabel = UILabel()
titleLabel.text = "Free items remaining:"
titleLabel.isAccessibilityElement = false  // Hidden from accessibility tree

let countLabel = UILabel()
countLabel.text = "3 items"
countLabel.isAccessibilityElement = false  // Hidden from accessibility tree

containerView.addSubview(titleLabel)
containerView.addSubview(countLabel)

containerView.isAccessibilityElement = true
containerView.accessibilityLabel = "\(titleLabel.text ?? "") \(countLabel.text ?? "")"
// VoiceOver: "Free items remaining: 3 items" — one coherent stop
```

---

### Pattern B: `shouldGroupAccessibilityChildren = true` (Group Stack View Navigation)

**Bad Code:**
```swift
let stackView = UIStackView(arrangedSubviews: [titleLabel, countLabel])
// Each arranged subview independently focusable — two VoiceOver stops
```

**Good Code:**
```swift
let stackView = UIStackView(arrangedSubviews: [titleLabel, countLabel])
stackView.isAccessibilityElement = false
stackView.shouldGroupAccessibilityChildren = true
// UIKit auto-combines child labels: "Free items remaining: 3 items" — one stop
```

> **Note:** Use Pattern A over Pattern B when the stack contains interactive elements (buttons, switches). `shouldGroupAccessibilityChildren` on a mixed-content stack can silence interactive children.

---

### Pattern C: Dynamic Count Label — Recompute `accessibilityLabel` on Update (GPUGC-23161)

**Bad Code:**
```swift
class SamplingUserInfoBannerView: BaseView {
    // ❌ Individual labels each announced separately
    descriptionLabel.isAccessibilityElement = true
    descriptionLabel.accessibilityTraits = [.staticText]
    descriptionLabel.accessibilityLabel = (model.description ?? "") + ":"

    remainingCountLabel.isAccessibilityElement = true
    remainingCountLabel.accessibilityTraits = [.staticText]
    remainingCountLabel.accessibilityLabel = String(remainingCount) + .localized(.remainingItems)

    accessibilityElements = [descriptionLabel, remainingCountLabel, messageView]
}
```

**Good Code:**
```swift
class SamplingUserInfoBannerView: BaseView {
    // ✅ Compose description + count into single descriptionStackView element
    descriptionStackView.isAccessibilityElement = true
    descriptionStackView.accessibilityTraits = [.staticText]
    var freeItemsText = (model.description ?? "") + ":"
    if let remainingCount = model.remainingCount {
        freeItemsText += " \(remainingCount)" + .localized(.remainingItems)
    }
    descriptionStackView.accessibilityLabel = freeItemsText

    if let errorMsg = model.errorMsg,
       let linkText = model.errorLinkText,
       let remainingCount = model.remainingCount,
       remainingCount == 0 {
        messageView.isAccessibilityElement = true
        messageView.accessibilityLabel = errorMsg + linkText
        accessibilityElements = [descriptionStackView, messageView]
    } else {
        accessibilityElements = [descriptionStackView]
    }
}
```

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| VoiceOver focus stops | Two separate stops for one semantic statement | One stop — complete sentence announced together |
| Programmatic relationship | Labels structurally independent in accessibility tree | Container expresses relationship via single `accessibilityLabel` |
| Dynamic content | Count changes without refreshing combined label | `accessibilityLabel` recomputed in `didSet` / update path |
| WCAG 1.3.1 compliance | Relationship not determinable by AT | Programmatically determinable — single element, unified label |
| Localization | Each fragment localized independently (RTL risk) | Single localized string handles word order correctly |

---

## Key Signals (For Pattern Matching)

Use this template when you see ANY of these in an iOS codebase:

- Two adjacent `UILabel` instances whose text together forms one sentence (e.g., `"Price:"` + `"$4.97"`, `"Free items remaining:"` + `"3 items"`)
- VoiceOver requires multiple swipes to hear a single visual statement
- `UIStackView` with label/value pair and no `shouldGroupAccessibilityChildren` or container grouping
- Count/quantity labels updated at runtime but parent container `accessibilityLabel` never refreshed
- Accessibility audit finding: "related elements not grouped" or "fragmented announcement"
- Domain: Discovery cards, item pages, sampling banners, cart summaries, pricing rows

---

## Variations

| Var | Ticket | Screen | Description | Status |
|---|---|---|---|---|
| Var 1 | GPUGC-23161 / PR #137811 | Recognized Reviewer sampling card | Dynamic count label not grouped — `isAccessibilityElement = true` on container with computed combined label | Ingested |
| Var 2 | CEPG-330737 / PR #137770 | PHTS Select Plan card | Plan card with interactive button — `accessibilityElements = [summaryContainerView, detailsButton]` | Ingested |
| Var 3 | CEPG-330734 / PR #138640 | PHTS Protection Plans row | `UITableViewCell` override `accessibilityLabel` combining 4 sub-labels | Ingested |
| Var 4 | CEPG-337790 / PR #138247 | Subscriptions "Change Delivery Day" | Delivery address + W+ membership + street address composed into name label's `accessibilityLabel` — multi-field summary string composition | Ingested |

---

## Var 2: UIKit Plan Card — Grouping Multi-Label Plan Details (CEPG-330737)

**Context:** PHTS "Select Plan" card — plan name, price, features, and a "Details" button. Two failure modes: (1) over-fragmentation (all labels independent), (2) over-grouping (`isAccessibilityElement = true` on root silences the "Details" button). Fix: `accessibilityElements = [summaryContainerView, detailsButton]`.

**Bad Code:**
```swift
// SelectAPlanBottomSheetHeadingContainer.swift
// ❌ Stack view treated as single accessibility element — children absorbed
stackView.isAccessibilityElement = true
```

**Good Code:**
```swift
// SelectAPlanBottomSheetHeadingContainer.swift
// ✅ Stack view is a layout container, not an accessibility element — expose children
stackView.isAccessibilityElement = false

// ProtectionPlanHeaderView.swift
// ✅ Heading role on title label — VoiceOver announces as heading
titleLabel.accessibilityTraits = .header
```

**Key Signals:** `UIView` card with 3+ labels and an action button; `isAccessibilityElement = true` on a container that has interactive children; PHTS/Protection Plans/Walmart+ upsell screens.

---

## Var 3: UITableViewCell — Protection Plan Row: Combined `accessibilityLabel` (CEPG-330734)

**Context:** Custom `UITableViewCell` in PHTS Protection Plans with `planNameLabel`, `monthlyPriceLabel`, `coverageDescriptionLabel`, `termLabel` — four independent accessibility stops.

**Bad Code:**
```swift
class AvailableProtectionPlansCardView: BaseView {
    // ❌ Entire heading content stack collapsed into one label — role and granularity lost
    headingContentStackView.isAccessibilityElement = true
    headingContentStackView.accessibilityLabel = model.headingLabel
}
```

**Good Code:**
```swift
class AvailableProtectionPlansCardView: BaseView {
    private func setupAccessibility() {
        // ✅ Each sub-element exposed with correct role
        subHeadingLabel.isAccessibilityElement = true
        subHeadingLabel.accessibilityLabel = LocalizedString.pphSubTitle.localizedString()
        subHeadingLabel.accessibilityTraits = .staticText

        headingLabel.isAccessibilityElement = true
        headingLabel.accessibilityLabel = LocalizedString.pphTitle.localizedString()
        headingLabel.accessibilityTraits = .header  // ✅ announced as heading

        lockView.isAccessibilityElement = true
        lockView.accessibilityLabel = LocalizedString.lockTitle.localizedString()
        lockView.accessibilityTraits = .image
    }
}
```

**Key Signals:** `UITableViewCell` / `UICollectionViewCell` with 3+ sub-labels; no `accessibilityElements` override; VoiceOver reads price separately from plan name; PHTS/Protection Plans domain.

---

## Var 4: Subscriptions "Change Delivery Day" — Multi-Field Delivery Context Composition (CEPG-337790)

**Context:** Subscriptions Management "Change Delivery Day" flow — a summary row composing delivery address (`UILabel`) and Walmart+ membership status into the name label's `accessibilityLabel`. The address label was rendered as a separate `UIView` beneath the name/membership label, but VoiceOver skipped it entirely. Although filed under WCAG 4.1.2 AC ("Accessibility Not Enabled: Element Not Focusable or Recognized by VoiceOver"), the underlying pattern is element grouping (1.3.1): the address view is suppressed from the accessibility tree and its content folded into the container's composed label string.

**Bad Code:**
```swift
// ❌ accessibilityLabel = fullName only — W+ membership hours prefix missing
self.init(
    title: fullName,
    titleAccessibilityLabel: fullName,
    ...
)
```

**Good Code:**
```swift
// ✅ Composed label: "Deliver to [name/address], [W+ label], [address line]"
var addressAccessibilityText = ""
let deliverToADAText = String.localized(.deliveryToADA)
if fullName.isNotEmpty {
    addressAccessibilityText = deliverToADAText + " " + fullName
} else if fullAdrressLine.isNotEmpty {
    addressAccessibilityText = deliverToADAText + " " + fullAdrressLine
}
if !walmartPlusAccessibilityLabel.isEmpty {
    addressAccessibilityText += ", \(walmartPlusAccessibilityLabel)"
}
if fullAdrressLine.isNotEmpty, !(fullName.isEmpty && addressAccessibilityText.contains(fullAdrressLine)) {
    addressAccessibilityText += ", \(fullAdrressLine)"
}
self.init(
    title: fullName,
    titleAccessibilityLabel: addressAccessibilityText,
    ...
)
```

> **i18n Note:** The composed string must use a single `NSLocalizedString` with format arguments (not string concatenation of individually localized fragments) so translators can reorder fields per locale. In RTL locales or languages where the address precedes the name, the translator controls field order within the single format string.

**Key Signals:** Subscriptions / delivery management screens; a `UILabel` rendering an address or secondary context that is visually present but VoiceOver-silent; name + membership tier + postal address that together form one delivery-context summary row; multi-field string composition across 3+ data fields.

---

## Related Templates

- `WA11Y-IOS-1.1.1-001` — iOS: Missing `accessibilityLabel` on informative image
- `WA11Y-IOS-2.4.3-001` — iOS: VoiceOver focus management after dynamic collection view updates
- `WA11Y-IOS-1.4.4-001` — iOS: Dynamic Type / text scaling
- `WA11Y-WEB-1.3.1-001` — Web: Semantic HTML heading relationships
