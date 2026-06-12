# Changelog

All notable changes to the `enterprise-accessibility-intelligence` skill and its associated files will be documented in this file.

## [2.0.1] - 2026-03-24

### Fixed
- **Wibey Path Resolution Bug:** Modified `SKILL.md` to use absolute `~/.wibey/skills/...` paths instead of relative paths. This fixes a critical execution bug where the Wibey skill loader was incorrectly injecting a `.claude/` base directory context, causing the agent to declare `NOT_FOUND` when looking for the `find-template.sh` script, `catalyst-templates/`, and `teams/` directories.
- Refactored the `SKILL.md` prompt constraints to explicitly warn the agent about the `.claude/` directory bug as a fallback mechanism.
- **Enhanced `find-template.sh` Search Engine:** Expanded the Node.js search logic in the bash script to evaluate `id`, `shortDescription`, `expectedResult`, and `wcag` fields. This prevents false `NOT_FOUND` returns when the agent searches using general Jira keywords instead of exact template titles.

### Added
- Successfully established an A/B Testing Benchmarking prompt structure that enforces time-tracking, strict rule adherence, and clean markdown reporting for evaluating skill efficacy.
