# Accessibility Audit Report — page1.html (v2)

**File:** `broken-pages-for-testing/page1.html`  
**Date:** 2026-06-15  
**Method:** Parallel specialist dispatch (9 specialists via `accessibility-lead.md` pattern)  
**Model:** gemini-3.1-pro (all specialists)

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 11 |
| Serious  | 29 |
| Moderate | 12 |
| Minor    | 5 |
| **Total** | **57** |

All findings are **high confidence** (verified against source lines).

---

## Critical Findings

### C1. Meta http-equiv="refresh" forces automatic page reload
- **Specialist:** Live Region Controller, Alt Text & Headings
- **WCAG:** 2.2.1 Timing Adjustable (Level A)
- **Location:** page1.html:4
- **Impact:** Page reloads every 5 minutes without warning, resetting screen reader position and causing complete loss of context.

```html
<meta http-equiv="refresh" content="300">
```

**Remediation:** Remove meta refresh. Implement a manual refresh button or a user-disablable auto-refresh toggle.

---

### C2. Shift Help Modal lacks dialog semantics and focus management
- **Specialist:** Modal Specialist
- **WCAG:** 4.1.2 Name, Role, Value (Level A), 2.1.1 Keyboard (Level A)
- **Location:** page1.html:996
- **Impact:** Screen readers don't recognize the overlay as a dialog; keyboard users lose their place.

```html
<div id="shift-help-modal" style="display: none; position: fixed; ...">
```

**Remediation:** Add `role="dialog" aria-modal="true" aria-labelledby="shift-help-title"`. Implement focus trap, Escape handling, and focus return.

---

### C3. Attendance Modal Overlay lacks dialog role and keyboard handling
- **Specialist:** Modal Specialist
- **WCAG:** 4.1.2 Name, Role, Value (Level A), 2.4.3 Focus Order (Level A)
- **Location:** page1.html:1709
- **Impact:** AT users can interact with background content; no Escape key closes the modal.

```html
<div id="attendance-modal-overlay" onclick="hideAttendanceModal()" style="display: none; position: fixed; ...">
```

**Remediation:** Add `role="dialog" aria-modal="true" aria-labelledby="modal-title"`. Add keydown handler for Escape, focus trap, focus return to trigger.

---

### C4. Feedback Overlay lacks modal semantics
- **Specialist:** Modal Specialist
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Location:** page1.html:6998 (overlay at class `fb-overlay`)
- **Impact:** Screen reader users hear background content instead of being constrained to the feedback form.

**Remediation:** Add `role="dialog" aria-modal="true" aria-labelledby="fb-modal-heading"`. Convert `.fb-title` to `<h2>`.

---

### C5. Survey Overlay missing dialog roles and focus trapping
- **Specialist:** Modal Specialist
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Location:** page1.html:7431
- **Impact:** Keyboard users tab out of the multi-step survey into the disabled background page.

**Remediation:** Add `role="dialog" aria-modal="true" aria-labelledby="survey-heading"` to `#survey-overlay`. Add `aria-haspopup="dialog"` to `#survey-fab`.

---

### C6. Display Picker Modal lacks dialog roles
- **Specialist:** Modal Specialist
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Location:** page1.html:8370
- **Impact:** Keyboard users cannot locate/operate display checkboxes when focus remains on background.

**Remediation:** Add `role="dialog" aria-modal="true" aria-labelledby="display-modal-title"`.

---

### C7. V2 Modals (EOD, SOS, Quarterly, Attendance, Settings) all lack dialog semantics
- **Specialist:** Modal Specialist
- **WCAG:** 4.1.2 Name, Role, Value (Level A), 2.1.1 Keyboard (Level A)
- **Location:** page1.html:6628, 6661, 6760, 6864, 6952
- **Impact:** None of the V2 modals convey dialog boundaries, trap focus, or handle Escape.

**Remediation:** Add `role="dialog" aria-modal="true" aria-labelledby` to each. Implement shared focus-trap and Escape-close utilities.

---

