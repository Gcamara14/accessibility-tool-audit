# LD Nudge — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/nudge/index.md`
**View Class:** `living.design.themed.Nudge`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Nudge on Android, use the custom view `living.design.themed.Nudge` and specify the title, content text, leading slot, and action slot.

There are two prebuilt supported views for leading slot and action slot, set using `ldNudgeIcon` and `ldNudgeAction`.

It is also possible to use a custom view for the leading slot and the action slot by setting the `ldNudgeSlots` attribute and providing the child views.

## XML Usage

```xml
<living.design.themed.Nudge
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:ldNudgeAction="@string/design_demo_nudge_action"
    app:ldNudgeContent="@string/design_demo_nudge_content"
    app:ldNudgeIcon="@drawable/ld_ic_spark"
    app:ldNudgeTitle="@string/design_demo_nudge_title" />
```

Custom views in leading and action slots:

```xml
<living.design.themed.Nudge
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:ldNudgeContent="@string/design_demo_nudge_content"
    app:ldNudgeSlots="both"
    app:ldNudgeTitle="@string/design_demo_nudge_title">

    <ImageView
        android:id="@+id/leading"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/ld_ic_clock"
        app:tint="?ld.semantic.color.text" />

    <living.design.themed.Button
        android:id="@+id/trailing"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/design_demo_nudge_action"
        app:ldButtonVariant="primary" />
</living.design.themed.Nudge>
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldNudgeAction` | string ref | The action button text of the Nudge |
| `app:ldNudgeContent` | string ref | The content text of the Nudge |
| `app:ldNudgeIcon` | drawable ref | The icon of the Nudge |
| `app:ldNudgeTitle` | string ref | The title text of the Nudge |
| `app:ldNudgeSlots` | `none`, `leading`, `action`, `both` | The slot configuration of the Nudge |

## Kotlin Code API

### Properties

| Property | Type | Notes |
|----------|------|-------|
| `action` | `CharSequence?` | Gets/sets the action button text. Hidden if a child view is inflated for the action content placeholder. |
| `content` | `CharSequence?` | Gets/sets the content text of the Nudge |
| `icon` | `Drawable?` | Gets/sets the icon. Hidden if a child view is inflated for the leading content placeholder. |
| `title` | `CharSequence?` | Gets/sets the title text of the Nudge |
| `slots` | `Slots?` | Gets/sets the slot configuration of the Nudge |

### Methods

| Method | Notes |
|--------|-------|
| `fun setIcon(@DrawableRes drawableRes: Int)` | Sets the icon from a drawable resource |
| `fun setActionListener(listener: ((View) -> Unit)?)` | Sets a click listener called when the action button is clicked |
| `fun setOnCloseListener(listener: ((View) -> Unit)?)` | Sets a close listener. The close button is only enabled when a listener is set. |

## Variants / Sizes

### Nudge Slots (`app:ldNudgeSlots`)

- `none` (default)
- `leading`
- `action`
- `both`

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- The close button is only enabled when a close listener is set via `setOnCloseListener`
- Leading slot child views require an `android:id` (e.g., `@+id/leading`)

## References

- [Nudge source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/Nudge.kt)
- [Nudge attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L145-L150)
