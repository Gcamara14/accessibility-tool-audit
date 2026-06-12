# Catalyst Template: Name, Role, Value — `WcpProgressIndicator` Wrong Announcement Order and TalkBack Skip (`onInitializeAccessibilityNodeInfo` Override)

**Template ID:** `WA11Y-AND-4.1.2-030`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-030`
**Source Tickets:** HVCE-14744
**Source PRs:** [walmart-glass #139481](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/pull/139481)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

`WcpProgressIndicator` is a Living Design step-progress component used in multi-step flows (e.g., lens builder: "Lens type, step 2 of 5"). Two separate failures occur:

### Failure 1 — TalkBack skips the progress indicator entirely

The fragment set `importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS` on the `WcpProgressIndicator`:

```kotlin
// ❌ Before fix:
importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS
```

This completely hides the progress indicator and all its children from TalkBack. The step progress (e.g., "step 2 of 5") is silently dropped from the TalkBack traversal.

### Failure 2 — Wrong announcement order (value before label)

`WcpProgressIndicator` has an internal accessibility delegate that announces `valueLabel` before `textLabel`. This produces:

> **"step 2 of 5, progress bar"** — value first, step name last

Expected order (label first, matching visual reading order):

> **"Lens type, step 2 of 5, progress bar"** — step name first, then progress

Root cause: setting `contentDescription` alone on `WcpProgressIndicator` does **not override** the value announced by TalkBack — the component's internal delegate overrides any `contentDescription` you set, placing its own `valueLabel` first.

**Symptom (Jira):** "TalkBack skips progress bar on lens builder", "Step progress not announced by screen reader", "TalkBack says 'step 2 of 5' without step name context", "Progress indicator invisible to TalkBack in vision center flow".

---

## ✅ The Fix Pattern

### `WcpProgressIndicator.setStepProgressAccessibilityDescription()` — dual override

A single extension function that:
1. Sets `importantForAccessibility = YES` (makes the indicator visible to TalkBack)
2. Sets `contentDescription` (fallback for accessibility services that read it directly)
3. Overrides `onInitializeAccessibilityNodeInfo` to win over the Living Design internal delegate

```kotlin
// ViewExt.kt  (vision center extension functions)

/**
 * Sets TalkBack accessibility description on [WcpProgressIndicator] in the correct
 * announcement order: "{stepName}, {progressFormatted}" (e.g. "Lens type, step 2 of 5").
 *
 * [WcpProgressIndicator] has an internal accessibility delegate that ignores
 * [View.contentDescription] and announces [valueLabel] before [textLabel],
 * producing the wrong order:
 *   "step 2 of 5, progress bar"  ← internal delegate wins over contentDescription alone
 *
 * The [onInitializeAccessibilityNodeInfo] override runs after super() and wins,
 * ensuring TalkBack reads the step name first.
 *
 * @param stepName         The label for the current step (e.g. "Lens type").
 * @param progressFormatted The formatted progress text (e.g. "step 2 of 5").
 */
fun WcpProgressIndicator.setStepProgressAccessibilityDescription(
    stepName: String,
    progressFormatted: String
) {
    val accessibilityDescription = string(
        R.string.vision_center_step_progress_ada,
        LENS_STEP_NAME to stepName,
        LENS_PROGRESS_FORMATTED to progressFormatted
    )
    // → "Lens type, step 2 of 5, progress bar"

    // ✅ Set contentDescription as a fallback for services that read it directly
    contentDescription = accessibilityDescription

    // ✅ Override the node info — this runs after the LD internal delegate and wins.
    //    The LD delegate sets valueLabel/textLabel in the wrong order in its super() call;
    //    we overwrite info.contentDescription after super() to enforce correct order.
    onInitializeAccessibilityNodeInfo { _, info ->
        info.contentDescription = accessibilityDescription
    }
}
```

```xml
<!-- do-not-translate-strings.xml -->

<!-- ✅ String now includes {stepName} before {progressFormatted} -->
<string name="vision_center_step_progress_ada" translatable="false">
    {stepName}, {progressFormatted}, progress bar
</string>
<!-- → "Lens type, step 2 of 5, progress bar" -->
```

---

### Call site — `importantForAccessibility = YES` + `setStepProgressAccessibilityDescription`

```kotlin
// LensCustomizationStepFragment.kt / ReviewPrescriptionSelectionFragment.kt

