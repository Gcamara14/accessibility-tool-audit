# Catalyst Template: Name, Role, Value — Status Badge/Tag Component Silent to VoiceOver: Merge Into Adjacent Label

**Template ID:** `WA11Y-IOS-4.1.2-018`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-018`
**Source Tickets:** CSRETPB-94024
**Source PRs:** [glass-app #155997](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/155997)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`SpendPolicyCell` renders a policy row with a `WCPTag` status badge ("Restricted") next to the policy title. `WCPTag` is a Living Design component that does **not synthesize an `accessibilityLabel`** from its internal text content. Setting `WCPTag.isAccessibilityElement = true` makes VoiceOver focus the tag, but it announces nothing — a **silent focus stop**.

```swift
// ❌ Before fix:
if policy.hasRestrictions {
    statusTag.isAccessibilityElement = true
    accessibilityElements = [statusTag, policyTitleLabel, descriptionLabel, linkButton]
}
// VoiceOver traversal:
//   Swipe → (silence) ← statusTag focused but announces nothing
//   Swipe → "Software Development Tools, text"  ← policyTitleLabel
//   Swipe → "Purchases for software tools and licenses", text"
//   Swipe → "View Software Development Tools, button"
// ← User hears no indication the policy is Restricted
```

Expected:
```
VoiceOver: "Restricted, Software Development Tools" (combined into title label)
```

Root cause: `WCPTag` uses internal subviews (a `WCPLabel` or similar) for its text, and those subviews may not be surfaced to VoiceOver when the tag's `isAccessibilityElement = true` makes the tag a leaf node. Leaf nodes announce `contentDescription` / `accessibilityLabel` on themselves — if not explicitly set, the annotation is empty.

**Symptom (Jira):** "VoiceOver focuses 'Restricted' tag silently", "'Restricted' badge not announced to screen reader on Spend Policies", "WCPTag VoiceOver focus produces no announcement", "Status tag focuses but says nothing in VoiceOver".

---

## ✅ The Fix Pattern

### Hide the tag; prefix its text into the adjacent title label

```swift
// SpendPolicyCell.swift

private func configureAccessibility(for policy: SpendPolicy) {
    // ✅ Always hide WCPTag — it cannot synthesize an accessibilityLabel from its text
    statusTag.isAccessibilityElement = false

    if policy.hasRestrictions {
        // ✅ Prefix the title label with the tag's text instead
        let restrictedText = String.localized(.spendApprovalSpendPoliciesRestricted)
        policyTitleLabel.accessibilityLabel = "\(restrictedText), \(policy.label)"
        // → "Restricted, Software Development Tools"
    } else {
        // ✅ Clear any previously set label (important for cell reuse)
        policyTitleLabel.accessibilityLabel = nil
        // → policyTitleLabel falls back to its .text property
    }

    // ✅ Consistent elements array regardless of restriction state
    accessibilityElements = [policyTitleLabel, descriptionLabel, linkButton]
}
```

---

### Cell reuse: clear the label in `prepareForReuse`

```swift
// SpendPolicyCell.swift

override func prepareForReuse() {
    super.prepareForReuse()
    policyTitleLabel.text = nil
    // ✅ Clear the custom accessibilityLabel so it doesn't bleed to the next cell
    policyTitleLabel.accessibilityLabel = nil
    descriptionLabel.text = nil
    currentPolicy = nil
}
```

---

### ❌ Bad Code — tag with `isAccessibilityElement = true` but no accessible text

```swift
// ❌ Before fix:
if policy.hasRestrictions {
    statusTag.isAccessibilityElement = true    // ← tag focused → announces nothing
    accessibilityElements = [
        statusTag,          // silent
        policyTitleLabel,   // "Software Development Tools"
        descriptionLabel,
        linkButton
    ]
} else {
    statusTag.isAccessibilityElement = false
    accessibilityElements = [policyTitleLabel, descriptionLabel, linkButton]
}
// Problem: different element count for restricted vs. unrestricted policies
// → fragile tests (count: 4 vs. 3) and silent focus stop for VoiceOver
```

---

### VoiceOver traversal comparison

```
Before fix (restricted policy):
  Swipe → (silence)                                    ← statusTag — no announcement
  Swipe → "Software Development Tools, text"
  Swipe → "Purchases for software tools..."
  Swipe → "View Software Development Tools, button"

