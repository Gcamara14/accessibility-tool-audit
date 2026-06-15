# Enterprise Accessibility Intelligence System

## 🌟 Product Requirements Document (PRD)

### Vision & Goals
The ultimate goal of this project is to ensure that **all future coding outputs from AI agents are accessible by default**. 

To achieve this, we are building a multi-agent system and a comprehensive suite of system prompts (skills) mapped to WCAG criteria. These skills serve a dual purpose:
1. **Pre-generation Guardrails:** Evaluating and guiding AI agents *before* and *during* code generation to ensure accessible output.
2. **Automated Auditing:** Conducting highly accurate, template-aware accessibility audits on existing codebases and pages.

### Core Architecture
This repository is the central workspace for developing, testing, and benchmarking these accessibility skills.

* **`accessibility-audit-skill/`**: The consolidated master skill folder. Contains the main `SKILL.md`, specialized sub-skills (e.g., headings, images, interactive elements), and all benchmark/audit run data.
* **`wibey-skill/`**: The core agent knowledge base. Contains Catalyst templates (the "How"), Team routing context (the "Where"), and WCAG reference material (the "Why").
* **`alpha-gov/`**: A reference copy of the UK Government accessibility tool audit project. Provides known inaccessible HTML examples and test cases used as training/audit material.
* **`broken-pages-for-testing/`**: A dedicated suite of broken pages (e.g., `page1.html` through `page10.html`) used to test, validate, and benchmark our accessibility skills against known inaccessible scenarios.
* **`template-playground/`**: A standalone offline browser tool for loading, filtering, and reviewing Catalyst accessibility bug templates.

---

## 📋 Master Tasklist

This section tracks our progress. Update this list as we complete tasks or define new ones.

### Phase 1: Foundation & MVP (Completed)
- [x] Consolidate repository structure and create `AGENT_INDEX.md`.
- [x] Draft initial MVP prompt variants (Baseline, Template-Aware, Pre-Generation).
- [x] Define a scoring rubric for prompt quality and correctness.
- [x] Run initial manual benchmark on web fixtures.
- [x] Create the master `accessibility-audit-skill` directory with v1 sub-skills (Headings, Images, Interactive Elements).

### Phase 2: Skill Expansion & Automation (Current)
- [ ] **Expand Sub-Skills:** Create specialized sub-skills for remaining high-priority WCAG areas:
  - [ ] Forms and Labels (WCAG 1.3.1, 3.3.2)
  - [ ] Landmarks and Region Navigation (WCAG 1.3.1, 2.4.1)
  - [ ] Tables and Relationships (WCAG 1.3.1)
  - [ ] Focus Management and Dialog Behavior (WCAG 2.4.3)
- [ ] **Automated Runner:** Build a lightweight script or agent workflow to automatically run a given HTML snippet/URL against *all* sub-skills and aggregate the findings.
- [ ] **Pre-Generation Integration:** Test the "Pre-Generation Guardrail" prompt on 3-5 "generate from scratch" scenarios to measure if the AI produces accessible code on the first try.

### Phase 3: Multi-Agent Orchestration
- [ ] **Jira/PR Integration:** Test the multi-agent workflow on a real Jira ticket or PR (Ingest -> Retrieve Context -> Fix -> Learn).
- [ ] **Telemetry & Learning:** Implement the feedback loop to extract new learnings from merged PRs and update the Catalyst templates automatically.

### Phase 4: Platform Expansion
- [ ] **iOS Expansion:** Adapt the component map and sub-skills for iOS (UIKit/SwiftUI).
- [ ] **Android Expansion:** Adapt the component map and sub-skills for Android (XML/Compose).

---

## WCAG 2.1 A/AA Prompt Tracker

Use this table to track every scanner prompt we build. Scope is WCAG 2.1 Level A and AA only.

