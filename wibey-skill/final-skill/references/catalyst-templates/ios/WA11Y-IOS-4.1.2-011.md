# Catalyst Template: Name, Role, Value — Composite Discount View Creates Duplicate VoiceOver Focus and Redundant Label Suffix

**Template ID:** `WA11Y-IOS-4.1.2-011`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-011`
**Source Tickets:** CEPG-350829
**Source PRs:** [glass-app (internal)](https://gecgithub01.walmart.com/Walmart-iOS/glass-app)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`CartItemTileView` and `CartItemTileProductVariantView` both render an `MQDPromoDiscountView` (multi-quantity discount promotional label) inside a stack view. Two accessibility failures existed:

### Failure 1 — Duplicate VoiceOver focus on `MQDPromoDiscountView`

`MQDPromoDiscountView` is a composite `UIView` containing sub-elements (a discount label, tier badges, a "Learn more" link, etc.). The container was created with `isAccessibilityElement = true`, AND its children also had `isAccessibilityElement = true`. This creates two (or more) VoiceOver focus stops for the same content:

```
Before fix:
  Swipe → Cart item title → MQDPromoDiscountView (container) ← duplicate!
                          → MQDPromoDiscountView label        ← duplicate!
                          → "Learn more" link
```

VoiceOver users encounter the same promotional discount information twice in sequence, with no way to distinguish which focus stop is actionable.

### Failure 2 — Redundant "Eligible items" suffix appended to `titleAccessibilityLabel`

The `CartItemListPresentation` extension appended `, Eligible items` (the localized value of `promoDiscountViewEligibleItems`) to the cart item's `titleAccessibilityLabel` in the `.eligible` state:

```swift
// ❌ Before: label + redundant suffix
titleAccessibilityLabel = "\(title), \(LocalizableString.promoDiscountViewEligibleItems.value)"
// → "Fisher-Price Rock-a-Stack, Eligible items"
//                               ^^^^^^^^^^^^^^^ VoiceOver already reads this from MQDPromoDiscountView
```

The suffix was already announced by `MQDPromoDiscountView` itself, producing a double-read.

**Symptom (Jira):** "VoiceOver focuses MQD discount view twice", "Duplicate focus points on promo discount component in cart", "'Eligible items' announced twice on cart item", "Screen reader reads promotional discount label two times per item".

---

## ✅ The Fix Pattern

### Part 1 — Factory method: set `isAccessibilityElement = false` on the container

```swift
// MQDPromoDiscountView.swift

extension MQDPromoDiscountView {
    /// Creates an MQDPromoDiscountView, suppresses the container from VoiceOver,
    /// and adds it to the given stack view.
    ///
    /// MQDPromoDiscountView is a composite view — its children (label, badges, link)
    /// are individually accessible. Setting isAccessibilityElement = false on the
    /// container prevents VoiceOver from treating it as an additional focus node
    /// on top of the children.
    static func make(
        with model: MQDPromoDiscountView.Model,
        addedTo stackView: UIStackView
    ) -> MQDPromoDiscountView {
        let view = MQDPromoDiscountView(model: model)
        // ✅ Suppress the container — children handle their own accessibility
        view.isAccessibilityElement = false
        view.setContentHuggingPriority(.required, for: .vertical)
        view.setContentCompressionResistancePriority(.required, for: .vertical)
        stackView.addArrangedSubview(view)
        return view
    }
}
```

---

### Part 2 — Call site: use factory method instead of direct init

```swift
// CartItemTileView.swift — was:
// ❌ Before:
let view = MQDPromoDiscountView(model: mqdPromoDiscountModel)
mqdPromoDiscountView = view
mqdPromoDiscountView?.isAccessibilityElement = true   // ← enables duplicate focus
leftStackView.addArrangedSubview(view)

// ✅ After:
mqdPromoDiscountView = MQDPromoDiscountView.make(
    with: mqdPromoDiscountModel,
    addedTo: leftStackView
)
// isAccessibilityElement = false is set inside make()
```

```swift
// CartItemTileProductVariantView.swift — same pattern:
// ❌ Before:
let view = MQDPromoDiscountView(model: mqdPromoDiscountModel)
mqdPromoDiscountView = view
mqdPromoDiscountView?.isAccessibilityElement = true
rightVerticalStackView.addArrangedSubview(view)

// ✅ After:
mqdPromoDiscountView = MQDPromoDiscountView.make(
    with: mqdPromoDiscountModel,
    addedTo: rightVerticalStackView
)
```

---

### Part 3 — Remove redundant suffix from `titleAccessibilityLabel`

```swift
// CartItemListPresentation.swift

// Cart item model for MQD promo in .eligible state:

// ❌ Before — appends "Eligible items" which MQDPromoDiscountView already announces
titleAccessibilityLabel = "\(title), \(LocalizableString.promoDiscountViewEligibleItems.value)"
// VoiceOver: "Fisher-Price Rock-a-Stack, Eligible items" ← item tile
//            "Eligible items" ← MQDPromoDiscountView child  (double-read)

// ✅ After — title only; MQDPromoDiscountView announces the promo info
titleAccessibilityLabel = title
// VoiceOver: "Fisher-Price Rock-a-Stack" ← item tile (clean)
//            "Eligible items" ← MQDPromoDiscountView child (once)
```

Same pattern for both the single-tier variant and the multi-tier variant:

```swift
// Single-tier (CartItemTileView.Model extension):
// Before: titleAccessibilityLabel = "\(title), \(LocalizableString.promoDiscountViewEligibleItems.value)"
// After:  titleAccessibilityLabel = title

