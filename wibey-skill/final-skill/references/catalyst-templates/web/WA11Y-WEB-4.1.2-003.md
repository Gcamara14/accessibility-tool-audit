# Catalyst Template: Name: Duplicate Name for Multiple Elements (Repeated Names)

**Template ID:** `WA11Y-WEB-4.1.2-003`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem
Multiple elements use the same accessible name, leading to ambiguity for assistive technologies.

**Expected Result:** Each interactive element should have a unique accessible name to avoid confusion.
**Actual Result:** Several elements share the same accessible name, such as multiple 'add to cart' buttons on an item tile.

---

## ✅ The Fix Patterns

> **Recommendation:** Assign unique and descriptive accessible names to each element to differentiate their functions. Add a unique identifier to the name or a unique keyword to make each name unique.

### Standard Implementation
```html
// Best: Visible Identifier
        <button>Buy Pizza Margherita – Small</button>
        <button>Buy Pizza Margherita – Large</button>
        
        // Good: aria-label with unique identifier or keyword
        <button aria-label="Buy Small Pizza Margherita">Buy</button>
        <button aria-label="Buy Large Pizza Margherita">Buy</button>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

---

## Metadata

| Field | Value |
|---|---|
| Jira | CEPG-330515-B (note: ticket references CEPG-330655 in commit message — same PR scope) |
| PR | #157006 |
| Commit | `656f126647fd476dee75189b7d5e3b82268444d7` |
| Author | Elsa Vuong — vn54arc (Elsa.Vuong@walmart.com) |
| WCAG Criterion | 4.1.2 Name, Role, Value — Duplicate Name for Multiple Elements (Repeated Names) |
| Template ID | WA11Y-WEB-4.1.2-003 (EXISTING — adding Variation) |
| Domain | Transaction / Checkout |
| Team | Checkout Experience (CEPG-* Jira prefix) |
| Primary File | `libs/ui/product-tile/src/lib/vertical/product-promo.tsx` |
| Test File | `libs/ui/product-tile/src/__tests__/integration/product-promo.spec.tsx` |

---

## Template Routing Decision

**Decision: EXISTING VARIATION — add to WA11Y-WEB-4.1.2-003**

Template WA11Y-WEB-4.1.2-003 covers "Duplicate Name for Multiple Elements (Repeated Names)."
This PR is a canonical real-world instance of exactly that problem: a `ProductPromo` component
rendered multiple CTA buttons ("Add to cart", "See details", secondary actions) that all
shared the same generic visible label text — `ctaText` or `secondaryText` — with no
distinguishing product-specific context in their accessible names. Screen readers announced
each as identical, making it impossible to tell which promo item each button corresponded to.

The fix refactors `getCtaAriaLabel()` into a parameterized function that appends `productName`
to every CTA button's `aria-label`, producing unique, descriptive names across all repeated
button instances. Two additional edge cases are handled:

1. When `actionText === m(messages, "signIn")` — the Sign In button deliberately returns
   `undefined` (no aria-label override) to avoid doubling up on an already-descriptive name.
2. When `wholeBannerClickable` is true — the button is redundant with the whole-banner click
   target; `aria-label` is suppressed (`undefined`) to avoid duplication at the AT level.

This is a production-quality, nuanced pattern worth preserving: it shows both how to make
duplicate CTA names unique AND how to correctly suppress aria-label in cases where adding one
would create a new form of duplication.

---

## Variation: Parameterized `getCtaAriaLabel()` Appending `productName` to Repeated CTA Buttons (ProductPromo)

**Source:** CEPG-330515-B / PR #157006 — `libs/ui/product-tile/src/lib/vertical/product-promo.tsx`

**Context:** The `ProductPromo` component is used in checkout/cart flows to display promotional
banners for items. Each banner can contain up to three interactive elements — a primary CTA
button (`ctaText`), a secondary action button (`secondaryText`), and a whole-banner clickable
wrapper. When multiple promos appear on one page (common in checkout), all primary CTAs shared
the same visible label (e.g., "Add to cart") with no product context. Screen readers announced
every button identically, making navigation confusing for AT users.

---

### Bad Code

```tsx
// ❌ BAD — getCtaAriaLabel() ignores productName for non-MQDT scenarios.
// Multiple ProductPromo instances on the same page all render buttons with
// the same aria-label — screen reader announces "Add to cart, button" for each,
// with no product context.

const getCtaAriaLabel = () => {
  if (isMQDT) {
    // MQDT path: does include productName — but this is the only branch that did
    return [ctaText, primaryText, secondaryText, productName]
      .filter(Boolean)
      .join(", ");
  } else if (showDetails) {
    // Details path: includes ctaText + "savings" but NOT productName
    return [`${ctaText} ${m(messages, "savings")}`, productName]
      .filter(Boolean)
      .join(", ");
  } else {
    // Default path: returns undefined — no accessible name override at all
    return undefined;
  }
};

