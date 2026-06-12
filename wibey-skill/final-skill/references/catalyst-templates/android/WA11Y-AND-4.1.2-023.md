# Catalyst Template: Name — Sponsored Video Ad Has No Accessible Name (Internal `SurfaceView`/`TextureView` BFS Pattern)

**Template ID:** `WA11Y-AND-4.1.2-023`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-023`
**Source Tickets:** CEPG-333194
**Source PRs:** [walmart-glass #125148](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/125148)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`SpVideoView` (Sponsored Video Ad) embeds a `WalmartVideoPlayerView`. Internally, the player creates a `SurfaceView` or `TextureView` for video rendering. TalkBack focuses on this internal surface view and announces:

> **"(no label), Video"** or just the role without any name

The internal `SurfaceView`/`TextureView` is created by the player library — the host cannot set `contentDescription` in XML because the view doesn't exist at layout inflate time. It is dynamically added by the player after `setUpVideoPlayer()` returns.

Additionally, the click listener was placed on the `SpVideoView` container (the video surface itself), not on the product tile. This meant TalkBack had to navigate to the video surface to activate the product — the video surface was both the unlabelled media element AND the clickable activation target.

**Symptom (Jira):** "TalkBack focuses on video player with no label", "Screen reader reads 'Video' with no product name on sponsored ad", "SpVideoView internal surface view has no accessible name", "Sponsored video ad unlabelled for TalkBack".

---

## ✅ The Fix Pattern

### BFS traversal to find and label the internal `SurfaceView`/`TextureView`

The fix has two parts:
1. **Move the click listener off the video surface** — attach it to the `productTileListView` (the visible product tile) so the interactive element and the accessible name are on the same view
2. **BFS traverse the `WalmartVideoPlayerView`'s children** to find the first `SurfaceView` or `TextureView` and set `contentDescription` on it after the player is ready

**❌ Bad Code:**

```kotlin
// SpVideoView.kt
// ❌ Click listener on the video surface (SpVideoView is the container)
spVideoView.setOnClickListener {
    goToProductDetail(product, productTile)
}
// ← No contentDescription set on the video surface or its internal SurfaceView/TextureView
// ← TalkBack: "(no label), Video"
```

---

**✅ Good Code:**

```kotlin
// SpVideoView.kt

// ✅ Move click handler to the product tile (correct interactive element)
productTileListView.contentDescription = product.name
// → TalkBack: "Samsung 65-inch TV, Button" (on the tile)

productTileListView.setOnClickListener {
    goToProductDetail(product, productTile)
}

// ✅ Set contentDescription on the video container AND find its internal surface view
binding.videoView.contentDescription = firstProduct.name
setVideoSurfaceAccessibility(binding.videoView, firstProduct.name)
```

```kotlin
/**
 * Sets contentDescription on the internal video surface view for TalkBack accessibility.
 * The WalmartVideoPlayerView contains an internal SurfaceView/TextureView that needs its own
 * contentDescription since it can be focused by TalkBack independently.
 *
 * Uses post() to defer until the player has created the surface view.
 */
@VisibleForTesting
fun setVideoSurfaceAccessibility(parent: ViewGroup, productName: String?) {
    if (productName.isNullOrEmpty()) return
    parent.post {
        applyContentDescriptionToVideoSurface(parent, productName)
    }
}

/**
 * BFS traversal over the ViewGroup hierarchy to find the first SurfaceView or TextureView.
 * Sets contentDescription on it and returns immediately (one surface view per player).
 */
@VisibleForTesting
fun applyContentDescriptionToVideoSurface(parent: ViewGroup, productName: String) {
    val queue = ArrayDeque<ViewGroup>()
    queue.add(parent)

    while (queue.isNotEmpty()) {
        val current = queue.removeFirst()
        for (i in 0 until current.childCount) {
            val child = current.getChildAt(i)
            when {
                child is android.view.SurfaceView || child is android.view.TextureView -> {
                    // ✅ Found the internal rendering surface — set the product name
                    child.contentDescription = productName
                    return  // Only one surface view per player; stop traversal
                }
                child is ViewGroup -> queue.add(child)
            }
        }
    }
}
```

---

### Why `parent.post { }` is required

The `WalmartVideoPlayerView` creates its internal `SurfaceView`/`TextureView` asynchronously during player initialization. If `applyContentDescriptionToVideoSurface` is called synchronously in `setUpSpVideoData()`, the surface view may not yet exist in the hierarchy — the BFS finds nothing.

`parent.post { }` defers the traversal to the next main-thread loop iteration, by which point the player has added the surface view to the hierarchy.

---

### Multi-item variant

For `SpVideoItemView` (multi-item carousel variant), the same `contentDescription = product.name` pattern applies to the item container:

```kotlin
// SpVideoItemView.kt
// ✅ Set contentDescription on the root view before the click listener
binding.root.contentDescription = product.name

binding.root.setOnClickListener {
    goToProductDetail(product = product, productTile = productTile)
}
```

No BFS traversal is needed here because `SpVideoItemView` uses the product tile layout as the outermost element — the video surface is a sibling, not the interactive target.

---

## 🔑 Key Rules

- **Set `contentDescription` on both the container and the internal surface view** — `binding.videoView.contentDescription = product.name` labels the player container. `applyContentDescriptionToVideoSurface()` labels the internal `SurfaceView`/`TextureView` that TalkBack may independently focus.
- **BFS (breadth-first) traversal, not DFS** — BFS finds the surface view at the shallowest level of the hierarchy first, which is always the correct rendering surface (deeper views are overlays). DFS would work too, but BFS is more predictable for player hierarchies.
- **Return immediately after finding the first surface view** — there is only one rendering surface per player. Continuing the traversal after finding it wastes cycles and could accidentally label other `SurfaceView` instances (e.g., camera preview surfaces embedded in the same layout).
- **Move click handlers to the product tile, not the video surface** — the video surface is a media element. Making it both the media element and the click target forces TalkBack to focus on an unlabelled surface to activate the product. The product tile is the correct interactive element.
- **`@VisibleForTesting` on both methods** — exposing `setVideoSurfaceAccessibility` and `applyContentDescriptionToVideoSurface` as test-visible allows unit tests to verify BFS behavior without launching the full player.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** User interface components must have names that can be programmatically determined. A `SurfaceView` or `TextureView` created dynamically by a video player library and placed in the accessibility tree with no `contentDescription` has no programmatically determinable name. TalkBack announces only the role ("Video") with no indication of what content is being displayed. Users cannot determine which product or advertisement they are viewing without navigating away from the video to a separate product tile.
