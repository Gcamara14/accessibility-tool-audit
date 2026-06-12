# Catalyst Template: Accessibility Not Enabled — Element Hidden from TalkBack or Not Exposed When Required

**Template ID:** `WA11Y-AND-4.1.2-012`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-012`
**Source Tickets:** CRUISE-18983, CEPG-373012
**Source PRs:**
- [walmart-glass (CRUISE-18983)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/) — EditText not reachable by TalkBack swipe
- [walmart-glass (CEPG-373012)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/) — VideoView exposes duplicate focus points inside a card
**Date Ingested:** 2026-04-30

---

## 🛑 The Problem

Two opposite but symmetrical failures with `importantForAccessibility`:

**Failure A — Element NOT reachable (should be exposed, but isn't):**
An interactive element (e.g., an `EditText` inside a `RecyclerView` item) is not reachable via TalkBack swipe or touch exploration because `importantForAccessibility` defaults to `auto` and the system heuristic incorrectly excludes it.

**Failure B — Element exposed when it should NOT be (duplicate focus points):**
An inner `VideoView` / `ExoPlayer` control sits inside a card that already exposes a complete `contentDescription`. TalkBack users encounter duplicate, confusing focus points like "Hide player controls" that should not be individually accessible.

---

## ✅ Fix Pattern A: Make a Hidden-by-Default Element Reachable

**❌ Bad Code:**
```kotlin
// EditText is never explicitly marked as important for accessibility.
// The system heuristic may exclude it, making it unreachable by swipe.
holder.bind(surveyItem)
itemView.setFocusForAccessibility()
```

**✅ Good Code:**
```kotlin
// Explicitly enable the EditText for accessibility so TalkBack can reach it.
editText.importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES

// Also ensure focus action targets the specific widget, not the row root.
binding.subscriptionsSurveyRadioButton.setFocusForAccessibility()
```

**✅ Good Code (XML alternative for static layouts):**
```xml
<EditText
    android:id="@+id/cancellation_reason_edit_text"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:importantForAccessibility="yes"
    android:hint="@string/cancellation_reason_hint" />
```

---

## ✅ Fix Pattern B: Suppress Duplicate Focus Points Inside a Media Card

When a parent container provides the full accessible experience, hide the inner media player and all its descendants from TalkBack using `IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS`.

**❌ Bad Code:**
```kotlin
// Inner VideoView exposes ExoPlayer controls as individual focus points,
// e.g., TalkBack announces "Hide player controls" when the card container
// already has a single complete contentDescription.
binding.videoView.importantForAccessibility = ViewCompat.IMPORTANT_FOR_ACCESSIBILITY_AUTO
```

**✅ Good Code:**
```kotlin
// CEPG-373012: When the card handles all TalkBack interaction, hide the inner VideoView
// (and its ExoPlayer controls) from TalkBack to prevent duplicate focus points.
ViewCompat.setImportantForAccessibility(
    binding.videoView,
    if (!videoRedirectIsNullOrEmpty && cardJustContainsVideo) {
        ViewCompat.IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS
    } else {
        ViewCompat.IMPORTANT_FOR_ACCESSIBILITY_AUTO
    }
)
```

**✅ Good Code (XML alternative — always decorative media player):**
```xml
<VideoView
    android:id="@+id/video_view"
    android:importantForAccessibility="noHideDescendants"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" />
```

---

## 🔍 Bonus: Building a Descriptive Accessibility Label for Media Cards

When a video card's content description is a bare social handle (e.g., `@walmart`), it must be enriched with the card title so TalkBack announces something meaningful. Also append a no-captions warning per WCAG 1.2.3/1.2.5.

```kotlin
internal fun buildDescriptiveAccessibilityLabel(videoCard: VideoCard, rawInfo: String): String {
    val baseDescription = if (rawInfo.startsWith("@")) {
        val contentTitle = videoCard.heading?.takeIf { it.isNotBlank() }
            ?: videoCard.title?.takeIf { it.isNotBlank() }
        if (contentTitle != null) {
            context.getString(R.string.tempo_shared_video_card_by_handle_with_title, rawInfo, contentTitle)
            // e.g. "Video by @walmart: Veggie Power Bowl"
        } else {
            context.getString(R.string.tempo_shared_video_card_by_handle, rawInfo)
            // e.g. "Video by @walmart"
        }
    } else {
        rawInfo
    }

    // Inform TalkBack users when no captions are available (WCAG 1.2.3 / 1.2.5)
    val hasCaptions = videoCard.videoContent.closedCaptions &&
        !videoCard.videoContent.closedCaptionsUrl.isNullOrEmpty()
    val captionSuffix = if (!hasCaptions) {
        ". ${context.getString(R.string.tempo_shared_video_card_no_captions_available)}"
    } else {
        ""
    }
    return baseDescription.trimEnd('.') + captionSuffix + "."
}
```

String resources:
```xml
<string name="tempo_shared_video_card_no_captions_available">No captions available</string>
<string name="tempo_shared_video_card_by_handle">Video by %1$s</string>
<string name="tempo_shared_video_card_by_handle_with_title">Video by %1$s: %2$s</string>
```

---

## 🔑 Key Rules

- **Pattern A:** Always explicitly set `importantForAccessibility = YES` on interactive widgets inside adapters/lists when the system heuristic may exclude them.
- **Pattern B:** Use `IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS` (not just `NO`) to suppress not just the container but all of its child views (ExoPlayer controls, overlays, etc.).
- `ViewCompat.setImportantForAccessibility()` is preferred over direct field assignment for API compatibility.
- **Never use a bare social handle (`@walmart`) as the accessible name** of a media element — always enrich it with context.
- Always signal closed-caption availability (or lack thereof) in the accessible label.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** Interactive elements (EditText, buttons) must be programmatically determinable. Elements with `importantForAccessibility` misconfigured either disappear from TalkBack or expose internal implementation details (like ExoPlayer controls) that users cannot meaningfully interact with.
- **1.2.3 / 1.2.5 (Captions / Audio Description):** Media content must clearly communicate caption availability.
