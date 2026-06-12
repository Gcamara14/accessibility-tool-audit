# Heading Skill Comparison Report

- page: `/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html`
- screenshot-only finding count: 7
- screenshot + code finding count: 10

## Screenshot-only parsed rows
```json
[
  {
    "text": "YARD STATUS",
    "level": "H2",
    "reason": "Section heading for yard status information",
    "bbox": [
      29,
      90,
      91,
      101
    ]
  },
  {
    "text": "EXIT Backlog",
    "level": "H2",
    "reason": "Section heading for exit backlog data",
    "bbox": [
      137,
      91,
      186,
      100
    ]
  },
  {
    "text": "OR FLOW (TODAY - MST)",
    "level": "H2",
    "reason": "Section heading for OR flow chart and data",
    "bbox": [
      290,
      90,
      398,
      101
    ]
  },
  {
    "text": "INBOUND EXECUTION",
    "level": "H2",
    "reason": "Section heading for inbound execution metrics",
    "bbox": [
      21,
      356,
      126,
      368
    ]
  },
  {
    "text": "OUTBOUND EXECUTION",
    "level": "H2",
    "reason": "Section heading for outbound execution metrics",
    "bbox": [
      347,
      356,
      463,
      368
    ]
  },
  {
    "text": "DEPARTMENT PRODUCTION",
    "level": "H2",
    "reason": "Section heading for department production data",
    "bbox": [
      29,
      802,
      155,
      813
    ]
  },
  {
    "text": "BUILDING OVERVIEW (DRAX FORMAT)",
    "level": "H2",
    "reason": "Section heading for building overview table",
    "bbox": [
      21,
      1154,
      212,
      1166
    ]
  }
]
```

## Screenshot + code parsed rows
```json
[
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "headings_inventory",
    "element_type": "heading",
    "selector": "body > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > h1",
    "wcag_candidate": "1.3.1",
    "severity": "low",
    "status": "pass",
    "notes": "Main heading present",
    "heading_text": "PHX1",
    "heading_level": "1",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "selector_or_location": "body > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > h1"
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "headings_inventory",
    "element_type": "heading",
    "selector": "body > main > div:nth-of-type(1) > div:nth-of-type(1) > div > div:nth-of-type(1) > h2",
    "wcag_candidate": "1.3.1",
    "severity": "low",
    "status": "pass",
    "notes": "Properly nested h2",
    "heading_text": "🚛 Yard Status💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "selector_or_location": "body > main > div:nth-of-type(1) > div:nth-of-type(1) > div > div:nth-of-type(1) > h2"
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "headings_inventory",
    "element_type": "heading",
    "selector": "body > main > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > h2",
    "wcag_candidate": "1.3.1",
    "severity": "low",
    "status": "pass",
    "notes": "Properly nested h2",
    "heading_text": "📊 OB Flow (Today - MST)💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "selector_or_location": "body > main > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > h2"
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "headings_inventory",
    "element_type": "heading",
    "selector": "body > main > div:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(1) > h2",
    "wcag_candidate": "1.3.1",
    "severity": "low",
    "status": "pass",
    "notes": "Properly nested h2",
    "heading_text": "Inbound Execution💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "selector_or_location": "body > main > div:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(1) > h2"
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "headings_inventory",
    "element_type": "heading",
    "selector": "body > main > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(1) > h2",
    "wcag_candidate": "1.3.1",
    "severity": "low",
    "status": "pass",
    "notes": "Properly nested h2",
    "heading_text": "Outbound Execution💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "selector_or_location": "body > main > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(1) > h2"
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "headings_inventory",
    "element_type": "heading",
    "selector": "body > main > div:nth-of-type(3) > div > div:nth-of-type(1) > h3",
    "wcag_candidate": "1.3.1",
    "severity": "low",
    "status": "pass",
    "notes": "Properly nested h3",
    "heading_text": "📦 Inbound Volume Mix\n            \n                (Receive paths only)\n            \n        💬",
    "heading_level": "3",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "selector_or_location": "body > main > div:nth-of-type(3) > div > div:nth-of-type(1) > h3"
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "headings_inventory",
    "element_type": "heading",
    "selector": "body > main > div:nth-of-type(3) > div > div:nth-of-type(2) > h3",
    "wcag_candidate": "1.3.1",
    "severity": "low",
    "status": "pass",
    "notes": "Properly nested h3",
    "heading_text": "🚚 Outbound Volume Flow\n            \n                (Pick → Pack → Load)\n            \n        💬",
    "heading_level": "3",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "selector_or_location": "body > main > div:nth-of-type(3) > div > div:nth-of-type(2) > h3"
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "headings_inventory",
    "element_type": "heading",
    "selector": "body > main > div:nth-of-type(4) > div > div:nth-of-type(1) > h2",
    "wcag_candidate": "1.3.1",
    "severity": "low",
    "status": "pass",
    "notes": "Properly nested h2",
    "heading_text": "🏭 Department Production💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "selector_or_location": "body > main > div:nth-of-type(4) > div > div:nth-of-type(1) > h2"
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "headings_inventory",
    "element_type": "heading",
    "selector": "body > main > div:nth-of-type(4) > div > div:nth-of-type(2) > div:nth-of-type(2) > h4",
    "wcag_candidate": "1.3.1",
    "severity": "medium",
    "status": "fail",
    "notes": "Skipped heading level - h4 after h2, missing h3",
    "heading_text": "📋 IB Support",
    "heading_level": "4",
    "is_hierarchy_valid": "false",
    "hierarchy_issue_type": "skipped_level",
    "selector_or_location": "body > main > div:nth-of-type(4) > div > div:nth-of-type(2) > div:nth-of-type(2) > h4"
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "headings_inventory",
    "element_type": "heading",
    "selector": "body > main > div:nth-of-type(5) > div > h2",
    "wcag_candidate": "1.3.1",
    "severity": "low",
    "status": "pass",
    "notes": "Properly nested h2",
    "heading_text": "Building Overview (DRAX Format) — Day Shift · Jun 10, 2026💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "selector_or_location": "body > main > div:nth-of-type(5) > div > h2"
  }
]
```

