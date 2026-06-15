# Accessibility Agents Leverage Plan

## Purpose

This plan investigates how to leverage `accessibility-agents-main` inside this project without losing the parts we have already built: deterministic Playwright scans, visual AI gap analysis, WalmartLLM execution, timestamped scanner runs, evidence-backed confidence scoring, and a WCAG prompt tracker.

The goal is twofold:

1. **Audit existing pages and code more thoroughly** by adopting the Accessibility Agents specialist model.
2. **Prevent accessibility bugs during AI generation** by adding an enforced pre-generation and pre-edit review workflow.

## Source Repo Summary

Downloaded repo: `accessibility-agents-main/`

Upstream: `https://github.com/Community-Access/accessibility-agents/tree/main`

The repo describes a multi-platform accessibility agent ecosystem for Claude Code, GitHub Copilot, Gemini, Codex, and MCP-compatible clients. Its core claim is that AI coding tools forget accessibility unless review is delegated to focused agents and enforced through workflow hooks.

Key source files reviewed:

- `accessibility-agents-main/README.md`
- `accessibility-agents-main/docs/architecture.md`
- `accessibility-agents-main/docs/agents/README.md`
- `accessibility-agents-main/docs/agents/accessibility-lead.md`
- `accessibility-agents-main/docs/agents/alt-text-headings.md`
- `accessibility-agents-main/docs/agents/forms-specialist.md`
- `accessibility-agents-main/docs/prompts/README.md`
- `accessibility-agents-main/docs/advanced/advanced-scanning-patterns.md`
- `accessibility-agents-main/docs/guides/playwright-high-impact-checks.md`

## What They Have That We Should Leverage

| Pattern | Why It Matters | How We Should Use It |
|---|---|---|
| `accessibility-lead` orchestrator | Central router that decides which specialists to invoke. | Upgrade our `orchestrator/SKILL_V1.md` from WCAG-only routing into a specialist-aware run planner. |
| Specialist boundaries | Prevents one giant prompt from giving shallow generic advice. | Split our scanner prompts by domains: headings/images, forms, keyboard, ARIA, contrast, modals, tables, live regions, links. |
| Hook enforcement model | Their docs argue instructions are suggestions, hooks are enforcement. | Add a future Cursor hook / pre-generation gate so UI edits cannot proceed without an accessibility plan or review marker. |
| Parallel audit groups | Full web audit runs specialists in grouped parallel streams. | Run deterministic scans first, then parallel AI specialist passes, then synthesize into one report. |
| Source citation policy | Accessibility advice must cite authoritative sources. | Require every AI finding/fix recommendation to include WCAG/APG/Deque/WebAIM citation fields when possible. |
| High-impact Playwright checks | Runtime behavior catches what static review misses. | Extend our Playwright harness beyond headings/images to keyboard traps, focus order, viewport overflow, touch targets, and axe serious/critical issues. |
| PR review agent pattern | Diffs, confidence, delta tracking, and inline findings. | Later connect scanner output to PR review: changed files -> relevant WCAG prompts -> markdown/HTML report -> issue/Jira template. |
| Prompt library | One-click audit, fix, compare, CSV export, document audit workflows. | Use as inspiration for scanner commands: audit page, audit all pages, compare runs, export findings, fix mode. |
| Safe additive installation | Does not overwrite user files; uses manifest/markers. | Mirror this in our repo: generated reports stay ignored, prompts are versioned, migrated external assets are clearly separated. |

## What We Should Not Copy Blindly

- Their repo targets **WCAG 2.2 AA** and broader domains. Our current tracker intentionally scopes to **WCAG 2.1 A/AA** for the first scanner system.
- Their docs emphasize platform installation across Claude, Copilot, Gemini, Codex, and MCP. We should not adopt every platform surface yet.
- Their agent count is large. We should avoid importing all 79+ agents before we have a stable evaluator and scoring schema.
- Their hook enforcement is written for Claude Code. In this Cursor workspace, we should translate the idea into Cursor-compatible hooks/rules only after validating the workflow manually.
- Their agents are mostly advisory. Our system should keep deterministic DOM/Playwright evidence as the first layer, then use AI for visual gaps, reasoning, and fix planning.

