# Severity Semantics (V1)

## Rule Keywords

- `MUST`: mandatory for V1 compliance.
- `MUST NOT`: prohibited for V1 compliance.
- `SHOULD`: recommended, non-blocking for V1.

## Audit Outcomes

- A component **fails V1** if any `MUST` or `MUST NOT` rule is unresolved.
- A component **passes V1** if all applicable `MUST`/`MUST NOT` are `pass` and any remaining issues are explicitly `accepted-debt-v1.1` or `design-blocked` with owner and target date.

## Allowed Exceptions

- `accepted-debt-v1.1`: temporary exception allowed only with:
  - explicit owner
  - linked tracking ticket
  - target date
- `design-blocked`: allowed only with:
  - linked design decision ticket
  - owner
  - target date

## Presentation Policy (June 26)

- Report must include:
  - pass/fail by component
  - unresolved blocking issues
  - all accepted exceptions
- Do not present unresolved `MUST`/`MUST NOT` as complete.
