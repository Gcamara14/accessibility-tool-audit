# Product Requirements Document (PRD): AI Accessibility Skill (wibey-skill)

## 🐶 Vision
Transform the current static `/fixing-accessibility` wibey skill into a self-improving, autonomous AI agent that can ingest an accessibility Jira bug, identify the relevant WCAG criterion, apply the preferred fix, create a PR, and self-document the solution into a growing knowledge base of real-world examples.

## 🎯 Goals

### Short-Term
*   **Jira to Fix Workflow:** The AI can read a Jira bug's details and labels, map it to a specific accessibility rule, and reference internal guidance to generate a fix.
*   **PR Integration:** Support the workflow from fix generation to PR creation.
*   **Self-Documenting Fixes:** Record newly solved bugs into a growing source of truth for future reference.

### Long-Term
*   **Autonomous Agent:** The AI can autonomously find accessibility bugs, fix them on the fly, create PRs, and merge them.
*   **Historical Learning:** Reuse past fixes for similar bugs by referencing an expansive, Walmart-specific dataset of prior accessibility fixes.

---

## 🏗️ Architecture & Core Ideas

### 1. The Tri-Folder Knowledge Base (Multi-Layered Intelligence)
Instead of just relying on conceptual WCAG rules, the system uses a "Precision Hierarchy" to find the exact code fix.

*   **Layer 1: Catalyst Templates (`/docs/catalyst-templates/`) - *The Primary Fix Logic***
    *   Files named by Template ID (e.g., `catalyst-button-missing-role.md`).
    *   Contains the exact internal component to use (e.g., `Use our <WMTButton> instead of a <div onclick>`), known fix patterns, and measurable automation logic linked to the Catalyst tool.
*   **Layer 2: Teams (`/docs/teams/`) - *Implementation Context***
    *   Files named by team (e.g., `homepage-team.md`, `ios-team.md`).
    *   Contains repo paths, component ownership, primary tech stack (React vs. Swift), rendering models, and typical pitfalls. This drastically reduces the search space.
*   **Layer 3: Criterion (`/docs/wcag/`) - *Semantic Grounding & Fallback***
    *   ~87 markdown files (e.g., `4.1.2-guidance.md`).
    *   Provides conceptual accessibility reasoning, compliance reporting, and acts as a fallback if no specific Template exists.

### 2. Self-Improving Documentation Layer (The "Examples")
Alongside the rule guidance, we will maintain a paired structure for real-world examples.
*   **Structure:**
    *   `[criterion-number]-guidance.md` (e.g., `1.1.1-guidance.md`)
    *   `[criterion-number]-pass-fail-examples.md` (e.g., `1.1.1-pass-fail-examples.md`)
*   **Example File Content:** What failed, bad code snippet, how it was fixed, corrected code snippet, reasoning, and scenario context.
*   **Strict Constraint:** Only add meaningfully *unique* fix patterns to prevent noise.

### 3. Semi-Manual Bootstrap Workflow
To seed the knowledge base, we will ingest 20–50 high-quality historical Jira bugs and PRs:
1. Copy Jira bug details + PR fix code.
2. Use an AI agent (like Cursor/Code-Puppy) to analyze the failure, map it to a rule, and check if it's unique.
3. Draft the markdown update for the respective example file.
4. Human review and save.

*(Optional future enhancement: A lightweight Chrome extension with buttons to "Copy Bug", "Copy PR", and "Generate Prompt" to speed up manual data collection).*

---

## 🗺️ Milestones & Orchestrated Task List

### Phase 1: Foundation & Starter Dataset (WCAG Layer)
**Goal:** Build the conceptual rule base.
*   [x] **Task 1.1:** Create a script/scaffold to generate the ~87 WCAG rule guidance files (e.g., `1.1.1-guidance.md`) with a strict markdown template.
*   [x] **Task 1.2:** Create the matching ~87 pass/fail example files (e.g., `1.1.1-examples.md`).
*   [x] **Task 1.3:** Define the strict markdown schema/metadata for both guidance and example files.
*   [x] **Task 1.4:** Manually ingest and seed historical bugs.

### Phase 2: Accelerated Ingestion Workflow
**Goal:** Speed up the ingestion of historical bugs into the conceptual layer.
*   [x] **Task 2.1:** Design a standard "Prompt Template" that combines a Jira bug description and a PR diff.
*   [x] **Task 2.2:** Set up a multi-agent workflow (or simple Code-Puppy scripts):
    *   Agent 1: Classify bug by rule.
    *   Agent 2: Analyze PR fix pattern.
    *   Agent 3: Draft markdown example.
*   [x] **Task 2.3:** Process testing suites and populate examples.

### Phase 3: The Tri-Folder Architecture & Team Context
**Goal:** Upgrade the knowledge base from just WCAG to the enterprise-grade Catalyst Template and Team context hierarchy.
*   [ ] **Task 3.1:** Create the `/catalyst-templates/` directory and populate the first batch of Template ID files (e.g., `catalyst-button-missing-role.md`).
*   [ ] **Task 3.2:** Create the `/teams/` directory and populate the first batch of Team architecture files (e.g., `web-homepage-team.md`).
*   [ ] **Task 3.3:** Refactor existing ingested bugs to map to internal Catalyst Template IDs rather than just WCAG criteria.

### Phase 4: Integration into Enterprise AI Skill (wibey-skill)
**Goal:** Connect the structured 3-dimensional knowledge base to the actual AI fixing skill.
*   [ ] **Task 4.1:** Update the current `fixing-accessibility/SKILL.md` to act as an orchestrator with the new Decision Flow: `Check Catalyst Template -> Check Team -> Fallback to WCAG`.
*   [ ] **Task 4.2:** Teach the skill to read Jira labels (Template ID, Team, WCAG), fetch the corresponding documents from all three layers, and use them as combined context for fixing the bug.
*   [ ] **Task 4.3:** Test the new skill locally against an un-fixed bug using the multi-layered context.

### Phase 5: Full Automation & Self-Learning Loop
**Goal:** The system updates its own documentation upon successful fixes.
*   [ ] **Task 5.1:** Build a feedback loop: when a PR generated by the AI is merged, trigger an action to review if the fix is "unique".
*   [ ] **Task 5.2:** Automatically append unique fixes to the corresponding `/catalyst-templates/` or `/wcag/` example file.
*   [ ] **Task 5.3:** Transition toward fully autonomous bug fixing (AI finds bug -> AI fixes -> AI opens PR -> AI documents).

---

## 🛑 Scope Boundaries
*   **In Scope:** Accessibility expertise, fix guidance, rule mapping, documentation design, building the example knowledge base.
*   **Out of Scope (For Now):** Automatically finding *where* the code lives in complex repos, advanced repo navigation, and engineering-side plumbing. Engineers must point the AI to the code; the AI provides the intelligence.
