# Catalyst Template: Focus Order: Error Message Focus Not Managed: Focus Does Not Land on the Error

**Template ID:** `WA11Y-WEB-2.4.3-002`
**Platform:** Web
**WCAG Criterion:** WCAG-2.4.3

---

## 🛑 The Problem
After form submission, focus does not shift to the first error message, making it difficult for users to identify and address errors.

**Expected Result:** Upon form submission with errors, focus should move to the first error message to guide users in correcting mistakes.
**Actual Result:** Focus remains on the submit button or another unrelated element, leaving users unaware of the specific errors.

---

## ✅ The Fix Patterns

> **Recommendation:** Ensure that after form validation fails, focus is programmatically moved to the first error message. Use the Javascript Focus Method, OR, In React, utilize methods like setError from React Hook Form and manage focus using refs or the useEffect hook.

### Standard Implementation
```html
// Best: Form Validation - Set Error w/ shouldFocus:true if applicable
        import { useForm } from 'react-hook-form';
        
        // Good: JS eventlistener to move focus to field
        ErrorInputField.focus();
        
        // Last Resort: Move focus with setting a tabindex to 0 focus non-interactive elements.
        errorText.setAttribute('tabindex', '0'); errorText.focus();
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

# Ingest Draft: GPUGC-24707 | PR #170008

**JIRA:** GPUGC-24707
**PR:** #170008
**Commit:** 6edc7fb88445
**WCAG:** 2.4.3 Focus Order (Level A)
**Hint:** Error Message Focus Not Managed: Focus Does Not Land on the Error
**Template Match:** WA11Y-WEB-2.4.3-002 (variation — see details below)
**Proposed Variation ID:** WA11Y-WEB-2.4.3-002 Variation 2 (role="alert" + tabindex=-1 + counter re-trigger)

---

## Context

**File:** `libs/item/reviews/write-review/write-review-page/src/lib/write-review-enhancement/index-item-review.tsx`
**Domain:** Discovery (Item Page team — `libs/item/` path)
**Team Jira Prefix Discovered:** GPUGC (previously unmapped — maps to Discovery / Item Page / Reviews sub-team)
**Commit message:** `fix(reviews): focus alert whenever applicable in write a review flow (#170008)`

The Write-a-Review (WAR) flow presents error alerts for cases including:
- Duplicate review submission
- Overall rating required (zero-star validation)
- General submission errors

Before this fix, the `useEffect` called `.focus()` directly on the container ref (`alert.ref.current`), but the container was not the actual `[role="alert"]` element and may not have been focusable. Additionally, if the same error condition was triggered a second time (e.g., user hits submit again without fixing), the effect dependency didn't change, so focus was never re-fired.

---

## Bad Code (before)

```tsx
// useEffect: focus on alerts when they become visible
useEffect(() => {
  for (const alert of alerts) {
    if (alert.condition && alert.ref.current) {
      alert.ref.current.focus();  // ❌ focuses the wrapper, not [role="alert"]
                                   // ❌ wrapper may not be focusable
                                   // ❌ no re-trigger if same error fires again
    }
  }
}, [
  // ... other deps ...
  incentiveMessage,
  showAISuccessBanner,
  overallRatingRequired,
  alerts,
  // ❌ validationAttemptCounter missing — same-error re-submissions silent
]);

// No counter state — duplicate errors never re-focus
// setErrorMsg(m(msg, "duplicateSubmissionErrorText")); // but counter not bumped
```

---

## Good Code (after)

```tsx
// New state: counter forces re-focus even for repeated same-error submissions
const [validationAttemptCounter, setValidationAttemptCounter] = useState(0);

// Every error-setting callsite now increments the counter:
// 1. Duplicate review effect
useEffect(() => {
  if (isDuplicateReview) {
    setErrorMsg(m(msg, "duplicateSubmissionErrorText"));
    setValidationAttemptCounter((prev) => prev + 1);  // ✅ counter bump
  }
}, [isDuplicateReview, setErrorMsg]);

// 2. handlePageChange (overall rating = 0)
if (pageNo === 2 && rating === 0) {
  setOverallRatingRequired(true);
  setValidationAttemptCounter((prev) => prev + 1);  // ✅ counter bump
  goToTopSection();
}

// 3. Submission error handler
setErrorMsg(errorMessage);
setValidationAttemptCounter((prev) => prev + 1);  // ✅ counter bump
setSubmitReviewInProgress(false);
goToTopSection();

// 4. Duplicate check in submit handler
setErrorMsg(m(msg, "duplicateSubmissionErrorText"));
setValidationAttemptCounter((prev) => prev + 1);  // ✅ counter bump
return;

// Focus effect: now targets the [role="alert"] element precisely
useEffect(() => {
  for (const alert of alerts) {
    if (alert.condition && alert.ref.current) {
      const alertElement = alert.ref.current.querySelector('[role="alert"]');
      if (alertElement instanceof HTMLElement) {
        alertElement.setAttribute("tabindex", "-1");   // ✅ makes it focusable
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();               // ✅ releases prior focus
        }
        alertElement.focus();                          // ✅ focus lands on alert
      }
    }
  }
}, [
  // ... other deps ...
  incentiveMessage,
  showAISuccessBanner,
  overallRatingRequired,
  validationAttemptCounter,  // ✅ re-fires effect on every new validation attempt
  alerts,
]);
```

---

## Why This Fixes WCAG 2.4.3

WCAG 2.4.3 requires that focus order preserves meaning and operability. When a form error occurs, assistive technology users must have focus land on (or near) the error so the screen reader announces it. Two bugs existed:

1. **Wrong target:** `alert.ref.current.focus()` called `.focus()` on the wrapper `<div>` rather than the inner `[role="alert"]` element. The wrapper likely had no tabindex and no focusable role, so browsers silently ignored the `.focus()` call or focused an incorrect ancestor. Fix: use `querySelector('[role="alert"]')` + `setAttribute("tabindex", "-1")` so the semantically correct element receives focus and the screen reader announces the alert content.

2. **Re-submission silence:** When the same error occurred on a second submission attempt (e.g., user clicks "Submit" again without correcting the duplicate review), all the effect dependencies were unchanged, so the `useEffect` did not re-run and focus was never moved. Fix: `validationAttemptCounter` is an integer that always increments on any validation failure, guaranteeing the effect fires regardless of whether the error message is new or repeated.

The `.blur()` before `.focus()` is a defensive move: some browsers will not move focus if the target is already in the active focus context, so explicitly clearing the active element first ensures the focus event fires cleanly.

---

## Focus Mechanism Summary

| Mechanism | Used? |
|---|---|
| `useRef` + `.focus()` | Yes — via `alert.ref.current.querySelector(...)` |
| `tabindex="-1"` on non-interactive element | Yes — applied dynamically to `[role="alert"]` |
| `document.activeElement.blur()` before focus | Yes — defensive clear |
| Monotonically-incrementing counter in useEffect deps | Yes — novel pattern to force re-trigger |
| `aria-live` region | No (separate from the focus mechanism) |
| `scrollIntoView` | No (goToTopSection handles scroll separately) |

---

## Is This New or a Variation?

This is a **variation of WA11Y-WEB-2.4.3-002**. The existing template covers the general pattern of "focus the first error after form submission" using refs and `useEffect`. This PR adds two novel refinements:

1. **Targeting `[role="alert"]` via `querySelector` + dynamic `tabindex="-1"`** rather than focusing the ref container directly. This is safer when the ref wraps a compound component and the actual ARIA role element is a child.

2. **Monotonically-incrementing counter as a useEffect dependency** to force re-focus on repeated same-error submissions. This is a broadly reusable pattern for any React error-focus hook where the same error can fire consecutively.

Both refinements should be added as Variation 2 in WA11Y-WEB-2.4.3-002.

---

## Team / Domain Notes

- **Jira prefix GPUGC** was not previously mapped. Based on file path `libs/item/reviews/write-review/...`, this belongs to the **Discovery domain, Item Page team** (same domain as CEPG-* tickets for `libs/item/`).
- The reviews sub-path (`libs/item/reviews/`) is a sub-area of Item Page not yet explicitly listed in `teams/Discovery/item-page.md`. It should be added.
- The WAR (Write-a-Review) flow uses `useAsyncState` (custom hook, not standard React state), so state deps in `useEffect` must be carefully audited — `setValidationAttemptCounter` uses standard `useState` specifically to remain synchronous for the focus effect.

---

## Bonus Cross-Criterion Notes

- The `[role="alert"]` element receiving `tabindex="-1"` also touches WCAG 4.1.3 (Status Messages) — once focused, the screen reader announces the alert content as a status message. This is compliant because focus-delivery is the primary mechanism, not just the live region.
- No WCAG 1.3.1 issues observed in the diff.

---

