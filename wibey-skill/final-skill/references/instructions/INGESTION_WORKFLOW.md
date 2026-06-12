# 🧠 The AI Self-Documenting Ingestion Workflow

This document outlines the strict rules and logic flow for how the wibey-skill AI extracts data from solved Jira tickets, determines if the fix is meaningfully unique, and self-documents that knowledge into our Enterprise Accessibility Intelligence System (The Tri-Folder Architecture).

---

## 📂 Part 1: Content Rules by Folder

### 🧩 1. `/catalyst-templates/` (The *How* - Catalyst Tool Fix Logic)
*   **What goes in here:** Reusable, specific fix patterns linked to the Catalyst tool used for tagging accessibility fixes.
*   **Naming Convention:** Kebab-case.
*   **Identifiers:** Use the official Jira Template ID or the keys defined in `templates-v1-03-19-2026.js` (e.g., `wcp-chip-missing-name.md`, `catalyst-button-role.md`).
*   **Required Content:**
    *   **Mapped WCAG Rule:** (e.g., 4.1.2)
    *   **The "Bad" Pattern:** The inaccessible DOM structure.
    *   **The "Good" Pattern:** The exact React/Swift/HTML fix merged in the PR.
*   **Constraint:** *Do NOT put generic HTML fixes here unless it's a foundational pattern.* This folder is for Walmart-specific codebase fixes mapped via Catalyst.

### 🗺️ 2. The Component Map (Decoupled Data Source)
*   **What it is:** The mapping logic (e.g., `wcpComponentMap`) that connects UI elements to their fixes.
*   **Constraint:** This map is completely **decoupled** from the `/catalyst-templates/` folder.
*   **Why:** By keeping the map separate (e.g., in a dedicated `.js` or `.json` file), we can ingest or seed new mapping data independently, and update the map without having to restructure the entire template library.

### 🏢 3. `/teams/` (The *Where* - Architecture & Context)
*   **What goes in here:** Context about *where* code lives and *how* a specific team builds things.
*   **Directory Structure:** Grouped by the 10 core Domain Areas (e.g., `teams/US-Discovery/A11Y-US-Team-Search.md`, `teams/US-Transaction/checkout-core.md`).
*   **Required Content:**
    *   **Repository Paths:** e.g., `git@github.walmart.com:us-web/discovery-search.git`.
    *   **Tech Stack:** React (CSR/SSR), React Native, iOS (SwiftUI/UIKit), Android (Kotlin/Compose).
    *   **Known Pitfalls:** E.g., "The Search team heavily uses single-dimension variant pills (`Chip_chip`) which often lack `aria-label`."
*   **Constraint:** *Do NOT put actual bug code diffs here.* This folder is strictly architectural context to narrow the AI's search space.

### 📚 3. `/wcag/` (The *Why* - Semantic Fallback)
*   **What goes in here:** The core reasoning for the 87 Level A and AA criteria (Already seeded), **plus condensed code examples appended during ingestion**.
*   **Constraint:** This folder is **read + append-only during ingestion**. The AI appends condensed Bad/Good code examples to `WCAG-Rules/<criterion>-examples.md` as part of Step 4.5 (Dual-Write). It does NOT delete or restructure existing content. Outside of ingestion (i.e., during normal bug-fixing in Step 4), it only *reads* this folder to understand the intent of a bug if it lacks a template.

---

## 🤖 Part 2: The Self-Documenting Workflow (Step-by-Step)

### 🗺️ The Search Flow (How the AI Finds the Right Template)
When the AI is tasked with fixing a bug (e.g., from a Jira ticket), it does not randomly guess. It uses the Master Index:

1. **Query the Index:** The AI searches `templates-v1-03-19-2026-refactored.js` filtering by the target `platform` (e.g., "Web") and bug context (e.g., "Missing Name").
2. **Extract the ID:** The AI finds the matching JSON object and extracts its strict `id` (e.g., `WA11Y-WEB-4.1.2-001`).
3. **Load the Fix:** The AI completely stops guessing and explicitly loads the file from the corresponding platform folder: `final-skill/references/catalyst-templates/[platform]/[ID].md` (e.g., `catalyst-templates/web/WA11Y-WEB-4.1.2-001.md`). This file contains the exact, hyper-specific fix patterns for that exact scenario.

---

### 🎯 Tiered Resolution Strategy (Design System / WCP Components)
Before the AI self-documents or attempts a wild code fix, it MUST adhere to this tiered strategy when encountering internal Design System components:

1.  **Tier 1: Automated Fix:** Attempt to resolve the issue using existing knowledge, Catalyst Templates, and known system props.
2.  **Tier 2: RAG / Documentation Lookup:** If the fix isn't obvious (or a prop seems missing), the AI references the design system's component repository (via static ingested docs or live RAG) to identify available props that the original developer might have missed.
    *   *Platform Awareness:* The AI must look in the correct platform sub-directory (`design-system-docs/web/`, `design-system-docs/ios/`, or `design-system-docs/android/`) because React props differ significantly from Swift/Kotlin props.
3.  **Tier 3: Fallback / Escalation (Unfixable via Code):** If the AI still cannot resolve the issue programmatically (e.g., the core WCP component simply does not accept an `aria-label` prop), it does **NOT** hack a fix with raw HTML. 
    *   **Action:** It flags the issue as *Unfixable via Code*.
    *   **Documentation:** It writes a specific note explaining *why* an upstream Design System change is required.

---

