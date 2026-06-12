# Catalyst Template: Label in Name — Composite Row Widget Missing Visible Text in contentDescription

**Template ID:** `WA11Y-AND-2.5.3-001`
**Platform:** Android
**WCAG Criterion:** 2.5.3 Label in Name
**Jira Label:** `WA11Y-AND-2.5.3-001`
**Source Tickets:** TXNCART-8195, TXNCART-8203, TXNCART-8295
**Source PR:** [walmart-glass #130751](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/130751)
**Date Ingested:** 2026-04-30

---

## 🛑 The Problem

A composite list row (e.g., a store card with a `RadioButton`) has its `contentDescription` set to a **position-only** string (e.g., "Radio Button 2 of 5"). The visible text siblings — store name, address, distance, time — are each individually focusable (`importantForAccessibility="yes"`) and announced separately.

This produces two failures:
1. **Label in Name (2.5.3):** The interactive element's label does not include the visible text the user sees ("Carrollton Supercenter, 1735 S Highway 27, 3.2 mi").
2. **Focus Order / Grouping (1.3.1):** TalkBack focuses on 5–6 elements for what the sighted user sees as one row, making navigation confusing and fragmented.

---

## ✅ The Fix Patterns

### Pattern: Build Comprehensive contentDescription from Visible Child Views

**❌ Bad Code:**
```kotlin
// Only sets a positional label — visual text is NOT included.
// Child TextViews each have importantForAccessibility="yes" so TalkBack
// announces them separately as extra focus stops.
binding.storeselectorStoreRadioButton.contentDescription = string(
    if (storeSelected) {
        R.string.storeselector_radio_button_content_description_selected
    } else {
        R.string.storeselector_radio_button_content_description_not_selected
    },
    "position" to position + 1,
    "itemCount" to itemCount
)
// ❌ Child views: importantForAccessibility="yes" in XML
```

**✅ Good Code:**
```kotlin
// Build a comprehensive contentDescription that includes all visible child text.
private fun setContentDescriptionForRadioButton(position: Int, count: Int) = with(binding) {
    val contentDescription = buildList {
        // 1. Start with the positional/role announcement
        add(
            string(
                R.string.storeselector_radio_button_accessibility_announcement,
                "position" to position + 1,
                "itemCount" to count
            )
        )
        // 2. Append only VISIBLE text from each child view
        listOfNotNull(
            storeselectorStoreName.visibleText(),
            storeselectorStoreAddress.visibleText(),
            storeselectorTime.visibleText(),
            storeselectorDistance.visibleText()
        ).forEach(::add)
    }.joinToString(", ")

    storeselectorStoreRadioButton.contentDescription = contentDescription
}

// Helper: Only return text if the view is visible and non-blank
private fun TextView.visibleText(): String? =
    takeIf { isVisible }?.text?.toString()?.takeIf { it.isNotBlank() }
```

**✅ Good Code (XML — suppress child views from accessibility):**
```xml
<!-- Child TextViews inside the row should NOT be individually focusable.
     The RadioButton's contentDescription is the single source of truth. -->
<TextView
    android:id="@+id/storeselectorStoreName"
    android:importantForAccessibility="no"
    tools:text="Carrollton Supercenter" />

<TextView
    android:id="@+id/storeselectorStoreAddress"
    android:importantForAccessibility="no"
    tools:text="1735 S Highway 27, TX 75220" />

<TextView
    android:id="@+id/storeselectorTime"
    android:importantForAccessibility="no"
    android:layout_marginStart="?ld.primitive.scale.space.100" />

<TextView
    android:id="@+id/storeselectorDistance"
    android:importantForAccessibility="no"
    android:visibility="gone" />
```

---

## 🔑 Key Rules

- **The interactive element's `contentDescription` must include all visible text** that a sighted user can read in the same row.
- **Suppress child text views** from individual TalkBack focus using `android:importantForAccessibility="no"` in XML — never `"yes"` for text that is already captured in the parent's `contentDescription`.
- **Always guard with `isVisible`** before reading text from a `TextView`. Text from `GONE` views must not be included.
- **Use `buildList` + `joinToString`** for clean, maintainable contentDescription composition.
- The string resource for the row should use a generic announcement template (position/count) that the code then supplements with live visible text — not a static hardcoded string that will go stale.

---

## ⚠️ WCAG Failure Without This Fix

- **2.5.3 (Label in Name):** The visible text label of the store card must be contained within the accessible name of the interactive control.
- **1.3.1 (Info and Relationships):** Each child text view being a separate focus stop implies the grouping structure is not communicated programmatically.
- **2.4.3 (Focus Order):** Fragmented focus across 5+ elements per row creates a confusing, non-sequential TalkBack navigation experience.
