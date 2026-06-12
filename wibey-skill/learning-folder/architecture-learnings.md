# Architectural Learnings & AI Paradigms

*This document captures the meta-learnings discovered while building the Wibey Tri-Folder Accessibility Skill.*

## 1. LLM Hallucination vs. Structural Knowledge
During the component mapping phase, we discovered a crucial paradigm: **LLMs have incredible structural knowledge of code, but terrible rote memorization of URLs.**
*   *Observation:* Wibey perfectly identified internal Living Design (LD) React props like `a11yLabelledBy` and `accessibleName` through "pattern inference" of enterprise design systems.
*   *Failure:* However, it completely hallucinated the canonical documentation URLs (guessing `designsystem.walmart.com`).
*   *Solution:* We implemented a **Tier 2: RAG / Documentation Lookup** strategy. We must explicitly arm the AI with `confluence.search` or `mcp__tech-assistant` tools so it can verify URLs dynamically rather than relying on its base weights.

## 2. Platform Segregation is Mandatory
Initially, we planned a flat `design-system-docs/` folder. We quickly realized that mixing platforms causes catastrophic hallucinations.
*   *The Danger:* If an AI reads iOS SwiftUI props (`accessibilityLabel`) and Web React props (`aria-label`) in the same folder or file, it will attempt to inject React props into Swift codebases.
*   *Solution:* We strictly segregated documentation and templates by platform: `catalyst-templates/web/`, `catalyst-templates/ios/`, etc. The `SKILL.md` orchestrator is explicitly instructed to respect these boundaries.

## 3. The `WA11Y` Semantic Indexing Strategy
We realized that giving an AI an array of 97 bugs with arbitrary UUIDs makes routing impossible. 
*   *Solution:* We engineered the `WA11Y-[PLATFORM]-[WCAG]-[COUNTER]` ID schema. 
*   *Why it works:* By making the ID semantic (e.g., `WA11Y-WEB-4.1.2-001`), the AI can use a simple `grep` command to find the correct fix without needing complex vector embeddings. The ID serves as the literal filename, creating a 1:1 map between the Javascript Index and the Markdown file.

## 4. The Self-Learning Loop (Phase 5)
An AI skill that just fixes code is static. An Enterprise AI must be self-learning.
*   *Architecture:* We built the `teams/` directory to serve as an "Architectural Memory Bank." 
*   *The Loop:* When the AI finds a new repo path or a framework quirk in a Jira ticket, it is explicitly instructed (via `SKILL.md`) to write that finding back into `teams/[Domain]/[Team].md`. This reduces the search space for the next AI agent exponentially over time.

## 5. GitHub CLI (`gh`) & YOLO Mode Requirements
To achieve "Phase 5: Full Automation," Wibey needs to be able to clone repos, scan them, and submit PRs.
*   *The Limitation:* Wibey does not have an innate, magic API connection to GitHub. It relies entirely on the local `gh` (GitHub CLI) tool and standard `bash`.
*   *The Solution:* To run autonomous repo-scanning and self-documenting PR loops, **Wibey MUST be in YOLO Mode (Shift+Tab)**. 
*   *Workflow:* In YOLO Mode, Wibey can run `gh repo clone org/repo-name`, search the files for `LD Button` components lacking `aria-label`, automatically create a branch, run the Tri-Folder fix, and run `gh pr create`.

## 6. The Autonomous Loop Proof of Concept
The most profound learning of this project came during the final test against the live `Walmart-Web-2` repository (Jira WSC-4050). 
*   *The Proof:* The AI successfully read a Jira ticket via the MCP tool, mapped it to `WA11Y-WEB-4.1.2-005`, read the target codebase, acquired a `bark lock` to prevent cross-agent file corruption, and fixed the code.
*   *Self-Documenting Validation:* The AI autonomously identified that it was fixing a novel pattern (the `ui-button` wrapper coupled with the `useSignIn` hook). It correctly scored the uniqueness, instantiated a new `identity-next.md` team file, and appended the `✅ Good Code` variation to the catalyst template. This proves that an AI can maintain its own tribal knowledge base securely within an enterprise boundary.

## 7. Multi-Agent Deadlock Prevention (Bark Stale Locks)
During live testing, we discovered that relying on a simple `bark lock <file>` can cause an infinite hang if the agent holding the lock crashes or is killed abruptly.
*   *The Hack:* Bark stores its lock state as raw JSON messages in `.agents/mailboxes/__locks/messages/`.
*   *The Solution:* We engineered `check-lock.sh` to read the timestamp of the latest JSON message. If the `acquired` lock is older than 5 minutes, the AI flags it as `STALE`, uses `bark sms` to notify the swarm, and fails gracefully after 3 retries. This prevents CI/CD pipelines from hanging indefinitely due to dead AI agents.

