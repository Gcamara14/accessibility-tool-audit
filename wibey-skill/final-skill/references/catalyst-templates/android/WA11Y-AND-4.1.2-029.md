# Catalyst Template: Name, Role, Value — Video Card Inner Player Creates Duplicate TalkBack Focus Points ("Hide Player Controls")

**Template ID:** `WA11Y-AND-4.1.2-029`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-029`
**Source Tickets:** CEPG-373012
**Source PRs:** [walmart-glass (internal)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`VideoCardView` contains an outer card container (`binding.videoCard`) with a composite `contentDescription` that includes the video's accessible information. Inside the card, `binding.videoView` is an ExoPlayer-backed `VideoView` that TalkBack also focuses independently.

Because the inner `VideoView` is not hidden from TalkBack, two separate focus nodes appear on the same card:
1. `binding.videoCard` → announces the video card description (correct)
2. `binding.videoView` → announces ExoPlayer internal controls, including "Hide player controls" (incorrect — unwanted duplicate)

TalkBack users encounter:
> **"Video by @walmart: Veggie Power Bowl"** ← outer card (correct)
> **"Hide player controls"** ← inner ExoPlayer UI (duplicate, confusing)

Additionally, when `videoAccessibilityInformation` is a bare social handle (`@walmart`), TalkBack announces only the handle with no context. Expected: "Video by @walmart: Veggie Power Bowl" (handle + card heading).

**Symptom (Jira):** "TalkBack announces 'Hide player controls' on video card", "Duplicate focus nodes on video card screen reader", "Video card has two TalkBack stops instead of one", "ExoPlayer controls exposed to TalkBack inside video card".

---

## ✅ The Fix Pattern

### Part 1 — Suppress inner `VideoView` from TalkBack when card handles interaction

```kotlin
// VideoCardView.kt

private fun setUpVideoAccessibility(
    videoCard: VideoCard,
    videoRedirectIsNullOrEmpty: Boolean,
    cardJustContainsVideo: Boolean
) {
    val accessibilityInfo = videoCard.videoContent.videoAccessibilityInformation

    if (!accessibilityInfo.isNullOrEmpty()) {
        setAccessibilityForVideoView(
            binding.videoCard,
            // ✅ Enrich bare social handles with card heading
            buildDescriptiveAccessibilityLabel(videoCard, accessibilityInfo),
            !videoRedirectIsNullOrEmpty && cardJustContainsVideo
        )
    }

    // ✅ Suppress the inner VideoView from TalkBack when the outer card container
    //    is the single accessible node for this video.
    //    Using NO_HIDE_DESCENDANTS removes the VideoView AND all ExoPlayer children
    //    (play button, progress bar, "Hide player controls") from the accessibility tree.
    //
    //    When cardJustContainsVideo is false (e.g., card has a redirect URL),
    //    the VideoView may need its own accessibility; fall back to AUTO.
    ViewCompat.setImportantForAccessibility(
        binding.videoView,
        if (!videoRedirectIsNullOrEmpty && cardJustContainsVideo) {
            ViewCompat.IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS
        } else {
            ViewCompat.IMPORTANT_FOR_ACCESSIBILITY_AUTO
        }
    )
}
```

---

### Part 2 — Enrich bare social handle with card heading

```kotlin
// VideoCardView.kt

/**
 * Builds a descriptive TalkBack label for the video card.
 *
 * When [rawInfo] is a bare social handle (e.g. "@walmart"), it is combined with the card
 * heading/title to produce a meaningful announcement:
 *   "@walmart" + "Veggie Power Bowl" → "Video by @walmart: Veggie Power Bowl"
 *
 * When [rawInfo] already contains a full description, it is returned as-is.
 */
