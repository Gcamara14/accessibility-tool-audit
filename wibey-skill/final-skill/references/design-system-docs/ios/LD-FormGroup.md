# LD FormGroup — Living Design iOS Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/ios/components/form-group/index.md`
**Class:** `LDFormGroup`
**Platform:** iOS (UIKit/Swift)

## Overview
Offers encapsulation of single select, multi-select, and required form group implementations. Wraps button components (checkboxes, radios) in a group with optional title, helper text, and error text.

- `Model.errorText` is optionally provided for when there is an error with the current selection. Error text must be provided by the consumer — there are no internal mechanisms for triggering an error.
- `LDFormGroupDelegate` notifies consumers when an item is selected or deselected, including automatic selections/deselections driven by the active `SelectionMode`.

## Swift API

### Initialization
```swift
// Designated initializer
LDFormGroup(dataModel: LDFormGroup.Model, appearance: Appearance, models: [ItemModel])

// Convenience initializer
LDFormGroup(style: Style, models: [ItemModel])
```

### Model (`LDFormGroup.Model`)
| Property | Type | Notes |
|----------|------|-------|
| `style` | `Style` | Which type of buttons will be displayed |
| `selectionMode` | `SelectionMode` | Selection mode (single select, multi-select, etc.) |
| `title` | `String?` | Title text displayed above in bold |
| `helperText` | `String?` | Helper text displayed below title |
| `errorText` | `String?` | Error text displayed when selection is in error |

**Designated init parameters:**
- `style`: Determines which type of buttons will be displayed
- `mode`: Used to determine if the group is displayed on dark or light background
- `selectionMode`: Chosen selection mode
- `title`: Title to be displayed above buttons in bold
- `helperText`: Helper text to be displayed in smaller text below title
- `errorText`: Error text to be displayed when error exists

### ItemModel (`LDFormGroup.ItemModel`)
| Property | Type | Notes |
|----------|------|-------|
| `isEnabled` | (init param) | Determines if the button should show, but be disabled |
| `isChecked` | (init param) | Determines if button starts out selected |
| `text` | (init param) | Text to display trailing the selection icon button |

### Modifiers
| Modifier | Type | Notes |
|----------|------|-------|
| `appearance` | `Appearance` | Appearance object used in themes |
| `dataModel` | `Model` | View model to inform the display of `LDFormGroup` |

### Variants / Enums

#### `enum Style: Style`
Style of buttons to be used in the group. Source example shows `.checkbox` — see `Style` enum for full case list.

#### `enum SelectionMode: SelectionMode`
Provides an enumeration of different selection modes — see `SelectionMode` enum for full case list.

### Delegate / Callbacks

#### `protocol LDFormGroupDelegate: AnyObject`

| Method | Signature | Notes |
|--------|-----------|-------|
| `didSelectItem` | `func didSelectItem(sender: any LDFormGroupItem) -> Void` | Triggered when an item in a form group is selected |
| `didUnselectItem` | `func didUnselectItem(sender: any LDFormGroupItem) -> Void` | Triggered when an item in a form group is deselected |

**Delegate property:**
```swift
var delegate: LDFormGroupDelegate?
```

#### `protocol LDFormGroupItem: LDThemeable`
Protocol wrapping a button component grouped by Form Group. Not intended for use outside of LD.

## A11Y Notes
- `errorText` is consumer-supplied — when set, ensure the string clearly describes the validation error so VoiceOver users understand what correction is needed.
- `title` and `helperText` provide grouping context; these should be meaningful labels for assistive technology users navigating the form.
- Disabled items (via `isEnabled: false` in `ItemModel`) will be communicated as disabled to VoiceOver through UIKit's standard accessibility system.

## Usage Example
```swift
// Designated initializer
let formGroup = LDFormGroup(
    dataModel: LDFormGroup.Model(
        style: .checkbox,
        models: [
            .init(text: "First item"),
            .init(text: "Second item")
        ],
        title: "title",
        helperText: "helper",
        errorText: "error"
    )
)

// Convenience initializer
let formGroup = LDFormGroup(style: .checkbox, models: [
    .init(text: "First item"), .init(text: "Second item")
])
```