### C8. Interactive table rows lack keyboard access
- **Specialist:** Tables Specialist
- **WCAG:** 2.1.1 Keyboard (Level A)
- **Location:** page1.html:1271, 1376, 1481
- **Impact:** Keyboard-only users cannot expand/collapse department details — `<tr onclick>` has no focusable control.

```html
<tr class="dept-summary-row" onclick="toggleDeptDetails('inbound')" style="cursor: pointer;">
```

**Remediation:** Place a `<button>` inside the first `<td>` with `aria-expanded` and `aria-controls`.

---

### C9. Non-interactive `<div>` used as toggle button for header
- **Specialist:** ARIA Specialist, Keyboard Navigator
- **WCAG:** 4.1.2 Name, Role, Value (Level A), 2.1.1 Keyboard (Level A)
- **Location:** page1.html:860
- **Impact:** Keyboard users cannot activate the header toggle; screen readers don't announce it as interactive.

```html
<div class="hdr-collapsed-info" onclick="toggleHeader()">
```

**Remediation:** Convert to `<button>` or add `role="button" tabindex="0"` with keydown handler.

---

### C10. Collapsible attendance section header is a non-focusable div
- **Specialist:** ARIA Specialist
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Location:** page1.html:1218
- **Impact:** Screen reader users cannot focus or activate the attendance collapse toggle, and expansion state is not communicated.

**Remediation:** Add `role="button" tabindex="0" aria-expanded="false"` and update `aria-expanded` in JS.

---

### C11. Progress bars missing role="progressbar" and ARIA value attributes
- **Specialist:** ARIA Specialist
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Location:** page1.html:2387
- **Impact:** Screen readers cannot identify the element as a progress indicator or convey its value.

**Remediation:** Add `role="progressbar" aria-valuenow="97" aria-valuemin="0" aria-valuemax="100"`.

---

## Serious Findings

### S1. VTO number inputs have no programmatic label
- **Specialist:** Forms Specialist
- **WCAG:** 1.3.1 Info and Relationships (Level A), 3.3.2 Labels (Level A)
- **Location:** page1.html:1350, 1455, 1560
- **Impact:** Screen reader users don't know what the number inputs are for.

**Remediation:** Add `<label for="inbound-vto-actual" class="sr-only">Inbound VTO Hours Actual</label>`.

---

### S2. Feedback form textareas lack programmatic labels
- **Specialist:** Forms Specialist
- **WCAG:** 1.3.1, 3.3.2 (Level A)
- **Location:** page1.html:7035, 7042
- **Impact:** Screen readers don't announce the question prompts when focusing textareas.

**Remediation:** Convert `.fb-label` divs to `<label for="...">` elements.

---

### S3. Survey star rating widget lacks radiogroup semantics
- **Specialist:** Forms Specialist
- **WCAG:** 1.3.1, 4.1.2 (Level A)
- **Location:** page1.html:7450
- **Impact:** Screen readers announce separate buttons with no grouping context.

**Remediation:** Add `role="radiogroup" aria-labelledby="q1-label"` to container; use `role="radio" aria-checked` on each star button.

---

### S4. Survey option buttons lack ARIA roles and grouping
- **Specialist:** Forms Specialist
- **WCAG:** 1.3.1, 4.1.2 (Level A)
- **Location:** page1.html:7468
- **Impact:** AT users don't understand options belong to a single question or which is selected.

**Remediation:** Wrap in `role="radiogroup" aria-labelledby` and set `role="radio" aria-checked` on each option.

---

### S5. Survey "Top Request" textarea lacks label
- **Specialist:** Forms Specialist
- **WCAG:** 1.3.1, 3.3.2 (Level A)
- **Location:** page1.html:7526
- **Impact:** Screen readers can't announce the prompt question.

**Remediation:** Convert question div to `<label for="sv-top-request">`.

---

### S6. Select elements in quarterly modal lack labels
- **Specialist:** Forms Specialist
- **WCAG:** 1.3.1, 3.3.2, 4.1.2 (Level A)
- **Location:** page1.html:5261, 5271
- **Impact:** Screen readers announce dropdowns without any purpose context.

