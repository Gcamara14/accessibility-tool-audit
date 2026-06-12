# Catalyst Template: Focus Order — TalkBack Focus Hijacked or Not Restored After Dialog Dismissal

**Template ID:** `WA11Y-AND-2.4.3-004`
**Platform:** Android
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-AND-2.4.3-004`
**Source Tickets:** CECPRO-30251, OAMD-0000, CEPG-368282
**Source PRs:** [walmart-glass #132323](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/132323), [walmart-glass #136596](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/136596)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Three related failure modes where TalkBack focus lands in the wrong place:

1. **Post-dialog focus not restored** — After a bottom sheet or confirmation dialog is dismissed, `requestFocus()` on a status/info message banner steals accessibility focus to the wrong view. The user is stranded on the banner instead of returning to the control that triggered the dialog (e.g., an "Edit" button in a list).
2. **`requestFocus()` in `onAttachedToWindow()`** — A view that requests focus on attach causes TalkBack to jump to that component on every page load, disrupting any in-progress navigation the user was performing.
3. **Duplicate close button** — A bottom sheet uses both a generic toolbar's close icon (`getSheetCloseIcon()`) and a custom toolbar's close icon, creating two focusable "Close" targets where only one should exist.

**Symptom (Jira):** "TalkBack doesn't return to Edit button after dialog closes", "Focus jumps to messages icon when opening Account page", "Two 'Close' buttons announced in bottom sheet", "TalkBack stuck on info banner after confirming InHome eligibility".

---

## ✅ The Fix Pattern

### Scenario A: Announce info message without stealing focus, then restore focus to trigger element

**❌ Bad Code:**
```kotlin
// After InHome eligibility dialog dismissal:
// requestFocus() moves TalkBack away from the "Edit" button to the info banner.
// User is now stranded — they must manually swipe back to continue editing.
Handler(Looper.getMainLooper()).postDelayed({
    binding.infoMessage.requestFocus()
    binding.infoMessage.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED)
}, 500L)
```

**✅ Good Code:**
```kotlin
// Announce the success/info message without stealing accessibility focus.
// TalkBack hears the message but focus stays on the Edit button.
infoMessage.text = text
infoMessage.postDelayed({
    infoMessage.announceForAccessibility(text)
}, ANNOUNCEMENT_DELAY_MS)
```

Register a fragment result listener so that when the dialog dismisses, focus is explicitly restored to the element the user activated:

```kotlin
/**
 * Sets up a listener for confirmation dialog dismissal to restore accessibility focus.
 * When the InHome eligibility dialog is dismissed, this finds the "Edit" button
 * of the previously clicked address and requests accessibility focus on it (CECPRO-30251).
 */
internal fun setupDialogDismissalListener() {
    parentFragmentManager.setFragmentResultListener(
        ConfirmationDialogFragment.KEY_DIALOG_DISMISS_REQUEST,
        viewLifecycleOwner
    ) { _, _ ->
        requestFocusOnLastClickedEditButton()
    }
}
```

Implement the focus-restoration function using `TYPE_VIEW_ACCESSIBILITY_FOCUSED` (not `TYPE_VIEW_FOCUSED`) and `ACTION_ACCESSIBILITY_FOCUS`:

```kotlin
internal fun requestFocusOnLastClickedEditButton() {
    val recyclerView = binding.recyclerView
    val position = findAddressPositionById(lastEditedAddressId)

    if (position in 0..<(recyclerView.adapter?.itemCount ?: 0)) {
        recyclerView.findViewHolderForAdapterPosition(position)?.let { viewHolder ->
            if (viewHolder is AddressViewHolder) {
                val actionButtonsRecyclerView = viewHolder.binding.actionButtons
                actionButtonsRecyclerView.post {
                    // Edit button is at position 1 in the nested action buttons list
                    val editButtonViewHolder = actionButtonsRecyclerView
                        .findViewHolderForAdapterPosition(EDIT_BUTTON_POSITION)
                    editButtonViewHolder?.itemView?.let { editButton ->
                        editButton.requestFocus()
                        editButton.sendAccessibilityEvent(
                            AccessibilityEvent.TYPE_VIEW_ACCESSIBILITY_FOCUSED  // ✅ not TYPE_VIEW_FOCUSED
                        )
                        editButton.performAccessibilityAction(
                            AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS,
                            null
                        )
                    }
                }
            }
        }
    }
}
```

---

### Scenario B: Remove `requestFocus()` from `onAttachedToWindow()`

**❌ Bad Code:**
```kotlin
// MessagesSettingsView.kt / MessagesSummaryView.kt
// requestFocus() on attach causes TalkBack to jump here on every Account page
// load — disrupting any navigation the user was already doing.
override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    requestFocus()   // ← Hijacks focus unconditionally
    unreadNotificationsJob = ...
}
```

**✅ Good Code:**
```kotlin
// Remove requestFocus() entirely. Views should not self-focus on attach.
// TalkBack navigation order is managed by view hierarchy and explicit
// focus restoration at logical transition points — not at construction time.
override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    // ✅ No requestFocus() — focus order is controlled by the host fragment
    unreadNotificationsJob = ...
}
```

---

### Scenario C: Eliminate duplicate close button in a BottomSheet

**❌ Bad Code:**
```kotlin
// BottomSheetConfig sets shouldShowToolbar = true (adds a generic toolbar close icon),
// AND the fragment separately sets a click listener on getSheetCloseIcon().
// TalkBack finds two "Close" buttons. One may not respond correctly.
val config = BottomSheetConfig(
    shouldShowToolbar = true,   // ← generic toolbar adds its own close icon
    ...
)

