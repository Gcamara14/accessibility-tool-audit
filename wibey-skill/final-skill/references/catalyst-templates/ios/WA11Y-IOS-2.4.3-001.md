# Catalyst Template: Focus Management After Dynamic Collection View Updates

**Template ID:** `WA11Y-IOS-2.4.3-001`
**Platform:** iOS (UIKit)
**WCAG Criterion:** 2.4.3 Focus Order
**Component:** `WCPImageUploader` (WCP Design Components)
**Source PR:** [#155389](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/155389) | [COMM-1808](https://jira.walmart.com/browse/COMM-1808) | File: `WCPImageUploader.swift`
**Merged:** 2026-03-25

---

## The Problem

When a user adds or removes a photo in `WCPImageUploader`, the entire `UICollectionView` is reloaded via `reloadData()`. This destroys VoiceOver's internal focus tracking, causing focus to jump to the top of the screen. Users who rely on VoiceOver lose their place in the UI after every image operation.

**Root cause:** `reloadData()` tears down and recreates all cells, so VoiceOver has no surviving element to anchor focus on. This violates WCAG 2.4.3 because the focus order becomes unpredictable after a user-initiated action.

---

## The Fix Pattern

Replace `reloadData()` with `performBatchUpdates()` for incremental insert/delete/reload operations, then explicitly post a `UIAccessibility.layoutChanged` notification targeting the correct cell.

### Architecture

1. **State-machine transition logic** — Capture state before and after the mutation, then use a `switch (previousState, state)` to determine the correct collection view operation (insert, delete, or reload).
2. **Incremental batch updates** — `performBatchUpdates()` preserves cells that didn't change, so VoiceOver retains focus context.
3. **Explicit accessibility focus** — In the `completion` block, post `.layoutChanged` with the target cell as the `argument`.
4. **Testable abstraction** — Extract the `UIAccessibility.post` call behind an `AccessibilityFocusPosting` protocol so tests can verify focus behavior without a live accessibility runtime.

---

## Fix Patterns

### Pattern A: Real Diff — `WCPImageUploader.swift` (COMM-1808 / PR #155389)

**Bad Code:**
```swift
// ❌ reloadData() / reloadThumbnails() resets the entire collection view data source.
// VoiceOver's internal element cache is invalidated and focus jumps to the top of the screen.
public func addImage(imageModel: WCPImageUploader.ImageModel) {
    uploadedImages.append(imageModel)
    updateCollectionViewState()
    reloadThumbnails()  // ❌ global reload — destroys VoiceOver focus
}
```

**Good Code:**
```swift
// AccessibilityFocusPosting — testable protocol so unit tests can assert correct focus index
protocol AccessibilityFocusPosting {
    func postLayoutChanged(focusingCellAt indexPath: IndexPath, in collectionView: UICollectionView)
}

private struct DefaultAccessibilityFocusPoster: AccessibilityFocusPosting {
    func postLayoutChanged(focusingCellAt indexPath: IndexPath, in collectionView: UICollectionView) {
        UIAccessibility.post(
            notification: .layoutChanged,
            argument: collectionView.cellForItem(at: indexPath)
        )
    }
}

final class WCPImageUploader: BaseView {
    private var accessibilityFocusPoster: AccessibilityFocusPosting = DefaultAccessibilityFocusPoster()

    // ✅ addImage: performBatchUpdates + targeted focus to newly added cell
    public func addImage(imageModel: WCPImageUploader.ImageModel) {
        let previousState = state
        uploadedImages.append(imageModel)
        updateCollectionViewState()
        let newImageIndex = IndexPath(item: uploadedImages.count - 1, section: 0)

        collectionView.performBatchUpdates({
            switch (previousState, state) {
            case (.empty, .add), (.add, .add):
                collectionView.insertItems(at: [newImageIndex])
            case (.empty, .limitReached), (.add, .limitReached):
                collectionView.reloadItems(at: [newImageIndex])
            default:
                break
            }
        }, completion: { [weak self] _ in
            guard let self else { return }
            didFinishAddingImage(at: newImageIndex)
        })
    }

    // ✅ removeImage: performBatchUpdates + smart focus clamping to nearest remaining cell
    private func removeImage(at index: Int) {
        let previousState = state
        uploadedImages.remove(at: index)
        let removedIndexPath = IndexPath(item: index, section: 0)

        collectionView.performBatchUpdates({
            switch (previousState, state) {
            case (.add, .add), (.add, .empty):
                collectionView.deleteItems(at: [removedIndexPath])
            case (.limitReached, .add):
                collectionView.deleteItems(at: [removedIndexPath])
                collectionView.insertItems(at: [IndexPath(item: uploadedImages.count, section: 0)])
            case (.limitReached, .empty):
                collectionView.reloadItems(at: [removedIndexPath])
            default:
                break
            }
        }, completion: { [weak self] _ in
            guard let self else { return }
            didFinishRemovingImage(at: index)
        })
    }

    // ✅ After add: focus the newly inserted thumbnail cell
    private func didFinishAddingImage(at indexPath: IndexPath) {
        updateCollectionViewHeight()
        accessibilityFocusPoster.postLayoutChanged(focusingCellAt: indexPath, in: collectionView)
    }

    // ✅ After remove: focus nearest remaining thumbnail, or add-photo button if list is empty
    private func didFinishRemovingImage(at removedIndex: Int) {
        updateCollectionViewHeight()
        let focusIndex: IndexPath
        if uploadedImages.isEmpty {
            focusIndex = IndexPath(item: 0, section: 0)
        } else {
            let clampedItem = min(removedIndex, uploadedImages.count - 1)
            focusIndex = IndexPath(item: clampedItem, section: 0)
        }
        accessibilityFocusPoster.postLayoutChanged(focusingCellAt: focusIndex, in: collectionView)
    }
}
```

### Pattern B: Demo Page — Dismiss Picker Before Mutating Collection View

```swift
// ❌ Bad: Race condition — addImage fires while picker dismissal animates
imageUploader.addImage(imageModel: selectedImageModel)
picker.dismiss(animated: true, completion: nil)

// ✅ Good: Wait for dismissal to complete before triggering batch updates
picker.dismiss(animated: true) { [weak self] in
    self?.imageUploader.addImage(imageModel: selectedImageModel)
}
```

---

## Why This Works

| Aspect | Before | After |
|---|---|---|
| Collection update | `reloadThumbnails()` / `reloadData()` — destroys all cells | `performBatchUpdates()` — incremental, cells outside the mutation are preserved |
| State transition logic | No state machine; always reloads everything | `switch (previousState, state)` selects insert, delete, or reload per transition |
| VoiceOver focus after add | Jumps to screen top | `completion` block posts `.layoutChanged` targeting the newly inserted thumbnail cell |
| VoiceOver focus after remove | Jumps to screen top | Focus clamped to `min(removedIndex, uploadedImages.count - 1)`; falls back to add-photo button when list is empty |
| Testability | No way to verify focus target | `AccessibilityFocusPosting` protocol + `DefaultAccessibilityFocusPoster` enables spy-based unit test assertions without a live accessibility runtime |

---

## Key Signals (For Pattern Matching)

Use this template when you see ANY of these in an iOS codebase:
- `reloadData()` called after inserting/removing items in a `UICollectionView` or `UITableView`
- VoiceOver focus "jumps to top" or "resets" after a user action
- `UIAccessibility.post(notification: .layoutChanged, argument: nil)` — posting with `nil` argument (should target a specific element)
- Missing `performBatchUpdates()` where incremental changes are possible
- Image uploaders, photo pickers, cart item lists, or any dynamic list with add/remove

---

## Variations

| Var | Description | Status |
|---|---|---|
| Var 1 (this PR) | `WCPImageUploader` — collection view add/remove with state machine | Ingested |

---

## Related Templates

- `WA11Y-WEB-2.4.3-001` — Web: Focus management after modal/panel triggers
- `WA11Y-WEB-2.4.3-004` — Web: Post-state-change focus with `useRef` + `useEffect`
- `WA11Y-IOS-1.1.1-001` — iOS: Missing alt text (accessibilityLabel)