**Remediation:** Add `<label for="qtr-loss-reason-..." class="sr-only">Loss Reason</label>`.

---

### S7. EOD/SOS modal commentary textareas lack labels
- **Specialist:** Forms Specialist
- **WCAG:** 1.3.1, 3.3.2 (Level A)
- **Location:** page1.html:6808
- **Impact:** Placeholder disappears on input; screen reader loses context.

**Remediation:** Add visually hidden `<label>` and `aria-required="true"`.

---

### S8. Links used as buttons (href="#" with onclick)
- **Specialist:** Link Checker
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Location:** page1.html:1357, 1462, 1567
- **Impact:** Announced as links but behave as buttons; repeated identical "0 associates" text.

**Remediation:** Convert to `<button>` with descriptive `aria-label` (e.g., "0 inbound associates no-shows").

---

### S9. External links open in new tab without warning
- **Specialist:** Link Checker
- **WCAG:** 2.4.4 Link Purpose (Level A)
- **Location:** page1.html:1023, 1026
- **Impact:** Users are disoriented when new tab opens unexpectedly.

**Remediation:** Add `<span class="sr-only">(opens in new tab)</span>` inside each link.

---

### S10. Toggle buttons missing aria-pressed
- **Specialist:** ARIA Specialist
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Location:** page1.html:1237 (`#arrival-toggle-btn`)
- **Impact:** Screen readers don't convey active/inactive visual state.

**Remediation:** Add `aria-pressed="true|false"` and update dynamically.

---

### S11. SVG speedometer gauges lack accessible names
- **Specialist:** ARIA Specialist, Alt Text & Headings
- **WCAG:** 1.1.1 Non-text Content (Level A)
- **Location:** page1.html:2484, 2509, 2680, 2705
- **Impact:** Screen readers are completely unaware of gauge data.

**Remediation:** Add `role="img" aria-label="Projected UPH: 100.5 (109% of target)"`.

---

### S12. SVG donut chart lacks accessible name
- **Specialist:** Alt Text & Headings
- **WCAG:** 1.1.1 Non-text Content (Level A)
- **Location:** page1.html:2792
- **Impact:** Screen readers miss the "Each %" data visualization.

**Remediation:** Add `role="img" aria-label="Each percentage: 82%"`.

---

### S13. Dynamic img elements created without alt attributes
- **Specialist:** Alt Text & Headings
- **WCAG:** 1.1.1 Non-text Content (Level A)
- **Location:** page1.html:5499, 5539, 6067
- **Impact:** Screen readers may read the raw src or ignore the image entirely.

**Remediation:** Add `alt="Quarterly report screenshot"` to dynamically created `<img>` tags.

---

### S14. Toggle state changes not announced (toggleAttendanceSection, etc.)
- **Specialist:** Live Region Controller
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Location:** page1.html:1609
- **Impact:** Screen reader users aren't informed when sections expand/collapse.

**Remediation:** Set `aria-expanded` on trigger elements; update dynamically in toggle functions.

---

### S15. Feedback success/error states lack live regions
- **Specialist:** Live Region Controller
- **WCAG:** 4.1.3 Status Messages (Level AA)
- **Location:** page1.html:7066, 7073
- **Impact:** Screen reader users aren't notified of submission success/failure.

**Remediation:** Add `role="status" aria-live="polite"` to `#fb-success`; add `role="alert"` to `#fb-error`.

---

### S16. Refresh status div lacks aria-live
- **Specialist:** Live Region Controller
- **WCAG:** 4.1.3 Status Messages (Level AA)
- **Location:** page1.html:932
- **Impact:** Visual refresh messages invisible to screen reader users.

**Remediation:** Add `role="status" aria-live="polite"` to `#refreshStatus`.

---

### S17. Survey step changes don't manage focus
- **Specialist:** Live Region Controller
- **WCAG:** 2.4.3 Focus Order (Level A)
- **Location:** page1.html:7603
- **Impact:** When navigating steps, focus stays on the old button; user loses place.

