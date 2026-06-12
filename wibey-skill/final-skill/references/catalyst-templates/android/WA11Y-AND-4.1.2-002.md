# Catalyst Template: Name: Generic/Vague — Custom View Missing contentDescription and screenReaderFocusable

**Template ID:** `WA11Y-AND-4.1.2-002`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-002`
**Source Tickets:** HVCE-14751
**Source PR:** [walmart-glass #139944](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139944)
**Date Ingested:** 2026-04-30

---

## 🛑 The Problem

A custom compound view (e.g., a `Tag` badge, a styled chip, a product flag) has:
1. No explicit `contentDescription` → TalkBack cannot announce a meaningful label.
2. `ViewCompat.setScreenReaderFocusable()` not called → TalkBack skips the view entirely or cannot land on it as a standalone node.

**Symptom:** Jira says "TalkBack skips [badge name]" or "badge reads generic/unlabeled content" or "icon reads nothing".

---

## ✅ The Fix Pattern

### Scenario: Custom `Tag` / Badge View (Kotlin Adapter/Delegate)

**❌ Bad Code:**
```kotlin
// Badge displays text but does NOT set contentDescription or screenReaderFocusable.
// TalkBack cannot focus this custom Tag view as a meaningful unit.
binding.petRxBadge.apply {
    visibility = View.VISIBLE
    setValues(
        text = string(module.petRxBadge.textId),
        type = Tag.TagType.STYLED_TEXT_BLACK,
        iconResId = module.petRxBadge.iconResId,
        iconTintEnabled = true
    )
    // ❌ Missing: contentDescription and setScreenReaderFocusable
}
```

**✅ Good Code:**
```kotlin
// Always capture the text first, then assign it to both text AND contentDescription.
val badgeText = string(module.petRxBadge.textId)
binding.petRxBadge.apply {
    visibility = View.VISIBLE
    setValues(
        text = badgeText,
        type = Tag.TagType.STYLED_TEXT_BLACK,
        iconResId = module.petRxBadge.iconResId,
        iconTintEnabled = true
    )
    // ✅ Explicitly set the accessible name
    contentDescription = badgeText
    // ✅ Mark as a screen-reader focusable node so TalkBack can land on it
    ViewCompat.setScreenReaderFocusable(this, true)
}
```

### Scenario: Multiple Distinct Badges on the Same Screen

Each badge needs its own distinct `contentDescription`. Do not rely on the same string for two badges that represent different concepts.

```kotlin
// Vision Center badge
binding.visionCenterBadge.apply {
    visibility = View.VISIBLE
    setValues(/* ... */)
    contentDescription = module.visionCenterBadgeText  // Use module-specific text
    ViewCompat.setScreenReaderFocusable(this, true)
}

// Pet Rx badge
binding.petRxBadge.apply {
    visibility = View.VISIBLE
    val badgeText = string(module.petRxBadge.textId)
    setValues(text = badgeText, /* ... */)
    contentDescription = badgeText
    ViewCompat.setScreenReaderFocusable(this, true)
}
```

### Scenario: XML Layout — Custom View Always Needing a Label

```xml
<!-- If the badge text is static and known at layout time -->
<com.walmart.glass.shared.ui.Tag
    android:id="@+id/rx_badge"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:contentDescription="@string/rx_badge_description"
    android:focusableInTouchMode="false" />
```

---

## 🔑 Key Rules

- **`contentDescription` must always be set explicitly** on custom compound views — do not assume the view's internal `text` property will be read by TalkBack.
- **`ViewCompat.setScreenReaderFocusable(view, true)`** must be called on any custom view that is not a standard Android widget (Button, TextView, etc.) to mark it as a standalone accessibility node.
- Extract the badge text into a variable **before** calling `setValues()`, so the same string is used for both the visual text and the `contentDescription` — no chance of divergence.
- When the badge is hidden (`visibility = GONE`), do not set `contentDescription` — or explicitly clear it — to avoid stale announcements.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The accessible name of a UI component must be programmatically determinable. A custom view without an explicit `contentDescription` has no name; a view without `screenReaderFocusable = true` has no role in the accessibility tree.
