# Catalyst Template: Status Message — Autocomplete Suggestion List Count Not Announced

**Template ID:** `WA11Y-AND-4.1.3-006`
**Platform:** Android
**WCAG Criterion:** 4.1.3 Status Messages
**Jira Label:** `WA11Y-AND-4.1.3-006`
**Source Tickets:** CEPG-373530
**Source PRs:** [walmart-glass #138653](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/138653)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

When a user types in an address or search field and autocomplete suggestions populate a `RecyclerView` below the field, **TalkBack gives no feedback**. The suggestions list appears visually but there is no accessibility announcement.

Without an announcement:
- TalkBack users don't know whether results exist at all
- Users cannot tell how many options are available before swiping through them
- Users may keep typing thinking the field is still processing, or give up

**Symptom (Jira):** "TalkBack doesn't announce address suggestions", "No feedback when search results appear", "Can't tell if autocomplete has suggestions with screen reader", "Suggestion list not announced in TalkBack", "Address field silent when results load".

---

## ✅ The Fix Pattern

### `announceForAccessibility()` on the list container when suggestions update

When the suggestions list is populated, call `announceForAccessibility()` on the `RecyclerView` (or its container) with a message giving the count and current query:

```kotlin
// ✅ Announce suggestion count without moving TalkBack focus.
// Called when the suggestions list is updated with a new result set.
binding.searchSection.addressSuggestionsRecyclerView.announceForAccessibility(
    string(
        R.string.delivery_address_suggestions_available_format,
        "itemCount" to it.suggestions.size,
        "currentValue" to searchText
    )
)
// → TalkBack: "3 results found for 702 SW 8. Explore by touch."
```

```xml
<!-- strings.xml -->
<string name="delivery_address_suggestions_available_format">
    {itemCount} results found for {currentValue}. Explore by touch.
</string>
```

The phrase **"Explore by touch."** instructs users to swipe right or use touch exploration to navigate into the list without moving keyboard focus out of the text field.

---

### Full wiring — observe suggestions, announce on each update

```kotlin
// In onViewCreated / setupObservers:
viewModel.suggestionsState.observe(viewLifecycleOwner) { state ->
    when (state) {
        is SuggestionsState.Results -> {
            val suggestions = state.suggestions
            adapter.submitList(suggestions)
            binding.searchSection.addressSuggestionsRecyclerView.isVisible =
                suggestions.isNotEmpty()

            if (suggestions.isNotEmpty()) {
                // ✅ Announce result count + current query so TalkBack user knows
                // suggestions are available without leaving the text field.
                binding.searchSection.addressSuggestionsRecyclerView
                    .announceForAccessibility(
                        string(
                            R.string.delivery_address_suggestions_available_format,
                            "itemCount" to suggestions.size,
                            "currentValue" to viewModel.currentSearchText
                        )
                    )
            }
        }
        is SuggestionsState.Empty,
        is SuggestionsState.Loading -> {
            adapter.submitList(emptyList())
            binding.searchSection.addressSuggestionsRecyclerView.isVisible = false
            // No announcement needed for empty/loading — absence is expected
        }
    }
}
```

---

### ❌ Bad Code — no announcement

```kotlin
// Suggestions populate visually but TalkBack is never notified.
viewModel.suggestionsState.observe(viewLifecycleOwner) { state ->
    adapter.submitList(state.suggestions)
    binding.addressSuggestionsRecyclerView.isVisible = state.suggestions.isNotEmpty()
    // ← No announceForAccessibility → TalkBack users get no feedback
}
```

---

### When NOT to announce (avoid noise)

- **Empty results** — do not announce "0 results found". Silence is better than a disruptive "0" message on every keystroke that clears results.
- **Loading state** — do not announce "Loading..." on every keystroke. Announce only when the final result set arrives.
- **Single character typed** — consider debouncing or only announcing when the result set stabilizes (usually at 2+ characters), to avoid spamming announcements on rapid typing.

---

## 🔑 Key Rules

- **`announceForAccessibility()` does not move TalkBack focus** — the user stays in the text field. The announcement is delivered via the `ACCESSIBILITY_EVENT_TYPE_ANNOUNCEMENT` event. This is the correct mechanism for "status updates that do not take focus".
- **Include the count AND the current query** — "{N} results found for {query}" gives two pieces of information: how many options exist (helps decide whether to explore) and what search term produced them (confirms the field registered the input correctly).
- **"Explore by touch." is a navigation instruction** — appending this tells TalkBack users the standard gesture for reaching the list (swipe right or touch exploration) without requiring them to infer it.
- **Announce on the `RecyclerView`, not the parent container** — `announceForAccessibility` fires from the view it's called on. Using the list view itself ensures the announcement is associated with the region that changed.
- **Do not use `accessibilityLiveRegion` on the RecyclerView** — `ACCESSIBILITY_LIVE_REGION_POLITE` on a `RecyclerView` causes every adapter update (each item bind) to fire an announcement. This creates flooding on large lists. Use `announceForAccessibility` once per query result, not per item.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.3 (Status Messages):** Status messages that are not given focus must be programmatically determinable by assistive technologies so that users are informed without requiring focus movement. The appearance of autocomplete suggestions is a status change — the field's result state has changed from "no suggestions" to "N suggestions available". Without an announcement, TalkBack users receive no notification of this change. They cannot access the suggestions because they don't know they exist. This is a WCAG 4.1.3 failure: a status change occurred but was not communicated to AT.
