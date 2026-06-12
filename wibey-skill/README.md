# 🐶 AI Accessibility Skill (wibey-skill)

Welcome to the **Enterprise Accessibility Intelligence System**!

## 🌟 Vision
This project is transforming the static `/fixing-accessibility` wibey skill into a self-improving, autonomous AI agent. It doesn't just guess accessibility fixes based on general internet knowledge—it acts as a specialized internal consultant that understands exact team architectures and specific internal fix templates.

## 🏗️ The "Tri-Folder" Architecture
The brain of this AI is structured into three distinct layers of context:

1. **Catalyst Templates (`final-skill/catalyst-templates/`):** The *How*. Contains exact internal component patterns linked to the Catalyst tool (e.g., `catalyst-button-role.md`). This is the primary fix logic.
2. **Teams (`final-skill/teams/`):** The *Where*. Contains repo paths, component ownership, and tech stack details for specific teams (e.g., `web-homepage-team.md`). This drastically reduces the AI's search space.
3. **WCAG Rules (`final-skill/wcag/`):** The *Why*. Contains semantic reasoning for all 87 WCAG Level A and AA criteria. This acts as the foundational fallback layer.
4. **Decoupled Component Map:** The structural logic connecting UI elements to their fixes, kept independent so data can be seeded without disrupting the templates.

## 🔄 The Autonomous Loop
1. **Ingest:** Read Jira ticket (Template ID, Team Label, WCAG Label) and consult Component Map.
2. **Retrieve:** Pull specific Catalyst Template, Team architecture, and WCAG reasoning.
3. **Fix:** Apply the highly confident, contextualized code fix.
4. **Learn:** If the merged PR contains a unique pattern, self-document it back into the Knowledge Base.

## 📂 Project Tracking
- [Master Plan (PRD)](PLAN.md)
- [Remaining Tasks](REMAINING_TASKS.md)
- [Changelog](CHANGELOG.md)

## 🛣️ Roadmap & Future Expansion
Now that the core Web architecture and Self-Learning Loop is fully operational, the following tasks represent the next evolution of this skill:

1. **Build & Test New Catalyst Templates:** Manually author a new, complex Catalyst Template (e.g., a cross-platform component or a complex web form bug) and run a dry-run with Wibey to validate its capability on harder scenarios.
2. **Expand Sample Data:** Generate more mock repository samples and Jira ticket prompts to stress-test the AI's "Teams-First Routing" and failure fallbacks.
3. **Platform Expansion (iOS & Android):** Expand the `component-map.json` and `/design-system-docs/` to include native mobile components (e.g., SwiftUI and Kotlin Compose).
4. **Global Deployment:** Distribute the finalized `SKILL.md` orchestrator to the `~/.wibey/skills/` directory for true seamless CLI invocation across any repository on the host machine.
5. **Automated Triaging Pipeline:** Build a cron job or webhook that allows Wibey to automatically scan Jira queues, fetch new bugs, and attempt the Tri-Folder workflow overnight, leaving PRs for engineers to review in the morning.

## 💻 Quick Start: Running Code Puppy via `.zshrc`
To make Code Puppy easily accessible from anywhere in your terminal without needing to activate virtual environments manually, add an alias to your `.zshrc` file.

1. Open your terminal and run:
   ```bash
   echo 'alias puppy="/Users/g0c073y/.code-puppy-venv/bin/code-puppy"' >> ~/.zshrc
   ```
2. Reload your configuration:
   ```bash
   source ~/.zshrc
   ```
3. Now you can launch Code Puppy from any directory just by typing:
   ```bash
   puppy
   ```

## 🤖 Quick Start: Running Wibey CLI
You can run Wibey from any project directory and it will automatically read your current context:
```bash
wibey
```
*(Note: Your `~/.zshrc` already has the required paths added by the installer: `~/.local/bin` and `BUN_INSTALL_CACHE_DIR`).*

### Useful `.zshrc` Aliases for this Project
To speed up your accessibility workflow, you can add these custom convenience aliases to your `~/.zshrc`:

