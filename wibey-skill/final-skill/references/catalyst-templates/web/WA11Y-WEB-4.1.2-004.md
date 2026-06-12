# Catalyst Template: Role: Button Role is Missing (Button)

**Template ID:** `WA11Y-WEB-4.1.2-004`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem
An element intended to function as a button lacks the semantic &lt;button&gt; element tag announcement, affecting accessibility.

**Expected Result:** Developers should use the semantic &lt;button&gt; element to ensure proper behavior and accessibility. Or preferred the LD Button.
**Actual Result:** Buttons are implemented using non-semantic elements like &lt;div&gt; or &lt;span&gt; without appropriate roles.

---

## ✅ The Fix Patterns

> **Recommendation:** Replace the code with the actual HTML5 &lt;button&gt; element, or use the LD Button, or as a last resort code a custom role="button" and necessary keyboard interactions.

### Standard Implementation
```html
// Best: LD Button
        <Button>Add to cart</Button>
        
        // Good: Native HTML5 button
        <button>Results</button>
        
        // Last Resort: Must add JS click event handlers too for keyboard.
        <div role="button" tabindex="0">Add to Cart</div>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

---

# Ingestion Draft: PGSPHARM-51056 / PR #149879

**Ingested by:** Wibey Accessibility Swarm Agent
**Date:** 2026-03-23
**Classification:** EXISTING VARIATION — appended to `WA11Y-WEB-4.1.2-004`

---

## Metadata

| Field | Value |
|---|---|
| Jira | PGSPHARM-51056 |
| PR | #149879 |
| Commit | 366b2d61ab7ee9e222dd2511c9e89c459e2970d9 |
| Merge Commit | b7ff2e994f558206215ab6f0fb624bf57d181285 |
| Author | Chang Tong (Chang.Tong@walmart.com) — c0t09qg |
| WCAG Criterion | 4.1.2 Name, Role, Value — "Role: Button Role is Missing (Button)" |
| Template ID | WA11Y-WEB-4.1.2-004 |
| Domain | Pharmacy / Health |
| Team | Pharmacy (new domain — no existing team file) |
| Primary File | `libs/pharmacy/common/components/src/lib/ConsentModal/index.tsx` |
| Jira Prefix | PGSPHARM- → Pharmacy team |

---

## Template Routing Decision

**EXISTING VARIATION** — This fix is a direct, concrete instance of the pattern described in `WA11Y-WEB-4.1.2-004` ("Button Role is Missing — Button"). The template already states the core rule: interactive elements that trigger actions (not navigation) must use `<button>` semantics, not `<a>` / link elements.

This PR provides a real-world, production Pharmacy variation: a `@walmart-web/ui-link` component was used with `href=""` and `onClick` to render visually styled "secondary" action buttons inside a consent modal. Because `ui-link` renders as `<a role="link">`, screen readers announced these elements as "links" — but they performed modal dismissal actions, not page navigation. The fix swaps both occurrences to `<Button variant="tertiary">`.

**Proposed Variation ID:** Variation 1 under `WA11Y-WEB-4.1.2-004`

---

## Bad Code (before)

```tsx
// libs/pharmacy/common/components/src/lib/ConsentModal/index.tsx
// ❌ WCAG 4.1.2 VIOLATION: ui-link used for a dismiss/secondary action — announces as "link" to screen readers
// Both mobile (scrollable) and desktop (non-scrollable) CTA branches have the same pattern

import Link from "@walmart-web/ui-link";

// Mobile branch (scrollable consent) — secondary "close/cancel" CTA:
{closable && (
  <Link
    className="black mt3 mb3"
    href=""                                  // ❌ href="" with no navigation intent — pure action button
    onClick={() => handleSecondaryCTA(modalType)}
  >
    {secondaryButtonText}
  </Link>
)}

// Desktop branch (non-scrollable consent) — secondary CTA:
{closable && (
  <Link
    className={`black ${hasScrolledToBottom ? "ph5" : "pr5"}`}
    href=""                                  // ❌ same anti-pattern
    onClick={() => handleSecondaryCTA(modalType)}
  >
    {secondaryButtonText}
  </Link>
)}
```

**Root cause:** `@walmart-web/ui-link` renders as an `<a>` element. Its implicit ARIA role is `role="link"`. Screen readers (VoiceOver, NVDA, TalkBack) announce the element as a link and place it in the links list. Users navigating by links rotor/list are led to believe they will navigate somewhere — but the element actually performs a modal action (dismiss/cancel). There is no navigation intent. This violates WCAG 4.1.2: the role does not match the element's purpose.

---

## Good Code (after)

```tsx
// libs/pharmacy/common/components/src/lib/ConsentModal/index.tsx
// ✅ FIXED: ui-link removed; Button variant="tertiary" used for action-only secondary CTA

