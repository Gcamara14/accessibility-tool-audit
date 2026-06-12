# Catalyst Template: Focus Order — TalkBack Focus Lost After RecyclerView `submitList` (DiffUtil Commit Callback)

**Template ID:** `WA11Y-AND-2.4.3-005`
**Platform:** Android
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-AND-2.4.3-005`
**Source Tickets:** CELISTS-30816
**Source PRs:** [walmart-glass #130250](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/130250)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A `RecyclerView` displays a list of address options, each with a radio button. When the user selects a radio button, the ViewModel updates the selection state, which triggers an observer that calls `adapter.setData(newList)` → `asyncListDiffer.submitList(newList)`.

`submitList` runs DiffUtil asynchronously. By the time DiffUtil finishes diffing and commits the list update (recycling / rebinding ViewHolders), the previously focused radio button's `ViewHolder` may have been recycled. TalkBack focus is lost — it snaps to the top of the screen or disappears entirely.

> **TalkBack announces nothing after the radio button is selected.** Focus jumps away from the selected item.

The user selected a radio button but TalkBack does not confirm the selection or stay on the selected item. They cannot tell whether the selection was registered.

**Symptom (Jira):** "TalkBack focus lost after selecting address radio button", "Screen reader jumps to top when radio is activated", "Focus doesn't remain on selected radio option", "RecyclerView DiffUtil loses TalkBack focus after selection".

---

## ✅ The Fix Pattern

### Store the selected ID, pass a `commitCallback` to `submitList`, request focus after commit

Three-part fix:

1. **Store the ID of the selected address** before calling `setData` — captured in `onAddressChecked` before any async work starts
2. **Thread the callback through the adapter's `setData` call** — `AsyncListDiffer.submitList(list) { callback }` fires `callback` on the main thread after DiffUtil commits the update
3. **In the callback, find the ViewHolder and call `requestAccessibilityFocusWithDelay()`** — wrapped in `recyclerView.post {}` to ensure the ViewHolder is laid out before requesting focus

**❌ Bad Code:**

```kotlin
// Adapter — submitList has no callback
class CreateRegistrySuggestedAddressAdapter(...) {
    private val asyncListDiffer = AsyncListDiffer(this, diffUtil)

    fun setData(dataResponse: List<SuggestedAddressRowModel>) {
        asyncListDiffer.submitList(dataResponse)
        // ← No commitCallback → DiffUtil completes asynchronously, focus is lost
    }
}

// Fragment — no ID stored, no focus restoration
viewModel.addressList.observe(viewLifecycleOwner) {
    adapter.setData(it)
    // ← After list update, TalkBack focus snaps away
}
```

---

**✅ Good Code (Adapter):**

```kotlin
class CreateRegistrySuggestedAddressAdapter(
    onAddressChecked: (SuggestedAddressRowModel) -> Unit,
    diffUtil: DiffUtil.ItemCallback<SuggestedAddressRowModel>
) : RecyclerView.Adapter<...>() {

    private val asyncListDiffer = AsyncListDiffer(this, diffUtil)

    // ✅ Expose current list so the fragment can find the position to focus
    val currentList: List<SuggestedAddressRowModel>
        get() = asyncListDiffer.currentList

    // ✅ Accept an optional commitCallback — fired by DiffUtil after list is committed
    fun setData(
        dataResponse: List<SuggestedAddressRowModel>,
        commitCallback: (() -> Unit)? = null
    ) {
        asyncListDiffer.submitList(dataResponse) {
            commitCallback?.invoke()
        }
    }
}
```

**✅ Good Code (Fragment):**

```kotlin
class RegistryRedeemBabyBoxSelectAddressFragment : BaseFragment(TAG) {

    // ✅ Track which address the user most recently selected
    internal var addressSelectedId: String? = null

    val adapter = CreateRegistrySuggestedAddressAdapter(
        onAddressChecked = { address ->
            // ✅ Capture the ID here, before submitList runs
            addressSelectedId = address.id
            viewModel.selectedAddress = address
            viewModel.updateRadioForAddress()
        },
        ...
    )