## Recommended Architecture For This Project

The best approach is a hybrid:

```text
User request / page / code diff / design
  -> Scanner Orchestrator
  -> Evidence Collectors
       - DOM extraction
       - Playwright screenshot
       - computed styles
       - axe/high-impact runtime checks
       - code diff / component metadata
  -> Specialist Prompt Planner
       - headings/images
       - forms
       - keyboard/focus
       - ARIA/name-role-value
       - contrast/visual
       - tables
       - modals/live regions
       - links/content clarity
  -> Parallel Specialist Runs
  -> Evidence Reconciliation
       - DOM evidence
       - screenshot bbox
       - code selector/path
       - confidence score
       - source citation
  -> Unified Report
       - original screenshot
       - annotated screenshot
       - table of findings
       - dialogs
       - WCAG mapping
       - fix recommendations
  -> Prevention Loop
       - update prompts
       - update templates
       - update PR/Jira guidance
       - add regression cases
```

## Specialist Mapping

| Accessibility Agents Specialist | Our Current / Future Prompt | WCAG 2.1 A/AA Coverage | Evidence Needed |
|---|---|---|---|
| `accessibility-lead` | `orchestrator/SKILL_V1.md` | All selected criteria | Page type, code diff, DOM summary, screenshot, available prompts |
| `alt-text-headings` | `sub-skills/headings/SKILL_V1.md` + `sub-skills/images/SKILL_V1.md` | 1.1.1, 1.3.1, 1.4.5, 2.4.2, 2.4.6, 3.1.1 | DOM headings/images, screenshot, bboxes, nearest DOM text |
| `forms-specialist` | New `sub-skills/forms/SKILL_V1.md` | 1.3.1, 1.3.5, 3.3.1, 3.3.2, 3.3.3, 3.3.4 | Inputs, labels, fieldsets, errors, autocomplete, validation states |
| `keyboard-navigator` | New `sub-skills/keyboard-focus/SKILL_V1.md` | 2.1.1, 2.1.2, 2.4.3, 2.4.7 | Tab sequence, focus visibility screenshots, trap detection |
| `aria-specialist` | New `sub-skills/name-role-value/SKILL_V1.md` | 4.1.2, plus ARIA-related 1.3.1 | Roles, names, states, attributes, custom widgets |
| `contrast-master` | New `sub-skills/contrast/SKILL_V1.md` | 1.4.1, 1.4.3, 1.4.11 | Computed colors, backgrounds, focus rings, screenshot samples |
| `modal-specialist` | New `sub-skills/modals-overlays/SKILL_V1.md` | 2.1.1, 2.1.2, 2.4.3, 4.1.2 | Dialog roles, focus trap, escape behavior, focus return |
| `live-region-controller` | New `sub-skills/live-regions/SKILL_V1.md` | 4.1.3, 3.2.1, 3.2.2 | Dynamic updates, toasts, loading state, search results |
| `tables-data-specialist` | New `sub-skills/tables/SKILL_V1.md` | 1.3.1 | Table headers, captions, scope, grids, sortable controls |
| `link-checker` | New `sub-skills/links/SKILL_V1.md` | 2.4.4, 2.4.9 if later AAA, 3.2.4 | Link text, context, repeated names, new-window behavior |
| `testing-coach` | New `docs/MANUAL_TESTING_PROTOCOL.md` | Cross-cutting | Keyboard-only, VoiceOver/NVDA scripts, human verification checklist |

## Workflow 1: Full Accessibility Audit

Use this workflow when auditing existing pages such as `broken-pages-for-testing/page1.html` through `page10.html`.

### Phase 0: Audit Setup

- Input target: one page, multiple pages, component folder, or live URL.
- Assign run id: timestamped folder under `accessibility-audit-skill/scanner-runs/`.
- Select scope:
  - `wcag_version`: `2.1`
  - `levels`: `A`, `AA`
  - `mode`: `audit`
  - `evidence`: `DOM`, `screenshot`, `computed styles`, `runtime behavior`, `code`
