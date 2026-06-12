# 📥 Recommended Catalyst Templates (Drafts)

*This document serves as a staging ground. When the AI Ingestion workflow encounters a novel bug fix that does not currently exist in the Master JS Index, it will append its findings here.*

*A human architect (or another AI review process) can review these drafts and promote them to official `WA11Y` templates if they are high quality.*

---


### 🛑 The Problem

LD Modal accepts a `title` prop that can be either a `string` or a **render function** `(props: { titleId: string }) => ReactNode`. When a render function is used, LD Modal internally generates a unique `titleId` and passes it to the render function. That ID is intended to be applied as `id={titleId}` on the visible title element — so the dialog's `aria-labelledby` can point to it.

When the render function signature omits the `{ titleId }` destructure argument (i.e., `title={() => (...)}` instead of `title={({ titleId }) => (...)}`), the `titleId` is never applied to the DOM. The dialog's `aria-labelledby` attribute points to an ID that doesn't exist, silently breaking the accessible name for screen readers.

**Expected:** `dialog` element has `aria-labelledby="<id>"` pointing to a real DOM element with a matching `id`.
**Actual:** `aria-labelledby="<id>"` is present but the referenced element has no `id` attribute — the accessible name is effectively absent.

---

### ❌ Bad Code

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

---

### ✅ Good Code

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

### 🧪 Unit Test Pattern (from PR)

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

---

### 📋 Human Review Checklist

- [ ] Confirm this pattern is not a variation of an existing template (checked — nearest is `WA11Y-WEB-4.1.2-005` which covers missing `href`/role on links, not `aria-labelledby` on dialogs)
- [ ] Assign an official ID (proposed: `WA11Y-WEB-4.1.2-012`)
- [ ] Consider updating `final-skill/design-system-docs/web/LD-Modal.md` to add a prominent warning: *"If using a render function for `title`, you MUST destructure `{ titleId }` and apply `id={titleId}` to your title element."*
- [ ] Promote to `final-skill/catalyst-templates/web/WA11Y-WEB-4.1.2-012.md` if approved

---

## Draft #8 — **NOVEL** — Proposed ID: `WA11Y-WEB-1.3.1-007`

**Ingested by:** Wibey Swarm Agent (Parallel Batch Run — Round 2)
**Date:** 2026-03-20
**Ingestion Score:** +5 (Novel pattern — `aria-hidden` incorrectly applied to visible text inside semantically correct list markup; not covered by any existing template)

### Proposed Title
`aria-hidden="true" Incorrectly Applied to Visible List Item Content (AtAGlanceContent product-highlights)`

### WCAG Mapping
- **Criterion:** WCAG 1.3.1 Info and Relationships (Level A)
- **Platform:** Web
- **Component:** `AtAGlanceContent` — `libs/item/product-highlights/`
- **Classification:** NOVEL — nearest template `WA11Y-WEB-1.3.1-002` covers absent list structure; this covers present-but-silenced list content

### Source References
- **Jira:** https://jira.walmart.com/browse/CEPG-348108
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/171966
- **Commit:** `da07fbdc682990f74dc9ce4046f446b72b07012c`
- **Author:** Swathi Savalge (ssavalge@walmart.com)
- **File Fixed:** `libs/item/product-highlights/src/lib/at-a-glance-content.tsx`

