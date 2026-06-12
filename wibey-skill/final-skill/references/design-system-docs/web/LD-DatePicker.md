# LD `DatePicker` — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/date-picker/date-picker/guidelines/DatePickerGuidelines.tsx`
**Import:** `import { DatePicker } from "@livingdesign/react"`
**React status:** Released

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `label` | `string` | Yes | — | Visible label. Should include the expected format, e.g. "Pick a date (MM/dd/yyyy)". |
| `onClose` | `() => void` | Yes | — | Called when the calendar popup closes. Must set `isOpen` to `false`. |
| `onOpen` | `() => void` | Yes | — | Called when the calendar popup opens. Must set `isOpen` to `true`. |
| `onSelect` | `(date: Date) => void` | Yes | — | Called when a date is selected from the calendar. |
| `isOpen` | `boolean` | — | `false` | Controls whether the calendar popup is open (stateful). |
| `value` | `Date` | — | `undefined` | Controlled selected date (stateful). |
| `disabled` | `boolean` | — | `false` | Disables the entire date picker. |
| `readOnly` | `boolean` | — | `false` | Makes the field read-only. |
| `error` | `string` | — | `undefined` | Error message string. When provided, applies error styling and surfaces the message. |
| `helperText` | `string` | — | `undefined` | Helper/format instruction text shown below the field. |
| `format` | `string` | — | `undefined` | Date format string. |
| `renderError` | `() => ReactNode` | — | `undefined` | Function that returns a custom error render. |
| `disabledDateFilter` | `(date: Date) => boolean` | — | — | Function that returns `true` for dates that should be disabled in the calendar. |
| `locale` | `string` | — | `"en-US"` | Locale string for calendar display. |
| `minDate` | `Date` | — | `undefined` | Minimum selectable date. Days before this are disabled in the calendar. |
| `maxDate` | `Date` | — | `undefined` | Maximum selectable date. Days after this are disabled in the calendar. |
| `size` | `"large" \| "small"` | — | `"large"` | Controls the visual size of the field. |

> **IMPORTANT — prop name corrections from prior versions of this doc:**
> - The selection callback is `onSelect` (NOT `onChange`). It receives a `Date` object.
> - Calendar open/close requires two separate callbacks: `onOpen` and `onClose` (both required).
> - `isOpen` controls the calendar popup — the component is controlled.
> - The date range props are `minDate` / `maxDate` (NOT `minValue` / `maxValue`). Types are `Date`, not `DateValue`.
> - `error` is a **string** (not boolean). Pass the error message directly.
> - The helper text prop is `helperText` (NOT `helpText`).
> - There is no `required`, `defaultValue`, or `UNSAFE_className` prop in the sandbox.
> - `disabledDateFilter` allows disabling arbitrary dates (e.g., weekends).

## Usage Examples

```tsx
// Basic controlled usage (from sandbox)
const [value, setValue] = useState(undefined);
const [isOpen, setIsOpen] = useState(false);

<DatePicker
  label="Pick a date (MM/dd/yyyy)"
  value={value}
  isOpen={isOpen}
  onOpen={() => setIsOpen(true)}
  onClose={() => setIsOpen(false)}
  onSelect={(date) => setValue(date)}
/>
```

```tsx
// Disable weekends using disabledDateFilter
<DatePicker
  label="Pick a weekday (MM/dd/yyyy)"
  value={value}
  isOpen={isOpen}
  onOpen={() => setIsOpen(true)}
  onClose={() => setIsOpen(false)}
  onSelect={(date) => setValue(date)}
  disabledDateFilter={(date) => date.getDay() === 0 || date.getDay() === 6}
/>
```

```tsx
// With min/max date range
<DatePicker
  label="Appointment date (MM/dd/yyyy)"
  value={value}
  isOpen={isOpen}
  onOpen={() => setIsOpen(true)}
  onClose={() => setIsOpen(false)}
  onSelect={(date) => setValue(date)}
  minDate={today}
  maxDate={maxBookingDate}
  helperText="Select a date within the next 30 days"
/>
```

## A11Y Notes

- `label` is required. It should include the expected format (e.g. "Pick a date (MM/dd/yyyy)") so screen readers announce format requirements.
- The calendar popup is controlled via `isOpen` / `onOpen` / `onClose`. Forgetting to wire these means the calendar cannot be opened or closed via keyboard, breaking 2.1.1 Keyboard access.
- `disabledDateFilter` disables arbitrary dates (e.g., weekends). Disabled days receive `aria-disabled="true"` automatically.
- `minDate` / `maxDate` disable out-of-range dates in the calendar grid automatically.
- `helperText` provides supplemental instructions below the field.
- `renderError` / `error` surface validation errors programmatically.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.1 Keyboard | A | Full keyboard navigation of calendar grid; Escape closes via `onClose`; Enter/Space select. |
| 3.3.1 Error Identification | A | Error message surfaced via `error` prop or `renderError` function. |
| 3.3.2 Labels or Instructions | A | `label` (with format) and `helperText` provide format instructions. |
| 4.1.2 Name, Role, Value | A | Calendar popup, grid, selected state, and disabled states have correct ARIA semantics automatically. |
