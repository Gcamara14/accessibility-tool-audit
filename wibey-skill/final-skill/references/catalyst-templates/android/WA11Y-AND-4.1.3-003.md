# Catalyst Template: Status Message — Snackbar Messages Not Announced to Screen Reader

**Template ID:** `WA11Y-AND-4.1.3-003`
**Platform:** Android
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-AND-4.1.3-003`
**Source Tickets:** SCSD-1924
**Source PR:** [walmart-glass #137539](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/137539)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A snackbar or transient notification banner is shown visually but **TalkBack does not announce its message**. Since snackbars appear for a limited time and do not receive focus automatically, screen-reader users miss the feedback entirely unless an explicit accessibility announcement is made.

Common failure patterns:
1. A custom banner/snackbar sets `text = message` and becomes visible, but no accessibility event fires.
2. A `RecyclerView`-driven error banner relies on `accessibilityLiveRegion` but DiffUtil removes-and-reinserts the row, silencing the live region (see WA11Y-AND-4.1.3-002 for the DiffUtil-specific fix).
3. `WcpSnackbar` is not used — a custom view is used instead, with no built-in announcement.

**Symptom (Jira):** "Snackbar / toast message not announced by TalkBack", "Error banner appears but TalkBack user doesn't hear it", "Action confirmation not read aloud", "Status update silent after Add to Cart failure".

---

## ✅ The Fix Pattern

### Pattern: Explicit `announceForAccessibility()` alongside visibility change

**❌ Bad Code:**
```kotlin
// Error banner becomes visible and shows the message,
// but no TalkBack announcement fires. Screen-reader user hears nothing.
binding.errorBanner.isVisible = true
binding.errorBanner.text = getPlatformApi<StringResourceApi>()
    .getLocalizedString(R.string.recipe_detail_atc_fail_message)
```

**✅ Good Code:**
```kotlin
// Build the full announcement string (may include prefix context like "Error, …")
val message = stringResourceApi.getLocalizedString(R.string.recipe_detail_atc_fail_message)
val error = stringResourceApi.getLocalizedString(R.string.recipe_error, "message" to message)

// Show the banner visually
binding.errorBanner.isVisible = true
binding.errorBanner.text = message          // visual text (short form)

// Announce the full contextual message to TalkBack
binding.errorBanner.announceForAccessibility(error)   // ← "Error, [message text]"
```

```xml
<!-- strings.xml -->
<string name="recipe_error">Error, {message}</string>
<string name="recipe_detail_atc_fail_message">We were unable to add these items to your cart. Please try again.</string>
```

---

### Using `WcpSnackbar` — announcement is built-in

The Walmart `WcpSnackbar` component automatically calls `announceForAccessibility()` whenever `text` is set:

```kotlin
// WcpSnackbar internally does:
//   contentTextView.post { contentTextView.announceForAccessibility(message) }
// So simply setting text is sufficient.

WcpSnackbar.make(binding.root, WcpSnackbar.Duration.SHORT)
    .also { snackbar ->
        snackbar.text = string(R.string.item_added_to_cart_confirmation)
        snackbar.show()
    }
```

**Use `WcpSnackbar` over custom snackbar implementations** to get accessibility (and duration ADA requirements) for free.

---

### `AccessibilityEvent.TYPE_ANNOUNCEMENT` for non-view announcements

When the status message is not tied to a specific visible view (e.g., announced in response to a ViewModel event):

```kotlin
// Post an announcement event from any root view
private fun announceStatusToTalkBack(message: String) {
    binding.root.post {
        binding.root.announceForAccessibility(message)
    }
}

// Or use ViewCompat for explicit event type:
private fun sendAccessibilityAnnouncement(view: View, message: String) {
    val event = AccessibilityEvent.obtain(AccessibilityEvent.TYPE_ANNOUNCEMENT)
    event.text.add(message)
    view.parent?.requestSendAccessibilityEvent(view, event)
}
```

---

### XML — add live region as defense-in-depth (not the primary mechanism)

```xml
<!-- Error banner — live region as backup, but do NOT rely on it alone for RecyclerView rows -->
<com.walmart.design.components.WcpAlert
    android:id="@+id/error_banner"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:accessibilityLiveRegion="polite"
    android:visibility="gone"
    app:wcpAlertVariant="error" />
```

> `accessibilityLiveRegion` works for stable views that update in-place. For RecyclerView rows managed by DiffUtil, always pair with explicit `announceForAccessibility()` — see WA11Y-AND-4.1.3-002 for the full DiffUtil-specific pattern.

---

## 🔑 Key Rules

- **`view.announceForAccessibility(message)` must be called explicitly** whenever a transient banner/snackbar becomes visible. Do not rely solely on `accessibilityLiveRegion` on a view that may be destroyed and recreated by `DiffUtil` or adapter changes.
- **Use `WcpSnackbar`** for all standard snackbar needs — it wraps the announcement logic and meets the ADA minimum 3500ms duration requirement.
- **Wrap message in a contextual prefix** ("Error, …", "Success, …", "Notice, …") so TalkBack users understand the severity without seeing visual styling cues (color, icon).
- **Use `.post { }` or `postDelayed { }`** to ensure the announcement fires after the view is attached and any layout transitions have completed. Immediate calls on a just-inflated or just-shown view may be ignored by the framework.
- **Do not call `requestFocus()` for status-only messages** — snackbars and transient banners should not steal focus. Use `announceForAccessibility()` to inform without disrupting navigation flow.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** Status messages that are presented without receiving focus (snackbars, toast-style alerts, transient banners) must be programmatically determinable by assistive technologies without requiring the user to move focus to the message. A snackbar with no `announceForAccessibility()` call and no working `accessibilityLiveRegion` is completely invisible to TalkBack.
