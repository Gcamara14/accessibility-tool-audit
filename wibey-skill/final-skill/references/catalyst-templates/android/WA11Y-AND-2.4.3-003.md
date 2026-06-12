# Catalyst Template: Focus Order: General — Item Container Missing `focusable="true"`

**Template ID:** `WA11Y-AND-2.4.3-003`
**Platform:** Android
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-AND-2.4.3-003`
**Source Tickets:** TXNCART-8200
**Source PR:** [walmart-glass #131016](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/131016)
**Date Ingested:** 2026-04-30

---

## 🛑 The Problem

A list item layout (`RecyclerView` item, bottom sheet row, etc.) is missing `android:focusable="true"` on its root `ViewGroup`. TalkBack relies on the root container being focusable to:
- Include the entire item as a single focusable unit during linear navigation
- Allow the user to swipe to the item and hear its full content description

**Without `focusable="true"`, TalkBack may:**
- Skip the container entirely and jump unpredictably between child elements
- Produce a broken or non-sequential swipe-navigation experience

**Symptom:** Jira ticket says "TalkBack focus skips [element name]" or "TalkBack jumps from X directly to Z, bypassing Y."

---

## ✅ The Fix Pattern

### Scenario: RecyclerView / BottomSheet Item Layout Root

**❌ Bad Code (XML):**
```xml
<!-- Root container is missing focusable="true". TalkBack skips this item. -->
<ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="@drawable/bookslot_slot_express_background">

    <!-- child views... -->
</ConstraintLayout>
```

**✅ Good Code (XML):**
```xml
<!-- Adding focusable="true" ensures TalkBack can land on this item. -->
<ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:focusable="true"
    android:background="@drawable/bookslot_slot_express_background">

    <!-- child views... -->
</ConstraintLayout>
```

### Scenario: Kotlin (dynamic view setup)
```kotlin
// If setting up programmatically rather than via XML:
itemView.isFocusable = true
```

### Scenario: Jetpack Compose (equivalent)
```kotlin
// In Compose, add semantics to the container item.
Box(
    modifier = Modifier
        .semantics(mergeDescendants = true) {}
        .clickable { /* ... */ }
) {
    // child composables...
}
```

---

## 🔑 Key Rules

- **Every interactive or semantically meaningful `RecyclerView` item root must have `android:focusable="true"`** in its XML layout file.
- Check the `ViewGroup` at the **root of the item layout** — not a nested child.
- `focusable="true"` alone is sufficient for TalkBack focus; pair it with `android:clickable="true"` only if the item is also tappable by sighted users.
- In Jetpack Compose, prefer `Modifier.semantics(mergeDescendants = true)` on the row container instead of per-element semantics.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If focus cannot reach a UI element — or if TalkBack skips elements during linear navigation — the content is effectively hidden from screen reader users. All interactive and informative content must be reachable in a logical order.
