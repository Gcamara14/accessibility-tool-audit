# Catalyst Template: Keyboard: Button Not Keyboard Operable or Focusable

**Template ID:** `WA11Y-WEB-2.1.1-002`
**Platform:** Web
**WCAG Criterion:** WCAG-2.1.1

---

## 🛑 The Problem
A button element is neither focusable nor operable via keyboard, preventing keyboard users from interacting with it.

**Expected Result:** Button elements should be both focusable and operable using keyboard inputs.
**Actual Result:** The button does not receive keyboard focus and cannot be activated using keyboard inputs.

---

## ✅ The Fix Patterns

> **Recommendation:** Use semantic &lt;button&gt; elements for buttons to ensure they are inherently focusable and operable via keyboard.

### Standard Implementation
```html
// Best: Use a Native HTML5 Element
        <button>Add to Cart</button>
        
        // Last Resort: tabindex but also needs a keyboard keypress/click event handler.
        <div role="button" tabindex="0">Add to Cart</div>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

# Ingestion Draft: CEPG-340591

**JIRA:** CEPG-340591 | **PR:** #163616
**WCAG:** 2.1.1 Keyboard (Level A)
**Commit:** 42e7b5a7a9a36b40a82e3ef9b4d48d782734871c
**Template ID (existing):** WA11Y-WEB-2.1.1-002
**Classification:** Variation of WA11Y-WEB-2.1.1-002 — non-native icon element acting as a button, missing `tabIndex` and `onKeyDown` handler

---

## Summary

In the Sampling Tax form (`sampling-tax-form.tsx`), an `<Icon>` component for the "legal last name" info button had `role="button"` and `onClick` but was missing `tabIndex={0}` and any `onKeyDown` handler. This made the element impossible to reach or activate via keyboard Tab navigation, violating WCAG 2.1.1.

The fix extracts the icon into a dedicated `InfoIcon` wrapper component that adds `tabIndex={0}` for focusability and an `onKeyDown` handler that fires the click action on `Enter` or `Space`.

---

## Bad Code (before)

```tsx
// libs/identity-next/know-your-customer-views/src/lib/sampling-tax-view/sampling-tax-form.tsx
<Icon
  data-testid="infoicon-sampling"
  iconAltName="Info"
  name="InfoCircle"
  aria-label={m(messages, "information")}
  role="button"
  onClick={handleInfoClick}
/>
```

**Problem:** `role="button"` on a non-native element advertises button semantics to assistive technology, but without `tabIndex={0}` the element is skipped entirely during Tab navigation. Even if a user somehow focused it, there is no `onKeyDown` handler so Enter/Space presses do nothing.

---

## Good Code (after)

```tsx
// libs/identity-next/know-your-customer-views/src/lib/sampling-tax-view/sampling-tax-form.tsx

const InfoIcon = ({ handleInfoClick }: { handleInfoClick: () => void }) => {
  return (
    <Icon
      data-testid="infoicon-sampling"
      iconAltName="Info"
      tabIndex={0}
      name="InfoCircle"
      aria-label={m(messages, "information")}
      role="button"
      onClick={handleInfoClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleInfoClick();
        }
      }}
    />
  );
};

// Usage at the original callsite:
<InfoIcon handleInfoClick={handleInfoClick} />
```

---

## Why It Works

1. **`tabIndex={0}`** inserts the element into the natural Tab order, making it reachable by keyboard users.
2. **`onKeyDown` with Enter/Space guard** satisfies WCAG 2.1.1's requirement that all functionality available via pointer must also be available via keyboard. `event.preventDefault()` prevents unintended scrolling on Space.
3. The existing `onClick` already handled mouse/pointer activation; the fix closes the keyboard gap without changing pointer behaviour.
4. Extracting the logic into a named `InfoIcon` component makes the pattern reusable and testable in isolation.

**Pattern note:** This is the "Last Resort" pattern from WA11Y-WEB-2.1.1-002 — a non-native element with `role="button"` that must add both `tabIndex` and keyboard event handling because a native `<button>` element was not used. The ideal fix would be to render a native `<button>` wrapping the icon, but given the Icon component API constraints this is an acceptable resolution.

---

## Test Coverage Added

The PR adds an integration test block that:
- Tabs to the info icon from the Last Name input
- Presses Enter to open the dialog, verifies dialog content, closes with "Got it"
- Types `{tab}` followed by Space to open the dialog via Space key

This covers both keyboard activation paths (Enter and Space) for the fix.

---

## Team / Domain Notes

- **Domain:** Accounts
- **Team file:** `/Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Accounts/identity-next.md`
- **Component:** `SamplingTaxForm` / `InfoIcon`
- **Primary source file:** `libs/identity-next/know-your-customer-views/src/lib/sampling-tax-view/sampling-tax-form.tsx`
- **Test file:** `libs/identity-next/know-your-customer-views/src/__tests__/integration/sampling-tax-view.spec.tsx`
- **Repo path context:** `libs/identity-next/know-your-customer-views/` — this is the KYC (Know Your Customer) views sub-library within identity-next, handling tax compliance screens for Sampling customers.

---

## Bonus Cross-Criterion Observations

- The `aria-label` on the Icon is already present (covers WCAG 4.1.2 accessible name).
- No focus indicator styling changes were made in this PR — worth a follow-up check that the focused `<Icon>` element has a visible focus ring (WCAG 2.4.7 / 2.4.11).

---


---

# Ingest Draft: CEPG-330695 / PR #161703

**JIRA:** CEPG-330695 | **PR:** #161703
**WCAG:** 2.1.1 Keyboard (Level A)
**Template ID (existing):** WA11Y-WEB-2.1.1-002 — Button Not Keyboard Operable or Focusable
**Classification:** Variation of WA11Y-WEB-2.1.1-002

---

## Summary

A `<Link>` component with `role="button"` in the Protection Plans "Select a Plan" page was
missing both `tabIndex` and a `onKeyDown` handler. Keyboard users could not tab to it or
activate it via Enter/Space, blocking access to the plan details overlay.

---

## Bad Code (before)

File: `libs/account/protection-plans-page/src/lib/protection-plans-select-a-plan.tsx`

```tsx
<Link
  onClick={() => setPage("protection-plans-overview")}
  role="button"
  aria-label={m(messages, "planDetails")}
  data-dca-id="L:8D533E1A69"
