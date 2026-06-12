# Catalyst Template: Status Messages — Announce Search Results (Found vs. Empty) With Correct Count After Page Load

**Template ID:** `WA11Y-IOS-4.1.3-010`
**Platform:** iOS
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-IOS-4.1.3-010`
**Source Tickets:** GPUGC-27162
**Source PRs:** [glass-app #149044](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/149044)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`SearchResultsCoordinator` had a method `postNoSearchResultsAnnouncement(query:)` that was called inside the item-stack processing loop — for each item stack that was a "sampling page" (a special product listing context). The bug: the method was called **before** evaluating whether any products existed in the stacks, causing "No results for {query}" to fire even when the page had valid results.

```swift
// ❌ Before fix — announcement fired unconditionally inside the loop:
for (stackIndex, var itemStack) in itemStacks.enumerated() {
    // ...
    if isProductSamplingPage.orFalse {
        postNoSearchResultsAnnouncement(query: model.query)  // ← always fires
        continue
    }
    // ...
}

private func postNoSearchResultsAnnouncement(query: String?) {
    guard let query, !query.isEmpty else { return }
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
        UIAccessibility.post(notification: .announcement, argument:
            String.localized(.emptyPrimaryStackTitle, using: .named(key: "term", value: query))
        )
    }
    // → VoiceOver: "No results for 'dog food'" — even when dog food results existed
}
```

**Symptom (Jira):** "VoiceOver says 'No results' even when search results are shown", "Screen reader announces empty results incorrectly on sampling page", "Wrong search result announcement for product sampling search".

---

## ✅ The Fix Pattern

### Count actual products before the loop; announce correct message after

```swift
// SearchResultsCoordinator.swift

// ✅ Count products BEFORE the loop (before any items are processed)
let totalProductCount = itemStacks.filter { !$0.isEmpty }.flatMap { $0.items }.count

// ✅ Announce based on actual count — unified method handles both cases
searchResultsAnnouncementIfNeeded(model.query, totalProductCount)

// Then process item stacks (continue loop without announcement):
for (stackIndex, var itemStack) in itemStacks.enumerated() {
    // ...
    if isProductSamplingPage.orFalse {
        // ← No announcement here; it was already posted above
        continue
    }
    // ...
}

// ✅ Unified announcement method — picks the right message
private func searchResultsAnnouncementIfNeeded(
    _ query: String?,
    _ totalProductCount: Int
) {
    guard
        isProductSamplingPage.orFalse,
        let query,
        !query.isEmpty
    else { return }

    // ✅ Determine message based on actual result count
    let localizationKey: LocalizableString =
        totalProductCount == 0
            ? .emptyPrimaryStackTitle   // → "No results for {term}"
            : .searchResultsHint        // → "{term} search results" or "{count} results for {term}"

    let message = String.localized(
        localizationKey,
        using: .named(key: "term", value: query)
    )
    postSearchResultsAnnouncement(withMessage: message)
}

private func postSearchResultsAnnouncement(withMessage message: String) {
    // ✅ 1-second delay lets the UI settle before VoiceOver reads the result
    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
        UIAccessibility.post(notification: .announcement, argument: message)
    }
}
```

---

### ❌ Bad Code — announcement inside the item-stack loop without product count check

```swift
// ❌ Before fix:
for (stackIndex, var itemStack) in itemStacks.enumerated() {
    if isProductSamplingPage.orFalse {
        postNoSearchResultsAnnouncement(query: model.query)
        // ← Fires even when itemStack is non-empty
        // ← Does not check total product count
        continue
    }
}

private func postNoSearchResultsAnnouncement(query: String?) {
    // ← Only handles the empty case; no "X results found" path
    UIAccessibility.post(..., argument: "No results for ...")
}
```

---

### The search result announcement pattern

```
User searches for "dog food"

Case 1 — results exist (totalProductCount > 0):
  After 1.0s: VoiceOver announces "dog food search results" or "42 results for dog food"
  ← User knows the search succeeded

Case 2 — no results (totalProductCount == 0):
  After 1.0s: VoiceOver announces "No results for dog food"
  ← User knows to try a different search

Both cases:
  - Count computed BEFORE the loop (count is accurate)
  - Single post (not one per item stack iteration)
  - 1-second delay lets the product grid render before speaking
```

---

### Correct localized strings for both states

```
// Localizable.strings

// Results found — use when totalProductCount > 0
"searchResultsHint" = "{term} search results";
// Or with count: "showing_results_for" = "{count} results for {term}";

// No results — use when totalProductCount == 0
"emptyPrimaryStackTitle" = "No results for {term}";
```

---

### Why announce search results at all?

Without an announcement:
- VoiceOver users submit a search and hear nothing — they do not know if results loaded
- The only feedback is the VoiceOver cursor position, which may still be on the search field
- Users must manually swipe through the results grid to discover whether results exist

With an announcement:
- Users immediately hear "42 results for dog food" or "No results for dog food"
- They can decide whether to scroll into results or refine the query
- No manual exploration required to determine search success

---

### 1-second delay for search result announcements

The delay matches the pattern used for snackbar announcements (WA11Y-IOS-4.1.3-006). For search results specifically:
- Network requests take 0.2–2.0s
- The announcement fires after the item stacks are built (data is available)
- `asyncAfter(1.0)` provides time for the collection view to scroll into position
- Reduces chance of the announcement clashing with VoiceOver's screen-change notification from the search loading state

---

## 🔑 Key Rules

- **Count total products before the item-stack processing loop** — the count must reflect the final state of all stacks, not the state of a single stack encountered during iteration.
- **Use a unified announcement method** — one method handles both "results found" and "no results" cases. This prevents the `postNoSearchResultsAnnouncement` bug where only one path was represented.
- **Announce outside the loop, not inside** — posting `.announcement` once (before or after the loop) prevents duplicate announcements if multiple item stacks trigger the same condition.
- **Use context-appropriate localized strings** — "No results for {term}" and "{term} search results" are distinct messages. Use the correct one based on `totalProductCount`.
- **Delay by 1 second** — search result announcements should fire after the UI has settled. An immediate announcement may be dropped by VoiceOver if it's processing a screen-change notification from the search loading state.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** Status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus. A false "No results" announcement when results exist is an incorrect status message — it communicates incorrect information about the search outcome without receiving focus. VoiceOver users make decisions based on this announcement (whether to scroll, refine, or give up). An incorrect message constitutes a failure of 4.1.3's requirement that status messages be accurate and programmatically communicated.

