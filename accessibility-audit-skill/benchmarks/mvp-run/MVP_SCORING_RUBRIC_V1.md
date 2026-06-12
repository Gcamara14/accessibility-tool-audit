# MVP Scoring Rubric v1

Use this rubric for Prompt A (baseline) vs Prompt B (template-aware).

## Scoring Scale
- `0` = incorrect or missing
- `1` = partially correct, high risk
- `2` = mostly correct, minor issues
- `3` = strong and production-usable

Maximum per run: `15` points.

## Criteria

### 1) Correct issue identification (0-3)
- Correctly identifies the root accessibility issue.
- Maps to the right WCAG criterion (or nearest valid criterion).

### 2) Semantic correctness of fix (0-3)
- Prefers semantic/native fix before ARIA fallback.
- Uses correct pattern for control type (button, heading, label, dialog focus, etc.).

### 3) Behavior and visual preservation (0-3)
- Keeps functional behavior intact.
- Avoids visual regressions unless explicitly required.

### 4) Keyboard and focus quality (0-3)
- Keyboard operation remains or becomes valid.
- Focus order and visible focus are handled correctly.

### 5) Explanation quality for code review (0-3)
- Explanation is concise and technically specific.
- Provides enough rationale for reviewer confidence.

## Pass/Fail Thresholds
- `12-15`: Pass (promote prompt pattern)
- `9-11`: Conditional pass (tune prompt and retest)
- `0-8`: Fail (rewrite prompt strategy)

## Comparison Method
- Score Prompt A and Prompt B on the same fixture.
- Record score delta: `PromptB - PromptA`.
- Consider Prompt B validated for MVP if:
  - Average delta is `>= +2.0`, and
  - Prompt B wins on at least `70%` of fixtures.