- Record metadata:
  - page path / URL
  - viewport
  - backend model
  - scanner version
  - prompt versions

### Phase 1: Deterministic Evidence Collection

Run Playwright before any AI prompt.

Collect:

- DOM headings with selector, text, level, bbox, computed font size/weight.
- DOM images/icons/emojis/charts with selector, accessible name, alt, role, bbox.
- Interactive elements with name, role, state, tabindex, disabled state, href/button type.
- Forms with labels, descriptions, errors, required/autocomplete, fieldset/legend.
- Tables with captions, headers, scope, grid roles, sortable columns.
- Landmarks and page metadata: title, `lang`, main/nav/header/footer regions.
- Focus traversal snapshot: first N tab stops, active element sequence, visible focus indicator.
- Contrast candidates: text foreground/background, component borders, focus ring colors.

Why this matters:

- Deterministic evidence is faster, cheaper, and more reliable than asking the model to rediscover what the DOM already knows.
- AI visual passes should explain gaps, not replace DOM evidence.

### Phase 2: Orchestrator Run Planning

The orchestrator should inspect the deterministic evidence and output a run plan:

```json
{
  "recommended_runs": [
    {
      "prompt": "headings",
      "wcag": ["1.3.1", "2.4.6"],
      "reason": "DOM contains headings and visual heading candidates."
    },
    {
      "prompt": "images",
      "wcag": ["1.1.1", "1.4.5"],
      "reason": "DOM contains img, svg, canvas, and chart-like visual elements."
    }
  ],
  "skipped_criteria": [
    {
      "wcag": "1.2.2",
      "reason": "No prerecorded video detected."
    }
  ],
  "needs_human_triage": [
    {
      "wcag": "2.2.1",
      "reason": "Timeout behavior cannot be confirmed from static evidence."
    }
  ]
}
```

### Phase 3: Specialist Prompt Execution

Run specialist prompts in groups inspired by `accessibility-agents-main/docs/agents/README.md`.

Group 1: Structural and semantic

- Headings/images/landmarks
- Forms
- Tables
- Links

Group 2: Interaction behavior

- Keyboard/focus
- ARIA/name-role-value
- Modals/overlays
- Live regions

Group 3: Visual/accessibility design

- Contrast
- Focus visible
- Reflow/viewport
- Images of text

Each specialist must return:

- `finding_id`
- `wcag`
- `criterion`
- `status`: `pass`, `fail`, `needs_review`
- `severity`: `critical`, `high`, `medium`, `low`
- `confidence`
- `evidence_type`
- `selector`
- `bbox`
- `dom_evidence`
- `visual_evidence`
- `source_citation`
- `suggested_fix`
- `human_review_required`

### Phase 4: Evidence Reconciliation

Every AI finding must be reconciled with available evidence:

- If AI says text exists, verify nearest DOM text.
- If AI gives bbox, find nearest DOM element/text node.
- If selector exists, verify it still resolves.
- If screenshot shows visual issue but DOM mismatch exists, preserve the finding but mark evidence as `AI visual + DOM mismatch`.
- Keep separate scores:
  - `visual_confidence`
  - `dom_match_confidence`
  - `final_confidence`

Recommended scoring:

| Case | Visual Confidence | DOM Match | Final Confidence |
|---|---:|---|---:|
| Deterministic DOM pass/fail | n/a | exact | 95-99 |
| AI visual finding + exact DOM text | 85-95 | exact | 85-95 |
| AI visual finding + nearby DOM text | 80-92 | nearby | 75-88 |
| AI visual finding + weak DOM match | 75-90 | weak | 65-78 |
| AI visual finding + no DOM match | 60-85 | none | 50-70 |
| AI invented/summarized text | variable | mismatch | keep finding, label as mismatch, require human review |

### Phase 5: Unified Report

Continue using our current report direction:

