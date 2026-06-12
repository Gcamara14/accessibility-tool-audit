# LD TabNavigation — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/tab-navigation/index.md`
**View Class:** `living.design.themed.TabNavigation`
**Platform:** Android (Kotlin/XML)

## Overview

To create a Tab Navigation on Android, use the custom view `living.design.themed.TabNavigation` and specify elements by associating it to a ViewPager using `setupWithViewPager`. `living.design.themed.TabNavigation` extends [TabLayout](https://developer.android.com/reference/com/google/android/material/tabs/TabLayout) adding customizations to the style.

## XML Usage

Have both `living.design.themed.TabNavigation` and `ViewPager2` defined in the layout file:

```xml
<living.design.themed.TabNavigation
  android:id="@+id/tabs"
  android:layout_width="match_parent"
  android:layout_height="wrap_content" />

<androidx.viewpager2.widget.ViewPager2
  android:id="@+id/view_pager"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  app:layout_behavior="@string/appbar_scrolling_view_behavior" />
```

Assign the `ViewPager2` adapter and associate it to the `living.design.themed.TabNavigation` using a `com.google.android.material.tabs.TabLayoutMediator`:

```kotlin
viewPager.adapter = categoryAdapter
TabLayoutMediator(tabs, viewPager) { tab, position ->
    tab.text = categoryAdapter.getPageTitle(position)
}.attach()
```

## XML Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `android:id` | resource id | Standard Android id for referencing in code |
| `android:layout_width` | standard dimension | Typically `match_parent` |
| `android:layout_height` | standard dimension | Typically `wrap_content` |

TabNavigation extends `TabLayout` — refer to the [Material TabLayout documentation](https://developer.android.com/reference/com/google/android/material/tabs/TabLayout) for the full list of inherited attributes.

## Kotlin Code API

TabNavigation does not expose additional LD-specific Kotlin API beyond what it inherits from `TabLayout`. Integration is done via `TabLayoutMediator`:

```kotlin
TabLayoutMediator(tabs, viewPager) { tab, position ->
    tab.text = categoryAdapter.getPageTitle(position)
}.attach()
```

### Methods (inherited from TabLayout)

See [TabLayout API reference](https://developer.android.com/reference/com/google/android/material/tabs/TabLayout) for the full method list.

## Variants / Sizes

No LD-specific variants or sizes. Style is fixed by the Living Design theme.

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Each tab's `tab.text` is automatically exposed to TalkBack as the accessible label for that tab
- TalkBack announces the selected tab and its position (e.g., "Tab 1 of 3, selected")
- If tabs use icons only (no text), set `tab.contentDescription` on each tab to provide an accessible label
- Ensure tab labels are concise and meaningful; avoid relying on icons alone without text or content descriptions

## References

- [Tab Navigation source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/TabNavigation.kt)
