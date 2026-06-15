---
id: R-CMP-008
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["2.1.1", "1.3.1", "4.1.2"]
applies_to: ["Tabs", "TabList"]
last_reviewed: "2026-06-15"
---

# Tabs

## MUST
- Tabs follow APG roles and relationships (`tablist`, `tab`, `tabpanel`).
- Arrow key navigation between tabs works.
- Active tab state is exposed and panel linkage is valid.

## MUST NOT
- Do not make tabs clickable-only without keyboard behavior.
- Do not detach tab labels from associated panels.

## SHOULD (V1.1 candidates)
- Add orientation support and tests (horizontal/vertical).

## Citations
- WCAG 2.1 SC 2.1.1, 1.3.1, 4.1.2
