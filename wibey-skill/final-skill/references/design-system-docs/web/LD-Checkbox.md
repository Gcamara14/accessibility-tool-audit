# LD `Checkbox` Component — Technical Props Reference

**System:** Living Design (LD)
**Component Map Key:** `DS-CE-Component-LD-Checkbox`
**Doc Site:** https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/checkbox
**Date Ingested:** 2026-03-19

---

## Overview
The Living Design (LD) Checkbox component for web is a boolean selection control supporting checked, unchecked, and indeterminate states.

---

## Standard & Accessibility Props

| Prop | Type | Default | Description / Accessibility Note |
|---|---|---|---|
| `a11yLabelledBy` | `string` | — | **WCAG 4.1.2** The accessible label reference IDs for the checkbox (required if omitting `label`). |
| `label` | `ReactNode` | — | **WCAG 4.1.2** The visible label for the checkbox (required if omitting `a11yLabelledBy`). |
| `checkboxProps` | `Object` | `{}` | Props spread directly to the underlying `<input>` element. |
| `checked` | `boolean` | `false` | Exposes the checked state to AT. |
| `indeterminate` | `boolean` | `false` | Exposes the mixed/indeterminate state. |
| `disabled` | `boolean` | `false` | Disables the input visually and programmatically. |
| `id` | `string` | — | The DOM id for the checkbox input. |
| `name` | `string` | — | The form name for the checkbox. |
| `onChange` | `function` | — | **Required.** The callback fired when the user interacts with the checkbox. |
| `value` | `string \| number` | — | The value attribute of the checkbox. |
| `UNSAFE_className` | `string` | — | Additional class name for the root element (use with caution). |
| `UNSAFE_style` | `CSSProperties` | — | Style for the root element (use with caution). |

## ⚠️ Core Accessibility Constraint
**You must provide either a `label` or an `a11yLabelledBy` prop, but not both.** Failing to provide one of these will result in a WCAG 4.1.2 Name, Role, Value failure.
