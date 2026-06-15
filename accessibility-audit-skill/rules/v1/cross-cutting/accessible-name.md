---
id: R-CC-003
version: v1.0
owner: gio
status: approved
severity: must
wcag:
  - "4.1.2"
  - "2.5.3"
applies_to:
  - "all interactive components"
last_reviewed: "2026-06-15"
---

# Accessible Name

## Why this rule exists

Assistive tech users rely on accessible names to identify controls. Missing or misleading names make controls unusable.

## MUST

- Every interactive control MUST have a non-empty accessible name.
- Icon-only controls MUST include explicit name text (`aria-label` or `aria-labelledby`).
- Visible labels MUST match (or be contained in) accessible name.

## MUST NOT

- Do not use placeholder text as the only label.
- Do not expose technical variable names as user-facing labels.

## SHOULD (V1.1 candidates)

- Keep naming conventions consistent across related actions.
- Include context for repeated actions (for example, "Edit order 1234").

## Good Example

```tsx
<button type="button" aria-label="Close dialog">
  <CloseIcon aria-hidden="true" />
</button>
```

## Bad Example

```tsx
<button type="button">
  <CloseIcon />
</button>
```

## 30-Second Test

1. Inspect control with screen reader or accessibility tree.
2. Confirm role and name are present and meaningful.
3. Confirm visible label text is reflected in name.

## Citations

- WCAG 2.1 SC 4.1.2 Name, Role, Value
- WCAG 2.1 SC 2.5.3 Label in Name

## Rule Changelog

- v1.0: Initial approved version.
