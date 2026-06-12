# Changelog

## [Unreleased] - AI Accessibility Skill Overhaul

### Added
*   **The "Two-Mode Architecture" Concept**: Discovered during V3 A/B testing that forcing the AI to self-document *and* fix code in the same step causes massive token bloat (13+ minutes). Formulated the "Factory vs Developer" split to ensure <3 min execution times for beta testers while preserving the rich autonomous ingestion loop for the backend.
*   **The 56-Ticket Milestone (Queue Drained)**: Successfully processed all 56 rows in the initial `BATCH_QUEUE.md` across 9 massive Swarm runs. 
    *   *Final Totals:* 56 Tickets ingested, 10 Novel patterns drafted, 46 Variations mapped, and 14 Team architectural files built.
    *   *Key Intel Captured:* Extracted Staff-level React patterns, including the strict requirement to delay `announcePolite` by 1s alongside `addSnack` to prevent DOM mutation swallowing (WCAG 4.1.3).
*   **International Domain Scaffolding (Phase 6.5)**: Began ingesting Canada (`CA-`) and Mexico (`MX-`) tickets, discovering the `INTX-` Jira prefix and testing the Swarm's ability to dynamically scaffold international domain architecture without cross-pollinating legacy tech stacks.
*   **The Sanity Check Gate (Data Quality)**: Engineered a strict verification gate in `SKILL.md` that forces the AI to compare the human-provided Catalyst Template tag with the actual code diff. If a mismatch is detected (human error), the AI will abort ingestion and flag it as skipped to protect the Knowledge Base from polluted data.
*   **Unit Test Pattern Extraction**: Updated the ingestion protocol to explicitly target `.test.tsx` / `.spec.tsx` files. The AI now extracts how specific teams assert their accessibility fixes (e.g., `userEvent.tab()`, `toHaveFocus()`) into a new `🧪 Testing Pattern` block. This ensures that when the AI eventually writes novel fixes, it can automatically write the passing unit tests to prevent PR blockage.
*   **Required Imports Tracking**: Updated the Self-Documenting loop to explicitly hunt for and extract exact import paths for shared ADA utilities and custom hooks (e.g., `@walmart-web/payments-shared-ada-utilities`). This prevents future AI hallucination of import paths across the enterprise monorepo.
*   **Phase 6 Completion (Catalyst Data Saturation)**: Successfully unleashed the swarm on a massive batch of real Jira tickets across Web focus management and keyboard operability. 
    *   **Run #5 & #6**: Processed 17 complex PRs in under 80 minutes. Enriched multiple core Catalyst Templates, drafted novel fallback templates, mapped new global Jira prefixes (GPUGC-, OAMFD-, CRUISE-), and automatically scaffolded out new Team architectural files (Reviewer Community, Subscriptions).
*   **Architecture Evolution (Tri-Folder System)**: Ingested `chatgpt2.md` and `gemini-2.md` to shift from a purely WCAG-based system to an Enterprise Accessibility Intelligence System.
    *   Updated `PLAN.md` with new multi-layered retrieval strategy: `Layer 1: Catalyst Templates` -> `Layer 2: Teams` -> `Layer 3: WCAG`.
