# Catalyst Template: Error Alert Not Announced to VoiceOver After Programmatic Show

**Template ID:** `WA11Y-IOS-4.1.3-002`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 4.1.3 Status Messages
**Component:** Farmer's Dog profile — UIStackView+Extensions WCPAlert error display
**Source PRs:**
- [CEPG-372666](https://jira.walmart.com/browse/CEPG-372666) | commit `b2df494c07d1` — empty field error message not announced to VoiceOver
**Ingested:** 2026-04-30

---

## The Problem

When a `WCPAlert` error view is programmatically shown via `showAlert(_:)`, VoiceOver users never hear the error message. The alert appears visually but no `UIAccessibility.post` call is made, so the status message is completely silent to screen reader users.

**Root cause:** iOS VoiceOver does not monitor the view hierarchy for newly inserted views. Calling `showAlert(_:)` inserts the alert into the view tree but does not trigger any VoiceOver announcement. An explicit `UIAccessibility.post(notification: .announcement, argument:)` call must follow every programmatic error-alert show.

**File:** `Plugins/Pets/Pets/Sources/Extensions/UIStackView+Extensions.swift`

---

## Fix Pattern

### Posting `.announcement` After `showAlert(_:)` for Error Type Alerts (CEPG-372666)

**Bad Code:**
```swift
} else {
    let alert = WCPAlert(dataModel: model)
    showAlert(alert)
    // ❌ No announcement — VoiceOver users never hear the error
}
```

**Good Code:**
```swift
} else {
    let alert = WCPAlert(dataModel: model)
    showAlert(alert)
    if model.messageType == .error {
        let announcement = model.message.string.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !announcement.isEmpty else { return }
        DispatchQueue.main.async {
            UIAccessibility.post(notification: .announcement, argument: announcement)
        }
    }
}
```

**Why This Works:** `UIAccessibility.post(notification: .announcement, argument:)` delivers the error text directly to VoiceOver without moving focus. Wrapping in `DispatchQueue.main.async` gives the UI one run-loop cycle to settle (the alert view is fully inserted into the hierarchy) before VoiceOver reads it. Guarding against an empty string prevents a silent blank announcement that can confuse some VoiceOver versions.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Error announced to VoiceOver | Never — `showAlert` is silent | `.announcement` notification delivers the message string |
| Focus disruption | N/A | None — `.announcement` speaks without moving VoiceOver focus |
| Empty string guard | N/A | `guard !announcement.isEmpty else { return }` prevents blank announcements |
| Threading | N/A | `DispatchQueue.main.async` ensures UI is settled before announcement fires |

---

## Key Signals (For Pattern Matching)

- `showAlert(_:)` or equivalent `addSubview` / `insertArrangedSubview` call for an error alert with no following `UIAccessibility.post(...)`
- `WCPAlert`, `LDAlert`, or custom alert view shown in an `else` branch for `.error` message type
- Error alerts that appear visually (red border, warning icon) but VoiceOver users never hear the error text
- `.announcement` missing after any programmatic error state display
- Do NOT use `.screenChanged` here — that moves VoiceOver focus away from the field the user is editing

---

## Key Rules

- Use `UIAccessibility.post(notification: .announcement, argument:)` immediately after programmatically showing an error alert
- Wrap in `DispatchQueue.main.async` to allow the UI to settle before announcing
- Guard against empty strings to avoid blank VoiceOver announcements
- Do NOT use `UIAccessibility.post` with `.screenChanged` — that moves focus; `.announcement` keeps focus and just speaks

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | CEPG-372666 / commit b2df494c07d1 | Farmer's Dog profile — WCPAlert error | `.announcement` post in `DispatchQueue.main.async` after `showAlert` inside `.error` branch | Ingested |

---

## Related Templates

- `WA11Y-IOS-4.1.3-001` — iOS: Status messages not announced (filter counts, snackbar, VoiceOver debouncing)
- `WA11Y-IOS-4.1.3-003` — iOS: Snackbar/toast status messages not announced
- `WA11Y-IOS-4.1.2-001` — iOS: Button role missing on custom tappable view
