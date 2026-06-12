# Useful Markdown Resources

This directory contains markdown documentation and reference materials used for accessibility compliance, project context, and custom GPT knowledge integration.

## File Descriptions

### Accessibility & WCAG References

*   **`WCAG_2.2_AA_Design_System_Reference.md`**
    *   **Purpose:** A concise summary of WCAG 2.2 Level A and AA success criteria.
    *   **Usage:** Designed for custom GPTs to generate accessibility decision reports. It maps each criterion to design system relevance and common component impacts.
    *   **Key Sections:** Requirement, Why this matters for design systems, Common component impacts, Source links.

*   **`WCAG_2.2_AA_Understanding_Full.md`**
    *   **Purpose:** Comprehensive documentation explaining the intent and detailed requirements of WCAG 2.2 AA success criteria.
    *   **Usage:** Deep-dive reference for understanding specific accessibility rules.

*   **`WCAG_2.2_Web_Sufficient_Techniques.md`**
    *   **Purpose:** A detailed collection of sufficient techniques and common failures for meeting WCAG 2.2 requirements on the web.
    *   **Usage:** Technical reference for implementing accessible code and verifying compliance.

*   **`AccName_Computation.md`**
    *   **Purpose:** Documentation of the logic used in the `accname` bookmarklet for computing accessible names.
    *   **Usage:** Explains how the accessible name is calculated (aria-labelledby, aria-label, native, content) and lists the validation rules (e.g., empty name, unique name).

### Project Tech Stacks

These files provide context about the specific technology stacks used in the project. They are critical for generating accurate code examples and architectural decisions.

*   **`TECH_STACK_WEB.md`**
    *   **Platform:** Web (React/Next.js)
    *   **Content:** Core dependencies (React, Next.js, Nx), architecture (Functional Components, Hooks), styling (Tachyons, Living Design), and anti-patterns (e.g., no CSS modules).

*   **`TECH_STACK_IOS.md`**
    *   **Platform:** iOS (Native Swift)
    *   **Content:** Core dependencies (UIKit, Combine), architecture (MVVM-C), styling (Theming System), and "Do Not Use" rules (e.g., manual applyTheme).

*   **`TECH-STACK-ANDROID.md`**
    *   **Platform:** Android (Native Kotlin)
    *   **Content:** Core dependencies (Jetpack Compose, XML, Coroutines), architecture (MVVM Clean Arch), and coding conventions.

## Usage with Custom GPTs

When using these files with a custom GPT for accessibility or coding tasks, instruct the AI to:

1.  **Consult the Tech Stack:** Read the relevant `TECH_STACK_*.md` file to understand the project's constraints, libraries, and coding style.
2.  **Reference WCAG:** Use `WCAG_2.2_AA_Design_System_Reference.md` to identify applicable accessibility criteria.
3.  **Apply Techniques:** Check `WCAG_2.2_Web_Sufficient_Techniques.md` for implementation details.