*   **Decoupled Component Map**: Created `final-skill/component-map.json` mapping 46 internal Living Design (LD) components directly to their canonical URLs.
*   **Design System Documentation (RAG)**: Created `final-skill/design-system-docs/web/` folder and populated it with highly detailed Markdown files outlining exact React props pulled via Wibey MCP search.
*   **Catalyst Templates**: Automated the generation of 34 Web-specific markdown templates based on the JS index.
*   **Team Architecture**: Scaffolded 10 Domain Area directories and created schemas for Sparky Chatbot and Item Page (PDP).
*   **The Orchestrator (`SKILL.md`)**: Wrote the final Wibey skill file that explicitly instructs the AI on the 4-step Search Flow, Tiered Resolution Strategy, and Self-Documenting Loop.
*   **The Audit Log (Step 7)**: Engineered a persistent console logging mechanism (`final-skill/EXECUTION_LOGS.md`). The AI Swarm is now explicitly instructed to write its execution traces, edited files, and "Bonus Findings" to a markdown ledger so human architects can review the autonomous queue post-execution.
*   **Bark Integration**: Engineered explicit multi-agent concurrency controls into the `SKILL.md` so the AI locks files during PR execution.
*   **Phase 5 Completion (Self-Learning Loop)**: Successfully executed the first end-to-end, fully autonomous PR generation on a live repo (Walmart-Web-2). The AI natively ingested Jira ticket `WSC-4050`, locked the file, applied the fix, and successfully wrote new architectural knowledge back to `teams/Accounts/identity-next.md` and `catalyst-templates/web/WA11Y-WEB-4.1.2-005.md`.
*   **The Ingestion Protocol (Human-in-the-Loop)**: Successfully tested "Step 5b: The Ingestion Protocol" against Jira CEPG-337717. Wibey autonomously ingested a complex PR, extracted a React render-prop fix alongside its Jest unit tests, and generated `final-skill/RECOMMENDED_TEMPLATES.md` as a staging ground. It also dynamically synchronized the `teams/` and `design-system-docs/` folders with its new findings in a single 18-minute principal-level engineering sweep.
*   **V2 Optimizations (Performance & Safety)**:
    *   **The AI Swarm (Batch Queue)**: Wibey autonomously engineered `final-skill/BATCH_QUEUE.md` to support massive batch processing.
    *   **Swarm Bottleneck Resolution (30m -> 4m)**: Discovered that Wibey sub-agents execute synchronously. To prevent 30-minute runtimes caused by redundant monorepo `git log --all` searches, we implemented **Pre-Flight Hash Resolution** in `SKILL.md`. The Master Agent now resolves all commit hashes in a single bash loop *before* spawning sub-agents, dropping the runtime for a 3-ticket batch to ~4 minutes.
*   **MapReduce Routing Fix**: Fixed a critical logic flaw where the Master Agent was blinding dumping all `/tmp/draft.md` files into the staging document. Implemented a strict `DESTINATION` header requirement so sub-agents explicitly tell the Master Agent which `catalyst-template` or `teams` file to append to.
*   **The 9-Agent Stress Test**: Successfully executed a 9-agent queue across 4 Domain Areas. The swarm generated 12 new files and perfectly routed 8 variations into existing Catalyst Templates in 49 minutes with zero file collisions, proving the MapReduce isolation architecture works flawlessly under load.
*   **The Ingestion Playbook**: Autonomously generated `final-skill/INGESTION_PLAYBOOK.md`, acting as the ultimate runbook for future AI instances. It codifies the precise triggering prompts, the necessity of WCAG hints to save tokens, and lists known "Bulk Grep" opportunities across the enterprise monorepo.
*   **Queue Builder UI**: Built a standalone, client-side HTML tool (`batch-queue-builder.html`) using Tailwind and LocalStorage to generate perfectly formatted Markdown tables for the `BATCH_QUEUE.md` file.
*   **10-Phase Enterprise Roadmap**: Officially expanded the `REMAINING_TASKS.md` from an engineering backlog into a full product lifecycle roadmap, establishing Phases 6 through 10 (Data Saturation → Developer Beta Testing → Core WCAG Fallback → Feedback & Refinement → Mobile Expansion).
    *   Created `final-skill/find-template.sh` to bypass slow LLM parsing of the 1800-line JS index, cutting search time to <1s.
    *   Engineered the **"Two-Step Diff"** ingestion strategy (pulling filenames via `--stat` before targeting source files) to prevent LLM context-bloat from unit test files. This successfully dropped autonomous PR ingestion runtime from 18 minutes down to 6 minutes (a 66% improvement).
    *   Created `final-skill/check-lock.sh` to parse `.agents/mailboxes` and detect "Stale Locks" (>5 mins), preventing infinite agent deadlocks.
    *   Updated `SKILL.md` to enforce "Teams-First Routing", eliminating massive global monorepo `grep` sweeps.
    *   Refined `SKILL.md` (Step 5 vs 5b) to enforce strict mutual exclusivity: The AI will now intelligently populate existing "skeleton" Catalyst Templates directly rather than creating redundant drafts.
