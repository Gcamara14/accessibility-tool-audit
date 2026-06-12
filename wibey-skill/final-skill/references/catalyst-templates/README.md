# 🧩 Templates (Layer 1: The Fix)

This directory contains the primary operational bug-fix playbooks. These files are named by **Template ID** (e.g., `button-missing-role.md`).

When the AI agent encounters a Jira ticket with a matching Template ID, it will prioritize the fix logic found in these files over generic WCAG rules. 

**What goes in here:**
- The exact internal component to use (e.g., `<WMTButton>`).
- The preferred code pattern for the design system.
- Historical examples of pass/fail scenarios.
