---
id: R-CMP-015
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["2.4.4", "1.3.1", "4.1.2"]
applies_to: ["Pagination", "Pager"]
last_reviewed: "2026-06-15"
---

# Pagination

## MUST
- Pagination is contained in labeled navigation landmark.
- Current page is programmatically indicated (`aria-current=\"page\"`).
- Previous/next controls have meaningful names.

## MUST NOT
- Do not use unlabeled numeric links with no context.
- Do not hide current page state visually only.

## SHOULD (V1.1 candidates)
- Add condensed mobile pagination pattern with equivalent semantics.

## Citations
- WCAG 2.1 SC 2.4.4, 1.3.1, 4.1.2