**Remediation:** Set `tabindex="-1"` on new step container and call `.focus()` in `showStep()`.

---

### S18. Modals don't trap focus or return focus on close
- **Specialist:** Keyboard Navigator
- **WCAG:** 2.4.3 Focus Order (Level A)
- **Location:** page1.html:1739 (hideAttendanceModal), and all other modal close functions
- **Impact:** Keyboard users lose their place; can tab into background.

**Remediation:** Store `document.activeElement` before open; restore on close. Implement focus trap loop.

---

### S19. Skip link target `<main>` not focusable
- **Specialist:** Keyboard Navigator
- **WCAG:** 2.4.1 Bypass Blocks (Level A)
- **Location:** page1.html:1077
- **Impact:** Skip link doesn't move focus; next Tab goes back to top.

```html
<main id="main-content">
```

**Remediation:** Add `tabindex="-1"`.

---

### S20. Attendance table detail rows: hardcoded colspan breaks with hidden columns
- **Specialist:** Tables Specialist
- **WCAG:** 1.3.1 Info and Relationships (Level A)
- **Location:** page1.html:1287
- **Impact:** Screen readers misinterpret table structure when columns are toggled.

**Remediation:** Dynamically update colspan when arrival/EOD columns are shown/hidden.

---

### S21. Color-only status for delta values (+11, -242)
- **Specialist:** Tables Specialist
- **WCAG:** 1.4.1 Use of Color (Level A)
- **Location:** page1.html:1281
- **Impact:** Colorblind users cannot distinguish positive/negative deltas.

**Remediation:** Add `<span class="sr-only">Positive delta:</span>` or use +/- symbols consistently (already has + but semantically annotate for SR).

---

### S22. Warning color (#ffc107) on white fails contrast
- **Specialist:** Contrast Master
- **WCAG:** 1.4.3 Contrast Minimum (Level AA)
- **Location:** page1.html:156 (CSS `.warn` class)
- **Current:** `#ffc107` on `#ffffff` = 1.6:1 (requires 4.5:1)

**Remediation:** Change to `#8f7000` (4.68:1).

---

### S23. Transparent white text on blue header fails contrast
- **Specialist:** Contrast Master
- **WCAG:** 1.4.3 Contrast Minimum (Level AA)
- **Location:** page1.html:95 (header row 2 text)
- **Current:** `rgba(255,255,255,0.8)` on `#0071ce` = 3.7:1 (requires 4.5:1)

**Remediation:** Use `rgba(255,255,255,0.95)` (4.58:1) or solid `#ffffff`.

---

### S24. #888 small labels fail contrast
- **Specialist:** Contrast Master
- **WCAG:** 1.4.3 Contrast Minimum (Level AA)
- **Location:** page1.html:499 (`.stat-label` and similar)
- **Current:** `#888888` on `#ffffff` = 3.5:1 (requires 4.5:1)

**Remediation:** Change to `#757575` (4.6:1).

---

### S25. #999 timestamps fail contrast
- **Specialist:** Contrast Master
- **WCAG:** 1.4.3 Contrast Minimum (Level AA)
- **Location:** page1.html:1200 (timestamp spans)
- **Current:** `#999999` on `#ffffff` = 2.8:1 (requires 4.5:1)

**Remediation:** Change to `#757575` (4.6:1).

---

### S26. Missing :focus-visible styles for custom buttons
- **Specialist:** Contrast Master
- **WCAG:** 2.4.7 Focus Visible (Level AA)
- **Location:** page1.html:101 (CSS section — `.hdr-btn`, `.feedback-btn`, `.sv-opt`, `.fb-type-btn`)
- **Impact:** Keyboard users cannot see which element has focus.

**Remediation:** Add `:focus-visible { outline: 2px solid var(--wm-blue); outline-offset: 2px; }`.

---

