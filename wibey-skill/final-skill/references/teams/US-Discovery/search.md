# Team Architecture: Search Experience

**Domain Area:** Discovery
**Jira Label Mapping:** `A11Y-US-Team-Search`
**Last Updated:** 2026-03-19

---

## 📍 Where the Code Lives
When fixing bugs for this team, start your search here (priority routing) before falling back to global grep: these repositories:
- **Web Client:** `git@github.walmart.com:us-web/discovery-search.git`
- **React Native (iOS/Android):** `git@github.walmart.com:us-mobile/search-rn.git`

## 🛠️ Tech Stack & Constraints
- **Framework:** Next.js (SSR) / React Native
- **Design System:** Heavily uses WCP `Chip_chip` components for single-dimension variant pills.

## ♿ Known Accessibility Pitfalls (Historical Memory)
- **[2026-03-19]:** Variant pills often lack `accessibleName`. Always check `WCP-Chip.md` before applying a fix. Screen readers will just announce the number (e.g., "30") without the unit ("30 Pack") unless explicitly provided.

- **[2026-03-23] OAMFD-10325 — Invalid `aria-selected` on roleless `<span>` in `SearchSuggestion` causes WCAG 2.1.2 focus trap:**
  In `libs/search/typeahead/src/lib/search-suggestion.tsx`, each suggestion item renders two sibling spans. The first has `role="option"` and `aria-selected` (correct). The second also had `aria-selected` but no `role`, creating a phantom AT node that confused screen reader virtual cursor traversal and trapped focus in the suggestion list. Fix: add `aria-hidden="true"` to the second span to remove it from the AT tree entirely. The inner `tabIndex={-1}` update-query button is a mouse-only affordance — it does not need AT exposure.

  ```tsx
  // ❌ WRONG — aria-selected on roleless span creates ghost AT node
  <span aria-selected={isHighlighted}>  {/* no role — invalid ARIA */}
    <Button tabIndex={-1} ... />
  </span>

  // ✅ CORRECT — aria-hidden removes the entire span from the AT tree
  <span aria-selected={isHighlighted} aria-hidden="true">
    <Button tabIndex={-1} ... />
  </span>
  ```

  **Rule:** `aria-selected` is only meaningful on elements with roles that support it (`option`, `gridcell`, `row`, `tab`). Never place `aria-selected` on a plain `<span>` or `<div>`. Use `aria-hidden="true"` to exclude decorative/utility wrapper spans from the AT tree.
  **Jira prefix note:** OAMFD- maps to the Discovery / Search team (confirmed via `libs/search/typeahead/` file path).
  **See:** `RECOMMENDED_TEMPLATES.md` Draft `WA11Y-WEB-2.1.2-001` · File: `libs/search/typeahead/src/lib/search-suggestion.tsx`

- **[2026-03-23] CEPG-335619 — Product card full-card `<Link>` wrapper traps nested interactive buttons (WCAG 2.1.2):**
  In `libs/tempo-shared-modules/product-card/src/lib/product-card.tsx`, a full-card `<Link>` wrapper enclosed CTA buttons as children, creating an interactive-element-inside-anchor structure that trapped keyboard focus. Secondary issue: `pov-n-up.tsx` had `tabIndex={0}` on non-interactive `GridCell` containers — phantom dead focus stops. Fix uses the "stretched link" pattern: wrap in `<div className="relative">`, make `<Link>` `position: absolute` with `<VisuallyHidden>` label, promote CTA buttons to `relative z-1` as siblings. Also remove `tabIndex={0}` from structural containers.

  ```tsx
  // ✅ STRETCHED LINK PATTERN
  <div className="relative">
    <Link className="absolute top-0 left-0 w-100 h-100 z-1 db no-underline pointer" ...>
      <VisuallyHidden>{title}</VisuallyHidden>
    </Link>
    {generateCardContent(cardContents)}  {/* buttons are siblings, not children of <a> */}
  </div>
  // All CTA buttons get "... relative z-1" classes
  ```

  **Rule:** Never nest interactive elements (buttons, inputs) inside `<a>`. For full-card link patterns, use stretched link: absolute anchor sibling + `VisuallyHidden` label + buttons promoted with `z-1`.
  **CCM flag:** `enableTempoProductCard: true` gates this fix on the Sams Club category page.
  **VisuallyHidden:** `import { VisuallyHidden } from "@walmart-web/livingdesign-components"` — use the LD component.
  **See:** `RECOMMENDED_TEMPLATES.md` Draft `WA11Y-WEB-2.1.2-001` · Files: `libs/tempo-shared-modules/product-card/` + `libs/tempo-shared-modules/pov-n-up/`
