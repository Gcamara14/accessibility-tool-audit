# Catalyst Template: Button Role Missing on Custom Tappable View

**Template ID:** `WA11Y-IOS-4.1.2-001`
**Platform:** iOS (UIKit / SwiftUI)
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Component:** Sampling Customer Tax Compliance Screen / Cart V2 Protection Plan
**Source PRs:**
- [#139305](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/139305) | [CEPG-340598](https://jira.walmart.com/browse/CEPG-340598) — Sampling tax compliance card
- [#138162](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/138162) | [CEPG-339158](https://jira.walmart.com/browse/CEPG-339158) — Cart V2 Protection Plan cells
**Ingested:** 2026-04-14

---

## The Problem

Custom UIKit views (`UIView` subclasses, `UIStackView` containers) with `UITapGestureRecognizer` are visually interactive but VoiceOver does not announce them as buttons because `accessibilityTraits` does not include `.button`. Screen reader users cannot discover that these elements are actionable.

**Root cause:** Only `UIButton` and `UIControl` subclasses automatically receive the `.button` trait from UIKit. Any custom `UIView` with a gesture recognizer must explicitly declare its role via `accessibilityTraits`. Without this, VoiceOver treats the view as static text.

This violates WCAG 4.1.2 because the **role** of the interactive component is not programmatically determinable.

Walmart internal policy ID 5150 (`accessibility_trait_for_button`) monitors glass-app for this class of issue. Contact `#opus-support` for questions.

---

## Fix Patterns

### Pattern A: UIView with TapGestureRecognizer — Missing `.button` Trait (CEPG-340598)

**Bad Code:**
```swift
class SamplingTaxProfileViewController: UIViewController {
    // ❌ cardContainerView.isAccessibilityElement not set
    // cardButton is a UIButton overlay — children (title, description, chevron) 
    // all announce separately
    private func setupAccessibility() {
        let combinedText = "\(String.localized(.samplingSectionTitle)). \(String.localized(.samplingSectionSubTitle))"
        cardButton.accessibilityLabel = combinedText
        cardButton.accessibilityTraits = .button
        cardTitleLabel.isAccessibilityElement = false
        cardDescriptionLabel.isAccessibilityElement = false
        chevronImageView.isAccessibilityElement = false
    }
}
```

**Good Code:**
```swift
class SamplingTaxProfileViewController: UIViewController {
    // ✅ cardContainerView is the single accessibility element — cardButton hidden from AT
    private func setupAccessibility() {
        // Make the container the single tappable accessibility element
        cardContainerView.isAccessibilityElement = true
        let combinedText = "\(String.localized(.samplingSectionTitle)). \(String.localized(.samplingSectionSubTitle))"
        cardContainerView.accessibilityLabel = combinedText
        cardContainerView.accessibilityTraits = .button

        // Hide all child elements from accessibility tree
        cardTitleLabel.isAccessibilityElement = false
        cardDescriptionLabel.isAccessibilityElement = false
        chevronImageView.isAccessibilityElement = false
        cardButton.isAccessibilityElement = false        // ✅ overlay button hidden — container handles interaction
        cardHeaderBackgroundView.isAccessibilityElement = false
    }
}
```

---

### Pattern B: SwiftUI Custom View Missing `.isButton` Trait

**Bad Code:**
```swift
SamplingTaxView()
    .onTapGesture { handleTap() }
// VoiceOver: "Accept tax terms" — no role
```

**Good Code:**
```swift
SamplingTaxView()
    .onTapGesture { handleTap() }
    .accessibilityAddTraits(.isButton)
    .accessibilityLabel(Text("Accept tax terms"))
    .accessibilityHint(Text("Confirms your tax compliance agreement"))
    // VoiceOver: "Accept tax terms, button"
```

---

### Pattern C: Composing Traits for Disabled or Selected States

```swift
// UIKit — toggle disabled state while preserving .button role
func updateTraits(isEnabled: Bool, isSelected: Bool) {
    var traits: UIAccessibilityTraits = .button
    if !isEnabled { traits.formUnion(.notEnabled) }
    if isSelected  { traits.formUnion(.selected) }
    accessibilityTraits = traits
}
```

---

### Pattern D: UIStackView Card Container as Tappable Button

```swift
class TaxComplianceCardView: UIStackView {
    override init(frame: CGRect) {
        super.init(frame: frame)
        axis = .horizontal
        isUserInteractionEnabled = true
        addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(handleTap)))
        // Collapse sub-elements into one accessible unit
        isAccessibilityElement = true
        accessibilityTraits = .button
        accessibilityLabel = NSLocalizedString("Tax compliance option", comment: "")
    }
}
```

---

## Var 2: UICollectionViewCell Selectable Option — Composing `.button` + `.selected` Traits (CEPG-339158)

**Context:** Cart V2 Protection Plan tier cells (`UICollectionViewCell` subclasses) visually resemble radio buttons but carry no `.button` trait. VoiceOver reads label only — no role, no selection state.

**Bad Code:**
```swift
// AOSTileView.swift
// ❌ .none trait — VoiceOver does not announce this as interactive
accessibilityTraits = model.isSelected ? .selected : .none
```

**Good Code:**
```swift
// AOSTileView.swift — .button trait always set; .selected added when selected
accessibilityTraits = model.isSelected ? .selected : .button  // ✅ always announced as button

// ChooseProtectionPlanBottomSheet.swift
private func updateTrait(for view: AOSItemSelectionView, using model: AOSItemSelectionView.Model) {
    view.accessibilityTraits = model.isSelected ? .selected : .button  // ✅ same pattern
}
```

**Key Signals:** `UICollectionViewCell` with `isAccessibilityElement = true` but no `accessibilityTraits` override; tappable cells that visually look like radio buttons or chips; VoiceOver reads label without "button" role suffix; Cart / Protection Plans domain (CEPG-).

---

## Why This Works

| Aspect | Before (Bug) | After (Fix) |
|---|---|---|
| VoiceOver announcement | "Accept tax compliance terms" | "Accept tax compliance terms, button" |
| Role communicated | None — feels like static text | `.button` — element is interactive |
| Selection state (Var 2) | Not announced | ".selected" composed when `isSelected` |
| WCAG 4.1.2 compliance | Fails — role not programmatically determinable | Passes — role is explicit and announced |

---

## Key Signals (For Pattern Matching)

- `UITapGestureRecognizer` on a `UIView` subclass with no `accessibilityTraits = .button`
- `UICollectionViewCell` with `isAccessibilityElement = true` but no `accessibilityTraits` override
- SwiftUI `.onTapGesture` on a non-`Button` view with no `.accessibilityAddTraits(.isButton)`
- VoiceOver announces element label only — no "button" suffix
- Visual card-style or chip-style tappable containers implemented as `UIView` (not `UIButton`)

---

## Variations

| Var | Ticket | Screen | Framework | Status |
|---|---|---|---|---|
| Var 1 | CEPG-340598 / PR #139305 | Sampling Customer Tax Compliance | UIKit (`UIView` + gesture) | Ingested |
| Var 2 | CEPG-339158 / PR #138162 | Cart V2 Protection Plan options | UIKit (`UICollectionViewCell`) | Ingested |
| Var 3 | CEPG-283455 / PR #110051 | Unified Delivery ILC — Aisle info button | UIKit (`UIView`, dynamic numeric label) | Ingested |
| Var 4 | CEPG-296539 / PR #116516 | Auto Care Center — Chevron disclosure indicator | UIKit (`UIImageView`/`UIView`, contextual composite label) | Ingested |
| Var 5 | AMENDS-878 | Purchase History — Disclaimer button + bottomsheet focus transition | UIKit (button not in tree + `.layoutChanged` focus return) | Ingested |

---

## Var 3: In-Store Fulfillment Aisle Button — Dynamic Numeric Label (CEPG-283455)

**Context:** On the Item page "How do you want your items" screen (No Intent selected), an "Aisle \<number\>" informational button is rendered as a custom `UIView`. The view is tappable, but `isAccessibilityElement` is not set — VoiceOver skips it entirely. The label must also be dynamic because the aisle number comes from the item data model, not a static string.

**Source:** [CEPG-283455](https://jira.walmart.com/browse/CEPG-283455) / [PR #110051](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/110051) · Unified Delivery / ILC team

**Bad Code:**
```swift
class FulfillmentPickUpAndDropView: BaseView {
    // ❌ locationView has isAccessibilityElement = true set separately
    // but is not included in accessibilityElements array — VoiceOver skips it
    locationView?.isAccessibilityElement = true
    accessibilityElements = [pickUpCentreStackView, dropCentreStackView, deliveryDateInCart]
        .filter { $0.isAccessibilityElement == true }
}
```

**Good Code:**
```swift
class FulfillmentPickUpAndDropView: BaseView {
    // ✅ locationView explicitly included in accessibilityElements array
    let elements = [
        pickUpCentreStackView,
        locationView,           // ✅ aisle/location indicator now reachable via VoiceOver
        dropCentreStackView,
        deliveryDateInCart
    ].compactMap { $0 }
    accessibilityElements = elements
}
```

**Key Signals for Var 3:**
- In-store fulfillment / Unified Delivery / ILC screens with aisle, bin, or location indicators
- Numeric or short-text info badges implemented as `UIView` (not `UIButton`) with no `isAccessibilityElement = true`
- Label derived from a server-side integer or string field — requires `NSLocalizedString` format string for i18n
- VoiceOver skips the element silently — no announcement at all (different from missing-role bugs where the label IS announced)

---

## Var 4: Auto Care Center Chevron Disclosure Button — Contextual Composite Label (CEPG-296539)

**Context:** On the Auto Care Center page (Services), a Chevron `>` button sits alongside "Your service is on hold" text. The chevron is implemented as a non-`UIButton` view (typically a `UIImageView` with a chevron icon) with no `isAccessibilityElement = true`. VoiceOver skips the element entirely. The fix also requires a **contextual composite label** — because the chevron icon alone has no inherent meaning, the label must combine surrounding context (vehicle name + status) so VoiceOver users understand the button's purpose without needing to have previously read adjacent text.

**Source:** [CEPG-296539](https://jira.walmart.com/browse/CEPG-296539) / [PR #116516](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/116516) · Auto Care Center / Services team

**Bad Code:**
```swift
class ServiceTrackerCafSummaryView: BaseView {
    private lazy var chevronIcon: ODNImageView = {
        let imageView = ODNImageView()
        imageView.image = UIImageView(image: GlassIcon.chevronRight.imageSize16()).image
        // ❌ No accessibility setup — ODNImageView not focusable by default
        return imageView
    }()
}
```

**Good Code — UIKit:**
```swift
class ServiceTrackerCafSummaryView: BaseView {
    private lazy var chevronIcon: ODNImageView = {
        let imageView = ODNImageView()
        imageView.image = UIImageView(image: GlassIcon.chevronRight.imageSize16()).image
        imageView.isAccessibilityElement = true           // ✅ now focusable
        imageView.accessibilityTraits = .button           // ✅ role = button
        return imageView
    }()

    func configure(with summaryView: ServiceSummaryView) {
        // ✅ Contextual composite label: action + vehicle + status
        if let legacyButtonTitle = summaryView.legacyActionButton?.title,
           let vehicleLabelText = serviceVehicleLabel.text,
           let statusLabelText = serviceStatusLabel.text {
            chevronIcon.accessibilityLabel = [
                legacyButtonTitle,
                vehicleLabelText,
                statusLabelText
            ].joined(separator: ". ")
        }
    }
}
```

**Key Signals for Var 4:**
- Chevron `>` / disclosure indicator rendered as `UIImageView` or standalone `UIView` (not `UIButton`) alongside status text
- VoiceOver skips the chevron silently — no announcement; adjacent text labels ARE announced but the button is not
- Composite label pattern required: action verb ("Show details") + vehicle/entity context + current status text
- Auto Care Center / Services domain; also common in appointment cards, subscription status rows, reservation summary rows
- SwiftUI: `Image(systemName: "chevron.right")` inside an `HStack` with no `.accessibilityHidden(true)` on the image — VoiceOver attempts to read the system image name

---

## Var 5: Purchase History Disclaimer Button — Not in Accessibility Tree + Bottomsheet Focus Transition (AMENDS-878)

**Context:** On the iOS Purchase History screen (Order Totals section), a "Disclaimer" button displayed below ads was not configured as an accessibility element. VoiceOver skipped it entirely. The fix also required **focus management** for the legal info bottomsheet: when the button is tapped, VoiceOver focus must move to the bottomsheet; when the sheet is dismissed, focus must return to the Disclaimer button.

**Source:** [AMENDS-878](https://jira.walmart.com/browse/AMENDS-878) · Purchase History / Order Totals team  
**Note:** The commit link originally associated with this ticket (`RT-Integrated-Fulfillment/gif2-deploy-ccm2-config-prod-picking`) points to a backend fulfillment config repo and does not reflect the iOS fix — the iOS change is in `walmart-ios/glass-app`.

**Bad Code:**
```swift
class DisclaimerButtonView: UIView {
    // ❌ isAccessibilityElement not set — VoiceOver skips this button entirely
    // ❌ No accessibilityLabel, no accessibilityTraits
    // ❌ No focus management when bottomsheet is presented/dismissed
}
```

**Good Code — UIKit (primary fix):**
```swift
class DisclaimerButtonView: UIView {

    override init(frame: CGRect) {
        super.init(frame: frame)
        // ✅ Expose to VoiceOver
        isAccessibilityElement = true
        accessibilityTraits = .button
        accessibilityLabel = NSLocalizedString(
            "Disclaimer",
            comment: "Button to view legal disclaimer for ads in Order Totals"
        )
        // VoiceOver: "Disclaimer, button" ✅
    }
}
```

**Good Code — Focus management for the legal info bottomsheet:**
```swift
// When the Disclaimer button is tapped and the bottomsheet is presented:
func presentLegalInfoBottomSheet() {
    let sheet = LegalInfoBottomSheetViewController()
    present(sheet, animated: true) {
        // ✅ Move VoiceOver focus to the first element in the sheet
        UIAccessibility.post(
            notification: .screenChanged,
            argument: sheet.titleLabel  // or the first focusable element in the sheet
        )
    }
}

// When the bottomsheet is dismissed:
func bottomSheetDidDismiss() {
    // ✅ Return VoiceOver focus to the Disclaimer button
    UIAccessibility.post(
        notification: .screenChanged,
        argument: disclaimerButtonView
    )
}
```

> **Note:** Use `.screenChanged` (not `.layoutChanged`) when a full bottomsheet modal is presented or dismissed — it resets the reading cursor to the specified element, matching the level of UI change.

**Good Code — SwiftUI:**
```swift
struct DisclaimerButton: View {
    @State private var showLegalInfo = false

    var body: some View {
        Button(action: { showLegalInfo = true }) {
            Text("Disclaimer")
        }
        // ✅ UIButton in SwiftUI is already an accessible element with .button trait
        // accessibilityLabel defaults to button title — no extra annotation needed
        .sheet(isPresented: $showLegalInfo) {
            LegalInfoView()
            // SwiftUI sheet automatically moves VoiceOver focus to sheet content
            // and returns focus on dismiss ✅
        }
    }
}
```

**Key Signals for Var 5:**
- Legal/disclaimer/ad attribution buttons in Order Totals, checkout, or cart screens that are implemented as `UIView` (not `UIButton`) with no `isAccessibilityElement = true`
- VoiceOver skips the element silently; adjacent ad content or pricing rows ARE announced
- Bottomsheet or modal is presented on tap — check for missing `UIAccessibility.post(.screenChanged, ...)` both on presentation and dismissal
- SwiftUI `Button` with `sheet(isPresented:)` handles focus automatically — only needs annotation if using a custom gesture or non-`Button` view

---

## Related Templates

- `WA11Y-IOS-4.1.2-002` — iOS: Missing accessible name (icon-only buttons)
- `WA11Y-IOS-4.1.2-003` — iOS: Expanded/collapsed state not communicated
- `WA11Y-IOS-1.1.1-001` — iOS: Missing `accessibilityLabel` on informative image
- `WA11Y-IOS-2.4.3-001` — iOS: VoiceOver focus management after collection view updates
- `WA11Y-WEB-4.1.2-004` — Web: Wrong role / missing `role="button"`
