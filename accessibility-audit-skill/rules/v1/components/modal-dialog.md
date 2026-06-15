---
id: R-CMP-006
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["2.1.2", "2.4.3", "4.1.2"]
applies_to: ["Modal", "Dialog", "Drawer"]
last_reviewed: "2026-06-15"
---

# Modal Dialog

## MUST
- Dialog has accessible name and `role=\"dialog\"`/`aria-modal=\"true\"` (or native equivalent).
- Focus moves into dialog on open and returns to trigger on close.
- Escape and close controls are keyboard-operable.

## MUST NOT
- Do not allow background focus while modal is open.
- Do not open dialog without initial focus target.

## SHOULD (V1.1 candidates)
- Add trap and return-focus integration tests for all dialog variants.

## Citations
- WCAG 2.1 SC 2.1.2, 2.4.3, 4.1.2
