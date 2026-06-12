# Catalyst Template: Text Color Contrast — Placeholder and Body Text Below 4.5:1 Ratio

**Template ID:** `WA11Y-IOS-1.4.3-001`
**Platform:** iOS (UIKit / SwiftUI)
**WCAG Criterion:** 1.4.3 Contrast (Minimum)
**Component:** UITextField placeholder / UILabel body text
**Source PRs:**
- [#139729](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/139729) | [GPUGC-23160](https://jira.walmart.com/browse/GPUGC-23160) — Recognized Reviewer sampling browse placeholder text contrast
**Ingested:** 2026-04-14

---

## The Problem

Text that doesn't meet the WCAG 1.4.3 minimum contrast ratio of 4.5:1 (for normal text) or 3:1 (for large text ≥18pt regular / ≥14pt bold) is unreadable for users with low vision. iOS placeholder text is especially prone to this because the default `UITextField` placeholder color is a system-provided light gray (~#8A8A8E) which fails 4.5:1 on a white background.

**Root cause:** Using default system placeholder colors, raw `UIColor.systemGray` / `UIColor.lightGray`, or Walmart Tachyons-iOS gray tokens (`WCPColor.gray3`, `WCPColor.gray4`) that fall below the 4.5:1 contrast threshold against the field's background color.

**Contrast math (approximate):**
- `UIColor.systemGray` (#8A8A8E on white) ≈ 3.5:1 — **fails** for normal text
- `UIColor.lightGray` (#D3D3D3 on white) ≈ 1.6:1 — **fails**
- `WCPColor.gray3` / Tachyons `gray` ≈ 3.5:1 — **fails**
- `WCPColor.gray6` / Tachyons `dark-gray` (#595959) ≈ 7.0:1 — **passes**
- `WCPColor.gray7` / Tachyons `mid-gray` (#555) ≈ 7.3:1 — **passes**

**Note:** Placeholder text is still "text" for WCAG purposes and must meet the 4.5:1 normal-text threshold. It does NOT qualify as decorative regardless of its transient nature.

---

## Fix Patterns

### Pattern A: UITextField — Attributed Placeholder with Compliant Color (GPUGC-23160)

**Bad Code:**
```swift
let searchField = UITextField()
searchField.placeholder = NSLocalizedString("Search items...", comment: "Search field placeholder")
// ❌ Default placeholder color is UIColor.placeholderText (~systemGray) — fails 4.5:1
```

**Good Code:**
```swift
let searchField = UITextField()
let placeholderText = NSLocalizedString("Search items...", comment: "Search field placeholder")
searchField.attributedPlaceholder = NSAttributedString(
    string: placeholderText,
    attributes: [
        // ✅ WCPColor.gray6 (#595959) passes 4.5:1 contrast on white
        .foregroundColor: WCPColor.gray6,
        .font: UIFont.systemFont(ofSize: 16)
    ]
)
```

---

### Pattern B: Dynamic Background — Adaptive Placeholder Color

**Bad Code:**
```swift
// ❌ Same gray placeholder regardless of background (e.g., rendered over a photo/banner)
searchField.attributedPlaceholder = NSAttributedString(
    string: placeholder,
    attributes: [.foregroundColor: UIColor.systemGray]
)
```

**Good Code:**
```swift
// ✅ Switch to white placeholder when background is dark (image/colored surface)
private func configurePlaceholder(_ text: String, onDarkBackground: Bool) {
    let color: UIColor = onDarkBackground ? .white : WCPColor.gray6
    searchField.attributedPlaceholder = NSAttributedString(
        string: text,
        attributes: [
            .foregroundColor: color,
            .font: UIFont.systemFont(ofSize: 16)
        ]
    )
}
// For image-backed fields: use white (#FFF on dark overlay) ≥ 4.5:1
// For white-backed fields: use WCPColor.gray6 (#595959) ≥ 4.5:1
```

---

### Pattern C: UILabel Secondary / Hint Text Color

**Bad Code:**
```swift
hintLabel.textColor = UIColor.systemGray    // ❌ ~3.5:1
subtitleLabel.textColor = UIColor.lightGray // ❌ ~1.6:1
```

**Good Code:**
```swift
hintLabel.textColor = WCPColor.gray6        // ✅ #595959 — 7.0:1 on white
subtitleLabel.textColor = WCPColor.gray7    // ✅ #555 — 7.3:1 on white

// For large text (≥ 18pt regular or ≥ 14pt bold), 3:1 threshold applies:
largeSectionLabel.textColor = WCPColor.gray5  // ✅ if ≥ 18pt and WCPColor.gray5 ≥ 3:1
```

---

### Pattern D: SwiftUI — `.foregroundColor` on Text and `prompt` Modifier

**Bad Code:**
```swift
TextField("Search items...", text: $searchText)
    .foregroundColor(.secondary) // ❌ .secondary maps to systemGray — fails 4.5:1
```

**Good Code:**
```swift
// ✅ Custom placeholder via overlay (SwiftUI < iOS 17 has no direct placeholder color modifier)
ZStack(alignment: .leading) {
    if searchText.isEmpty {
        Text("Search items...")
            .foregroundColor(Color(WCPColor.gray6))  // ✅ passes 4.5:1
    }
    TextField("", text: $searchText)
}

// ✅ iOS 17+: use prompt with explicit color
TextField(text: $searchText, prompt: Text("Search items...").foregroundColor(Color(WCPColor.gray6))) {
    EmptyView()
}
```

---

## Var 1: Recognized Reviewer Sampling Browse — Inline Search Placeholder Contrast (GPUGC-23160)

**Context:** Inline search bar on the sampling browse page (Recognized Reviewer flow) — the `UITextField`'s placeholder text used the default system placeholder color which fails 4.5:1 contrast. The fix conditionally applies `LDColor.gray130` via `attributedPlaceholder` when the sampling feature flag is enabled.

**Files:** 
- `Plugins/Search/Search/Sources/Views/Deals/InLineSearchBarView/InLineSearchBarViewCell.swift`
- `Plugins/Search/Search/Sources/Models/ContentLayout/DealsConfig.swift`
**Source PRs:** [#139729](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/139729) · [#140119](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/140119)

**Bad Code (`InLineSearchBarViewCell.swift` — before):**
```swift
// Placeholder set inline in createSearchBar(forModel:) — always uses default system color
inLineSearchTextField?.placeholder = model.inLineSearchBarModel?.placeHolderText?.isEmpty ?? true
    ? model.inLineSearchBarModel?.titleText
    : model.inLineSearchBarModel?.placeHolderText
// ❌ Default UITextField placeholder renders at UIColor.placeholderText ≈ #8A8A8E
// Contrast ratio against white background: ~3.5:1 — FAILS 4.5:1 requirement
```

**Good Code — new `configureSearchBarPlaceHolder(model:)` method:**
```swift
private func configureSearchBarPlaceHolder(model: InLineSearchBarModule) {
    if let inLineSearchBarModel = model.inLineSearchBarModel {
        let placeholderText = !(inLineSearchBarModel.placeHolderText?.isEmpty ?? true)
            ? inLineSearchBarModel.placeHolderText
            : inLineSearchBarModel.titleText

        if model.shouldSetPlaceholderTextColor {
            // ✅ LDColor.gray130 — passes 4.5:1 contrast on white background
            let placeholderColor = LDColor.gray130.uiColor
            if let text = placeholderText {
                DispatchQueue.main.async { [weak self] in
                    self?.inLineSearchTextField?.searchTextField.attributedPlaceholder =
                        NSAttributedString(
                            string: text,
                            attributes: [.foregroundColor: placeholderColor]
                        )
                }
            }
        } else {
            inLineSearchTextField?.placeholder = placeholderText
        }
    }
}
```

**Feature flag in `DealsConfig.swift` (`InLineSearchBarModule`):**
```swift
// ADDED:
var shouldSetPlaceholderTextColor = false
// Set to true when isProductSamplingEnabled — routes through attributedPlaceholder path
```

**Why This Works:** `attributedPlaceholder` with `LDColor.gray130` overrides UIKit's default placeholder rendering. The flag `shouldSetPlaceholderTextColor` gates the fix to the sampling context without changing default search bar behavior elsewhere. `DispatchQueue.main.async` ensures the attributed string is applied after the text field is fully laid out.

**Key Signals:** `UITextField.placeholder = "..."` (plain string, no attributed variant); inline sampling search bar (`InLineSearchBarViewCell`); `isProductSamplingEnabled` feature flag context; audit finding "placeholder text contrast"; `LDColor.gray130` is the compliant token (not `WCPColor.gray6`).

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Placeholder contrast ratio | ~3.5:1 (system gray) — FAILS 4.5:1 | 7.0:1 (`WCPColor.gray6`) — PASSES |
| Text color flexibility | Hardcoded system color | WCPColor token — consistent with Walmart design system |
| Dynamic backgrounds | Same color on all surfaces | Adaptive: dark gray on light, white on dark |
| Localization | May use bare string | `NSLocalizedString` wrapper |
| SwiftUI | `.secondary` foreground | `Color(WCPColor.gray6)` or iOS 17 `prompt` modifier |

---

## Key Signals (For Pattern Matching)

- `UITextField.placeholder` set as a plain string (no `attributedPlaceholder`)
- `UILabel.textColor = UIColor.systemGray` / `.lightGray` / `.placeholderText`
- Tachyons-iOS color token `gray`, `gray3`, or `gray4` used for text
- Audit finding mentions "contrast" + "placeholder" or "hint text"
- `SwiftUI Text(...).foregroundColor(.secondary)` used for subordinate labels
- Domains: browse/search screens, form inputs, filter fields, helper/hint labels

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | GPUGC-23160 / PR #139729 + #140119 | Sampling browse — `InLineSearchBarViewCell` | `configureSearchBarPlaceHolder(model:)` + `LDColor.gray130.uiColor` | Ingested |

---

## Related Templates

- `WA11Y-ALL-1.4.3-001` — Web: Tachyons `gray` → `dark-gray` CSS class swap
- `WA11Y-IOS-1.4.11-001` — iOS: Non-text contrast for UI component indicators/spinners
- `WA11Y-IOS-1.4.4-001` — iOS: Dynamic Type scaling
