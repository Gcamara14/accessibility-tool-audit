# Team Architecture: Identity Next (Sign In / Auth)

**Domain Area:** Accounts
**Jira Label Mapping:** `WSC` (e.g., WSC-4050)
**Last Updated:** 2026-03-19

---

## 📍 Where the Code Lives
When fixing bugs for this team, start your search here (priority routing) before falling back to global grep: these repositories:
- **Monorepo (Web):** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Local path:** `apps/identity-next/` and `libs/identity-next/`

### Key Files
- **Sign In CTA component:** `libs/identity-next/ui/src/lib/sign-in-button/sign-in-button.tsx`
- **Sign In page:** `apps/identity-next/app/pages/account/sign-in/index.tsx`

## 🛠️ Tech Stack & Constraints
- **Framework:** Next.js (SSR) — `apps/identity-next/`
- **Design System:** Uses `@walmart-web/ui-button` (wrapper around Living Design `Button`)
- **Auth Hook:** `useSignIn()` from `@walmart-web/identity-next-auth-navigation-utils` — always provides `signInUrl`. Do not hardcode identity URLs.
- **Linter:** Biome (runs as pre-commit hook). Fixes auto-apply on commit.

## ♿ Known Accessibility Pitfalls (Historical Memory)
- **[2026-03-19] WSC-4050:** `SignInButton` default render branch was missing `href={signInUrl}`, causing `ui-button` to render as `<button>` instead of `<a>`. Since `signInUrl` is always computed by `useSignIn()`, both render branches must always pass `href={signInUrl}`. Fix: add `href={signInUrl}` to the no-href branch. **Template:** `WA11Y-WEB-4.1.2-005`.

- **[2026-03-20] WSC-3897 — Language selector radio inputs used unique per-locale `name` values, breaking programmatic grouping (WCAG 1.3.1):**
  In `libs/ui/global-header/menu/src/lib/language-toggle.tsx`, each `<Radio>` was given `name={loc}` (e.g. `"en"`, `"es"`), making each radio its own independent single-button group. Arrow-key navigation between options was broken and the mutually exclusive relationship was never announced by AT. Fix: change all radios to share `name="selectLanguage"` (a single static string) and add `radioProps={{ "aria-describedby": "language-toggle-header" }}` referencing the section `<h2>`.
  ```tsx
  // ❌ WRONG — each radio is its own group
  <Radio name={loc} value={loc} ... />

  // ✅ CORRECT — shared static name; all radios form one group
  <Radio name="selectLanguage" value={loc} radioProps={{ "aria-describedby": "language-toggle-header" }} ... />
  ```
  **Rule:** Never derive `name` from a per-item value in radio groups. Always use a single static string shared by all radios in the group.
  **See:** `WA11Y-WEB-1.3.1-004.md` Variation 2 · File: `libs/ui/global-header/menu/src/lib/language-toggle.tsx`
File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Accounts/identity-next.md
Content:
- **[2026-03-23] CEPG-340591 — Info icon on Sampling Tax form not keyboard focusable (WCAG 2.1.1):**
  In `libs/identity-next/know-your-customer-views/src/lib/sampling-tax-view/sampling-tax-form.tsx`, an `<Icon>` with `role="button"` and `onClick` was missing `tabIndex={0}` and `onKeyDown`. Fix: extract into `InfoIcon` component with `tabIndex={0}` and `onKeyDown` guard for Enter/Space keys.
  ```tsx
  // ❌ WRONG — role="button" with no tabIndex or keyboard handler
  <Icon role="button" onClick={handleInfoClick} />

  // ✅ CORRECT — tabIndex + onKeyDown to match pointer behaviour
  <Icon
    tabIndex={0}
    role="button"
    onClick={handleInfoClick}
    onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleInfoClick();
      }
    }}
  />
  ```
  **Rule:** Any non-native element with `role="button"` must always have both `tabIndex={0}` AND an `onKeyDown` handler for Enter/Space. Missing either one breaks WCAG 2.1.1.
  **New sub-library identified:** `libs/identity-next/know-your-customer-views/` — KYC tax compliance screens for Sampling customers (separate from the main sign-in/auth flows already documented).
  **See:** `WA11Y-WEB-2.1.1-002.md` · File: `libs/identity-next/know-your-customer-views/src/lib/sampling-tax-view/sampling-tax-form.tsx`

### WSC-4050 — 4.1.2 Role: Generic Interactive Role is Missing | PR #165320
- **Files:** `libs/ui/global-header/component/src/lib/desktop-flyout.tsx` · `libs/ui/global-header/menu/src/lib/stateless-menu.tsx`
- **Fix:** Added `href={signInUrl}` to LD `Button` in `AccountLoggedOutLinks` (desktop flyout) and `StatelessMenu` (mobile menu) so the component renders as `<a>` (link) instead of `<button>`; added `event.preventDefault()` alongside href to preserve custom `signIn()` routing logic
- **Pattern:** WA11Y-WEB-4.1.2-005 Var 2
- **New sub-library identified:** `libs/ui/global-header/` — shared global header shell (desktop flyout + mobile hamburger menu); separate from `libs/identity-next/`. Sign-in CTAs in this layer must always receive `href={signInUrl}` from the auth hook to render correct link semantics.
```
