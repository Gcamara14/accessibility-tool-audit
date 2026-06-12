# Heading Skill Comparison Report

- page: `/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html`
- DOM heading count: 10
- AI visual gap count: 0
- heading hierarchy issue count: 1
- AI visual gap error: WalmartLLM request failed (500): {"requestId":"WMTLLMGATEWAY-STG__9addc482-272d-484b-a13e-fca85c3b3797","errorCode":"0","type":"error","error":{"type":"api_error","message":"Internal server error"}}

## Heading hierarchy issues
```json
[
  {
    "type": "skipped_level",
    "severity": "high",
    "message": "Skipped heading level before \"📋 IB Support\": H2 to H4."
  }
]
```

## DOM headings found
```json
[
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "dom_heading_scan",
    "element_type": "heading",
    "selector_or_location": "body > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > h1",
    "wcag_candidate": "1.3.1",
    "severity": "info",
    "status": "pass",
    "notes": "Existing semantic DOM heading found by Playwright scan",
    "heading_text": "PHX1",
    "heading_level": "1",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "bbox": [
      135.4375,
      58.5,
      70.21875,
      31
    ]
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "dom_heading_scan",
    "element_type": "heading",
    "selector_or_location": "body > main > div:nth-of-type(1) > div:nth-of-type(1) > div > div:nth-of-type(1) > h2",
    "wcag_candidate": "1.3.1",
    "severity": "info",
    "status": "pass",
    "notes": "Existing semantic DOM heading found by Playwright scan",
    "heading_text": "🚛 Yard Status💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "bbox": [
      32,
      172,
      150,
      46
    ]
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "dom_heading_scan",
    "element_type": "heading",
    "selector_or_location": "body > main > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > h2",
    "wcag_candidate": "1.3.1",
    "severity": "info",
    "status": "pass",
    "notes": "Existing semantic DOM heading found by Playwright scan",
    "heading_text": "📊 OB Flow (Today - MST)💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "bbox": [
      536,
      173,
      275.015625,
      26
    ]
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "dom_heading_scan",
    "element_type": "heading",
    "selector_or_location": "body > main > div:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(1) > h2",
    "wcag_candidate": "1.3.1",
    "severity": "info",
    "status": "pass",
    "notes": "Existing semantic DOM heading found by Playwright scan",
    "heading_text": "Inbound Execution💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "bbox": [
      40,
      692,
      244.109375,
      23.171875
    ]
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "dom_heading_scan",
    "element_type": "heading",
    "selector_or_location": "body > main > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(1) > h2",
    "wcag_candidate": "1.3.1",
    "severity": "info",
    "status": "pass",
    "notes": "Existing semantic DOM heading found by Playwright scan",
    "heading_text": "Outbound Execution💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "bbox": [
      674,
      692,
      259.859375,
      23.171875
    ]
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "dom_heading_scan",
    "element_type": "heading",
    "selector_or_location": "body > main > div:nth-of-type(3) > div > div:nth-of-type(1) > h3",
    "wcag_candidate": "1.3.1",
    "severity": "info",
    "status": "pass",
    "notes": "Existing semantic DOM heading found by Playwright scan",
    "heading_text": "📦 Inbound Volume Mix\n            \n                (Receive paths only)\n            \n        💬",
    "heading_level": "3",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "bbox": [
      32,
      1291.59375,
      590,
      25
    ]
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "dom_heading_scan",
    "element_type": "heading",
    "selector_or_location": "body > main > div:nth-of-type(3) > div > div:nth-of-type(2) > h3",
    "wcag_candidate": "1.3.1",
    "severity": "info",
    "status": "pass",
    "notes": "Existing semantic DOM heading found by Playwright scan",
    "heading_text": "🚚 Outbound Volume Flow\n            \n                (Pick → Pack → Load)\n            \n        💬",
    "heading_level": "3",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "bbox": [
      662,
      1291.59375,
      590,
      25
    ]
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "dom_heading_scan",
    "element_type": "heading",
    "selector_or_location": "body > main > div:nth-of-type(4) > div > div:nth-of-type(1) > h2",
    "wcag_candidate": "1.3.1",
    "severity": "info",
    "status": "pass",
    "notes": "Existing semantic DOM heading found by Playwright scan",
    "heading_text": "🏭 Department Production💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "bbox": [
      40,
      1522.59375,
      325.40625,
      28
    ]
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "dom_heading_scan",
    "element_type": "heading",
    "selector_or_location": "body > main > div:nth-of-type(4) > div > div:nth-of-type(2) > div:nth-of-type(2) > h4",
    "wcag_candidate": "1.3.1",
    "severity": "high",
    "status": "fail",
    "notes": "Skipped heading level: H2 is followed by H4.",
    "heading_text": "📋 IB Support",
    "heading_level": "4",
    "is_hierarchy_valid": "false",
    "hierarchy_issue_type": "skipped_level",
    "bbox": [
      51,
      2027.59375,
      1182,
      21
    ]
  },
  {
    "page_id": "page1",
    "page_url_or_fixture": "/Users/g0c073y/Documents/GitHub/accessibility-tool-audit/broken-pages-for-testing/page1.html",
    "skill_name": "dom_heading_scan",
    "element_type": "heading",
    "selector_or_location": "body > main > div:nth-of-type(5) > div > h2",
    "wcag_candidate": "1.3.1",
    "severity": "info",
    "status": "pass",
    "notes": "Existing semantic DOM heading found by Playwright scan",
    "heading_text": "Building Overview (DRAX Format) — Day Shift · Jun 10, 2026💬",
    "heading_level": "2",
    "is_hierarchy_valid": "true",
    "hierarchy_issue_type": "none",
    "bbox": [
      40,
      2618.59375,
      1204,
      23.171875
    ]
  }
]
```

