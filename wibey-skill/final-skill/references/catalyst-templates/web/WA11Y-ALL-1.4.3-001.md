# Catalyst Template: Color Contrast: Low Contrast Text

**Template ID:** `WA11Y-ALL-1.4.3-001`
**Platform:** Web, iOS, Android
**WCAG Criterion:** WCAG-1.4.3

---

## 🛑 The Problem
Text contrast is too low, making it difficult to read.

**Expected Result:** Text should have a minimum contrast ratio of 4.5:1, ideally 7:1 for improved readability.
**Actual Result:** The contrast between text and background is below 4.5:1.

---

## ✅ The Fix Patterns

> **Recommendation:** Use an Living Design approved color. We need to increase the contrast ratio to at least 4.5:1, and aim for 7:1 if possible for better accessibility. Use a new approved Living Design Compliant Color.

### Standard Implementation
```html
// Best:
        Use an LD approved color/design token. Do not use a custom hex. Design support needed to choose an accessible color.
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

## Variation 1 — Tachyons CSS `gray` → `dark-gray` (CEPG-355995)

**Context:** `libs/item/` OOS messaging (and any Tachyons-based component in the monorepo)

### 🛑 Problem
Tachyons class `gray` = `#777777` → **~4.48:1 contrast** against white. Fails WCAG 1.4.3 by a razor-thin margin for normal-weight text.

### ❌ Bad Code
```tsx
<div className="b gray pr3">{selectedOptionOOS}</div>
<div className="gray pr3 f6">{moreOptionsAvailable}</div>
```

### ✅ Good Code
```tsx
// dark-gray = #333333 = 12.63:1 contrast ratio — well above 4.5:1 minimum
<div className="b dark-gray pr3">{selectedOptionOOS}</div>
<div className="dark-gray pr3 f6">{moreOptionsAvailable}</div>
```

### Tachyons Color Reference
| Class | Hex | Contrast vs. White | WCAG 1.4.3 |
|---|---|---|---|
| `gray` | `#777777` | ~4.48:1 | ❌ FAILS |
| `mid-gray` | `#555555` | ~7.0:1 | ✅ PASSES |
| `dark-gray` | `#333333` | ~12.63:1 | ✅ PASSES |

> ⚠️ **Caveat:** Only apply this swap for **foreground text color**. If `gray` is used as background or border context, criterion is WCAG 1.4.11 (3:1 threshold), not 1.4.3.

> 🤖 **Automation-safe:** `gray` → `dark-gray` in a `className` string containing no `bg-` prefix is regex-safe for bulk fixing.


---

## 🧪 Ingested Variation

## Draft #2 — Variation of: `WA11Y-ALL-1.4.3-001`

**Ingested by:** Wibey (Step 5 Self-Doc Loop — Concrete Variation)
**Date:** 2026-03-20
**Ingestion Score:** +3 (Concrete framework-specific implementation of an existing thin template)

### Proposed Title
`Low Contrast Text: Tachyons CSS gray → dark-gray Class Swap (OOS/Status Messaging)`

### WCAG Mapping
- **Criterion:** WCAG 1.4.3 Contrast (Minimum)
- **Platform:** Web
- **Component:** Tachyons CSS utility classes (used across `libs/item/` and other Walmart web libs)
- **Extends:** `WA11Y-ALL-1.4.3-001` (currently skeleton-only — no code examples)

### Source References
- **Jira:** https://jira.walmart.com/browse/CEPG-355995
- **PR:** https://gecgithub01.walmart.com/walmart-web/walmart/pull/175800
- **Commit:** `e02245e81fc0` (`fix(item): Low Contrast Between Text and Background`)
- **Author:** Anil Pothala (APothala@walmartlabs.com)
- **File Fixed:** `libs/item/buy-box/src/lib/add-to-cart-section/atc-oos.tsx`

---

### 🛑 The Problem