> ⚠️ **Sequential Fix Note:** This PR is a follow-up to CEPG-330816 (Draft #9). PR #166589 added `<ul>/<li>` structure to this same file. This PR then removed the `aria-hidden="true"` attributes and `tabIndex={0}` that PR #166589 inadvertently introduced. Read Drafts #8 and #9 together as a two-commit compound pattern.

---

### 🛑 The Problem

The `AtAGlanceContent` component rendered a `<ul>/<li>` tile list where each `<li>` contained `<div>` elements for highlight name and value — both marked `aria-hidden="true"`. A wrapper `<div>` carried `aria-label` + `tabIndex={-1}` (ghost focus target whose content was hidden), and the `<li>` itself had `tabIndex={0}` (non-interactive list items should not be in the tab order). The result: every tile was visually rich but **completely invisible to assistive technology** — the accessible name from `aria-label` on the `<div>` was silently discarded because `<div>` has no role, and `aria-hidden` suppressed the actual text.

**Expected:** Screen reader announces highlight name + value for each tile.
**Actual:** Screen reader announces nothing — tiles are empty to AT despite being fully visible.

---

### ❌ Bad Code

```tsx
<li key={index} className="f6 tc flex justify-center"
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  tabIndex={0}  // ❌ Non-interactive <li> should not be in tab order
>
  <div
    className={classNames("mt0 mb0 flex flex-column justify-center f6")}
    aria-label={`${highlight?.name}: ${highlight?.value}`}  // ❌ aria-label on <div> with no role — silently discarded
    tabIndex={-1}  // ❌ Ghost focus target
  >
    <div className={classNames("b", { pb1: applyItemSnapShotDesign })}
      aria-hidden="true"  // ❌ Hides highlight NAME from screen readers
    >
      <LineClamp lines={applyItemSnapShotDesign ? 1 : 2}>{highlight?.name}</LineClamp>
    </div>
    <div className="ml0"
      aria-hidden="true"  // ❌ Hides highlight VALUE from screen readers
    >
      <LineClamp lines={applyItemSnapShotDesign ? 1 : 2}>{highlight?.value}</LineClamp>
    </div>
  </div>
</li>
```

---

### ✅ Good Code

```tsx
<li key={index} className="f6 tc flex justify-center">
  {/* tabIndex removed — non-interactive list items must not be in tab order */}
  <div className={classNames("mt0 mb0 flex flex-column justify-center f6")}>
    {/* aria-label and tabIndex={-1} removed — content exposed via natural DOM traversal */}
    <div className={classNames("b", { pb1: applyItemSnapShotDesign })}>
      {/* aria-hidden removed — highlight NAME now readable by screen readers */}
      <LineClamp lines={applyItemSnapShotDesign ? 1 : 2}>{highlight?.name}</LineClamp>
    </div>
    <div className="ml0">
      {/* aria-hidden removed — highlight VALUE now readable by screen readers */}
      <LineClamp lines={applyItemSnapShotDesign ? 1 : 2}>{highlight?.value}</LineClamp>
    </div>
  </div>
</li>
```

---

### 💡 Why This Fix Works

The original code attempted "double-announcement prevention" — adding `aria-label` to the wrapper `<div>` and `aria-hidden` to the content divs to funnel announcements through one path. This backfired: a `<div>` with no role has its `aria-label` silently discarded by AT (labels only work on elements with an accessible role). The `aria-hidden` then successfully hid the actual text, leaving tiles empty. Removing `aria-hidden` restores content to the AT tree. Removing `tabIndex={0}` from `<li>` corrects a focus-management violation — non-interactive list items should never be tab stops.

**Root cause class:** "Broken aria-label strategy on roleless elements causes `aria-hidden` to be the only effective attribute — resulting in invisible content."

---

### 📋 Human Review Checklist

- [ ] Screen reader test: each tile must announce highlight name + value in natural reading order
- [ ] Tab-key test: no tile `<li>` should appear as a keyboard tab stop
- [ ] Verify `<LineClamp>` does not itself apply `aria-hidden` for truncated text (full string must remain in DOM)
- [ ] Check regression tests in `at-a-glance-content.spec.tsx` assert content is queryable (not hidden)
- [ ] Assign ID: `WA11Y-WEB-1.3.1-007` — distinct from `WA11Y-WEB-1.3.1-002` (different root cause)

---

---

## Draft — NOVEL — Proposed ID: `WA11Y-WEB-2.1.1-004`

**Ingested by:** Wibey Swarm Agent (Sub-agent run — CEPG-340199)
**Date:** 2026-03-23
**JIRA:** CEPG-340199 | **PR:** #163581
**Commit:** f264cef96bc829000c434b4d9d38a8628e0cd308
**Author:** Mandar Kunte (mandar.kunte@walmart.com)
**File Fixed:** `libs/cart/common-components/src/lib/drone-capacity-meter/drone-capacity-meter.tsx`

---

### Proposed Title
`Button Embedded in LD ProgressIndicator label Prop Loses Keyboard Operability`

---

### WCAG Mapping
- **Criterion:** WCAG 2.1.1 Keyboard (Level A)
- **Hint from ticket:** Link Not Keyboard Operable or Focusable (applies here: interactive element not reachable via keyboard)
- **Platform:** Web
- **Component:** `DroneCapacityMeter` — `libs/cart/common-components/src/lib/drone-capacity-meter/`
- **Classification:** NOVEL — existing 2.1.1 templates (WA11Y-WEB-2.1.1-001/002/003) cover general interactive elements, buttons, and links in plain HTML. This covers a specific LD ProgressIndicator `label` render prop trap where an interactive element embedded inside the prop becomes keyboard-inaccessible.

---

### Source References
- **Jira:** CEPG-340199
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/163581
- **Commit:** `f264cef96bc829000c434b4d9d38a8628e0cd308`
- **File Fixed:** `libs/cart/common-components/src/lib/drone-capacity-meter/drone-capacity-meter.tsx`

---

### The Problem

The `ProgressIndicator` Living Design component accepts a `label` render prop (or prop slot) that is rendered internally by the component. When a `<button>` is placed inside the `label` prop, the LD component renders it inside its own internal DOM structure — which may wrap label content in a non-interactive container, break focus order, or render the button in a position that is not reachable via keyboard Tab navigation.

In this case, the "Drone Capacity Info" `<button>` (which triggers an info bottom sheet) was passed as part of the `label` prop to `ProgressIndicator`. The button had a correct `aria-label` attribute but was unreachable to keyboard users because of how LD `ProgressIndicator` renders its label slot.

Additionally, the `valueLabel` prop was used to render a percentage label — this too was embedded in the component's internal rendering pipeline rather than in external DOM.

**Expected:** The info icon button is focusable and activatable via keyboard (Tab to focus, Enter/Space to activate).
**Actual:** The button inside the `label` prop is not keyboard-reachable because LD `ProgressIndicator`'s internal label rendering removes it from the natural tab order.

---

### Bad Code (before)

```tsx
// WCAG 2.1.1 VIOLATION: <button> embedded inside LD ProgressIndicator label prop
// The button is rendered inside LD's internal label slot, losing keyboard operability
<ProgressIndicator
  variant={value.valuelabel === m(messages, "overCapacity") ? "error" : "info"}
  data-testid="drone-progress-indicator"
  value={value.value}
  min={0}
  max={100}
  valueLabel={value.valuelabel}           // ❌ value label locked inside LD's internal rendering
  label={
    <div className="flex">
      <div
        className="f6 f5-l pr1"
        data-testid="drone-capacity-text"
      >
        {m(messages, "droneCapacity")}
      </div>
      <button                              // ❌ button buried in label prop — not keyboard reachable
        className="tc pa0 ma0 ba b--white bg-white tc shadow-0 hover-shadow-0"
        aria-label={m(messages, "droneCapacityInfo")}
        onClick={() => setShowDialog(true)}
        data-dca-id="B:B12C309037"
        data-dca-intent="__DCA_TBD__"
      >
        <Icon
          size="small"
          name="InfoCircle"
          data-testid="drone-capacity-info-icon"
        />
      </button>
    </div>
  }
/>
```

---

### Good Code (after)

```tsx
// FIXED: ProgressIndicator uses a11yLabelledBy to point to an external label element.
// The <button> and value label are moved outside the LD component into a sibling <div>.
// This restores the button to the natural DOM tab order and makes it keyboard-operable.

<ProgressIndicator
  variant={value.valuelabel === m(messages, "overCapacity") ? "error" : "info"}
  data-testid="drone-progress-indicator"
  value={value.value}
  min={0}
  max={100}
  a11yLabelledBy="drone-capacity-label"   // ✅ points to external DOM element by ID
/>
<div className="flex justify-between items-center mt2">
  <div className="flex items-center">
    <div
      className="f6 f5-l pr1"
      data-testid="drone-capacity-text"
      id="drone-capacity-label"            // ✅ external label element — referenced by a11yLabelledBy
    >
      {m(messages, "droneCapacity")}
    </div>
    <button                                // ✅ button is now in natural DOM — keyboard reachable
      className="tc pa0 ma0 ba b--white bg-white tc shadow-0 hover-shadow-0"
      aria-label={m(messages, "droneCapacityInfo")}
      onClick={() => setShowDialog(true)}
      data-dca-id="B:B12C309037"
      data-dca-intent="open"
      data-dca-event="__DCA_EVENT_TBD__"
    >
      <Icon
        size="small"
        name="InfoCircle"
        data-testid="drone-capacity-info-icon"
      />
    </button>
  </div>
  <div className="f7 gray f7-l">{value.valuelabel}</div>  {/* ✅ value label in regular DOM */}
</div>
```

---

### Why This Fix Works

LD `ProgressIndicator`'s `label` prop renders its content inside the component's internal structure. When a `<button>` is embedded there, the component's internal wrapper may apply non-interactive roles, `aria-hidden`, or render the slot in a DOM position that breaks Tab key focus traversal.

The fix applies two principles:

1. **Never put interactive elements inside LD component label/content slots.** Only static, descriptive text belongs in label slots. Interactive elements must live in the normal document DOM flow.

2. **Use `a11yLabelledBy` with an external `id` instead of the `label` prop when the label is near an interactive sibling.** This links the ProgressIndicator's accessible name to the visible text element (via `aria-labelledby` under the hood) without trapping the interactive button inside the component's internal rendering.

Moving the `<button>` outside the `ProgressIndicator` into a sibling `<div>` restores it to the natural document tab order, allowing keyboard users to Tab to it and activate it with Enter or Space — satisfying WCAG 2.1.1.

The `valueLabel` prop was also removed and replaced with a plain `<div>{value.valuelabel}</div>` outside the component, ensuring consistent rendering outside LD's internal pipeline.

---

### Team / Domain Notes

- **Domain:** Cart (CEPG ticket — maps broadly to Transaction domain; however this component lives in `libs/cart/common-components/` and is Cart-team owned, not payments/checkout)
- **Component path:** `libs/cart/common-components/src/lib/drone-capacity-meter/drone-capacity-meter.tsx`
- **Design System:** Living Design — `ProgressIndicator` from `@walmart-web/livingdesign-components`
- **Pattern applicability:** Any LD component with a `label` prop or content slot prop — if a `<button>`, `<a>`, or other interactive element needs to appear near a LD progress/meter component, it must be placed in a sibling DOM element, not inside the prop slot.
- **Existing 2.1.1 templates:** WA11Y-WEB-2.1.1-001 (general), -002 (button), -003 (link) all address raw HTML or plain LD component misuse. This is the first template addressing LD component render-prop slot trapping of interactive elements.

---

### Bonus Cross-Criterion Findings

- **WCAG 4.1.2 (Name, Role, Value):** The original code's `label` prop embedding also risked misrepresenting the ProgressIndicator's accessible name — the `aria-labelledby` relationship was internal to LD and potentially not surfaced to AT. The fix using `a11yLabelledBy` with an explicit external DOM `id` makes this relationship transparent and verifiable.
- **Focus order (WCAG 2.4.3):** Moving the button out of the LD component slot ensures it appears in logical focus order after the progress bar, which is the correct reading/interaction sequence.

---

### Human Review Checklist

- [ ] Keyboard test: Tab to the info icon button, verify focus is visible and Enter/Space activates the InfoBottomSheet
- [ ] Screen reader test: ProgressIndicator announces "Drone Capacity" as its accessible name (via `aria-labelledby` pointing to `id="drone-capacity-label"`)
- [ ] Screen reader test: Value percentage (e.g., "40% left") is announced as separate text after the progress bar
- [ ] Verify `LD ProgressIndicator` docs (`final-skill/design-system-docs/web/`) to confirm `a11yLabelledBy` is the documented prop for external label association
- [ ] Confirm no other LD components in the codebase use `label` prop to embed `<button>` elements (grep: `label={.*<button`)
- [ ] Assign official ID: `WA11Y-WEB-2.1.1-004` — distinct from existing 2.1.1 templates (different root cause: LD component slot trapping vs. missing semantic element)
- [ ] Promote to `final-skill/catalyst-templates/web/WA11Y-WEB-2.1.1-004.md` if approved

---


DESTINATION: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/RECOMMENDED_TEMPLATES.md

---

## Metadata

- **Jira:** OAMFD-10325
- **PR:** #175430
- **Commit:** `967bbabc1d10ef35069190648d68d9aecd4aad8f`
- **Author:** Apoorv Khare (apoorv.khare@walmart.com)
- **File Fixed:** `libs/search/typeahead/src/lib/search-suggestion.tsx`
- **WCAG Criterion:** 2.1.2 — No Keyboard Trap (Level A)
- **WCAG Hint from ticket:** Focus Order: Focus Trapped in Specific Areas
- **Template Search Result:** NOT_FOUND — no existing template for WCAG 2.1.2
- **Proposed Template ID:** WA11Y-WEB-2.1.2-001
- **Ingested by:** Wibey Swarm Sub-agent
- **Date:** 2026-03-23

---

## Draft — NOVEL — Proposed ID: `WA11Y-WEB-2.1.2-001`

### Proposed Title
`Duplicate aria-selected Span Creates Ghost Focus Target in Search Typeahead — aria-hidden Suppression Fix`

### WCAG Mapping
- **Criterion:** WCAG 2.1.2 No Keyboard Trap (Level A)
- **Platform:** Web
- **Component:** `SearchSuggestion` — `libs/search/typeahead/src/lib/search-suggestion.tsx`
- **Classification:** NOVEL — no existing 2.1.2 template exists in the web catalog

---

### Source References
- **Jira:** https://jira.walmart.com/browse/OAMFD-10325
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/175430
- **Commit:** `967bbabc1d10ef35069190648d68d9aecd4aad8f`
- **Author:** Apoorv Khare (apoorv.khare@walmart.com)
- **File Fixed:** `libs/search/typeahead/src/lib/search-suggestion.tsx`

---

### The Problem

The `SearchSuggestion` component renders each typeahead suggestion as a `<li>` containing two sibling `<span>` elements. The first `<span>` carries `role="option"` and `aria-selected={isHighlighted}` — this is the correct, semantic combobox option element. The second `<span>` also carried `aria-selected={isHighlighted}` (without a role), wrapping an "update query" `<Button>` that had `tabIndex={-1}`.

The problem: the second `<span aria-selected={isHighlighted}>` (without `role="option"`) was an invalid ARIA construct. `aria-selected` is only meaningful on elements with certain interactive roles (e.g., `option`, `gridcell`, `row`, `tab`). A plain `<span>` with `aria-selected` but no matching role causes screen readers and AT to misinterpret the DOM tree. In practice, this created a **duplicate selection state signal** on a non-role element that — in combination with certain AT/browser combinations — created an area from which the keyboard focus could not escape during typeahead navigation. Screen reader users navigating search suggestions with arrow keys or Tab found focus trapped within the suggestion list because AT was confused by the conflicting ARIA state on the wrapper span.

The inner `<Button>` had `tabIndex={-1}` so it was intentionally removed from the tab order — it is an "update query" affordance (arrow-fill button) that should only be reachable programmatically. However, the invalid `aria-selected` on the outer `<span>` still caused AT traversal to stall in that area.

**Expected:** Keyboard users can navigate through search suggestions and Tab out of the typeahead list normally.
**Actual:** Focus (particularly in screen reader + browser combinations using virtual cursor or browse mode) becomes trapped cycling through the suggestion list items because of the invalid `aria-selected` on a roleless `<span>`.

---

### Bad Code (before)

```tsx
// SearchSuggestion render — two sibling spans per suggestion item
// First span: CORRECT — has role="option" and aria-selected
<span
  aria-selected={isHighlighted}
  role="option"
  className="flex flex-auto flex-column mr2"
>
  <Link
    tabIndex={-1}
    aria-label={`${ariaLabel}`}
    // ... navigation link to search results
  >
    {/* suggestion display name / highlight */}
  </Link>
</span>

// Second span: INVALID — aria-selected on a roleless <span>
// This creates a ghost AT target with a selection state signal that confuses screen readers
<span aria-selected={isHighlighted}>   {/* ❌ aria-selected on roleless span — invalid ARIA, causes focus trap */}
  <Button
    useLDButton={false}
    onLinkName={m(messages, "updateQuery")}
    aria-label={m(messages, "updateQueryToDisplayName", {
      displayName: data.displayName,
    })}
    tabIndex={-1}                        {/* button intentionally out of tab order */}
    onClick={isLink ? handleItemClick : handleArrowClick}
    // ...
  >
    <Icon name="ArrowUpLeft" /* update-query arrow icon */ />
  </Button>
</span>
```

---

### Good Code (after)

```tsx
// First span: unchanged — correct role="option" semantic
<span
  aria-selected={isHighlighted}
  role="option"
  className="flex flex-auto flex-column mr2"
>
  <Link
    tabIndex={-1}
    aria-label={`${ariaLabel}`}
    // ...
  >
    {/* suggestion display name / highlight */}
  </Link>
</span>

// Second span: FIXED — aria-hidden="true" added to remove it from the AT tree entirely
// The inner Button retains tabIndex={-1} so it is not in the Tab order
// aria-hidden hides the entire span + button from screen readers, eliminating the ghost AT target
<span aria-selected={isHighlighted} aria-hidden="true">   {/* ✅ aria-hidden removes ghost span from AT tree */}
  <Button
    useLDButton={false}
    onLinkName={m(messages, "updateQuery")}
    aria-label={m(messages, "updateQueryToDisplayName", {
      displayName: data.displayName,
    })}
    tabIndex={-1}
    onClick={isLink ? handleItemClick : handleArrowClick}
    // ...
  >
    <Icon name="ArrowUpLeft" />
  </Button>
</span>
```

---

### Why This Fix Works

The "update query" arrow button is a mouse/pointer affordance — it fills the search input with the suggestion text when clicked, saving the user from typing. It is intentionally `tabIndex={-1}` because keyboard users navigate suggestions via arrow keys within the combobox `listbox`, not via Tab. The button does not need to be in the AT tree because:

1. The `<Link>` inside the first `<span role="option">` already provides full keyboard and AT access to each suggestion item.
2. The "update query" action is an enhancement for pointing-device users; keyboard/AT users activate suggestions by pressing Enter on the focused option.

Adding `aria-hidden="true"` to the second `<span>` removes the entire wrapper and its button child from the accessibility tree. This eliminates the invalid `aria-selected` on a roleless element, which was the root cause of AT confusion and the resulting focus trap. Screen readers now see only the clean `role="option"` span per suggestion item — matching the expected combobox `listbox > option` pattern — and can traverse in and out of the suggestion list without getting stuck.

**Root cause class:** "Invalid `aria-selected` on a roleless element creates a phantom AT node that confuses screen reader virtual cursor traversal, producing a perceived focus trap (WCAG 2.1.2)."

---

### Unit Test Pattern (from PR)

The PR updated `typeahead-container.spec.tsx` and related tests to use `userEvent` instead of `fireEvent` for keyboard interaction testing. Key pattern:

```tsx
import userEvent from '@testing-library/user-event';

it('should allow keyboard navigation out of suggestion list', async () => {
  const user = userEvent.setup();
  render(<TypeaheadContainer {...props} />);

  // Open typeahead
  await user.type(screen.getByRole('combobox'), 'shoes');

  // Navigate suggestions with arrow keys
  await user.keyboard('{ArrowDown}');
  await user.keyboard('{ArrowDown}');

  // Escape should close typeahead and return focus — not trap
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

  // Tab should move focus out of the search area
  await user.keyboard('{Tab}');
  expect(screen.getByRole('combobox')).not.toHaveFocus();
});
```

---

### Human Review Checklist

- [ ] Screen reader test (NVDA+Chrome, VoiceOver+Safari): navigate into typeahead suggestions with arrow keys, verify Tab and Escape both exit the list cleanly
- [ ] Verify the `aria-hidden="true"` span does not inadvertently hide the update-query button from mouse users (it does not — `aria-hidden` only affects AT, not pointer/click behavior)
- [ ] Confirm `tabIndex={-1}` on the inner Button is still present post-fix (it is — only the span gained `aria-hidden`)
- [ ] Check that no other `<span aria-selected=...>` without `role` exists elsewhere in the typeahead component tree (grep: `aria-selected` without adjacent `role=`)
- [ ] Assign official ID: `WA11Y-WEB-2.1.2-001` — first template for WCAG 2.1.2 No Keyboard Trap on web platform
- [ ] Promote to `final-skill/catalyst-templates/web/WA11Y-WEB-2.1.2-001.md` if approved

---

### Team / Domain Notes

- **Domain:** Discovery
- **Team:** Search (maps to `libs/search/typeahead/`)
- **File path routing:** `libs/search/typeahead/src/lib/search-suggestion.tsx` → Discovery / Search team
- **Existing team file:** `/Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Discovery/search.md`
- **Jira prefix mapping:** `OAMFD-` is a new unmapped Jira prefix. Based on the diff file path (`libs/search/typeahead/`), this ticket belongs to the **Discovery / Search** team. `OAMFD-` appears to be a separate Jira project key used by this team alongside `A11Y-US-Team-Search`.

---


---

# Ingestion Draft: PR #161559 (No Jira)

**JIRA:** None (PR-only entry) | **PR:** #161559
**WCAG:** 2.1.2 — No Keyboard Trap (Level A)
**Commit:** 211d9188b23df23d81fee8543a59658d761693cb
**Author:** Prakhar Mittal (Prakhar.Mittal@walmart.com)
**Date:** 2025-09-26
**Template ID (existing):** NOT_FOUND — no WA11Y-WEB-2.1.2-* template exists
**Classification:** NOVEL — propose `WA11Y-WEB-2.1.2-001`

---

## Summary

In the Subscription "Change Delivery Date" flow, the `DatePicker` component was rendered with
`isOpen` hardcoded to `true` and both `onOpen` and `onClose` wired to `noop`. This caused the
date picker calendar to always be open inside the modal, with no mechanism to close it. Because
the LD `DatePicker` calendar panel intercepts Tab and Arrow key navigation internally, focus was
permanently trapped inside the calendar widget — keyboard users could not escape to other parts
of the page or modal without closing the browser.

The developer's own inline comment confirms the root cause:
> "Can't keep it open after date selection because otherwise focus will again be trapped in modal"

The fix introduces a `useState` boolean (`isDatePickerOpen`) to control the open/collapsed state.
The calendar now starts collapsed (closed) and only opens when the user explicitly activates the
date input trigger button. After a date is selected, `onClose` calls `setIsDatePickerOpen(false)`,
collapsing the calendar and releasing keyboard focus back to the normal document flow.

---

## File Path / Component

- **Repo:** `Walmart-Web-2` (walmart-web/walmart monorepo)
- **Primary source file:** `libs/subscription/manage-optimizations/src/lib/change-delivery-date-components/change-delivery-date-selection.tsx`
- **Test file:** `libs/subscription/manage-optimizations/src/__tests__/integration/change-delivery-date-components/change-delivery-date-button.spec.tsx`
- **Component:** `ChangeDeliveryDateSelection`
- **Context:** Subscription manage-optimizations — "Change Delivery Date" modal flow

---

## Bad Code (before)

```tsx
// libs/subscription/manage-optimizations/src/lib/change-delivery-date-components/change-delivery-date-selection.tsx

// ❌ WCAG 2.1.2 VIOLATION: DatePicker always open, onOpen/onClose both suppressed with noop
// Focus is permanently trapped inside the calendar widget — keyboard users cannot escape
import { noop } from "@walmart-web/platform-utils-functions";
import { FC } from "react";

// No state to control open/close:
// const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);  // MISSING

<div
  style={{
    width: "324px",
    height: "410px",   // ❌ Fixed height — calendar always occupies space
  }}
>
  <DatePicker
    minDate={getDate(scheduleStartDate)}
    maxDate={getDate(scheduleEndDate)}
    value={selectedDate}
    onSelect={onChangeDate}
    onClose={noop}   // ❌ Suppresses close event — calendar cannot collapse
    onOpen={noop}    // ❌ Suppresses open event — no open/close lifecycle
    size="large"
    isOpen           // ❌ Always open — focus trapped in calendar at all times
  />
</div>
```

**Why it violates WCAG 2.1.2:**
WCAG 2.1.2 (No Keyboard Trap) requires that keyboard focus is never permanently trapped in a
component. The LD `DatePicker` calendar captures Tab and Arrow keys while open. With `isOpen`
hardcoded to `true` and both lifecycle callbacks silenced by `noop`, there is no keyboard path
out of the calendar widget — the user is stuck.

---

## Good Code (after)

```tsx
// libs/subscription/manage-optimizations/src/lib/change-delivery-date-components/change-delivery-date-selection.tsx

// ✅ FIXED: Controlled open/close state — DatePicker only open when user activates it
import { FC, useState } from "react";
// noop import removed — no longer needed

const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);  // ✅ Starts closed

<div
  style={{
    width: "324px",
    height: isDatePickerOpen ? "410px" : "80px",  // ✅ Collapses when closed
    transition: "height 200ms ease-in-out",        // ✅ Smooth visual collapse
  }}
>
  <DatePicker
    minDate={getDate(scheduleStartDate)}
    maxDate={getDate(scheduleEndDate)}
    value={selectedDate}
    onSelect={onChangeDate}
    onOpen={() => setIsDatePickerOpen(true)}    // ✅ Opens calendar on user action
    onClose={() => setIsDatePickerOpen(false)}  // ✅ Collapses calendar, releases focus
    // Comment from author: "Can't keep it open after date selection because
    // otherwise focus will again be trapped in modal"
    size="large"
    isOpen={isDatePickerOpen}  // ✅ Controlled — not hardcoded to true
  />
</div>
```

**Why it fixes WCAG 2.1.2:**
1. `isOpen={isDatePickerOpen}` — the calendar is closed by default. It only opens on explicit
   user intent (activating the date input trigger button).
2. `onClose={() => setIsDatePickerOpen(false)}` — after date selection or dismissal, the
   calendar collapses and keyboard focus returns to the document flow. The focus trap is broken.
3. `onOpen={() => setIsDatePickerOpen(true)}` — restores the normal open/close lifecycle that
   `noop` was suppressing. The LD DatePicker's internal focus management now functions correctly
   because it can receive the close signal.
4. The container height is collapsed to `80px` when closed, preventing the invisible-but-open
   calendar from consuming tab stops off-screen.

---

## Why This Pattern Matters (WCAG 2.1.2)

WCAG 2.1.2 requires that if keyboard focus can move into a component, the user must be able to
move focus away using standard keys (Tab, Shift+Tab, Escape, Arrow keys). Date picker widgets
are a classic trap vector because they intercept keyboard navigation internally.

The root cause here is a development anti-pattern: using `noop` to suppress lifecycle callbacks
on a stateful component rather than controlling state properly. When `onClose={noop}`, the
component never gets the signal to release focus — the developer intended to "always show the
calendar" but inadvertently made the calendar a permanent keyboard prison.

**Rule:** Never wire `onClose` or `onDismiss` on an LD/WCP DatePicker, Dialog, or Menu to
`noop`. If the calendar/panel must be visible, it must still be closable and re-openable via
keyboard to satisfy WCAG 2.1.2. Control visibility through state (`useState`), not by
suppressing lifecycle events.

---

## Test Coverage Added

The spec file (`change-delivery-date-button.spec.tsx`) was updated to reflect the new
collapsed-by-default state. Two test locations now include:

```tsx
// Step 1: Find and click the date input trigger (required because calendar starts closed)
const dateInputTrigger = await screen.findByRole("button", {
  name: /current delivery date calendar picker, selected monday, august 18, 2025/i,
});
fireEvent.click(dateInputTrigger);  // ✅ Opens the calendar before querying date buttons

// Step 2: Now the calendar dates are accessible
const dateButton = await screen.findByRole("button", {
  name: /Sunday, August 10, 2025/i,
});
```

This test change proves the behavioral contract: the calendar dates are only reachable after
explicitly opening the calendar. The implicit regression test for WCAG 2.1.2 is that if
`isOpen` were hardcoded back to `true`, the `fireEvent.click(dateInputTrigger)` step would be
unnecessary and the test structure would diverge.

---

## Pattern Classification

**NOVEL** — No existing WA11Y-WEB-2.1.2-* template exists in the catalyst-templates/web/
directory. This is the first documented instance of the noop-suppressed-lifecycle focus trap
pattern for LD DatePicker in the subscription domain.

Nearest existing templates:
- `WA11Y-WEB-2.1.1-*` (Keyboard operability) — different criterion; covers elements not
  reachable by keyboard, not elements that trap keyboard focus once reached.
- `WA11Y-WEB-2.4.3-*` (Focus Order) — different criterion; covers logical focus sequence,
  not permanent entrapment.

**Proposed template ID:** `WA11Y-WEB-2.1.2-001`
**Proposed title:** "DatePicker/Dialog Always-Open State Creates Keyboard Focus Trap"

---

## Team / Domain Notes

- **Domain:** Subscriptions
- **Team:** manage-optimizations (sub-library of subscription)
- **Jira label pattern:** Based on repo path `libs/subscription/manage-optimizations/` — maps
  to the Subscriptions domain. No Jira prefix available for this PR (PR-only entry).
- **Design System:** LD `DatePicker` from `@walmart-web/livingdesign-components`
- **Pattern applicability:** Any LD or WCP component with an `isOpen`/`isVisible` prop and
  lifecycle callbacks (`onOpen`, `onClose`, `onDismiss`). If the component captures keyboard
  focus while open, `isOpen` must never be hardcoded to `true` in production code — it must be
  controlled via state with working `onClose` callback.
- **i18n:** Component uses `@walmart-web/platform-i18n` (`m(messages, ...)`) — consistent with
  subscription domain conventions.
- **Related component file (full path):**
  `libs/subscription/manage-optimizations/src/lib/change-delivery-date-components/change-delivery-date-selection.tsx`

---

## Human Review Checklist

- [ ] Verify no other `DatePicker` usages in `libs/subscription/` use `isOpen` hardcoded to
      `true` with `noop` callbacks (grep: `isOpen\s*$` or `onClose={noop}` near `DatePicker`)
- [ ] Confirm LD DatePicker docs (`final-skill/design-system-docs/web/`) document that
      `onClose` must not be suppressed when focus trapping is a concern
- [ ] Assign official ID: `WA11Y-WEB-2.1.2-001` — first 2.1.2-criterion template for Web
- [ ] Promote to `final-skill/catalyst-templates/web/WA11Y-WEB-2.1.2-001.md` if approved
- [ ] Add note to Subscriptions team file about controlled DatePicker state pattern

---

## Bonus Cross-Criterion Findings

- **WCAG 2.4.3 (Focus Order):** Collapsing the calendar to `height: 80px` when closed
  removes calendar day buttons from the visible layout. If `isOpen=false` but the calendar
  DOM were still present and focusable, it could disrupt logical focus order. The height
  collapse combined with `isOpen` controlled state ensures calendar buttons are genuinely
  absent from the tab order when collapsed.
- **No WCAG 4.1.2 issues** observed — the DatePicker component handles its own
  accessible name/role/state internally.

---


DESTINATION: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/RECOMMENDED_TEMPLATES.md

---

**JIRA:** CEPG-335619 | **PR:** #166765
**WCAG:** 2.1.2 — No Keyboard Trap (Level A)
**Template ID:** NOT_FOUND — no existing `WA11Y-WEB-2.1.2-*` template exists. This is the first 2.1.2 candidate.
**Proposed Template ID:** `WA11Y-WEB-2.1.2-001`
**Commit:** `6028cf2d3998cf53047f8131491ae4707ffa779f`
**Author:** Cassie Guo (q0g011x) — Sams Club
**Date:** 2025-11-14

---

## Summary

On the Sam's Club Category Page, the `ProductCard` component was implemented using a full-card `<Link>` wrapper that enclosed all interactive child elements (CTA buttons, W+ buttons, splash buttons). Because the `<Link>` acted as the outer wrapper, the interior focusable buttons were all children of the anchor, creating a nested-focusable-inside-anchor structure. Keyboard users navigating into the card could not Tab back out — they became trapped cycling through the card's internal interactive elements with no route to escape to the next card or surrounding page content.

A secondary issue existed in `pov-n-up.tsx`: non-interactive container `<div>`-like grid cell components were given `tabIndex={0}`, which added them to the tab order unnecessarily. These elements had no keyboard handler, so focus would land on them and keyboard users could not activate anything — a dead stop in the focus order (a form of functional keyboard trap).

---

## File Paths / Components

- **Repo:** `Walmart-Web-2` (walmart-web monorepo)
- **Primary source file:** `libs/tempo-shared-modules/product-card/src/lib/product-card.tsx`
- **Secondary source file:** `libs/tempo-shared-modules/pov-n-up/src/lib/pov-n-up.tsx`
- **Trigger file:** `libs/sams/journey/category-page/src/lib/category-page.tsx` (enabled `enableTempoProductCard: true` CCM flag to activate the fixed component)
- **Component:** `ProductCard` (exported as `ProductCard`) and `PovNUp` (Mobile + Desktop variants)
- **Context:** Sam's Club category/search results page — product card grid

---

## Root Cause

### Cause 1: Full-card `<Link>` wrapper trapping nested interactive elements

The `ProductCard` rendered a `<Link>` as the outermost wrapper for the entire card, then placed CTA buttons (`PovDisplayButton`, `WPlusPauseGatedButton`, splash `<Button>`) as **children inside** the `<Link>`. Per HTML spec, interactive content (buttons, inputs) must not be descendents of `<a>` elements. When this constraint is violated, browser focus handling becomes inconsistent — the buttons receive focus independently, but the anchor's tab stop combined with the buttons' tab stops creates a multi-stop trap that keyboard users cannot exit predictably.

### Cause 2: `tabIndex={0}` on non-interactive grid containers in `pov-n-up.tsx`

The `MobilePovNUp` and `DesktopPovNUp` grid layout components passed `tabIndex={0}` to their card grid cell containers (`aria-label` was set but no keyboard handler was wired). This placed silent, non-operable elements into the tab sequence. Users tabbing through product cards would land on these containers with no way to activate them and no clear affordance to move on — a keyboard trap by unexpected stop.

---

## Bad Code (before)

### product-card.tsx — Full-card anchor wrapping interactive children

```tsx
// WCAG 2.1.2 VIOLATION: <Link> wraps ALL card content including focusable buttons.
// Buttons nested inside <a> create an inescapable focus cluster.
} else if (shouldRenderWrapperLink) {
  renderCardContent = (
    <Link
      onLinkName={(onLinkName ?? analyticsLinkConfig) ? title : "itemClick"}
      className="no-underline pointer"
      onLinkExtras={analyticsLinkConfig ?? beaconsData}
      uid={uid}
      {...clickProp}
      data-dca-id="L:33A8477641"
    >
      {generateCardContent(cardContents)}
      {/* generateCardContent contains <Button> elements — now nested inside <a> */}
    </Link>
  );
}
```

```tsx
// Button inside the card (one of several):
// ❌ This <Button> is a child of the <Link> anchor above — invalid HTML
<Button
  className={classnames(
    customCtaClass,
    "b mv3 ml3 ph3 f6 ba br4 hover-white hover-bg-black outline-0 no-underline ",
    { ... }
  )}
>
  {linkLabel}
</Button>
```

### pov-n-up.tsx — Inert container with tabIndex={0}

```tsx
// WCAG 2.1.2 VIOLATION: tabIndex={0} on a non-interactive container.
// Keyboard focus lands here; no key handler exists; user is stuck.
<GridCell
  key={`${card.headingText}${card.descriptionText}`}
  aria-label={`${card.headingText} ${card.descriptionText}`}
  tabIndex={0}   // ❌ adds a dead focus stop — no keyboard handler wired
  UNSAFE_className={classNames({ pb3: cardLayout === "MULTIROWGRID" })}
>
  <PovCardIntlAdWrapper card={card} ... />
</GridCell>
```

---

## Good Code (after)

### product-card.tsx — Stretched-link pattern with `VisuallyHidden` title

```tsx
// WCAG 2.1.2 FIX: Separate the anchor from the interactive children.
// The Link becomes a visually full-card overlay (position: absolute, z-index: 1)
// but sits ABOVE the card in z-order, with the interactive buttons also
// promoted to z-1 so they receive pointer and keyboard events independently.
} else if (shouldRenderWrapperLink) {
  renderCardContent = (
    <div className="relative">
      <Link
        onLinkName={(onLinkName ?? analyticsLinkConfig) ? title : "itemClick"}
        className="absolute top-0 left-0 w-100 h-100 z-1 db no-underline pointer"
        onLinkExtras={analyticsLinkConfig ?? beaconsData}
        uid={uid}
        {...clickProp}
        data-dca-id="L:33A8477641"
      >
        <VisuallyHidden>{title}</VisuallyHidden>
      </Link>
      {generateCardContent(cardContents)}
      {/* Buttons are now SIBLINGS of the Link, not children — valid HTML */}
    </div>
  );
}
```

```tsx
// All CTA buttons gain `relative z-1` so they sit above the stretched link
// overlay and capture pointer/keyboard events correctly:
<Button
  className={classnames(
    customCtaClass,
    "b mv3 ml3 ph3 f6 ba br4 hover-white hover-bg-black outline-0 no-underline relative z-1",
    { ... }
  )}
>
  {linkLabel}
</Button>
```

### pov-n-up.tsx — Remove spurious `tabIndex={0}` from containers

```tsx
// WCAG 2.1.2 FIX: Remove tabIndex from non-interactive container.
// The card's internal links/buttons handle their own focus — no extra stop needed.
<GridCell
  key={`${card.headingText}${card.descriptionText}`}
  aria-label={`${card.headingText} ${card.descriptionText}`}
  // tabIndex={0} REMOVED — container is not interactive
  UNSAFE_className={classNames({ pb3: cardLayout === "MULTIROWGRID" })}
>
  <PovCardIntlAdWrapper card={card} ... />
</GridCell>
```

---

## Why It Works

### Stretched-link pattern (product-card.tsx)
The "stretched link" is a well-established accessible pattern (used by Bootstrap, GOV.UK Design System, etc.) for making an entire card clickable without wrapping interactive children inside an anchor:

1. The wrapping `<div className="relative">` establishes a positioning context.
2. The `<Link>` becomes `position: absolute; top: 0; left: 0; width: 100%; height: 100%` — it visually covers the entire card but is now a sibling (not ancestor) of the buttons.
3. `<VisuallyHidden>{title}</VisuallyHidden>` gives the link a screen-reader-accessible label while remaining invisible — satisfies WCAG 2.4.6 (Headings and Labels) and 4.1.2 (Name, Role, Value).
4. Buttons are given `relative z-1` (same stacking context level), meaning pointer and keyboard events hit the buttons before the stretched link overlay. Keyboard Tab naturally moves between the link and the buttons as independent focusable elements — no nesting, no trap.
5. Because the `<Link>` anchor contains only a `<VisuallyHidden>` span (no interactive descendants), the HTML is now valid and browser focus management behaves predictably.

### Removing `tabIndex={0}` from containers (pov-n-up.tsx)
Grid container elements (`GridCell`) are not interactive. Adding `tabIndex={0}` to them created phantom focus stops: keyboard users would Tab onto the container, find no activation affordance, and be unable to move forward without guessing that Tab would eventually escape. Removing `tabIndex` from purely structural containers eliminates these dead stops, restoring unobstructed sequential focus order per WCAG 2.1.2.

---

## Pattern Classification

This is a **new template** — `WA11Y-WEB-2.1.2-001`. No existing 2.1.2 templates exist in the library.

The fix combines two sub-patterns:
- **Sub-pattern A:** "Stretched link" — replace full-card `<Link>` wrapper with an absolutely-positioned sibling link + `VisuallyHidden` label. Buttons become independent tab stops.
- **Sub-pattern B:** Remove `tabIndex={0}` from non-interactive structural containers.

Both are directly motivated by WCAG 2.1.2 (No Keyboard Trap): users must be able to move focus **away from** any component using standard keyboard navigation.

This is distinct from WCAG 2.1.1 (Keyboard) — the issue is not that elements are unreachable but that focus becomes stuck (cannot escape) once inside the card.

---

## Team / Domain Notes

- **Domain:** Discovery (Sams Club journey — category page + shared tempo modules)
- **Author:** Cassie Guo (q0g011x) — `Cassie.Guo@samsclub.com`
- **Lib paths:**
  - `libs/tempo-shared-modules/product-card/` — shared across Walmart and Sams Club experiences
  - `libs/tempo-shared-modules/pov-n-up/` — shared POV (Point of View) N-Up card grid
  - `libs/sams/journey/category-page/` — Sams Club specific category page shell
- **CCM flag:** `enableTempoProductCard: true` was added to `category-page.tsx` as part of this fix — the new accessible `ProductCard` is gated behind this flag on the Sams Club category page.
- **Framework:** React TSX, NX monorepo, Tachyons utility CSS for positioning (`relative`, `absolute`, `z-1`, `w-100`, `h-100`)
- **VisuallyHidden import:** `import { VisuallyHidden } from "@walmart-web/livingdesign-components"` — LD component, not a custom implementation. Use this import (not a manual CSS-only visually-hidden class) for consistency.

---


---

# Draft Ingest: OAMD-7124 — Focus Trapped in Modal Marketing Content Banner

**Jira:** OAMD-7124
**PR:** #121820
**Commit:** 0aa75ed0e518ca42cee950c1aaf71c79753a18fe
**WCAG Criterion:** 2.1.2 — No Keyboard Trap (Focus Order: Focus Trapped in Specific Areas)
**Template Match:** NOT_FOUND (no 2.1.2 template exists; closest is WA11Y-WEB-2.1.1-001 which covers 2.1.1 keyboard operability, not 2.1.2 keyboard trap)
**Proposed New Template ID:** WA11Y-WEB-2.1.2-001
**File:** `libs/item/modal-marketing-content/src/lib/modal-marketing-content.tsx`
**Team:** Discovery / Item Page (PDP)
**Author:** Tresa Ignatius (t0i00nt)
**Date:** 2024-12-03

---

## Root Cause Analysis

The `ModalMarketingContentBanner` component rendered a `<div role="button" tabIndex={0}>` banner element. This element had both `onClick` and `onKeyDown` bound to the same handler: `handleBannerClick`.

`handleBannerClick` calls `setDialogOpen(true)`, which opens a modal dialog.

The critical problem: `onKeyDown` fires on **every key press while the element has focus**, including Tab and Shift+Tab (which are the standard keyboard navigation keys). When a keyboard user pressed Tab to move focus forward, the handler immediately opened the dialog. This created a focus trap because:

1. User tabs to the banner element
2. User presses Tab to move past it
3. `onKeyDown` fires, opens the dialog
4. Focus is now inside the modal dialog
5. The user cannot proceed past the banner without triggering the modal

This violates WCAG 2.1.2 (No Keyboard Trap): users must be able to move focus away from a component using standard navigation keys (Tab / Shift+Tab). Intercepting those keys and opening a modal is equivalent to trapping focus.

---

## Bad Code vs Good Code

### Bad Code (before fix)

```tsx
// ❌ BAD — onKeyDown fires on ALL keys including Tab/Shift+Tab
// Pressing Tab to navigate past this element triggers handleBannerClick,
// which opens a dialog — effectively trapping keyboard focus here.
<div
  data-testid="ip-modal-marketing-content"
  className={classNames("br3 shadow-1 ph5")}
  role="button"
  onClick={handleBannerClick}
  onKeyDown={handleBannerClick}   // <-- THIS LINE causes the trap
  tabIndex={0}
>
  <SandboxHtmlView htmlString={bannerContent} />
</div>
```

The handler itself:
```tsx
const handleBannerClick = () => {
  setDialogOpen(true);   // Opens a modal — intercepts ALL keydown events including Tab
  sendBeacon({ ... });
};
```

### Good Code (after fix)

```tsx
/* eslint-disable jsx-a11y/click-events-have-key-events */

// ✅ GOOD — onKeyDown removed entirely; Tab/Shift+Tab now move focus normally
// The eslint-disable is explicitly added to acknowledge the trade-off:
// the element is not keyboard-activatable via Enter/Space, but that is
// acceptable here because the focus trap (WCAG 2.1.2) is the more critical issue.
<div
  data-testid="ip-modal-marketing-content"
  className={classNames("br3 shadow-1 ph5")}
  role="button"
  onClick={handleBannerClick}
  tabIndex={0}
>
  <SandboxHtmlView htmlString={bannerContent} />
</div>
```

---

## Why It Works

Removing `onKeyDown` allows the browser's default keyboard navigation to function normally. Tab and Shift+Tab no longer trigger the modal, so keyboard users can move focus forward or backward past the banner without being trapped.

The `eslint-disable jsx-a11y/click-events-have-key-events` comment is significant: the `jsx-a11y` ESLint rule normally requires that any element with an `onClick` also have a corresponding `onKeyDown`/`onKeyPress` handler (for Enter/Space activation). The team explicitly disabled this rule, accepting a minor WCAG 2.1.1 regression (the button is not keyboard-activatable via Enter/Space) in order to fix the more severe WCAG 2.1.2 violation (focus trap). The ideal fix would be to use `<button>` or to scope the `onKeyDown` to only handle `Enter` and `Space` keys:

```tsx
// IDEAL FIX (not implemented in this PR, but recommended for follow-up)
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleBannerClick();
  }
  // Tab, Shift+Tab, Escape, Arrow keys are NOT intercepted — they fall through normally
}}
```

---

## Key Pattern / Architectural Insight

**Root pattern:** Binding a handler that opens a modal directly to `onKeyDown` without filtering for specific keys (Enter/Space) is a WCAG 2.1.2 focus trap anti-pattern. Any `onKeyDown` handler on a focusable element that does not check `e.key` will intercept Tab navigation.

**Detection signature:**
- `onKeyDown={handler}` where `handler` does NOT check `e.key`
- The same `handler` is also bound to `onClick`
- The element has `tabIndex={0}` (is in the tab order)

**Grep pattern to find this anti-pattern:**
```
onKeyDown=\{handle[A-Z][a-zA-Z]+\}
```
Cross-reference with `tabIndex={0}` on the same element and absence of `e.key` filter inside the handler.

---

## Team / Domain Notes

- **Lib path prefix:** `libs/item/` confirms Discovery / Item Page team
- **Component:** `modal-marketing-content` — a banner that opens a marketing dialog on the Product Detail Page (PDP)
- **OAMD- prefix mapping:** This is a new Jira prefix not previously mapped. Based on the diff path `libs/item/...`, OAMD- maps to **Discovery / Item Page** team.
- **Jira label in teams file:** `A11Y-US-Team-ItemPage` (from `teams/Discovery/item-page.md`)

---


---


# Draft Template: WA11Y-WEB-4.1.2-013
## WCAG 4.1.2 — Hardcoded `aria-pressed="false"` on Custom Toggle Button (State Never Announced)

**Template ID (proposed):** `WA11Y-WEB-4.1.2-013`
**Platform:** Web
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Sub-criterion label:** Pressed/Not Pressed State Not Announced (Toggle Button)
**Classification:** NOVEL — no existing template covers hardcoded static `aria-pressed` on a custom role="button" div

---

## The Problem

A custom `<div role="button">` was used as a service-type selection toggle in the Omni Scheduler
service screen. The element carried `aria-pressed="false"` as a static string literal — this
value was hardcoded and never updated to reflect the actual selection state managed by
`useState<schedulerService>()`.

Result: screen readers always announced the button as "not pressed" regardless of which service
the user had selected, making the toggle's pressed/selected state completely invisible to
assistive technology.

**Root cause:** `aria-pressed` was written as a JSX string attribute (`aria-pressed="false"`)
instead of a dynamic boolean expression. Even if the intent was to wire it later, a static
`"false"` is semantically worse than omitting the attribute — it actively misleads AT by
announcing a definitive "not pressed" state at all times.

---

## Component / File Context

- **File:** `libs/omni-scheduler/scheduler-components/src/lib/ui/service-screen/service-screen.tsx`
- **Component:** `ServicePage` — renders a list of service type cards (e.g., Oil Change variants)
- **Selection state:** `const [serviceSelected, setServiceSelected] = useState<schedulerService>()`
- **Selection check:** `checkIsSelected(service)` — returns `serviceSelected?.id === service?.selectionId`
- **Pattern:** Custom `<div role="button" tabIndex={0}>` acting as a single-select toggle card; no native `<button>` or WCP Button component used

---

## Variation 1 — Hardcoded `aria-pressed` Replaced by State-Embedded `aria-label`

### ❌ Bad Pattern

```tsx
// WCAG 4.1.2 VIOLATION:
// aria-pressed="false" is a static string — it never updates to reflect the
// actual selected service. Screen readers always announce "not pressed" even
// when this service IS the currently selected option.
<div
  className={cx("...", {
    "selected-class": checkIsSelected(service),
  })}
  tabIndex={0}
  role="button"
  aria-pressed="false"                          // ❌ hardcoded — always "false"
  onClick={() => serviceTypeSelected(service)}
  onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      serviceTypeSelected(service);
    }
  }}
>
  ...
</div>
```

### ✅ Good Pattern

```tsx
// FIXED:
// 1. Remove the static aria-pressed="false".
// 2. Introduce getAriaLabel() that prepends "Selected" to the accessible name
//    when checkIsSelected(service) is true.
// 3. Pass the dynamic label via aria-label on the role="button" element.

const getAriaLabel = (service: ServiceSection, isSelected: boolean) => {
  const labelWithPrefix = service.priceLabelPrefix
    ? `${service.displayName} ${service.description} ${service.priceLabelPrefix} `
    : `${service.displayName} ${service.description} `;
  const label = service.priceQualifier
    ? `${labelWithPrefix} ${service.priceString} ${service.priceQualifier}`
    : `${labelWithPrefix} ${service.priceString}`;

  // ✅ "Selected" prefix makes the pressed/selected state audible to screen readers
  return isSelected ? `Selected ${label}` : label;
};

// In JSX:
<div
  className={cx("...", {
    "selected-class": checkIsSelected(service),
  })}
  tabIndex={0}
  role="button"
  aria-label={getAriaLabel(service, checkIsSelected(service))}  // ✅ dynamic, state-aware
  onClick={() => serviceTypeSelected(service)}
  onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      serviceTypeSelected(service);
    }
  }}
>
  ...
</div>
```

---

## Why It Works

`aria-pressed` requires a live boolean (or the string `"true"`/`"false"` wired to component
state) to convey toggle semantics — a hardcoded `"false"` string is semantically equivalent to
a permanently-off button and actively misleads AT. Embedding the selection state directly into
the `aria-label` string (prefixing `"Selected "` when `isSelected` is true) is the correct
fallback for custom `role="button"` elements where `aria-pressed` is impractical to wire, and
mirrors the established pattern in `WA11Y-WEB-4.1.2-001.md` for non-native interactive elements.

> **Note on i18n:** The fix in this PR hard-codes the English string `"Selected"`. For full
> locale compliance (es-US, es-CL, es-MX, fr-CA, en-CA) this should be `m(messages, "selected")`
> via the existing i18n pipeline. Teams implementing this pattern in new components should always
> use `m(messages, key)` — not raw English strings — to avoid a separate WCAG failure for
> non-English locales.

---

## Decision Rationale: `aria-label` vs `aria-pressed`

| Approach | Valid? | Notes |
|---|---|---|
| `aria-pressed={checkIsSelected(service)}` | Yes — preferred if component is truly a toggle | Must be boolean, not string. Announces "button, pressed" or "button, not pressed". Correct for true two-state toggles. |
| `aria-label` with "Selected" prefix | Yes — valid fallback | Gives richer context (announces full service name + state). Used here because the existing component structure does not track a distinct "unpressed" announcement and the accessible name was otherwise incomplete. |
| `aria-pressed="false"` (static string) | VIOLATION | Permanently announces "not pressed". Actively misleads AT. |
| CSS class change only (no ARIA) | VIOLATION | Visual state change with no AT equivalent. |

---

## Human Review Checklist

- [ ] **Screen reader test:** Navigate to the service selection screen with NVDA+Chrome or
  VoiceOver+Safari. Tab to the service cards. Confirm each card announces the service name,
  description, and price. Select a service — confirm the selected card now announces "Selected"
  at the start of its label and unselected cards do not.
- [ ] **i18n gap:** The PR uses the raw string `"Selected"` — verify the `selected` key exists
  in `messages.ts` + all locale YAML files. If not, add it and swap to `m(messages, "selected")`.
- [ ] **`aria-pressed` vs `aria-label` decision:** If this component is truly a toggle (can be
  pressed and un-pressed), `aria-pressed={checkIsSelected(service)}` (boolean) is semantically
  cleaner and preferred. The `aria-label` approach here conflates role/value into the name string,
  which is acceptable but non-standard. Align with the team on which semantics are intended.
- [ ] **Keyboard interaction:** Confirm Space and Enter keys trigger `serviceTypeSelected()` and
  the new `aria-label` updates to reflect the new selection on re-render.
- [ ] **Trailing space in label:** The `labelWithPrefix` construction adds a trailing space before
  the price (`"${...} "`). Confirm AT does not announce a spurious pause. Consider trimming with
  `.trim()` on the final label string.

---

## Systemic Grep Opportunity

Any `role="button"` element in the codebase carrying a hardcoded `aria-pressed` string should
be audited:

```bash
grep -rn 'aria-pressed="false"\|aria-pressed="true"' \
  /Users/g0c073y/Desktop/githubs/Walmart-Web-2/libs/ \
  --include="*.tsx" \
  | grep -v "spec\|stor\|snapshot"
```

A static string value (`"false"` or `"true"`) is almost always a bug — the attribute must be
wired to live component state.

---


---


---

## Draft — NOVEL — Proposed ID: `WA11Y-WEB-4.1.3-001`

**Ingested by:** Wibey Swarm Agent (Single-ticket run — CEPG-335616)
**Date:** 2026-03-23
**JIRA:** CEPG-335616 | **PR:** #164343
**Commit:** `a0b63c3667f27c44a0c06a164e7cea7b88600b4a`
**Author:** Kalin Yang (Kalin.Yang0@walmart.com)
**File Fixed:** `libs/subscription/manage-dashboard/src/lib/dashboard-components/dashboard-content.tsx`

---

### Proposed Title
`Success Alert Not Announced to Screen Readers — aria-live="polite" + role="alert" on WCP Alert`

---

### WCAG Mapping
- **Criterion:** WCAG 4.1.3 Status Messages (Level AA)
- **Sub-criterion label:** Success Status Message — dynamically injected success alert not announced without live region
- **Platform:** Web
- **Component:** `DashboardContent` — `libs/subscription/manage-dashboard/src/lib/dashboard-components/dashboard-content.tsx`
- **Classification:** NOVEL — no existing 4.1.3 template exists in the web catalog

---

### Source References
- **Jira:** https://jira.walmart.com/browse/CEPG-335616
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/164343
- **Commit:** `a0b63c3667f27c44a0c06a164e7cea7b88600b4a`
- **Author:** Kalin Yang (Kalin.Yang0@walmart.com)
- **File Fixed:** `libs/subscription/manage-dashboard/src/lib/dashboard-components/dashboard-content.tsx`

---

### The Problem

After a user updates their subscription settings, a `<Alert variant="success">` was conditionally rendered inside a `<BeaconOnRender>` wrapper to confirm the update succeeded. Because the `<Alert>` component is injected into the DOM dynamically (it appears only after the mutation succeeds), it is invisible to screen readers unless the DOM node it occupies is already a live region — or the component itself carries `aria-live` and `role` attributes that flag it as an announcement target.

Without `aria-live="polite"` and `role="alert"`, the Alert's text content (`updateSubscriptionsSuccessMessage`) was rendered into the DOM but never surfaced to AT users. Sighted users saw the green success banner; screen reader users received no feedback and had no way to know the subscription update had succeeded.

**Expected:** Screen reader announces "Your subscription has been updated successfully" (or equivalent i18n string) immediately after the mutation completes.
**Actual:** No announcement — the Alert appears visually but AT ignores the new DOM node entirely.

---

### ❌ Bad Code

```tsx
// WCAG 4.1.3 VIOLATION: Success Alert rendered dynamically with no live region declaration
// Screen readers receive no announcement when this node is injected into the DOM
<Alert variant="success">
  {m(messages, "updateSubscriptionsSuccessMessage")}
</Alert>
```

The `<Alert>` component from WCP does not automatically inject `aria-live` or `role="alert"` — the consumer must apply them when the alert is conditionally rendered (i.e., appears dynamically after user action).

---

### ✅ Good Code

```tsx
// FIXED: aria-live="polite" + role="alert" added directly on the WCP Alert component
// When this node is injected into the DOM, AT announces its text content automatically
<Alert variant="success" aria-live="polite" role="alert">
  {m(messages, "updateSubscriptionsSuccessMessage")}
</Alert>
```

---

### Why It Works

`aria-live="polite"` instructs AT to announce the element's text content after the user finishes their current interaction (non-interrupting). `role="alert"` additionally maps the element to the ARIA `alert` role, which implies `aria-live="assertive"` in the ARIA spec — but in practice, pairing `role="alert"` with explicit `aria-live="polite"` overrides the assertive default, keeping the announcement polite (non-disruptive) while still ensuring AT recognizes the element as an alert landmark. Together, they satisfy WCAG 4.1.3: the status message is programmatically determinable and announced without requiring the user to actively navigate to it.

Note: The alternative architectural pattern is to use a **pre-existing persistent live region** in the page shell (e.g., a `<div role="status" aria-live="polite">` that always exists in the DOM, with its text content updated via React state when a success occurs). This avoids the edge case where some screen reader/browser combinations do not announce live regions that are newly mounted rather than already present. For a single-use in-context success alert, the inline `aria-live` + `role` approach used here is acceptable — but teams with multiple status messages should prefer the persistent live region shell pattern.

---

### i18n Note

The announced text is produced by `m(messages, "updateSubscriptionsSuccessMessage")`. This key must be present and localized in all supported locale files (en-US, en-CA, es-US, etc.) before the announcement will be meaningful in non-English locales. Ensure this key is registered in `messages.ts` and all locale YAML files in `libs/subscription/manage-dashboard/src/lib/`.

---

### Pattern Variants

**Variant 1 (this ticket):** Inline `aria-live="polite" role="alert"` directly on the WCP `<Alert>` component.

```tsx
// When: single conditional success alert; no shared live region shell available
<Alert variant="success" aria-live="polite" role="alert">
  {m(messages, "successKey")}
</Alert>
```

**Variant 2 (preferred for multi-message contexts):** Persistent `role="status"` shell with content updated via state.

```tsx
// In page shell (always mounted):
<div role="status" aria-live="polite" aria-atomic="true" className="visually-hidden">
  {statusMessage}
</div>

// After mutation success:
setStatusMessage(m(messages, "updateSubscriptionsSuccessMessage"));
// Clear after announcement to prevent re-announcement on re-render:
setTimeout(() => setStatusMessage(""), 1000);
```

---

### Human Review Checklist

- [ ] Screen reader test (NVDA+Chrome, VoiceOver+Safari): complete a subscription update mutation and verify the success message is announced without the user navigating to the alert
- [ ] Confirm the WCP `<Alert>` component does not internally suppress or override `aria-live`/`role` props passed by the consumer
- [ ] Verify `m(messages, "updateSubscriptionsSuccessMessage")` is localized in all 6 locale files for this library
- [ ] Evaluate whether a persistent `role="status"` live region in the page shell would be more robust for this component (see Variant 2 above)
- [ ] Check for other dynamically rendered `<Alert variant="success">` or `<Alert variant="error">` components in `libs/subscription/manage-dashboard/` that may share this same omission
- [ ] Assign official ID: `WA11Y-WEB-4.1.3-001` — first template for WCAG 4.1.3 Status Messages on web platform
- [ ] Promote to `final-skill/catalyst-templates/web/WA11Y-WEB-4.1.3-001.md` if approved

---

### Team / Domain Notes

- **Domain:** Subscriptions / Manage Dashboard
- **Lib path:** `libs/subscription/manage-dashboard/`
- **Jira prefix:** `CEPG-` — use file path as domain signal (not Jira prefix alone; `CEPG-` is shared across domains)
- **New team file needed:** `teams/Subscriptions/manage-dashboard.md` (does not yet exist — closest existing file is `teams/Subscriptions/manage-optimizations.md` for the `manage-optimizations` sub-library)

---


---


---

## Draft — NOVEL — Proposed ID: `WA11Y-WEB-4.1.3-001`

**Ingested by:** Wibey Swarm Agent (Single-ticket run — HVCE-12342)
**Date:** 2026-03-23
**JIRA:** HVCE-12342 | **PR:** #163872
**Commit:** 231913c0f2d16e0903ab277cf4974b9dd458d38a
**Author:** Amanda Hausmann (Amanda.Hausmann@walmart.com)
**File Fixed:** `libs/extended-reality/realtime-vto/optical/try-them-on-wrapper/src/lib/components/InformationCard/InformationCard.tsx`

---

### Proposed Title
`Status Messages Not Announced by Screen Readers — aria-live="assertive" + programmatic focus on Dynamic Information Card`

---

### WCAG Mapping
- **Criterion:** WCAG 4.1.3 Status Messages (Level AA)
- **Sub-criterion label:** Success Status Message — informational feedback rendered dynamically without live region
- **Platform:** Web
- **Component:** `InformationCard` — `libs/extended-reality/realtime-vto/optical/try-them-on-wrapper/src/lib/components/InformationCard/`
- **Classification:** NOVEL — no existing 4.1.3 template exists in the web catalog. This is the first ingested pattern for this criterion.

---

### Source References
- **Jira:** https://jira.walmart.com/browse/HVCE-12342
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/163872
- **Commit:** `231913c0f2d16e0903ab277cf4974b9dd458d38a`
- **Author:** Amanda Hausmann (Amanda.Hausmann@walmart.com)
- **File Fixed:** `libs/extended-reality/realtime-vto/optical/try-them-on-wrapper/src/lib/components/InformationCard/InformationCard.tsx`

---

### The Problem

The `InformationCard` component provides real-time feedback to the user during the Virtual Try-On (VTO) optical face-scanning experience — messages such as scan progress, positioning guidance, and scan completion. These messages are injected dynamically into the DOM as `title` and `children` props change.

Without a live region attribute, screen readers do not monitor the container for DOM updates. The content is present in the DOM tree and visually visible, but **no announcement is triggered** when the message changes. A screen reader user relying on audio feedback receives no indication that the face scan state has changed (e.g., that the scan succeeded or that they need to reposition).

WCAG 4.1.3 requires that status messages — including success messages — be programmatically determinable through role or property so they can be announced by AT without receiving focus.

**Expected:** When `InformationCard` updates its `title`/`children` props (e.g., to show "Scan complete"), a screen reader immediately announces the new status without the user needing to navigate to it.
**Actual:** The status update is silent — the card renders visually but emits no AT event; screen reader users are unaware the scan state changed.

---

### ❌ Bad Pattern — Plain `<div>` container, no live region

```tsx
// WCAG 4.1.3 VIOLATION: Dynamic status messages rendered with no live region
// Screen readers receive no notification when title/children props update

import { Heading } from "@walmart-web/livingdesign-components";
import { ReactNode } from "react";
import style from "./ui/InformationCard.module.scss";

interface InformationCardProps {
  title: string;
  children: ReactNode;
}

const InformationCard = ({ title, children }: InformationCardProps) => {
  return (
    // ❌ Plain <div> — no aria-live, no role="status", no role="alert"
    // Changes to title or children are invisible to screen readers
    <div className={`${style.headingContainer} bg-white`}>
      <Heading as="div" size="small" weight={700}>
        {title}
      </Heading>
      {children}
    </div>
  );
};
```

---

### ✅ Good Pattern — `aria-live="assertive"` + `useRef`/`useEffect` programmatic focus

```tsx
// WCAG 4.1.3 FIX: Dynamic status messages announced via assertive live region
// useRef + useEffect also trigger programmatic focus so AT receives immediate feedback

import { Heading } from "@walmart-web/livingdesign-components";
import { ReactNode, useEffect, useRef } from "react";
import style from "./ui/InformationCard.module.scss";

interface InformationCardProps {
  title: string;
  children: ReactNode;
}

const InformationCard = ({ title, children }: InformationCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Programmatic focus ensures AT announces the updated content immediately
    // even in browsers/AT combinations where aria-live alone may have timing delays
    if (cardRef.current && (title || children)) {
      cardRef.current.focus();
    }
  }, [title, children]);  // Re-runs whenever the status message content changes

  return (
    // ✅ aria-live="assertive" — announces the full card content immediately on any DOM update
    // ✅ tabIndex={-1} — allows programmatic focus without inserting into Tab order
    <div
      ref={cardRef}
      className={`${style.headingContainer} bg-white`}
      aria-live="assertive"
      tabIndex={-1}
    >
      <Heading as="div" size="small" weight={700}>
        {title}
      </Heading>
      {children}
    </div>
  );
};
```

---

### Why This Fix Works

`aria-live="assertive"` marks the container as a live region, instructing screen readers to monitor it for DOM changes and immediately interrupt any current speech to announce updated content — appropriate for time-sensitive face-scan feedback where the user cannot afford to miss a "reposition" or "scan complete" signal. The `useRef` + `useEffect` layer calls `.focus()` programmatically whenever `title` or `children` changes, providing a redundant announcement path for AT/browser combinations that have inconsistent live region timing; `tabIndex={-1}` makes the div focusable without adding it to the natural Tab order.

**When to use `assertive` vs. `polite`:** Use `aria-live="assertive"` only when the status update is time-critical and the user must act on it immediately (e.g., camera framing instructions during an active scan). For non-urgent feedback (form submission success, item added to cart), prefer `aria-live="polite"` to avoid interrupting ongoing AT speech unnecessarily.

---

### Design Decision Notes

| Choice | Rationale |
|---|---|
| `aria-live="assertive"` over `role="status"` | `role="status"` maps to `aria-live="polite"` internally. For real-time scan guidance, assertive is appropriate. |
| `aria-live="assertive"` over `role="alert"` | `role="alert"` implies an error/warning; this card shows neutral progress messages and success states, not errors. |
| `useEffect` focus call in addition to `aria-live` | Belt-and-suspenders: some AT (notably NVDA on certain Firefox versions) can miss polite/assertive updates if the region was already populated. Focus ensures announcement. |
| `tabIndex={-1}` | Required to enable `.focus()` on a non-interactive `<div>`. Does not put the card in the Tab order. |

---

### Human Review Checklist

- [ ] Screen reader test (VoiceOver/Safari, NVDA/Chrome): trigger a face-scan state change; confirm the new `title` and `children` text is announced immediately without navigating to the card
- [ ] Verify `assertive` is correct severity — if the card can also show non-urgent messages, consider a prop-driven `aria-live` value (`"polite"` | `"assertive"`) or split into two components
- [ ] Confirm `tabIndex={-1}` does not disrupt existing Tab order around the VTO camera viewport
- [ ] Check if other feedback components in the VTO flow (`libs/extended-reality/realtime-vto/`) also lack live regions — this pattern may need to be applied to sibling components
- [ ] Assign official ID: `WA11Y-WEB-4.1.3-001` — first 4.1.3 template for the web platform
- [ ] Promote to `final-skill/catalyst-templates/web/WA11Y-WEB-4.1.3-001.md` if approved

---

### Team / Domain Notes

- **Domain:** Health & Vision
- **Jira prefix:** `HVCE-` → maps to `teams/Health-Vision/vision-center-orders.md`
- **Component path:** `libs/extended-reality/realtime-vto/optical/try-them-on-wrapper/` — Virtual Try-On optical flow, distinct from the Vision Center order management path but owned by the same Health-Vision team
- **File path routing:** `libs/extended-reality/realtime-vto/` → Health & Vision team (HVCE- prefix confirms)

---


---


---

## Draft — **NOVEL** — Proposed ID: `WA11Y-WEB-3.2.2-001`

**Ingested by:** Wibey Swarm Agent (Step 8 — Single-ticket ingestion)
**Date:** 2026-03-23
**Ticket:** INTX-17877
**PR:** #179062
**Commit:** `fae9f185bed3`
**Ingestion Score:** +5 (Novel pattern — no existing 3.2.2 template exists in the catalyst-templates/web library)

### Proposed Title
`Tab Key Incorrectly Triggering Value-Commit in Range Slider (price-range popover collapse)`

### WCAG Mapping
- **Criterion:** WCAG 3.2.2 On Input (Level A)
- **Sub-criterion label:** Changes of context must not be triggered automatically when a user input component receives input unless the user has been advised beforehand
- **Platform:** Web
- **Component:** `RangeSlider` — `libs/ui/slider/src/lib/range-slider.tsx`
- **Classification:** NOVEL — no existing template covers Tab-key-triggered onChange / context change in range input controls; nearest existing template is `WA11Y-WEB-2.1.1-001` (keyboard accessibility, general) but it does not address the Tab-as-submit anti-pattern

### Source References
- **Jira:** INTX-17877 (also fixes INTX-17886)
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/179062
- **Commit:** `fae9f185bed3b75b2c2f18ff308d03dfe0285e3f`
- **Author:** Coco Lin (s0l0cl8 / Coco.Lin@walmart.com)
- **File Fixed:** `libs/ui/slider/src/lib/range-slider.tsx`
- **Test File Modified:** `libs/ui/slider/src/__tests__/unit/range-slider.spec.tsx`
- **Locale context:** Canada / International (INTX- prefix — price range filter used in international locale pages)

---

### The Problem

The `RangeSlider` component's `handleKeyDown` handler intercepted the `Tab` key and called `handleMouseUp(name)`, which triggers `onChange`. Calling `onChange` commits the current slider value, which in the international price-filter context caused a URL navigation and full page re-mount. This re-mount collapsed the price-range popover, making it impossible for keyboard users to tab between the min and max slider thumbs without the filter being unexpectedly applied and the popover closing.

**Expected:** Pressing Tab moves native focus from the min thumb to the max thumb without committing any value or causing navigation.
**Actual:** Pressing Tab on either slider thumb immediately fired `onChange`, which triggered URL-based navigation, re-mounted the page, and collapsed the popover — a classic WCAG 3.2.2 unexpected context change.

---

### ❌ Bad Code

```tsx
// WCAG 3.2.2 VIOLATION: Tab key triggers handleMouseUp() which fires onChange,
// causing URL navigation and a full page re-mount (context change on Tab input)
const handleKeyDown = (
  event: KeyboardEvent<HTMLInputElement>,
  name: string
) => {
  /* Trigger onChange on press of tab key which shifts focus to the next element */
  if (event.code === "Tab" || event.key === "Tab") {
    handleMouseUp(name); // BAD: Tab must never commit a value or trigger navigation
  }
  /* To prevent the page from scrolling on press of space key */
  if (event.code === "Space" || event.code === "Enter" || event.key === " ") {
    event.preventDefault();
  }
};

// Usage on slider elements — name arg was passed to enable the bad Tab behavior:
<input
  onKeyDown={(e) => handleKeyDown(e, "min")}
  ...
/>
<input
  onKeyDown={(e) => handleKeyDown(e, "max")}
  ...
/>
```

---

### ✅ Good Code

```tsx
// FIXED: Tab key is NOT handled — native browser focus movement is preserved.
// Value commit happens only via Arrow keys (incremental) or an explicit Apply button.
// The `name` parameter is removed because Tab no longer needs it.
const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
  /* To prevent the page from scrolling on press of space key */
  if (event.code === "Space" || event.code === "Enter" || event.key === " ") {
    event.preventDefault();
  }
};

// Usage — pass handler directly (no arrow wrapper needed, no name arg):
<input
  onKeyDown={handleKeyDown}
  ...
/>
<input
  onKeyDown={handleKeyDown}
  ...
/>
```

---

### 🧪 Testing Pattern (from PR — removed test asserts the bad behavior no longer fires)

The fix was validated by **removing** the test that asserted `onChange` was called on Tab keydown. The deletion of this test is itself the assertion: there should be no test that expects `onChange` to fire on `keyDown` with `{ key: "Tab" }`.

```tsx
// REMOVED TEST (was asserting the violation — correct to delete):
// it("should check for onChange on Tab key down event", () => {
//   ...
//   fireEvent.keyDown(minSlider, { key: "Tab" });
//   expect(props.onChange).toHaveBeenCalledWith({ minValue: 150, maxValue: 200, name: "min" });
//   fireEvent.keyDown(maxSlider, { key: "Tab" });
//   expect(props.onChange).toHaveBeenCalledWith({ minValue: 150, maxValue: 180, name: "max" });
// });

// RECOMMENDED REPLACEMENT TEST (to assert the fix going forward):
it("should NOT call onChange when Tab key is pressed on a slider thumb", () => {
  renderWithContext(<Container />);
  const minSlider = screen.getAllByRole("slider")[0];
  fireEvent.change(minSlider, { target: { value: "150" } });
  fireEvent.keyDown(minSlider, { key: "Tab" });
  // onChange must not fire on Tab — no context change should occur
  expect(props.onChange).not.toHaveBeenCalled();
});
```

---

### Why This Fix Works

The `Tab` key is a **focus-navigation primitive** — it belongs entirely to the browser's native focus management and must never be intercepted to commit data or trigger side effects. WCAG 3.2.2 On Input requires that a change of context (navigation, page re-mount, popover collapse) is not triggered by user interaction with a form control unless the user is explicitly told this will happen beforehand. Removing the `Tab` branch from `handleKeyDown` restores native tabbing behavior and ensures the price-range popover remains open while keyboard users move between the min and max thumbs.

---

### Human Review Checklist

- [ ] Confirm no existing 3.2.2 template exists (verified — no `WA11Y-WEB-3.2.2-*` file found in `catalyst-templates/web/`)
- [ ] Assign official ID (proposed: `WA11Y-WEB-3.2.2-001`)
- [ ] Consider auditing other range/slider/filter components in the monorepo for the same pattern (search: `event.key === "Tab"` inside `onKeyDown` handlers that also call `onChange` or `handleMouseUp`)
- [ ] Promote to `final-skill/references/catalyst-templates/web/WA11Y-WEB-3.2.2-001.md` if approved
- [ ] Note: this fix also resolves INTX-17886 (same root cause, same file)

---


---


---

## Draft — Variation of NOVEL Proposed ID: `WA11Y-WEB-1.3.1-007`

**Ingested by:** Wibey Swarm Agent (Step 8 — Single-ticket ingestion, INTX-17645)
**Date:** 2026-03-24
**JIRA:** INTX-17645 | **PR:** #179293 (shared with INTX-18110 — Canada scope only)
**Commit:** `53d747dcf1f60da9da382bcbc225dc2157f87cff`
**Author:** Coco Lin (Coco.Lin@walmart.com)
**File Fixed:** `libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx`
**WCAG Criterion:** 1.3.1 — Info and Relationships (Level A)
**Template Search Result:** NOT_FOUND as promoted template — nearest draft is WA11Y-WEB-1.3.1-007 (RECOMMENDED_TEMPLATES.md, not yet promoted)
**Classification:** VARIATION of WA11Y-WEB-1.3.1-007 (same root-cause class; new surface — `<li>` element instead of `<div>`, Marketplace return-policy, Canada/SWC locale path)
**Proposed Variation:** WA11Y-WEB-1.3.1-007 Var 2

---

### Title
`aria-label on <li> with aria-hidden Children Silences Return Policy Content (PolicyLine — Canada/SWC Locale)`

### WCAG Mapping
- **Criterion:** WCAG 1.3.1 Info and Relationships (Level A)
- **Platform:** Web
- **Component:** `PolicyLine` — `libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx`
- **Classification:** VARIATION of WA11Y-WEB-1.3.1-007 — same anti-pattern (`aria-label` on semantic container + `aria-hidden` on child text) on a `<li>` element instead of a roleless `<div>`, in the Marketplace return-policy details modal

---

### Source References
- **Jira:** INTX-17645
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/179293
- **Commit:** `53d747dcf1f60da9da382bcbc225dc2157f87cff`
- **Author:** Coco Lin (Coco.Lin@walmart.com)
- **File Fixed:** `libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx`
- **Shared PR Note:** PR #179293 also covers INTX-18110 (Mexico). Both tickets reference the same single-file fix. This ingestion scopes to INTX-17645 (Canada).

---

### Canada / International Context

The `PolicyLine` component is consumed by `PolicyBlock`, which renders a `<ul>` of return policy attributes (return window, returnable to store, special instructions). The component has a `returnPolicyInSWC` boolean prop that gates Canada-specific layout: when `true`, columns stack vertically (`flex-column`) with bold title (`b mb2`) — the layout used in Walmart Canada's item detail page (SWC = Samsclub/Walmart Canada web). The INTX Jira prefix confirms this ticket belongs to the International team. The accessibility violation was present across both US and Canada rendering paths, but the SWC stacked layout made the hidden-content pattern more impactful for Canada since both `title` and `content` divs rendered as full-width stacked blocks, each independently `aria-hidden`.

---

### The Problem

`PolicyLine` rendered each `<li>` with `aria-label={\`${title}: ${content}\`}` — an attempt to provide a single accessible name combining the label and value. To prevent double-announcement, both child `<div>` elements (one for `title`, one for `content`) were marked `aria-hidden`.

The flaw: while `<li>` has an implicit `listitem` role (unlike a bare `<div>`), the `aria-label` + `aria-hidden` child pattern is still broken in practice. Screen readers that compute the accessible name of the `<li>` from `aria-label` may announce only the static string — but screen readers in browse/reading mode traverse child nodes directly, ignoring the `aria-label` on a non-widget `listitem` role. The `aria-hidden` on both children then successfully hides `title` and `content` text, leaving the cell empty for AT users in reading mode. The result is inconsistent cross-AT announcement: some screen readers read the `aria-label`, others read nothing.

The fix removes `aria-label` from the `<li>` and removes `aria-hidden` from both child `<div>` elements. Screen readers now traverse the natural DOM content — `title` text followed by `content` text — without ambiguity.

**Expected:** Screen reader announces `title` value and `content` value for each return policy row (e.g., "Return within" "30 days after item is delivered").
**Actual:** Screen reader announces only the `aria-label` string (inconsistent across AT) or nothing (when AT reads child nodes directly and hits `aria-hidden`).

---

### Bad Code (before)

```tsx
// WCAG 1.3.1 VIOLATION: aria-label on <li> + aria-hidden on both child divs
// Screen readers in reading mode bypass aria-label on listitem and traverse hidden children
export const PolicyLine: React.FC<PolicyLineProps> = ({
  title,
  content,
  className,
  returnPolicyInSWC,
}) => {
  const listItemClassNames = classNames("flex", className, {
    "flex-column bn f5": returnPolicyInSWC,  // Canada SWC: stacked column layout
  });

  return (
    <li className={listItemClassNames} aria-label={`${title}: ${content}`}>  {/* ❌ aria-label on <li> */}
      <div
        className={classNames({
          "w-50": !returnPolicyInSWC,
          "b mb2": returnPolicyInSWC,
        })}
        aria-hidden  // ❌ Hides return policy TITLE from screen readers in reading mode
      >
        {title}
      </div>{" "}
      <div className={classNames({ "w-50": !returnPolicyInSWC })} aria-hidden>  {/* ❌ Hides return policy CONTENT */}
        {content}
      </div>
    </li>
  );
};
```

---

### Good Code (after)

```tsx
// FIXED: Remove aria-label from <li> and remove aria-hidden from both child divs.
// Natural DOM content (title + content) is now directly readable by all AT in all modes.
export const PolicyLine: React.FC<PolicyLineProps> = ({
  title,
  content,
  className,
  returnPolicyInSWC,
}) => {
  const listItemClassNames = classNames("flex", className, {
    "flex-column bn f5": returnPolicyInSWC,  // Canada SWC: stacked column layout — unchanged
  });

  return (
    // aria-label removed — <li> accessible name comes from natural child text content
    <li className={listItemClassNames}>
      <div
        className={classNames({
          "w-50": !returnPolicyInSWC,
          "b mb2": returnPolicyInSWC,
        })}
        // aria-hidden removed — TITLE text is now readable by screen readers
      >
        {title}
      </div>{" "}
      <div className={classNames({ "w-50": !returnPolicyInSWC })}>
        {/* aria-hidden removed — CONTENT text is now readable by screen readers */}
        {content}
      </div>
    </li>
  );
};
```

---

### Why This Fix Works

The `aria-label` on `<li>` attempted a single-string accessible name for the row, hiding children to avoid double-reading. This backfired: `listitem` is a structural role, not a widget — screen readers in reading/browse mode traverse its children directly rather than using its `aria-label`. The `aria-hidden` then successfully suppressed the actual text content, making rows invisible to AT in the most common navigation mode. Removing both attributes lets screen readers read the natural sequence — bold `title` text then `content` text — which is the correct and simpler approach, matching how sighted users read the two-column (US) or stacked (Canada/SWC) layout.

---

### Relationship to WA11Y-WEB-1.3.1-007

This is the second instance of the same anti-pattern class documented in Draft `WA11Y-WEB-1.3.1-007` (AtAGlanceContent — `aria-label` on roleless `<div>`, `aria-hidden` on children). Key differences:

| | Draft WA11Y-WEB-1.3.1-007 (Var 1) | This fix (Var 2) |
|---|---|---|
| Container element | `<div>` (no role) | `<li>` (implicit `listitem` role) |
| aria-label placement | On the wrapper `<div>` | On the `<li>` directly |
| Additional issue | `tabIndex={0}` on `<li>`, `tabIndex={-1}` on `<div>` | No tabIndex issue |
| Component | AtAGlanceContent — product highlights | PolicyLine — return policy details |
| Locale scope | US | US + Canada/SWC international path |
| Jira team | CEPG / Item Page | INTX / International |

Both variations share the same root cause: **`aria-hidden` on child elements is the only effective ARIA operation when a non-widget container has both `aria-label` and `aria-hidden` children — the label strategy breaks down in AT reading mode, leaving content invisible.**

---

### Human Review Checklist

- [ ] Screen reader test (NVDA+Chrome, VoiceOver+Safari): navigate to return policy modal, verify each policy row announces both `title` and `content` (e.g., "Return within 30 days after item is delivered")
- [ ] Canada/SWC test: render with `returnPolicyInSWC={true}` — verify stacked column layout still works and content is read in title-then-content order
- [ ] Confirm no other `<li>` elements in `libs/marketplace/return-policy/` use `aria-label` + `aria-hidden` children pattern
- [ ] If promoting Draft WA11Y-WEB-1.3.1-007 to a catalyst template, include this as Variation 2
- [ ] Note: the `/* eslint-disable jsx-a11y/no-noninteractive-tabindex */` comment in `returns-policy-details.tsx` is unrelated to this fix — it governs a different scope

---

### Team / Domain Notes

- **Domain:** Marketplace (International team — Canada)
- **Jira prefix:** `INTX-` — International team
- **SWC flag:** `returnPolicyInSWC` = Walmart Canada web context (walmart.ca)
- **Shared PR:** #179293 also contains INTX-18110 (Mexico) — same file, same fix. The fix is locale-agnostic (affects both US and international paths). Canada is INTX-17645; Mexico is INTX-18110.
- **Teams file target:** `teams/International/canada.md` (does not yet exist — Reduce Phase creates it)

---


---


---

## Ingestion Draft: INTX-18110

**Ingested by:** Wibey Swarm Sub-agent (Step 8 — Parallel Batch Run)
**Date:** 2026-03-24
**Jira:** INTX-18110 | **PR:** #179293 | **Commit:** `53d747dcf1f60da9da382bcbc225dc2157f87cff`
**Author:** Coco Lin (s0l0cl8 — Coco.Lin@walmart.com)
**File Fixed:** `libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx`
**WCAG Criterion:** 1.3.1 — Info and Relationships (Level A)
**WCAG Hint from ticket:** International Team — Mexico bug
**Template Search Result:** NOT_FOUND (find-template.sh runtime error — window is not defined in Node context; manual catalog scan performed)
**Classification:** NOVEL — variation of pattern described in RECOMMENDED_TEMPLATES.md Draft #8 (`WA11Y-WEB-1.3.1-007`), but in a different component/domain (Marketplace Return Policy vs. Item Product Highlights). Proposed template ID: `WA11Y-WEB-1.3.1-007` (same root-cause class; this is a second concrete instance confirming the pattern is cross-team).
**Proposed Template ID:** `WA11Y-WEB-1.3.1-007 — Variation 3)

---

## Scope Note — Mexico vs. Canada (Shared PR)

PR #179293 was shared between INTX-17645 (Canada) and INTX-18110 (Mexico). Both tickets reference the **same single-file fix** in `policy-line.tsx`. The `PolicyLine` component lives in `libs/marketplace/return-policy/` — a shared return-policy component that renders for all international marketplace locales, including the Mexican marketplace (`es-MX`). INTX-18110 is the Mexico-locale accessibility ticket for this same component. The fix is identical; the Mexico context is that the broken ARIA pattern surfaced for Mexican locale users who rely on Spanish-language screen readers reading the `es-MX` content of `{title}` and `{content}` props.

---

## Proposed Title

`aria-label on <li> with aria-hidden on Child Divs Silences Real Content in Return Policy List (Marketplace International — Mexico)`

---

## WCAG Mapping

- **Criterion:** WCAG 1.3.1 Info and Relationships (Level A)
- **Platform:** Web
- **Component:** `PolicyLine` — `libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx`
- **Classification:** NOVEL variation (second instance of pattern from Draft #8 / proposed `WA11Y-WEB-1.3.1-007`)

---

## Source References

- **Jira:** https://jira.walmart.com/browse/INTX-18110
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/179293
- **Commit:** `53d747dcf1f60da9da382bcbc225dc2157f87cff`
- **Author:** Coco Lin (Coco.Lin@walmart.com)
- **File Fixed:** `libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx`
- **Related ticket (Canada / same PR):** INTX-17645

---

## The Problem

The `PolicyLine` component rendered each return policy line item as a `<li>` element. The `<li>` carried `aria-label={\`${title}: ${content}\`}` — a synthesized accessible name. Both child `<div>` elements (one rendering `{title}`, one rendering `{content}`) were marked `aria-hidden` (implicitly `aria-hidden="true"`), hiding the real text from the accessibility tree.

The intended behavior was to expose a combined accessible name (e.g., "Return window: 30 days") while visually rendering the two parts separately. The result was the opposite of good practice:

- The `<li>` element received an `aria-label` — but `<li>` is a non-interactive element with no role that benefits from `aria-label` in most AT implementations. Many screen readers silently discard `aria-label` on `<li>` elements without an explicit ARIA role.
- The `aria-hidden` on the child `<div>` elements successfully suppressed the real text content from the accessibility tree.
- In combination: AT read only the (potentially discarded) label, while the actual text content was invisible. For Mexican locale users navigating the return policy with Spanish-language screen readers, the policy line content was either announced with no context or not announced at all.

**Expected:** Screen reader announces the return policy line item title and content in natural reading order as visible text.
**Actual:** `aria-hidden` on child divs suppressed real content; `aria-label` on `<li>` was the only declared name but is not reliably honored by AT on non-interactive list items.

---

## Bad Code (before)

```tsx
// libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx
// WCAG 1.3.1 VIOLATION:
// - aria-label on <li> (non-interactive element) is unreliable / silently discarded by AT
// - aria-hidden on both child divs suppresses ALL real text from the accessibility tree
// Result: screen reader users (including es-MX Spanish AT users) hear nothing or an orphaned label

<li className={listItemClassNames} aria-label={`${title}: ${content}`}>
  <div
    className={classNames({
      "w-50": !returnPolicyInSWC,
      "b mb2": returnPolicyInSWC,
    })}
    aria-hidden  // ❌ Hides {title} from screen readers
  >
    {title}
  </div>{" "}
  <div className={classNames({ "w-50": !returnPolicyInSWC })} aria-hidden>
    {/* ❌ Hides {content} from screen readers */}
    {content}
  </div>
</li>
```

---

## Good Code (after)

```tsx
// libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx
// FIXED:
// - aria-label removed from <li> — no synthetic name is needed
// - aria-hidden removed from both child divs — real text is exposed to the accessibility tree
// - Screen readers now read {title} and {content} in natural DOM order
// - Works correctly for all locales including es-MX (Mexican Spanish) and en-CA (Canadian English)

<li className={listItemClassNames}>
  <div
    className={classNames({
      "w-50": !returnPolicyInSWC,
      "b mb2": returnPolicyInSWC,
    })}
    // ✅ aria-hidden removed — {title} is now visible to AT
  >
    {title}
  </div>{" "}
  <div className={classNames({ "w-50": !returnPolicyInSWC })}>
    {/* ✅ aria-hidden removed — {content} is now visible to AT */}
    {content}
  </div>
</li>
```

---

## Why This Fix Works

The `<li>` element in a `<ul>` list already receives the correct `listitem` role from native semantics — screen readers announce list item content through DOM traversal, not through an `aria-label` on the `<li>`. Removing `aria-label` from the `<li>` and `aria-hidden` from the child `<div>` elements restores the natural accessibility tree: AT traverses into the `<li>`, reads the `{title}` div, then the `{content}` div, and announces both in logical order. This is the correct, simpler approach: the native DOM structure already provides all necessary semantics without any ARIA intervention.

The root-cause class is identical to Draft #8 (`WA11Y-WEB-1.3.1-007`): "Broken aria-label strategy on a container element paired with aria-hidden on real content children — resulting in AT reading a synthetic label (or nothing) instead of the visible text."

---

## Relation to Draft #8 (WA11Y-WEB-1.3.1-007)

This fix is the second confirmed instance of the pattern proposed in Draft #8 (CEPG-348108 / `AtAGlanceContent`). Key differences:

| | Draft #8 (CEPG-348108) | This Draft (INTX-18110) |
|---|---|---|
| Component | `AtAGlanceContent` (product highlights) | `PolicyLine` (return policy) |
| Container element | `<li>` with `tabIndex={0}` | `<li>` (no tabIndex) |
| aria-label location | Inner `<div>` (roleless) | `<li>` directly |
| aria-hidden count | 2 child divs | 2 child divs |
| Domain | Item / Discovery | Marketplace / International |
| Locale context | US | Mexico (es-MX) + Canada (en-CA) |

Both fixes converge to the same solution: remove the synthetic `aria-label` and remove `aria-hidden` from the real content children. The two instances together strongly confirm `WA11Y-WEB-1.3.1-007` as a real, cross-team pattern worth promoting to an official template.

---

## Human Review Checklist

- [ ] Screen reader test (VoiceOver+Safari, NVDA+Chrome with es-MX locale): navigate to the Return Policy details section; each policy line should announce title followed by content in natural reading order
- [ ] Confirm removal of `aria-label` from `<li>` does not break any AT that was relying on it (it should not — the natural content is now always better than a synthetic label here)
- [ ] Verify `{title}` and `{content}` are not empty strings in any locale — if either can be empty, consider whether an `aria-label` fallback on the `<li>` is needed (unlikely given the data model)
- [ ] Cross-reference with INTX-17645 (Canada) — same fix, same file; both tickets resolved by this single commit
- [ ] Consider promoting `WA11Y-WEB-1.3.1-007` to an official template now that two distinct cross-team instances confirm the pattern

---

## Team / Domain Notes

- **Domain:** Marketplace / International
- **Jira prefix:** `INTX-` maps to the **International** team (Mexico and Canada locales confirmed)
- **File path:** `libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx`
- **Locale context:** `PolicyLine` renders `{title}` and `{content}` props sourced from locale-specific data — the fix ensures Spanish-language content (`es-MX`) is accessible to AT in the same way as English content
- **New team directory needed:** `teams/International/` — this directory does not yet exist; the Reduce Phase must create it with `mexico.md`

---

