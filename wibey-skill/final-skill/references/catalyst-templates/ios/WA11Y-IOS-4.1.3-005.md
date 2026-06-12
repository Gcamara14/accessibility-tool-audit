# Catalyst Template: Status Messages — Dynamic Alert View Not Announced by VoiceOver

**Template ID:** `WA11Y-IOS-4.1.3-005`
**Platform:** iOS
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-IOS-4.1.3-005`
**Source Tickets:** CSRETPB-86694
**Source PRs:** [glass-app #147060](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/147060)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`ReviewItemsViewController` (Receipt Scanner / Buying List flow) shows a `WCPAlertView` when the status of added items changes. The alert view is made visible by setting `alertView.isHidden = false` — but when VoiceOver is running, the alert message is never announced.

```swift
// ❌ Before fix:
func showAlert(message: String, type: WCPAlertType) {
    alertView.dataModel = WCPAlertModel(
        message: NSAttributedString(string: message),
        messageType: type
    )
    alertView.isHidden = false
    // ← alertView appears visually, but VoiceOver users hear nothing
}
```

A VoiceOver user scanning a receipt and adding items has no way to know:
- How many items were successfully added to the cart
- Whether there was an error
- What the status of the batch add operation is

VoiceOver focus is typically on the item list or scanning controls, not on the alert view. The alert appearing does not trigger any VoiceOver notification automatically.

**Symptom (Jira):** "VoiceOver doesn't announce 'items added' message", "Screen reader misses status update in receipt scanner", "Alert view silent for VoiceOver users on buying list", "ADA: item count announcement missing on Review Items screen".

---

## ✅ The Fix Pattern

### Post `.announcement` notification when alert becomes visible

```swift
// ReviewItemsViewController.swift

func showAlert(message: String, type: WCPAlertType) {
    alertView.dataModel = WCPAlertModel(
        message: NSAttributedString(string: message),
        messageType: type
    )
    alertView.isHidden = false

    // ✅ Announce the status message to VoiceOver users
    //    .announcement does not move VoiceOver focus — it interrupts to speak
    //    the message and then resumes the user's current position.
    UIAccessibility.post(notification: .announcement, argument: message)
}
```

---

### When `.announcement` is the right notification

```swift
// Pattern: UIAccessibility.post(notification: .announcement, argument: message)

// Use .announcement when:
// ✅ A status message appears but focus should NOT move (user is mid-task)
// ✅ A transient alert/toast becomes visible (it will auto-hide)
// ✅ A counter updates ("3 items added", "Item removed")
// ✅ An error or confirmation appears that does not require interaction

// Do NOT use .announcement when:
// ❌ The user should actively interact with the new content → use .screenChanged
// ❌ The layout changed and focus needs to land on a specific element → use .layoutChanged
```

---

### ❌ Bad Code — alert visible but unannounced

```swift
// ❌ Before fix: only sets isHidden = false
func showAlert(message: String, type: WCPAlertType) {
    alertView.dataModel = WCPAlertModel(
        message: NSAttributedString(string: message),
        messageType: type
    )
    alertView.isHidden = false
    // ← VoiceOver sees the alert view in the hierarchy but never reads it
    // ← VoiceOver focus stays on the item list / scanning area
    // ← User has no indication items were added or if an error occurred
}
```

---

### Notification type reference

| Notification | VoiceOver behaviour | Interrupts focus? |
|---|---|---|
| `.announcement` | Speaks `argument` string immediately | No — focus stays where it was |
| `.screenChanged` | Moves cursor to `argument` view | Yes — user is redirected |
| `.layoutChanged` | Moves cursor to `argument` view | Yes — user is redirected |

For a status alert that appears in a corner/banner (the user continues their task), `.announcement` is correct — it speaks the message without disrupting navigation.

---

### String quality for announcements

The `message` string passed to `.announcement` should be a complete, self-contained sentence:

```swift
// ✅ Good — clear, complete, no jargon
"5 items added to your cart"
"1 item could not be found"
"All items added successfully"

// ❌ Bad — incomplete or visually-only phrasing
"5 items"          ← no verb
"Added!"           ← unclear what was added
"✓ Done"           ← symbol and informal phrasing
```

Use the same `message` string that is set as the `WCPAlertModel.message` — it is already designed to be the human-readable status text and should be suitable for VoiceOver without modification.

---

### When to also set `accessibilityLiveRegion` on the alert view

`UIAccessibility.post(notification: .announcement, argument:)` is an imperative notification — it fires once when called. An alternative declarative approach is to set the alert view's `accessibilityLabel` and keep it in the hierarchy, which can work for simple cases.

However, for views that appear and disappear (`isHidden` toggles), the imperative `.announcement` is more reliable:
- `accessibilityLiveRegion` (the iOS equivalent of `aria-live`) is set via `accessibilityLabel` + ensuring the view is in the hierarchy — but UIKit's implementation is less consistent than a direct `UIAccessibility.post`
- `.announcement` fires exactly once at the moment the alert appears, matching the user's expectation

---

## 🔑 Key Rules

- **Always post `.announcement` when showing a status alert to non-focused views** — `isHidden = false` alone does not notify VoiceOver. The accessibility tree update is not automatically announced unless VoiceOver's cursor is on or near the changed view.
- **Pass the full human-readable message string, not a localization key** — `UIAccessibility.post(notification: .announcement, argument:)` takes the string VoiceOver will speak directly. Pass the same string displayed in the alert view.
- **Use `.announcement`, not `.screenChanged`, for banners/toasts** — `.screenChanged` moves VoiceOver cursor to the argument, interrupting the user's scanning flow. For a transient status message, `.announcement` interrupts only to speak and then resumes — matching the non-VoiceOver user experience of glancing at a banner.
- **Do not duplicate announcements** — if the alert message is already being announced by another mechanism (e.g., a live region on a container), adding a second `.announcement` will cause double-reading. Audit the accessibility tree before adding announcements.
- **Handle dismiss silently** — when `alertView.isHidden = true` (alert dismissed), no announcement is needed. VoiceOver users heard the message when it appeared; announcing its disappearance is unnecessary noise.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus. A status alert that appears visually (items added count, error messages) but is not announced to VoiceOver fails this criterion. VoiceOver users cannot perceive the status of their action without physically moving focus to the alert view — which may have already disappeared. The `UIAccessibility.post(notification: .announcement, argument:)` call is the iOS equivalent of an `aria-live` region and satisfies the programmatic determination requirement.
