# Catalyst Template: Name: Generic or Non-Descriptive Accessible Name (Vague)

**Template ID:** `WA11Y-WEB-4.1.2-002`
**Platform:** Web
**WCAG Criterion:** WCAG-4.1.2

---

## 🛑 The Problem
The accessible name is too generic or vague, failing to convey meaningful information about the element’s purpose.

**Expected Result:** Screen reader output should be specific and descriptive, clearly indicating the element’s function.
**Actual Result:** Elements use generic names like 'Click Here' or 'Learn More'.

---

## ✅ The Fix Patterns

> **Recommendation:** Use specific and descriptive accessible names that convey the purpose or action of the element. Add more context.

### Standard Implementation
```html
// Best: Visible Text
        <button>Learn more about Walmart Plus</button>
        
        // Good: aria-label
        <button aria-label="Learn more about Walmart Plus">Learn More</button>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

---

## Metadata

| Field | Value |
|---|---|
| Jira | CEPG-366918 |
| PR | #180582 |
| Commit | 7c7a512224376d9b2cf47e5eb77a66f8930f02fa |
| Author | Nitish Hardeniya (Nitish.Hardeniya@walmart.com); co-author Gunjan Gidwani (Gunjan.Gidwani@walmart.com) |
| WCAG | 4.1.2 Name, Role, Value — Generic or Non-Descriptive Accessible Name (Vague) |
| Template ID | WA11Y-WEB-4.1.2-002 (existing variation) |
| Domain | Transaction — Payments (CEPG) |
| Team | Transaction / Payments Checkout |
| Primary File | libs/payments/one-bnpl/src/lib/apply-now-oneloans.tsx |

---

## Template Routing Decision

**EXISTING VARIATION** of WA11Y-WEB-4.1.2-002 — Generic or Non-Descriptive Accessible Name (Vague).

The fix is a textbook instance of this template: aria-label values on Apply now CTA buttons in a BNPL
(Buy Now Pay Later) payment component were stale and referenced the old product brand (OnePay Loans)
after the product was renamed to OnePay Later. Screen readers announced the old product name, giving
users a misleading accessible name that did not match the visible UI or current product branding.
The fix introduces product-name-accurate locale keys threaded through CCM feature flags to support
both old and new brand variants in parallel.

A second change in libs/cart/affirm-container/src/lib/oneloans-message.tsx corrects the same class
of problem on a Learn more link: the old learnMoreAria key resolved to Learn more about OnePay loans
(stale product name) while the new learnMoreOnePayLaterAria key resolves to Learn more about OnePay Later.

---

## Variation Detail

### Variation N — Stale Product-Brand Name in aria-label After Product Rename (BNPL Payment CTA)

**Source:** CEPG-366918 / PR #180582 — commit 7c7a51222437

**Files changed:**
- libs/payments/one-bnpl/src/lib/apply-now-oneloans.tsx (primary — CTA button aria-label)
- libs/cart/affirm-container/src/lib/oneloans-message.tsx (Learn more link aria label via helper)
- libs/cart/modal-container/src/lib/one-eligible-items-modal.tsx (warning title and span text)
- libs/payments/one-bnpl/src/locale/en-US.yaml + messages.ts (new applyNowForOneLater key)
- libs/cart/affirm-container/src/lib/locale/en-US.yaml + messages.tsx (new learnMoreOnePayLaterAria key)
- All 5 additional locale YAML files (en-CA, es-CL, es-MX, es-US, fr-CA) for both libs

**Context:** The OnePay BNPL product was renamed from OnePay Loans to OnePay Later as part of a
branding initiative (Apple Trade-Up / Klarna redesign). Existing aria-label values still referenced
OnePay loans — the old product name — while visible UI already showed OnePay Later. Screen readers
announced the old brand name, creating a mismatch between the accessible name and visible label
(also a WCAG 2.5.3 Label in Name concern). The CCM flags enableOnePayLaterKlarnaRedesign and
enableOnePayLaterAppleTradeIn gate the new brand label, requiring conditional label resolution.

---

### Bad Code

**CTA Button — apply-now-oneloans.tsx (MobileLayout and DesktopLayout, identical pattern):**

```tsx
// BAD: aria-label uses stale OnePay loans product name.
// Screen readers announce Apply now for OnePay loans even when the UI shows OnePay Later.
aria-label={
  enableOneLoansRedesign
    ? m(messages, "applyNowForOnePayLoans")   // resolves to: Apply now for OnePay loans
    : m(messages, "applyNowForOneLoans")      // resolves to: Apply now for One loans (even older brand)
}
```

**Learn more link — oneloans-message.tsx (via getActionLabelInfo helper):**

```tsx
// BAD: learnMoreAria always resolves to Learn more about OnePay loans.
// Flags enableOnePayLaterAppleTradeIn and enableOnePayLaterKlarnaRedesign are not consulted.
return {
  label: m(messages, "learnMore"),
  aria: m(messages, "learnMoreAria"),  // always: Learn more about OnePay loans
};
```

**Warning alert title — one-eligible-items-modal.tsx:**

```tsx
// BAD: WcpAlert title always uses old oneLoansTwoEligibleItemsWarning key,
// regardless of whether new OnePay Later branding flags are active.
<WcpAlert
  title={m(messages, "oneLoansTwoEligibleItemsWarning")}
  variant="warning"
  role="alert"
