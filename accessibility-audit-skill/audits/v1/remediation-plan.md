# V1 Remediation Plan

## Objective

Resolve all `MUST` and `MUST NOT` failures in component audits before June 26, or classify with approved `accepted-debt-v1.1` exception.

## Remediation Workflow

1. Pick a component with open blockers.
2. Fix all listed blocking rules.
3. Update component audit file statuses.
4. Link PR in the audit notes.
5. Update `audit-results.md` blocker counts.
6. Mark component as `ready-for-signoff`.

## Priority Order

1. modal-dialog
2. text-input
3. button
4. card
5. menu-and-dropdown
6. tabs
7. select-and-combobox
8. link
9. checkbox-and-radio
10. toast-and-alert
11. data-table
12. nav
13. pagination
14. tooltip
15. accordion

## Daily Cadence

- Morning: assign component owners and blocker targets.
- Midday: remediation status check with Gio.
- End of day: update audits and rollup metrics.

## Exit Criteria

- Every component audit has zero open blocking failures, or
- every unresolved blocker has approved `accepted-debt-v1.1` with owner and date.
