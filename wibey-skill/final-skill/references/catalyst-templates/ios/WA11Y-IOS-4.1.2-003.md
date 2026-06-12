# Catalyst Template: Expanded/Collapsed State Not Communicated to VoiceOver

**Template ID:** `WA11Y-IOS-4.1.2-003`
**Platform:** iOS (UIKit / SwiftUI)
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Component:** `CafAccordionView` — ACC Digital CAF accordion/disclosure headers (custom `UIView` subclasses)
**Source PR:** [#116120](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/116120) | [CEPG-296542](https://jira.walmart.com/browse/CEPG-296542)
**Merged:** ACC Digital CAF (Credit Application Flow)
**Ingested:** 2026-04-14

---

## The Problem

FAQ/accordion sections in iOS apps use custom `UIView` header buttons. When a user taps a header to expand or collapse the content section, VoiceOver users lose focus and cannot re-orient because:

1. No `UIAccessibility.post(.layoutChanged)` notification is posted after the expand/collapse animation — VoiceOver focus jumps to the top of the screen
2. No `accessibilityValue` is set — VoiceOver reads only the label and trait, never "expanded" or "collapsed"
3. The header's `accessibilityTraits` may not include `.button` — VoiceOver does not signal the element is interactive

**Web equivalent:** `aria-expanded="true|false"` on the trigger element.

**Root cause:** UIKit has no built-in `aria-expanded` equivalent. Developers must manually post a `.layoutChanged` notification (with a delay to let the animation complete) and optionally communicate state via `accessibilityValue`.

---

## Fix Patterns

### Pattern A: Post `.layoutChanged` After Expand/Collapse to Re-anchor VoiceOver Focus (UIKit)

**Bad Code:**
```swift
class CafAccordionView: BaseView {
    func toggleSection() {
        collapseView.toggle()
        // ❌ No VoiceOver notification after state change
        // Focus is lost — VoiceOver jumps to top of screen
        detailsStackView.arrangedSubviews.forEach {
            $0.isAccessibilityElement = !collapseView.isCollapsed
            $0.accessibilityElementsHidden = collapseView.isCollapsed
        }
    }
}
```

**Good Code:**
```swift
class CafAccordionView: BaseView {
    func toggleSection() {
        collapseView.toggle()
        detailsStackView.arrangedSubviews.forEach {
            $0.isAccessibilityElement = !collapseView.isCollapsed
            $0.accessibilityElementsHidden = collapseView.isCollapsed
        }
        // ✅ 0.5s delay allows animation to complete before VoiceOver re-reads the element
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [self] in
            UIAccessibility.post(
                notification: .layoutChanged,
                argument: topFoldView  // ✅ re-anchor focus to section header
            )
        }
    }
}
```

---

### Pattern B: `accessibilityValue` for Expanded/Collapsed State (Combined with `.layoutChanged`)

When additional state communication is needed beyond focus re-anchoring, pair `accessibilityValue` with the `.layoutChanged` notification:

```swift
class FAQHeaderView: UIView {
    var isExpanded: Bool = false {
        didSet {
            updateContent()
            accessibilityValue = isExpanded ? "expanded" : "collapsed"
            // Re-focus VoiceOver on the header after layout settles
            UIAccessibility.post(
                notification: .layoutChanged,
                argument: self
            )
        }
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        isAccessibilityElement = true
        accessibilityTraits = .button
        accessibilityValue = "collapsed" // set initial state explicitly
    }
}
// VoiceOver (collapsed): "How do I cancel my subscription?, collapsed, button"
// VoiceOver (expanded):  "How do I cancel my subscription?, expanded, button"
```

> **When to use `.announcement` instead:** If content is hidden with `alpha = 0` (view is still in tree), post `.announcement` with the new state string:
> ```swift
> UIAccessibility.post(notification: .announcement,
>                      argument: isExpanded ? "Expanded" : "Collapsed")
> ```

---

### Pattern C: SwiftUI `DisclosureGroup` with Explicit `accessibilityValue`

**Bad Code:**
```swift
DisclosureGroup(faqTitle) {
    faqContent
}
// SwiftUI state announcement is platform-version-dependent — not guaranteed
```

**Good Code:**
```swift
struct FAQRow: View {
    let title: String
    let content: String
    @State private var isExpanded: Bool = false

    var body: some View {
        DisclosureGroup(isExpanded: $isExpanded) {
            Text(content)
        } label: {
            Text(title)
        }
        .accessibilityValue(isExpanded ? "expanded" : "collapsed")
    }
}
// VoiceOver: "How do I cancel my subscription?, expanded, button"
```

---

### Pattern D: Localized Strings for `accessibilityValue`

```swift
// In Localizable.strings:
// "accessibility.state.expanded"  = "expanded";
// "accessibility.state.collapsed" = "collapsed";

accessibilityValue = isExpanded
    ? NSLocalizedString("accessibility.state.expanded", comment: "Accordion expanded state")
    : NSLocalizedString("accessibility.state.collapsed", comment: "Accordion collapsed state")
```

---

## Why This Works

| Aspect | Before (Bug) | After (Fix) |
|---|---|---|
| Focus after toggle | VoiceOver jumps to top of screen | `.layoutChanged` with 0.5s delay re-anchors focus to `topFoldView` header |
| State communication | None — VoiceOver reads label + trait only | Optional: `accessibilityValue` announces "expanded" / "collapsed" |
| Interactivity signal | Missing `.button` → element may sound inert | `.button` trait signals the element is activatable |
| State-change feedback | User must swipe through content to infer state | `.layoutChanged` argument targets section header; VoiceOver re-reads it immediately |
| SwiftUI parity | `DisclosureGroup` alone is version-fragile | `.accessibilityValue()` modifier guarantees announcement |
| Localization | Hard-coded English strings | `NSLocalizedString` supports all locales |

---

## Key Signals (For Pattern Matching)

- `UIView` subclass with `isExpanded: Bool` that has no corresponding `accessibilityValue` assignment
- `UIStackView.isHidden` toggled inside a tap handler with no `UIAccessibility.post(...)` call
- Custom accordion/FAQ/collapsible section views without `isAccessibilityElement = true` or `.button` trait
- `DisclosureGroup` used without explicit `.accessibilityValue()` modifier
- VoiceOver bug reports: "can't tell if section is open or closed", "no announcement when tapping header"
- `accessibilityTraits = .header` on an element that is also interactive — header trait alone does not convey expanded/collapsed state

---

## Variations

| Var | Ticket | Screen | Status |
|---|---|---|---|
| Var 1 | CEPG-296542 / PR #116120 | ACC Digital CAF — `CafAccordionView` accordion toggle missing `.layoutChanged` notification; VoiceOver focus lost after expand/collapse | Ingested |

---

## Related Templates

- `WA11Y-IOS-4.1.2-001` — iOS: Missing `.button` trait on custom tappable view
- `WA11Y-IOS-4.1.2-002` — iOS: Missing accessible name on icon-only buttons
- `WA11Y-IOS-2.4.3-001` — iOS: Focus management after dynamic collection view updates
- `WA11Y-WEB-4.1.2-010` — Web: `aria-expanded` + `aria-controls` accordion triad
