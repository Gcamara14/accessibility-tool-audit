# Catalyst Template: Alt Text: Missing Alt Text Attribute (Generic)

**Template ID:** `WA11Y-WEB-1.1.1-001`
**Platform:** Web
**WCAG Criterion:** 1.1.1 Non-text Content

---

## 🛑 The Problem
An `<img>` tag completely lacks the `alt` attribute. This is worse than an empty `alt=""` because screen readers will often fall back to reading the raw file name (e.g., "1234_logo_final.png") to the user.

---

## ✅ The Fix Patterns

**❌ Bad Code:**
```html
<img src="/assets/logo.png" />
```

**✅ Good Code (Informative Image):**
```html
<img src="/assets/logo.png" alt="Walmart Homepage" />
```

---

## Variation 1 — WCP `<Icon>` Component Missing `role="img"` + `aria-label` (BCPA-819)

**Context:** WCP `WcpFlag` component — `leading`/`trailing` icon props in `libs/design-components/`

### 🛑 Problem
The WCP `<Icon>` component renders an SVG. SVGs have no implicit accessible name. When used as informative icons inside composite components (like `WcpFlag`), consumers **must** explicitly add `role="img"` and `aria-label`. Without them, screen readers either skip the icon entirely or read out raw SVG node data.

> ⚠️ **Key Insight:** This fix lives in the **consumer code** (how you pass icons to a component), not the component source itself. The `WcpFlag` component is correct — the _usage pattern_ was missing the a11y attributes. This is a documentation/example pattern fix.

### ❌ Bad Code
```tsx
// WCP Icon used as informative icon — no accessible name
const defaultProps: WcpFlagProps = {
  leading: <Icon name="ArrowDown" className="dark-red" />,
  trailing: <Icon name="Spark" className="gold" />,
};
```

### ✅ Good Code
```tsx
// WCP Icon with role="img" + aria-label — screen reader gets a meaningful name
const defaultProps: WcpFlagProps = {
  leading: (
    <Icon
      name="ArrowDown"
      className="dark-red"
      role="img"
      aria-label="Arrow down"
    />
  ),
  trailing: (
    <Icon name="Spark" className="gold" role="img" aria-label="Spark" />
  ),
};
```

### Rules for WCP `<Icon>` a11y
| Use Case | Pattern |
|---|---|
| Informative icon (conveys meaning) | `role="img"` + `aria-label="[description]"` |
| Decorative icon (purely visual) | `aria-hidden="true"` |
| Icon inside a button with visible label | `aria-hidden="true"` (button label is sufficient) |
| Icon inside a button with NO visible label | `aria-label` on the **button**, `aria-hidden` on the icon |

> 🔍 **Check `component-map.json`** for WCP Icon's `doc_site_link` before applying — verify the Icon component supports `role` and `aria-label` as passthrough native HTML props.


---

## 🧪 Ingested Variation

## Draft #3 — Variation of: `WA11Y-WEB-1.1.1-001`

**Ingested by:** Wibey (Step 5 Self-Doc Loop — Concrete Variation)
**Date:** 2026-03-20
**Ingestion Score:** +4 (WCP-specific React pattern; existing template covers plain HTML `<img>` only — no component API guidance)

### Proposed Title
`Missing Alt Text: WCP <Icon> SVG Component Needs role="img" + aria-label When Used as Informative Icon`

### WCAG Mapping
- **Criterion:** WCAG 1.1.1 Non-text Content
- **Platform:** Web
- **Component:** WCP `<Icon>` (SVG icon component from `libs/design-components/`)
- **Extends:** `WA11Y-WEB-1.1.1-001` (currently covers `<img>` HTML only — no React/SVG patterns)

### Source References
- **Jira:** https://jira.walmart.com/browse/BCPA-819
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/173407
- **Commit:** `1dd949e56d13` (`fix(design-components): WCP Flag [A11y] - icon accessibility attributes`)
- **Author:** Vinay Kumar B M (Vinay.Kumar.B.M@walmart.com)
- **File Fixed:** `libs/design-components/wcp-flag/src/lib/wcp-flag.stories.tsx`

---

### 🛑 The Problem

The WCP `<Icon>` component renders an inline SVG. Unlike `<img>` tags, SVGs have **no implicit accessible name or role** — screen readers interpret them differently across browsers. When a `<Icon>` is used as an **informative** visual element (one that conveys meaning, not just decoration), consumers must explicitly add:
- `role="img"` — tells the accessibility tree this SVG represents an image
- `aria-label="[description]"` — provides the text alternative

Without these, VoiceOver/NVDA either announces nothing, or reads internal SVG path data gibberish.

