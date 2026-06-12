# Catalyst Template: Non-text Contrast — Loading Indicators and UI Components Below 3:1 Ratio

**Template ID:** `WA11Y-IOS-1.4.11-001`
**Platform:** iOS (UIKit / SwiftUI)
**WCAG Criterion:** 1.4.11 Non-text Contrast
**Component:** UIActivityIndicatorView / custom spinner / loading overlay
**Source PRs:**
- [#147441](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/147441) | [CEPG-352365](https://jira.walmart.com/browse/CEPG-352365) — W+ BEN Fuel grey loading animation on background image
- [#142246](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/142246) | [CEPG-344504](https://jira.walmart.com/browse/CEPG-344504) — PHTS Purchase Plan white loading animation on white background
**Ingested:** 2026-04-14

---

## The Problem

UI components — loading spinners, progress indicators, skeleton loaders — must meet a **3:1 contrast ratio** between their visual presentation and adjacent colors (WCAG 1.4.11). Unlike text (which needs 4.5:1), the lower 3:1 threshold still requires deliberate color selection. Two common iOS failure modes:

1. **Gray spinner on image background (CEPG-352365):** A `UIActivityIndicatorView` using `.medium` (gray) style renders over hero images or colored card backgrounds. The gray tone matches some background regions, producing local contrast well below 3:1.
2. **White spinner on white background (CEPG-344504):** A loading overlay uses `UIColor.white` for the spinner on a white or near-white modal/card background — the component literally disappears (contrast ratio ≈ 1:1).

**Root cause:** Default `UIActivityIndicatorView` styles (`.medium` = gray, `.large` = gray) were chosen without considering the background color of the containing view. Custom spinner views replicated the design token without a contrast check.

**Non-text contrast applies to:**
- `UIActivityIndicatorView` color
- Custom spinner `CAShapeLayer` stroke color  
- `UIProgressView` track and fill colors
- Skeleton loader shimmer stroke
- Icon-only UI controls (covered separately in `WA11Y-IOS-4.1.2-002`)

---

## Fix Patterns

### Pattern A: UIActivityIndicatorView — Override Style/Color for Background

**Bad Code:**
```swift
let spinner = UIActivityIndicatorView(style: .medium)
// ❌ .medium = UIColor.systemGray — fails 3:1 over image backgrounds or white surfaces
spinner.startAnimating()
```

**Good Code:**
```swift
let spinner = UIActivityIndicatorView(style: .medium)
// ✅ Explicitly set color — choose based on background:
// • On white/light backgrounds: use dark color (≥ 3:1)
spinner.color = WCPColor.gray7       // #555 — 7.3:1 on white ✅
// • On dark/image backgrounds: use white
spinner.color = .white               // On overlays/dark surfaces ✅
spinner.startAnimating()
```

---

### Pattern B: Dynamic Background — Adaptive Spinner Color

**Bad Code:**
```swift
// ❌ Same gray spinner regardless of whether content is a white card or a hero image
func showLoading() {
    loadingIndicator.color = UIColor.systemGray
    loadingIndicator.startAnimating()
}
```

**Good Code:**
```swift
enum BackgroundContext {
    case lightSurface   // white card, modal
    case darkSurface    // hero image, colored banner
}

func showLoading(on context: BackgroundContext) {
    switch context {
    case .lightSurface:
        // ✅ Dark gray — 7.3:1 on white
        loadingIndicator.color = WCPColor.gray7
    case .darkSurface:
        // ✅ White — use semi-opaque overlay underneath for reliability
        loadingIndicator.color = .white
        loadingContainerView.backgroundColor = UIColor.black.withAlphaComponent(0.4)
    }
    loadingIndicator.startAnimating()
}
```

---

### Pattern C: Custom CAShapeLayer Spinner — Stroke Color Contrast

**Bad Code:**
```swift
class WalmartSpinnerView: UIView {
    private let shapeLayer = CAShapeLayer()
    
    private func setup() {
        shapeLayer.strokeColor = UIColor.white.cgColor
        // ❌ White stroke on a white card background = 1:1 contrast — invisible
        shapeLayer.lineWidth = 3
        layer.addSublayer(shapeLayer)
    }
}
```

**Good Code:**
```swift
class WalmartSpinnerView: UIView {
    private let shapeLayer = CAShapeLayer()
    
    // Accept background context at init
    init(onDarkBackground: Bool = false) {
        super.init(frame: .zero)
        setup(onDarkBackground: onDarkBackground)
    }
    
    private func setup(onDarkBackground: Bool) {
        // ✅ Choose stroke color with ≥ 3:1 contrast against background
        let strokeColor: UIColor = onDarkBackground
            ? UIColor.white              // white on dark overlay ✅
            : WCPColor.blue1             // Walmart blue on white — strong contrast ✅
        shapeLayer.strokeColor = strokeColor.cgColor
        shapeLayer.lineWidth = 3
        shapeLayer.fillColor = UIColor.clear.cgColor
        layer.addSublayer(shapeLayer)
    }
}
```

---

### Pattern D: SwiftUI ProgressView — Color Modifier

**Bad Code:**
```swift
ProgressView()
    .progressViewStyle(.circular)
// ❌ Default tint inherits accent color which may not meet 3:1 on all backgrounds
```

**Good Code:**
```swift
ProgressView()
    .progressViewStyle(.circular)
    .tint(Color(WCPColor.blue1))  // ✅ Walmart blue — strong contrast on white
    // On dark backgrounds:
    // .tint(.white)
    // .background(Color.black.opacity(0.4)) // semi-opaque backing ensures contrast
```

---

## Var 1: W+ BEN Fuel — Grey Spinner on Background Image (CEPG-352365)

**Context:** `SignInAndMembershipStatusCoordinator` (Fuel plugin) — a `GlassLoadingViewController` was initialized without a `spinnerStyle`, defaulting to a gray spinner over a transparent or lightly colored background. Over the Fuel benefit card's background image, the default gray spinner could blend into mid-tone regions, falling below 3:1 contrast.

**Bad Code:**
```swift
class SignInAndMembershipStatusCoordinator {
    // ❌ Transparent background — white spinner invisible over light background content
    private var loadingIndicator = GlassLoadingViewController(
        style: .large,
        backgroundColor: LDColor.clear.uiColor  // ❌ no scrim — spinner blends into background
    )
}
```

**Good Code:**
```swift
class SignInAndMembershipStatusCoordinator {
    // ✅ Inverse (white) spinner + semi-transparent black scrim → 4.5:1 contrast assured
    private var loadingIndicator = GlassLoadingViewController(
        style: .large,
        spinnerStyle: .inverse,                                          // ✅ white spinner
        backgroundColor: UIColor.black.withAlphaComponent(0.4)         // ✅ scrim provides contrast
    )
}
```

**Key Signals:** `GlassLoadingViewController` without `spinnerStyle: .inverse`; loading overlay with `backgroundColor: LDColor.clear.uiColor` or no scrim; Fuel, W+ BEN, or benefit screens; audit finding "Non-text Contrast" + "spinner" / "loading".

---

## Var 2: PHTS Purchase Plan — Default Spinner Style on White/Opaque Background (CEPG-344504)

**Context:** PHTS (Protection & Health Tech Services) — `PurchasePlanViewController`, `CancellationReasonCoordinator`, and `SelectAPlanBottomSheetViewController` used default `WCPSpinner(size: .large)` and `GlassLoadingViewController(style: .large)` without specifying spinner style. The default style renders a gray spinner over a white/light modal background, producing contrast well below 3:1. In some views the spinner was essentially invisible.

**Bad Code:**
```swift
// ❌ Default spinner style — gray spinner invisible over white/light content
private var loadingIndicator = WCPSpinner(size: .large)
private lazy var requestIndicatorController = GlassLoadingViewController(style: .large)
```

**Good Code:**
```swift
// ✅ Neutral (white) style + inverse spinner for GlassLoadingViewController
private var loadingIndicator = WCPSpinner(style: .neutral, size: .large)
private lazy var requestIndicatorController = GlassLoadingViewController(
    style: .large,
    spinnerStyle: .inverse  // ✅ white spinner visible over dark/opaque scrim
)
```

**Why This Works:** `WCPSpinner(style: .neutral)` renders a white spinner intended for use over dark or opaque scrims. `GlassLoadingViewController(spinnerStyle: .inverse)` likewise uses a white spinner, which achieves strong contrast against the dark semi-opaque overlay that `GlassLoadingViewController` applies behind itself. Both changes ensure the spinner color is deliberately chosen relative to its background rather than relying on a system default.

**Key Signals:** `WCPSpinner(size: .large)` without an explicit `style`; `GlassLoadingViewController(style: .large)` without `spinnerStyle: .inverse`; PHTS, Purchase Plan, Cancellation, or plan-selection bottom sheets; spinner that appears invisible or low-contrast during testing; audit finding "Non-text Contrast" + "spinner" / "loading indicator".

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Spinner contrast on white (Var 2) | `WCPSpinner(size: .large)` default gray — FAILS | `WCPSpinner(style: .neutral, size: .large)` white on dark scrim — PASSES |
| Spinner contrast on image/bg (Var 1) | `GlassLoadingViewController` transparent bg → gray spinner blends in | `spinnerStyle: .inverse` + `UIColor.black.withAlphaComponent(0.4)` scrim → predictable ≥ 4.5:1 |
| Dynamic background handling | One color for all surfaces | Adaptive: dark on light, white+scrim on dark/image |
| Brand alignment | System gray, off-brand | `WCPColor.blue1` or `WCPColor.gray6` — Walmart DS tokens |
| Custom spinner visibility | `CAShapeLayer.strokeColor = white.cgColor` — invisible | Explicit color with contrast check |

---

## Key Signals (For Pattern Matching)

- `UIActivityIndicatorView(style: .medium)` or `(style: .large)` rendered over a dynamic or colored background
- `CAShapeLayer.strokeColor = UIColor.white.cgColor` on a white/near-white surface
- Loading overlay with same background color as spinner
- `ProgressView()` in SwiftUI with no `.tint()` modifier on a light surface
- Skeleton loader shimmer using system gray strokes
- Audit findings: "Non-text Contrast" + "spinner", "loading indicator", "activity indicator", "progress"

---

## Variations

| Var | Ticket | Feature | Failure Mode | Status |
|---|---|---|---|---|
| Var 1 | CEPG-352365 / PR #147441 | W+ BEN Fuel — `SignInAndMembershipStatusCoordinator` | `GlassLoadingViewController` missing `spinnerStyle: .inverse` + transparent bg | Ingested |
| Var 2 | CEPG-344504 / PR #142246 | PHTS Purchase Plan / Cancellation / SelectAPlan | `WCPSpinner` default gray + `GlassLoadingViewController` default style on white bg | Ingested |

---

## Related Templates

- `WA11Y-ALL-1.4.11-001` — Web: WCP Rating star stroke contrast (CSS `stroke` property)
- `WA11Y-IOS-1.4.3-001` — iOS: Text color contrast (placeholder, body labels)
- `WA11Y-IOS-4.1.2-002` — iOS: Missing accessible name on icon-only buttons (non-text UI)
- `WA11Y-WEB-1.4.11-001` — Web: Non-text contrast for SVG components
