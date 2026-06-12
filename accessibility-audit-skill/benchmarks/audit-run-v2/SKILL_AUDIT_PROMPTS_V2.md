# Skill Audit Prompt Revisions v2

## Headings prompt v2
```text
Run Headings Inventory.
Return only a markdown table (no prose).
Emit one row per actual heading element and one row per heading-like fake element (e.g. class contains heading or inline styles suggesting heading semantics).
If fake heading detected, set hierarchy_issue_type=fake_heading and status=fail.
Do not fabricate levels or selectors.
Use schema columns from SKILL_AUDIT_SCHEMA_CONTRACT_V1.md.
```

## Images prompt v2
```text
Run Images Inventory.
Return only rows for actual image-like elements discovered (img, area with alt, image input, svg with role=img where applicable).
If no image elements exist, return an empty table (headers only).
If img lacks alt, set alt_quality=missing and status=fail.
Do not infer decorative intent unless explicit.
Use schema columns from SKILL_AUDIT_SCHEMA_CONTRACT_V1.md.
```

## Interactive prompt v2
```text
Run Interactive Elements Inventory.
Inventory native and custom controls.
Benchmark rule overrides:
1) tabindex > 0 => status=fail, severity=high, wcag_candidate includes 2.4.3.
2) Non-semantic custom clickable controls without keyboard semantics => status=fail, severity=critical.
3) Missing accessible name on form controls => status=fail, severity=high.
Do not assume runtime behavior that is not evidenced in markup.
Use schema columns from SKILL_AUDIT_SCHEMA_CONTRACT_V1.md.
```
