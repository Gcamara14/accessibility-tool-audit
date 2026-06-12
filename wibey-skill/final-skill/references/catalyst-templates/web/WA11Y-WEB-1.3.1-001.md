# Catalyst Template: Role: Heading Role is Missing

**Template ID:** `WA11Y-WEB-1.3.1-001`
**Platform:** Web
**WCAG Criterion:** 1.3.1 Info and Relationships

---

## 🛑 The Problem
Text that acts visually as a heading (large, bold font) is marked up using generic elements like `<div>` or `<span>`, meaning screen reader users cannot use heading navigation shortcuts to jump to it.

---

## ✅ The Fix Patterns

**❌ Bad Code:**
```html
<div class="text-3xl font-bold mb-4">Checkout Summary</div>
```

**✅ Good Code (Semantic HTML):**
```html
<h2 class="text-3xl font-bold mb-4">Checkout Summary</h2>
```

**✅ Acceptable Code (ARIA Fallback - use only if HTML cannot be changed):**
```html
<div role="heading" aria-level="2" class="text-3xl font-bold mb-4">Checkout Summary</div>
```

---

## 📦 Variation 1 — WCP `<Heading>` Missing `as` Prop (Vision Center ErrorPage)
**Source:** HVCE-13625 / PR #176121 — `libs/vision-center/ui/src/lib/ErrorPage/index.tsx`

The WCP `<Heading>` component is **polymorphic** — it applies visual heading styles independently of the underlying HTML element. When `as` is omitted, it silently emits a styled-but-semantically-empty node. Screen readers never see a heading role.

```tsx
// ❌ BAD — no `as` prop; renders as a <div>, no heading role in DOM
<Heading size="medium" UNSAFE_style={{ lineHeight: "32px" }}>
  {title}
</Heading>

// ✅ GOOD — `as="h2"` forces a real <h2> element; heading role is announced
<Heading as="h2" size="medium" UNSAFE_style={{ lineHeight: "32px" }}>
  {title}
</Heading>
```

**Rule:** Every `<Heading>` usage in product UI must pass an explicit `as="hN"` prop. Visual size is controlled by the `size` prop or `UNSAFE_className` — the two concerns are fully independent.

---

## 📦 Variation 2 — `<div class="b">` Promoted to Native Heading Elements in Modal (MQD Tiered Promo)
**Source:** CEPG-353780 / PR #172800 — `libs/payments/mqd-products-modal/src/lib/mqd-tired-promo-section.tsx`, `mqd-products-wrapper.tsx`

Visually-bold `<div>` elements used as section headers inside a modal. Fix: replace with native `<h2>`, `<h3>`, `<h4>` using `style={{ fontSize: "inherit" }}` to avoid visual size regression.

```tsx
// ❌ BAD — visually bold, no heading role
<div className="b" data-testid="tiered-mqd-title">
  {m(messages, "tieredPromoHeader")}
</div>

// ✅ GOOD — semantic h2 with inherited font size (no visual change)
<h2 className="b ma0" style={{ fontSize: "inherit" }} data-testid="tiered-mqd-title">
  {m(messages, "tieredPromoHeader")}
</h2>
```

**Hierarchy used:** modal top-level → `<h2>`, sub-section → `<h3>`, item label → `<h4>`. Always audit new modal content sections before shipping.

---

## 📦 Variation 3 — `as="h6"` Used as Visual Shortcut — Protection Plans Hub/PYP List
**Source:** CEPG-344616 / PR #166718 — `libs/account/protection-plans-page/src/lib/protection-plans-new-hub-item.tsx`, `protection-plans-pyp-list.tsx`

Developers used `as="h6"` to get small visual text size, misunderstanding that `as` controls semantic level, not appearance. `h6` misrepresents document structure; the correct heading level was `h3`.

```tsx
// ❌ BAD — h6 used as a size hack; wrong hierarchy
<Heading as="h6" UNSAFE_className="f6 f3-m mv1 lh-copy-m lh-title">
  {plan.title}
</Heading>

// ✅ GOOD — h3 matches structural depth; visual size via Tachyons classes
<Heading as="h3" UNSAFE_className="f6 f3-m mv1 lh-copy-m lh-title">
  {plan.title}
</Heading>
```

**Rule:** Never choose `as="hN"` for visual size. Use `UNSAFE_className` Tachyons font-size utilities (`f3`, `f5`, `f6`) for visual control; choose `as` based solely on structural hierarchy.

---

## 📦 Variation 4 — `<div>` with Heading Styling Replaced by `<Heading as="h2">` (Order Item Tile Add-Ons)
**Source:** CEPG-344615 / PR #167215 — `libs/orders/ui/order-item-tile/src/lib/add-ons/index.tsx`

