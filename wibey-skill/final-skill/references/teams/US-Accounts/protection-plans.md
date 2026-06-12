# Team Architecture: Accounts — Protection Plans

**Domain Area:** Accounts
**Jira Label Mapping:** `CEPG-*` (Protection Plans / Account area)
**Last Updated:** 2026-03-20

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Protection Plans root:** `libs/account/protection-plans-page/src/lib/`

### Key Component Paths
| Component | Path |
|---|---|
| New Hub Item (plan card) | `libs/account/protection-plans-page/src/lib/protection-plans-new-hub-item.tsx` |
| PYP List (pick your plan) | `libs/account/protection-plans-page/src/lib/protection-plans-pyp-list.tsx` |
| Available Plans Group (radio group) | `libs/account/protection-plans-page/src/lib/protection-plans-available-plans-group.tsx` |

---

## 🛠️ Tech Stack & Constraints

- **Framework:** React (monorepo lib)
- **Design System:** Tempo `<Heading>` (NOT Living Design) — `as` prop required for semantic heading element
- **i18n:** Uses `m(messages, "key")` pattern for all user-facing strings (including ARIA labels)
- **Form groups:** Uses Living Design `FormGroup` with `role="radiogroup"` — must have accessible name via `aria-labelledby`

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-20] CEPG-344616 — Tempo `<Heading as="h6">` used as visual size shortcut — wrong heading hierarchy (WCAG 1.3.1):**
  Both `protection-plans-new-hub-item.tsx` and `protection-plans-pyp-list.tsx` used `as="h6"` on the Tempo `<Heading>` component to get small visual font size. This misrepresents document structure to screen reader users — `h6` is at the bottom of the heading hierarchy, but these are plan-level headings that sit at `h3` depth. Fix: change `as="h6"` to `as="h3"` and control visual size with `UNSAFE_className` Tachyons classes.

  ```tsx
  // ❌ WRONG — h6 used as a size hack; wrong hierarchy
  <Heading as="h6" UNSAFE_className="f6 f3-m mv1 lh-copy-m">
    {plan.title}
  </Heading>

  // ✅ CORRECT — h3 matches structural depth; visual size via Tachyons
  <Heading as="h3" UNSAFE_className="f6 f3-m mv1 lh-copy-m">
    {plan.title}
  </Heading>
  ```

  **Rule:** Never choose `as="hN"` for visual size. `as` controls semantic level; `UNSAFE_className` controls visual appearance. They are fully independent.

  **See:** `WA11Y-WEB-1.3.1-001.md` Variation 3

- **[2026-03-20] CEPG-330702 — `FormGroup role="radiogroup"` had no accessible name; screen readers announced "group" with no label (WCAG 1.3.1):**
  `protection-plans-available-plans-group.tsx` used `FormGroup role="radiogroup"` without any group label. Screen readers announced only "group" — users had no context for what they were selecting. Fix: add a `VisuallyHidden` span above the `FormGroup` and reference it via `aria-labelledby`. Route the label text through `m(messages, ...)` for localization.

  ```tsx
  // ❌ WRONG — radiogroup with no accessible name
  <FormGroup role="radiogroup">
    {planList?.map(...)}
  </FormGroup>

  // ✅ CORRECT — VisuallyHidden span provides the group label
  import { VisuallyHidden } from "@walmart-web/livingdesign-components";

  <div className="overflow-y-auto mt3">
    <VisuallyHidden>
      <span id="selectPlanHeading" className="sr-only">
        {m(messages, "selectAPlan")}
      </span>
    </VisuallyHidden>
    <FormGroup role="radiogroup" aria-labelledby="selectPlanHeading">
      {planList?.map(...)}
    </FormGroup>
  </div>
  ```

  **Rule:** Any `role="radiogroup"` or `role="group"` element must have an accessible name via `aria-labelledby` or `aria-label`. Always route label strings through `m(messages, ...)`.

  **See:** `WA11Y-WEB-1.3.1-004.md` Variation 1
File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Accounts/protection-plans.md
Content:
- **[CEPG-330695] New component documented:** `protection-plans-select-a-plan.tsx` contains
  `ProtectionPlansSelectAPlan` — the "Select a Plan" sub-view of the Protection Plans page
  (shown after clicking "See Plans").
- **Pattern alert:** `@walmart-web/ui-link` (`<Link>`) is used with `role="button"` in this
  component to navigate between sub-pages (via `setPage()`). When `Link` is used as a button
  trigger (no href), it requires `tabIndex={0}` + `onKeyDown` Enter/Space handler to be
  keyboard operable. This is a recurring pattern risk in this codebase.