| WCAG | Level | Success Criterion | Prompt / Skill | Status | Notes |
|---|---:|---|---|---|---|
| ORCH | n/a | Scanner Orchestrator | [Orchestrator prompt](accessibility-audit-skill/orchestrator/SKILL_V1.md) | Draft | Determines relevant WCAG 2.1 A/AA criteria, selects scanner prompts, and creates the simplified run plan. |
| 1.1.1 | A | Non-text Content | [Images prompt](accessibility-audit-skill/sub-skills/images/SKILL_V1.md) | In progress | Image, icon, emoji, illustration, chart, and visual gap scanner. |
| 1.2.1 | A | Audio-only and Video-only (Prerecorded) | TBD | Planned | Media alternatives prompt needed. |
| 1.2.2 | A | Captions (Prerecorded) | TBD | Planned | Captions prompt needed. |
| 1.2.3 | A | Audio Description or Media Alternative (Prerecorded) | TBD | Planned | Audio description/media alternative prompt needed. |
| 1.2.4 | AA | Captions (Live) | TBD | Planned | Live captions prompt needed. |
| 1.2.5 | AA | Audio Description (Prerecorded) | TBD | Planned | Audio description prompt needed. |
| 1.3.1 | A | Info and Relationships | [Headings prompt](accessibility-audit-skill/sub-skills/headings/SKILL_V1.md) | In progress | Started with headings; expand to forms, tables, lists, and semantic relationships. |
| 1.3.2 | A | Meaningful Sequence | TBD | Planned | Reading/order scanner needed. |
| 1.3.3 | A | Sensory Characteristics | TBD | Planned | Instructions relying on shape, size, color, location, or sound. |
| 1.3.4 | AA | Orientation | TBD | Planned | Orientation restriction scanner needed. |
| 1.3.5 | AA | Identify Input Purpose | TBD | Planned | Autocomplete/input purpose scanner needed. |
| 1.4.1 | A | Use of Color | TBD | Planned | Color-only communication scanner needed. |
| 1.4.2 | A | Audio Control | TBD | Planned | Auto-playing audio control scanner needed. |
| 1.4.3 | AA | Contrast (Minimum) | TBD | Planned | Text contrast scanner needed. |
| 1.4.4 | AA | Resize Text | TBD | Planned | Text zoom/responsiveness prompt needed. |
| 1.4.5 | AA | Images of Text | [Images prompt](accessibility-audit-skill/sub-skills/images/SKILL_V1.md) | Partial | Extend image scanner to flag text rendered as images. |
| 1.4.10 | AA | Reflow | TBD | Planned | Responsive/reflow scanner needed. |
| 1.4.11 | AA | Non-text Contrast | TBD | Planned | UI component and graphical object contrast scanner needed. |
| 1.4.12 | AA | Text Spacing | TBD | Planned | Text spacing compatibility scanner needed. |
| 1.4.13 | AA | Content on Hover or Focus | TBD | Planned | Tooltip/popover behavior scanner needed. |
| 2.1.1 | A | Keyboard | [Interactive elements prompt](accessibility-audit-skill/sub-skills/interactive-elements/SKILL_V1.md) | In progress | Keyboard access for controls and custom widgets. |
| 2.1.2 | A | No Keyboard Trap | [Interactive elements prompt](accessibility-audit-skill/sub-skills/interactive-elements/SKILL_V1.md) | In progress | Needs deeper focus trap validation. |
| 2.1.4 | A | Character Key Shortcuts | TBD | Planned | Keyboard shortcut scanner needed. |
| 2.2.1 | A | Timing Adjustable | TBD | Planned | Timeout/timing scanner needed. |
| 2.2.2 | A | Pause, Stop, Hide | TBD | Planned | Moving, blinking, scrolling content scanner needed. |
| 2.3.1 | A | Three Flashes or Below Threshold | TBD | Planned | Flashing content scanner needed. |
| 2.4.1 | A | Bypass Blocks | TBD | Planned | Skip link/landmark scanner needed. |
| 2.4.2 | A | Page Titled | TBD | Planned | Page title scanner needed. |
| 2.4.3 | A | Focus Order | [Interactive elements prompt](accessibility-audit-skill/sub-skills/interactive-elements/SKILL_V1.md) | Partial | Expand for full tab-order and modal focus review. |
| 2.4.4 | A | Link Purpose (In Context) | [Interactive elements prompt](accessibility-audit-skill/sub-skills/interactive-elements/SKILL_V1.md) | Partial | Expand for ambiguous link text and context. |
| 2.4.5 | AA | Multiple Ways | TBD | Planned | Site/page navigation alternatives scanner needed. |
| 2.4.6 | AA | Headings and Labels | [Headings prompt](accessibility-audit-skill/sub-skills/headings/SKILL_V1.md) | In progress | Heading and label clarity prompt. |
| 2.4.7 | AA | Focus Visible | [Interactive elements prompt](accessibility-audit-skill/sub-skills/interactive-elements/SKILL_V1.md) | Partial | Expand to visual focus indicator testing. |
| 2.5.1 | A | Pointer Gestures | TBD | Planned | Complex pointer gesture scanner needed. |
| 2.5.2 | A | Pointer Cancellation | TBD | Planned | Pointer down/up behavior scanner needed. |
| 2.5.3 | A | Label in Name | [Interactive elements prompt](accessibility-audit-skill/sub-skills/interactive-elements/SKILL_V1.md) | Partial | Expand accessible-name comparison against visible labels. |
| 2.5.4 | A | Motion Actuation | TBD | Planned | Motion/device gesture alternative scanner needed. |
| 3.1.1 | A | Language of Page | TBD | Planned | Document language scanner needed. |
| 3.1.2 | AA | Language of Parts | TBD | Planned | Inline language change scanner needed. |
| 3.2.1 | A | On Focus | TBD | Planned | Unexpected focus-triggered change scanner needed. |
| 3.2.2 | A | On Input | TBD | Planned | Unexpected input-triggered change scanner needed. |
| 3.2.3 | AA | Consistent Navigation | TBD | Planned | Cross-page navigation consistency scanner needed. |
| 3.2.4 | AA | Consistent Identification | TBD | Planned | Component naming/identification consistency scanner needed. |
| 3.3.1 | A | Error Identification | TBD | Planned | Form error identification scanner needed. |
| 3.3.2 | A | Labels or Instructions | TBD | Planned | Form labels/instructions scanner needed. |
| 3.3.3 | AA | Error Suggestion | TBD | Planned | Error recovery suggestion scanner needed. |
| 3.3.4 | AA | Error Prevention (Legal, Financial, Data) | TBD | Planned | Critical transaction prevention scanner needed. |
| 4.1.1 | A | Parsing | TBD | Planned | HTML validity/parsing scanner needed for WCAG 2.1. |
| 4.1.2 | A | Name, Role, Value | [Interactive elements prompt](accessibility-audit-skill/sub-skills/interactive-elements/SKILL_V1.md) | In progress | Name/role/state/value scanner. |
| 4.1.3 | AA | Status Messages | TBD | Planned | ARIA live/status message scanner needed. |
