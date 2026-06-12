# Catalyst Template: Status Messages Not Announced to VoiceOver

**Template ID:** `WA11Y-IOS-4.1.3-001`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 4.1.3 Status Messages
**Component:** LocalFinds filter result count / WCPSnackbar toast
**Source PRs:**
- [#137713](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/137713) | [CEPG-332823](https://jira.walmart.com/browse/CEPG-332823) — LocalFinds filter count not announced
- [#135495](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/135495) | [GPUGC-21403](https://jira.walmart.com/browse/GPUGC-21403) — UGC snackbar incomplete announcement
**Ingested:** 2026-04-14

---

## The Problem

Dynamic content updates (filter results, counts, success/error states) that appear on screen after a user action are NOT automatically announced by VoiceOver. Unlike web where `role="status"` or `aria-live="polite"` auto-announces, iOS requires explicit `UIAccessibility.post(notification: .announcement, ...)` calls. Missing this call means screen reader users miss state changes entirely.

**Root cause:** iOS VoiceOver does not monitor the view hierarchy for text changes. Every status update requiring VoiceOver announcement must be explicitly posted via `UIAccessibility.post`. Updating a `UILabel`'s `.text` property alone is completely silent to VoiceOver.

**Platform policy:** Do not call `UIAccessibility.isVoiceOverRunning` directly. Use the Walmart platform wrapper. Contact `#opus-support` for guidance (Policy ID 5020: `no_direct_UIAccessibilityVoiceOver_usage`).

---

## Fix Patterns

### Pattern A: Section Header Accessibility Label Must Reflect Rendered Text — Read from `titleLabel`, Not `model.title` (CEPG-332823)

**Bad Code (`SectionHeaderViewShared.setupAccessibility()`):**
```swift
// ❌ Reads model.title — the raw model string WITHOUT count suffix
// When a section title displays "Toys (12)", model.title is only "Toys"
// VoiceOver announces "Toys" and never announces the item count
func setupAccessibility() {
    accessibilityLabel = [model.title, model.subtitle]
        .compactMap { $0 }
        .joined(separator: ", ")
}
```

**Good Code:**
```swift
// ✅ Reads titleLabel.attributedText?.string — the rendered text INCLUDING appended count
// When titleLabel shows "Toys (12)", attributedText?.string is "Toys (12)"
// VoiceOver announces "Toys (12)" ✅
func setupAccessibility() {
    accessibilityLabel = [titleLabel.attributedText?.string, model.subtitle]
        .compactMap { $0 }
        .joined(separator: ", ")
}
```

**Tests added (`SectionHeaderViewSharedTests.swift`):**
```swift
func testModel_withCountNoSubtitle() {
    // title with count appended → accessibilityLabel = "test (12)"
    sut.applyModel(.init(title: "test", subtitle: nil, count: 12))
    XCTAssertEqual(sut.accessibilityLabel, "test (12)")
}
func testModel_withCountAndSubtitle() {
    // title with count + subtitle → "test (12), here"
    sut.applyModel(.init(title: "test", subtitle: "here", count: 12))
    XCTAssertEqual(sut.accessibilityLabel, "test (12), here")
}
```

**Why This Works:** The count suffix (e.g. " (12)") is appended to `titleLabel.attributedText` at render time — it is NOT part of `model.title`. Reading from the label's rendered attributed string instead of the raw model value ensures the count is included in the VoiceOver announcement.

**File:** `Modules/FeatureUI/DiscoveryUIShared/Sources/HeroCarousel/Common/SectionHeaderView.swift` · Class `SectionHeaderViewShared`

---

### Pattern B: Assertive vs. Polite — iOS Has Only One Mechanism

```swift
// iOS has no "polite" live region equivalent — .announcement always interrupts
// Simulate polite behavior via the 0.1 s asyncAfter delay (lets current speech finish)

// For urgent messages (errors):
UIAccessibility.post(notification: .announcement,
    argument: NSLocalizedString("Error: Could not load shops. Please try again.", comment: ""))

// For informational updates (counts, success states): same mechanism, use delay
DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
    UIAccessibility.post(notification: .announcement, argument: successMessage)
}
```

---

### Pattern C: Debounce Announcement Storm (Multiple Rapid Filter Toggles)

**Bad Code:**
```swift
func applyFilter(_ filter: FilterType) {
    activeFilters.append(filter)
    refreshResults()
    UIAccessibility.post(notification: .announcement, argument: "\(resultsCount) shops near you")
    // Each toggle fires immediately — rapid-fire speech is unintelligible
}
```

**Good Code:**
```swift
private var announcementDebouncer: DispatchWorkItem?

func applyFilter(_ filter: FilterType) {
    activeFilters.append(filter)
    refreshResults()
    scheduleResultCountAnnouncement()
}

func removeFilter(_ filter: FilterType) {
    activeFilters.removeAll { $0 == filter }
    refreshResults()
    scheduleResultCountAnnouncement()
}

private func scheduleResultCountAnnouncement() {
    announcementDebouncer?.cancel()
    announcementDebouncer = DispatchWorkItem { [weak self] in
        guard let self else { return }
        let message = NSLocalizedString(
            "\(self.resultsCount) local shops near you",
            comment: "Announces filtered shop count to VoiceOver"
        )
        UIAccessibility.post(notification: .announcement, argument: message)
    }
    // 0.3 s window — user can toggle multiple chips; only final count is spoken
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.3, execute: announcementDebouncer!)
}
```

---

### Pattern D: Zero-Result and Cleared-Filter States

```swift
private func announceResultState() {
    let message: String
    if activeFilters.isEmpty {
        message = NSLocalizedString("All filters cleared. Showing all local shops.", comment: "")
    } else if resultsCount == 0 {
        message = NSLocalizedString("No shops found for the selected filters.", comment: "")
    } else {
        message = NSLocalizedString("\(resultsCount) local shops near you", comment: "")
    }
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
        UIAccessibility.post(notification: .announcement, argument: message)
    }
}
```

---

## Var 2: UGC Rating Snackbar — Incomplete Focus Restoration After Dismiss (GPUGC-21403)

**Context:** UGC (Write a Review) plugin — `WaRCoordinator` presents a `WCPSnackBar` ("Thanks for your rating!") after submission. The original code used a hardcoded `asyncAfter` timer to post `.layoutChanged` while the snackbar was still visible, timed to match the snackbar's `model.duration`. If the snackbar duration ever changes, the notification fires at the wrong time — before or after dismiss — causing VoiceOver focus to land on nothing or the wrong element. Root cause: timer-coupled announcement instead of delegate-driven focus restoration.

**Bad Code:**
```swift
class WaRCoordinator {
    private func displayRatingSnackbar() {
        // ❌ Posts .layoutChanged with a hardcoded timer duration match
        // If the snackbar duration changes, the notification fires at wrong time
        ratingSnackbar.present(in: warViewController.view, bottomOffset: ...)
        if UIAccessibility.isVoiceOverRunning {
            DispatchQueue.main.asyncAfter(deadline: .now() + ratingSnackbar.model.duration) {
                UIAccessibility.post(
                    notification: .layoutChanged,
                    argument: self.warViewController.navigationController?.navigationItem.title
                )
            }
        }
    }
}
```

**Good Code:**
```swift
class WaRCoordinator: WCPSnackBarDelegate {
    private var isSnackBarShown = false

    private func displayRatingSnackbar() {
        isSnackBarShown = true
        ratingSnackbar.present(in: warViewController.view, bottomOffset: ...)
        // ✅ No direct asyncAfter — delegate handles focus restoration when snackbar actually dismisses
    }

    // ✅ Called by WCPSnackBarDelegate when snackbar finishes animating out
    func didDismissSnackBar() {
        isSnackBarShown = false
        warViewController.refreshScreenAccessibility()
    }
}

extension WaRViewController {
    // ✅ Post .screenChanged to re-anchor VoiceOver after snackbar dismisses
    func refreshScreenAccessibility() {
        if UIAccessibility.isVoiceOverRunning {
            UIAccessibility.post(notification: .screenChanged, argument: nil)
        }
    }
}
```

**Why This Works:** Using `WCPSnackBarDelegate.didDismissSnackBar()` ties the `.screenChanged` notification to the actual dismiss event — not a fragile timer. `.screenChanged` moves VoiceOver focus back to the first element in the view, re-anchoring the user after the snackbar disappears. The original `.layoutChanged` with a hardcoded duration would drift if the snackbar animation ever changes.

**Key Signals:** `DispatchQueue.main.asyncAfter(deadline: .now() + ratingSnackbar.model.duration)` posting `.layoutChanged`; `UIAccessibility.isVoiceOverRunning` check inline in a coordinator method; snackbar dismiss with no delegate-driven focus restoration; UGC/WaR plugin snackbar after rating submission.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Status message announced | Never — UILabel text changes are silent | `.announcement` notification delivers the message |
| VoiceOver drop risk | N/A | Mitigated by `asyncAfter` delay |
| Rapid filter toggling | Each toggle fires announcement (storm) | Debouncer cancels intermediates; only final count spoken |
| Snackbar focus restoration (Var 2) | `.layoutChanged` fired via hardcoded timer — wrong timing if duration changes | `WCPSnackBarDelegate.didDismissSnackBar()` drives `.screenChanged` on actual dismiss |
| Snackbar timer coupling (Var 2) | `asyncAfter` duration matched to `model.duration` — fragile | Delegate callback — fires only when snackbar actually finishes animating out |
| Localization | Hardcoded strings | `NSLocalizedString` wrapping |

---

## Key Signals (For Pattern Matching)

- `UILabel.text` updated in response to user action with no following `UIAccessibility.post(...)` call
- Result count labels, success banners, cart quantity badges, filter result counts, loading-complete messages
- `.announcement` posts with no delay — susceptible to being dropped
- Multiple rapid state changes without debouncing
- `WCPSnackBar` dismiss with focus restoration tied to a hardcoded `asyncAfter` timer rather than a delegate callback
- `UIAccessibility.post(notification: .layoutChanged, ...)` inside a timer-coupled block after snackbar present

---

---

## Var 3: Validation Error State — "Error: " Prefix on Consent Warning + Checkbox Label Cleanup (CEPG-335989)

**Context:** W+ Splash Terms view (`WalmartPlusSplashTermsView`) — the consent validation warning ("You must check the box to agree to the terms") displayed visually in red with a warning icon. VoiceOver announced the warning label text but gave no indication it was an error. Users with visual disabilities couldn't distinguish a validation error message from regular body text. Additionally, the consent checkbox was manually appending ", selected" / ", unselected" to its `accessibilityLabel` — this belongs in `accessibilityValue` or via native traits, not embedded in the label string.

**File:** `Plugins/Checkout/Checkout/Sources/WalmartPlus/WalmartPlusSplash/Views/WalmartPlusSplashTermsView.swift`
**Source PR:** [#139201](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/139201) | [CEPG-335989](https://jira.walmart.com/browse/CEPG-335989)

### Fix A: "Error: " Prefix on Consent Warning Label

**Bad Code:**
```swift
// ❌ Plain text — VoiceOver reads validation message with no error signal
// Visual: red text + warning icon; AT: no indication this is an error
consentWarningStackView.isAccessibilityElement = true
consentWarningStackView.accessibilityLabel = consentWarningLabel.text
// VoiceOver: "You must check the box to agree to the terms"
// — indistinguishable from a regular instruction label
```

**Good Code:**
```swift
// ✅ "Error: " prefix announces error nature before the message text
consentWarningStackView.isAccessibilityElement = true
consentWarningStackView
    .accessibilityLabel = "\(LocalizableString.errorPrefix.value) \(consentWarningLabel.text ?? "")"
// VoiceOver: "Error: You must check the box to agree to the terms"
// — error state is unambiguous ✅
```

**New localization key** (`LocalizableString.swift` + validated by test):
```swift
case errorPrefix   // value: "Error:"
// XCTAssertEqual(LocalizableString.errorPrefix.value, "Error:")
```

**Test assertion updated:**
```swift
XCTAssertEqual(
    view.testHooks.consentWarningStackView.accessibilityLabel,
    "Error: You must check the box to agree to the terms"  // was: no "Error: " prefix
)
```

### Fix B: Checkbox `accessibilityLabel` — Remove Manual State Suffix

**Bad Code:**
```swift
// ❌ State ("selected"/"unselected") appended manually to accessibilityLabel
// accessibilityLabel should be a stable name — state belongs in accessibilityValue/traits
var consentCheckboxA11y = consentCheckboxLabel.text ?? ""
if consentAgreementCheckBox.checkboxValue == .checked {
    consentCheckboxA11y += ", \(LocalizableString.checkboxSelected.value)"
} else {
    consentCheckboxA11y += ", \(LocalizableString.checkboxUnselected.value)"
}
consentAgreementCheckBox.accessibilityLabel = consentCheckboxA11y
// VoiceOver: "I agree to the terms (required), unselected" — state in label, not traits
```

**Good Code:**
```swift
// ✅ Label is stable name only — state communicated via native control mechanism
consentAgreementCheckBox.accessibilityTraits = .button
consentAgreementCheckBox.accessibilityLabel = consentCheckboxLabel.text
// VoiceOver: "I agree to the terms (required), button" — clean stable label ✅
```

**Why This Works:**
- **"Error: " prefix:** iOS has no `role="alert"` or `aria-invalid` equivalent. The established iOS pattern is to prepend `"Error:"` (or a localized equivalent) to the `accessibilityLabel` of a validation error view. VoiceOver reads it first, immediately signaling error context before the message text. Using a localization key (`LocalizableString.errorPrefix`) ensures the prefix is translated in all locales.
- **Checkbox label cleanup:** `accessibilityLabel` should be a **stable identifier** for the element — it does not change with state. State changes belong in `accessibilityValue` (e.g., `"checked"` / `"unchecked"`) or via `accessibilityTraits` (`.selected`). Embedding state in the label causes VoiceOver to read the same string regardless of current state if the label isn't re-set on every toggle — a common source of stale announcements.

**Key Signals for Var 3:**
- Validation error labels with red styling / warning icon whose `accessibilityLabel` has no `"Error:"` / `"Error, "` prefix — VoiceOver reads the message but not the error state
- `accessibilityLabel` manually appending `", selected"` / `", unselected"` / `", checked"` / `", unchecked"` — these belong in `accessibilityValue` or `.selected` trait
- Consent forms, legal agreement checkboxes, payment validation, address form errors in checkout / W+ flows
- Any `UIView` with `isAccessibilityElement = true` used as a validation error container whose `.text` is set without an error-state prefix

---

## Variations

| Var | Ticket | Feature | Announcement Pattern | Status |
|---|---|---|---|---|
| Var 1 | CEPG-332823 / PR #137713 | `SectionHeaderViewShared` — section title count not announced | `titleLabel.attributedText?.string` replaces `model.title` in `setupAccessibility()` | Ingested |
| Var 2 | GPUGC-21403 / PR #135495 | UGC ratings `WaRCoordinator` snackbar | `WCPSnackBarDelegate.didDismissSnackBar()` → `.screenChanged` replaces hardcoded `asyncAfter` + `.layoutChanged` | Ingested |
| Var 3 | CEPG-335989 / PR #139201 | W+ Splash Terms — consent warning + checkbox | `"Error: "` prefix on validation label; checkbox label stripped of manual state suffix | Ingested 2026-04-24 |

---

## Related Templates

- `WA11Y-IOS-2.4.3-001` — iOS: Focus management after dynamic collection view updates
- `WA11Y-IOS-1.1.1-001` — iOS: Missing `accessibilityLabel` on informative image
- `WA11Y-WEB-4.1.3-001` — Web: `aria-live="polite"` / `role="status"` for dynamic status messages
- `WA11Y-WEB-4.1.3-003` — Web: Snackbar `announcePolite()` + `setTimeout(1000)`
