# Catalyst Template: Focus Order — TalkBack Focus Lost on Back Navigation to PDP (Save/Restore Pattern)

**Template ID:** `WA11Y-AND-2.4.3-006`
**Platform:** Android
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-AND-2.4.3-006`
**Source Tickets:** CEPG-352049
**Source PRs:** [walmart-glass #138558](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138558)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

On a Product Detail Page (PDP), a TalkBack user is focused on an element (e.g., the strikethrough price, the "Add to cart" button, a fulfillment option). They navigate to a child screen (e.g., size selection, fulfillment options detail). When they press Back to return to PDP, TalkBack focus resets to the top of the page — typically the first focusable element (app bar, product title).

The user loses their place:
- They must re-navigate the entire PDP from the top to reach where they were
- If they activated a toggle (e.g., "Save for later"), returned, and focus reset, they cannot easily confirm the state change

This affects any Fragment that:
1. Uses a complex layout where a user can navigate deep into a hierarchy
2. Triggers navigation to a child screen from a non-trivial scroll position
3. Recreates its view (back stack pop, `onDestroyView` → `onCreateView`)

**Symptom (Jira):** "TalkBack focus jumps to top when pressing Back on PDP", "Screen reader loses position after returning from size selection", "TalkBack doesn't return to where user was on product page", "Focus resets to beginning on back navigation".

---

## ✅ The Fix Pattern

### Capture focus view ID before navigation, save in `savedInstanceState`, restore after layout

Three-part fix in `ProductDetailFragment.kt`:

1. **Capture the currently focused view's ID** (DFS traversal, guarded by `isTouchExplorationEnabled`) before navigating away
2. **Persist the ID in `savedInstanceState`** so it survives configuration changes and back-stack recreation
3. **Restore focus after the fragment's view re-lays out** using `doOnLayout { performAccessibilityAction(ACTION_ACCESSIBILITY_FOCUS) }`

```kotlin
// ProductDetailFragment.kt

// ✅ Field to track which view TalkBack was focused on before navigation
private var pendingAdaFocusRestoreViewId: Int = View.NO_ID

// ── onCreate / onViewStateRestored ──────────────────────────────────────────

override fun onViewStateRestored(savedInstanceState: Bundle?) {
    super.onViewStateRestored(savedInstanceState)
    // ✅ Restore the pending focus ID from saved state
    //    (survives back-stack pop and configuration change)
    savedInstanceState
        ?.getInt(KEY_PENDING_ADA_FOCUS_VIEW_ID, View.NO_ID)
        ?.takeIf { it != View.NO_ID }
        ?.let { pendingAdaFocusRestoreViewId = it }
}

override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)
    // ✅ Persist the pending focus ID across rotation or process death
    outState.putInt(KEY_PENDING_ADA_FOCUS_VIEW_ID, pendingAdaFocusRestoreViewId)
}

// ── Navigation away ─────────────────────────────────────────────────────────

/**
 * Called before navigating to a child screen (e.g., size picker, fulfillment detail).
 * Captures the ID of whatever view TalkBack is currently focused on so we can
 * restore it when the user presses Back.
 */
private fun captureAndStoreFocusBeforeNavigation(view: View?) {
    // ✅ Only capture if not already pending (prevent overwrite on double-navigation)
    if (pendingAdaFocusRestoreViewId == View.NO_ID) {
        pendingAdaFocusRestoreViewId =
            captureAccessibilityFocusedView(view)?.id ?: View.NO_ID
    }
}

// ── Return from child screen ─────────────────────────────────────────────────

override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    // … other initialization …
    // ✅ Restore focus if we have a pending ID (back-navigation case)
    if (pendingAdaFocusRestoreViewId != View.NO_ID) {
        val viewId = pendingAdaFocusRestoreViewId
        pendingAdaFocusRestoreViewId = View.NO_ID
        restoreAccessibilityFocus(viewId)
    }
}

// ── Implementation ───────────────────────────────────────────────────────────

/**
 * Walks the view hierarchy DFS to find the view that currently holds
 * TalkBack accessibility focus. Returns null if TalkBack is not active
 * or no view is currently accessibility-focused.
 * Only called at navigation time — not per frame.
 */
private fun captureAccessibilityFocusedView(root: View?): View? {
    root ?: return null
    // ✅ Guard: only relevant when TalkBack (touch exploration) is active
    val accessibilityManager =
        context?.getSystemService(Context.ACCESSIBILITY_SERVICE) as? AccessibilityManager
    if (accessibilityManager?.isTouchExplorationEnabled != true) return null
    return searchAccessibilityFocusedView(root)
}

