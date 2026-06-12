# Wibey Skills Documentation

## What Are Skills?
Skills are specialized, autonomous modules that extend Wibey's capabilities with domain-specific knowledge, workflows, and tool integrations. They enable developers to work more efficiently by providing focused, intelligent assistance for specific tasks and problem domains. They are small, focused bundles of instructions, scripts, and resources that Wibey loads dynamically to perform specialized tasks. Think of them as “mini plugins” or “capability packs” that teach Wibey exactly how to do something.

### Skills Features:
*   Provide specialized expertise in specific domains (e.g., code review, skill creation, command development).
*   Operate autonomously with access to specialized tools and context.
*   **Triggered by intent:** Invoked when a user's request matches their purpose (unlike commands, which are manually invoked via `/`).
*   Execute complex, multi-step workflows without manual intervention.
*   Can be custom-built or bundled with Wibey CLI.

## Filesystem and Structure

### Filesystem Location
All skills are stored in the Wibey configuration directory: `~/.wibey/skills/`

### Directory Structure
Each skill follows a standardized directory structure:
```text
~/.wibey/skills/
└── my-skill/
    ├── SKILL.md          # Skill definition and instructions (REQUIRED)
    ├── references/       # Supporting documentation (Optional)
    │   ├── checklist.md
    │   └── guidelines.md
    └── scripts/          # Helper scripts (Optional: Python, JS, Bash)
        ├── initialize.py
        └── driver.sh
```

## Frontmatter Structure
The `SKILL.md` file must start with YAML frontmatter.

### Fields
| Field | Required | Type | Description |
|---|---|---|---|
| `name` | Yes | String | Unique identifier for the skill |
| `description` | Yes | String | Clear description of when to use the skill |
| `license` | No | String | License info |
| `allowed-tools` | No | Array | List of built-in tools (Read, MultiEdit, Bash, etc.) |
| `metadata` | No | Object | Key-value pairs (author, version, category) |
| `sample-prompts`| No | Array | Example prompts that trigger this skill |
| `arguments` | No | Array | Parameters the skill accepts |

### Example `SKILL.md` (pr-review)
```yaml
---
name: pr-review
description: Reviews code changes on your current branch before creating a pull request.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
metadata:
  author: Luc M.
sample-prompts:
  - "review my current branch before I create a PR"
  - "check for any security issues before I open a PR"
arguments:
  - "[focus-area] - optional (e.g., security, performance)"
---

# PR Review Skill

## Overview
This skill helps developers review changes on their current branch.

## What This Skill Does
1. **Analyze Current Branch**: Uses `scripts/gather-pr-info.sh`.
2. **Review Code Quality**: Checks against `references/REVIEW_CHECKLIST`.
3. **Assess Readiness**: Verifies commit conventions and test coverage.
4. **Generate Report**: Provides a risk assessment and recommendations.
```

## Core Principles for Skills
*   **Conciseness:** Assume the LLM is already smart. Only provide necessary context to save tokens.
*   **Clear Triggers:** Use specific phrases and a focused scope.
*   **Appropriate Freedom:** 
    *   *High Freedom:* Use text instructions for contextual decisions. 
    *   *Low Freedom:* Use specific scripts for fragile or critical operations.

## Commands vs. Skills
*   **Commands:** Quick, single-purpose shortcuts. Invoked manually via `/custom/<name>`. Stored in `~/.wibey/commands/`.
*   **Skills:** Complex, multi-step autonomous agents. Invoked automatically via natural language intent. Stored in `~/.wibey/skills/`.

## How to Use Skills
*   **Automatic Trigger:** Use a prompt similar to the `sample-prompts`.
*   **Manual Invocation:** Type `skill:<skill-name>` directly in the prompt. Example: `skill:skill-creator`
