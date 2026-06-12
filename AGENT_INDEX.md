# Agent Reference Index

## 1. OVERVIEW
This project is an accessibility intelligence workspace for turning known accessibility failures, Jira bug patterns, internal fix templates, and design-system guidance into reusable agent prompts and skills. Its long-term purpose is to make future AI-generated code accessible by default while also supporting accessibility audits, bug triage, and WCAG-specific remediation workflows.

## 2. REPO ROLES
- `alpha-gov`: A forked/reference copy of the UK Government accessibility tool audit project; it provides known inaccessible examples, test cases, generated HTML pages, and automated checker results that can be used as training and audit material.
- `template-playground`: A standalone offline browser tool for loading, filtering, reviewing, exporting, and tracking Catalyst accessibility bug templates; it is the human-facing tracker for which accessibility issues have canned responses, WCAG coverage, and eventually dedicated skill-agent coverage.
- `wibey-skill`: The main agent knowledge base and skill package; it contains the final Wibey skill, Catalyst templates, team routing context, component maps, design-system docs, WCAG reference material, learning folders, and sample before/testing bug repositories.
- `wibey-skill/final-skill`: The deployable skill package intended to become `enterprise-accessibility-intelligence`; this is the operational source for the agent prompt, lookup scripts, references, and packaged remediation workflow.
- `wibey-skill/final-skill/references/catalyst-templates`: The primary fix-pattern library, organized by platform and template ID such as `WA11Y-WEB-*`, `WA11Y-IOS-*`, and `WA11Y-AND-*`.
- `wibey-skill/final-skill/references/teams`: The team and domain routing layer that tells agents where to search, which code ownership context applies, and which stack-specific constraints matter.
- `wibey-skill/final-skill/references/design-system-docs`: Living Design component documentation distilled for agent use across web, iOS, and Android.
- `wibey-skill/final-skill/references/component-map.json`: The component lookup index that connects design-system component IDs to platform, component name, documentation links, and implementation class names.
- `wibey-skill/ADA-Bugs-Before` and `wibey-skill/ADA-Bugs-For-Testing`: Sample or copied bug repositories used as source material and test beds for validating whether the skill can learn from and remediate real accessibility defects.
- `broken-pages-for-testing`: A dedicated repository/folder of known broken pages (e.g., `page1.html` through `page10.html`) specifically used to test and benchmark the accessibility audit skills against real-world or simulated inaccessible scenarios.
- `wibey-skill/useful-markdown` and `wibey-skill/learning-folder`: Supporting reference and learning material, including WCAG 2.2 notes, design-system references, and saturation/coverage analysis.
- `accessibility-audit-skill`: The consolidated master skill folder housing the main `SKILL.md`, sub-skills (headings, images, interactive-elements), and all benchmark/audit run data.

## 3. TECH STACK
- Languages: Markdown, JavaScript, JSON, Bash, Python, HTML, CSS, Sass/SCSS.
- Runtime and tooling: Node.js, npm, Gulp 3, Nunjucks, Lodash, shell scripts, local browser execution.
- Accessibility/reference systems: WCAG 2.2 A/AA, Catalyst accessibility templates, Walmart Living Design, automated accessibility checker result data, GOV.UK accessibility audit examples.
- Frontend libraries in the playground: Bootstrap, jQuery, Prism, Fuse.js, Awesomplete, localStorage-backed browser state.
- `alpha-gov` generation stack: `tests.json` as source data, `build/generate.js` for static HTML generation, Nunjucks templates, Sass compilation, and GOV.UK frontend Sass/template dependencies.
- Agent/skill stack: Wibey skill metadata in `SKILL.md`, scripted template lookup via `scripts/find-template.sh`, large `window.A11Y_TEMPLATES` JavaScript registries, Tri-Folder references, and planned multi-agent/swarm execution for Jira and PR learning.
- Experimental ingestion/fix tooling: Python helper scripts are present for batch ingestion and auto-fix experiments; treat them as support tooling unless a task specifically targets them.

## 4. SYSTEM FLOW
- Training/audit examples start in `alpha-gov`, where accessibility failures are represented as structured entries in `tests.json` and rendered into static HTML examples and result pages.
- Catalyst bug knowledge is tracked and reviewed in `template-playground`, where template JSON can be pasted, searched, filtered by WCAG/platform/priority, viewed in grid/table/analysis modes, copied into Jira-friendly text, or exported.
- Mature template knowledge moves into `wibey-skill/final-skill/references/catalyst-templates`, where each template becomes a platform-specific remediation playbook with a stable `WA11Y-*` ID.
- Runtime remediation starts from a Jira-style bug description: the skill detects platform, runs `find-template.sh` to locate the best Catalyst template ID, loads the relevant template, then consults team routing and design-system docs before editing target code.
- Template registry data is shared by convention: `template-playground/templates.js` and `wibey-skill/final-skill/references/templates-v1-03-19-2026-refactored.js` use the same `window.A11Y_TEMPLATES` corpus shape.
- The intended agent decision order is Templates first, Teams second, Component Map and Living Design docs third, WCAG reference as the fallback reasoning layer.
- Closed Jira bugs and their fixing PRs are meant to feed a learning loop: extract the issue, map it to WCAG/template/team/component context, compare the merged fix against the current knowledge base, and add high-quality reviewed patterns back into the references.
- Future system prompts and multi-agent workflows should use this repo as a source-of-truth corpus for pre-generation accessibility checks, code review audits, and WCAG-specific specialist skills.

## 5. CONVENTIONS
- Prefer stable accessibility IDs for reusable knowledge: Catalyst templates use `WA11Y-{PLATFORM}-{WCAG}-{SEQUENCE}` naming, with platform values such as `WEB`, `IOS`, `AND`, and shared `ALL`.
- Keep the Tri-Folder model intact: Catalyst templates explain how to fix, team files explain where and under which stack constraints, and WCAG/design-system references explain why the fix is correct.
- Route narrowly before searching broadly: the skill should infer platform and team/domain from Jira labels or repo clues, then read targeted files instead of scanning entire monorepos.
- Treat generated or non-UI files as low-value for accessibility fixes unless evidence says otherwise; the skill explicitly skips generated GraphQL/data-access/type files when searching for UI bugs.
- Preserve platform-specific accessibility APIs: web uses React/Living Design props, iOS uses UIKit/Swift accessibility properties and traits, and Android uses Kotlin/XML accessibility attributes.
- Store reusable agent knowledge as Markdown reference files with concrete bad-code/good-code patterns, historical pass/fail examples, and internal component guidance instead of relying on generic accessibility advice.
- Keep playground data browser-local and offline-capable; it relies on static assets, local JavaScript, pasted JSON, and `localStorage` rather than a backend service.
- In `alpha-gov`, treat `tests.json` as the source of truth and generated HTML as derived output produced by the Gulp/Nunjucks pipeline.
- For future contributions, prioritize human-reviewed learnings from successful Jira/PR fixes before promoting them into the final skill, because the current corpus includes machine-ingested knowledge that still needs quality review.