- Original screenshot.
- Annotated screenshot.
- Findings table.
- Dialog with full evidence.
- Raw model response.
- DOM evidence.
- Confidence details.
- WCAG mapping.

Add:

- Specialist source column.
- Source citation column.
- Fix recommendation preview.
- Human review status.
- Exportable JSON and CSV.
- Compare-run summary for old vs new scan.

### Phase 6: Audit Output

Each audit run should produce:

```text
scanner-runs/
  web-audit/
    2026-06-15T...
      review.html
      findings.json
      findings.csv
      summary.md
      screenshots/
      raw/
      prompts/
```

The report should include:

- Total issues by severity.
- Total issues by WCAG.
- Total issues by specialist.
- Pass/fail/needs-review counts.
- Top systemic patterns.
- Page-specific findings.
- Suggested Jira bug template entries.
- Prompt quality notes: where the model hallucinated, missed, or needed better evidence.

## Workflow 2: Pre-Generation Guardrail

Use this when the user asks an AI agent to build a UI, component, screen, form, dashboard, modal, table, navigation, or chart.

### Phase 0: Generation Request Classification

Before generating code, classify the request:

| Request Feature | Required Specialists |
|---|---|
| Any UI | keyboard/focus + name-role-value |
| Images/icons/charts | headings/images |
| Forms/inputs/search | forms + live regions if validation |
| Modal/drawer/popover | modal + keyboard + ARIA |
| Data table/grid | tables + keyboard + ARIA |
| Dashboard/cards/charts | headings/images + contrast + tables if data |
| Dynamic status/toasts/loading | live regions |
| Navigation/links | links + landmarks |

### Phase 1: Accessibility Build Plan

Before code is written, require a short accessibility plan:

```text
Component: [name]
Relevant WCAG: [criteria]
Required semantics:
Keyboard behavior:
Focus behavior:
Accessible names:
Error/live announcement behavior:
Color/contrast requirements:
Test plan:
```

This plan should be generated by our orchestrator and specialist prompts before implementation.

### Phase 2: Code Generation With Constraints

The implementation prompt should include:

- Prefer native HTML before ARIA.
- Do not use `div`/`span` for interactive controls unless role, keyboard behavior, and state are implemented.
- All icon-only buttons need an accessible name.
- All form fields need persistent labels.
- Errors need text, association, and announcement.
- Modals need role, label, focus trap, escape, and return focus.
- Tables need semantic table markup unless truly interactive grid.
- Do not introduce `tabindex > 0`.
- Focus indicators must remain visible.
- Do not communicate state by color alone.
- Respect reduced motion and high contrast preferences when relevant.

### Phase 3: Pre-Commit Self-Review

After code generation but before declaring done:

- Run deterministic scanner on changed UI.
- Run selected specialists from orchestrator.
- Generate report in ignored run folder.
- If critical/high findings exist, fix before final answer.
- If needs-review remains, explain why and provide manual test steps.

### Phase 4: Human Verification Checklist

Every generated UI should include a concise test checklist:

- Keyboard tab order works.
- Focus visible on every interactive element.
- Screen reader announces name, role, value, state.
- Page/section headings are meaningful.
- Images/icons have correct text alternatives or are hidden.
- Form errors are announced and associated.
- Color is not the only cue.
- Layout works at zoom/narrow viewport.

## Workflow 3: Pre-Edit Enforcement

The most valuable concept from `accessibility-agents-main/docs/architecture.md` is that instructions alone are not enough. Their approach uses hooks to make review unavoidable.

For this project, implement enforcement in stages.

### Stage 1: Soft Enforcement

Add a persistent rule/instruction:

```text
For any UI-generating task, run the Accessibility Scanner Orchestrator before editing files.
The orchestrator must identify relevant WCAG 2.1 A/AA criteria and required specialist prompts.
```

### Stage 2: Review Marker

When a UI task starts:

- Create a session-level review marker in memory or a local ignored file.
- Marker records:
  - task description
  - affected files
  - selected WCAG criteria
  - selected specialist prompts

