# Catalyst Template: Role — Generic Interactive Role is Missing (Heading Role, Button Role)

**Template ID:** `WA11Y-AND-4.1.2-006`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-006`
**Source Tickets:** PGSPHARM-31571
**Source PRs:** [walmart-glass #134157](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/134157), [walmart-glass #134616](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/134616)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

An interactive or structural element (heading text, clickable view, labelled section) **does not announce its role** to TalkBack. Sighted users can visually identify headings, sections, and buttons by size, weight, or position — but TalkBack users hear only the text with no structural context.

Two common manifestations:
1. **Heading `TextView` not marked as a heading** — TalkBack reads the text but does not say "heading", so users can't use heading-swipe navigation to jump sections.
2. **`TextView` / container that is `importantForAccessibility="no"` or `focusable="false"`** — TalkBack skips the element entirely or traverses into children, losing the structural landmark.

**Symptom (Jira):** "Section title not announced as heading", "TalkBack doesn't read section names", "Visual headings not focusable by TalkBack", "TalkBack skips section labels".

---

## ✅ The Fix Pattern

### Scenario A: `TextView` heading not announced as heading — XML fix

**❌ Bad Code:**
```xml
<!-- Service list section title — visible as heading visually
     but TalkBack reads it as plain text with no heading role -->
<TextView
    android:id="@+id/services_list_section_title"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:textAppearance="?ldTextAppearanceHeadingSmallBold"
    app:layout_constraintEnd_toStartOf="@id/services_list_primary_link"
    app:layout_constraintStart_toEndOf="@+id/services_list_walmart_plus_logo" />
```

**✅ Good Code:**
```xml
<!-- Add android:accessibilityHeading, focusable, and importantForAccessibility -->
<TextView
    android:id="@+id/services_list_section_title"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:accessibilityHeading="true"
    android:focusable="true"
    android:focusableInTouchMode="true"
    android:importantForAccessibility="yes"
    android:textAppearance="?ldTextAppearanceHeadingSmallBold"
    app:layout_constraintEnd_toStartOf="@id/services_list_primary_link"
    app:layout_constraintStart_toEndOf="@+id/services_list_walmart_plus_logo" />
```

Apply the same three attributes to every heading-level element on screen:
```xml
<!-- POV carousel heading -->
<TextView
    android:id="@+id/pov_carousel_title"
    android:accessibilityHeading="true"
    android:focusable="true"
    android:focusableInTouchMode="true"
    android:importantForAccessibility="yes"
    android:layout_marginStart="?ld.primitive.scale.space.200"
    android:textAppearance="?ldTextAppearanceHeadingMediumBold" />

<!-- Promo card title -->
<TextView
    android:id="@+id/promo_card_title"
    android:importantForAccessibility="yes"
    android:focusable="true"
    android:focusableInTouchMode="true"
    android:layout_marginHorizontal="?ld.primitive.scale.space.200"
    android:textAppearance="?ldTextAppearanceTitleLargeBold" />
```

---

### Scenario B: `HeadingBannerView` — composite heading with body text

For a compound view that contains both a heading and body text, mark the **heading `TextView`** with `accessibilityHeading="true"` and ensure the body `TextView` is also independently focusable.

**✅ Good Code (XML):**
```xml
<!-- Heading inside HeadingBannerView -->
<TextView
    android:id="@+id/heading_banner_title"
    android:accessibilityHeading="true"
    android:focusable="true"
    android:focusableInTouchMode="true"
    android:importantForAccessibility="yes"
    android:layout_marginHorizontal="?ld.primitive.scale.space.200"
    android:textAppearance="?ldTextAppearanceHeadingLargeBold" />

<!-- Body text in the same banner -->
<TextView
    android:id="@+id/heading_banner_body"
    android:focusable="true"
    android:focusableInTouchMode="true"
    android:importantForAccessibility="yes"
    android:layout_marginEnd="?ld.primitive.scale.space.200"
    android:textAppearance="?ldTextAppearanceBodyMediumRegular" />
```

---

### Scenario C: Heading role via `AccessibilityNodeInfoCompat` (programmatic, Kotlin)

When the heading view is created or configured in Kotlin (e.g., a custom view or ViewModel-driven heading), use `ViewCompat` to set the heading flag programmatically:

```kotlin
// ✅ Mark a view as a heading at runtime (API 28+ via ViewCompat backport)
ViewCompat.setAccessibilityHeading(binding.sectionTitle, true)

// ✅ Ensure it's focusable for TalkBack swipe navigation
binding.sectionTitle.importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES
binding.sectionTitle.isFocusable = true
```

---

## 🔑 Key Rules

- **`android:accessibilityHeading="true"`** (API 28+) marks a `TextView` as a heading node. TalkBack then announces "heading" after the text and allows heading-skip navigation with swipe gestures.
- **`android:focusable="true"` + `android:focusableInTouchMode="true"`** must accompany `accessibilityHeading`. Without `focusable`, TalkBack cannot land on the element, making the heading annotation useless.
- **`android:importantForAccessibility="yes"`** prevents parent containers from suppressing the heading from the a11y tree. Always set this on heading `TextView`s that are inside ConstraintLayout/RelativeLayout containers.
- **Apply to all heading-level text** — sections, cards, banners, list headings. If it looks like an H1/H2 visually, it should announce as a heading to TalkBack.
- **Do not set `accessibilityHeading` on body text** — only section titles and top-level labels warrant heading role. Over-marking creates noisy navigation.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The role of every UI component must be programmatically determinable. A `TextView` rendered as a visual heading without `accessibilityHeading="true"` has no semantic role in the accessibility tree. TalkBack users cannot identify page structure or use heading-navigation gestures, violating the requirement that structure be conveyed programmatically.
