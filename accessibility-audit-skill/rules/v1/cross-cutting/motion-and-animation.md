---
id: R-CC-010
version: v1.0
owner: gio
status: approved
severity: must
wcag:
  - "2.2.2"
  - "2.3.1"
applies_to:
  - "animated, auto-updating, or moving UI patterns"
last_reviewed: "2026-06-15"
---

# Motion and Animation

## Why this rule exists

Uncontrolled motion can create distraction, disorientation, and access barriers.

## MUST

- Auto-moving content MUST provide pause/stop/hide controls when applicable.
- Flashing content MUST avoid seizure-risk thresholds.
- Respect reduced-motion preference where animation is non-essential.

## MUST NOT

- Do not force continuous animation for critical information.
- Do not auto-advance key content without user control.

## SHOULD (V1.1 candidates)

- Provide motion-reduced variants for all major transitions.
- Add animation lint checks in design token pipelines.

## Good Example

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## Bad Example

```css
.banner {
  animation: pulse 0.5s infinite;
}
```

## 30-Second Test

1. Enable reduced motion at OS/browser level.
2. Reload page and confirm non-essential animations stop.
3. Verify users can pause moving content.

## Citations

- WCAG 2.1 SC 2.2.2 Pause, Stop, Hide
- WCAG 2.1 SC 2.3.1 Three Flashes or Below Threshold

## Rule Changelog

- v1.0: Initial approved version.
