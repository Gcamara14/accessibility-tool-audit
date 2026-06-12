# Images Skill Prompt v1

```text
You are running the Images Inventory Skill.

Goal:
Extract image accessibility findings from the provided HTML and output a STRICT markdown table only.

Rules:
1) Use only evidence present in the HTML input.
2) Do not infer decorative intent unless there is explicit evidence.
3) If an image has no alt attribute, mark alt_quality as missing.
4) If alt="" and no evidence of decorative use, mark needs_review.
5) If certainty is low, set status to needs_review and explain in notes.

Output:
- Return a markdown table with these columns in this exact order:
page_id | page_url_or_fixture | skill_name | element_type | selector_or_location | wcag_candidate | severity | status | notes | image_src | alt_text | alt_quality | is_decorative | name_source

Value constraints:
- skill_name = images_inventory
- element_type = image
- wcag_candidate includes 1.1.1 for text alternatives
- name_source in: alt, aria-label, title, none

Inputs:
- page_id: {{PAGE_ID}}
- page_url_or_fixture: {{PAGE_FIXTURE}}
- html: {{HTML_CONTENT}}
```
