---
id: R-CMP-010
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["1.3.1", "2.4.6", "4.1.2"]
applies_to: ["DataTable", "GridTable"]
last_reviewed: "2026-06-15"
---

# Data Table

## MUST
- Tables use semantic headers (`th`) and relationships (`scope`/header mapping).
- Table has clear caption/title context.
- Sort/filter controls are keyboard-operable and stateful.

## MUST NOT
- Do not render tabular data as plain `div` grids without proper semantics.
- Do not hide column meaning in visual-only icons.

## SHOULD (V1.1 candidates)
- Add sticky header and virtualized-row accessibility patterns.

## Citations
- WCAG 2.1 SC 1.3.1, 2.4.6, 4.1.2