## AI visual gaps / fake headings
```json
[]
```

## DOM scan raw output
```text
[
  {
    "text": "PHX1",
    "tag": "h1",
    "role": "",
    "selector": "body > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > h1",
    "headingLevel": "1",
    "fontSizePx": 25.6,
    "fontWeight": "700",
    "fontFamily": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
    "bbox": [
      135.4375,
      58.5,
      70.21875,
      31
    ]
  },
  {
    "text": "🚛 Yard Status💬",
    "tag": "h2",
    "role": "",
    "selector": "body > main > div:nth-of-type(1) > div:nth-of-type(1) > div > div:nth-of-type(1) > h2",
    "headingLevel": "2",
    "fontSizePx": 16,
    "fontWeight": "600",
    "fontFamily": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
    "bbox": [
      32,
      172,
      150,
      46
    ]
  },
  {
    "text": "📊 OB Flow (Today - MST)💬",
    "tag": "h2",
    "role": "",
    "selector": "body > main > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > h2",
    "headingLevel": "2",
    "fontSizePx": 16,
    "fontWeight": "600",
    "fontFamily": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
    "bbox": [
      536,
      173,
      275.015625,
      26
    ]
  },
  {
    "text": "Inbound Execution💬",
    "tag": "h2",
    "role": "",
    "selector": "body > main > div:nth-of-type(2) > div:nth-of-type(1) > div > div:nth-of-type(1) > h2",
    "headingLevel": "2",
    "fontSizePx": 17.6,
    "fontWeight": "600",
    "fontFamily": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
    "bbox": [
      40,
      692,
      244.109375,
      23.171875
    ]
  },
  {
    "text": "Outbound Execution💬",
    "tag": "h2",
    "role": "",
    "selector": "body > main > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(1) > h2",
    "headingLevel": "2",
    "fontSizePx": 17.6,
    "fontWeight": "600",
    "fontFamily": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
    "bbox": [
      674,
      692,
      259.859375,
      23.171875
    ]
  },
  {
    "text": "📦 Inbound Volume Mix\n            \n                (Receive paths only)\n            \n        💬",
    "tag": "h3",
    "role": "",
    "selector": "body > main > div:nth-of-type(3) > div > div:nth-of-type(1) > h3",
    "headingLevel": "3",
    "fontSizePx": 15.2,
    "fontWeight": "700",
    "fontFamily": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
    "bbox": [
      32,
      1291.59375,
      590,
      25
    ]
  },
  {
    "text": "🚚 Outbound Volume Flow\n            \n                (Pick → Pack → Load)\n            \n        💬",
    "tag": "h3",
    "role": "",
    "selector": "body > main > div:nth-of-type(3) > div > div:nth-of-type(2) > h3",
    "headingLevel": "3",
    "fontSizePx": 15.2,
    "fontWeight": "700",
    "fontFamily": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
    "bbox": [
      662,
      1291.59375,
      590,
      25
    ]
  },
  {
    "text": "🏭 Department Production💬",
    "tag": "h2",
    "role": "",
    "selector": "body > main > div:nth-of-type(4) > div > div:nth-of-type(1) > h2",
    "headingLevel": "2",
    "fontSizePx": 17.6,
    "fontWeight": "600",
    "fontFamily": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
    "bbox": [
      40,
      1522.59375,
      325.40625,
      28
    ]
  },
  {
    "text": "📋 IB Support",
    "tag": "h4",
    "role": "",
    "selector": "body > main > div:nth-of-type(4) > div > div:nth-of-type(2) > div:nth-of-type(2) > h4",
    "headingLevel": "4",
    "fontSizePx": 12.8,
    "fontWeight": "700",
    "fontFamily": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
    "bbox": [
      51,
      2027.59375,
      1182,
      21
    ]
  },
  {
    "text": "Building Overview (DRAX Format) — Day Shift · Jun 10, 2026💬",
    "tag": "h2",
    "role": "",
    "selector": "body > main > div:nth-of-type(5) > div > h2",
    "headingLevel": "2",
    "fontSizePx": 17.6,
    "fontWeight": "600",
    "fontFamily": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif",
    "bbox": [
      40,
      2618.59375,
      1204,
      23.171875
    ]
  }
]
```

## AI visual gap raw model output
```text
[]
```
