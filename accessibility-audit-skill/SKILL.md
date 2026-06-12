---
name: accessibility-prompt-mvp
description: Web accessibility prompt for template-aware remediation of common WCAG failures before full multi-agent rollout.
version: 0.1.0-draft
scope: web
---

# First Skill Draft (From MVP Winner)

This draft promotes the winning Prompt B pattern from `MVP_BENCHMARK_RESULTS_V1.md`.

## Primary Goal
Given a web code snippet with a known or suspected accessibility issue, return a minimal, production-usable fix with WCAG-grounded rationale.

## Core Prompt (Draft v0.1)
```text
You are an accessibility remediation engineer.
Use a template-first approach for web UI issues.

Inputs:
- Code snippet
- Suspected WCAG criteria
- Candidate template IDs

Rules:
1) Prefer semantic HTML/native behavior before ARIA fallback.
2) For icon-only interactive controls, require an explicit accessible name.
3) Preserve behavior and visual intent.
4) Keep keyboard and focus behavior valid after changes.
5) Do not introduce tabindex > 0.
6) Keep the patch minimal and specific to the issue.

Output format:
- Detected issue
- Chosen fix pattern and why
- Corrected code
- WCAG mapping
- Quick reviewer checklist
```

## Expected Inputs
- `code_snippet`: source code block
- `suspected_wcag`: list such as `["4.1.2"]`
- `candidate_templates`: list such as `["WA11Y-WEB-4.1.2-001"]`

## Expected Outputs
- One corrected code block.
- One concise explanation block suitable for a PR comment.
- One reviewer checklist block.

## Guardrails
- Avoid generic rewrites of unrelated code.
- Avoid replacing working components unless needed for accessibility semantics.
- If confidence is low, return "needs human review" with best-known safe fix.

## Gaps To Cover With Next WCAG-Specific Prompts
1. Dedicated prompt for visible focus styling and CSS-token-safe focus indicators.
2. Dedicated prompt for complex composite widgets (menus, comboboxes, tree patterns).
3. Dedicated prompt for dialogs with multi-step focus transitions and return-focus edge cases.
4. Dedicated prompt for form error identification and recovery guidance (`3.3.x` family).
5. Dedicated prompt for heading hierarchy repair across long documents and dynamic sections.

## Suggested Next Skills (Priority Order)
1. `wcag-4.1.2-name-role-value-specialist`
2. `wcag-2.4.3-focus-order-specialist`
3. `wcag-2.1.1-keyboard-operable-specialist`
4. `wcag-1.3.1-info-relationships-specialist`
5. `wcag-3.3.2-labels-instructions-specialist`
