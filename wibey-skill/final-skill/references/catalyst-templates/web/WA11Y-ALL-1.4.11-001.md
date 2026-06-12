# Catalyst Template: Color Contrast: Low Contrast Graphical Objects and User Interface Components (Border/Icon)

**Template ID:** `WA11Y-ALL-1.4.11-001`
**Platform:** Web, iOS, Android
**WCAG Criterion:** WCAG-1.4.11

---

## 🛑 The Problem
Non-text elements (e.g., icons, borders) have low contrast against the background.

**Expected Result:** Non-text elements like icons and borders should have a minimum contrast ratio of 3:1 against adjacent colors.
**Actual Result:** The icon or border contrast is below 3:1, reducing visibility.

---

## ✅ The Fix Patterns

> **Recommendation:** Increase the contrast of icons and borders to at least 3:1. Use a new Living Design Approved Color.

### Standard Implementation
```html
// Best:
        Use an LD approved color/design token. Do not use a custom hex. Design support needed to choose an accessible color.
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

> ⚠️ **1.4.11 vs 1.4.3 distinction:** WCAG 1.4.3 covers **text contrast** (4.5:1 ratio). WCAG 1.4.11 covers **non-text contrast** — graphical objects (icons, charts, star ratings) and UI components (input borders, focus indicators) — where the threshold is 3:1. Audit the element type before assuming 1.4.3.

---

## 📦 Variation 1 — WCP Rating Star Stroke-Width Specificity Failure (CSS Sibling vs Child Modifier)
**Source:** BCPA-821 / PR #173994 — `libs/design-components/wcp-rating/src/lib/wcp-rating.module.scss`

Two compounding CSS bugs caused star borders to fail the 3:1 non-text contrast threshold:
1. `.small, .medium {}` were sibling selectors instead of `&.small {}` child-modifier selectors — wrong cascade specificity, wrong stroke-width values won.
2. Filled stars (`.fill`) inside `halfFilled` state inherited a stroke because `stroke: none` was never declared, visually corrupting the star boundary.

```scss
/* ❌ BAD — sibling selectors; wrong cascade + missing stroke:none */
&.halfFilled {
  .fill { fill: $wcp-semantic-color-rating-fill-activated; }  /* ← no stroke: none */
  &.inverse .fill { fill: semantic.$color-text-inverse; }     /* ← same problem */
}
.small, .medium {         /* ← sibling of halfFilled; specificity too low */
  .fill  { stroke-width: 0.094em; }
  .empty { stroke-width: 0.078em; }
}

/* ✅ GOOD — child-modifier selectors + explicit stroke:none on filled stars */
&.halfFilled {
  .fill  { fill: $wcp-semantic-color-rating-fill-activated; stroke: none; }  /* ✅ */
  .empty { fill: none; }
  &.inverse .fill { fill: semantic.$color-text-inverse; stroke: none; }       /* ✅ */
  &.small  { .empty { stroke-width: 0.075em; } }   /* ✅ child-modifier */
  &.medium { .empty { stroke-width: 0.109em; } }   /* ✅ child-modifier */
}
&.small  { .fill { stroke-width: 0.075em; } .empty { stroke-width: 0.047em; } }
&.medium { .fill { stroke-width: 0.109em; } .empty { stroke-width: 0.078em; } }
```

**Stroke-width reference:**
| Size | Fill stroke | Empty stroke |
|---|---|---|
| `small` | `0.075em` | `0.047em` |
| `medium` | `0.109em` | `0.078em` |

**Rule:** In SCSS modules with size variants, always use `&.small` / `&.medium` child-modifier selectors, never sibling `.small, .medium {}` rules — sibling selectors lose specificity battles against ancestor rules. Always add `stroke: none` to `.fill` elements inside `halfFilled` state to prevent stroke inheritance from corrupting the filled-star boundary.