import Button from "@walmart-web/ui-button";
// Link import removed entirely

// Mobile branch (scrollable consent):
{closable && (
  <Button
    variant="tertiary"
    size="medium"
    className="black mt3 mb3"
    // href removed — no navigation, so no href
    onClick={() => handleSecondaryCTA(modalType)}
  >
    {secondaryButtonText}
  </Button>
)}

// Desktop branch (non-scrollable consent):
{closable && (
  <Button
    variant="tertiary"
    className={`black ${hasScrolledToBottom ? "ph5" : "pr5"}`}
    // href removed
    onClick={() => handleSecondaryCTA(modalType)}
  >
    {secondaryButtonText}
  </Button>
)}
```

**Why this works:** `@walmart-web/ui-button` renders as `<button>` with implicit `role="button"`. Screen readers announce it correctly as a button, place it in the buttons list (not the links list), and keyboard users can activate it with both Enter and Space (native button behavior). The visual styling difference between primary and tertiary variants is handled by the `variant` prop — no `href` is needed or appropriate.

---

## Explanation

This bug class is a **role-intent mismatch**: the developer reached for `ui-link` because it visually produces a styled, text-like CTA (common for "cancel" or "dismiss" secondary actions in modals). However, any element that:
1. Uses `href=""` (empty href — no real destination), and
2. Triggers a JS `onClick` action (modal close, state change, form submission)

...is semantically a **button**, not a link. The `<a>` element is for navigation to URLs or document fragments. When there is no navigation intent, using `<a>` / `ui-link` announces the wrong role to assistive technology users.

**The diagnostic signal:** `href=""` + `onClick` handler with no URL = button wearing link clothing.

The correct fix in this codebase is always `<Button variant="tertiary">` (or `variant="ghost"` for less prominent styling) from `@walmart-web/ui-button`. The `variant` prop controls visual weight; the semantic element (`<button>`) is always correct for action-only CTAs.

---

## Human Review Checklist

- [ ] Screen reader test (VoiceOver/Safari, NVDA/Chrome): Tab to the secondary CTA in ConsentModal — confirm it announces as "button" not "link"
- [ ] Verify `secondaryButtonText` string is not empty (accessible name must be non-empty for the button)
- [ ] Confirm keyboard behavior: Enter key AND Space key both trigger `handleSecondaryCTA` (native `<button>` provides this automatically)
- [ ] Check that the visual styling of `Button variant="tertiary"` matches the design spec for this secondary action (the `className` chain `"black mt3 mb3"` still applies for color/spacing)
- [ ] Audit the rest of `ConsentModal` and sibling Pharmacy modal components for any other `<Link href="">` patterns used as action buttons — this anti-pattern may recur in `EnrollTextNotificationsWrapper`, `insurance-redesign` components, or other pharmacy consent flows
- [ ] Grep across `libs/pharmacy/` for `href=""` with `onClick` on `Link` components:
  ```bash
  grep -rn 'href=""' libs/pharmacy/ --include="*.tsx" | grep -i "onClick\|on-click"
  ```
- [ ] Regression: confirm the `closable` conditional renders correctly for both mobile and desktop branches after the swap

---

## TEAMS_UPDATE

```
File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Health-Vision/pharmacy.md
Content:
# Team Architecture: Pharmacy — Accessibility Notes

**Domain Area:** Health-Vision / Pharmacy
**Jira Prefix Mapping:** PGSPHARM- → Pharmacy team (Health-Vision domain)
**Last Updated:** 2026-03-23

---

## Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Pharmacy common components root:** `libs/pharmacy/common/components/src/`
- **Pharmacy lib root:** `libs/pharmacy/`

### Key Component Paths

| Component | Path |
|---|---|
| ConsentModal | `libs/pharmacy/common/components/src/lib/ConsentModal/index.tsx` |

---

## Tech Stack & Constraints

- **Framework:** React (Next.js monorepo lib)
- **Design system:** `@walmart-web/ui-button`, `@walmart-web/ui-dialog`, `@walmart-web/ui-link` (WCP/ui-* components)
- **i18n:** `@walmart-web/platform-i18n` with `m(messages, key)` pattern
- **Responsive:** `useResponsiveView` from `@walmart-web/ui-utils` — components have mobile and desktop render branches

