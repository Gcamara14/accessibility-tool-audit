# Team Architecture: Sparky Chatbot

**Domain Area:** Customer Care
**Jira Label Mapping:** `A11Y-US-Team-Sparky`
**Last Updated:** 2026-03-19

---

## 📍 Where the Code Lives
When fixing bugs for this team, start your search here (priority routing) before falling back to global grep: these repositories:
- **Web Client:** `git@github.walmart.com:us-web/sparky-ui.git` (Primary)
- **Shared API Types:** `git@github.walmart.com:us-services/sparky-schema.git`

## 🛠️ Tech Stack & Constraints
- **Framework:** React CSR (Client-Side Rendering)
- **Design System:** WCP (Walmart Component Platform) primarily, some legacy LD.
- **State Management:** Redux Toolkit

## ♿ Known Accessibility Pitfalls (Historical Memory)
*The AI should append new behavioral learnings here when it encounters recurring team-specific patterns.*

- **[2026-03-19]:** The chat input component dynamically injects elements into the DOM. Ensure `aria-live="polite"` is used on the chat container so screen readers announce incoming messages from Sparky.
- **[2026-03-19]:** The team uses a custom WCP Modal for the feedback form. Be careful not to break the focus trap when injecting `aria-describedby` into the text fields.

---

## 📝 Recent Fix Logs
*Append links to merged PRs or unique fixes applied to this team's codebase here.*
- *(None yet)*
