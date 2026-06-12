# Catalyst Template: Custom-Drawn Signature View Not Focusable or Announced by VoiceOver

**Template ID:** `WA11Y-IOS-4.1.2-006`
**Platform:** iOS (UIKit / SwiftUI)
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Confluence Rule:** Accessibility Not Enabled: Element Not Focusable or Recognized by VoiceOver
**Component:** Sampling Customer Tax Compliance — "Confirm and Sign" screen, generated signature view
**Source PRs:**
- [#139253](https://gecgithub01.walmart.com/walmart-web/glass-app/pull/139253) | [CEPG-340674](https://jira.walmart.com/browse/CEPG-340674) — Generated signature not focusable or announced by VoiceOver
**Ingested:** 2026-04-23

---

## The Problem

A custom `UIView` subclass that renders its content using `CALayer` or Core Graphics (`override func draw(_ rect: CGRect)`) is **invisible to VoiceOver by default**. iOS only automatically exposes standard UIKit controls (`UILabel`, `UIButton`, etc.) to the accessibility tree. Any view that draws itself manually — signature pads, charts, custom badges, progress rings — requires explicit accessibility configuration or VoiceOver skips it entirely: no focus, no announcement, nothing.

**Failure scenario (CEPG-340674):** The Sampling Customer tax compliance "Confirm and Sign" screen displays a cursive signature generated from the customer's legal name using a custom `UIView` that renders via `CALayer`/Core Graphics. The signature view has:
- No `isAccessibilityElement` set (defaults to `false` for `UIView`)
- No `accessibilityLabel`
- No `accessibilityTraits`

VoiceOver completely skips the signature element. A VoiceOver user cannot confirm that their signature has been generated correctly before submitting the tax compliance form.

**Expected VoiceOver announcement:** "Signature generated, it says [Full legal name], in cursive text"

**Root cause:** `UIView` subclasses default to `isAccessibilityElement = false`. Standard UIKit controls override this default. Any custom-drawn view — signature pad, chart, canvas — must explicitly opt in to the accessibility tree via `isAccessibilityElement = true`.

---

## Fix Patterns

### Pattern A: UIKit — `isAccessibilityElement = true` + Static Label on a Custom-Drawn UIView/CALayer Signature

**Bad Code:**
```swift
class SignatureView: UIView {
    var fullLegalName: String = ""

    override func draw(_ rect: CGRect) {
        // ❌ Renders cursive signature using Core Graphics / CALayer
        // No accessibility configuration — VoiceOver skips this view entirely
        let context = UIGraphicsGetCurrentContext()
        // ... cursive path drawing using fullLegalName ...
    }
}
```

**Good Code:**
```swift
class SignatureView: UIView {
    var fullLegalName: String = "" {
        didSet { updateAccessibility() }
    }

    override func draw(_ rect: CGRect) {
        let context = UIGraphicsGetCurrentContext()
        // ... cursive path drawing using fullLegalName ...
    }

    private func updateAccessibility() {
        // ✅ Opt the custom view into the accessibility tree
        isAccessibilityElement = true

        // ✅ Descriptive label — names the element and describes what it shows
        accessibilityLabel = NSLocalizedString(
            "Signature generated, it says \(fullLegalName), in cursive text",
            comment: "Accessibility label for the auto-generated cursive signature"
        )

        // ✅ .staticText — signature is confirmatory/read-only, not interactive
        accessibilityTraits = .staticText
    }
}
// VoiceOver: "Signature generated, it says Jane Doe, in cursive text, text"
```

---

### Pattern B: Dynamic Name Binding — `accessibilityLabel` Updated via `configure(with:)`

When the view is reused (e.g., in a cell or populated after data loads), bind the accessibility label through a configuration method rather than at init time:

```swift
class SignatureView: UIView {
    private var fullName: String = ""

    // ✅ Called by the view controller when the customer's legal name is available
    func configure(with name: String) {
        fullName = name
        setNeedsDisplay()   // Trigger redraw with new name
        updateAccessibilityLabel()
    }

    private func updateAccessibilityLabel() {
        isAccessibilityElement = true
        accessibilityLabel = NSLocalizedString(
            "Signature generated, it says \(fullName), in cursive text",
            comment: "Accessibility label for the auto-generated cursive signature"
        )
        accessibilityTraits = .staticText
    }

    override func draw(_ rect: CGRect) {
        // ... render cursive signature for fullName ...
    }
}

// Usage in view controller:
class ConfirmAndSignViewController: UIViewController {
    let signatureView = SignatureView()

    func populateSignature(with customer: CustomerModel) {
        signatureView.configure(with: customer.fullLegalName)

        // ✅ After signature appears, redirect VoiceOver focus to it
        UIAccessibility.post(notification: .layoutChanged, argument: signatureView)
    }
}
// VoiceOver: focus shifts to signature view — "Signature generated, it says Jane Doe, in cursive text"
```

---

### Pattern C: Reusable `SignatureView` Class with Built-In Accessibility Configuration

For a `SignatureView` used across multiple screens, embed accessibility configuration inside the class so callers cannot forget it:

```swift
class SignatureView: UIView {

    enum SignatureState {
        case empty
        case generated(fullName: String)
    }

    var state: SignatureState = .empty {
        didSet { applyState() }
    }

    private func applyState() {
        setNeedsDisplay()
        isAccessibilityElement = true

        switch state {
        case .empty:
            // ✅ "Signature required" label for the pre-sign placeholder state
            accessibilityLabel = NSLocalizedString(
                "Signature required. Your signature will appear here after confirmation.",
                comment: "Accessibility label for the empty signature placeholder"
            )
            accessibilityTraits = .staticText

        case .generated(let fullName):
            // ✅ "Signature generated" label for the completed signature state
            accessibilityLabel = NSLocalizedString(
                "Signature generated, it says \(fullName), in cursive text",
                comment: "Accessibility label for the auto-generated cursive signature"
            )
            accessibilityTraits = .staticText
        }
    }

    override func draw(_ rect: CGRect) {
        switch state {
        case .empty:
            // Draw placeholder (dashed line, "Sign here" prompt)
            break
        case .generated(let fullName):
            // Draw cursive signature using fullName via Core Graphics
            break
        }
    }
}

// Usage:
signatureView.state = .generated(fullName: customer.fullLegalName)
UIAccessibility.post(notification: .layoutChanged, argument: signatureView)
// VoiceOver: "Signature generated, it says Jane Doe, in cursive text"
```

---

### Pattern D: SwiftUI — `.accessibilityLabel()` + `.accessibilityAddTraits(.isStaticText)` on a Canvas/Path Signature View

```swift
// ❌ BAD: Canvas has no built-in accessibility semantics — VoiceOver skips it
Canvas { context, size in
    // ... draw cursive signature path for fullName ...
}

// ✅ GOOD: add explicit accessibility modifiers
Canvas { context, size in
    // ... draw cursive signature path for fullName ...
}
.accessibilityLabel(
    Text("Signature generated, it says \(fullName), in cursive text")
)
.accessibilityAddTraits(.isStaticText)
// VoiceOver: "Signature generated, it says Jane Doe, in cursive text"

// ✅ GOOD (alternative): Path-based signature with accessibility
Path { path in
    // ... cursive strokes for fullName ...
}
.stroke(Color.primary, lineWidth: 2)
.accessibilityElement()
.accessibilityLabel("Signature generated, it says \(fullName), in cursive text")
.accessibilityAddTraits(.isStaticText)
```

---

### Pattern E: "Signature Required" vs "Signature Generated" States — Different Labels for Each State

```swift
// UIKit version — driven by an enum (see Pattern C for full class)
func updateSignatureAccessibility(isSigned: Bool, fullName: String) {
    isAccessibilityElement = true
    accessibilityTraits = .staticText

    if isSigned {
        // ✅ Completed state: tells VoiceOver user what the signature says
        accessibilityLabel = NSLocalizedString(
            "Signature generated, it says \(fullName), in cursive text",
            comment: "Completed signature accessibility label"
        )
    } else {
        // ✅ Placeholder state: tells VoiceOver user action is still needed
        accessibilityLabel = NSLocalizedString(
            "Signature required. Your signature will appear here after confirmation.",
            comment: "Empty signature placeholder accessibility label"
        )
    }
}

// SwiftUI version
struct SignatureCanvasView: View {
    let fullName: String
    let isSigned: Bool

    var body: some View {
        Canvas { context, size in
            // ... draw signature or placeholder ...
        }
        .accessibilityLabel(isSigned
            ? "Signature generated, it says \(fullName), in cursive text"
            : "Signature required. Your signature will appear here after confirmation."
        )
        .accessibilityAddTraits(.isStaticText)
    }
}
```

---

## Var 1: Sampling Customer Tax Compliance — Generated Signature Skipped by VoiceOver (CEPG-340674)

**Context:** The Sampling Customer tax compliance flow in the glass-app. The "Confirm and Sign" screen auto-generates a cursive signature from the customer's full legal name using a custom `UIView` that renders via `CALayer`/Core Graphics. The signature view had no accessibility configuration. VoiceOver completely skipped it — no focus, no announcement — leaving VoiceOver users unable to verify their signature before submitting.

**Bad Code:**
```swift
class SignaturePreviewImageView: BaseView {
    // ❌ Custom-drawn signature image view is completely invisible to VoiceOver
    // isAccessibilityElement defaults to false for UIImageView subclasses
    private func applyModel() {
        signatureImageView.setImageURL(model.imgUrl, loadingAndFallback: UIImage())
        nameLabel.text = LocalizedStrings.previewSignAs(name: model.customerName ?? "").value
        // No accessibility label — VoiceOver skips the signature entirely
    }
}
```

**Good Code:**
```swift
class SignaturePreviewImageView: BaseView {
    // ✅ signatureImageView exposed as accessible element with descriptive label
    private lazy var signatureImageView: WCPImageView = {
        let view = WCPImageView()
        view.isAccessibilityElement = true  // ✅ make visible to VoiceOver
        return view
    }()

    private func applyModel() {
        signatureImageView.setImageURL(model.imgUrl, loadingAndFallback: UIImage())
        nameLabel.text = LocalizedStrings.previewSignAs(name: model.customerName ?? "").value
        signatureImageView.accessibilityLabel = buildSignatureImageAccessibilityLabel(name: model.customerName)
    }

    // ✅ Descriptive label only set when name is available and has changed
    private func buildSignatureImageAccessibilityLabel(name: String?) -> String? {
        let imageAccessibilityLabel = LocalizedStrings.imageText(name: name ?? "").value
        guard let name, name.isNotEmpty,
              imageAccessibilityLabel != signatureImageView.accessibilityLabel
        else { return nil }
        return imageAccessibilityLabel  // e.g. "Signature generated, it says John, in cursive text"
    }
}
```

**Why This Works:** `UIImageView` subclasses default to `isAccessibilityElement = false`. Setting `isAccessibilityElement = true` explicitly registers `signatureImageView` with the accessibility tree. The `buildSignatureImageAccessibilityLabel` helper guards against setting a stale or empty label — it only updates the label when the name is non-empty and has changed. This satisfies WCAG 4.1.2: the name and purpose of the signature element are programmatically determinable. The localized label (e.g. "Signature generated, it says John, in cursive text") gives VoiceOver users enough information to verify their signature before submitting the form.

**Key Signals:** Custom `UIImageView` subclass (`WCPImageView`) with no `isAccessibilityElement = true`; `setImageURL(_:loadingAndFallback:)` used to populate a signature or avatar image with no paired `accessibilityLabel`; VoiceOver completely skips a visible signature element; SharedComponents plugin; tax compliance, legal signature, e-sign, or "Confirm and Sign" screens.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| VoiceOver focus | Element completely skipped — no focus stop | `isAccessibilityElement = true` — VoiceOver includes it in the focus order |
| Announcement | Silent — nothing announced | "Signature generated, it says Jane Doe, in cursive text" |
| Role | None (UIView default: not an accessibility element) | `.staticText` — correctly signals read-only, informational content |
| Dynamic name | Label never updated when name changes | `didSet` / `configure(with:)` keeps label in sync with rendered content |
| Focus redirection | VoiceOver unaware signature appeared | `UIAccessibility.post(notification: .layoutChanged, argument: signatureView)` shifts focus |
| WCAG 4.1.2 compliance | Name and role not programmatically determinable | Name (label), role (trait) both exposed to assistive technology |

---

## Key Signals (For Pattern Matching)

- Custom `UIView` subclass with `override func draw(_ rect: CGRect)` that has no accessibility configuration
- `CALayer`-based rendering (signature, chart, custom badge, progress ring) with no `isAccessibilityElement`
- VoiceOver completely skips a visible element — not just a wrong label, but no focus stop at all
- Non-standard UI: canvas, signature pad, chart, custom progress indicator, e-signature widget
- Tax compliance, legal document, e-sign, or "Confirm and Sign" screens
- `UIGraphicsGetCurrentContext()` or `CAShapeLayer` used to render meaningful content with no paired accessibility setup

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | CEPG-340674 / PR #139253 | Sampling Customer tax compliance — "Confirm and Sign" generated signature | `isAccessibilityElement = true` + `accessibilityLabel` + `.staticText` trait on custom-drawn UIView | Ingested |

---

## Related Templates

- `WA11Y-IOS-4.1.2-002` — Icon-only `UIButton` missing `accessibilityLabel` (element focusable but unlabelled; this template: not focusable at all)
- `WA11Y-IOS-1.1.1-001` — `UIImageView` missing alt text (image not described; this template: custom-drawn view not even in accessibility tree)
- `WA11Y-WEB-1.1.1-003` — Web: custom icon missing accessible name (`aria-label` on SVG/canvas; analogous web pattern)
