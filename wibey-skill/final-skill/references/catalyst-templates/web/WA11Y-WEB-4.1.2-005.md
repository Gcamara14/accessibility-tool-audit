# Catalyst Template: Role: Link Role is Missing (Link)

**Template ID:** `WA11Y-WEB-4.1.2-005`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem
An element intended to function as a link, lacks the semantic &lt;a&gt; tag, impacting screen reader interpretation and navigation.

**Expected Result:** Links should use the semantic &lt;a&gt; element to ensure they are recognized correctly by assistive technologies.
**Actual Result:** Links are implemented using non-semantic elements like &lt;div&gt; or &lt;span&gt; without appropriate roles.

---

## ✅ The Fix Patterns

> **Recommendation:** Use the &lt;a href&gt; element for links, or use the LD Link, or as a last-resort, add role="link" along with necessary keyboard interactions if using non-semantic elements.

### Standard Implementation
```html
// Best: LD Link
        <Link href="#">Go Back</Link>
        
        // Good: Native HTML5 Link
        <a href="#">Go Back</a>
        
        // Last Resort: Must add JS click event handlers too for keyboard.
        <div role="link" tabindex="0" onclick="location.href='#'">Go Back</div>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

## 🧪 Ingested Variations (Self-Documented)

### Variation 1: `SignInButton` wrapper around `@walmart-web/ui-button` (WSC-4050 · 2026-03-19)
**Context:** `libs/identity-next/ui/src/lib/sign-in-button/sign-in-button.tsx` in the `walmart-web/walmart` monorepo.
The component had two render branches: one for when `href` was explicitly passed (correctly used `href={signInUrl}`), and a default branch that omitted `href`, causing `ui-button` to render as `<button>` instead of `<a>`.

**❌ Bad Code:**
```tsx
// Default branch — renders as <button>, WCAG 4.1.2 violation
return (
  <Button
    {...props}
    onClick={_internalOnClick}
    data-dca-id="B:388EE66831"
    data-dca-intent="__DCA_TBD__"
  >
    {children}
  </Button>
);
```

**✅ Good Code:**
```tsx
// Fixed — always pass href={signInUrl} so ui-button renders as <a>
// signInUrl is always available from useSignIn() hook
return (
  <Button
    {...props}
    onClick={_internalOnClick}
    href={signInUrl}
    data-dca-id="B:388EE66831"
    data-dca-intent="__DCA_TBD__"
  >
    {children}
  </Button>
);
```
**Key Rule:** When wrapping LD/ui-button with a navigation hook that always produces a URL (`signInUrl`), that URL **must** always be passed as `href`. Never rely on `onClick` alone for navigation.


# Ingestion Draft: WSC-4050 / PR #165320

**Ingested by:** Wibey Accessibility Swarm Agent
**Date:** 2026-03-23
**Classification:** EXISTING VARIATION — append as Variation 2 to `WA11Y-WEB-4.1.2-005`

---

## Metadata

| Field | Value |
|---|---|
| Jira | WSC-4050 |
| PR | #165320 |
| Commit | bce776b6d498b5c52042edbb8fb1f839c12f41d2 |
| Author | Matthew Bosch - mrb00h9 (Matthew.Bosch@walmart.com) |
| WCAG Criterion | 4.1.2 Name, Role, Value — "Role: Generic Interactive Role is Missing (Generic No Role)" |
| Auditor Tag | 4.1.2 — Generic Interactive Role is Missing |
| Actual Root Cause | Link role missing — LD Button without `href` renders as `<button>` instead of `<a>` |
| Template ID | WA11Y-WEB-4.1.2-005 |
| Domain | Accounts / Identity |
| Team | Identity Next (global-header shared lib) |
| Primary Files | `libs/ui/global-header/component/src/lib/desktop-flyout.tsx` · `libs/ui/global-header/menu/src/lib/stateless-menu.tsx` |
| Jira Prefix | WSC- → Accounts / Identity domain |

---

## WCAG Criterion

**4.1.2 Name, Role, Value** — Sub-criterion: **Role: Link Role is Missing**

A navigation CTA that takes the user to the sign-in page must be announced by assistive technology as a **link**, not a button. When the Living Design `Button` component receives an `href` prop it renders as an `<a>` element; without `href` it renders as `<button>`. Two "Sign In" and "Create Account" CTAs in the global header were rendered without `href`, so screen readers announced them as buttons with no navigational destination.

---

## Component / File Context

Two locations in the shared `libs/ui/global-header/` library (separate from the `libs/identity-next/` sign-in-button wrapper already documented in Variation 1):

1. `libs/ui/global-header/component/src/lib/desktop-flyout.tsx` — `AccountLoggedOutLinks` component (desktop header flyout)
2. `libs/ui/global-header/menu/src/lib/stateless-menu.tsx` — `StatelessMenu` component (mobile hamburger menu)

Both render Living Design `Button` components that navigate to `signInUrl`. Because `href` was absent the LD `Button` fell back to rendering `<button>`, giving it `role="button"` semantics. Keyboard users and screen reader users received no indication that activation would perform navigation rather than a same-page action.

---

## Bad Pattern (❌)

```tsx
// libs/ui/global-header/component/src/lib/desktop-flyout.tsx — AccountLoggedOutLinks
// ❌ No href — LD Button renders as <button role="button">, not <a role="link">
<Button
  className="db mb3 w-100"
  onClick={async () => {
    await waitUntilNextFrame();
    onHeaderFlyoutClose();
    return signIn();
  }}
  // ... analytics tracking props
  variant="primary"
  data-testid="sign-in"
