# Catalyst Template: Info and Relationships — `Space` Widget Causes TalkBack to Announce "Space" Instead of Parent Card

**Template ID:** `WA11Y-AND-1.3.1-008`
**Platform:** Android
**WCAG Criterion:** 1.3.1 Info and Relationships
**Jira Label:** `WA11Y-AND-1.3.1-008`
**Source Tickets:** CEPG-370225, CEPG-372739
**Source PRs:** [walmart-glass #139943](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139943)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

An `AdjustableCardView` (tempo shared card component) renders a compound layout where all visible content children — heading, subheading, price, CTA button — are marked `android:importantForAccessibility="no"` because the parent view holds the composite `contentDescription`. However, three `Space` elements used as layout spacers were **not** marked.

When TalkBack traverses the card's view tree looking for accessible descendants, it finds:
- All text and button views → `importantForAccessibility="no"` (ignored)
- Three `Space` elements → **no `importantForAccessibility` attribute** (default: auto/yes)

The `Space` elements become the **only accessible descendants**, so TalkBack enters the card hierarchy and announces:
> **"Space"** — for each spacer it finds

The parent card's `contentDescription` (which includes heading, price, and CTA text) is never announced. Users hear "Space" three times and cannot determine what the card contains.

**Affected elements:**
- `view_space_top` — spacing above heading
- `space_subheading` — spacing between subheading and CTA
- `view_space_bottom` — spacing below CTA
- `hero_pov_story_overlay_barrier` — 0dp×0dp `Space` used as a layout constraint anchor

**Symptom (Jira):** "TalkBack announces 'Space' on shop now ad cards", "Farmer's Dog accordion buttons announce 'Space' instead of CTA text", "Price text 'From $5.97' not announced on category page ad", "TalkBack reads Space on adjustable card instead of card content".

---

## ✅ The Fix Pattern

### Add `android:importantForAccessibility="no"` to all `<Space>` elements

```xml
<!-- tempo_shared_internal_adjustable_card.xml -->

<!-- ✅ Fix: mark all Space elements as not important for accessibility -->
<Space
    android:id="@+id/view_space_top"
    android:layout_width="wrap_content"
    android:layout_height="?ld.primitive.scale.space.100"
    android:importantForAccessibility="no"
    app:layout_constraintEnd_toEndOf="@id/adjustable_card"
    app:layout_constraintStart_toStartOf="@id/adjustable_card"
    app:layout_constraintTop_toTopOf="@id/adjustable_card" />

<Space
    android:id="@+id/space_subheading"
    android:layout_width="wrap_content"
    android:layout_height="?ld.primitive.scale.space.100"
    android:importantForAccessibility="no"
    app:layout_constraintBottom_toTopOf="@id/button_primary_cta"
    ... />

<Space
    android:id="@+id/view_space_bottom"
    android:layout_width="wrap_content"
    android:layout_height="?ld.primitive.scale.space.100"
    android:importantForAccessibility="no"
    app:layout_constraintBottom_toBottomOf="@id/adjustable_card"
    ... />
```

```xml
<!-- tempo_shared_internal_hero_pov_story_view.xml -->

<!-- ✅ Defensive fix: 0dp×0dp constraint anchor Space also needs importantForAccessibility="no" -->
<Space
    android:id="@+id/hero_pov_story_overlay_barrier"
    android:layout_width="0dp"
    android:layout_height="0dp"
    android:importantForAccessibility="no"
    ... />
```

---

### ❌ Bad Code — Space elements missing the attribute

```xml
<!-- ❌ Before fix — no importantForAccessibility on Space elements -->
<Space
    android:id="@+id/view_space_top"
    android:layout_width="wrap_content"
    android:layout_height="?ld.primitive.scale.space.100"
    <!-- ← no android:importantForAccessibility attribute -->
    app:layout_constraintEnd_toEndOf="@id/adjustable_card"
    ... />
<!-- TalkBack result: focus enters card → traverses children → finds Space → announces "Space" -->
<!-- Parent contentDescription ("Shop now, From $5.97") is never read -->
```

---

### Why this happens — the "only accessible descendant" trap

TalkBack first asks: "Does this view have accessible descendants?" If yes, it enters the view tree and focuses each accessible child individually. If no, it focuses the view itself and reads its `contentDescription`.

When **all substantive children** (text, buttons) are `importantForAccessibility="no"` but **spacer children** are not:

```
AdjustableCardView  ← has contentDescription: "Living room updates, Shop now, From $5.97"
├── heading_text    ← importantForAccessibility="no"    (correctly suppressed)
├── Space (top)     ← importantForAccessibility="auto"  ← ❌ ACCESSIBLE, has no content
├── subheading_text ← importantForAccessibility="no"    (correctly suppressed)
├── Space (middle)  ← importantForAccessibility="auto"  ← ❌ ACCESSIBLE, has no content
├── button_cta      ← importantForAccessibility="no"    (correctly suppressed)
└── Space (bottom)  ← importantForAccessibility="auto"  ← ❌ ACCESSIBLE, has no content
```

TalkBack: "Yes, this card has accessible descendants" → enters → finds 3 × Space → announces "Space, Space, Space"

After fix:
```
AdjustableCardView  ← contentDescription: "Living room updates, Shop now, From $5.97"
├── heading_text    ← importantForAccessibility="no"
├── Space (top)     ← importantForAccessibility="no"    ✅
├── ...
```

TalkBack: "No accessible descendants" → focuses card itself → announces full `contentDescription`

---

### Zero-size views are also affected

The `hero_pov_story_overlay_barrier` (0dp×0dp) is an extreme case: it has no visible size and is used only as a ConstraintLayout anchor. Despite having zero dimensions, on some API level / Android version combinations it can still appear in the accessibility tree and be announced as "Space". Explicit `importantForAccessibility="no"` eliminates the risk entirely.

---

## 🔑 Key Rules

- **Any `<Space>` element in a compound layout must be `android:importantForAccessibility="no"`** — `Space` is a zero-content view used only for spacing. It has no accessible meaning and should never be focusable by TalkBack. Always add `android:importantForAccessibility="no"` when you add a `<Space>` to any layout.
- **`importantForAccessibility="auto"` (the default) is not safe for spacer views** — "auto" means the platform may decide the view is important based on whether it has content, click listeners, or focus. Spacers have none of these, but the platform's heuristic can still surface them in some API versions.
- **Audit all children when a parent uses a composite `contentDescription`** — if you suppress child views with `importantForAccessibility="no"` to force TalkBack to read the parent's `contentDescription`, you must suppress **all** visible and invisible children, including spacers, barriers, and guide lines. A single unsuppressed child breaks the pattern.
- **ConstraintLayout `Barrier`, `Guideline`, and `Group` views also need this treatment** — these are similar to `Space` (layout-only, no visible content). Apply `importantForAccessibility="no"` to all of them in composite-description layouts.
- **Verify with TalkBack not just `contentDescription`** — setting `contentDescription` on the parent does not prevent TalkBack from reading children. Only the absence of accessible descendants makes TalkBack read the parent. Use Layout Inspector with TalkBack to verify the traversal path.

---

## ⚠️ WCAG Failure Without This Fix

- **1.3.1 (Info and Relationships):** Information, structure, and relationships conveyed through presentation must be programmatically determinable. The `AdjustableCardView` presents a rich composite of heading, price, and CTA — all programmatically assembled in `contentDescription`. When TalkBack is diverted into announcing `Space` elements, this composite information is never delivered. Screen reader users receive no meaningful information from the card: they hear "Space" instead of "Living room updates, Shop now, From $5.97". The relationship between card content and its interactive affordance (CTA) is lost.
