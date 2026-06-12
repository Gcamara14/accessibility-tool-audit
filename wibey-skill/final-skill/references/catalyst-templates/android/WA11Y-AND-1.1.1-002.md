# Catalyst Template: Alt Text — Informative Image Description Text Is Not Accurate (Informative)

**Template ID:** `WA11Y-AND-1.1.1-002`
**Platform:** Android
**WCAG Criterion:** 1.1.1 Non-text Content
**Jira Label:** `WA11Y-AND-1.1.1-002`
**Source Tickets:** CEWMPLUS-152182
**Source PR:** [walmart-glass #139084](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139084)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

An informative image (product photo, promotional banner, benefit illustration) either:
1. Has no `contentDescription` at all — TalkBack says nothing or announces a file path, OR
2. Was incorrectly marked `importantForAccessibility="no"` — TalkBack skips it entirely, silently hiding content that is meaningful to sighted users.

In both cases, the image conveys information (a specific benefit, a product visual, a promotional offer) that screen-reader users cannot access.

**Symptom (Jira):** "TalkBack skips the banner image", "Image not announced", "Alt text is wrong or missing for the [feature] image", "Screen-reader users don't hear description for promotional image".

---

## ✅ The Fix Pattern

### Scenario A: Image suppressed with `importantForAccessibility="no"` — should be informative

This is the most common incorrect pattern: a developer assumed the image was decorative when it actually carries content meaning (e.g., a benefit artwork banner showing "fuel discounts" for Walmart+).

**❌ Bad Code (XML):**
```xml
<!-- Image suppressed — treated as decorative even though it depicts a meaningful benefit -->
<ImageView
    android:id="@+id/nba_image"
    android:layout_width="match_parent"
    android:layout_height="@dimen/membership_nba_image_height"
    android:importantForAccessibility="no"
    android:scaleType="centerCrop"
    ... />
```

**✅ Good Code (XML):**
```xml
<!-- Remove the suppression; set contentDescription to null to allow programmatic override -->
<ImageView
    android:id="@+id/nba_image"
    android:layout_width="match_parent"
    android:layout_height="@dimen/membership_nba_image_height"
    android:contentDescription="@null"
    android:scaleType="centerCrop"
    ... />
```

**✅ Good Code (Kotlin — adapter / ViewHolder binding):**
```kotlin
// Set the accessible description from the server-provided alt text
// Use orEmpty() to avoid null — an empty string tells TalkBack to skip rather than crash
nbaImage.contentDescription = item.image.alt.orEmpty()
nbaTitle.text = item.title
// ...
```

**Key rule:** Use `contentDescription="@null"` in XML (not `importantForAccessibility="no"`) to leave the slot open for code-driven assignment. `importantForAccessibility="no"` permanently hides the view from the a11y tree; `contentDescription="@null"` does not.

---

### Scenario B: Image with a static, generic `contentDescription` that does not describe the content

A `contentDescription` exists but says something vague (e.g., `"image"`, `"banner"`, `"graphic"`) instead of what the image actually shows.

**❌ Bad Code:**
```xml
<ImageView
    android:id="@+id/promo_banner_image"
    android:contentDescription="@string/generic_image_label"  <!-- "Image" or "Banner" -->
    ... />
```

**✅ Good Code:**
```kotlin
// Use a specific, content-aware description derived from the model
promoImage.contentDescription = item.imageAlt
    ?: context.getString(R.string.promo_banner_content_description, item.offerTitle)
```

Or in XML when the image is always the same:
```xml
<ImageView
    android:id="@+id/fuel_discount_image"
    android:contentDescription="@string/fuel_discount_promo_image_description"
    ... />
<!-- strings.xml: "Save up to 10 cents per gallon on fuel with Walmart+" -->
```

---

### Scenario C: Image whose description must be updated dynamically (carousel, list item)

When an image is recycled in a RecyclerView or driven by server data, the `contentDescription` must be set in the binding code, not in XML.

```kotlin
override fun onBindViewHolder(holder: ViewHolder, position: Int) {
    val item = items[position]
    with(holder.binding) {
        productImage.load(item.imageUrl)
        // ✅ Set description in bind — not in XML — to match the current item
        productImage.contentDescription = item.imageAlt
            ?: context.getString(R.string.product_image_of, item.productName)
    }
}
```

---

## 🔑 Key Rules

- **Every informative image must have a meaningful `contentDescription`** that describes what the image conveys, not just what it is (not "image" — "Image of a fuel pump with 10 cents off per gallon text").
- **`importantForAccessibility="no"` is only correct for purely decorative images** (backgrounds, dividers, visual flourishes with no informational value). Never use it on product photos, benefit images, or promotional banners.
- **Use `contentDescription="@null"` in XML** when the description will be set programmatically. This avoids the common mistake of having a stale XML description after the code sets a runtime one.
- **Server-provided `alt` text** (from a CMS or API `alt` field) should be preferred over hardcoded strings — it can be updated without an app release and is localized.
- **Empty string (`""`) ≠ `null`** for accessibility: an empty `contentDescription` suppresses the view from TalkBack the same as `importantForAccessibility="no"`. Only use `""` when the image truly has no informational value in context.

---

## ⚠️ WCAG Failure Without This Fix

- **1.1.1 (Non-text Content):** All non-text content presented to users must have a text alternative that serves an equivalent purpose. An informative image with no `contentDescription`, or with `importantForAccessibility="no"`, has no text alternative — screen-reader users receive no information from content that sighted users can see.
