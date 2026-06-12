# Project Tech Stack & Context

> **Note to AI:** This file is auto-generated to provide context for Jira ticket creation and architectural decisions. Do not modify the structure.

## 1. Project Overview
- **Platform:** iOS (Native)
- **Primary Language:** Swift
- **Framework Version:** iOS 16.0+
- **Build Tool:** Xcode, Tuist, Bazel

## 2. Core Dependencies & Libraries
| Category | Library/Tool | Version | Notes |
|---|---|---|---|
| **UI Framework** | UIKit | N/A | Subclasses of `BaseView` required |
| **State Management** | Combine | N/A | Used with MVVM |
| **Networking** | Apollo (GraphQL), Firebase | N/A | |
| **Navigation** | Coordinators | N/A | Pattern enforced |
| **Styling** | WCP Design System | N/A | `ThemeableComponent` protocol |
| **Analytics** | Firebase, FullStory, Adobe | N/A | |

## 3. Architecture & Coding Conventions
- **Architecture Pattern:** MVVM-C (Model-View-ViewModel-Coordinator)
- **UI Paradigm:** Programmatic UI (UIKit)
- **Styling Approach:** Theming System (Override `applyTheme`)
- **Async/Concurrency:** Combine, Async/Await
- **Strictness:** TechDebtRegistry rules, 80% Code Coverage

## 4. Testing Strategy
- **Unit Testing:** XCTest
- **E2E/Integration:** XCUITest (implied by UI tests)
- **Mocking:** Custom Mocks (Manual)

## 5. Development Environment
- **Package Manager:** Carthage, Swift Package Manager, Tuist
- **Minimum Deployment Target:** iOS 16.0

## 6. "Do Not Use" / Anti-Patterns
> Critical for Jira Ticket generation. List things that are explicitly banned or deprecated in this codebase.
- Do not call `applyTheme` manually (system handles it via swizzling).
- Do not save a reference to `theme` in the class (use the one passed to `applyTheme`).
- Do not create UIView subclasses that do not inherit from `BaseView`.
- Do not use SwiftUI for core navigation (use Coordinators).
