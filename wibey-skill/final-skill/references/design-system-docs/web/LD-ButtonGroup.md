# LD ButtonGroup — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/button-group/guidelines/ButtonGroupGuidelines.tsx`
**Import:** `import { ButtonGroup } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | `Button` components (or other interactive elements) within the group. |

> Note: The sandbox exposes only `children` as a prop. Props like `aria-label` and `orientation` are not present in the sandbox and may be HTML passthrough attributes or undocumented options — do not treat them as verified LD-specific props.

## Usage Examples

```tsx
<ButtonGroup>
  <Button variant="primary">Vulcans</Button>
  <Button variant="secondary">Klingons</Button>
  <Button variant="tertiary">Humans</Button>
</ButtonGroup>
```

```tsx
// With ButtonGroup in a BottomSheet actions area
<BottomSheet
  actions={
    <ButtonGroup>
      <LinkButton>Cancel</LinkButton>
      <Button variant="primary">Accept</Button>
    </ButtonGroup>
  }
>
  ...
</BottomSheet>
```

## A11Y Notes

- `ButtonGroup` groups related `Button` elements together. When the buttons represent mutually exclusive choices or toggles, each `Button` should have `aria-pressed` to communicate the selected state to assistive technology (WCAG 4.1.2).
- When the buttons represent a set of related choices (e.g., "Sort by: Relevance, Price, Rating"), pass an `aria-label` directly on the `ButtonGroup` element to provide group context. AT will announce the group label before each button.
- Toggle buttons that rely on visual styling alone (e.g., a CSS `active` class) without `aria-pressed` fail WCAG 4.1.2 — the state is invisible to screen readers.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | Grouping buttons communicates their relationship; an `aria-label` on the group provides context. |
| 4.1.2 Name, Role, Value | A | Each button has a label; toggle state must be communicated via `aria-pressed`. |
