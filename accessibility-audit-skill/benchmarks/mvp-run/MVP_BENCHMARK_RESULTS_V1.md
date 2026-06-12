# MVP Benchmark Results v1

## Run Summary
- Fixture set: `MVP_FIXTURES_WEB_V1.json` (8 web fixtures)
- Compared prompts:
  - Prompt A (Baseline control)
  - Prompt B (Template-aware fix)
- Rubric: `MVP_SCORING_RUBRIC_V1.md` (max 15/fixture)
- Method: manual side-by-side scoring for MVP signal test

## Scores
| Fixture | Prompt A | Prompt B | Delta (B-A) | Winner |
|---|---:|---:|---:|---|
| FX-001 | 8 | 14 | +6 | B |
| FX-002 | 7 | 13 | +6 | B |
| FX-003 | 9 | 13 | +4 | B |
| FX-004 | 8 | 12 | +4 | B |
| FX-005 | 6 | 12 | +6 | B |
| FX-006 | 7 | 12 | +5 | B |
| FX-007 | 8 | 12 | +4 | B |
| FX-008 | 8 | 11 | +3 | B |

## Aggregate
- Prompt A total: `61 / 120` (50.8%)
- Prompt B total: `99 / 120` (82.5%)
- Average delta: `+4.75`
- Win rate for Prompt B: `8 / 8` (100%)

## Interpretation
Prompt B clearly outperformed the baseline and exceeded the MVP promotion thresholds:
- Average delta `>= +2.0`: yes (`+4.75`)
- Win rate `>= 70%`: yes (100%)

## Common Failure Patterns Seen In Prompt A
1. Correct issue spotted, but generic fix chosen (for example, adding ARIA when semantic element swap was better).
2. Weak focus management details for keyboard/dialog cases.
3. Review explanation too short to be reusable as audit guidance.

## Remaining Gaps In Prompt B
1. Focus-visible styling guidance can still be under-specified when CSS context is missing.
2. Edge cases involving component-library-specific props still need stronger grounding in design-system docs.
3. Multi-issue snippets may need explicit instruction to prioritize one issue at a time.

## Recommendation
Promote Prompt B into a first skill draft now, then run a second benchmark wave with:
- 5 additional keyboard/focus fixtures
- 3 generation-from-scratch scenarios using Prompt C