The Out-of-Stock (OOS) messaging section in `AddToCartOOS` used Tachyons CSS class `gray` for text color. In Walmart's Tachyons scale, `gray` maps to `#777777`, which achieves approximately **4.48:1 contrast ratio** against a white background — just below the WCAG 1.4.3 minimum of 4.5:1 for normal-weight text.

The fix replaces `gray` with `dark-gray` (`#333333`), which achieves **12.63:1** — well above both the minimum (4.5:1) and enhanced (7:1) thresholds.

**Expected:** Text contrast ≥ 4.5:1 against background.
**Actual:** `gray` = `#777777` = ~4.48:1 — fails by a razor-thin margin for normal text.

> ⚠️ **Key Insight:** `gray` in Tachyons is a **known failing color** for normal-weight text on white. Any Tachyons component using `gray` as a text color class is a WCAG 1.4.3 candidate. `dark-gray` is the LD-approved replacement.

---

### ❌ Bad Code

```tsx
// WCAG 1.4.3 VIOLATION: Tachyons 'gray' class (#777) fails 4.5:1 contrast on white
if (showSelectedOptionOOSMsg) {
  return (
    <div>
      <div className="b gray pr3">{selectedOptionOOS}</div>
      <div className="gray pr3 f6">{moreOptionsAvailable}</div>
    </div>
  );
}
```

---

### ✅ Good Code

```tsx
// FIXED: Tachyons 'dark-gray' class (#333) achieves 12.63:1 contrast ratio
if (showSelectedOptionOOSMsg) {
  return (
    <div>
      <div className="b dark-gray pr3">{selectedOptionOOS}</div>
      <div className="dark-gray pr3 f6">{moreOptionsAvailable}</div>
    </div>
  );
}
```

---

### 💡 Why This Fix Works

Tachyons is a functional CSS framework used heavily in Walmart's monorepo. Its color classes are semantic names, not contrast-safe guarantees:

| Tachyons Class | Hex | Contrast vs. White | WCAG 1.4.3 (4.5:1) |
|---|---|---|---|
| `gray` | `#777777` | ~4.48:1 | ❌ FAILS |
| `dark-gray` | `#333333` | ~12.63:1 | ✅ PASSES |
| `mid-gray` | `#555555` | ~7.0:1 | ✅ PASSES |
| `light-gray` (bg) | `#eee` | — | (background use only) |

The fix is a one-word class change per affected element. No LD component API is involved — this is a pure Tachyons token swap, making it a strong candidate for **Tier 1 Automated Fix** (regex-safe).

---

### 🤖 Tier 1 Automation Potential

This is an excellent candidate for automated detection + fix:

```bash
# Detection: grep for 'gray' as a text color class in className strings
grep -rn '"[^"]*\bgray\b[^"]*"' libs/ --include="*.tsx" --include="*.ts"

# Automated fix (safe — 'gray' as a standalone text color class)
# sed 's/\bgray\b/dark-gray/g' — but verify visually; 'gray' may appear as bg- prefix context
```

> ⚠️ **Automation Caveat:** Only swap `gray` → `dark-gray` when it is a **foreground text color** class. If `gray` appears in a background context (e.g., `bg-gray`) or as part of a border, it falls under WCAG 1.4.11 (Non-text Contrast) with a 3:1 threshold — the swap is still safe but the criterion changes.

---

### 📋 Human Review Checklist

- [ ] Add this as Variation 1 to `final-skill/catalyst-templates/web/WA11Y-ALL-1.4.3-001.md` (currently skeleton-only)
- [ ] Cross-reference with `WA11Y-ALL-1.4.11-001` to distinguish text vs. non-text contrast cases
- [ ] Consider a monorepo-wide `gray` → `dark-gray` sweep as a bulk accessibility fix sprint
- [ ] Update `teams/Discovery/item-page.md` with Tachyons pitfall (done — see self-doc loop)

---
