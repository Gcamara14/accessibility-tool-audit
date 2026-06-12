# Team Architecture: Health-Vision — Pharmacy

**Domain Area:** Health-Vision / Pharmacy
**Jira Label Mapping:** `PGSPHARM-*` (Pharmacy ADA / accessibility fixes)
**Last Updated:** 2026-03-23

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Pharmacy root:** `libs/pharmacy/`

### Key Component Paths

| Area | Path |
|---|---|
| Common modal components | `libs/pharmacy/common/components/src/lib/` |
| Consent Modal | `libs/pharmacy/common/components/src/lib/ConsentModal/index.tsx` |
| Enroll Text Notifications | `libs/pharmacy/common/components/src/lib/EnrollTextNotificationsWrapper/` |
| Import Rx — Review Screen | `libs/pharmacy/import-rx/import-rx-improvements/src/lib/components/review-request-screen/` |

---

## 🛠️ Tech Stack & Constraints

- **Framework:** React (TypeScript / TSX), Next.js monorepo lib
- **Design system:** `@walmart-web/ui-button`, `@walmart-web/ui-dialog`, `@walmart-web/ui-link` (WCP ui-* components — NOT full Living Design suite)
- **i18n:** `@walmart-web/platform-i18n` with `m(messages, key)` pattern; locale YAML files for en-US, en-CA, es-US, es-MX, es-CL, fr-CA
- **Responsive:** `useResponsiveView` from `@walmart-web/ui-utils` — components have mobile and desktop render branches; accessibility fixes must cover BOTH branches

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-23] PGSPHARM-51056 (PR #149879) — `ui-link` with `href=""` used as action button in ConsentModal (WCAG 4.1.2):**
  Two occurrences in `ConsentModal/index.tsx` (mobile and desktop branches) used `<Link href="" onClick={...}>` from `@walmart-web/ui-link` for a secondary CTA that dismisses the modal. `ui-link` renders as `<a role="link">` — screen readers announced "link" for a pure action control with no navigation intent.

  **Diagnostic signal:** `href=""` + pure `onClick` handler (no URL navigation) = button wearing link clothes.

  ```tsx
  // ❌ WRONG — announces as "link"; no navigation intent
  import Link from "@walmart-web/ui-link";
  <Link href="" onClick={() => handleSecondaryCTA(modalType)}>
    {secondaryButtonText}
  </Link>

  // ✅ CORRECT — announces as "button"; semantics match intent
  import Button from "@walmart-web/ui-button";
  <Button variant="tertiary" onClick={() => handleSecondaryCTA(modalType)}>
    {secondaryButtonText}
  </Button>
  ```

  **Audit tip:** This pattern may appear in other pharmacy modals/dialogs — grep across the entire pharmacy lib:
  ```bash
  grep -rn 'href=""' libs/pharmacy/ --include="*.tsx" | grep onClick
  ```

  **Responsive note:** Fix must be applied in BOTH mobile (scrollable) and desktop render branches — they are separate JSX paths in ConsentModal.
  **See:** `WA11Y-WEB-4.1.2-004.md` Variation 1 · File: `libs/pharmacy/common/components/src/lib/ConsentModal/index.tsx`

- **[2025-09-05] CEPG-330515-A (PR #158467) — Pharmacy review screen empty fields announced as "dash dash" (WCAG 4.1.2):**
  In `libs/pharmacy/import-rx/import-rx-improvements/src/lib/components/review-request-screen/review-sections.tsx`, data fields with no recorded value rendered the `NO_VALUE` constant (`"--"`) directly into JSX. Screen readers announced literal punctuation ("dash dash") rather than communicating semantic emptiness.

  **Fix — `ValueText` wrapper component:**
  ```tsx
  // For empty/null values:
  <span aria-label={REVIEW_PIMS_REQUEST.EMPTY_ARIA_LABEL}>
    <span aria-hidden="true">{REVIEW_PIMS_REQUEST.NO_VALUE}</span>
  </span>
  // Outer span: accessible name = "Empty"
  // Inner span: decorative "--" hidden from AT

  // For non-empty values:
  <span>{rawText}</span>
  ```

  **Companion fix:** `<ListItem>` components in review sections were given `role="none"` to neutralize a conflicting implicit ARIA role within the parent list structure.

  **Audit scope:** Any pharmacy data-display screen rendering `REVIEW_PIMS_REQUEST.NO_VALUE` (`"--"`) directly into JSX without an `aria-label` wrapper is a potential 4.1.2 violation. Audit all files under `libs/pharmacy/import-rx/import-rx-improvements/src/lib/components/`.

  **i18n note:** `EMPTY_ARIA_LABEL` is locale-routed via `emptyAriaLabel` key — ensure this key is present in all 6 locale YAML files when adding new pharmacy data-display screens.
  **See:** `WA11Y-WEB-4.1.2-002.md` Variation 1 · Commit `96e6166fb81a`

- **[~2025] Pharmacy error message announcement (companion fix in PR #149879 merge):**
  File: `libs/pharmacy/common/components/src/lib/EnrollTextNotificationsWrapper/enroll-dialog/add-edit-phone-number/index.tsx`
  Pattern: programmatic focus moved to error message container after error state is set, so screen reader users hear the error announcement without manual polling. Check this file if error messages in EnrollTextNotifications are not being announced.
