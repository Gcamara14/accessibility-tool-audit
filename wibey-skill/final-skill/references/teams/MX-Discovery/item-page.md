# Team Architecture: International — Mexico

**Domain Area:** International / Mexico (es-MX locale)
**Jira Label Mapping:** `INTX-*` (International team accessibility fixes)
**Last Updated:** 2026-03-24

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **International root:** `libs/international/` · `libs/marketplace/` (for cross-locale shared components)
- **Mexico locale keys:** `es-MX` in YAML message files

---

## 🔍 Accessibility Patterns Documented

### INTX-18110 — WCAG 1.3.1 Info and Relationships | PR #179293

- **File:** `libs/marketplace/return-policy/src/lib/return-policy-details/policy-line.tsx`
- **Fix:** Removed `aria-label` from `<li>` and `aria-hidden` from both child `<div>` elements in `PolicyLine`; real text content is now exposed to the accessibility tree for Mexican locale (es-MX) users
- **Pattern:** WA11Y-WEB-1.3.1-007 (proposed) Var 3
- **Locale context:** Mexico / international — `PolicyLine` renders i18n content props; fix ensures es-MX screen reader users hear policy title and content in natural DOM reading order
- **Shared PR:** Also covers INTX-17645 (Canada / en-CA) — same file, same fix
- **Root cause class:** aria-label on non-interactive container + aria-hidden on real content children — second confirmed cross-team instance of Draft #8 pattern
