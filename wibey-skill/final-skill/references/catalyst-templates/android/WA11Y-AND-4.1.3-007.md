# Catalyst Template: Status Messages — `WcpSnackbar` Message Not Announced by TalkBack

**Template ID:** `WA11Y-AND-4.1.3-007`
**Platform:** Android
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-AND-4.1.3-007`
**Source Tickets:** COMM-1728
**Source PRs:** [walmart-glass #129879](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/129879)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`WcpSnackbar` is the Walmart design system snackbar component. When it appears (e.g., "Item added to cart", "Address saved"), TalkBack does not announce the message because:

1. The snackbar is added to the view hierarchy at a position outside TalkBack's current navigation window (typically an overlay `FrameLayout`). TalkBack does not automatically announce new views added in this way unless they have an active live region or an explicit accessibility event is fired.
2. The snackbar's `contentTextView` has no `accessibilityLiveRegion` attribute, so setting its `.text` property produces no announcement.
3. When a snackbar replaces an existing one (dismiss → show new), the `text` setter is called but — without a deduplication guard — setting the same message twice would fire the announcement twice.

**Symptom (Jira):** "TalkBack doesn't read snackbar message", "Screen reader misses 'Item added' notification", "Snackbar appears but is silent for accessibility", "WcpSnackbar ADA announcement missing".

---

## ✅ The Fix Pattern

### `announceForAccessibility()` in the `text` property setter with deduplication guard

In `WcpSnackbar.kt`, modify the `text` property setter to:
1. Check whether the new value differs from the current text (deduplication)
2. Call `contentTextView.post { contentTextView.announceForAccessibility(message) }` so the announcement fires after the view is fully attached and ready

```kotlin
// WcpSnackbar.kt

/**
 * The message text displayed in the snackbar.
 * Setting this property also explicitly announces the message via TalkBack.
 */
var text: CharSequence? = null
    set(value) {
        // ✅ Deduplication guard — only announce if the message actually changed.
        // Prevents double-announcement when the same message is set twice
        // (e.g., dismiss old snackbar → show same message again quickly).
        if (contentTextView.text != value) {
            contentTextView.text = value
            field = value
            // ✅ Announce only the message text (not the full view tree).
            // Use post() to ensure the view is attached and the accessibility
            // service is ready to receive the event.
            value?.let { message ->
                contentTextView.post {
                    contentTextView.announceForAccessibility(message)
                }
            }
        }
    }
```

---

### Why `announceForAccessibility()` instead of a live region

| Approach | Problem |
|---|---|
| `android:accessibilityLiveRegion="polite"` on `contentTextView` | Live region fires when the text changes but the view is added to the hierarchy **after** the live region registration — first appearance is not announced |
| `android:accessibilityLiveRegion="assertive"` | Same initial-appearance problem; also interrupts any ongoing speech, which can be disruptive |
| `announceForAccessibility(message)` | Fires an explicit `TYPE_ANNOUNCEMENT` accessibility event at a chosen point in time — reliable across all API levels and overlay placement strategies |

`announceForAccessibility()` fires `AccessibilityEvent.TYPE_ANNOUNCEMENT`, which TalkBack reads aloud without moving focus. This is the correct approach for ephemeral status messages (4.1.3) because:
- TalkBack focus stays where the user was navigating
- The announcement is queued and does not interrupt current speech when `POLITE` is the effective mode
- It works regardless of where the snackbar view is inserted in the hierarchy

---

### Optional close button description

The close button in `WcpSnackbar` can also carry a custom `description` string when the component type provides additional context (e.g., "notification" to say "Close notification"):

```kotlin
fun setCloseButton(showCloseButton: Boolean, description: String? = null) {
    if (showCloseButton) {
        closeButtonView?.visibility = VISIBLE
        val baseDescription = string(R.string.design_components_close_button_content_description)
        // → "Close"
        closeButtonView?.contentDescription = description?.let {
            "$baseDescription $it"
            // → "Close notification"
        } ?: baseDescription
        // → "Close" (no description provided)
    }
}
```

Call site:
```kotlin
WcpSnackbar.make(
    view = binding.root,
    message = "Item added to cart",
    showCloseButton = true,
    description = "notification"  // → TalkBack: "Close notification, Button"
)?.apply { show() }
```

---

### ❌ Bad Code — no announcement

```kotlin
// ❌ Old setter — sets text but fires no accessibility event.
// TalkBack never announces the snackbar message.
var text: CharSequence? = null
    set(value) {
        contentTextView.text = value
        field = value
        // ← No announceForAccessibility() → silent to TalkBack
    }
```

---

## 🔑 Key Rules

- **`announceForAccessibility()` in the property setter is the reliable snackbar announcement pattern** — it fires `TYPE_ANNOUNCEMENT` regardless of where the snackbar view is inserted. Live regions are unreliable for overlay/toast-style components added to the window after the accessibility service registers them.
- **Always use `.post { ... }` wrapping** — `announceForAccessibility()` must be called after the view is attached to the window. Calling it before `show()` completes can result in a no-op. The `post { }` lambda defers execution to the next main-thread loop iteration, by which point the view is in the hierarchy.
- **Deduplication guard prevents double announcements** — `if (contentTextView.text != value)` ensures that setting the same text twice (e.g., rapid dismiss-and-show of identical snackbars) does not cause TalkBack to announce the same message twice.
- **Announce the message text only, not the full description** — pass only `value` (the message string) to `announceForAccessibility()`, not a composite string including the close button description. The close button is a separate interactive element with its own label.
- **`description` parameter on `setCloseButton` for contextual close labels** — when the snackbar type is known (notification, error, confirmation), add the type as a suffix to "Close" so TalkBack users know what they're closing: "Close notification", "Close error", "Close confirmation".

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** Status messages conveyed through vision must be programmatically determinable through role or properties so they can be announced by assistive technologies without receiving focus. A snackbar is a status message — it communicates the outcome of a user action (item added, address saved) or an application event. When TalkBack users cannot hear the message because no accessibility event is fired, the status message is inaccessible. Users are left uncertain whether their action succeeded or failed. The `announceForAccessibility()` call in the setter ensures the status message is always communicated to AT without requiring TalkBack to navigate to the snackbar.
