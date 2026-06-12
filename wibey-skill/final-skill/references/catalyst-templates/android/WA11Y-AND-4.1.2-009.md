# Catalyst Template: State — Checked/Unchecked State Not Announced (Checkbox / Switch)

**Template ID:** `WA11Y-AND-4.1.2-009`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-009`
**Source Tickets:** OAMBS-7756, PGSPHARM-55101, PGSPHARM-60319
**Source PRs:** [walmart-glass #123503](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/123503), [walmart-glass #124820](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/124820)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A custom checkbox, radio button, or toggle switch does **not announce its checked/unchecked state** to TalkBack. Users activate the control without knowing whether the action selected or deselected the option. Three failure modes:

1. **Label missing entirely** — the checkbox announces nothing but "checked" / "not checked", with no context of what it controls.
2. **`isChecked` not set on the `AccessibilityNodeInfoCompat`** — TalkBack cannot read the checked state because the delegate never sets it.
3. **Wrong event type used for state refresh** — `TYPE_VIEW_CLICKED` instead of `TYPE_WINDOW_CONTENT_CHANGED` means TalkBack does not re-query the delegate for updated state.

**Symptom (Jira):** "Checkbox doesn't say checked or unchecked", "Walmart Cash checkbox announced without label", "Not checked state not announced by TalkBack", "Toggle state not read after tap".

---

## ✅ The Fix Pattern

### Scenario A: Custom checkbox missing its label in the contentDescription

**❌ Bad Code:**
```kotlin
// Checkbox's contentDescription only contains its own binary state text.
// TalkBack says: "checked" — no label, no value context.
binding.checkboxOrRadio.isChecked = isSelected
// No contentDescription set → TalkBack reads only the checked indicator
```

**✅ Good Code:**
```kotlin
// Combine label + value(s) into one complete contentDescription.
// TalkBack says: "Walmart Rewards, Applied: $1.23, Remaining: $2.23"
binding.checkboxOrRadio.contentDescription =
    getWalmartRewardsLabel() + ACCESSIBILITY_PAUSE +
    binding.trailingText.text + ACCESSIBILITY_PAUSE +
    binding.cardRemaining.text

// ACCESSIBILITY_PAUSE = "," — causes TalkBack to pause between parts
```

**Test assertion verifying the combined description:**
```kotlin
assertThat(view.checkboxOrRadio.contentDescription)
    .isEqualTo("Walmart Rewards,Applied: $1.23,Remaining: $2.23")
```

---

### Scenario B: `AccessibilityDelegate` not exposing `isChecked` bit

**❌ Bad Code:**
```kotlin
// AccessibilityDelegate sets role but never sets isChecked.
// TalkBack knows this is a "switch" but can't announce its state.
ViewCompat.setAccessibilityDelegate(
    binding.switchView,
    object : AccessibilityDelegateCompat() {
        override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
            super.onInitializeAccessibilityNodeInfo(host, info)
            info.className = Switch::class.java.name
            // ← Missing: info.isChecked = isOn()
        }
    }
)
```

**✅ Good Code:**
```kotlin
ViewCompat.setAccessibilityDelegate(
    binding.switchView,
    object : AccessibilityDelegateCompat() {
        override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
            super.onInitializeAccessibilityNodeInfo(host, info)
            info.className = Switch::class.java.name
            info.isChecked = isOn()  // ✅ Expose the current checked state
        }
    }
)
```

---

### Scenario C: Wrong accessibility event after state change

When the checked state changes programmatically (e.g., from ViewModel data), TalkBack must be triggered to re-query the delegate. The wrong event type causes silence.

**❌ Bad Code:**
```kotlin
fun setChecked(isChecked: Boolean) {
    currentIsSelected = isChecked
    // TYPE_VIEW_CLICKED causes TalkBack to announce a "click" event,
    // not re-query the node's state. The state change is silent.
    itemView.sendAccessibilityEvent(AccessibilityEvent.TYPE_VIEW_CLICKED)
}
```

**✅ Good Code:**
```kotlin
fun setChecked(isChecked: Boolean) {
    currentIsSelected = isChecked
    // TYPE_WINDOW_CONTENT_CHANGED tells TalkBack content changed — it re-queries
    // the delegate's onInitializeAccessibilityNodeInfo and reads the new isChecked.
    itemView.sendAccessibilityEvent(AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED)
}
```

**Key import:**
```kotlin
import android.view.accessibility.AccessibilityEvent
```

---

### Using native `CheckBox` / `Switch` — no delegate needed

Native Android `CheckBox`, `Switch`, and `RadioButton` expose `isChecked` automatically. Prefer them over custom implementations:

```xml
<!-- ✅ Native CheckBox — TalkBack announces checked/unchecked automatically -->
<CheckBox
    android:id="@+id/my_checkbox"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/receive_notifications"
    android:checked="false" />
```

```kotlin
// Update state — no manual delegate or event needed
binding.myCheckbox.isChecked = viewModel.isNotificationsEnabled
```

---

## 🔑 Key Rules

- **`contentDescription` must include the label, not just the state** — "Walmart Rewards, Applied: $1.23" is informative; just "checked" is not.
- **`info.isChecked = currentState` in the delegate** is mandatory for custom switches and checkboxes. Without it, the checked state does not appear in the a11y node tree.
- **`TYPE_WINDOW_CONTENT_CHANGED` for programmatic state updates** — use this instead of `TYPE_VIEW_CLICKED` or `TYPE_VIEW_FOCUSED`. It signals to TalkBack that properties of the node have changed (including checked state) without implying user interaction.
- **Prefer native controls** (`CheckBox`, `Switch`, `RadioButton`) — they handle `isChecked` exposure, state announcements, and focus automatically. Use `AccessibilityDelegate` only when a fully custom compound view is unavoidable.
- **`ACCESSIBILITY_PAUSE` / comma separator** between content description parts gives TalkBack a natural pause between label, value, and state so the announcement is understandable, not run-together.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The current state of user interface components must be programmatically determinable. A custom checkbox or switch whose `isChecked` is not set in `AccessibilityNodeInfoCompat`, or whose state change does not trigger a re-query via `TYPE_WINDOW_CONTENT_CHANGED`, fails to expose its value to assistive technologies.