### Stage 3: Cursor Hook Enforcement

Later, create a Cursor hook that detects edits to UI files:

- `.html`
- `.jsx`
- `.tsx`
- `.vue`
- `.svelte`
- `.css`
- `.scss`
- design-system component files

If no accessibility plan marker exists, block or warn before edit.

The warning should say:

```text
This looks like a UI change. Run the Accessibility Scanner Orchestrator first.
Required output: selected WCAG criteria, selected specialist prompts, and accessibility build plan.
```

### Stage 4: PR Gate

For changed UI files:

- Run relevant deterministic scanners.
- Run high-impact Playwright checks.
- Upload ignored artifacts in CI, not committed files.
- Fail only on critical/high issues at first.
- Later add policy gates for repeated medium issues.

## Workflow 4: Continuous Learning Loop

This is where our project becomes better than a generic accessibility agent repo.

For every scan:

1. Save report in `scanner-runs/`.
2. Mark findings:
   - correct
   - false positive
   - missed issue
   - needs human judgment
3. Extract prompt improvements:
   - wording that caused hallucination
   - evidence fields that were missing
   - deterministic rule that should replace AI judgment
4. Update the WCAG tracker in `README.md`.
5. Add a regression fixture to `broken-pages-for-testing/`.
6. Update Catalyst/Jira templates in `wibey-skill/` when a pattern maps to a real bug template.

## Concrete MVP Build Plan

### Milestone 1: Specialist Inventory And Mapping

- [ ] Inventory all relevant `accessibility-agents-main` web agents.
- [ ] Map each agent to our WCAG 2.1 A/AA tracker.
- [ ] Decide which agents become first-class sub-skills in `accessibility-audit-skill/sub-skills/`.
- [ ] Decide which agents remain reference docs only.

Recommended first imports:

1. `forms-specialist`
2. `keyboard-navigator`
3. `aria-specialist`
4. `contrast-master`
5. `tables-data-specialist`
6. `link-checker`
7. `modal-specialist`
8. `live-region-controller`

### Milestone 2: Upgrade Orchestrator

- [ ] Expand `orchestrator/SKILL_V1.md` to include specialist routing, not only WCAG routing.
- [ ] Add a machine-readable prompt registry.
- [ ] Include skip reasons and human-triage reasons.
- [ ] Include evidence requirements per specialist.
- [ ] Output a run plan that scripts can consume.

### Milestone 3: Expand Deterministic Scanners

- [ ] Add forms DOM extractor.
- [ ] Add interactive elements extractor.
- [ ] Add landmarks/page metadata extractor.
- [ ] Add tables extractor.
- [ ] Add links extractor.
- [ ] Add focus order runner.
- [ ] Add contrast candidate extractor.
- [ ] Add high-impact Playwright checks:
  - axe serious/critical
  - keyboard trap
  - horizontal overflow
  - touch target size

### Milestone 4: Build Specialist Prompts

- [ ] Forms prompt.
- [ ] Keyboard/focus prompt.
- [ ] Name/role/value prompt.
- [ ] Contrast prompt.
- [ ] Tables prompt.
- [ ] Links prompt.
- [ ] Modals/live regions prompt.

Each prompt must follow our schema:

```json
{
  "finding_id": "",
  "wcag": [],
  "status": "",
  "severity": "",
  "confidence": {
    "visual": null,
    "dom": null,
    "final": null,
    "reason": ""
  },
  "evidence": {
    "selector": "",
    "bbox": [],
    "dom_text": "",
    "screenshot_region": "",
    "code_reference": ""
  },
  "source_citations": [],
  "suggested_fix": "",
  "human_review_required": false
}
```

### Milestone 5: Unified Report v2

- [ ] Combine headings and images report patterns into one reusable report renderer.
- [ ] Support multiple specialists in one report.
- [ ] Add filter controls: severity, WCAG, specialist, confidence, status.
- [ ] Add compare-run mode.
- [ ] Add CSV export.
- [ ] Add Jira-ready bug text export.