// Primary CTA button — aria-label from getCtaAriaLabel() with no args
<Button
  size="small"
  className="f7 navy ph0 h-auto"
  onClick={showDetails || isMQDT ? handleCallback : undefined}
  aria-label={getCtaAriaLabel()}  // ❌ no product context in non-MQDT branches
>
  {ctaText}
</Button>

// Secondary button — NO aria-label at all
<Button
  className={classNames({...})}
  variant="tertiary"
  onClick={onSecondaryTextClick}
  // ❌ Missing aria-label entirely — secondaryText is also a repeated generic string
>
  {secondaryText}
</Button>
```

---

### Good Code

```tsx
// ✅ GOOD — getCtaAriaLabel() is refactored into a parameterized function.
// productName is appended to every non-suppressed aria-label, making each
// CTA button unique across all ProductPromo instances on the page.
// Two suppression cases are handled explicitly:
//   1. signIn button — already descriptive, no override needed
//   2. wholeBannerClickable — button is redundant with banner; suppress to avoid duplication

const getCtaAriaLabel = (
  actionText?: string,
  firstText?: string,
  secondText?: string,
  itemName?: string | null,
  announceAllTexts?: boolean
) => {
  // Case 1: Sign In button — never override its accessible name
  // Case 2: wholeBannerClickable — button is a keyboard duplicate of the banner itself;
  //         suppress aria-label to avoid AT announcing the same target twice
  if (actionText === m(messages, "signIn") || wholeBannerClickable) {
    return undefined;
  } else if (showDetails) {
    // Details path — announce "See savings" + product name
    return [`${actionText} ${m(messages, "savings")}`, itemName]
      .filter(Boolean)
      .join(", ");
  } else if (announceAllTexts) {
    // MQDT path — announce full context: action + primary + secondary + product name
    return [actionText, firstText, secondText, itemName]
      .filter(Boolean)
      .join(", ");
  } else {
    // Default path — announce action + product name (minimum unique label)
    return [actionText, itemName].filter(Boolean).join(", ");
  }
};

// Primary CTA button — all args passed explicitly
<Button
  size="small"
  className="f7 navy ph0 h-auto"
  onClick={showDetails || isMQDT ? handleCallback : undefined}
  aria-label={getCtaAriaLabel(
    ctaText,       // actionText — e.g., "Add to cart"
    primaryText,   // firstText  — promo headline
    secondaryText, // secondText — promo subtext
    productName,   // itemName   — e.g., "Great Value Whole Milk 1 Gallon"
    isMQDT         // announceAllTexts — true only in MQDT multi-text scenario
  )}
>
  {ctaText}
</Button>

// Secondary button — now has aria-label with product context
<Button
  className={classNames({...})}
  variant="tertiary"
  onClick={onSecondaryTextClick}
  aria-label={getCtaAriaLabel(
    secondaryText, // actionText — e.g., "See details"
    undefined,
    undefined,
    productName    // itemName — product context added
  )}
>
  {secondaryText}
</Button>
```

---

### Explanation

The root cause is a common React anti-pattern in component libraries: `getCtaAriaLabel()` was
a zero-argument closure that captured component-level props directly. This tightly coupled the
accessible name logic to the component's top-level scope, making it impossible to re-use the
same logic for the secondary button (which has different text values) and making it easy to
accidentally omit `productName` in certain branches.

The fix converts the function to accept explicit parameters. This has two key benefits:

1. **Every call site must declare what information it contributes.** The secondary button call
   site `getCtaAriaLabel(secondaryText, undefined, undefined, productName)` makes it immediately
   obvious that `productName` is being included and which text is the action label.

2. **Suppression logic is centralized.** Both special cases — the Sign In button and the
   whole-banner-clickable scenario — are handled in a single function body, eliminating the risk
   of one call site handling the edge case while another misses it.

The `wholeBannerClickable` guard deserves special attention: when the entire promo banner is
itself a clickable element (keyboard and mouse), adding an `aria-label` to the button inside
it would cause screen readers to announce the same action twice. Returning `undefined` here is
correct WCAG practice — the visible text of the button (`ctaText`) is sufficient when the
button is the only interactive target in scope (because the banner wrapping it is clickable and
will already announce the combined context).

The `isMQDT` (Multi-Quantity Discount Threshold) flag triggers `announceAllTexts`, which
passes all four text pieces to the function. This ensures that MQDT promos — which have richer
multi-part text — produce a full announcement, while standard single-CTA promos use the
minimal `[actionText, itemName]` form.

---

### Unit Test Pattern (from PR)

```tsx
// product-promo.spec.tsx — updated test names and assertions

