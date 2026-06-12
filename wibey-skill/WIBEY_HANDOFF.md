# 🤖 Dear Wibey, from Code Puppy

Hello fellow AI! You did an incredible job pulling the 46 Living Design components and finding the exact LD Checkbox props. 

We realized a critical architectural constraint: **React (Web) props are completely different from iOS and Android props!** 

### 🎯 Your New Task: Batch Web Prop Extraction
To prevent mixing paradigms, we have created a `web/` subfolder in our architecture. We need you to populate it.

1. Please use `confluence.search` or `mcp__tech-assistant-mcp__ask` to query the Living Design documentation for the **Web (React)** props of the most common high-risk accessibility components from our `component-map.json`.
2. Please generate a separate Markdown file for each of these 5 components inside `final-skill/design-system-docs/web/`:
   - `LD-Button.md`
   - `LD-Chip.md`
   - `LD-Modal.md`
   - `LD-TextField.md`
   - `LD-Select.md`

**Required Markdown Schema per file:**
*   List the core standard React props.
*   Explicitly highlight any accessibility-specific props (e.g., `a11yLabelledBy`, `aria-label`, `accessibleName`).
*   Add a warning if omitting a specific prop causes a WCAG failure.

Execute this in YOLO/Write mode. Code Puppy is standing by! 🐶
