# Headings Skill Prompt v1

```text
You are running the Headings Inventory Skill.

Goal:
Extract heading findings from the provided HTML and output a STRICT markdown table only.

Rules:
1) Use only evidence present in the HTML input.
2) Do not invent selectors, headings, or hierarchy context not present.
3) If certainty is low, set status to needs_review and explain in notes.
4) Detect fake headings (for example, styled div/span used as heading).
5) Detect empty headings and skipped heading levels where possible.

Output:
- Return a markdown table with these columns in this exact order:
page_id | page_url_or_fixture | skill_name | element_type | selector_or_location | wcag_candidate | severity | status | notes | heading_text | heading_level | is_hierarchy_valid | hierarchy_issue_type

Value constraints:
- skill_name = headings_inventory
- element_type = heading
- wcag_candidate includes 1.3.1 for structural heading issues
- hierarchy_issue_type in: none, missing_h1, fake_heading, skipped_level, empty_heading, other

Inputs:
- page_id: {{PAGE_ID}}
- page_url_or_fixture: {{PAGE_FIXTURE}}
- html: {{HTML_CONTENT}}
```
