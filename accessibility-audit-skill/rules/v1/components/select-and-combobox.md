---
id: R-CMP-004
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["2.1.1", "4.1.2", "1.3.1"]
applies_to: ["Select", "Combobox", "Autocomplete"]
last_reviewed: "2026-06-15"
---

# Select and Combobox

## MUST
- Follow APG combobox/select semantics and keyboard behavior.
- Expanded/collapsed state is exposed (`aria-expanded`) when custom.
- Option relationships are programmatically linked.

## MUST NOT
- Do not implement custom select without arrow-key and escape support.
- Do not hide selected value from screen reader name/value.

## SHOULD (V1.1 candidates)
- Add typeahead consistency tests across all variants.

## Citations
- WCAG 2.1 SC 2.1.1, 4.1.2, 1.3.1
