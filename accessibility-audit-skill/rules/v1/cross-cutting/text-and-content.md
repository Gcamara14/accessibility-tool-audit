---
id: R-CC-009
version: v1.0
owner: gio
status: approved
severity: must
wcag:
  - "1.4.4"
  - "1.4.10"
  - "1.4.12"
  - "3.1.1"
applies_to:
  - "all text-based UI and content-heavy components"
last_reviewed: "2026-06-15"
---

# Text and Content

## Why this rule exists

Text must remain understandable and usable under zoom, reflow, and spacing changes.

## MUST

- Text MUST remain readable at 200% zoom without content loss.
- Layout MUST reflow for narrow viewports without horizontal content traps.
- Document/page language MUST be declared.

## MUST NOT

- Do not hardcode fixed-height text containers that clip content.
- Do not rely on tiny text as the only way to fit content.

## SHOULD (V1.1 candidates)

- Add automated visual regression checks for zoom/reflow.
- Validate text spacing overrides in CI.

## Good Example

```css
.content {
  max-width: 65ch;
  overflow-wrap: break-word;
}
```

## Bad Example

```css
.content {
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
}
```

## 30-Second Test

1. Set browser zoom to 200%.
2. Narrow viewport to mobile width.
3. Confirm text is readable and not clipped.

## Citations

- WCAG 2.1 SC 1.4.4 Resize Text
- WCAG 2.1 SC 1.4.10 Reflow
- WCAG 2.1 SC 1.4.12 Text Spacing
- WCAG 2.1 SC 3.1.1 Language of Page

## Rule Changelog

- v1.0: Initial approved version.
