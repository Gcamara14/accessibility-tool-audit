# Catalyst Template: Button Focusable but Not Activatable via VoiceOver — Long-Press Gesture Conflict

**Template ID:** `WA11Y-IOS-2.1.1-001`
**Platform:** iOS (UIKit / SwiftUI)
**WCAG Criterion:** 2.1.1 Keyboard
**Confluence Rule:** Activation: Element Can't Be Activated with VoiceOver (Double-Tap Does Nothing)
**Component:** `LDChip` (DesignComponents / LivingDesign3 library)
**Source PR:** [#121773](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/121773) | [LD-6830](https://jira.walmart.com/browse/LD-6830)
**Merged:** glass-app

---

## The Problem

`LDChip` elements (part of the DesignComponents / LivingDesign3 library) were announced by VoiceOver (correctly named and focused), but double-tapping produced **no action**. The chips were also unreliable for non-AT users — they required a **press-and-hold** gesture to activate, rather than a simple tap.

**Root cause:** `LDChip` used a `UILongPressGestureRecognizer` with `minimumPressDuration: 0.1` as its primary activation mechanism. VoiceOver's double-tap dispatches a **standard tap event immediately** — it does not simulate a sustained press. Because VoiceOver fires instantly without the 0.1 s hold, the `minimumPressDuration` threshold is never satisfied, and the activation handler is never triggered, leaving the chip completely inoperable via assistive technology.

This violates **WCAG 2.1.1** because the core functionality (selecting a survey answer) is only operable via a specific motor-demanding gesture that VoiceOver — and many Switch Access and Full Keyboard Access users — cannot replicate.

**Why this is 2.1.1, not 4.1.2:**
- The button **is** in the accessibility tree — VoiceOver can focus and announce it ✅
- The button's **role** (button) was present ✅
- The button's **activation** is gesture-incompatible with AT ❌ ← this is the 2.1.1 failure

| Criterion | Rule | Applies? |
|---|---|---|
| 4.1.2 Name/Role/Value | Element not in AT tree / wrong role | ❌ Not the failure here |
| **2.1.1 Keyboard** | All functionality operable via AT gesture (VoiceOver double-tap = keyboard equivalent) | ✅ Double-tap fires nothing; action bound to long-press only |

---

## The Fix Pattern

Replace the long-press-gated activation with a standard `UIButton` (`touchUpInside`) or `UITapGestureRecognizer`. Communicate the selected state via `accessibilityTraits = [.button, .selected]`.

---

## Fix Patterns

### Pattern A: Primary Fix — Replace `UILongPressGestureRecognizer` with `UITapGestureRecognizer` (LD-6830 / `LDChip`)

**Bad Code:**
```swift
final class LDChip: BaseView {
    // ❌ UILongPressGestureRecognizer — requires minimum press hold duration
    // VoiceOver double-tap fires immediately; minimumPressDuration threshold is NEVER met
    private var longPressGestureRecognizer: UILongPressGestureRecognizer

    public var gestureRecognizerEnabled = true {
        didSet { longPressGestureRecognizer.isEnabled = gestureRecognizerEnabled }
    }

    init() {
        longPressGestureRecognizer = UILongPressGestureRecognizer()
        super.init(frame: .zero)
        longPressGestureRecognizer.addTarget(self, action: #selector(didPress))
        longPressGestureRecognizer.minimumPressDuration = 0.1  // ❌ VoiceOver double-tap never satisfies this
        addGestureRecognizer(longPressGestureRecognizer)
    }

    @objc internal func didPress(gestureRecognizer: UILongPressGestureRecognizer) {
        switch gestureRecognizer.state {
        case .began: // handle press
        ...
        }
    }
}
```

**Good Code:**
```swift
final class LDChip: BaseView {
    // ✅ UITapGestureRecognizer — fires on touch up; compatible with VoiceOver double-tap
    private var tapPressGestureRecognizer: UITapGestureRecognizer

    public var gestureRecognizerEnabled = true {
        didSet { tapPressGestureRecognizer.isEnabled = gestureRecognizerEnabled }
    }

    init() {
        tapPressGestureRecognizer = UITapGestureRecognizer()
        super.init(frame: .zero)
        tapPressGestureRecognizer.addTarget(self, action: #selector(didPress))
        // ✅ No minimumPressDuration — tap fires immediately on touch up / VoiceOver double-tap
        addGestureRecognizer(tapPressGestureRecognizer)
    }

    @objc internal func didPress(gestureRecognizer: UITapGestureRecognizer) {
        // ✅ VoiceOver double-tap now triggers this handler correctly
    }
}
```

---

### Pattern B: Keep Custom View — Override `accessibilityActivate()`

When the view architecture cannot easily be replaced with `UIButton` (e.g., deeply nested custom rendering), override `accessibilityActivate()` to hook VoiceOver's double-tap into the existing action path:

```swift
class SurveyAnswerView: UIView {

    private var onSelect: (() -> Void)?
    private var isSelected: Bool = false

    override init(frame: CGRect) {
        super.init(frame: frame)
        isAccessibilityElement = true
        accessibilityTraits = .button

        // ⚠️ Long-press still exists for non-AT users who require hold behavior
        let longPress = UILongPressGestureRecognizer(
            target: self,
            action: #selector(handleLongPress(_:))
        )
        longPress.minimumPressDuration = 0.3
        addGestureRecognizer(longPress)
    }

    @objc private func handleLongPress(_ gesture: UILongPressGestureRecognizer) {
        guard gesture.state == .began else { return }
        activate()
    }

    // ✅ VoiceOver calls this on double-tap — bridges AT activation to the same handler
    override func accessibilityActivate() -> Bool {
        activate()
        return true  // returning true = action was handled; VoiceOver won't fall through
    }

    private func activate() {
        isSelected.toggle()
        accessibilityTraits = isSelected ? [.button, .selected] : .button
        onSelect?()
    }
}
// VoiceOver: double-tap → accessibilityActivate() → activate() → state updated ✅
// Non-AT: long-press → handleLongPress() → activate() → same result ✅
```

> **When to use Pattern B vs Pattern A:**
> Use Pattern A when the long-press behavior is vestigial or unintentional — replace it entirely.
> Use Pattern B when the long-press IS a deliberate UX choice (e.g., a hold-to-confirm interaction in a destructive flow) and you need to maintain both paths.

---

### Pattern C: Multiple Survey Answers — Exclusive Selection (Radio Group Semantics)

For survey screens with multiple answer options where only one can be selected at a time, manage the selection state at the container level and use `accessibilityTraits = [.button, .selected]` only on the active answer:

```swift
class SurveyQuestionView: UIView {

    private var answerButtons: [UIButton] = []
    private var selectedIndex: Int? = nil

    func configure(with answers: [String]) {
        answerButtons.forEach { $0.removeFromSuperview() }
        answerButtons = answers.enumerated().map { (index, title) in
            let button = UIButton(type: .system)
            button.setTitle(title, for: .normal)
            button.accessibilityLabel = NSLocalizedString(title, comment: "")
            button.accessibilityTraits = .button
            button.tag = index
            button.addTarget(self, action: #selector(answerSelected(_:)), for: .touchUpInside)
            addSubview(button)
            return button
        }
        layoutAnswerButtons()
    }

    @objc private func answerSelected(_ sender: UIButton) {
        let newIndex = sender.tag
        guard newIndex != selectedIndex else { return }

        // Deselect previous
        if let prev = selectedIndex {
            answerButtons[prev].accessibilityTraits = .button
        }

        // Select new
        selectedIndex = newIndex
        sender.accessibilityTraits = [.button, .selected]
        // VoiceOver: announces "selected" on the newly active answer ✅
    }
}
```

---

### Pattern D: SwiftUI Survey Button — `onTapGesture` vs `onLongPressGesture`

In SwiftUI, `.onLongPressGesture` blocks VoiceOver activation — use `.onTapGesture` (or a `Button`) instead. If you need both, add `.onTapGesture` alongside the long press:

```swift
// ❌ Long press only — VoiceOver double-tap fires nothing
struct SurveyAnswerButton: View {
    let title: String
    var body: some View {
        Text(title)
            .onLongPressGesture(minimumDuration: 0.3) {
                // action — unreachable via VoiceOver
            }
    }
}

// ✅ Native Button — VoiceOver double-tap fires the action automatically
struct SurveyAnswerButton: View {
    let title: String
    @Binding var isSelected: Bool
    var onSelect: () -> Void

    var body: some View {
        Button(action: onSelect) {
            Text(title)
        }
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
        // VoiceOver: double-tap → action fires → .isSelected trait set → "selected" announced ✅
    }
}

// ✅ If you need long-press AND AT activation:
struct SurveyAnswerButton: View {
    let title: String
    var onSelect: () -> Void

    var body: some View {
        Text(title)
            .onTapGesture { onSelect() }           // AT path (VoiceOver double-tap)
            .onLongPressGesture(minimumDuration: 0.3) { onSelect() }  // Touch path
            .accessibilityAction(.default, onSelect)  // Explicit AT action as fallback
    }
}
```

---

## Why This Works

| Aspect | Before (Long-Press) | After (UIButton / accessibilityActivate) |
|---|---|---|
| VoiceOver activation | Double-tap fires tap event → long-press handler ignores it → **no action** | Double-tap fires `.touchUpInside` or calls `accessibilityActivate()` → **action fires** |
| Non-AT activation | Must press-and-hold (poor UX even without disability) | Standard tap works for everyone |
| Selected state | State change never announced — VoiceOver user has no feedback | `.selected` trait added on active answer — VoiceOver announces "selected" |
| WCAG 2.1.1 | Fails — functionality requires a gesture AT cannot replicate | Passes — functionality operable via VoiceOver double-tap |

---

## Key Signals (For Pattern Matching)

Use this template when you see ANY of these in an iOS codebase:

- `UILongPressGestureRecognizer` on a tappable element that is exposed to VoiceOver
- `touchesBegan`/`touchesEnded` with a timer or duration check (`DispatchAfter(0.3s)`, `minimumPressDuration`)
- VoiceOver can focus an element but double-tap **produces no visible change / no action fires**
- Custom `UIView` with `isAccessibilityElement = true` and `.button` trait but no `accessibilityActivate()` override and no underlying `UIControl`
- Survey screens, rating pickers, quiz answer buttons, star ratings with hold-to-select behavior
- `.onLongPressGesture` in SwiftUI without a companion `.onTapGesture` or `Button`

---

## Variations

| Var | Ticket | Description | Status |
|---|---|---|---|
| Var 1 | LD-6830 / PR #121773 | `LDChip` (DesignComponents / LivingDesign3) — `UILongPressGestureRecognizer` with `minimumPressDuration: 0.1` replaced with `UITapGestureRecognizer` | Ingested |
| Var 2 | CEWMPLUS-136173 / PR #139408 | W+ MPS Splash Light — `headerImage` incorrectly set as accessibility element; VoiceOver focuses a decorative image with no interactive purpose | Ingested 2026-04-23 (real diff) |

---

## Var 2: W+ MPS Splash Light — Decorative Header Image Incorrectly in VoiceOver Focus Path (CEWMPLUS-136173)

**Context:** W+ Membership Plan Selection (MPS) splash / onboarding page — `RBESplashLightTopContentView` sets `headerImage.isAccessibilityElement = true`, causing VoiceOver to focus on a decorative branded header image. The image is non-interactive; landing on it adds an unnecessary focus stop that does not serve a meaningful accessibility purpose. The fix removes it from VoiceOver's focus path.

**File:** `Plugins/WalmartPlus/WalmartPlus/Sources/RepeatBenefitEngagementPage/RBESplashLightPage/Views/RBESplashLightTopContentView.swift`
**Source PR:** [#139408](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/139408) | [CEWMPLUS-136173](https://jira.walmart.com/browse/CEWMPLUS-136173)

**Bad Code:**
```swift
// ❌ headerImage is a decorative branded image — no interactive purpose
// Setting isAccessibilityElement = true adds an unnecessary VoiceOver focus stop
headerImage.isAccessibilityElement = true
headerImage.accessibilityLabel = model?.headerImageAltText
accessibilityElements?.append(headerImage)
```

**Good Code:**
```swift
// ✅ headerImage is decorative — removed from VoiceOver's focus path
headerImage.isAccessibilityElement = false
headerImage.accessibilityLabel = model?.headerImageAltText  // label retained (no regression)
accessibilityElements?.append(headerImage)
```

**Why This Works:** Setting `isAccessibilityElement = false` on a decorative or non-interactive image prevents VoiceOver from landing on it as a discrete focus target. This removes the unnecessary focus stop so users can navigate the meaningful content (close button, heading, CTA) without pausing on a branded graphic. The `accessibilityLabel` is retained in case a code path surfaces the image differently, but the element is no longer announced as a separate stop.

**Key Signals for Var 2:**
- `UIImageView.isAccessibilityElement = true` on a branded header, background illustration, or decorative graphic with no tap handler
- VoiceOver lands on an image element and announces its label, but the image is purely visual / not interactive
- W+ splash, onboarding, or nudge pages in the `CEWMPLUS`/`RBE` plugin
- `accessibilityElements` array manually managed but includes decorative images

---

## `accessibilityActivate()` Decision Tree

```
Can you replace the custom view with UIButton?
├── YES → Pattern A (preferred — native activation, no override needed)
└── NO (complex rendering / hold behavior required)
    ├── Hold is vestigial / accidental → remove UILongPressGestureRecognizer, add UITapGestureRecognizer
    └── Hold is intentional (hold-to-confirm, press-and-hold UX) → Pattern B (override accessibilityActivate())
```

---

## Related Templates

- `WA11Y-IOS-4.1.2-001` — Button role missing on custom tappable UIView (focusable but no `.button` trait)
- `WA11Y-IOS-4.1.2-003` — State: expanded/collapsed via `accessibilityValue`
- `WA11Y-WEB-2.1.1-002` — Web: custom `role="button"` missing `tabIndex` + `onKeyDown`
- `WA11Y-WEB-2.1.1-003` — Web: `<Link href="#">` + `role="button"` non-keyboard-operable
