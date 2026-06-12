# Catalyst Template: Keyboard: General Interactive Element Not Keyboard Operable or Focusable

**Template ID:** `WA11Y-WEB-2.1.1-001`
**Platform:** Web
**WCAG Criterion:** WCAG-2.1.1

---

## 🛑 The Problem
An element is unable to be activated with a keyboard. It cannot be operated using keyboard inputs, hindering accessibility for keyboard users.

**Expected Result:** All focusable elements should be operable using keyboard inputs (e.g., Enter or Space keys).
**Actual Result:** The element either does not receive keyboard focus, and it does not respond to keyboard interactions.

---

## ✅ The Fix Patterns

> **Recommendation:** Ensure that all focusable elements have appropriate keyboard event handlers. We recommend just using a standard HTML5 element or an LD component. As a last resort, if an HTML5 element is not available, you can build custom interactive elements, implement `keydown` or `keypress` listeners to handle activation via Enter or Space keys. Alternatively, use semantic HTML elements (e.g., &lt;button&gt;, &lt;a&gt;) which inherently support keyboard interactions.

### Standard Implementation
```html
// Best: Use a Native HTML5 Element
        <button>Add to Cart</button>
        
        // Last Resort: tabindex but also needs a keyboard keypress/click event handler.
        <div role="button" tabindex="0">Add to Cart</div>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.