---

## Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-23] PGSPHARM-51056 — `ui-link` with `href=""` used as action button in ConsentModal (WCAG 4.1.2):**
  Two occurrences in `ConsentModal/index.tsx` (mobile and desktop branches) used `<Link href="" onClick={...}>` from `@walmart-web/ui-link` for a secondary CTA that dismisses the modal. Because `ui-link` renders as `<a role="link">`, screen readers announced it as a link. The correct element is `<Button variant="tertiary">` from `@walmart-web/ui-button`.

  **Diagnostic signal:** `href=""` + pure `onClick` action handler (no URL) = button wearing link clothing.

  ```tsx
  // ❌ WRONG — announces as "link" to screen readers; no navigation intent
  import Link from "@walmart-web/ui-link";
  <Link href="" onClick={() => handleSecondaryCTA(modalType)}>
    {secondaryButtonText}
  </Link>

  // ✅ CORRECT — announces as "button"; semantics match the action intent
  import Button from "@walmart-web/ui-button";
  <Button variant="tertiary" onClick={() => handleSecondaryCTA(modalType)}>
    {secondaryButtonText}
  </Button>
  ```

  **Audit tip:** Grep across all pharmacy components for this pattern:
  ```bash
  grep -rn 'href=""' libs/pharmacy/ --include="*.tsx" | grep onClick
  ```

  **See:** `WA11Y-WEB-4.1.2-004.md` Variation 1 · File: `libs/pharmacy/common/components/src/lib/ConsentModal/index.tsx`

---

## Additional ADA Notes from Commit b7ff2e994f55

