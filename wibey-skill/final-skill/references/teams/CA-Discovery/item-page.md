# Team Architecture: International — Canada

**Domain Area:** International / Canada (en-CA, fr-CA locales)
**Jira Label Mapping:** `INTX-*` (International team accessibility fixes)
**Last Updated:** 2026-03-24

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **International root:** `libs/international/` · `libs/marketplace/` (for cross-locale shared components)
- **Canada locale keys:** `en-CA`, `fr-CA` in YAML message files

---

## 🔍 Accessibility Patterns Documented

### INTX-17877 — WCAG 3.2.2 On Input (Level A) | PR #179062
- **File:** `libs/ui/slider/src/lib/range-slider.tsx`
- **Fix:** Removed Tab key interception from `handleKeyDown` in `RangeSlider` — Tab was calling `handleMouseUp()` which fired `onChange`, triggering URL navigation and collapsing the price-range popover unexpectedly for keyboard users
- **Pattern:** WA11Y-WEB-3.2.2-001 Var 1
- **Locale context:** Canada / international — INTX- prefix confirms this is the international price-range filter used on Canada locale pages; the page re-mount on Tab was observable specifically in URL-driven locale routing

### INTX-17645 — WCAG 1.3.1 Info and Relationships | PR #179293
- **File:** `libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx`
- **Fix:** Removed `aria-label` from `<li>` and `aria-hidden` from both child `<div>` elements in `PolicyLine`, restoring natural AT-readable text content in the return policy details modal
- **Pattern:** WA11Y-WEB-1.3.1-007 Var 2
- **Locale context:** Canada / international (SWC path — `returnPolicyInSWC` prop gates Canada layout; fix applies to all locales)
