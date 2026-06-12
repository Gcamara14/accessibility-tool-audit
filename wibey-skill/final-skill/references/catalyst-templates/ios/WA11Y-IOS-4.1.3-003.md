# Catalyst Template: Snackbar / Toast Status Message Not Announced to VoiceOver

**Template ID:** `WA11Y-IOS-4.1.3-003`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 4.1.3 Status Messages
**Component:** WCPSnackBar / LDSnackbar — ManageBasketSubscriptions, ratings snackbar
**Source PRs:**
- [#113765](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/113765) | [CRUISE-11344](https://jira.walmart.com/browse/CRUISE-11344) | commit `4cf14df340a0` — snackbar not announced in ManageBasketSubscriptionsCoordinator
- [#130367](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/130367) | [CEPG-324315](https://jira.walmart.com/browse/CEPG-324315) | commit `289388161b83` — ratings snackbar `needsAccessibilityAnnouncement` set to `false`
- WCPSnackBar core | commit `919755db2b6d` — `WCPSnackBar` model has `needsAccessibilityAnnouncement: Bool = true`
**Ingested:** 2026-04-30

---

## The Problem

Snackbar / toast messages appear on screen after a user action (subscription change, item rating) but VoiceOver users never hear them. This happens in two ways:

1. **Custom snackbar shown without an explicit `UIAccessibility.post` call** — the snackbar appears visually but VoiceOver is never told to speak it.
2. **`WCPSnackBar` / `LDSnackbar` model created with `needsAccessibilityAnnouncement: false`** — the platform component's built-in announcement is explicitly disabled, silencing VoiceOver.

**Root cause:** iOS VoiceOver does not auto-announce newly inserted views. The `WCPSnackBar` platform component handles announcements automatically via `didMoveToWindow` — but only when `needsAccessibilityAnnouncement` is `true` (the default). Any override to `false` or use of a custom snackbar without a manual post means VoiceOver users miss the message.

**Platform component auto-announce mechanism:**
```swift
// WCPSnackBar.swift (platform component)
public override func didMoveToWindow() {
    super.didMoveToWindow()
    guard window != nil, model.needsAccessibilityAnnouncement else { return }
    let message = model.message
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
        UIAccessibility.post(notification: .announcement, argument: message)
    }
}
```

---

## Fix Patterns

### Pattern A: Custom Snackbar — Missing `UIAccessibility.post` After Show (CRUISE-11344)

**Bad Code:**
```swift
// ❌ Snackbar shown but VoiceOver never hears it
showSnackbar(with: snackbarType.snackbarConfig, insets: LayoutConstrainingInsets(
    bottom: snackbarType.bottomInset
))
```

**Good Code:**
```swift
showSnackbar(with: snackbarType.snackbarConfig, insets: LayoutConstrainingInsets(
    bottom: snackbarType.bottomInset
))
UIAccessibility.post(notification: .announcement, argument: snackbarType.snackbarMessage)
```

**Why This Works:** The custom `showSnackbar` helper does not post a VoiceOver announcement. Adding an explicit `UIAccessibility.post(notification: .announcement, argument:)` immediately after the call delivers the snackbar text to VoiceOver without moving focus.

---

### Pattern B: WCPSnackBar / LDSnackbar — `needsAccessibilityAnnouncement` Set to `false` (CEPG-324315)

**Bad Code:**
```swift
// ❌ needsAccessibilityAnnouncement explicitly set to false — VoiceOver silent
ratingSnackbar.dataModel = LDSnackbar.Model(
    message: message,
    needsAccessibilityAnnouncement: false
)
```

**Good Code:**
```swift
// ✅ Set to true (or omit, since default = true)
ratingSnackbar.dataModel = LDSnackbar.Model(
    message: message,
    needsAccessibilityAnnouncement: true
)
```

**Why This Works:** `WCPSnackBar` / `LDSnackbar` posts its own announcement in `didMoveToWindow` when `needsAccessibilityAnnouncement` is `true`. Setting it to `false` disables that built-in path. The only valid reason to set `false` is when the snackbar is purely decorative and its message is already announced elsewhere; for any user-facing status message, `true` (or omission of the parameter) is correct.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Snackbar message announced | Never — show call is VoiceOver-silent | `.announcement` notification delivers the message |
| Focus disruption | N/A | None — `.announcement` speaks without moving VoiceOver focus |
| WCPSnackBar built-in path | Bypassed via `needsAccessibilityAnnouncement: false` | Re-enabled by setting `true` or omitting the parameter |
| Announcement timing | N/A | 0.5–1.0s `asyncAfter` delay lets snackbar appear before VoiceOver reads |

---

## Key Signals (For Pattern Matching)

- `showSnackbar(...)` call with no following `UIAccessibility.post(...)` call
- `WCPSnackBar.Model` or `LDSnackbar.Model` constructed with `needsAccessibilityAnnouncement: false`
- Snackbar/toast that appears visually after a subscription change, cart action, or rating submission but is never heard by VoiceOver
- Do NOT use `.screenChanged` notification — that moves VoiceOver focus, disorienting keyboard and switch-control users

---

## Key Rules

- `WCPSnackBar` / `LDSnackbar` has `needsAccessibilityAnnouncement: Bool = true` — **never set it to `false`** unless the snackbar is decorative
- When using a custom snackbar that doesn't auto-announce, call `UIAccessibility.post(notification: .announcement, argument:)` directly after showing it
- Use a 0.5–1.0s `asyncAfter` delay to let the snackbar appear before VoiceOver reads it
- Do NOT use `.screenChanged` notification — that moves focus, disorienting keyboard users

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | CRUISE-11344 / PR #113765 | ManageBasketSubscriptions snackbar | Explicit `UIAccessibility.post(.announcement)` after `showSnackbar(...)` | Ingested |
| Var 2 | CEPG-324315 / PR #130367 | Ratings snackbar — `LDSnackbar.Model` | `needsAccessibilityAnnouncement` restored to `true` | Ingested |

---

## Related Templates

- `WA11Y-IOS-4.1.3-001` — iOS: Status messages not announced (filter counts, snackbar focus restoration, debouncing)
- `WA11Y-IOS-4.1.3-002` — iOS: Error alert not announced after programmatic show
- `WA11Y-WEB-4.1.3-003` — Web: Snackbar `announcePolite()` + `setTimeout(1000)`
