# Catalyst Template: Status Message — General Status Messages Not Announced (Notify TalkBack Without Moving Focus)

**Template ID:** `WA11Y-AND-4.1.3-004`
**Platform:** Android
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-AND-4.1.3-004`
**Source Tickets:** CEPG-371979, TXNCART-11265
**Source PRs:** [walmart-glass #137346](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/137346), [walmart-glass #139461](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139461)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A **visual change occurs on screen** that is meaningful to the user — order status update, item quantity change, loading completion, data refresh — but **TalkBack is never notified**. Since no focus moves, TalkBack users have no way to know the screen has changed unless they manually swipe to find the updated content.

Two common causes:
1. `contentDescription` is assembled **before data is populated** — the node describes stale/empty state at the time of first focus.
2. Status changes during an animation/transition — the accessibility announcement is queued **inside** the transition listener (`onTransitionEnd`) instead of before it, causing batching bugs where multiple announcements fire all at once.

**Symptom (Jira):** "TalkBack doesn't announce updated order status", "Quantity change not announced to screen reader", "Loading complete not communicated", "Status update fires all at once on collapse instead of incrementally".

---

## ✅ The Fix Pattern

### Scenario A: Status content description set before data is ready

**❌ Bad Code:**
```kotlin
// setupGroupAccessibility() assembles contentDescription from group data.
// But it's called BEFORE all group properties (e.g., statusMessage) are populated.
// TalkBack user focuses the group and hears an incomplete description.
groups.forEachIndexed { index, group ->
    setupGroupAccessibility(groups[index])  // ← called too early
    groups[index].trackingNumber = order.trackingNumber
    groups[index].statusMessage = order.status.message  // ← set AFTER
}
```

**✅ Good Code:**
```kotlin
// Populate all data first, THEN update the contentDescription.
groups.forEachIndexed { index, group ->
    groups[index].trackingNumber = order.trackingNumber
    groups[index].statusMessage = order.status.message
    // Now all data is ready — assemble and set the full content description
    if (isPhV3Enabled) {
        groups[index].contentDescription = groups[index].obtainContentDescription()
        // TalkBack announces: "Delivered Oct 12 · Track order · We'll try delivering again soon"
    }
}
```

---

### Scenario B: Accessibility announcement inside transition listener causes batching

**❌ Bad Code:**
```kotlin
// accessibilityTask() is called INSIDE onTransitionStart.
// If the transition listener is not registered before beginDelayedTransition,
// waitingOnTransition stays true and all subsequent announcements are queued.
// On collapse they all fire at once (batching ADA bug).
binding.quantityStepper.apply {
    addListener(object : TransitionListenerAdapter() {
        override fun onTransitionStart(transition: Transition) {
            isAnimating = true
            accessibilityTask(this@apply)  // ← Too late: transition already in-flight
        }
        override fun onTransitionEnd(transition: Transition) {
            isAnimating = false
        }
    })
    beginDelayedTransition(...)
}
```

**✅ Good Code:**
```kotlin
// accessibilityTask() is called BEFORE beginDelayedTransition — while the
// transition is still pending. This registers the listener in the correct order
// so each quantity change fires its announcement immediately.
binding.quantityStepper.apply {
    // ✅ Must be called before beginDelayedTransition
    accessibilityTask(this)

    addListener(object : TransitionListenerAdapter() {
        override fun onTransitionStart(transition: Transition) {
            isAnimating = true
        }
        override fun onTransitionEnd(transition: Transition) {
            isAnimating = false
        }
    })
    beginDelayedTransition(...)
}
```

---

### General pattern: `announceForAccessibility()` for non-focus status updates

When a ViewModel/state updates a data value without any view transition, use `announceForAccessibility()` on the container to broadcast the change:

```kotlin
// Observe status changes and announce each one
viewModel.orderStatus.observe(viewLifecycleOwner) { status ->
    binding.orderStatusText.text = status.displayText
    // ✅ Announce the new status without moving TalkBack focus
    binding.orderStatusText.post {
        binding.orderStatusText.announceForAccessibility(status.displayText)
    }
}
```

For quantity stepper updates:
```kotlin
// Called after stepper quantity changes
private fun announceQuantityUpdate(newQty: Int, productName: String) {
    val message = string(R.string.quantity_updated_announcement, "quantity" to newQty, "name" to productName)
    binding.root.announceForAccessibility(message)
    // → "Quantity updated to 3, Great Value 2% Milk"
}
```

---

## 🔑 Key Rules

- **Populate all data before assembling `contentDescription`** — if the description is built from multiple fields (trackingNumber, statusMessage, ETA), assemble it after all fields are set, not at view-creation time.
- **Call `accessibilityTask()` / `announceForAccessibility()` BEFORE `beginDelayedTransition()`** — once a transition starts, any accessibility work queued inside a transition listener is deferred until the animation ends, causing all deferred announcements to batch-fire together.
- **`.post { }` wrapping** ensures the announcement fires after the current layout pass — prevents "view not yet attached" failures on `announceForAccessibility()`.
- **Do not move focus** for status-only announcements — use `announceForAccessibility()` which fires `TYPE_ANNOUNCEMENT` without changing which node is focused. Focus changes (via `requestFocus()`) are for 2.4.3 error-focus patterns, not status updates.
- **Keep announcement text concise** — TalkBack reads the full string. "Order status: We'll try delivering again soon" is better than a multi-sentence paragraph.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** Status messages that are not given focus must be programmatically determinable by assistive technologies so that users can be informed of the change without needing to navigate there. A content description assembled from stale data, or an announcement batched by a transition listener, fails to convey the status change at the time it occurs.
