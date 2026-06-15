---
id: R-CMP-011
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["2.4.1", "2.4.4", "1.3.1"]
applies_to: ["PrimaryNav", "SideNav", "Breadcrumb"]
last_reviewed: "2026-06-15"
---

# Navigation

## MUST
- Navigation regions are semantically exposed and labeled.
- Current location is announced (`aria-current` where relevant).
- Keyboard navigation through nav items is logical and visible.

## MUST NOT
- Do not create duplicate unlabeled nav landmarks.
- Do not hide active route state from assistive technologies.

## SHOULD (V1.1 candidates)
- Add skip-link integration for major layouts.

## Citations
- WCAG 2.1 SC 2.4.1, 2.4.4, 1.3.1
