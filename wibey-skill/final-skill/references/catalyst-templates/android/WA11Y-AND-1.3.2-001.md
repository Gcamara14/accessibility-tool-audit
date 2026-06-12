# Catalyst Template: Meaningful Sequence — Carousel Position Indicator Announced After Content Instead of Before

**Template ID:** `WA11Y-AND-1.3.2-001`
**Platform:** Android
**WCAG Criterion:** 1.3.2 Meaningful Sequence
**Jira Label:** `WA11Y-AND-1.3.2-001`
**Source Tickets:** SAECOMMHC-6272
**Source PRs:** [walmart-glass #135908](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/135908)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A promotional carousel tile builds its `contentDescription` by joining two parts: the tile's content text and a slide position indicator (e.g., "2 of 5"). They are joined in the **wrong order**: content first, position second.

TalkBack announces: **"50% off holiday deals, 2 of 5"**

The user hears the promotional content before they know where they are in the carousel. This is a meaningful sequence failure — the positional context ("2 of 5") provides orientation that should come **before** the content so the user can decide whether to explore or skip.

The correct order: **"2 of 5, 50% off holiday deals"** — position provides framing first, then the user hears what is in this particular slide.

**Symptom (Jira):** "TalkBack reads promo carousel content before the position number", "Screen reader says slide content then position, should be reversed", "Carousel swipe count announced in wrong order", "Position indicator comes after content in TalkBack announcement".

---

## ✅ The Fix Pattern

### Swap the order in the `joinToString` call

**❌ Bad Code:**
```kotlin
// Content announced before position — user hears what without knowing where.
// TalkBack: "50% off holiday deals, 2 of 5"
private fun generateAccessibilityText(
    accessibilityText: String?,   // content: "50% off holiday deals"
    slidePositionText: String?    // position: "2 of 5"
): String? {
    return listOfNotNull(accessibilityText, slidePositionText)
        .joinToString(", ")
        .ifEmpty { null }
    // → "50% off holiday deals, 2 of 5"
}
```

**✅ Good Code:**
```kotlin
// Position announced before content — user knows where they are, then hears what.
// TalkBack: "2 of 5, 50% off holiday deals"
private fun generateAccessibilityText(
    accessibilityText: String?,   // content: "50% off holiday deals"
    slidePositionText: String?    // position: "2 of 5"
): String? {
    return listOfNotNull(slidePositionText, accessibilityText)
        .joinToString(", ")
        .ifEmpty { null }
    // → "2 of 5, 50% off holiday deals"
}
```

The only change: **swap the order** of `slidePositionText` and `accessibilityText` in the `listOfNotNull()` call.

---

### Full context — carousel adapter bind

```kotlin
class CarouselStoryAdapter(val context: Context) :
    ListAdapter<GenericStoryTile, CarouselStoryAdapter.ViewHolder>(...) {

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val tile = getItem(position)
        val total = itemCount

        // ✅ Position string: "2 of 5"
        val slidePositionText = context.getString(
            R.string.carousel_slide_position,
            position + 1,
            total
        )
        // Content from the tile's own accessibility label
        val accessibilityText = tile.accessibilityLabel

        // ✅ Position FIRST, content SECOND
        holder.itemView.contentDescription =
            generateAccessibilityText(accessibilityText, slidePositionText)
    }

    private fun generateAccessibilityText(
        accessibilityText: String?,
        slidePositionText: String?
    ): String? {
        return listOfNotNull(slidePositionText, accessibilityText) // ← position first
            .joinToString(", ")
            .ifEmpty { null }
    }
}
```

```xml
<!-- strings.xml -->
<string name="carousel_slide_position">%1$d of %2$d</string>
<!-- or with ICU format: -->
<string name="carousel_slide_position_icu">{current} of {total}</string>
```

---

### The broader rule: context before content in composite descriptions

The position-first principle extends to any composite `contentDescription` where one part provides orientation/context and another part provides data:

| Composite announcement | ❌ Wrong order | ✅ Correct order |
|---|---|---|
| Carousel tile | "50% off deals, 2 of 5" | "2 of 5, 50% off deals" |
| Product image in gallery | "Organic milk front view, Image 1 of 4" | "Image 1 of 4, Organic milk front view" |
| Notification badge | "3 new messages, Messages" | "Messages, 3 new messages" |
| Star rating | "Great product, 4.5 stars" | "4.5 stars, Great product" |
| Order status card | "John's order, Delivered" | "Delivered, John's order" |

**Rule of thumb:** Lead with the **classification / position / status** (context), follow with the **title / description** (content).

---

### Test assertion

```kotlin
@Test
fun `generateAccessibilityText announces position before content`() {
    val adapter = CarouselStoryAdapter(context)
    val result = adapter.generateAccessibilityText(
        accessibilityText = "50% off holiday deals",
        slidePositionText = "2 of 5"
    )
    // Position ("2 of 5") must appear before the content
    assertThat(result).isEqualTo("2 of 5, 50% off holiday deals")
    assertThat(result).startsWith("2 of 5")
}

@Test
fun `generateAccessibilityText returns content only when position is null`() {
    val adapter = CarouselStoryAdapter(context)
    val result = adapter.generateAccessibilityText(
        accessibilityText = "50% off holiday deals",
        slidePositionText = null
    )
    assertThat(result).isEqualTo("50% off holiday deals")
}
```

---

## 🔑 Key Rules

- **Position/context before content** — orientation information (where is this in a sequence?) must precede the slide's descriptive content so users can decide whether to explore before hearing the full text.
- **Use `listOfNotNull()` + `joinToString(", ")`** — this handles null safely (omits the position if it's not available) and uses a comma-space separator that TalkBack renders as a natural pause.
- **Never append position to the end of content text** — "Ad text, 2 of 5" reads as if "2 of 5" is part of the ad copy. Position indicators are metadata; they should lead.
- **Audit all carousel adapters** — the wrong-order pattern (`content, position`) often originates from concatenating the position as an afterthought. Search for `joinToString` and `+` concatenation in RecyclerView adapters that deal with carousels or paged content.
- **Include position even for a single slide** — when `total == 1`, output "1 of 1, [content]" or omit it entirely. Never show position as "1 of 1" without the item; but if position is included at all, it must lead.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.2 (Meaningful Sequence):** When the sequence in which content is presented affects its meaning, the correct reading sequence must be programmatically determinable. In a carousel, the position indicator ("2 of 5") establishes sequence context — it tells the user where they are before the content is announced. Announcing the content before the position reverses the meaningful sequence, depriving users of orientation context before they receive information. They hear the content without knowing whether they are on slide 1 or slide 5, and cannot make an informed decision about how to navigate.
