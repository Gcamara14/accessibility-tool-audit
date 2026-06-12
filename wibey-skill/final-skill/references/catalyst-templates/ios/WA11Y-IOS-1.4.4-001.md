# Catalyst Template: Dynamic Type — Text Resize & Reflow (iOS)

**Template ID:** `WA11Y-IOS-1.4.4-001`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 1.4.4 Resize Text / 1.4.10 Reflow
**DT Rules:** DT-002, DT-003, DT-004, DT-005, DT-006, DT-007
**Source PRs:**
- [#45513](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/45513) | [WSC-1658](https://jira.walmart.com/browse/WSC-1658) — GlobalBanner text split/hard to read
- [#45516](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/45516) | [WSC-1657](https://jira.walmart.com/browse/WSC-1657) — Queue timer text cut on font increase
- [#50077](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/50077) | [WSC-578](https://jira.walmart.com/browse/WSC-578) — Product tile price not visible at large text
- [#63646](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/63646) | [OAMD-5080](https://jira.walmart.com/browse/OAMD-5080) — eBooks text truncated on resize

---

## The Problem

At large and accessibility Dynamic Type sizes, text gets truncated, clipped, overlapped, or becomes invisible because:
1. Containers have fixed-height constraints that clip growing text
2. Labels lack `adjustsFontForContentSizeCategory = true` so they don't scale in real-time
3. Labels have `numberOfLines = 1` causing truncation instead of wrapping
4. Fixed-width constraints prevent text from reflowing
5. Horizontal layouts don't reflow to vertical at accessibility sizes
6. Text compression resistance is too low, letting decorative/secondary elements squeeze labels

---

## Fix Patterns

### Pattern A: Enable Real-Time Font Scaling (DT-002)

From PR #63646 (OAMD-5080) — `EBookLinksView.swift` — eBooks labels didn't scale with system font size changes.

**Bad Code:**
```swift
private lazy var eBooksTitleLabel: LDLabel = {
    let label = LDLabel(style: .bodySmall, weight: .bold)
    label.textAlignment = .left
    return label
}()
```

**Good Code:**
```swift
private lazy var eBooksTitleLabel: LDLabel = {
    let label = LDLabel(style: .bodySmall, weight: .bold)
    label.textAlignment = .left
    label.translatesAutoresizingMaskIntoConstraints = false
    label.adjustsFontForContentSizeCategory = true
    label.numberOfLines = 0
    return label
}()
```

**Why:** `adjustsFontForContentSizeCategory = true` tells UIKit to re-render the label when the user changes their preferred text size in Settings. `numberOfLines = 0` allows the text to wrap instead of truncate.

---

### Pattern B: Remove Fixed-Height Constraints on Text Containers (DT-004)

From PR #45516 (WSC-1657) — `GlassCountdownTimer.swift` / `GlassUnitTimer.swift` — timer views had `widthAnchor.constraint(equalToConstant: 60)` / `widthAnchor.constraint(equalToConstant: 61)` causing text clipping.

**Bad Code:**
```swift
public override func constructView() {
    backgroundColor = model.color
    widthAnchor.constraint(equalToConstant: 60).activate()
    label.textAlignment = .center
}
```

**Good Code:**
```swift
public override func constructView() {
    backgroundColor = model.color
    // Removed: widthAnchor.constraint(equalToConstant: 60)
    label.textAlignment = .center
}

public override func constructSubviewLayoutConstraints() {
    NSLayoutConstraint.activate([
        label.constraints(pinningTo: self, priority: .required)
    ])
}
```

**Why:** Fixed-width constraints clip text at larger Dynamic Type sizes. Let Auto Layout size the container to fit its content.

---

### Pattern C: Replace Fixed-Width with Proportional Constraints (DT-004 variant)

From PR #63646 (OAMD-5080) — Button widths were hardcoded at 177pt, clipping at large text.

**Bad Code:**
```swift
buyInAppleButton.widthAnchor.constraint(equalToConstant: 177),
buyInGoogleButton.widthAnchor.constraint(equalToConstant: 177)
```

**Good Code:**
```swift
buyInAppleButton.widthAnchor.constraint(equalTo: stackView.widthAnchor, multiplier: 0.52),
buyInGoogleButton.widthAnchor.constraint(equalTo: stackView.widthAnchor, multiplier: 0.52)
```

**Why:** Proportional constraints scale with the available width rather than clipping at a fixed pixel value.

---

### Pattern D: Remove Fixed Row Heights / Add ScrollView (DT-004, DT-005)

From PR #63646 (OAMD-5080) — rows had `heightAnchor.constraint(equalToConstant: 48)`.
From PR #45516 (WSC-1657) — content lacked a scroll container.

**Bad Code:**
```swift
// Fixed row height clips text
appleStackView.heightAnchor.constraint(equalToConstant: 48),
googleStackView.heightAnchor.constraint(equalToConstant: 48),

// No scroll view — content overflows screen at large text
view.addAutoLayoutSubview(stackView)
NSLayoutConstraint.activate([
    stackView.constraints(pinningTo: view, edges: [.leading, .trailing, .bottom])
])
```

**Good Code:**
```swift
// Removed: heightAnchor.constraint(equalToConstant: 48)
// Let Auto Layout size rows to fit content

// Wrap in UIScrollView
let scrollView = UIScrollView()
view.addAutoLayoutSubview(scrollView)
scrollView.addAutoLayoutSubview(stackView)
NSLayoutConstraint.activate(
    scrollView.frameLayoutGuide.constraints(pinningTo: view),
    stackView.constraints(pinningTo: scrollView.contentLayoutGuide),
    scrollView.contentLayoutGuide.widthAnchor.constraint(
        equalTo: scrollView.frameLayoutGuide.widthAnchor
    )
)
```

**Why:** At accessibility text sizes, content grows vertically. `UIScrollView` with `contentLayoutGuide` lets the content scroll naturally while keeping the width pinned to the screen.

---

### Pattern E: Adaptive Layout Reflow with traitCollectionDidChange (DT-006)

From PR #45513 (WSC-1658) — `GlobalBanner.swift` — replaced horizontal `UIStackView` with manual constraints + trait-based reflow.

**Bad Code:**
```swift
// Horizontal stack never reflows — text gets squeezed
let stackView = UIStackView()
stackView.axis = .horizontal
stackView.distribution = .fill
stackView.spacing = Constants.columnSpacing
```

**Good Code:**
```swift
public override func traitCollectionDidChange(
    _ previousTraitCollection: UITraitCollection?
) {
    super.traitCollectionDidChange(previousTraitCollection)
    if UITraitCollection.current != previousTraitCollection {
        assignLayoutAnchorsForLabels()
    }
}

// Adaptive spacing based on content size category
private struct Constants {
    let accessibilityHeightSpacing: CGFloat = {
        switch UITraitCollection.current.preferredContentSizeCategory {
        case .accessibilityExtraExtraExtraLarge, .accessibilityExtraExtraLarge,
             .accessibilityExtraLarge, .accessibilityLarge, .accessibilityMedium:
            return LDSpacing.space16
        default:
            return LDSpacing.space8
        }
    }()
}
```

**Why:** At accessibility text sizes, horizontal layouts collide. Override `traitCollectionDidChange` to recalculate layout when the user changes text size. Use `preferredContentSizeCategory` to adapt spacing dynamically.

---

### Pattern F: Text Compression Resistance Priority (DT-007)

From PR #50077 (WSC-578) — `GlassProductList+PriceView.swift` / `GlassProductListBottomInfoView.swift` — product list prices were invisible because text labels had wrong compression resistance.

**Bad Code:**
```swift
// Price labels squeezed by sibling views
private let primaryPriceLabel: UILabel  // raw UILabel, no DT support
// No compression resistance set — defaults may not favor text
```

**Good Code:**
```swift
// Use LDLabel for built-in DT support
private let primaryPriceLabel: LDLabel
private let preDiscountedLabel: LDLabel

// Set compression resistance so text wins over decorative elements
primaryPriceLabel.setContentCompressionResistancePriority(.defaultHigh, for: .horizontal)
preDiscountedLabel.setContentCompressionResistancePriority(.defaultHigh, for: .horizontal)

// On the containing bottom bar, price wins over button
pricingView.setContentCompressionResistancePriority(.requiredCompliant, for: .horizontal)
rightButton.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)

// And for layout siblings that should yield to text
nameLabel.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
```

**Why:** When space is limited at large text sizes, Auto Layout uses compression resistance to decide what gets clipped. Text-bearing views should have higher priority than decorative or secondary elements.

---

### Pattern G: UILabel to LDLabel Migration

From PR #50077 (WSC-578) — Raw `UILabel` doesn't inherit Living Design's Dynamic Type support.

**Bad Code:**
```swift
private let primaryPriceLabel: UILabel
primaryPriceLabel = UILabel()
primaryPriceLabel.numberOfLines = 2
primaryPriceLabel.font = LDFont.subheading1().uiFont
```

**Good Code:**
```swift
private let primaryPriceLabel: LDLabel
primaryPriceLabel = LDLabel()
primaryPriceLabel.numberOfLines = 2
primaryPriceLabel.font = LDFont.subheading1().uiFont
primaryPriceLabel.textAlignment = .right
```

**Why:** `LDLabel` inherits Living Design's font scaling behavior. Raw `UILabel` in an LD codebase is a DT-001/DT-002 violation waiting to happen.

---

## Key Signals (For Pattern Matching)

Use this template when you see ANY of these in an iOS codebase:
- `heightAnchor.constraint(equalToConstant:)` or `widthAnchor.constraint(equalToConstant:)` on a view containing text
- `numberOfLines = 1` on a content label (not a chip/tag/tab)
- Missing `adjustsFontForContentSizeCategory = true` on any UIKit text control
- `UILabel` used instead of `LDLabel` in a Living Design codebase
- Horizontal `UIStackView` with no `isAccessibilityCategory` check
- No `UIScrollView` wrapping non-trivial content
- Text invisible/clipped in Accessibility Inspector at AX5

---

## Variations

| Var | PR | Description | DT Rules |
|---|---|---|---|
| Var 1 | #45513 (WSC-1658) | GlobalBanner: horizontal→manual layout + traitCollectionDidChange reflow + adaptive spacing | DT-004, DT-006 |
| Var 2 | #45516 (WSC-1657) | Queue timer: removed fixed width, added ScrollView, restructured nested stacks | DT-004, DT-005 |
| Var 3 | #50077 (WSC-578) | ProductList price: UILabel→LDLabel, compression resistance, adaptive spacing | DT-003, DT-004, DT-007 |
| Var 4 | #63646 (OAMD-5080) | eBooks: adjustsFontForContentSizeCategory, numberOfLines=0, proportional widths | DT-002, DT-003, DT-004 |

---

## Related Templates

- `WA11Y-IOS-2.4.3-001` — iOS: VoiceOver focus after collection view mutation
- `WA11Y-IOS-1.1.1-001` — iOS: Missing alt text (accessibilityLabel)
