# Catalyst Template: Value — Swipe-to-Delete Button Exposed to TalkBack Before Visible

**Template ID:** `WA11Y-AND-4.1.2-022`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-022`
**Source Tickets:** SAAPP-28208
**Source PRs:** [walmart-glass #130015](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/130015)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Cart items use a swipe gesture to reveal a "Delete" button behind the card. The swipe-to-delete container — including its "Delete" `TextView` — is always present in the layout, even when it is completely hidden behind the item card at `translationX = 0`.

Without any accessibility control, TalkBack's tree includes the Delete button at all times. Users navigating by swipe or touch exploration encounter a "Delete" button with no context:

> **"Delete, Button"** — when the item card hasn't been swiped at all

The user has no indication the swipe surface is behind the visible card, and there is no product name in the Delete button's accessible label. If the user activates it, items are deleted without the user having intentionally revealed the delete action.

**Symptom (Jira):** "TalkBack sees Delete button when item hasn't been swiped", "Screen reader reaches Delete without swiping", "Delete button announced before swipe gesture", "Cart swipe delete accessible when hidden".

---

## ✅ The Fix Pattern

### Dynamic `importantForAccessibility` in `ItemTouchHelper.Callback.onChildDraw`

During the `onChildDraw` callback (which fires every frame the item is being translated), compare `abs(dX)` to 20% of the item's width. Only make the swipe container and Delete button accessible when the user has revealed them significantly.

**❌ Bad Code:**

```xml
<!-- sng_cart_item_card_swipeable.xml -->
<!-- ❌ swipe_delete_container has no ID and no accessibility setting -->
<!-- → always accessible, TalkBack can reach Delete even when hidden -->
<FrameLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="?ldColorRed">

    <TextView
        android:id="@+id/swipe_to_delete"
        ... />
</FrameLayout>
```

```kotlin
// ❌ onChildDraw only moves the card — no accessibility control
override fun onChildDraw(
    c: Canvas, recyclerView: RecyclerView, viewHolder: RecyclerView.ViewHolder,
    dX: Float, dY: Float, actionState: Int, isCurrentlyActive: Boolean
) {
    viewHolder.itemView.findViewById<View>(R.id.cart_item_card).translationX = dX
    // ← No accessibility update → Delete button is always accessible
}
```

---

**✅ Good Code (XML):**

```xml
<!-- sng_cart_item_card_swipeable.xml -->
<!-- ✅ Add ID and default to no-hide-descendants (hidden until swiped) -->
<FrameLayout
    android:id="@+id/swipe_delete_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="?ldColorRed"
    android:importantForAccessibility="noHideDescendants">

    <TextView
        android:id="@+id/swipe_to_delete"
        ... />
</FrameLayout>
```

**✅ Good Code (Kotlin — `CartSwipeableManager.kt`):**

```kotlin
import kotlin.math.abs

override fun onChildDraw(
    c: Canvas,
    recyclerView: RecyclerView,
    viewHolder: RecyclerView.ViewHolder,
    dX: Float,
    dY: Float,
    actionState: Int,
    isCurrentlyActive: Boolean,
) {
    viewHolder.itemView.findViewById<View>(R.id.cart_item_card).translationX = dX

    // ✅ Control accessibility of swipe-to-delete container based on swipe distance
    val swipeContainer = viewHolder.itemView.findViewById<View>(R.id.swipe_delete_container)
    if (swipeContainer != null) {
        // If swiped more than 20% of item width → accessible; otherwise hidden from AT
        val threshold = viewHolder.itemView.width * 0.2f
        val isAccessible = abs(dX) > threshold
        swipeContainer.importantForAccessibility = if (isAccessible) {
            View.IMPORTANT_FOR_ACCESSIBILITY_YES
        } else {
            View.IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS
        }

        // ✅ Provide a meaningful contentDescription when accessible
        val deleteTextView = viewHolder.itemView.findViewById<View>(R.id.swipe_to_delete)
        if (deleteTextView != null) {
            deleteTextView.contentDescription = if (isAccessible) {
                string(R.string.sng_cart_swipe_to_delete)
                // → "Delete item"
            } else {
                null
            }
        }
    }
}
```

```xml
<!-- strings.xml -->
<string name="sng_cart_swipe_to_delete">Delete item</string>
```

---

### Verified behavior

```kotlin
// Before fix:
// TalkBack tree always contains: "Delete item, Button"
// even when translationX = 0 and the swipe container is invisible.

// After fix:
// translationX = 0 (not swiped): swipe container → IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS
//   → TalkBack cannot reach Delete button at all

// translationX > itemView.width * 0.2f (swiped 20%+): container → IMPORTANT_FOR_ACCESSIBILITY_YES
//   → TalkBack announces: "Delete item, Button"
```

---

## 🔑 Key Rules

- **`IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS` by default in XML** — set this on the swipe container in the layout file so the Delete button is inaccessible at bind time, before any swipe occurs. Never rely on the Kotlin code to set the initial state — the layout attribute is the safe default.
- **20% threshold in `onChildDraw`** — the threshold `itemView.width * 0.2f` provides a comfortable margin: small accidental swipes do not suddenly expose the Delete button to TalkBack. Adjust based on UX requirements.
- **Set `contentDescription = null` when inaccessible** — setting `null` removes any previously set description so TalkBack cannot announce stale text if the view is somehow reached. When accessible, set a meaningful description (not just the label from XML).
- **`IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS` hides all descendants** — a single flag on the container hides the Delete `TextView` and any other children (icons, backgrounds). You do not need to hide each child individually.
- **The pattern applies to both swipeable layouts** — `sng_cart_item_card_swipeable.xml` (standard items) and `sng_cart_membership_item_card_swipeable.xml` (membership items). Both need the `swipe_delete_container` ID and the initial `noHideDescendants` attribute.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** User interface components and their states must be programmatically determinable. A Delete button that is not visible (the swipe surface is behind the item card) should not appear in the accessibility tree — its presence implies it is available to activate. When a TalkBack user encounters "Delete, Button" without having performed the swipe gesture that reveals it, the component's state (hidden/revealed) is not accurately represented in the accessibility tree. Activating the button then deletes an item without the user having performed the expected swipe interaction.