>
  {signInText}
</Button>

// libs/ui/global-header/menu/src/lib/stateless-menu.tsx — StatelessMenu
// ❌ Same anti-pattern in the mobile menu
<Button
  className="mr3"
  variant="primary"
  onClick={() => signIn()}
  data-testid="sign-in"
>
  {signInText}
</Button>
```

Root cause: `signInUrl` was available in both components but was not passed as `href`. Without `href`, the Living Design `Button` component renders as a `<button>` element. Because the intended action is navigation to the sign-in page, the correct semantic element is `<a>` (link), not `<button>`.

---

## Good Pattern (✅)

```tsx
// libs/ui/global-header/component/src/lib/desktop-flyout.tsx — AccountLoggedOutLinks
// ✅ href={signInUrl} supplied — LD Button renders as <a href="..."> with role="link"
<Button
  className="flex mb3 w-100"
  onClick={async (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // signInUrl may differ from the URL used by signIn()
    await waitUntilNextFrame();
    onHeaderFlyoutClose();
    return signIn();
  }}
  // ... analytics tracking props
  href={signInUrl}
  variant="primary"
  data-testid="sign-in"
>
  {signInText}
</Button>

// libs/ui/global-header/menu/src/lib/stateless-menu.tsx — StatelessMenu
// ✅ Same fix applied to mobile menu
<Button
  className="mr3"
  variant="primary"
  onClick={(
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // signInUrl may differ from the URL used by signIn()
    signIn();
  }}
  href={signInUrl}
  data-testid="sign-in"
>
  {signInText}
