# LD Nudge — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/nudge/guidelines/NudgeGuidelines.tsx`
**Import:** `import { Nudge } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | Nudge body content — typically a short tip or call-to-action description. |
| `title` | `string` | Yes | — | Heading for the nudge. Serves as the accessible name of the component. |
| `actions` | `ReactNode` | No | — | Action area — typically a `ButtonGroup` with `LinkButton` elements. |
| `leading` | `ReactNode` | No | — | Leading visual element: an icon, `SpotIcon`, pictogram, or illustration image. |
| `onClose` | `(event) => void` | No | — | Callback fired when the dismiss button is activated. LD provides an accessible label on the close button automatically. |

## Usage Examples

```tsx
import * as Icon from "@livingdesign/icons";
import { ButtonGroup, LinkButton, Nudge, SpotIcon } from "@livingdesign/react";

// With leading icon
<Nudge
  actions={
    <ButtonGroup>
      <LinkButton>View eligible items</LinkButton>
    </ButtonGroup>
  }
  leading={<Icon.Box size="medium" />}
  onClose={(event) => console.log(event)}
  title="Stay stocked with auto-delivery"
>
  We'll do the shopping, our experts will pick the best quality items,
  or your money back.
</Nudge>

// With leading SpotIcon
<Nudge
  actions={
    <ButtonGroup>
      <LinkButton>Add payment method</LinkButton>
    </ButtonGroup>
  }
  leading={
    <SpotIcon color="neutral" size="small">
      <Icon.Card />
    </SpotIcon>
  }
  onClose={(event) => console.log(event)}
  title="Add a payment method"
>
  Put your benefits to use. We'll recommend the best ways to pay.
</Nudge>

// With leading illustration image
<Nudge
  actions={
    <ButtonGroup>
      <LinkButton>Book appointment</LinkButton>
    </ButtonGroup>
  }
  leading={
    <img
      alt=""
      src={calendarWithClock}
      style={{ display: "block", height: "5rem", width: "5rem" }}
    />
  }
  onClose={(event) => console.log(event)}
  title="Book a flu vaccine"
>
  Consult your healthcare provider to determine your level of risk.
</Nudge>
```

## A11Y Notes

- `title` is required and serves as the accessible name for the nudge — never omit it.
- Nudges that appear automatically must not steal keyboard focus from the user's current position.
- The `onClose` close button receives an accessible label from LD automatically.
- Nudges are non-modal — users must be able to Tab past them freely without being trapped.
- When using `leading` with an illustration or pictogram `<img>`, set `alt=""` to mark it as decorative since the `title` and `children` carry the meaning.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.2 No Keyboard Trap | A | Nudges are non-modal; focus is never trapped. |
| 2.4.3 Focus Order | A | Auto-appearing nudges do not steal focus from the user's current position. |
| 4.1.2 Name, Role, Value | A | Accessible name provided via required `title` prop; close button labeled automatically by LD. |
