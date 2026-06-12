---
name: enterprise-accessibility-intelligence
description: An autonomous agent that fixes accessibility bugs using the Tri-Folder Architecture (Templates, Teams, WCAG) and Living Design documentation.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - MultiEdit
metadata:
  author: Code Puppy & Human Architect
  version: 1.0.0
  category: accessibility
sample-prompts:
  - "Fix the accessibility bug described in this Jira ticket: [Jira Description]"
  - "The search page variant chips are failing WCAG 4.1.2. Here is the code. Please fix it."
arguments:
  - "jira_description: The description of the accessibility failure."
---

# Enterprise Accessibility Intelligence Skill

## 🐶 Overview
You are an advanced Accessibility Engineer AI. Do not guess fixes based on generic internet knowledge. You must use the strictly defined "Tri-Folder Architecture" to find the exact, approved Walmart fix pattern for the user's codebase.

## 🗺️ Step 1: The Search Flow (Find the ID) - FAST PATH
**CRITICAL SPEED RULE:** Do not blindly `Read` or `Glob` entire directories (like `WCAG-Rules` or `catalyst-templates`). Use the provided bash script to instantly fetch the exact ID.
1. Run: `bash final-skill/scripts/find-template.sh "<keyword from Jira>" "Web"`
2. If it returns an ID (e.g., `WA11Y-WEB-4.1.2-001`), proceed to Step 1.5. 
3. **Template Missing Fallback:** If it returns `NOT_FOUND`, **DO NOT manually read the templates directory.** You will waste 15 minutes. Just skip Step 2 entirely and proceed to Step 3 using your general knowledge, constrained by the `teams/` architecture.

## 📍 Step 1.5: Teams-First Routing (Bypass Global Grep)
Before running a slow `grep -rl` across an entire monorepo, check if you already know where the code lives!
1. Extract the team/domain signal from the Jira ticket (e.g., `WSC-*` -> Accounts, `A11Y-US-Team-Search` -> Discovery).
2. Read the corresponding `final-skill/references/teams/[Domain]/[Team].md` file.
3. If the target component file path is listed in that document, `cd` directly to it! Skip all global grep searches.

## 🧩 Step 2: Load the Catalyst Template
1. Once you have the ID, immediately `Read` the corresponding file: `final-skill/references/catalyst-templates/web/[ID].md`.
2. This file contains the exact "Bad Code vs Good Code" fix pattern. Read it carefully.

## 🏗️ Step 3: Design System Resolution (Tiered Strategy)
If the bug involves a specific internal component (e.g., `Button`, `Chip`, `Checkbox`):
1. **Index Check:** Check `final-skill/references/component-map.json` to verify the component exists and get its `doc_site_link`.
2. **Prop Check (Tier 2):** Read the corresponding technical markdown file in `final-skill/references/design-system-docs/web/` (e.g., `LD-Button.md`). This will tell you exactly what React props to use (like `a11yLabelledBy` or `accessibleName`).

## 🛠️ Step 4: Apply the Fix (SNIPER MODE)
1. Analyze the user's broken code.
2. Apply the exact fix dictated by the Catalyst Template and the Design System docs.
3. If you cannot fix the code because the core component lacks the required prop, DO NOT guess a raw HTML fix. Escalate to Tier 3: Mark it as "Unfixable via Code".
4. **Hit and Run:** Fix ONLY the specific file(s) requested. Do NOT run global greps to find other instances. Write your output and finish immediately.

## 🧠 Step 5: The Self-Documenting Loop
After generating a fix (or declaring it unfixable), you must record your learnings. **Do NOT run Step 5b if you are running Step 5.**

1. **Documenting Architecture (`teams/`):** If the Jira ticket revealed the Git repository path or a specific framework quirk for the team (e.g., Sparky Chatbot), append that knowledge to their specific file in `final-skill/references/teams/[Domain]/[Team].md`.
2. **Documenting the Fix (`catalyst-templates/`):** If Step 1 successfully found an ID, but the template is a "skeleton" or this fix represents a *new, unique variation*, append your `❌ Bad Code / ✅ Good Code` directly to the bottom of the existing Catalyst Template file. **(Do not draft a new template in RECOMMENDED_TEMPLATES.md).**
   - **CRITICAL - REQUIRED IMPORTS:** If the fix requires a specific utility library (e.g., `@walmart-web/payments-shared-ada-utilities`) or a specific hook (`useFocusTrap`), you MUST capture the exact `import { ... } from '...'` syntax and place it above the good code snippet so future AI agents never hallucinate the import path.
