# LD BottomSheet — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/bottom-sheet/index.md`
**View Class:** `living.design.themed.BottomSheet`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Bottom Sheet on Android, extend the abstract custom view `living.design.themed.BottomSheet` and supply a `ViewBinding` subclass for your content layout type. The `inflateViewBinding` abstract method needs to be implemented, and it should simply take care of inflating the view binding.

The `inflateActionBinding` open method should be overridden when you want to add an action view at the bottom of the bottom sheet. Its only responsibility is to inflate and return the appropriate action view binding. This allows subclasses to provide custom action layouts as needed. The `bottomSheetActionsBinding` property provides type-safe, lazy access to the bottom sheet's action view binding, which is created by `inflateActionBinding`.

Additionally, a `BottomSheetConfig` needs to be provided, with `sheetHeight` and `isTitleAccessibilityHeading` being mandatory properties. Using the "newInstance" pattern is recommended to correctly handle instance recreation.

## XML Usage

BottomSheet is Kotlin-only (fragment dialog); no direct XML declaration. Content layout is inflated via `ViewBinding` in `inflateViewBinding`.

## Kotlin Code API

### BottomSheetConfig Properties

| Property | Type | Notes |
|----------|------|-------|
| `title` | `String` | Sets the initial title. Can be changed dynamically via `BottomSheet.title`. Defaults to empty string. |
| `accessibilityTitle` | `String` | Sets the initial accessibility title. Defaults to the same value as `title`. Can be changed dynamically via `BottomSheet.accessibilityTitle`. |
| `sheetHeight` | `HeightConfig` | Sets the starting height for the Bottom Sheet. **Mandatory.** |
| `isTitleAccessibilityHeading` | `Boolean` | Specifies the accessibility heading role for the toolbar title. **Mandatory.** |
| `theme` | theme ref | Allows a custom theme to be provided to the bottom sheet. |

### Methods

| Method | Notes |
|--------|-------|
| `fun inflateViewBinding(inflater: LayoutInflater, container: ViewGroup?)` | Abstract — must be implemented to inflate the content view binding |
| `fun inflateActionBinding(inflater: LayoutInflater, container: ViewGroup?)` | Open — override to add an action view at the bottom of the sheet |
| `val bottomSheetActionsBinding` | Property — type-safe, lazy access to the action view binding created by `inflateActionBinding` |

### Example

```kotlin
private class DemoBottomSheetConfig : BottomSheetConfig {
  override val title: String
    get() = "Title"
  override val sheetHeight: HeightConfig
    get() = HeightConfig.WRAP
  override val isTitleAccessibilityHeading: Boolean
    get() = true
}

class DemoBottomSheetFragmentDialog : BottomSheet<LdThemedDemoBottomSheetDialogBinding>() {
  companion object {
    fun newInstance() = DemoBottomSheetFragmentDialog()
  }

  private val actions by bottomSheetActionsBinding<LdThemedBottomSheetActionsBinding>()

  override val config: BottomSheetConfig
    get() = DemoBottomSheetConfig()

  override fun inflateViewBinding(inflater: LayoutInflater, container: ViewGroup?) =
    LdThemedDemoBottomSheetDialogBinding.inflate(inflater, container, false)

  override fun inflateActionBinding(inflater: LayoutInflater, container: ViewGroup?) =
    LdThemedDemoBottomSheetActionBinding.inflate(inflater, container, false)

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    contentBinding.button.setOnClickListener { ... }
    actions.primaryButton.setonClickListener { ... }
  }
}
```

## Height Configuration (HeightConfig)

| Value | Description |
|-------|-------------|
| `WRAP` | Adjusts to the height of the content |
| `SHORT` | 30% of available screen height |
| `MEDIUM` | 50% of available screen height |
| `TALL` | 85% of available screen height |
| `FULL` | 98% of available screen height |
| `BELOW_TOOLBAR` | Adjusts sheet height to be below the "traditional" toolbar (actionBarSize/56dp) |

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- `isTitleAccessibilityHeading` (mandatory `BottomSheetConfig` property) sets the accessibility heading role for the toolbar title via `ViewCompat.setAccessibilityHeading`
- `accessibilityTitle` allows a separate, screen-reader-specific title distinct from the visible `title`

## References

- [BottomSheet source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/BottomSheet.kt)
- [BottomSheetConfig source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/bottomsheet/BottomSheetConfig.kt)