After fix (restricted policy):
  Swipe → "Restricted, Software Development Tools"     ← prefix + title in one label
  Swipe → "Purchases for software tools..."
  Swipe → "View Software Development Tools, button"

After fix (unrestricted policy):
  Swipe → "Software Development Tools"                 ← .text used, no prefix
  Swipe → "Purchases for software tools..."
  Swipe → "View Software Development Tools, button"
```

---

### Why `WCPTag` (and similar badge components) are silent with `isAccessibilityElement = true`

Living Design badge/tag components often have this internal structure:
```
WCPTag (UIView)
└── WCPLabel (UILabel) ← text is here
    text: "Restricted"
```

When `WCPTag.isAccessibilityElement = true`, UIKit treats the WCPTag as a **leaf accessibility node**. It reads `WCPTag.accessibilityLabel` (not set → nil) and announces nothing. The internal `WCPLabel` is no longer traversed because the parent consumed the focus.

When `WCPTag.isAccessibilityElement = false`, UIKit traverses into the WCPTag's subviews — but if `WCPLabel` also has `isAccessibilityElement = false` (or unset), nothing is announced either.

**The only reliable fix**: suppress the tag from VoiceOver entirely and include its text elsewhere in the accessible hierarchy.

---

### Identifying other Living Design components with this pattern

Audit components that have all these properties:
1. A single line of text content
2. Internal `UILabel` or `WCPLabel` subview
3. `isAccessibilityElement` not explicitly set to `true` (defaults to `false` for `UIView`)
4. Used as a status indicator alongside content (badge, tag, pill, chip)

When the component's `isAccessibilityElement = true` produces a silent VoiceOver focus:
1. Set `isAccessibilityElement = false` on the component
2. Merge its text into the adjacent content label's `accessibilityLabel` as a prefix
3. Use a consistent localized string for the merged prefix

---

### The prefix vs. separate element trade-off

| Approach | Pros | Cons |
|---|---|---|
| Prefix in adjacent label | Single focus stop; no silent element | Longer label string; prefix must be cleared on reuse |
| Suppress badge + use `accessibilityValue` on title | Semantic separation of name (title) vs. value (status) | VoiceOver may announce in different order |
| Fix the component internally | Best long-term solution | Requires Living Design team changes |

The prefix approach is the immediate fix. For Living Design components, file an accessibility bug with the component team to add proper `accessibilityLabel` synthesis to `WCPTag` and similar status badges.

---

## 🔑 Key Rules

- **Never rely on `isAccessibilityElement = true` on a Living Design badge/tag without verifying it announces its text** — set `isAccessibilityElement = true`, then use Accessibility Inspector to confirm the component announces its `text` property. Silent focus stops are worse than no focus stop.
- **If a badge/tag is silent: hide it and prefix its text into the adjacent element's `accessibilityLabel`** — the prefix must match what the badge displays. Use the same localized string resource.
- **Always clear `accessibilityLabel` in `prepareForReuse`** — when a label's `accessibilityLabel` has been set programmatically, setting it back to `nil` in `prepareForReuse` ensures the cell reset shows the raw `.text` property instead of a stale override.
- **Keep `accessibilityElements` array consistent regardless of badge state** — a consistent element count avoids logic branches and fragile count assertions in tests.
- **File an issue with the Living Design component team** — the correct long-term fix is for `WCPTag` to synthesize `accessibilityLabel` from its internal text, or to expose it through `accessibilityLabel`. Document the silent-focus bug and link it to the workaround.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name of user interface components must be programmatically determinable. A `WCPTag` that focuses under VoiceOver but has no accessible name fails this criterion — its name is not programmatically determinable. VoiceOver users experience a silent focus stop, which provides no information and interrupts their traversal. Setting `isAccessibilityElement = false` and merging the tag's text into the adjacent label's `accessibilityLabel` ensures the information conveyed by the badge (restriction status) is programmatically determinable through the combined label name.