A `<div>` styled as a section title (bold, `f5`) with no heading role. Fix: swap to Living Design `<Heading as="h2">` with `UNSAFE_className` preserving all existing styling including the cancelled-state colour class.

```tsx
// ❌ BAD — no heading role; screen reader skips this section title
<div className={classNames("b pb2 f5", headerClass, { "light-gray": isCancelled })}>
  {ADD_ON_MODULE_TITLE}
</div>

// ✅ GOOD — semantic <h2>; visual styling unchanged via UNSAFE_className
import { Heading } from "@walmart-web/livingdesign-components";
<Heading
  size="small"
  as="h2"
  UNSAFE_className={classNames("b pb2 f5", headerClass, { "light-gray": isCancelled })}
>
  {ADD_ON_MODULE_TITLE}
</Heading>
```

---

## 📦 Variation 5 — `<div>` Section Subtitle in Direct Spends Badging Component
**Source:** CEPG-340974 / PR #164018 — `libs/item/direct-spends/src/lib/direct-spends-enhancements.tsx`

Structured section subtitle rendered as a bold `<div>` inside a list. Fix: replace with a plain `<h3>` (add `mt0` to reset browser default top margin and preserve layout).

```tsx
// ❌ BAD — visually styled heading with no semantic role
<div className="f5 b mb2">{section.subTitle}</div>

// ✅ GOOD — <h3> gives heading role + level; mt0 preserves existing layout
<h3 className="f5 b mb2 mt0">{section.subTitle}</h3>
```

# Draft Ingestion: CEPG-341113

**Ingested by:** Wibey Swarm Agent (Sub-agent — Parallel Batch Run)
**Date:** 2026-03-23
**Ingestion Score:** +3 (WCP Heading `as` prop omission causing no heading role, with bonus structural nesting fix on recognized-reviewer)

---

## Metadata

| Field | Value |
|---|---|
| Jira | CEPG-341113 |
| PR | #166628 |
| Commit | `5b88b1f553f0e630313b7e7cfc835fc92615f75a` |
| Author | Vikram Golanukonda (v0g00t1) |
| WCAG Criterion | 1.3.1 Info and Relationships (Level A) |
| Issue Type | Incorrect Heading Structure: Heading Levels Are Skipped |
| Template ID | WA11Y-WEB-1.3.1-001 (existing — new variation appended) |
| Domain | Post-Transaction |
| Team | Reviewer Community |
| Primary File | `libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx` |
| Secondary File | `libs/reviewer-community/dashboard/src/lib/recognized-reviewer.tsx` |

---

## Template Routing Decision

**DESTINATION: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/catalyst-templates/web/WA11Y-WEB-1.3.1-001.md**

This is a variation of WA11Y-WEB-1.3.1-001. The root cause is identical to Variation 1 (HVCE-13625): a WCP `<Heading>` rendered without the `as` prop, producing a styled-but-semantically-empty node with no heading role in the DOM. Screen readers could not announce the "Let's get started" heading or navigate to it via heading shortcuts.

The WCAG hint labels this as "Heading Levels Are Skipped" — this is consistent: if upstream sections establish an `<h1>` page title and `<h2>` section headings, a `<Heading>` with no `as` prop emits no heading at all, which is effectively a skipped/absent level. The fix is identical to all prior variations: add `as="h2"`.

The secondary fix in `recognized-reviewer.tsx` is a structural DOM validity fix: a `<Link>` (interactive element) was nested directly as a child inside a `<Heading>` component, which renders as a heading element. A `<a>` inside `<h2>` is valid HTML, but a `<Link>` with additional non-phrasing-content siblings can cause AT rendering issues. The fix restructures the layout using a wrapping `<div className="flex items-center">` with `<Heading>` and `<Link>` as siblings rather than parent/child — keeping them visually co-located while making the DOM structure unambiguous.

---

## Proposed Variation

### Draft — Variation 6 of: `WA11Y-WEB-1.3.1-001`

**Proposed Title:**
`WCP <Heading> Missing as Prop on Tax Flow Entry Screen (Reviewer Community — Sampling Tax)`

**WCAG Mapping:**
- Criterion: WCAG 1.3.1 Info and Relationships (Level A)
- Platform: Web
- Component: `TaxEntryContent` — `libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx`
- Extends: `WA11Y-WEB-1.3.1-001`

**Source References:**
- Jira: https://jira.walmart.com/browse/CEPG-341113
- PR: https://gecgithub01.walmart.com/walmart-web/walmart/pull/166628
- Commit: `5b88b1f553f0e630313b7e7cfc835fc92615f75a`
- Author: Vikram Golanukonda (Vikram.Golanukonda@walmart.com)
- File Fixed: `libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx`

