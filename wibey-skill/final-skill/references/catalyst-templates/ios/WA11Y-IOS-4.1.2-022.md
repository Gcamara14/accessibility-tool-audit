# Catalyst Template: Name, Role, Value — `setupAccessibility()` Called in `constructView()` Before Model Data Is Set; Move to `applyModel()`

**Template ID:** `WA11Y-IOS-4.1.2-022`
**Platform:** iOS
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-IOS-4.1.2-022`
**Source Tickets:** CEPG-342785
**Source PRs:** [glass-app #142739](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/142739)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`InformativeBannerView` has a lifecycle pattern common to many `BaseView` subclasses:
- `constructView()` — called once at initialization to set up the view structure
- `applyModel()` — called whenever `model` is set

`setupAccessibility()` was called inside `constructView()` — before any model had been set. The accessibility configuration code referenced `detailsLabel.text`, which was `nil` at construction time. The result: `accessibilityLabel` was set to an empty string or nil, and remained stale forever because `setupAccessibility()` was never called again when the model arrived.

```swift
// ❌ Before fix:
public override func constructView() {
    super.constructView()
    setupAccessibility()  // ← Called before model is set
    // detailsLabel.text = nil at this point
    // accessibilityLabel = nil forever
}

public override var model: Model? {
    didSet { applyModel() }
}

private func applyModel() {
    guard let model else { return }
    detailsLabel.text = model.type.detailsText
    // ← setupAccessibility() never called here — stale nil label persists
}
```

**Symptom (Jira):** "VoiceOver announces banner with incorrect/empty text", "Screen reader reads wrong text for informative banner", "Banner accessible label doesn't match visible text".

---

## ✅ The Fix Pattern

### Move `setupAccessibility()` to `applyModel()` — where model data is available

```swift
// InformativeBannerView.swift

public override func constructView() {
    super.constructView()
    backgroundColor = LDColor.blue10.uiColor
    roundCorners(corners: .allCorners, radius: LDSpacing.space8)
    // ✅ Do NOT call setupAccessibility() here — model is not set yet
}

public override var model: Model? {
    didSet { applyModel() }
}

private func applyModel() {
    guard let model else { return }
    detailsLabel.text = model.type.detailsText
    // ✅ Configure accessibility AFTER data is applied
    setupAccessibility()
}

private func setupAccessibility() {
    // ✅ Now detailsLabel.text has the correct value
    isAccessibilityElement = true
    accessibilityLabel = detailsLabel.text
    accessibilityTraits = .staticText
}
```

---

### ❌ Bad Code — accessibility setup before model data

```swift
// ❌ constructView() pattern — runs before model:
public override func constructView() {
    super.constructView()
    setupAccessibility()
    // → detailsLabel.text = nil
    // → accessibilityLabel = nil
    // → remains nil even after model is set
}

// ❌ Attempting to set accessibility in init() with a model parameter:
init(model: Model) {
    super.init()
    self.model = model
    constructView()          // ← view hierarchy not yet set up in init
    setupAccessibility()     // ← may reference subviews not yet added
}
```

---

### The `BaseView` construction lifecycle

```
1. init / init(frame:)                    ← called first
2. constructView() override               ← add subviews, configure static properties
3. constructSubviewHierarchy() override   ← add subviews to hierarchy
4. constructSubviewLayoutConstraints()    ← apply Auto Layout
                                           ↑ NO model data is available above this line
5. model = Model(...)                     ← model is set externally by caller
6. applyModel() called via didSet         ← safe to access model data here
```

`setupAccessibility()` should go in step 6 if it depends on model data. It belongs in step 2 only if it configures **static** accessibility properties that don't depend on model data (e.g., fixed traits, identifiers).

---

### Splitting accessibility setup: static vs. model-dependent

```swift
public override func constructView() {
    super.constructView()
    // ✅ Static accessibility: these don't depend on model data
    accessibilityIdentifier = "InformativeBannerView"
    isAccessibilityElement = true
    // ← No accessibilityLabel here — that depends on model
}

private func applyModel() {
    guard let model else { return }
    detailsLabel.text = model.type.detailsText
    // ✅ Dynamic accessibility: depends on model data
    accessibilityLabel = detailsLabel.text
    accessibilityTraits = .staticText
}
```

---

### When `constructView()` accessibility setup is correct

Static accessibility setup in `constructView()` is appropriate when:

```swift
// ✅ Fixed identifier — does not change with model
accessibilityIdentifier = "MyBannerView"

// ✅ Fixed trait — the view is always a button regardless of model
accessibilityTraits = .button

// ✅ Fixed element visibility — always accessible
isAccessibilityElement = true

// ✅ Suppressing decorative subviews — structural, not data-driven
iconView.isAccessibilityElement = false
```

Model-dependent configuration (label, value, hint content derived from model data) must always be in `applyModel()` or the equivalent `model.didSet`.

---

## 🔑 Key Rules

- **Call `setupAccessibility()` in `applyModel()` (or `model.didSet`), not in `constructView()`** — `constructView()` runs before the model is assigned. Any accessibility property that depends on model data (text content, label strings, visibility flags) will be stale if set at construction time.
- **Static accessibility properties belong in `constructView()`, dynamic ones in `applyModel()`** — `accessibilityIdentifier`, fixed traits, and `isAccessibilityElement` for decorative views are safe in `constructView()`. `accessibilityLabel` derived from model text must be in `applyModel()`.
- **Call `setupAccessibility()` every time the model changes** — for views that can have their model reset (cells, reusable views), `setupAccessibility()` must re-run on every model update to keep accessibility synchronized with data.
- **Add a unit test asserting `accessibilityLabel` after model is set** — a test that checks `view.accessibilityLabel` after `view.model = someModel` will catch this regression. Checking it before setting the model catches nothing.
- **`applyModel()` guard on nil model** — when `guard let model else { return }` exits early (nil model), accessibility properties may be stale from the previous model. Clear stale labels in the `else` branch if needed.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name of user interface components must be programmatically determinable. A banner view with `accessibilityLabel = nil` (because `setupAccessibility()` ran before the model was set) has no programmatically determinable name. VoiceOver announces it without any label — the user hears just "image" or nothing for what should be an informative banner. Moving `setupAccessibility()` to `applyModel()` ensures the accessible name is always derived from the current model data.

