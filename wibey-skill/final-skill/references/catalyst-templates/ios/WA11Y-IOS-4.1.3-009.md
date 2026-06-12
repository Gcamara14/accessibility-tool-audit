# Catalyst Template: Status Messages — Character Count Announcement Every N Characters During Text Field Editing

**Template ID:** `WA11Y-IOS-4.1.3-009`
**Platform:** iOS
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-IOS-4.1.3-009`
**Source Tickets:** SCCP-2641
**Source PRs:** [glass-app #156269](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/156269)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Text fields with a character limit show a visible counter (e.g., "23/50") that updates in real time as the user types. This counter is visible to sighted users but produces no VoiceOver announcement — VoiceOver users have no way to know how many characters they've used unless they stop typing and navigate to the counter.

A naive fix — announcing on every keystroke — creates a stream of overlapping speech that interrupts the typing rhythm and makes the field unusable.

**Symptom (Jira):** "VoiceOver doesn't announce character count while typing storefront name", "Screen reader silent on character limit progress", "Can't tell how many characters I've used without leaving the field".

---

## ✅ The Fix Pattern

### Announce the character count at fixed N-character intervals (every 10 characters)

```swift
// StorefrontNameEditCell.swift

// ✅ Announce every 10 characters, not on every keystroke
private let announcementInterval = 10

private var lastAnnouncedCharacterCount: Int = 0
private(set) var characterCountAnnouncementDelay: TimeInterval = 0.6

func textFieldDidChange(_ textField: WCPTextField) {
    let currentCount = textField.text?.count ?? 0
    let maxCount = model?.maxCharacterCount ?? 0

    updateCharacterCountLabel(current: currentCount, max: maxCount)
    announceCharacterCountIfNeeded(current: currentCount, max: maxCount)
}

private func announceCharacterCountIfNeeded(current: Int, max: Int) {
    // ✅ Only announce at multiples of announcementInterval (0, 10, 20, 30 ...)
    guard current % announcementInterval == 0 else { return }
    // ✅ Avoid re-announcing if the user just typed a character and is still at the
    //    same milestone (e.g., typed and immediately deleted back to 10)
    guard current != lastAnnouncedCharacterCount else { return }

    lastAnnouncedCharacterCount = current

    let announcement = String.localized(
        .characterCount(count: current, max: max)
        // → "{count, number, integer} out of {max, number, integer} characters"
        // → "10 out of 50 characters"
        // → "20 out of 50 characters"
    )

    // ✅ Delay the announcement to avoid clashing with ongoing keystroke processing
    DispatchQueue.main.asyncAfter(deadline: .now() + characterCountAnnouncementDelay) {
        UIAccessibility.post(notification: .announcement, argument: announcement)
    }
}
```

---

### Localized string format

```
// Localizable.strings

// ICU plural format — uses integer formatting for screen reader pronunciation
"characterCount" = "{count, number, integer} out of {max, number, integer} characters";

// ✅ Results:
// "10 out of 50 characters"
// "20 out of 50 characters"
// "50 out of 50 characters" (at limit)
```

Use `{count, number, integer}` (not just `{count}`) so the ICU formatter reads the number as an integer with correct pronunciation in all locales.

---

### `accessibilityValue` on the text field for on-demand access

In addition to interval announcements, expose the character count in the text field's `accessibilityValue` so users can swipe back to re-read it at any time:

```swift
// ✅ Update accessibilityValue alongside the visible counter label
private func updateCharacterCountLabel(current: Int, max: Int) {
    characterCountLabel.text = "\(current)/\(max)"
    // Also update the text field's accessibility value
    nameTextField.accessibilityValue = String.localized(.characterCount(count: current, max: max))
    // → VoiceOver: "Walmart Store, text field. 23 out of 50 characters."
    //                   ↑ label          ↑ role   ↑ accessibilityValue
}
```

---

### ❌ Bad Code — per-keystroke or no announcement

```swift
// ❌ Before fix (version 1 — no announcement):
func textFieldDidChange(_ textField: WCPTextField) {
    let count = textField.text?.count ?? 0
    characterCountLabel.text = "\(count)/\(maxCount)"
    // → VoiceOver: complete silence; user must leave field and navigate to see count
}

