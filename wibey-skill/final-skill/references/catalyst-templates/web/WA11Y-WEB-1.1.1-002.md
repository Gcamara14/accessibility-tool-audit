# Catalyst Template: Alt Text: Informative Image Alt Text Is Not Accurate

**Template ID:** `WA11Y-WEB-1.1.1-002`
**Platform:** Web
**WCAG Criterion:** 1.1.1 Non-text Content

---

## 🛑 The Problem
The image has an `alt` attribute, but it does not accurately convey the information or function of the image. For example, using "image" or a filename as the alt text.

---

## ✅ The Fix Patterns

**❌ Bad Code:**
```html
<img src="/chart-2026.png" alt="chart.png" />
```

**✅ Good Code:**
```html
<img src="/chart-2026.png" alt="Bar chart showing a 20% increase in sales for Q1 2026" />
```


---

## 🧪 Ingested Variation

## Draft #5 — Variation of: `WA11Y-WEB-1.1.1-002`

**Ingested by:** Wibey Swarm Agent (Parallel Batch Run)
**Date:** 2026-03-20
**Ingestion Score:** +4 (i18n-sourced accessible name inaccuracy — distinct mechanism from standard img alt inaccuracy)

### Proposed Title
`Inaccurate Accessible Name: Incorrect Product Descriptor in i18n Locale Key Concatenated into Link/Button Accessible Name`

### WCAG Mapping
- **Criterion:** WCAG 1.1.1 Non-text Content + WCAG 4.1.2 Name, Role, Value
- **Platform:** Web
- **Component:** `AffirmMessageCore` promotions component — `libs/item/promotions/`
- **Extends:** `WA11Y-WEB-1.1.1-002`

### Source References
- **Jira:** https://jira.walmart.com/browse/CEPG-366913
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/181094
- **Commit:** `3966190c0e879cc3c85425b18c1d8e64e6160c97` (`ADA Incorrect alt text announced bug fix for one pay`)
- **Author:** Lakshmi Pothini (vn5942t)
- **Files Fixed:** `libs/item/promotions/src/lib/locale/messages.ts` + 6 locale YAML files

---

### 🛑 The Problem

The `oneLoans` i18n key — concatenated into the accessible name of "Learn more" links and buttons — contained the word "Loans" (and locale-specific equivalents: "Préstamos de", "Créditos", "prêts"). This created a factually incorrect accessible name that misrepresented the OnePay service:

> ❌ Announced: "Learn more, 0% APR, As low as $45/mo with **OnePay Loans**"
> ✅ Should be: "Learn more, 0% APR, As low as $45/mo with **OnePay**"

**Key insight:** The inaccuracy lived entirely in the i18n layer, not in JSX markup. No component code changed — only locale keys and message constants.

---

### ❌ Bad Code

```ts
// messages.ts
export const oneLoans = () => "OnePay Loans";

// en-US.yaml
oneLoans: "OnePay Loans"

// es-CL.yaml
oneLoans: "Créditos OnePay"

// es-MX.yaml
oneLoans: "Préstamos de OnePay"

// fr-CA.yaml
oneLoans: "prêts OnePay"

// Test assertions against the WRONG string
screen.getByRole("link", { name: "Learn more, 0% APR, As low as $45/mo with OnePay Loans" });
```

---

### ✅ Good Code

```ts
// messages.ts
export const oneLoans = () => "OnePay";

// All 6 locale YAML files
oneLoans: "OnePay"

// Test assertions now match correct accessible name
screen.getByRole("link", { name: "Learn more, 0% APR, As low as $45/mo with OnePay" });
screen.getByRole("button", { name: "Learn more, 0% APR, As low as $45/mo with OnePay" });
```

---

### 💡 Why This Fix Works

The `oneLoans` key feeds directly into a string concatenation that becomes the full accessible name of a link/button. WCAG 1.1.1 requires non-text content to accurately convey meaning. "OnePay Loans" is factually wrong — it implies a loans product. Fixing the i18n key at the source propagates the correction to all 6 locales simultaneously, with no JSX changes required.

**New ingestion pattern:** WCAG 1.1.1 inaccuracy can originate entirely in the i18n/translation layer. Audit `messages.ts` and locale YAMLs for product-name over-specification, not just `img alt` attributes.

---

### 📋 Human Review Checklist

- [ ] Confirm "OnePay" (without "Loans") is the officially approved brand name — verify with product/brand team
- [ ] Search codebase for other i18n keys containing product-descriptor over-specifications (e.g., search `messages.ts` for "Loans", "Payments", "Credit" appended to brand names)
- [ ] Verify no other locale files (pt-BR, zh-CN etc.) contain `oneLoans` variants missed in this PR
- [ ] Confirm es-MX `detailsNoInterest` wording change is intentional and brand-approved
- [ ] Promote as Variation 1 to `WA11Y-WEB-1.1.1-002.md` — i18n-sourced accessible name pattern

---
