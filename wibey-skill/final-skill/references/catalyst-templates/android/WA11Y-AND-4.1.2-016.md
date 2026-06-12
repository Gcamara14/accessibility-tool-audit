# Catalyst Template: Role — CTA Announced as "Button" When It Navigates Like a "Link" (`info.roleDescription` Override)

**Template ID:** `WA11Y-AND-4.1.2-016`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-016`
**Source Tickets:** CEWMPLUS-148827
**Source PRs:** [walmart-glass #136839](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/136839)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A CTA that **navigates the user to an external page or a deep-link destination** is announced by TalkBack as **"Button"**. This role is misleading — "Button" implies an in-page action (submit, toggle, open a dialog). A CTA that opens a different screen is a **Link**, and TalkBack users use this distinction to decide how to interact with and navigate past elements.

Two opposite failures:

1. **Navigation CTA announced as "Button"** — A list item CTA (e.g., plan activity action, terms link) opens a deep link or external URL but carries the default `WcpButton` role. TalkBack announces "Manage plan, Button" when the user expects "Manage plan, Link".

2. **Popup/dialog CTA announced as "Link"** — The reverse: a CTA that opens an in-page bottom sheet or dialog is incorrectly styled or announced as a link. Users expect link → navigates away; button → stays in screen.

**Symptom (Jira):** "TalkBack says 'Button' for plan link that navigates away", "Terms and Conditions announced as button not link", "Screen reader can't distinguish navigating CTAs from in-page actions", "CTA role doesn't match expected TalkBack behaviour".

---

## ✅ The Fix Pattern

### `AccessibilityDelegateCompat` with `info.roleDescription`

Override `onInitializeAccessibilityNodeInfo` to replace the role TalkBack announces:

```kotlin
/**
 * Lazily-initialised delegate that overrides the role description to "Link".
 * Shared across all call sites — safe because it carries no per-view state.
 *
 * Set this on any CTA that navigates to a new screen / deep-link / external URL.
 * TalkBack will announce: "Manage plan, Link" instead of "Manage plan, Button".
 */
private val linkRoleDelegate: AccessibilityDelegateCompat by lazy {
    val roleText = string(R.string.membership_plan_actions_link_role_text)  // → "Link"
    object : AccessibilityDelegateCompat() {
        override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
            super.onInitializeAccessibilityNodeInfo(host, info)
            info.roleDescription = roleText
        }
    }
}

/**
 * Sets or clears the accessibility delegate on [view] based on [isLink]:
 *   - isLink = true  → role description "Link"   (navigates to new screen / deep-link)
 *   - isLink = false → delegate cleared           (popup / dialog / in-page action → native "Button" role)
 */
fun applyLinkOrButtonRole(view: View, isLink: Boolean) {
    ViewCompat.setAccessibilityDelegate(view, if (isLink) linkRoleDelegate else null)
}
```

```xml
<!-- strings.xml -->
<string name="membership_plan_actions_link_role_text">Link</string>
```

---

### Detecting "link" vs "popup" from the data model

The role is driven by the CTA's `clickThrough.type`:

```kotlin
// CTA whose clickThrough.type is "popup" opens a bottom sheet → "Button" (default role)
// Anything else (deep-link, external URL, internal navigation) → "Link"
const val CLICK_THROUGH_TYPE_POPUP = "popup"

val isLink = cta?.ctaLink?.clickThrough?.type != CLICK_THROUGH_TYPE_POPUP

// Apply the appropriate role to the CTA view:
AccessibilityUtils.applyLinkOrButtonRole(binding.membershipManageYourPlanItemCta, isLink)
```

---

### Full bind-time wiring in RecyclerView adapter

```kotlin
override fun onBindViewHolder(holder: ViewHolder, position: Int) {
    val item = items[position]
    val cta = item.planActivityCTA?.firstOrNull()

    val ctaTitleText = cta?.ctaLink?.title.orEmpty()
    val ctaLinkText  = cta?.ctaLink?.linkText.orEmpty()
    val deepLink     = cta?.ctaLink?.clickThrough?.value

    if (ctaTitleText.isBlank()) {
        // No CTA — hide entirely
        holder.binding.membershipManageYourPlanItemCta.visibility = View.GONE
        holder.binding.membershipManageYourPlanItemCta.setOnClickListener(null)
    } else {
        holder.binding.membershipManageYourPlanItemCta.visibility = View.VISIBLE

        // Visual label is linkText; accessible name is the richer title
        holder.binding.membershipManageYourPlanItemCta.text = ctaLinkText
        holder.binding.membershipManageYourPlanItemCta.contentDescription = ctaTitleText

        holder.binding.membershipManageYourPlanItemCta.setDebouncedOnClickListener {
            deepLink?.let(onDeepLinkClick)
        }

        // ✅ Apply "Link" role for navigation CTAs, default "Button" for popup CTAs
        val isLink = cta?.ctaLink?.clickThrough?.type != CLICK_THROUGH_TYPE_POPUP
        AccessibilityUtils.applyLinkOrButtonRole(
            holder.binding.membershipManageYourPlanItemCta,
            isLink
        )
    }
}
```

---

### What NOT to do

**❌ Hardcode `roleDescription` everywhere — even for in-page actions:**
```kotlin
// Every button now says "Link" — even ones that open dialogs.
// "Sign in, Link" for a sign-in button is wrong: it doesn't navigate.
info.roleDescription = "Link"
```

**❌ Leave all CTAs as default "Button":**
```kotlin
// A CTA that opens walmart.com/help reads as "Get help, Button" — not "Link".
// TalkBack users expect links to navigate; they may skip over "Button" elements
// when looking for navigation actions.
binding.membershipManageYourPlanItemCta.setOnClickListener { openExternalUrl(url) }
// ← No role override → TalkBack: "Manage plan, Button"
```

---

## 🔑 Key Rules

- **Navigation CTAs = Link role; in-page action CTAs = Button role** — the rule: if tapping would cause the user to leave the current screen (deep link, back stack push, external browser), it's a Link. If tapping stays on-screen (dialog, bottom sheet, toggle, form submit), it's a Button.
- **Use `info.roleDescription`, not a string in `contentDescription`** — never append "(link)" to the `contentDescription` string. `roleDescription` is the correct API. TalkBack announces it separately: "Label, Link" not "Label Link".
- **Lazily instantiate the delegate as a singleton** — the `linkRoleDelegate` carries no per-view state. Creating one instance and reusing it across all list items avoids object churn on scroll.
- **`ViewCompat.setAccessibilityDelegate(view, null)` restores the native role** — when a view was previously given a link delegate and now needs to be treated as a button (e.g., after a content update), passing `null` restores the default behavior.
- **String-resource the role text** — `"Link"` must come from a `strings.xml` entry for localization. A Spanish device must announce "Enlace", not the hardcoded English "Link".

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** All user interface components must have a role that can be programmatically determined and that matches the component's actual behaviour. A CTA that navigates the user to a different screen has the semantic role of a link, not a button. Announcing it as "Button" misrepresents the affordance — TalkBack users who use heading and link navigation shortcuts to scan a page will miss navigation CTAs announced as buttons. TalkBack users who tap a "Button" expecting an in-page action will be surprised when the screen changes. The role must truthfully reflect the action.
