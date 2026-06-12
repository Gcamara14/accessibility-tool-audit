# Learning: Why Vanilla HTML is Not Enough for WCAG Rule Data

**Date:** March 2026
**Context:** During the V4 A/B testing of the Developer Skill, the AI fell back to reading `WCAG-Rules/2.4.4-examples.md` because a specific Walmart Catalyst template was missing. The AI noted that the examples provided "were not useful for this scenario."

## The Problem: The 1999 HTML Trap
The foundational `WCAG-Rules` directory was seeded with textbook W3C examples. For instance, WCAG 2.4.4 (Link Purpose) likely contained examples like:
```html
❌ Bad: <a href="/news">Click here</a>
✅ Good: <a href="/news">Read the Q4 Financial Report</a>
```

However, enterprise applications run on React. The bug the AI was trying to fix looked like this:
```tsx
<a aria-label={`View all ${configs?.title}`}>View all</a>
```
Because `configs.title` was `undefined`, it rendered as `aria-label="View all, undefined"`. The basic HTML examples in our knowledge base did absolutely nothing to prepare the AI for modern JSX state-management bugs, template literal coercions, or conditional rendering traps.

## The Solution: React Saturation via The Factory
To make the Layer 3 Fallback Brain actually useful for an enterprise AI agent, the foundational WCAG rules must be saturated with framework-specific edge cases.

We updated `FACTORY_SKILL.md` (Step 5: The Self-Documenting Loop). 
Now, whenever the Factory Agent ingests a bug that *does not* use a specific internal design system component (i.e., it is a generic codebase bug), it will route that fix directly into the `references/WCAG-Rules/[rule]-examples.md` file. 

Over time, our base WCAG rules will transform from simple W3C textbook examples into a massive library of complex, real-world React/Swift/Kotlin anti-patterns, making the AI's fallback reasoning incredibly powerful.
