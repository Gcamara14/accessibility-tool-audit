# Catalyst Template: Focus Order — Split Grouped Cell Into Two Focusable Elements to Expose a Secondary Interactive Button

**Template ID:** `WA11Y-IOS-2.4.3-010`
**Platform:** iOS
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-IOS-2.4.3-010`
**Source Tickets:** CSRETPB-94016
**Source PRs:** [glass-app #155967](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/155967)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`RestrictionPolicyCell` displayed a policy row with two interactive areas: the policy info (label) and a "View" link button. The original implementation set `isAccessibilityElement = true` on the entire cell with a `.button` trait and a combined label. This made the entire row a single VoiceOver focus stop, hiding the "View" link button completely.

```swift
// ❌ Before fix:
isAccessibilityElement = true
accessibilityTraits = .button
accessibilityLabel = "Restricted, Software Development Tools, All organizations"
accessibilityHint = .localized(.spendApprovalRestrictionsViewPolicyDetails)
// → VoiceOver: "Restricted, Software Development Tools, All organizations, button"
// → User double-taps: activates the whole cell (navigates somewhere)
// → "View" link button: completely unreachable by VoiceOver
// → User cannot independently focus or activate the "View" link
```

A VoiceOver user cannot access the "View" button because:
1. The cell is a single accessibility element — its children (including `viewLinkButton`) are not traversed
2. The cell has `.button` trait — double-tap activates the cell action, not the "View" button
3. There is no way to distinguish the cell action from the "View" button action using VoiceOver alone

**Symptom (Jira):** "'View' button not focusable by VoiceOver in policy list", "Screen reader cannot reach 'View Policy' link in Spend Policies", "VoiceOver user can't independently tap 'View' button on restriction row".

---

## ✅ The Fix Pattern

### Unflatten the cell: `isAccessibilityElement = false`, use `accessibilityElements` to expose both elements

```swift
// RestrictionPolicyCell.swift

private func configureAccessibility(with policy: RestrictedSpendPolicy, organizationName: String?) {
    // ✅ The cell is not a single accessibility element
    //    Its children are accessible via the accessibilityElements array
    isAccessibilityElement = false
    accessibilityIdentifier = "RestrictionPolicyCell"

    let appliesToAllText = organizationName
        ?? String.localized(.spendApprovalRestrictionsAppliesToAllOrganization)

    // ✅ Group 1: Policy info — content stack carries the combined label
    contentStackView.isAccessibilityElement = true
    contentStackView.accessibilityTraits = .staticText
    contentStackView.accessibilityLabel = "Restricted, \(policy.label), \(appliesToAllText)"

    // Suppress individual subviews — they are covered by contentStackView's label
    restrictedTag.isAccessibilityElement = false
    titleLabel.isAccessibilityElement = false
    subtitleLabel.isAccessibilityElement = false

    // ✅ Group 2: "View" link button — independently focusable and activatable
    viewLinkButton.isAccessibilityElement = true
    viewLinkButton.accessibilityTraits = .button
    viewLinkButton.accessibilityLabel = .localized(.spendApprovalRestrictionsViewDetails)
    viewLinkButton.accessibilityHint = .localized(.spendApprovalRestrictionsViewPolicyDetails)

    // ✅ Explicit element order: info first, then action
    accessibilityElements = [contentStackView, viewLinkButton]
}
```

---

### ❌ Bad Code — single element hides the link button

```swift
// ❌ Before fix:
isAccessibilityElement = true
accessibilityTraits = .button
accessibilityLabel = "Restricted, \(policy.label), \(appliesToAllText)"
accessibilityHint = .localized(.spendApprovalRestrictionsViewPolicyDetails)
// ← viewLinkButton hidden — the cell IS the only focus stop
// ← User hears "button" → double-taps → whatever cell.touchAction does
// ← "View" button is completely inaccessible
```

---

### VoiceOver traversal comparison

```
Before fix:
  Swipe → "Restricted, Software Development Tools, All organizations, button"
           ← cell is one element; "View" button unreachable
  Swipe → [next cell or end of list]

After fix:
  Swipe → "Restricted, Software Development Tools, All organizations"
           ← contentStackView (policy info, read-only)
  Swipe → "View, View policy details, button"
           ← viewLinkButton (independently activatable)
  Swipe → [next cell]
