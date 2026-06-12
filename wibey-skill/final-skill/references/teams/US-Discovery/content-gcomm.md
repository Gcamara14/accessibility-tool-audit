# Team Architecture: Discovery — GComm Content

**Domain Area:** Discovery / GComm Content (Ideas, Recipes, Editorial)
**Jira Label Mapping:** `CEPG-*` (GComm content-layer accessibility fixes)
**Last Updated:** 2026-03-23

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **GComm root:** `libs/gcomm/`
- **Key sub-libs:** `libs/gcomm/ideas/` (recipes, editorials), `libs/gcomm/shared/`

---

## 🔍 Accessibility Patterns Documented

### CEPG-337572 — 4.1.2 Role: Button Role is Missing | PR #161148
- **File:** `libs/gcomm/ideas/src/lib/pages/recipe/components/RecipeDescription.tsx`
- **Fix:** Replaced `<Link useLDLink href="#">` "Read more" text expander with `<Button variant="tertiary" className="black pa0">` — removes link role on a pure JS action element
- **Pattern:** WA11Y-WEB-4.1.2-004 Var 2

**New team file to create:** `teams/Discovery/content-gcomm.md`

No existing team file covers `libs/gcomm/ideas/`. The `gcomm` library is the GComm (General
Commerce) content/ideas system handling recipe pages and editorial content features. It maps
to the Discovery domain. Propose creating:

```
teams/Discovery/content-gcomm.md
```

Seed content:

```markdown
# Team Architecture: GComm Content / Ideas (Recipe Pages)

**Domain Area:** Discovery
**Jira Label Mapping:** CEPG-* (GComm prefix)
**Last Updated:** 2026-03-23

---

## Where the Code Lives

- **Monorepo root:** `libs/gcomm/`
- **Ideas / recipe pages:** `libs/gcomm/ideas/src/lib/pages/recipe/`
- **Locale files:** `libs/gcomm/ideas/src/lib/locale/`

### Key Component Paths

| Component | Path |
|---|---|
| RecipeDescription | `libs/gcomm/ideas/src/lib/pages/recipe/components/RecipeDescription.tsx` |
| Locale messages | `libs/gcomm/ideas/src/lib/locale/messages.tsx` |
| en-US YAML | `libs/gcomm/ideas/src/lib/locale/en-US.yaml` |

---

## Tech Stack & Constraints

- **Framework:** React (Next.js monorepo lib)
- **Design system:** `@walmart-web/ui-button`, `@walmart-web/ui-link`, `@walmart-web/ui-image` (WCP/ui-* components), `@walmart-web/livingdesign-components`
- **i18n:** `@walmart-web/platform-i18n` with `m(messages, key)` pattern; 6 locale YAMLs (en-US, en-CA, es-US, es-MX, es-CL, fr-CA); translation via Anuvad pipeline
- **Image:** `@walmart-web/ui-image` with ODN params helper (`appendOdnParams`)

---

## Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-23] CEPG-337572 (PR #161148) — `ui-link` with `href="#"` used as in-page text expander in RecipeDescription (WCAG 4.1.2):**
  The "Read more" CTA in `RecipeDescription.tsx` was a `<Link useLDLink href="#" onClick={readMoreLinkClick}>`. Because `ui-link` renders as `<a role="link">`, screen readers announced it as a link and placed it in the links rotor — despite it being a pure JS state toggle with no navigation intent.

  **Fix:** Replace with `<Button variant="tertiary" className="black pa0">` from `@walmart-web/ui-button`. The `pa0` class (Tachyons `padding: 0`) preserves the inline text layout by zeroing default button padding.

  **Diagnostic signal:** `href="#"` + pure `onClick` handler with no URL = button wearing link clothing.

  ```tsx
  // ❌ WRONG — announces as "link" to screen readers
  import Link from "@walmart-web/ui-link";
  <Link useLDLink href="#" onClick={readMoreLinkClick} className="black">
    {m(messages, "readMore")}
  </Link>

  // ✅ CORRECT — announces as "button"; correct semantics for in-page action
  import Button from "@walmart-web/ui-button";
  <Button variant="tertiary" className="black pa0" onClick={readMoreLinkClick}>
    {m(messages, "readMore")}
  </Button>
  ```

  **Companion fix (CEPG-337237 in same PR):** Partner logo `alt` and `VisuallyHidden` text
  updated from generic `logoText` to descriptive `goToPartnerSiteText` ("Go to partner site").
  New i18n key added to `messages.tsx` and all 6 locale YAML files.

  **See:** `WA11Y-WEB-4.1.2-004.md` Variation 2
```
