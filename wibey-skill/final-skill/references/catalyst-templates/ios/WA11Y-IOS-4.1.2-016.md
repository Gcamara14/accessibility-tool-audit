# Catalyst Template: Name, Role, Value — "See More/Less" Button Off-Screen After Animation: `UIAccessibilityElement` Proxy with Auto-Scroll on Focus

**Template ID:** `WA11Y-IOS-4.1.2-016`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-016`
**Source Tickets:** CEPG-369681
**Source PRs:** [glass-app #158444](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/158444)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`CollapsibleShowMore` and `CollapsibleSectionView` render expandable content sections with "See more"/"See less" toggle buttons. Two related failures:

### Failure 1 — Stale frame: `.layoutChanged` fired before animation completes

`CollapsibleShowMore` posted `.layoutChanged` **before** the animation finished:

```swift
// ❌ Before fix — notification fires before animation settles
UIView.animate(withDuration: 0.33, delay: delay) {
    self.setContentHeight()
}
UIAccessibility.post(notification: .layoutChanged, argument: collapseButton)
// ← Fires immediately after UIView.animate returns (synchronous call)
// ← Animation is still running — VoiceOver queries button frame mid-animation
// ← Stale frame: button is at a position it won't be at when animation finishes
// ← VoiceOver double-tap activates the wrong element (stale frame is wrong location)
```

`CollapsibleSectionView` never posted `.layoutChanged` at all after expand/collapse, leaving buttons further down the page with stale frames.

### Failure 2 — Button off-screen: VoiceOver focuses a button that scrolled outside the viewport

After content expansion, "See more"/"See less" buttons scroll below the bottom of the screen. VoiceOver can still focus them (they're in the layout), but double-tap activates the wrong area because the button's frame is outside the visible viewport.

**Symptom (Jira):** "VoiceOver double-tap on See more activates wrong element", "See more/See less button not activatable by VoiceOver after expand", "Screen reader focuses collapse button but double-tap does nothing", "VoiceOver stale frame after collapsible section animates".

---

## ✅ The Fix Pattern

### Part 1 — Post `.layoutChanged` in animation `completion` block

```swift
// CollapsibleShowMore.swift

private func toggleCollapse() {
    UIView.animate(
        withDuration: 0.33,
        delay: delay,
        animations: {
            self.setContentHeight()
        },
        // ✅ Post .layoutChanged AFTER animation settles — VoiceOver reads final frame
        completion: { _ in
            UIAccessibility.post(
                notification: .layoutChanged,
                argument: self.buttonProxy  // use proxy, not real button
            )
        }
    )
}
```

```swift
// CollapsibleSectionView.swift

private func toggleSection(isCollapsed: Bool, shouldShowAnimation: Bool) {
    headerStackViewCenterYConstraint?.isActive = isCollapsed

    if shouldShowAnimation {
        let delay = isCollapsed ? 0.0 : 0.4
        UIView.animate(
            withDuration: 0.33,
            delay: delay,
            animations: {
                self.collapsibleView.alpha = self.isCollapsed ? 0 : 1
            },
            // ✅ Notify after expand/collapse so downstream buttons get updated frames
            completion: { _ in
                UIAccessibility.post(
                    notification: .layoutChanged,
                    argument: self.headerStackView
                )
            }
        )
    } else {
        // ✅ Non-animated collapse also needs .layoutChanged
        UIAccessibility.post(
            notification: .layoutChanged,
            argument: headerStackView
        )
    }

    layoutIfNeeded()
    collapsibleUpdateClosure?(isCollapsed)
}
```

---

### Part 2 — `CollapseButtonAccessibilityElement` proxy: auto-scroll on VoiceOver focus

```swift
// CollapsibleShowMore.swift

/// Custom UIAccessibilityElement that wraps the See more/See less button.
/// On VoiceOver focus, walks up to the nearest UIScrollView and calls
/// scrollRectToVisible so the button is always in the viewport before
/// the user double-taps to activate it.
final class CollapseButtonAccessibilityElement: UIAccessibilityElement {
    weak var button: UIButton?
    var onActivate: (() -> Void)?

    init(accessibilityContainer: Any, button: UIButton) {
        self.button = button
        super.init(accessibilityContainer: accessibilityContainer)
    }

    /// Returns the button's frame in window coordinates — the live frame, not a cached one.
    override var accessibilityFrame: CGRect {
        get {
            guard let button, let window = button.window else {
                return super.accessibilityFrame
            }
            // ✅ Converts button.bounds to window space (the coordinate system VoiceOver uses)
            return button.convert(button.bounds, to: window)
        }
        set { super.accessibilityFrame = newValue }
    }

    /// Called by VoiceOver when this element receives focus.
    /// Scrolls the button into the nearest enclosing UIScrollView.
    override func accessibilityElementDidBecomeFocused() {
        guard let button else { return }
        // ✅ Walk up the view hierarchy to find the nearest scroll view
        var current: UIView? = button.superview
        while let view = current {
            if let scrollView = view as? UIScrollView {
                let frameInScrollView = button.convert(button.bounds, to: scrollView)
                scrollView.scrollRectToVisible(frameInScrollView, animated: true)
                break
            }
            current = view.superview
        }
    }

