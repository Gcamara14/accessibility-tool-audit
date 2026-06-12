# Catalyst Template: Name — Checkbox in List Announced Without Product Name (Composite Row Description Pattern)

**Template ID:** `WA11Y-AND-4.1.2-019`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-019`
**Source Tickets:** CSRETPB-91083
**Source PRs:** [walmart-glass #133808](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/133808)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

In a "Select items" list (e.g., Add to List, bulk select), each row contains a `WcpCheckbox` / `CheckBox` alongside product details. TalkBack focuses directly on the checkbox and announces:

> **"Checkbox, not checked"**

No product name. No price. No quantity. The user has no idea **which item** they are selecting or deselecting. In a list of 20 items, every checkbox sounds identical.

Two sub-failures:
1. The **checkbox** carries no accessible name because `WcpCheckbox` gets no `contentDescription` and its parent supplies no grouping.
2. The **product name `TextView`** has `android:focusable="true"` and `android:importantForAccessibility="yes"` — it is a separate focus point, so TalkBack must navigate to it separately just to find out what the checkbox is for.

**Symptom (Jira):** "Checkboxes in 'Add to List' have no name", "TalkBack can't tell which item checkbox belongs to", "Screen reader says 'Checkbox, not checked' with no product name", "Selecting items inaccessible — TalkBack doesn't identify items".

---

## ✅ The Fix Pattern

### Move accessibility to the **row container**, suppress the native checkbox

The fix: suppress the `WcpCheckbox` from AT, suppress the content children, promote the **row container** to be the single accessible focus point, and build a composite `contentDescription` that includes name, price, quantity, and checked state.

**❌ Bad Code:**

```xml
<!-- Root container has no accessibility attributes -->
<merge ...>
    <!-- ❌ Checkbox focused by TalkBack: "Checkbox, not checked" — no product name -->
    <glass.platform.design.components.WcpCheckbox
        android:id="@+id/buying_list_item_detail_checkbox"
        ... />

    <!-- ❌ Product name is a SEPARATE focus point with accessibilityHeading="true" -->
    <TextView
        android:id="@+id/buying_list_item_detail_name"
        android:accessibilityHeading="true"
        android:focusable="true"
        android:importantForAccessibility="yes"
        ... />

    <!-- ❌ Price also separately focusable -->
    <TextView
        android:id="@+id/buying_list_item_detail_price"
        android:importantForAccessibility="yes"
        android:screenReaderFocusable="true"
        ... />
</merge>
```

```kotlin
// ❌ No composite description — checkbox alone handles checked/unchecked
buyingListItemDetailCheckbox.setOnCheckedChangeListener { _, isChecked ->
    onCheckedChange(item, isChecked, sectionIndex)
}
```

---

**✅ Good Code (XML):**

```xml
<!-- ✅ Row container is the single accessible focus point -->
<merge ...>
    <!-- Row container: focusable + important, live region for state changes -->
    <ConstraintLayout
        android:id="@+id/buying_list_item_row"
        android:focusable="true"
        android:focusableInTouchMode="false"
        android:importantForAccessibility="yes"
        android:accessibilityLiveRegion="polite"
        ... >

        <!-- ✅ Suppress native checkbox — role subsumed by row composite description -->
        <glass.platform.design.components.WcpCheckbox
            android:id="@+id/buying_list_item_detail_checkbox"
            android:importantForAccessibility="no"
            ... />

        <!-- ✅ Suppress individual text views — content is in the row description -->
        <TextView
            android:id="@+id/buying_list_item_detail_name"
            android:accessibilityHeading="false"
            android:focusable="false"
            android:importantForAccessibility="no"
            ... />

        <TextView
            android:id="@+id/buying_list_item_detail_price"
            android:importantForAccessibility="no"
            ... />
    </ConstraintLayout>
</merge>
```

**✅ Good Code (Kotlin):**

```kotlin
// Build a composite description including name, price, quantity, and checked state
private fun BuyingListSelectItemViewBinding.setRowAccessibilityVoiceover(
    item: BuyingListItemInfo,
    isChecked: Boolean
) {
    val quantity = string(R.string.buying_list_select_items_section_adapter_quantity)
    val selected = if (isChecked) {
        string(R.string.buying_list_select_items_section_adapter_selected)
    } else {
        string(R.string.buying_list_select_items_section_adapter_not_selected)
    }
    // → "Organic Whole Milk, $3.98, quantity 2, selected"
    buyingListItemRow.contentDescription =
        "${item.itemName}, ${currency(item.itemPrice)}, $quantity ${item.quantity}, $selected"
}

