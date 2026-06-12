# Catalyst Template: Sensory Characteristics: Strikethrough Pricing Without Text Alternative

**Template ID:** `WA11Y-WEB-1.3.3-001`
**Platform:** Web
**WCAG Criterion:** WCAG 1.3.3 Sensory Characteristics

---

## 🛑 The Problem

Visual styling (strikethrough, colour, shape) used to convey pricing meaning — "was price" vs "now price" — has no text alternative for screen readers. `text-decoration: line-through` is purely visual; AT reads raw text without announcing the strikethrough.

**Expected Result:** Screen reader announces "Was $12.98 per month" (old price) and "Now $6.99" (new price) so pricing context is clear.
**Actual Result:** Screen reader announces "$12.98" and "$6.99" with no indication which is old/new/discounted.

---

## ✅ The Fix Patterns

> **Recommendation:** Add a `WcpVisuallyHidden` sibling element with a "Was/Now" prefix. Apply `aria-hidden="true"` to the visual strikethrough span to prevent duplicate announcements.

### Standard Implementation — WcpVisuallyHidden "Was/Now" Pattern
```tsx
import { WcpVisuallyHidden } from "@walmart-web/design-components-wcp-visually-hidden";

const isStrikethrough =
  String(section.textFontStyle).toLowerCase() === "strikethrough";
const text = section.customTenureDetailLine;

// Build accessible text prefix
const adaText = isStrikethrough
  ? `Was ${text.replace("/", " per ")}`   // "$12.98/month" → "Was $12.98 per month"
  : section.textColor
    ? `Now ${text}`                         // → "Now $6.99"
    : text;

// Hidden text for AT
if (text.trim()) {
  nodes.push(
    <WcpVisuallyHidden key={`ada-${text}`}>{adaText}</WcpVisuallyHidden>
  );
}

// Visual span — hidden from AT (WcpVisuallyHidden already announces it)
nodes.push(
  <span
    key={text}
    style={{ textDecoration: isStrikethrough ? "line-through" : "none" }}
    aria-hidden="true"
  >
    {text}
  </span>
);
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Search for `text-decoration.*line-through`, Tachyons `strike` class, or `UNSAFE_className="strike"` — any of these are candidates.
2. Check if the strikethrough element already has a `WcpVisuallyHidden` sibling with "Was"/"Original"/"Save" prefix text. If yes, no action needed.
3. Add `WcpVisuallyHidden` with "Was [price]" prefix before the visual span.
4. Add `aria-hidden="true"` to the visual strikethrough span to prevent double-announcement.
5. Normalise slash separators: `"$12.98/month"` → `"$12.98 per month"` for natural speech.

---

## 📦 Variation 1 — WPlus Splash Modal Pricing Strip
**Source:** PR #181817 — `libs/wplus/splash-modal/src/lib/default-plan-view.tsx`
**Author:** Rakesh Bayireddy | **Commit:** `a2061a9e6fc`
**Date:** 2026-04-01

Dynamic pricing lines rendered from CMS data (`section.customTenureDetailLine`) where `textFontStyle === "strikethrough"` indicates "was price" and `textColor` present indicates "now price".

```tsx
// ❌ BAD — no AT context for strikethrough
customLineNode.push(
  <span key={section.customTenureDetailLine}
    style={{ textDecoration: isStrikethrough ? "line-through" : "none" }}>
    {section.customTenureDetailLine}
  </span>
);

// ✅ GOOD — WcpVisuallyHidden sibling + aria-hidden on visual span
const isStrikethrough = String(section.textFontStyle).toLowerCase() === "strikethrough";
const text = section.customTenureDetailLine;
const adaText = isStrikethrough
  ? `Was ${text.replace("/", " per ")}`
  : section.textColor ? `Now ${text}` : text;

if (text.trim()) {
  customLineNode.push(
    <WcpVisuallyHidden key={`ada-${text}`}>{adaText}</WcpVisuallyHidden>
  );
}
customLineNode.push(
  <span key={text} style={{ textDecoration: isStrikethrough ? "line-through" : "none" }}
    aria-hidden="true">{text}</span>
);
```
