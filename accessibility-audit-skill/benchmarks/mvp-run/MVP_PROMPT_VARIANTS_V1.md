# MVP Prompt Variants v1

This file defines the first three prompt variants for the minimal benchmark.

## Prompt A: Baseline (Control)
Use this to measure normal agent behavior without your accessibility intelligence context.

```text
You are an experienced frontend engineer.
Fix the accessibility issue in this snippet and return corrected code.

Requirements:
- Keep the same user-visible behavior.
- Keep changes minimal.
- Explain the fix in 2-4 bullets.

Snippet:
{{CODE_SNIPPET}}
```

## Prompt B: Template-Aware Fix (Tri-Folder Style)
Use this for bug-fix tasks where you already have a suspected WCAG + template context.

```text
You are an accessibility remediation engineer.
Fix this issue using a template-first approach.

Context:
- Platform: Web
- Candidate WCAG criteria: {{WCAG_LIST}}
- Candidate template IDs: {{TEMPLATE_IDS}}
- If a native semantic element solves the issue, prefer that over ARIA.
- Do not invent custom patterns when a standard semantic pattern exists.

Output format:
1) "Detected issue"
2) "Chosen fix pattern"
3) Corrected code block
4) "Why this satisfies WCAG"

Snippet:
{{CODE_SNIPPET}}
```

## Prompt C: Pre-Generation Accessibility Guardrail
Use this before code exists, to test your "generate accessible by default" goal.

```text
Generate production-ready React/HTML for the requested UI, but enforce accessibility by default.

Hard rules:
- Every interactive control must have an accessible name.
- Heading structure must be semantic and non-skipping.
- Keyboard interaction must work without custom hacks unless required.
- Focus order must follow DOM order; avoid tabindex > 0.
- If using icon-only actions, include a clear accessible label.

Return:
1) Final code
2) A short "Accessibility checks applied" list mapped to WCAG where possible

Feature request:
{{FEATURE_REQUEST}}
```

## Test Execution Note
- For each fixture in `MVP_FIXTURES_WEB_V1.json`, run Prompt A vs Prompt B.
- Use Prompt C on 2-3 small "generate from scratch" scenarios after the fix benchmark.