// In onBindViewHolder:
buyingListItemRow.apply {
    // ✅ Suppress live region during initial bind to avoid spurious announcements
    accessibilityLiveRegion = View.ACCESSIBILITY_LIVE_REGION_NONE
    setRowAccessibilityVoiceover(item, isItemChecked(sectionIndex, item.usItemId))
    // ✅ Re-enable ASSERTIVE for subsequent checked-state changes
    accessibilityLiveRegion = View.ACCESSIBILITY_LIVE_REGION_ASSERTIVE

    buyingListItemDetailCheckbox.setOnCheckedChangeListener(null)
    buyingListItemDetailCheckbox.isChecked = isItemChecked(sectionIndex, item.usItemId)

    // Click on the row toggles the checkbox and updates the voiceover
    setOnClickListener {
        buyingListItemDetailCheckbox.isChecked = !buyingListItemDetailCheckbox.isChecked
        onCheckedChange(item, buyingListItemDetailCheckbox.isChecked, sectionIndex)
        // ✅ Update description with new checked state → live region fires
        setRowAccessibilityVoiceover(item, buyingListItemDetailCheckbox.isChecked)
    }
}
```

```xml
<!-- strings.xml -->
<string name="buying_list_select_items_section_adapter_quantity">quantity</string>
<string name="buying_list_select_items_section_adapter_selected">selected</string>
<string name="buying_list_select_items_section_adapter_not_selected">not selected</string>
```

TalkBack announces: **"Organic Whole Milk, $3.98, quantity 2, not selected"** then after toggle: **"Organic Whole Milk, $3.98, quantity 2, selected"** (fired by the ASSERTIVE live region).

---

### Live region bind-time suppression pattern

The `NONE → bind → ASSERTIVE` pattern is critical. Without it, setting `contentDescription` on a view with `ACCESSIBILITY_LIVE_REGION_ASSERTIVE` during `onBindViewHolder` fires a spurious announcement every time the RecyclerView recycles the view:

```kotlin
// ✅ Always suppress the live region BEFORE the initial contentDescription set,
// then restore it AFTER so only real user interactions trigger announcements.
row.accessibilityLiveRegion = View.ACCESSIBILITY_LIVE_REGION_NONE     // ← suppress
row.contentDescription = buildDescription(item, isChecked)            // ← silent bind
row.accessibilityLiveRegion = View.ACCESSIBILITY_LIVE_REGION_ASSERTIVE // ← re-enable
```

---

## 🔑 Key Rules

- **Suppress the native `CheckBox` / `WcpCheckbox` from AT** — set `android:importantForAccessibility="no"` on the checkbox itself. The row container handles accessibility; having both the container and the checkbox accessible creates duplicate focus points.
- **Composite description format: `"[name], [price], [quantity label] [count], [selected/not selected]"`** — this gives the user all the information needed to make a selection decision in a single focus point.
- **Use `ACCESSIBILITY_LIVE_REGION_ASSERTIVE` for checked-state changes** — after the user taps the row, update `contentDescription` and the ASSERTIVE live region fires immediately, confirming the new state without requiring re-focus.
- **Suppress the live region during initial bind** — set `ACCESSIBILITY_LIVE_REGION_NONE` before the bind, restore `ASSERTIVE` after. This prevents every RecyclerView recycle from producing a spurious TalkBack announcement.
- **Suppress individual content children** — once the row has a composite `contentDescription`, all child TextViews and icons must have `importantForAccessibility="no"` (and `focusable="false"`) to prevent TalkBack from traversing into them.
- **Reset `setOnCheckedChangeListener(null)` before `isChecked =`** — setting `isChecked` before clearing the listener fires the listener during bind, which can call `onCheckedChange` with stale data during RecyclerView recycling.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** All user interface components must have a name that can be programmatically determined. A `CheckBox` with no `contentDescription` and no associated label via `android:labelFor` has no programmatically determinable name — TalkBack can only announce the component's role ("Checkbox") and state ("not checked"). Without a name, the user cannot tell what item the checkbox selects or deselects. This is a direct 4.1.2 failure: the name is missing.
