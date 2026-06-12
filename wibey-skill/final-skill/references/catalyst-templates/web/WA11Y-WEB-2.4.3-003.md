# Catalyst Template: Focus Order: Focus Reset Issue due to JS DOM Re-Rendering (repaint)

**Template ID:** `WA11Y-WEB-2.4.3-003`
**Platform:** Web
**WCAG Criterion:** WCAG-2.4.3

---

## 🛑 The Problem
Focus unexpectedly resets for the screen reader, when the code re-renders or 'repaints' - gets destroyed/rebuilt.

**Expected Result:** Focus should not reset or we should warn the user that it's going to happen.
**Actual Result:** Focus resets after the DOM repaints. The DOM code/react code resets/repaints.

---

## ✅ The Fix Patterns

> **Recommendation:** Maintain a stable DOM structure during interactions to prevent focus shifts. When using dynamic content updates (e.g., with React), ensure that focus remains on the current element or moves logically to the next intended element.

### Standard Implementation
```html
// Best: Ref focus self
        const prev = document.activeElement;
        renderCart(); // your re-render logic
        prev?.focus();
        
        // Store the focused index and restore after render
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

DESTINATION: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/catalyst-templates/web/WA11Y-WEB-2.4.3-003.md

---

## Metadata

- **JIRA:** BCPA-822
- **PR:** #173829
- **Commit:** 15d7ad5cd72b6d51b0484619a9e243cc64ac2368
- **Author:** Vinay Kumar B M (Vinay.Kumar.B.M@walmart.com)
- **WCAG:** 2.4.3 Focus Order (Level A)
- **Template Match:** VARIATION of WA11Y-WEB-2.4.3-003
- **Proposed Variation ID:** WA11Y-WEB-2.4.3-003 (Variation 1)
- **Team:** Design Components / WCP
- **Component:** `WcpSearchBar` — `libs/design-components/wcp-search-bar/src/lib/wcp-search-bar.tsx`

---

## Problem Summary

When a keyboard or screen reader user types into the `WcpSearchBar` component, a `ClearButton` (the "X" icon) appears in the trailing slot. When the user activates the Clear button, the `clear()` handler calls `setSearchText("")`, which triggers a React re-render. Because the `ClearButton` is conditionally rendered only when `searchText` is truthy:

```tsx
trailing={
  searchText && (
    <ClearButton ... onClick={clear} ...>
      <Icon name="Close" />
    </ClearButton>
  )
}
```

After clearing, `searchText` becomes `""` (falsy), so `ClearButton` is **unmounted from the DOM**. When the element receiving focus is removed from the DOM, the browser drops focus to `document.body`. The user loses their place in the page entirely — a clear WCAG 2.4.3 Focus Order failure.

**Expected:** After clearing search text, focus should move to the search input field so the user can immediately continue typing.
**Actual:** Focus is dropped to `document.body` because the `ClearButton` that had focus is removed from the DOM on re-render.

---

## Diff — One Line Fix

**File:** `libs/design-components/wcp-search-bar/src/lib/wcp-search-bar.tsx`

### Bad Code (before — line 114-118)

```tsx
const clear = () => {
  const oldText = searchText;
  setSearchText("");
  onClear?.(oldText);
  // MISSING: no focus restoration after ClearButton unmounts
};
```

### Good Code (after — line 114-119)

```tsx
const clear = () => {
  const oldText = searchText;
  setSearchText("");
  onClear?.(oldText);
  inputRef.current?.focus(); // Restore focus to input after ClearButton unmounts
};
```

The one-line addition is `inputRef.current?.focus();` at line 118.

---

## Why This Fix Satisfies WCAG 2.4.3

WCAG 2.4.3 Focus Order (Level A) requires that if a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation.

The root cause here is a **conditional render unmounting the focused element**. This is the canonical DOM repaint / re-render focus loss pattern (same root cause as WA11Y-WEB-2.4.3-003), but in a specific React form:

1. User presses the ClearButton (it has keyboard focus).
2. `clear()` handler fires.
3. `setSearchText("")` schedules a React re-render.
4. React re-renders: `searchText` is now falsy, so `trailing={searchText && <ClearButton ...>}` evaluates to `false` — `ClearButton` is removed from the virtual DOM and from the real DOM.
5. Browser detects the focused element no longer exists in the DOM and resets focus to `document.body`.
6. **Result:** keyboard/screen reader user loses their position with no warning.

The fix calls `inputRef.current?.focus()` synchronously within the same event handler, before React's async reconciliation drops focus. Because `inputRef` holds a stable reference to the `<input>` element (via the `useRef` hook already present in the component), this call succeeds and moves focus to the text field — the logical continuation point for the user after clearing.

This is not a `useEffect` or deferred restoration — it is an **inline, synchronous, same-handler focus restoration** pattern, which is valid because the `inputRef` target (`WcpTextField` input) is never unmounted during this interaction.

---

## React Lifecycle Detail

```
User activates ClearButton
  -> clear() fires synchronously
  -> setSearchText("") queues state update
  -> onClear?.(oldText) fires
  -> inputRef.current?.focus()  <-- focus moved to input synchronously
  -> React reconciles: ClearButton unmounts (but focus is already on input, not ClearButton)
  -> Browser has no focused element being removed — no focus drop
