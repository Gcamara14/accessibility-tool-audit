# Catalyst Template: Status Messages — Dynamic Alerts Not Announced by TalkBack

**Template ID:** `WA11Y-AND-4.1.3-001`
**Platform:** Android
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-AND-4.1.3-001`
**Source Tickets:** AMENDS-1546, CEPG-0000
**Source PRs:**
- [walmart-glass (AMENDS-1546)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/) — Minimum fee alert via accessibilityLiveRegion
- [walmart-glass (CEPG-0000)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/) — Add-to-cart success + quantity stepper announcements
**Date Ingested:** 2026-04-30

---

## 🛑 The Problem

Dynamic status updates (fee alerts, quantity changes, success/error messages) appear on screen in response to user actions but TalkBack does **not** announce them because:

1. The message container has no `accessibilityLiveRegion` — TalkBack only reads the view if the user manually swipes to it.
2. The success/status string is placed into a `contentDescription` that is never re-triggered — TalkBack does not re-announce content descriptions that haven't changed programmatically.

**Symptoms (Jira keywords):** "TalkBack doesn't read [alert/message/fee]", "Screen reader users don't know if action succeeded", "Add to cart success not announced."

---

## ✅ Fix Pattern A: `accessibilityLiveRegion="polite"` for Status Alert Views

Use `android:accessibilityLiveRegion="polite"` on any view that shows dynamic status text. When the view's text changes, TalkBack will automatically announce it after the current utterance finishes (polite) or immediately (assertive).

**❌ Bad Code (XML):**
```xml
<!-- WcpAlert appears dynamically but has no live region — TalkBack never reads it -->
<com.walmart.glass.wcp.WcpAlert
    android:id="@+id/minimum_fee_alert"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:visibility="gone" />
```

**✅ Good Code (XML):**
```xml
<!-- Add accessibilityLiveRegion="polite" so TalkBack reads the alert text when it appears -->
<com.walmart.glass.wcp.WcpAlert
    android:id="@+id/minimum_fee_alert"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:visibility="gone"
    android:accessibilityLiveRegion="polite" />
```

**When to use `assertive` vs `polite`:**
| Value | TalkBack Behavior | Use For |
|-------|-------------------|---------|
| `polite` | Reads after current utterance | Fee updates, status alerts, form validation hints |
| `assertive` | Interrupts current utterance | Errors that block submission, critical warnings |

---

## ✅ Fix Pattern B: Announce Action Results (Add to Cart, Stepper Quantity)

For UI interactions where the visual response is a number update or a confirmation message, use `ViewCompat.setAccessibilityDelegate` or announce via `announceForAccessibility()`.

**❌ Bad Code (Kotlin — quantity stepper):**
```kotlin
// Silently updates the quantity text. TalkBack cannot detect the change.
binding.quantityText.text = newQuantity.toString()
```

**✅ Good Code (Kotlin — quantity stepper with announcement):**
```kotlin
binding.quantityText.text = newQuantity.toString()

// Announce the new quantity so TalkBack reads it after the button press.
binding.quantityText.announceForAccessibility(
    context.getString(R.string.quantity_updated_announcement, newQuantity)
)
// e.g. "Quantity: 3"
```

**✅ Good Code (Kotlin — add-to-cart success message via live region):**
```kotlin
// Show the success view (live region triggers automatic announcement)
binding.addToCartSuccessView.apply {
    text = getString(R.string.item_added_to_cart)
    visibility = View.VISIBLE
}
// The XML for addToCartSuccessView has android:accessibilityLiveRegion="polite"
// so TalkBack reads "Item added to your cart" automatically.
```

---

## ✅ Bonus Fix: Remove False "Double Tap to Activate" Hint from Non-Interactive Containers

A non-interactive container (e.g., a `FragmentContainerView` wrapping a `SupportMapFragment`) that has `android:focusable="true"` and `android:clickable="true"` will cause TalkBack to announce "double tap to activate" even though the view is not user-interactive. This is misleading and fails 4.1.2.

**❌ Bad Code (XML):**
```xml
<androidx.fragment.app.FragmentContainerView
    android:id="@+id/map_fragment_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:focusable="true"
    android:clickable="true" />
```

**✅ Good Code (XML):**
```xml
<!-- Remove interactive attributes; mark container as not important for accessibility.
     The SupportMapFragment child manages its own touch events. -->
<androidx.fragment.app.FragmentContainerView
    android:id="@+id/map_fragment_container"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:importantForAccessibility="no" />
```

---

## 🔑 Key Rules

- Add `android:accessibilityLiveRegion="polite"` to **any view** whose text/visibility changes dynamically in response to user actions (quantity updates, fee alerts, success/error banners).
- Use `"assertive"` only for **blocking errors** — it interrupts TalkBack mid-sentence and frustrates users if overused.
- Use `announceForAccessibility(text)` for **one-shot announcements** (e.g., "3 items in cart") that don't have a persistent view to show the text.
- **Never** leave `android:focusable="true"` and `android:clickable="true"` on a view that is not actually interactive — these attributes attach accessibility actions (double tap) that mislead screen reader users.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** Status messages must be programmatically determinable through role or properties such that they can be presented to the user by assistive technologies without receiving focus. TalkBack must be able to announce them without the user having to manually navigate to them.
- **4.1.2 (Name, Role, Value):** A non-interactive element must not expose interactive role hints ("double tap to activate").