>
  <span>{m(messages, "oneLoansTwoEligibleItemsWarning")}</span>
</WcpAlert>
```

---

### Good Code

**CTA Button — apply-now-oneloans.tsx (MobileLayout and DesktopLayout, identical pattern):**

```tsx
// GOOD: aria-label consults the current branding flag (enableOnePayLaterKlarnaRedesign).
// Flag on  -> Apply now for OnePay Later (current brand).
// Flag off -> Apply now for OnePay loans (legacy fallback).
// New locale key applyNowForOneLater added to en-US.yaml and messages.ts.
aria-label={
  enableOnePayLaterKlarnaRedesign
    ? m(messages, "applyNowForOneLater")      // Apply now for OnePay Later
    : m(messages, "applyNowForOnePayLoans")   // Apply now for OnePay loans (legacy)
}
```

**Learn more link — oneloans-message.tsx (updated getActionLabelInfo helper):**

```tsx
// GOOD: helper now accepts both new brand flags and conditionally resolves the correct key.
// learnMoreOnePayLaterAria -> Learn more about OnePay later (correct current brand).
const getActionLabelInfo = (
  isMixedPromotionCart: boolean,
  enableOnePlZero: boolean,
  enableOneLoansRedesign: boolean,
  enableOnePayLaterAppleTradeIn: boolean,   // new param
  enableOnePayLaterKlarnaRedesign: boolean  // new param
) => {
  // ... mixed-cart branch unchanged ...
  return {
    label: m(messages, "learnMore"),
    aria: m(
      messages,
      enableOnePayLaterAppleTradeIn || enableOnePayLaterKlarnaRedesign
        ? "learnMoreOnePayLaterAria"   // Learn more about OnePay later
        : "learnMoreAria"             // Learn more about OnePay loans (legacy)
    ),
  };
};
```

**Warning alert title — one-eligible-items-modal.tsx:**

```tsx
// GOOD: WcpAlert title and span text both consult the new brand flags.
<WcpAlert
  title={m(
    messages,
    enableOnePayLaterAppleTradeIn || enableOnePayLaterKlarnaRedesign
      ? "onePayLaterTwoEligibleItemsWarning"
      : "oneLoansTwoEligibleItemsWarning"
  )}
  variant="warning"
  role="alert"
>
  <span>
    {m(
      messages,
      enableOnePayLaterAppleTradeIn || enableOnePayLaterKlarnaRedesign
        ? "onePayLaterTwoEligibleItemsWarning"
        : "oneLoansTwoEligibleItemsWarning"
    )}
  </span>
</WcpAlert>
```

**New locale keys (en-US shown; 6 locales total updated):**

```yaml
# libs/payments/one-bnpl/src/locale/en-US.yaml
applyNowForOneLater: "Apply now for OnePay Later"

# libs/cart/affirm-container/src/lib/locale/en-US.yaml
learnMoreOnePayLaterAria: "Learn more about OnePay later"
```

```ts
// libs/payments/one-bnpl/src/locale/messages.ts
export const applyNowForOneLater = () => "Apply now for OnePay Later";

