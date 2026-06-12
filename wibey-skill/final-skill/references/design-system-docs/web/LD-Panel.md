# LD Panel — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/panel/guidelines/PanelGuidelines.tsx`
**Import:** `import { Panel } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | No | — | Content within the panel. |
| `title` | `string` | No | — | Optional visible heading rendered at the top of the panel. |
| `actions` | `ReactNode` | No | — | Action area — typically a `ButtonGroup` with action buttons. |
| `closeButtonProps` | `object` | No | — | Props passed to the close button (e.g., `{ "aria-label": "Close Panel" }`). |
| `isOpen` | `boolean` | No | `false` | Controls panel visibility. |
| `onClose` | `() => void` | No | — | Callback fired when the panel is closed. |
| `size` | `"small" \| "medium" \| "large"` | No | — | Width of the panel. Small = 320px max, Medium = 420px max, Large = 600px max. |
| `position` | `string` | No | — | Position of the panel (e.g., `"right"`). |

## Usage Examples

```tsx
import { Button, ButtonGroup, LinkButton, Panel } from "@livingdesign/react";

// Controlled panel
const [isOpen, setIsOpen] = React.useState(false);

<Button onClick={() => setIsOpen(true)} variant="secondary">
  Open panel
</Button>
<Panel
  actions={
    <ButtonGroup>
      <LinkButton>Cancel</LinkButton>
      <Button variant="primary">Accept</Button>
    </ButtonGroup>
  }
  closeButtonProps={{ "aria-label": "Close Panel" }}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  size="medium"
  position="right"
  title="Synchronic Distortion"
>
  The weapons must have disrupted our communicators.
</Panel>
```

## A11Y Notes

- `closeButtonProps` should always include `"aria-label"` to ensure the close button has an accessible name (e.g., `{ "aria-label": "Close Panel" }`).
- When `title` is provided it gives the panel its accessible name. When the panel is a dialog overlay, ensure the title is linked as the dialog's accessible name.
- The `isOpen` / `onClose` pattern is the standard controlled visibility pattern — ensure focus is managed appropriately when the panel opens (focus should move into the panel) and closes (focus should return to the trigger element).
- Do not use `Panel` as a modal dialog without proper focus trapping and `role="dialog"` semantics.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.3.1 Info and Relationships | A | `title` provides the visible and accessible heading for the panel. |
| 2.1.2 No Keyboard Trap | A | If used as a modal, focus must be trapped inside while open and released on close. |
| 4.1.2 Name, Role, Value | A | Close button must have an accessible name via `closeButtonProps["aria-label"]`. |
