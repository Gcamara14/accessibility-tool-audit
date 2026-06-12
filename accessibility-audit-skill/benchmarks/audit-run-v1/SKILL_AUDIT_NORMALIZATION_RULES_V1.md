# Skill Audit Normalization Rules v1

This mapping converts per-skill raw outputs into the shared schema from `SKILL_AUDIT_SCHEMA_CONTRACT_V1.md`.

## Input artifacts
- Raw headings output: `SKILL_AUDIT_RAW_OUTPUT_HEADINGS_V1.md`
- Raw images output: `SKILL_AUDIT_RAW_OUTPUT_IMAGES_V1.md`
- Raw interactive output: `SKILL_AUDIT_RAW_OUTPUT_INTERACTIVE_V1.md`

## Mapping table

| Raw skill field | Normalized field | Rule |
|---|---|---|
| `fixture` | `page_url_or_fixture` | Copy exact string. |
| `pageId` or `page_id` | `page_id` | Copy exact stable ID from fixture manifest. |
| `skill` | `skill_name` | Normalize to `headings_inventory`, `images_inventory`, or `interactive_inventory`. |
| `selector` or `location` | `selector_or_location` | Use CSS-like selector when available; otherwise concise DOM path text. |
| `wcag` | `wcag_candidate` | Convert to array of strings. |
| `impact` | `severity` | Map `minor->low`, `moderate->medium`, `serious->high`, `critical->critical`. |
| `result` | `status` | Map `ok->pass`, `warning->warn`, `fail->fail`, unknown->`needs_review`. |

## Skill-specific mapping

### Headings
- `text` -> `heading_text`
- `level` -> `heading_level`
- `hierarchyValid` -> `is_hierarchy_valid`
- `issueType` -> `hierarchy_issue_type`

### Images
- `src` -> `image_src`
- `alt` -> `alt_text`
- `altQuality` -> `alt_quality`
- `decorative` -> `is_decorative`
- `nameSource` -> `name_source`

### Interactive
- `controlType` -> `control_type`
- `accessibleName` -> `accessible_name`
- `nameSource` -> `name_source`
- `role` -> `role`
- `state` -> `state`
- `keyboardReachable` -> `is_keyboard_reachable`
- `focusIndicatorPresent` -> `focus_indicator_present`

## Null/default rules
1. If a required skill-specific field is missing, emit null and set `status=needs_review`.
2. Always include `notes` explaining missing evidence.
3. Do not drop rows due to incompleteness.

## Deduplication rules
1. Duplicate key = `page_id + skill_name + selector_or_location + element_type`.
2. Keep the row with most complete non-null fields.
3. If tie, keep highest severity.
