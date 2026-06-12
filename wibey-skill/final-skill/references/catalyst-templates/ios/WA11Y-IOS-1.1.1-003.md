# Catalyst Template: Decorative Image or Banner Incorrectly Exposed to VoiceOver

**Template ID:** `WA11Y-IOS-1.1.1-003`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 1.1.1 Non-text Content
**Component:** Seller page decorative banner / Protection Plan decorative separator cell
**Source PRs:**
- [#154443](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/154443) | [CEPG-366487](https://jira.walmart.com/browse/CEPG-366487) | commit `150140cb8f41` — decorative seller page banner incorrectly exposed to VoiceOver
- [#142824](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/142824) | [CEPG-344279](https://jira.walmart.com/browse/CEPG-344279) | commit `488889a2d76a` — decorative separator in Protection Plan cell announced as empty element
**Ingested:** 2026-04-30

---

## The Problem

Purely decorative images, background banners, and separator cells are incorrectly exposed to VoiceOver. VoiceOver announces them as "image" (or with no meaningful content), creating noise for screen reader users navigating the page. WCAG 1.1.1 requires decorative images to be hidden from assistive technology so users are not interrupted by content that conveys no information.

**Root cause:** UIKit views default to `isAccessibilityElement = false` for most `UIView` subclasses, but some configurations (explicit `isAccessibilityElement = true`, `UIImageView` with a set image, or `UITableViewCell` subclasses) expose the view to VoiceOver even when it is decorative.

---

## Fix Patterns

### Pattern A: Decorative Background Banner / Image View (CEPG-366487)

**Bad Code:**
```swift
// ❌ Banner exposed to VoiceOver — announces "Walmart Local Finds, image"
//    but the text is already readable via adjacent labels
backgroundView.isAccessibilityElement = true
backgroundView.accessibilityLabel = .localized(.walmartLocalFinds)
```

**Good Code:**
```swift
// ✅ Decorative background hidden from VoiceOver
backgroundView.isAccessibilityElement = false
backgroundView.shouldGroupAccessibilityChildren = false
```

**Why This Works:** Setting `isAccessibilityElement = false` removes the view from the VoiceOver navigation order. Setting `shouldGroupAccessibilityChildren = false` prevents the view from becoming a VoiceOver grouping container — which would cause VoiceOver to "enter" the group and announce its children. Since the text content is already conveyed by adjacent, properly labelled labels, hiding the decorative background removes noise without losing information.

---

### Pattern B: Decorative Separator / Footer Cell (CEPG-344279)

**Bad Code (UIKit):**
```swift
// ❌ Cell defaults: isAccessibilityElement = true causes VoiceOver
//    to land on the separator with nothing meaningful to say
class ProtectionPlanDetailsFooterCell: UITableViewCell {
    // no accessibility configuration
}
```

**Good Code:**
```swift
// ✅ Cell and all descendants hidden from VoiceOver from the start
override func awakeFromNib() {
    super.awakeFromNib()
    isAccessibilityElement = false
    accessibilityElementsHidden = true
}

// Reset on reuse — important for UITableViewCell recycling
override func prepareForReuse() {
    super.prepareForReuse()
    isAccessibilityElement = false
    accessibilityElementsHidden = true
}
```

**Why This Works:** `accessibilityElementsHidden = true` hides the cell AND all its descendants from VoiceOver in a single call — preventing VoiceOver from landing on the separator or any subviews inside it. Overriding `prepareForReuse()` to re-apply the same flags ensures recycled cells do not pick up stale accessibility state from a previous cell that was configured differently.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Decorative view announced | "Walmart Local Finds, image" / empty element | Hidden — VoiceOver skips entirely |
| VoiceOver noise | User must swipe past decorative elements | No stop on decorative content |
| Cell recycling | Stale accessibility state possible | `prepareForReuse()` resets flags |
| Children hidden | `isAccessibilityElement = false` hides the view only | `accessibilityElementsHidden = true` also hides all descendants |

---

## Key Signals (For Pattern Matching)

- `UIImageView` or `UIView` with `isAccessibilityElement = true` and `accessibilityLabel` set to text already conveyed by adjacent labels
- Background image views, decorative banners, divider lines, separator cells announced by VoiceOver with no meaningful content
- `UITableViewCell` or `UICollectionViewCell` used purely as a visual spacer or separator — no interactive or informational content
- `accessibilityLabel` set on a view whose text duplicates adjacent, properly exposed labels
- Never set `accessibilityLabel` on a decorative element — it signals to VoiceOver that the element has meaning

---

## Key Rules

- `isAccessibilityElement = false` hides the view itself from VoiceOver
- `shouldGroupAccessibilityChildren = false` prevents the view from becoming a VoiceOver container that groups its children
- `accessibilityElementsHidden = true` hides the view AND all its descendants — use this when the parent container is purely decorative
- For `UITableViewCell` / `UICollectionViewCell`, also reset in `prepareForReuse()` to prevent stale state in recycled cells
- **Never** set `accessibilityLabel` on a decorative element — it signals to VoiceOver that the element has meaning

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | CEPG-366487 / PR #154443 | Seller page decorative background banner | `isAccessibilityElement = false` + `shouldGroupAccessibilityChildren = false` | Ingested |
| Var 2 | CEPG-344279 / PR #142824 | Protection Plan footer separator cell | `accessibilityElementsHidden = true` in `awakeFromNib` + `prepareForReuse` | Ingested |

---

## Related Templates

- `WA11Y-IOS-1.1.1-001` — iOS: Missing `accessibilityLabel` on informative image
- `WA11Y-IOS-1.1.1-002` — iOS: Informative image not exposed to VoiceOver (NBA banner, alt text from backend)
- `WA11Y-IOS-4.1.2-001` — iOS: Button role missing on custom tappable view
