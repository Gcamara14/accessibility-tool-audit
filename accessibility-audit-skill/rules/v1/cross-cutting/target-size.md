---
id: R-CC-005
version: v1.0
owner: gio
status: approved
severity: must
wcag:
  - "2.1.1"
  - "2.5.1"
  - "2.5.2"
applies_to:
  - "click/tap interactive controls"
last_reviewed: "2026-06-15"
---

# Target Size

## Why this rule exists

Small touch targets increase accidental taps and make controls difficult for users with motor limitations.

## MUST

- Interactive targets MUST provide adequate clickable area (use team token baseline).
- Closely placed controls MUST have enough spacing to prevent accidental activation.
- Pointer interactions MUST have safe cancellation patterns where applicable.

## MUST NOT

- Do not ship icon-only controls with tiny hit areas.
- Do not require complex gestures for primary actions.

## SHOULD (V1.1 candidates)

- Normalize to a consistent minimum target-size token across all components.
- Add automated tests for hit-area dimensions.

## Good Example

```css
.icon-button {
  min-width: 40px;
  min-height: 40px;
  padding: 8px;
}
```

## Bad Example

```css
.icon-button {
  width: 16px;
  height: 16px;
}
```

## 30-Second Test

1. Try tapping/clicking controls at normal speed.
2. Confirm no accidental adjacent activations.
3. Confirm primary controls are comfortable without zoom.

## Citations

- WCAG 2.1 SC 2.1.1 Keyboard (operability baseline)
- WCAG 2.1 SC 2.5.1 Pointer Gestures
- WCAG 2.1 SC 2.5.2 Pointer Cancellation

## Rule Changelog

- v1.0: Initial approved version.
