# LD MagicBox — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/magic-box/index.md`
**View Class:** `living.design.themed.MagicBox`
**Platform:** Android (Kotlin/XML)

## Overview

The `MagicBox` component highlights content being emphasized or updated by AI. It displays an animated gradient border around a specified view.

To use MagicBox in Android, initialize it with a context, then call `show()` with the view you want to highlight. Call `hide()` to fade out the animation when the action is complete.

## XML Usage

MagicBox is a code-only component — it has no XML layout element. It is initialized and controlled entirely through Kotlin.

```kotlin
import living.design.themed.MagicBox

// Initialize MagicBox
val magicBox = MagicBox(context)

// Show the magic box around a view when AI starts updating
magicBox.show(anchorView = myContentView)

// Hide the magic box when AI update is complete
magicBox.hide()
```

Customizing appearance:

```kotlin
// Adjust corner radius to match your container's corners
magicBox.cornerRadiusPx = context.theme.getDimen(R.attr.ld_primitive_scale_borderRadius_100)

// Adjust padding (usually should remain at 0 for flush edges)
magicBox.paddingPx = 0f
```

Memory cleanup:

```kotlin
// When you're done with the magic box
magicBox.hide()

// After the component is no longer needed
magicBox = null
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| (none) | | MagicBox is code-only; no XML attributes |

## Kotlin Code API

### Constructor

| Constructor | Notes |
|-------------|-------|
| `MagicBox(context: Context)` | Create a new MagicBox instance |

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `var cornerRadiusPx` | `Float` | The corner radius of the Magic Box in pixels. Default: `ld.primitive.scale.borderRadius.100` |
| `var paddingPx` | `Float` | The padding between the sides of the Magic Box and the container it is wrapping. Default: `0f` |

### Methods

| Method | Notes |
|--------|-------|
| `fun show(anchorView: View)` | Shows the MagicBox overlay around the specified anchor view and starts the animation. If called multiple times with different views, cleans up the previous view and attaches to the new one. |
| `fun hide()` | Fades out the MagicBox. Call this when the AI-driven update is complete. Multiple consecutive calls are safely ignored. |

## Variants / Sizes

No variants or sizes — MagicBox is a single-purpose AI highlight overlay component.

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- MagicBox is a purely visual/animated overlay indicating AI activity; it does not have interactive semantics
- The underlying anchor view retains its own accessibility properties — MagicBox does not alter them
- Ensure that any content being updated by AI is announced appropriately to screen reader users through other means (e.g., accessibility live regions on the anchor view) since the animation itself is not perceivable by TalkBack users

## Behavior Notes

- MagicBox adds itself to the anchor view's parent overlay, appearing above all other content in the parent container
- Always call `hide()` when done to properly clean up animations and listeners — it is critical for memory management
- The anchor view must be attached to a window and have a parent view for MagicBox to work
- MagicBox uses a `WeakReference` to hold the anchor view to prevent memory leaks; null out your reference to MagicBox when done
- The component automatically cleans up when the anchor view is detached from the window

## References

- [MagicBox source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/MagicBox.kt)
