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
