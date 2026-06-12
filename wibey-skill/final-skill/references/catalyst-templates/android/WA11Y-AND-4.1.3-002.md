# Catalyst Template: Status Message — Error Messages Not Announced (Error Status Message)

**Template ID:** `WA11Y-AND-4.1.3-002`
**Platform:** Android
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-AND-4.1.3-002`
**Source Tickets:** AMENDS-1546
**Source PR:** [walmart-glass #139884](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139884)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

An error/alert banner appears on screen after a state change (e.g., cart threshold alert, fee warning) but **TalkBack does not announce it**. Two independent failure modes cause this:

1. **`accessibilityLiveRegion` on a RecyclerView row** — when DiffUtil responds to data changes with a *remove + insert* instead of an in-place update, the live region on the old view fires before the new view is attached. The new view is fresh with no pending announcement, so TalkBack stays silent.

2. **No explicit `announceForAccessibility()` call** — the feature relies entirely on the XML live region, missing the defense-in-depth announcement needed for RecyclerView-managed rows.

**Symptom (Jira):** "TalkBack doesn't announce the minimum fee alert", "Error message appears but screen reader user doesn't hear it", "Alert visible but not read aloud", or "Status update silent for TalkBack users".

---

## ✅ The Fix Pattern

### Two-part fix: DiffUtil in-place update + explicit announcement

**❌ Bad Code (DiffUtil):**
```kotlin
// Alerts are compared field-by-field. Any text change makes DiffUtil
// treat them as different items → remove old row + insert new row.
// accessibilityLiveRegion fires on removal, not on insertion → silent.
is EditItemsViewState.Alert -> newItem is EditItemsViewState.Alert && oldItem == newItem
```

**✅ Good Code (DiffUtil):**
```kotlin
// There will only ever be one alert; treat all alerts as the same row so
// DiffUtil updates the view in-place instead of removing and re-inserting it.
// This allows accessibilityLiveRegion on the layout to work correctly.
is EditItemsViewState.Alert -> newItem is EditItemsViewState.Alert
```

---

**❌ Bad Code (Fragment — no explicit announcement):**
```kotlin
// State observation renders the new alert text visually,
// but does not tell TalkBack anything changed.
private fun renderViewState(state: EditItemsViewState) {
    adapter.submitList(state.adapterRows)
    renderLoadingIndicator(state.loadingIndicator)
    // ← No accessibility announcement for alert changes
}
```

**✅ Good Code (Fragment — explicit announcement):**
```kotlin
private var previousAlertText: String? = null

private fun renderViewState(state: EditItemsViewState) {
    adapter.submitList(state.adapterRows)
    renderLoadingIndicator(state.loadingIndicator)
    announceAlertChangeForAccessibility(state)   // ← add explicit announcement
}

/**
 * AMENDS-1546: Announce minimum fee alert changes for TalkBack users.
 *
 * The alert is a RecyclerView row managed by DiffUtil. When alert content changes,
 * DiffUtil removes the old view and inserts a new one, which means
 * accessibilityLiveRegion on the XML alone does not trigger TalkBack announcements.
 * We must explicitly call announceForAccessibility when the alert text changes.
 */
private fun announceAlertChangeForAccessibility(state: EditItemsViewState) {
    val currentAlertText = state.adapterRows
        .filterIsInstance<EditItemsViewState.Alert>()
        .firstOrNull()
        ?.text
    if (currentAlertText != null && currentAlertText != previousAlertText) {
        announceForAccessibility(binding.root, currentAlertText)
    }
    previousAlertText = currentAlertText
}
```

**Key import:**
```kotlin
import com.walmart.glass.amends.common.ui.announceForAccessibility
```

---

### XML — keep `accessibilityLiveRegion` as defense-in-depth

Even with the explicit announcement, keep `accessibilityLiveRegion="polite"` or `"assertive"` on the alert layout. For cases where DiffUtil *does* update in place (e.g., a single persistent alert row that updates text), the live region covers the announcement without code changes.

```xml
<!-- Alert row layout — both attributes needed for full coverage -->
<com.walmart.design.components.WcpAlert
    android:id="@+id/edit_items_alert"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:accessibilityLiveRegion="polite"
    android:focusable="true"
    app:wcpAlertVariant="warning" />
```

---

## 🔑 Key Rules

- **RecyclerView + DiffUtil = silent live regions** — whenever a row type is recreated by diffing, the live region on the XML does not fire. Always add an explicit `announceForAccessibility()` call as a fallback.
- **Track `previousAlertText`** — only announce when the text actually changes. Announcing every render cycle causes duplicate/repetitive TalkBack reads.
- **DiffUtil item-sameness logic** — for singleton rows (there's only ever one alert, one banner, one timer), use type-only comparison (`newItem is AlertType`) rather than deep equality. This guarantees in-place updates and keeps live regions functional.
- **`announceForAccessibility(view, text)`** — use a root or stable view as the first argument. The call posts an `AccessibilityEvent.TYPE_ANNOUNCEMENT` event to the accessibility framework.
- **Do not call `requestFocus()` for status-only messages** — error-focus patterns (WCAG 2.4.3) belong to WA11Y-AND-2.4.3-002. Status announcements (WCAG 4.1.3) only need `announceForAccessibility`; forcing focus disrupts user navigation flow.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** Status messages (errors, alerts, warnings) that are rendered without receiving focus must still be programmatically determinable by assistive technologies. A RecyclerView alert row that relies solely on `accessibilityLiveRegion` in XML without explicit announcement fails to surface status changes to TalkBack when DiffUtil removes and re-inserts the row.
