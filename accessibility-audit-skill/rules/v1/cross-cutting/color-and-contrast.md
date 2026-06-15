---
id: R-CC-004
version: v1.0
owner: gio
status: approved
severity: must
wcag:
  - "1.4.1"
  - "1.4.3"
  - "1.4.11"
applies_to:
  - "all styled UI components"
last_reviewed: "2026-06-15"
---

# Color and Contrast

## Why this rule exists

Low contrast and color-only signaling exclude users with low vision or color vision differences.

## MUST

- Text contrast MUST meet WCAG minimum thresholds.
- Non-text UI indicators (focus rings, borders, icons) MUST be visually discernible.
- Error/success/info states MUST include non-color cues (text/icon/pattern).

## MUST NOT

- Do not rely on color alone to communicate meaning.
- Do not ship low-contrast text tokens without approved exception.

## SHOULD (V1.1 candidates)

- Prefer contrast tokens with automated testing.
- Validate contrast across all themes.

## Good Example

```tsx
<p className="text-error">
  <ErrorIcon aria-hidden="true" /> Email is required.
</p>
```

## Bad Example

```tsx
<p style={{ color: "#d33" }}>Invalid</p>
```

## 30-Second Test

1. Check text and control contrast in browser tooling.
2. Validate error/warning states include text/icon cues.
3. Validate dark mode contrast if applicable.

## Citations

- WCAG 2.1 SC 1.4.1 Use of Color
- WCAG 2.1 SC 1.4.3 Contrast (Minimum)
- WCAG 2.1 SC 1.4.11 Non-text Contrast

## Rule Changelog

- v1.0: Initial approved version.
