# LD `Select` Component — Web (React) Props Reference

**System:** Living Design (LD)
**Platform:** Web / React
**Component Map Key:** `DS-CE-Component-LD-Select`
**Doc Site:** https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/select
**Date Ingested:** 2026-03-19

---

## Overview

The LD `Select` renders a single-selection dropdown backed by the native `<select>` element. The `label` prop is **required for accessibility** — its omission is a direct WCAG 1.3.1 and 4.1.2 failure. There is no `a11yLabelledBy` prop; the `label` prop is the canonical accessibility mechanism. Use `selectProps` to pass additional ARIA attributes to the underlying `<select>`.

---

## Standard Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `ReactNode` | — | ✅ | The visible accessible label for the select. **Required for WCAG compliance.** |
| `children` | `ReactNode` | — | ✅ | `<option>` elements that populate the dropdown. |
| `onChange` | `(event: ChangeEvent<HTMLSelectElement>) => void` | — | ✅ | Callback fired when the selected value changes. |
| `value` | `string` | — | — | The controlled selected value. |
| `size` | `'small' \| 'large'` | `'large'` | — | Controls select field size/density. |
| `disabled` | `boolean` | `false` | — | Disables the select. |
| `id` | `string` | — | — | Sets the `id` on the `<select>` element. |
| `helperText` | `ReactNode` | — | — | Secondary text rendered below the label. |
| `error` | `ReactNode` | — | — | Error message. Overrides `helperText` and applies error styling. |
| `leadingIcon` | `ReactNode` | — | — | Icon rendered before the select input. |
| `selectProps` | `SelectHTMLAttributes<HTMLSelectElement>` | — | — | **Escape hatch:** props spread to the underlying `<select>`. Use for `aria-required`, `aria-describedby`, etc. |
| `isMagic` | `boolean` | `false` | — | Applies AI-generated visual treatment and accessible description. |
| `a11yMagicLabel` | `string` | `'AI Generated'` | — | Customizes the accessible description when `isMagic` is enabled. |
| `UNSAFE_className` | `string` | — | — | Additional CSS class on root. Use with caution. |
| `UNSAFE_style` | `CSSProperties` | — | — | Inline style override. Use with caution. |

---

## ♿ Accessibility Props & Guidance

> ℹ️ **No `a11yLabelledBy` prop exists.** The `label` prop is the single source of truth for the accessible name. For advanced ARIA patterns, use `selectProps`.

| Prop / Approach | How | WCAG Criterion | Notes |
|---|---|---|---|
| Visible label | `label` prop | **1.3.1 Info and Relationships** / **4.1.2** | **Required.** LD associates `label` with the `<select>` via a `<label>` element. Never omit. |
| Required field | `selectProps={{ 'aria-required': true }}` | **3.3.2 Labels or Instructions** | LD has no `isRequired` prop. Use `selectProps` to set `aria-required`. |
| Error association | `error` prop | **3.3.1 Error Identification** | LD's `error` prop renders error text associated with the field. For custom error UI, use `selectProps={{ 'aria-describedby': 'error-id' }}`. |
| External label override | `selectProps={{ 'aria-labelledby': 'external-label-id' }}` | **4.1.2 Name, Role, Value** | When the select's label lives outside the component (e.g., a table column header), use `selectProps` to override the accessible name. |
| AI-generated value | `isMagic` + `a11yMagicLabel` | **3.3.2 Labels or Instructions** | Adds an accessible description (default: "AI Generated") when the selection is AI-influenced. |

---

## ⚠️ WCAG Failure Patterns

### ❌ Missing `label` Prop

> ⚠️ **WCAG 1.3.1 + 4.1.2 Failure:** The select has no programmatic label. Screen readers announce only "combo box" with no context.

```tsx
// BAD — no label; useless for AT users
<Select onChange={(e) => setSort(e.target.value)} value={sort}>
  <option value="relevance">Relevance</option>
  <option value="price-asc">Price: Low to High</option>
</Select>

// GOOD — label is required
<Select
  label="Sort by"
  onChange={(e) => setSort(e.target.value)}
  value={sort}
>
  <option value="relevance">Relevance</option>
  <option value="price-asc">Price: Low to High</option>
</Select>
```

---

### ❌ Required Field Not Communicated to AT

```tsx
// BAD — asterisk in label only; AT cannot determine field is required
<Select label="State *" onChange={handleChange}>
  <option value="">Select a state</option>
</Select>

// GOOD — aria-required via selectProps
<Select
  label="State"
  onChange={handleChange}
  selectProps={{ 'aria-required': true }}
>
  <option value="">Select a state</option>
</Select>
```

---

### ❌ No Empty/Placeholder Option — AT Confusion on Initial Focus

```tsx
// BAD — first real option is pre-selected; user may not realize a choice is needed
<Select label="Delivery window" onChange={handleChange}>
  <option value="morning">8am – 12pm</option>
  <option value="afternoon">12pm – 5pm</option>
</Select>

// GOOD — include a placeholder option to signal selection is required
<Select label="Delivery window" onChange={handleChange} value="">
  <option value="" disabled>Choose a window</option>
  <option value="morning">8am – 12pm</option>
  <option value="afternoon">12pm – 5pm</option>
</Select>
```

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|---|---|---|
| 1.3.1 Info and Relationships | A | `label` prop creates a programmatic `<label>` → `<select>` association. |
| 3.3.1 Error Identification | A | `error` prop surfaces error text associated with the select. |
| 3.3.2 Labels or Instructions | A | `label` is required; `helperText` provides instructions; `aria-required` via `selectProps`. |
| 4.1.2 Name, Role, Value | A | Name from `label`; role is `combobox`; value is the selected `<option>`. |
