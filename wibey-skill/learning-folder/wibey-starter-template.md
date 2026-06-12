# Wibey Skill Starter Template

*This document contains the exact boilerplate code and directory structure needed to build a custom Wibey skill.*

## Directory Structure
```text
~/.wibey/skills/ld-wcp-helper/
├── SKILL.md
├── references/
│   └── component-mapping.md
└── scripts/
    └── query-component.py
```

## `SKILL.md` (with YAML frontmatter)
```yaml
name: ld-wcp-helper
description: Provides Living Design and WCP component knowledge for migration and usage.
allowed-tools:
  - Read
  - Bash
metadata:
  author: Your Name
  version: 1.0
  category: migration
sample-prompts:
  - 'Show me how to migrate Card from LD to WCP.'
  - 'What is the WCP equivalent of LD Button?'
arguments:
  - 'component_name: Name of the component to query.'
```

### Skill Instructions (Body of SKILL.md)
This skill helps you find migration paths and documentation for Living Design and WCP components. It can:
- Map LD components to WCP equivalents
- Show migration guides and best practices
- Provide links to official documentation

## Example Reference File: `references/component-mapping.md`
```markdown
# LD to WCP Component Mapping

| LD Component | WCP Equivalent | Notes |
|--------------|---------------|-------|
| Card | Card | Minor API differences |
| Button | Button | Use variant prop for styles |
```

## Example Script: `scripts/query-component.py`
```python
import sys

# Get component name from arguments
component = sys.argv[1] if len(sys.argv) > 1 else ""

# Simple lookup (expand as needed)
mapping = {
    "Card": "Card",
    "Button": "Button",
    # Add more mappings here
}

if component in mapping:
    print(f"LD component '{component}' maps to WCP component '{mapping[component]}'")
else:
    print(f"No mapping found for '{component}'. Please check the documentation.")
```