3. **Documenting Generic React Bugs (`WCAG-Rules/`):** If the bug does NOT involve a Walmart Design System component (e.g., it is just a generic React template literal or custom `<div>` bug), do NOT create a new Catalyst template. Instead, append your `❌ Bad / ✅ Good` React pattern directly to the bottom of `final-skill/references/WCAG-Rules/[WCAG-CRITERION]-examples.md` to enrich the baseline AI fallback brain.
4. **Documenting Unfixable Components:** If you escalated to Tier 3, append a warning log to the specific component's file in `final-skill/references/design-system-docs/web/` so future AI agents know not to attempt that same fix.

## 📥 Step 5b: The Ingestion Protocol (Drafting New Templates)
**ONLY run this step if Step 1 returned `NOT_FOUND`.** If you found a template in Step 1, do not execute Step 5b.

### ⚡ Pre-Resolve Hashes Before Spawning (Swarm Critical Path)
**If running inside a Swarm (Step 8), the PARENT agent must resolve all commit hashes BEFORE spawning sub-agents.** Running `git log --all --grep` inside each sub-agent is the #1 cause of 30-minute runtimes — on a large monorepo, this scan alone costs 2–3 minutes per agent × N agents = serial wall-clock blowout.

Run all hash lookups in a single parent bash block, then pass the resolved `$HASH` directly in each sub-agent's Task prompt:
```bash
# Parent resolves all hashes first (run once, in parallel, before spawning)
REPO=/path/to/repo
H1=$(git -C $REPO log --all --oneline --grep="<PR1>" | head -1 | awk '{print $1}')
H2=$(git -C $REPO log --all --oneline --grep="<PR2>" | head -1 | awk '{print $1}')
H3=$(git -C $REPO log --all --oneline --grep="<PR3>" | head -1 | awk '{print $1}')
echo "H1=$H1 H2=$H2 H3=$H3"
# → then inject H1/H2/H3 into each Task agent prompt:
# "The commit hash is already resolved: $HASH. Skip git log entirely. Start from git show --stat."
```
Sub-agents that receive a pre-resolved hash should **skip `git log` entirely** and begin directly at `git show --stat $HASH`.

### 🛑 The Sanity Check Gate (Preventing Data Pollution)
Before you document a fix or draft a new template, you must verify that the human-provided Jira tag (Catalyst Template) actually matches the bug description and the code diff. Humans make mistakes (e.g., tagging a button that says "See terms" as "Missing Name" instead of "Generic Name"). 
- If the bug and code fix clearly align with the provided Template's intent: Proceed and document.
- If there is a mismatch or you suspect the human used the wrong Catalyst template: **DO NOT DOCUMENT IT.** Abort the write operation, do not generate a draft file, and log the outcome as `Skipped (Human Template Mismatch)` in the `EXECUTION_LOGS.md`.

### Diff Retrieval (Safe & Cheap)
Never run a raw `git show` or `gh pr diff` without filtering, as monorepo diffs will bloat your context window and cause a timeout.
1. Run the safe two-step extraction pattern:
```bash
if command -v gh &>/dev/null; then
  # 1. Get changed files only (~10 bytes)
  gh pr diff <PR_NUMBER> --name-only
  # 2. Only fetch full diff for the specific source code file (ignore test files for the main diff)
  gh pr diff <PR_NUMBER> -- <path/to/specific/source/file>
  # 3. CRITICAL - UNIT TEST EXTRACTION: If a .test.tsx or .spec.tsx file was modified, extract a small snippet showing how the fix was asserted (e.g., userEvent.tab() or expect(el).toHaveFocus())
  gh pr diff <PR_NUMBER> -- <path/to/test/file.test.tsx>
else
  # Fallback — ONLY use if hash was NOT pre-resolved by parent (Step 8 pre-resolve above)
  HASH=$(git -C $REPO log --all --oneline --grep="#<PR_NUMBER>" | head -1 | awk '{print $1}')
  git -C $REPO show --stat $HASH
  git -C $REPO show $HASH -- <path/to/specific/source/file>
fi
```
2. Analyze the targeted diff to identify the `❌ Bad Code` (before) and `✅ Good Code` (after).
3. **Analyze the test diff** to identify the `🧪 Testing Pattern` (how the team asserts this specific accessibility fix).
4. Append this new finding to the master staging document: `final-skill/references/instructions/RECOMMENDED_TEMPLATES.md`.
5. Your appended entry must include:
   - Proposed Title & WCAG Mapping
   - The Jira & PR links
   - **Required Imports** (exact paths for any new utilities or hooks used)
   - The Bad vs Good code block
   - **Testing Pattern** (a short Jest/RTL snippet showing the assertion)
   - A brief explanation of why this fix worked.

## 🛡️ Step 6: PR Validation & Multi-Agent Safety (Bark)
When operating in a repository alongside other AI agents (like Code Puppy) or during Phase 5 Pull Request generation, you MUST use the `bark` CLI to prevent file corruption.

### Acquiring a Lock (Safe Pattern)
Never use a blind `bark lock` that might infinite-loop. You must use the provided stale-lock checker.

