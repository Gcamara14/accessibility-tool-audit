# LD `DateRangePicker` — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/date-picker/date-range-picker/metadata.json`
**Import:** `import { DateRangePicker } from "@livingdesign/react"` *(when released)*
**React status:** PLANNED — NOT YET RELEASED

> **WARNING:** As of 2026-03-27, `DateRangePicker` has React status "Planned" in the digital-toolkit source. There is no `DateRangePickerGuidelines.tsx` sandbox file. The prop names in the prior version of this document were entirely inferred — they do not reflect a real released component API. Do NOT use prior prop names (`onChange`, `minValue`, `maxValue`, `errorText`, `helpText`, `required`) as ground truth.

---

## Overview (Design Intent)

The `DateRangePicker` combines dual date fields with a dual-month calendar popup for selecting a date range. The calendar highlights the selected range. Based on the `DatePicker` pattern, expect the real API to use controlled open/close state and `onSelect`-style callbacks rather than a single `onChange`.

Key design constraints from the design guidelines:
- Both large and small sizes are supported.
- Error and helper text span both fields.
- The calendar supports Walmart Weeks display.

---

## Props (DESIGN-INFERRED — NOT SOURCE VERIFIED)

These props are entirely inferred from design documentation. They have NOT been verified against a released React component sandbox.

> When this component reaches "Released" status, re-verify all prop names against the Guidelines.tsx sandbox file. Based on the `DatePicker` pattern, expect:
> - `onSelect` for date selection (not `onChange`)
> - `onOpen` / `onClose` for calendar control (both likely required)
> - `isOpen` as a controlled boolean (likely required)
> - `minDate` / `maxDate` as `Date` objects (not `minValue` / `maxValue` as `DateValue`)
> - `error` as a string (not boolean)
> - `helperText` (not `helpText`)
> - `renderError` function (not `errorText`)
> - `disabledDateFilter` for disabling arbitrary date ranges

---

## A11Y Notes

- Each field must have a distinct label (start/end) so AT can distinguish them.
- The calendar popup requires an accessible name — this should be handled automatically by the component.
- Range selection state (start, in-range, end) must be announced to AT via appropriate ARIA semantics.
- Keyboard navigation must allow full range selection without a pointer device.
- Error text must be announced when the range is invalid (e.g., end before start).

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.1 Keyboard | A | Full keyboard navigation of calendar grid; range selection via keyboard. |
| 3.3.1 Error Identification | A | Invalid range error must be surfaced programmatically. |
| 4.1.2 Name, Role, Value | A | Calendar dialog, range grid cells, and disabled dates need correct ARIA semantics. |