When a Jira ticket is moved to `Done` with a linked PR, the AI Ingestion Agent kicks off:

### Step 1: Data Extraction
1.  **Ask Wibey Jira:** Pull `primaryWCAG`, `bugTeam`, `Bug Location`, `Bug Platform`, and `Acceptance Criteria`.
2.  **Ask Wibey GitHub (`gh`):** Run `gh pr diff <pr-number>` to extract the exact code changes.
    *   **What we extract (The Code):** The `❌ Bad` (before) and `✅ Good` (after) React/Swift/HTML code blocks.
    *   **What we extract (Unit Tests):** If `.test.tsx` or `.spec.tsx` files are modified, we extract the exact assertions (e.g., `userEvent.tab()`, `expect(el).toHaveFocus()`). 
        *   *Why:* So the AI learns how teams write accessibility tests. When it writes future fixes, it will write passing tests to prevent PR blockage.
    *   **What we extract (Required Imports):** We extract exact file paths for utility hooks or shared libraries (e.g., `import { useFocusTrap } from '@walmart-web/...';`).
        *   *Why:* To completely eliminate LLM hallucination of enterprise monorepo paths during future fix generations.

### Step 2: Evaluation & Matching
Before the AI processes the diff, it must pass a strict data-quality filter.
*   **The Sanity Check Gate:** The AI compares the human-provided Jira tag (Catalyst Template) against the actual bug code. If a human tagged a generic button as "Missing Name" when it clearly had text, the AI flags a mismatch and **drops the ticket**.
    *   *Why:* We treat this Knowledge Base like pristine machine-learning training data. We drop "dirty data" caused by human typos rather than letting it pollute our Catalyst Templates.
*   **Component Check:** *Is this a known component?* (Checks the decoupled Component Map).
*   **Novelty Check:** *Is this fix meaningfully unique?* (If the PR just adds another `aria-label` to a generic `<div>` exactly like 50 other tickets, **Discard**).

### Step 3: The "Custom Catalyst Template Needed" Flow
If the AI detects a completely novel fix pattern or a new internal component (e.g., "Wow, the team just built a brand new Carousel component and fixed its keyboard trapping"):
1.  **Drafting:** The AI generates a new Catalyst template file (e.g., `catalyst-carousel-keyboard-trap.md`).
2.  **Staging (`/catalyst-templates/drafts/`):** The AI does **NOT** push this straight to the core `/catalyst-templates/` folder. It places it in a `drafts/` directory or proposes it via a GitHub Pull Request to the `wibey-skill` repository.
3.  **Human Review:** A Senior Accessibility Engineer reviews the drafted markdown. If approved, it is moved to `/catalyst-templates/` and becomes permanent AI memory.

### Step 4: Updating Team Context
If the PR reveals a new repository path or a new tech stack nuance for a team (e.g., *The Search team just migrated from React to Next.js SSR*):
1.  The AI automatically appends a note to the corresponding file in `/teams/[Domain Area]/[Team Name].md`.
2.  *Result:* The next time the AI fixes a bug for that team, it knows to look for SSR patterns instead of CSR patterns.

### Step 4.5: WCAG Examples Dual-Write (Fallback Layer)
After writing to the primary destination (catalyst template or `RECOMMENDED_TEMPLATES.md`), the agent **MUST** also append a condensed code example to the matching WCAG fallback file:

`WCAG-Rules/<criterion>-examples.md` (e.g., `2.4.3-examples.md`)

**Why this matters:** When the runtime fix skill (Step 1) gets `NOT_FOUND` from `find-template.sh`, it falls back to reading the WCAG examples file. Without real ingested code examples there, the fallback produces only generic fixes. This dual-write ensures the fallback layer has Walmart-specific patterns from real PRs.

**Format for the appended block:**

```markdown
### Example: <short description> (<Jira ID>)

**What failed**: <1-2 sentence explanation>
**Template:** [`<TEMPLATE_ID>`](../catalyst-templates/<platform>/<TEMPLATE_ID>.md)

**Bad Code**:
```<language>
<bad snippet - keep under 10 lines>
```

**How it was fixed**: <1 sentence>

**Corrected Code**:
```<language>
<good snippet - keep under 15 lines>
```
```

**Rules:**
1.  **Section by platform:** Append under `## Web Examples`, `## iOS Examples`, or `## Android Examples`. If the platform section doesn't exist yet, create it.
2.  **Keep snippets SHORT** — the full detail lives in the catalyst template. Link back to it.
3.  **Append-only** — never delete or restructure existing examples in the WCAG file.
4.  **Always link back** to the full catalyst template with a relative path.
5.  **This step happens regardless** of whether the template was found or `NOT_FOUND`. Both branches of the routing tree trigger the dual-write.

---

## ⚖️ The "Meaningfully Unique" Constraint (AI Rubric)
To prevent the knowledge base from becoming a bloated mess of 10,000 identical `aria-label` fixes, the AI must score the PR diff against this rubric before drafting a template:
*   **[+3]** Fixes a complex custom component (e.g., multi-select combobox, modal focus trap).
*   **[+2]** Involves a specific Walmart design system element (`WCP_*`).
*   **[+2]** Solves a cross-platform discrepancy (e.g., iOS VoiceOver vs Android TalkBack).
*   **[-5]** Simple typo fix in alt text.
*   **[-5]** Standard `aria-label` addition on a generic HTML element that is already documented.
*(Only PRs scoring 2 or higher trigger the Self-Documenting flow).*