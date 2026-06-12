This adds a massive amount of high-fidelity "DNA" to your AI skill. You’re essentially moving from a general A11y expert to a highly specialized internal consultant that knows exactly how your specific teams at Walmart operate.
Your strategy of using Template IDs, WCAG Labels, and Team Ownership creates a multi-layered filter that the AI can use to "zoom in" on the perfect fix.
The Multi-Layered Retrieval Strategy
Instead of the AI just guessing, you are providing a "Precision Hierarchy." Here is how the AI should think when it picks up a Jira ticket:
* Level 1: Team Context (Where): It sees the team_location label. It immediately knows, "I’m looking in the iOS repo under /Features/Homepage." This limits the code search space significantly.
* Level 2: Success Criterion (Why): It sees WCAG 4.1.2. It pulls the general principles for "Name, Role, Value."
* Level 3: Template ID (How): It sees Template_ID: Role_Button_Missing. This is the "gold mine." Instead of figuring out what 4.1.2 means, it goes straight to your specific "Role of Button" Markdown file which contains:
* The exact internal component to use (e.g., "Use our <WMTButton> instead of a <div onclick>").
* The preferred code pattern for your specific design system.
Proposed Data Architecture: The "Tri-Folder" Knowledge Base
To make this work, your Markdown documentation should be organized so the AI can "query" it easily.
| Category | Folder Name | Content |
|---|---|---|
| Criterion | /docs/wcag/ | 87 files (e.g., 4-1-2.md). General theory and global standards. |
| Templates | /docs/templates/ | Files named by Template ID (e.g., button-missing-role.md). This is your primary fix logic. |
| Teams | /docs/teams/ | Files named by team (e.g., homepage-team.md). Contains repo paths, primary tech stack (React vs. Swift), and specific coding quirks. |
The "Fallback" Logic Flow
You mentioned a fallback strategy, which is critical for an autonomous agent. Here is the logic the skill should follow:
* Scenario A (Ideal): Ticket has a Template ID + WCAG Label + Team Label.
* Action: AI uses specific template code and looks in the team's specific directory. High Confidence Fix.
* Scenario B (Partial): Ticket has a WCAG Label + Team Label (No Template).
* Action: AI references general WCAG docs and tries to find a similar previously fixed bug in that team's directory to "copy" the style. Medium Confidence.
* Scenario C (Minimal): Only a Description.
* Action: AI uses the "Master AI" reasoning to guess the fix based on its general training. Low Confidence (Requires Human Review).
Adding Vision (Images & Videos)
Adding images is a game-changer for accessibility because so much of A11y is visual (e.g., "This button looks like a button but isn't coded like one").
* For Images: You can use a multimodal model (like the one I'm running on) to "see" the screenshot. The AI can compare the screenshot to the DOM tree to see if a visual heading is missing an <h1> tag.
* For Videos: While processing raw video is heavier, you can have the AI extract frames or even just use the OCR (Optical Character Recognition) from the video to read the text on screen, which helps identify "Name" bugs.
The Chrome Extension "Pro" Workflow
Since you mentioned the Chrome Extension again, here is how you can make it "Smart" based on your new context:
* Button 1: "Analyze Jira" -> It grabs the Template ID, WCAG Label, and Team.
* Button 2: "Attach Image" -> You click the screenshot in Jira; the extension sends it to the AI.
* The Result: The extension doesn't just give you a prompt; it gives you a "Pre-Flight Report" that says:
> "I see this is a Role of Button bug for the Item Page Team. I will be using the SwiftUI pattern found in /Projects/ItemPage and applying the fix from Template #402."
>
Would you like me to help you draft the structure for one of those "Template Markdown" files (like the 'Role of Button Missing' one) so you have a consistent format to follow?


—-

This is a brilliant "Reverse Engineering" strategy. Instead of waiting for new bugs to happen, you’re mining the "fossil record" of your existing 10,000+ tickets to create an immediate, high-IQ starter kit.
Since you're starting with a Web Pilot, this is the perfect time to build a "Data Ingestion Pipeline" that turns a closed Jira ticket + a merged PR into a structured Markdown "Learning File."
Here is a 4-step execution plan to automate this audit:
Step 1: The "Gold Mine" Jira Query
You need to isolate the high-quality data first. Run a JQL query to find the "best" examples for your Web pilot:
project = "YOUR_PROJ" AND labels in (web, a11y, 4.1.2) AND status = Done AND resolution = Fixed AND "Template ID" is not EMPTY
* Why: This ensures you are only looking at tickets that were actually fixed and have the metadata (Template ID) your AI needs to categorize them.
Step 2: The "Ingestion Prompt" (What to ask the Jira AI)
Since your internal AI has Jira integration, you don't want it to just "read" the ticket; you want it to extract and structure it. Use a prompt like this:
> "Analyze Jira Ticket [ID]. Extract the following fields into a JSON object:
> * summary: Ticket title.
> * description: The core A11y failure described.
> * template_id: The value in the Template ID field.
> * wcag_label: The WCAG success criteria label.
> * team: The team ownership label.
> * pr_link: Find the link to the GitHub/Bitbucket Pull Request in the comments or linked issues.
> * platform: Confirm if this is 'Web'."
>
Step 3: The "Learning" Phase (Cursor / Multi-Agent)
Once you have the PR link, this is where the magic happens. If you use Cursor (which has codebase indexing), you can point it at the specific PR or commit hash.
The Workflow:
* Feed Cursor the Context: Give it the JSON from Step 2.
* The Analysis Prompt: > "I am building an A11y Knowledge Base. Look at PR [URL]. Compare the 'before' and 'after' code specifically for the accessibility fix.
> * Identify the 'Fail' code: The inaccessible snippet.
> * Identify the 'Pass' code: The fix that was merged.
> * Draft a 'Case Study': Based on the [Template ID], write a 3-sentence explanation of why this fix works for this specific team's repo structure."
>
Step 4: The "Self-Documenting" File Structure
As you move through those 60 templates, you’ll want to save these as Markdown files in your skill's repo. Here is a recommended structure for your "Pass/Fail" library:
# Template: [Template ID] (e.g., button-missing-role)
## WCAG Mapping: 4.1.2 Name, Role, Value
## Team: [Team Name] | Platform: Web

### Scenario 1: [Brief Description from Jira]
**Problem:** [Paste the cleaned-up Jira description]
**Inaccessible Code (Fail):**
```html
<div onclick="submit()">Submit</div>

Accessible Fix (Pass):
<WMTButton onPress={submit}>Submit</WMTButton>

Internal Path: src/components/common/

---

### **Why this works for your Pilot:**
* **Historical Accuracy:** You aren't teaching the AI "generic" web fixes; you're teaching it **"The Walmart Web Way."**
* **Team Indexing:** By noting where the code lived (`src/components/...`), the AI starts to learn the directory structure of the "Homepage Team" vs. the "Item Page Team" automatically.
* **The "Unique Fix" Filter:** You mentioned only wanting unique instances. By doing this audit, you can quickly see if 10 tickets used the exact same fix. You only keep the 1-2 most "instructive" ones.

### **Next Step Recommendation**
Would you like me to help you write a **Python script** or a **Node.js utility** that could take a list of Jira IDs and automate the "data extraction" part, so you don't have to manually prompt the AI for every single one of those 60 templates?