```bash
# Pre-set bark agent identity so it never errors during multi-agent locks
export BARK_CLONE="wibey"

# Quick alias to jump directly into the target Walmart-Web-2 monorepo and launch Wibey
alias wibey-wm="cd /Users/g0c073y/Desktop/githubs/Walmart-Web-2 && wibey"

# Quick alias to jump right back into this wibey-skill dev context
alias wibey-skill="cd /Users/g0c073y/Documents/GitHub/wibey-skill && wibey"
```
After adding them, reload your terminal with `source ~/.zshrc`.

---

## 🏭 Operating the AI Factory (The Manual Workflow)
This project utilizes a powerful dual-terminal setup. One terminal runs **Code Puppy** (The Architect) to manage the repository structure, and another terminal runs **Wibey** (The Executor/Swarm) to interact with live code, GitHub, and Jira.

### Step 1: Terminal Setup
1. **Terminal 1 (Code Puppy):** Open `~/Documents/GitHub/wibey-skill` and type `puppy`. Use this terminal to ask architectural questions, write scripts, or review the logs.
2. **Terminal 2 (Wibey):** Open this terminal to any directory, type `wibey`, and immediately hit `SHIFT+TAB` to enter **YOLO Mode**.

### Step 2: Build the Queue
1. Open `ADA-Bugs-Before/docs-ideas/batch-queue-builder.html` in your web browser.
2. Paste your Jira links, GitHub PR links, and notes.
3. Click **"Copy for Wibey"** and paste the resulting Markdown table into `final-skill/BATCH_QUEUE.md`.

### Step 3: Launch the Swarm
Go to **Terminal 2 (Wibey)** and paste the Master Execution Prompt:

> "Hey Wibey, please run the current batch queue found in `final-skill/BATCH_QUEUE.md`. Target repo: `/Users/g0c073y/Desktop/githubs/Walmart-Web-2`.
> 
> **CRITICAL EXECUTION RULES:**
> 1. You MUST follow **Step 8: Swarm Orchestration Rules** from your `SKILL.md` orchestrator.
> 2. You MUST launch all necessary sub-agents for the `PENDING` rows in a **SINGLE tool-use message**. (Cap at 10 agents per round).
> 3. Sub-agents must use the 'Two-Step Diff' logic and write their output to isolated `/tmp/draft-[JIRA_ID].md` files containing the `DESTINATION` routing header.
> 4. You (Master Agent) must use bash to verify those `/tmp/` files actually exist before appending them to their specific Catalyst Template or Team file.
> 5. Record the execution trace and your final status updates in `EXECUTION_LOGS.md` (Step 7).
> 
> Launch the Swarm autonomously now!"

### Step 4: Audit & Review
Walk away! When Wibey finishes (expect ~5.5 minutes per ticket), go back to **Terminal 1** and ask Code Puppy: *"Can you read the `EXECUTION_LOGS.md` and summarize what the swarm just built?"*

---

## 📦 Building & Deploying the Skill
Once the Swarm has successfully ingested the knowledge base, the `final-skill/` directory is ready to be packaged for human Beta Testers (Phase 9).

### 1. Package the Skill
Run this command from the root of the project to create a Wibey-compliant, clean `.zip` archive. This explicitly excludes your local execution logs so the beta tester gets a fresh slate:

```bash
rm -f enterprise-a11y-skill.zip
zip -r enterprise-a11y-skill.zip final-skill/ \
  -x "final-skill/EXECUTION_LOGS.md" \
  -x "final-skill/BATCH_QUEUE.md" \
  -x "*/.DS_Store"
```

### 2. Beta Tester Installation
Give the `.zip` file to your developers and tell them to run the following in their terminal:
```bash
# Unzip the skill
unzip enterprise-a11y-skill.zip

# Move it to the Wibey configuration directory
mv final-skill ~/.wibey/skills/enterprise-a11y-skill

# Reload Wibey (the skill will now trigger automatically on accessibility prompts!)
```
