# Team Architecture: Subscriptions — Walmart+ Landing Page

**Domain Area:** Subscriptions
**Jira Label Mapping:** `CEWMPLUS-*` (Walmart+ / W+ Experience)
**Last Updated:** 2026-03-20

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **WPlus landing page root:** `libs/wplus/landing-page/src/`

### Key Component Paths
| Component | Path |
|---|---|
| Hero 2A/2B Module | `libs/wplus/landing-page/src/lib/modules/hero-2a-2b/index.tsx` |

---

## 🛠️ Tech Stack & Constraints

- **Framework:** React / Next.js SSR
- **Image system:** WCP `<Image>` component — passes `alt` through to underlying `<img>`
- **CMS:** Hero images sourced from CMS (`backgroundImagetype.alt` field) — CMS-driven alt values should NOT be used on decorative images
- **Modules:** Hero modules (2A, 2B) are layout variants of the same component

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-20] CEWMPLUS-144536 — Hero background image: CMS alt on decorative image + conflicting `tabIndex={-1}` (WCAG 1.1.1 + 4.1.2):**
  The hero background image in `Hero2A2B` had two simultaneous bugs despite already having `aria-hidden="true"`:
  1. `alt={backgroundImagetype.alt}` — CMS-driven alt on a decorative image. Should be `alt=""`.
  2. `tabIndex={-1}` + `aria-hidden="true"` — contradictory state. Decorative images should be fully inert.

  ```tsx
  // ❌ WRONG
  <Image alt={backgroundImagetype.alt} tabIndex={-1} aria-hidden="true" ... />

  // ✅ CORRECT — triple pattern for decorative images
  <Image alt="" aria-hidden="true" ... />
  ```

  **Rule:** Any decorative background image in a WPlus hero module must use `alt=""` + `aria-hidden="true"` with no `tabIndex`. Never wire `alt` to a CMS field for purely decorative assets.

  **See:** `RECOMMENDED_TEMPLATES.md` Draft #7 · `WA11Y-WEB-1.1.1-001.md`
