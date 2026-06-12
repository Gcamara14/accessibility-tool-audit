# Remaining Tasks & Validation Board

This document tracks the remaining work for the **AI Accessibility Skill (wibey-skill)** project to reach full autonomy.

## ✅ Phase 1: Foundation & Starter Dataset (COMPLETE)
- [x] Create the 87 rule guidance files.
- [x] Create matching pass/fail example files.
- [x] Define a strict markdown template.
- [x] Seed initial batch of bugs.

## ✅ Phase 2: Accelerated Ingestion Workflow (COMPLETE)
- [x] Process `ADA-Bugs-For-Testing` suite.
- [x] Map bugs to WCAG rules and generate HTML fixes.
- [x] Append real-world fixes into `[rule]-examples.md` as "Bad Code" vs "Good Code".

---

## ✅ Phase 3: The Tri-Folder Architecture & Team Context (COMPLETE)
**Goal:** Upgrade the knowledge base from just WCAG to the enterprise-grade Template and Team context hierarchy.

- [x] **Task 3.1:** Create the `final-skill/catalyst-templates/` directory and populate it. (Generated 34 Web templates + iOS/Android schemas).
- [x] **Task 3.2:** Create the `final-skill/teams/` directory. Scaffolded the 10 Domain Areas and seeded `Sparky` and `Item Page` files.
- [x] **Task 3.3:** Manage the Component Map. Created `component-map.json` holding 46 strict Living Design (LD) components.
- [x] **Task 3.4:** Refactor `ADA-Bugs-Before/docs-ideas/templates-v1-03-19-2026.js`: Injected unique `WA11Y` IDs, dates, and sorting.
- [ ] **Task 3.5:** Process the `jira-labels-explained` mapping file for more automated team sorting.
- [ ] **Task 3.6:** Refactor existing ingested bugs (from Phase 2) to map to internal Catalyst Template IDs.

## ✅ Phase 4a: Design System Documentation (COMPLETE)
**Goal:** Implement the Tier 2 Resolution Strategy for when the AI is confused about a component's props.

- [x] **Task 4a.1:** Established `final-skill/design-system-docs/web/` folder.
- [x] **Task 4a.2:** Tested live RAG capabilities: Wibey successfully used MCP tools to dynamically query and generate exact React props for 6 LD components.

## ✅ Phase 4b: Integration into Enterprise AI Skill (COMPLETE)
**Goal:** Connect our 3-dimensional Knowledge Base to the Wibey skill orchestrator.

- [x] **Task 4b.1:** Wrote the `final-skill/SKILL.md` orchestrator.
- [x] **Task 4b.2:** Updated the skill prompt logic flow: `Check Template -> Check Component Map -> Check Docs -> Fix`.
- [x] **Task 4b.3:** Wibey successfully tested the skill locally, finding the exact template and fixing an LD IconButton bug.

---

## ✅ Phase 5: Wibey GitHub CLI Integration & PR Ingestion (COMPLETE)
**Goal:** Leverage Wibey's native `gh` (GitHub CLI) integration to automatically pull code diffs for Jira tickets and self-document.

- [x] **Task 5.1:** Test Wibey's native GitHub CLI integration (`gh pr view <pr-number>` and `gh pr diff <pr-number>`). *(Requires YOLO Mode)*
- [x] **Task 5.2:** Build an ingestion script that tells Wibey to extract the 'bad' vs 'good' code snippet from the PR. *(Requires YOLO Mode)*
- [x] **Task 5.3:** Engineered the "Two-Step Diff" and Pre-Flight Hash resolution to reduce LLM ingestion time from 30 mins to ~4 mins.
- [x] **Task 5.4:** Orchestrated the MapReduce `BATCH_QUEUE` Swarm to process up to 10 tickets concurrently with ZERO file collisions.

---

## ✅ Phase 6: Catalyst Data Saturation (COMPLETE)
**Goal:** Transform the empty skeleton files into a rich, battle-tested Knowledge Base for Web components.

- [x] **Task 6.1: The "2-5 PR" Catalyst Saturation** *(Successfully ingested 8 complex PRs covering 2.1.1 Keyboard & 2.4.3 Focus Order)*
    *   **What:** Manually hunt Jira for 2 to 5 resolved PRs that match the remaining empty `WA11Y-WEB` catalyst templates (e.g., finding PRs that specifically fixed Forms, Headings, Iframes).
    *   **Action:** Fed them into the `BATCH_QUEUE.md` Swarm. Wibey automatically populated skeleton markdown files with rich `❌ Bad / ✅ Good` React code patterns, enriching 5 templates, writing 6 team files, and drafting 1 novel template!
- [ ] **Task 6.2: Audit Novel Drafts (Cleanup)**
    *   **What:** Review the auto-generated drafts sitting in `final-skill/RECOMMENDED_TEMPLATES.md` (specifically the 2.1.2 Keyboard Trap drafts created before the Sanity Gate).
    *   **Action:** Decide whether to merge them into a single official template, promote them to their own Catalyst files, or discard them if they were caused by human Jira mis-tagging.

## ✅ Phase 6.5: Architectural Seeding (Horizontal Sweep) (COMPLETE)
**Goal:** Bootstrap the `/teams/` routing architecture by intentionally ingesting bugs across all major enterprise domains, creating a monorepo "map" before handing the AI to developers.