---

### The Problem

The `TaxEntryContent` component renders a large-format `<Heading>` for the "Let's get started" label that opens the sampling tax profile creation flow. Because `as` was omitted, the WCP `<Heading>` component emitted only visual styling with no semantic heading element in the DOM. Screen reader users could not discover this section heading via heading navigation shortcuts (H key in NVDA/JAWS). Combined with surrounding `<h1>` page titles, the omission created an effective heading-level gap — WCAG 1.3.1 requires that information conveyed through visual presentation (heading hierarchy) also be conveyed programmatically.

---

### Bad Code

```tsx
// libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx
// BEFORE — no `as` prop; WCP Heading renders as a styled div, no heading role in DOM

<Heading
  size="large"
  weight={700}
  UNSAFE_className="pb2"
>
  {m(messages, "letsGetStarted")}
</Heading>
```

Screen reader output: silent (no heading role, skipped in heading navigation).

---

### Good Code

```tsx
// libs/reviewer-community/dashboard/src/lib/tax-entry/tax-entry.tsx
// AFTER — `as="h2"` forces a real <h2> element; heading role announced correctly

<Heading
  as="h2"
  size="large"
  weight={700}
  UNSAFE_className="pb2"
>
  {m(messages, "letsGetStarted")}
</Heading>
```

Screen reader output: "Let's get started, heading level 2" — navigable via heading shortcuts.

---

### Bonus Fix — Heading/Interactive Nesting (recognized-reviewer.tsx)

A secondary structural fix was made in `recognized-reviewer.tsx` where a `<Link>` (info-circle icon link) was a sibling rendered *inside* the `<Heading>` JSX block. The fix extracts both into a `<div className="flex items-center">` wrapper so `<Heading as="h2">` and `<Link>` are siblings, not parent/child.

```tsx
// BEFORE — Link nested inside Heading; structurally ambiguous for AT
<Heading as="h2" UNSAFE_className="b dark-gray f4 f3-m" size="small">
  {m(messages, "recognizedReviewer")}
  <Link href="/reviews/rules-eligibility?from=dashboard" ...>
    <Icon name="InfoCircle" size="small" className="dark-gray" />
  </Link>
</Heading>

// AFTER — Heading and Link are siblings inside a flex wrapper; clean DOM structure
<div className="flex items-center">
  <Heading as="h2" UNSAFE_className="b dark-gray f4 f3-m" size="small">
    {m(messages, "recognizedReviewer")}
  </Heading>
  <Link href="/reviews/rules-eligibility?from=dashboard" ...>
    <Icon name="InfoCircle" size="small" className="dark-gray" />
  </Link>
</div>
```

**Rule:** Do not nest interactive elements (Link, Button) as children of WCP `<Heading>`. Place them as siblings inside a flex container. This keeps the heading text unambiguous and prevents AT from announcing the link as part of the heading label.

---

### Why It Works

The WCP `<Heading>` component is a polymorphic design-system primitive. Visual size is controlled independently via `size` prop and `UNSAFE_className`. The `as` prop exclusively controls the emitted HTML element and therefore the semantic role. Without `as`, the component's default rendering is implementation-defined (typically a `<div>`) — no heading role is placed in the accessibility tree. Adding `as="h2"` emits a native `<h2>`, which browsers and AT treat as a structural landmark. No visual change occurs because `size="large"` and `weight={700}` are purely presentational.

The nesting fix in `recognized-reviewer.tsx` ensures the heading text node is clean — AT reads only `{m(messages, "recognizedReviewer")}` as the heading label, and the info link is a separate adjacent interactive element.

---

### Human Review Checklist

- [ ] Confirm `as="h2"` is the correct level — verify no existing `<h2>` already appears earlier in the TaxEntryContent tree that would create a duplicate level
- [ ] Check all other `<Heading>` instances in `libs/reviewer-community/` for missing `as` props (audit the full package, not just this file)
- [ ] Confirm the flex wrapper in `recognized-reviewer.tsx` does not break layout on mobile breakpoints
- [ ] Screen reader test: "Let's get started" announced as heading level 2 in NVDA+Chrome and VoiceOver+Safari
- [ ] The info-circle `<Link>` in `recognized-reviewer.tsx` should have an accessible name (aria-label) — check if it is present or if that is a separate follow-up ticket

---


---

# Ingestion Draft: CRUISE-16221

