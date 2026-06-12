# LD `DateRangeField` — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/date-picker/date-range-field/metadata.json`
**Import:** `import { DateRangeField } from "@livingdesign/react"` *(when released)*
**React status:** PLANNED — NOT YET RELEASED

> **WARNING:** As of 2026-03-27, `DateRangeField` has React status "Planned" in the digital-toolkit source. There is no `DateRangeFieldGuidelines.tsx` sandbox file. The prop names below are UNVERIFIED — inferred from design documentation only. Do NOT use these props in production code reviews as ground truth. Verify against the actual component when it reaches "Released" status.

---

## Overview (Design Intent)

The `DateRangeField` is a dual text input for entering a start and end date (e.g., promotional campaign start/end, travel check-in/check-out). It renders two date fields side by side. Helper text and error text span both fields and cannot be applied to each field independently.

Key design constraints from the design guidelines:
- One or both fields can independently be in Error, Read Only, or Disabled states.
- Error text is a single element spanning the width of both fields.
- Error text must be active any time the Error property is active for one or both fields.

---

## Props (DESIGN-INFERRED — NOT SOURCE VERIFIED)

These props are inferred from the Figma design and design guidelines documentation. They have NOT been verified against a released React component sandbox.

| Prop | Notes |
|------|-------|
| `label` | Shared label for the group |
| `startLabel` | Label for the start date field |
| `endLabel` | Label for the end date field |
| `value` | Controlled range value |
| `onChange` | Callback when either date changes |
| `disabled` | Disables one or both fields |
| `readOnly` | Makes one or both fields read-only |
| `error` | Error state |
| `size` | `"large"` or `"small"` (consistent with DateField) |

> When this component reaches "Released" status, re-verify all prop names against the Guidelines.tsx sandbox file. Based on the `DateField` pattern, expect: `error` to be a string (not boolean), helper text prop to be `helperText` (not `helpText`), and error render function to be `renderError`.

---

## A11Y Notes

- Each field must have a distinct label so AT can distinguish start from end. A shared group label alone is insufficient.
- Error text spans both fields and must be announced when either field is in an error state.
- The label should include the expected date format (e.g. "Start date (MM/dd/yyyy)") per Living Design content strategy guidance.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | Each field needs a distinct label; group label provides shared context. |
| 3.3.1 Error Identification | A | Error text must be active whenever either field has an error state. |
| 3.3.2 Labels or Instructions | A | Labels should include expected date format. |
