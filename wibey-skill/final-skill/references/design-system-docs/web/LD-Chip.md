# LD `Chip` Component — Web (React) Props Reference

**System:** Living Design (LD)
**Platform:** Web / React
**Component Map Key:** `DS-CE-Component-LD-Chip`
**Doc Site:** https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/chip
**Source:** https://gecgithub01.walmart.com/LivingDesign/react/tree/main/src/Chip
**Date Ingested:** 2026-03-19

---

## Overview

The LD `Chip` is used for selections, filters, or action triggers. It renders as a `<button>` element and supports selected/unselected toggle states. Because it is interactive and can convey state, it is a high-frequency source of WCAG 4.1.2 failures when the `children` label is absent or ambiguous.

---

## Standard Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✅ | The visible label content of the chip. |
| `selected` | `boolean` | `false` | — | Whether the chip is in a selected/active state. Automatically maps to `aria-pressed`. |
| `disabled` | `boolean` | `false` | — | Disables interaction and dims the chip visually. |
| `size` | `'small' \| 'large'` | `'small'` | — | Controls chip size. |
| `leading` | `ReactNode` | — | — | Content rendered before the label (e.g., an icon). |
| `trailing` | `ReactNode` | — | — | Content rendered after the label (e.g., an icon or remove icon). |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | — | Callback fired when chip is clicked or activated via keyboard. |
| `UNSAFE_className` | `string` | — | — | Additional CSS class. Use with caution. |
| `UNSAFE_style` | `CSSProperties` | — | — | Inline style override. Use with caution. |

---

## ♿ Accessibility Props & Guidance

> ⚠️ **The LD Chip does not expose explicit `aria-label` or `a11yLabelledBy` props.** There are no dedicated accessibility props in the current API. Accessible name comes from `children`. For additional ARIA attributes, pass native HTML attrs directly to the component.

| Approach | How | WCAG Criterion | Notes |
|---|---|---|---|
| Visible label | `children` prop | **4.1.2 Name, Role, Value** | Primary method. Label must be descriptive enough in context. |
| Selected state | `selected` prop | **4.1.2 Name, Role, Value** | LD maps `selected` to `aria-pressed` internally — verify DOM output in your version. |
| `aria-label` override | Pass as native HTML attr: `<Chip aria-label="Filter: Free Shipping">` | **4.1.2 Name, Role, Value** | Use when children text alone lacks sufficient context (e.g., in a filter group). |
| Disabled state | `disabled` prop | **4.1.2 Name, Role, Value** | Removes from tab order. For AT-discoverable disabled chips, pair with `aria-disabled` via `UNSAFE_className` workaround or wrapper. |

---

## ⚠️ WCAG Failure Patterns

### ❌ Icon-Only Chip with No Label

```tsx
// BAD — no accessible name; AT announces nothing meaningful
<Chip leading={<Icon.Filter />} onClick={handleFilter} />

// GOOD — pass aria-label directly as a native HTML attribute
<Chip leading={<Icon.Filter />} aria-label="Filter results" onClick={handleFilter} />
```

---

### ❌ Selected State Not Communicated

> ⚠️ **WCAG Failure Risk:** If `selected` is not passed, toggled state is conveyed only visually (CSS class). Screen readers cannot detect the change.

```tsx
// BAD — visual selection only; AT users hear no state change
<Chip
  className={isSelected ? 'chip--active' : ''}
  onClick={toggle}
>
  Free Shipping
</Chip>

// GOOD — LD maps `selected` to aria-pressed automatically
<Chip selected={isSelected} onClick={toggle}>
  Free Shipping
</Chip>
```

---

### ❌ Ambiguous Label Without Group Context

```tsx
// BAD — "XS", "S", "M" repeated across the page with no context for AT users
<Chip onClick={() => setSize('XS')}>XS</Chip>

// GOOD — aria-label provides full context
<Chip
  aria-label="Size: Extra Small"
  onClick={() => setSize('XS')}
>
  XS
</Chip>
```

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|---|---|---|
| 2.1.1 Keyboard | A | Chip renders as `<button>` — keyboard operable by default. |
| 1.3.1 Info and Relationships | A | Selected state must be programmatic, not only visual. |
| 4.1.2 Name, Role, Value | A | Name via `children`/`aria-label`; role is `button`; value (`aria-pressed`) via `selected` prop. |
