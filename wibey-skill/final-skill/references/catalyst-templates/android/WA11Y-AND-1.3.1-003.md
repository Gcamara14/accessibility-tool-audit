# Catalyst Template: Info — Missing List Structure: Use Semantic Grouping for RecyclerView Lists

**Template ID:** `WA11Y-AND-1.3.1-003`
**Platform:** Android
**WCAG Criterion:** 1.3.1 Info and Relationships
**Jira Label:** `WA11Y-AND-1.3.1-003`
**Source Tickets:** CELISTS-31093, CELISTS-31095, CELISTS-31096, CELISTS-31097
**Source PR:** [walmart-glass #138816](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138816)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A `RecyclerView` or list-style layout is suppressed from TalkBack with `importantForAccessibility="no"`, causing the entire list to be invisible to screen readers. Additionally, list items may lack meaningful `contentDescription`, causing TalkBack to announce fragmentary data (separate price, name, and quantity text) rather than a coherent item summary.

**Symptom (Jira):** "TalkBack can't reach the list of [items/wishlists/registries]", "List items not focusable by swipe", "Screen reader skips the entire list", "RecyclerView not accessible", "List items read as disconnected fragments".

---

## ✅ The Fix Pattern

### Scenario A: RecyclerView suppressed with `importantForAccessibility="no"`

**❌ Bad Code (XML):**
```xml
<!-- RecyclerView completely hidden from TalkBack — screen-reader users
     cannot discover or navigate any list items -->
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/wish_list_recycler_view"
    android:layout_width="match_parent"
    android:layout_height="0dp"
    android:importantForAccessibility="no"
    app:layoutManager="androidx.recyclerview.widget.LinearLayoutManager"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent" />
```

**✅ Good Code (XML):**
```xml
<!-- Remove importantForAccessibility="no" — RecyclerView is accessible by default.
     TalkBack will traverse into each ViewHolder and read its content. -->
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/wish_list_recycler_view"
    android:layout_width="match_parent"
    android:layout_height="0dp"
    app:layoutManager="androidx.recyclerview.widget.LinearLayoutManager"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent" />
```

**Key rule:** `RecyclerView` does not need any special accessibility attribute to be traversable — it is accessible by default. **Never set `importantForAccessibility="no"` on a RecyclerView** unless every item it contains is purely decorative.

---

### Scenario B: List item `ViewHolder` missing combined `contentDescription`

When a list item shows multiple related data points (name, count, state), each `TextView` is read as an independent TalkBack stop. Users have to swipe through name → count → selection state separately with no context.

**❌ Bad Code:**
```kotlin
// Each text view announces independently — TalkBack says:
// "My Shopping List" ... [swipe] ... "5 items" ... [swipe] ... "selected"
override fun onBindViewHolder(holder: ViewHolder, position: Int) {
    holder.binding.listName.text = item.name
    holder.binding.listItemCount.text = "${item.count} items"
    holder.binding.listSelectedIcon.isVisible = item.isSelected
    // ❌ No combined contentDescription
}
```

**✅ Good Code:**
```kotlin
override fun onBindViewHolder(holder: ViewHolder, position: Int) {
    holder.binding.listName.text = item.name
    holder.binding.listItemCount.text = "${item.count} items"
    holder.binding.listSelectedIcon.isVisible = item.isSelected

    // ✅ Set combined contentDescription on the root item view
    val stateLabel = if (item.isSelected) {
        string(R.string.lists_radio_button_selected)
    } else {
        ""
    }
    val combinedDescription = "${item.name} ${string(R.string.lists_radio_button_content_description)} $stateLabel"
    holder.binding.root.contentDescription = combinedDescription

    // ✅ Also announce state changes when selection updates
    if (item.isSelected) {
        holder.binding.listName.contentDescription = combinedDescription
        holder.binding.listName.announceForAccessibility(combinedDescription)
    }
}
```

---

### Scenario C: RecyclerView list items need collection semantics (list count / position)

For TalkBack to announce "item 3 of 10" while navigating, supply `AccessibilityNodeInfoCompat.CollectionInfo` and `CollectionItemInfo` via `AccessibilityDelegate`:

```kotlin
// On the RecyclerView itself — provide collection info (rows = item count)
ViewCompat.setAccessibilityDelegate(recyclerView, object : RecyclerViewAccessibilityDelegate(recyclerView) {
    override fun onInitializeAccessibilityNodeInfo(
        host: View,
        info: AccessibilityNodeInfoCompat
    ) {
        super.onInitializeAccessibilityNodeInfo(host, info)
        info.collectionInfo = AccessibilityNodeInfoCompat.CollectionInfoCompat.obtain(
            adapter.itemCount,  // rowCount
            1,                  // columnCount (linear list = 1)
            false               // hierarchical
        )
    }
})

// On each ViewHolder's item view — provide item position
ViewCompat.setAccessibilityDelegate(itemView, object : AccessibilityDelegateCompat() {
    override fun onInitializeAccessibilityNodeInfo(
        host: View,
        info: AccessibilityNodeInfoCompat
    ) {
        super.onInitializeAccessibilityNodeInfo(host, info)
        info.collectionItemInfo = AccessibilityNodeInfoCompat.CollectionItemInfoCompat.obtain(
            adapterPosition,  // row index (0-based)
            1,                // rowSpan
            0,                // column index
            1                 // columnSpan
        )
    }
})
```

> **Note:** `LinearLayoutManager` + `RecyclerView` automatically provide basic collection semantics in newer Android versions. Only add manual `CollectionInfo` if TalkBack does not announce position/count or if you use a custom `LayoutManager`.

---

## 🔑 Key Rules

- **Never set `importantForAccessibility="no"` on a RecyclerView** — this is the single most common cause of "entire list not accessible" bugs in Walmart Android.
- **Each `ViewHolder` root view should have a complete `contentDescription`** that combines all relevant data the user needs to understand the item (name + quantity + state + type).
- **Suppress decorative sub-views** within each list item with `importantForAccessibility="no"` (icons, dividers) to avoid fragmented announcements — let the root ViewHolder provide the single combined announcement.
- **`announceForAccessibility()`** should be called when list item state changes (selection, check/uncheck, quantity) so TalkBack users hear the state update without having to re-navigate to the item.
- **Column/row semantics** (CollectionInfo / CollectionItemInfo) improve navigation but are secondary to making the list discoverable at all.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.1 (Info and Relationships):** Information and relationships conveyed through visual presentation must be programmatically determinable. A `RecyclerView` with `importantForAccessibility="no"` provides no access to any list content — the existence, count, and identity of all list items is hidden from assistive technologies, violating the requirement that structure be available to non-visual access.
