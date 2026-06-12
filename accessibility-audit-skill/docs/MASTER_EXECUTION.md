# Accessibility Skill Execution Master Plan - Implementation Tracker

This is the single master execution artifact for the first skill-audit cycle.

## Goal
Run three extractor skills (headings, images, interactive elements) against a fixed set of inaccessible pages, produce structured findings tables, and refine prompts to a promotable v1 production draft.

## Task board
| Task ID | Task | Status | Output |
|---|---|---|---|
| fixture-manifest | Build first fixture manifest | completed | `SKILL_AUDIT_FIXTURE_MANIFEST_V1.json` |
| schema-contract | Freeze shared schema | completed | `SKILL_AUDIT_SCHEMA_CONTRACT_V1.md` |
| headings-skill-prompt | Draft headings prompt | completed | `SKILL_AUDIT_PROMPT_HEADINGS_V1.md` |
| images-skill-prompt | Draft images prompt | completed | `SKILL_AUDIT_PROMPT_IMAGES_V1.md` |
| interactive-skill-prompt | Draft interactive prompt | completed | `SKILL_AUDIT_PROMPT_INTERACTIVE_V1.md` |
| normalize-results | Define normalization rules | completed | `SKILL_AUDIT_NORMALIZATION_RULES_V1.md` |
| run-v1-batch | Run v1 and capture outputs | completed | `SKILL_AUDIT_RAW_OUTPUT_*_V1.md`, `SKILL_AUDIT_NORMALIZED_RESULTS_V1.json` |
| publish-findings | Publish per-page and global findings | completed | `SKILL_AUDIT_FINDINGS_REPORT_V1.md` |
| qa-and-refine | QA sample, v2 prompt update, rerun | completed | `SKILL_AUDIT_QA_REFINEMENT_V2.md`, `SKILL_AUDIT_PROMPTS_V2.md`, `SKILL_AUDIT_NORMALIZED_RESULTS_V2.json` |
| promote-core-prompts | Promote best prompts + limits | completed | `SKILL_AUDIT_PRODUCTION_PROMPTS_V1.md` |

## Core run assets
- Fixtures: `SKILL_AUDIT_FIXTURE_MANIFEST_V1.json`
- Schema: `SKILL_AUDIT_SCHEMA_CONTRACT_V1.md`
- Normalization: `SKILL_AUDIT_NORMALIZATION_RULES_V1.md`
- Findings: `SKILL_AUDIT_FINDINGS_REPORT_V1.md`
- QA/refinement: `SKILL_AUDIT_QA_REFINEMENT_V2.md`
- Production prompts: `SKILL_AUDIT_PRODUCTION_PROMPTS_V1.md`

## How to use this cycle
1. Pick fixture batch from `SKILL_AUDIT_FIXTURE_MANIFEST_V1.json`.
2. Run each skill prompt using its current production prompt definition.
3. Normalize rows using `SKILL_AUDIT_NORMALIZATION_RULES_V1.md`.
4. Publish per-page and global tables following `SKILL_AUDIT_SCHEMA_CONTRACT_V1.md`.
5. Record misses in a QA pass and evolve prompts version-by-version.

## Current recommendation
Use the production prompts in `SKILL_AUDIT_PRODUCTION_PROMPTS_V1.md` as the working baseline, then expand with specialized prompts for:
- forms/labels,
- dialog/focus management,
- landmarks/regions.
