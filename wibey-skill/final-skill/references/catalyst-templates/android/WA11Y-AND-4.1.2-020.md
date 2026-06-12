# Catalyst Template: Name — Redundant Role / Affordance Appended to `contentDescription` ("Button", "Double-tap to activate")

**Template ID:** `WA11Y-AND-4.1.2-020`
**Platform:** Android
**WCAG Criterion:** 4.1.2 Name, Role, Value
**Jira Label:** `WA11Y-AND-4.1.2-020`
**Source Tickets:** CEPG-0000
**Source PRs:** [walmart-glass commit 376ea847](https://gecgithub01.walmart.com/Walmart-Android/walmart-glass/commit/376ea84703d6d3a010d9dc640b475919a2ef1d2e)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

A button's `contentDescription` is built by appending the role or affordance text to the accessible name:

```kotlin
contentDescription = "collapsed" + string(R.string.gic_button_ada)
// gic_button_ada = "Button. Double-tap to activate"
// → contentDescription = "collapsed Button. Double-tap to activate"
```

TalkBack then announces: **"collapsed Button. Double-tap to activate, Button"**

The role ("Button") and affordance ("Double-tap to activate") are announced **twice**:
1. Once from the hardcoded string appended to `contentDescription`
2. Once by TalkBack from the view's actual class/role

**Additional failures:**
- The phrase "Double-tap to activate" in a `contentDescription` is flagged by Android's Accessibility Testing Framework (ATF) as a `RedundantDescriptionCheck` violation — it explicitly states an interaction method that TalkBack already announces.
- Device-specific TalkBack configurations may use different activation gestures. Hardcoding "Double-tap to activate" breaks for Switch Access, Voice Access, and keyboard users.

**Symptom (Jira):** "TalkBack says 'Button' twice on the GIC chevron", "Screen reader announces 'Double-tap to activate' inside the label — it's doubled", "ATF flags RedundantDescriptionCheck on GIC button", "Button role is read twice by TalkBack".

---

## ✅ The Fix Pattern

### Remove the role/affordance suffix from `contentDescription`

**❌ Bad Code:**
```kotlin
// Appending role and affordance directly to the accessible name.
// TalkBack reads it verbatim AND then appends the real role again:
// "collapsed Button. Double-tap to activate, Button"
fun setCollapsedAccessibility() {
    globalIntentCenterCollapsedChevron.contentDescription =
        string(R.string.gic_collapsed_ada) + string(R.string.gic_button_ada)
    //  ↑ "collapsed"                         ↑ " Button. Double-tap to activate"
}
```

**✅ Good Code:**
```kotlin
// ✅ contentDescription contains ONLY the accessible name — never the role.
// TalkBack appends the role ("Button") and affordance ("Double-tap to activate")
// automatically from the view's class and clickability.
fun setCollapsedAccessibility() {
    globalIntentCenterCollapsedChevron.contentDescription =
        string(R.string.gic_collapsed_ada)
    //  ↑ "collapsed" — TalkBack announces: "collapsed, Button"
}
```

**Delete the now-dead string resource:**
```xml
<!-- ❌ Delete this — never concatenate role/affordance into contentDescription -->
<!-- <string name="gic_button_ada"> Button. Double-tap to activate</string> -->
```

---

### Verified announcement before and after fix

```kotlin
// Before fix — TalkBack announces (from ATF test):
// "collapsed Button. Double-tap to activate, Button"

// After fix — TalkBack announces:
// "collapsed, Button"

// Test assertion:
assertThat(globalIntentCenterCollapsedChevron.contentDescription)
    .isEqualTo("collapsed")
// Previously: .isEqualTo("collapsed Button. Double-tap to activate")
```

---

### Full list of strings that must NOT appear in `contentDescription`

These are TalkBack-managed announcements. Any of them in a `contentDescription` string will be announced twice (or conflict with TalkBack's actual behaviour on different input methods):

| String to remove | Why TalkBack already handles it |
|---|---|
| `"Button"` | Announced from `AccessibilityNodeInfo.className = "android.widget.Button"` |
| `"Switch"` | Announced from switch widget class |
| `"Checkbox"` | Announced from checkbox widget class |
| `"Double-tap to activate"` | Announced by TalkBack for any clickable view |
| `"Double-tap to toggle"` | Announced by TalkBack for toggleable views |
| `"Swipe up for more options"` | TalkBack action menu affordance |
| `"Tap to activate"` | Variant of the double-tap phrase |
| `"Selected"` / `"Not selected"` | Announced from `AccessibilityNodeInfo.isSelected` / `isChecked` |
| `"Disabled"` | Announced from `AccessibilityNodeInfo.isEnabled = false` |

---

### ATF lint rule — `RedundantDescriptionCheck`

Android's Accessibility Testing Framework flags this automatically:

```kotlin
// ATF RedundantDescriptionCheck fires on:
// - contentDescription containing widget type names (Button, Switch, Checkbox, etc.)
// - contentDescription containing interaction phrases (Double-tap to activate, etc.)

// Run ATF checks in Espresso tests:
AccessibilityChecks.enable()
// or in your accessibility audit:
AccessibilityValidator.check(view)
```

If your CI pipeline runs ATF, a `RedundantDescriptionCheck` failure on a button means its `contentDescription` contains one of the forbidden strings above.

---

## 🔑 Key Rules

- **`contentDescription` contains only the accessible NAME — never role, state, or affordance** — the name is "what is this?" Role is "what kind of thing is it?" State is "is it checked/selected/disabled?" Affordance is "how do I use it?". TalkBack supplies role, state, and affordance automatically. You supply only the name.
- **Never concatenate string resources that contain role/affordance text** — even indirect concatenation (`string(R.string.generic_button_suffix)`) is wrong if that resource contains "Button" or "Double-tap to activate".
- **Delete dead string resources after removal** — `gic_button_ada` and similar strings serve no purpose once the concatenation is removed. Leaving them creates a false impression that they are still in use.
- **ATF's `RedundantDescriptionCheck` is a blocking lint rule** — treat any ATF failure on `RedundantDescriptionCheck` as a must-fix, not a warning. The double announcement causes real confusion.
- **"Double-tap to activate" is the most common offender** — search the codebase for this phrase (and its variants) in `strings.xml` and Kotlin files: `grep -r "double-tap\|double tap\|Double-tap\|Double tap" --include="*.xml" --include="*.kt"`.

---

## ⚠️ WCAG Failure Without This Fix

- **4.1.2 (Name, Role, Value):** The name, role, and value of user interface components must be programmatically determinable. Appending the role ("Button") or affordance ("Double-tap to activate") to the accessible name corrupts the name — TalkBack announces it verbatim as part of the label, then repeats the role from the node's class. The resulting announcement is both redundant and misleading: users hear "Button" as part of the name text, then hear it again as the role. This misrepresents the structure of the component's accessibility information.
