---
id: R-CMP-005
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["1.3.1", "2.1.1", "4.1.2"]
applies_to: ["Checkbox", "CheckboxGroup", "Radio", "RadioGroup"]
last_reviewed: "2026-06-15"
---

# Checkbox and Radio

## MUST
- Every control has an explicit label.
- Groups use semantic grouping (`fieldset`/`legend` or equivalent).
- Checked/unchecked state is programmatically available.

## MUST NOT
- Do not create visual-only toggles without state semantics.
- Do not ship grouped options without shared group label.

## SHOULD (V1.1 candidates)
- Standardize error and description patterns for groups.

## Citations
- WCAG 2.1 SC 1.3.1, 2.1.1, 4.1.2