// libs/cart/affirm-container/src/lib/locale/messages.tsx
export const learnMoreOnePayLaterAria = () => "Learn more about OnePay later";
```

---

### Explanation

When a product is rebranded, any hardcoded aria-label or locale-key-resolved accessible name that
references the old brand name becomes a stale/vague label — it no longer matches the visible text
or product identity that sighted users see. Screen readers announce the old name, creating a
mismatch and constituting a WCAG 2.5.3 (Label in Name) risk when the accessible name no longer
contains the visible label text.

The fix introduces a new locale key per renamed brand string and gates the selection behind the
same CCM feature flags (enableOnePayLaterKlarnaRedesign, enableOnePayLaterAppleTradeIn) already
controlling the visual redesign. This ensures:
1. The aria-label always matches the currently visible product name.
2. Legacy environments (flag off) continue to receive the old label — backward compatible.
3. All 6 supported locales receive the translated new key, preventing English fallback in
   non-English experiences.

**Architectural rule:** When a product name changes under a CCM/feature flag, add a NEW locale key
for the renamed label in ALL locale YAML files (do not overwrite the old key — it is the legacy
fallback). Apply the same flag-conditional pattern to every ARIA surface in the same PR: CTA
buttons, Learn more links, alert titles, modal headers — anywhere the old brand string appears
in ARIA attributes.

**Root cause class:** Product rename / rebranding not propagated to aria-label locale keys —
accessible name becomes stale and vague relative to current visible UI.

---

### Human Review Checklist

- [ ] Screen reader test (VoiceOver + Safari, NVDA + Chrome): with enableOnePayLaterKlarnaRedesign=true,
      Apply now button announces Apply now for OnePay Later — not Apply now for OnePay loans
- [ ] Screen reader test: with flag off (legacy), button announces Apply now for OnePay loans —
      correct legacy fallback
- [ ] Screen reader test: Learn more link in affirm-container announces Learn more about OnePay later
      when either enableOnePayLaterAppleTradeIn or enableOnePayLaterKlarnaRedesign is active
- [ ] Verify all 6 locale YAML files updated for both one-bnpl and affirm-container
      (en-CA, en-US, es-CL, es-MX, es-US, fr-CA)
- [ ] Confirm messages.ts export applyNowForOneLater matches the YAML key exactly
- [ ] Confirm messages.tsx export learnMoreOnePayLaterAria matches the YAML key exactly
- [ ] Check one-eligible-items-modal.tsx: WcpAlert title prop and inner span text must resolve to
      the same message key (mismatching causes a double-announcement discrepancy for screen readers)
- [ ] Verify more-ways-to-pay.tsx (also changed in this commit) does not introduce new stale
      aria-label patterns for the OnePay CC dollar savings variant
- [ ] Confirm unit tests in apply-now-one-loans.spec.tsx cover both flag states:
      enableOnePayLaterKlarnaRedesign=true asserts aria-label=Apply now for OnePay Later,
      and =false asserts Apply now for OnePay loans
- [ ] Confirm unit tests in oneloans-message.spec.tsx cover learnMoreOnePayLaterAria for both
      enableOnePayLaterAppleTradeIn and enableOnePayLaterKlarnaRedesign flag combinations

---

## TEAMS_UPDATE

File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Transaction/payments-checkout.md

Content: Append the following to the Known Accessibility Pitfalls section:

  [2026-03-13] CEPG-366918 — Stale BNPL Product-Brand Name in aria-label After Product Rename (WCAG 4.1.2):
  When the OnePay product is rebranded (OnePay Loans -> OnePay Later), every aria-label and
  locale-key-resolved accessible name referencing the old brand must be updated. Pattern from PR #180582:
  add a NEW locale key for the renamed product (do not overwrite the old key — it is needed for legacy
  flag-off fallback), then conditionally resolve it behind the same CCM flags
  (enableOnePayLaterKlarnaRedesign, enableOnePayLaterAppleTradeIn) that gate the visual rename.
  Apply to ALL ARIA surfaces in the same PR: CTA buttons, Learn more links, WcpAlert title and body
  text, any modal header referencing the product name. Missing even one surface leaves a stale
  accessible name that mismatches the visible label (WCAG 2.5.3 risk).

  Code pattern (apply-now-oneloans.tsx, MobileLayout + DesktopLayout):

    // BAD: stale brand name, flag not consulted
    aria-label={m(messages, "applyNowForOnePayLoans")}  // Apply now for OnePay loans post-rename

    // GOOD: flag-conditional brand-accurate label
    aria-label={
      enableOnePayLaterKlarnaRedesign
        ? m(messages, "applyNowForOneLater")     // Apply now for OnePay Later (current brand)
        : m(messages, "applyNowForOnePayLoans")  // Apply now for OnePay loans (legacy fallback)
    }

  Locale files requiring new keys in all 6 YAML files + TS exports:
    - libs/payments/one-bnpl/src/locale/
    - libs/cart/affirm-container/src/lib/locale/

  Primary files:
    - libs/payments/one-bnpl/src/lib/apply-now-oneloans.tsx
    - libs/cart/affirm-container/src/lib/oneloans-message.tsx
    - libs/cart/modal-container/src/lib/one-eligible-items-modal.tsx

  See WA11Y-WEB-4.1.2-002.md Variation N for the full code pattern and checklist.

---

---

## Metadata

| Field | Value |
|---|---|
| Jira | CEPG-344607 |
| PR | #166541 |
| Commit | 7d77e8f6b6b3105aed605de5497b9fe6302c0806 |
| Author | vn59mld (vn59mld@homeoffice.wal-mart.com) |
| WCAG Criterion | 4.1.2 Name, Role, Value — Generic or Non-Descriptive Accessible Name (Vague) |
| Template ID | WA11Y-WEB-4.1.2-002 |
| Domain | Accounts |
| Team | Protection Plans |
| Primary File | libs/account/protection-plans-page/src/lib/protection-plans-new-hub-item.tsx |
| Supporting Files | libs/account/protection-plans-page/src/lib/protection-plans-pyp-item.tsx, libs/account/protection-plans-page/src/lib/protection-plans-new-header.tsx |

---

## Template Routing Decision

**EXISTING VARIATION** — Route to `WA11Y-WEB-4.1.2-002`

The fix pattern is a clean application of the 4.1.2-002 "vague accessible name" pattern, applied in three distinct locations across the Protection Plans page. All three changes follow the same root cause: static, context-free label strings (e.g., `"planDetails"`, `"viewAll"`) were being passed as `aria-label` values, causing screen readers to announce elements without any reference to *which plan* or *which section* is being acted on. The fix in each case injects a dynamic, context-bearing interpolated string (e.g., `"Plan details for {planTitle}"`, `"View All {headerTitle}"`) sourced from locale-backed `messages.ts` helper functions.

This is a variation on the template's standard `aria-label` enrichment pattern, distinguished by:
1. Multi-location fix within a single commit (three components, three controls)
2. The use of a monorepo i18n helper `m(messages, "key", { param })` for ARIA label composition — not a raw string
3. One fix (`protection-plans-pyp-item.tsx`) is a companion `aria-hidden` removal on a decorative shield icon, which restores it to the AT tree with a descriptive `alt`

---

## The Fix in Detail

### Location 1 — Plan Details Button (`protection-plans-new-hub-item.tsx`)

The tertiary "chevron" button that opens a plan's detail dialog had `aria-label={m(messages, "planDetails")}`. This announced as the static string "Plan details" with no reference to which plan. On a page listing multiple protection plans, all such buttons were identical to a screen reader.

#### Bad Code

```tsx
// ❌ BAD — aria-label is static; every plan detail button announces identically as "Plan details"
// Screen reader: "Plan details, button" — no context for which plan
const ProtectionPlansHubItem: React.FC<ProtectionPlansHubItemProps> = ({ protectionPlan, ... }) => {
  // planTitle not extracted at component level

  return (
    // ...
    <Button
      onClick={onClickPlanDetails}
      variant="tertiary"
      UNSAFE_className="no-underline"
      aria-label={m(messages, "planDetails")}
      data-dca-id="B:48342E4C7F"
    />
  );
};
```

#### Good Code

```tsx
// ✅ GOOD — aria-label interpolates the plan title for unique, descriptive announcement
// Screen reader: "Plan details for 2-Year Protection Plan, button"
const ProtectionPlansHubItem: React.FC<ProtectionPlansHubItemProps> = ({ protectionPlan, ... }) => {
  const planTitle = plan.title;  // extract plan title for use in aria-label

  return (
    // ...
    <Button
      onClick={onClickPlanDetails}
      variant="tertiary"
      UNSAFE_className="no-underline"
      aria-label={m(messages, "chevromAlt", { planTitle })}
      data-dca-id="B:48342E4C7F"
    />
  );
};

