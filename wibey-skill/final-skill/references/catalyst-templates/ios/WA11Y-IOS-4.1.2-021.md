# Catalyst Template: Name, Role, Value — Non-Interactive Container Has `.button` Trait; Remove to Prevent False Activation Hint

**Template ID:** `WA11Y-IOS-4.1.2-021`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-021`
**Source Tickets:** SCCP-2640
**Source PRs:** [glass-app #156419](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/156419)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`ProfileHandleInfoCell` displayed a read-only card showing the user's handle and storefront URL. The card container (`cardView`) was set to `accessibilityTraits = .button`, causing VoiceOver to announce it as an interactive element and suggest the user can double-tap to activate it. Double-tapping the card did nothing — there was no action associated with it.

```swift
// ❌ Before fix:
cardView.isAccessibilityElement = true
cardView.accessibilityTraits = .button  // ← implies interactive
// VoiceOver: "Your handle. This cannot be updated., button"
// User double-taps → nothing happens → confusion
```

Additionally, the `accessibilityLabel` was "Your handle. This cannot be updated." — the redundant prefix "Your handle" was already communicated by `accessibilityValue` (the handle text), making the label longer than necessary.

**Symptom (Jira):** "VoiceOver says 'button' for the handle field but tapping does nothing", "Screen reader implies handle can be changed but it cannot", "Read-only field announced as interactive".

---

## ✅ The Fix Pattern

### Remove `.button` trait from non-interactive views; use no trait or `.staticText`

```swift
// ProfileHandleInfoCell.swift

private func configureAccessibility() {
    // The cell is not a single accessibility element; use accessibilityElements for order
    isAccessibilityElement = false
    accessibilityIdentifier = "ProfileHandleInfoCell"

    // titleLabel is a heading (section header)
    titleLabel.accessibilityTraits = [.header, .staticText]

    // cardView is read-only — no .button trait
    cardView.isAccessibilityElement = true
    // ✅ No accessibilityTraits = .button — the view is not interactive
    // Defaults to .none, which does not suggest activatability to VoiceOver

    accessibilityElements = [titleLabel, cardView]
}

private func updateAccessibility(with model: Model) {
    configureAccessibility()
    // ✅ Shorter label: "This cannot be updated." (handle is in accessibilityValue)
    cardView.accessibilityLabel = .localized(.profileHandleNotUpdatable)
    cardView.accessibilityValue = .localized(
        .profileHandleAccessibilityValue(
            userHandle: model.formattedHandle,
            storefrontURL: model.storefrontURL
        )
        // → "@annie-marks. Your storefront URL is walmart.com/storefronts/annie.marks"
    )
}
```

---

### ❌ Bad Code — read-only card with `.button` trait

```swift
// ❌ Before fix:
cardView.isAccessibilityElement = true
cardView.accessibilityTraits = .button  // ← wrong: not interactive
cardView.accessibilityLabel = "Your handle. This cannot be updated."
// ← Redundant: handle text is also in accessibilityValue
// VoiceOver: "Your handle. This cannot be updated., button"
//            (then announces the value) "@annie-marks..."
// → User double-taps → nothing happens
// → VoiceOver's "double-tap to activate" hint is false
```

---

### `accessibilityTraits` and what they communicate

| Trait | Implicit VoiceOver message | Use for |
|---|---|---|
| `.button` | "double tap to activate" | Interactive buttons and triggers |
| `.link` | "double tap to open link" | Navigation links, URLs |
| `.header` | "heading" | Section headers, page titles |
| `.staticText` | (no implicit action hint) | Read-only text content |
| `.image` | "image" | Images with meaning |
| `.selected` | "selected" | Selected state in a collection |
| `.none` / `[]` | (no announcement) | Generic containers |

**Never apply `.button` to a view unless double-tapping it performs a meaningful action.** The `.button` trait causes VoiceOver to say "button" after the label and to offer the "double tap to activate" hint — both of which create false expectations for non-interactive views.

---

### Split `accessibilityLabel` and `accessibilityValue` for display/read-only fields

For read-only display cards that show a field name and its value:

```swift
// ✅ Pattern: label = field description, value = field content
cardView.accessibilityLabel = "This cannot be updated."
// → Role-description only; explains the field's constraint

cardView.accessibilityValue = "@annie-marks. Your storefront URL is walmart.com/storefronts/annie.marks"
// → The actual data the user needs to hear

// VoiceOver announces: "This cannot be updated., @annie-marks. Your storefront URL is..."
// ← Clear separation: description first, content second
```

**Do not duplicate information between label and value.** If the value already includes the handle, the label should not say "Your handle" again.

---

### When `.button` is appropriate on a container view

```swift
// ✅ Container with tap handler:
cardView.isAccessibilityElement = true
cardView.accessibilityTraits = .button
cardView.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(cardTapped)))
// VoiceOver: double-tap hint is accurate — something happens

// ✅ Cell that navigates on tap:
cell.accessibilityTraits = .button  // → pushes detail VC on selection
// VoiceOver: double-tap hint is accurate

// ❌ Container with no interaction:
cardView.isAccessibilityElement = true
cardView.accessibilityTraits = .button  // ← nothing happens on tap
// VoiceOver misleads the user
```

---

## 🔑 Key Rules

- **Never apply `.button` trait to views that have no tap action** — `.button` implies "double tap to activate" to VoiceOver users. A non-interactive view with `.button` trait creates a false promise, leading users to repeatedly double-tap with no result.
- **Use `.staticText` or no trait for read-only display fields** — `.staticText` is appropriate for content areas that display information but cannot be interacted with. Omitting traits entirely (`.none`) is also acceptable.
- **Separate label (description) from value (content)** — for display fields, set `accessibilityLabel` to the field description ("This cannot be updated") and `accessibilityValue` to the field content (the handle and URL). Do not duplicate information between label and value.
- **Audit all views where `accessibilityTraits = .button` was set as a default** — many cell subclasses apply `.button` traits universally as part of a template. Audit these when the cell contains read-only display sections alongside interactive buttons.
- **Test by enabling VoiceOver and double-tapping every element marked `.button`** — if double-tapping produces no action, the trait is wrong.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The role of user interface components must be programmatically determinable. The `.button` accessibility trait communicates the role "button" to VoiceOver. A read-only card marked as `.button` has a role that does not reflect its actual functionality — it cannot be activated. WCAG 4.1.2 requires that the role be accurate. An incorrect role (`.button` on a read-only view) misleads users about the component's purpose and interactivity, forcing them to attempt activation and receive no feedback.

