# Catalyst Template: Alt Text: Decorative / Hidden Content Announced by TalkBack

**Template ID:** `WA11Y-AND-1.1.1-003`
**Platform:** Android
**WCAG Criterion:** 1.1.1 Non-text Content
**Jira Label:** `WA11Y-AND-1.1.1-003`
**Source Tickets:** TXNCART-8202
**Source PR:** [walmart-glass #131165](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/131165)
**Date Ingested:** 2026-04-30

---

## 🛑 The Problem

Two related patterns cause TalkBack to announce content that should be invisible to screen reader users:

1. **Decorative icon announced:** An icon `ImageView` or `ImageButton` has no `contentDescription`, but its `importantForAccessibility` is not set to `no`. TalkBack announces it as "unlabeled" or reads its resource name.

2. **Hidden text included in contentDescription:** A view composes its `contentDescription` from the text of child views — but does **not** check `isVisible` before including them. Hidden views (e.g., `visibility="gone"`) have their text read aloud by TalkBack even though they are not shown on screen.

---

## ✅ The Fix Patterns

### Scenario A: Decorative Icon — Set `importantForAccessibility`

**❌ Bad Code (Kotlin View):**
```kotlin
// Only sets contentDescription if bannerIconAlt has text — but does NOT
// hide the icon from accessibility when there is no alt text.
intentType.bannerCards?.bannerIconAlt?.let { alt ->
    globalIntentCenterSmallCardIcon.contentDescription = alt.takeIf { it.hasText() }
}
```

**✅ Good Code (Kotlin View):**
```kotlin
// Explicitly exclude the icon from TalkBack when it has no alt text.
val bannerIconAlt = intentType.bannerCards?.bannerIconAlt
globalIntentCenterSmallCardIcon.contentDescription = bannerIconAlt.takeIf { it.hasText() }
globalIntentCenterSmallCardIcon.importantForAccessibility =
    if (bannerIconAlt.hasText()) IMPORTANT_FOR_ACCESSIBILITY_YES else IMPORTANT_FOR_ACCESSIBILITY_NO
```

**✅ Good Code (XML Layout — static decorative icon):**
```xml
<!-- Decorative icon that is always decorative: set in XML -->
<ImageView
    android:layout_width="24dp"
    android:layout_height="24dp"
    android:src="@drawable/ic_decorative_divider"
    android:importantForAccessibility="no"
    android:contentDescription="@null" />
```

---

### Scenario B: Hidden Text Leaking into contentDescription

**❌ Bad Code:**
```kotlin
// Reads text from subtitle even when subtitle is GONE/INVISIBLE.
val subtitle = globalIntentCenterLargeCardSubtitle.text.toString()
val changeStoreText = if (isSparkStore && subtitle.isEmpty()) {
    string(R.string.gic_change_store)
} else {
    subtitle
}
info.contentDescription = title + pause + changeStoreText + extras
```

**✅ Good Code:**
```kotlin
// Guard with isVisible before reading text from any child view.
val titleText =
    if (globalIntentCenterLargeCardTitle.isVisible) globalIntentCenterLargeCardTitle.text.toString() else ""
val subtitleText = if (globalIntentCenterLargeCardSubtitle.isVisible) {
    globalIntentCenterLargeCardSubtitle.text.toString()
} else {
    ""
}
val changeStoreText = if (isSparkStore && subtitleText.isEmpty()) {
    string(R.string.gic_change_store)
} else {
    subtitleText
}
info.contentDescription = titleText + pause + changeStoreText + extras
```

---

## 🔑 Key Rules

- **Always pair** `contentDescription = null` with `importantForAccessibility = no` for decorative views.
- **Never read text from a child view** without first checking `view.isVisible`. Text from `GONE` or `INVISIBLE` views must be excluded.
- Use `IMPORTANT_FOR_ACCESSIBILITY_YES` / `IMPORTANT_FOR_ACCESSIBILITY_NO` constants (from `ViewCompat`), or the XML attribute `android:importantForAccessibility="no"`.
- In Jetpack Compose, use `contentDescription = null` — Compose automatically suppresses TalkBack for images with a null description.

---

## ⚠️ WCAG Failure Without This Fix

- **1.1.1 (Non-text Content):** Decorative images must have a null/empty text alternative. TalkBack announcing an unlabeled icon fails this criterion.
- **1.3.1 (Info and Relationships):** Hidden text being announced implies the programmatic structure does not match the visual presentation.
