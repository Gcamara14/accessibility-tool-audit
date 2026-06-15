# Gio's Official Accessibility Rules V1

## Purpose

This folder contains the official, human-first accessibility rules for platform components and patterns.

V1 intent:

- Ship practical, enforceable rules quickly.
- Enable engineers to self-serve audits and remediation.
- Keep rules versioned so improvements can be added without rewriting everything.

## Executive Summary (June 26)

- We established a versioned rules system (`v1.0`) with 10 cross-cutting rules and 15 component-specific rules.
- Baseline component audits are completed and tracked in `audits/v1/`.
- Blocking failures are now visible per component with remediation priority and target dates.
- V1 focuses on enforceable `MUST`/`MUST NOT` rules to drive immediate accessibility quality improvements before presentation.
- Any unresolved items must be explicitly marked `accepted-debt-v1.1` with owner/date.

## Scope

- WCAG scope: **2.1 A and AA only** for V1.
- Rule style: **MUST / MUST NOT / SHOULD**.
- Audit failure: only `MUST` and `MUST NOT` can fail a component in V1.

## Rule Lifecycle

- `draft`: written, not approved yet.
- `approved`: reviewed by Gio and valid for V1 audits.
- `deprecated`: replaced by a newer rule version.

## Versioning

- `v1.0`: baseline rules for June 26 presentation.
- `v1.x`: clarifications, examples, and wording improvements. No new MUST-level requirements.
- `v2.0`: scope expansion (for example WCAG 2.2 adoption, additional components, stricter enforcement).

## Rule Numbering

- Cross-cutting: `R-CC-###`
- Component: `R-CMP-###`

## Cross-Cutting Rules (10)

| Rule ID | File | Status | Primary WCAG |
|---|---|---|---|
| R-CC-001 | `cross-cutting/focus-visible.md` | approved | 2.4.7, 1.4.11 |
| R-CC-002 | `cross-cutting/keyboard-operable.md` | approved | 2.1.1, 2.1.2 |
| R-CC-003 | `cross-cutting/accessible-name.md` | approved | 4.1.2, 2.5.3 |
| R-CC-004 | `cross-cutting/color-and-contrast.md` | approved | 1.4.1, 1.4.3, 1.4.11 |
| R-CC-005 | `cross-cutting/target-size.md` | approved | 2.1.1 (practical target size requirement) |
| R-CC-006 | `cross-cutting/state-and-feedback.md` | approved | 4.1.2, 3.2.2 |
| R-CC-007 | `cross-cutting/forms-errors.md` | approved | 3.3.1, 3.3.2, 3.3.3 |
| R-CC-008 | `cross-cutting/landmarks-and-headings.md` | approved | 1.3.1, 2.4.1, 2.4.6 |
| R-CC-009 | `cross-cutting/text-and-content.md` | approved | 1.4.4, 1.4.10, 1.4.12 |
| R-CC-010 | `cross-cutting/motion-and-animation.md` | approved | 2.2.2, 2.3.1 |

## Component Rules (15)

| Rule ID | File | Status |
|---|---|---|
| R-CMP-001 | `components/button.md` | draft |
| R-CMP-002 | `components/link.md` | draft |
| R-CMP-003 | `components/text-input.md` | draft |
| R-CMP-004 | `components/select-and-combobox.md` | draft |
| R-CMP-005 | `components/checkbox-and-radio.md` | draft |
| R-CMP-006 | `components/modal-dialog.md` | draft |
| R-CMP-007 | `components/tooltip.md` | draft |
| R-CMP-008 | `components/tabs.md` | draft |
| R-CMP-009 | `components/menu-and-dropdown.md` | draft |
| R-CMP-010 | `components/data-table.md` | draft |
| R-CMP-011 | `components/nav.md` | draft |
| R-CMP-012 | `components/card.md` | draft |
| R-CMP-013 | `components/toast-and-alert.md` | draft |
| R-CMP-014 | `components/accordion.md` | draft |
| R-CMP-015 | `components/pagination.md` | draft |

## How Engineers Use This

1. Read the relevant cross-cutting rules.
2. Read the component-specific rule for your component.
3. Complete `audits/v1/<component>.audit.md`.
4. Fix all `MUST` and `MUST NOT` failures.
5. Re-run the audit and attach PR links.

## Source Of Truth

- Rule files in this folder are the source of truth.
- The tracker in `README.md` links to this content.
