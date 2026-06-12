# Catalyst Template: Value — Custom Selection View Announces "selected" Twice (`info.isSelected` + `info.stateDescription` Override)

**Template ID:** `WA11Y-AND-4.1.2-021`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-021`
**Source Tickets:** CEPG-360277
**Source PRs:** [walmart-glass #131469](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/131469)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A custom selectable view (tip option button, payment method selector, size chip) announces **"selected"** twice when the user activates it:

> **"Driver tip $5.00, selected, Button, selected"**

Root cause: the view's `contentDescription` string already contains the word "selected" (baked into the string resource), AND `view.isSelected = true` causes the Android accessibility framework to independently announce the selected state. TalkBack reads both.

On API 30+ (Android 11+), a `stateDescription` may also be set automatically from the component library, adding a third "selected" announcement.

**Symptom (Jira):** "TalkBack says 'selected' twice on tip option", "Screen reader double-announces selected state on payment selector", "Selection chip says 'selected, selected'", "Button announces 'selected' two or three times".

---

## ✅ The Fix Pattern

### `AccessibilityDelegateCompat` — build composite description, suppress redundant framework state

Override `onInitializeAccessibilityNodeInfo` to:
1. Build the full accessible name manually (including "selected" when appropriate)
2. Set `info.isSelected = false` to prevent the framework from appending its own "selected"
3. On API 30+, clear `info.stateDescription = null` to prevent state description duplication

```kotlin
private fun setupAccessibilityDelegate() {
    ViewCompat.setAccessibilityDelegate(
        binding.root,
        object : AccessibilityDelegateCompat() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfoCompat
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)

                // 1. Build the complete description with the selected state
                //    included exactly once, in the correct order:
                //    "Driver tip $5.00, selected" or "Driver tip $5.00" (not selected)
                val baseDescription = string(
                    R.string.tippingandfeedback_tip_button_label,
                    LocalisedStringKeys.AMOUNT to mainValue
                )
                val fullDescription = if (binding.root.isSelected) {
                    "$baseDescription, ${string(R.string.tippingandfeedback_selected)}"
                } else {
                    baseDescription
                }
                info.contentDescription = fullDescription

                // 2. Suppress the framework's automatic "selected" announcement.
                //    The view's real isSelected is still true (visual state unchanged).
                //    We only hide it from the accessibility tree.
                info.isSelected = false

                // 3. API 30+: clear stateDescription to prevent design-system components
                //    from injecting their own "selected" annotation.
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                    info.stateDescription = null
                }
            }
        }
    )
}
```

---

### Force accessibility refresh after selection changes

After the selection state changes, send `TYPE_WINDOW_CONTENT_CHANGED` to trigger a re-read of the accessibility node (so the delegate fires again with the new `isSelected` value):

```kotlin
fun updateSelectionState(isSelected: Boolean) {
    binding.root.isSelected = isSelected

    // Ensure the delegate is re-queried with the new state
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        binding.root.stateDescription = null
    }
    binding.root.sendAccessibilityEvent(
        android.view.accessibility.AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED
    )
}
```

---

### ❌ Bad Code — "selected" in string AND `isSelected = true` both reach TalkBack

```kotlin
// Old approach: bake "selected" into the contentDescription string resource
// AND let isSelected=true propagate to AT.
// TalkBack: "Driver tip $5.00, selected, Button, selected" (twice!)
binding.root.isSelected = true
binding.root.contentDescription = string(
    R.string.tippingandfeedback_positive_not_selected_button,
    // ↑ this string already contains "selected" or the unselected variant
    LocalisedStringKeys.UNSELECTED to mainValue
)
// ← No delegate → framework appends "selected" again from isSelected=true
```

---

### Comparison: this pattern vs `WA11Y-AND-4.1.2-017` (Switch "On, selected")

| Scenario | Root cause | Fix |
|---|---|---|
| **4.1.2-017** Switch says "On, selected" | LD Switch sets `isSelected=true` for visual styling; framework announces "selected" | `info.isSelected = false` only |
| **4.1.2-021** Custom view says "selected, selected" | Both `contentDescription` string AND `isSelected=true` carry the state | `info.isSelected = false` + `info.stateDescription = null` (API 30+) + manual state in `info.contentDescription` |

Use this pattern (021) when the `contentDescription` intentionally carries the state word. Use the simpler pattern (017) when you just want to suppress a visual styling `isSelected` that leaks into AT.

---

### Full call site in `init`

```kotlin
init {
    setupAccessibilityDelegate()  // ← called once at construction
}

fun bind(tipAmount: String, isSelected: Boolean) {
    mainValue = tipAmount
    binding.root.isSelected = isSelected
    sendAccessibilityRefresh()
}

private fun sendAccessibilityRefresh() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        binding.root.stateDescription = null
    }
    binding.root.sendAccessibilityEvent(
        android.view.accessibility.AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED
    )
}
```

---

## 🔑 Key Rules

- **Own the state in `info.contentDescription`, suppress in `info.isSelected`** — decide where "selected" lives. Either (a) put it in the string and suppress `isSelected`, or (b) rely on `isSelected = true` and put nothing in the string. Never both.
- **`info.isSelected = false` does not change the visual state** — `view.isSelected` remains true for styling. `info.isSelected = false` is a read-path override in `onInitializeAccessibilityNodeInfo`. The component still renders as selected visually.
- **On API 30+ clear `info.stateDescription = null`** — design-system components on Android 11+ may set a `stateDescription` (via `ViewCompat.setStateDescription()` or `view.stateDescription`). Clearing it in the delegate prevents triple announcements.
- **Send `TYPE_WINDOW_CONTENT_CHANGED` after state updates** — the delegate is queried lazily. Without an accessibility event, TalkBack may not re-query the node after a state change. Send this event to force a refresh.
- **`info.stateDescription = null` requires API level check** — `AccessibilityNodeInfoCompat.stateDescription` is API 30+. Always gate with `Build.VERSION.SDK_INT >= Build.VERSION_CODES.R`.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The states of user interface components must be programmatically determinable. A selectable view announcing "selected" twice presents a contradictory accessibility signal — the state is communicated redundantly, creating confusion about whether the announcement represents one state or two separate state changes. TalkBack users may believe they are hearing a transition ("selected → selected") rather than a stable state. The state must be announced exactly once, accurately reflecting the current component state.