## 8. "Restrict" vs. "Prioritize" in Prompt Engineering
When creating the `teams/` directory schemas, we initially instructed the AI: *"When fixing bugs for this team, restrict your search space to this monorepo path."* 
*   *The Danger:* If a human developer refactored or moved that component the day prior, the AI would rigidly obey the "restrict" command, fail to find the file, and abort the task entirely.
*   *The Fix:* We updated the schema to: *"Start your search here (priority routing) before falling back to global grep."* This provides the AI with the 99% fast-path while preserving the 1% safety net of a global search, ensuring resilience against rapidly changing enterprise codebases.

## 9. The "Two-Step Diff" Ingestion Strategy
During the Phase 5 Ingestion Protocol, if the AI runs a raw `gh pr diff` or `git show` on an enterprise monorepo, it will accidentally ingest hundreds of lines of unit tests, snapshot files, and unrelated hunks. This will bloat the AI's context window, causing massive reasoning delays (e.g., 12+ minutes) and potential token exhaustion.
*   *The Fix:* We engineered the "Two-Step Diff" protocol in `SKILL.md`. The AI must first run `--name-only` or `--stat` to retrieve just the filenames. Then, it explicitly targets the single UI source file (e.g., `gh pr diff 123 -- ui-component.tsx`), ignoring the heavy `.spec.tsx` and `.json` files entirely. This caps data ingestion at under 60 seconds.

## 10. AI Swarm Orchestration (The MapReduce Pattern)
During our first autonomous "Batch Queue" test, Wibey attempted to launch 4 parallel agents to process 4 PRs simultaneously. Through forensic analysis, we discovered critical enterprise scaling constraints:
*   *The Illusion of Parallelism:* The AI initially called the `Task` tool sequentially. True parallelism requires all `Task` payloads to be submitted in a single tool-use block.
*   *Git IO Lock Contention:* Attempting to run `git log` or `gh pr diff` across 20 parallel agents on a massive monorepo will crash Git due to `index.lock` contention. We established a hard limit: **Batch in chunks of 10**.
*   *The MapReduce Architecture:* To avoid 10 agents fighting over a single `bark lock` to write to `RECOMMENDED_TEMPLATES.md`, we engineered a MapReduce flow. The sub-agents (Map) write their findings to isolated `/tmp/draft-ID.md` files. The Master Agent (Reduce) verifies the files exist via a bash `-s` check, then merges them sequentially into the master document.

## 11. Swarm Execution Realities & Hash Pre-Resolution
During a 3-ticket batch run, the AI took over 30 minutes to complete. A Tool Telemetry Audit revealed two critical flaws in our theoretical swarm architecture:
1. **The Sub-Agent Synchronicity Flaw:** Wibey's UI enforces `run_in_background: false` for the `Task` tool. Even if launched in a single tool block, sub-agents execute *sequentially*. Three 10-minute tasks take 30 minutes, not 10.
2. **The `git log` Monorepo Bottleneck:** Because `gh` CLI was unavailable, each sub-agent ran `git log --all --grep="#PR"` to find the commit hash. On a massive enterprise monorepo, this single bash command takes 2-3 minutes. Running it 3 times sequentially took ~9 minutes.
*   *The Fix:* We engineered **Pre-Flight Hash Resolution** in `SKILL.md`. The Master Agent runs a single bash script to extract ALL commit hashes for the batch *before* launching the sub-agents. It then injects the literal `$HASH` directly into the sub-agent prompt, allowing them to instantly run `git show --stat`. This reduced a 30-minute queue to roughly 4 minutes.

## 12. Hitting the Platform Ceiling (Synchronous Swarms)
During a 9-ticket batch ingestion, the swarm took exactly 49m 28s. This perfectly mathematical ~5.5 min per ticket throughput proved the ultimate platform limit: Wibey UI restricts the `Task` tool to synchronous execution (`run_in_background: false`). 
*   *The Lesson:* True multithreading is impossible in this specific host environment. However, because the MapReduce logic (writing to `/tmp/` and having the Master merge) successfully prevented all IO file collisions, this 49-minute runtime is perfectly acceptable as a "Set and Forget" background CRON job, even if it is slow to watch interactively.

## 13. The Enterprise AI Product Lifecycle
Building an AI Skill is only 50% engineering; the other 50% is Data Seeding and Product Rollout. We established a rigorous 5-step post-engineering lifecycle (Phases 6-10):
*   *Data Saturation (Phase 6):* Before launching to users, an AI must be saturated with domain-specific data. We rely on the Ingestion Swarm to build this "Fossil Record" first.
*   *Beta Testing & Refinement (Phases 7 & 9):* An AI skill must be handed to a human beta tester to identify prompt-engineering friction points and hallucination edge-cases *before* expanding scope.
*   *Fallback Expansion (Phase 8):* An enterprise AI must have a "Tier 3 Fallback" (e.g., generic WCAG rules) for when it encounters code outside its primary domain (Design Systems).
*   *Platform Expansion (Phase 10):* Only after Web is perfected and human-validated do we attempt cross-platform scaling (iOS/Android), preventing the compounding of logic errors across multiple environments.