### S27. Color-only progress bar status indicators
- **Specialist:** Contrast Master
- **WCAG:** 1.4.1 Use of Color (Level A)
- **Location:** page1.html:172 (CSS `.progress-bar` gradient zones)
- **Impact:** Colorblind users cannot distinguish good/warn/bad states.

**Remediation:** Add text labels, icons, or patterns to supplement color.

---

### S28. Touch target sizes fail minimum (24x24px)
- **Specialist:** Contrast Master
- **WCAG:** 2.5.8 Target Size Minimum (Level AA)
- **Location:** page1.html:1236–1241 (toggle buttons at 0.65rem/3px padding)
- **Impact:** Users with motor impairments can't accurately tap small buttons.

**Remediation:** Set `min-height: 24px; min-width: 24px;` on small toggle buttons.

---

### S29. "Click here" ambiguous link text
- **Specialist:** Link Checker
- **WCAG:** 2.4.4 Link Purpose (Level A)
- **Location:** page1.html:7356, 7367 (JS-generated mailto links)
- **Impact:** "Click here if Outlook didn't open" is action-focused, not purpose-focused.

**Remediation:** Rewrite to "Open Outlook manually" / "Open email manually".

---

## Moderate Findings

### M1. Missing prefers-reduced-motion media query
- **Specialist:** Contrast Master
- **WCAG:** 2.2.2 Pause, Stop, Hide (Level A)
- **Location:** page1.html:21 (CSS `@keyframes pulse`)
- **Impact:** Users with vestibular disorders experience dizziness from infinite animations.

**Remediation:** Add `@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }`.

---

### M2. VTO save has no screen reader confirmation
- **Specialist:** Live Region Controller
- **WCAG:** 4.1.3 Status Messages (Level AA)
- **Location:** page1.html:1743
- **Impact:** SR users get no confirmation their entry was saved.

**Remediation:** Add a polite live region and update with "VTO saved" on each save.

---

### M3. Attendance privacy toggle lock is silent
- **Specialist:** Live Region Controller
- **WCAG:** 4.1.3 Status Messages (Level AA)
- **Location:** page1.html:1666
- **Impact:** Lock action provides no AT feedback (unlock uses `alert()` which is announced).

**Remediation:** Announce "Names locked — showing Badge ID only" via polite live region.

---

### M4. Skipped heading levels (h2 → h4)
- **Specialist:** Alt Text & Headings
- **WCAG:** 1.3.1 Info and Relationships (Level A)
- **Location:** page1.html:3099, 3469
- **Impact:** Screen reader heading navigation becomes confusing.

**Remediation:** Change `<h4>` to `<h3>` for sub-department sections.

---

### M5. Non-semantic banner — div.header instead of `<header>`
- **Specialist:** Alt Text & Headings
- **WCAG:** 1.3.1 Info and Relationships (Level A)
- **Location:** page1.html:856
- **Impact:** Landmark navigation cannot find the page banner.

**Remediation:** Change `<div class="header hdr-root">` to `<header class="header hdr-root">`.

---

### M6. Missing `<nav>` landmark
- **Specialist:** Alt Text & Headings
- **WCAG:** 1.3.1 Info and Relationships (Level A)
- **Location:** page1.html:876
- **Impact:** Screen reader users cannot jump to primary navigation.

**Remediation:** Wrap `.hdr-collapsed-actions` in `<nav aria-label="Primary">`.

---

### M7. Hover-only opacity without keyboard equivalent
- **Specialist:** Keyboard Navigator
- **WCAG:** 2.1.1 Keyboard (Level A)
- **Location:** page1.html:1085 (onmouseover/onmouseout without onfocus/onblur)
- **Impact:** Keyboard users don't get the same visual feedback.

**Remediation:** Add `onfocus="this.style.opacity=1" onblur="this.style.opacity=0.5"`.

---

