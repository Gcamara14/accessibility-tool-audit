# Catalyst Template: Name, Role, Value — Quantity Stepper Controls Not Descriptive (Missing Product Context in TalkBack Label)

**Template ID:** `WA11Y-AND-4.1.2-032`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-032`
**Source Tickets:** CELISTS-26633
**Source PRs:** [walmart-glass #126234](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/126234)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A registry product tile renders a quantity stepper (add/decrement/increment control). The stepper has three accessible elements:
- A quantity display TextView (collapsed: shows "Add to cart"; expanded: shows current quantity)
- A decrement button ("−")
- An increment button ("+")

Without product context in the labels, TalkBack announces:
> **"Add to cart, Button"** — collapsed (which product?)
> **"−, Button"** / **"+, Button"** — expanded (decrement/increment what?)

A screen reader user with multiple items on the registry cannot distinguish which stepper controls which product. "Add to cart" and "−" without context are meaningless when there are 10 registry items in the list.

**Expected announcements:**
> **"Add to cart Fisher-Price Rock-a-Stack, Button"** — collapsed, specific product
> **"Decrease quantity Fisher-Price Rock-a-Stack, Button"** — decrement
> **"1 in cart Fisher-Price Rock-a-Stack"** — quantity display
> **"Increase quantity Fisher-Price Rock-a-Stack, Button"** — increment

**Symptom (Jira):** "TalkBack can't tell which product Add to cart applies to", "Stepper buttons not descriptive on registry page", "Decrement and increment controls have no product context for screen reader", "ATC button same label for all items in registry list".

---

## ✅ The Fix Pattern

### `StepperViewState.ContentDescriptions` — inject product-contextual labels

The `StepperViewState` API accepts a `ContentDescriptions` object that overrides the default button/text labels. Build two helper functions — one for the collapsed state, one for the expanded state — that inject the `productName` into each label.

```kotlin
// ProductTileUtils.kt  (registry feature)

/**
 * Returns the accessibility content descriptions for the stepper in its
 * COLLAPSED state (only the "Add to cart" / quantity display is visible).
 *
 * - quantity == 0: "Add to cart {productName}"
 * - quantity > 0:  "{quantity} in cart {productName}"
 */
internal fun getStepperCollapsedDescription(
    quantity: BigDecimal,
    productName: String
): StepperViewState.ContentDescriptions {
    return StepperViewState.ContentDescriptions(
        descTextView = if (quantity > BigDecimal.ZERO) {
            string(
                R.string.registry_product_tile_stepper_quantity_description,
                QUANTITY to quantity,
                PRODUCT_NAME to productName
            )
            // → "1 in cart Fisher-Price Rock-a-Stack"
        } else {
            string(
                R.string.registry_product_tile_stepper_collapsed_description,
                PRODUCT_NAME to productName
            )
            // → "Add to cart Fisher-Price Rock-a-Stack"
        }
    )
}

/**
 * Returns the accessibility content descriptions for the stepper in its
 * EXPANDED state (decrement, quantity display, and increment all visible).
 */
internal fun getStepperExpandedDescription(
    quantity: BigDecimal,
    productName: String
): StepperViewState.ContentDescriptions {
    return StepperViewState.ContentDescriptions(
        descButtonDecrement = string(
            R.string.registry_product_tile_stepper_expanded_decrement_description,
            PRODUCT_NAME to productName
        ),
        // → "Decrease quantity Fisher-Price Rock-a-Stack"

        descTextView = string(
            R.string.registry_product_tile_stepper_quantity_description,
            QUANTITY to quantity,
            PRODUCT_NAME to productName
        ),
        // → "1 in cart Fisher-Price Rock-a-Stack"

        descButtonIncrement = string(
            R.string.registry_product_tile_stepper_expanded_increment_description,
            PRODUCT_NAME to productName
        )
        // → "Increase quantity Fisher-Price Rock-a-Stack"
    )
}
```

---

### `DefaultDescriptionsProvider` implementation — wired into the stepper

```kotlin
// RegistryStepperDescriptionsProvider.kt

class RegistryStepperDescriptionsProvider : DefaultDescriptionsProvider {