// Multi-tier (CartItemTileView.Model extension, tiered variant):
// Before: subTitleAccessibilityLabel = "\(subTitle), \(LocalizableString.promoDiscountViewEligibleItems.value)"
// After:  subTitleAccessibilityLabel = subTitle
```

---

### ❌ Bad Code — container + children both accessible, redundant suffix

```swift
// ❌ Before: two failures in one block

// 1. Container enabled → duplicate focus
let view = MQDPromoDiscountView(model: mqdPromoDiscountModel)
mqdPromoDiscountView = view
mqdPromoDiscountView?.isAccessibilityElement = true   // ← container accessible
leftStackView.addArrangedSubview(view)
// Children also accessible → VoiceOver: container + children = 2+ stops

// 2. Redundant suffix in parent tile
titleAccessibilityLabel = "\(title), \(LocalizableString.promoDiscountViewEligibleItems.value)"
// → "Product name, Eligible items"
// → MQDPromoDiscountView also reads "Eligible items" from its child
// → VoiceOver: "Product name, Eligible items" then "Eligible items" (double)
```

---

### VoiceOver traversal after fix

```
Before fix (cart item with MQD promo):
  Swipe → "Fisher-Price Rock-a-Stack, Eligible items" (tile — redundant suffix)
        → "Eligible items" (MQDPromoDiscountView container — duplicate #1)
        → "Buy 3, save $2 per item" (MQDPromoDiscountView label — duplicate #2)
        → "Learn more" (link inside MQDPromoDiscountView)

After fix:
  Swipe → "Fisher-Price Rock-a-Stack" (tile — clean title)
        → "Buy 3, save $2 per item" (MQDPromoDiscountView child)
        → "Eligible items" (MQDPromoDiscountView child)
        → "Learn more" (link inside MQDPromoDiscountView)
```

---

### `isAccessibilityElement = false` vs `accessibilityElementsHidden = true`

| Setting | Effect |
|---|---|
| `container.isAccessibilityElement = false` | Container is not an accessible element; children remain accessible |
| `container.accessibilityElementsHidden = true` | Container AND all children are hidden from VoiceOver |
| `container.isAccessibilityElement = true` | Container is an accessible leaf node; children are typically subsumed |

For composite views where children should remain individually accessible, use `isAccessibilityElement = false` on the container. This removes the container as a focus node while allowing each child to be traversed independently.

Use `accessibilityElementsHidden = true` only when the entire component (container + all children) should be hidden from VoiceOver.

---

### Factory method pattern for accessibility-safe construction

Encapsulating `isAccessibilityElement = false` inside a factory method (`make(with:addedTo:)`) ensures every instantiation site is correct by default. This prevents future contributors from instantiating `MQDPromoDiscountView` with `isAccessibilityElement = true`:

```swift
// ✅ Factory method — accessibility set correctly at construction, not at call site
mqdPromoDiscountView = MQDPromoDiscountView.make(with: model, addedTo: stackView)

// ❌ Direct init — accessibility state must be set explicitly at every call site (error-prone)
let view = MQDPromoDiscountView(model: model)
view.isAccessibilityElement = ???   // easy to forget or set wrong
stackView.addArrangedSubview(view)
```

---

## 🔑 Key Rules

- **Set `isAccessibilityElement = false` on composite view containers when children are individually accessible** — `isAccessibilityElement = true` on a container makes the container a leaf node and typically subsumes children. Having both the container and children accessible creates duplicate focus points.
- **Encapsulate accessibility configuration in a factory method** — if a component's accessibility state is always the same (container always suppressed), put `isAccessibilityElement = false` in a static `make()` factory method. This prevents call-site drift where some instances are correctly configured and others are not.
- **Never append text to a parent's `accessibilityLabel` that the child component already announces** — audit what each component in the hierarchy announces independently. If `MQDPromoDiscountView` already reads "Eligible items" through its children, appending it to the parent tile label creates an immediate double-read on the next VoiceOver swipe.
- **Test with VoiceOver swipe traversal, not just unit tests** — `XCTAssertEqual(view.isAccessibilityElement, false)` confirms the flag is set, but only swiping through VoiceOver on a device confirms there is exactly one focus stop per logical unit of content.
- **Apply the fix to all instantiation sites of the component** — `MQDPromoDiscountView` was instantiated in two views (`CartItemTileView` and `CartItemTileProductVariantView`). Both required the factory method change. Search for all `MQDPromoDiscountView(model:)` call sites when applying this fix.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name and role of user interface components must be programmatically determinable. Two failures:
  1. **Duplicate focus nodes** — VoiceOver exposes both the `MQDPromoDiscountView` container and its children as separate focus nodes for the same interactive content. Users cannot determine which node to interact with. The "Learn more" link is the actionable element; the container is not — but VoiceOver presents them as sibling interactive nodes.
  2. **Non-programmatically-determinable name** — appending "Eligible items" to the cart item's `titleAccessibilityLabel` when `MQDPromoDiscountView` already announces it means the name of the interactive component includes redundant text. VoiceOver users hear the same information twice in sequence, which is an incorrect programmatic representation of the component's accessible name.