**Jira:** CRUISE-16221
**PR:** #161792
**Commit:** 42baa1a0b44a
**WCAG Criterion:** 1.3.1 — Info and Relationships: Incorrect Heading Structure — Heading Levels Are Skipped
**Template ID:** `WA11Y-WEB-1.3.1-001` (existing — new variation to append)
**Variation Number:** 6
**Domain:** Subscriptions
**Team:** Subscriptions — Manage Optimizations
**Author:** Nandini Karuturi (vn59jzy)
**Merge Date:** 2025-09-30

---

## Summary

Two section-level containers in `libs/subscription/manage-optimizations` used `<Heading as="h1">` for content that sits *inside* a page already headed by a top-level `<h1>`. Because both containers render below the page `<h1>`, any heading they emit should be `<h2>`. Using `as="h1"` creates a duplicate `<h1>` and causes screen-reader heading navigation to skip directly from level 1 to no sub-level, violating structural hierarchy (WCAG 1.3.1).

The WCP `<Heading>` component is polymorphic: `size` controls visual weight; `as` independently sets the semantic DOM element. Choosing the wrong `as` value produces correct visuals but broken heading hierarchy.

---

## Primary Source Files

- `libs/subscription/manage-optimizations/src/lib/subscription-items-components/subscription-items-container.tsx`
- `libs/subscription/manage-optimizations/src/lib/upcoming-orders-components/upcoming-subscription-orders-container.tsx`

---

## The Bug — Duplicate h1 / Skipped Heading Levels

Both container components rendered a WCP `<Heading as="h1">` for what is a *sub-section* of the page. Because a page-level `<h1>` already exists, these became spurious second `<h1>` elements — assistive technology users saw an impossible heading structure (h1 → h1 → h1) with no h2 ever announced, meaning they could not use heading navigation to jump between the "Subscription Items" and "Upcoming Orders" sections.

---

## Bad Code vs Good Code

### File 1: subscription-items-container.tsx

```tsx
// BAD — as="h1" inside a page that already has a top-level h1; creates
//        duplicate h1 and skips h2, breaking heading hierarchy for AT users
<Heading as="h1" size="medium" weight={700}>
  {m(messages, "subscriptionItems")}
</Heading>

// GOOD — as="h2" correctly marks this as a sub-section under the page h1
<Heading as="h2" size="medium" weight={700}>
  {m(messages, "subscriptionItems")}
</Heading>
```

### File 2: upcoming-subscription-orders-container.tsx

```tsx
// BAD — same pattern: as="h1" for a sub-section container
<Heading as="h1" size="medium" weight={700}>
  {m(messages, "upcomingSubscriptionOrders")}
</Heading>

// GOOD — as="h2" correctly positions this heading in the document outline
<Heading as="h2" size="medium" weight={700}>
  {m(messages, "upcomingSubscriptionOrders")}
</Heading>
```

---

## Why It Works

The WCP `<Heading>` component decouples visual appearance from semantic level. The `size` prop (here `"medium"`) and `weight` prop drive typography; `as` drives the HTML element emitted. Changing `as="h1"` to `as="h2"` has **zero visual impact** — the heading looks identical — but corrects the DOM heading outline so screen readers announce "heading level 2" and users can navigate between page sections using `H` shortcuts. This is the canonical WCP polymorphic `<Heading>` fix pattern already documented in WA11Y-WEB-1.3.1-001 Variations 1–5.

---

## Is This a Variation of WA11Y-WEB-1.3.1-001?

Yes. This is a direct continuation of the "incorrect `as` prop on WCP `<Heading>`" pattern already covered by Variations 1 (missing `as`), 3 (h6 used as size hack), and 4/5 (div-to-Heading lift). The distinguishing characteristic here is:

- **`as="h1"` used inside a sub-section that is already subordinate to a page-level `<h1>`** — i.e., not a missing heading role, and not a size-hack, but a *wrong structural level* where a valid-looking `as` value is simply set to the wrong heading number.
- Two sibling containers in the same library had the identical bug, indicating a copy-paste or template pattern problem rather than a one-off error.

**Variation label:** "Duplicate h1 / Wrong Heading Level in Sub-section Containers (Manage Optimizations)"

---

## Team / Domain Notes

- **Jira prefix:** `CRUISE-` maps to the **Subscriptions** domain, specifically the Manage Optimizations sub-library (`libs/subscription/manage-optimizations/`).
- This is a distinct Jira project/prefix from `CEWMPLUS-*` (W+ Landing Page, already mapped) but resides in the same monorepo `libs/subscription/` top-level namespace.
- The Manage Optimizations library owns the post-purchase subscription management UI (items, upcoming orders, address/payment changes).
- The same library contains additional ADA P2 fixes in this PR: `aria-labelledby` on a modal dialog and `isNonInteractive` on alert components — those are separate WCAG issues (4.1.2 / name-role-value) and are not heading-related.

---