// locale/en-US.yaml addition:
// chevromAlt: "Plan details for {planTitle}"

// locale/messages.ts addition:
// export const chevromAlt = (_: { planTitle?: string }) => `Plan details for ${_.planTitle}`;
```

---

### Location 2 — "View All" Link (`protection-plans-new-header.tsx`)

The header "View All" link used `aria-label={m(messages, "viewAll")}`, which resolves to the static string "View All". This is a classic vague name — screen reader users navigating by links or buttons have no context for *what* they will view all of.

#### Bad Code

```tsx
// ❌ BAD — "View All" with no context; screen reader: "View All, button"
<Button
  onLinkName={m(messages, "viewAll")}
  variant="secondary"
  data-automation-id={m(messages, "viewAll")}
  aria-label={m(messages, "viewAll")}
  UNSAFE_className="db-m dn"
  onClick={...}
/>
```

#### Good Code

```tsx
// ✅ GOOD — headerTitle is injected; screen reader: "View All My Plans, button"
<Button
  onLinkName={m(messages, "viewAll")}
  variant="secondary"
  data-automation-id={m(messages, "viewAll")}
  aria-label={m(messages, "viewAllAlt", { headerTitle })}
  UNSAFE_className="db-m dn"
  onClick={...}
/>

// locale/en-US.yaml addition:
// viewAllAlt: "View All {headerTitle}"