- [x] **Task 6.5.1: The Core Domestic Sweep** *(Completed organically via Run 1-9)*
- [x] **Task 6.5.2: The International Sweep** *(Successfully processed 3 `INTX-` tickets across PRs #179062 & #179293)*
    *   **Result:** Wibey autonomously scaffolded `teams/International/canada.md` and `teams/International/mexico.md` and permanently mapped the `INTX-` Jira prefix. It also drafted 3 novel fallback templates (including a rare WCAG 3.2.2 On Input bug).

## 🔮 Phase 7: Core WCAG Expansion (Web Fallback)
**Goal:** Expand the skill's ability to handle non-Design System, generic HTML bugs *before* we hand it off to developers, creating a critical safety net.

- [ ] **Task 7.1: The Core WCAG Expansion (Targeting "Custom Templates")**
    *   **What:** Not every bug uses a Design System component. Sometimes a developer just messes up a standard HTML table, a generic `<div>`, or requires a completely custom accessible widget. 
    *   **Action:** Specifically hunt for Jira tickets and PRs that are marked as **"Custom Template Needed"**. Find and ingest at least 1-2 of these generic bug PRs per core WCAG criteria (e.g., 1.4.3 Contrast, 2.1.1 Keyboard). Have the swarm document these generic HTML fixes into our `final-skill/wcag/` folder to build a powerful "Fallback" safety net.

## 🔮 Phase 8: Leadership Alignment & Skill Re-packaging
**Goal:** Align with co-lead (Sowjanya) on the AI's core skillset, rules, and instructions before putting it in front of developers.

- [ ] **Task 8.1:** Align with co-lead on the skillset and instructions (`SKILL.md`).
- [ ] **Task 8.2:** Ask AI to re-package the file structure if needed based on feedback.
- [ ] **Task 8.3:** Update the ingestion workflow documentation to match the new alignment.

## 🔮 Phase 9: Developer Beta Testing (IN PROGRESS)
**Goal:** Package the saturated Web skill and hand it over to a human developer to test. **(Shift to Two-Mode Architecture)**

- [x] **Task 9.1:** Finalize the `/final-skill` folder and globally install it (`~/.wibey/skills/`) on a developer's machine. (Completed via zip and Wibey-compliant refactor)
- [x] **Task 9.2: Strip the Skill for Speed (Developer Mode)**
    *   **What:** Create a lightweight `SKILL.md` strictly for the Beta Testers. Remove all instructions about "Self-Documenting", "Updating Teams", or "Writing Drafts".
    *   **Action:** Instruct the AI to simply find the template, use `MultiEdit` to fix the `.tsx` file locally, and exit immediately. Goal: <3 minute runtime.
- [ ] **Task 9.3:** Have the developer use Wibey + the Developer Mode Skill to autonomously fix 3-5 open Web accessibility tickets directly in their `Walmart-Web-2` local repository.
- [ ] **Task 9.4: Post-Beta Telemetry (The GitHub PR Injector)**
    *   **What:** Instead of manually tracking PRs, we will use the Wibey Skill to inject a specific formatted block into the developer's GitHub Pull Request description. 
    *   **Action:** Update the Developer Skill so that if asked to create a PR, it appends the following block to the PR body:
      ```text
      ============================================================
      A11Y FIX — [JIRA ID]
      WCAG Criterion : [Criterion]
      Template : [Template ID]
      ============================================================
      ```
    *   **Why:** This allows the "Factory Agent" to run an automated GitHub search for `Template : WA11Y-*` every night, discover freshly merged developer fixes, and autonomously ingest them to make the AI smarter!

## 🔮 Phase 10: WCAG React Saturation (The Fallback Upgrade)
**Goal:** Upgrade the foundational `WCAG-Rules` directory from basic 1999-era HTML examples to complex, enterprise React/JSX patterns.

- [ ] **Task 10.1:** The Factory has been updated to automatically route generic, non-design-system bugs to the `WCAG-Rules/` folder. We need to feed the Factory a batch of generic React accessibility bugs (e.g., template literal interpolation errors, conditional rendering ARIA bugs) so it can saturate the fallback files with modern JSX patterns.

## 🔮 Phase 11: Feedback & Refinement
**Goal:** Analyze the results from the Developer Beta and the WCAG Expansion to harden the logic.

- [ ] **Task 10.1:** Collect qualitative feedback from the beta tester (Did the AI hallucinate? Did the bark locks work perfectly?).
- [ ] **Task 10.2:** Tune `SKILL.md` prompt constraints based on developer friction points.

## 🔮 Phase 12: Platform Expansion (Mobile)
**Goal:** If the Web architecture is a proven success, scale the Tri-Folder logic to iOS and Android.

- [ ] **Task 11.1:** Populate the `component-map.json` with SwiftUI and Jetpack Compose component paths.
- [ ] **Task 11.2:** Run the Batch Swarm on Native Mobile Jira tickets to populate `WA11Y-IOS` and `WA11Y-AND` catalyst templates.
- [ ] **Task 11.3:** Add support to ingest iOS bugs — extend the ingestion pipeline (e.g., `batch_ingestor.py`) to handle iOS-specific Jira tickets and map them to `WA11Y-IOS` catalyst templates.

---

### Validation Checklist for Next Session
1. [ ] Check `git status` and commit today's massive knowledge base generation.
2. [ ] Begin creating the new `final-skill/templates/` and `final-skill/teams/` folders to establish the multi-layered intelligence graph.
3. [ ] Start drafting the Phase 4 Orchestrator prompt that handles the fallback logic flow.
