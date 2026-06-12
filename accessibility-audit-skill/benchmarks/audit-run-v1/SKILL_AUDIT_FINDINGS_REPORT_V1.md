# Skill Audit Findings Report v1

Sources:
- `SKILL_AUDIT_NORMALIZED_RESULTS_V1.json`
- `SKILL_AUDIT_RAW_OUTPUT_HEADINGS_V1.md`
- `SKILL_AUDIT_RAW_OUTPUT_IMAGES_V1.md`
- `SKILL_AUDIT_RAW_OUTPUT_INTERACTIVE_V1.md`

## Per-page findings

### PG-001
Fixture: `alpha-gov/tests/headings-text-formatting-used-instead-of-an-actual-heading.html`

| skill_name | element_type | selector_or_location | status | severity | wcag_candidate | notes |
|---|---|---|---|---|---|---|
| headings_inventory | heading | body > h1 | pass | low | 1.3.1 | Native h1 exists. |
| headings_inventory | heading | main > div.fake-heading | fail | high | 1.3.1 | Styled div used as heading. |

### PG-002
Fixture: `alpha-gov/tests/images-image-with-no-alt-attribute.html`

| skill_name | element_type | selector_or_location | status | severity | wcag_candidate | notes |
|---|---|---|---|---|---|---|
| images_inventory | image | main > img | fail | high | 1.1.1 | img has no alt attribute. |

### PG-003
Fixture: `alpha-gov/tests/forms-form-element-has-no-label.html`

| skill_name | element_type | selector_or_location | status | severity | wcag_candidate | notes |
|---|---|---|---|---|---|---|
| interactive_inventory | interactive | main > form > input[type=text] | fail | high | 4.1.2, 3.3.2 | Input exists without associated label. |

### PG-004
Fixture: `alpha-gov/tests/keyboard-access-tabindex-greater-than-0.html`

| skill_name | element_type | selector_or_location | status | severity | wcag_candidate | notes |
|---|---|---|---|---|---|---|
| interactive_inventory | interactive | main > a | warn | medium | 2.4.3, 2.1.1 | Positive tabindex value can disrupt logical focus order. |

### PG-005
Fixture: `alpha-gov/tests/keyboard-access-fake-button-is-not-keyboard-accessible.html`

| skill_name | element_type | selector_or_location | status | severity | wcag_candidate | notes |
|---|---|---|---|---|---|---|
| interactive_inventory | interactive | main > div#webchat.button | fail | critical | 2.1.1, 4.1.2 | Non-semantic div used as clickable control; no role or keyboard support. |

## Global rollup

### Findings by status
| status | count |
|---|---:|
| pass | 1 |
| warn | 1 |
| fail | 4 |
| needs_review | 0 |

### Findings by severity
| severity | count |
|---|---:|
| low | 1 |
| medium | 1 |
| high | 3 |
| critical | 1 |

### Findings by skill
| skill_name | count |
|---|---:|
| headings_inventory | 2 |
| images_inventory | 1 |
| interactive_inventory | 3 |

### WCAG candidate counts
| wcag_candidate | count |
|---|---:|
| 1.1.1 | 1 |
| 1.3.1 | 2 |
| 2.1.1 | 2 |
| 2.4.3 | 1 |
| 3.3.2 | 1 |
| 4.1.2 | 2 |
