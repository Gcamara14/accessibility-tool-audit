# LD ContentMessage — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/content-message/index.md`
**View Class:** `living.design.themed.ContentMessage`
**Platform:** Android (Kotlin/XML)

## Overview

To create Content Message on Android, use the custom view `living.design.themed.ContentMessage`. To add an action view to Content Message, add it as a child view. The action slot is implemented using a Placeholder and allows any one view (e.g., a button, a link button, or a view group of multiple buttons). Trying to add more than one action view will result in an `IllegalArgumentException`.

## XML Usage

Basic example with title and optional image:

```xml
<living.design.themed.ContentMessage
    android:id="@+id/content_message"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:title="The title goes here"
    app:ldContentMessageMedia="@drawable/content_image" />
```

With a child action view (button in the action slot):

```xml
<living.design.themed.ContentMessage
    android:id="@+id/content_message"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:title="The title goes here"
    app:ldContentMessageMedia="@drawable/content_image" >

    <living.design.themed.Button
            android:id="@+id/content_message_action_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/content_button"
            app:ldButtonVariant="primary" />
</living.design.themed.ContentMessage>
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:title` | string | The text to be displayed as the header |
| `app:ldContentMessageMedia` | drawable ref | The image to be displayed, optional |
| `app:ldContentMessageMediaContentDescription` | string | The content description of the media being displayed, optional |
| `app:ldContentMessageContent` | string | The body text to be displayed as content |
| `app:ldContentMessageSize` | `small`, `large` | The size of the component |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var title` | `String` | The text to be displayed as the header |
| `var content` | `String` | The text body displayed as the content |
| `var media` | `Drawable?` | The image media |
| `var mediaContentDescription` | `String` | The content description for the media |
| `var size` | `Size` | The size of the component |

### Methods

| Method | Notes |
|--------|-------|
| `fun setMedia(@drawableRes drawable: Int)` | Sets the media to the drawable resource ID parameter |
| `fun addView(view: View)` | Adds a view to the action placeholder |

## Variants / Sizes

Size values (`app:ldContentMessageSize`):
- `small`
- `large`

The different sizes change the font used for the header and the maximum size for the image.

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- `app:ldContentMessageMediaContentDescription` should be set whenever an image is displayed to provide a meaningful description for screen readers
- Remember to set IDs on any action component so they can be referenced for onClick behaviors
- The action slot is centered below the body text; ensure action views have descriptive text or content descriptions

## References

- [Content Message source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/ContentMessage.kt)
- [Content Message attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml)
