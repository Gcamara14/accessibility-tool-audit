---
id: R-CMP-007
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["1.4.13", "2.1.1", "4.1.2"]
applies_to: ["Tooltip", "HelpTooltip"]
last_reviewed: "2026-06-15"
---

# Tooltip

## MUST
- Tooltip content is accessible to keyboard and screen reader users.
- Trigger retains focus and can dismiss tooltip without pointer.
- Tooltip association is explicit (`aria-describedby` pattern when applicable).

## MUST NOT
- Do not show critical information only in hover-only tooltips.
- Do not trap focus inside tooltip.

## SHOULD (V1.1 candidates)
- Add delayed-open and delayed-close consistency across triggers.

## Citations
- WCAG 2.1 SC 1.4.13, 2.1.1, 4.1.2
