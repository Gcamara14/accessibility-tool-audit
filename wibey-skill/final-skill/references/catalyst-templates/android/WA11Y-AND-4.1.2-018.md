# Catalyst Template: Name — Input Field Label Disappears When Filled (`info.hintText` Delegate Replaces Offscreen `labelFor` Pattern)

**Template ID:** `WA11Y-AND-4.1.2-018`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-018`
**Source Tickets:** CEPG-343148
**Source PRs:** [walmart-glass commit 5fb6bac5](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/commit/5fb6bac50f0416acf7613ee998e96e571ae79ba4)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

An `EditText` (or `TextInputLayout`) uses `android:hint` as its only accessible label. When the field is **empty**, TalkBack announces the hint: *"Ask me anything, Edit box"*. When the user **types something**, the hint disappears from both the UI and the accessibility tree — TalkBack now only announces the typed value: *"Where is my order, Edit box"*. The label is gone.

Users who revisit the field mid-flow (e.g., after an error) hear no label — they cannot confirm which field they're editing. On forms with multiple similar-looking fields this is especially disorienting.

**Anti-pattern workaround** previously seen in production:

```xml
<!-- ❌ 1dp × 1dp offscreen TextView using android:labelFor.
     This adds a hidden view to the hierarchy, pollutes accessibility traversal,
     and the "label" is still missing once the field is filled in some edge cases. -->
<TextView
    android:id="@+id/unified_ui_input_field_label"
    android:layout_width="1dp"
    android:layout_height="1dp"
    android:alpha="0"
    android:focusable="false"
    android:labelFor="@+id/unified_ui_input_field"
    android:text="@string/converse_unified_chat_ui_input_field_label"
    app:layout_constraintStart_toStartOf="parent"
    app:layout_constraintTop_toTopOf="parent" />
```

**Symptom (Jira):** "TalkBack stops announcing field label when text is typed", "Input field announced without name after user types", "Chat input announces 'edit box' with no label once filled", "Screen reader loses context for filled search/chat fields".

---

## ✅ The Fix Pattern

### `info.hintText` persistence via `AccessibilityDelegateCompat`

Override `onInitializeAccessibilityNodeInfo` to set `info.hintText` every time the accessibility node is initialized. TalkBack reads `hintText` as the persistent label for the field, regardless of whether the field has content:

```kotlin
// WCAG 4.1.2: ensure hint text persists as the accessible label for TalkBack
// even when the field contains content (android:hint alone disappears when filled).
private fun setAccessibleLabelForInputField() {
    ViewCompat.setAccessibilityDelegate(
        binding.unifiedUiInputField,
        object : AccessibilityDelegateCompat() {
            override fun onInitializeAccessibilityNodeInfo(host: View, info: AccessibilityNodeInfoCompat) {
                super.onInitializeAccessibilityNodeInfo(host, info)
                info.hintText = context.getString(R.string.converse_unified_chat_ui_input_field_hint)
                // → TalkBack: "Ask me anything, Edit box" — even when field has content
            }
        }
    )
}
```

Call at init/setup time, before any text is set:

```kotlin
init {
    // ... view setup ...
    setAccessibleLabelForInputField()
}
```

Or in `onViewCreated` / `bind()`:

```kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    setAccessibleLabelForInputField()
}
```

---

### ❌ Bad Code — hint disappears on fill

```kotlin
// No delegate → hint text is only in XML android:hint.
// TalkBack: "Ask me anything, Edit box" (empty)
// TalkBack: "Where is my order, Edit box" (filled — label gone!)
class ConverseUnifiedInputFieldUI(...) : ConstraintLayout(...) {
    init {
        // ← No AccessibilityDelegate → label lost once filled
    }
}
```

```xml
<!-- Hint alone is insufficient — disappears when field is populated -->
<EditText
    android:id="@+id/unified_ui_input_field"
    android:hint="@string/converse_unified_chat_ui_input_field_hint" />
```

---

### ✅ Remove the offscreen `labelFor` TextView

Delete the 1dp offscreen helper entirely from the XML layout. The delegate approach is strictly superior:

```xml
<!-- ❌ REMOVE this pattern — hidden views clutter the hierarchy -->
<!--
<TextView
    android:layout_width="1dp"
    android:layout_height="1dp"
    android:alpha="0"
    android:focusable="false"
    android:labelFor="@+id/unified_ui_input_field"
    android:text="@string/input_field_label" />
-->

<!-- ✅ Keep only the actual EditText; apply the delegate programmatically -->
<EditText
    android:id="@+id/unified_ui_input_field"
    android:hint="@string/converse_unified_chat_ui_input_field_hint" />
```

---

### Announcement behaviour with `info.hintText`

| Field state | Without delegate | With `info.hintText` delegate |
|---|---|---|
| Empty | "Ask me anything, Edit box" | "Ask me anything, Edit box" |
| Filled ("hello") | "hello, Edit box" | "hello, Ask me anything, Edit box" |
| Empty (re-focused) | "Ask me anything, Edit box" | "Ask me anything, Edit box" |

With the delegate, TalkBack announces: *"[typed text], [hint label], Edit box"* — the user always knows which field they're in.

---

## 🔑 Key Rules

- **`info.hintText` is the correct API for a persistent accessible label** — it is specifically designed to remain visible to AT even after the field is filled. It is separate from `info.text` (the field's content) and `info.contentDescription`.
- **Do not set `info.contentDescription` as a workaround** — setting `contentDescription` on an `EditText` suppresses TalkBack from announcing the typed content. Use `hintText` specifically because it coexists with the field's content.
- **Remove offscreen `labelFor` TextViews** — a 1dp zero-alpha `TextView` with `android:labelFor` is an anti-pattern. It adds invisible nodes to the accessibility tree and can be traversed by TalkBack. The delegate approach achieves the same result with zero view-hierarchy impact.
- **Call `setAccessibilityDelegate` once at init/bind time** — the delegate is consulted on every `onInitializeAccessibilityNodeInfo` call. There is no need to reset it on text changes.
- **`android:hint` in XML is still useful** — keep `android:hint` for the visual placeholder. The delegate's `info.hintText` handles the AT path; the XML `hint` handles the visual path. They can coexist with the same string resource.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** All user interface components must have a name that can be programmatically determined. An `EditText` whose only label is `android:hint` has no programmatically determinable name once the field contains text — the hint disappears from the accessibility node. TalkBack announces the field's content without any label, making it impossible for users to identify which field they are editing. This is a direct violation of 4.1.2: the component's name is no longer determinable by assistive technology.