it("should include product name in aria-label but not include undefined when isMQDT is true", () => {
  render(
    <ProductPromo
      promoStatus={PromoStatuses.PRIMARY}
      isMQDT={true}
      ctaText="Add to cart"
      primaryText="Save $5"
      secondaryText={undefined}    // ← was causing "undefined" to appear in old code
      productName="Great Value Whole Milk"
      // ...other required props
    />
  );
  const button = screen.getByRole("button", { name: /Add to cart/ });
  expect(button).toHaveAttribute(
    "aria-label",
    "Add to cart, Save $5, Great Value Whole Milk"
  );
  // Verify "undefined" is NOT in the label (filter(Boolean) guards this)
  expect(button.getAttribute("aria-label")).not.toContain("undefined");
});

it("should construct correct aria-label with all text elements when isMQDT is true", () => {
  render(
    <ProductPromo
      promoStatus={PromoStatuses.PRIMARY}
      isMQDT={true}
      ctaText="Add to cart"
      primaryText="Save $5"
      secondaryText="Buy 2 save more"
      productName="Great Value Whole Milk"
      // ...other required props
    />
  );
  const button = screen.getByRole("button", { name: /Add to cart/ });
  expect(button).toHaveAttribute(
    "aria-label",
    "Add to cart, Save $5, Buy 2 save more, Great Value Whole Milk"
  );
});

it("should return undefined aria-label for sign in button", () => {
  render(
    <ProductPromo
      promoStatus={PromoStatuses.PRIMARY}
      showMQD={true}
      isItemPromoUnlock={true}
      ctaText="Sign in"       // ← triggers signIn suppression
      productName="Any Product"
      // ...other required props
    />
  );
  const signInButton = screen.getByRole("button", { name: "Sign in" });
  // aria-label should be undefined — visible text "Sign in" is the accessible name
  expect(signInButton).not.toHaveAttribute("aria-label");
});
```

---

### Human Review Checklist

- [ ] Screen reader test (NVDA+Chrome): navigate a checkout page with 3+ ProductPromo tiles.
      Verify each CTA button announces a unique name including the product name.
- [ ] Verify `signIn` string comparison uses the correct i18n key (`m(messages, "signIn")`) —
      if the locale string changes, the suppression check will silently break.
- [ ] Confirm `wholeBannerClickable` logic is correct after the `isMQDT` + `!isMQDT` guard
      added to the `wholeBannerClickable` derivation in the same commit. The new logic:
      `showMQD && !isMQDT ? hasClickableBanner && hasMQDSignin : hasClickableBanner && !isMQDT`
      means MQDT banners are NEVER whole-banner-clickable — verify this is the intended UX.
- [ ] Verify secondary button `aria-label` is tested (not just primary CTA).
- [ ] Check if there is a third render branch for the promo component (alternate layout) — the
      diff shows a third `<Button>` at line ~477. Confirm all three CTA call sites now pass
      `productName` to `getCtaAriaLabel()`.
- [ ] Run axe/Deque audit on the checkout page with duplicate promo tiles to confirm 4.1.2
      duplicate-name violations are resolved.

---

## TEAMS_UPDATE

```
File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Transaction/payments-checkout.md

Content:
**[2026-03-23] CEPG-330515-B / PR #157006 — Duplicate CTA names in ProductPromo fixed by parameterizing getCtaAriaLabel() (WCAG 4.1.2):**
The `ProductPromo` component (`libs/ui/product-tile/src/lib/vertical/product-promo.tsx`) renders
multiple CTA buttons per promo tile. When multiple promo tiles appear on one page, all buttons
shared the same generic accessible name (`ctaText` with no product context). The fix refactors
`getCtaAriaLabel()` from a zero-argument closure (capturing closure vars) to an explicit
parameterized function — every call site must now pass `actionText`, `itemName`, etc.
`productName` is appended to every non-suppressed label, producing unique names.

Two explicit suppression cases are established in this codebase:
1. `actionText === m(messages, "signIn")` — Sign In button: return `undefined` (visible text is
   already descriptive; adding aria-label would be redundant).
2. `wholeBannerClickable === true` — entire banner is clickable: return `undefined` to prevent
   duplicate announcement of the same interactive target.

Architectural pattern to follow for all future CTA buttons in product-tile components:
```tsx
// Pattern: always append productName/itemName to non-suppressed CTA aria-labels
aria-label={getCtaAriaLabel(actionText, ..., productName)}

// Suppression pattern — two valid cases for returning undefined:
if (actionText === m(messages, "signIn") || wholeBannerClickable) return undefined;
```

Author: Elsa Vuong (Elsa.Vuong@walmart.com)
File: `libs/ui/product-tile/src/lib/vertical/product-promo.tsx`
Template: WA11Y-WEB-4.1.2-003 (Variation added 2026-03-23)
```
