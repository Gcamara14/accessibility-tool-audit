# Catalyst Template: State — Expanded/Collapsed State Not Announced (Accordion)

**Template ID:** `WA11Y-AND-4.1.2-010`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-010`
**Source Tickets:** CEWMPLUS-151290
**Source PR:** [walmart-glass #136854](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/136854)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

An expandable/collapsible section (accordion, collapse-expand view, FAQ panel) **does not tell TalkBack users whether it is currently expanded or collapsed**. After a user activates the toggle, they hear the component name but receive no confirmation of whether they just opened or closed the section. They must swipe forward to infer state from whether content appeared.

Additionally, using `announceForAccessibility()` for state changes fires a **one-shot announcement** that is missed if the user has already moved focus. The state is not retained in the accessibility node, so if the user swipes back to the header it reads no state.

**Symptom (Jira):** "TalkBack doesn't say expanded or collapsed", "Accordion state not announced", "User doesn't know if section opened", "State description missing after toggle".

---

## ✅ The Fix Pattern

### `ViewCompat.setStateDescription` — persistent state on the header view

**❌ Bad Code:**
```kotlin
// announceForAccessibility fires once at toggle time — if TalkBack user
// isn't focused here, or navigates back later, state is unknown.
fun onExpanded() {
    announceForAccessibility(
        string(R.string.ui_components_collapse_expand_view_expanded_text)
    )
}

fun onCollapsed() {
    announceForAccessibility(
        string(R.string.ui_components_collapse_expand_view_collapsed_text)
    )
}
```

**✅ Good Code:**
```kotlin
// setStateDescription writes state onto the accessibility node itself.
// TalkBack announces it on each focus AND it persists for swipe-back reads.
fun onExpanded() {
    ViewCompat.setStateDescription(
        headerView,
        string(R.string.ui_components_collapse_expand_view_expanded_text)
        // e.g. "expanded"
    )
}

fun onCollapsed() {
    ViewCompat.setStateDescription(
        headerView,
        string(R.string.ui_components_collapse_expand_view_collapsed_text)
        // e.g. "collapsed"
    )
}
```

**Key import:**
```kotlin
import androidx.core.view.ViewCompat
```

---

### String resources for state labels

```xml
<!-- strings.xml -->
<string name="ui_components_collapse_expand_view_expanded_text">expanded</string>
<string name="ui_components_collapse_expand_view_collapsed_text">collapsed</string>
```

TalkBack will then announce: **"Specifications, expanded, button"** or **"Specifications, collapsed, button"** — the state description is appended between the label and the role.

---

### Initialise state description on view creation

Set the initial state when the view is first rendered so the first TalkBack focus reads correctly (not just after the first toggle):

```kotlin
// Set initial state on bind/render — don't wait for the first tap
ViewCompat.setStateDescription(
    headerView,
    if (isCurrentlyExpanded) {
        string(R.string.ui_components_collapse_expand_view_expanded_text)
    } else {
        string(R.string.ui_components_collapse_expand_view_collapsed_text)
    }
)
```

---

### Alternative: `AccessibilityNodeInfoCompat.isExpanded`

For accordions backed by a native expand/collapse pattern, set the expanded bit directly so TalkBack uses its own localised "expanded"/"collapsed" strings:

```kotlin
ViewCompat.setAccessibilityDelegate(headerView, object : AccessibilityDelegateCompat() {
    override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
        super.onInitializeAccessibilityNodeInfo(host, info)
        info.isExpanded = isExpanded   // TalkBack reads this automatically
    }
})
```

> **Prefer `setStateDescription` for custom-labelled states** (e.g., "loading", "refreshed", "saved"), and **`isExpanded`/`isChecked`** for standard boolean states that have platform-localised strings.

---

## 🔑 Key Rules

- **`ViewCompat.setStateDescription(view, text)` is the modern replacement for one-shot `announceForAccessibility()` for state.** It persists in the node tree and is read every time focus lands on the view.
- **Always initialise the state description** when the view is first drawn, not just on the first toggle. A user navigating to a pre-expanded accordion will otherwise hear no state.
- **Apply `setStateDescription` to the header/toggle view** (the focusable row the user taps) — not to the content panel that expands beneath it.
- **`announceForAccessibility()` is still appropriate for one-off event notifications** (e.g., "item added to cart") but must NOT be used as the sole mechanism for communicating a persistent UI state like expanded/collapsed.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The state of user interface components must be programmatically determinable. An accordion header that does not surface its current expanded/collapsed state in the accessibility node tree fails to expose that state to assistive technologies, violating the requirement that value (state) be available programmatically.
