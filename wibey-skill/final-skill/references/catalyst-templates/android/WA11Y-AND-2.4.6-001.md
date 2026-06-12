# Catalyst Template: Labels — Generic "View" / "Edit" / "Delete" Button Has No Context (Ambiguous Label in List)

**Template ID:** `WA11Y-AND-2.4.6-001`
**Platform:** Android
**WCAG Criterion:** 2.4.6 Headings and Labels
**Jira Label:** `WA11Y-AND-2.4.6-001`
**Source Tickets:** CSRETPB-94029
**Source PRs:** [walmart-glass #136272](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/136272)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A list of items (policies, products, orders) shows a `"View"` button on each row. All buttons have identical visible text: **"View"**. TalkBack announces each one as **"View, Button"**.

A sighted user can see which row the button belongs to. A TalkBack user swiping through the list hears:

> *"Walmart Travel Policy, View, Button, Procurement Policy, View, Button, IT Equipment Policy, View, Button"*

All three buttons are labelled identically. The user cannot tell which policy they are about to open without manually tracking their position in the list.

This failure applies to any action button with a generic one-word label in a list context:
- `"View"` — links into a detail page for the row item
- `"Edit"` — opens an edit form for the row item  
- `"Delete"` / `"Remove"` — deletes the row item
- `"Select"` — selects the row item
- `"See similar items"` — filter/browse shortcut per product

**Symptom (Jira):** "All 'View' buttons sound identical to TalkBack", "Screen reader can't distinguish 'View' buttons in policy list", "Edit buttons not unique for TalkBack", "Delete button has no context for which item it deletes", "WCAG 2.4.6 violation: labels don't describe purpose".

---

## ✅ The Fix Pattern

### Append the item name to the `contentDescription`

Keep the visible button text as-is (visual users can read the row label). Set a richer `contentDescription` that includes the item name:

**❌ Bad Code:**
```kotlin
// All "View" buttons in the list are announced identically by TalkBack.
// TalkBack: "View, Button" — no context which policy this opens.
binding.viewLink.setOnClickListener { openPolicy(policy) }
// ← No contentDescription → TalkBack reads the button's visible text: "View"
```

**✅ Good Code:**
```kotlin
// Set a contentDescription that includes the policy name.
// TalkBack: "View Walmart Travel Policy, Button" — unambiguous.
binding.viewLink.contentDescription = string(
    R.string.spendpolicy_view_with_policy_name,
    "policy_name" to policy.label
)
binding.viewLink.setOnClickListener { openPolicy(policy) }
```

```xml
<!-- strings.xml -->
<string name="spendpolicy_view_with_policy_name">View {policy_name}</string>
```

---

### Generalised pattern for any action button in a list

```kotlin
// Generic pattern — replace action and item name variables:
button.contentDescription = string(
    R.string.action_with_item_name,
    "item_name" to item.displayName
)

// strings.xml entries follow "{action} {item_name}" convention:
// <string name="cart_edit_item">Edit {item_name}</string>
// <string name="cart_remove_item">Remove {item_name}</string>
// <string name="orders_view_order">View order {order_number}</string>
// <string name="product_see_similar">See similar items of {product_name}</string>
```

---

### When to use `contentDescription` vs `text`

| Scenario | Approach |
|---|---|
| Button text AND context needed | Set `text = "View"`, set `contentDescription = "View {item_name}"` |
| Button shows full context visually | No `contentDescription` needed (visual text is already contextual) |
| Icon-only button (no text) | Set `contentDescription = "{action} {item_name}"` |
| Button is a `TextButton` with the item name already in it | No change needed — text itself is sufficient |

---

### Product tile secondary actions ("See similar items")

The same pattern applies to product tile secondary action labels where multiple tiles on the same screen share a generic label:

```kotlin
// ❌ Bad: every "See similar items" button is announced the same way
binding.seeSimilarButton.text = "See similar items"
// TalkBack: "See similar items, Button" × 12 product tiles

// ✅ Good: contextualised with product name
val contentDescription = productName?.let {
    string(
        R.string.tempo_shared_label_secondary_content_description,
        "title" to tempoSeeSimilarSanitized,
        "productName" to productName
    )
}
binding.seeSimilarButton.text = tempoSeeSimilarSanitized
binding.seeSimilarButton.contentDescription = contentDescription
// TalkBack: "See similar items of Great Value Whole Milk, Button"
```

```xml
<!-- strings.xml -->
<string name="tempo_shared_label_secondary_content_description">{title} of {productName}</string>
```

---

### Exceptions — when a generic label is acceptable

- **Single button on screen** — if there is only one "View" button visible, the context is unambiguous.
- **Button is the only interactive element in a fully labelled row** — if TalkBack groups the row's label with the button into a single focus point (via `contentDescription` on the parent), the individual button does not need its own description.
- **The item name is in the button text** — if the button already reads "View Walmart Travel Policy" (full text), no override is needed.

---

## 🔑 Key Rules

- **Every action button in a list must have a unique, contextual `contentDescription`** — "View", "Edit", "Delete", "Select", "Manage" are not sufficient labels when multiple instances appear on the same screen.
- **The `contentDescription` does not need to match the visible text** — the visual label can remain short ("View") while the accessible name is long ("View Walmart Travel Policy"). These serve different users.
- **String format: `"{action} {item_name}"`** — this order matches how TalkBack users expect to hear the announcement: action first ("View"), then disambiguation ("Walmart Travel Policy"). Do not reverse: `"{item_name}, {action}"` makes it sound like the item name is a button.
- **Use ICU string placeholders** — parameterise the item name via `{item_name}` in `strings.xml`. Never concatenate strings in code: `"View " + policy.label` breaks localization for RTL languages and concatenation-sensitive locales.
- **Audit on RecyclerView bind** — `contentDescription` must be set during every `onBindViewHolder` call, not just the first bind. Items are recycled; without re-binding, a "View" button may inherit a stale `contentDescription` from a previous row.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.6 (Headings and Labels):** Labels provided to identify user interface components must be descriptive. A "View" button in a list of policies fails this criterion because the label "View" does not describe which item will be viewed — it only describes the action class. TalkBack users cannot distinguish between multiple "View, Button" announcements and cannot predict the outcome of activating any of them. The label must be descriptive enough for the user to understand the purpose of the component without additional context.
