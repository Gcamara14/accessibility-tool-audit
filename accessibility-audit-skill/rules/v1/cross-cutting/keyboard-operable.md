---
id: R-CC-002
version: v1.0
owner: gio
status: approved
severity: must
wcag:
  - "2.1.1"
  - "2.1.2"
  - "2.4.3"
applies_to:
  - "all interactive components"
last_reviewed: "2026-06-15"
---

# Keyboard Operable

## Why this rule exists

Users who cannot use a mouse must be able to operate all interactive functionality with keyboard only.

## MUST

- Any clickable action MUST be reachable and operable with keyboard.
- Tab order MUST follow logical visual/DOM order.
- Escape routes MUST exist for overlays, menus, and dialogs.

## MUST NOT

- Do not make `div`/`span` clickable without keyboard behavior.
- Do not trap users in focus loops without a way to exit.

## SHOULD (V1.1 candidates)

- Support arrow-key patterns for composite widgets per APG.
- Add skip links for long navigation-heavy pages.

## Good Example

```tsx
<button type="button" onClick={onSave}>Save</button>
```

## Bad Example

```tsx
<div onClick={onSave}>Save</div>
```

## 30-Second Test

1. Use only `Tab`, `Shift+Tab`, `Enter`, `Space`, `Esc`.
2. Complete the main interaction flow.
3. Confirm no control requires mouse.

## Citations

- WCAG 2.1 SC 2.1.1 Keyboard
- WCAG 2.1 SC 2.1.2 No Keyboard Trap
- WCAG 2.1 SC 2.4.3 Focus Order

## Rule Changelog

- v1.0: Initial approved version.
