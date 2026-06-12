# Project Tech Stack & Context

> **Note to AI:** This file is auto-generated to provide context for Jira ticket creation and architectural decisions. Do not modify the structure.

## 1. Project Overview
- **Platform:** Android (Native)
- **Primary Language:** Kotlin (v2.0.21)
- **Framework Version:** Android SDK 35 (Min SDK 28)
- **Build Tool:** Gradle 8.8.2 (with custom Walmart plugins)

## 2. Core Dependencies & Libraries
| Category | Library/Tool | Version | Notes |
|---|---|---|---|
| **UI Framework** | Jetpack Compose & XML (View System) | BOM 2024.10.01 | Hybrid approach. New features prefer Compose. Uses `glass.platform.glass.designComponents` (Living Design). |
| **State Management** | ViewModel + LiveData/Flow | Lifecycle 2.7.0 | Coroutines used for async state updates. |
| **Networking** | Retrofit, Apollo GraphQL, OkHttp | Retrofit 2.11.0, Apollo 3.8.3 | Mixed REST and GraphQL usage. |
| **Navigation** | AndroidX Navigation | 2.6.0 (Fragment), 2.8.3 (Compose) | Navigation Component used for both Fragments and Compose. |
| **Styling** | Living Design System | 6.3.1 | Custom Design System components (`glass.platform.glass.designComponents`). |
| **DI** | Custom Registry / Service Locator | N/A | Uses `glass.platform.registry.api.Registry` for module and API registration. |
| **Serialization** | Moshi | 1.15.1 | Used for JSON parsing. |
| **Image Loading** | Glide | 4.15.1 | |

## 3. Architecture & Coding Conventions
- **Architecture Pattern:** MVVM (Model-View-ViewModel) with Clean Architecture principles (View, UseCase/Interactor, Domain, Data layers).
- **UI Paradigm:** Hybrid: Fragment-based View System (XML) and Jetpack Compose.
- **Styling Approach:** Living Design System tokens and components.
- **Async/Concurrency:** Kotlin Coroutines (1.6.4) & Flow.
- **Module Structure:** Multi-module architecture (`apps/`, `features/`, `platform/`). Features are isolated and register via `LifecycleModule`.

## 4. Testing Strategy
- **Unit Testing:** JUnit 4, Mockk, Robolectric.
- **E2E/Integration:** Espresso.
- **Mocking:** Mockk (1.13.9).

## 5. Development Environment
- **JDK:** 17
- **Package Manager:** Gradle
- **Minimum Deployment Target:** Android API 28

## 6. "Do Not Use" / Anti-Patterns
> Critical for Jira Ticket generation. List things that are explicitly banned or deprecated in this codebase.
- **Do not use `AsyncTask`:** Use Kotlin Coroutines.
- **Do not use `android.app.Fragment`:** Use `androidx.fragment.app.Fragment`.
- **Do not use `synthetics`:** Use ViewBinding or Jetpack Compose.
- **Do not use Raw Strings:** Always use string resources (`strings.xml`) or Living Design tokens.
- **Do not put logic in Fragments/Activities:** Move business logic to ViewModels or UseCases.
- **Do not use Hardcoded Dimensions/Colors:** Use Living Design tokens.
