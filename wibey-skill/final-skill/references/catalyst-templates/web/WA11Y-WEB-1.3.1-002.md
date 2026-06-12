# Catalyst Template: Info: Missing List Structure - Use UL or OL

**Template ID:** `WA11Y-WEB-1.3.1-002`
**Platform:** Web
**WCAG Criterion:** WCAG-1.3.1

---

## 🛑 The Problem
Lists are not properly structured using semantic HTML tags, making them inaccessible to assistive technologies.

**Expected Result:** Content that is a list should be marked up with semantic HTML elements like &lt;ul&gt;, &lt;ol&gt;, and &lt;li&gt; to convey the correct relationships.
**Actual Result:** Lists are created using non-semantic elements like &lt;div&gt; or &lt;span&gt;, causing confusion for screen reader users.

---

## ✅ The Fix Patterns

> **Recommendation:** Use semantic HTML list elements (&lt;ul&gt; for unordered lists, &lt;ol&gt; for ordered lists, and &lt;li&gt; for list items) to properly convey list relationships to assistive technologies.

### Standard Implementation
```html
// Best: Native HTML5 Semantic list.
        <ul>
        <li>Margherita</li>
        <li>Pepperoni</li>
        </ul>
        
        // Last Resort: Custom aria role of list element.
        <div role="list">
        <div role="listitem">Margherita</div>
        <div role="listitem">Pepperoni</div>
        </div>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.


---

## 🧪 Ingested Variation

## Draft #9 — Variation of: `WA11Y-WEB-1.3.1-002`

**Ingested by:** Wibey Swarm Agent (Parallel Batch Run — Round 2)
**Date:** 2026-03-20
**Ingestion Score:** +3 (Concrete React/Tachyons implementation of div→ul/li pattern with `tabIndex={0}` keyboard-access addition)

### Proposed Title
`Missing List Structure: div→ul/li Conversion with tabIndex={0} for Keyboard Access (AtAGlanceContent product-highlights)`

### WCAG Mapping
- **Criterion:** WCAG 1.3.1 Info and Relationships (Level A)
- **Platform:** Web
- **Component:** `AtAGlanceContent` — `libs/item/product-highlights/`
- **Extends:** `WA11Y-WEB-1.3.1-002`

### Source References
- **Jira:** https://jira.walmart.com/browse/CEPG-330816
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/166589
- **Commit:** `325024920231587039eed4cf6cb70e6d3f319298`
- **Author:** Yu You Wu (Yuyou.Wu0@walmart.com)
- **File Fixed:** `libs/item/product-highlights/src/lib/at-a-glance-content.tsx`

> ⚠️ **Sequential Fix Note:** PR #171966 (CEPG-348108, Draft #8) later cleaned up `tabIndex={0}` and `aria-hidden="true"` that this PR inadvertently introduced. Read Drafts #8 and #9 together.

---

### 🛑 The Problem

The "At a Glance" tile section rendered product highlights inside a plain `<div>` container with each tile also in a `<div>`. Screen readers announced no list semantics — no item count, no list navigation. Keyboard-only users could not focus any tile because `<div>` elements are not natively focusable.

---

### ❌ Bad Code

```tsx
// No list semantics — screen readers see anonymous div containers
<div className="flex flex-wrap dark-gray"
  style={{ gap: "8px", ...(enableReimagineSnapshotTabs && { paddingTop: "12px" }) }}
>
  {tiles.map((highlight, index) => (
    <div key={index} className="f6 tc flex justify-center"
      style={{ minHeight: applyItemSnapShotDesign || useShortTiles ... }}
    >
      {/* tile content */}
    </div>
  ))}
</div>
```

---

### ✅ Good Code

```tsx
// <ul> announces list role + item count to screen readers
// pa0 resets default browser list padding — no visual regression
<ul className="flex flex-wrap dark-gray pa0"
  style={{ gap: "8px", ...(enableReimagineSnapshotTabs && { paddingTop: "12px" }) }}
>
  {tiles.map((highlight, index) => (
    <li key={index} className="f6 tc flex justify-center"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}  // Makes tiles keyboard-reachable for informational access
      style={{ minHeight: applyItemSnapShotDesign || useShortTiles ... }}
    >
      {/* tile content */}
    </li>
  ))}