*   **Master PRD (`PLAN.md`)**: Created a comprehensive 5-Phase Product Requirements Document combining visions from both ChatGPT and Gemini notes.
*   **Knowledge Base Architecture (`final-skill/`)**: Created a structured taxonomy to hold WCAG rules.
*   **Phase 1 Completion (Rule Generation)**: Wrote a Python script that parsed `useful-markdown/WCAG_2.2_AA_Design_System_Reference.md` and successfully auto-generated 110 files (`[rule]-guidance.md` and `[rule]-examples.md`) for all 55 WCAG Level A and AA rules.
*   **Test Data Snapshot (`ADA-Bugs-Before/`)**: Cloned the original `ADA-Bugs-For-Testing` directory to preserve a clean baseline for diffs.
*   **Phase 2 Completion (Batch Bug Ingestion)**: 
    *   Manually resolved and self-documented the first test bug (`colour-and-contrast-colour-alone-is-used-to-convey-content.html` -> Rule 1.4.1).
    *   Wrote and executed a Python script to fix and document a batch of 5 bugs (forms, keyboard, images, headings).
    *   Set up a massive `pydantic-ai` environment and wrote `batch_ingestor.py` to prove multi-agent potential (compatible with Gemini/Element LLM Gateway).
    *   Wrote a high-speed programmatic `auto_fixer.py` script that swept through the remaining 142 bugs, safely resolving and auto-documenting 19 more distinct bug files directly into the knowledge base across multiple rule categories (Iframes, Tables, Images, Links, Languages, Forms).

### Changed
*   **International Domain Taxonomy (`US-` Prefixing)**: Renamed all existing domestic Domain folders inside `references/teams/` to include a `US-` prefix (e.g., `Discovery` -> `US-Discovery`). 
    *   *Architectural Decision:* This prepares the AI for incoming Canada (`CA-`) and Mexico (`MX-`) Jira tickets by establishing a strictly symmetrical taxonomy.
    *   *Strategic Isolation:* We deliberately instructed the AI **not** to cross-pollinate architecture files across borders (e.g., a US agent cannot read a CA team file). This is a safety feature to prevent the AI from hallucinating a legacy tech stack from one country into another. However, the exact React/Code fixes remain universal via the decoupled `catalyst-templates/` directory ("Global Fixes, Local Architecture").
*   **Wibey-Compliant Refactoring (Phase 8)**: Completely restructured the `final-skill/` directory to strictly adhere to the Wibey ecosystem standards. 
    *   Moved `catalyst-templates/`, `teams/`, `design-system-docs/`, and `rules/` (renamed to `WCAG-Rules/`) into a standardized `references/` folder.
    *   Moved ingestion playbooks and staging documents into `references/instructions/`.
    *   Moved bash execution scripts into a standardized `scripts/` folder.
    *   Updated `SKILL.md` orchestrator paths to ensure seamless RAG retrieval within the new file structure.
*   **JS Index Refactoring**: Successfully executed a Node script to parse `templates-v1-03-19-2026.js`, injecting a `date` property and a rigorous Semantic ID (`WA11Y-[PLATFORM]-[WCAG]-[COUNTER]`) across all 97 templates.
*   **Architecture Refinement**: Renamed `/templates/` to `/catalyst-templates/` to align with the Catalyst tool used for tagging accessibility fixes.
*   **Component Map Decoupling**: Updated `INGESTION_WORKFLOW.md` and `PLAN.md` to explicitly decouple the Component Map from the Catalyst templates, allowing independent updates to UI mapping data without restructuring the template library.
*   Populated `1.1.1-examples.md`, `1.3.1-examples.md`, `1.4.1-examples.md`, `1.4.3-examples.md`, `1.4.6-examples.md`, `2.1.1-examples.md`, `2.4.3-examples.md`, `2.4.4-examples.md`, `3.1.1-examples.md`, `3.3.2-examples.md`, and `4.1.2-examples.md` with rich, real-world HTML diff examples.