## Screenshot-only raw model output
```text
[
  { "text": "YARD STATUS", "level": "H2", "reason": "Section heading for yard status information", "bbox": [29, 90, 91, 101] },
  { "text": "EXIT Backlog", "level": "H2", "reason": "Section heading for exit backlog data", "bbox": [137, 91, 186, 100] },
  { "text": "OR FLOW (TODAY - MST)", "level": "H2", "reason": "Section heading for OR flow chart and data", "bbox": [290, 90, 398, 101] },
  { "text": "INBOUND EXECUTION", "level": "H2", "reason": "Section heading for inbound execution metrics", "bbox": [21, 356, 126, 368] },
  { "text": "OUTBOUND EXECUTION", "level": "H2", "reason": "Section heading for outbound execution metrics", "bbox": [347, 356, 463, 368] },
  { "text": "DEPARTMENT PRODUCTION", "level": "H2", "reason": "Section heading for department production data", "bbox": [29, 802, 155, 813] },
  { "text": "BUILDING OVERVIEW (DRAX FORMAT)", "level": "H2", "reason": "Section heading for building overview table", "bbox": [21, 1154, 212, 1166] }
]
```

## Screenshot + code raw model output
```text
| page_id | page_url_or_fixture | skill_name | element_type | selector | wcag_candidate | severity | status | notes | heading_text | heading_level | is_hierarchy_valid | hierarchy_issue_type |
|---------|-------------------|------------|--------------|----------|----------------|----------|---------|--------|--------------|---------------|-------------------|---------------------|
| page1 | /Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html | headings_inventory | heading | body > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > h1 | 1.3.1 | low | pass | Main heading present | PHX1 | 1 | true | none |
| page1 | /Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html | headings_inventory | heading | body > main > div:nth-of-type(1) > div:nth-of-type(1) > div > div:nth-of-type(1) > h2 | 1.3.1 | low | pass | Properly nested h2 | 🚛 Yard Status💬 | 2 | true | none |
| page1 | /Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html | headings_inventory | heading | body > main > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > h2 | 1.3.1 | low | pass | Properly nested h2 | 📊 OB Flow (Today - MST)💬 | 2 | true | none |
| page1 | /Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html | headings_inventory | heading | body > main > div:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(1) > h2 | 1.3.1 | low | pass | Properly nested h2 | Inbound Execution💬 | 2 | true | none |
| page1 | /Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html | headings_inventory | heading | body > main > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(1) > h2 | 1.3.1 | low | pass | Properly nested h2 | Outbound Execution💬 | 2 | true | none |
| page1 | /Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html | headings_inventory | heading | body > main > div:nth-of-type(3) > div > div:nth-of-type(1) > h3 | 1.3.1 | low | pass | Properly nested h3 | 📦 Inbound Volume Mix (Receive paths only) 💬 | 3 | true | none |
| page1 | /Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html | headings_inventory | heading | body > main > div:nth-of-type(3) > div > div:nth-of-type(2) > h3 | 1.3.1 | low | pass | Properly nested h3 | 🚚 Outbound Volume Flow (Pick → Pack → Load) 💬 | 3 | true | none |
| page1 | /Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html | headings_inventory | heading | body > main > div:nth-of-type(4) > div > div:nth-of-type(1) > h2 | 1.3.1 | low | pass | Properly nested h2 | 🏭 Department Production💬 | 2 | true | none |
| page1 | /Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html | headings_inventory | heading | body > main > div:nth-of-type(4) > div > div:nth-of-type(2) > div:nth-of-type(2) > h4 | 1.3.1 | medium | fail | Skipped heading level - h4 after h2, missing h3 | 📋 IB Support | 4 | false | skipped_level |
| page1 | /Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html | headings_inventory | heading | body > main > div:nth-of-type(5) > div > h2 | 1.3.1 | low | pass | Properly nested h2 | Building Overview (DRAX Format) — Day Shift · Jun 10, 2026💬 | 2 | true | none |
```