    private fun setUpObservers() {
        lifecycleScopeSafe.launch {
            viewModel.addressList.observe(viewLifecycleOwner) {
                // ✅ Build the commitCallback only when there is an ID to focus on
                val commitCallback: (() -> Unit)? = addressSelectedId?.let { id ->
                    {
                        requestAccessibilityFocusOnSelectedAddress(id)
                        // ✅ Clear after use so the next ViewModel update
                        //    (e.g., adding a new address) doesn't steal focus
                        addressSelectedId = null
                    }
                }
                adapter.setData(dataResponse = it, commitCallback = commitCallback)
                binding.addressesLoadingSpinner.isVisible = false
            }
        }
    }

    private fun requestAccessibilityFocusOnSelectedAddress(addressId: String) {
        // ✅ post() ensures the ViewHolder is laid out after the DiffUtil commit
        binding.prefferedAddressRecyclerView.post {
            val position = adapter.currentList.indexOfFirst { it.id == addressId }
            if (position != -1) {
                binding.prefferedAddressRecyclerView
                    .findViewHolderForAdapterPosition(position)
                    ?.itemView
                    ?.requestAccessibilityFocusWithDelay()
                    // → moves TalkBack focus to the selected radio button row
            }
        }
    }
}
```

---

### `requestAccessibilityFocusWithDelay()` extension

```kotlin
// AccessibilityUtils.kt (Registry)
fun View.requestAccessibilityFocusWithDelay(delayMs: Long = 100L) {
    postDelayed({
        if (isAttachedToWindow) {
            performAccessibilityAction(
                AccessibilityNodeInfoCompat.ACTION_ACCESSIBILITY_FOCUS,
                null
            )
        }
    }, delayMs)
}
```

The `delayMs` guard allows any `notifyItemChanged` animations to settle before focus is requested. Without it, TalkBack may snap to the item but immediately lose focus if the animation is still running.

---

### Why `commitCallback` — not a live region or focus listener

- **Live regions** fire on content changes, but the recycled ViewHolder's view object changes during DiffUtil commit. Assigning an assertive live region to a view that is recycled produces announcements for the wrong item.
- **`onScrolled` / `onChildAttachStateChangeListener`** fires for every scroll and attach event — hard to scope to a single user-initiated selection.
- **`commitCallback`** is the canonical AsyncListDiffer callback, guaranteed to fire exactly once after DiffUtil finishes updating the adapter. It runs on the main thread. No polling, no estimating when DiffUtil finishes.

---

## 🔑 Key Rules

- **Capture `addressSelectedId` in `onAddressChecked` before calling `setData`** — the ID must be stored synchronously at the moment of user interaction, not derived from the ViewModel state (which may have already changed by the time the callback fires).
- **Clear `addressSelectedId = null` inside the callback after use** — if the ViewModel emits a second list update (e.g., loading state, pagination) before the user selects another address, the stale ID must not drive focus to the wrong row.
- **`recyclerView.post { }` wraps `findViewHolderForAdapterPosition`** — the `commitCallback` fires after DiffUtil commits the diff but potentially before the RecyclerView has finished laying out the affected ViewHolders. The `post { }` defers until the next layout pass.
- **`isAttachedToWindow` guard in `requestAccessibilityFocusWithDelay`** — the `postDelayed` lambda must not fire on a detached view (fragment navigated away during the delay). The guard prevents a `PerformAccessibilityAction` crash.
- **Only build the callback when `addressSelectedId` is non-null** — non-selection-triggered list updates (initial load, pull-to-refresh, error recovery) must NOT generate a focus-restoration callback. The `?.let { id -> { ... } }` idiom ensures this.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operation. When a TalkBack user selects a radio button and DiffUtil asynchronously commits the list update, focus snapping away from the selected item breaks the expected focus sequence: the user activated a control and focus should remain on (or return to) that control. Jumping to the top of the screen or to an unrelated element after selection disorients users relying entirely on the sequential accessibility focus order to understand the page state.