private fun renderProgress(progress: Progress) = with(binding.progress) {
    // ✅ Part 1: Make progress indicator visible to TalkBack (was incorrectly hidden)
    importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_YES

    // ✅ Part 2: Set step name AND progress in correct announcement order
    setStepProgressAccessibilityDescription(
        stepName = progress.stepName,
        progressFormatted = progress.stepProgressFormatted
    )
    // TalkBack: "Lens type, step 2 of 5, progress bar"

    // ... set visual progress indicator values ...
}
```

---

### ❌ Bad Code — hidden and wrong order

```kotlin
// ❌ Before fix:
private fun renderProgress(progress: Progress) = with(binding.progress) {
    // ❌ Hides indicator from TalkBack entirely
    importantForAccessibility = IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS

    // ❌ Sets contentDescription — but LD internal delegate overrides it
    //    Also: only progressFormatted, no stepName
    contentDescription = string(
        R.string.vision_center_step_progress_ada,
        LENS_PROGRESS_FORMATTED to progress.stepProgressFormatted
    )
    // → contentDescription = "step 2 of 5, progress bar"
    // → LD delegate overrides with valueLabel first → TalkBack: "step 2 of 5, progress bar"
    //   (stepName "Lens type" is never announced)
    // → importantForAccessibility=NO_HIDE_DESCENDANTS means TalkBack can't focus it anyway
}
```

---

### Why `onInitializeAccessibilityNodeInfo` override beats `contentDescription`

`WcpProgressIndicator`'s internal Living Design delegate implements `onInitializeAccessibilityNodeInfo()` and sets `info.text` / `info.contentDescription` from its own internal state (`valueLabel`, `textLabel`). The delegate runs before any external override.

Setting `contentDescription` on the view does not prevent the LD delegate from overwriting it in `info.contentDescription` when TalkBack queries the node.

The fix uses the `onInitializeAccessibilityNodeInfo { _, info -> }` extension (a Jetpack-compatible `ViewCompat.setAccessibilityDelegate` wrapper) to register an additional delegate whose override runs **after** the LD internal delegate's `super()` call, giving it the last word:

```
TalkBack queries node info:
  1. LD internal delegate.onInitializeAccessibilityNodeInfo() → info.contentDescription = "step 2 of 5"
  2. Our override.onInitializeAccessibilityNodeInfo() → info.contentDescription = "Lens type, step 2 of 5, progress bar"  ← wins
```

This is the same mechanism used by `WcpSelect.updateAccessibilityNodeInfoText()` (WA11Y-AND-4.1.2-025).

---

### Verified TalkBack announcements

```
// Before fix (NO_HIDE_DESCENDANTS):
TalkBack: (progress indicator skipped — not announced at all)

// Before fix (contentDescription only, no node override):
TalkBack: "step 2 of 5, progress bar"   ← LD delegate wins, stepName missing

// After fix:
TalkBack: "Lens type, step 2 of 5, progress bar"
           ──────────  ──────────────
           stepName    progressFormatted
```

---

## 🔑 Key Rules

- **Never set `IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS` on a `WcpProgressIndicator`** — this hides the entire step-progress indicator from TalkBack. Progress through a multi-step flow is meaningful accessibility information; users need to know "I am on step 2 of 5".
- **`contentDescription` alone does not override a Living Design internal delegate** — any Living Design component that has its own `onInitializeAccessibilityNodeInfo` implementation will overwrite `contentDescription` when TalkBack queries the node. Always pair `contentDescription` with an `onInitializeAccessibilityNodeInfo { }` extension to win the override race.
- **Announce `{stepName}` first, then `{progressFormatted}`** — the step name gives context for the progress ("Lens type: step 2 of 5" is more informative than "step 2 of 5: Lens type"). This matches the visual reading order of the component.
- **Apply to all fragments that render `WcpProgressIndicator`** — if you copy `setStepProgressAccessibilityDescription()` to a new fragment, carry the same `importantForAccessibility = YES` call with it. The two are a required pair.
- **Test announcement order in Robolectric** — `progressIndicator.createAccessibilityNodeInfo().contentDescription` returns the effective node info text. Assert that `stepName` appears before `progressFormatted` in the content description string.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name and value of user interface components must be programmatically determinable. Two failures:
  1. **Value not determinable (hidden):** `IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS` makes the progress indicator's value (current step number, total steps) unprogrammatically determinable — the component is invisible to all AT.
  2. **Name not determinable (wrong order):** Even when visible, announcing "step 2 of 5" without the step name ("Lens type") means the user knows their position in the flow but not which step they are on. The name of the current step is not programmatically determinable from the announcement alone.
