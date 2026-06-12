# LD `DateField` — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/date-picker/date-field/guidelines/DateFieldGuidelines.tsx`
**Import:** `import { DateField } from "@livingdesign/react"`
**React status:** Released

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `label` | `string` | Yes | — | Visible label. The label should include the expected format, e.g. "Birthdate (MM/dd/yyyy)". |
| `onChange` | `(event) => void` | Yes | — | Called on every change; use `event.target.value` to get the string value. |
| `value` | `string` | — | `""` | Controlled string value (stateful). |
| `disabled` | `boolean` | — | `false` | Disables the field. |
| `readOnly` | `boolean` | — | `false` | Makes the field read-only. |
| `error` | `string` | — | `undefined` | Error message string. When provided, applies error styling and surfaces the message. |
| `helperText` | `string` | — | `undefined` | Helper/format instruction text shown below the field. |
| `format` | `string` | — | `undefined` | Date format string (e.g. `"MM/dd/yyyy"`). |
| `renderError` | `() => string` | — | — | Function that returns a custom validation error message. Overrides the default format-validation error. |
| `size` | `"large" \| "small"` | — | `"large"` | Controls the visual size of the field. |

> **NOTE:** Prop names differ from React Aria / React Stately conventions. The real props are `error` (string, not boolean), `helperText` (not `helpText`), `renderError` (not `errorText`). There is no `required`, `minValue`, `maxValue`, or `defaultValue` prop in the sandbox.

## Usage Examples

```tsx
// Basic controlled usage (from sandbox)
const [value, setValue] = useState("");

<DateField
  label="Birthdate (MM/dd/yyyy)"
  value={value}
  onChange={(event) => setValue(event.target.value)}
/>
```

```tsx
// With error and helper text
<DateField
  label="Expiry date (MM/dd/yyyy)"
  value={value}
  onChange={(event) => setValue(event.target.value)}
  helperText="Enter the date from your document"
  renderError={() => "Use the required format MM/dd/yyyy"}
/>
```

```tsx
// Small size, read-only
<DateField
  label="Date of birth (MM/dd/yyyy)"
  value="01/15/1990"
  onChange={() => {}}
  size="small"
  readOnly
/>
```

## A11Y Notes

- The `label` prop is the primary accessibility hook. It should include the expected date format (e.g. "Enter date (MM/dd/yyyy)") so screen readers announce format requirements without needing separate helper text.
- `helperText` provides a secondary format indicator but is lower contrast than the label — do not rely on it alone for format instructions.
- `renderError` should return a message that points the user toward a solution: "Use the required format MM/dd/yyyy" is better than "Use the correct format". See [WCAG 3.3.3 Error Suggestion](https://www.w3.org/WAI/WCAG21/quickref/#minimize-error-suggestions).
- Validation occurs on blur (when focus leaves the field). The default validation checks that the input matches the expected date format.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | Label associated programmatically with the field. |
| 3.3.1 Error Identification | A | Error message surfaced via `error` prop or `renderError` function. |
| 3.3.2 Labels or Instructions | A | `label` (with format) and `helperText` provide format instructions. |
| 3.3.3 Error Suggestion | AA | `renderError` should provide a corrective suggestion, not just identify the error. |