```

The key insight: React's `setState` is asynchronous (batched), but `inputRef.current?.focus()` is synchronous. The `inputRef` points to the `<input>` element, which is NOT unmounted during this re-render — so the focus call succeeds immediately, and by the time React actually removes the `ClearButton` from the DOM, focus is no longer on it.

---

## Component Context

The `inputRef` was already present in `WcpSearchBarComponent` before this fix, used by the `cancel()` handler to call `inputRef.current.blur()`. The ref is established via a combined `setRefs` callback that merges the internal `inputRef` with any forwarded external `ref`:

```tsx
const inputRef = useRef<HTMLInputElement>(null);

const setRefs = (element: HTMLInputElement | null) => {
  (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = element;
  if (typeof ref === "function") {
    ref(element);
  } else if (ref) {
    (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
  }
};
```

The fix therefore required zero new infrastructure — it reused the already-established `inputRef` to restore focus. This is ideal: minimal change, maximum clarity.

---

## Variation Classification vs WA11Y-WEB-2.4.3-003

| Attribute | WA11Y-WEB-2.4.3-003 (base) | This fix (Variation 1) |
|---|---|---|
| Root cause | DOM repaint / re-render drops focus | Conditional React `trailing` slot unmounts focused ClearButton |
| Framework | Generic JS | React (functional component, hooks) |
| Mechanism | Store `document.activeElement`, restore after render | Inline `inputRef.current?.focus()` in same event handler |
| Ref type | `document.activeElement` (snapshot) | `useRef` (stable reference to non-unmounted element) |
| Trigger | Generic re-render | `setSearchText("")` causing conditional `&&` to evaluate false |
| Component type | Generic cart/list | WCP Design Component (search bar clear action) |

The base template describes the general pattern. This variation adds a concrete, React-specific, WCP-scoped sub-pattern: **"conditionally-rendered action button that unmounts itself when activated, requiring inline `useRef` focus restoration to its triggering field."**

This pattern is likely to recur anywhere a WCP component conditionally shows an action button that, when clicked, causes the condition that rendered it to become false.

---

## Team / Domain Notes

- This is the third BCPA accessibility fix ingested from the `libs/design-components/` WCP shared library (after BCPA-819 and BCPA-821).
- The WCP `WcpSearchBar` uses a `trailing` render slot for the `ClearButton`. The conditional rendering pattern (`searchText && <ClearButton>`) is a standard React idiom that developers often use without considering the focus-loss side effect.
- The `inputRef` dual-assignment pattern (internal ref + forwarded ref merging via `setRefs`) is a WCP architectural convention. Any WCP component using this pattern already has the tooling for inline focus restoration — it just needs the `.focus()` call added to the appropriate action handler.
- **Audit risk:** Any other WCP component that conditionally renders a focusable element that, when activated, causes its own condition to become false is a candidate for this same bug. Search pattern: `trailing={someState && <Button onClick={handler}>}` where `handler` clears `someState`.

---

## Bonus Cross-Criterion Finding

The source file also contains a `role="search"` on the `WcpTextField` (line 153) and `role="searchbox"` in `textFieldProps` (line 187). These are redundant role assignments — `role="searchbox"` on the inner input is correct (it is the searchbox); `role="search"` on the `WcpTextField` wrapper (which renders as a `<div>` or `<label>` wrapper) is fine as a landmark. However, `role="search"` on a non-`<form>` element and simultaneously having a `<form>` with `aria-controls={searchBarId}` pointing to itself may produce confusing AT announcements. This is a low-severity note, not a blocker — no WCAG violation, but worth flagging for the WCP audit backlog.

---

