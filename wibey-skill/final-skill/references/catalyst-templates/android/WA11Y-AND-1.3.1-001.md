# Catalyst Template: Role — Heading Role Is Missing (Heading)

**Template ID:** `WA11Y-AND-1.3.1-001`
**Platform:** Android
**WCAG Criterion:** 1.3.1 Info and Relationships
**Jira Label:** `WA11Y-AND-1.3.1-001`
**Source Tickets:** CINEXT-14325, PGSPHARM-54287
**Source PRs:** [walmart-glass #120820](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/120820), [walmart-glass #133401](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/133401)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A `TextView` is **visually styled as a section heading** (larger font, bold, prominent position) but **TalkBack does not announce its heading role**. Screen-reader users navigating by headings (swipe with "headings" granularity or using the reading controls rotor) cannot jump to these sections — they are treated as ordinary text nodes. The structural hierarchy that sighted users perceive visually is completely absent in the accessibility tree.

Three common failure modes:
1. `android:accessibilityHeading` attribute is missing from the XML layout
2. The heading attribute was set in XML but then **removed** during a refactor (e.g., when switching from a static layout to a component-based one)
3. In a dynamically inflated bottom sheet, the title view is inflated after `onViewCreated` — so `setAccessibilityHeading()` must be called programmatically with a check for TalkBack being active

**Symptom (Jira):** "TalkBack users can't jump to sections", "Heading not announced by TalkBack", "Section title reads as plain text", "Heading role missing on form section header", "User can't navigate by headings".

---

## ✅ The Fix Pattern

### Pattern A: Add `android:accessibilityHeading="true"` in XML (most common)

**❌ Bad Code:**
```xml
<!-- Section heading — styled large and bold, but not marked as heading.
     TalkBack announces text content only, no heading role. -->
<TextView
    android:id="@+id/kyc_profile_header"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/kyc_profile_header"
    android:textAppearance="@style/TextAppearance.Heading" />
```

**✅ Good Code:**
```xml
<!-- Add android:accessibilityHeading="true" — TalkBack announces "Heading" after the text. -->
<TextView
    android:id="@+id/kyc_profile_header"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:accessibilityHeading="true"
    android:text="@string/kyc_profile_header"
    android:textAppearance="@style/TextAppearance.Heading" />
```

When the heading also needs to participate in a custom traversal order:

```xml
<!-- Section title with heading role AND explicit traversal order -->
<TextView
    android:id="@+id/kyc_user_address_header"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:accessibilityHeading="true"
    android:accessibilityTraversalAfter="@+id/phone_number_field"
    android:accessibilityTraversalBefore="@+id/kyc_cta_address"
    android:contentDescription="@string/kyc_user_address_header"
    android:importantForAccessibility="yes"
    android:text="@string/kyc_user_address_header" />
```

---

### Pattern B: Programmatic `ViewCompat.setAccessibilityHeading()` for dynamic views

For bottom sheets or views inflated after `onViewCreated`, use `ViewCompat.setAccessibilityHeading()` programmatically. Guard on `isTouchExplorationEnabled` to avoid unnecessary delegate work when TalkBack is off, and wrap in `postDelayed` to ensure the view is attached before the heading property is applied:

**✅ Good Code:**
```kotlin
import androidx.core.view.ViewCompat

override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)

    // Bottom sheet title view is inflated dynamically — set heading role
    // only when TalkBack (touch exploration) is active.
    if (context?.isTouchExplorationEnabled == true) {
        getSheetTitleView()?.let { titleView ->
            titleView.postDelayed({
                AccessibilityUtils.setFocusForAccessibility(titleView, true)
                ViewCompat.setAccessibilityHeading(titleView, true)
            }, 300)
        }
    }
}
```

**Key import:**
```kotlin
import androidx.core.view.ViewCompat
```

---

### Pattern C: Multiple headings in the same layout — apply consistently

When a layout has several section headings (e.g., a form with "Personal Info", "Address", "Payment" sections), apply `accessibilityHeading="true"` to every heading — not just the first:

```xml
<!-- ✅ All three section headings marked -->
<TextView
    android:id="@+id/section_personal_info"
    android:accessibilityHeading="true"
    android:text="@string/section_personal_info" />

<TextView
    android:id="@+id/section_address"
    android:accessibilityHeading="true"
    android:text="@string/section_address" />

<TextView
    android:id="@+id/section_payment"
    android:accessibilityHeading="true"
    android:text="@string/section_payment" />
```

---

## 🔑 Key Rules

- **`android:accessibilityHeading="true"` is the simplest fix** — add this attribute to any `TextView` (or `AppCompatTextView`) that is visually presented as a section or page heading. No Kotlin code required when the view is in a static layout.
- **`ViewCompat.setAccessibilityHeading(view, true)` for programmatic use** — required for views inflated at runtime (bottom sheet titles, dialog headers, dynamically added sections). Wrap in `postDelayed` if the view may not yet be attached when the fragment/activity starts.
- **Guard with `isTouchExplorationEnabled`** — calling `setAccessibilityHeading()` when TalkBack is off is harmless but wasteful; guarding avoids unnecessary delegate setup in performance-sensitive paths.
- **Do not remove `accessibilityHeading` during component refactors** — a common regression is replacing a static `TextView` with a design-system component (e.g., `WcpText`). If the new component doesn't inherit `accessibilityHeading`, the heading role silently disappears. Verify in TalkBack after every heading-related component swap.
- **Heading navigation is a primary screen-reader workflow** — users navigate long forms and content pages by jumping between headings (the TalkBack "Headings" traversal granularity). Unmarked headings force users to swipe through every element instead of jumping to sections.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.1 (Info and Relationships):** Information conveyed through presentation — in this case, the visual prominence of a heading — must also be available in a way that can be programmatically determined. A `TextView` styled as a heading but lacking `android:accessibilityHeading="true"` conveys its structural role only through visual style. Screen-reader users receive no programmatic signal that this is a navigable section heading, breaking the logical document structure of the screen.
