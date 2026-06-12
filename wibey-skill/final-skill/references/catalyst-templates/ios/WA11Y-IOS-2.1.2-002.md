# Catalyst Template: No Keyboard Trap — VoiceOver Focus Trapped in Nested `accessibilityElements` Hierarchy

**Template ID:** `WA11Y-IOS-2.1.2-002`
**Platform:** iOS
**WCAG Criterion:** 2.1.2 No Keyboard Trap
**Jira Label:** `WA11Y-IOS-2.1.2-002`
**Source Tickets:** CEPG-341972
**Source PRs:** [glass-app #156713](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/156713)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`SoftBundleItemVerticalTileContainerView` renders a horizontal list of product tiles for soft bundle items on the PDP. The container set `accessibilityElements = [stackView]` — wrapping the tile array inside a `UIStackView` node:

```swift
// ❌ Before fix:
accessibilityElements = [stackView]
// Hierarchy: container → [stackView] → [tile1, tile2, tile3, ...]
// VoiceOver sees: container as [stackView], then inside stackView: [tile1, tile2, ...]
```

This 4-level nesting caused VoiceOver backwards swipe to get **trapped** on the last bundle item card:
- VoiceOver forward swipe: reaches last tile → exits container normally
- VoiceOver backward swipe: exits last tile → enters stackView → cannot exit stackView (focus cycles back to last tile)

A VoiceOver user swiping backwards through the bundle items cannot escape and navigate to elements above the bundle.

A second issue: within each individual tile, `SoftBundleItemVerticalTileView` had `primaryPriceLabel.isAccessibilityElement = true`, which caused VoiceOver to cycle between the tile's product title and price label internally, trapping focus within a single tile as well.

**Symptom (Jira):** "VoiceOver backward swipe stuck on last bundle item in soft bundle", "Screen reader can't navigate past soft bundle section when swiping back", "Focus trapped in bundle item card on PDP", "VoiceOver cycles between product title and price in bundle tile".

---

## ✅ The Fix Pattern

### Part 1 — Flatten hierarchy: expose tile views directly instead of via `[stackView]`

```swift
// SoftBundleItemVerticalTileContainerView.swift

private func setupAccessibility() {
    // ✅ Flatten the hierarchy by bypassing the stackView wrapper
    //    Before: accessibilityElements = [stackView]
    //    → Container → [stackView] → [tile1, tile2, ...] (4 levels — backward trap)
    //
    //    After: accessibilityElements = stackView.accessibilityElements
    //    → Container → [tile1, tile2, ...]  (3 levels — no trap)
    accessibilityElements = stackView.accessibilityElements
    accessibilityIdentifier = String(describing: type(of: self)) + "_containerView"
}
```

**Key insight:** `stackView.accessibilityElements` returns the array of accessible elements that the stack view itself exposes. By assigning that array directly to the container's `accessibilityElements`, we remove the `stackView` level from the VoiceOver hierarchy. VoiceOver traverses the tiles directly without routing through the stack view.

---

### Part 2 — Prevent sub-element cycling within a single tile

```swift
// SoftBundleItemVerticalTileView.swift

private func setupTileAccessibility() {
    // ✅ Make the container view a single accessible unit
    //    This prevents VoiceOver from descending into productTitle, primaryPriceLabel
    //    (which would trap focus cycling between them within one tile)
    containerView.isAccessibilityElement = true
    // containerView.accessibilityLabel is built from title + price in composite form

    // ❌ Before fix: primaryPriceLabel.isAccessibilityElement = true
    //    → VoiceOver: containerView → productTitle → primaryPriceLabel (trap within tile)
    // ✅ After fix: primaryPriceLabel.isAccessibilityElement is not set to true
    //    (it defaults to false for UILabel)
    //    → VoiceOver: containerView (single focus stop per tile)
}
```

---

### ❌ Bad Code — nested `[stackView]` wrapping creates backward trap

```swift
// ❌ Before fix:

// Container:
accessibilityElements = [stackView]
// stackView is also in its own accessibilityElements → 4 levels:
// screen → container → [stackView] → [tile1, tile2, tile3]
// VoiceOver backward swipe: tile3 → stackView → TRAPPED (stackView → tile3 again)

// Tile:
primaryPriceLabel.isAccessibilityElement = true
// → Within a tile, VoiceOver cycles: containerView → productTitle → primaryPriceLabel → containerView
// → Cannot exit the tile when swiping backwards
```

---

### VoiceOver traversal after fix

```
Before fix (forward swipe):
  ... → container → stackView → tile1 → tile2 → tile3 → (exits correctly)

Before fix (backward swipe from tile1):
  tile1 → stackView → TRAPPED (stackView → tile3 → tile2 → tile1 → TRAPPED)
                       ^^^^^^^^
                       VoiceOver re-enters stackView from the inside, cycles

After fix (forward swipe):
  ... → container → tile1 → tile2 → tile3 → (exits correctly)

After fix (backward swipe from tile1):
  tile1 → container → (exits to element above container correctly)
```

---

### Why `accessibilityElements = [stackView]` creates a backward trap

When `accessibilityElements` contains a `UIStackView`:
- VoiceOver forward: enters container → enters stackView → traverses tiles → exits stackView → exits container
- VoiceOver backward: tries to exit the last tile backward → enters stackView context → re-enters the last tile (stackView "contains" the tiles) → can never exit stackView backward because UIKit's backward swipe re-enters the container's `accessibilityElements[0]` (the stackView itself)

By flattening `accessibilityElements = stackView.accessibilityElements`, the stack view is removed from the traversal path. VoiceOver backward swipe from the first tile exits the container correctly.

---

### The general rule for `accessibilityElements` nesting

```swift
// ❌ Never nest a UIStackView or UIView container inside accessibilityElements
//    if the container's children are also accessible:
accessibilityElements = [stackView]  // stackView contains focusable children → TRAP RISK

// ✅ Expose the children directly
accessibilityElements = stackView.arrangedSubviews  // if all arranged subviews are accessible
accessibilityElements = stackView.accessibilityElements  // delegates to stackView's own list
accessibilityElements = [tile1, tile2, tile3]  // explicit list, no intermediate container
```

For container views that should be single accessible units (e.g., a card with title + price as one VoiceOver element), set `isAccessibilityElement = true` on the container and let it subsume its children — do not set `isAccessibilityElement = true` on the children as well.

---

### Testing for focus traps

The key test: after swiping forward to the last element in a container, does swiping backward allow exit? And does swiping backward from the first element also allow exit?

```swift
// Unit test for flattened hierarchy:
func testAccessibilityElementsFlattenedHierarchy() {
    containerView.setupAccessibility()
    
    // After fix: accessibilityElements should be the tile views directly
    let elements = containerView.accessibilityElements
    XCTAssertNotNil(elements)
    
    // The elements should NOT be [stackView] — they should be the actual tile views
    let firstElement = elements?.first as? UIView
    XCTAssertFalse(firstElement is UIStackView, "accessibilityElements should not contain a UIStackView wrapper")
}
```

---

## 🔑 Key Rules

- **Never assign a `UIStackView` as the sole element in `accessibilityElements`** — `accessibilityElements = [stackView]` creates an intermediate navigation level. VoiceOver's backward swipe cannot escape this level, causing a focus trap. Use `accessibilityElements = stackView.accessibilityElements` to flatten the hierarchy.
- **Do not set `isAccessibilityElement = true` on both a container and its children** — if `containerView.isAccessibilityElement = true` and a child label also has `isAccessibilityElement = true`, VoiceOver may cycle between them within the same logical unit. Make the container a leaf node OR expose children — not both.
- **Test backward swipe from the first and last element of every list/grid** — forward swipe traps are rare; backward swipe traps are common in nested `accessibilityElements` hierarchies. Always test both directions.
- **`accessibilityElements = stackView.accessibilityElements` is the correct flatten** — `stackView.arrangedSubviews` may include non-accessible views; `stackView.accessibilityElements` returns only the elements the stack view considers accessible. Prefer the latter.
- **Apply to any container that wraps another container in its `accessibilityElements`** — the trap occurs whenever there are 2+ levels of `accessibilityElements` nesting. Audit all `accessibilityElements` assignments for intermediate container nodes.

---

## ⚠️ WCAG Failure Without This Fix

- **2.1.2 (No Keyboard Trap):** If keyboard focus can be moved to a component of the page using a keyboard interface, then focus can be moved away from that component using only a keyboard interface, and, if it requires more than unmodified arrow or tab keys to move focus away, the user is advised of the method for moving focus away. The 4-level `accessibilityElements` nesting causes VoiceOver backward swipe to cycle inside the stack view wrapper indefinitely. Users cannot move VoiceOver focus away from the bundle items section without restarting their traversal from scratch — a keyboard (VoiceOver swipe) trap.
