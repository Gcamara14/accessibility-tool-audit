# Catalyst Template: Alt Text: Missing Alt Text (Generic)

**Template ID:** `WA11Y-IOS-1.1.1-001`
**Platform:** iOS
**WCAG Criterion:** 1.1.1 Non-text Content

---

## 🛑 The Problem
An informative image is missing an `accessibilityLabel`, rendering it invisible or confusing to iOS VoiceOver users.

---

## ✅ The Fix Patterns

### Scenario: SwiftUI
**❌ Bad Code:**
```swift
// Fails: Image has no accessible name
Image("shopping-cart-icon")
```

**✅ Good Code:**
```swift
// Fix: Added accessibilityLabel modifier
Image("shopping-cart-icon")
    .accessibilityLabel(Text("Shopping Cart"))
```

### Scenario: UIKit
**❌ Bad Code:**
```swift
let imageView = UIImageView(image: UIImage(named: "shopping-cart-icon"))
// Fails: isAccessibilityElement is true by default for some images, but no label is set
```

**✅ Good Code:**
```swift
let imageView = UIImageView(image: UIImage(named: "shopping-cart-icon"))
imageView.isAccessibilityElement = true
imageView.accessibilityLabel = "Shopping Cart"
```

---

## Walmart-Specific Variations (Ingested from glass-app PRs)

### Var 1: UIKit — Promotional Image Label Correction + Button State via `accessibilityValue` (CEPG-343560)

**Context:** OnePay Later section in Wallet (Other Ways to Pay) — `oneLoansImageView` had an outdated localization key for its accessibility label, and `oneLoansApplyNowButton` had a custom `accessibilityLabel` overriding the button's own visible text. The disabled state was surfaced via `accessibilityHint` only, giving no enabled-state feedback.

**File: `OtherWaysToPayElementView.swift`**

**Bad Code:**
```swift
// ❌ Stale label key — doesn't match the actual displayed image
oneLoansImageView.accessibilityLabel = LocalizableString.otherWaysToPayOnePayLoansLogoAccessibilityLabel.value

// ❌ Overrides button's visible text with a different string
oneLoansApplyNowButton.accessibilityLabel = LocalizableString.otherWaysToPayOnePayLoansApplyNowButtonAccessibilityText.value

// ❌ Only sets hint for disabled; no enabled state signal
oneLoansApplyNowButton.accessibilityHint = oneLoansApplyNowButton.isEnabled ?
    nil : LocalizableString.otherWaysToPayOneLoansApplyNowButtonDisabled.value
```

**Good Code:**
```swift
// ✅ Updated label key — matches current image content
oneLoansImageView.accessibilityLabel = LocalizableString.accessibilityOnePayLaterPoweredByKlarna.value

// ✅ accessibilityLabel removed — VoiceOver reads the button's own title text directly
// (no custom override needed when button title is already descriptive)

// ✅ accessibilityValue signals enabled state; accessibilityHint signals disabled state
oneLoansApplyNowButton.accessibilityValue = oneLoansApplyNowButton.isEnabled ?
    LocalizableString.accessibilityOnePayLaterEnabled.value : nil
oneLoansApplyNowButton.accessibilityHint = oneLoansApplyNowButton.isEnabled ?
    nil : LocalizableString.accessibilityOnePayLaterDisabled.value
```

**New localization keys** (added in `PaymentsUI_LocalizableString.swift`):
- `accessibilityOnePayLaterPoweredByKlarna` — updated image label ("Powered by Klarna")
- `accessibilityOnePayLaterEnabled` → `"enabled"` — `accessibilityValue` when button is enabled
- `accessibilityOnePayLaterDisabled` → `"disabled"` — `accessibilityHint` when button is disabled

**Why This Works:** Removing the custom `accessibilityLabel` override on the button lets VoiceOver read the actual button title — the source of truth. `accessibilityValue = "enabled"` gives the enabled state signal that was previously absent. `accessibilityHint = "disabled"` preserved for disabled state.

**Key Signals:** Custom `accessibilityLabel` on a `UIButton` that duplicates or conflicts with the visible button title; disabled state signaled only via `accessibilityHint` with no enabled counterpart; stale localization key on a promotional image.

---

### Var 2: UIKit — Error Icon in Address Row Must Be Announced (CRUISE-16235)

**Context:** Walmart+ subscription address selection rows — the row displays an error icon (red triangle) alongside address text when an address is invalid. VoiceOver announced only the address text and never mentioned the error state because the icon image was not an accessibility element and no label described it.

