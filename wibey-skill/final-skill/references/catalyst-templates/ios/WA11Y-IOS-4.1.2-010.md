# Catalyst Template: Name, Role, Value — Literal "button" in `accessibilityValue` String Causes VoiceOver Double-Announcement

**Template ID:** `WA11Y-IOS-4.1.2-010`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-010`
**Source Tickets:** ISVS-1100
**Source PRs:** [glass-app #145371](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/145371)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`StoreMapPOITitleView` renders an expand/collapse button showing a store's operational status (e.g., "Open until 10pm, expanded"). The button's accessibility value string was built from a localized string template that included the literal word "button":

```
"poiStatusAccessibilityValue" = "{status} {operationalHour}, button {buttonState}";
```

Because the view is an `expandButton` with `accessibilityTraits = .button`, VoiceOver automatically appends the role "button" to its announcement. The result:

> **VoiceOver announces:** "Open until 10pm, button expanded, button"
>   — "button" appears twice: once from the string, once from the trait

Expected announcement:
> **"Open until 10pm, expanded, button"** — status, state, role (once)

The same issue affected the temporary hours variant:
```
Before: "{status} {operationalHour}, button {buttonState}, {holidayTitle} available"
```

**Symptom (Jira):** "VoiceOver says 'button' twice on store map POI", "Screen reader announces role twice on store hours expand button", "Double 'button' announcement on Store Maps POI title", "'button button' in TalkBack/VoiceOver for operational status button".

---

## ✅ The Fix Pattern

### Remove literal "button" from the localized string template

```swift
// Localizable.strings (Base, en-US, en)

// ❌ Before — "button" hardcoded in the string
"poiStatusAccessibilityValue" = "{status} {operationalHour}, button {buttonState}";
"poiStatusTemporaryHoursAccessibilityValue" = "{status} {operationalHour}, button {buttonState}, {holidayTitle} available";

// ✅ After — role is announced by accessibilityTraits, not the string
"poiStatus" = "{status} {operationalHour}, {buttonState}";
"poiStatusTemporaryHours" = "{status} {operationalHour}, {holidayTitle} available, {buttonState}";
```

---

### `LocalizedString` enum — rename case, remove "button" from parameters

```swift
// LocalizedString.swift (StoreMaps)

enum LocalizedString {
    // ❌ Before:
    /// {status} {operationalHour}, button {buttonState}
    case poiStatusAccessibilityValue(status: String, operationalHour: String, buttonState: String)

    /// {status} {operationalHour}, button {buttonState}, {holidayTitle} available
    case poiStatusTemporaryHoursAccessibilityValue(
        status: String,
        operationalHour: String,
        buttonState: String,
        holidayTitle: String
    )

    // ✅ After:
    /// {status} {operationalHour}, {buttonState}
    case poiStatus(status: String, operationalHour: String, buttonState: String)

    /// {status} {operationalHour}, {holidayTitle} available, {buttonState}
    case poiStatusTemporaryHours(status: String, operationalHour: String, holidayTitle: String, buttonState: String)
}
```

---

### Call site — `getExpandButtonAccessibilityString()`

```swift
// StoreMapPOITitleView.swift

private func getExpandButtonAccessibilityString() -> String {
    let buttonState = (isExpanded ?? false) ?
        LocalizedString.expanded.localizedString() : LocalizedString.collapsed.localizedString()
    let status = model.currentState.statusDisplayValue
    let hour = operationalHour.text ?? ""

    if let holidays = model.holidayHours?.holidayHours,
       !holidays.isEmpty,
       model.isPOITemporaryHoursEnabled {
        // ✅ Uses renamed case — no "button" in string
        return LocalizedString.poiStatusTemporaryHours(
            status: status,
            operationalHour: hour,
            holidayTitle: model.holidayHours?.holidayTitle ?? "",
            buttonState: buttonState
        )
        .localizedString()
        // → "Open until 10pm, Holiday Hours available, expanded"
    }

    // ✅ Uses renamed case — no "button" in string
    return LocalizedString.poiStatus(
        status: status,
        operationalHour: hour,
        buttonState: buttonState
    )
    .localizedString()
    // → "Open until 10pm, expanded"
}

private func configureAccessibility() {
    expandButton.accessibilityTraits = .button
    // ← VoiceOver appends "button" from trait automatically
    // ← Final: "Open until 10pm, expanded, button"
}
```

---

### Holiday hours parameter order fix

The renamed `poiStatusTemporaryHours` case also corrects the parameter order so `{holidayTitle}` appears before `{buttonState}` in the announcement:

```
Before: "{status} {operationalHour}, button {buttonState}, {holidayTitle} available"
→ "Open, button expanded, Holiday Hours available"   ← state before holiday info

After:  "{status} {operationalHour}, {holidayTitle} available, {buttonState}"
→ "Open, Holiday Hours available, expanded"          ← info before state, no "button"
```

This follows natural reading order: the descriptive information (`holidayTitle`) is announced before the interactive state (`buttonState`).

---

### VoiceOver announcement comparison

```
// Standard POI button:

Before fix:
VoiceOver: "Open until 10pm, button expanded, button"
                              ^^^^^^^^^^^^^^^^^^^^^^
                              "button" in string  +  trait = "button" twice

After fix:
VoiceOver: "Open until 10pm, expanded, button"
                                       ^^^^^^
                                       role from accessibilityTraits = .button only

// Temporary hours POI button:

Before fix:
VoiceOver: "Open until 6pm, button expanded, Holiday Hours available, button"

After fix:
VoiceOver: "Open until 6pm, Holiday Hours available, expanded, button"
```

---

### The role double-announcement pattern — other elements to audit

The same issue can occur on any `UIButton`, `UIControl`, or custom view with `accessibilityTraits` that include a role:

| Trait | Role VoiceOver appends automatically |
|---|---|
| `.button` | "button" |
| `.link` | "link" |
| `.image` | "image" |
| `.header` | "heading" |
| `.adjustable` | "adjustable" |

**Rule:** never include the role word in an `accessibilityLabel`, `accessibilityValue`, or string template that will be set on an element with a matching `accessibilityTrait`. VoiceOver always appends the trait's role — the string must not duplicate it.

---

## 🔑 Key Rules

- **Never include the role word ("button", "link", "image") in `accessibilityLabel` or `accessibilityValue` strings** — VoiceOver appends the role from `accessibilityTraits` automatically. Hardcoding the role in the string produces a double-announcement ("button button").
- **Rename the localized string key when removing the role word** — renaming from `poiStatusAccessibilityValue` to `poiStatus` documents the intent change and prevents future contributors from re-adding "button" (the old name implied it was an "accessibility value" string that might need a role).
- **Audit string templates with `{buttonState}` placeholders** — any template with a placeholder like `{buttonState}`, `{expanded}`, or `{collapsed}` should be checked for adjacent role literals that will double-announce.
- **Apply to all localization files** — `Base.lproj`, `en.lproj`, `en-US.lproj`, and any other locale bundles. Changing only one file leaves other locales with the double-announcement.
- **The fix is in the string resource, not the code** — no Swift code changes are required to remove "button" from the announcement. String resources are the correct layer for this fix, keeping the code clean.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name, role, and value of user interface components must be programmatically determinable. Announcing "button" twice in a single control's VoiceOver output is an incorrect programmatic representation of the control's role. The role must be determinable exactly once. A double "button" announcement causes confusion — users may interpret it as a nested button or a structural artifact, and it degrades the overall quality of screen reader output. The role must be conveyed through `accessibilityTraits`, not duplicated in the accessible name or value string.
