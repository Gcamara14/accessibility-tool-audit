# LD Popover — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/popover/guidelines/PopoverGuidelines.tsx`
**Import:** `import { Popover } from "@livingdesign/react"`

---

## Overview

The LD `Popover` is a non-modal overlay anchored to a trigger element. The component uses a wrapper pattern: `children` IS the trigger element (the element that opens the popover), and `content` is the panel content shown when open. Unlike `Modal`, a Popover does not trap focus — keyboard users can Tab out of it. It closes on Escape or outside click. The `triggerRef` must point to the trigger DOM node for focus management.

---

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `children` | `ReactNode` | Yes | — | The trigger element (e.g., a `LinkButton` or `Button`). This is what the user clicks to open the popover. |
| `content` | `ReactNode` | Yes | — | Content rendered inside the popover panel (the floating overlay). |
| `triggerRef` | `React.RefObject` | Yes | — | Ref pointing to the trigger DOM element. Required for focus return on close. |
| `isOpen` | `boolean` | No | `false` | Controlled open state. |
| `onClose` | `() => void` | Yes | — | Callback fired when the popover should close (Escape key, outside click). |
| `hasNubbin` | `boolean` | No | `true` | Shows a directional nubbin (pointer arrow) on the popover panel. |
| `position` | `string` | No | `"bottomRight"` | Where the popover appears relative to the trigger. See options below. |

### `position` options (exact strings)

`"bottomCenter"` `"bottomLeft"` `"bottomRight"` `"left"` `"right"` `"topCenter"` `"topLeft"` `"topRight"`

---

## Usage Examples

```tsx
const ref = React.useRef(null);
const [isOpen, setIsOpen] = React.useState(false);

<Popover
  content={
    <div style={{ textAlign: "center", width: 240 }}>
      <Body UNSAFE_style={{ marginBottom: 8 }} as="p" size="small">
        I read an ion trail characteristic of a freighter escape pod.
      </Body>
      <Button variant="destructive">Resistance is futile</Button>
    </div>
  }
  isOpen={isOpen}
  hasNubbin
  onClose={() => setIsOpen(false)}
  position="bottomRight"
  triggerRef={ref}
>
  <LinkButton ref={ref} onClick={() => setIsOpen(!isOpen)}>
    Open report
  </LinkButton>
</Popover>
```

### Nubbin vs no nubbin

- **Default (no nubbin):** Use with triggers that display a distinct down/active state (e.g., icon buttons that visually change when active).
- **Nubbin:** Use when the trigger has no distinct downstate, or in dense interfaces where the source of the popover could be unclear.

---

## A11Y Notes

- The `triggerRef` enables focus return to the trigger element when the popover closes — without it, focus is lost after close, which is a WCAG 2.4.3 failure.
- `onClose` is required — it handles both Escape key and outside-click dismissal. Ensure the callback sets `isOpen` to `false`.
- The popover panel content (`content` prop) must contain at least one focusable element. A popover with no focusable content provides no keyboard escape path for users who Tab into it.
- Do not place a bare `×` dismiss button without an accessible label. If implementing a custom close button, use `IconButton` with `a11yLabel="Close"`.
- `position` values are camelCase strings (`"bottomLeft"`, `"topRight"`, etc.) — not kebab-case or CSS-style (`"bottom-left"` is wrong).

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.1 Keyboard | A | Escape closes the popover; Tab moves through focusable content; focus returns to trigger on close. |
| 2.4.3 Focus Order | A | Focus moves into the popover on open and returns to trigger on close via `triggerRef`. |
| 4.1.2 Name, Role, Value | A | Trigger communicates open state; popover panel content must be keyboard accessible. |