### M8–M12. Tables missing captions and scope attributes
- **Specialist:** Tables Specialist
- **WCAG:** 1.3.1 Info and Relationships (Level A)
- **Locations:**
  - M8: Main attendance table (page1.html:1248) — no `<caption>`, no `scope`
  - M9: Nested detail tables (page1.html:1290, 1395, 1500) — no caption, no scope
  - M10: Forecast table (page1.html:1851) — no caption, no scope
  - M11: Department Production table (page1.html:2881) — no caption, no `<thead>`, no scope
  - M12: Div-based grids displaying key-value data (page1.html:1196) — should use `<dl>` semantics

**Remediation:** Add `<caption class="sr-only">` to each table. Add `scope="col"` to column headers, `scope="row"` to row headers. Wrap metric grids in `<dl><dt><dd>` structure.

---

## Minor Findings

### m1. #666 on #f5f5f5 fails AAA enhanced contrast
- **Specialist:** Contrast Master
- **WCAG:** 1.4.6 Contrast Enhanced (Level AAA)
- **Location:** page1.html:1221
- **Current:** 5.27:1 (passes AA, fails AAA 7:1)

**Remediation:** Change to `#525252` for 7.1:1 (AAA compliance is recommended, not required).

---

### m2. Duplicate H1 elements
- **Specialist:** Alt Text & Headings
- **WCAG:** 2.4.6 Headings and Labels (Level AA)
- **Location:** page1.html:861 and 893
- **Impact:** Two identical H1s ("PHX1") — one in collapsed header, one in expanded.

**Remediation:** Convert one to `<span>` or `aria-hidden="true"` based on visibility.

---

### m3. Missing tabindex="-1" on `<main>` for skip link support
- **Specialist:** Alt Text & Headings
- **WCAG:** 2.4.1 Bypass Blocks (Level A)
- **Location:** page1.html:1077

**Remediation:** Add `tabindex="-1"` to `<main id="main-content">`.

---

### m4. Emoji in headings not aria-hidden
- **Specialist:** Alt Text & Headings
- **WCAG:** 1.1.1 Non-text Content (Level A)
- **Location:** page1.html:1084, 999, 1905, 2864
- **Impact:** Screen readers announce emoji names ("tractor", "alarm clock") adding noise.

**Remediation:** Wrap in `<span aria-hidden="true">🚛</span>`.

---

### m5. Auto-refreshing time element lacks explicit aria-live="off"
- **Specialist:** Live Region Controller
- **WCAG:** 4.1.2 Name, Role, Value (Level A)
- **Location:** page1.html:980 (setInterval every 30s)
- **Impact:** Aggressive SR configurations might announce every 30s update.

**Remediation:** Add `aria-live="off"` to `#viewer-time-collapsed`.

---

## Specialist Summaries

| Specialist | Issues | Critical | Serious | Moderate | Minor |
|-----------|--------|----------|---------|----------|-------|
| ARIA Specialist | 6 | 1 | 4 | 1 | 0 |
| Keyboard Navigator | 4 | 1 | 2 | 1 | 0 |
| Contrast Master | 9 | 0 | 7 | 1 | 1 |
| Modal Specialist | 6 | 6 | 0 | 0 | 0 |
| Forms Specialist | 7 | 0 | 7 | 0 | 0 |
| Alt Text & Headings | 10 | 1 | 3 | 3 | 3 |
| Link Checker | 7 | 0 | 3 | 4 | 0 |
| Live Region Controller | 8 | 1 | 4 | 2 | 1 |
| Tables Specialist | 8 | 1 | 2 | 5 | 0 |

---

## Priority Remediation Order

1. **Remove meta refresh** (C1) — single line change, highest user impact
2. **Add dialog semantics to all modals** (C2–C7) — pattern fix across ~8 overlays
3. **Make interactive divs/trs keyboard-accessible** (C8–C10) — add buttons or role+tabindex
4. **Add labels to all form controls** (S1–S7) — systematic labeling pass
5. **Fix contrast failures** (S22–S25) — CSS variable updates
6. **Add live regions for dynamic updates** (S14–S17) — JS instrumentation
7. **Add table captions and scope** (M8–M12) — structural HTML pass
8. **Add :focus-visible styles** (S26) — single CSS rule addition
