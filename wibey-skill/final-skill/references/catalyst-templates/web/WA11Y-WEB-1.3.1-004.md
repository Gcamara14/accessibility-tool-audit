# Catalyst Template: Info: Form Field Grouping - Use HTML5 Fieldset and Legend

**Template ID:** `WA11Y-WEB-1.3.1-004`
**Platform:** Web
**WCAG Criterion:** WCAG-1.3.1

---

## 🛑 The Problem
Form fields are not properly grouped, making it difficult for screen reader users to understand the relationship between fields.

**Expected Result:** Related form fields should be grouped using &lt;fieldset&gt; with a corresponding &lt;legend&gt; to describe the group.
**Actual Result:** Form fields are scattered or grouped using non-semantic elements like &lt;div&gt; without proper labels, causing confusion.

---

## ✅ The Fix Patterns

> **Recommendation:** Use semantic HTML elements &lt;fieldset&gt; to group related form fields and &lt;legend&gt; to provide a descriptive label for the group. This helps screen readers convey the relationship between fields to users.

### Standard Implementation
```html
// Best: Use LD Form Group
        <FormGroup>
        
        // Good: Native HTML5 Fieldset
        <fieldset><legend>Hello World</legend></fieldset>
        
        // Last Resort: custom aria role of group with label
        <div role="group" aria-label="Billing Address">
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

## 📦 Variation 1 — Unlabelled `role="radiogroup"` Fixed via `VisuallyHidden` + `aria-labelledby` (Protection Plans)
**Source:** CEPG-330702 / PR #163703 — `libs/account/protection-plans-page/src/lib/protection-plans-available-plans-group.tsx`

A `FormGroup` with `role="radiogroup"` had no accessible name. Fix: inject a `VisuallyHidden` span above the group, reference it via `aria-labelledby`. Use `m(messages, ...)` for i18n.

```tsx
// ❌ BAD — radiogroup with no accessible name; screen reader: "group" (no label)
<FormGroup role="radiogroup">
  {planList?.map((plan, index) => { /* ... */ })}
</FormGroup>

// ✅ GOOD — VisuallyHidden span provides the group label via aria-labelledby
import { VisuallyHidden } from "@walmart-web/livingdesign-components";

<div className="overflow-y-auto mt3">
  <VisuallyHidden>
    <span id="selectPlanHeading" className="sr-only">
      {m(messages, "selectAPlan")}
    </span>
  </VisuallyHidden>
  <FormGroup role="radiogroup" aria-labelledby="selectPlanHeading">
    {planList?.map((plan, index) => { /* ... */ })}
  </FormGroup>
</div>
```

**Why:** `role="radiogroup"` requires an accessible name; without it, AT announces only "group" with no context. `VisuallyHidden` keeps the label off-screen visually while keeping it in the accessibility tree. Always route label text through `m(messages, ...)` for localization.

---

## 📦 Variation 2 — Radio Inputs with Unique Per-Item `name` Values Break Programmatic Grouping (Language Selector)
**Source:** WSC-3897 / PR #158092 — `libs/ui/global-header/menu/src/lib/language-toggle.tsx`

Each radio received `name={loc}` (a unique locale string like `"en"`, `"es"`), making each its own independent group of one. Fix: all radios in the group share a static `name="selectLanguage"`. Also add `aria-describedby` pointing at the section heading for richer context.

```tsx
// ❌ BAD — unique name per radio; each is its own independent group
{locales.map((loc) => (
  <Radio
    value={loc}
    label={languageNames[loc]}
    name={loc}              // ← "en", "es", etc. — broken grouping
    checked={loc === selectedLocale}
    onChange={...}
  />
))}

// ✅ GOOD — shared static name; aria-describedby adds heading context
{locales.map((loc) => (
  <Radio
    value={loc}
    label={languageNames[loc]}
    name="selectLanguage"   // ← same for every radio in the group
    checked={loc === selectedLocale}
    onChange={...}
    radioProps={{ "aria-describedby": "language-toggle-header" }}
  />
))}

// Section heading must carry the matching id:
<h2 id="language-toggle-header" className="b f3 sans-serif mv0">
  {selectLanguage}
</h2>
```

**Rule:** Never derive `name` from a per-item value (e.g. `name={itemId}` or `name={loc}`). Always use a single static string shared by all radios in the group. The `name` attribute is what tells the browser and AT that the inputs are mutually exclusive.
