# Catalyst Template: Missing Accessible Name on Interactive iOS Controls

**Template ID:** `WA11Y-IOS-4.1.2-002`
**Platform:** iOS (UIKit + SwiftUI)
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Component:** Subscriptions — `UpcomingDeliveryCardView` — "Navigate to My Items" button
**Source PR:** [#149000](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/149000) | [CEPG-355941](https://jira.walmart.com/browse/CEPG-355941) / [CRUISE-17575](https://jira.walmart.com/browse/CRUISE-17575)
**Ingested:** 2026-04-23 (real diff from glass-app)

---

## The Problem

Two compounding failures made `navigateToMyItemsButton` invisible and unnamed to VoiceOver in `UpcomingDeliveryCardView`:

1. **Missing `accessibilityLabel`** — the button had no label set, so VoiceOver announced "button" with no preceding name
2. **Excluded from manual `accessibilityElements`** — the view manages its own accessibility tree via an explicit `accessibilityElements` array. When this pattern is used, UIKit stops auto-discovering children. `navigateToMyItemsButton` was never appended to the array, making it completely invisible to VoiceOver regardless of label

Either failure alone causes a WCAG 4.1.2 violation. Both together mean the button is completely unreachable via assistive technology.

**Root cause:** When a view uses manual `accessibilityElements` management, *every* interactive child must be explicitly added. A new button added to the view hierarchy is invisible to VoiceOver until it is also added to `accessibilityElements`. This is an easy omission to miss during code review.

**Distinction from WA11Y-IOS-4.1.2-001:** That template covers controls where the *role* is wrong or missing. Here, the role (`button`) IS correct — it is the *name* and *presence in the accessibility tree* that are missing.

---

## Fix Patterns

### Pattern A: Real Fix — Missing `accessibilityLabel` + Missing from `accessibilityElements` (CEPG-355941 / CRUISE-17575)

From PR #149000 — `UpcomingDeliveryCardView.swift` in `Plugins/Subscription/Subscription/Sources/ManageSubscription/Views/MySubscriptions/UpcomingDelivery/`

**Bad Code:**
```swift
// ❌ navigateToMyItemsButton is set up without an accessibilityLabel
navigateToMyItemsButton.addTarget(self, action: #selector(navigateToMyItemsButtonTapped), for: .touchUpInside)
navigateToMyItemsButton.setContentHuggingPriority(.requiredCompliant, for: .horizontal)
navigateToMyItemsButton.translatesAutoresizingMaskIntoConstraints = false
// ❌ No accessibilityLabel — VoiceOver announces only "button"

// ❌ accessibilityElements array built without including navigateToMyItemsButton
// When a view manages accessibilityElements manually, children NOT in the array
// are completely invisible to VoiceOver — the button is unreachable via AT
accessibilityElements?.append(contentsOf: [
    addressLabel,
    deliveryStatusLabel
    // ... navigateToMyItemsButton never added ...
])
```

**Good Code:**
```swift
// ✅ accessibilityLabel added — VoiceOver announces "View more eligible items to subscribe, button"
navigateToMyItemsButton.addTarget(self, action: #selector(navigateToMyItemsButtonTapped), for: .touchUpInside)
navigateToMyItemsButton.setContentHuggingPriority(.requiredCompliant, for: .horizontal)
navigateToMyItemsButton.translatesAutoresizingMaskIntoConstraints = false
navigateToMyItemsButton.accessibilityLabel = .localized(.viewMoreEligibleItemsToSubscribe)

// ✅ Conditionally appended to accessibilityElements when the button is visible
if !navigateToMyItemsButton.isHidden {
    accessibilityElements?.append(navigateToMyItemsButton)
}
accessibilityElements?.append(contentsOf: [
    addressLabel,
    deliveryStatusLabel
])
```

**New localization key** (`LocalizableStrings.swift`):
```swift
/// View more eligible items to subscribe
case viewMoreEligibleItemsToSubscribe
```

---

### Pattern B: UIButton with Image Only — Set `accessibilityLabel` (Generic UIKit)

---

### Pattern B: SwiftUI Button with Image Only

**Bad Code:**
```swift
Button(action: avoidFee) {
    Image("avoid_fee_icon")
}
// VoiceOver: "button" — no name derived from image asset
```

**Good Code:**
```swift
Button(action: avoidFee) {
    Image("avoid_fee_icon")
        .accessibilityHidden(true) // decorative inside an explicitly labeled button
}
.accessibilityLabel("Avoid fee")
// VoiceOver: "Avoid fee, button"
```

---

### Pattern C: Dynamic / Localized Name (Recommended for Production)

```swift
// UIKit
avoidFeeButton.accessibilityLabel = NSLocalizedString(
    "subscription.avoidFee.button.accessibilityLabel",
    comment: "Accessibility label for the Avoid Fee button on the Subscription Management screen"
)

// Optional hint to clarify outcome of tapping
avoidFeeButton.accessibilityHint = NSLocalizedString(
    "subscription.avoidFee.button.accessibilityHint",
    comment: "Tells VoiceOver users what happens when they activate the Avoid Fee button"
)
// VoiceOver: "Avoid fee, button — Navigates to avoid fee options"
```

---

### Pattern D: SF Symbol / System Image Button (UIKit)

```swift
// Bad: SF Symbol button with no label
let infoButton = UIButton(type: .system)
infoButton.setImage(UIImage(systemName: "info.circle"), for: .normal)
// VoiceOver: "info.circle, button" (raw symbol name leaked)

// Good: Explicit label masks the symbol name
infoButton.accessibilityLabel = "Subscription information"
// VoiceOver: "Subscription information, button"
```

---

### Pattern E: Custom UIControl Subclass

```swift
// Bad: Custom control with no accessibilityLabel override
class AvoidFeeControl: UIControl {
    // accessibilityLabel not set — inherits nil
}

// Good: Set in init or configure(with:)
class AvoidFeeControl: UIControl {
    override init(frame: CGRect) {
        super.init(frame: frame)
        accessibilityLabel = NSLocalizedString(
            "subscription.avoidFee.button.accessibilityLabel",
            comment: "Accessibility label for the Avoid Fee control"
        )
    }
}
```

---

---

## Var 2: Raw Identifier String Used as `accessibilityLabel` — Service Invoice Close Button (CEPG-373216)

**Context:** Auto Care Center — Service Invoice PDF viewer (`ServiceInvoicePdfViewController`). The navigation bar close button had `accessibilityLabel = "close_button"` — a raw snake_case internal identifier. VoiceOver reads this aloud as "close underscore button" (or "close button" with unnatural cadence depending on the TTS engine), which is not a human-readable name.

**File:** `Plugins/AutoCareCenter/AutoCareCenter/Sources/VirtualGarage/ServiceInvoice/ServiceInvoicePdfViewController.swift`
**Source PR:** [#157924](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/157924) | [CEPG-373216](https://jira.walmart.com/browse/CEPG-373216)

**Bad Code:**
```swift
private lazy var closeButton: UIBarButtonItem = {
    let closeButton = UIBarButtonItem(
        image: UIImage(systemName: "xmark"),
        style: .plain,
        target: self,
        action: #selector(didTapClose)
    )
    closeButton.accessibilityIdentifier = "close_button"
    closeButton.accessibilityLabel = "close_button"  // ❌ Raw identifier — VoiceOver reads "close underscore button"
    return closeButton
}()
```

**Good Code:**
```swift
private lazy var closeButton: UIBarButtonItem = {
    let closeButton = UIBarButtonItem(
        image: UIImage(systemName: "xmark"),
        style: .plain,
        target: self,
        action: #selector(didTapClose)
    )
    closeButton.accessibilityIdentifier = "close_button"  // ✅ Identifier retained for UI testing
    closeButton.accessibilityLabel = .localized(.closeButtonTitle)  // ✅ Localized display string
    return closeButton
}()
```

**Test added (`ServiceInvoicePdfViewControllerTests.swift`):**
```swift
func testInitView_expressSelfService_setsCloseButtonAccessibilityLabel() {
    // Given
    let expressViewController = ServiceInvoicePdfViewController(
        flow: flow,
        sourceType: .expressSelfService,
        omsOrderId: nil,
        omniDocumentId: "",
        documentType: "POSA"
    )
    // When
    _ = expressViewController.view
    // Then — accessibilityLabel is the localized string, not the raw key
    XCTAssertEqual(
        expressViewController.navigationItem.rightBarButtonItem?.accessibilityLabel,
        .localized(.closeButtonTitle)
    )
}
```

**Why This Works:** `accessibilityIdentifier` is a UI testing hook — it is not announced by VoiceOver and should never be reused as the `accessibilityLabel`. A localized string via `.localized(.closeButtonTitle)` gives VoiceOver the correct human-readable text ("Close") in every locale. The identifier is retained unchanged for automation tests.

**Key Signals for Var 2:**
- `accessibilityLabel` value is snake_case, contains underscores, or looks like a key/identifier (e.g. `"close_button"`, `"nav_back_btn"`, `"confirm_action"`)
- `.accessibilityIdentifier` and `.accessibilityLabel` set to the same raw string
- Navigation bar buttons, toolbar items, or icon-only buttons where the developer copy-pasted the testing identifier into the label field
- `UIBarButtonItem` or `UIButton` on any screen in the AutoCareCenter, Pharmacy, or similar plugins that use `accessibilityIdentifier` for automation

---

## Var 3: Shoppable Image Hotspot Buttons — Label from Model Metadata (CEPG-334781)

**Context:** Home plugin — `InteractiveImageCarouselCell` displays shoppable lifestyle photos with tappable hotspot buttons overlaid on individual products in the image. Each hotspot button used only `GlassCommunityIcon.defaultHotspots.image` (an icon) with no `accessibilityLabel`. VoiceOver announced every hotspot as simply "button" — users couldn't distinguish which product each hotspot referred to.

**File:** `Plugins/Home/Home/Sources/Views/InteractiveImageCarousel/InteractiveImageCarouselCell.swift`
**Source PR:** [#144634](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/144634) | [CEPG-334781](https://jira.walmart.com/browse/CEPG-334781)

**Bad Code:**
```swift
// ❌ Hotspot button added to accessibilityElements with no label
// VoiceOver: "button" — no product name, all hotspots are indistinguishable
accessibilityElements?.append(button)
button.isSelected = false
button.setImage(GlassCommunityIcon.defaultHotspots.image, for: .normal)
button.setImage(GlassCommunityIcon.selectedHotspots.image, for: .selected)
```

**Good Code:**
```swift
// ✅ Label sourced from image-map model metadata — product name from API
accessibilityElements?.append(button)
if let accessibilityLabel = imageMap.configs?.metadataConfigs?.itemImageMapMetaData?.name {
    button.accessibilityLabel = accessibilityLabel  // e.g. "Classic White T-Shirt"
}
button.isSelected = false
button.setImage(GlassCommunityIcon.defaultHotspots.image, for: .normal)
button.setImage(GlassCommunityIcon.selectedHotspots.image, for: .selected)
// VoiceOver: "Classic White T-Shirt, button" ✅
```

**Model path:** `imageMap.configs?.metadataConfigs?.itemImageMapMetaData?.name`
→ `Product.ImageInfo.ImageMaps.ImageMapConfigs.MetadataConfigs.ItemImageMapMetaData.name`

**Test added (`InteractiveImageCarouselCellTests.swift`):**
```swift
func testHotspotButtonAccessibilityLabel() {
    let cell = createCellWithImage()
    let imageMaps = [
        makeImageMap(itemId: "id1", name: "mockItem1"),
        makeImageMap(x: "0.7", y: "0.7", itemId: "id2", name: "mockItem2")
    ]
    cell.setHotspotButton(imageMaps: imageMaps)
    XCTAssertEqual(cell.testHooks.secondaryHotspotButtonArray.first?.accessibilityLabel, "mockItem2")
}
```

**Why This Works:** The product name is available in the image map metadata from the API response. Using optional chaining (`imageMap.configs?.metadataConfigs?.itemImageMapMetaData?.name`) safely extracts the name — if any level is nil, no label is set and VoiceOver falls back to the button's default. This is the correct pattern for API-driven accessibility labels: extract from model, guard with `if let`, assign only when non-nil.

**Key Signals for Var 3:**
- Icon-only overlay buttons (`setImage(_:for:)`, no `setTitle(_:for:)`) on a carousel/shoppable image cell
- Multiple hotspot buttons on the same image with no `accessibilityLabel` — all announced as "button"
- Hotspot/pin/badge buttons whose label should come from model/API data (product name, store name, price label)
- `accessibilityElements?.append(button)` immediately followed by image setup but no label assignment
- Home plugin interactive image carousel, shop-the-look features, shoppable social content

---

## Why This Works

| Var | Aspect | Before (Broken) | After (Fixed) |
|---|---|---|---|
| Var 1 | VoiceOver announcement | "button" — no name | "View more eligible items to subscribe, button" |
| Var 1 | Button visible to VoiceOver | No — not in `accessibilityElements` | Yes — conditionally appended when not hidden |
| Var 1 | WCAG 4.1.2 compliance | Fails — button unreachable AND unnamed | Passes — in accessibility tree with correct name |
| Var 2 | VoiceOver announcement | "close underscore button" (raw key) | "Close, button" (localized string) |
| Var 2 | Label source | `accessibilityIdentifier` string copy-pasted | `.localized(.closeButtonTitle)` — locale-correct |
| Var 2 | `accessibilityIdentifier` | Repurposed as human-readable label | Retained for UI testing; label set independently |
| Var 3 | VoiceOver announcement | "button" — all hotspots identical | "Classic White T-Shirt, button" — product identified |
| Var 3 | Label source | None (icon-only, no text) | `imageMap.configs?.metadataConfigs?.itemImageMapMetaData?.name` |
| Var 3 | Multiple hotspots | Indistinguishable — all "button" | Each uniquely named by product from API metadata |

---

## Key Signals (For Pattern Matching)

Use this template when you see ANY of these in an iOS codebase:

- `accessibilityElements` array managed manually on a view — any new button added to the hierarchy **must** also be explicitly appended to this array, or it is invisible to VoiceOver
- `if !someButton.isHidden` guard missing before `accessibilityElements?.append(someButton)` — hidden buttons must not be in the array or VoiceOver will land on an invisible element
- `UIButton` with no `accessibilityLabel` and no `setTitle(_:for:)` — icon-only or title-less button with no AT name
- `UIButton` uses `setImage(_:for:)` but **no** `setTitle(_:for:)` — icon-only button
- `Image("asset_name")` inside a SwiftUI `Button {}` with no `.accessibilityLabel`
- `UIImage(systemName:)` set on a button with no `accessibilityLabel`
- VoiceOver reports only "button" with no preceding name, or reads out an asset filename
- Custom `UIControl` subclass with no `accessibilityLabel` set in `init` or configure methods
- `.accessibilityIdentifier` set (for UI testing) but `.accessibilityLabel` missing — these are **not** equivalent
- `.accessibilityLabel` value is snake_case / contains underscores / looks like an automation key (e.g. `"close_button"`, `"nav_back_btn"`) — raw identifier copy-pasted into the label field

**Domains where this pattern is common:**
- Subscriptions / Membership management screens (CRUISE-, CEPG- tickets)
- `UpcomingDeliveryCardView` and related upcoming delivery cards
- Cart and checkout action buttons
- Toolbar / navigation bar icon buttons
- Card-based UI where `accessibilityElements` is managed manually

---

## Variations

| Var | Ticket | Screen | Class | Root Cause | Status |
|---|---|---|---|---|---|
| Var 1 (founding) | CEPG-355941 / CRUISE-17575 / PR #149000 | Upcoming Delivery Card — "View more eligible items" button | `UpcomingDeliveryCardView` | Missing `accessibilityLabel` + button not appended to manual `accessibilityElements` | Ingested 2026-04-23 |
| Var 2 | CEPG-373216 / PR #157924 | AutoCare Service Invoice PDF — close button | `ServiceInvoicePdfViewController` | `accessibilityLabel = "close_button"` (raw identifier) instead of `.localized(.closeButtonTitle)` | Ingested 2026-04-23 |
| Var 3 | CEPG-334781 / PR #144634 | Home — Interactive Image Carousel hotspot buttons | `InteractiveImageCarouselCell` | Icon-only hotspot buttons with no `accessibilityLabel` — label sourced from `itemImageMapMetaData?.name` | Ingested 2026-04-24 |

---

## Related Templates

- `WA11Y-IOS-4.1.2-001` — iOS: Wrong or missing *role* on interactive control
- `WA11Y-IOS-1.1.1-001` — iOS: Missing alt text (`accessibilityLabel`) on decorative/informative images
- `WA11Y-IOS-2.4.3-001` — iOS: Focus management after dynamic collection view updates
- `WA11Y-WEB-4.1.2-001` — Web: Missing `aria-label` on icon-only buttons