// ❌ Before fix (version 2 — per-keystroke, noisy):
func textFieldDidChange(_ textField: WCPTextField) {
    let count = textField.text?.count ?? 0
    UIAccessibility.post(notification: .announcement, argument: "\(count) of \(maxCount)")
    // → VoiceOver: "1 of 50" "2 of 50" "3 of 50" "4 of 50" ...
    //             ← Overlapping speech on every character
    //             ← User cannot type and listen simultaneously
}

// ❌ Wrong string format — "current" as String may not pronounce correctly
case storefrontNameCharacterCount(current: String, max: String):
// → String interpolation can produce "23.0 out of 50.0 characters" in some locales
```

---

### Announcement cadence examples

```
User types a 50-character name:
  0 chars  → [no announcement] (starting state, covered by initial render)
  1-9 chars → [no announcement] (below first threshold)
  10 chars  → "10 out of 50 characters" ← announced
  11-19     → [no announcement]
  20 chars  → "20 out of 50 characters" ← announced
  ...
  50 chars  → "50 out of 50 characters" ← announced (at limit)

User deletes back from 20 to 10:
  10 chars  → [no announcement] (lastAnnouncedCount == 10, skip duplicate)
  
User types again from 10 to 20:
  20 chars  → "20 out of 50 characters" ← announced again (valid new milestone)
```

---

### The 0.6-second delay

The delay serves three purposes:
1. Prevents the announcement from firing mid-keystroke — at 0.6s, the user has typically lifted their finger before the announcement speaks
2. Avoids clashing with VoiceOver's own key-tap feedback sound
3. Allows the character count label's visual update to complete before speech

The delay is exposed as `private(set) var characterCountAnnouncementDelay: TimeInterval = 0.6` so unit tests can set it to `0` without real async timing:
```swift
storefrontNameCell.testHooks.setCharacterCountAnnouncementDelay(0)
```

---

### Configuring the interval for your use case

| Field type | Recommended interval | Rationale |
|---|---|---|
| Short names (50 chars) | 10 | Users cross thresholds frequently |
| Medium descriptions (200 chars) | 20 | Fewer natural pause points |
| Long content (500+ chars) | 50 | Only announce major milestones |
| Character limit warning zone | Always | Announce when within 10 of max |

For the warning zone, add a special announcement when `max - current <= 10`:
```swift
if max - current == 10 {
    let warning = String.localized(.characterCountNearLimit(remaining: 10, max: max))
    UIAccessibility.post(notification: .announcement, argument: warning)
}
```

---

## 🔑 Key Rules

- **Announce at fixed N-character intervals, not per-keystroke** — per-keystroke announcements create overlapping speech that interrupts typing. An interval of 10 characters for short fields and 20–50 for longer fields gives regular progress updates without noise.
- **Guard against duplicate announcements at the same milestone** — `guard current != lastAnnouncedCharacterCount else { return }` prevents re-announcing if the user undoes and redoes to the same count.
- **Use `{count, number, integer}` ICU format** — integer formatting ensures the number is pronounced correctly ("10" not "10.0") across all locales. Avoid passing `String(count)` directly into an ICU string template.
- **Expose the count in `accessibilityValue`** — users who want to know the current count at any time can swipe to the text field and re-read it without waiting for an announcement. The `accessibilityValue` must be kept in sync with the visible character counter.
- **Set announcement delay to 0 in tests** — expose the delay via TestHooks so unit tests can verify announcement behavior synchronously without real `asyncAfter` waits.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus. A visible character counter that updates in real time is a status message — it communicates the outcome of the user's input (how many characters remain). Without a VoiceOver `.announcement` notification, this status information is only visually available, violating the requirement that status messages be programmatically determinable without receiving focus. Per-interval announcements and an updated `accessibilityValue` fulfill the 4.1.3 requirement in a non-disruptive way.

