# LD TextArea — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/text-area/index.md`
**Class:** `LDTextArea`
**Platform:** iOS (UIKit/Swift)

## Overview
Text areas collect free form input from the user, unconstrained by validation of content type. They are visually taller than other text inputs to indicate that longer entries are possible and encouraged. Text area does not support the use of placeholder text — use helper text instead.

### States
- **Enabled:** Can hold focus (become first responder).
- **Disabled:** Unable to accept user input.
- **Error:** Displays when text input is not accepted. Error messages replace helper text.
- **Read Only:** Displays content that cannot be modified. Content can be selected and copied.

### Usage Guidelines
- Use when free form, longer responses are desired.
- Do not use when a specific, validated type of content is required (e.g., an address).

## Swift API

### Initialization
```swift
// Designated initializer
LDTextArea(dataModel: Model, appearance: Appearance)

// Convenience initializer
LDTextArea(size: LDTextArea.Size, headerLabelText: String, helperLabelText: String?)
```

### Model (`LDTextArea.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `size` | `LDTextArea.Size` | Size of the text area. Defaults to `.large`. |
| `viewState` | `LDTextArea.State` | State of the text area. Defaults to `.regular`. |
| `headerLabelText` | `String` | Mandatory title/header label text at top. |
| `helperLabelText` | `String?` | Optional helper label text at the bottom. Defaults to nil. |
| `allowedCharacterLimit` | `Int?` | Optional maximum allowed characters. |
| `text` | `String?` | Text to be pre-filled on the text area. |
| `validationStrategy` | `TextValidationStrategy` | Validation strategy for validating and updating state. Defaults to `NoValidation()`. Standard strategies: `EmailValidationStrategy`, `NoValidation`. |

### Variants / Enums
| Enum | Notes |
|------|-------|
| `Size` | Available in two sizes: small and large. Cases not explicitly listed in source — see `Size` enum. |
| `State` | Various states: `.regular`, `.error(errorText:)`, disabled, read-only. Cases not explicitly listed in source — see `State` enum. |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used in theming. |
| `dataModel` | `Model` | View model configuration object. |
| `headerLabelText` | `String` | Mandatory title/header label text at top. |
| `helperLabelText` | `String?` | Optional helper label text at the bottom. |
| `size` | `LDTextArea.Size` | Size of the text area. Defaults to `.large`. |
| `viewState` | `LDTextArea.State` | State of the text area. Defaults to `.regular`. |
| `hasFocus` | `Bool` (read-only) | Whether the view currently has focus. |
| `allowedCharacterLimit` | `Int?` | Optional maximum allowed character limit. |
| `accessoryToolbar` | `LDAccessoryToolbar?` | Accessory toolbar (prev/next/Done buttons). |
| `defaultAccessoryToolbar` | `LDAccessoryToolbar` | Default accessory toolbar with prev/next/Done buttons. |
| `previousField` | `UIResponder?` | Previous field reference for accessoryToolbar navigation. Set only after `accessoryToolbar` is set. |
| `nextField` | `UIResponder?` | Next field reference for accessoryToolbar navigation. Set only after `accessoryToolbar` is set. |
| `validationStrategy` | `TextValidationStrategy` | Validation strategy. Defaults to `NoValidation()`. |

### Accessors
| Property | Type | Notes |
|----------|------|-------|
| `text` | `String?` | Getter and setter for text inside the text area. |
| `returnKeyType` | `UIReturnKeyType` | Text area return key type. |
| `autocapitalizationType` | `UITextAutocapitalizationType` | Controls autocapitalization behavior. |
| `autocorrectionType` | `UITextAutocorrectionType` | Controls keyboard autocorrection behavior. |
| `spellCheckingType` | `UITextSpellCheckingType` | Controls annotation of misspelled words. |
| `keyboardType` | `UIKeyboardType` | Controls the keyboard type. |

### Delegate / Callbacks
| Property | Type | Notes |
|----------|------|-------|
| `delegate` | `LDTextAreaDelegate?` | Protocol to receive text area updates (all text view methods). |
| `editingDidBegin` | `(() -> Void)?` | Called when editing begins in the text area. |
| `editingDidEnd` | `(() -> Void)?` | Called when editing ends in the text area. |

### Obfuscation
| Property/Method | Notes |
|-----------------|-------|
| `containsPII` | `Bool` — whether the text area contains PII. |
| `obfuscatePII()` | Container variable for currently obfuscated text. |

### Validation
| Method | Notes |
|--------|-------|
| `validateTextArea() -> Bool?` | Returns true if text area input is valid. |

### Accessibility Methods
| Method | Notes |
|--------|-------|
| `announceRemainingCharactersLeftForThreshold()` | Announces remaining character count every 10th character (VoiceOver). |

## A11Y Notes
- Standard iOS UIKit accessibility properties apply: `accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`.
- `headerLabelText` is mandatory and serves as the visible label — it should also inform the `accessibilityLabel` for the text area.
- `helperLabelText` and error text (from `.error(errorText:)` state) provide additional context; ensure error states are surfaced to VoiceOver users.
- `allowedCharacterLimit` is paired with `announceRemainingCharactersLeftForThreshold()` which announces remaining characters every 10th character when VoiceOver is active.
- `customAccessibilityText` is not present on `LDTextArea` (that is a `LDTextField` property) — use the delegate or `editingDidBegin`/`editingDidEnd` closures to coordinate VoiceOver focus if needed.
- Text area does not support placeholder text — use `helperLabelText` instead, which is more accessible.

## Usage Example
```swift
let textArea = LDTextArea(model: .init(
    size: .large,
    viewState: .regular,
    headerLabelText: "Large TextArea",
    helperLabelText: "This is a sample help text",
    allowedCharacterLimit: 60,
    text: "Some value in here")
)
textArea.delegate = self
textArea.accessoryToolbar = textArea.defaultAccessoryToolbar
textArea.nextField = someNextField
textArea.previousField = somePrevField
textArea.viewState = .error(errorText: "some error")
```
