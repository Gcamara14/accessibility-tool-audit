# Catalyst Template: Name, Role, Value — Icon/Chevron Button Label Describes Appearance, Not Purpose

**Template ID:** `WA11Y-IOS-4.1.2-017`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-017`
**Source Tickets:** CEPG-370190
**Source PRs:** [glass-app #156324](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/156324)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A right-chevron arrow button on the Walmart Plus section had its `accessibilityLabel` set to a description of the visual appearance of the icon:

```
"walmartplusRightArrowAccessibilityText" = "chevron right arrow";
```

VoiceOver announced:
> **"chevron right arrow, button"** — describes what the icon looks like, not what it does

Expected:
> **"View Walmart Plus details, button"** — describes the action/destination

A VoiceOver user hears "chevron right arrow, button" and has no idea where tapping it leads. The accessible name must communicate the button's **purpose** — what the user can accomplish by activating it — not the visual shape of its icon.

**Symptom (Jira):** "VoiceOver says 'chevron right arrow' for navigation button", "Screen reader reads icon description instead of button purpose", "Arrow button label not descriptive for VoiceOver users", "'chevron' in accessibility label instead of destination or action".

---

## ✅ The Fix Pattern

### Replace visual description with purpose/destination description

```
// Localizable.strings (all locales)

// ❌ Before — describes what the icon looks like
"walmartplusRightArrowAccessibilityText" = "chevron right arrow";

// ✅ After — describes what the button does
"walmartplusRightArrowAccessibilityText" = "View Walmart Plus details";
```

No Swift code changes required — only the string resource values change.

---

### ❌ Bad pattern — icon appearance in `accessibilityLabel`

```swift
// These are all "visual description" labels that fail 4.1.2:

// ❌ Icon appearance (shape/style)
button.accessibilityLabel = "chevron right arrow"
button.accessibilityLabel = "arrow right"
button.accessibilityLabel = "arrow button"
button.accessibilityLabel = "close X"
button.accessibilityLabel = "hamburger menu"
button.accessibilityLabel = "three dots"
button.accessibilityLabel = "magnifying glass"
button.accessibilityLabel = "plus circle"
button.accessibilityLabel = "caret"

// ❌ Internal code identifiers
button.accessibilityLabel = "close_button"     // underscore identifier
button.accessibilityLabel = "ctaButton"        // camelCase code name
button.accessibilityLabel = "back_nav"         // technical identifier
```

---

### ✅ Good pattern — purpose/destination in `accessibilityLabel`

```swift
// ✅ Purpose-first labels:

// Navigation — describe where it goes
button.accessibilityLabel = "View Walmart Plus details"  // ← chevron on W+ card
button.accessibilityLabel = "Go to order details"        // ← arrow on order row
button.accessibilityLabel = "Open help center"           // ← chevron on support row

// Action — describe what it does
button.accessibilityLabel = "Close"                      // ← X button
button.accessibilityLabel = "Open navigation menu"       // ← hamburger
button.accessibilityLabel = "Search"                     // ← magnifying glass button
button.accessibilityLabel = "Add item"                   // ← plus button

// State toggle — describe the action to perform (not current state)
button.accessibilityLabel = "Expand"                     // ← collapsed section chevron
button.accessibilityLabel = "Collapse"                   // ← expanded section chevron

// Confirm the context when multiple similar buttons exist
button.accessibilityLabel = "View Fisher-Price Rock-a-Stack details"  // ← chevron on product card
```

---

### The "purpose test" for icon-only buttons

Before finalizing an `accessibilityLabel` for an icon-only button, ask:

> **"If I heard this label with my eyes closed, would I know what tapping the button does or where it takes me?"**

| Label | Passes the test? | Reason |
|---|---|---|
| `"chevron right arrow"` | ❌ | Describes appearance, not purpose |
| `"View Walmart Plus details"` | ✅ | Describes destination |
| `"close_button"` | ❌ | Code identifier, not a user-facing label |
| `"Close"` | ✅ | Describes action |
| `"arrow"` | ❌ | Visual element name |
| `"Go to cart"` | ✅ | Action + destination |

---

### When to include context (the product/section name)

For icon buttons that appear in lists or alongside content, include the content name if the button is non-unique:

```swift
// ✅ Standalone button (only one on screen) — no context needed
button.accessibilityLabel = "View account details"

// ✅ Button in a list (one per row) — include row context
button.accessibilityLabel = "View \(itemName) details"
// → "View Fisher-Price Rock-a-Stack details"
// → "View LEGO City Police Station details"
```

---

### Internal identifier strings as `accessibilityLabel`

A related failure is setting internal code identifiers as `accessibilityLabel`:

```swift
// ❌ Before — internal string as accessibility label
closeButton.accessibilityLabel = "close_button"
// VoiceOver: "close underscore button, button"

// ✅ After — localized user-facing string
closeButton.accessibilityLabel = .localized(.closeButtonTitle)
// VoiceOver: "Close, button"
```

Search for `accessibilityLabel` values containing underscores (`_`) or camelCase patterns — these are likely to be internal identifiers rather than user-facing strings. All `accessibilityLabel` values must be localized human-readable strings.

---

## 🔑 Key Rules

- **`accessibilityLabel` must describe purpose, not visual appearance** — icon-only buttons must have labels that communicate what activating them does or where they navigate, not what they look like.
- **Never use internal code identifiers as `accessibilityLabel`** — `"close_button"`, `"ctaButton"`, `"back_nav"` are code identifiers. They must never appear in `accessibilityLabel`. Use localized user-facing strings only.
- **Use localized strings for all `accessibilityLabel` values** — `.localized(.closeButtonTitle)` instead of `"Close"` hardcoded in Swift, enabling translation for international markets.
- **Test the "eyes closed" rule** — read the label without seeing the screen. If you cannot determine what the button does from the label alone, it fails.
- **For list row chevrons, include item context** — a row with a right-chevron navigating to item details should announce "View {itemName} details" so VoiceOver users can distinguish between rows. A generic "View details" is insufficient when there are 10 identical chevrons in a list.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name of user interface components must be programmatically determinable. The accessible name (value of `accessibilityLabel`) must identify the component's purpose. "Chevron right arrow" identifies the visual form of the component, not its purpose. A screen reader user who hears "chevron right arrow, button" gains no information about what activating the button accomplishes — the name fails to be programmatically determinable in a way that identifies its purpose. WCAG 2.4.6 further requires that labels or instructions be descriptive; "chevron right arrow" is not descriptive of the component's function.
