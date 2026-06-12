# Catalyst Template: Name, Role, Value — Search Field Has No Accessible Name Without Placeholder; 3-Tier Fallback Pattern (`WCPSearchBar`)

**Template ID:** `WA11Y-IOS-4.1.2-020`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-020`
**Source Tickets:** COMM-1809
**Source PRs:** [glass-app #157623](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/157623)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`WCPSearchBar` is used in contexts where neither a `hint` (placeholder) nor a visual label is configured. In those cases, the underlying `searchTextField` had no `accessibilityLabel`, causing VoiceOver to announce it as generic:

> **"Text Field"** — no field name; user has no idea what to search for

The field's accessible name was derived from whatever `hint` the caller happened to provide (which was sometimes empty), with no fallback to a sensible default.

```swift
// ❌ Before fix — no fallback:
func applyModel() {
    searchTextField.text = model.text
    searchTextField.placeholder = model.hint  // may be nil
    // → If hint is nil, accessibilityLabel is nil → VoiceOver: "Text Field"
}
```

**Symptom (Jira):** "VoiceOver announces search bar as 'Text Field' with no description", "Screen reader doesn't name the search field on category page", "Search bar without placeholder has no accessible name".

---

## ✅ The Fix Pattern

### 3-tier fallback: explicit label → hint/placeholder → localized "Search" default

```swift
// WCPSearchBar.swift  (Living Design component)

extension WCPSearchBar {
    func applyModel() {
        searchTextField.text = model.text

        // ✅ 3-tier accessibility label fallback:
        // Priority 1: Caller-provided explicit accessibilityLabel (most specific)
        // Priority 2: hint/placeholder text (field already uses this as placeholder)
        // Priority 3: localized "Search" (universal fallback — always meaningful)
        if let explicitLabel = model.accessibilityLabel, !explicitLabel.isEmpty {
            searchTextField.accessibilityLabel = explicitLabel
        } else if let hint = model.hint, !hint.isEmpty {
            searchTextField.accessibilityLabel = hint
            // → "Search electronics" (hint doubles as accessible name)
        } else {
            searchTextField.accessibilityLabel = LocalizedString.searchBarDefaultAccessibilityLabel.value
            // → "Search" (the universal action this field performs)
        }

        // ... rest of model application (isCancelVisible, isEnabled, etc.)
    }
}
```

---

### Model protocol extension for backward compatibility

```swift
// WCPSearchBar.swift

public protocol WCPSearchBarModel {
    var text: String? { get set }
    var hint: String? { get set }
    var isCancelVisible: Bool? { get set }
    var isEnabled: Bool? { get set }
    // ✅ New property — default implementation returns nil so existing conformances are not broken
    var accessibilityLabel: String? { get set }
}

extension WCPSearchBarModel {
    /// Default implementation: nil — no behavior change for existing call sites
    public var accessibilityLabel: String? {
        get { nil }
        set { _ = newValue }
    }
}

// WCPSearchBar.Model struct:
public struct Model: WCPSearchBarModel {
    public var text: String?
    public var hint: String?
    public var isCancelVisible: Bool?
    public var isEnabled: Bool?
    public var accessibilityLabel: String?  // ✅ Added

    public init(
        text: String? = "",
        hint: String? = "",
        isCancelVisible: Bool? = false,
        isEnabled: Bool? = true,
        accessibilityLabel: String? = nil  // ✅ Optional, defaults nil
    ) { ... }
}
```

---

### Call site usage

```swift
// ✅ Case 1: Search bar with hint — hint becomes accessible name automatically
let model = WCPSearchBar.Model(hint: "Search electronics")
// VoiceOver: "Search electronics, text field"

// ✅ Case 2: Search bar without hint, but custom context label needed
let model = WCPSearchBar.Model(
    hint: nil,
    accessibilityLabel: "Search within Walmart Plus"  // ← explicit override
)
// VoiceOver: "Search within Walmart Plus, text field"

// ✅ Case 3: Search bar with no hint, no explicit label — falls back to "Search"
let model = WCPSearchBar.Model()
// VoiceOver: "Search, text field" ← universal fallback

// ❌ Do NOT use empty string as no-op:
let model = WCPSearchBar.Model(accessibilityLabel: "")
// → Empty string triggers the hint/default fallback — correct behavior
```

---

### ❌ Bad Code — no fallback

```swift
// ❌ Before fix:
func applyModel() {
    searchTextField.text = model.text
    searchTextField.placeholder = model.hint
    // ← No accessibilityLabel set
    // ← If hint is nil: VoiceOver announces "Text Field" (UIKit default)
    // ← If hint is "": same problem
    // ← No way for callers to provide a purpose-specific label
}
```

---

### The 3-tier fallback priority rationale

| Tier | Value | Rationale |
|---|---|---|
| 1. `accessibilityLabel` | "Search within Health" | Most specific — caller knows the search context |
| 2. `hint` | "Search electronics" | Already describes what the field searches; doubles as label |
| 3. Default | "Search" | Universal — "Search" is always an accurate description of a search field's purpose |

**Never use** the `text` property (current content) as the accessible name — text changes as the user types and as search results update, making the label unstable.

**Never use** an empty string — an empty `accessibilityLabel` is equivalent to nil for VoiceOver announcement purposes. Trim and check before accepting caller-provided labels.

---

### Applying this pattern to other `WCPSearchBarModel` conformances

If your code conforms to `WCPSearchBarModel` or uses `WCPSearchBar.Model`, no changes are required — the protocol default implementation returns `nil`, which falls through to the hint/default tier. To add a context-specific label:

```swift
// Before presenting the search bar in a specific feature context:
var searchBarModel = WCPSearchBar.Model(hint: "")
searchBarModel.accessibilityLabel = LocalizedString.myFeatureSearchBarLabel.value
mySearchBar.model = searchBarModel
```

---

## 🔑 Key Rules

- **Every form field must have an accessible name — provide a fallback** — if the caller doesn't set a label and there's no placeholder, use a localized default. "Text Field" (UIKit's fallback) is never an acceptable accessible name for a purpose-specific input.
- **Use a 3-tier fallback: explicit → placeholder/hint → localized default** — this pattern works for any Living Design input component that may be used without a visible label or placeholder.
- **Use protocol default implementations for backward compatibility** — adding `var accessibilityLabel: String? { get set }` with a default `nil` implementation to an existing protocol does not break existing conformances.
- **Never include "Search" in the tier-1 explicit label if the field already has `.search` accessibility trait** — VoiceOver announces the trait ("Search field") after the label. "Search electronics, Search field" is redundant. Label should be "Electronics" or "Search electronics" depending on screen design.
- **Test all three fallback tiers with unit tests** — assert the `searchTextField.accessibilityLabel` for a model with explicit label, a model with hint only, and a model with neither.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name of user interface components must be programmatically determinable. A search text field that announces only "Text Field" does not have a programmatically determinable name — the generic UIKit role announcement contains no information about what the field searches. VoiceOver users who encounter "Text Field" cannot determine the field's purpose without sighted assistance. The 3-tier fallback pattern ensures there is always a meaningful accessible name regardless of how the caller configures the model.