// locale/messages.ts addition:
// export const viewAllAlt = (_: { headerTitle?: string }) => `View All ${_.headerTitle}`;
```

---

### Location 3 — Shield Icon Image (`protection-plans-pyp-item.tsx`)

The Walmart Protection Plan shield icon was marked `aria-hidden` with `alt=""`. The commit message explicitly calls this out: "removed aria-hidden to make the image available for screen readers." This is a companion name fix — the image was silently hidden, denying AT users the context that a protection plan is in a "Protected" state.

#### Bad Code

```tsx
// ❌ BAD — aria-hidden removes the shield icon from AT entirely; no "Protected" context announced
<Image
  aria-hidden
  className="mr2-m mr1"
  preload={false}
  data-testid="protection-plan-item-wpp-icon"
  alt=""
  src="https://i5.walmartimages.com/dfw/.../wpp-shield-v2.svg"
  width={shieldIconWidth}
  height={shieldIconHeight}
/>
```

#### Good Code

```tsx
// ✅ GOOD — aria-hidden removed; alt="Protected" gives the shield icon a meaningful name
// Screen reader: "Protected, image" — reinforces that this item has an active protection plan
<Image
  className="mr2-m mr1"
  preload={false}
  data-testid="protection-plan-item-wpp-icon"
  alt={m(messages, "shieldAlt")}
  src="https://i5.walmartimages.com/dfw/.../wpp-shield-v2.svg"
  width={shieldIconWidth}
  height={shieldIconHeight}
/>

// locale/en-US.yaml addition:
// shieldAlt: "Protected"

