# Catalyst Template: Focus Order — TalkBack Focus Lost After Dismissing a Nudge/Overlay

**Template ID:** `WA11Y-AND-2.4.3-008`
**Platform:** Android
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-AND-2.4.3-008`
**Source Tickets:** CEPG-352107
**Source PRs:** [walmart-glass #127136](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/127136)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A `WcpNudge` (dismissible banner) is displayed on the Trip Overview screen. When a TalkBack user activates the close (×) button:
1. The nudge's `visibility` is set to `View.GONE`
2. The view is removed from the layout
3. TalkBack focus is **lost** — it does not automatically move to any other view

The user is left with no active TalkBack focus. They must swipe to find the next focusable element from scratch.

Expected behavior: when the nudge is dismissed, TalkBack focus should move to the next logical element on the screen (in this case, `check_in_arrival_info_title` — the main page heading below the nudge).

**Symptom (Jira):** "TalkBack focus lost when closing nudge on Trip Overview", "Screen reader loses position after dismissing banner", "TalkBack goes silent after closing notification banner", "Focus disappears after nudge is dismissed".

---

## ✅ The Fix Pattern

### Provide `nextFocusViewId` to the nudge close handler

Add a `nextFocusViewId` parameter to `configureNudgeView()`. When the nudge is closed, find the view by ID and call `setFocusForAccessibility()` on it.

```kotlin
// NudgeViewConfigExt.kt

internal fun WcpNudge.configureNudgeView(
    // ... existing params ...
    nudgePrimaryAction: (View) -> Unit = {},
    closeNudgeAction: (View) -> Unit = {},
    nudgeViewConfig: NudgeViewConfig = NudgeViewConfig(),
    // ✅ Optional ID of the view to receive TalkBack focus after nudge is dismissed
    nextFocusViewId: Int? = null,
) {
    val nudgeCloseButton = findViewById<ImageButton>(LDThemedR.id.ld_nudge_close)
    // ... existing setup ...

    setOnCloseListener {
        closeNudgeAction.invoke(it)
        visibility = View.GONE

        // ✅ Restore TalkBack focus to the next logical element after dismissal
        nextFocusViewId?.let { viewId ->
            rootView?.findViewById<View>(viewId)?.setFocusForAccessibility()
        }
    }
}
```

---

### Call site — pass the target view ID

```kotlin
// UnifiedCheckInTripOverviewFragment.kt

private fun configureLocationNudge() {
    binding.locationNudgeView.configureNudgeView(
        nudgePrimaryAction = { view ->
            // ... handle share location ...
        },
        closeNudgeAction = { view ->
            // ... handle close analytics ...
        },
        // ✅ When nudge is dismissed, move focus to the arrival info heading
        nextFocusViewId = R.id.check_in_arrival_info_title
    )
}
```

---

### ❌ Bad Code — focus lost on dismiss

```kotlin
// ❌ Before fix — no nextFocusViewId
binding.locationNudgeView.configureNudgeView(
    nudgePrimaryAction = { view -> ... },
    closeNudgeAction = { view -> ... }
    // ← no nextFocusViewId → TalkBack focus is lost when nudge is dismissed
)
```

---

### `setFocusForAccessibility()` — the focus restoration utility

```kotlin
// Platform extension (glass.platform.ktx.android)

/**
 * Requests TalkBack accessibility focus on this view.
 * Uses sendAccessibilityEvent(TYPE_VIEW_FOCUSED) after requestFocus()
 * to ensure TalkBack moves its cursor to this view.
 */
fun View.setFocusForAccessibility() {
    requestFocus()
    sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_FOCUSED)
    // TalkBack responds to TYPE_VIEW_FOCUSED by moving its cursor to this view
}
```

The `sendAccessibilityEvent(TYPE_VIEW_FOCUSED)` fires an accessibility event that TalkBack interprets as "this view received focus". This is the same mechanism used by `performAccessibilityAction(ACTION_ACCESSIBILITY_FOCUS)` but is available to any View without the Jetpack wrapper.

---

### Choosing `nextFocusViewId`

The target view should be the most logical "next reading position" after the dismissed overlay. Prefer:

1. **The first content element below the dismissed overlay** — if the nudge is at the top of a scroll view, the main heading or first content item is the next logical stop.
2. **A contextual confirmation element** — if the nudge contained an action ("Location shared"), focus the confirmation text or the button that was activated.
3. **The page heading** — if there is no obvious next element, the page title/heading is always a safe fallback.

Avoid:
- **Focusing an element that is also about to be dismissed** (e.g., a sibling nudge that is also closing) — this creates a chain of focus-lost events.
- **Focusing a view that is not yet visible** — `setFocusForAccessibility()` on a `GONE` or `INVISIBLE` view is a no-op.

---

### When `nextFocusViewId` is optional (null)

For nudges that are dismissed as part of a screen transition (e.g., navigating to a new screen), there is no need to restore focus — the new screen's first focusable element will receive focus automatically. Pass `null` for `nextFocusViewId` in that case.

---

## 🔑 Key Rules

- **Always restore TalkBack focus after dismissing any overlay/nudge that currently holds focus** — when a view is removed or hidden while TalkBack's cursor is on it (or its close button), focus is lost. Explicitly request focus on the next logical element.
- **Call `setFocusForAccessibility()` inside `setOnCloseListener`** — not inside the dismiss animation completion callback. The view must already be `GONE` before requesting focus elsewhere, but the root view must still be valid. `setOnCloseListener` fires synchronously before any animation.
- **Use `rootView?.findViewById<View>(viewId)`** — the nudge may be inside a fragment or activity; using `rootView?.` instead of `view?.` or `binding.root` ensures the lookup starts from the topmost reachable view.
- **`nextFocusViewId` as a parameter, not hardcoded** — nudge views are reusable components used on multiple screens. Hardcoding a view ID inside `configureNudgeView()` couples the component to a specific screen. The caller passes the ID, keeping the nudge reusable.
- **Verify the target view is visible at the time of dismissal** — if `nextFocusViewId` points to a view that may be `GONE` or `INVISIBLE` at dismiss time (e.g., content that loads asynchronously), guard with `?.takeIf { it.isVisible }?.setFocusForAccessibility()`.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation. When a modal overlay is dismissed and TalkBack focus is lost, the user's navigation context is broken. The user must restart their traversal from the beginning of the page (or wherever TalkBack arbitrarily re-anchors) to continue reading. For a sighted user, dismissing a nudge returns their visual attention to what was visible behind it — an effortless context switch. TalkBack users deserve the same continuity.
