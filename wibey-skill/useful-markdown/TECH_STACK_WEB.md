# Project Tech Stack & Context

> **Note to AI:** This file is auto-generated to provide context for Jira ticket creation and architectural decisions. Do not modify the structure.

## 1. Project Overview
- **Platform:** Web (React/Node)
- **Primary Language:** TypeScript
- **Framework Version:** React 18.2, Next.js 12.3.4 (Patched)
- **Build Tool:** Nx 21.3.11, Webpack 5.97.1

## 2. Core Dependencies & Libraries
| Category | Library/Tool | Version | Notes |
|---|---|---|---|
| **UI Framework** | Living Design (@livingdesign/react), WCP Components | 1.12.1 | Internal Design System |
| **State Management** | Zustand, React Query | 4.4.5, 4.24.4 | |
| **Networking** | Axios, Node-fetch | 1.13.2, 3.0.0 | |
| **Navigation** | Next.js Router | 12.3.4 | |
| **Styling** | Tachyons (Utility Classes) | N/A | See "Do Not Use" section |
| **Forms/Validation** | React Hook Form, Zod | 6.14.0, 3.24.1 | Migration to v7 likely in progress |

## 3. Architecture & Coding Conventions
- **Architecture Pattern:** Nx Monorepo, Feature-based libraries (libs/ui, libs/account, etc.)
- **UI Paradigm:** Functional Components with Hooks
- **Styling Approach:** Utility-first (Tachyons) + Inline Styles (Fallback). **Strictly no CSS files.**
- **Async/Concurrency:** Async/Await, React Query for data fetching
- **Strictness:** Strict TypeScript (noImplicitAny: true, strict: true)

## 4. Testing Strategy
- **Unit Testing:** Jest
- **E2E/Integration:** TestCafe, React Testing Library
- **Mocking:** MSW (Mock Service Worker)

## 5. Development Environment
- **Node Version:** 22.14.0
- **Package Manager:** pnpm
- **Minimum Deployment Target:** Modern Browsers (Browserslist)

## 6. "Do Not Use" / Anti-Patterns
> Critical for Jira Ticket generation. List things that are explicitly banned or deprecated in this codebase.
- **Do not use CSS Modules (.module.css, .module.scss)** or standalone CSS files.
- **Do not use CSS-in-JS libraries** (styled-components, emotion) - strictly prohibited despite presence in package.json.
- **Do not use `<style>` tags** or scoped styles.
- **Do not use inline styles for spacing** (margin/padding) - use Tachyons classes (e.g., `pa3`, `mt4`).
- **Do not use Class Components** - use Functional Components with Hooks.
- **Do not use `any` type in TS** - strict mode is enabled.
- **Do not use manual font sizing** - use `WcpText*` components from Design System.
