# Learning: The "Horizontal Seeding" Strategy for AI Architecture

**Date:** March 2026
**Context:** During Phase 6 of the Enterprise Accessibility Intelligence System build, we realized that our AI (Wibey) was incredibly fast at fixing bugs *only if* it already knew where the team's code lived in the `final-skill/teams/` folder. 

## The Problem (The Cold Start Penalty)
When a developer gives Wibey a bug for a team it hasn't seen yet (e.g., the Pharmacy team), Wibey doesn't have a `teams/Health-Wellness/pharmacy.md` file to consult. 
To find the broken code, Wibey falls back to running a global `grep -rl` across the entire 40+ million line `Walmart-Web-2` monorepo. This "global search" takes massive amounts of time (15-30 minutes), burns tokens, and often hits tool timeout limits.

## The Solution: Phase 6.5 Horizontal Seeding
Instead of waiting for Wibey to organically discover all teams over months of use, we implemented a **Targeted Horizontal Seeding Strategy**.

We explicitly search Jira for exactly one resolved bug PR across every major `A11Y-US-Area-*` label and feed them into the batch ingestion queue. 

### Pros
1. **Instant Monorepo Map:** By ingesting 10-15 PRs across 10 distinct Domain Areas, Wibey is forced to automatically generate the markdown architecture files for those teams in one single afternoon.
2. **Jira Prefix Routing:** The Swarm automatically learns and logs that `PGSPHARM-` tickets map to `libs/health/pharmacy-ui/`. The next time Wibey sees a `PGSPHARM-` ticket, it instantly `cd`s to that folder, dropping execution time from 20 minutes down to <1 minute.
3. **Tech Stack Flavoring:** Captures immediate baseline data on how different teams build their UI (e.g., discovering if the Cart team uses Next.js while the Accounts team uses React CSR).

### Cons
1. **Data Noise:** The bugs we ingest for this sweep might be trivial (e.g., a simple typo fix). We are ingesting them purely to capture the *repository path* and *team context*, not necessarily because the accessibility fix itself is novel. This slightly dilutes the "high quality" threshold of the Catalyst Templates, but the architectural trade-off is worth it.
2. **Maintenance:** If a team undergoes a massive re-org and moves their code to a new workspace, the pre-seeded file in `/teams/` becomes stale. However, Wibey's self-learning loop will eventually overwrite it the next time it successfully resolves a PR for that team.

## Conclusion
The `/teams/` folder is the brain that makes the AI fast. Seeding it horizontally before a Beta Launch ensures the AI looks like a Principal Engineer from Day 1, rather than a confused junior dev trying to find their way around the monorepo.
