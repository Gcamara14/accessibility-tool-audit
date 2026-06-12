# LD Select — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/select/index.md`
**View Class:** `living.design.themed.Select`
**Platform:** Android (Kotlin/XML)

## Overview

The `Select` component allows users to choose a single option from a dropdown list. Use the custom view `living.design.themed.Select` and specify the label and style. You can optionally add a leading icon and helper text.

## XML Usage

```xml
<living.design.themed.Select
    android:id="@+id/smallSelect"
    style="?ld.select.small"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:label="Select"
    app:ldHelperText="Helper text"
    app:ldLeading="@drawable/ld_ic_car" />
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `style` | `?ld.select.small`, `?ld.select.large` | Sets the size of the Select |
| `android:label` | string | The text label to be displayed |
| `app:ldLeading` | drawable ref | The leading icon resource (decorative) |
| `app:ldLeadingContentDescription` | string | Content description for the leading icon |
| `app:ldHelperText` | string | The helper text message |
| `app:ldHelperTextEnabled` | boolean | The initial state for the helper text |
| `app:ldErrorEnabled` | boolean | The state for the error message |
| `app:ldErrorContentDescription` | string | Content description for the error view |
| `app:ldIsMagic` | boolean | Whether the component displays a magic style to indicate AI modification |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `label` | `CharSequence?` | Get/set the text label |
| `text` | `CharSequence?` | Get/set the text value |
| `items` | `List<String>` | Get/set the dropdown items |
| `selection` | `Int` | Get/set the current selection index (default: -1) |
| `helperText` | `CharSequence?` | Get/set the helper text |
| `isHelperTextEnabled` | `Boolean` | Get/set helper text state |
| `error` | `CharSequence?` | Get/set the error message |
| `errorContentDescription` | `CharSequence?` | Get/set the error content description |
| `isErrorEnabled` | `Boolean` | Get/set error state |
| `startIconDrawable` | `Drawable?` | Get/set the leading icon (decorative) |
| `isStartIconVisible` | `Boolean` | Get/set leading icon visibility |
| `isMagic` | `Boolean` | Get/set whether the component displays a magic style to indicate AI modification |

### Methods

| Method | Notes |
|--------|-------|
| `fun setOnClickListener(onClicked: (View) -> Unit)` | Set click listener |
| `fun setOnItemSelectedListener(onItemSelected: (String, Int) -> Unit)` | Set listener for selection changes (provides text and index) |
| `fun setOnTouchListener(onItemTouched: (View, MotionEvent) -> Boolean)` | Set listener for touch events |
| `fun setStartIconOnClickListener(startIconOnClickListener: OnClickListener?)` | Set click listener for leading icon |
| `fun setStartIconOnLongClickListener(startIconOnLongClickListener: OnLongClickListener?)` | Set long click listener for leading icon |
| `fun setStartIconContentDescription(@StringRes resId: Int)` | Set content description for leading icon |

## Variants / Sizes

### Sizes (`style`)

- `?ld.select.small`
- `?ld.select.large`

## Placeholder Text

To show placeholder text or a hint, create an extra item entry for the drop-down list. Extra logic may be needed for form validation:

```kotlin
select.items = listOf("Select state of residence", "AL", "AK", "AZ")
select.selection = 0
```

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Use `app:ldLeadingContentDescription` to describe the leading icon for screen readers
- Use `app:ldErrorContentDescription` to provide a descriptive error message for assistive technologies
- `errorContentDescription` should clearly describe the error condition for screen reader users

## References

- [Select source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Select.kt)
- [Field source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/field/Field.kt)
- [Field attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L104-L129)
