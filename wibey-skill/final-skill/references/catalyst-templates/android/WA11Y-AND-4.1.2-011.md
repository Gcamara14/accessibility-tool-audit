# Catalyst Template: State — Toggle Switch On/Off State Not Announced

**Template ID:** `WA11Y-AND-4.1.2-011`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-011`
**Source Tickets:** CECPRO-32453
**Source PRs:** [walmart-glass #138397](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138397)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A toggle switch (`Switch`, `WcpSwitch`) visually changes between on and off states, but TalkBack does not clearly announce the **result** of the state change after the user interacts with it. Three variants of this bug:

1. **`contentDescription` set on the wrong view** — it is set on the container (`ViewGroup`) instead of the `Switch` itself, so TalkBack announces a label but never pairs it with "on" / "off".
2. **`isSelected` on the container** — the container's `isSelected = true/false` is used to track toggle state, but `isSelected` is a visual/styling flag and does not trigger an accessibility state announcement.
3. **No confirmation announcement** — after the state flips, TalkBack reads the native "on/off" bit automatically, but many users need an explicit confirmation ("Preferred address switch off") to understand the action completed.

**Symptom (Jira):** "TalkBack doesn't say on or off after toggling switch", "Switch state change not announced", "Preferred address toggle reads wrong label", "No confirmation after enabling setting toggle".

---

## ✅ The Fix Pattern

### Move `contentDescription` to the `Switch` and add explicit state announcement

**❌ Bad Code:**
```kotlin
// contentDescription is set on the CONTAINER, not on the Switch control itself.
// isSelected on the container is a visual flag only — not an accessibility state.
// TalkBack announces the container label but never pairs it with on/off state.
preferredAddressToggleContainer.isSelected = uiState.isPreferredAddress
preferredAddressToggleContainer.contentDescription =
    string(R.string.delivery_address_preferred_text)

preferredAddressSwitch.isChecked = uiState.isPreferredAddress
preferredAddressSwitch.setOnCheckedChangeListener { isChecked ->
    binding.preferredAddressToggleContainer.isSelected = isChecked  // ← visual only
    uiState.isPreferredAddress = isChecked
}
```

**✅ Good Code:**
```kotlin
// contentDescription goes directly on the Switch so TalkBack pairs
// the label with the native "on"/"off" announcement.
preferredAddressSwitch.contentDescription =
    string(R.string.delivery_address_preferred_text)
    // → TalkBack: "Preferred address, switch, off" (native state)

preferredAddressSwitch.isChecked = uiState.isPreferredAddress

preferredAddressSwitch.setOnCheckedChangeListener { isChecked ->
    uiState.isPreferredAddress = isChecked

    // ✅ Explicit confirmation announcement with slight delay to follow
    //    the native "on"/"off" read-out — gives user clear feedback.
    preferredAddressSwitch.postDelayed({
        val stateText = if (isChecked) ACCESSIBILITY_STATE_ON else ACCESSIBILITY_STATE_OFF
        preferredAddressSwitch.announceForAccessibility(
            "${string(R.string.delivery_address_preferred_text)} switch $stateText"
        )
        // → "Preferred address switch on"
    }, ACCESSIBILITY_ANNOUNCEMENT_DELAY_MS)
}
```

```kotlin
companion object {
    /** Delay after toggle state change before announcing (ms). */
    private const val ACCESSIBILITY_ANNOUNCEMENT_DELAY_MS = 400L
    private const val ACCESSIBILITY_STATE_ON = "on"
    private const val ACCESSIBILITY_STATE_OFF = "off"
}
```

---

### XML — do not place `contentDescription` on the parent container

**❌ Bad Layout:**
```xml
<!-- Setting contentDescription on the container prevents TalkBack from
     finding the Switch's own label + state pair. -->
<LinearLayout
    android:id="@+id/preferred_address_toggle_container"
    android:contentDescription="@string/delivery_address_preferred_text"
    android:focusable="true" ... >

    <com.walmart.design.components.WcpSwitch
        android:id="@+id/preferred_address_switch" ... />
</LinearLayout>
```

**✅ Good Layout:**
```xml
<!-- Remove contentDescription (and focusable) from container.
     The Switch itself carries the label and will announce its own state. -->
<LinearLayout
    android:id="@+id/preferred_address_toggle_container"
    android:importantForAccessibility="no" ... >

    <com.walmart.design.components.WcpSwitch
        android:id="@+id/preferred_address_switch"
        android:importantForAccessibility="yes" ... />
</LinearLayout>
```

---

### Using native `Switch` — minimal required setup

Native Android `Switch` and `WcpSwitch` expose `isChecked` as "on"/"off" automatically. The minimal required setup:

```kotlin
// 1. Set the label so TalkBack knows what this switch controls
binding.mySwitch.contentDescription = string(R.string.setting_label)

// 2. Keep isChecked in sync with your state
binding.mySwitch.isChecked = viewModel.isEnabled

// 3. Optionally confirm the new state to the user
binding.mySwitch.setOnCheckedChangeListener { isChecked ->
    viewModel.setEnabled(isChecked)
}
// TalkBack will automatically announce the on/off flip from the native widget.
// Add announceForAccessibility() only if the implicit "on"/"off" is insufficient
// for user comprehension (e.g., the setting name doesn't make the impact obvious).
```

---

## 🔑 Key Rules

- **Put `contentDescription` on the `Switch` widget, not its container** — native `Switch` / `WcpSwitch` pairs its own label with "on"/"off" state automatically. Setting `contentDescription` on a wrapping `ViewGroup` creates a separate, disconnected focus point that announces only the label with no state.
- **Remove `isSelected` from containers used for toggle state** — `View.isSelected` is a visual/styling hook (used for CSS-like state drawables); it does not appear in the accessibility node info and does not cause TalkBack to announce any state change.
- **`postDelayed(400ms)` before explicit confirmation** — the native `Switch` fires its own "on"/"off" announcement immediately; calling `announceForAccessibility()` without delay stacks both announcements and TalkBack may read them out of order or skip one. A 400ms gap lets the native announcement complete first.
- **Prefer native `Switch` / `WcpSwitch`** for all on/off settings — they handle checked-state exposure, role ("switch"), and "on"/"off" verbalisation by default. Custom toggle buttons require manual delegate work (see `WA11Y-AND-4.1.2-009`).

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The current state of user interface components must be programmatically determinable. A toggle switch whose on/off state is tracked via `View.isSelected` on a container, or whose `contentDescription` is on the wrong view, fails to expose its value to TalkBack. Users interact with the switch but cannot confirm whether the setting is now enabled or disabled.
