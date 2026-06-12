# Learning: A/B Benchmarking Wibey Skills

**Date:** March 2026
**Context:** When developing complex Enterprise Skills (like the `enterprise-accessibility-intelligence` skill), it is critical to prove its value over "Vanilla" AI models. To do this, we engineered an A/B Benchmarking strategy using Wibey's Swarm capabilities.

## The Goal
Measure the Quality, Efficiency, and Accuracy of an agent running **WITH** the skill versus an agent running **WITHOUT** the skill on the exact same bug.

## How to Execute the A/B Test

### 1. Preparation (Manual Context vs Jira Tool)
**Rule:** You should **manually copy and paste** the Jira bug description into the prompt, rather than asking the agents to use the Jira MCP tool to fetch it.
*   *Why?* If both parallel agents try to use the Jira API tool at the exact same millisecond, they might hit rate limits or cause a race condition. Furthermore, by pasting the exact text into the master prompt, you guarantee that both agents are starting from the *exact same context baseline*, ensuring a fair scientific test.

### 2. The Execution Environment
You must run this in **YOLO Mode (`SHIFT+TAB`)**. The master agent needs YOLO mode to seamlessly spawn two background `Task` agents simultaneously without pausing to ask you for permission for every step.

### 3. The Benchmarking Prompt
Paste this exact prompt into Wibey, replacing the `[Jira Bug Details]` placeholder with the copied ticket text:

```text
I want to run a strict A/B test on this accessibility bug:
---
[PASTE JIRA BUG DESCRIPTION HERE]
---

Please use the `Task` tool to spawn TWO parallel sub-agents in a single tool-use block:

**Agent 1 (The Enterprise Skill):**
Prompt: "You must strictly use the `enterprise-accessibility-intelligence` skill to fix this bug. Follow its exact instructions to find the Catalyst template and Team routing. Do NOT modify the source code. Instead, write your final proposed `❌ Bad / ✅ Good` React diff to a new file called `/tmp/agent1-skill-fix.md`."

**Agent 2 (Vanilla AI):**
Prompt: "You are a standard accessibility expert. Please find and fix this bug using your general internet knowledge. Do NOT use any special enterprise skills. Do NOT modify the source code. Instead, write your final proposed `❌ Bad / ✅ Good` React diff to a new file called `/tmp/agent2-vanilla-fix.md`."

Launch both agents now, wait for them to finish, and then read both `/tmp/` files to tell me which one wrote the better code!
```

## What to Measure (The Expected Outcomes)

When the test finishes, analyze the two `/tmp/` files across these dimensions:

1. **Enterprise Accuracy (Quality):** 
   *   Did the Vanilla Agent guess a raw HTML `<button aria-label="X">` fix?
   *   Did the Skill Agent correctly implement the exact Living Design React component (e.g., `LD-Button`, `DsClarityDialog`) mandated by the internal design system?
2. **Efficiency (Speed):**
   *   The Vanilla Agent will likely finish *faster* because it does not read documentation. However, its fix will likely fail Enterprise PR review.
   *   The Skill Agent will take longer (because it reads the `teams/` and `catalyst-templates/` folders), but its fix will be PR-ready immediately.
3. **Safety (The `/tmp/` Isolation):**
   *   By forcing both agents to write to `/tmp/agent-*.md`, we guarantee they do not accidentally overwrite each other inside the actual `Walmart-Web-2` monorepo.
