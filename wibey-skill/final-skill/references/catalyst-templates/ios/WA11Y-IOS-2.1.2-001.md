# Catalyst Template: VoiceOver Focus Trapped Between Sections — No Keyboard Trap

**Template ID:** `WA11Y-IOS-2.1.2-001`
**Platform:** iOS (UIKit / SwiftUI)
**WCAG Criterion:** 2.1.2 No Keyboard Trap
**Confluence Rule:** Navigation: Focus Cannot Escape a Region / Focus Trap in Swipe Navigation
**Component:** Store details bottom sheet — "Service hours" / "Holiday Hours" section boundary
**Source PRs:** [#145371](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/145371) (CEPG-341947 — Var 1) · [#156713](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/156713) (CEPG-341972 — Var 2)
**Merged:** glass-app · Store Mode (Var 1) · Item Details / Soft Bundle (Var 2)

---

## The Problem

On the Store details bottom sheet (reached via Services → Find a Store), VoiceOver swipe navigation gets **permanently trapped** between the "Service hours" section and the "Holiday Hours" heading. Users can swipe left/right within that region, but further swipes do not escape — focus loops back indefinitely. Users cannot reach the content below "Holiday Hours" or return to the top of the page via normal swipe traversal.

This violates **WCAG 2.1.2** because the user cannot move focus away from the trapped region using the standard VoiceOver swipe gesture (equivalent to a keyboard interface). The only escape would be a gesture that is non-standard or requires knowledge of workarounds — an unacceptable burden on AT users.

**Root cause:** One or more of the following common patterns in iOS:
1. A container view has `accessibilityElements` set to an **incomplete array** that includes "Service hours" and "Holiday Hours" header but not the content/elements beyond, causing VoiceOver to loop within those listed elements.
2. A bottom sheet or scroll view container has `accessibilityViewIsModal = true` without being a true modal — locking VoiceOver traversal to only its own subtree.
3. A `UITableView` section header has a custom `accessibilityElementAfterElement` / `accessibilityElementBeforeElement` override that creates a circular reference.
4. SwiftUI: A section wrapper uses `.accessibilityElement(children: .contain)` creating a closed container that VoiceOver cannot exit.

**Why this is 2.1.2, not 2.4.3:**

| Criterion | Rule | Applies? |
|---|---|---|
| 2.4.3 Focus Order | Focus moves but in the wrong sequence | ❌ Not the failure — focus doesn't move at all |
| **2.1.2 No Keyboard Trap** | Focus gets stuck and cannot be moved away from a component via standard AT gesture | ✅ Further swipes loop; user cannot escape the "Service hours"/"Holiday Hours" boundary |

---

## Fix Patterns

### Pattern A: Remove or Correct an Incomplete `accessibilityElements` Array

The most common cause of section-level focus traps is an `accessibilityElements` array set on a container that doesn't include all navigable children.

**Bad Code:**
```swift
class StoreHoursContainerView: UIView {

    override init(frame: CGRect) {
        super.init(frame: frame)
        // ❌ Incomplete array — holiday hours header included, but content beyond it is NOT
        // VoiceOver loops between serviceHoursSection and holidayHoursHeader indefinitely
        accessibilityElements = [serviceHoursSection, holidayHoursHeader]
    }
}
```

**Good Code:**
```swift
class StoreHoursContainerView: UIView {

    override init(frame: CGRect) {
        super.init(frame: frame)
        // ✅ Option 1: Nil — let VoiceOver traverse children in view hierarchy order
        accessibilityElements = nil

        // ✅ Option 2: Complete, ordered array including all elements and exit paths
        accessibilityElements = [
            serviceHoursHeader,
            serviceHoursContent,
            holidayHoursHeader,
            holidayHoursContent,
            nextSectionView       // ✅ Continues beyond the trapped region
        ]
    }
}
```

---

### Pattern B: Check and Fix `accessibilityViewIsModal` on Non-Modal Bottom Sheets

`accessibilityViewIsModal = true` tells VoiceOver to restrict focus to the view's subtree — correct for true modal dialogs, but wrong for informational bottom sheets that should allow full page traversal.

**Bad Code:**
```swift
class StoreDetailBottomSheetViewController: UIViewController {

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // ❌ Treating an informational sheet as a modal — VoiceOver locked to sheet subtree
        view.accessibilityViewIsModal = true
    }
}
```

**Good Code:**
```swift
class StoreDetailBottomSheetViewController: UIViewController {

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        // ✅ Not a blocking modal — allow normal VoiceOver traversal across the page
        view.accessibilityViewIsModal = false
        // Only set to true for true modal dialogs (alert sheets, destructive confirm dialogs)
    }
}
```

> **Decision rule:** `accessibilityViewIsModal = true` if and only if the user **cannot and should not** interact with any other UI while the view is visible (e.g., an alert or confirm dialog). Store detail sheets, info sheets, and expandable panels are NOT modals.

---

### Pattern C: Fix Circular `accessibilityElementAfterElement` / `accessibilityElementBeforeElement` Overrides

**Bad Code:**
```swift
class ServiceHoursSectionView: UIView {

    override func accessibilityElementAfterElement(_ element: Any) -> Any? {
        // ❌ Returns the section's own header — creates a loop
        return serviceHoursHeader
    }
}
```

**Good Code:**
```swift
class ServiceHoursSectionView: UIView {

    // ✅ Don't override — let UIKit traverse naturally via view hierarchy
    // Only override if you need to SKIP elements, and ensure the chain exits the section
}
```

---

### Pattern D: SwiftUI — Use `.passthrough` Instead of `.contain` for Navigation Containers

**Bad Code:**
```swift
struct StoreHoursSection: View {
    var body: some View {
        VStack {
            Text("Service hours").font(.headline)
            ServiceHoursGrid()
            Text("Holiday Hours").font(.headline)
            HolidayHoursGrid()
        }
        // ❌ .contain creates a closed accessibility scope — VoiceOver cannot exit this VStack
        .accessibilityElement(children: .contain)
    }
}
```

**Good Code:**
```swift
struct StoreHoursSection: View {
    var body: some View {
        VStack {
            Text("Service hours").font(.headline)
            ServiceHoursGrid()
            Text("Holiday Hours").font(.headline)
            HolidayHoursGrid()
        }
        // ✅ .passthrough — VoiceOver traverses children and continues past the container
        .accessibilityElement(children: .passthrough)
        // Or simply remove the .accessibilityElement modifier entirely
    }
}
```

---

### Pattern E: UITableView Section Headers — Verify No Focus Loop in Section Delegation

When using `UITableView` with custom section headers, ensure the section header view does not become an `isAccessibilityElement = true` container that absorbs focus from its section cells:

```swift
class StoreHoursSectionHeaderView: UIView {

    override func awakeFromNib() {
        super.awakeFromNib()
        // ❌ If set to true AND the header also has accessibilityElements pointing back to itself:
        // isAccessibilityElement = true  → remove or ensure no circular accessibilityElements

        // ✅ Let the header be a simple accessible element with a heading role
        isAccessibilityElement = true
        accessibilityTraits = .header
        accessibilityLabel = NSLocalizedString("Service hours", comment: "Section header")
        // Do NOT set accessibilityElements on the header itself — cells are siblings, not children
    }
}
```

---

## Why This Works

| Aspect | Before (Bug) | After (Fix) |
|---|---|---|
| Swipe right past "Service hours" | Loops back to section start | Advances to "Holiday Hours" content |
| Swipe right past "Holiday Hours" | Permanently trapped; further swipes do nothing | Advances to the next section / element |
| `accessibilityElements` | Incomplete array or circular reference | Nil (natural hierarchy) or complete ordered array |
| `accessibilityViewIsModal` | True on non-modal sheet — locks traversal scope | False — full page traversal allowed |
| WCAG 2.1.2 | Fails — focus cannot escape the trapped region | Passes — swipe navigation exits normally |

---

## Key Signals (For Pattern Matching)

- VoiceOver swipe right past a heading or section header loops back — further swipes don't advance
- User reports: "swiping right does nothing after [section name]", "stuck in a loop", "can't get past [element]"
- `accessibilityElements` array set on a scroll view, stack view, or container that does not include all navigable descendants
- `accessibilityViewIsModal = true` on a non-blocking bottom sheet, info card, or collapsible panel
- `UITableView` with custom section header views where the header has `isAccessibilityElement = true` and also has `accessibilityElements` set
- SwiftUI `.accessibilityElement(children: .contain)` wrapping a section that is NOT a standalone widget (e.g., a navigation-flow section vs. a single composite control)
- Store Mode / store details / store hours pages in the CEPG project (confirmed repeat domain)

---

## Variations

| Var | Ticket | Screen | Root Cause | Status |
|---|---|---|---|---|
| Var 1 | CEPG-341947 / PR #145371 | Store details — Service hours / Holiday Hours boundary | `storeHourList.subAccessibilityElements` not cleared in `prepareForReuse()` — stale `HourView` instances remain in VoiceOver tree after UITableViewCell reuse, trapping traversal in the hours section | Ingested |
| Var 2 | CEPG-341972 / PR #156713 | Item Page — Frequently Bought Together soft bundle items | `accessibilityElements = [stackView]` creates 4-level nesting — backward swipe traps VoiceOver on last bundle tile; hierarchy flattening (`accessibilityElements = stackView.accessibilityElements`) + per-tile composite element fixes | Ingested |

---

### Pattern F: Clear Custom Accessibility Element Arrays in `prepareForReuse()` (UITableViewCell)

When a UITableViewCell sub-view maintains its own custom accessibility element array (e.g., a `subAccessibilityElements: [UIView]` property populated by hour rows), failing to reset it in `prepareForReuse()` causes stale view references to persist in the VoiceOver tree after cell recycling. VoiceOver then sees both old and new rows simultaneously and can get trapped cycling between them.

**Bad Code:**
```swift
final class StoreDetailsCell: BaseStoreDetailCell {

    override func prepareForReuse() {
        super.prepareForReuse()
        heading = nil
        model = nil
        // ❌ Missing reset — storeHourList.subAccessibilityElements still holds
        // HourView instances from the previous cell's service hours / holiday hours rows.
        // VoiceOver loops between stale and fresh rows; traversal cannot escape the section.
    }
}
```

**Good Code:**
```swift
final class StoreDetailsCell: BaseStoreDetailCell {

    override func prepareForReuse() {
        super.prepareForReuse()
        heading = nil
        model = nil
        storeHourList.subAccessibilityElements = []  // ✅ Clears stale HourView references before reuse
    }
}
```

> **General rule:** Any UIView subclass that maintains a custom property driving accessibility element membership (not UIKit's built-in `accessibilityElements`) must reset that property in `prepareForReuse()`. The same applies to `accessibilityElements` itself if it is explicitly set per-cell.

---

## Var 1 — Service Hours / Holiday Hours Trap (CEPG-341947 / PR #145371)

**Screen:** Store details bottom sheet (Services → Find a Store → Store details) — Service hours and Holiday Hours section  
**Symptom:** VoiceOver swipe navigation gets permanently trapped between the "Service hours" rows and "Holiday Hours" heading. Further right swipes loop back; user cannot escape the region.  
**WCAG:** 2.1.2 No Keyboard Trap  
**Root Cause:** `storeHourList.subAccessibilityElements` — a custom `[UIView]` property on the store hour list sub-view — was not reset in `StoreDetailsCell.prepareForReuse()`. After the table view recycled the cell, VoiceOver retained stale `HourView` instances from the previous display in addition to the newly populated ones, causing it to loop between rows that no longer corresponded to visible content.

**File: `StoreDetailsCell.swift`**

```swift
// ❌ Bad — prepareForReuse() does not clear the hour list's accessibility element array
final class StoreDetailsCell: BaseStoreDetailCell {

    override func prepareForReuse() {
        super.prepareForReuse()
        heading = nil
        model = nil
        // storeHourList.subAccessibilityElements retains stale HourView instances →
        // VoiceOver sees old rows + new rows → traps between Service hours / Holiday Hours
    }
}

// ✅ Good — clear subAccessibilityElements before the cell is populated with new data
final class StoreDetailsCell: BaseStoreDetailCell {

    override func prepareForReuse() {
        super.prepareForReuse()
        heading = nil
        model = nil
        storeHourList.subAccessibilityElements = []  // ✅ VoiceOver tree is clean before reuse
    }
}
```

**Supporting context — `SensoryView.swift` (defines `subAccessibilityElements`):**
```swift
final class SensoryView: BaseView {
    // This property stores HourView instances for the store hour list rows.
    // Must be cleared in StoreDetailsCell.prepareForReuse() or stale rows persist.
    var subAccessibilityElements: [UIView] = []
}
```

---

## Var 2 — Soft Bundle Items Backward Navigation Trap (CEPG-341972 / PR #156713)

**Screen:** Item Page → Frequently Bought Together → Bundle offer expand → soft bundle item tiles  
**Symptom:** VoiceOver swipe right through all bundle tiles, then swipe left to navigate backward — focus is trapped on the **last** bundle tile card. Further left swipes do nothing.  
**WCAG:** 2.1.2 No Keyboard Trap  
**Root Cause:** Two compounding issues — (1) `SoftBundleItemVerticalTileContainerView` set `accessibilityElements = [stackView]`, wrapping tiles inside a 4-level nested accessibility hierarchy; backward traversal had no exit from the deepest level. (2) `SoftBundleItemVerticalTileView` exposed individual sub-elements (`productTitle`, `primaryPriceLabel`, `secondaryPriceLabel`) as separate `isAccessibilityElement = true` nodes, causing VoiceOver to cycle within a single tile and never reach adjacent tiles.

**File 1: `SoftBundleItemVerticalTileContainerView.swift`**

```swift
// ❌ Bad — wraps tile views inside [stackView], creating a 4-level accessibility hierarchy
// Backward VoiceOver swipe cannot exit the nested stackView level → trapped on last tile
private func updateAccessibility() {
    isAccessibilityElement = false
    stackView.isAccessibilityElement = false
    accessibilityElements = [stackView]  // ❌ stackView wraps tiles — VoiceOver cannot escape backward
    accessibilityIdentifier = String(describing: type(of: self)) + "_containerView"
}

// ✅ Good — flatten: promote stackView's children directly to the container's accessibility elements
private func updateAccessibility() {
    isAccessibilityElement = false
    stackView.isAccessibilityElement = false
    accessibilityElements = stackView.accessibilityElements  // ✅ tile views exposed directly — no nesting trap
    accessibilityIdentifier = String(describing: type(of: self)) + "_containerView"
}
```

**File 2: `SoftBundleItemVerticalTileView.swift`**

```swift
// ❌ Bad — individual sub-elements each have isAccessibilityElement = true
// VoiceOver enters one tile and cycles between productTitle / prices without advancing to the next tile
[imageView, checkbox, ratingsView].forEach { $0.isAccessibilityElement = false }
promotionMessageView?.isAccessibilityElement = false
primaryPriceLabel.isAccessibilityElement = true    // ❌ sub-element — VoiceOver stops here separately
secondaryPriceLabel.isAccessibilityElement = true  // ❌ sub-element
productTitle.isAccessibilityElement = true         // ❌ sub-element
containerView.isAccessibilityElement = false       // ❌ container hidden — exposes sub-elements

// ✅ Good — each tile is a single composite accessibility element with a composed label
[imageView, checkbox, ratingsView].forEach { $0.isAccessibilityElement = false }
promotionMessageView?.isAccessibilityElement = false
// (no longer setting primaryPriceLabel / secondaryPriceLabel / productTitle individually)
containerView.isAccessibilityElement = true        // ✅ single VoiceOver stop per tile
containerView.accessibilityLabel = accessibilityText  // composed: product name + prices + ratings
containerView.accessibilityTraits = .button
```

**Why This Works:**
- **Hierarchy flattening:** `accessibilityElements = stackView.accessibilityElements` bypasses the stackView wrapper, exposing the tile views directly at the container level. VoiceOver can traverse tiles sequentially and exit the section normally in both directions.
- **Composite tile element:** Making `containerView.isAccessibilityElement = true` collapses the tile's sub-labels into a single VoiceOver stop. Prevents focus from cycling within one tile and not advancing to the adjacent tile.

---

## Related Templates

- `WA11Y-IOS-2.4.3-001` — iOS: Wrong focus order after collection view update (focus moves, wrong sequence)
- `WA11Y-IOS-2.4.3-002` — iOS: Stale accessibility tree in dynamic nudge views
- `WA11Y-IOS-2.4.3-003` — iOS: Dynamic badge injection disrupts VoiceOver reading order
- `WA11Y-WEB-2.1.2-001` — Web: Focus trapped in modal without Escape key exit