```

---

### When to use this pattern vs. keeping the cell as a single element

| Scenario | Approach |
|---|---|
| Cell with single action (tap to navigate to detail) | Single element: `isAccessibilityElement = true`, `.button` trait |
| Cell with primary action + secondary link | Unflattened: `accessibilityElements = [infoGroup, linkButton]` |
| Cell with multiple buttons (e.g., Add, Remove) | Unflattened: `accessibilityElements = [infoGroup, addButton, removeButton]` |
| Cell with contextual action only (no dedicated button) | Single element with `.button` trait and `accessibilityHint` |

The key question: **can VoiceOver users independently reach and activate each interactive element?** If multiple distinct actions exist in a row, each must be a separate focus stop.

---

### `contentStackView` as the info group

When grouping the content label, title, and description into `contentStackView`:

```swift
// ✅ Set the stack view's accessibilityLabel to the combined content string
contentStackView.isAccessibilityElement = true
contentStackView.accessibilityTraits = .staticText
contentStackView.accessibilityLabel = "Restricted, \(policy.label), \(appliesToAllText)"

// ✅ Suppress child views — their content is in the group label
restrictedTag.isAccessibilityElement = false
titleLabel.isAccessibilityElement = false
subtitleLabel.isAccessibilityElement = false
// ← If these were left accessible, VoiceOver would focus them individually
//    as well as the contentStackView — creating triple announcements

// ❌ Do NOT set accessibilityElementsHidden = true on contentStackView's children
//    if you need them to remain visible in the hierarchy for touch handling
restrictedTag.accessibilityElementsHidden = true  // use this form if deep suppression needed
```

---

### Exposing the `contentStackView` for testability

When adding the `contentStackView` to `accessibilityElements`, it must be accessible from unit tests:

```swift
// ❌ Private — not testable
private let contentStackView = UIStackView(...)

// ✅ Internal — accessible to test targets in the same module
let contentStackView = UIStackView(...)

// Test:
func testViewLinkButtonIsSeparateAccessibilityElement() {
    let elements = cell.accessibilityElements as? [UIView] ?? []
    XCTAssertTrue(elements.contains(cell.viewLinkButton))
    XCTAssertTrue(cell.viewLinkButton.isAccessibilityElement)
    XCTAssertTrue(cell.viewLinkButton.accessibilityTraits.contains(.button))
}

func testContentStackViewIsFirstElement() {
    let elements = cell.accessibilityElements as? [UIView] ?? []
    XCTAssertEqual(elements.first, cell.contentStackView)
    XCTAssertFalse(elements.first?.accessibilityTraits.contains(.button) ?? true,
                   "Info group must not have .button trait")
}
```

---

## 🔑 Key Rules

- **Set `isAccessibilityElement = false` on the cell and use `accessibilityElements` when a row has more than one interactive control** — a single accessibility element on the cell hides every child from VoiceOver. Any secondary button, link, or toggle inside the cell becomes unreachable.
- **Create a content group by setting `isAccessibilityElement = true` on the container stack with a combined `accessibilityLabel`** — this provides the cell's information in a single well-formed focus stop, followed separately by the action button(s).
- **Suppress child views covered by the group label** — set `isAccessibilityElement = false` on `restrictedTag`, `titleLabel`, `subtitleLabel` etc. when their content is already included in the group label. Without suppression, VoiceOver focuses them individually in addition to the group.
- **Put info first, action(s) last in `accessibilityElements`** — `accessibilityElements = [contentStackView, viewLinkButton]` ensures VoiceOver announces the context before presenting the action. This mirrors the natural reading order.
- **Add unit tests verifying `accessibilityElements` count and element identity** — count assertions like `XCTAssertEqual(elements.count, 2)` will catch regressions where the list is collapsed back to a single element.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation. When a cell's secondary link ("View") is grouped under the cell's single accessibility element and thus unreachable by VoiceOver, it fails 2.4.3 — the "View" component never receives focus at all, making its functionality completely inaccessible to VoiceOver users. The fix ensures the link receives its own focus stop, in the correct position after the policy information.