// locale/messages.ts addition:
// export const shieldAlt = () => "Protected";
```

---

## Explanation

All three fixes share the same root cause: accessible names were static, context-free strings that failed to distinguish the element's specific purpose when multiple identical controls were present on the same page. The WCAG 4.1.2 requirement is that every interactive element must have a name that is both present and *meaningful* — and "Plan details" or "View All" with no referent fails that bar.

The fix pattern in this codebase is i18n-driven interpolation via the `m(messages, "key", { param })` helper. New locale keys are added to `en-US.yaml` (and all locale equivalents: `en-CA.yaml`, `es-US.yaml`, `es-MX.yaml`, `es-CL.yaml`, `fr-CA.yaml`) and a corresponding typed function is added to `messages.ts`. This is the correct pattern for this monorepo — raw string concatenation in JSX is not appropriate because it bypasses the translation pipeline.

The shield icon fix (`protection-plans-pyp-item.tsx`) is a separate sub-pattern: `aria-hidden` was incorrectly applied to a semantically meaningful image (it conveys protection status), suppressing it from AT entirely. Removing `aria-hidden` and providing `alt={m(messages, "shieldAlt")}` restores the image to the AT tree with a concise, accurate name.

---

## Human Review Checklist

- [ ] Screen reader test (NVDA+Chrome or VoiceOver+Safari): navigate to the Protection Plans hub page, verify each plan's detail button announces "Plan details for [plan name]" — not a generic "Plan details"
- [ ] Screen reader test: confirm the "View All" header button announces "View All [section title]" (e.g., "View All My Plans")
- [ ] Screen reader test: confirm the shield icon in PYP items announces "Protected" — not silently skipped
- [ ] Verify all locale files received the new keys: `en-US.yaml`, `en-CA.yaml`, `es-US.yaml`, `es-MX.yaml`, `es-CL.yaml`, `fr-CA.yaml` — translations may be pending from the `anuvad` translation service (commit contains a translation correlation ID)
- [ ] Verify `messages.ts` typed functions use optional chaining or guard for the parameter (`planTitle?: string`) to avoid "Plan details for undefined" regressions if the prop is ever undefined
- [ ] Check: does `protection-plans-pyp-item.tsx` also have a plan-level detail button similar to the hub item? If yes, ensure its `aria-label` received the same planTitle interpolation treatment
- [ ] Confirm `data-automation-id` values that still reference `m(messages, "viewAll")` (not `"viewAllAlt"`) are intentional — automation IDs are distinct from ARIA labels and do not need to be descriptive

---

## TEAMS_UPDATE

File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Accounts/protection-plans.md
Content:
- **[2026-03-23] CEPG-344607 — Three vague aria-label fixes across Protection Plans hub, PYP, and header (WCAG 4.1.2):**
  `protection-plans-new-hub-item.tsx`, `protection-plans-pyp-item.tsx`, and `protection-plans-new-header.tsx` all had static, context-free `aria-label` strings on interactive controls. On a page with multiple protection plan cards, every plan detail button announced identically ("Plan details") and the header link announced "View All" with no section context.

  **Fix pattern (all three files):** Add a new locale key with a parameter placeholder to `en-US.yaml` (and all 5 other locale files), add a typed interpolation function to `messages.ts`, then pass the dynamic context value via `m(messages, "newKey", { param })`.

  ```tsx
  // ❌ WRONG — static aria-label; identical across all plan cards
  aria-label={m(messages, "planDetails")}

  // ✅ CORRECT — interpolated with plan.title for unique, descriptive announcement
  const planTitle = plan.title;
  aria-label={m(messages, "chevromAlt", { planTitle })}
  // en-US.yaml: chevromAlt: "Plan details for {planTitle}"
  // messages.ts: export const chevromAlt = (_: { planTitle?: string }) => `Plan details for ${_.planTitle}`;

  // ❌ WRONG — "View All" with no section context
  aria-label={m(messages, "viewAll")}

  // ✅ CORRECT — interpolated with headerTitle
  aria-label={m(messages, "viewAllAlt", { headerTitle })}
  // en-US.yaml: viewAllAlt: "View All {headerTitle}"
  ```

  **Companion fix — shield icon in `protection-plans-pyp-item.tsx`:** The WPP shield icon (`wpp-shield-v2.svg`) was marked `aria-hidden` with `alt=""`. This suppressed the "Protected" status signal from AT entirely. Fix: remove `aria-hidden`, set `alt={m(messages, "shieldAlt")}` ("Protected").

  **Architectural rule for this codebase:** ARIA label strings for Protection Plans components MUST go through the `m(messages, "key", { param })` i18n pipeline — never raw string literals or template literals in JSX. This ensures all locale variants (en-CA, es-US, es-MX, es-CL, fr-CA) receive translations automatically via the `anuvad` service.

  **Pitfall to watch:** `messages.ts` typed parameter functions use optional types (e.g., `planTitle?: string`). If the prop feeding the parameter can be undefined at runtime, the announcement will degrade to "Plan details for undefined". Always guard at the call site or provide a fallback.

  **See:** `WA11Y-WEB-4.1.2-002.md` Variation (this draft) — Commit `7d77e8f6b6b3`
  **New component path documented:** `libs/account/protection-plans-page/src/lib/protection-plans-new-header.tsx` — Protection Plans page header with "View All" section navigation links.

---

---

## Metadata

| Field          | Value                                                                 |
|----------------|-----------------------------------------------------------------------|
| Jira           | CEPG-330515-A                                                         |
| PR             | #158467 (inner fix PR: #158424)                                       |
| Commit         | 96e6166fb81a (pharmacy fix) — landed via merge 45e16dad24d5           |
| Author         | Chang Tong — c0t09qg <Chang.Tong@walmart.com>                         |
| WCAG           | 4.1.2 Name, Role, Value — Generic or Non-Descriptive Accessible Name  |
| Template ID    | WA11Y-WEB-4.1.2-002                                                   |
| Domain         | Health & Wellness / Pharmacy                                          |
| Team           | Health-Vision (Pharmacy Import-Rx squad)                              |
| Primary File   | libs/pharmacy/import-rx/import-rx-improvements/src/lib/components/review-request-screen/review-sections.tsx |

---

## Template Routing Decision

**EXISTING VARIATION** — appending Variation 1 to `WA11Y-WEB-4.1.2-002`.

The fix matches the template's core problem category: a displayed value ("--") had no useful accessible name, so screen readers announced the literal em-dash string rather than communicating semantic emptiness. The fix wraps empty/placeholder states in a dedicated `<ValueText>` component that provides `aria-label="Empty"` on an outer `<span>` and `aria-hidden="true"` on the inner decorative dash span — a textbook vague-name remediation for placeholder content.

---

## Variation 1: Decorative Placeholder ("--") Has No Accessible Name on Rx Review Screen Data Fields

**Source:** CEPG-330515-A / PR #158424 — `libs/pharmacy/import-rx/import-rx-improvements/src/lib/components/review-request-screen/review-sections.tsx`

### Context

The Pharmacy "Find Prescriptions" import flow presents a Review Screen listing patient data fields (Corrected Info, Previous Info, Medication Info). When a field has no recorded value, the UI displayed a raw "--" placeholder string. Screen readers announced this literally — either as "dash dash" or as a meaningless punctuation burst — giving users no indication that the field was intentionally empty. There was also a secondary issue: `<ListItem>` components in this list carried an implicit `role` that conflicted with how the parent list was structured, generating spurious ARIA role errors.

### Bad Code

```tsx
// ❌ BAD — empty field renders raw placeholder; screen reader announces "dash dash"
// CorrectedInfoSection — no value branch:
customerInfoValidation?.correctedInfo?.[item.data]
  ? fieldData
  : REVIEW_PIMS_REQUEST.NO_VALUE   // evaluates to "--"

