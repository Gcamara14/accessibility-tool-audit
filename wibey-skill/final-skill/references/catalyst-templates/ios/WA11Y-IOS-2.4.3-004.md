# Catalyst Template: `accessibilityElements` Assignment Resets Focus Order — Elements Dropped

**Template ID:** `WA11Y-IOS-2.4.3-004`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 2.4.3 Focus Order
**Component:** `WalmartPlusOptInToggleBannerView` — W+ Opt-In Toggle Banner
**Source PR:** [#156468](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/156468) | [CEPG-369256](https://jira.walmart.com/browse/CEPG-369256)
**File:** `Modules/FeatureUI/WalmartPlusUIShared/Sources/WalmartPlusOptInToggleBannerModel/WalmartPlusOptInToggleBannerView.swift`
**Ingested:** 2026-04-23 (real diff from glass-app)

---

## The Problem

When a view builds its `accessibilityElements` array incrementally (appending one element at a time across multiple conditions), a single assignment statement like `accessibilityElements = [logoImageView]` **destroys all elements added before that point**. The array is reset to contain only the assigned element. Any element appended before the assignment — or any element that would have been prepended — is silently dropped from VoiceOver's navigation order.

**Failure scenario (CEPG-369256):** `WalmartPlusOptInToggleBannerView.setupAccessibility()` builds `accessibilityElements` by conditionally appending logo, heading, body, toggle, and disclaimer. The logo block used `=` assignment instead of `?.append()`:

```
// Conceptual flow:
accessibilityElements = [logoImageView]    ← ❌ RESETS array — prior elements gone
accessibilityElements?.append(headingLabel)
accessibilityElements?.append(bodyLabel)
accessibilityElements?.append(toggleView)
accessibilityElements?.append(disclaimerLabel)
```

If any elements were added to `accessibilityElements` *before* the logo block ran, they are wiped. If the logo appears first visually but the code path adds heading/body first, the logo block truncates the array to `[logoImageView]` and then the subsequent appends add everything else — but heading/body added in an earlier code path are lost.

**Root cause:** `=` assignment and `?.append()` are NOT equivalent:
- `accessibilityElements = [x]` — replaces the entire array with a new single-element array
- `accessibilityElements?.append(x)` — adds `x` to the end of the existing array without touching other elements

---

## Fix Patterns

### Pattern A: Real Fix — Replace Assignment with Append (`WalmartPlusOptInToggleBannerView`, CEPG-369256)

**File:** `WalmartPlusOptInToggleBannerView.swift`

**Bad Code:**
```swift
// ❌ Assignment resets the array — any element appended before this line is lost
if logoImageView.isHidden == false {
    logoImageView.isAccessibilityElement = true
    logoImageView.accessibilityLabel = logoLabel
    accessibilityElements = [logoImageView]   // ← WIPES the array
}

accessibilityElements?.append(headingLabel)
accessibilityElements?.append(bodyLabel)
// VoiceOver order: [logoImageView, headingLabel, bodyLabel] only
// — any elements added before the logo block are silently dropped
```

**Good Code:**
```swift
// ✅ Append preserves all existing elements — logo is added in correct sequence
if logoImageView.isHidden == false {
    logoImageView.isAccessibilityElement = true
    logoImageView.accessibilityLabel = logoLabel
    accessibilityElements?.append(logoImageView)   // ← APPENDS to existing array
}

accessibilityElements?.append(headingLabel)
accessibilityElements?.append(bodyLabel)
// VoiceOver order: [...prior elements..., logoImageView, headingLabel, bodyLabel]
// — all elements preserved in intended order ✅
```

---

### Pattern B: Initialize the Array Once, Then Append Everywhere

The safest pattern when building `accessibilityElements` incrementally is to initialize it once (empty) at the start of `setupAccessibility()`, then exclusively use `append` / `append(contentsOf:)`:

```swift
private func setupAccessibility() {
    isAccessibilityElement = false

    // ✅ Initialize once — all subsequent operations use append
    accessibilityElements = []

    if logoImageView.isHidden == false {
        logoImageView.isAccessibilityElement = true
        logoImageView.accessibilityLabel = logoLabel
        accessibilityElements?.append(logoImageView)
    }

    accessibilityElements?.append(headingLabel)

    if !bodyLabel.isHidden {
        accessibilityElements?.append(bodyLabel)
    }

    accessibilityElements?.append(toggleView)

    if let disclaimerLabel, !disclaimerLabel.isHidden {
        accessibilityElements?.append(disclaimerLabel)
    }
}
// VoiceOver order exactly matches the conditional visual layout ✅
```

**Why:** Initializing to `[]` once makes the intent explicit. Every subsequent `append` is clearly additive. No intermediate assignment can accidentally reset the array.

---

### Pattern C: Build as a Local Array, Assign Once at the End

For complex setups, build the list into a local `[Any]` variable and assign to `accessibilityElements` once at the end:

```swift
private func setupAccessibility() {
    isAccessibilityElement = false

    var elements: [Any] = []

    if logoImageView.isHidden == false {
        logoImageView.isAccessibilityElement = true
        logoImageView.accessibilityLabel = logoLabel
        elements.append(logoImageView)
    }

    elements.append(headingLabel)

    if !bodyLabel.isHidden { elements.append(bodyLabel) }

    elements.append(toggleView)

    if let disclaimerLabel, !disclaimerLabel.isHidden {
        elements.append(disclaimerLabel)
    }

    // ✅ Single assignment at the end — array never partially reset
    accessibilityElements = elements
}
```

**When to use Pattern C vs Pattern B:** Use Pattern C when the elements list is complex and you want to review the final array order as a single list. Use Pattern B when `setupAccessibility` is called multiple times (e.g. on model update) and you want incremental rebuild without a stale array from the previous call.

---

## Secondary Fix in This PR: Empty Title Prefix in `disclaimerLabel.text`

Also fixed in the same PR — disclaimer label text gained a leading space when `disclaimerModel.title` was empty:

**Bad Code:**
```swift
// ❌ When title is empty: text becomes " See details and terms" (leading space)
disclaimerLabel.text = disclaimerModel.title + " " + disclaimerLinkModel.text
```

**Good Code:**
```swift
// ✅ Skip title prefix entirely when it is empty
disclaimerLabel.text = disclaimerModel.title.isNotEmpty ?
    disclaimerModel.title + " " + disclaimerLinkModel.text :
    disclaimerLinkModel.text
```

**Why it matters for accessibility:** VoiceOver reads `disclaimerLabel.text` as the accessible name for the disclaimer label. A leading space causes VoiceOver to pause slightly before the text, producing an unnatural cadence ("(pause) See details and terms"). `isNotEmpty` guard ensures clean label text.

---

## Why This Works

| Aspect | Before (Broken) | After (Fixed) |
|---|---|---|
| `accessibilityElements` | `= [logoImageView]` resets array — prior elements dropped | `?.append(logoImageView)` — elements preserved in order |
| VoiceOver navigation order | Incomplete — missing elements skipped silently | Complete — all elements traversed in intended sequence |
| WCAG 2.4.3 compliance | Fails — focus order does not match logical reading order | Passes — focus order matches visual / logical order |
| Disclaimer label text | `" See details"` with leading space when title empty | `"See details"` — clean label text, natural VoiceOver cadence |

---

## Key Signals (For Pattern Matching)

- `accessibilityElements = [someView]` (assignment with brackets) inside `setupAccessibility()` that is NOT at the very start of the method — any prior appends are lost
- `accessibilityElements` built via a mix of assignment (`=`) and append (`?.append`) in the same method — only one form should be used
- View with conditional `accessibilityElements` population (logo shown/hidden, disclaimer shown/hidden) where some elements disappear from VoiceOver navigation depending on which code path runs
- W+ promotional banners, toggle banners, opt-in flows with logo + heading + disclaimer layout
- VoiceOver skips an element that IS visible on screen — it was dropped from `accessibilityElements` by an assignment reset

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 (founding) | CEPG-369256 / PR #156468 | W+ Opt-In Toggle Banner (`WalmartPlusOptInToggleBannerView`) | `accessibilityElements = [logo]` → `?.append(logo)` + empty title guard | Ingested 2026-04-23 |

---

## Related Templates

- `WA11Y-IOS-2.4.3-001` — iOS: VoiceOver focus after `UICollectionView` batch update
- `WA11Y-IOS-2.4.3-002` — iOS: Wrong elements in explicit `accessibilityElements` filter
- `WA11Y-IOS-2.4.3-003` — iOS: Async-injected badge reverses focus order
- `WA11Y-IOS-4.1.2-002` — iOS: Button excluded from manual `accessibilityElements` array
