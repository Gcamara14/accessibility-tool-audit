# Team Architecture: Subscriptions — Manage Dashboard

**Domain Area:** Subscriptions / Manage Dashboard
**Jira Label Mapping:** `CEPG-*` (subscription manage-dashboard accessibility fixes)
**Last Updated:** 2026-03-23

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Dashboard root:** `libs/subscription/manage-dashboard/`
- **Key components:** `libs/subscription/manage-dashboard/src/lib/dashboard-components/`

---

## 🔍 Accessibility Patterns Documented

### CEPG-335616 — 4.1.3 Status Messages: Success Alert Not Announced | PR #164343
- **File:** `libs/subscription/manage-dashboard/src/lib/dashboard-components/dashboard-content.tsx`
- **Fix:** Added `aria-live="polite" role="alert"` to WCP `<Alert variant="success">` so the subscription update success message is announced to screen readers when dynamically injected into the DOM.
- **Pattern:** WA11Y-WEB-4.1.3-001 Var 1
