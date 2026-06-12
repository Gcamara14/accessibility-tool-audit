# Catalyst Template: Alt Text: Missing Alt Text (Generic)

**Template ID:** `WA11Y-AND-1.1.1-001`
**Platform:** Android
**WCAG Criterion:** 1.1.1 Non-text Content

---

## 🛑 The Problem
An informative image is missing its `contentDescription`, making it completely inaccessible to Android TalkBack users.

---

## ✅ The Fix Patterns

### Scenario: Jetpack Compose
**❌ Bad Code:**
```kotlin
Image(
    painter = painterResource(id = R.drawable.ic_shopping_cart),
    contentDescription = null // Fails: Informative image has null description
)
```

**✅ Good Code:**
```kotlin
Image(
    painter = painterResource(id = R.drawable.ic_shopping_cart),
    contentDescription = stringResource(id = R.string.cd_shopping_cart) // Fix: Added meaningful localized description
)
```

### Scenario: XML Layout
**❌ Bad Code:**
```xml
<ImageView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:src="@drawable/ic_shopping_cart" />
```

**✅ Good Code:**
```xml
<ImageView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:src="@drawable/ic_shopping_cart"
    android:contentDescription="@string/cd_shopping_cart" />
```