> ⚠️ **Critical distinction:** This PR fixed the **Storybook stories** (`wcp-flag.stories.tsx`), not the component source. The `WcpFlag` component itself is correct — the _documentation examples_ were showing the wrong usage pattern. This means the risk is high: developers copying from Storybook examples would replicate the inaccessible pattern into production code.

**Expected:** Icon has an accessible name announced by screen readers.
**Actual:** Icon SVG has no `role` or label — VoiceOver skips it or reads raw SVG internals.

---

### ❌ Bad Code

```tsx
// WCAG 1.1.1 VIOLATION: WCP Icon with no accessible name
// Screen reader: silence, or raw SVG path data
const defaultProps: WcpFlagProps = {
  leading: <Icon name="ArrowDown" className="dark-red" />,
  trailing: <Icon name="Spark" className="gold" />,
};
```

---

### ✅ Good Code

```tsx
// FIXED: role="img" identifies the SVG as an image; aria-label is the text alternative
const defaultProps: WcpFlagProps = {
  leading: (
    <Icon
      name="ArrowDown"
      className="dark-red"
      role="img"
      aria-label="Arrow down"
    />
  ),
  trailing: (
    <Icon name="Spark" className="gold" role="img" aria-label="Spark" />
  ),
};
```

---

### 💡 Why This Fix Works

SVGs rendered by the WCP `<Icon>` component pass through arbitrary HTML props (`role`, `aria-*`) to the underlying `<svg>` element. By adding `role="img"`, the browser maps the SVG into the accessibility tree as an image node. The `aria-label` then becomes the accessible name that screen readers announce — functionally equivalent to the `alt` attribute on a standard `<img>`.

**Decision tree for any WCP `<Icon>` usage:**

| Context | Correct Pattern |
|---|---|
| Standalone icon conveying meaning | `role="img"` + `aria-label="[what it means]"` |
| Pure decoration (no meaning added) | `aria-hidden="true"` |
| Inside `<Button>` with visible text label | `aria-hidden="true"` (button text covers it) |
| Inside `<Button>` with NO visible label (icon-only button) | `aria-label` on the `<Button>`, `aria-hidden="true"` on `<Icon>` |

---

### 📋 Human Review Checklist

