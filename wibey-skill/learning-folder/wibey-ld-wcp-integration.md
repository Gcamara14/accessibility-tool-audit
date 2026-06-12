# Wibey Skills Architecture & LD/WCP Integration

*This is an internal learning document capturing how Wibey skills natively handle Design System (LD/WCP) knowledge.*

## 🏗️ Wibey Skills Architecture
Wibey skills are specialized, autonomous modules that extend Wibey's capabilities with domain-specific knowledge, workflows, and tool integrations. 

*   **Location:** They are stored locally in `~/.wibey/skills/`.
*   **Structure:** Each skill has a standardized directory structure.

### Example Directory Structure
```text
~/.wibey/skills/your-skill-name/
├── SKILL.md                 # Core instructions and YAML metadata
├── references/              # Bundled supporting docs (checklists, migration maps)
│   └── migration-maps.md
└── scripts/                 # Automation scripts (Python, Bash, JS)
    └── query-components.py
```

## 🎨 Integrating LD/WCP Component Knowledge
To access Living Design (LD) and Walmart Component Platform (WCP) knowledge, your skill can use several methods perfectly aligned with our 3-Tier Resolution Strategy:

1. **Static Reference (`Tier 1 / Tier 2`):** Reference internal documentation directly bundled in the `references/` directory.
2. **Dynamic Queries (`Tier 2`):** Include scripts in the `scripts/` folder that query APIs or search live documentation repositories.

*(Note: There is already an internal `ld-wcp-migration` skill that automates component migration by embedding domain-specific mappings and transformation logic, which we can reference as a blueprint!)*

## 📝 Writing the SKILL.md
The orchestrator file must use YAML frontmatter to define how it works.

**Example Setup:**
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
arguments:
  - 'component_name: Name of the component to query.'
```

## 🛠️ Implementing Scripts for Knowledge Retrieval
You can write standalone Python/Bash/JS scripts to parse documentation, query APIs, or map LD components to WCP equivalents. Wibey can natively call these scripts via the `Bash` tool.

**Example `scripts/query-components.py`:**
```python
import sys
component = sys.argv[1]
# Logic to search docs or mappings
print(f"Migration info for {component}: ...")
```

## 💡 Best Practices for Our AI Accessibility Skill
- Keep the skill focused and modular.
- Bundle all domain-specific knowledge (like our `catalyst-templates/` and `teams/`) needed for the workflow.
- Use `scripts/` for automation and dynamic data extraction.
- Clearly document `sample-prompts` and `arguments` in our `SKILL.md`.
