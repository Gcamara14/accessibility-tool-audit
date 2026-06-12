# LD Callout — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/callout/index.md`
**View Class:** `living.design.themed.Callout`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Callout on Android, use the custom view `living.design.themed.Callout` and its `create` method.

## XML Usage

Callout is created programmatically via the `create` factory method; it is not declared directly in XML.

## Kotlin Code API

### Creation

```kotlin
Callout.create(requireContext(), "This is a callout", anchorView)
    .show(Callout.Position.BELOW)
```

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `onDismissClick` | `() -> Unit` | Get/set action for when the Callout is dismissed |
| `text` | `CharSequence?` | Get/set the text for the Callout |

### Methods

| Method | Notes |
|--------|-------|
| `fun show(position: Position = Position.BELOW)` | Shows the Callout with the provided position relative to the anchor view |
| `fun dismiss()` | Dismisses the Callout |

## Positions

- `LEFT_OF`
- `ABOVE`
- `RIGHT_OF`
- `BELOW`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Callout is a popover/tooltip-style component; ensure the `text` content is meaningful and conveys full context since it may not be persistently visible
- Dismiss affordance should be accessible; the dismiss button should have an appropriate content description

## References

- [Callout source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Callout.kt)