    override fun getCollapsedDescriptions(
        context: Context,
        model: StepperData,
        label: String?,
        metadata: StepperMetadata?
    ): StepperViewState.ContentDescriptions {
        return getStepperCollapsedDescription(
            quantity = model.quantity,
            productName = metadata?.productName.orEmpty()
        )
    }

    override fun getExpandedDescriptions(
        context: Context,
        model: StepperData,
        label: String?,
        metadata: StepperMetadata?
    ): StepperViewState.ContentDescriptions {
        return getStepperExpandedDescription(
            quantity = model.quantity,
            productName = metadata?.productName.orEmpty()
        )
    }
}
```

---

### String resources

```xml
<!-- strings.xml -->

<!-- Collapsed state: zero quantity -->
<string name="registry_product_tile_stepper_collapsed_description">Add to cart {productName}</string>
<!-- → "Add to cart Fisher-Price Rock-a-Stack" -->

<!-- Collapsed/expanded: current quantity -->
<string name="registry_product_tile_stepper_quantity_description">{quantity} in cart {productName}</string>
<!-- → "1 in cart Fisher-Price Rock-a-Stack" -->

<!-- Expanded: decrement button -->
<string name="registry_product_tile_stepper_expanded_decrement_description">Decrease quantity {productName}</string>
<!-- → "Decrease quantity Fisher-Price Rock-a-Stack" -->

<!-- Expanded: increment button -->
<string name="registry_product_tile_stepper_expanded_increment_description">Increase quantity {productName}</string>
<!-- → "Increase quantity Fisher-Price Rock-a-Stack" -->
```

---

### ❌ Bad Code — generic labels with no product context

```kotlin
// ❌ Before fix — generic StepperData labels used as-is
stepperController.updateModel(
    stepperData = StepperData(
        maxQuantity = ...,
        minQuantity = BigDecimal.ONE,
        quantity = ...,
        maxLabel = string(R.string.some_max_label)
        // ← No contentDescriptions provided → stepper uses defaults: "Add to cart", "−", "+"
    )
)
// TalkBack: "Add to cart, Button" (which product?)
// TalkBack: "−, Button" (decrement what?)
// TalkBack: "+, Button" (increment what?)
```

---

### Verified TalkBack announcements

```
// Collapsed, quantity = 0:
TalkBack: "Add to cart Fisher-Price Rock-a-Stack, Button"
                       ──────────────────────────
                       product name from metadata

// Collapsed, quantity = 1:
TalkBack: "1 in cart Fisher-Price Rock-a-Stack"

// Expanded, decrement:
TalkBack: "Decrease quantity Fisher-Price Rock-a-Stack, Button"

// Expanded, quantity display:
TalkBack: "2 in cart Fisher-Price Rock-a-Stack"

// Expanded, increment:
TalkBack: "Increase quantity Fisher-Price Rock-a-Stack, Button"
```

---

## 🔑 Key Rules

- **Always include the product name in stepper button labels** — a standalone "Add to cart", "−", or "+" label is not sufficient when multiple items appear in a list. TalkBack users cannot associate the control with the correct product without a product context.
- **Use `StepperViewState.ContentDescriptions` not `contentDescription`** — the stepper component has a `ContentDescriptions` data class designed to accept per-state descriptions. Setting `contentDescription` on the stepper view directly overrides the composite label for all states at once; `ContentDescriptions` provides granular per-element control.
- **Implement both collapsed and expanded descriptions** — steppers have two visual states. Providing descriptions for only one state leaves the other state with generic labels.
- **Inject via `DefaultDescriptionsProvider`** — implementing `DefaultDescriptionsProvider` and passing it to the stepper controller is the clean architectural path. It decouples the label-building logic from the fragment/adapter, enabling unit testing without inflating views.
- **`metadata?.productName.orEmpty()`** — `StepperMetadata.productName` may be null if the item data hasn't fully loaded. Use `.orEmpty()` to produce "Add to cart " (with no name) rather than crashing. Ensure `productName` is populated before the stepper is bound.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name of user interface components must be programmatically determinable. A "−" button without a product name has no determinable name that distinguishes it from any other "−" button on the same screen. When a registry list shows 10 items, each with a decrement button labeled "−", TalkBack users cannot determine which item they are controlling. The accessible name must include enough context to uniquely identify the control's purpose — the product name is that context.
