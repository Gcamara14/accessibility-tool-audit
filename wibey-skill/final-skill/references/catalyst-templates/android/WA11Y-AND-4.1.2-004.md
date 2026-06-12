# Catalyst Template: Role: Custom Role Description via WalmartAccessibilityCompat

**Template ID:** `WA11Y-AND-4.1.2-004`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-004`
**Source Tickets:** CEPG-362874
**Source PR:** [walmart-glass (CEPG-362874)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/)
**Date Ingested:** 2026-04-30

---

## 🛑 The Problem

A custom view (e.g., an info icon, a styled card, a non-standard button) is used as an interactive element but TalkBack announces a **wrong or missing role**:
- An info icon (`ImageView`) used as a link is announced as "button" or "image" instead of "link".
- A custom card used as a tappable action has no role at all — TalkBack just reads its label.

Without the correct role, screen reader users do not understand what **type** of UI element they are interacting with.

---

## ✅ Fix Pattern A: Set Custom Role Description via `WalmartAccessibilityCompat`

Use Walmart's internal `WalmartAccessibilityCompat.setAccessibilityDelegate` to override `roleDescription` in `onInitializeAccessibilityNodeInfo`.

**❌ Bad Code:**
```kotlin
// Info icon has no explicit role — TalkBack announces "image" or "button" generically.
binding.checkoutOnePayInfoIcon.setOnClickListener { /* open bottom sheet */ }
// ❌ No role description set
```

**✅ Good Code:**
```kotlin
import androidx.core.view.AccessibilityDelegateCompat
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat
import living.design.android.accessibility.WalmartAccessibilityCompat

// Set the role as "link" so TalkBack announces "[label], link"
binding.checkoutOnePayInfoIcon.setupAccessibilityRoleDescription(
    string(R.string.checkout_role_link)  // value: "link"
)

private fun View.setupAccessibilityRoleDescription(role: String) {
    WalmartAccessibilityCompat.setAccessibilityDelegate(
        this,
        object : AccessibilityDelegateCompat() {
            override fun onInitializeAccessibilityNodeInfo(
                host: View,
                info: AccessibilityNodeInfoCompat
            ) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.roleDescription = role
            }
        }
    )
}
```

**String resource:**
```xml
<string name="checkout_role_link">link</string>
```

### When to Override Role Description

| TalkBack Default | Correct Role | Example Use Case |
|-----------------|--------------|-----------------|
| "image" | "link" | Info icon that opens a bottom sheet or URL |
| "button" | "link" | Button styled as a hyperlink |
| "button" | "switch" | Custom toggle control |
| (none) | "heading" | Text styled as section heading |

---

## ✅ Fix Pattern B: Return Focus to a Specific Element After a Bottom Sheet Closes

When a bottom sheet closes, focus often jumps to the top of the screen. To return focus to the element that triggered the sheet, use `sendAccessibilityEvent(TYPE_VIEW_FOCUSED)` with a short delay.

**✅ Good Code:**
```kotlin
private fun requestFocusOnOnePayApplyNowButton() {
    // Use postDelayed to allow the bottom sheet dismiss animation to complete
    // before attempting to set accessibility focus on the target view.
    binding.buyNowRecyclerView.postDelayed({
        binding.buyNowRecyclerView
            .findViewById<View>(R.id.checkout_one_pay_apply_now)
            ?.sendAccessibilityEvent(
                android.view.accessibility.AccessibilityEvent.TYPE_VIEW_FOCUSED
            )
    }, 200L) // 200ms is typically sufficient for sheet dismiss animation
}
```

**Note:** For Navigation Component-based screens, prefer the `NavController.OnDestinationChangedListener` + Fragment Result API approach from `WA11Y-AND-2.4.3-001`, which is more lifecycle-safe than `postDelayed`.

---

## ✅ Fix Pattern C: Mark Non-Interactive View as `clickable="false"`

If a container view has `android:clickable="true"` set but is not actually interactive (e.g., a layout wrapper that passes events to child views), remove the attribute to prevent TalkBack from announcing "double tap to activate."

**❌ Bad Code (XML):**
```xml
<ConstraintLayout
    android:id="@+id/one_pay_loan_container"
    android:clickable="true" />
```

**✅ Good Code (XML):**
```xml
<ConstraintLayout
    android:id="@+id/one_pay_loan_container"
    android:clickable="false" />
```

---

## 🔑 Key Rules

- Use `WalmartAccessibilityCompat.setAccessibilityDelegate` (Walmart-internal API from `living.design.android.accessibility`) instead of the raw `ViewCompat.setAccessibilityDelegate` for consistency with the enterprise accessibility layer.
- `roleDescription` overrides the **default Android role** (e.g., "Button") with a custom localized string — ensure the string is translated.
- Use a `200–500ms` delay in `postDelayed` for focus restoration after bottom sheet dismiss to allow the dismiss animation to complete.
- **Never** set `android:clickable="true"` on a view that the user cannot interact with — this falsely signals an action to TalkBack users.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The role of user interface components must be programmatically determinable. TalkBack announcing "image" for a tappable link, or "button" for a non-interactive container, fails this criterion.
