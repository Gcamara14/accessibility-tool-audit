# Team Architecture: Post-Transaction — Reviewer Community Dashboard

**Domain Area:** Post-Transaction
**Jira Label Mapping:** `CEPG-*` (Reviewer Community / Sampling Tax flow)
**Last Updated:** 2026-03-23

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Library root:** `libs/reviewer-community/dashboard/src/lib/`

### Key Component Paths
| Component | Path |
|---|---|
| Tax Entry Content | `libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx` |
| Recognized Reviewer | `libs/reviewer-community/dashboard/src/lib/recognized-reviewer.tsx` |

---

## 🛠️ Tech Stack & Constraints

- **Framework:** React (TypeScript / TSX)
- **Design System:** WCP Living Design — `@walmart-web/livingdesign-components` (`<Heading>`, `<Link>`, `<Icon>`)
- **i18n:** `@walmart-web/platform-i18n` (`m(messages, key)` pattern)
- **Heading component:** Polymorphic WCP `<Heading>` — `as` sets semantic level; `size` + `UNSAFE_className` set visual weight (fully independent)

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-23] CEPG-341113 (PR #166628) — WCP `<Heading>` missing `as` prop + `<Link>` nested inside heading (WCAG 1.3.1):**
  In `libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx`, the "Let's get started" section heading used `<Heading size="large" weight={700}>` without `as`, causing no heading role in the DOM — screen readers could not navigate to this section via heading shortcuts.

  ```tsx
  // ❌ WRONG — no `as` prop; WCP Heading renders as styled div, no heading role
  <Heading size="large" weight={700} UNSAFE_className="pb2">
    {m(messages, "letsGetStarted")}
  </Heading>

  // ✅ CORRECT — as="h2" emits real <h2> element with heading role
  <Heading as="h2" size="large" weight={700} UNSAFE_className="pb2">
    {m(messages, "letsGetStarted")}
  </Heading>
  ```

  Secondary fix in `recognized-reviewer.tsx`: a `<Link>` was nested as a child inside `<Heading>`. Fix: extract both into a `<div className="flex items-center">` wrapper so heading and link are siblings.

  ```tsx
  // ❌ WRONG — Link nested inside Heading; AT may announce link as part of heading label
  <Heading as="h2" ...>
    {m(messages, "recognizedReviewer")}
    <Link href="..."><Icon name="InfoCircle" /></Link>
  </Heading>

  // ✅ CORRECT — heading and link are siblings in flex container
  <div className="flex items-center">
    <Heading as="h2" ...>{m(messages, "recognizedReviewer")}</Heading>
    <Link href="..."><Icon name="InfoCircle" /></Link>
  </div>
  ```

  **Rules for this library:**
  1. ALL `<Heading>` usages in `libs/reviewer-community/` must have an `as` prop — audit the full package.
  2. Never nest `<Link>` or `<Button>` as children of `<Heading>` — use a flex sibling wrapper.
  3. `document.title` updates use `setTimeout(..., 100)` pattern (workaround for async state race) — this is a known pattern as of PR #166628.

  **See:** `WA11Y-WEB-1.3.1-001.md` Variation 6 · Files: `libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx` + `recognized-reviewer.tsx`

### CEPG-341096 — 4.1.2 Role: Link Role is Missing | PR #166022
- **File:** `libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx`
- **Fix:** Exit control in `TaxEntryNav` had a hardcoded `role="button"` on mobile and no role override on desktop; replaced with a computed `exitRole = willShowExitModal ? "button" : "link"` derived from wizard-step state, ensuring the role accurately reflects whether activation opens a modal (button) or navigates away (link)
- **Pattern:** WA11Y-WEB-4.1.2-005 Var 3

### GPUGC-21456 — 4.1.3 Status Message: Success Messages Not Announced | PR #157085
- **File:** `libs/reviewer-community/all-reviews/src/lib/reviews-list.tsx`
- **Fix:** Added `announceAssertive()` + `addSnack()` via LD hooks inside a `showSnackMessage` helper, called in `deleteDraftReview` `onSuccess` to announce "Draft successfully deleted" to screen readers via `aria-live="assertive"` and display a visual snackbar simultaneously
- **Pattern:** WA11Y-WEB-4.1.3-001 Var 3
