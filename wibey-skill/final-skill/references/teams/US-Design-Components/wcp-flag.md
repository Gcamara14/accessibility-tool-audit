# Team Architecture: Design Components — WcpFlag

**Domain Area:** Design-Components (Shared Library)
**Jira Label Mapping:** `BCPA-*` (Buy-box / Cart / Product Area accessibility)
**Last Updated:** 2026-03-20

---

## 📍 Where the Code Lives

This is a **shared design component library** used across many teams. Not owned by a single product domain.

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Library root:** `libs/design-components/`
- **WcpFlag component:** `libs/design-components/wcp-flag/src/lib/`

### Key Files
| File | Purpose |
|---|---|
| `wcp-flag.tsx` | Component source |
| `wcp-flag.stories.tsx` | Storybook documentation examples |
| `wcp-flag.types.ts` | TypeScript prop interfaces |

---

## 🛠️ Tech Stack & Constraints

- **Framework:** React (shared lib consumed by many apps)
- **Design System:** WCP (Walmart Component Platform) — uses WCP `<Icon>` for `leading`/`trailing` props
- **Icon component:** `<Icon name="..." />` renders inline SVGs — **no built-in a11y handling**
- **Storybook:** Used for all design-components documentation — if Storybook examples are wrong, developers copying from them will ship inaccessible code

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-20] BCPA-819 — WCP `<Icon>` SVGs missing `role="img"` + `aria-label` (WCAG 1.1.1):**
  The WCP `<Icon>` component renders raw SVGs with no implicit accessible name. When icons are **informative** (they convey meaning), consumers must add `role="img"` and `aria-label`. This bug was found in the Storybook _documentation examples_ for `WcpFlag` — the component source was fine, but the stories were showing the wrong usage pattern.

  ```tsx
  // ❌ WRONG — SVG has no accessible name
  <Icon name="ArrowDown" className="dark-red" />

  // ✅ CORRECT — informative icon with accessible name
  <Icon name="ArrowDown" className="dark-red" role="img" aria-label="Arrow down" />

  // ✅ CORRECT — decorative icon (no meaning added)
  <Icon name="Decorative" aria-hidden="true" />
  ```

  > ⚠️ **Audit risk:** Any Storybook story in `libs/design-components/` that renders `<Icon>` props without `role="img"` or `aria-hidden` is a live documentation hazard. Developers copy-pasting from Storybook will replicate the pattern.

  **See:** `RECOMMENDED_TEMPLATES.md` Draft #3 (proposed `WA11Y-WEB-1.1.1-002`) · `WA11Y-WEB-1.1.1-001.md` Variation 1

- **[2026-03-20] BCPA-821 — WCP Rating (`wcp-rating`) star stroke-width CSS specificity failure caused star borders to fail WCAG 1.4.11 non-text contrast (3:1):**
  In `libs/design-components/wcp-rating/src/lib/wcp-rating.module.scss`, `.small, .medium {}` were written as **sibling** selectors instead of `&.small {}` / `&.medium {}` **child-modifier** selectors, causing wrong stroke-width values to win in the cascade. Additionally, `.fill` elements inside `halfFilled` state were missing `stroke: none`, causing filled stars to inherit a border that corrupted the star shape boundary.
  ```scss
  /* ❌ WRONG — sibling selector; wrong cascade */
  .small, .medium { .fill { stroke-width: 0.094em; } }

  /* ✅ CORRECT — child-modifier; correct specificity */
  &.small  { .fill { stroke-width: 0.075em; } .empty { stroke-width: 0.047em; } }
  &.medium { .fill { stroke-width: 0.109em; } .empty { stroke-width: 0.078em; } }

  /* ✅ ALSO REQUIRED — prevent stroke inheritance on filled stars in halfFilled */
  &.halfFilled .fill { stroke: none; }
  ```
  **Note:** This is WCAG **1.4.11** (non-text contrast, 3:1 threshold) — NOT 1.4.3 (text contrast). The star stroke is the visual boundary of a graphical component.
  **See:** `WA11Y-ALL-1.4.11-001.md` Variation 1 · File: `libs/design-components/wcp-rating/src/lib/wcp-rating.module.scss`
File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Design-Components/wcp-flag.md
Content:

```
- **[2026-03-23] BCPA-822 — WCP SearchBar ClearButton focus loss on clear (WCAG 2.4.3):**
  In `libs/design-components/wcp-search-bar/src/lib/wcp-search-bar.tsx`, the `clear()` handler called
  `setSearchText("")` which caused the conditional `trailing={searchText && <ClearButton>}` slot to unmount
  the `ClearButton` from the DOM. Because the `ClearButton` held keyboard focus at the time of the
  action, its removal dropped focus to `document.body`. Fix: add `inputRef.current?.focus()` immediately
  after `onClear?.(oldText)` in the `clear()` handler — this is synchronous and runs before React
  reconciles the re-render, so the `ClearButton` is still in the DOM when focus is moved to the input.

  **Architectural pattern to flag:** WCP components that conditionally render focusable trailing/leading
  slots (via `&&` or ternary) where the activating action also clears the condition are all candidates
  for this focus-loss bug. The fix pattern is consistent: use the existing `inputRef` (already present
  in `WcpSearchBar` for `cancel()`) to call `.focus()` synchronously in the handler, before the
  re-render removes the activated element.

  **See:** WA11Y-WEB-2.4.3-003 Variation 1 · File: `libs/design-components/wcp-search-bar/src/lib/wcp-search-bar.tsx`
```
