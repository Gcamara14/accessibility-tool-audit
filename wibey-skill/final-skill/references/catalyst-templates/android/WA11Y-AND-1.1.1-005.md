# Catalyst Template: Alt Text — Layout Structural Elements Announced by TalkBack ("Space", "Barrier")

**Template ID:** `WA11Y-AND-1.1.1-005`
**Platform:** Android
**WCAG Criterion:** 1.1.1 Non-text Content
**Jira Label:** `WA11Y-AND-1.1.1-005`
**Source Tickets:** CEPG-370225, CEPG-372739, CRUISE-16644
**Source PRs:** [walmart-glass #139943](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139943), [walmart-glass #123121](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/123121)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

TalkBack announces **"Space"** (or "Barrier" / "Guideline") when a card or container view has a `contentDescription` set on the parent but its visible text/button children are all marked `importantForAccessibility="no"`. The **layout structural elements** (`Space`, `Barrier`, `Guideline`) used for positioning in `ConstraintLayout` are inadvertently left as the **only accessible descendants** — so TalkBack traverses into the card, finds these invisible structural nodes, and announces their class name.

Root cause: when a developer correctly suppresses all content children so the parent card's `contentDescription` is read as one group, they often miss the structural layout elements that do not carry content but are technically accessible.

**Symptom (Jira):** "TalkBack announces 'Space' when focusing the card", "Screen reader says 'Space, button' instead of the card description", "W+ logo announced as 'space heading'", "Tapping card reads 'Space' rather than product name".

---

## ✅ The Fix Pattern

### Mark all `Space` / `Barrier` / `Guideline` elements with `importantForAccessibility="no"`

**❌ Bad Code:**
```xml
<!-- AdjustableCard — text and button children are suppressed, but Space elements
     are left accessible. TalkBack finds them as the only accessible descendants
     and announces "Space" when the card is focused. -->
<ConstraintLayout
    android:id="@+id/adjustable_card"
    android:importantForAccessibility="yes"
    android:contentDescription="@string/card_description">

    <TextView
        android:importantForAccessibility="no"  <!-- ✅ suppressed -->
        android:text="@string/card_title" ... />

    <Button
        android:importantForAccessibility="no"  <!-- ✅ suppressed -->
        android:text="@string/cta_label" ... />

    <!-- ❌ Space elements NOT suppressed — TalkBack reads these as "Space" -->
    <Space
        android:id="@+id/space_top"
        app:layout_constraintTop_toTopOf="@id/adjustable_card" ... />

    <Space
        android:id="@+id/space_middle"
        app:layout_constraintBottom_toTopOf="@id/button_primary_cta" ... />

    <Space
        android:id="@+id/space_bottom"
        app:layout_constraintBottom_toBottomOf="@id/adjustable_card" ... />
</ConstraintLayout>
```

**✅ Good Code:**
```xml
<!-- Suppress ALL structural layout elements — Space, Barrier, and Guideline
     are invisible to users and must never be read by TalkBack. -->
<ConstraintLayout
    android:id="@+id/adjustable_card"
    android:importantForAccessibility="yes"
    android:contentDescription="@string/card_description">

    <TextView
        android:importantForAccessibility="no"
        android:text="@string/card_title" ... />

    <Button
        android:importantForAccessibility="no"
        android:text="@string/cta_label" ... />

    <!-- ✅ Space elements suppressed -->
    <Space
        android:id="@+id/space_top"
        android:importantForAccessibility="no"
        app:layout_constraintTop_toTopOf="@id/adjustable_card" ... />

    <Space
        android:id="@+id/space_middle"
        android:importantForAccessibility="no"
        app:layout_constraintBottom_toTopOf="@id/button_primary_cta" ... />

    <Space
        android:id="@+id/space_bottom"
        android:importantForAccessibility="no"
        app:layout_constraintBottom_toBottomOf="@id/adjustable_card" ... />
</ConstraintLayout>
```

---

### Other structural elements to suppress

The same rule applies to all ConstraintLayout structural helpers:

```xml
<!-- ✅ Barrier -->
<androidx.constraintlayout.widget.Barrier
    android:id="@+id/barrier_vertical"
    android:importantForAccessibility="no"
    app:barrierDirection="end"
    app:constraint_referenced_ids="icon, label" />

<!-- ✅ Guideline -->
<androidx.constraintlayout.widget.Guideline
    android:id="@+id/guideline_vertical_span_one"
    android:importantForAccessibility="no"
    app:layout_constraintGuide_percent="0.33" />

<!-- ✅ View used purely as a divider/spacer -->
<View
    android:id="@+id/divider_spacer"
    android:importantForAccessibility="no"
    android:layout_width="1dp"
    android:layout_height="match_parent"
    android:background="@color/divider" />
```

---

### Diagnosis: how "Space" announces happen

TalkBack only traverses into a container's children when it cannot find a `contentDescription` on the parent **or** when the parent is not `importantForAccessibility="yes"`. Once the parent has a `contentDescription`, TalkBack should announce it and stop — unless there are still accessible descendants "leaking through":

```
Card (contentDescription="Product X, $12.99, Add to cart")
 ├─ TextView (importantForAccessibility=no) → suppressed ✓
 ├─ Button (importantForAccessibility=no) → suppressed ✓
 └─ Space (NO importantForAccessibility set) → accessible! ← TalkBack reads this
```

Result: TalkBack focuses the card, tries to read the contentDescription, but the accessibility framework finds an accessible descendant (Space) and prefers to traverse into it, announcing "Space" instead.

---

## 🔑 Key Rules

- **Every `Space`, `Barrier`, and `Guideline` in a ConstraintLayout must have `android:importantForAccessibility="no"`** — they carry no content and should never appear in the accessibility tree.
- **When suppressing children so a parent reads as one group, audit ALL descendants** — not just the visible content children. Search the layout XML for `<Space`, `<Barrier`, `<Guideline`, and any `<View>` used as a divider/separator, and suppress all of them.
- **The "last accessible descendant" rule** — when all visible content children are suppressed but one structural element remains accessible, TalkBack will traverse to it. The fix is always to suppress the structural element, never to un-suppress the content children.
- **Use `importantForAccessibility="no"` (not `"noHideDescendants"`)** — `noHideDescendants` would suppress the entire subtree including the parent card's own accessibility node. Use `"no"` on each structural element individually.
- **Include these suppressions in the component template/default XML** — `Space` and `Barrier` elements in reusable templates should have `importantForAccessibility="no"` by default. Retrofitting it per-ticket is a recurring source of bugs.

---

## ⚠️ WCAG Failure Without This Fix

- **1.1.1 (Non-text Content):** All non-text content presented to the user must have a text alternative that serves an equivalent purpose, or be implemented in a way that it can be ignored by assistive technology. Layout structural elements (`Space`, `Barrier`, `Guideline`) carry no content meaning and must be hidden from assistive technologies. A `Space` widget that TalkBack reads as "Space" is the opposite of a text alternative — it provides meaningless noise that disrupts navigation and obscures the actual card content.