@VisibleForTesting
fun buildDescriptiveAccessibilityLabel(videoCard: VideoCard, rawInfo: String): String {
    val heading = videoCard.videoContent.heading?.text.orEmpty()
    return when {
        // Bare social handle: enrich with heading
        rawInfo.startsWith("@") && heading.isNotBlank() ->
            getString(R.string.tempo_shared_video_card_by_handle_with_title, rawInfo, heading)
            // → "Video by @walmart: Veggie Power Bowl"

        // Handle without heading: use handle-only template
        rawInfo.startsWith("@") ->
            getString(R.string.tempo_shared_video_card_by_handle, rawInfo)
            // → "Video by @walmart"

        // Full description already provided: use as-is
        else -> rawInfo
    }
}
```

```xml
<!-- strings.xml -->
<string name="tempo_shared_video_card_by_handle">Video by %1$s</string>
<string name="tempo_shared_video_card_by_handle_with_title">Video by %1$s: %2$s</string>
```

---

### ❌ Bad Code — inner VideoView creates duplicate focus point

```kotlin
// ❌ Before fix:
private fun setUpVideoAccessibility(...) {
    if (!videoCard.videoContent.videoAccessibilityInformation.isNullOrEmpty()) {
        setAccessibilityForVideoView(
            binding.videoCard,
            videoCard.videoContent.videoAccessibilityInformation,  // ← raw handle "@walmart"
            !videoRedirectIsNullOrEmpty && cardJustContainsVideo
        )
    }
    // ❌ No importantForAccessibility on binding.videoView
    // → binding.videoView remains accessible
    // → TalkBack finds TWO nodes: videoCard ("@walmart") + videoView ("Hide player controls")
}
```

---

### The two-node problem

```
VideoCardView (binding.videoCard)
├── videoCard ConstraintLayout    ← accessible, contentDescription = "@walmart"
│   ...
└── videoView (ExoPlayer VideoView)  ← also accessible (bug!)
    ├── play/pause button            ← TalkBack: "Play"
    ├── progress bar                 ← TalkBack: "0%"
    └── hide controls button         ← TalkBack: "Hide player controls"
```

After fix:
```
VideoCardView (binding.videoCard)
├── videoCard ConstraintLayout    ← accessible, contentDescription = "Video by @walmart: ..."
│   ...
└── videoView (ExoPlayer VideoView)
    importantForAccessibility = NO_HIDE_DESCENDANTS  ← hidden from TalkBack ✅
    (all ExoPlayer children also hidden)
```

---

### Condition: when to suppress vs when to expose

The suppression is conditional on `cardJustContainsVideo` and `!videoRedirectIsNullOrEmpty`:

| `cardJustContainsVideo` | `videoRedirectIsNullOrEmpty` | VideoView accessibility |
|---|---|---|
| `true` | `false` (has redirect) | `NO_HIDE_DESCENDANTS` — card handles interaction, video is background media |
| `false` | any | `AUTO` — card may need inner video controls for playback |
| `true` | `true` | `AUTO` — no redirect means user may need to interact with video controls directly |

The guard `!videoRedirectIsNullOrEmpty && cardJustContainsVideo` matches the same condition used to set `isClickable = false` on the outer card: when the card has a redirect and is purely a video card, all interaction is handled at the card level.

---

## 🔑 Key Rules

- **Use `ViewCompat.IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS`** — this suppresses the `VideoView` and **all its children** (play button, progress bar, control overlay). `IMPORTANT_FOR_ACCESSIBILITY_NO` would suppress only the `VideoView` itself but leave children potentially accessible.
- **Apply suppression conditionally — not always** — media player controls are appropriate to expose when the user needs to interact with playback (pause, seek). Only suppress when a parent container already handles all interaction.
- **Enrich social handles before setting `contentDescription`** — a bare `@walmart` is not a meaningful accessible label. The `buildDescriptiveAccessibilityLabel()` helper transforms handles into "Video by @walmart: {heading}" using string resources so the announcement is contextual.
- **Use `ViewCompat.setImportantForAccessibility()` (Jetpack)** — prefer `ViewCompat` over the framework `View.setImportantForAccessibility()` for API-level safety. The behavior is identical on API 21+ but `ViewCompat` is the conventional choice in the Walmart Glass codebase.
- **Test with TalkBack swipe traversal on the video card** — verifying `importantForAccessibility` in unit tests is insufficient. TalkBack may still traverse hidden views in some configurations. Manual TalkBack testing on a device is required to confirm exactly one focus stop per video card.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The role and value of user interface components must be programmatically determinable. Two failures:
  1. **Duplicate focus points** — exposing both the card container and the inner ExoPlayer `VideoView` to TalkBack creates two accessible nodes for the same interactive element. Users cannot determine which node to activate. The inner "Hide player controls" announcement is contextually incorrect (controls are not visible) and creates false affordances.
  2. **Non-descriptive name** — a bare social handle (`@walmart`) is not a meaningful accessible name. It identifies the creator but not the content, leaving users without the context they need to decide whether to interact with the video.
