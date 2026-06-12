# Catalyst Template: Dynamic Item Count and Estimated Total Not Announced to VoiceOver

**Template ID:** `WA11Y-IOS-4.1.3-004`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 4.1.3 Status Messages
**Component:** BasketBuilderViewController — addSelectedItemsView item count and estimated total
**Source PRs:**
- [CEPG-368075](https://jira.walmart.com/browse/CEPG-368075) | commit `e905716d2ce8` — item count and estimated total not announced on selection change
**Ingested:** 2026-04-30

---

## The Problem

When a user selects or deselects an item in the Basket Builder, the `addSelectedItemsView` updates its title (item count) and subtitle (estimated total) silently. VoiceOver users receive no feedback that the count or total has changed — they must navigate away from the current item to discover the new values.

**Root cause:** Updating `addSelectedItemsView.model` changes the displayed text but does not trigger any VoiceOver announcement. An explicit `UIAccessibility.post(notification: .announcement, argument:)` must be posted after the model update, guarded to fire only when the displayed values actually change.

---

## Fix Pattern

### Announcing Updated Item Count and Estimated Total on Model Change (CEPG-368075)

**Bad Code:**
```swift
// ❌ Model updated silently — VoiceOver users don't know the count or total changed
if model.addSelectedItemsModel != oldValue?.addSelectedItemsModel {
    addSelectedItemsView.model = model.addSelectedItemsModel
}
```

**Good Code:**
```swift
if model.addSelectedItemsModel != oldValue?.addSelectedItemsModel {
    addSelectedItemsView.model = model.addSelectedItemsModel

    // CEPG-368075: Announce updated item count and estimated total to VoiceOver
    // without moving focus (per WCAG Status Messages requirement)
    if let oldValue,
       UIAccessibility.isVoiceOverRunning,
       oldValue.addSelectedItemsModel.title != model.addSelectedItemsModel.title
       || oldValue.addSelectedItemsModel.subTitle != model.addSelectedItemsModel.subTitle {
        let announcement = model.shouldHideSubTitle
            ? model.addSelectedItemsModel.title
            : "\(model.addSelectedItemsModel.title), "
            + String.localized(.basketBuilderEstimatedTotal(price: model.addSelectedItemsModel.subTitle))
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            UIAccessibility.post(notification: .announcement, argument: announcement)
        }
    }
}
```

**Why This Works:** Guarding with `UIAccessibility.isVoiceOverRunning` skips the announcement when VoiceOver is off, avoiding unnecessary work. Comparing old vs new model title and subtitle ensures announcements fire only when the displayed text actually changed — preventing duplicate or spurious announcements. `DispatchQueue.main.asyncAfter(deadline: .now() + 0.5)` gives the UI 0.5 seconds to visually update before VoiceOver reads the new values. Composing the full string ("3 items, Estimated total $25.00") gives users a complete update in a single announcement rather than fragments. Using `.announcement` rather than `.screenChanged` preserves VoiceOver focus on the item the user just selected.

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Count/total announced | Never — model update is VoiceOver-silent | `.announcement` notification delivers composed count + total string |
| Duplicate announcements | N/A | Old vs new model comparison prevents redundant posts |
| Focus disruption | N/A | None — `.announcement` speaks without moving VoiceOver focus |
| Performance | N/A | `UIAccessibility.isVoiceOverRunning` guard skips work when VoiceOver is off |
| Announcement content | N/A | Full composed string ("3 items, Estimated total $25.00") — not just "updated" |

---

## Key Signals (For Pattern Matching)

- `someView.model = updatedModel` inside a `didSet` observer or `applyModel` call with no following `UIAccessibility.post(...)`
- Item count labels, cart totals, basket summaries, or estimated price displays that update on selection change
- `addSelectedItemsView`, `basketSummaryView`, or equivalent summary bar whose text changes silently on toggle
- Missing `UIAccessibility.isVoiceOverRunning` guard before posting — wasteful on non-VoiceOver sessions
- Do NOT use `.screenChanged` — that moves VoiceOver focus away from the item the user just selected

---

## Key Rules

- Guard with `UIAccessibility.isVoiceOverRunning` before posting — avoid unnecessary work when VoiceOver is off
- Compare old vs new model values — only announce when the text actually changed (no duplicate announcements)
- Use `DispatchQueue.main.asyncAfter(deadline: .now() + 0.5)` — 0.5s gives the UI time to update before VoiceOver reads
- Use `.announcement` notification, NOT `.screenChanged` — the latter moves focus, which breaks the user's context
- Compose the full meaningful string ("3 items, Estimated total $25.00") — not just "updated"

---

## Variations

| Var | Ticket | Feature | Pattern | Status |
|---|---|---|---|---|
| Var 1 | CEPG-368075 / commit e905716d2ce8 | BasketBuilder item count + estimated total | `isVoiceOverRunning` guard + old/new diff + `.announcement` with 0.5s delay | Ingested |

---

## Related Templates

- `WA11Y-IOS-4.1.3-001` — iOS: Status messages not announced (filter counts, snackbar, debouncing)
- `WA11Y-IOS-4.1.3-002` — iOS: Error alert not announced after programmatic show
- `WA11Y-IOS-4.1.3-003` — iOS: Snackbar/toast status messages not announced
