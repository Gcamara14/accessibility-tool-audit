---
id: R-CMP-001
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["2.1.1", "2.4.7", "4.1.2"]
applies_to: ["Button", "IconButton", "SplitButton"]
last_reviewed: "2026-06-15"
---

# Button

## MUST
- Use native `<button>` for button actions.
- Buttons expose an accessible name and focus-visible state.
- Disabled state is semantic (`disabled` or `aria-disabled` with handling).

## MUST NOT
- Do not use clickable `div`/`span` as button replacement.
- Do not hide focus styling for buttons.

## SHOULD (V1.1 candidates)
- Normalize loading-state announcements across all button variants.

## Citations
- WCAG 2.1 SC 2.1.1, 2.4.7, 4.1.2
