---
id: R-CMP-009
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["2.1.1", "2.1.2", "4.1.2"]
applies_to: ["Menu", "DropdownMenu", "ActionMenu"]
last_reviewed: "2026-06-15"
---

# Menu and Dropdown

## MUST
- Trigger and menu expose expanded/collapsed state.
- Keyboard support includes open, navigate, select, close.
- Focus lands on a valid item when menu opens.

## MUST NOT
- Do not leave focus stranded when menu closes.
- Do not use menu semantics for simple link lists unless behavior matches.

## SHOULD (V1.1 candidates)
- Support typeahead for longer menus.

## Citations
- WCAG 2.1 SC 2.1.1, 2.1.2, 4.1.2
