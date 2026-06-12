# LD `Modal` Component — Web (React) Props Reference

**System:** Living Design (LD)
**Platform:** Web / React
**Component Map Key:** `DS-CE-Component-LD-Modal`
**Doc Site:** https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/modal
**Date Ingested:** 2026-03-19

---

## Overview

The LD `Modal` is a focused overlay window that sits on top of page content. It manages `role="dialog"`, focus trapping, and ARIA attributes internally. Because it is a complex interactive pattern, it is high-risk for WCAG 2.1.2 (No Keyboard Trap) and 4.1.2 (Name, Role, Value) failures when misconfigured.

---

## Standard Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `children` | `ReactNode` | — | ✅ | The body content of the modal. |
| `title` | `ReactNode \| (props: { titleId: string }) => ReactNode` | — | ✅ | The modal's title. Can be a string/node **or a render function**. If a render function is used, it receives `{ titleId }` — you **must** apply `id={titleId}` to the visible title element or `aria-labelledby` will be broken. See ⚠️ warning below. |
| `onClose` | `(event: ModalCloseEvent) => void` | — | ✅ | Callback fired when the modal requests to close (close button click, Escape key, backdrop click). |
| `isOpen` | `boolean` | `false` | — | Controls whether the modal is visible. |
| `actions` | `ReactNode` | — | — | Action buttons rendered in the modal footer (e.g., Confirm / Cancel). |
| `closeButtonProps` | `ModalCloseButtonProps` | `{}` | — | Props spread directly to the modal's close (×) button. Use to override `aria-label`. |
| `onClosed` | `() => void` | — | — | Callback fired after the closing transition completes. |
| `size` | `'small' \| 'medium' \| 'large'` | `'small'` | — | Controls the modal's width. |
| `UNSAFE_className` | `string` | — | — | Additional CSS class on the root element. Use with caution. |
| `UNSAFE_style` | `CSSProperties` | — | — | Inline style override. Use with caution. |

---

## ♿ Accessibility Props & Guidance

> ℹ️ The LD Modal manages `role="dialog"` and focus trapping internally. There are **no explicit `aria-labelledby` or `a11yLabelledBy` props** — the `title` prop provides the accessible name automatically.

| Prop / Approach | How | WCAG Criterion | Notes |
|---|---|---|---|
| Dialog accessible name | `title` prop | **4.1.2 Name, Role, Value** | **Required.** LD wires this to the dialog's accessible name internally. A missing or vague `title` (e.g., `title="Dialog"`) is a WCAG failure. |
| Close button label | `closeButtonProps={{ "aria-label": "Close [dialog name]" }}` | **4.1.2 Name, Role, Value** | By default, the close button may have a generic label. Override to match the dialog context. |
| Focus management | Managed internally by LD | **2.1.2 No Keyboard Trap** | LD traps focus inside the modal while open and restores focus to the trigger on close. Verify this in your installed version. |
| Escape key close | Triggered via `onClose` | **2.1.2 No Keyboard Trap** | LD handles `Escape` key to call `onClose`. Ensure `onClose` actually closes the modal (`isOpen → false`). |

---

## ⚠️ WCAG Failure Patterns

### ❌ Vague or Missing `title`

> ⚠️ **WCAG 4.1.2 Failure:** Screen readers announce the dialog name from `title`. A generic or missing title makes the modal's purpose undiscoverable.

```tsx
// BAD — "Dialog" is not descriptive
<Modal title="Dialog" isOpen={isOpen} onClose={handleClose}>
  Are you sure you want to delete this item?
</Modal>

// GOOD — title describes the dialog's purpose
<Modal title="Confirm item deletion" isOpen={isOpen} onClose={handleClose}>
  Are you sure you want to delete this item? This action cannot be undone.
</Modal>
```

---

### ❌ Close Button Has No Contextual Label

```tsx
// BAD — close button default label may be just "×" or "Close" with no context
<Modal title="Select delivery address" isOpen={isOpen} onClose={handleClose} />

// GOOD — override with contextual aria-label
<Modal
  title="Select delivery address"
  isOpen={isOpen}
  onClose={handleClose}
  closeButtonProps={{ "aria-label": "Close Select delivery address dialog" }}
/>
```

---

### ❌ `onClose` Not Wired to `isOpen` State

> ⚠️ **WCAG 2.1.2 Failure:** If `onClose` doesn't set `isOpen` to `false`, the Escape key and close button call the callback but the modal stays open — trapping keyboard users.

```tsx
// BAD — onClose fires but modal stays open
<Modal isOpen={true} onClose={() => console.log('closed')} title="..." />

// GOOD — onClose drives the isOpen state
const [isOpen, setIsOpen] = useState(false);
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="..." />
```

---

### ❌ Render Function `title` Missing `titleId` Destructuring (CEPG-337717)

> ⚠️ **WCAG 4.1.2 Failure:** When `title` is a render function, LD Modal generates a `titleId` and writes it into `aria-labelledby` on the dialog container. If the render function does not apply `id={titleId}` to the visible title element, the ARIA reference is dangling — the dialog has no accessible name.

```tsx
// ❌ BAD — render function ignores titleId; aria-labelledby points to a non-existent ID
<Modal
  title={() => (
    <div>My Custom Title</div>
  )}
  isOpen={isOpen}
  onClose={handleClose}
/>

// ✅ GOOD — destructure { titleId } and apply id={titleId} to the visible element
<Modal
  title={({ titleId }) => (
    <div id={titleId}>My Custom Title</div>
  )}
  isOpen={isOpen}
  onClose={handleClose}
/>
```

> 💡 **Rule:** Every custom `title` render function **must** destructure `{ titleId }` from its argument and apply `id={titleId}` to whatever element is the visible title. This is the only mechanism that connects `aria-labelledby` to a real DOM node.
>
> 📚 **Reference:** `RECOMMENDED_TEMPLATES.md` Draft #1 (proposed `WA11Y-WEB-4.1.2-012`) · Jira CEPG-337717

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|---|---|---|
| 1.3.1 Info and Relationships | A | `role="dialog"` exposes the semantic relationship to AT. |
| 2.1.1 Keyboard | A | All modal controls must be keyboard operable. LD handles this natively. |
| 2.1.2 No Keyboard Trap | A | Focus must be trapped inside while open; must be releasable via Escape. |
| 4.1.2 Name, Role, Value | A | Dialog name from `title`; `role="dialog"` set internally; `aria-modal` managed by LD. |
