# Catalyst Template: Name, Role, Value — `NSTextAttachment` Icon in Attributed String Not Announced by VoiceOver

**Template ID:** `WA11Y-IOS-4.1.2-015`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-015`
**Source Tickets:** CEPG-372694
**Source PRs:** [glass-app #158114](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/158114)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`ManageSubscriptionItemCell` renders a pet name label with a paw icon (🐾) embedded as an `NSTextAttachment` in an attributed string. The cell's `accessibilityLabel` was:

```swift
"For {petName}"  ←  "For Buddy"
```

VoiceOver announced:
> **"For Buddy"** — the paw icon is silently skipped

VoiceOver does not announce `NSTextAttachment` images embedded in `NSAttributedString`. The icon carries semantic meaning — it identifies the element as a pet subscription — but that meaning is completely lost to VoiceOver users.

The fix rewords the string to make the icon's type explicit in text:

> **"Pet, Buddy"** — icon type stated, then pet name

**Symptom (Jira):** "VoiceOver skips paw icon in pet subscription label", "Screen reader reads 'For Buddy' without pet context", "NSTextAttachment icon not announced in subscription cell", "Pet type icon invisible to VoiceOver in Manage Subscription".

---

## ✅ The Fix Pattern

### Include the icon type in the string resource (no code change beyond comment)

```swift
// ManageSubscriptionItemCell.swift

func configureForPet(petName: String) {
    // NSTextAttachment icons are silent to VoiceOver.
    // accessibilityLabel is "Pet, <name>" so the icon type is announced.
    petNameLabel.accessibilityLabel = .localized(.forPetName(petName: petName))
    // → "Pet, Buddy"
    petNameLabel.isHidden = false
}
```

```
// Localizable.strings (all locales)

// ❌ Before: icon type not communicated
"forPetName" = "For {petName}";

// ✅ After: icon type ("Pet") stated before the name
"forPetName" = "Pet, {petName}";
```

---

### ❌ Bad Code — "For {petName}" hides icon meaning

```
// ❌ Before fix:
"forPetName" = "For {petName}";
// → VoiceOver: "For Buddy"
//    The paw icon signals "this is a pet" — completely absent from announcement

// ✅ After fix:
"forPetName" = "Pet, {petName}";
// → VoiceOver: "Pet, Buddy"
//    Announces icon type first, then the pet name
```

---

### Why `NSTextAttachment` icons are silent to VoiceOver

`NSTextAttachment` embeds an image directly in an `NSAttributedString`. UIKit renders it inline with the text but does not surface the image to VoiceOver unless an `accessibilityLabel` is explicitly set on the attachment (which `NSTextAttachment` does not support via UIKit's standard API).

When `UILabel` renders an attributed string containing an `NSTextAttachment`, VoiceOver reads only the text characters — the attachment image is treated as zero-width whitespace. There is no automatic announcement.

**This affects:**
- Emoji-style `NSTextAttachment` (paw icon, star icon, badge icon)
- Custom image attachments in product labels
- Icons embedded in price strings
- Any attributed text where an image carries semantic meaning

---

### The fix approach: include icon context in `accessibilityLabel`

Since `NSTextAttachment` cannot be given its own `accessibilityLabel`, the icon's semantic content must be incorporated into the containing label's `accessibilityLabel`:

```swift
// Pattern: override accessibilityLabel on the UILabel to include icon description

// ✅ Option 1: Pre-pend icon type to the label string
petNameLabel.accessibilityLabel = "Pet, \(petName)"
// → "Pet, Buddy"

// ✅ Option 2: Use a separate localized key that includes the icon description
petNameLabel.accessibilityLabel = .localized(.forPetName(petName: petName))
// where "forPetName" = "Pet, {petName}"

// ✅ Option 3: When multiple icons need describing, describe each:
label.accessibilityLabel = "Star icon, \(ratingText)"
// → "Star icon, 4.5 stars"

// ❌ Option 4: Setting accessibilityLabel on NSTextAttachment directly
// → Not supported by UIKit — accessibilityLabel on NSTextAttachment is not
//    surfaced by UILabel to VoiceOver
```

---

### The icon description convention

The icon description should be stated **before** the associated text content:

```
"Pet, Buddy"          ← icon type first (Pet), then name (Buddy)
"Star icon, 4.5"      ← icon first (Star icon), then value (4.5)
"Warning, price may vary" ← icon first (Warning), then message
```

This mirrors visual reading order where the eye sees the icon before the text, and gives VoiceOver users the context needed to understand what the following text means.

---

### When to apply this pattern

Apply `accessibilityLabel` override to annotate `NSTextAttachment` images when:
- The image communicates type, category, or semantic meaning (paw = pet, star = rating, badge = verified)
- The image is decorative but its absence creates ambiguity (e.g., "Buddy" alone vs. "Pet, Buddy")
- The label contains multiple text attachments (describe each in sequence within the label string)

Do NOT override `accessibilityLabel` for:
- Purely decorative attachment images that carry no meaning (spacer, divider)
- Images already described by adjacent text (e.g., a warning icon next to the word "Warning")

---

### Identifying `NSTextAttachment` usage in code

Search for:
```swift
NSTextAttachment()
NSAttributedString(attachment:)
```

For each attachment, verify:
1. Does the attachment carry semantic meaning?
2. Is an `accessibilityLabel` explicitly set on the containing `UILabel`?
3. Does the label's `accessibilityLabel` include a textual description of the icon?

---

## 🔑 Key Rules

- **`NSTextAttachment` images in `NSAttributedString` are invisible to VoiceOver** — UIKit does not announce image attachments. The icon's semantic meaning must be present in the containing `UILabel`'s `accessibilityLabel`.
- **State the icon type before the associated text** — "Pet, {petName}" announces in the same order as the visual layout (icon before text). This matches the expected VoiceOver reading sequence.
- **Use a localized string for the icon description** — `"forPetName" = "Pet, {petName}"` is translatable. Hardcoding `"Pet, "` in Swift bypasses localization.
- **Apply to all localization files** — `Base.lproj`, `en-US.lproj`, and `en.lproj` must all be updated. Changing only one file leaves other locales with the missing icon description.
- **Audit all labels that use `NSTextAttachment`** — search for `NSTextAttachment()` and `NSAttributedString(attachment:)` in the codebase. For each one, verify the containing label has an `accessibilityLabel` that describes the icon.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name of user interface components must be programmatically determinable. When `NSTextAttachment` is used to embed a meaningful icon in a UILabel's text, the icon is invisible to VoiceOver — its role as a semantic marker (e.g., "this is a pet subscription") is not programmatically determinable. The containing label's `accessibilityLabel` must encode the icon's semantic content in text form so that assistive technologies can determine the full meaning of the label's content.
