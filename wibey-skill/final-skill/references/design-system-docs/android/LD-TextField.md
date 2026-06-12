# LD TextField — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/text-field/index.md`
**View Class:** `living.design.themed.TextField`
**Platform:** Android (Kotlin/XML)

## Overview

The `TextField` component allows users to enter single-line text input.

To create a `TextField` on Android, use the custom view `living.design.themed.TextField`. Configure the style, label, helper text, error text, trailing mode, and optional leading/trailing icons.

## XML Usage

```xml
<living.design.themed.TextField
    style="?ld.textField.large"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:label="Label"
    app:ldLeading="@drawable/ld_ic_clock"
    app:ldHelperText="Helper text"
    app:ldTrailing="@drawable/ld_ic_clock"
    app:ldTrailingMode="custom" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `style` | `?ld.textField.small`, `?ld.textField.large` | Sets the size of the TextField |
| `android:label` | string | The text label to be displayed |
| `app:ldLeading` | drawable resource | The leading icon resource (decorative) |
| `app:ldLeadingContentDescription` | string | Content description for the leading icon |
| `app:ldTrailing` | drawable resource | The trailing icon resource (when `ldTrailingMode` is `custom`) |
| `app:ldTrailingContentDescription` | string | Content description for the trailing icon |
| `app:ldTrailingMode` | `none`, `password_toggle`, `clear_text`, `custom` | The behavior for the trailing slot |
| `app:ldHelperText` | string | The helper text message |
| `app:ldHelperTextEnabled` | boolean | The initial state for the helper text |
| `app:ldErrorEnabled` | boolean | The state for the error message |
| `app:ldErrorContentDescription` | string | Content description for the error view |
| `app:ldIsMagic` | boolean | Whether the component displays a magic style to indicate AI modification |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var label` | `CharSequence?` | Get/set the text label |
| `open var text` | `CharSequence?` | Get/set the text field value |
| `var helperText` | `CharSequence?` | Get/set the helper text |
| `var isHelperTextEnabled` | `Boolean` | Get/set helper text state |
| `var error` | `CharSequence?` | Get/set the error message |
| `var errorContentDescription` | `CharSequence?` | Get/set the error content description |
| `var isErrorEnabled` | `Boolean` | Get/set error state |
| `var startIconDrawable` | `Drawable?` | Get/set the leading icon (decorative) |
| `var isStartIconVisible` | `Boolean` | Get/set leading icon visibility |
| `var endIconMode` | `EndIconMode` | Get/set the trailing mode (see Trailing mode section) |
| `val endIconDrawable` | `Drawable?` | Get the current trailing icon |
| `var endIconContentDescription` | `CharSequence?` | Get/set the trailing icon content description |
| `var isEndIconVisible` | `Boolean` | Get/set trailing icon visibility |
| `var isMagic` | `Boolean` | Get/set whether the component displays a magic style to indicate AI modification |

### Methods

| Method | Notes |
|--------|-------|
| `fun addEndIconOnClickListener(endIconOnClickListener: OnClickListener?)` | Add click listener to the trailing icon |
| `fun clearEndIconOnClickListeners()` | Remove all listeners from the trailing icon |
| `fun setEndIconActivated(endIconActivated: Boolean)` | Set trailing icon activated state |
| `fun setEndIconContentDescription(@StringRes resId: Int)` | Set the trailing icon content description |
| `fun setEndIconDrawable(@DrawableRes resId: Int)` | Set the trailing icon for custom mode |
| `fun setEndIconDrawable(endIconDrawable: Drawable?)` | Set the trailing icon for custom mode |
| `fun setEndIconOnLongClickListener(endIconOnLongClickListener: OnLongClickListener?)` | Set long click listener |

## Variants / Sizes

**Sizes** (`style` attribute):
- `?ld.textField.small`
- `?ld.textField.large`

**Trailing modes** (`app:ldTrailingMode`):
- `none` — Plain text field with no trailing icon
- `password_toggle` — Masks characters during typing with a toggle icon to show/hide the password
- `clear_text` — Shows a clear button when text is entered, allowing users to quickly clear the field
- `custom` — Custom icon, defined via the `app:ldTrailing` property

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- `app:ldLeadingContentDescription` provides a content description for the leading icon — set this when the leading icon carries meaning beyond decoration
- `app:ldTrailingContentDescription` provides a content description for the trailing icon — required for `custom` mode icons to be accessible
- `app:ldErrorContentDescription` / `var errorContentDescription` provides an accessible description for the error state; set a clear, actionable message (e.g., "Error: Email address is invalid")
- For `password_toggle` mode, the toggle icon should have an accessible label reflecting its current action ("Show password" / "Hide password") — this is typically handled by the Material component base
- For `clear_text` mode, the clear button should be announced by TalkBack; `endIconContentDescription` can be used to customize the announcement
- The `android:label` text is the accessible label for the text field input

## References

- [Text field source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/TextField.kt)
- [Field source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/field/Field.kt)
- [Field attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L104-L129)
