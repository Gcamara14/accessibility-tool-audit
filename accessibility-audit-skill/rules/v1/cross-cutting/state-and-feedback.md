---
id: R-CC-006
version: v1.0
owner: gio
status: approved
severity: must
wcag:
  - "4.1.2"
  - "3.2.2"
  - "4.1.3"
applies_to:
  - "stateful and dynamic components"
last_reviewed: "2026-06-15"
---

# State and Feedback

## Why this rule exists

Users must be told when UI state changes. Silent updates create confusion and failed task completion.

## MUST

- Stateful controls MUST expose correct state (`aria-expanded`, `aria-pressed`, etc.).
- Important async/status updates MUST be announced appropriately.
- Validation and system feedback MUST be readable and programmatically associated.

## MUST NOT

- Do not update UI state visually without semantic state updates.
- Do not use only transient visual toasts for critical status with no announcement strategy.

## SHOULD (V1.1 candidates)

- Centralize live region and status message patterns.
- Add test helpers for state transitions and announcements.

## Good Example

```tsx
<button
  type="button"
  aria-expanded={open}
  aria-controls="details-panel"
  onClick={() => setOpen((v) => !v)}
>
  Details
</button>
```

## Bad Example

```tsx
<button type="button" onClick={() => setOpen(!open)}>
  Details
</button>
```

## 30-Second Test

1. Toggle component state and inspect accessibility tree.
2. Confirm status changes are announced where needed.
3. Confirm errors/success states persist long enough to be perceived.

## Citations

- WCAG 2.1 SC 4.1.2 Name, Role, Value
- WCAG 2.1 SC 3.2.2 On Input
- WCAG 2.1 SC 4.1.3 Status Messages

## Rule Changelog

- v1.0: Initial approved version.
