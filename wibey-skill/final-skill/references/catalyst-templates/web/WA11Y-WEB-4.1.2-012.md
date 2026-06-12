# Catalyst Template: Accessibility: Dialog Missing Programmatic Title / Accessible Name

**Template ID:** `WA11Y-WEB-4.1.2-012`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem

LD Modal accepts a `title` prop that can be either a `string` or a **render function** `(props: { titleId: string }) => ReactNode`. When a render function is used, LD Modal internally generates a unique `titleId` and passes it to the render function. That ID is intended to be applied as `id={titleId}` on the visible title element — so the dialog's `aria-labelledby` can point to it.

When the render function signature omits the `{ titleId }` destructure argument (i.e., `title={() => (...)}` instead of `title={({ titleId }) => (...)}`), the `titleId` is never applied to the DOM. The dialog's `aria-labelledby` attribute points to an ID that doesn't exist, silently breaking the accessible name for screen readers.

**Expected:** `dialog` element has `aria-labelledby="<id>"` pointing to a real DOM element with a matching `id`.
**Actual:** `aria-labelledby="<id>"` is present but the referenced element has no `id` attribute — the accessible name is effectively absent.

---

## ✅ The Fix Patterns

### ❌ Bad Code (LD Modal)

```tsx
// WCAG 4.1.2 VIOLATION: render function ignores titleId — aria-labelledby is broken
<DsClarityDialog
  title={() => (
    <div className="flex items-center">
      <div className="f3 b dark-gray">Charged to card</div>
    </div>
  )}
  isOpen={isOpen}
  onClose={onClose}
>
  {children}
</DsClarityDialog>
```

### ✅ Good Code (LD Modal)

```tsx
// FIXED: destructure { titleId } and apply id={titleId} to the visible title element
<DsClarityDialog
  title={({ titleId }) => (
    <div className="flex items-center">
      <div id={titleId} className="f3 b dark-gray">Charged to card</div>
    </div>
  )}
  isOpen={isOpen}
  onClose={onClose}
>
  {children}
</DsClarityDialog>
```

---

### 🧪 Unit Test Pattern 

```tsx
it('should have aria-labelledby pointing to the title element', () => {
  render(<DsClarityDialog isOpen title={({ titleId }) => <div id={titleId}>Charged to card</div>} onClose={jest.fn()} />);
  const dialog = screen.getByRole('dialog');
  const labelId = dialog.getAttribute('aria-labelledby');
  expect(labelId).toBeTruthy();
  expect(document.getElementById(labelId!)).toBeInTheDocument();
});
```

---

### 💡 Why This Fix Works

LD Modal's `title` render-prop pattern is a **controlled labelling contract**: the modal generates a stable `titleId`, writes it into `aria-labelledby` on the dialog container, then passes it down to the consumer's render function as the only way to apply it to the DOM. If the consumer ignores the argument, the ID is dangling — present in the ARIA attribute but absent from the DOM. The fix simply closes this loop by destructuring and forwarding the ID.
