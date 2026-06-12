# Catalyst Template: Name, Role, Value — Custom Grid Item Not Announced as Button/Interactive by TalkBack

**Template ID:** `WA11Y-AND-4.1.2-026`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-026`
**Source Tickets:** GPUGC-32143
**Source PRs:** [walmart-glass (internal)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`FeatureRatingsGridItem` is a custom `ConstraintLayout`-based view that displays a star/percentage rating for a product feature (e.g., "Value for money: 3.2"). The container is declared `android:focusable="true"` and `android:importantForAccessibility="yes"` in XML, but:

1. **No role is announced** — TalkBack says the label and rating value but never says "Button" or "double-tap to activate", so users do not know the item is interactive.
2. **No `ACTION_CLICK` action** — the accessibility node has no click action, so users navigating by action menus cannot activate it.
3. **Click listener is on the wrong view** — the `setOnClickListener` was attached to the inner label child, not the container. The container had no click listener and therefore no `ACTION_CLICK` in its node info, even though it was the TalkBack focus target.

TalkBack announces:
> **"Value for money, 3.2"** — with no role, no interaction hint

Expected:
> **"Value for money, 3.2, Button"** — with double-tap to activate

**Symptom (Jira):** "TalkBack doesn't announce rating grid item as button", "Feature ratings not announced as interactive by screen reader", "Rating grid item missing role and click action for TalkBack".

---

## ✅ The Fix Pattern

### Three-part fix: delegate click, XML `clickable`, and `AccessibilityDelegateCompat` role

```kotlin
// FeatureRatingsGridItem.kt

fun setData(aspectPolarity: String, rating: Float, feature: String) {
    // ... existing label/value setup ...

    // ✅ Part 1: Delegate inner label click to the container
    // The container is the TalkBack focus node; clicking it should activate the label.
    binding.featureRatingsGridItemContainer.setOnClickListener {
        binding.featureRatingsGridItemLabel.performClick()
    }

    binding.featureRatingsGridItemValue.text = String.format(
        context.resources.configuration.locales[0], "%.1f", rating
    )

    contentDescription = buildAccessibilityLabel(feature, aspectPolarity, rating)

    // ✅ Part 2: Override AccessibilityDelegate to set Button role and ACTION_CLICK
    // info.className = Button makes TalkBack say "Button" and adds "double-tap to activate"
    ViewCompat.setAccessibilityDelegate(
        binding.featureRatingsGridItemContainer,
        object : AccessibilityDelegateCompat() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfoCompat
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                // ✅ Set role to Button so TalkBack announces "Button" after the label
                info.className = android.widget.Button::class.java.name
                // ✅ Add click action so it appears in the TalkBack actions menu
                info.addAction(AccessibilityNodeInfoCompat.AccessibilityActionCompat.ACTION_CLICK)
            }
        }
    )
}
```

```xml
<!-- ugc_feature_ratings_grid_item.xml -->

<ConstraintLayout
    android:id="@+id/feature_ratings_grid_item_container"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:clickable="true"
    android:focusable="true"
    android:importantForAccessibility="yes"
    android:gravity="center" />
<!-- ✅ Part 3: android:clickable="true" in XML is required.
     Without it, the container has no click affordance even after setOnClickListener.
     AccessibilityNodeInfoCompat.ACTION_CLICK requires the view to be clickable. -->
```

---

### ❌ Bad Code — role missing, click on wrong view

```kotlin
// ❌ Before fix:
fun setData(aspectPolarity: String, rating: Float, feature: String) {
    // ❌ Click listener on inner label — container has no click listener
    // Container's node info has no ACTION_CLICK → TalkBack: no "Button" role
    // binding.featureRatingsGridItemContainer.setOnClickListener { ... } ← NOT set

    binding.featureRatingsGridItemValue.text = ...
    // ❌ No AccessibilityDelegateCompat → no className = Button → no role announcement
    // TalkBack: "Value for money, 3.2" — no role, no hint
}
```

```xml
<!-- ❌ Before fix — missing android:clickable="true" -->
<ConstraintLayout
    android:id="@+id/feature_ratings_grid_item_container"
    android:focusable="true"
    android:importantForAccessibility="yes"
    android:gravity="center"
    <!-- ← no android:clickable="true" -->
    />
```

---

### Verified TalkBack announcements

```
// Before fix:
TalkBack: "Value for money, 3.2"
           ────────────────  ───
           label             value   (no role, no hint)

// After fix:
TalkBack: "Value for money, 3.2, Button"
                                  ──────
                                  role + "double-tap to activate" hint
```

---

### Why `info.className = Button` instead of `isClickable = true`

Setting `info.isClickable = true` makes the node appear clickable but does not change the role. TalkBack only appends "Button" when `info.className` is `android.widget.Button` (or `android.widget.CompoundButton` for toggle semantics). Setting both `className` and `ACTION_CLICK` together provides:
1. The role announcement ("Button")
2. The activation hint ("double-tap to activate")
3. The action in the TalkBack actions menu ("Tap")

`info.isClickable = true` alone only satisfies (3).

---

### When to use `performClick()` delegation

When a compound view has an interactive child (e.g., a button or label with its own click logic) and a container that is the TalkBack focus target, the container's `setOnClickListener` should delegate to the child via `performClick()`. This ensures:
- The container handles TalkBack activation (double-tap)
- The existing click logic on the child continues to work for sighted users tapping the label directly
- No duplication of click handler logic

---

## 🔑 Key Rules

- **Set `android:clickable="true"` in XML, not just `setOnClickListener` in code** — `setOnClickListener` sets `clickable = true` at runtime, but `AccessibilityNodeInfoCompat.ACTION_CLICK` requires it to be already set when the delegate runs. XML declaration ensures it is correct from the start.
- **`info.className = android.widget.Button::class.java.name`** — use the full class name string, not `Button::class.java.name` (which would only include "Button" without the package). The full name `android.widget.Button` is required for TalkBack's role resolution.
- **Use `AccessibilityDelegateCompat` (Jetpack) not `AccessibilityDelegate` (framework)** — `AccessibilityDelegateCompat` is the Jetpack wrapper from `androidx.core.view`. It supports older API levels and is compatible with `ViewCompat.setAccessibilityDelegate()`. Using the framework `AccessibilityDelegate` with `setAccessibilityDelegate()` works but bypasses Jetpack compatibility.
- **Audit every focusable custom view for role** — any custom view with `focusable="true"` or `importantForAccessibility="yes"` that has a click action must either: (a) extend a standard widget (Button, Checkbox) that provides a role, or (b) set `info.className` explicitly. A custom `ConstraintLayout` or `FrameLayout` has no default role.
- **`performClick()` delegation pattern is idempotent** — calling `container.setOnClickListener { label.performClick() }` after the view is already bound is safe. It replaces any prior container click listener without modifying the label's listener.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The role of user interface components must be programmatically determinable. A custom grid item view that functions as a button (tappable, triggers navigation or selection) must announce its role as "Button" so screen reader users know they can activate it. Without the role:
  1. TalkBack users cannot tell the item is interactive — they hear a label and a number with no indication that double-tapping activates anything.
  2. The item has no accessible action in the TalkBack actions menu, so switch-access and other AT users cannot activate it at all.
  3. The clickable affordance is not programmatically determinable — TalkBack cannot surface the interaction pattern.