// PreviousInfoSection — empty list fallback:
<span>{REVIEW_PIMS_REQUEST.NO_VALUE}</span>  // "--" announced as punctuation

// MedicationInfoScreen — no value branch:
data?.[item.data] ? fieldData : REVIEW_PIMS_REQUEST.NO_VALUE   // "--"

// ListItemDisplay — role conflict:
<ListItem UNSAFE_className="mt2" title={title}>
  {children}
</ListItem>
// No role override — default ListItem role clashes with parent list semantics
```

### Good Code

```tsx
// ✅ GOOD — dedicated ValueText component wraps all value rendering

// New ValueText component (added at module scope):
const ValueText: React.FC<{ value?: string | number | null }> = ({ value }) => {
  const rawText = (value ?? "").toString().trim();
  const isEmpty =
    rawText.length === 0 || rawText === REVIEW_PIMS_REQUEST.NO_VALUE;  // NO_VALUE = "--"
  if (isEmpty) {
    return (
      // Outer span carries the meaningful accessible name "Empty"
      <span aria-label={REVIEW_PIMS_REQUEST.EMPTY_ARIA_LABEL}>
        {/* Inner span hides the decorative dash from the AT */}
        <span aria-hidden="true">{REVIEW_PIMS_REQUEST.NO_VALUE}</span>
      </span>
    );
  }
  return <span>{rawText}</span>;
};

// EMPTY_ARIA_LABEL is defined in constants/messages.ts:
//   EMPTY_ARIA_LABEL: m(messages, "emptyAriaLabel")
// And resolved in locale/en-US.yaml:
//   emptyAriaLabel: "Empty"

// CorrectedInfoSection — no value branch now uses ValueText:
customerInfoValidation?.correctedInfo?.[item.data] ? (
  <ValueText value={fieldData} />
) : (
  <ValueText value={null} />  // renders "Empty" to AT, "--" visually
)

// PreviousInfoSection — list items and empty fallback:
return (
  <div key={`${item.data}-${index}`}>
    {" "}
    <ValueText value={fieldData} />
  </div>
);
// ... empty fallback:
<ValueText value={null} />

// MedicationInfoScreen — same pattern:
data?.[item.data] ? (
  <ValueText value={fieldData} />
) : (
  <ValueText value={null} />
)

// ListItemDisplay — role="none" removes the spurious ListItem role:
<ListItem role="none" UNSAFE_className="mt2" title={title}>
  {children}
