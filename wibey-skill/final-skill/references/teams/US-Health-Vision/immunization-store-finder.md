# Team Architecture: Health-Vision — Immunization Scheduler / Store Finder

**Domain Area:** Health-Vision / Pharmacy (Immunization)
**Jira Label Mapping:** `PGSPHARM-*` (Pharmacy ADA / accessibility fixes)
**Last Updated:** 2026-04-01

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Immunization root:** `libs/immunization/`

### Key Component Paths

| Area | Path |
|---|---|
| Immunization scheduler | `libs/immunization/scheduler/` |
| Multi-IMZ page components | `libs/immunization/scheduler/multi-imz-page/src/lib/components/` |
| Store Finder | `libs/immunization/scheduler/multi-imz-page/src/lib/components/store-finder/` |
| Store Finder Page | `libs/immunization/scheduler/multi-imz-page/src/lib/components/store-finder/StoreFinder.tsx` |
| Store Finder Results | `libs/immunization/scheduler/multi-imz-page/src/lib/components/store-finder/StoreFinderResults.tsx` |

---

## 🐛 Known Accessibility Pitfalls

### Pitfall 1 — Off-screen `left: -9999px` hack for AT announcements
**Jira:** PGSPHARM-59277 | **PR:** #182869 | **Commit:** `998e5c374`

Using an absolutely positioned off-screen element (`position: absolute; left: -9999px`) to announce search results is fragile — AT may not re-read it if it was already in the DOM and only the text changed.

**Pattern:** Remove the off-screen hack. Use an inline `aria-live="assertive"` region directly in the results area. Trigger re-announcement with a `blur()`→`focus()` cycle on the element using a `useRef<HTMLElement>` (not `HTMLDivElement`).

```tsx
// ❌ BAD — off-screen hack
<span style={{ position: "absolute", left: "-9999px" }} aria-live="assertive">
  {resultCount} stores found
</span>

// ✅ GOOD — inline aria-live with blur/focus cycle
const resultInfoRef = useRef<HTMLElement>(null);

useEffect(() => {
  if (resultInfoRef.current && resultsLoaded) {
    resultInfoRef.current.blur();
    resultInfoRef.current.focus();
  }
}, [resultsLoaded]);

<span
  ref={resultInfoRef}
  tabIndex={-1}
  aria-live="assertive"
  role="alert"
>
  {m(messages, "storeFinderResultInfo", { count: storeCount })}
</span>
```

**Key rules:**
1. Use `useRef<HTMLElement>` not `useRef<HTMLDivElement>` — avoids TS type error when attaching to a `<span>`.
2. Always call `blur()` before `focus()` to force AT to re-read even if content was already announced.
3. The `role="alert"` attribute ensures assertive announcement on content change.
4. Related template: `WA11Y-WEB-4.1.3-002`

---

## 🔗 Catalyst Templates Used

| WCAG | Template | Fix Applied |
|---|---|---|
| 4.1.3 | `WA11Y-WEB-4.1.3-001` | Search result count via `aria-live` + blur/focus cycle (Var 2) |
