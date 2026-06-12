# Raw Output: Interactive Elements Skill v1

| page_id | fixture | selector | controlType | accessibleName | nameSource | role | state | keyboardReachable | focusIndicatorPresent | wcag | impact | result | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PG-001 | alpha-gov/tests/headings-text-formatting-used-instead-of-an-actual-heading.html | none | none | null | none | none | none | needs_review | needs_review | 2.1.1 | minor | ok | No interactive controls found in fixture body. |
| PG-002 | alpha-gov/tests/images-image-with-no-alt-attribute.html | none | none | null | none | none | none | needs_review | needs_review | 2.1.1 | minor | ok | No interactive controls found in fixture body. |
| PG-003 | alpha-gov/tests/forms-form-element-has-no-label.html | main > form > input[type=text] | input_text | null | none | textbox | enabled | true | needs_review | 4.1.2,3.3.2 | serious | fail | Input exists without associated label. |
| PG-004 | alpha-gov/tests/keyboard-access-tabindex-greater-than-0.html | main > a | link | A link with a tabindex greater than 0 | text | link | focusable | true | needs_review | 2.4.3,2.1.1 | moderate | warn | Positive tabindex value can disrupt logical focus order. |
| PG-005 | alpha-gov/tests/keyboard-access-fake-button-is-not-keyboard-accessible.html | main > div#webchat.button | custom_div_button | launch webchat | text | none | none | false | needs_review | 2.1.1,4.1.2 | critical | fail | Non-semantic div used as clickable control; no role or keyboard support. |
