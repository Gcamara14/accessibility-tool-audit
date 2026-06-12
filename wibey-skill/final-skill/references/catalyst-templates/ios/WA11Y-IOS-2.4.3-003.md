# Catalyst Template: Async-Injected Badge Disrupts VoiceOver Reading Order in Fulfillment Container

**Template ID:** `WA11Y-IOS-2.4.3-003`
**Platform:** iOS (UIKit / SwiftUI)
**WCAG Criterion:** 2.4.3 Focus Order
**Component:** `FulfillmentPickUpAndDropView` (Item Page — Delivery Fulfillment Section)
**Source PR:** [#142832](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/142832) | [OAMD-8344](https://jira.walmart.com/browse/OAMD-8344) | File: `FulfillmentPickUpAndDropView.swift`
**Merged:** glass-app

---

## The Problem

On the iOS Item page, the delivery fulfillment section contains two elements:

1. Delivery address line: "Delivery to 645 Minnesota Ave"
2. Fast delivery badge: "Express delivery as soon as 37 mins"

The badge view is populated by an async network call ("Fast Badging Phase 2") and inserted into the fulfillment container **after** the address view is already laid out. Visually the badge appears **above** the address line, but because it is appended to the view hierarchy later, VoiceOver traverses it in **insertion order** — badge first, address second — which is the reverse of the expected logical reading order.

**Actual VoiceOver order (broken):**
1. "Express delivery as soon as 37 mins" ← announced FIRST (wrong)
2. "Delivery to 645 Minnesota Ave" ← announced SECOND (wrong)

**Expected VoiceOver order:**
1. "Delivery to 645 Minnesota Ave" ← address FIRST
2. "Express delivery as soon as 37 mins" ← badge SECOND

**Root cause:** VoiceOver uses view insertion order (not visual/logical layout order) to determine traversal when no explicit `accessibilityElements` array is defined on the container. The badge is appended via a separate async network callback; because it is added after the address, but positioned visually above it, the insertion order and the visual order conflict. Without `accessibilityElements`, VoiceOver follows insertion order and announces the badge first.

---

## How This Differs From Related 2.4.3 Templates

| Template | Scenario | Root Cause |
|---|---|---|
| `WA11Y-IOS-2.4.3-001` | Collection view cells destroyed and recreated via `reloadData()` | Cell identity reset; VoiceOver focus lost entirely |
| `WA11Y-IOS-2.4.3-002` | Single nudge view updated in-place; accessibility tree cache goes stale | No `layoutChanged` posted; cached tree silently drops elements |
| **`WA11Y-IOS-2.4.3-003` (this)** | Multiple sibling views added at different times to a container; insertion order != logical order | No `accessibilityElements` defined; iOS falls back to insertion order |

---

## The Fix Pattern

1. Define an explicit `accessibilityElements` array on the fulfillment container that enforces the correct logical reading order
2. Re-define (or append to) the array **every time** a badge view is inserted, regardless of which async callback triggered it
3. Post `UIAccessibility.post(notification: .layoutChanged, object: nil)` after updating the array so VoiceOver re-evaluates the container

---

## Fix Patterns

### Pattern A: Real Diff — `FulfillmentPickUpAndDropView.swift` (OAMD-8344 / PR #142832)

**Bad Code:**
```swift
class FulfillmentPickUpAndDropView: BaseView {
    func updateAccessibility() {
        // ❌ deliveryDateInCart always included, even when model says not to show it
        deliveryDateInCart.isAccessibilityElement = (model.showDeliveryDateCartText == true)
        let elements = [pickUpCentreStackView, locationView, dropCentreStackView, deliveryDateInCart]
            .compactMap { $0 }
        accessibilityElements = elements
    }
}
```

**Good Code:**
```swift
class FulfillmentPickUpAndDropView: BaseView {
    func updateAccessibility() {
        // ✅ Build elements array, conditionally appending deliveryDateInCart
        var elements = [pickUpCentreStackView, locationView, dropCentreStackView].compactMap { $0 }
        if let showDeliveryDateCartText = model.showDeliveryDateCartText, showDeliveryDateCartText {
            deliveryDateInCart.isAccessibilityElement = true
            elements.append(deliveryDateInCart)
        }
        accessibilityElements = elements
    }
}
```

---

### Pattern B: Lazy Badge Injection — Call Order Update in Badge's `configure(with:)` Callback

When the badge view is injected inside a `configure(with:)` method triggered by an async data callback, the accessibility order update should be tied to that same callback — not to a separate notification observer — so the two steps are always in sync.

```swift
// ItemPageViewController.swift

class ItemPageViewController: UIViewController {

    private let fulfillmentView = FulfillmentView()

    override func viewDidLoad() {
        super.viewDidLoad()
        setupFulfillmentView()
        fetchFastBadgingData()
    }

    private func fetchFastBadgingData() {
        FastBadgingService.shared.fetchBadge(for: itemId) { [weak self] result in
            DispatchQueue.main.async {
                guard let self = self, case .success(let badgeInfo) = result else { return }

                // ✅ configureBadge both adds the view AND updates accessibilityElements
                //    in one atomic step — no separate notification subscription required
                self.fulfillmentView.configureBadge(with: badgeInfo)
            }
        }
    }
}

// FulfillmentView.swift — configureBadge is the single entry point for badge injection
extension FulfillmentView {

    func configureBadge(with badgeInfo: FastBadgeInfo) {
        if badgeView == nil {
            let badge = DeliveryBadgeView()
            addSubview(badge)
            badgeView = badge
        }
        badgeView?.configure(with: badgeInfo)

        // ✅ Called here — in the same method that adds the badge — so order is always correct
        updateAccessibilityOrder()
    }
}
```

---

### Pattern C: Multiple Badges — Express + Free Delivery

When both an Express badge and a Free Delivery badge can appear (potentially via separate async calls), the required logical order is:

**address → standard delivery info → express badge → free delivery badge**

```swift
class FulfillmentView: UIView {

    private let addressView = UILabel()
    private let standardDeliveryLabel = UILabel()   // e.g. "2-day delivery"
    private var expressBadgeView: DeliveryBadgeView?
    private var freeBadgeView: DeliveryBadgeView?

    private func setupViews() {
        addSubview(addressView)
        addSubview(standardDeliveryLabel)
        updateAccessibilityOrder()
    }

    func configureExpressBadge(with info: FastBadgeInfo) {
        if expressBadgeView == nil {
            let badge = DeliveryBadgeView()
            addSubview(badge)
            expressBadgeView = badge
        }
        expressBadgeView?.configure(with: info)
        updateAccessibilityOrder()  // ✅ Rebuild order after each badge is added
    }

    func configureFreeBadge(with info: FreeBadgeInfo) {
        if freeBadgeView == nil {
            let badge = DeliveryBadgeView()
            addSubview(badge)
            freeBadgeView = badge
        }
        freeBadgeView?.configure(with: info)
        updateAccessibilityOrder()  // ✅ Rebuild order after each badge is added
    }

    private func updateAccessibilityOrder() {
        // ✅ Canonical order enforced here; insertion order of subviews is irrelevant
        var elements: [UIView] = [addressView, standardDeliveryLabel]
        if let express = expressBadgeView { elements.append(express) }
        if let free = freeBadgeView { elements.append(free) }
        accessibilityElements = elements

        UIAccessibility.post(notification: .layoutChanged, argument: nil)
    }
}
```

---

### Pattern D: SwiftUI — `accessibilitySortPriority()` for ZStack / Overlay Badge

In SwiftUI, when a badge is rendered as an overlay or inside a `ZStack` on top of the address text, use `.accessibilitySortPriority()` to enforce logical order. Higher priority values are announced first.

```swift
struct FulfillmentSectionView: View {
    let address: String
    let expressBadge: FastBadgeInfo?

    var body: some View {
        // ✅ .accessibilityElement(children: .contain) keeps VoiceOver inside this container
        VStack(alignment: .leading, spacing: 8) {
            Text(address)
                .accessibilityLabel(address)
                // ✅ Higher priority → announced first (address before badge)
                .accessibilitySortPriority(2)

            if let badge = expressBadge {
                DeliveryBadgeView(info: badge)
                    .accessibilityLabel(badge.accessibilityDescription)
                    // ✅ Lower priority → announced after address
                    .accessibilitySortPriority(1)
            }
        }
        .accessibilityElement(children: .contain)
    }
}
```

When the badge appears inside a `ZStack` (visually overlaid above the address), `accessibilitySortPriority` is essential because SwiftUI's default traversal order for `ZStack` follows z-order (topmost view last), which may not match logical reading order:

```swift
struct FulfillmentOverlayView: View {
    let address: String
    let expressBadge: FastBadgeInfo?

    var body: some View {
        ZStack(alignment: .topLeading) {
            Text(address)
                .accessibilitySortPriority(2)   // ✅ Read first despite z-position

            if let badge = expressBadge {
                DeliveryBadgeView(info: badge)
                    .accessibilitySortPriority(1)   // ✅ Read second
            }
        }
        .accessibilityElement(children: .contain)
    }
}
```

---

### Pattern E: View Hierarchy Reordering (Alternative — NOT Preferred)

It is technically possible to reorder subviews so that the badge view sits earlier in the hierarchy than the address view, matching insertion order to the desired traversal order. This is **not the preferred fix** because it changes the visual layer ordering and may break layout or visual stacking.

```swift
// ⚠️ NOT PREFERRED — changes visual layout; use accessibilityElements instead
func configureBadge(with badgeInfo: FastBadgeInfo) {
    let badge = DeliveryBadgeView()
    badge.configure(with: badgeInfo)
    addSubview(badge)
    badgeView = badge

    // sendSubviewToBack moves the badge below addressView in the view hierarchy,
    // making it earlier in traversal order — but this also affects visual z-order
    sendSubviewToBack(badge)   // ⚠️ May break visual rendering
}
```

**Why this is not preferred:**
- `sendSubviewToBack` / `insertSubview(_:belowSubview:)` changes visual stacking, not just accessibility order
- Any future layout change may re-break the traversal order
- `accessibilityElements` (Pattern A) is the explicit, stable, layout-independent solution

---

## Why This Works

| Symptom | Root Cause | Fix |
|---|---|---|
| Badge announced before address in VoiceOver | No `accessibilityElements` defined; iOS uses insertion order (badge added last) | Define explicit `accessibilityElements = [addressView, badgeView]` on container |
| Order breaks only when badge network call returns | Badge added asynchronously after initial layout | Call `updateAccessibilityOrder()` inside the badge configure callback |
| Multiple badges arrive at different times, order wrong | Each async callback appends a badge independently; no unified ordering | Single `updateAccessibilityOrder()` rebuilds the full canonical array after each badge is added |
| SwiftUI overlay badge announced before static text | `ZStack` z-order used as fallback traversal; badge on top → announced last by default (or first depending on overlay strategy) | `.accessibilitySortPriority()` on each element to enforce address-first order |
| Reordering subviews fixes traversal but breaks visual layout | `sendSubviewToBack` changes both visual and accessibility hierarchy | Use `accessibilityElements` — decouples accessibility order from visual hierarchy entirely |

---

## Key Signals (For Pattern Matching)

Use this template when you see ANY of these in an iOS codebase:

- A view injected by an **async network callback** appears before statically-laid-out views in VoiceOver order
- **Badge / overlay / chip views** added programmatically after the initial `viewDidLoad` / `setupViews()` layout pass
- Multiple `addSubview()` calls in **different methods or callbacks** that do not share a unified `accessibilityElements` definition
- Item pages with **dynamic delivery options**: Express, 2-day, free delivery badges
- VoiceOver announces a **dynamically-loaded element before the static content** it annotates (e.g., "Express delivery" before "Delivery to [address]")
- The container has **no `accessibilityElements` property set** and contains views added at different lifecycle points
- A fulfillment, pricing, or availability section where **some subviews are static and others are async-populated**

---

## Variations

| Var | Description | Status |
|---|---|---|
| Var 1 (this PR) | Item page fast-badging — Express delivery badge injected async, announced before address | Ingested |

---

## Decision Tree: Which Fix to Apply

```
Is this a UIKit fulfillment container with async-injected badge subviews?
├── YES → Define accessibilityElements on the container (Pattern A)
│          └── Is the badge injected via a network callback configure method?
│              ├── YES → Call updateAccessibilityOrder() inside that configure method (Pattern B)
│              └── NO  → Call updateAccessibilityOrder() wherever addSubview(badge) is called
│
└── NO → Is this SwiftUI with a ZStack or overlay badge?
         ├── YES → Use .accessibilitySortPriority() + .accessibilityElement(children: .contain) (Pattern D)
         └── NO  → Are multiple async badges added at different times?
                   └── YES → Single updateAccessibilityOrder() rebuilds canonical array after each add (Pattern C)
```

---

## Related Templates

- `WA11Y-IOS-2.4.3-001` — iOS: Focus management after `UICollectionView` `reloadData()` (batch-updates fix)
- `WA11Y-IOS-2.4.3-002` — iOS: Stale accessibility tree in nudge/notification view updated in-place
- `WA11Y-WEB-2.4.3-001` — Web: Post-modal focus management