>
  <span className="underline ml2 normal">
    {m(messages, "details")}
  </span>
</Link>
```

**Why it was broken:**
- The `<Link>` component was overridden with `role="button"` (making it act as a button
  semantically) but was given no `tabIndex`, so it was not in the tab order.
- Even if it could receive focus, there was no `onKeyDown` handler — Enter and Space key
  presses were silently ignored.
- Keyboard users had no way to navigate to or activate the "details" trigger.

---

## Good Code (after)

```tsx
<Link
  onClick={() => setPage("protection-plans-overview")}
  role="button"
  aria-label={m(messages, "planDetails")}
  data-dca-id="L:8D533E1A69"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.currentTarget.click();
    }
  }}
>
  <span className="underline ml2 normal">
    {m(messages, "details")}
  </span>
</Link>
```

**Why it works:**
- `tabIndex={0}` inserts the element into the natural tab order, making it reachable by
  keyboard navigation.
- The `onKeyDown` handler explicitly intercepts Enter (`"Enter"`) and Space (`" "`) — the
  two standard activation keys for `role="button"` per ARIA spec — and calls
  `e.currentTarget.click()` to trigger the `onClick` handler.
- `e.preventDefault()` suppresses default browser behavior (e.g., page scroll on Space),
  consistent with native `<button>` behavior.

---

## Why This Fixes WCAG 2.1.1

WCAG 2.1.1 requires that all functionality available by mouse is also available via keyboard.
A custom element with `role="button"` must:
1. Be reachable via Tab (`tabIndex={0}`)
2. Be activatable via Enter and Space keys

The pre-fix element failed both conditions. The post-fix element satisfies both.

---

## Pattern Classification

This is a **last-resort pattern** — a non-native element (`<Link>`) with `role="button"` that
cannot be replaced with a semantic `<button>` in this codebase context (likely due to
routing/design system constraints). The correct fix hierarchy is:

1. **Best:** Replace with a semantic `<button>` element
2. **Good:** Replace with an LD/WCP Button component
3. **Last Resort (this fix):** Add `tabIndex={0}` + `onKeyDown` Enter/Space handler to the
   non-native element

This matches the "Last Resort" variation already documented in WA11Y-WEB-2.1.1-002.

---

## Team / Domain Notes

- **File:** `libs/account/protection-plans-page/src/lib/protection-plans-select-a-plan.tsx`
- **Component:** `ProtectionPlansSelectAPlan`
- **Domain:** Accounts — Protection Plans
- **Jira label:** CEPG-*
- **Design System:** Uses `@walmart-web/ui-link` (`Link`) component — when `Link` is used
  with `role="button"` (no href navigation), it must have `tabIndex={0}` + keyboard handlers.
- **i18n:** ARIA label sourced via `m(messages, "planDetails")` — follows team convention.
- **Test coverage added:** Integration test in
  `libs/account/protection-plans-page/src/__tests__/integration/protection-plans-page.spec.tsx`
  using `it.each` to cover click, Enter, and Space activation paths.

---

## Bonus Cross-Criterion Finding

None identified. The element already had `aria-label={m(messages, "planDetails")}` so
WCAG 4.1.2 (Name, Role, Value) was not violated pre-fix. The role="button" was correct.
The sole gap was keyboard operability (2.1.1).

---

