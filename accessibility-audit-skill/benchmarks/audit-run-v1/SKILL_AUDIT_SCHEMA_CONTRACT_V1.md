# Skill Audit Schema Contract v1

This contract is frozen for the first skill audit run.

## Shared required columns
- `page_id`
- `page_url_or_fixture`
- `skill_name`
- `element_type`
- `selector_or_location`
- `wcag_candidate`
- `severity` (`low`, `medium`, `high`, `critical`)
- `status` (`pass`, `warn`, `fail`, `needs_review`)
- `notes`

## Headings skill columns
- `heading_text`
- `heading_level`
- `is_hierarchy_valid` (`true`, `false`, `needs_review`)
- `hierarchy_issue_type` (`none`, `missing_h1`, `fake_heading`, `skipped_level`, `empty_heading`, `other`)

## Images skill columns
- `image_src`
- `alt_text`
- `alt_quality` (`good`, `missing`, `empty`, `unhelpful`, `needs_review`)
- `is_decorative` (`true`, `false`, `needs_review`)
- `name_source` (`alt`, `aria-label`, `title`, `none`)

## Interactive elements skill columns
- `control_type`
- `accessible_name`
- `name_source` (`text`, `aria-label`, `aria-labelledby`, `title`, `label`, `none`)
- `role`
- `state`
- `is_keyboard_reachable` (`true`, `false`, `needs_review`)
- `focus_indicator_present` (`true`, `false`, `needs_review`)

## JSON row shape (canonical)
```json
{
  "page_id": "PG-001",
  "page_url_or_fixture": "alpha-gov/tests/example.html",
  "skill_name": "headings_inventory",
  "element_type": "heading",
  "selector_or_location": "main > div.fake-heading",
  "wcag_candidate": ["1.3.1"],
  "severity": "high",
  "status": "fail",
  "notes": "Styled div used as heading.",
  "heading_text": "Fake Heading",
  "heading_level": null,
  "is_hierarchy_valid": "false",
  "hierarchy_issue_type": "fake_heading"
}
```

## Severity defaults
- `critical`: blocks core task or creates major assistive tech ambiguity.
- `high`: strong barrier likely preventing equivalent usage.
- `medium`: clear issue with partial workaround.
- `low`: minor or contextual issue with low impact.

## Validation rules
1. Every row must include all shared required columns.
2. Skill-specific columns must be present for that skill, even when null.
3. `wcag_candidate` must be a non-empty array.
4. `status=needs_review` must include a non-empty `notes` reason.
