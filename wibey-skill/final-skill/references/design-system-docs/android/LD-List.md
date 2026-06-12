# LD List — Living Design Android Component

**Source:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/develop/android/components/list/index.md`
**View Class:** `living.design.themed.List` / `living.design.themed.list.ListItem`
**Platform:** Android (Kotlin/XML)

## Overview

To create a List on Android, use the custom view `living.design.themed.List`, its inner abstract class `living.design.themed.List.Adapter`, and `living.design.themed.list.ListItem`. The component is mostly an extension of `RecyclerView` with a custom divider and usage of `ListItem`.

`living.design.themed.list.ListItem` provides the functionalities specified in the component specifications, such as leading, title, content and trailing. It also handles click events.

## XML Usage

Feature layout:

```xml
<living.design.themed.List
    android:id="@+id/list"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:layoutManager="androidx.recyclerview.widget.LinearLayoutManager" />
```

Item layout:

```xml
<?xml version="1.0" encoding="utf-8"?>
<living.design.themed.list.ListItem xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" />
```

Item layout with leading and trailing slots:

```xml
<?xml version="1.0" encoding="utf-8"?>
<living.design.themed.list.ListItem xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    app:ldSlots="both">

    <ImageView
        android:id="@+id/leading"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:src="@drawable/ld_ic_clock"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:tint="?ld.semantic.color.text" />

    <living.design.themed.LinkButton
        android:id="@+id/trailing"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Action"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintTop_toTopOf="parent" />
</living.design.themed.list.ListItem>
```

Sample adapter (Kotlin):

```kotlin
import kotlin.collections.List as ListKt

internal class SimpleAdapterSample(private val items: ListKt<ListItemData>) :
    List.Adapter<ListItemData>() {
    override val listItemLayout: Int
        get() = R.layout.ld_themed_list_item_text
    override val dataList: ListKt<ListItemData>
        get() = items

    override fun createViewHolder(listItem: ListItem): List.ViewHolder<ListItemData> =
        TextViewHolder(listItem)
}

internal open class TextViewHolder(listItem: ListItem) : List.ViewHolder<ListItemData>(listItem) {
  override fun bind(data: ListItemData) {
    listItem.title = data.title
    listItem.content = data.content
  }
}
```

Attaching adapter:

```kotlin
binding.list.adapter = SimpleAdapterSample(items)
```

## XML Attributes

### ListItem Attributes

| Attribute | Values | Notes |
|-----------|--------|-------|
| `app:ldItemContent` | string | The content text of the ListItem |
| `app:ldItemTitle` | string | The title text of the ListItem |
| `app:ldSlots` | `none`, `leading`, `trailing`, `both` | The slot configuration of the ListItem |

## Kotlin Code API

### Properties (ListItem)

| Property | Type | Notes |
|----------|------|-------|
| `var slots` | `Slots` | Gets/sets slot configuration of the ListItem |
| `var title` | `CharSequence?` | Gets/sets title text of the ListItem |
| `var content` | `CharSequence?` | Gets/sets content text of the ListItem |

### Methods (ListItem)

| Method | Notes |
|--------|-------|
| `fun onLeadingClickListener(listener: ((View) -> Unit)?)` | Sets a click listener on the leading content. Use instead of directly adding a click listener to update touch targets. |
| `fun onTrailingClickListener(listener: ((View) -> Unit)?)` | Sets a click listener on the trailing content. Use instead of directly adding a click listener to update touch targets. |

## Variants / Sizes

Slot configuration values (`app:ldSlots`):
- `none`
- `leading`
- `trailing`
- `both`

When `both` is used, the first child element is the leading element and the second is the trailing.

## A11Y Notes

- Android uses `android:contentDescription` for icon-only views (NOT `a11yLabel` — that is web-only)
- Use `onLeadingClickListener` and `onTrailingClickListener` instead of directly adding click listeners on slot content — this is necessary to update the touch targets of the layout correctly
- Ensure `android:id` is set on leading/trailing slot views for reference in accessibility and click handlers
- Images placed in leading slots (e.g., `ImageView`) should have `android:contentDescription` set if they convey meaning

## References

- [List source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/List.kt)
- [List item source](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/java/living/design/themed/list/ListItem.kt)
- [List item attributes](https://gecgithub01.walmart.com/LivingDesign/living-design-android/blob/development/living-design-3.5/src/main/res/values/ld_styleables.xml#L118-L128)
