# Catalyst Template: Role — Link Role is Missing (Interactive Element Opens External URL)

**Template ID:** `WA11Y-AND-4.1.2-005`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-005`
**Source Tickets:** CRUISE-6434
**Source PR:** [walmart-glass #47425](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/47425)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A `Button`, `TextView`, or custom view that opens an external URL, terms page, or web view is announced by TalkBack as **"button"** (or with no role at all), not as **"link"**. Screen-reader users expect link-like behavior from elements that navigate to an external destination, and the button role implies a self-contained action that happens in-app.

Conversely, a link-styled `TextView` with a `ClickableSpan` that performs an in-app action may be announced as "link" when it should be "button".

**Symptom (Jira):** "Subscription program details link is announced as Button", "Terms of Use link has wrong role", "Privacy Policy element reads as button, not link", "TalkBack links menu shows nothing for [link name]", "Element opens browser but role says 'button'".

---

## ✅ The Fix Pattern

### Scenario A: `Button` / styled `View` that opens external URL — set role to "link"

In Walmart Android, use `WalmartAccessibilityCompat.setAccessibilityDelegate` to override the `roleDescription` via `onInitializeAccessibilityNodeInfo`.

**❌ Bad Code:**
```kotlin
// A button that opens subscription program details page in a web view.
// TalkBack announces: "Subscription program details, button"
binding.subscribeNowPetrxSubscriptionConsentProgramDetailsButton.setOnClickListener {
    launchWebView(subscriptionProgramDetailsUrl)
}
// ← No role override — TalkBack uses "button" (the default for a Button view)
```

**✅ Good Code:**
```kotlin
// Override the role so TalkBack announces: "Subscription program details, link"
binding.subscribeNowPetrxSubscriptionConsentProgramDetailsButton.setOnClickListener {
    launchWebView(subscriptionProgramDetailsUrl)
}
AccessibilityUtils.setAccessibilityRoleAsLink(
    binding.subscribeNowPetrxSubscriptionConsentProgramDetailsButton
)
```

**`setAccessibilityRoleAsLink` implementation** (reusable utility):
```kotlin
object AccessibilityUtils {
    fun setAccessibilityRoleAsLink(view: View) {
        WalmartAccessibilityCompat.setAccessibilityDelegate(
            view,
            accessibilityRoleAs(string(R.string.subscriptions_link_accessibility_role))
            // strings.xml: <string name="subscriptions_link_accessibility_role">link</string>
        )
    }

    private fun accessibilityRoleAs(roleDescription: String) = object : AccessibilityDelegateCompat() {
        override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
            super.onInitializeAccessibilityNodeInfo(host, info)
            info.roleDescription = roleDescription  // Sets "link" in TalkBack announcement
        }
    }
}
```

**Key imports:**
```kotlin
import androidx.core.view.AccessibilityDelegateCompat
import androidx.core.view.accessibility.AccessibilityNodeInfoCompat
import living.design.android.accessibility.WalmartAccessibilityCompat
```

---

### Scenario B: `TextView` with `ClickableSpan` — use `URLSpan` for automatic link role

When link text is set via `SpannableString`, use `URLSpan` (or a subclass) instead of a plain `ClickableSpan`. TalkBack automatically announces `URLSpan` nodes with "link" role.

**❌ Bad Code:**
```kotlin
// ClickableSpan has no semantic role — TalkBack does not say "link"
val spannable = SpannableString("Privacy Policy")
spannable.setSpan(
    object : ClickableSpan() {
        override fun onClick(widget: View) { launchPrivacyPolicy() }
    },
    0, spannable.length,
    Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
)
textView.text = spannable
```

**✅ Good Code:**
```kotlin
// URLSpan triggers automatic "link" role announcement in TalkBack
val spannable = SpannableString("Privacy Policy")
spannable.setSpan(
    object : URLSpan("") {
        override fun onClick(widget: View) { launchPrivacyPolicy() }
    },
    0, spannable.length,
    Spanned.SPAN_EXCLUSIVE_EXCLUSIVE
)
textView.text = spannable
textView.movementMethod = LinkMovementMethod.getInstance()  // Required to enable span clicks
```

---

### Scenario C: `android:autoLink="web"` for inline URL text

When a `TextView` contains a raw URL and should be clickable (no custom behavior needed), `android:autoLink="web"` automatically creates `URLSpan`s recognized as links by TalkBack.

```xml
<TextView
    android:id="@+id/terms_url_text"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:autoLink="web"
    android:text="@string/terms_url" />
<!-- strings.xml: <string name="terms_url">https://www.walmart.com/help/terms</string> -->
```

---

### Scenario D: Role confusion — "link" element that should be "button"

If a link-styled element performs an in-app action (not navigation to URL), it should announce as "button":

```kotlin
// "Cancel" styled as a link visually but it closes a dialog (in-app action)
AccessibilityUtils.setAccessibilityRoleAsButton(binding.cancelLinkButton)

// Implementation (same pattern as setAccessibilityRoleAsLink):
fun setAccessibilityRoleAsButton(view: View) {
    WalmartAccessibilityCompat.setAccessibilityDelegate(
        view,
        accessibilityRoleAs(string(R.string.subscriptions_button_accessibility_role))
        // strings.xml: <string name="subscriptions_button_accessibility_role">button</string>
    )
}
```

---

## 🔑 Key Rules

- **External URL navigation = link role.** Anything that opens a browser, web view, or leaves the current flow to view content elsewhere should announce as "link".
- **In-app action = button role.** Anything that triggers a state change, form submission, or in-app navigation should announce as "button". Do not mark these as links even if they are visually underlined.
- **`URLSpan` > `ClickableSpan`** — whenever building clickable spans that represent navigable links, extend `URLSpan` instead of `ClickableSpan`. TalkBack recognizes `URLSpan` as a link automatically; plain `ClickableSpan` has no role.
- **`android:autoLink="web"`** is only appropriate for raw URL strings that should be tappable. Do not use it for styled call-to-action text that needs custom click behavior.
- **TalkBack Links menu** — setting `info.roleDescription = "link"` also makes the element appear in TalkBack's on-screen links menu (three-finger tap → Links), improving discoverability.
- **String resources for role descriptions** — store role strings ("link", "button") in `strings.xml` so they can be localized. Do not hardcode `"link"` or `"button"` as literals in `info.roleDescription`.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The role of every user interface component must be programmatically determinable. A `Button` that navigates to an external URL has an incorrect default role of "button" — the actual role is "link". Screen-reader users can't predict whether activating the element will stay in-app or navigate away, violating the requirement that role be available programmatically.
