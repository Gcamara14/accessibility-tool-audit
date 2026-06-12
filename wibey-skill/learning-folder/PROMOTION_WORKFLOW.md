# 🏗️ The Human-in-the-Loop Promotion Workflow

*This document is an internal guide for Code Puppy (or other human/AI architects) on how to officially promote a "Novel Draft" from the `RECOMMENDED_TEMPLATES.md` staging file into the live Tri-Folder architecture.*

---

## 📌 The Goal
When Wibey's Ingestion Swarm discovers a completely novel bug fix, it writes it to `RECOMMENDED_TEMPLATES.md` as a Draft (e.g., `Draft #8`). To make this rule active for future AI runs, it must be officially "Promoted".

## 🚀 The 4-Step Promotion Execution

When a user asks Code Puppy to "Promote a Draft", Code Puppy must autonomously execute these 4 steps:

### Step 1: Extract the Draft
Read `final-skill/RECOMMENDED_TEMPLATES.md` and extract the target draft (e.g., Draft #8). Note its proposed ID (e.g., `WA11Y-WEB-1.3.1-007`), Title, WCAG mapping, and core problem.

### Step 2: Inject JSON into the Master Index
You must write a Node.js script (using `vm.createContext` or standard file manipulation) to physically append a new JSON object to the `window.A11Y_TEMPLATES` array inside `ADA-Bugs-Before/docs-ideas/templates-v1-03-19-2026-refactored.js`.

**Required JSON Format:**
```json
{
    "id": "[The Proposed ID]",
    "title": "[The Proposed Title]",
    "platforms": ["Web"],
    "wcag": "[The WCAG Criterion]",
    "priority": "P1",
    "severity": "1 - Critical",
    "shortDescription": "[Brief description from the draft]",
    "expectedResult": "[Expected AT behavior]",
    "actualResult": "[Actual AT behavior]",
    "recommendation": "[The fix strategy]",
    "dateAdded": "[Today's Date]"
}
```

### Step 3: Create the Physical Catalyst Template
Take the rich markdown content from the draft (including the `❌ Bad Code`, `✅ Good Code`, Unit Tests, and "Why This Works" rationale) and write it to a standalone file:
👉 `final-skill/catalyst-templates/[platform]/[ID].md`

**⚠️ CRITICAL UNIFORMITY RULE:** 
The H1 header of the generated Markdown file MUST exactly match the `title` string you just injected into the JSON array. Do not use Wibey's original "Proposed Title" if you or the user altered it for the JSON.
*Example:* `# Catalyst Template: [Exact JSON Title]`

### Step 4: Clean the Staging Area
Use a bash `sed` command or Python regex script to physically delete the original Draft from `final-skill/RECOMMENDED_TEMPLATES.md` to keep the staging area clean.

---

**Trigger Prompt Example:**
*"Code Puppy, please promote Draft #8 from the recommended templates file into the main index."*
*(Code Puppy will read this document and execute all 4 steps natively.)*
