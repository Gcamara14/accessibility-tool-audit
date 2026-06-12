AI Accessibility Skill — Voice Memo Notes



Core vision



Build an accessibility skill for the company’s main enterprise AI so engineers can give it an accessibility Jira bug and the AI can help fix it.



Short-term goal



The skill should:

Take an accessibility Jira ticket

Read the bug details and labels

Identify the relevant accessibility rule / WCAG criterion

Reference internal guidance for the preferred fix

Help generate or apply the fix

Support PR creation and merge workflow

Document the fix into a growing source of truth



Long-term goal



Move toward an autonomous accessibility agent that can:

Fix accessibility bugs on the fly

Create PRs automatically

Merge fixes

Self-document what it learned

Reuse past fixes for future similar bugs

Main idea



Use WCAG / accessibility criteria as the backbone of the system.



Proposed structure



Create around 87 markdown files, one per accessibility criterion / rule, with:

Rule explanation

Why it matters

Preferred fix guidance

Code examples

Common failure scenarios

Recommended implementation patterns



Since Jira bugs are already labeled by rule (example: 1.1.1), the AI can:

Pull the Jira ticket

Check the accessibility label

Open the matching markdown file

Use that file as the fixing guide



This matters because it gives the AI a repeatable decision system, not just random bug fixing.

Self-improving documentation layer



Alongside the rule guidance files, create a second layer of documentation for examples.



Possible paired file structure



For each rule:

criterion-guidance.md

pass-fail-examples.md



Example file should include

What failed

Example bad code

How it was fixed

Example corrected code

Notes on why that fix worked

Scenario context



Important rule



Only add a new example when it is a meaningfully unique fix pattern.



Do not keep adding duplicates of the exact same issue unless:

The context is different

The implementation pattern is different

The fix approach is materially different



This matters because otherwise the knowledge base gets noisy and harder for AI to learn from.

Desired behavior over time



The system should build a growing accessibility knowledge base:

Week 1: maybe 1 example

Later: 5–10 examples

Years later: hundreds or thousands of examples



Over time, when a new bug appears, the AI should:

Check the rule guidance

Check if similar bugs were fixed before

Reuse the best historical fix pattern

Suggest improvements if needed



That creates a feedback loop where the skill gets smarter from prior fixes.

Scope boundaries



In scope

Accessibility expertise

Fix guidance

Rule mapping

Documentation design

Example knowledge base



Out of scope for now

Automatically finding where the code lives

Repo navigation / code ownership logic

Engineering-side plumbing



You want engineers to own the “where is the code” problem while you own the accessibility intelligence.

Project 1



Build the accessibility AI skill



Main workflow:

Engineer gives AI an accessibility Jira ticket

AI reads labels + ticket context

AI maps to correct accessibility rule

AI references preferred fix documentation

AI proposes / applies fix

AI creates PR

AI merges

AI updates the knowledge base if the example is unique

Project 2



Build the documentation + starter dataset



Need to create:

Rule guidance docs

Pass/fail example docs

Initial batch of analyzed historical accessibility tickets and PRs

Starter dataset idea



Walmart already has a huge backlog of accessibility tickets — possibly 10,000+ over the last 2 years.



You want to process at least a subset of those to create the first batch of knowledge.



Goal of starter batch



Use real past bugs + their real fixes to seed the knowledge base.



This matters because the AI will be much stronger with real internal examples instead of only generic accessibility advice.

Proposed semi-manual bootstrap workflow



You do human-reviewed ingestion first, then automate later.



Rough workflow

Open Jira bug

Copy bug description / metadata / labels

Find the PR that fixed it

Copy PR context / code diff

Generate a structured prompt

Send that prompt into Cursor

Cursor analyzes:

what failed

which rule it maps to

how it was fixed

whether it is a unique example

Cursor drafts the markdown update in the correct file

You review it

Save it into the knowledge base

Chrome extension idea



Create a lightweight extension to speed up data collection.



Desired extension workflow

Button 1: Copy Bug

captures Jira description, labels, metadata

Button 2: Copy PR

captures PR details / code changes

Button 3: Generate Prompt

combines bug + PR into a structured AI prompt



Then you paste that into Cursor and let agents do the analysis.



This matters because the bottleneck is not the AI — it’s the manual collection workflow.

Cursor / multi-agent idea



Use Cursor plus multiple agents to process historical bugs faster.



Possible agent roles

Agent 1: classify bug by rule

Agent 2: analyze PR fix pattern

Agent 3: draft markdown example

Agent 4: check for duplication / uniqueness

Agent 5: format into source-of-truth docs



You still do the final review at first.

Key design principles

Rule-based foundation: organize around accessibility criteria

Self-documenting system: every fix strengthens the knowledge base

Unique examples only: avoid clutter

Human review first: quality before automation

Eventually autonomous: start manual, end scalable

Internal source of truth: AI should learn from Walmart-specific fixes

Open questions to solve

Where should the source-of-truth files live?

Should example files live next to each rule file?

What exact schema should each markdown file use?

How do you define “unique enough” to add a new example?

What metadata should be stored for each example?

How should the AI decide whether to update docs or skip?

What’s the minimum viable starter batch size?

Strong recommendation



Your best first version is:



Phase 1

Create the 87 rule guidance files

Create matching example files

Define a strict markdown template

Manually seed 20–50 high-quality historical bug/fix examples



Phase 2

Build the copy bug / copy PR / generate prompt workflow

Use Cursor to accelerate ingestion

Keep human review



Phase 3

Connect the knowledge base to the enterprise AI skill

Let AI reference guidance + examples during bug fixing



Phase 4

Add automated documentation updates after approved fixes

Simple one-line summary



You’re building an AI-powered accessibility fixing system that uses rule-based guidance plus a growing library of real bug-fix examples so the AI can improve over time and eventually fix accessibility issues autonomously.



Takeaway: the smartest starting point is 87 rule files + paired example files + a semi-manual historical bug ingestion workflow, because that gives you a scalable knowledge base before full automation.