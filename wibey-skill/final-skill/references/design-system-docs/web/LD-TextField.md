# LD `TextField` Component — Web (React) Props Reference

**System:** Living Design (LD)
**Platform:** Web / React
**Component Map Key:** `DS-CE-Component-LD-TextField`
**Doc Site:** https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/text-field
**Date Ingested:** 2026-03-19

---

## Overview

The LD `TextField` is a single-line text entry and editing component. The `label` prop is **required for accessibility** — omitting it is a direct WCAG 1.3.1 and 4.1.2 failure. For additional ARIA attributes, use `textFieldProps` to spread directly onto the underlying `<input>` element.

---

## Standard Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `ReactNode` | — | ✅ | The visible accessible label for the field. **Required for WCAG compliance.** |
| `onChange` | `(event: ChangeEvent<HTMLInputElement>) => void` | — | ✅ | Callback fired on every input change. |
| `value` | `string` | `''` | — | The controlled input value. |
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'search' \| 'tel' \| 'time' \| 'url'` | `'text'` | — | Sets the `<input type>`. Use the correct type for AT to announce input purpose. |
| `size` | `'small' \| 'large'` | `'large'` | — | Controls field size/density. |
| `disabled` | `boolean` | `false` | — | Disables the field. |
| `readOnly` | `boolean` | `false` | — | Makes the field read-only. |
| `id` | `string` | — | — | Sets the `id` on the `<input>`. Use when wiring external labels or `aria-labelledby`. |
| `helperText` | `ReactNode` | — | — | Secondary helper text rendered below the label. |
| `error` | `ReactNode` | — | — | Error message. When set, overrides `helperText` and applies error styling. |
| `leadingIcon` | `ReactNode` | — | — | Icon rendered before the input. |
| `trailing` | `ReactNode` | — | — | Content rendered after the input (e.g., a clear button). |
| `textFieldProps` | `Omit<InputHTMLAttributes<HTMLInputElement>, 'ref'>` | — | — | **Escape hatch:** props spread directly to the underlying `<input>`. Use for `aria-labelledby`, `aria-describedby`, `aria-required`, etc. |
| `isMagic` | `boolean` | `false` | — | Applies AI-generated visual treatment and accessible description. |
| `a11yMagicLabel` | `string` | `'AI Generated'` | — | Customizes the accessible description when `isMagic` is enabled. |
| `UNSAFE_className` | `string` | — | — | Additional CSS class on root. Use with caution. |
| `UNSAFE_style` | `CSSProperties` | — | — | Inline style override. Use with caution. |

---

## ♿ Accessibility Props & Guidance

| Prop / Approach | How | WCAG Criterion | Notes |
|---|---|---|---|
| Visible label | `label` prop | **1.3.1 Info and Relationships** / **4.1.2** | **Required.** LD wires `label` to a `<label>` element associated with the `<input>`. Never omit. |
| Additional labelling | `textFieldProps={{ 'aria-labelledby': 'external-id' }}` | **4.1.2 Name, Role, Value** | Use when the field's label lives outside the component (e.g., a table column header). |
| Error association | `textFieldProps={{ 'aria-describedby': 'error-msg-id' }}` | **3.3.1 Error Identification** | When using a custom error pattern, wire `aria-describedby` to the error message id. The `error` prop handles this automatically in standard usage. |
| Required field | `textFieldProps={{ 'aria-required': true }}` | **3.3.2 Labels or Instructions** | LD does not expose an `isRequired` prop — use `textFieldProps` to set `aria-required`. |
| Input purpose | `type` prop | **1.3.5 Identify Input Purpose** | Use `type="email"`, `type="tel"`, etc. to enable browser autofill and AT input-purpose announcement. |
| AI-generated value | `isMagic` + `a11yMagicLabel` | **3.3.2 Labels or Instructions** | Adds an accessible description (default: "AI Generated") when field value is AI-influenced. |

---

## ⚠️ WCAG Failure Patterns

### ❌ Missing `label` Prop

> ⚠️ **WCAG 1.3.1 + 4.1.2 Failure:** The field has no programmatic label. Screen reader users hear only "edit text" with no context.

```tsx
// BAD — no label; input is announced with zero context
<TextField
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>

// GOOD — label is required
<TextField
  label="Search products"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

---

### ❌ Required Field Not Communicated

```tsx
// BAD — asterisk in label text only; not communicated to AT
<TextField label="Email *" onChange={handleChange} />

// GOOD — aria-required surfaced via textFieldProps
<TextField
  label="Email"
  onChange={handleChange}
  textFieldProps={{ 'aria-required': true }}
/>
```

---

### ❌ Error Not Associated with Input

```tsx
// BAD — error message exists in DOM but isn't linked to the input
<TextField label="ZIP Code" onChange={handleChange} />
<span id="zip-error">Enter a valid 5-digit ZIP code</span>

// GOOD — use the built-in error prop; LD links it automatically
<TextField
  label="ZIP Code"
  onChange={handleChange}
  error="Enter a valid 5-digit ZIP code"
/>

// ALTERNATIVE — wire manually via textFieldProps if using custom error UI
<TextField
  label="ZIP Code"
  onChange={handleChange}
  textFieldProps={{ 'aria-describedby': 'zip-error' }}
/>
```

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|---|---|---|
| 1.3.1 Info and Relationships | A | `label` prop creates a programmatic `<label>` → `<input>` association. |
| 1.3.5 Identify Input Purpose | AA | `type` prop maps to WCAG input purpose tokens (email, tel, etc.). |
| 3.3.1 Error Identification | A | `error` prop surfaces error text associated with the field. |
| 3.3.2 Labels or Instructions | A | `label` is required; `helperText` provides instructions; `aria-required` via `textFieldProps`. |
| 4.1.2 Name, Role, Value | A | Name from `label`; role is `textbox`; value is the controlled `value` prop. |
