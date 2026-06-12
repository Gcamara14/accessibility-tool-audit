# LD FormGroup — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/form-group/guidelines/FormGroupGuidelines.tsx`
**Import:** `import { FormGroup } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | ReactNode | YES | — | `<Checkbox>` or `<Radio>` elements |
| `label` | string | no | — | Group label (equivalent to `<legend>`) |
| `error` | string | no | — | Error message text for the group |
| `helperText` | string | no | — | Supplemental instruction for the group |

> **⚠️ CRITICAL:** The prop is `helperText` (NOT `helpText`). `error` is a **string** (NOT a boolean). There is no separate `errorText` prop — `error` is both the flag and the message text.

## Usage Examples

```tsx
// Basic checkbox group
<FormGroup label="Television Series">
  <Checkbox checked={checked1} label="The Original Series" onChange={() => setChecked1(!checked1)} />
  <Checkbox checked={checked2} label="The Next Generation" onChange={() => setChecked2(!checked2)} />
  <Checkbox checked={checked3} label="Deep Space Nine" onChange={() => setChecked3(!checked3)} />
</FormGroup>

// Radio group
<FormGroup label="Captain">
  <Radio checked={selected === "Kirk"} label="James T. Kirk" name="captain" onChange={() => setSelected("Kirk")} />
  <Radio checked={selected === "Picard"} label="Jean-Luc Picard" name="captain" onChange={() => setSelected("Picard")} />
</FormGroup>

// With helperText
<FormGroup helperText="Which captain is best?" label="Captain">
  ...
</FormGroup>

// With error
<FormGroup error="Not enough television series selected" label="Television Series">
  ...
</FormGroup>
```

## A11Y Notes

- `label` is the group label — equivalent to `<legend>`. Screen readers announce this before each child option.
- Without `FormGroup`, radio/checkbox groups have no group context — WCAG 1.3.1 failure.
- `error` string IS the error message — do not pass a boolean.
- `helperText` (not `helpText`) provides group-level instructions.

## ⚠️ WCAG Failure Patterns

### ❌ Wrong error prop usage
```tsx
// BAD — error is boolean + errorText doesn't exist
<FormGroup label="Shipping" error errorText="Please select a method">

// GOOD — error is a string
<FormGroup label="Shipping" error="Please select a shipping method">
```

### ❌ Wrong helper text prop name
```tsx
// BAD — helpText doesn't exist
<FormGroup label="Notifications" helpText="Select all that apply">

// GOOD — helperText
<FormGroup label="Notifications" helperText="Select all that apply">
```

### ❌ Radio/Checkbox group without FormGroup
```tsx
// BAD — no group context
<Radio label="Standard" name="shipping" onChange={handleChange} />
<Radio label="Express" name="shipping" onChange={handleChange} />

// GOOD
<FormGroup label="Shipping method">
  <Radio label="Standard" name="shipping" onChange={handleChange} />
  <Radio label="Express" name="shipping" onChange={handleChange} />
</FormGroup>
```

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | `label` creates a fieldset/legend equivalent grouping child controls. |
| 3.3.1 Error Identification | A | `error` string surfaces the group-level error message. |
| 3.3.2 Labels or Instructions | A | `helperText` provides group instructions. |
