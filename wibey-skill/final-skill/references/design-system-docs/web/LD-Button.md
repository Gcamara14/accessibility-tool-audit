# LD `Button` Component — Web (React) Props Reference

**System:** Living Design (LD)
**Platform:** Web / React
**Component Map Key:** `DS-CE-Component-LD-Button`
**Doc Site:** https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/button
**Date Ingested:** 2026-03-19

---

## Overview

The LD `Button` triggers actions and choices with a single press. It renders as a `<button>` by default, or as an `<a>` anchor element when `href` is provided. Because it is an interactive control, it must always have a programmatic accessible name — either via visible `children` text or an `aria-label` override for icon-only scenarios (use `IconButton` instead for icon-only cases).

---

## Standard Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✅ | The visible label content of the button. |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive'` | `'secondary'` | — | Visual style of the button. |
| `size` | `'large' \| 'medium' \| 'small'` | `'small'` | — | Controls button size/density. |
| `href` | `string` | — | — | When provided, renders as an `<a>` anchor (link button). |
| `isFullWidth` | `boolean` | `false` | — | Stretches button to full container width. |
| `leading` | `ReactNode` | — | — | Content rendered before the label (e.g., an icon). |
| `trailing` | `ReactNode` | — | — | Content rendered after the label (e.g., an icon). |
| `UNSAFE_className` | `string` | — | — | Additional CSS class. Use with caution — may break design tokens. |
| `UNSAFE_style` | `CSSProperties` | — | — | Inline style override. Use with caution. |

---

## ♿ Accessibility Props & Guidance

> ⚠️ **The LD Button does not expose explicit `aria-label` or `a11yLabelledBy` props.** Accessibility is expected to be carried by the visible `children` text. Native HTML attributes can be passed directly to the component.

| Approach | How | WCAG Criterion | Notes |
|---|---|---|---|
| Visible label | `children` prop | **4.1.2 Name, Role, Value** | The primary and preferred method. Always use descriptive text. |
| `aria-label` override | Pass as native HTML attribute directly: `<Button aria-label="Add to cart">` | **4.1.2 Name, Role, Value** | Only needed when children text is insufficient (e.g., "Add" with no context). |
| Disabled state | `disabled` (native HTML attr) | **4.1.2 Name, Role, Value** | Pass via native HTML attr: `<Button disabled>`. Removes from tab order. |

---

## ⚠️ WCAG Failure Patterns

### ❌ Icon-Only Button with No Accessible Name

> **Use `IconButton` instead for icon-only scenarios.** If you use `Button` with only a `leading` or `trailing` icon and no `children`, the accessible name is empty — a direct WCAG 4.1.2 failure.

```tsx
// BAD — no accessible name
<Button leading={<Icon.Cart />} onClick={addToCart} />

// GOOD — use IconButton for icon-only, which has built-in a11y label support
<IconButton accessibleLabel="Add to cart" onClick={addToCart}>
  <Icon.Cart />
</IconButton>

// ACCEPTABLE — Button with icon + visible text
<Button leading={<Icon.Cart />} onClick={addToCart}>Add to cart</Button>
```

---

### ❌ Ambiguous Label Text

```tsx
// BAD — "Add" repeated 20 times on a product page; AT users can't distinguish
<Button onClick={() => addItem(product.id)}>Add</Button>

// GOOD — use aria-label to provide full context
<Button aria-label={`Add ${product.name} to cart`} onClick={() => addItem(product.id)}>
  Add
</Button>
```

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|---|---|---|
| 2.1.1 Keyboard | A | Button must be keyboard operable. LD handles this natively. |
| 2.4.4 Link Purpose (In Context) | A | When rendered as `href`, link text must describe its destination. |
| 4.1.2 Name, Role, Value | A | `children` provides the name; `role="button"` is set natively; state (disabled) must be programmatic. |
