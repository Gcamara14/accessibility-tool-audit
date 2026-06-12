# Catalyst Template: Focus Order: Dialog — Incorrect Traversal Inside & After a Bottom Sheet

**Template ID:** `WA11Y-AND-2.4.3-001`
**Platform:** Android
**WCAG Criterion:** 2.4.3 Focus Order
**Jira Label:** `WA11Y-AND-2.4.3-001`
**Source Tickets:** HVCE-14750, CEPG-371074
**Source PRs:**
- [walmart-glass (HVCE-14750)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/) — Restore TalkBack focus after dialog dismissed
- [walmart-glass (CEPG-371074)](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/) — Force Close button to be first TalkBack stop in bottom sheet
**Date Ingested:** 2026-04-30

---

## 🛑 The Problem

Bottom sheets / dialogs create two distinct focus order failures:

**Failure A — Wrong traversal order inside the sheet:**
When a bottom sheet appears, TalkBack may announce Tempo-rendered content *before* the Close (X) button, even though the X button is visually at the top. Users navigating left-to-right by swipe are disoriented.

**Failure B — Focus not restored after the sheet is dismissed:**
When the bottom sheet is dismissed, Android's accessibility framework has no memory of which view held TalkBack focus before the dialog appeared. TalkBack resets to the first accessible element in the hierarchy (typically the back button at the top of the screen), disorienting users on the underlying screen.

---

## ✅ Fix Pattern A: Force Traversal Order Inside a Bottom Sheet

Use `android:accessibilityTraversalBefore` in the bottom sheet XML to force the Close button to be announced before any dynamic Tempo-rendered content.

**❌ Bad Code (XML):**
```xml
<!-- Close button has no traversal order declared — Tempo content may be read first -->
<ImageButton
    android:id="@+id/close_button"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:contentDescription="@string/close" />

<FrameLayout
    android:id="@+id/content_layout_view"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" />
```

**✅ Good Code (XML):**
```xml
<!-- Force TalkBack to reach the Close button BEFORE the content layout -->
<ImageButton
    android:id="@+id/close_button"
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:contentDescription="@string/close"
    android:accessibilityTraversalBefore="@id/content_layout_view" />

<FrameLayout
    android:id="@+id/content_layout_view"
    android:layout_width="match_parent"
    android:layout_height="wrap_content" />
```

---

## ✅ Fix Pattern B: Restore TalkBack Focus After Bottom Sheet Dismissed

**Step 1 — Add a `findAccessibilityFocus()` extension (place in `ViewExt.kt`):**
```kotlin
import android.view.ViewGroup

/** Walk the view tree to find the view currently holding TalkBack (accessibility) focus. */
fun View.findAccessibilityFocus(): View? {
    if (isAccessibilityFocused) return this
    if (this is ViewGroup) {
        for (i in 0 until childCount) {
            getChildAt(i).findAccessibilityFocus()?.let { return it }
        }
    }
    return null
}
```

**Step 2 — Capture focused view before navigation, restore it on dismiss:**
```kotlin
import android.view.accessibility.AccessibilityNodeInfo
import androidx.navigation.NavController

class CommonOrderDashboardFragment : Fragment() {

    private var lastFocusedView: View? = null
    private var destinationChangedListener: NavController.OnDestinationChangedListener? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        observeNavigationDestinationChange(view)
        observeFragmentResult()
    }

    // Step 2a: Capture the focused view just before the bottom sheet slides in.
    private fun observeNavigationDestinationChange(view: View) {
        val navController = getStateNavHostFragment()?.navController
        destinationChangedListener = NavController.OnDestinationChangedListener { _, destination, _ ->
            if (destination.id == R.id.session_handler_bottom_sheet) {
                lastFocusedView = view.findAccessibilityFocus()
            }
        }
        navController?.addOnDestinationChangedListener(destinationChangedListener!!)
    }

    // Step 2b: Listen for dismiss result and restore focus.
    private fun observeFragmentResult() {
        parentFragmentManager.setFragmentResultListener(
            SessionHandlerBottomSheetFragment.TAG,
            viewLifecycleOwner
        ) { _, _ ->
            lastFocusedView?.performAccessibilityAction(
                AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS,
                null
            )
            lastFocusedView = null
        }
    }

    // Step 2c: Always clean up to avoid memory leaks.
    private fun removeDestinationChangedListener() {
        destinationChangedListener?.let {
            getStateNavHostFragment()?.navController?.removeOnDestinationChangedListener(it)
        }
        destinationChangedListener = null
        lastFocusedView = null
    }

    override fun onDestroyView() {
        removeDestinationChangedListener()
        super.onDestroyView()
    }
}
```

**Step 3 — Bottom sheet signals its own dismissal via Fragment Result API:**
```kotlin
class SessionHandlerBottomSheetFragment : BottomSheetDialogFragment() {
    override fun onDismiss(dialog: DialogInterface) {
        super.onDismiss(dialog)
        parentFragmentManager.setFragmentResult(TAG, Bundle.EMPTY)
    }

    companion object {
        const val TAG = "SessionHandlerBottomSheetFragment"
    }
}
```

---

## 🔑 Key Rules

- **Always declare `accessibilityTraversalBefore`** on Close/Dismiss buttons in bottom sheets to prevent Tempo-rendered content from being announced first.
- **Never assume TalkBack restores focus automatically** after any dialog/sheet is dismissed — the Android framework does not do this.
- The `findAccessibilityFocus()` tree walk must be triggered **before** navigation, while the underlying screen is still rendered.
- Clean up `OnDestinationChangedListener` in `onDestroyView()` to prevent memory leaks.
- Use the **Fragment Result API** (not callbacks or global state) to communicate dismissal — this integrates cleanly with the Fragment lifecycle.

---

## ⚠️ WCAG Failure Without This Fix

- **2.4.3 (Focus Order):** If the sequence of TalkBack focus does not preserve meaning and operability — either inside the dialog (Close button read last) or after dismiss (focus jumps to top of screen) — the criterion fails.