</ul>
```

---

### 💡 Why This Fix Works

`<ul>/<li>` gives AT the list role and item count. `pa0` (Tachyons `padding: 0`) removes default browser list indentation without visual change. `tabIndex={0}` adds tiles to the tab order for keyboard access — note that Draft #8 later refined this by removing it and `aria-hidden`, showing this was an interim fix.

---

### 📋 Human Review Checklist

- [ ] Confirm `pa0` causes no visual regressions across breakpoints
- [ ] Check whether each `<li>` needs `aria-label` for screen reader context
- [ ] Validate eslint-disable is approved by accessibility guild
- [ ] Screen reader test: list item count announced correctly on entry
- [ ] Read alongside Draft #8 (CEPG-348108) — complete picture requires both PRs

---


---

## 🧪 Ingested Variation

## Draft #10 — Variation of: `WA11Y-WEB-1.3.1-002`

**Ingested by:** Wibey Swarm Agent (Parallel Batch Run — Round 2)
**Date:** 2026-03-20
**Ingestion Score:** +4 (Multi-file cross-component div→ul/li with bonus ARIA role correction on Link + decorative icon fix)

### Proposed Title
`Missing List Structure: Cross-Component div→ul/li Conversion in Omni-Scheduler Oil Package Selection (ServiceInfo + Packages + PackageDetails)`

### WCAG Mapping
- **Criterion:** WCAG 1.3.1 Info and Relationships (Level A)
- **Platform:** Web
- **Component:** Oil Package Selection — `libs/omni-scheduler/scheduler-components/`
- **Extends:** `WA11Y-WEB-1.3.1-002`

### Source References
- **Jira:** https://jira.walmart.com/browse/CEPG-330551
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/156721
- **Commit:** `394c13718affbe8a34553cec5e63bad31ef969cb`
- **Author:** Nandhini Gx (NANDHINI.GX@walmart.com)
- **Files Fixed:**
  - `libs/omni-scheduler/scheduler-components/src/lib/ui/oil-packages/ServiceInfo.tsx` (primary)
  - `libs/omni-scheduler/scheduler-components/src/lib/ui/oil-packages/Packages.tsx`
  - `libs/omni-scheduler/scheduler-components/src/lib/ui/oil-packages/PackageDetails.tsx`

---

### 🛑 The Problem

The "Inclusive Services" list in `ServiceInfo.tsx` used nested `<div>` containers with no list semantics. Oil package cards in `Packages.tsx` were unmapped from a parent list. `PackageDetails.tsx` rendered its root as a bare `<div>`. Across all three files, screen readers could not announce list structure or item count. Additionally, a `<Link>` component was missing `role="button"` and `aria-label`, and a decorative `<Icon>` check mark was exposed to AT.

---

### ❌ Bad Code

```tsx
// ServiceInfo.tsx — non-semantic list
<div className="pb1">
  {inclusiveServices.servicesList.map((service, index) => (
    <div key={index} className="mt1">
      <span>
        {service.servicesSign === "TICK" && (
          <Icon name="Check" className="pr2" size="small" />  // ❌ No aria-hidden on decorative icon
        )}
        {renderTextWithParentheses(service.servicesDetail)}
      </span>
      <br />
    </div>
  ))}
</div>
<span className="f6 mt1 gray">...</span>  // ❌ gray = #777 — fails 1.4.3 (see also Draft #2)
<Link color="default" href="#" onClick={...} className="f6 mt1 gray">
  {/* ❌ No role="button", no aria-label */}
</Link>
```

---

### ✅ Good Code

```tsx
// ServiceInfo.tsx — semantic list + bonus fixes
<ul className="pa0 mv1 list">
  {inclusiveServices.servicesList.map((service, index) => (
    <li key={index} className="mt1">
      <span>
        {service.servicesSign === "TICK" && (
          <Icon name="Check" className="pr2" size="small" />  // (decorative in context — see review checklist)
        )}
        {renderTextWithParentheses(service.servicesDetail)}
      </span>
      <br />
    </li>
  ))}
</ul>
<span className="f6 mt1 mid-gray">...</span>  // ✅ mid-gray = #555 — 7:1 contrast (also fixes 1.4.3)
<Link color="default" href="#" onClick={...}
  role="button"
  aria-label={m(messages, "viewDetail")}  // ✅ Explicit accessible name
  className="f6 mt1 mid-gray"
>
```

---

### 💡 Why This Fix Works

The `<ul>/<li>` pattern across all three files creates a proper parent-container/item semantic chain end-to-end: `Packages.tsx` wraps `PackageDetails.tsx` instances in `<ul>`, and `PackageDetails.tsx` renders as `<li>` — screen readers announce the full list on entry and navigate items correctly. `pa0 mv1 list` / `list pl0` Tachyons classes strip browser default bullets/padding. The `gray`→`mid-gray` swap on `<span>` and `<Link>` also incidentally fixes a WCAG 1.4.3 contrast issue (bonus find — see Draft #2 for the Tachyons color table). The `role="button"` + `aria-label` on `<Link>` ensures the CTA has an accessible name.

---

### 📋 Human Review Checklist

- [ ] Verify `<ul className="list pl0">` and `<ul className="pa0 mv1 list">` produce no visible bullets or extra spacing at all breakpoints
- [ ] Confirm `<PackageDetails>` root renders as `<li>` — verify no `<div>` siblings at the same `<ul>` level that would break `ul > li` requirements
- [ ] The `<Icon name="Check" />` inside each `<li>` is decorative (the text already conveys the service info) — add `aria-hidden="true"` if not already present (not visible in this diff)
- [ ] Verify `role="button"` on `<Link>` does not produce a `<button>` inside `<a>` — check rendered HTML
- [ ] Confirm `mid-gray` class is intended (also fixes WCAG 1.4.3 contrast — cross-reference `WA11Y-ALL-1.4.3-001.md` Variation 1)

---
