# LD Callout — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/callout/guidelines/CalloutGuidelines.tsx`
**Import:** `import { Callout } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `a11yContentLabel` | `string` | Yes | — | Accessible label describing the callout's content purpose. Used by assistive technology to identify the callout region. |
| `children` | `ReactNode` | Yes | — | Content rendered inside the callout popover. |
| `isOpen` | `boolean` | No | `false` | Controls whether the callout is visible. Stateful — toggled by the consumer. |
| `onClose` | `() => void` | Yes | — | Callback fired when the callout is closed. |
| `position` | `string` | No | `"bottomRight"` | Position of the callout relative to its trigger. See valid values below. |
| `trigger` | `ReactNode` | Yes | — | The interactive element that opens/closes the callout (e.g., a `Button`). Rendered as the callout's anchor point. |
| `triggerRef` | `object` (React ref) | Yes | — | A React ref attached to the trigger element. Required for the callout to position itself correctly relative to the trigger. |

### Valid `position` values

`"bottomCenter"` `"bottomLeft"` `"bottomRight"` `"left"` `"right"` `"topCenter"` `"topLeft"` `"topRight"`

## Usage Examples

```tsx
const ref = React.createRef();
const [isOpen, setIsOpen] = React.useState(false);

<Callout
  a11yContentLabel="Learn more about damage to the ship."
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  position="bottomRight"
  triggerRef={ref}
  trigger={
    <Button ref={ref} variant="primary" onClick={() => setIsOpen(!isOpen)}>
      Damage report
    </Button>
  }
>
  Use this control to learn more about damage to the ship.
</Callout>
```

## A11Y Notes

- `Callout` is a **popover/overlay component** anchored to a trigger element — it is NOT a static inline content block. It opens and closes based on `isOpen` state.
- The `a11yContentLabel` prop (required) provides the accessible name for the callout region so screen readers can identify and describe it.
- The `trigger` prop renders the interactive control that opens the callout. It must be a focusable element (e.g., `Button`).
- The `triggerRef` prop connects the trigger element to the callout for correct positioning and focus management.
- `onClose` (required) handles dismissal — ensure it sets `isOpen` to `false` and that focus is returned to the trigger element.
- Use `position` to control where the callout appears relative to the trigger. Choose a position that keeps content within the viewport and does not obscure important page content.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.1 Keyboard | A | The callout must be operable via keyboard through the trigger element. |
| 2.4.3 Focus Order | A | Focus should return to the trigger when the callout is closed. |
| 4.1.2 Name, Role, Value | A | `a11yContentLabel` provides the accessible name for the callout region; `triggerRef` and `trigger` wire up the relationship between trigger and popover. |
