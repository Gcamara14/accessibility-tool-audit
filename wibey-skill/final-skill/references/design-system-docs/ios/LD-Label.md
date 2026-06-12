# LD Label — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/label/index.md`
**Class:** `LDLabel`
**Platform:** iOS (UIKit/Swift)

## Overview
Labels should use standard fonts and colors. This is by far the most used component in the library, designed to be as simple as possible. Refer to `LDTextStyle` for available font types.

Using attributed text can be tricky — ensure line height adheres to Living Design typography documentation best practices.

## Swift API

### Initialization
```swift
// Designated initializer
LDLabel(style: LDTextStyle, observer: LDPIIObserver?, text: String?, frame: CGRect?)
```

### Model (`LDLabel.Model`)
`LDLabel` does not use a separate `Model` struct — configuration is applied directly via the designated initializer and modifiers.

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `text` | `String?` | Sets the text of the label |
| `attributedText` | `NSAttributedString?` | Sets the attributed text of the label |
| `lineHeight` | `CGFloat?` | Custom line height; note performance hit — avoid in loops. Must use token value, not `UIFont.lineHeight`. |
| `edgeInsets` | `UIEdgeInsets` | Custom insets; default is `.zero`. Prefer constraints where possible. |
| `containsPII` | `Bool` | When `true`, hides text when app is inactive (app switcher) to protect sensitive information |
| `isCopyMenuEnabled` | `Bool` | When `true`, automatically displays a copy menu for the label's value |
| `copyText` | `String?` | Value copied into clipboard when `isCopyMenuEnabled` is `true`; defaults to `text` |

### Methods
| Method | Signature | Notes |
|--------|-----------|-------|
| `applyAlt` | `func applyAlt(alternativeText: String) -> Void` | Applies alternative font to specific text within attributed text |
| `applyUnderline` | `func applyUnderline(underlinedText: String) -> Void` | Applies underline to specified text within attributed text |

### Variants / Enums
`LDLabel` uses `LDTextStyle` for typography style selection (e.g., `.bodyMedium`, `.bodyMediumAlt` for bold). See `LDTextStyle` for full case list.

### Delegate / Callbacks
None documented.

## A11Y Notes
- `containsPII`: When `true`, text is hidden in the app switcher to prevent exposure of personally identifiable information — important for privacy-related accessibility and security compliance.
- `isCopyMenuEnabled` / `copyText`: Enabling the copy menu improves usability for users who need to copy content (e.g., confirmation numbers, codes) without retyping.
- `LDLabel` inherits from `LDRootLabel` (which is UIKit-based) — standard UIKit accessibility properties (`accessibilityLabel`, `isAccessibilityElement`, etc.) apply.
- Ensure `lineHeight` uses the correct token value (e.g., `tokens.text.lineHeight.bodySmall`) and not `UIFont.lineHeight`, which reflects the font file value and may not match Living Design specs.

## Usage Example
```swift
// Simple label
let label = LDLabel(style: .bodyMedium, text: "Text")

// Bold label using Alt style
let label = LDLabel(style: .bodyMediumAlt, text: "Text")

// PII-protected label
let label = LDLabel(style: .bodyMedium, text: "555-12-3456")
label.containsPII = true
```