    /// Called by VoiceOver double-tap. Delegates to the actual button's action.
    override func accessibilityActivate() -> Bool {
        onActivate?()
        return true
    }
}
```

---

### Setting up the proxy in `CollapsibleShowMore`

```swift
// CollapsibleShowMore.swift

private var buttonProxy: CollapseButtonAccessibilityElement?

private func setupAccessibility() {
    isAccessibilityElement = false

    // ✅ Real button hidden from VoiceOver — proxy takes over
    collapseButton.isAccessibilityElement = false

    // ✅ Create proxy wrapping the real button
    let proxy = CollapseButtonAccessibilityElement(
        accessibilityContainer: self,
        button: collapseButton
    )
    proxy.accessibilityLabel = collapseText.text  // "See more" or "See less"
    proxy.accessibilityHint = collapseButton.accessibilityHint
    proxy.accessibilityTraits = .button
    proxy.onActivate = { [weak self] in
        self?.collapseTapped()
    }
    buttonProxy = proxy

    // ✅ Expose collapsibleView + proxy as accessible elements
    accessibilityElements = [collapsibleView, proxy]
}
```

---

### ❌ Bad Code — notification before animation, real button exposed

```swift
// ❌ Before fix (CollapsibleShowMore):

UIView.animate(withDuration: 0.33, delay: delay) {
    self.setContentHeight()
}
// ← Animation still running
setupAccessibility()
UIAccessibility.post(notification: .layoutChanged, argument: collapseButton)
// ← collapseButton frame is stale (mid-animation)
// ← VoiceOver double-tap hits the wrong location

// accessibilityElements = [collapsibleView, collapseButton]  ← real button exposed
// ← No scroll-to-visible on focus → button may be off-screen when user double-taps
```

---

### Why the proxy's `accessibilityFrame` uses window coordinates

`UIAccessibilityElement.accessibilityFrame` must be in **UIScreen window coordinates** (not view-local coordinates). VoiceOver uses this frame to:
1. Highlight the element with the accessibility cursor
2. Determine where the double-tap hit lands

```swift
// ✅ Correct: convert to window coordinate space
return button.convert(button.bounds, to: window)

// ❌ Wrong: view-local coordinates (relative to button.superview)
return button.frame  // incorrect for UIAccessibilityElement.accessibilityFrame

// ❌ Wrong: convert to wrong ancestor
return button.convert(button.bounds, to: self)  // self = CollapsibleShowMore, not window
```

The `accessibilityFrame` is dynamic (computed property), so every time VoiceOver reads the frame (on focus, on double-tap activation), it gets the live, post-animation position.

---

### `.layoutChanged` timing rule

```
// The rule:
// Always post .layoutChanged in the UIView.animate(completion:) block,
// never synchronously after UIView.animate.

// ❌ Synchronous post (wrong — animation still running):
UIView.animate(withDuration: 0.33) { self.layout() }
UIAccessibility.post(notification: .layoutChanged, argument: target)  // too early

// ✅ Post in completion block (correct — animation has finished):
UIView.animate(withDuration: 0.33, animations: { self.layout() }, completion: { _ in
    UIAccessibility.post(notification: .layoutChanged, argument: target)
})
```

---

## 🔑 Key Rules

- **Always post `.layoutChanged` in the animation `completion` block, not before or after `UIView.animate`** — posting synchronously fires before the animation settles. VoiceOver queries button frames immediately on notification; mid-animation frames are stale and cause double-tap misses.
- **Post `.layoutChanged` in `CollapsibleSectionView` when sibling/downstream content shifts** — when one section expands, all buttons below it scroll. Without `.layoutChanged`, those downstream buttons' cached VoiceOver frames are wrong. Post from the expanding section's completion block.
- **Use a `UIAccessibilityElement` proxy for buttons that may scroll off-screen** — the proxy's `accessibilityElementDidBecomeFocused()` hook fires before the user double-taps. This is the only place to scroll the button into view before activation. Without scrolling, double-tap hits empty space.
- **Proxy `accessibilityFrame` must use window coordinates** — `button.convert(button.bounds, to: window)` produces screen-space coordinates that VoiceOver uses for hit testing and cursor placement. View-local or superview-local coordinates will mismatch.
- **Hide the real button from VoiceOver when using a proxy** — `collapseButton.isAccessibilityElement = false` prevents duplicate focus stops (proxy + real button). The proxy handles label, hint, traits, and activation via `onActivate`.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The value of user interface components must be programmatically determinable. When `UIAccessibilityElement.accessibilityFrame` returns a stale or off-screen frame, VoiceOver's cursor and activation target are mismatched — the user activates what VoiceOver highlights but nothing happens (or the wrong element activates). The programmatic representation of the button's position (its `accessibilityFrame` value) is not determinable in a way that reflects the button's actual screen position. The `UIAccessibilityElement` proxy with a dynamic `accessibilityFrame` and `accessibilityElementDidBecomeFocused()` scroll hook ensures position and activatability are always correctly represented.
