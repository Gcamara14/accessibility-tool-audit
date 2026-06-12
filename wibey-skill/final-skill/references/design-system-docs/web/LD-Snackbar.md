# LD Snackbar — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/snackbar/guidelines/SnackbarGuidelines.tsx`
**Import:** `import { SnackbarContext } from "@livingdesign/react"`

## API (SOURCE-VERIFIED)

The Snackbar uses a **Context API** — there is NO `<Snackbar isOpen>` component.
You trigger snackbars by calling `addSnack()` from the `SnackbarContext.Consumer`.

### `addSnack(options)` Parameters

| Option | Type | Required | Notes |
|--------|------|----------|-------|
| `message` | string | YES | The notification text announced by screen readers |
| `actionButtonProps` | Object | no | Props for an action button: `{ children: "Yes" }` |

## Usage Examples

```tsx
import { SnackbarContext } from "@livingdesign/react";

// Trigger a snackbar via context consumer
<SnackbarContext.Consumer>
  {({ addSnack }) => (
    <Button
      onClick={() => {
        addSnack({
          message: "Item added to cart",
        });
      }}
      variant="primary"
    >
      Add to cart
    </Button>
  )}
</SnackbarContext.Consumer>

// With action button
<SnackbarContext.Consumer>
  {({ addSnack }) => (
    <Button
      onClick={() => {
        addSnack({
          message: "Item removed from cart",
          actionButtonProps: { children: "Undo" },
        });
      }}
    >
      Remove item
    </Button>
  )}
</SnackbarContext.Consumer>
```

## A11Y Notes

- `message` is what screen readers announce. Keep it concise and meaningful.
- The Snackbar live region is managed by the SnackbarContext provider — ensure it is mounted at the app root.
- For programmatic announcements alongside snackbars, use `useA11yAnnouncement().announcePolite()` + 1s `setTimeout`. See template `WA11Y-WEB-4.1.3-003` Var 1.

## ⚠️ Common Errors

### ❌ Using a fabricated Snackbar component API
```tsx
// BAD — <Snackbar isOpen> component does NOT exist in LD
<Snackbar isOpen={isOpen} onClose={() => setOpen(false)}>
  Item added to cart
</Snackbar>

// GOOD — use SnackbarContext.Consumer + addSnack()
<SnackbarContext.Consumer>
  {({ addSnack }) => (
    <Button onClick={() => addSnack({ message: "Item added to cart" })}>
      Add to cart
    </Button>
  )}
</SnackbarContext.Consumer>
```

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 4.1.3 Status Messages | AA | Snackbar is a live region; AT announces message without focus change. |