getSheetCloseIcon()?.setOnClickListener {  // ← attaches to the generic toolbar's icon
    dismissPBEvent(it)
    dismiss()
}
```

**✅ Good Code:**
```kotlin
// Disable the generic toolbar so only the custom toolbar's close icon exists.
val config = BottomSheetConfig(
    shouldShowToolbar = false,  // ✅ No duplicate generic toolbar close
    ...
)

// Attach the listener directly to the custom toolbar's close icon.
contentBinding.pbMainView.predictiveBasketToolbar.setOnCloseListener {
    dismissPBEvent(it)
    dismiss()
}

// When updating the close icon appearance, target the custom toolbar:
contentBinding.pbMainView.predictiveBasketToolbar.closeIconView
    .setBackgroundResource(backgroundCloseIcon)
```

---

## 🔑 Key Rules

- **`announceForAccessibility()` instead of `requestFocus()` for success/info banners** — post-dialog success messages should be announced without moving TalkBack focus away from the triggering control. Reserve `requestFocus()` for error states (2.4.3 error-focus pattern).
- **`TYPE_VIEW_ACCESSIBILITY_FOCUSED` for programmatic focus restoration** — use `sendAccessibilityEvent(TYPE_VIEW_ACCESSIBILITY_FOCUSED)` paired with `performAccessibilityAction(ACTION_ACCESSIBILITY_FOCUS, null)` to move TalkBack focus explicitly. `TYPE_VIEW_FOCUSED` triggers visual/keyboard focus only and does not move TalkBack cursor.
- **`setFragmentResultListener` for cross-fragment focus coordination** — when a child dialog dismisses and the parent fragment must restore focus, use `setFragmentResultListener` / `setFragmentResult` to coordinate the dismissal event rather than direct references across fragment boundaries.
- **Never call `requestFocus()` in `onAttachedToWindow()`** — focus requests on view attach are unconditional and disrupt any navigation already in progress. Request focus only at intentional user-action boundaries (form submission error, dialog open/close).
- **One close button per bottom sheet** — if a custom toolbar is present, set `shouldShowToolbar = false` in `BottomSheetConfig` to suppress the generic close icon. Two independently focusable close targets violate both 2.4.3 (focus order) and 4.1.2 (duplicate name/role).
- **`.post { }` / `.postDelayed { }` before focus or announcement calls** — ensures the target view is laid out and attached before `requestFocus()` or `announceForAccessibility()` fires. Immediate calls on freshly inflated views may be silently dropped.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components must receive focus in an order that preserves meaning and operability. Calling `requestFocus()` on an info banner after dialog dismissal, or in `onAttachedToWindow()`, disrupts the logical focus sequence — the user loses their place in the page and must re-navigate from an arbitrary location. Duplicate close buttons create ambiguous focus targets with identical names, making it impossible to determine which control is active.