</ListItem>
```

### Explanation

The root cause is a common pattern in data-display UIs: a sentinel value used for both visual rendering and the AT reading order. The "--" string is a design affordance (signals "nothing recorded") but is syntactically opaque to screen readers. The fix introduces a thin `ValueText` component that makes the aria/visual split explicit:

1. **For empty/null values:** An outer `<span aria-label="Empty">` provides a human-readable accessible name. The inner `<span aria-hidden="true">` hides the visual "--" so the AT does not double-announce.
2. **For real values:** A plain `<span>` passes text through untouched.
3. **For the list container:** `role="none"` on `ListItem` neutralises an implicit landmark/list role that was creating an orphaned ARIA structure.

The `EMPTY_ARIA_LABEL` constant is i18n-aware — it routes through the locale message system so international users also hear a translated "Empty" equivalent rather than silence.

### Key Constants

```ts
// libs/pharmacy/import-rx/import-rx-improvements/src/lib/constants/messages.ts
export const REVIEW_PIMS_REQUEST = {
  // ...
  NO_VALUE: "--",                                      // visual placeholder
  EMPTY_ARIA_LABEL: m(messages, "emptyAriaLabel"),     // "Empty" via i18n
};
```

```yaml
# libs/pharmacy/import-rx/import-rx-improvements/src/lib/locale/en-US.yaml
emptyAriaLabel: "Empty"
```

---

## Human Review Checklist

- [ ] Verify `emptyAriaLabel` translations are present in all supported locales: `en-CA`, `en-US`, `es-CL`, `es-MX`, `es-US`, `fr-CA`.
- [ ] Confirm `aria-hidden="true"` on the inner dash `<span>` prevents double-announcement in NVDA/JAWS.
- [ ] Confirm `aria-label="Empty"` (or locale equivalent) is announced correctly in VoiceOver (macOS + iOS) when navigating the Review Screen field list.
- [ ] Verify `role="none"` on `ListItem` does not break visual styling or keyboard navigation of the list.
- [ ] Check that `ValueText` handles edge cases: `0` (falsy number), whitespace-only strings, and multi-word strings with leading/trailing spaces — the `.trim()` call should normalise these correctly.
- [ ] Confirm that screen reader tests in `review-section.spec.tsx` cover the `<ValueText value={null} />` branch and assert the accessible name "Empty" is present.
- [ ] Assess whether the same `ValueText` component pattern should be applied to other pharmacy screens that display similar placeholder "--" values (e.g., insurance replacement flow, WHRI flow).

---

## TEAMS_UPDATE

File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Health-Vision/vision-center-orders.md
Content:

---

### [2025-09-05] CEPG-330515-A — Pharmacy Review Screen Empty Fields Announced as "Dash Dash" (WCAG 4.1.2)

**Area:** `libs/pharmacy/import-rx/import-rx-improvements/src/lib/components/review-request-screen/`

**Pitfall Pattern:** When a data field has no recorded value, the UI rendered a raw `"--"` placeholder (the `NO_VALUE` constant from `REVIEW_PIMS_REQUEST`). Screen readers announced this as literal punctuation ("dash dash") rather than communicating semantic emptiness.

**Fix:** A dedicated `ValueText` React component wraps all value rendering. For empty/null inputs it renders:
```tsx
<span aria-label={REVIEW_PIMS_REQUEST.EMPTY_ARIA_LABEL}>
  <span aria-hidden="true">{REVIEW_PIMS_REQUEST.NO_VALUE}</span>
</span>
```
The outer `<span aria-label="Empty">` provides the accessible name; the inner `<span aria-hidden="true">` hides the decorative dash from the accessibility tree. For non-empty values, `ValueText` renders a plain `<span>{rawText}</span>`.

**Secondary fix:** `<ListItem>` components in the review sections were given `role="none"` to neutralise a conflicting implicit ARIA role within the parent list structure.

**Architectural insight:** Any screen that renders the `REVIEW_PIMS_REQUEST.NO_VALUE` ("--") sentinel directly into JSX without an `aria-label` wrapper is a potential 4.1.2 violation. Audit the following files for the same pattern:
- `libs/pharmacy/import-rx/import-rx-improvements/src/lib/components/review-request-screen/review-sections.tsx`
- Other pharmacy data-display screens using `REVIEW_PIMS_REQUEST.NO_VALUE` inline

**i18n note:** `EMPTY_ARIA_LABEL` is locale-routed — ensure `emptyAriaLabel` key is present in all locale YAML files when adding new pharmacy screens.

**See:** `WA11Y-WEB-4.1.2-002.md` Variation 1 · PR #158424 · commit `96e6166fb81a`
