# Catalyst Template: Role — Non-Interactive Container Announces "Double Tap to Activate" / Duplicate Clickable Bounds

**Template ID:** `WA11Y-AND-4.1.2-013`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-013`
**Source Tickets:** CECPRO-32549, CEPG-344275, CEPG-0000
**Source PRs:** [walmart-glass #138997](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138997)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Three related failure modes where TalkBack incorrectly announces interactive affordances on non-interactive or already-handled views:

1. **Non-interactive container has `clickable="true"` / `focusable="true"`** — A `FrameLayout`, `ConstraintLayout`, or `FragmentContainerView` that wraps an interactive child (e.g., a map, a non-clickable info block) is incorrectly marked as clickable and focusable. TalkBack announces "double tap to activate" even though tapping does nothing.

2. **Parent container and child both have click listeners with identical bounds** (`DuplicateClickableBoundsCheck`) — A root container's click listener fires the same action as the child's click listener, creating two independently focusable/clickable targets at the same screen position. TalkBack encounters the same action twice during swipe navigation.

3. **Display-only card styled as `clickable`** — A card showing static content (eligible items, info tiles, status displays) inherits `clickable="true"` from a template or copy-paste. TalkBack announces it as an interactive button when it has no action.

**Symptom (Jira):** "TalkBack says 'double tap to activate' on a map container", "Non-clickable card announced as button", "Filter pill has two clickable targets at same position", "Protection plan item announces as interactive when it's display-only".

---

## ✅ The Fix Pattern

### Scenario A: Remove `clickable` / `focusable` from non-interactive container

**❌ Bad Code:**
```xml
<!-- FragmentContainerView wrapping a SupportMapFragment.
     The container is never interactive — the inner map manages its own touch events.
     TalkBack announces: "double tap to activate" — tapping does nothing. -->
<androidx.fragment.app.FragmentContainerView
    android:id="@+id/map_fragment_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:focusable="true"
    android:clickable="true" />
```

**✅ Good Code:**
```xml
<!-- Remove focusable/clickable; suppress the container from AT.
     The inner map fragment remains accessible with its own contentDescription. -->
<androidx.fragment.app.FragmentContainerView
    android:id="@+id/map_fragment_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:importantForAccessibility="no" />
```

---

### Scenario B: Static display card incorrectly marked `clickable`

**❌ Bad Code:**
```xml
<!-- Protection plan eligible item — display only, no click action.
     clickable="true" + focusable="true" makes TalkBack treat it as a button. -->
<ConstraintLayout
    android:id="@+id/eligible_item_card"
    android:clickable="true"
    android:focusable="true"
    android:importantForAccessibility="yes"
    android:padding="8dp" />
```

**✅ Good Code:**
```xml
<!-- Display-only card: remove clickable and focusable.
     importantForAccessibility="yes" stays so the card's contentDescription is read,
     but without the interactive role. -->
<ConstraintLayout
    android:id="@+id/eligible_item_card"
    android:clickable="false"
    android:focusable="false"
    android:importantForAccessibility="yes"
    android:padding="8dp" />
```

---

### Scenario C: Fix `DuplicateClickableBoundsCheck` — parent + child both handle same click

**❌ Bad Code:**
```kotlin
// Root ConstraintLayout and the inner FilterView both have click listeners.
// They share the same on-screen bounds → two clickable targets at the same position.
// ATF flags: DuplicateClickableBoundsCheck. TalkBack encounters the action twice.
itemBinding.root.setOnClickListener { view ->
    action.execute(view.context)
    postOnClickAnalytics(view, viewConfig)
}
// filterPill ALSO has its own click listener handling the same action
```

**✅ Good Code:**
```kotlin
// Only set a root click listener for the special case (CLEAR_ALL) where
// the child pill is GONE and the root must handle the click.
// For all other cases, clear the root listener — the child pill handles interaction alone.
if (viewConfig.type == FacetType.FILTER_CLEAR_ALL) {
    itemBinding.root.setOnClickListener { view ->
        action.execute(view.context)
        postOnClickAnalytics(view, viewConfig)
        AccessibilityUtils.setPendingFacetFocus(viewConfig.type, viewConfig.facetName)
        restorePillFocus()
    }
} else {
    // ✅ Clear root click listener — filter_pill alone handles the click
    itemBinding.root.setOnClickListener(null)
}
```

**Test assertion:**
```kotlin
// Verify root does NOT have a click listener for non-CLEAR_ALL pills
assertThat(itemBinding.root.hasOnClickListeners()).isFalse()
// Verify child pill handles the click
itemBinding.filterPill.performClick()
verify { action.execute(any()) }
```

---

## 🔑 Key Rules

- **`clickable="true"` implies interactive role** — any view with `clickable="true"` or a click listener is announced as "button" or "double tap to activate" by TalkBack. Only add these when the view truly has an action.
- **Container wrappers for non-interactive content must be `clickable="false"` + `focusable="false"`** — map containers, decorative wrappers, and layout scaffolding must never carry interactive attributes.
- **`importantForAccessibility="no"` for fully passive containers** — when a container has no content of its own (no `contentDescription`, no meaningful children), suppress it entirely with `importantForAccessibility="no"`.
- **Never duplicate click listeners at the same bounds** — if a parent and child both handle the same click at the same position, remove the parent's listener. The `DuplicateClickableBoundsCheck` ATF lint rule flags this automatically.
- **Prefer child-only click listeners** — attach click logic to the innermost interactive element (the actual button, chip, or image), not to the surrounding container. This prevents duplicate bound violations and makes the accessible target size match the visual element.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The role of user interface components must be programmatically determinable. A non-interactive container with `clickable="true"` is announced with the "button" role and "double tap to activate" affordance — a role that does not match its actual behaviour. Users who act on this affordance get no response, which is confusing and violates the requirement that UI components behave according to their announced role.
