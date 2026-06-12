# Catalyst Template: Dual-Action Item Card — "Add to Cart" Button Absorbed by Container

**Template ID:** `WA11Y-IOS-4.1.2-007`
**Platform:** iOS (UIKit / SwiftUI)
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Confluence Rule:** Accessibility Not Enabled: Element Not Focusable or Recognized by VoiceOver
**Component:** Autodeals List — "Deals on your saved items" item card with card-tap navigation + "Add to Cart" button
**Source PRs:**
- [#139149](https://gecgithub01.walmart.com/walmart-web/glass-app/pull/139149) | [CELISTS-30299](https://jira.walmart.com/browse/CELISTS-30299) — "Add to Cart" button on deal item card unreachable via VoiceOver; card container absorbs child button
**Ingested:** 2026-04-23

---

## The Problem

On the Lists landing page, in the "Deals on your saved items" section, each item card has two distinct interaction zones:

1. **Tap the card** → navigate to the item detail page (link / navigation behavior)
2. **Tap "Add to Cart"** → add the item to the cart (button behavior)

VoiceOver recognizes the card as a **single focusable element**. The "Add to Cart" button is absorbed into the card container and is **not independently reachable**. Users relying on VoiceOver can hear the product name but cannot add items to cart from the list page without leaving to the item detail page.

**Root cause:** The item card container has `isAccessibilityElement = true` (or a gesture recognizer on the container absorbs child interactions), so VoiceOver treats the entire card as one accessibility element. The "Add to Cart" `UIButton` is a child view that gets silenced — it is invisible to the accessibility tree even though it is visually present and tappable for sighted users.

**Why this is distinct from single-purpose over-grouping (see `WA11Y-IOS-4.1.2-004`):**
- `WA11Y-IOS-4.1.2-004` covers a row where a secondary button is absorbed alongside a toggle — the card has no navigation intent
- This template covers a **dual-action card**: the card background itself is a navigation trigger AND a separate CTA button exists — both must be independently reachable

**Root cause rule:** `isAccessibilityElement = true` on a container is appropriate ONLY when the container's content is purely informational. It is NEVER appropriate when any child is an independently interactive element (button, switch, link, stepper), and it is especially problematic when the container itself has a gesture recognizer that also serves as a primary interaction.

---

## Fix Patterns

### Pattern A: Primary Fix — `accessibilityElements` on the Item Card Container

**Bad Code:**
```swift
class DealItemCardView: UIView {
    let productImageView = UIImageView()
    let productNameLabel = UILabel()
    let priceLabel = UILabel()
    let addToCartButton = UIButton(type: .system)

    private func setupAccessibility() {
        // ❌ Container absorbs all children — addToCartButton is silenced
        isAccessibilityElement = true
        accessibilityLabel = "\(productNameLabel.text ?? ""), \(priceLabel.text ?? "")"
        accessibilityTraits = .button
        // VoiceOver: reads product name + price as one element
        // Double-tap: navigates to item page — Add to Cart is never reachable
    }
}
```

**Good Code:**
```swift
class DealItemCardView: UIView {
    let productImageView = UIImageView()
    let productNameLabel = UILabel()
    let priceLabel = UILabel()
    let addToCartButton = UIButton(type: .system)

    // Synthetic element for the card's navigation tap zone
    private var cardTappableArea: UIAccessibilityElement!

    private func setupAccessibility() {
        // ✅ Container is NOT an accessibility element — managed via accessibilityElements
        isAccessibilityElement = false

        // ✅ Synthetic element represents the card navigation zone
        cardTappableArea = UIAccessibilityElement(accessibilityContainer: self)
        let productName = productNameLabel.text ?? ""
        let price = priceLabel.text ?? ""
        cardTappableArea.accessibilityLabel = NSLocalizedString(
            "\(productName), \(price) — navigate to item page",
            comment: "Card tap area: announces product and price, activates item detail navigation"
        )
        cardTappableArea.accessibilityTraits = .link
        cardTappableArea.accessibilityFrameInContainerSpace = bounds

        // ✅ Add to Cart button: independently focusable with contextual label
        addToCartButton.isAccessibilityElement = true
        addToCartButton.accessibilityLabel = NSLocalizedString(
            "Add \(productName) to cart",
            comment: "Button to add a specific product to the cart from the Deals list"
        )
        addToCartButton.accessibilityTraits = .button

        // ✅ Suppress static child views — covered by cardTappableArea label
        productNameLabel.isAccessibilityElement = false
        priceLabel.isAccessibilityElement = false
        productImageView.isAccessibilityElement = false

        // ✅ Expose exactly 2 VoiceOver stops: card navigation, then Add to Cart
        accessibilityElements = [cardTappableArea, addToCartButton]
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        // ✅ Keep frame in sync with layout changes
        cardTappableArea?.accessibilityFrameInContainerSpace = bounds
    }
}
// VoiceOver: "Great Value Milk, $2.98 — navigate to item page, link" (stop 1)
// VoiceOver: "Add Great Value Milk to cart, button" (stop 2)
```

---

### Pattern B: `UICollectionViewCell` Override — Ordered `accessibilityElements` Getter

When the item card is implemented as a `UICollectionViewCell`, override the `accessibilityElements` property directly:

```swift
class DealItemCell: UICollectionViewCell {
    let productNameLabel = UILabel()
    let priceLabel = UILabel()
    let addToCartButton = UIButton(type: .system)

    private var cardNavigationElement: UIAccessibilityElement?

    func configure(with item: DealItem) {
        productNameLabel.text = item.name
        priceLabel.text = item.formattedPrice
        addToCartButton.setTitle("Add to Cart", for: .normal)

        setupAccessibility(for: item)
    }

    private func setupAccessibility(for item: DealItem) {
        // ✅ Cell container is not an accessibility element
        isAccessibilityElement = false
        contentView.isAccessibilityElement = false

        // ✅ Synthetic navigation element for the card tap zone
        let navElement = UIAccessibilityElement(accessibilityContainer: self)
        navElement.accessibilityLabel = NSLocalizedString(
            "\(item.name), \(item.formattedPrice) — navigate to item page",
            comment: "Deal card navigation zone"
        )
        navElement.accessibilityTraits = .link
        navElement.accessibilityFrameInContainerSpace = contentView.bounds
        cardNavigationElement = navElement

        // ✅ Add to Cart button with product context
        addToCartButton.isAccessibilityElement = true
        addToCartButton.accessibilityLabel = NSLocalizedString(
            "Add \(item.name) to cart",
            comment: "Add to Cart CTA on deal item card"
        )
        addToCartButton.accessibilityTraits = .button

        productNameLabel.isAccessibilityElement = false
        priceLabel.isAccessibilityElement = false
    }

    // ✅ Override the getter — returns ordered array of exactly 2 stops
    override var accessibilityElements: [Any]? {
        get {
            guard let navElement = cardNavigationElement else { return nil }
            return [navElement, addToCartButton]
        }
        set { /* no-op — managed internally */ }
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        cardNavigationElement?.accessibilityFrameInContainerSpace = contentView.bounds
    }
}
// UICollectionView renders many cards — each cell independently contributes 2 VoiceOver stops
```

---

### Pattern C: Synthetic `UIAccessibilityElement` for Card Navigation Zone

When the card background tap area is a bare `UIView` with a `UITapGestureRecognizer` (no intrinsic accessible element), create a synthetic `UIAccessibilityElement` to represent the navigation interaction:

```swift
class DealCardViewController: UIViewController {
    let cardView = UIView()
    let addToCartButton = UIButton(type: .system)

    private var cardAccessibilityElement: UIAccessibilityElement?

    override func viewDidLoad() {
        super.viewDidLoad()

        // Card tap gesture — UIView has no intrinsic accessible identity
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(navigateToItem))
        cardView.addGestureRecognizer(tapGesture)
        cardView.isUserInteractionEnabled = true

        setupAccessibility()
    }

    private func setupAccessibility() {
        // ✅ Container is not an accessibility element
        cardView.isAccessibilityElement = false

        // ✅ Synthetic element represents the gesture zone
        let element = UIAccessibilityElement(accessibilityContainer: cardView)
        element.accessibilityLabel = NSLocalizedString(
            "\(productName), \(productPrice) — navigate to item page",
            comment: "Tap zone for navigating to the deal item detail page"
        )
        element.accessibilityTraits = .link
        // Frame set in viewDidLayoutSubviews
        cardAccessibilityElement = element

        // ✅ Button exposed directly — it already has intrinsic accessible identity
        addToCartButton.isAccessibilityElement = true
        addToCartButton.accessibilityLabel = NSLocalizedString(
            "Add \(productName) to cart",
            comment: "Add item to cart from the Deals list"
        )
        addToCartButton.accessibilityTraits = .button

        // ✅ Ordered: navigation zone first, CTA second
        cardView.accessibilityElements = [element, addToCartButton]
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        // ✅ Sync accessibility frame after layout
        cardAccessibilityElement?.accessibilityFrameInContainerSpace = cardView.bounds
    }

    @objc private func navigateToItem() {
        // Navigate to item detail page
    }
}
// UIAccessibilityElement bridges the gesture-driven UIView into the accessibility tree
// without requiring the UIView itself to be an accessibility element
```

---

### Pattern D: SwiftUI — Do NOT Use `.accessibilityElement(children: .contain)`

`.accessibilityElement(children: .contain)` silences sibling-level accessibility modifiers and cannot reliably expose two independently activatable elements from a single container. Use sibling-level views with explicit labels instead:

```swift
// ❌ BAD: .contain groups children but the card tap and CTA cannot both be independently activated
ZStack {
    // Card background tap zone
    Color.clear
        .contentShape(Rectangle())
        .onTapGesture { navigateToItem() }

    VStack {
        Text(productName)
        Text(productPrice)
        Button("Add to Cart") { addToCart() }
    }
}
.accessibilityElement(children: .contain)
// VoiceOver behavior is unpredictable — "Add to Cart" may or may not be reachable
// The container hint provides no navigation affordance for the card background tap

// ✅ GOOD: sibling-level elements, each with explicit label and role
ZStack(alignment: .bottom) {
    // Stop 1: Card navigation zone — covers the full card area
    Color.clear
        .contentShape(Rectangle())
        .onTapGesture { navigateToItem() }
        .accessibilityLabel("\(productName), \(productPrice) — navigate to item page")
        .accessibilityAddTraits(.isLink)
        .accessibilityRemoveTraits(.isImage)

    // Stop 2: Add to Cart button — sits above the navigation zone in Z-order
    Button {
        addToCart()
    } label: {
        Text("Add to Cart")
    }
    .accessibilityLabel("Add \(productName) to cart")
    // .accessibilityElement(children: .contain) NOT used — preserves independent activation
}
// VoiceOver: two sibling stops — navigation link, then Add to Cart button
// Each is independently focusable and activatable
```

---

### Pattern E: Contextual `accessibilityLabel` on Both Elements

Both VoiceOver stops must carry enough product context to be intelligible in isolation — a user navigating by swipe may land on "Add to Cart" without having heard the card label:

```swift
func configureAccessibility(productName: String, price: String) {
    // ✅ Card navigation element — product identity + price + action hint
    cardTappableArea.accessibilityLabel = "\(productName), \(price) — navigate to item page"
    // Example output: "Great Value Milk, $2.98 — navigate to item page"
    // Trait: .link (signals navigation behavior to VoiceOver users)
    cardTappableArea.accessibilityTraits = .link

    // ✅ Add to Cart button — product name embedded for context when heard in isolation
    addToCartButton.accessibilityLabel = "Add \(productName) to cart"
    // Example output: "Add Great Value Milk to cart"
    // Trait: .button (default for UIButton — explicit assignment for clarity)
    addToCartButton.accessibilityTraits = .button

    // ❌ BAD label patterns — avoid:
    // cardTappableArea.accessibilityLabel = "Item card"       // No product identity
    // addToCartButton.accessibilityLabel = "Add to Cart"      // Ambiguous in a list of cards
    // addToCartButton.accessibilityLabel = "Add to cart button" // Never include role in label
}
```

**Why contextual labels matter in list views:** When `UICollectionView` or `UITableView` renders multiple deal cards, VoiceOver users navigate a sequence of stops. Without product name in the "Add to Cart" label, consecutive "Add to Cart, button" announcements are indistinguishable — users cannot act on the correct item.

---

## Var 1: Autodeals List — "Deals on your Saved Items" Card (CELISTS-30299)

**Context:** Lists landing page (glass-app, Lists domain). The "Deals on your saved items" section displays a horizontal scroll of item cards. Each card shows a product image, name, and price, with an "Add to Cart" CTA button overlaid on or adjacent to the card. The card container had `isAccessibilityElement = true` (or an equivalent gesture absorber), making the entire card a single VoiceOver stop. The "Add to Cart" button was completely unreachable — VoiceOver users could only navigate to the item page (by double-tapping the card), with no path to add the deal item to cart from the list page.

**Bad Code:**
```swift
class AutodealsCarouselView: BaseView {
    func configureCell(_ cell: CarouselCell, with itemModel: ItemModel) {
        // ❌ Custom label override — duplicates what GlassProductTile already computes
        // "Add to Cart" button is absorbed into the card container label
        if let description = itemModel.description {
            let badgeText = itemModel.badgeText ?? ""
            let priceAccessibilityText = itemModel.greenPriceModelForAccessibility.accessibilityLabel ?? ""
            let customLabel = [badgeText, description, priceAccessibilityText]
                .filter { !$0.isEmpty }
                .joined(separator: ", ")

            cell.productTile.isAccessibilityElement = true
            cell.productTile.accessibilityLabel = customLabel
            cell.productTile.accessibilityTraits = .button
        }
    }
}
```

**Good Code:**
```swift
class AutodealsCarouselView: BaseView {
    func configureCell(_ cell: CarouselCell, with itemModel: ItemModel) {
        // ✅ Let GlassProductTile manage its own accessibility via productNameForImageOnlyAccessibility
        // This exposes both the card navigation element AND the "Add to Cart" button as separate stops
        cell.productTile.configure(with: GlassProductTile.GridModel(
            ...
            pricingViewType: nil,
            productNameForImageOnlyAccessibility: itemModel.description  // ✅ tile computes composite label
        ))
        // ✅ Remove manual isAccessibilityElement/accessibilityLabel overrides on the tile
    }
}
```

**Why This Works:** The manual `isAccessibilityElement = true` + `accessibilityLabel` override on the `productTile` container absorbed all child elements — including the "Add to Cart" button — into a single VoiceOver stop. Removing the override and passing `productNameForImageOnlyAccessibility` on `GlassProductTile.GridModel` allows `GlassProductTile` to manage its own accessibility hierarchy, which correctly exposes both the card navigation element and the "Add to Cart" button as separate, independently reachable VoiceOver stops.

**Key Signals:** `GlassProductTile` or `productTile` with `isAccessibilityElement = true` set externally (from a parent view); custom `accessibilityLabel` constructed by joining badge text, description, and price; "Add to Cart" button unreachable via VoiceOver; Autodeals, Lists, or carousel-based product displays; `AutodealsCarouselView` in the Lists plugin.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| VoiceOver stop count | 1 per card — container absorbs everything | 2 per card — navigation zone + Add to Cart button |
| Card navigation | Double-tap activates navigation (accidental only) | Synthetic `.link` element — double-tap navigates to item page |
| Add to Cart operability | Completely inaccessible via VoiceOver | `addToCartButton` exposed as `.button` — double-tap adds to cart |
| WCAG 4.1.2 compliance | Role and value of CTA not determinable by AT | Each element has correct role, label, and activation behavior |
| Contextual label | Card label lacks navigation hint; CTA label lacks product context | Both labels carry product name; card label notes navigation; CTA label notes cart action |
| List navigation | Indistinguishable "Add to Cart" stops across multiple cards | Product name embedded in each CTA label — each card's stops are distinguishable |

---

## Key Signals (For Pattern Matching)

- Item card / product tile with a `UITapGestureRecognizer` on the container AND a `UIButton` child (e.g., "Add to Cart", "Save", "Remove")
- VoiceOver announces the card (product name, price) but the CTA button is unreachable by swipe
- `isAccessibilityElement = true` on a `UIView` that contains a `UIButton`
- Expected VoiceOver behavior: two stops per card — one for navigation (`.link`), one for CTA (`.button`)
- `UICollectionView` or `UITableView` rendering multiple such cards — CTA label must embed product name to distinguish cards
- Domains: Deals lists, search results, cart item rows, saved lists, recommendation carousels, product grids

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | CELISTS-30299 / PR #139149 | Autodeals List — "Deals on your saved items" item card | `accessibilityElements = [cardTappableArea, addToCartButton]` — synthetic nav element + CTA button | Ingested |

---

## Related Templates

- `WA11Y-IOS-4.1.2-004` — Button silenced by over-grouping single-purpose container (`UISwitch` + `UIButton` row)
- `WA11Y-IOS-1.3.1-001` Var 2 — Plan card with info group + separate Details button (`accessibilityElements = [summaryContainer, detailsButton]`)
- `WA11Y-WEB-4.1.2-001` — Web: incomplete aria-labelledby on product tile
