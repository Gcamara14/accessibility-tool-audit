# LD Radio — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/radio/guidelines/RadioGuidelines.tsx`
**Import:** `import { Radio } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `onChange` | Function | YES | — | e.g. `() => setChecked(true)` |
| `checked` | boolean | no | `false` (stateful) | Controlled checked state |
| `disabled` | boolean | no | `false` | |
| `label` | string | no | — | Visible label text; also the accessible name |
| `name` | string | no | — | Groups radios; all options in a group must share the same `name` |

> **Note:** `value`, `defaultChecked`, `id`, `helpText` are NOT shown in the official sandbox — use with caution, may be unverified. The sandbox-confirmed props are the 5 above.

## Usage Examples

```tsx
// Controlled radio group — always wrap in FormGroup
const [selected, setSelected] = React.useState("standard");

<FormGroup label="Shipping method">
  <Radio
    checked={selected === "standard"}
    label="Standard (5-7 days)"
    name="shipping"
    onChange={() => setSelected("standard")}
  />
  <Radio
    checked={selected === "express"}
    label="Express (2-3 days)"
    name="shipping"
    onChange={() => setSelected("express")}
  />
  <Radio
    checked={selected === "overnight"}
    label="Overnight (next day)"
    name="shipping"
    onChange={() => setSelected("overnight")}
  />
</FormGroup>
```

## A11Y Notes

- **Always wrap radios in `FormGroup` with a `label`** — standalone radios have no group context (WCAG 1.3.1 failure).
- `name` groups radio buttons — all options in a group must share the SAME `name`. Per-item unique names break the group. See template `WA11Y-WEB-1.3.1-004`.
- `label` is the accessible name for the individual radio option. Omitting it is a WCAG 4.1.2 failure.
- `onChange` is REQUIRED.

## ⚠️ WCAG Failure Patterns

### ❌ Unique name per item (radios not grouped)
```tsx
// BAD — name={loc} makes each radio independent (real bug: WSC-3897)
{locations.map((loc) => (
  <Radio key={loc} label={loc} name={loc} onChange={handleChange} />
))}

// GOOD — shared name groups them
{locations.map((loc) => (
  <Radio key={loc} label={loc} name="selectLocation" onChange={handleChange} />
))}
```

### ❌ No FormGroup / group label
```tsx
// BAD — AT cannot determine what is being selected
<Radio label="Yes" name="consent" onChange={() => setConsent("yes")} />
<Radio label="No" name="consent" onChange={() => setConsent("no")} />

// GOOD
<FormGroup label="Do you accept the terms?">
  <Radio label="Yes" name="consent" onChange={() => setConsent("yes")} />
  <Radio label="No" name="consent" onChange={() => setConsent("no")} />
</FormGroup>
```

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | Group label via `FormGroup`; `name` links options together. |
| 4.1.2 Name, Role, Value | A | `label` provides accessible name; native radio provides role and state. |
