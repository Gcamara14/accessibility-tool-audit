# Catalyst Template: Name — Duplicate Name for Multiple Elements (Repeated / Non-Unique Names)

**Template ID:** `WA11Y-AND-4.1.2-003`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-003`
**Source Tickets:** CEPG-370217, CELISTS-30282
**Source PRs:** [walmart-glass #139072](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139072), [walmart-glass #125280](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/125280)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

Multiple interactive elements on the same screen share **identical `contentDescription` values**, making it impossible for TalkBack users to distinguish which button or control does what. Common offenders:

- Multiple "Add to cart" buttons on a search results or list page — every button announces the same text
- A Walmart+ banner heading that announces only the heading copy without the brand prefix, sounding identical to other promotional banners on the same page
- Multiple "Edit" or "Delete" buttons in a list, each reading only "Edit" or "Delete" with no product name context

**Symptom (Jira):** "TalkBack users can't tell which 'Add to cart' button belongs to which product", "Multiple buttons with the same announcement", "Button not descriptive", "'Add to cart' is not descriptive on the [feature] screen".

---

## ✅ The Fix Pattern

### Scenario A: Prepend brand/context prefix to banner heading

**❌ Bad Code:**
```kotlin
// Banner heading announces only the CMS-provided heading text.
// If multiple marketing banners share similar copy, they sound identical.
binding.itemWalmartPlusHeading.text = data.heading
// TalkBack says: "Try Walmart+, button"
// (same as any other promotional headline — no Walmart+ brand context)
```

**✅ Good Code:**
```kotlin
// Prepend a fixed brand label so TalkBack disambiguates the component type.
// TalkBack says: "Walmart+, Try Walmart+, button"
binding.itemWalmartPlusHeading.contentDescription =
    string(R.string.item_walmart_plus_ada_label) + ", " + data.heading

binding.itemWalmartPlusHeading.text = data.heading  // visual text unchanged
```

```xml
<!-- strings.xml -->
<string name="item_walmart_plus_ada_label">Walmart+</string>
```

---

### Scenario B: "Add to cart" / stepper button — append product name

**❌ Bad Code:**
```kotlin
// Every "Add to cart" button has the same contentDescription.
// TalkBack user on a page with 20 products hears "Add to cart" 20 times
// with no way to know which product each button belongs to.
binding.listsItemDetailAddCartButton.contentDescription =
    string(R.string.add_to_cart_label)
// → "Add to cart, button"
```

**✅ Good Code:**
```kotlin
// Append the product name so each button is uniquely identifiable.
val label = "${string(R.string.add_to_cart_label)}, ${item.productName}"
binding.listsItemDetailAddCartButton.contentDescription = label
// → "Add to cart, Great Value 2% Milk 1 gallon, button"

// For a quantity stepper:
val stepperLabel = descriptionsProvider.getLabelDescription(
    quantity = stepper.getQuantity()
    // descriptionsProvider builds: "Great Value 2% Milk, 2 items in cart"
)
stepper.contentDescription = stepperLabel
stepper.importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_YES
```

---

### Scenario C: Repeated action buttons in a list ("Edit", "Delete", "Select")

**❌ Bad Code:**
```xml
<!-- Every row in the list has a button with this same string -->
<Button
    android:id="@+id/edit_button"
    android:text="@string/edit"
    android:contentDescription="@string/edit" />
<!-- TalkBack: "Edit, button" — same on every row -->
```

**✅ Good Code:**
```kotlin
// In ViewHolder bind — append item identity to the action label
holder.binding.editButton.contentDescription =
    string(R.string.edit_item_accessible_label, "itemName" to item.name)
// → "Edit, Savings Account ending in 1234, button"

// Or use ICU format:
// strings.xml: <string name="edit_item_accessible_label">Edit, {itemName}</string>
```

---

## 🔑 Key Rules

- **Every interactive element that appears in a list or group must have a unique `contentDescription`** that includes enough context to distinguish it from sibling elements. Action verb alone ("Add to cart", "Edit", "Delete") is never sufficient when the same action appears multiple times.
- **Append the item name / product name / account name** to the verb: "Add to cart, Great Value 2% Milk" is scannable; "Add to cart" repeated 20 times is not.
- **The visual `text` does not need to change** — only `contentDescription` carries the extra context. Use `view.contentDescription = longLabel` while keeping `view.text = shortLabel` for the visual.
- **Brand-prefix pattern** (Scenario A) is useful when a component type appears multiple times with different copy. Adding a stable prefix ("Walmart+", "Sale", "Sponsored") gives context before the variable content.
- **Do not pad the label excessively** — TalkBack announces the full string. "Add to cart, Great Value 2% Milk Gallon, 1-gallon jug, refrigerated dairy, button" is too long. Aim for label + short identifier only.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The accessible name of every user interface component must be programmatically determinable and must uniquely identify the component in context. When multiple identical "Add to cart" buttons appear on a page without product-name disambiguation, screen-reader users cannot determine which component they are about to activate, violating both the Name requirement and the practical purpose of WCAG 4.1.2.
