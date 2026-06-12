# Skill Audit Production Prompts v1

These are the promoted prompts after v2 refinement.

## 1) Headings Inventory (production draft)
```text
Analyze the provided HTML and inventory heading semantics.
Output only the schema-compliant findings table.

Strict checks:
- Real heading elements (h1-h6)
- Fake headings (div/span styled or named as heading)
- Empty headings
- Skipped heading levels where evidence exists

If uncertain, use status=needs_review with explicit notes.
Do not fabricate selectors or inferred DOM content.
```

## 2) Images Inventory (production draft)
```text
Analyze the provided HTML and inventory image accessibility findings.
Output only the schema-compliant findings table.

Strict checks:
- Missing alt
- Empty alt with unclear decorative intent
- Unhelpful alt content
- Name source identification

If no images are present, return an empty table (headers only).
Do not infer decorative intent without evidence.
```

## 3) Interactive Elements Inventory (production draft)
```text
Analyze the provided HTML and inventory interactive controls.
Output only the schema-compliant findings table.

Strict checks:
- Accessible name source
- Role and state evidence
- Keyboard reachability from semantics
- Focus order risks from tabindex usage
- Non-semantic custom controls

Benchmark policy:
- tabindex > 0 => fail/high
- non-semantic custom clickable control without keyboard semantics => fail/critical
```

## Known limits
1. Static HTML cannot reliably verify runtime focus-trap behavior.
2. CSS-only focus visibility may be unknown without computed style/runtime rendering.
3. Dynamic ARIA updates (state changes) are only partially inferable from static markup.
4. JavaScript event semantics (Enter/Space handlers) are not guaranteed without script analysis.

## Next expansion
- Add DOM+CSS runtime capture for focus indicator confidence.
- Add event-handler-aware parser for keyboard activation evidence.
- Extend to forms/labels specialist and dialog-focus specialist prompts.