</Button>
```

Note: `event.preventDefault()` is added alongside `href` because `signIn()` may resolve to a different URL than `signInUrl` at runtime (e.g., post-auth redirect injection). The `href` provides the correct semantic role and allows browsers / AT to surface the destination URL; `event.preventDefault()` ensures the custom `signIn()` logic runs instead of a raw browser navigation.

---

## Why It Works

Passing `href={signInUrl}` to the Living Design `Button` component switches its rendered element from `<button>` to `<a>`, giving it the native `role="link"` and exposing the destination URL to assistive technology. Screen readers now announce "Sign In, link" and display the href in the links list, correctly communicating navigational intent to users of all abilities.

---

## Architectural Distinction from Variation 1

| | Variation 1 (WSC-4050 · 2026-03-19) | Variation 2 (WSC-4050 · 2026-03-23) |
|---|---|---|
| File | `libs/identity-next/ui/src/lib/sign-in-button/sign-in-button.tsx` | `libs/ui/global-header/component/src/lib/desktop-flyout.tsx` + `libs/ui/global-header/menu/src/lib/stateless-menu.tsx` |
| Library | identity-next (auth-specific wrapper) | global-header (shared header/nav shell) |
| Pattern | Default render branch omitted `href` when no explicit prop passed | Both desktop flyout and mobile menu omitted `href` entirely |
| Root | Missing fallback in wrapper component | Missing prop at call site in shared header lib |

Same Jira number (WSC-4050), same fix class, different codebase locations — confirms the pattern recurs across the global header layer independently of the identity-next lib.

---



---

# Ingestion Draft: CEPG-341096 / PR #166022

**Ingested by:** Wibey Accessibility Swarm Agent
**Date:** 2026-03-23
**Classification:** EXISTING VARIATION — appended to `WA11Y-WEB-4.1.2-005`

---

## Metadata

| Field | Value |
|---|---|
| Jira | CEPG-341096 |
| PR | #166022 |
| Commit | c1c8e8f9730d955b0b7990c514b9a93df5f57441 |
| Author | Sarah Jiang (yue.jiang0@walmart.com) |
| WCAG Criterion | 4.1.2 Name, Role, Value — "Role: Link Role is Missing" |
| Template ID | WA11Y-WEB-4.1.2-005 |
| Domain | Post-Transaction / Reviewer Community |
| Team | Reviewer Community (Post-Transaction domain) |
| Primary File | `libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx` |

---

## Template Routing Decision

**EXISTING VARIATION** — This fix belongs to `WA11Y-WEB-4.1.2-005` ("Role: Link Role is Missing"). However, it introduces an architecturally distinct sub-pattern not yet represented: a **conditional role** on a non-native interactive element, where the role must dynamically switch between `"link"` and `"button"` based on runtime application state.

Existing Variation 1 covers a static case (LD/ui-button always missing `href`). This variation covers a **stateful dual-mode element**: the exit control in the tax profile navigation bar is sometimes a link (it navigates away when no exit confirmation modal is needed) and sometimes a button (it opens a confirmation modal mid-flow). A single hardcoded role would misrepresent the element's behavior in at least one state.

**Proposed Variation ID:** Variation 3 under `WA11Y-WEB-4.1.2-005`

---

## Component / File Context

`TaxEntryNav` is the navigation bar for the sampling tax profile wizard in the Reviewer Community dashboard (`libs/reviewer-community/`). It renders two branches: a mobile nav and a desktop nav. Both branches contain an "exit" control — on mobile it is a WCP `<Icon>`, on desktop it is a WCP `<Button>` styled as a tertiary link. In both branches the same exit control must:
- Announce as a **button** when the user is mid-flow (identity or profile step active, `willShowExitModal === true`) — because clicking it opens a confirmation dialog, not navigating.
- Announce as a **link** when the user is at the start or end of flow (`willShowExitModal === false`) — because clicking it navigates directly away.

Before the fix, `role="button"` was hardcoded on the mobile `<Icon>` and no `role` at all was set on the desktop `<Button>` exit control, meaning the link behavior was never announced correctly.

---

## WCAG Criterion

**4.1.2 Name, Role, Value** — sub-criterion: **Role: Link Role is Missing**

An interactive element that performs navigation in some app states must expose `role="link"` in those states so that assistive technology correctly categorises it. A hardcoded `role="button"` on an element that may perform navigation is a 4.1.2 violation when the element's actual behaviour is navigation.

---

## Bad Pattern (before)

```tsx
// libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx

// ❌ WCAG 4.1.2 VIOLATION — Mobile branch:
// role="button" is hardcoded even when clicking the icon navigates (no modal shown)
<Icon
  role="button"           // ❌ hardcoded — wrong when element actually navigates
  name="Close"
  size="medium"
  aria-label={m(messages, "exit")}
  onClick={onIconExit}
  ...
/>

// ❌ WCAG 4.1.2 VIOLATION — Desktop branch:
// <Button> with role="link" on the Walmart logo navigates, but the exit <Button> had no role
// override at all — LD Button defaults to role="button" regardless of navigation intent.
<Button
  aria-label={m(messages, "exit")}
  // ❌ no role override — always announces as "button" even when it navigates
  onClick={onExit}
  variant="tertiary"
  UNSAFE_style={{ textDecoration: "none" }}
>
  <Icon name="Close" size="medium" />
</Button>
```

**Root cause:** The exit control has two distinct behavioural modes depending on where the user is in the multi-step wizard. When `showIdentityComponent || showProfileComponent` is true, clicking exit opens a confirmation modal (button semantics). When neither is true, clicking exit navigates directly away (link semantics). Because the role was hardcoded, screen readers always announced "button" — misleading users about the navigation-mode behaviour.

---

## Good Pattern (after)

```tsx
// libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx

// Step 1 — Derive willShowExitModal from app state in TaxEntry (parent)
const willShowExitModal =
  (showIdentityComponent || showProfileComponent) && !taxFlowError;

// Step 2 — Pass it down to TaxEntryNav
<TaxEntryNav
  onIconExit={handleIconExit}
  onExit={handleOpenExitModal}
  willShowExitModal={willShowExitModal}   // ✅ state-derived prop