- [ ] Add this as Variation 1 to `final-skill/catalyst-templates/web/WA11Y-WEB-1.1.1-001.md` (currently plain-HTML skeleton only) — ✅ **Done in this session**
- [ ] Add WCP `<Icon>` entry to `final-skill/component-map.json` if not already present (check: it's not currently listed)
- [ ] Create `final-skill/design-system-docs/web/WCP-Icon.md` prop reference — `role` and `aria-label` should be called out as a11y-critical props
- [ ] Alert design system docs team: Storybook examples for any component using `<Icon>` should be audited for missing `role="img"` + `aria-label`
- [ ] Promote to `final-skill/catalyst-templates/web/WA11Y-WEB-1.1.1-002.md` if approved (separate ID warranted — React/SVG pattern is architecturally distinct from HTML `<img>`)

---


---

## 🧪 Ingested Variation

## Draft #4 — Variation of: `WA11Y-WEB-1.1.1-001`

**Ingested by:** Wibey Swarm Agent (Parallel Batch Run)
**Date:** 2026-03-20
**Ingestion Score:** +4 (Novel conditional-alt pattern — feature-flag variant image product names not covered by existing templates)

### Proposed Title
`Inaccurate Alt Text: Feature-Flagged Conditional Alt for Product-Variant Payment Card Images`

### WCAG Mapping
- **Criterion:** WCAG 1.1.1 Non-text Content
- **Platform:** Web
- **Component:** `<Image>` component in `libs/payments/` (OnePay banner + more-ways-to-pay)
- **Extends:** `WA11Y-WEB-1.1.1-001`

### Source References
- **Jira:** https://jira.walmart.com/browse/CEPG-367463
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/181218
- **Commit:** `ed2947f1423086cc2695261895924f85acb32733` (`feat(payments): ADA accessibility fixes for OnePay CashRewards Card - dollar savings`)
- **Author:** Nitish Hardeniya (n0h03sm)
- **Files Fixed:** `libs/payments/one-pay/src/lib/one-credit-banner.tsx`, `libs/payments/more-ways-to-pay/src/lib/more-ways-to-pay.tsx`, + 6 locale YAML files

---

### 🛑 The Problem

When a component renders different product images depending on a runtime feature flag (`enableOneCreditDollarSavings`), a single hardcoded `alt` string cannot be accurate for all render paths. The card logo and rack-up images showed "OnePay CashRewards Card" in their alt text regardless of which product variant was active — under the dollar savings flag, the correct product is "CashRewards Card" (a distinct product). Screen reader users received the wrong product name.

The same bug existed in `getAltTextForIcon` and `getAriaLabelForOnePayCreditCard` — the flag was not threaded through to the accessible name computation functions.

---

### ❌ Bad Code

```tsx
// Static alt — always wrong when dollar savings flag is active
<Image src={logoSrc ?? ""} alt={m(messages, "onePayCard")} ... />
<Image src={rackupImage ?? ""} alt={m(messages, "onePayCashRewardsCard")} ... />

// Function ignores feature flag — always returns same product name
const getAltTextForIcon = (icon: string, tempoData?: TempoData): string => {
  if (icon === tempoData?.image) return m(messages, "onePayCashRewardsCard");
};
```

---

### ✅ Good Code

```tsx
// Conditional alt tied to the same flag that controls the visual variant
<Image src={logoSrc ?? ""}
  alt={enableOneCreditDollarSavings ? m(messages, "oneCashRewardsCard") : m(messages, "onePayCard")} ... />

// Flag threaded through to accessible name functions
const getAltTextForIcon = (icon: string, tempoData?: TempoData, enableOneCreditDollarSavings?: boolean): string => {
  if (icon === tempoData?.image)
    return m(messages, enableOneCreditDollarSavings ? "oneCashRewardsCard" : "onePayCashRewardsCard");
};

// New locale key added to all 6 locale YAML files + messages.ts
// en-US.yaml: oneCashRewardsCard: "CashRewards Card"
export const oneCashRewardsCard = () => "CashRewards Card";
```

---

### 💡 Why This Fix Works

The alt text must use the same condition that governs the visual render. Any time a feature flag or prop changes which product/image is shown, the accessible name must change in lockstep. New locale keys must be added for each product variant name to preserve i18n correctness across all 6 locales — hardcoding strings in JSX breaks translations.

**Rule:** `alt` must be conditional when `src` is conditional.

---

### 📋 Human Review Checklist

- [ ] Verify locale keys `oneCashRewardsCard` were reviewed by Brand/Localization team for all 6 locales
- [ ] Confirm `enableOneCreditDollarSavings` is the correct CCM flag name in production
- [ ] Note: `oneCreditCashRewardsButtonAreaLable` is a likely typo of "Label" — confirm intentional
- [ ] Run `git show ed2947f14230 -- libs/payments/one-pay/src/lib/one-credit-onboarding.tsx` — additional files in this commit were not extracted; verify for same broken pattern
- [ ] Promote to `WA11Y-WEB-1.1.1-001.md` as Variation 2 (feature-flag conditional alt pattern)

---


---

## 🧪 Ingested Variation

## Draft #6 — Variation of: `WA11Y-WEB-1.1.1-001`

**Ingested by:** Wibey Swarm Agent (Parallel Batch Run)
**Date:** 2026-03-20
**Ingestion Score:** +2 (Real-world production example of decorative-icon pattern — already in rules table of Variation 1; documents Vision Center domain)

### Proposed Title
`Decorative WCP <Icon> Exposed to Screen Reader: aria-hidden="true" Missing (Vision Center OrderCard)`

### WCAG Mapping
- **Criterion:** WCAG 1.1.1 Non-text Content
- **Platform:** Web
- **Component:** WCP `<Icon>` in `libs/vision-center/`
- **Extends:** `WA11Y-WEB-1.1.1-001` Variation 1 (decorative row already in rules table)

### Source References
- **Jira:** https://jira.walmart.com/browse/HVCE-13794
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/177550
- **Commit:** `b5eb329a6a89a79944acc20427b483ac1231e3b2`
- **Author:** Jia Ning Zhang (jianing.zhang@walmart.com)
- **File Fixed:** `libs/vision-center/ui/src/lib/OrderCard/order-card.tsx`

---

### 🛑 The Problem

The Store icon (`<Icon name="Store" />`) in `OrderHeader` was exposed to the accessibility tree with no accessible name and no `aria-hidden`. The adjacent `<span>` already provides the full store name and address — the icon is purely decorative. Without `aria-hidden="true"`, screen readers announced SVG noise before the meaningful text.

---

### ❌ Bad Code

```tsx
// Decorative icon — no aria-hidden, no accessible name — pollutes reading order
<Icon name="Store" size="small" className="mr1" />
```

---

### ✅ Good Code

```tsx
// aria-hidden="true" — removes icon from accessibility tree entirely
// Adjacent <span> provides the complete store name/address
<Icon name="Store" size="small" className="mr1" aria-hidden="true" />
```

---

### 💡 Why This Fix Works

The adjacent `<span>` containing the store name and address is always co-rendered and provides the full accessible description. The icon adds no information beyond what the text communicates — it is purely decorative. `aria-hidden="true"` removes it from the accessibility tree completely. Screen readers skip directly to the text `<span>`.

Rule reference: "Decorative icon (purely visual) → `aria-hidden="true"`" per `WA11Y-WEB-1.1.1-001` Variation 1 rules table.

---

### 📋 Human Review Checklist

- [ ] Confirm `<Icon name="Store" />` generates no implicit `aria-*` attributes internally
- [ ] Confirm the adjacent `<span>` with store name/address is always rendered in the same conditional block as the icon
- [ ] Check whether other icons in `OrderCard` were left without `aria-hidden` (commit message says "icons" plural)
- [ ] Add Vision Center domain to `teams/Health-Vision/` with `order-card.tsx` path ✅ done in this session
- [ ] This is a Variation 2 example for `WA11Y-WEB-1.1.1-001` — consider adding concrete Vision Center example to that template

---


---

## 🧪 Ingested Variation

## Draft #7 — Variation of: `WA11Y-WEB-1.1.1-001`

**Ingested by:** Wibey Swarm Agent (Parallel Batch Run)
**Date:** 2026-03-20
**Ingestion Score:** +4 (Two-bug compound fix: wrong CMS alt + conflicting tabIndex on aria-hidden image — not covered by existing templates)

### Proposed Title
`Decorative Image: CMS-Driven alt="" Correction + Conflicting tabIndex={-1} Removal on aria-hidden Hero Image`

### WCAG Mapping
- **Criterion:** WCAG 1.1.1 Non-text Content (primary) + WCAG 4.1.2 Name, Role, Value (secondary)
- **Platform:** Web
- **Component:** `<Image>` in `libs/wplus/landing-page/`
- **Extends:** `WA11Y-WEB-1.1.1-001`

### Source References
- **Jira:** https://jira.walmart.com/browse/CEWMPLUS-144536
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/175481
- **Commit:** `dbbaafd6b60ccce9cf470e0322659e19a67c499e`
- **Author:** Xiaoting Lin (x0l09ta)
- **File Fixed:** `libs/wplus/landing-page/src/lib/modules/hero-2a-2b/index.tsx`

---

### 🛑 The Problem

The hero background image in `Hero2A2B` had two simultaneous bugs despite already having `aria-hidden="true"`:

1. **`alt={backgroundImagetype.alt}`** — passing a CMS-authored alt string on a decorative image. If `aria-hidden` is ever removed, the CMS text would be announced as meaningful content.
2. **`tabIndex={-1}`** — present alongside `aria-hidden="true"`. `aria-hidden` removes the element from the AT tree; `tabIndex={-1}` allows programmatic focus. This contradictory combination can confuse AT implementations. Decorative images should be fully inert.

---

### ❌ Bad Code

```tsx
<Image
  alt={backgroundImagetype.alt}    // ❌ CMS-driven alt on a decorative image
  tabIndex={-1}                    // ❌ Conflicting with aria-hidden="true"
  aria-hidden="true"
  className="db w-100 h-100"
  loading="eager"
  fetchPriority="high"
  preload
/>
```

---

### ✅ Good Code

```tsx
<Image
  alt=""                           // ✅ Explicit empty alt — semantically decorative
                                   // ✅ tabIndex={-1} removed — element is fully inert
  aria-hidden="true"
  className="db w-100 h-100"
  loading="eager"
  fetchPriority="high"
  preload
/>
```

---

### 💡 Why This Fix Works

**`alt=""`** is the correct semantic signal for decorative images — browsers and screen readers skip them during AT traversal. Belt-and-suspenders with `aria-hidden="true"`: if one is ever stripped, the other still protects.

**Removing `tabIndex={-1}`** makes the element fully inert. `tabIndex={-1}` + `aria-hidden="true"` is a contradictory state — the element is hidden from AT but still programmatically focusable. Removing it ensures no JavaScript can accidentally focus a decorative asset.

**Rule:** `aria-hidden` + `alt=""` + no `tabIndex` = correct triple pattern for decorative images.

---

### 📋 Human Review Checklist

- [ ] Confirm hero image is purely decorative in all design variants (2A and 2B)
- [ ] Verify no `element.focus()` calls target this image anywhere (tabIndex removal makes programmatic focus impossible)
- [ ] Confirm `backgroundImagetype.alt` CMS field still used for other informative images in the same component
- [ ] Confirm `alt=""` not `alt={undefined}` — omitted alt causes filename announcement
- [ ] Run screen reader smoke test on Hero 2A + 2B — background image should be fully skipped
- [ ] Promote as Variation 3 to `WA11Y-WEB-1.1.1-001.md`: "Decorative image with dynamic CMS alt + conflicting tabIndex"

---
