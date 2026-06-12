# Catalyst Template: Name, Role, Value — Tag/Badge Component Not Screen Reader Focusable on PDP

**Template ID:** `WA11Y-AND-4.1.2-028`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-028`
**Source Tickets:** HVCE-14751
**Source PRs:** [walmart-glass #139944](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139944)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`ProductOmniServicesBadgesDelegate` renders speciality service badges on the PDP — a Vision Rx badge ("Prescription available") and a Pet Rx badge — using `Tag` (a Living Design chip component). The badges are visible on screen but TalkBack **cannot focus them** and does not announce them.

Root cause: `Tag` is a Living Design component that defaults to `screenReaderFocusable = false`. Without explicitly calling `ViewCompat.setScreenReaderFocusable(tag, true)`, the accessibility framework treats the badge as a non-interactive decoration. TalkBack's traversal skips it entirely.

Additionally, `contentDescription` was never set on the badge. Even if focus had worked, TalkBack would have announced the component's internal text node rather than a clean, controlled label.

TalkBack result: badge is invisible to screen reader users — "Prescription available" is never announced.

**Symptom (Jira):** "TalkBack doesn't read Rx badge on PDP", "Vision Rx badge skipped by screen reader", "Pet Rx badge not announced by TalkBack on product page", "Accessibility badge not focusable on PDP item detail screen".

---

## ✅ The Fix Pattern

### Set `contentDescription` and call `ViewCompat.setScreenReaderFocusable(badge, true)`

```kotlin
// ProductOmniServicesBadgesDelegate.kt

fun productOmniServicesBadgesDelegate(itemViewModel: ItemViewModel) =
    contentAdapterDelegate<Product.OmniServicesBadges, ...> {
        // Pet Rx badge
        with(binding.petRxFlag) {
            if (module.petRxBadge != null) {
                val badgeText = string(module.petRxBadge.textId)
                visibility = View.VISIBLE
                setValues(
                    text = badgeText,
                    type = Tag.TagType.STYLED_TEXT_BLACK,
                    iconResId = module.petRxBadge.iconResId
                        ?: UiProductTileR.drawable.product_tile_shared_long_path_pet_rx_badge,
                    iconTintEnabled = true
                )
                // ✅ Set explicit contentDescription so TalkBack reads the badge text
                //    (not Tag's internal layout structure)
                contentDescription = badgeText

                // ✅ Mark as screen reader focusable so TalkBack traversal includes this badge
                ViewCompat.setScreenReaderFocusable(this, true)
            } else {
                visibility = View.GONE
            }
        }

        // Vision Rx badge
        with(binding.visionRxFlag) {
            if (module.visionCenterBadgeText != null) {
                visibility = View.VISIBLE
                setValues(
                    text = module.visionCenterBadgeText,
                    // ... Tag config ...
                )
                // ✅ Same pattern: contentDescription + screenReaderFocusable
                contentDescription = module.visionCenterBadgeText
                ViewCompat.setScreenReaderFocusable(this, true)
            } else {
                visibility = View.GONE
            }
        }
    }
```

---

### ❌ Bad Code — badge skipped by TalkBack

```kotlin
// ❌ Before fix:
with(binding.petRxFlag) {
    if (module.petRxBadge != null) {
        visibility = View.VISIBLE
        setValues(
            text = string(module.petRxBadge.textId),
            type = Tag.TagType.STYLED_TEXT_BLACK,
            // ...
        )
        // ❌ No contentDescription → TalkBack reads internal Tag layout (may be incomplete)
        // ❌ No ViewCompat.setScreenReaderFocusable(this, true) → TalkBack skips badge entirely
    }
}
// TalkBack: badge is invisible — never announced
```

---

### Why `ViewCompat.setScreenReaderFocusable` is needed

Living Design components like `Tag`, `WcpChip`, and similar decorative-by-default components set `screenReaderFocusable = false` internally because in many contexts they are used as non-interactive visual labels inside a larger focusable card. The parent card's `contentDescription` is expected to include the badge information.

When a badge appears **outside** a composed card container (i.e., as a standalone accessible element on PDP), the parent does not include it in its description. In this case, the badge must be made explicitly screen reader focusable.

```kotlin
// Setting screenReaderFocusable=true makes the view appear in TalkBack's swipe-traversal
// and focus ring even if it has no click listener or keyboard focus.
ViewCompat.setScreenReaderFocusable(this, true)
// Equivalent to: ViewCompat.setAccessibilityDelegate with info.isScreenReaderFocusable = true
```

---

### `contentDescription` on a compound component (`Tag`)

`Tag` is a `ConstraintLayout`-based compound view with internal text and icon children. Setting `contentDescription` on the root `Tag` view:
- Makes TalkBack read the badge as a **single leaf node** with the provided text
- Suppresses TalkBack from traversing into the internal `TextView` and icon children
- Gives precise control over what is announced (badge label only, no icon description)

Without `contentDescription`, TalkBack enters `Tag`'s view hierarchy and may announce internal structure like "Prescription available, Image" (if an icon is present) or just the icon description, depending on the Living Design version.

---

### Verified TalkBack announcements

```
// Before fix:
TalkBack: (badge skipped entirely — never announced)

// After fix:
TalkBack: "Prescription available"    ← pet Rx badge
TalkBack: "Prescription available"    ← vision Rx badge
            (badge is now a stop in the swipe traversal order)
```

---

## 🔑 Key Rules

- **Always call `ViewCompat.setScreenReaderFocusable(badge, true)` on standalone `Tag` / `WcpChip` badges** — Living Design decorative components default to `screenReaderFocusable=false`. Any badge that carries meaningful information the user needs to know must be explicitly opted in.
- **Set `contentDescription` before calling `setScreenReaderFocusable`** — if `contentDescription` is null when the view becomes screen-reader-focusable, TalkBack announces the component's internal text (which may include role suffixes or icon descriptions). Providing an explicit `contentDescription` ensures a clean, controlled announcement.
- **Extract `badgeText` to a local variable** — `val badgeText = string(module.petRxBadge.textId)` used for both `setValues(text = badgeText)` and `contentDescription = badgeText` avoids calling the string resource lookup twice and keeps both in sync.
- **Apply the same pattern to both badge types** — petRxFlag and visionRxFlag have the same accessibility contract. Any new badge type added to `ProductOmniServicesBadgesDelegate` should follow the same `contentDescription` + `setScreenReaderFocusable` setup.
- **Test with TalkBack swipe traversal** — use TalkBack's swipe-right traversal (not touch exploration) to verify the badge appears as a stop in the traversal order. The badge is visible only when `setScreenReaderFocusable(true)` is set; `contentDescription` alone is not enough to make it focusable.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** User interface components must have a name and role that can be programmatically determined. The Pet Rx and Vision Rx badges communicate speciality service availability — information that is material to the purchase decision. Screen reader users who cannot see the badges are unaware that a vision prescription or pet prescription service is available for the product. The badge is visible to sighted users but completely absent from the TalkBack traversal, creating an information gap between sighted and screen reader users.
