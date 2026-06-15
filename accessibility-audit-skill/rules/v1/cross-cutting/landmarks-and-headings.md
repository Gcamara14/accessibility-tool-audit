---
id: R-CC-008
version: v1.0
owner: gio
status: approved
severity: must
wcag:
  - "1.3.1"
  - "2.4.1"
  - "2.4.6"
applies_to:
  - "page-level layout and sectioning"
last_reviewed: "2026-06-15"
---

# Landmarks and Headings

## Why this rule exists

Screen reader and keyboard users rely on headings and landmarks to navigate quickly.

## MUST

- Pages MUST include meaningful heading hierarchy with one primary H1.
- Landmark regions (`header`, `nav`, `main`, `footer`) MUST be present and meaningful.
- Multiple navigation landmarks MUST be uniquely labeled.

## MUST NOT

- Do not skip heading levels for visual styling convenience.
- Do not use heading visuals without semantic headings where structure is intended.

## SHOULD (V1.1 candidates)

- Add heading/landmark checks to CI for all major templates.
- Standardize page-title and heading conventions by route type.

## Good Example

```html
<header>...</header>
<nav aria-label="Primary navigation">...</nav>
<main>
  <h1>Orders</h1>
  <h2>Open orders</h2>
</main>
```

## Bad Example

```html
<div class="title">Orders</div>
<div class="subtitle">Open orders</div>
```

## 30-Second Test

1. Open heading list in screen reader.
2. Confirm hierarchy is logical and complete.
3. Confirm landmark quick-nav shows unique meaningful regions.

## Citations

- WCAG 2.1 SC 1.3.1 Info and Relationships
- WCAG 2.1 SC 2.4.1 Bypass Blocks
- WCAG 2.1 SC 2.4.6 Headings and Labels

## Rule Changelog

- v1.0: Initial approved version.
