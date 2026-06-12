# Bug Template ID Schema & Injection Guide

*This document explains the Unique ID system used in our `templates-v1-03-19-2026-refactored.js` file and provides instructions on how to safely inject new templates in the future.*

## 🏷️ The `WA11Y` Schema
Every bug template must have a strictly formatted, universally unique `id` property. This ID serves as the literal filename for its corresponding Catalyst Template (`catalyst-[id].md`) and allows our AI orchestration to index fixes flawlessly.

**Format:** `WA11Y-[PLATFORM]-[WCAG]-[COUNTER]`

### Breakdown:
1. **`WA11Y`**: Walmart Accessibility (The global namespace).
2. **`[PLATFORM]`**: The primary environment the bug affects.
   - `WEB` (React / HTML)
   - `IOS` (SwiftUI / UIKit)
   - `AND` (Android Compose / TalkBack)
   - `RN` (React Native)
   - `ALL` (Global bugs that affect multiple platforms equally)
3. **`[WCAG]`**: The strict WCAG success criterion number (e.g., `1.1.1`, `4.1.2`). If a bug has no WCAG mapping, use `UNKNOWN`.
4. **`[COUNTER]`**: A 3-digit rolling counter to ensure uniqueness (e.g., `001`, `002`, `045`).

**Examples:**
*   `WA11Y-WEB-4.1.2-003` (The 3rd Web template mapped to WCAG 4.1.2)
*   `WA11Y-AND-1.3.1-001` (The 1st Android template mapped to WCAG 1.3.1)

---

## ➕ How to Inject a New Template

If you (or an AI agent) discover a brand new bug pattern and need to add it to the `.js` file, you must follow these rules to prevent ID collisions:

### Step 1: Identify the Group
Determine the Platform and the WCAG rule for your new bug (e.g., "This is an iOS bug for WCAG 2.4.4").
*   Group Key = `IOS-2.4.4`

### Step 2: Find the Highest Counter
Open the `templates-v1-03-19-2026-refactored.js` file and search for the highest existing counter in that specific group.
*   *If you see `WA11Y-IOS-2.4.4-001` and `WA11Y-IOS-2.4.4-002`...*

### Step 3: Increment & Inject
Your new template must take the next available number (`003`).

```json
{
    "id": "WA11Y-IOS-2.4.4-003",
    "title": "Links: Unclear Purpose in SwiftUI",
    "platforms": ["iOS"],
    "wcag": "WCAG-2.4.4",
    "dateAdded": "YYYY-MM-DD",
    // ... the rest of the template data
}
```

### Step 4: Placement
While the ingestion tool can handle the array being out of order, it is best practice to **insert the new JSON object alphabetically** directly underneath its sibling templates in the file to maintain a clean human-readable structure.
