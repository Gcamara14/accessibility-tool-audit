# Catalyst Template: Status Messages — Dynamically Inserted Alert Text Not Announced by TalkBack (`accessibilityLiveRegion`)

**Template ID:** `WA11Y-AND-4.1.3-008`
**Platform:** Android
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-AND-4.1.3-008`
**Source Tickets:** AMENDS-1546
**Source PRs:** [walmart-glass #135702](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/135702)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

An informational alert `TextView` in the Edit Items screen displays a minimum fee message when the cart value drops below the threshold:

> "To waive the $5.99 below minimum fee, simply add $1.56 of items to this order."

This message is inserted into a `RecyclerView` via an `AdapterDelegate` after the user modifies item quantities. The `TextView` updates its text and becomes visible — but TalkBack **never announces the message**.

Root cause: the `TextView` is not TalkBack's current focus node when the text changes. TalkBack only announces text changes on non-focused views if the view has `accessibilityLiveRegion="polite"` or `"assertive"`. Without a live region, text changes on unfocused views are silently dropped.

**Symptom (Jira):** "TalkBack doesn't announce minimum fee alert when cart changes", "Edit items minimum fee message not read by screen reader", "Alert text on edit items screen silent for TalkBack users", "Status message not announced after item quantity change".

---

## ✅ The Fix Pattern

### Add `android:accessibilityLiveRegion="polite"` to the alert `TextView`

```xml
<!-- amends_edit_items_alert.xml -->

<TextView
    android:id="@+id/edit_items_alert_text"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:accessibilityLiveRegion="polite"
    tools:text="To waive the $5.99 below minimum fee, simply add $1.56 of items to this order." />
```

No Kotlin changes are required — `accessibilityLiveRegion="polite"` in XML is sufficient. When the adapter updates `text` on this `TextView`, the accessibility framework automatically queues the new text for announcement after TalkBack finishes its current utterance.

---

### ❌ Bad Code — no live region

```xml
<!-- ❌ Before fix — no accessibilityLiveRegion attribute -->
<TextView
    android:id="@+id/edit_items_alert_text"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    <!-- ← no android:accessibilityLiveRegion -->
    tools:text="To waive the $5.99 below minimum fee, simply add $1.56 of items to this order." />
<!-- TalkBack: text updates silently — no announcement -->
```

---

### `polite` vs `assertive`

| Value | Behavior | When to use |
|---|---|---|
| `"polite"` | Waits for TalkBack to finish current utterance, then announces | Most status messages, alerts, feedback |
| `"assertive"` | Immediately interrupts TalkBack's current utterance | Critical errors, time-sensitive warnings |
| `"none"` (default) | Never auto-announces text changes | Static content, decorative labels |

The minimum fee alert uses `"polite"` because:
- It is informational (not an error or urgent warning)
- Interrupting the user's current navigation utterance would be disruptive
- The message remains visible on screen; the user can return to it

Use `"assertive"` only for genuine interruptions (e.g., "Your session is about to expire in 30 seconds").

---

### When live region fires

The framework fires a live region announcement when:
1. `android:accessibilityLiveRegion` is set to `"polite"` or `"assertive"`
2. The **text content** of the view changes (via `setText()`)
3. The view is **visible** (`View.VISIBLE`)

It does **not** fire if:
- The view's visibility changes from `GONE` to `VISIBLE` without a text change (combine with an explicit `announceForAccessibility()` call if needed)
- The view's `contentDescription` changes (only `text` triggers live region)
- The view is off-screen or `INVISIBLE`

---

### Live region in RecyclerView adapters

When an alert view is a RecyclerView item managed by an `AdapterDelegate`:

```kotlin
// GlobalErrorAdapterDelegate.kt

class GlobalErrorAdapterDelegate : AdapterDelegate<List<BookslotRecyclerViewItem>> {
    override fun onBindViewHolder(item: BookslotRecyclerViewItem, holder: RecyclerView.ViewHolder) {
        (holder.itemView as? TextView)?.apply {
            text = item.message  // ← live region fires here when text changes
            importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES
            isFocusable = true   // ← also required so TalkBack can discover the item
        }
    }
}
```

When `isFocusable = true` is set alongside `accessibilityLiveRegion="polite"`, TalkBack both:
- **Announces** the text when it changes (live region)
- **Allows direct navigation** to the item via swipe (focusable)

Both attributes are complementary and are typically set together for dynamic alert items.

---

## 🔑 Key Rules

- **`accessibilityLiveRegion="polite"` goes on the `TextView`, not the container** — the framework monitors text changes on the annotated view. If you put it on a parent `ViewGroup`, text changes on children are not automatically relayed. Put the attribute directly on the view whose `.text` property changes.
- **Pair with `isFocusable="true"` for dynamically inserted items** — if the alert is dynamically inserted into a `RecyclerView` at runtime (not present on initial render), TalkBack may not discover it via swipe unless `isFocusable = true` is also set. Live region handles the automatic announcement; `isFocusable` handles manual navigation to it.
- **Use `"polite"`, not `"assertive"`, for informational status messages** — `"assertive"` is for time-critical warnings only. Using it for routine status messages interrupts the user's current TalkBack utterance, which is disruptive.
- **`text` changes trigger live region, not `visibility` changes** — if you make a previously `GONE` view `VISIBLE` without changing its text, no announcement fires. Call `announceForAccessibility(text)` on the view (or on its parent with `view.post { ... }`) if you need to announce an appearance-only change.
- **Test live region with TalkBack active and a real state change** — live region is not captured by `contentDescription` assertions in unit tests. Use an integration test or manual TalkBack test where you change the adapter data and verify TalkBack speaks the new text without requiring focus navigation to the item.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus. The minimum fee alert is a status message — it conveys the current state of the cart (value below threshold) and what action is needed. Without `accessibilityLiveRegion`, the message is presented visually but is not programmatically determinable by TalkBack users unless they happen to navigate to the `TextView` manually. Screen reader users miss the status update entirely.