- **Test pattern:** Integration tests for keyboard operability in this team use
  `userEvent.tab()` + `userEvent.keyboard("{Enter}")` / `userEvent.keyboard(" ")` via
  `@testing-library/user-event`. Tests are structured with `it.each` to cover click, Enter,
  and Space in a single parameterized test.

- **[2026-03-23] CEPG-341100 — PageTitle component on Create Tax Profile page had no focus management on mount (WCAG 2.4.3):**
  `libs/account/create-tax-profile-page/src/lib/components/page-title.tsx` rendered `<Heading as="h2">` with no `tabIndex` or focus logic. On SPA view mount, focus remained on the navigation trigger rather than moving to the page heading. Fix: wrap `<Heading>` in `<div ref={headingRef} tabIndex={-1} className="outline-0">` and add `useEffect(() => { headingRef.current?.focus(); ... }, [])` to focus and scroll to the heading on mount.
  ```tsx
  // ❌ WRONG — no focus management; heading not programmatically focusable
  <Heading as="h2" size="large" UNSAFE_className="mt3" data-testid="tax-profile-page-title">
    {m(messages, "pageTitle")}
  </Heading>

  // ✅ CORRECT — tabIndex={-1} wrapper + useRef + useEffect on mount
  <div ref={headingRef} tabIndex={-1} className="outline-0">
    <Heading as="h2" size="large" UNSAFE_className="mt3" data-testid="tax-profile-page-title">
      {m(messages, "pageTitle")}
    </Heading>
  </div>
  // useEffect fires on mount: headingRef.current.focus() + window.scrollTo with 200px sticky header offset
  ```
  **Rule:** Any page-level title component in a multi-step form or SPA view must own focus management via `tabIndex={-1}` + `useRef` + `useEffect([], [])`. This ensures focus order is logical from the top of the new view.
  **New sub-library identified:** `libs/account/create-tax-profile-page/` — tax profile creation flow for Account users (separate from the protection-plans and order-history sub-areas already documented).
  **See:** `WA11Y-WEB-2.4.3-004.md` Variation 1 · File: `libs/account/create-tax-profile-page/src/lib/components/page-title.tsx`

- **[2026-03-23] CEPG-344607 (PR #166541) — Three vague `aria-label` fixes across Protection Plans hub, PYP, and header (WCAG 4.1.2):**
  `protection-plans-new-hub-item.tsx`, `protection-plans-pyp-item.tsx`, and `protection-plans-new-header.tsx` all had static, context-free `aria-label` strings. On a page with multiple plan cards, every plan detail button announced identically ("Plan details"); the header link announced "View All" with no section context. Fix: interpolate plan title and section header name into the label via typed i18n keys.

  ```tsx
  // ❌ WRONG — identical labels across all plan cards
  aria-label={m(messages, "planDetails")}

  // ✅ CORRECT — interpolated with plan.title
  aria-label={m(messages, "chevromAlt", { planTitle })}
  // en-US.yaml: chevromAlt: "Plan details for {planTitle}"

  // ❌ WRONG — context-free "View All"
  aria-label={m(messages, "viewAll")}

  // ✅ CORRECT — interpolated with section headerTitle
  aria-label={m(messages, "viewAllAlt", { headerTitle })}
  // en-US.yaml: viewAllAlt: "View All {headerTitle}"
  ```

  **Companion fix:** WPP shield icon (`wpp-shield-v2.svg`) was `aria-hidden` + `alt=""`. Fix: remove `aria-hidden`, set `alt={m(messages, "shieldAlt")}` ("Protected") — the "Protected" status is meaningful, not decorative.

  **Pitfall — optional param types:** `messages.ts` uses optional types (`planTitle?: string`). If the prop feeding the param is `undefined` at runtime, announcement degrades to "Plan details for undefined". Always guard at the call site or provide a fallback string.

  **Architectural rule:** ARIA label strings for Protection Plans MUST go through `m(messages, "key", { param })` — never raw JSX string literals. This ensures all 6 locale variants receive translations automatically via the `anuvad` service.

  **New component path:** `libs/account/protection-plans-page/src/lib/protection-plans-new-header.tsx` — Protection Plans page header with "View All" section links.
  **See:** `WA11Y-WEB-4.1.2-002.md` Variation · Commit `7d77e8f6b6b3`
