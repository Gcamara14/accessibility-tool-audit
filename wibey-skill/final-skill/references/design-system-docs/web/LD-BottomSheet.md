# LD BottomSheet — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/bottom-sheet/guidelines/BottomSheetGuidelines.tsx`
**Import:** `import { BottomSheet } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `actions` | `ReactNode` | No | — | Action elements rendered in the sheet's footer area (e.g., a `ButtonGroup` with Cancel / Accept buttons). |
| `children` | `ReactNode` | No | — | Main content rendered inside the bottom sheet body. |
| `closeButtonProps` | `object` | No | — | Props passed to the close button. Use `{ "aria-label": "Close BottomSheet" }` to provide an accessible label. |
| `isOpen` | `boolean` | No | `false` | Controls whether the sheet is visible. Stateful — toggled by the consumer. |
| `onClose` | `() => void` | No | — | Callback fired when the sheet is closed (Escape key, backdrop tap, close button click). |
| `title` | `string` | No | — | Visible heading rendered at the top of the sheet. Strongly recommended — used as the dialog's accessible name via `aria-labelledby`. |

## Usage Examples

```tsx
const [isOpen, setIsOpen] = React.useState(false);

<BottomSheet
  title="Captain's log"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  closeButtonProps={{ "aria-label": "Close BottomSheet" }}
  actions={
    <ButtonGroup>
      <LinkButton>Cancel</LinkButton>
      <Button variant="primary">Accept</Button>
    </ButtonGroup>
  }
>
  Sensors indicate no shuttle or other ships in this sector.
</BottomSheet>
```

## A11Y Notes

- The `BottomSheet` renders with `role="dialog"`. Provide a `title` prop so the dialog has an accessible name via `aria-labelledby`.
- The `closeButtonProps` object should always include `"aria-label"` to give the close button an accessible name.
- Focus is trapped inside the sheet while open (WCAG 2.1.2). Tab and Shift+Tab cycle through focusable elements inside.
- On close, focus returns to the triggering element (WCAG 2.4.3). Ensure the trigger is a focusable element and its ref is accessible.
- The Escape key triggers `onClose` (WCAG 2.1.1).

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.1 Keyboard | A | Escape closes the sheet; Tab/Shift+Tab navigate inside. |
| 2.1.2 No Keyboard Trap | A | Focus is trapped while open; Escape always exits. |
| 2.4.3 Focus Order | A | Focus moves into the sheet on open; returns to trigger on close. |
| 4.1.2 Name, Role, Value | A | `role="dialog"` requires an accessible name; use `title` prop and `closeButtonProps` with `aria-label`. |