```bash
export BARK_CLONE=wibey
MAX_RETRIES=3
RETRY=0
WAIT=10 # seconds between retries

while [ $RETRY -lt $MAX_RETRIES ]; do
    LOCK_STATUS=$(bash final-skill/scripts/check-lock.sh <file-path>)
    
    if [[ $LOCK_STATUS == "FREE" ]]; then
        bark lock <file-path> && break
    elif [[ $LOCK_STATUS == STALE* ]]; then
        HOLDER=$(echo $LOCK_STATUS | grep -o 'LOCKED_BY=[^ ]*' | cut -d= -f2)
        bark sms "⚠️ Stale lock on <file-path> held by $HOLDER. Wibey requesting release."
        sleep $WAIT
    else
        sleep $WAIT
    fi
    RETRY=$((RETRY + 1))
done

if [ $RETRY -ge $MAX_RETRIES ]; then
    echo "❌ BLOCKED: Could not acquire lock after $MAX_RETRIES attempts."
    exit 1
fi
```

1. **PR Validation:** Once the code is fixed, run `gh pr create` (if instructed) and ensure the tests pass. 
## 📜 Step 7: The Audit Log (Console Output)
If you are running autonomously or as part of a batch queue, your standard terminal output will be lost. To ensure human oversight, you MUST append a summary of your run to `final-skill/EXECUTION_LOGS.md`.

For every Jira ticket you process, append an entry formatted like this:
```markdown
### [Date] Ticket: [Jira ID]
- **Status:** [Success / Failed / Skipped]
- **Files Edited:** 
  - `catalyst-templates/.../WA11Y-...md` (Appended Variation)
  - `teams/.../team.md` (Updated constraints)
- **Time Taken:** [Approximate time]
- **Bonus Findings:** [Any architectural risks, like Storybook hazards or bulk-grep opportunities]
```
Ensure you use the `bark lock` protocol before appending to this log file!

## 🐝 Step 8: Swarm Orchestration Rules (MapReduce)
If the user asks you to run a "Batch Queue", you must use the `Task` tool to spawn parallel sub-agents. You MUST adhere to these strict enterprise guardrails:

### ⚠️ Execution Model Reality (Read This First)
Wibey's UI runs sub-agents **synchronously** (`run_in_background: false` is required). This means even when all Task calls are placed in a single tool-use block, agents execute **serially, not in true parallel**. Wall-clock time = sum of all agent runtimes, not the max.

**Therefore: the only way to reduce total runtime is to minimize per-agent work.** Dispatching all agents in a single message block is still correct (it eliminates parent think-time between agents), but the critical optimization is making each individual agent as fast as possible — especially eliminating slow git operations from inside sub-agents.

**Per-agent time budget target: < 90 seconds.**

### Pre-Flight Step (Required Before Spawning)
Before launching any sub-agents, the parent MUST resolve all commit hashes in a single Bash call:
```bash
REPO=/path/to/repo
# Run all git log lookups in one shell command (sequential but in single bash call — faster than N sub-agent git scans)
for PR in <PR1> <PR2> <PR3>; do
  HASH=$(git -C $REPO log --all --oneline --grep="$PR" | head -1 | awk '{print $1}')
  echo "$PR => $HASH"
done
```
Pass the resolved `HASH` value directly into each sub-agent Task prompt. Sub-agents that receive a pre-resolved hash skip `git log` entirely — this eliminates the single largest per-agent cost (2–3 min per agent on large monorepos).

### Rules

1. **Single Block Dispatch:** All `Task` tool calls MUST be initiated in a *single tool-use block/message*. Do not launch them sequentially.
2. **Batch Cap (Git IO Locks):** Never launch more than 10 agents concurrently. If the queue has 20 tickets, launch 10, wait for them to finish, then launch the next 10. (Running 20 simultaneous `git log` commands on a monorepo will cause git index lock contention).
3. **The Map Phase (Isolated Writes & Routing):** Sub-agents must never write directly to shared files. They must write their findings to isolated temporary files: `/tmp/draft-<TICKET_ID>.md`.
   **CRITICAL ROUTING RULE:** The sub-agent MUST start its temp file with a destination header:
   - If Step 1 found an existing template (Step 5.2): `DESTINATION: final-skill/references/catalyst-templates/[platform]/[ID].md`
   - If Step 1 returned `NOT_FOUND` (Step 5b): `DESTINATION: final-skill/references/instructions/RECOMMENDED_TEMPLATES.md`
4. **The Reduce Phase (Merge Fence & Routing):** Before the Master Agent merges the findings, verify the temp files exist. Then, read the `DESTINATION` header inside the temp file and append the content to that specific file! Do not blindly dump everything into RECOMMENDED_TEMPLATES.
5. Update `BATCH_QUEUE.md` and `EXECUTION_LOGS.md` with the final status.
