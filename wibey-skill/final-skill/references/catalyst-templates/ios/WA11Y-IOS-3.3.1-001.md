# Catalyst Template: Error Identification — Error Message Missing "Error:" Prefix in VoiceOver Announcement

**Template ID:** `WA11Y-IOS-3.3.1-001`
**Platform:** iOS
**WCAG Criterion:** 3.3.1 Error Identification
**Jira Label:** `WA11Y-IOS-3.3.1-001`
**Source Tickets:** GPUGC-31644
**Source PRs:** [glass-app #158890](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/158890)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`SimplifiedWarItemDetailsView` displays a rating error row when a user submits a review without selecting a star rating. The error label was accessible to VoiceOver but announced without an "Error:" prefix:

```swift
// ❌ Before fix:
ratingErrorRowStack.accessibilityLabel = String.localized(.ratingRequired)
// → VoiceOver: "Rating required, text"
//    No indication this is an error — same announcement as a hint or description
```

The `.announcement` notification (used to proactively announce the error when VoiceOver is active) also used the same bare string:
```swift
UIAccessibility.post(notification: .screenChanged, argument: String.localized(.ratingRequired))
// → VoiceOver: "Rating required"
// → No "Error:" prefix — user doesn't know this is a validation error
```

Expected:
> **"Error: Rating required"** — with explicit error signal

VoiceOver users see no visual indication of the error color (red) — the "Error:" prefix in the string is the text-based equivalent of the red color, required to communicate error context to screen reader users.

**Symptom (Jira):** "VoiceOver announces 'Rating required' without error context", "Error message in review form not announced as error to VoiceOver users", "ADA: error state not communicated to screen reader on WAR form", "VoiceOver reads error label as hint text instead of error".

---

## ✅ The Fix Pattern

### Include "Error:" prefix using the `textError(description:)` localized string

```swift
// SimplifiedWarItemDetailsView.swift

// ✅ Computed property returns the error label WITH "Error:" prefix
private var ratingErrorAccessibilityText: String {
    String.localized(
        .textError(description: String.localized(.ratingRequired))
    )
    // → "Error: Rating required"
}

// ✅ Applied to the accessibility label
ratingErrorRowStack.accessibilityLabel = ratingErrorAccessibilityText
ratingErrorRowStack.accessibilityTraits = .staticText
elements.append(ratingErrorRowStack)
```

```swift
// SimplifiedWARViewController.swift

// ✅ Post .screenChanged with the "Error:" prefixed string
UIAccessibility.post(
    notification: .screenChanged,
    argument: ratingErrorAccessibilityText
)
// → VoiceOver: "Error: Rating required"
```

---

### `textError(description:)` — the standard error string wrapper

```swift
// LocalizableString (or String extension)

// Pattern: .textError wraps a description string with an "Error:" prefix
String.localized(.textError(description: String.localized(.ratingRequired)))
// → "Error: Rating required"

// String resource:
// "textError" = "Error: {description}";
// or
// "textError" = "Error, {description}";
```

The `.textError(description:)` case is the standard error message wrapper in the Walmart iOS codebase. It should be used for:
- Any form validation error label
- Any `.announcement` notification that communicates an error
- Any `accessibilityLabel` on an error state view (red border, red text, error icon row)

---

### ❌ Bad Code — bare error string without prefix

```swift
// ❌ Before fix:

// In SimplifiedWarItemDetailsView:
ratingErrorRowStack.accessibilityLabel = String.localized(.ratingRequired)
// → "Rating required" — error or hint? VoiceOver can't tell

// In SimplifiedWARViewController:
UIAccessibility.post(notification: .screenChanged, argument: String.localized(.ratingRequired))
// → "Rating required" — no error context

// Also: .screenChanged uses .ratingRequired as argument — a plain String
// UIAccessibility.post(notification:argument:) accepts any AnyObject, including a String
// When argument is a String, VoiceOver announces it as a standalone utterance
// When argument is a UIView, VoiceOver moves cursor to that view
// Using a String here is intentional — no focus change, just announce the error
```

---

### Finding errors by `accessibilityLabel` — use the prefixed string

The view controller finds the error element in the collection view to scroll it into focus:

```swift
// SimplifiedWARViewController.swift

private func firstReviewErrorElement(in collectionView: UICollectionView) -> UIView? {
    // ✅ Build expected label WITH "Error:" prefix — matches ratingErrorAccessibilityText
    let errorLabel = String.localized(
        .textError(description: String.localized(.ratingRequired))
    )
    return collectionView.visibleCells
        .compactMap { ($0 as? TempoSectionCell)?.containerView as? SimplifiedWarItemDetailsView }
        .first?
        .accessibilityElements?
        .compactMap { $0 as? UIView }
        .first(where: { $0.accessibilityLabel == errorLabel })
        // ❌ Before: `.first(where: { $0.accessibilityLabel == String.localized(.ratingRequired) })`
        // After fixing the label to include "Error:", the finder must use the same string
}
```

This highlights an important consistency rule: when `accessibilityLabel` is updated to include an error prefix, all places that search for that view by its `accessibilityLabel` must use the same updated string.

---

### `.screenChanged` vs `.announcement` for error feedback

| Notification | Effect | When to use for errors |
|---|---|---|
| `.screenChanged` | Moves cursor to `argument` (view or string) | After form submission — error appears on same screen, move cursor to it |
| `.announcement` | Speaks `argument` string | Error appears mid-task (inline, not navigation-level) |
| Neither | No VoiceOver feedback | Never for errors — always notify VoiceOver |

In this case, `.screenChanged` with a `String` argument is used — it announces the error string without moving focus to a view, which is appropriate for a WAR (Write a Review) form where the error appears below the submission button.

---

### When "Error:" prefix is required

Apply `String.localized(.textError(description:))` wrapper to:
- `accessibilityLabel` on any red/error-state label or view
- `UIAccessibility.post(notification: .announcement, argument:)` calls that communicate a validation error
- `UIAccessibility.post(notification: .screenChanged, argument:)` calls that announce errors as strings

Do NOT apply to:
- Helper/hint text (not an error — it's guidance)
- Success confirmations ("Added to cart" — positive, no error prefix)
- Warning states that are not blocking errors

---

## 🔑 Key Rules

- **Always prefix error announcements and labels with "Error:"** — `String.localized(.textError(description:))` is the standard wrapper. Use it on any `accessibilityLabel` or `UIAccessibility.post` argument that communicates a validation error or failure state.
- **The "Error:" prefix is the text equivalent of red color** — VoiceOver users do not perceive color. A red error message is communicated solely through the accessible name. Without "Error:", the message is indistinguishable from a hint, description, or placeholder.
- **Update all label-matching code when the label changes** — if `accessibilityLabel` is updated to include a prefix, every call that searches views by `accessibilityLabel` (e.g., `first(where: { $0.accessibilityLabel == ... })`) must be updated to use the same new string.
- **Use `.textError(description:)` consistently** — avoid hardcoding `"Error: "` string prefixes directly. The `.textError` localized string case is the canonical source, enabling translation of the "Error:" word independently of the description.
- **Post the error notification with the same string used for `accessibilityLabel`** — the announcement and the on-screen label should read identically, so users know the announced error and the element they find are the same.

---

## ⚠️ WCAG Failure Without This Fix

- **3.3.1 (Error Identification):** If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text. A bare "Rating required" label meets the "described in text" requirement but fails the "error is identified" requirement — VoiceOver users cannot distinguish it from non-error text. "Error: Rating required" identifies the item as an error (the "Error:" prefix) and describes it (the description). Color alone (red text/icon) is not sufficient — 1.4.1 (Use of Color) further requires that information conveyed by color also be available in another format, which the text prefix provides.