/>

// Step 3 — Derive role inside TaxEntryNav
const TaxEntryNav: FC<{
  onExit: () => void;
  onIconExit: () => void;
  willShowExitModal: boolean;             // ✅ new prop
}> = ({ onExit, onIconExit, willShowExitModal }) => {
  const exitRole = willShowExitModal ? "button" : "link";  // ✅ computed role

  return isMobile ? (
    // ✅ Mobile branch — role is now dynamic
    <Icon
      role={exitRole}                     // ✅ "link" when navigating, "button" when opening modal
      name="Close"
      size="medium"
      aria-label={m(messages, "exit")}
      onClick={onIconExit}
      ...
    />
  ) : (
    // ✅ Desktop branch — Button gets explicit role override
    <Button
      aria-label={m(messages, "exit")}
      role={exitRole}                     // ✅ overrides LD Button's implicit "button" role when needed
      onClick={onExit}
      variant="tertiary"
      UNSAFE_style={{ textDecoration: "none" }}
    >
      <Icon name="Close" size="medium" />
    </Button>
  );
};
```

**Why this works:** ARIA `role` on a rendered element overrides the implicit role of the underlying HTML element. When `exitRole === "link"`, screen readers announce the control as a link and include it in the links rotor, accurately reflecting that activation causes navigation. When `exitRole === "button"`, screen readers announce it as a button, accurately reflecting that activation opens a confirmation dialog. The role tracks actual runtime behaviour, satisfying WCAG 4.1.2.

---

## Additional Fixes in the Same Commit

This PR bundled several ADA fixes for the same navigation bar. While only the link-role issue is the primary 4.1.2 concern, the following are noted for the team file:

1. **Walmart logo `<SparkIcon>` replaced with `<Image>`** — `SparkIcon` rendered a decorative SVG without an `alt`; replaced with `<Image alt={m(messages, "walmartLogo")}>` so the logo has an accessible name. The `Button` wrapper that contains the logo was given `aria-label={walmartLogo + reviews}` and `role="link"` (it navigates to the reviews page).
2. **`<Heading>` on mobile nav promoted from `as="h2"` to `as="h1"`** — page-level heading correction.
3. **Dynamic `document.title`** — a `useEffect` updates `document.title` as the wizard step changes, using i18n keys for each step (`nameAndTaxInfo`, `confirmAndSign`, `letsGetStarted`).

---

## i18n Note

Four new message keys were added across all locale YAML files and `messages.tsx`:

| Key | en-US value | Purpose |
|---|---|---|
| `walmartLogo` | `"Walmart logo"` | Alt text for the Walmart logo `<Image>` and prefix in `aria-label` |
| `nameAndTaxInfo` | `"Name and tax info"` | Used in dynamic `document.title` for the identity step |
| `confirmAndSign` | `"Confirm and sign"` | Used in dynamic `document.title` for the profile step |
| `walmartWebsite` | `"Walmart.com"` | Site-name suffix in dynamic `document.title` |

Locales updated: `en-CA`, `en-US`, `es-CL`, `es-MX`, `es-US`, `fr-CA`.

The `walmartLogo` string is the most accessibility-sensitive: it is used as the `alt` prop on `<Image>` AND interpolated into the `Button`'s `aria-label` (`"Walmart logo, Reviews"`). Translators must keep the brand name `Walmart` intact — only `"logo"` and the conjunction should be translated per locale.

---

## Human Review Checklist

- [ ] Screen reader test (VoiceOver/Safari, NVDA/Chrome): at the start of the tax flow (no step active), tab to the exit control and confirm it announces as "link", not "button"
- [ ] Mid-flow (identity or profile step active): confirm exit control announces as "button" and activates the confirmation dialog on Enter/Space
- [ ] Confirm `role={exitRole}` is applied to BOTH mobile (`<Icon>`) and desktop (`<Button>`) branches
- [ ] Confirm `willShowExitModal` is included in the `useMemo` dependency array (it is — verified in diff line `+    willShowExitModal,`)
- [ ] Verify `walmartLogo` aria-label on the logo `<Button>` reads "Walmart logo, Reviews" in VoiceOver and the element announces as "link"
- [ ] Verify `document.title` changes at each wizard step with correct i18n strings (nameAndTaxInfo, confirmAndSign, letsGetStarted)
- [ ] Grep for similar patterns in `libs/reviewer-community/` — any other controls that switch between navigation and action based on state?

---

