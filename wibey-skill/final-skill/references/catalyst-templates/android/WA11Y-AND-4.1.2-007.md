# Catalyst Template: State — Pressed/Selected State Not Announced for Toggle Buttons

**Template ID:** `WA11Y-AND-4.1.2-007`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-007`
**Source Tickets:** GPUGC-29032
**Source PRs:** [walmart-glass #133062](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/133062)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

An interactive button acts as a **toggle** — it can be in a selected or unselected state (thumbs up/down, like, helpful, sort, filter chip, favourite) — but **TalkBack never announces whether the button is currently pressed/selected or not**. The visual icon changes (filled vs outline), but the `contentDescription` stays the same regardless of state. Users cannot tell whether they have already selected the option.

**Symptom (Jira):** "Thumbs up button doesn't say selected after tapping", "Filter chip active state not announced", "Helpful button selected state missing from TalkBack", "Toggle button state not read by screen reader".

---

## ✅ The Fix Pattern

### Update `contentDescription` to reflect selected vs. unselected state

**❌ Bad Code:**
```kotlin
// Thumbs up toggle button — visually switches between filled/outline icon.
// contentDescription never changes → TalkBack always says "Thumbs up, 5 people likes it"
// even after the user has selected it, so they can't tell if it is active.
fun onThumbsUpTapped() {
    thumbsUpCount = max(0, thumbsUpCount + 1)
    binding.itemSnapshotReviewThumbsUpIcon.setImageResource(
        R.drawable.ld_ic_indigo_thumb_up_fill  // visual change only
    )
    // ← No contentDescription update
}
```

**✅ Good Code:**
```kotlin
// When the user selects thumbs up:
// → thumb-up icon: "Thumbs up selected, 5 people likes it"
// → thumb-down icon: "Thumbs down, 2 people dislikes it" (unselected state for peer)
internal fun thumbsUpSelected() {
    binding.itemSnapshotReviewThumbsUpIcon.contentDescription =
        string(
            R.string.ugc_ui_shared_review_summary_thumbs_up_selected_like_ada,
            LocalizedStringKeys.THUMBS_UP_COUNT to thumbsUpCount
        )
    binding.itemSnapshotReviewThumbsDownIcon.contentDescription =
        string(
            R.string.ugc_ui_shared_review_summary_thumbs_down_dislike_ada,
            LocalizedStringKeys.THUMBS_DOWN_COUNT to thumbsDownCount
        )
}

// When the user selects thumbs down:
// → thumb-down icon: "Thumbs down selected, 2 people dislikes it"
// → thumb-up icon: "Thumbs up, 5 people likes it" (unselected)
internal fun thumbsDownSelected() {
    binding.itemSnapshotReviewThumbsDownIcon.contentDescription =
        string(
            R.string.ugc_ui_shared_review_summary_thumbs_down_selected_dislike_ada,
            LocalizedStringKeys.THUMBS_DOWN_COUNT to thumbsDownCount
        )
    binding.itemSnapshotReviewThumbsUpIcon.contentDescription =
        string(
            R.string.ugc_ui_shared_review_summary_thumbs_up_like_ada,
            LocalizedStringKeys.THUMBS_UP_COUNT to thumbsUpCount
        )
}
```

Call the appropriate helper inside the click handler:

```kotlin
binding.itemSnapshotReviewThumbsUpIcon.setOnClickListener {
    if (!isThumbsUpSelected) {
        isThumbsUpSelected = true
        thumbsUpCount += 1
        binding.itemSnapshotReviewThumbsUpIcon.setImageResource(
            R.drawable.ld_ic_indigo_thumb_up_fill
        )
        thumbsUpSelected()  // ← update both buttons' contentDescription
    } else {
        isThumbsUpSelected = false
        thumbsUpCount = max(0, thumbsUpCount - 1)
        binding.itemSnapshotReviewThumbsUpIcon.setImageResource(
            R.drawable.ld_ic_indigo_thumb_up
        )
        setAccessibilityForThumbsUpDown()  // ← reset to unselected descriptions
    }
}
```

---

### String resources — paired selected/unselected descriptions

```xml
<!-- strings.xml -->
<!-- Unselected state -->
<string name="ugc_ui_shared_review_summary_thumbs_up_like_ada">Thumbs up, {thumbsUpCount} people likes it</string>
<string name="ugc_ui_shared_review_summary_thumbs_down_dislike_ada">Thumbs down, {thumbsDownCount} people dislikes it</string>

<!-- Selected state — note "selected" qualifier -->
<string name="ugc_ui_shared_review_summary_thumbs_up_selected_like_ada">Thumbs up selected, {thumbsUpCount} people likes it</string>
<string name="ugc_ui_shared_review_summary_thumbs_down_selected_dislike_ada">Thumbs down selected, {thumbsDownCount} people dislikes it</string>
```

---

### Alternative: `AccessibilityNodeInfoCompat.ACTION_CLICK` label

For buttons that expose their state through a custom action label, use `info.addAction()` to surface the opposite of the current state:

```kotlin
ViewCompat.setAccessibilityDelegate(toggleButton, object : AccessibilityDelegateCompat() {
    override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
        super.onInitializeAccessibilityNodeInfo(host, info)
        // Update contentDescription to include state
        host.contentDescription = if (isSelected) {
            string(R.string.button_label_selected)
        } else {
            string(R.string.button_label_unselected)
        }
        // Provide the action that the next click will perform
        info.addAction(
            AccessibilityNodeInfoCompat.AccessibilityActionCompat(
                AccessibilityNodeInfoCompat.ACTION_CLICK,
                if (isSelected) string(R.string.action_deselect) else string(R.string.action_select)
            )
        )
    }
})
```

---

## 🔑 Key Rules

- **Maintain a paired set of string resources** — one for the selected state, one for the unselected state. The "selected" string should include a qualifier word ("selected", "active", "on") so TalkBack users hear the difference.
- **Update peer buttons' descriptions when one is selected** — in a mutually exclusive pair (thumbs up / thumbs down, yes/no), toggling one on implicitly deselects the other. Update both descriptions in the same click handler to avoid stale state.
- **Update `contentDescription` synchronously with the visual change** — do not rely on `announceForAccessibility()` alone (it fires once and is missed if focus isn't nearby). The `contentDescription` on the node is read every time focus lands on the view.
- **Use `ViewCompat.setStateDescription()` for persistent "selected" label** — instead of encoding "selected" into `contentDescription`, you can use `ViewCompat.setStateDescription(view, "selected")` / `ViewCompat.setStateDescription(view, "")` to manage the state portion independently from the button label.
- **`setAccessibilityForThumbsUpDown()` or equivalent reset function** — always have a reset path that restores both peers to their unselected descriptions if the user deselects.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The current state of user interface components must be programmatically determinable. A toggle button that visually changes between filled and outline states without updating its `contentDescription` or exposing `isSelected` via the accessibility node fails to convey its current value to assistive technologies. Screen-reader users cannot determine whether they have already activated the toggle without the state being programmatically surfaced.
