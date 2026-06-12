# Catalyst Template: Name, Role, Value — Button Without Product Context Announced Without Item Name

**Template ID:** `WA11Y-IOS-4.1.2-013`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-013`
**Source Tickets:** CEPG-370686
**Source PRs:** [glass-app #158140](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/158140)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`ItemCarouselCell` renders product tiles with an "Options" button (variations, seller options, etc.). When a VoiceOver user focuses the Options button, it announces:

> **"Options, button"** — which product's options?

When a carousel contains multiple product tiles (e.g., 8 items from the same seller), each Options button announces identically. VoiceOver users cannot determine which product's options they are about to open.

Expected:
> **"Options for Fisher-Price Rock-a-Stack, button"** — product name included

**Symptom (Jira):** "VoiceOver says 'Options' without product name on carousel", "Options button not descriptive when multiple items in list", "Screen reader can't tell which product Options button belongs to", "Same VoiceOver label for all Options buttons in item carousel".

---

## ✅ The Fix Pattern

### Inject product name into Options button label

```swift
// ItemCarouselCell.swift

func configure(with model: Model) {
    originalProductTile.configure(with: model.productModel)

    // ✅ Add product name context to Options button if name is available
    if let name = model.productModel.name,
       name.isNotEmpty,
       !model.productModel.isOptionsButtonHidden {
        originalProductTile.setOptionButtonAccessibilityLabel(
            .localized(.optionsForItem(name))
        )
        // → "Options for Fisher-Price Rock-a-Stack"
    }

    // ... remaining configuration ...
}
```

---

### String resource — `optionsForItem`

```swift
// LocalizableString.swift

enum LocalizableString {
    // ✅ Product-contextual Options button label
    /// Options for {name}
    case optionsForItem(String)

    // ...

    func localizedValue(for key: String) -> String {
        // ...
        case .optionsForItem(let name):
            return .localized(
                forKey: key,
                using: .named(key: "name", value: name)
            )
    }
}
```

```
// en.lproj/Localizable.strings
"optionsForItem" = "Options for {name}";
```

---

### ❌ Bad Code — generic "Options" label with no product context

```swift
// ❌ Before fix — no accessibilityLabel override on Options button
func configure(with model: Model) {
    originalProductTile.configure(with: model.productModel)
    // ← originalProductTile.setOptionButtonAccessibilityLabel() never called
    // ← Options button uses default label from GlassProductTile: "Options"
    // VoiceOver: "Options, button" (same for every tile in the carousel)
}
```

---

### VoiceOver comparison for an 8-item carousel

```
Before fix:
  Swipe → "Options, button"   ← item 1 (which item?)
  Swipe → "Options, button"   ← item 2 (same!)
  Swipe → "Options, button"   ← item 3 (same!)
  ...
  VoiceOver user cannot tell which product options to open

After fix:
  Swipe → "Options for Fisher-Price Rock-a-Stack, button"
  Swipe → "Options for LEGO City Police Station, button"
  Swipe → "Options for Melissa & Doug Wooden Puzzle, button"
  ...
  Each button is uniquely identifiable by product name
```

---

### The `setOptionButtonAccessibilityLabel` API

`setOptionButtonAccessibilityLabel` is defined on `GlassProductTile` (a Living Design component):

```swift
// GlassProductTile (Living Design)
func setOptionButtonAccessibilityLabel(_ label: String) {
    optionsButton.accessibilityLabel = label
}
```

The API provides clean encapsulation: the caller provides the full label string; the tile internally applies it to the correct button. Do not access `optionsButton` directly from outside the tile.

---

### Null safety guard

```swift
// ✅ Always guard against nil/empty name before building a contextual label
if let name = model.productModel.name,
   name.isNotEmpty,
   !model.productModel.isOptionsButtonHidden {
    originalProductTile.setOptionButtonAccessibilityLabel(
        .localized(.optionsForItem(name))
    )
}
// If name is nil or empty: the button falls back to the tile's default label ("Options")
// If button is hidden: no label override needed
```

When `name` is `nil` or empty, a label of "Options for " (with no name) would be worse than "Options". The guard ensures the contextual label is only set when a name is available to make it meaningful.

---

### Pattern: product-contextual labels for generic action buttons

This is the same pattern as the Android `StepperViewState.ContentDescriptions` (WA11Y-AND-4.1.2-032) and the Android "Options" button context pattern. Generic action button labels ("Add to cart", "Options", "Remove", "View") become non-descriptive when the same button appears on multiple items in a list.

**Rule:** Any interactive element in a list/grid/carousel whose function applies to a specific item must include that item's name in its `accessibilityLabel` when VoiceOver is the consumer.

Common patterns:
```swift
// Add to cart context
"Add {productName} to cart"

// Options context
"Options for {productName}"

// Remove context
"Remove {productName} from cart"

// Favorite context
"Save {productName} to favorites"
```

---

## 🔑 Key Rules

- **Any action button in a list must include the item's name in its `accessibilityLabel`** — "Options", "Add to cart", "Remove" are meaningless when there are 10 identical announcements in the same screen. Inject the product name so each button is uniquely identifiable.
- **Use the component's designated API** — `setOptionButtonAccessibilityLabel` is defined for exactly this purpose. Do not bypass it by setting `accessibilityLabel` on the tile's internal `optionsButton` directly.
- **Guard against nil/empty product names** — always check `name != nil && name.isNotEmpty` before building a contextual label. A label of "Options for " is not an improvement over "Options".
- **Only set the label when the button is visible** — check `!isOptionsButtonHidden` before calling `setOptionButtonAccessibilityLabel`. Setting a label on a hidden button is a no-op but is a code smell.
- **Test in VoiceOver by swiping through a multi-item carousel** — unit tests can assert the label string, but only device testing with VoiceOver confirms the label is readable at the correct swipe position without double-announcements.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name of user interface components must be programmatically determinable. An "Options" button that does not include the product it applies to has an insufficient accessible name. The name must identify the component's purpose — and the purpose of an Options button is to open options for a specific product. Without the product name, VoiceOver users on a multi-item carousel cannot distinguish which Options button corresponds to which product. All buttons having the same name "Options" means the name is not programmatically determinable in a way that identifies the component's purpose.