The same merge commit (b7ff2e994f55) includes a related pharmacy ADA fix:
- **fix(pharmacy): WHRI/EHS | Error Message Not Announced by Screen Reader (#149776)**
  File: `libs/pharmacy/common/components/src/lib/EnrollTextNotificationsWrapper/enroll-dialog/add-edit-phone-number/index.tsx`
  Pattern: programmatic focus moved to error message container after error state is set, so screen reader users hear the error announcement without manual polling.
```

NEW_DOMAIN: true
Domain: Pharmacy
Jira prefix: PGSPHARM- → maps to Pharmacy team (Health-Vision domain umbrella)
```


---

# Ingestion Draft: CEPG-337572 / PR #161148

**Ingested by:** Wibey Accessibility Swarm Agent
**Date:** 2026-03-23
**Classification:** EXISTING VARIATION — appended to `WA11Y-WEB-4.1.2-004`

---

## Metadata

| Field | Value |
|---|---|
| Jira | CEPG-337572 |
| PR | #161148 |
| Commit | `abcea4cc3eb3` |
| Author | Sanket Gautam — s0g0map (Sanket.Gautam@walmart.com) |
| WCAG Criterion | 4.1.2 Name, Role, Value — "Role: Button Role is Missing (Button)" |
| Sub-criterion | Button Announcing as Link |
| Template ID | WA11Y-WEB-4.1.2-004 |
| Domain | Discovery / GComm Ideas |
| Team | GComm Content (new — see TEAMS_UPDATE) |
| Primary File | `libs/gcomm/ideas/src/lib/pages/recipe/components/RecipeDescription.tsx` |
| i18n Files | `libs/gcomm/ideas/src/lib/locale/messages.tsx` + all 6 locale YAMLs |

---

## Template Routing Decision

**EXISTING VARIATION** — This fix is a direct, concrete instance of the pattern described in
`WA11Y-WEB-4.1.2-004` ("Button Role is Missing — Button"). The template already states the
core rule: interactive elements that trigger in-page actions (not navigation) must use `<button>`
semantics, not `<a>` / link elements.

This PR provides a real-world GComm recipe page variation: a `@walmart-web/ui-link` component
(`Link`) was used with `href="#"` and `onClick` to render a "Read more" inline text expander
inside a recipe description. Because `ui-link` renders as `<a role="link">`, screen readers
announced this element as a "link" — but it performed a pure JS in-page state action (expanding
truncated description text), not navigation. The fix swaps it to `<Button variant="tertiary">`
from `@walmart-web/ui-button`.

A companion change in the same commit updates `alt` text and `VisuallyHidden` text for a partner
logo image (CEPG-337237 / separate sub-criterion), using a new i18n key `goToPartnerSiteText`
added to `messages.tsx` and all 6 locale YAML files. That companion fix is also documented below.

**Proposed Variation ID:** Variation 2 under `WA11Y-WEB-4.1.2-004`

---

## Variation 2 — `ui-link` with `href="#"` Used as In-Page Text Expander ("Read More"); Swapped to `Button variant="tertiary"` (GComm Recipe Description)

**Source:** CEPG-337572 / PR #161148 — `libs/gcomm/ideas/src/lib/pages/recipe/components/RecipeDescription.tsx`

**Context:**

The `RecipeDescription` component renders a recipe page in the GComm ideas library. When a
recipe's description is longer than the truncation threshold, the component renders a truncated
text block followed by a "Read more" inline CTA that expands the full text when clicked. This
CTA was implemented as a `<Link useLDLink href="#" onClick={readMoreLinkClick}>` — a link
component pointing to the page fragment root (`#`) with no navigation intent whatsoever.
Screen readers (VoiceOver, NVDA) announced this element as a link, placed it in the links
rotor/list, and users navigating by link list found a "Read more" item that appeared to be
a navigation affordance but instead only toggled visible text.

The fix:
1. Removes the `Link` import usage for this element.
2. Replaces it with `<Button variant="tertiary" className="black pa0">` from `@walmart-web/ui-button` (already imported in the file post-fix).
3. Removes `href="#"` and `useLDLink` props (irrelevant on a button).
4. Adds `className="pa0"` to zero out default button padding and preserve the inline text layout.

---

### Bad Code (❌)

```tsx
// libs/gcomm/ideas/src/lib/pages/recipe/components/RecipeDescription.tsx
// ❌ WCAG 4.1.2 VIOLATION: ui-link used for an in-page text-expand action.
// Announces as "link" to screen readers; appears in links rotor as a navigation item.
// href="#" has no real destination — this is a pure JS state toggle.

import Link from "@walmart-web/ui-link";
// (Button not yet imported at component level)

<span className="f6 lh-copy">
  {truncatedDescription}
  {" ..."}
  <Link
    useLDLink
    onClick={readMoreLinkClick}
    className="black"
    data-testid="showmore-link-element"
    data-dca-id="L:6EEE548541"
    href="#"        // ❌ fragment href with no navigation intent
  >
    {m(messages, "readMore")}
  </Link>
</span>
```

---

### Good Code (✅)

```tsx
// libs/gcomm/ideas/src/lib/pages/recipe/components/RecipeDescription.tsx
// ✅ FIXED: Button variant="tertiary" for action-only CTA.
// Screen reader announces: "Read more, button" — correct role, correct semantics.
// Keyboard: Enter AND Space both fire readMoreLinkClick (native button behavior).

import Button from "@walmart-web/ui-button";
// Link import retained for other uses in the file, but removed from this element

<span className="f6 lh-copy">
  {truncatedDescription}
  {" ..."}
  <Button
    onClick={readMoreLinkClick}
    className="black pa0"          // pa0 zeroes button padding to match inline text layout
    data-testid="showmore-link-element"
    data-dca-id="L:6EEE548541"
    variant="tertiary"             // ✅ visual weight: text-like; semantics: button
  >
    {m(messages, "readMore")}
  </Button>
</span>
```

---

### Why It Works

`@walmart-web/ui-button` renders as a native `<button>` element with implicit `role="button"`.
Screen readers correctly announce it as a button (not a link), it is excluded from the links
rotor, and both Enter and Space activate it via native keyboard semantics. The `variant="tertiary"`
prop gives it the same low-visual-weight appearance as the removed link — `pa0` removes the
default button padding so it sits flush in the inline text context.

**The diagnostic signal** for this class of bug: `href="#"` + `onClick` handler with no URL or
fragment that resolves to meaningful in-page content = button wearing link clothing.

---

### Companion Fix — Partner Logo `alt` / `VisuallyHidden` Text Updated (CEPG-337237)

The same commit also corrected a non-descriptive image alt text and `VisuallyHidden` label on
the partner logo link. These changes are independent of the button-role fix but are logged here
for completeness:

```tsx
// ❌ BEFORE — generic "logoText" key resolved to a non-descriptive string
alt={m(messages, "logoText")}
// VisuallyHidden also used logoText

// ✅ AFTER — new "goToPartnerSiteText" key: "Go to partner site"
alt={m(messages, "goToPartnerSiteText")}
// VisuallyHidden also updated to goToPartnerSiteText
```

**i18n changes (all 6 locales + messages.tsx):**

```ts
// libs/gcomm/ideas/src/lib/locale/messages.tsx — new export added
export const goToPartnerSiteText = () => "Go to partner site";
```

```yaml
# libs/gcomm/ideas/src/lib/locale/en-US.yaml — new entry added
goToPartnerSiteText: "Go to partner site"
# (Same key added to en-CA, es-CL, es-MX, es-US, fr-CA)
```

**i18n note:** The `m()` wrapper from `@walmart-web/platform-i18n` ensures `goToPartnerSiteText`
is routed through the Walmart translation pipeline (Anuvad). Commit correlation ID:
`anuvad-68d328b7026e244c7ba87abd` (auto-generated in PR #161238). All 6 locale YAMLs
(`en-US`, `en-CA`, `es-CL`, `es-MX`, `es-US`, `fr-CA`) received the new key in this PR.

---

### Human Review Checklist

- [ ] Screen reader test (VoiceOver+Safari, NVDA+Chrome): navigate to a recipe page with a
      truncated description; confirm the "Read more" element announces as "button" — not "link"
- [ ] Links rotor / list: verify "Read more" is absent from the links list and present in the
      buttons list
- [ ] Keyboard test: Tab to "Read more" button; confirm both Enter and Space expand the description
- [ ] Visual regression: confirm `className="black pa0"` + `variant="tertiary"` renders the
      button flush with the inline text (no extra padding, no underline difference vs. prior Link)
- [ ] Partner logo alt text: screen reader on a recipe with a partner logo should announce
      "Go to partner site" (or locale-translated equivalent) — not a generic or empty string
- [ ] i18n coverage: verify `goToPartnerSiteText` key is present in all 6 locale YAML files
      (en-US, en-CA, es-US, es-MX, es-CL, fr-CA) — confirmed in this commit diff
- [ ] Confirm Anuvad translation correlation ID `anuvad-68d328b7026e244c7ba87abd` was processed;
      verify es-MX and es-CL translated strings are populated post-merge
- [ ] Regression test (`RecipeDescription.spec.tsx`): assert the `data-testid="showmore-link-element"`
      target now renders as a `<button>` element (or has `role="button"`), not `<a>`
- [ ] Audit `libs/gcomm/ideas/` for other `<Link href="#">` patterns used as action buttons —
      recipe pages may have similar CTAs (bookmark, share, rating) that use the same anti-pattern
- [ ] Check `libs/tempo-shared-modules/pov-n-up/src/lib/pov-n-up.tsx` (1 line removed in this
      commit per the stat) — confirm that change is unrelated to the a11y fix or document if not

---



---

# Ingestion Draft: CEPG-330761 / PR #156900

**Ingested by:** Wibey Accessibility Swarm Agent
**Date:** 2026-03-23
**Classification:** EXISTING VARIATION — appended to `WA11Y-WEB-4.1.2-004`

---

## Metadata

| Field | Value |
|---|---|
| Jira | CEPG-330761 |
| PR | #156900 |
| Commit | cb76bdf2723e |
| Author | Vipin Dev S (Vipin.Dev.S@walmart.com) |
| WCAG Criterion | 4.1.2 Name, Role, Value — "Role: Link Role is Missing" |
| Sub-criterion Label | Link Role is Missing |
| Template ID | WA11Y-WEB-4.1.2-004 |
| Domain | Transaction / Checkout (Thankyou page) |
| Team | Transaction / Payments-Checkout |
| Primary File | `libs/checkout/thankyou/src/lib/thankyou-banner/thankyou-generic-banner.tsx` |
| Jira Prefix | CEPG- → Transaction / Checkout domain (confirmed by `libs/checkout/` path) |

---

## Template Routing Decision

**EXISTING VARIATION** — This fix is the **inverse direction** of the existing Variation 1 in `WA11Y-WEB-4.1.2-004`. Where Variation 1 (PGSPHARM-51056) fixed a `ui-link` used as an action-only button (wrong role: link→button), this ticket fixes a `<Button>` used as a navigation CTA (wrong role: button→link). Both are role-intent mismatches under WCAG 4.1.2.

The template already captures the core principle: the element's semantic role must match its purpose. This variation extends the template with the complementary case — a `<Button>` with an `onClick` navigation handler instead of an `href` prop — and demonstrates that `@walmart-web/ui-button` correctly renders as `<a role="link">` when an `href` prop is supplied, without needing to swap to a separate `ui-link` import.

**Proposed Variation ID:** Variation 3 under `WA11Y-WEB-4.1.2-004`

---

## Component / File Context

**File:** `libs/checkout/thankyou/src/lib/thankyou-banner/thankyou-generic-banner.tsx`

This is the generic CTA banner displayed on the post-checkout "Thank You" page. It presents a `<Button>` whose purpose is to redirect the user to a URL (e.g. "Continue Shopping", "View Order"). Because the element's intent is navigation to a URL, it must carry `role="link"` semantics — not `role="button"`.

---

## Bad Pattern (❌)

```tsx
// libs/checkout/thankyou/src/lib/thankyou-banner/thankyou-generic-banner.tsx

// ❌ WCAG 4.1.2 VIOLATION: Button with onClick used for URL navigation
// Screen readers announce this as "button"; pressing Space activates it.
// A navigation CTA must announce as "link"; AT users expect Enter to navigate, not Space.

<Button
  className="mt2"
  onClick={redirectToUrl}          // ❌ onClick handler that performs navigation
  size={buttonSize || "small"}
  variant={buttonVariant || "secondary"}
  onLinkExtras={onClickBeaconPayload}
>
  {ctaText}
</Button>
```

**Root cause:** `@walmart-web/ui-button` without an `href` prop renders as `<button role="button">`. When the developer's intent is to navigate to a URL, the correct pattern is to supply `href` directly to `<Button>` — the component automatically renders as `<a role="link">` when `href` is present. Using `onClick` for navigation means screen readers announce "button", users expect Space-key activation, and the element never appears in the AT links list for navigation-based browsing.

**Diagnostic signal:** `<Button onClick={redirectToUrl}>` where `redirectToUrl` is a function that calls `router.push(url)` or `window.location = url` — navigation intent with button semantics = WCAG 4.1.2 violation.

---

## Good Pattern (✅)

```tsx
// libs/checkout/thankyou/src/lib/thankyou-banner/thankyou-generic-banner.tsx

// ✅ FIXED: href prop supplied → @walmart-web/ui-button renders as <a role="link">
// Screen readers announce as "link"; Enter key navigates; appears in links rotor.

<Button
  className="mt2"
  href={redirectUrl ?? ""}         // ✅ href prop → renders as <a>, role="link"
  size={buttonSize || "small"}
  variant={buttonVariant || "secondary"}
  onLinkExtras={onClickBeaconPayload}
>
  {ctaText}
</Button>
```

**Why this works:** `@walmart-web/ui-button` is a polymorphic component — when `href` is provided, it renders its root element as `<a href="...">` (implicit `role="link"`). The visual styling (variant, size, className) is preserved unchanged. Screen readers correctly announce the element as a link, Enter key activates navigation, and the element is discoverable via the AT links list. No import change is required — the same `Button` import renders as either `<button>` or `<a>` depending on whether `href` is supplied.

**The null-coalescing fallback `?? ""`:** If `redirectUrl` is `undefined` or `null` at runtime (e.g. CMS data not yet loaded), `href=""` renders a non-navigating anchor. Prefer a conditional render `{redirectUrl && <Button href={redirectUrl}>}` in production to avoid empty href anchors.

---

## Why It Works (Summary)

`@walmart-web/ui-button` is a polymorphic WCP component: supplying `href` switches the rendered root element from `<button>` to `<a>`, giving the CTA the correct `role="link"` semantics without any additional import or role override. The rule is: if the CTA navigates to a URL, use `href`; if it performs an in-page action, use `onClick` with no `href`.

---

## Human Review Checklist

- [ ] Screen reader test (VoiceOver/Safari, NVDA/Chrome): Tab to the CTA button on the Thank You page — confirm it announces as "link" not "button"
- [ ] Confirm Enter key navigates to `redirectUrl`; confirm Space key does NOT navigate (link-role behavior)
- [ ] Verify `redirectUrl` is always defined when the banner renders — consider adding a guard: `{redirectUrl && <Button href={redirectUrl} ...>}`  to prevent `href=""` edge case
- [ ] Grep across `libs/checkout/thankyou/` for other `<Button onClick={redirect...}>` patterns that may also be navigation CTAs:
  ```bash
  grep -rn 'onClick={redirect' libs/checkout/thankyou/ --include="*.tsx"
  ```
- [ ] Confirm `onLinkExtras` beacon fires correctly when rendered as `<a>` (analytics integration)
- [ ] Regression: verify the button's visual styling (variant="secondary", size="small") is unchanged after the swap

---

