# Learning: Structuring Skills for the Wibey Ecosystem

**Date:** March 2026
**Context:** After successfully building the Tri-Folder architecture (Catalyst Templates, Teams, Design Docs), we realized our custom root-level directory structure violated the standardized Wibey CLI ecosystem rules.

## The Wibey CLI Constraint
While an LLM can navigate any directory structure if told the exact path in `SKILL.md`, the Wibey ecosystem (and automated skill-validators) expect skills to be "good citizens" by strictly limiting root-level files.

A standard Wibey skill must adhere to this hierarchy:
```text
my-skill/
├── SKILL.md            # The only file allowed at the root
├── references/         # ALL context, documentation, and data goes here
│   ├── rules/
│   └── templates/
└── scripts/            # ALL execution logic (bash/python) goes here
    └── helper.sh
```

## The Refactor (Phase 8)
To package our `wibey-skill` for Beta Distribution (Phase 9), we had to:
1. Create `references/` and `scripts/`.
2. Move our massive Tri-Folder brain (`catalyst-templates`, `teams`, `design-system-docs`, `WCAG-Rules`) entirely into `references/`.
3. Move our operational bash scripts (`check-lock.sh`, `find-template.sh`) into `scripts/`.
4. Update the Master Orchestrator (`SKILL.md`) to point to these new nested paths.

## Key Takeaway
When building an AI Agent Skill, always design the knowledge base to live inside a `references/` subdirectory from Day 1. It prevents having to do massive `sed` string-replacements across orchestrator files right before deployment!
