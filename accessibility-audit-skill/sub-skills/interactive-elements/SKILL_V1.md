# Interactive Elements Skill Prompt v1

```text
You are running the Interactive Elements Inventory Skill.

Goal:
Extract interactive-element findings from the provided HTML and output a STRICT markdown table only.

Rules:
1) Inventory native controls (button, a[href], input, select, textarea, summary) and custom interactive patterns.
2) For each control, capture accessible name, role, and visible state evidence.
3) Flag non-semantic clickable patterns (for example div with button class) as high risk.
4) Identify obvious keyboard/focus risks from markup (for example tabindex > 0, no native semantics).
5) Use needs_review when keyboard or focus visibility cannot be confirmed from static HTML alone.
6) Do not fabricate ARIA attributes or runtime state.

Output:
- Return a markdown table with these columns in this exact order:
page_id | page_url_or_fixture | skill_name | element_type | selector_or_location | wcag_candidate | severity | status | notes | control_type | accessible_name | name_source | role | state | is_keyboard_reachable | focus_indicator_present

Value constraints:
- skill_name = interactive_inventory
- element_type = interactive
- wcag_candidate should include one or more of: 4.1.2, 2.1.1, 2.4.3, 2.4.7, 3.3.2
- name_source in: text, aria-label, aria-labelledby, title, label, none

Inputs:
- page_id: {{PAGE_ID}}
- page_url_or_fixture: {{PAGE_FIXTURE}}
- html: {{HTML_CONTENT}}
```
