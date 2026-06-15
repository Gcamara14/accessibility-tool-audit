---
id: R-CMP-003
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["1.3.1", "3.3.1", "3.3.2", "4.1.2"]
applies_to: ["TextInput", "EmailInput", "PasswordInput", "SearchInput"]
last_reviewed: "2026-06-15"
---

# Text Input

## MUST
- Input has persistent label (not placeholder-only).
- Error/helper text is associated through `aria-describedby`.
- Invalid state is programmatically exposed.

## MUST NOT
- Do not rely on color-only invalid state signaling.
- Do not hide required field indicators from assistive tech.

## SHOULD (V1.1 candidates)
- Add autocomplete attributes for identity/password fields.

## Citations
- WCAG 2.1 SC 1.3.1, 3.3.1, 3.3.2, 4.1.2
