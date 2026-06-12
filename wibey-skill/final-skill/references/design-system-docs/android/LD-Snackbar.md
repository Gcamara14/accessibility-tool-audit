# LD Snackbar — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/snackbar/index.md`
**View Class:** `living.design.themed.Snackbar`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Snackbar on Android, use `living.design.themed.Snackbar` and its `make` factory methods.

## XML Usage

Snackbar is not declared in XML layouts. It is created and shown entirely in Kotlin code via the `make` factory method.

## Kotlin Code API

### Factory Methods

| Method | Notes |
|--------|-------|
| `fun make(parentRoot: View?, text: CharSequence?): SnackbarBase` | Creates a Snackbar with a `CharSequence` message |
| `fun make(parentRoot: View?, @StringRes textResId: Int): SnackbarBase` | Creates a Snackbar with a string resource message |

### SnackbarBase Interface (`living.design.themed.SnackbarBase`)

| Method | Notes |
|--------|-------|
| `fun addCallback(callback: BaseTransientBottomBar.BaseCallback<BaseTransientBottomBar<*>>?): SnackbarBase` | Adds a callback to monitor intrinsic Snackbar events |
| `fun dismiss()` | Dismisses the Snackbar |
| `fun getAnchorView(): View?` | Gets the current Snackbar anchor view |
| `fun getText(): CharSequence?` | Gets the current Snackbar text |
| `fun setAction(actionText: CharSequence, listener: View.OnClickListener?): SnackbarBase` | Sets the action text from a `CharSequence` and provides a listener |
| `fun setAction(@StringRes actionTextResId: Int, listener: View.OnClickListener?): SnackbarBase` | Sets the action text from a `@StringRes` and provides a listener |
| `fun setAnchorView(anchorView: View?): SnackbarBase` | Sets the anchor view from a `View` |
| `fun setAnchorView(@IdRes anchorViewId: Int): SnackbarBase` | Sets the anchor view from an `@IdRes` |
| `fun setText(text: CharSequence): SnackbarBase` | Sets the text from a `CharSequence` |
| `fun setText(@StringRes textResId: Int): SnackbarBase` | Sets the text from a `@StringRes` |
| `fun show()` | Displays the Snackbar |

### Usage Example

```kotlin
Snackbar.make(view, "This is a snackbar")
    .setAction("Action") {
        // Do something
    }
    .show()
```

## Variants / Sizes

No LD-specific variants or sizes documented for the Snackbar component.

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Snackbar messages are announced by TalkBack when shown
- Action text should be descriptive enough to be meaningful when read in isolation by a screen reader

## References

- [Snackbar source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Snackbar.kt)
- [BaseTransientBottomBar.BaseCallback documentation](https://developer.android.com/reference/com/google/android/material/snackbar/BaseTransientBottomBar.BaseCallback)