private fun searchAccessibilityFocusedView(root: View?): View? {
    root ?: return null
    if (root.isAccessibilityFocused) return root
    if (root is ViewGroup) {
        for (i in 0 until root.childCount) {
            val result = searchAccessibilityFocusedView(root.getChildAt(i))
            if (result != null) return result
        }
    }
    return null
}

private fun restoreAccessibilityFocus(@IdRes viewId: Int) {
    // ✅ doOnLayout defers until the view is measured and laid out
    //    so performAccessibilityAction does not fire on a zero-size view
    view?.doOnLayout {
        val targetView = view?.findViewById<View>(viewId) ?: return@doOnLayout
        val accessibilityManager =
            context?.getSystemService(Context.ACCESSIBILITY_SERVICE) as? AccessibilityManager
        // ✅ Re-check TalkBack state; user may have disabled it while on the child screen
        if (accessibilityManager?.isTouchExplorationEnabled == true) {
            targetView.requestFocus()
            targetView.performAccessibilityAction(
                AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS,
                null
            )
        }
    }
}

companion object {
    private const val KEY_PENDING_ADA_FOCUS_VIEW_ID = "pending_ada_focus_view_id"
}
```

---

### Call site — capture before navigation

```kotlin
// Anywhere navigation to a child screen is triggered:
binding.itemFulfillmentOptions.setOnClickListener {
    captureAndStoreFocusBeforeNavigation(view)
    // → pendingAdaFocusRestoreViewId = binding.itemFulfillmentOptions.id
    navigateToFulfillmentOptions()
}

binding.itemSizeSelector.setOnClickListener {
    captureAndStoreFocusBeforeNavigation(view)
    navigateToSizeSelection()
}
```

---

### Why `ACTION_ACCESSIBILITY_FOCUS` instead of `requestFocus()`

`requestFocus()` moves keyboard/D-pad focus, not TalkBack accessibility focus. TalkBack uses its own separate focus node (`AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS`). A view can have keyboard focus without having TalkBack focus and vice versa. `performAccessibilityAction(ACTION_ACCESSIBILITY_FOCUS)` is the canonical way to move TalkBack focus to a specific view.

`requestFocus()` is also called here for completeness (some views require both to remain stable), but it is the `ACTION_ACCESSIBILITY_FOCUS` that moves TalkBack's cursor.

---

### Why save in `savedInstanceState`

Navigation back through the NavController calls `onDestroyView` then `onViewCreated` on the PDP fragment. Any in-memory field is reset. Saving `pendingAdaFocusRestoreViewId` in `savedInstanceState` ensures it survives the `onDestroyView`/`onCreateView` lifecycle even if the system kills the process while the user is on the child screen.

---

## 🔑 Key Rules

- **Guard all accessibility focus code with `isTouchExplorationEnabled`** — don't call DFS traversal or `performAccessibilityAction(ACTION_ACCESSIBILITY_FOCUS)` unless TalkBack is active. For non-TalkBack users the code is a no-op, but skipping it entirely avoids unnecessary view hierarchy traversal on every navigation.
- **Only capture if `pendingAdaFocusRestoreViewId == View.NO_ID`** — a double-navigation (e.g., user taps two buttons before the first navigation completes) would overwrite the original focus ID. The `if (pendingAdaFocusRestoreViewId == View.NO_ID)` guard preserves the first-tapped view.
- **Clear `pendingAdaFocusRestoreViewId = View.NO_ID` before restoring** — prevents the same ID from firing twice (e.g., onViewCreated called multiple times due to ViewPager).
- **`doOnLayout { }` is required** — `performAccessibilityAction` on a view with zero size is a no-op or throws. `doOnLayout` fires after the first layout pass, guaranteeing the view is measured.
- **View IDs must be stable** — this pattern only works if the view being focused has a static `android:id`. Dynamic views created in a `RecyclerView` may have recycled IDs. For those, use `commitCallback` with position-based focus (see WA11Y-AND-2.4.3-005).

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation. On back navigation, TalkBack focus should return to the element the user last interacted with (the element from which they navigated away). Resetting focus to the top of the page on every back-navigation forces TalkBack users to re-traverse the entire page to return to their position — a non-trivial burden on long, complex pages like PDP. Sighted users return to their scroll position automatically; TalkBack users must navigate sequentially from the top.
