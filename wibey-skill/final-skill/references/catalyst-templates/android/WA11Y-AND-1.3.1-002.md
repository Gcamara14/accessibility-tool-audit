# Catalyst Template: Info — Element Grouping: Related Elements Not Read as One Group

**Template ID:** `WA11Y-AND-1.3.1-002`
**Platform:** Android
**WCAG Criterion:** 1.3.1 Info and Relationships
**Jira Label:** `WA11Y-AND-1.3.1-002`
**Source Tickets:** CEPG-297546
**Source PR:** [walmart-glass #100390](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/100390)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Related UI elements (e.g., a banner headline + sub-text + OTP code) are each individually focusable by TalkBack. Instead of hearing one cohesive announcement, the user must swipe through each child element separately — breaking the logical reading unit and causing confusion about which elements belong together.

**Symptom (Jira):** "TalkBack reads banner text as separate items", "User has to swipe multiple times to hear all parts of the alert", "Related content not grouped", "Banner heading and description are separate TalkBack stops".

---

## ✅ The Fix Pattern

### Strategy: One parent focus point, children suppress themselves

Make the **parent container** the single TalkBack focus point. All child views that are part of the logical group must opt out of individual focus. When TalkBack lands on the parent, it automatically concatenates the text of all non-focusable, non-suppressed children into one announcement.

**❌ Bad Code:**
```xml
<!-- Parent Card — not marked as the single focus point -->
<living.design.widget.Card
    android:id="@+id/post_tx_ui_shared_high_value_banner_card"
    android:layout_width="match_parent"
    android:layout_height="wrap_content">

    <!-- Each child individually accessible — TalkBack visits them one by one -->

    <TextView
        android:id="@+id/post_tx_ui_shared_heading_textview"
        android:importantForAccessibility="yes"
        ... />

    <TextView
        android:id="@+id/post_tx_ui_shared_sub_heading_textview"
        android:importantForAccessibility="yes"
        ... />

    <living.design.widget.Card
        android:id="@+id/post_tx_ui_shared_otp_cardview"
        android:screenReaderFocusable="true"
        android:focusable="true"
        ... />
</living.design.widget.Card>
```

**✅ Good Code:**
```xml
<!-- Parent Card — ONE TalkBack focus point for the whole banner group -->
<living.design.widget.Card
    android:id="@+id/post_tx_ui_shared_high_value_banner_card"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:importantForAccessibility="yes"
    android:screenReaderFocusable="true"
    android:focusable="true"
    ...>

    <!-- Decorative image — suppress completely -->
    <ImageView
        android:id="@+id/post_tx_ui_shared_imageview"
        android:importantForAccessibility="no"
        ... />

    <!-- Text children — participate in parent announcement but NOT individually focusable -->

    <TextView
        android:id="@+id/post_tx_ui_shared_heading_textview"
        android:focusable="false"
        ... />

    <TextView
        android:id="@+id/post_tx_ui_shared_sub_heading_textview"
        android:focusable="false"
        ... />

    <!-- OTP card — also part of the group, not an independent stop -->
    <living.design.widget.Card
        android:id="@+id/post_tx_ui_shared_otp_cardview"
        android:focusable="false"
        ... />

</living.design.widget.Card>
```

**TalkBack result:** One swipe → "You'll need to be present at delivery. Show this one-time passcode to your driver. [OTP value]." — all in a single focus event.

---

### Attribute reference

| Attribute | Value | Effect |
|-----------|-------|--------|
| `android:importantForAccessibility="yes"` | On parent | Ensures TalkBack can always land here |
| `android:screenReaderFocusable="true"` | On parent | Marks as a screen-reader node (backport for older APIs) |
| `android:focusable="true"` | On parent | Receives keyboard/TalkBack swipe focus |
| `android:focusable="false"` | On text children | Child won't be a standalone TalkBack stop; its text still contributes to parent announcement |
| `android:importantForAccessibility="no"` | On decorative children | Completely hides from the a11y tree |

---

### When to use this pattern vs. keeping elements separate

Use **grouping** (single parent focus) when:
- The child elements are meaningless in isolation (e.g., "passcode:" + "4729" are parts of one thing)
- The group is always displayed together and always describes one concept
- Swiping through each element individually would confuse rather than clarify

Use **separate focus points** (children individually accessible) when:
- Each element has distinct, independently actionable content (tap to call vs. tap to get directions)
- The relationship between elements is not tight (heading vs. unrelated body text below it)
- Screen-reader users need to re-read only part of the group

---

## 🔑 Key Rules

- **The parent must be `focusable="true"` + `screenReaderFocusable="true"` + `importantForAccessibility="yes"`** — all three are needed. Without `focusable`, TalkBack cannot land. Without `importantForAccessibility="yes"`, a parent container may be skipped. Without `screenReaderFocusable`, older Android APIs may miss it.
- **Children use `focusable="false"`, NOT `importantForAccessibility="no"`** — `importantForAccessibility="no"` completely hides a child (its text won't be read). `focusable="false"` prevents it from being an independent stop but lets its text still be included in the parent's announcement.
- **`importantForAccessibility="no"` only for truly decorative children** (icons, dividers, spacers) that add no information to the combined announcement.
- **Set `contentDescription` on the parent** if child text ordering or concatenation in auto-mode produces a confusing announcement. The parent's explicit `contentDescription` overrides all child text assembly.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.1 (Info and Relationships):** Information and relationships conveyed through presentation must be programmatically determinable. A banner that visually presents a headline + description + code as a single semantic unit, but exposes each element as an independent TalkBack focus point, fails to convey the grouping relationship programmatically.
