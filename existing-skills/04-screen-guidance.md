# Prompt 4 — Screen-Level A11y Guidance

This is a **static checklist** — no AI processing required. Place once per screen/page.
It covers holistic requirements that don't belong to any individual element.

---

## Checklist Content

```
📋 Screen A11y Guidance
Name/Role/State: every interactive element must expose a name, role, and state

🎯 Universal Focus Requirements
LOAD: do not move focus
OPEN: move focus only for user-initiated context changes
UPDATE: preserve focus during async or minor updates
EXIT/RESET: restore focus to trigger or next logical step
NEW CONTENT: move focus only when new relevant content appears outside current context
NEVER: reset focus to <body>, lose focus, or focus meaningless elements
STATUS: use aria-live
MODAL: trap focus only for true modals

ACCESSIBLE NAME CHECKS:
□ Not Empty — name has a value
□ Descriptive — clearly describes the function or destination
□ No Generic Labels — avoid "Learn More" or "Click Here" without context
□ Unique — distinct from all other names on the same screen
□ No Role/Type In Name — don't include "button" or "link" in the name
REQUIRED: yes
```

---

## Usage with Playwright

Attach this as a persistent annotation/comment to the top of each scanned page report.
It is not generated dynamically — embed it verbatim in your scan output as a screen-level section.

When using with an LLM pass, you can ask the model to evaluate the live page against these criteria:

```
You are an accessibility auditor. Review the following page against this screen-level checklist
and report any violations or missing implementations:

[paste checklist above]

For each checklist item, report:
- PASS / FAIL / NEEDS REVIEW
- Specific elements or patterns that are the evidence for your assessment
- Recommended fix if FAIL
```
