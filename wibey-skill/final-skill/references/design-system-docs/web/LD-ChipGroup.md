# LD ChipGroup — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/chip-group/guidelines/ChipGroupGuidelines.tsx`
**Import:** `import { Chip, ChipGroup } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

### ChipGroup

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | `Chip` components within this group. |

### Chip (used within ChipGroup)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `selected` | `boolean` | No | — | Whether the chip is in a selected state. |
| `disabled` | `boolean` | No | — | Whether the chip is disabled. |
| `onClick` | `() => void` | No | — | Click handler; makes the chip interactive. |

> Note: The sandbox `props` object for ChipGroup defines only `children`. Props such as `label`, `aria-label`, and `selectionMode` do not appear in the sandbox and are not verified source props.

## Usage Examples

```tsx
import { Chip, ChipGroup } from "@livingdesign/react";

function FilterChips() {
  const [selected1, setSelected1] = React.useState(false);
  const [selected2, setSelected2] = React.useState(true);

  return (
    <ChipGroup>
      <Chip disabled>Deflector shields</Chip>
      <Chip selected={selected1} onClick={() => setSelected1(!selected1)}>
        Warp drive
      </Chip>
      <Chip selected={selected2} onClick={() => setSelected2(!selected2)}>
        Tractor beam
      </Chip>
    </ChipGroup>
  );
}
```

## A11Y Notes

- Each `Chip` must have a text label that conveys its meaning — color and shape alone are insufficient.
- When chips are used as toggles (with `onClick` and `selected`), AT announces them as toggle buttons. The `selected` state communicates the current selection state to AT users (WCAG 4.1.2).
- If chips are used as filter/selection controls, the group context (what is being filtered) must be conveyed to AT — for example via a visible heading or label nearby, or via `aria-labelledby` on the wrapping element.
- Disabled chips must still be perceivable by AT so users understand the full set of options.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | Group context should be established via surrounding heading or landmark so AT users understand what the chips control. |
| 4.1.2 Name, Role, Value | A | Each chip has a text label; `selected` state is communicated programmatically to AT. |
