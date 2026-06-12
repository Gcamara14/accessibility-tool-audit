# Catalyst Template: Focus Order — Close Button Focused After Tempo Content in Bottom Sheet (`accessibilityTraversalBefore`)

**Template ID:** `WA11Y-AND-2.4.3-007`
**Platform:** Android
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-AND-2.4.3-007`
**Source Tickets:** CEPG-371074
**Source PRs:** [walmart-glass (internal)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A membership upgrade confirmation bottom sheet (`MembershipUpgradeToAnnualConfirmationBottomSheet`) contains:
- A close (×) button at the top-right corner
- A `ContentLayoutView` that renders Tempo content (dynamically loaded components)

When the bottom sheet opens, TalkBack focus enters the Tempo content area first — despite the close button appearing visually at the top of the sheet before the content. The user must swipe through all of the Tempo-rendered content before reaching the close button.

Expected TalkBack traversal order (matching visual reading order):
> **Close button → Tempo content**

Actual traversal order (without fix):
> **Tempo content → ... → Close button** (last)

Root cause: The Android accessibility framework assigns traversal order based on view position in the XML layout and their bounding-box positions. The `close_button` (`ImageView` at top-right) has a smaller y-coordinate than `content_layout_view` but the framework may use layout order or z-order to determine traversal when there's no explicit constraint. In this case, `close_button` is declared before `content_layout_view` in the layout but the content's bounding box starts at a similar or slightly earlier y position (edge case with constraint anchoring), causing an incorrect traversal order.

**Symptom (Jira):** "TalkBack focus order wrong on membership bottom sheet", "Close button announced last instead of first on upgrade confirmation", "Screen reader must swipe past all content to reach close button", "TalkBack focus doesn't match visual layout on membership upgrade sheet".

---

## ✅ The Fix Pattern

### Add `android:accessibilityTraversalBefore` on the close button

```xml
<!-- membership_upgrade_to_annual_confirmation_bottom_sheet.xml -->

<ImageView
    android:id="@+id/close_button"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:contentDescription="@string/close"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintTop_toTopOf="parent"
    android:accessibilityTraversalBefore="@id/content_layout_view" />
<!--                                       ↑
     Forces TalkBack to focus close_button BEFORE content_layout_view,
     regardless of view hierarchy order or bounding-box position.           -->

<ContentLayoutView
    android:id="@+id/content_layout_view"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:layout_constraintTop_toBottomOf="@id/close_button" />
```

No Kotlin code changes are required. The XML attribute alone is sufficient.

---

### ❌ Bad Code — close button focused last

```xml
<!-- ❌ Before fix — no accessibilityTraversalBefore -->
<ImageView
    android:id="@+id/close_button"
    android:contentDescription="@string/close"
    app:layout_constraintEnd_toEndOf="parent"
    app:layout_constraintTop_toTopOf="parent" />
    <!-- ← no accessibilityTraversalBefore -->

<ContentLayoutView
    android:id="@+id/content_layout_view"
    ... />
<!-- TalkBack traversal: content_layout_view → (all Tempo children) → close_button (last) -->
```

---

### `accessibilityTraversalBefore` vs `accessibilityTraversalAfter`

| Attribute | Meaning | Use when |
|---|---|---|
| `android:accessibilityTraversalBefore="@id/X"` | This view is focused **before** view X | You know the view that should come after |
| `android:accessibilityTraversalAfter="@id/X"` | This view is focused **after** view X | You know the view that should come before |

Both attributes achieve the same result from different anchors. For a close button that must be first:

```xml
<!-- Option A: set traversalBefore on close_button to point at content -->
android:accessibilityTraversalBefore="@id/content_layout_view"

<!-- Option B: set traversalAfter on content to point at close_button — equivalent -->
<!-- (on content_layout_view): android:accessibilityTraversalAfter="@id/close_button" -->
```

Option A (on the close button) is preferred when the target (content) is a dynamic container — it avoids modifying the content view's attributes which may be a shared component.

---

### When to use this pattern

Use `accessibilityTraversalBefore` / `accessibilityTraversalAfter` when:

1. **A control button (close, back, skip) renders at the top of a dynamic content container** — the button must be reached first before the user commits to reading/interacting with content.
2. **Tempo / dynamic content changes traversal order** — `ContentLayoutView` adds children at runtime; the framework may recalculate traversal order after content loads, potentially skipping or reordering the close button.
3. **View bounding boxes do not reliably determine order** — overlapping views, constraint anchors at the same y-level, or floating action buttons break position-based traversal.
4. **A button is at the end of the XML but should be first in traversal** — e.g., a floating "Skip" button added at the bottom of the XML hierarchy but positioned at the top of the screen.

Do NOT use traversal order attributes as a general workaround for poor layout structure. Fix the layout first; use these attributes only when layout constraints alone cannot establish the correct order.

---

## 🔑 Key Rules

- **`@id/content_layout_view` must be a sibling or descendant of a common parent** — `accessibilityTraversalBefore` only works across views in the same window. It does not work cross-fragment or across Activities.
- **The attribute is ignored if the referenced view does not exist** — if `@id/content_layout_view` is not present in the hierarchy when traversal is computed, the attribute is silently ignored and the default order applies. Always verify the referenced ID is present when the bottom sheet is shown.
- **`accessibilityTraversalBefore` has priority over position-based order** — explicitly declared traversal chains take precedence over `android:focusable` order and view bounding box order.
- **Do not create traversal loops** — a cycle (A before B, B before A) causes undefined traversal behavior. Each `accessibilityTraversalBefore` / `After` chain must be a directed acyclic sequence.
- **Verify with TalkBack swipe-right traversal** — use TalkBack swipe-right to step through the bottom sheet and confirm close button is announced first. Testing with keyboard navigation or `requestFocus()` does not verify accessibility traversal order.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation. The close button on a modal bottom sheet has clear precedence: it must be reachable before the user is committed to traversing all content inside the sheet. Placing the close button last in the TalkBack traversal forces users through potentially lengthy Tempo-rendered content before they can dismiss the sheet. This is both a usability failure and a logical sequence failure — sighted users see the close button at the top and can tap it immediately; TalkBack users cannot.
