# LD TextField — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/text-field/index.md`
**Class:** `LDTextField`
**Platform:** iOS (UIKit/Swift)

## Overview
Text Fields are found within forms, and can also be part of card, search, or modal. Inputs may include names, descriptions, emails, etc. Text field does not support the use of placeholder text — use helper text instead.

- **Leading icon:** Use when emphasizing the type of field input (e.g., email, security, calendar). Only 24x24px (medium sized) non-interactive icons.
- **Trailing content slot:** Can include suffix text, an icon, or a button.

### Usage Guidelines
- Use when a user must enter a phone number, name, email, address, etc.
- Use when gathering information to improve UX (e.g., zip code, credit card).
- Do not use when another form input (Select or Text Area) might be more appropriate.

## Swift API

### Initialization
```swift
// Designated initializer
LDTextField(dataModel: Model)

// Convenience initializer
LDTextField(size: LDTextField.Size, headerLabelText: String, helperLabelText: String?, text: String?)
```

### Model (`LDTextField.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `size` | `LDTextField.Size` | Size of the text field: Small or Large. Defaults to `.large`. |
| `viewState` | `LDTextField.State` | State of the control, includes error state. Defaults to `.regular`. |
| `headerLabelText` | `String` | Required header value to describe the content. |
| `helperLabelText` | `String?` | Optional helper label text. Defaults to nil. |
| `hideHelperView` | `Bool?` | Should hide or show helper view. Defaults to nil. |
| `leadingIcon` | `UIImage?` | Leading icon inside text field border. Defaults to nil. |
| `customAccessibilityText` | `String?` | Custom accessibility label text, if needed. Defaults to nil. |
| `trailingContentSlotView` | `UIView?` | Trailing icon/button inside text field border. Defaults to nil. |
| `text` | `String?` | Text to display in the text field. |
| `validationStrategy` | `TextValidationStrategy` | Validation strategy. Defaults to `NoValidation()`. |
| `clearButtonMode` | `ViewMode` | Shows the default (x) clear button inside the text field. |
| `containsPII` | `Bool` | Flag if text field contains personally identifiable information. |

### Variants / Enums
| Enum | Notes |
|------|-------|
| `State` | Various states for `LDTextField` (e.g., `.regular`, `.error(errorText:)`). Cases not explicitly listed in source — see `State` enum. |
| `ViewMode` | Setting for modifying the text field clear button mode. Cases not explicitly listed in source — see `ViewMode` enum. |

### Delegate / Callbacks
| Property | Type | Notes |
|----------|------|-------|
| `delegate` | `LDTextFieldDelegate?` | Protocol to receive text field updates (all text field methods). |
| `textAutofilled` | `(() -> Void)?` | Called when the customer autofills text. |
| `textDidChange` | `(() -> Void)?` | Called when text changes in the text field. |
| `editingDidBegin` | `(() -> Void)?` | Called when editing begins. Alternatively conform to `LDTextFieldDelegate`. |
| `editingDidEnd` | `(() -> Void)?` | Called when editing ends. Alternatively conform to `LDTextFieldDelegate`. |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used in theming. |
| `dataModel` | `Model` | View model to configure `LDTextField`. |
| `headerLabelText` | `String` | Mandatory title/header label text at top. |
| `helperLabelText` | `String?` | Optional helper label text at the bottom. |
| `hideHelperView` | `Bool?` | Optional: hide helper view from the bottom. Defaults to false. |
| `formatter` | `LDStringFormatter?` | Optional string formatter for automatic text formatting. |
| `size` | `LDTextField.Size` | Size of the text field. Defaults to `.large`. |
| `viewState` | `LDTextField.State` | State of the text field. Defaults to `.regular`. |
| `leadingIcon` | `UIImage?` | Optional leading icon. Defaults to nil. |
| `clearButtonMode` | `LDTextField.ViewMode` | Sets when the clear button shows. Default is `.never`. |
| `trailingContentSlotView` | `UIView?` | Optional content slot for any view. Set `isAccessibilityElement`/trait/label/hint on the passed view. |
| `accessoryToolbar` | `LDAccessoryToolbar?` | Accessory toolbar (prev/next/Done). |
| `defaultAccessoryToolbar` | `LDAccessoryToolbar` | Default accessory toolbar with prev/next/Done buttons. |
| `previousTextField` | `UIResponder?` | Previous field reference for accessoryToolbar navigation. Set only after `accessoryToolbar` is set. |
| `nextTextField` | `UIResponder?` | Next field reference for accessoryToolbar navigation. Set only after `accessoryToolbar` is set. |
| `containsPII` | `Bool` | Whether or not the text field contains PII. |
| `validationStrategy` | `TextValidationStrategy` | Validation strategy. Defaults to `NoValidation()`. |

### Accessors
| Property | Type | Notes |
|----------|------|-------|
| `text` | `String?` | Getter and setter for text inside the text field. |
| `customInputView` | `UIView?` | Set the inputView for the text field. |
| `isSecureTextEntry` | `Bool` | Use for password fields or other sensitive information. |
| `textContentType` | `UITextContentType` | Text field content type. |
| `returnKeyType` | `UIReturnKeyType` | Text field return key type. |
| `autocapitalizationType` | `UITextAutocapitalizationType` | Controls autocapitalization behavior. |
| `autocorrectionType` | `UITextAutocorrectionType` | Controls keyboard autocorrection behavior. |
| `spellCheckingType` | `UITextSpellCheckingType` | Controls annotation of misspelled words. |
| `keyboardType` | `UIKeyboardType` | Controls the keyboard type. |

### Validation
| Method | Notes |
|--------|-------|
| `validateTextField() -> Bool?` | Returns true if text field input is valid. |

## A11Y Notes
- Standard iOS UIKit accessibility properties apply: `accessibilityLabel`, `accessibilityHint`, `isAccessibilityElement`.
- `customAccessibilityText` (on `Model`) allows setting a custom accessibility label when the `headerLabelText` alone is insufficient.
- `trailingContentSlotView`: the source explicitly states — "Set the `isAccessibilityElement`/Trait/Label/Hint as required on the view that is passed." Callers are responsible for the accessibility configuration of any view placed in the trailing slot.
- `headerLabelText` is mandatory and serves as the primary visible label. Ensure it is descriptive enough to serve VoiceOver users.
- `helperLabelText` and error text from `.error(errorText:)` state provide supplementary context — ensure error states are communicated to VoiceOver users.
- Text field does not support placeholder text — use `helperLabelText` instead, which is more accessible.
- `isSecureTextEntry = true` activates secure input; VoiceOver will announce "secure text field."
- `textContentType` hints to iOS for autofill — proper `textContentType` values improve accessibility by enabling autofill (e.g., `.emailAddress`, `.password`).

## Usage Example
```swift
let textField = LDTextField(
    dataModel: .init(
        size: .large,
        viewState: .regular,
        headerLabelText: "Title header text",
        helperLabelText: "Optional helper text",
        leadingIcon: LDIcon.search.image,
        text: nil,
        validationStrategy: EmailValidationStrategy(
            errorMessage: "You need at least 5 characters mandatorily")
    )
)
textField.delegate = self
textField.trailingContentSlotView = LDLinkButton()
textField.accessoryToolbar = textField.defaultAccessoryToolbar
textField.nextTextField = someNextField
textField.previousTextField = somePrevField
textField.viewState = .error(errorText: "some error")

// Closure-based callbacks
textField.textDidChange = {
    // react to text changes
}
textField.editingDidBegin = {
    // editing started
}
textField.editingDidEnd = {
    // editing ended
}
```
