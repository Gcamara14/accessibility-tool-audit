# Catalyst Template: Name — Shimmer Image Component Announces "Image" Instead of Voiceover Text (`imageContentDescription` vs `contentDescription`)

**Template ID:** `WA11Y-AND-4.1.2-027`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-027`
**Source Tickets:** HVCE-14747
**Source PRs:** [walmart-glass #139593](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139593)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

An `ExtraInfoListTabViewHolder` in a lens info bottom sheet displays images with a tab toggle. Each image has a `primaryImageVoiceOver` / `secondaryImageVoiceOver` field (e.g., "Diagram of pupil distance measurement").

The code sets the description using the standard `.contentDescription` property:

```kotlin
// ❌ Bug: .contentDescription targets the wrapper/shimmer layer, not the image node
tabImage.image.contentDescription = resourceItem.primaryImageVoiceOver
```

But `tabImage.image` is not a plain `ImageView` — it is a `WcpShimmerImage` (a Living Design component that wraps an `ImageView` with a shimmer placeholder layer). `WcpShimmerImage` exposes **two** distinct accessible description properties:

- **`.contentDescription`** — description for the outer container/shimmer wrapper (loading state)
- **`.imageContentDescription`** — description for the actual inner `ImageView` node (the loaded image)

Setting `.contentDescription` annotates the shimmer wrapper. After the image loads, TalkBack focuses the inner `ImageView` (which the shimmer layer reveals) — and that node has **no** `contentDescription`. TalkBack falls back to the view's type, announcing:

> **"Image"** — with no context about what the image depicts

**Symptom (Jira):** "TalkBack reads 'Image' instead of lens diagram description", "Image description not announced for lens info photos", "Screen reader announces 'Image' when voiceover text is set", "WcpShimmerImage contentDescription not working for TalkBack".

---

## ✅ The Fix Pattern

### Use `.imageContentDescription` to target the inner accessible image node

```kotlin
// ExtraInfoBottomSheetListAdapter.kt

class ExtraInfoListTabViewHolder(private val binding: ...) : RecyclerView.ViewHolder(binding.root) {

    fun bind(resourceItem: ResourceItemsConfig) {
        // ✅ Use imageContentDescription — targets the inner ImageView node that TalkBack focuses
        tabImage.image.imageContentDescription = resourceItem.primaryImageVoiceOver
        //                   ↑ imageContentDescription, not contentDescription

        setImage(resourceItem.primaryImage)

        tabLayout.apply {
            removeAllTabs()
            // ... build tabs ...

            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab) {
                    // ✅ Rename local variable to match semantics (voiceOver, not contentDescription)
                    val (image, voiceOver) = when (tab.position) {
                        0 -> Pair(resourceItem.primaryImage, resourceItem.primaryImageVoiceOver)
                        1 -> Pair(resourceItem.secondaryImage, resourceItem.secondaryImageVoiceOver)
                        else -> throw IllegalArgumentException("Invalid tab position")
                    }
                    // ✅ Use imageContentDescription on tab switch too
                    tabImage.image.imageContentDescription = voiceOver
                    setImage(image)
                }
                // ...
            })
        }
    }
}
```

---

### ❌ Bad Code — wrong property, TalkBack announces "Image"

```kotlin
// ❌ Before fix:
fun bind(resourceItem: ResourceItemsConfig) {
    // ❌ Sets description on the shimmer wrapper, not on the inner image node
    tabImage.image.contentDescription = resourceItem.primaryImageVoiceOver
    //                   ↑ contentDescription — targets the wrong layer

    tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
        override fun onTabSelected(tab: TabLayout.Tab) {
            // ❌ Variable named "contentDescription" hints at the wrong property
            val (image, contentDescription) = when (tab.position) {
                0 -> Pair(resourceItem.primaryImage, resourceItem.primaryImageVoiceOver)
                1 -> Pair(resourceItem.secondaryImage, resourceItem.secondaryImageVoiceOver)
                else -> throw IllegalArgumentException("Invalid tab position")
            }
            // ❌ Sets shimmer wrapper description, not image node
            tabImage.image.contentDescription = contentDescription
        }
    })
}
// TalkBack: "Image" — primaryImageVoiceOver is set on the wrong node
```

---

### The shimmer image accessibility model

```
WcpShimmerImage (outer container)
├── shimmer_placeholder_view  ← visible during loading
│   contentDescription        ← set by .contentDescription = "..."
│
└── image (ImageView)         ← visible after load
    imageContentDescription   ← set by .imageContentDescription = "..."
                              ← THIS is what TalkBack focuses and reads
```

`WcpShimmerImage.contentDescription` — controls the outer wrapper's accessible label. This is the description TalkBack reads while the shimmer is animating (before the image loads). Usually left as null or a loading placeholder.

`WcpShimmerImage.imageContentDescription` — controls the inner `ImageView`'s accessible label. This is the description TalkBack reads after the image has loaded and the shimmer is gone. **This is the property you almost always want to set.**

---

### Verified TalkBack announcements

```
// ❌ Before fix (contentDescription):
TalkBack: "Image"    ← no voiceover text announced

// ✅ After fix (imageContentDescription):
TalkBack: "Diagram of pupil distance measurement, Image"
           ──────────────────────────────────────
           imageContentDescription text
```

---

### Pattern generalisation — any Living Design shimmer component

The same `.imageContentDescription` vs `.contentDescription` split applies to any Living Design component that wraps an `ImageView` with a shimmer placeholder:

| Component | Property for image accessible name |
|---|---|
| `WcpShimmerImage` | `.imageContentDescription` |
| `WcpProductImage` | `.imageContentDescription` |
| `WcpHeroImage` | `.imageContentDescription` |
| Plain `ImageView` | `.contentDescription` (no shimmer) |

**Identifying rule:** if the component class name contains "Shimmer", "Product", "Hero" and wraps an inner `ImageView`, use `.imageContentDescription`. For plain `ImageView`, use `.contentDescription`.

---

## 🔑 Key Rules

- **Never set `.contentDescription` on a `WcpShimmerImage`** — it annotates the loading shimmer wrapper, not the image. The image node's `contentDescription` remains null and TalkBack announces "Image".
- **Always use `.imageContentDescription` on shimmer-wrapped image components** — this is the Living Design API for the inner image node's accessible name.
- **Update `.imageContentDescription` on tab/toggle switches** — if the image changes (e.g., primary ↔ secondary tab), update `.imageContentDescription` each time. The inner `ImageView` is reused; its accessible name persists from the last assignment.
- **Rename variables to reflect the correct property** — using a variable named `contentDescription` for voiceover text creates confusion about which property to set. Rename to `voiceOver` or `imageDescription` to signal the correct API.
- **Verify with TalkBack on a device after shimmer animation completes** — the bug is only observable after the shimmer finishes. Unit tests that read `view.contentDescription` immediately after `bind()` may pass (they read the shimmer wrapper property) but fail to catch the real defect. Use an instrumentation test or manual TalkBack session with a real image load.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name of user interface components must be programmatically determinable. A lens diagram image that TalkBack announces as "Image" has no programmatically determinable name. Screen reader users cannot determine what the image depicts — whether it is a diagram of PD measurement, a lens profile comparison, or a size chart. The voiceover text that the product provides (`primaryImageVoiceOver`) is present in the data model but never reaches the TalkBack user due to the wrong property being set.
