# Text Input Audit (V1)

- Component: text-input
- Owner: TBD
- Auditor: TBD
- Rule Version: v1.0

| Rule ID | Status | Notes |
|---|---|---|
| R-CC-001 | fail | Focus style missing on error state variant. |
| R-CC-003 | fail | Placeholder-only pattern still in legacy form. |
| R-CC-007 | fail | Error message not bound with aria-describedby in all cases. |
| R-CC-004 | pass | Text/error contrast passes baseline checks. |
| R-CMP-003 | fail | Invalid state not consistently exposed. |

## Open blocking failures

- R-CC-001
- R-CC-003
- R-CC-007
- R-CMP-003
