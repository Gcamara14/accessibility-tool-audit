# Catalyst Template: Status Messages — Snackbar/Toast Announcement With Delay and Opt-Out Toggle (`WCPSnackBar`)

**Template ID:** `WA11Y-IOS-4.1.3-006`
**Platform:** iOS
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-IOS-4.1.3-006`
**Source Tickets:** PROJECT (WCPSnackBar)
**Source PRs:** [glass-app #158267](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/158267)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`WCPSnackBar` (a toast/snackbar component) displays transient status messages (e.g., "Item added to cart", "Address saved"). Without a VoiceOver announcement, these messages are displayed on screen but never read aloud. VoiceOver users miss the status feedback entirely.

An additional problem: snackbar messages triggered by rapid user actions (e.g., multiple quick taps) can produce unwanted interruptions if every snackbar fires its announcement immediately. Some call sites need to suppress the announcement when a snackbar is used purely as a visual indicator in a flow that has its own separate VoiceOver feedback.

**Symptom:** "VoiceOver misses 'Item added' snackbar toast", "Screen reader doesn't announce snack bar message", "Multiple toast announcements interrupt each other", "Snackbar silent for VoiceOver users on cart screen".

---

## ✅ The Fix Pattern

### `needsAccessibilityAnnouncement` parameter + delayed post

```swift
// WCPSnackBar+Model.swift  (Living Design component)

extension WCPSnackBar {
    public struct Model {
        public let message: String
        public let leadingIcon: WCPIcon?
        // ... other properties ...

        /// Whether to announce the snackbar's message via VoiceOver when presented.
        /// Defaults to `true`. Set to `false` for snackbars shown in flows that
        /// have their own VoiceOver feedback to avoid duplicate announcements.
        public var needsAccessibilityAnnouncement: Bool

        public init(
            message: String,
            leadingIcon: WCPIcon? = nil,
            // ...
            needsAccessibilityAnnouncement: Bool = true  // ← default true: always announce
        ) {
            self.message = message
            // ...
            self.needsAccessibilityAnnouncement = needsAccessibilityAnnouncement
        }
    }
}
```

```swift
// WCPSnackBar.swift  (Living Design component)

private func postAccessibilityAnnouncement() {
    // ✅ Guard: only post if window is available AND announcement is opted-in
    guard window != nil, model.needsAccessibilityAnnouncement else { return }

    let message = model.message

    // ✅ Delay by 1 second to let the snackbar appearance animation complete
    //    Posting immediately fires before VoiceOver processes the layout change,
    //    causing the announcement to be dropped or announced out of order.
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
        UIAccessibility.post(notification: .announcement, argument: message)
    }
}
```

---

### Call site — default (announce)

```swift
// Typical usage — announcement is on by default, no parameter needed
let snackBarModel = WCPSnackBar.Model(
    message: "Item added to cart"
    // needsAccessibilityAnnouncement not set → defaults to true
)
snackBar.model = snackBarModel
// VoiceOver: "Item added to cart" (1 second after snackbar appears)
```

---

### Call site — opt out when flow has its own VoiceOver feedback

```swift
// Suppress announcement when the presenting screen handles VoiceOver separately
let snackBarModel = WCPSnackBar.Model(
    message: "Saving...",
    needsAccessibilityAnnouncement: false  // ← suppress: screen posts its own .screenChanged
)
snackBar.model = snackBarModel
// VoiceOver: (no announcement — handled by the screen's .screenChanged notification)
```

---

### ❌ Bad Code — no announcement, no delay guard

```swift
// ❌ Before fix (version 1 — no announcement at all):
// WCPSnackBar never called UIAccessibility.post
// → VoiceOver users hear nothing when snackbar appears

// ❌ Before fix (version 2 — immediate post, no opt-out):
if window != nil {
    let message = model.message
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
        UIAccessibility.post(notification: .announcement, argument: message)
    }
}
// ← No needsAccessibilityAnnouncement guard
// → Snackbars used as silent visual indicators still announce
// → Duplicate announcements when screen has its own VoiceOver feedback
```

---

### Why 1-second delay for snackbar announcements

Snackbar appearance animations typically run for 0.3–0.5 seconds. During this time:
- The view is transitioning onto the screen
- UIKit is processing layout changes
- VoiceOver is processing any pending notifications from the action that triggered the snackbar (e.g., a cart add)

Posting `.announcement` immediately (at `t=0`) may:
- Get dropped by VoiceOver if it's processing a more urgent notification
- Compete with the cart add's own `.screenChanged` notification
- Fire before the user's ears have registered the tap feedback

A 1-second delay ensures the animation has settled and competing notifications have been processed:

```
t=0.0s   User taps "Add to cart"
t=0.0s   Cart add action fires; .screenChanged or .announcement posted by cart logic
t=0.0s   WCPSnackBar becomes visible (starts animation)
t=0.3s   Snackbar animation completes
t=0.5s   Cart logic's notification is processed by VoiceOver
t=1.0s   WCPSnackBar posts .announcement → VoiceOver reads "Item added to cart"
         ↑ Enough delay to avoid clash
```

---

### `.announcement` vs. focus-moving notifications for snackbars

| Notification | Use for snackbars? | Reasoning |
|---|---|---|
| `.announcement` | ✅ Yes | Speaks the message without moving focus — user stays where they are |
| `.screenChanged` | ❌ No | Moves VoiceOver focus to `argument` — disruptive for a transient banner |
| `.layoutChanged` | ❌ No | Also moves focus — inappropriate for a toast that doesn't require interaction |

Snackbars are transient, non-interactive status messages. They should use `.announcement` exclusively — the user's VoiceOver position must not be disturbed.

---

### The `needsAccessibilityAnnouncement = false` opt-out cases

Set `needsAccessibilityAnnouncement = false` when:
- The presenting view controller posts its own `UIAccessibility.post(notification: .announcement, ...)` for the same action
- The snackbar appears during a screen transition (the `.screenChanged` for the new screen covers the status)
- The snackbar is used as a loading indicator ("Saving...") and the completion state ("Saved") has its own announcement

Never set `needsAccessibilityAnnouncement = false` as a default or shortcut to avoid implementing accessibility — the parameter exists to prevent **duplication**, not to suppress necessary announcements.

---

## 🔑 Key Rules

- **All `WCPSnackBar` instances must announce their message to VoiceOver by default** — `needsAccessibilityAnnouncement` defaults to `true`. Do not set it to `false` unless there is an explicit reason (duplicate announcement in the same flow).
- **Delay the announcement by ~1 second** — posting `.announcement` immediately after a snackbar appears competes with animation and preceding notifications. A 1-second delay ensures the message is heard after the UI has settled.
- **Use `.announcement`, not `.screenChanged`** — snackbars are non-interactive transient messages. VoiceOver focus must not move when a snackbar appears.
- **Guard on `window != nil`** — if `postAccessibilityAnnouncement` is called before the view is in the window hierarchy, the announcement is dropped. The `window != nil` check ensures the view is visible before posting.
- **`needsAccessibilityAnnouncement = false` opt-out for duplicate flows** — use the opt-out parameter when the presenting screen has its own VoiceOver feedback for the same action. Never use it as a blanket suppression.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus. A `WCPSnackBar` that appears without a `UIAccessibility.post(notification: .announcement, ...)` fails this criterion for VoiceOver users — the status message is visible on screen but not programmatically communicated to the assistive technology. The `.announcement` notification is the iOS equivalent of an `aria-live` region and fulfills the "programmatically determined without focus" requirement.
