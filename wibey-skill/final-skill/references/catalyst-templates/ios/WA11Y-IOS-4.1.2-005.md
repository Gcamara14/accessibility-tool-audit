# Catalyst Template: Link Role Missing — Inline Link in Paragraph Text Not Individually Focusable

**Template ID:** `WA11Y-IOS-4.1.2-005`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Confluence Rule:** Role: Link Role is Missing (Link)
**Component:** GPC CCPA Opt-out message — "Privacy Notice" tappable link inside paragraph
**Source PRs:**
- [#145602](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/145602) | [CECPRO-31015](https://jira.walmart.com/browse/CECPRO-31015) — Privacy Notice link in CCPA opt-out paragraph not actionable via VoiceOver
**Ingested:** 2026-04-23

---

## The Problem

When a paragraph of text contains an inline tappable link (e.g., "Privacy Notice", "Terms of Use", "Learn more"), iOS VoiceOver typically groups the entire paragraph — including the link — into a single accessibility element. Users hear the full paragraph text but cannot individually focus or activate the embedded link. The link's **role** (link/button) is never announced, and double-tapping does nothing.

**Failure scenario (CECPRO-31015):** The CCPA "Opt-out Request Honored" screen shows a paragraph:
> "By submitting this request, you're opting out of the sale and sharing of your personal information. For more details, see our **Privacy Notice**."

The paragraph was implemented as a `UILabel` with the entire text set as `accessibilityLabel`. VoiceOver reads the whole paragraph as one stop — "Privacy Notice" is audible but:
- Cannot receive independent VoiceOver focus
- Has no `.link` or `.button` role announced
- Double-tapping the element does not trigger the "Privacy Notice" tap handler

**Root causes:**
1. `UILabel` has no native link interaction support — taps are usually detected via `UITapGestureRecognizer` at coordinate level, which VoiceOver bypasses
2. The container `isAccessibilityElement = true` absorbs the tappable region
3. No `UIAccessibilityCustomAction` registered to expose the link action through VoiceOver

**Why this matters for CCPA / legal screens:** Privacy notices and consent links are legally required to be accessible. Users relying on VoiceOver must be able to activate "Privacy Notice", "Terms of Use", "Do Not Sell", and similar links.

---

## Fix Patterns

### Pattern A: `UIAccessibilityCustomAction` — Expose Link as Rotor Action (CECPRO-31015)

The recommended iOS pattern when the paragraph container must remain a single VoiceOver element: register the link tap as a `UIAccessibilityCustomAction`. Users activate it via the VoiceOver rotor (swipe up while focused on the element).

**Bad Code:**
```swift
class CCPAOptOutView: UIView {
    let bodyLabel = UILabel()
    let privacyNoticeTapArea = UIButton()  // Overlay button over "Privacy Notice" text

    private func setupAccessibility() {
        // ❌ Paragraph absorbs Privacy Notice — no way to activate it via VoiceOver
        bodyLabel.isAccessibilityElement = true
        bodyLabel.accessibilityLabel = "By submitting this request, you're opting out of the sale and sharing of your personal information. For more details, see our Privacy Notice."
        // VoiceOver: reads full text — "Privacy Notice" link inactivatable
    }
}
```

**Good Code:**
```swift
class CCPAOptOutView: UIView {
    let bodyLabel = UILabel()

    var onPrivacyNoticeTapped: (() -> Void)?

    private func setupAccessibility() {
        bodyLabel.isAccessibilityElement = true
        bodyLabel.accessibilityLabel = NSLocalizedString(
            "By submitting this request, you're opting out of the sale and sharing of your personal information. For more details, see our Privacy Notice.",
            comment: "CCPA opt-out confirmation paragraph"
        )

        // ✅ Expose "Privacy Notice" link as a named custom action
        bodyLabel.accessibilityCustomActions = [
            UIAccessibilityCustomAction(
                name: NSLocalizedString(
                    "Open Privacy Notice",
                    comment: "VoiceOver custom action to open the privacy notice"
                ),
                target: self,
                selector: #selector(handlePrivacyNoticeTap)
            )
        ]
    }

    @objc private func handlePrivacyNoticeTap() -> Bool {
        onPrivacyNoticeTapped?()
        return true  // Return true = action was handled successfully
    }
}
// VoiceOver: "By submitting this request... Privacy Notice." (paragraph)
// User swipes up on rotor: "Open Privacy Notice" action available → double-tap activates link ✅
```

---

### Pattern B: `UITextView` — Native Attributed Link Support

When the content is rich text with multiple links, switch from `UILabel` to `UITextView`. With `isEditable = false` and `isSelectable = true`, VoiceOver can independently focus each link within the attributed string.

**Bad Code:**
```swift
let termsLabel = UILabel()
termsLabel.text = "I agree to the Terms of Service and Privacy Policy."
// ❌ Two links — both inaccessible via VoiceOver
```

**Good Code:**
```swift
let termsTextView = UITextView()
termsTextView.isEditable = false
termsTextView.isSelectable = true
termsTextView.isScrollEnabled = false
termsTextView.backgroundColor = .clear

let fullText = NSLocalizedString(
    "I agree to the Terms of Service and Privacy Policy.",
    comment: ""
)
let attributedString = NSMutableAttributedString(string: fullText)

// ✅ NSLinkAttributeName makes each phrase independently focusable by VoiceOver
if let tosRange = fullText.range(of: "Terms of Service") {
    let nsRange = NSRange(tosRange, in: fullText)
    attributedString.addAttribute(.link, value: URL(string: "walmart://terms")!, range: nsRange)
}
if let privacyRange = fullText.range(of: "Privacy Policy") {
    let nsRange = NSRange(privacyRange, in: fullText)
    attributedString.addAttribute(.link, value: URL(string: "walmart://privacy")!, range: nsRange)
}
termsTextView.attributedText = attributedString
termsTextView.delegate = self

// ✅ VoiceOver now has 3 separate focus stops: sentence text, "Terms of Service" link, "Privacy Policy" link
// Link role is announced automatically: "Terms of Service, link"
```

**Note:** `UITextView` with attributed links automatically exposes each link as a separate `UIAccessibilityElement` with `.link` trait. This is the cleanest solution when content has 2+ inline links.

---

### Pattern C: Multiple Custom Actions for Multiple Links

When using `UILabel` + `UIAccessibilityCustomAction` and the paragraph has more than one link:

```swift
private func setupMultipleLinkActions() {
    bodyLabel.accessibilityCustomActions = [
        UIAccessibilityCustomAction(
            name: NSLocalizedString("Open Terms of Service", comment: ""),
            target: self,
            selector: #selector(openTerms)
        ),
        UIAccessibilityCustomAction(
            name: NSLocalizedString("Open Privacy Policy", comment: ""),
            target: self,
            selector: #selector(openPrivacy)
        )
    ]
}
// VoiceOver rotor: swipe up to cycle through "Open Terms of Service", "Open Privacy Policy"
```

---

### Pattern D: `accessibilityCustomActions` with Closure (iOS 14+)

For iOS 14+ codebases, use the closure-based `UIAccessibilityCustomAction` initializer:

```swift
if #available(iOS 14.0, *) {
    bodyLabel.accessibilityCustomActions = [
        UIAccessibilityCustomAction(name: NSLocalizedString("Open Privacy Notice", comment: "")) { [weak self] _ in
            self?.onPrivacyNoticeTapped?()
            return true
        }
    ]
}
```

---

## Var 1: CCPA Opt-Out Coordinator — VoiceOver Focus Not Restored After Bottom Sheet Dismiss (CECPRO-31015)

**Context:** GPC (Global Privacy Control) CCPA Opt-out flow in the Account plugin (glass-app). `OptOutRequestCoordinator` presents a bottom sheet for the opt-out request. When the sheet was dismissed (via the close button or swipe-down), VoiceOver focus was not restored to the element that triggered the opt-out flow. Users had to manually re-orient after dismissal — violating WCAG 4.1.2 (the role/state of the triggering element was not restored to VoiceOver's focus).

**Bad Code:**
```swift
class OptOutRequestCoordinator: Coordinator {
    func handleDismiss() {
        // ❌ Focus not restored to the element that triggered the bottom sheet
        case .didClose:
            trackCloseButtonTap()
            finish(())
    }
}
```

**Good Code:**
```swift
class OptOutRequestCoordinator: Coordinator {
    private var bottomSheetNavigationController: BottomSheetNavigationController?

    func handleDismiss() {
        // ✅ Wait for dismiss animation to complete, then restore VoiceOver focus
        DispatchQueue.main.async { [weak self, weak nav] in
            guard let self, let nav else { return }
            guard nav.presentingViewController != nil else { return }
            nav.dismissPublisher()
                .sink { [weak self] _ in
                    self?.handleDismissCompletion()
                }
                .store(in: &self.subscriptions)
        }
    }

    private func handleDismissCompletion() {
        // ✅ Restores focus to the element that launched the opt-out flow
        AccessibilityFocusManager.restoreChildViewAccessibilityFocus()
        finish(())
    }
}
```

**Why This Works:** When a bottom sheet is dismissed, VoiceOver focus is left stranded — the sheet is gone but focus has not been returned to the triggering element in the presenting view. `AccessibilityFocusManager.restoreChildViewAccessibilityFocus()` is called after the dismiss animation completes (via `dismissPublisher().sink`), ensuring that VoiceOver re-focuses the element that originally launched the bottom sheet. The `DispatchQueue.main.async` wrapper ensures the dismiss animation has started before observing the publisher. This satisfies WCAG 4.1.2: the name, role, and value of the triggering element are restored to VoiceOver's focus after the overlay is dismissed.

**Key Signals:** `Coordinator` or `ViewController` presenting a `BottomSheetNavigationController` with no focus restoration on dismiss; VoiceOver focus stranded after bottom sheet closes; `finish(())` called in `.didClose` without `AccessibilityFocusManager.restoreChildViewAccessibilityFocus()`; CCPA opt-out, privacy, account settings, or consent flows in the Account plugin.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Focus restoration after dismiss | VoiceOver stranded — no element focused after bottom sheet closes | `AccessibilityFocusManager.restoreChildViewAccessibilityFocus()` re-anchors focus to the triggering element |
| Dismiss timing | `finish(())` called immediately — animation not complete | `dismissPublisher().sink` waits for animation, then restores focus |
| Link focusable by VoiceOver | No — absorbed in paragraph element (general pattern) | Yes — via custom action or `UITextView` attributed link |
| Link role announced | Never — read as static text | `UIAccessibilityCustomAction`: "action" announced; `UITextView`: "link" announced automatically |
| Link activation | Double-tap on paragraph → nothing | Custom action: swipe up + double-tap; `UITextView`: double-tap link directly |
| Multiple links in paragraph | All inaccessible | Multiple custom actions OR `UITextView` attributed strings — each independently operable |
| WCAG 4.1.2 compliance | Role not determinable, activation broken | Name, role, and activation all programmatically exposed |

---

## Key Signals (For Pattern Matching)

- `UILabel` displaying a paragraph that contains one or more words styled as tappable links
- `UITapGestureRecognizer` that uses touch coordinates to detect which word was tapped — bypassed by VoiceOver
- Overlay `UIButton` positioned over a portion of a `UILabel` — invisible to VoiceOver
- CCPA opt-out, privacy notice, terms of service, consent modal, cookie notice screens
- Audit findings: "Link Role is Missing", "Not Actionable", "cannot activate control by double-tapping"
- No `accessibilityCustomActions` on the label element
- `UILabel` used where `UITextView` with `isEditable = false` would handle links natively

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | CECPRO-31015 / PR #145602 | CCPA Opt-out bottom sheet — VoiceOver focus not restored after dismiss | `AccessibilityFocusManager.restoreChildViewAccessibilityFocus()` on dismiss completion in `OptOutRequestCoordinator` | Ingested |

---

## Related Templates

- `WA11Y-IOS-4.1.2-004` — Button silenced by container grouping (`accessibilityElements` fix)
- `WA11Y-IOS-4.1.2-001` — Missing `.button` trait on UIView + tap gesture
- `WA11Y-IOS-1.3.1-001` Var 2 — Plan card `accessibilityElements` to preserve button
- `WA11Y-WEB-4.1.2-005` — Web: Link role missing — `<Button>` needs `href` for navigation