### Milestone 6: Pre-Generation Guardrail

- [ ] Create `PRE_GENERATION_GUARDRAIL_V1.md`.
- [ ] Add examples for:
  - form generation
  - modal generation
  - dashboard generation
  - data table generation
  - image/card layout generation
- [ ] Test against 3-5 prompts where AI would normally generate inaccessible UI.
- [ ] Score first-pass accessibility before/after guardrail.

### Milestone 7: Hook/Enforcement Prototype

- [ ] Define UI file patterns.
- [ ] Define session marker shape.
- [ ] Prototype a soft warning hook.
- [ ] Later convert warning into blocking behavior if desired.
- [ ] Ensure generated reports stay ignored and timestamped.

### Milestone 8: CI/PR Integration

- [ ] Run scanner on changed UI files.
- [ ] Generate run artifacts.
- [ ] Add PR summary comment.
- [ ] Fail only on critical/high issues first.
- [ ] Add bypass mechanism for legacy debt with explicit issue link.

## How This Fits Our Existing Repo

| Existing Asset | How It Evolves |
|---|---|
| `README.md` WCAG tracker | Add specialist ownership and scanner status per criterion. |
| `orchestrator/SKILL_V1.md` | Becomes the accessibility lead equivalent. |
| `sub-skills/headings/SKILL_V1.md` | Maps to `alt-text-headings`; keep deterministic hierarchy logic. |
| `sub-skills/images/SKILL_V1.md` | Maps to `alt-text-headings`; keep DOM+visual gap model. |
| `sub-skills/interactive-elements/SKILL_V1.md` | Split into keyboard, ARIA/name-role-value, links, modals over time. |
| `scripts/evaluate-headings.mjs` | Becomes one module of a shared scanner runner. |
| `scripts/evaluate-images.mjs` | Becomes one module of a shared scanner runner. |
| `scanner-runs/` | Stores all ignored reports and regression evidence. |
| `wibey-skill/` | Supplies Walmart-specific bug templates, team routing, and remediation examples. |
| `broken-pages-for-testing/` | Becomes benchmark fixture suite for prompt quality. |

## Recommended Next Three Tasks

1. **Create a prompt registry**

   Add a JSON or Markdown registry that maps:
   - specialist name
   - prompt path
   - WCAG coverage
   - deterministic evidence required
   - output schema

2. **Build the Forms scanner next**

   This gives the highest immediate value after headings/images because forms touch many WCAG criteria:
   - 1.3.1
   - 1.3.5
   - 3.3.1
   - 3.3.2
   - 3.3.3
   - 4.1.2

3. **Upgrade the orchestrator to route specialists**

   Make it select specialists based on actual DOM evidence:
   - if inputs exist -> forms
   - if buttons/links/custom controls exist -> keyboard + ARIA
   - if tables exist -> tables
   - if dialogs/popovers exist -> modal
   - if images/svg/canvas exist -> images
   - if CSS/colors exist -> contrast candidates

## Success Criteria

This effort is successful when:

- A user can run one command against all broken pages and get a multi-specialist report.
- A user can ask an AI to generate UI and receive an accessibility build plan before code.
- Scanner findings include DOM evidence, screenshot evidence, confidence, WCAG mapping, and fix guidance.
- Generated scanner outputs never pollute git.
- The README tracker shows which WCAG criteria are covered, partially covered, or planned.
- Prompt improvements are driven by benchmark results, not vibes.
- The system can eventually block or warn on UI edits that skipped accessibility review.

## Open Questions

- Should we target WCAG 2.1 A/AA only until the tracker is complete, or start adding WCAG 2.2 in a separate section?
- Should specialist prompts cite public W3C/Deque/WebAIM docs only, or also internal Walmart/Living Design guidance?
- Should reports optimize for audit reviewers, PR reviewers, or Jira bug authors first?
- Should the pre-generation guardrail run on every UI request automatically, or only when the user opts in during MVP?
- Should we create a separate `accessibility-lead` skill file, or evolve the existing orchestrator file into that role?

