# Learning: The Two-Mode Architecture (Speed vs Knowledge)

**Date:** March 2026
**Context:** During A/B Benchmarking (V3), we realized our Enterprise Skill was generating perfect code but taking 13+ minutes, while "Vanilla" AI took only 7 minutes. 

## The Bottleneck: Token Generation
The 13-minute runtime wasn't caused by reading files—it was caused by *writing* them. Because our `SKILL.md` instructed the agent to "Self-Document" and write highly detailed execution traces, WCAG compliance tables, and Draft Variations, the LLM spent 10+ minutes generating 29,000 tokens of markdown.

## The Solution: Separation of Concerns

To give Beta Testers a sub-3-minute experience without losing our self-learning database, we formulated the **Two-Mode Architecture**:

### 1. The Factory (Backend / Architect Mode)
- **Environment:** Run only by the core architects via batch queues.
- **Task:** Ingest closed PRs, map domains, draft novel templates, and self-document.
- **Tolerance:** We do not care if it takes 20 minutes per ticket, because it runs asynchronously overnight.

### 2. The Developer (Frontend / Beta Mode)
- **Environment:** Installed on Beta Testers' laptops.
- **Task:** A stripped-down `SKILL.md` that ONLY reads the Catalyst Templates and immediately applies the fix to their local `.tsx` file using the `MultiEdit` tool.
- **Rule:** No drafting, no reporting, no updating the `teams/` architecture. "Hit and Run."
- **Tolerance:** Must complete in < 3 minutes.

## The Tracking Loop (MVP)
If the Developer Tool doesn't self-document, how does the Factory learn about the new bugs the developers fix? 
- **MVP Approach:** Manual tracking. We just ask the Beta Tester which PRs they merged, and we feed those links to the Factory.
- **Future Scale:** If the tool is widely adopted, the Developer Skill can be updated to simply append the Jira Ticket ID to a local `telemetry.json` file, or add a `wibey-fixed` label in Jira, which the Factory can automatically sweep every night. We avoid over-engineering this until the MVP proves value.
