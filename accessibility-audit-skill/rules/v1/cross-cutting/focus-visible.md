---
id: R-CC-001
version: v1.0
owner: gio
status: approved
severity: must
wcag:
  - "2.4.7"
  - "1.4.11"
applies_to:
  - "all interactive components"
last_reviewed: "2026-06-15"
---

# Focus Visible

## Why this rule exists

Keyboard users must always know where focus is. If focus style is missing or too subtle, users cannot navigate reliably and may activate the wrong control.

## MUST

- Every keyboard-focusable element MUST display a visible focus indicator.
- Focus indicator MUST meet non-text contrast expectations against surrounding colors.
- Focus style MUST appear on keyboard focus (`:focus-visible` preferred).

## MUST NOT

- Do not remove outlines globally (for example `*:focus { outline: none; }`).
- Do not use color changes so small they are visually indistinguishable.

## SHOULD (V1.1 candidates)

- Keep focus ring consistent across components via shared tokens.
- Use 2px+ outlines with offset for clearer visibility.

## Good Example

```css
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--focus-ring, #005fcc);
  outline-offset: 2px;
}
```

## Bad Example

```css
*:focus {
  outline: none;
  box-shadow: none;
}
```

## 30-Second Test

1. Press `Tab` through the page.
2. Confirm focus is visible on every control.
3. Confirm ring is visible on light and dark backgrounds.

## Citations

- WCAG 2.1 SC 2.4.7 Focus Visible
- WCAG 2.1 SC 1.4.11 Non-text Contrast

## Rule Changelog

- v1.0: Initial approved version.
