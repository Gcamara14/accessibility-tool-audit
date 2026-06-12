# Catalyst Template: Role — Switch Announces "On, selected" Instead of "On" (Suppress Redundant `isSelected` State)

**Template ID:** `WA11Y-AND-4.1.2-017`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-017`
**Source Tickets:** CEPG-373530
**Source PRs:** [walmart-glass #138653](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138653)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A `Switch` or `WcpSwitch` announces **"Preferred address, Switch, On, selected"** instead of the correct **"Preferred address, Switch, On"**.

The extra **"selected"** comes from the underlying design-system component (`ldSwitch` / `WcpSwitch`) setting `view.isSelected = true` when the switch is checked — a visual state used for styling. The Android accessibility framework surfaces `isSelected` as the "selected" state in the accessibility node, so TalkBack appends it alongside the switch's own "on"/"off" state.

Effect: TalkBack users hear two redundant state words ("On" and "selected") on every checked toggle switch, which is confusing and inconsistent with how a Switch is supposed to behave.

**Symptom (Jira):** "TalkBack says 'selected' on the preferred address switch", "Switch announces both 'on' and 'selected'", "Toggle announces redundant 'selected' state", "Screen reader reads extra word after on/off on switch".

---

## ✅ The Fix Pattern

### Suppress `isSelected` via `AccessibilityDelegateCompat`

Override `onInitializeAccessibilityNodeInfo` to force `info.isSelected = false` after the super call:

```kotlin
// ✅ Suppress the "selected" state from TalkBack.
// The LD Switch sets isSelected=true when checked (for visual styling), but this
// is exposed to the accessibility tree as a "selected" state, causing TalkBack
// to announce "On, selected" instead of just "On".
// Setting info.isSelected = false hides the visual state from AT without changing
// the switch's visual appearance.
ViewCompat.setAccessibilityDelegate(
    preferredAddressSwitch,
    object : AccessibilityDelegateCompat() {
        override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
            super.onInitializeAccessibilityNodeInfo(host, info)
            info.isSelected = false  // ← suppress redundant "selected" announcement
        }
    }
)
```

Set this delegate **once** at setup time (e.g., in `onViewCreated` / `bind()`), before attaching the `setOnCheckedChangeListener`:

```kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    // 1. Suppress "selected" state (must be set before listeners fire)
    ViewCompat.setAccessibilityDelegate(
        binding.preferredAddressSwitch,
        object : AccessibilityDelegateCompat() {
            override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.isSelected = false
            }
        }
    )

    // 2. Change listener — TalkBack hears "on" / "off" only (no "selected")
    binding.preferredAddressSwitch.setOnCheckedChangeListener { isChecked ->
        uiState.isPreferredAddress = isChecked
    }
}
```

---

### ❌ Bad Code — no delegate (default behaviour)

```kotlin
// LD Switch sets isSelected = true when checked.
// Without the delegate, the accessibility tree exposes isSelected → TalkBack:
// "Preferred address, Switch, On, selected"
binding.preferredAddressSwitch.setOnCheckedChangeListener { isChecked ->
    uiState.isPreferredAddress = isChecked
}
```

---

### Test assertion

```kotlin
@Test
fun `preferredAddressSwitch accessibility delegate suppresses isSelected when switch is checked`() {
    launch()
    val switch = binding.preferredAddressSwitch
    switch.isChecked = true  // triggers isSelected = true in the LD component

    val nodeInfo = ViewCompat.getAccessibilityNodeProvider(switch)?.let { return }
        ?: AccessibilityNodeInfoCompat.obtain()
    ViewCompat.getAccessibilityDelegate(switch)
        ?.onInitializeAccessibilityNodeInfo(switch, nodeInfo)

    // "selected" state must be false even when the switch is checked
    assertThat(nodeInfo.isSelected).isFalse()
    // "checked" state must still be true — the delegate only suppresses isSelected
    assertThat(nodeInfo.isChecked).isTrue()
}
```

---

### When else this pattern applies

Any component from the design system that uses `view.isSelected = true` for visual state but where the "selected" announcement is semantically wrong:

| Component | Visual use of `isSelected` | TalkBack symptom | Fix |
|---|---|---|---|
| `Switch` / `WcpSwitch` | Checked state highlight | "On, selected" | `info.isSelected = false` delegate |
| `RadioButton` row container | Selected row highlight | "Activated, selected" | `info.isSelected = false` on container |
| `TabLayout` active tab indicator | Active tab highlight | "Tab 1, selected, selected" (double) | `info.isSelected = false` on tab view |
| `FilterPill` | Active filter visual | "Size: S, selected, selected" | `info.isSelected = false` on pill |

---

## 🔑 Key Rules

- **`info.isSelected = false` only suppresses the AT state — it does not change the view's visual `isSelected`** — the component still renders its checked/selected appearance normally. This is a read path (`onInitializeAccessibilityNodeInfo`) override, not a write to the view's actual state.
- **Always call `super.onInitializeAccessibilityNodeInfo()` first** — the `super` call populates the node with all the real states (checked, enabled, focusable, etc.). Then override just `isSelected`. If you set `isSelected = false` before calling super, it may be overwritten.
- **This is not the same as suppressing the "checked" state** — `info.isChecked` controls whether TalkBack says "on"/"off" for a switch. Do NOT set `info.isChecked = false` — that would remove the switch state entirely. Only suppress `isSelected`.
- **Apply the delegate before any state changes occur** — if the delegate is applied after the first `setOnCheckedChangeListener` fires (e.g., on initial bind), the first announcement may still include "selected". Apply it in `onViewCreated` or at the top of `bind()`, before any state is set.
- **Audit all `WcpSwitch` / `LdSwitch` instances** — anywhere the design system toggle sets `isSelected = true` for styling, the same "selected" announcement bug will appear. Apply this delegate pattern systematically.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The states and properties of user interface components must be programmatically determinable. A `Switch` that announces "On, selected" presents two conflicting states to the user — "on" (correct, from `isChecked`) and "selected" (incorrect, from a visual styling flag). The "selected" state implies the switch can be deselected as a selectable item, which is not how a toggle switch behaves. This misrepresents the component's actual state and violates the requirement that states be accurately and programmatically determinable.
