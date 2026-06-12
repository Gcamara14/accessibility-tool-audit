# Skill Audit QA and Refinement (v1 -> v2)

## Human QA sample
Sampled all 6 normalized findings from `SKILL_AUDIT_NORMALIZED_RESULTS_V1.json`.

## QA findings
1. **Interactive PG-004 (`tabindex=5`) under-classified**
   - v1 marked `warn/medium`.
   - Decision: classify as `fail/high` for this benchmark because positive tabindex directly harms focus sequence expectations.

2. **Interactive PG-003 missing structural context**
   - v1 captured missing name but omitted explicit structural context (`label` association absent).
   - Decision: keep primary failure but improve notes and include additional candidate criterion where useful.

3. **Images skill emitted noisy no-image placeholder rows in raw output**
   - Decision: v2 prompt should return zero rows when no relevant elements exist (for cleaner downstream analytics).

4. **Needs-review usage too broad for static fixtures**
   - Decision: keep `needs_review` only when evidence is truly ambiguous, not for default unknowns.

## Prompt updates applied for v2
- Headings prompt:
  - Clarified one-row-per-actual-heading-or-fake-heading candidate.
  - Stronger fake-heading detection language.
- Images prompt:
  - Return only rows for discovered images.
  - No placeholder rows when no images exist.
- Interactive prompt:
  - Positive tabindex (`>0`) should be classified as high-risk failure in this benchmark mode.
  - Explicitly classify non-semantic custom controls as fail unless keyboard semantics are evidenced.

## Rerun summary
- v2 produced cleaner output shape and stricter classification.
- Primary delta: PG-004 moved from `warn/medium` to `fail/high`.

## v1 vs v2 status counts
| status | v1 | v2 |
|---|---:|---:|
| pass | 1 | 1 |
| warn | 1 | 0 |
| fail | 4 | 5 |
| needs_review | 0 | 0 |

## v1 vs v2 severity counts
| severity | v1 | v2 |
|---|---:|---:|
| low | 1 | 1 |
| medium | 1 | 0 |
| high | 3 | 4 |
| critical | 1 | 1 |