**Files:** `Plugins/Subscription/Subscription/Sources/ManageSubscriptionV2/Views/ViewSubscriptions/AddressSelectionOptionView.swift`
**Source PRs:** [#137727](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/137727) (initial fix) · [#138883](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/138883) (follow-up)

**Bad Code (Commit 1 baseline):**
```swift
// addressString returned plain NSAttributedString — no error prefix in accessibility string
return NSAttributedString(string: address, attributes: Constants.errorAttributes)
// VoiceOver: just reads address text; error icon is never mentioned
```

**Good Code — Step 1 (PR #137727): `LabelTexts` wrapper + "Error, " prefix**
```swift
// New LabelTexts struct carries both visual text and accessibility string
struct LabelTexts {
    let attributedText: NSAttributedString
    let accessibilityLabel: String?
}

// addressString now returns LabelTexts with error prefix
let accessibilityString = "\(String.localized(.error)), \(address)"
return LabelTexts(attributedText: attributedText, accessibilityLabel: accessibilityString)
// VoiceOver: "Error, 1234 Main St, Springfield" ✅
```

**Good Code — Step 2 (PR #138883): Collapse to single composite element**
```swift
// BEFORE (after step 1): separate accessibilityElements array
isAccessibilityElement = false
accessibilityElements = [radioButton, addressLabel, deliveryDateLabel].compactMap { $0 }

// AFTER: container is the sole accessibility element — composed label
private func setupAccessibility(_ model: Model) {
    radioButton.isAccessibilityElement = false
    addressLabel.isAccessibilityElement = false
    deliveryDateLabel.isAccessibilityElement = false
    isAccessibilityElement = true
    accessibilityTraits = model.isSelected ? [.button, .selected] : [.button]
    var addressAccessibilityText: String?
    if let accessibilityText = model.addressString.accessibilityLabel {
        addressAccessibilityText = accessibilityText   // e.g. "Error, 1234 Main St"
    } else {
        addressAccessibilityText = model.addressString.attributedText.string
    }
    accessibilityLabel = [
        addressAccessibilityText ?? "",
        deliveryDateLabel.text ?? ""
    ].joined(separator: ", ")
}
// VoiceOver: "Error, 1234 Main St, Delivery by Thursday" (selected), button ✅
```

**Why This Works:** Prepending `String.localized(.error)` to the accessibility string ensures VoiceOver announces the error state. Collapsing children into a single composite button element prevents VoiceOver from navigating to radio button, address label, and delivery label separately.

**Key Signals:** Error icon (UIImageView with no accessibility label) adjacent to a text label; split accessibility elements array including both interactive (radio) and informational (address) elements; address/checkout rows in Subscriptions/CRUISE project.

---

### Var 3: UIKit — Payment Info Label Not Exposed to VoiceOver (CRUISE-16210)

**Context:** "My Subscriptions" header in Wallet+ — `paymentInfoLabel` (displays the linked payment card info, e.g. "Visa ending in 1111") was not exposed to VoiceOver. Users heard the header section title but the payment card text was completely silent.

**File:** `Plugins/Subscription/Subscription/Sources/ManageSubscriptionV2/Views/MySubscriptions/Header/MySubscriptionsV2HeaderView.swift`

**Bad Code:**
```swift
// Inside setupAccessibility() — paymentInfoLabel has no accessibility configuration
private func setupAccessibility() {
    // ... other elements configured ...
    // ❌ paymentInfoLabel not configured — UILabel is not accessible by default in some hierarchy configurations
}
```

**Good Code:**
```swift
private func setupAccessibility() {
    // ... other elements configured ...
    // ✅ Expose payment info label explicitly
    paymentInfoLabel.isAccessibilityElement = true
    paymentInfoLabel.accessibilityTraits = .staticText
    // VoiceOver reads paymentInfoLabel.text directly — no custom accessibilityLabel needed
}
```

**Why This Works:** In a custom view hierarchy where the parent container manages accessibility, child `UILabel`s may not be surfaced automatically. Explicitly setting `isAccessibilityElement = true` + `.staticText` trait ensures VoiceOver discovers and announces the payment card text.

**Key Signals:** `UILabel` child inside a custom `UIView` that is otherwise managing its own `accessibilityElements`; payment card / subscription header rows in CRUISE project; VoiceOver skips a label entirely even though it has text.

---

## Variations Summary

| Var | Ticket | Screen | Framework | Root Cause | Status |
|---|---|---|---|---|---|
| (Generic) | — | Shopping cart icon (generic) | SwiftUI + UIKit | Template skeleton | — |
| Var 1 | CEPG-343560 / PR #142350 | OnePay Later — Other Ways to Pay | UIKit (`OtherWaysToPayElementView`) | Stale image label key; button label override; missing enabled state | Ingested |
| Var 2 | CRUISE-16235 / PR #137727 + #138883 | Walmart+ Address Selection | UIKit (`AddressSelectionOptionView`) | Error icon not announced; no "Error, " prefix in accessibility label | Ingested |
| Var 3 | CRUISE-16210 / PR #137732 | My Subscriptions header | UIKit (`MySubscriptionsV2HeaderView`) | `paymentInfoLabel` not exposed — missing `isAccessibilityElement = true` | Ingested |
