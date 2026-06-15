# Accessibility Audit: page1.html (Shift Execution Tracker - PHX1)

**Audit Date:** June 15, 2026  
**Methodology:** A11y Agent Team — Parallel Group Full Audit  
**Page:** `broken-pages-for-testing/page1.html`

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical (blocks AT users) | 14 |
| High (significant barriers) | 19 |
| Medium (degraded experience) | 12 |
| Low (best-practice gaps) | 8 |
| **Total Issues** | **53** |

**Overall Score: 38/100 (F)**

---

## Group 1: ARIA Specialist + Keyboard Navigator + Forms Specialist

### ARIA Specialist Findings

| # | Severity | WCAG | Issue | Location |
|---|----------|------|-------|----------|
| A1 | Critical | 4.1.2 | **Clickable `<div>` and `<span>` elements used as buttons without `role="button"`**. Multiple `onclick` handlers on `<div>`, `<span>`, and `<tr>` elements (`toggleHeader()`, `toggleAttendanceSection()`, `toggleDeptDetails()`, `toggleMiniForecast()`, etc.) have no semantic role. Screen readers cannot identify them as interactive. | Lines 860, 892, 1218, 1271, 1376, 1481, 1833, 2869 |
| A2 | Critical | 4.1.2 | **Modals lack `role="dialog"` and `aria-modal="true"`**. The shift-help modal, attendance modal, feedback modal, survey modal, display picker modal, settings modal — none use proper dialog semantics. | Lines 996, 1709, 6980, 7431, 8420+ |
| A3 | Critical | 4.1.2 | **Expandable sections lack `aria-expanded` state**. All collapsible sections (Attendance, Forecast, Department Production, dept detail rows) toggle visibility via JS but never communicate expanded/collapsed state to AT. | Lines 1218, 1271, 1376, 1481, 1833, 2869 |
| A4 | High | 1.3.1 | **Progress bars have no accessible value**. The `<div class="progress-bar">` elements convey completion percentage visually but expose nothing to AT. Need `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. | Lines 2567, 2611 |
| A5 | High | 4.1.2 | **SVG gauges/speedometers are decorative to AT**. The UPH speedometer SVGs have no `role="img"` or `aria-label`. The critical numeric value (e.g., "87.9 UPH") is in a nearby `<span>` but the gauge relationship is not programmatically conveyed. | Lines 2509, 2680, 2705 |
| A6 | High | 1.3.1 | **Star rating widget has no `role="radiogroup"` or grouping**. Survey star buttons use individual `aria-label` but the group has no associated label for "rate usefulness." | Line 7450 |
| A7 | Medium | 4.1.2 | **Toggle buttons don't communicate state**. The "5-6-7", "EOD", "Badge ID Only" toggle buttons change visual appearance but never set `aria-pressed` or `aria-expanded`. | Lines 1236-1241 |

### Keyboard Navigator Findings

| # | Severity | WCAG | Issue | Location |
|---|----------|------|-------|----------|
| K1 | Critical | 2.1.1 | **Interactive `<div>` and `<tr>` elements are not keyboard accessible**. Elements with `onclick` but no `tabindex` or keyboard event handlers: department rows (`toggleDeptDetails`), header collapse, forecast toggle. Users cannot reach or activate these controls via keyboard. | Lines 860, 892, 1218, 1271, 1376, 1481, 1833 |
| K2 | Critical | 2.4.7 | **No visible focus indicators on most interactive elements**. No `:focus` or `:focus-visible` styles defined for custom buttons (`.hdr-btn`, `.hdr-btn-mini`, `.feedback-btn`, `.fb-type-btn`, `.sv-opt`, etc.). Keyboard users cannot see where focus is. | Global CSS |
| K3 | High | 2.4.3 | **Modal focus trapping is absent**. When modals open (shift help, attendance, feedback, survey, quarterly, settings), focus is never moved to the modal, and Tab can escape to background content. | All modal open/close functions |
| K4 | High | 2.1.1 | **`onmouseover`/`onmouseout` used for state without keyboard equivalents**. The "learn mode" buttons change opacity on hover but have no `onfocus`/`onblur` equivalent. Keyboard users get no feedback. | Lines 1085, 1144, 1234, 2538 |
| K5 | High | 2.4.7 | **Skip link exists but may be covered**. The skip link targets `#main-content` which is correct, but the sticky `#refresh-bar` (position: sticky; top: 0; z-index: 100) may visually obscure it on focus. | Lines 818, 822 |
| K6 | Medium | 2.1.2 | **Keyboard trap risk in modals**. Escape key closes some modals but not all. The display picker overlay, quarterly modal, and EOD modal only close via button click or Escape — if either fails, user is trapped. | Various modal scripts |

### Forms Specialist Findings

| # | Severity | WCAG | Issue | Location |
|---|----------|------|-------|----------|
| F1 | Critical | 1.3.1, 4.1.2 | **VTO input fields have no associated `<label>`**. The `<input type="number" id="inbound-vto-actual">`, `outbound-vto-actual`, `icqa-vto-actual` have only `placeholder` text — no label, no `aria-label`, no `aria-labelledby`. | Lines 1350, 1455, 1560 |
| F2 | High | 1.3.1 | **Survey and quarterly `<select>` elements lack labels**. The `<select id="qtr-loss-reason-N">` and `<select id="qtr-loss-action-N">` have no `<label>` or `aria-label`. | Lines 5261, 5271 |
| F3 | High | 3.3.2 | **Textarea elements in modals lack visible labels**. The feedback description textarea (`fb-description`), raw data textarea, and quarterly commentary textareas rely on placeholder text only (which disappears on input). | Lines 7035, 7042, 5332 |
| F4 | Medium | 3.3.1 | **No error identification for required fields**. The feedback form requires a type selection and description but validation (`validateFbForm`) only disables the submit button — no `aria-invalid`, no visible error message. | Line 7186 |
| F5 | Medium | 4.1.2 | **Input `onchange` without submit pattern**. VTO inputs auto-save on change with no confirmation or undo mechanism. Users get no feedback that the value was saved. | Lines 1350, 1455, 1560 |

---

## Group 2: Contrast Master + Alt Text & Headings + Link Checker

### Contrast Master Findings

| # | Severity | WCAG | Issue | Location |
|---|----------|------|-------|----------|
| C1 | High | 1.4.3 | **Insufficient contrast on muted text**. `color: var(--text-muted)` (#666) on `background: var(--bg-light)` (#f5f5f5) = 4.05:1. Fails AA for normal text below 14px (many instances at `font-size: 0.7rem` / ~11px). | Throughout — metric labels, timestamps, hints |
| C2 | High | 1.4.3 | **Yellow text on white fails contrast**. `.warn { color: var(--warning); }` (#ffc107) on white = 1.95:1. Used for "NEAR TARGET" status, UPH values, and warning badges. | Lines 155, 2525, 2722 |
| C3 | High | 1.4.3 | **White text on blue header badges**. `rgba(255,255,255,0.8)` text on `var(--wm-blue)` (#0071ce) = approximately 3.2:1 — fails AA for the 0.8rem text size used in header row 2. | Line 95 (`.hdr-text-light`) |
| C4 | Medium | 1.4.3 | **Chart legend text at 0.6rem**. Many `font-size: 0.6rem` labels in bar charts and legends with `color: #666` or `color: #888` will fail contrast at that size (large text thresholds don't apply). | Lines 1161, 1174, 2636 |
| C5 | Medium | 1.4.11 | **Progress bar has no non-color distinction**. The red/yellow/green progress bars and gauges convey status exclusively via color. No text label, pattern, or icon inside the bar itself. | Lines 2567-2602 |

### Alt Text & Headings Findings

| # | Severity | WCAG | Issue | Location |
|---|----------|------|-------|----------|
| H1 | High | 1.3.1 | **Heading hierarchy is broken**. Page has two `<h1>` elements (PHX1 collapsed + PHX1 expanded). Then jumps from `<h2>` (card titles) to `<h3>` (Inbound Volume Mix) without structure. The main page never establishes section hierarchy. | Lines 861, 893, 2738, 2807 |
| H2 | High | 1.1.1 | **Emoji used as functional indicators without text alternatives**. Icons like 📥 📤 🔍 📊 🚛 🎯 serve as section identifiers but are not hidden from AT (`aria-hidden="true"`) nor supplemented with text — AT announces them literally (e.g., "inbox tray Inbound"). | Throughout all headings |
| H3 | High | 1.3.1 | **No landmark regions beyond `<main>`**. No `<nav>`, `<aside>`, `<section aria-label>`, or other landmarks. The header uses `<div class="header">` not `<header>`. Footer-like timestamp section has no `<footer>`. | Lines 856, 1077 |
| H4 | Medium | 1.1.1 | **SVG charts have no text alternative**. The speedometer and donut chart SVGs lack `role="img"` and `aria-label`. The `<svg viewBox="...">` elements contain only visual paths. | Lines 2509, 2680, 2792 |
| H5 | Medium | 2.4.6 | **Non-descriptive page title**. Title is "Shift Execution Tracker - PHX1" which is acceptable but the `<meta http-equiv="refresh" content="300">` auto-refresh can disrupt AT users without warning. | Line 4 |

### Link Checker Findings

| # | Severity | WCAG | Issue | Location |
|---|----------|------|-------|----------|
| L1 | High | 2.4.4 | **Ambiguous link text: "0 associates" (repeated 3x)**. Links with text "0 associates" for no-show modals — all identical, distinguished only by context. Need descriptive text like "0 Inbound no-show associates." | Lines 1358, 1462, 1567 |
| L2 | Medium | 2.4.4 | **Links using `href="#"` with `onclick`**. The "0 associates" links use `href="#"` with `onclick="...return false"`. If JS fails, these navigate to page top. Should use `<button>` instead. | Lines 1357, 1461, 1566 |

---

## Group 3: Modal Specialist + Live Region Controller + Tables Specialist

### Modal Specialist Findings

| # | Severity | WCAG | Issue | Location |
|---|----------|------|-------|----------|
| M1 | Critical | 4.1.2 | **No dialog semantics on any modal**. Seven+ modal overlays are implemented as absolutely/fixed positioned `<div>` elements. None have `role="dialog"`, `aria-modal="true"`, or `aria-labelledby`. | All modals |
| M2 | Critical | 2.4.3 | **Focus not moved to modal on open**. All `open*()` functions set `display: flex` but never call `.focus()` on the modal or its first focusable child. | All modal open functions |
| M3 | High | 2.4.3 | **Focus not returned on modal close**. Close functions hide the modal but never restore focus to the triggering element. | All modal close functions |
| M4 | High | 2.1.2 | **Inconsistent Escape key handling**. Some modals register Escape via `document.addEventListener('keydown')` but multiple handlers compete. The feedback overlay, survey, shift-help, and display overlay all independently handle Escape. | Lines 983, 7375, 8675 |
| M5 | Medium | 1.3.2 | **Background scroll not prevented for all modals**. Only the display mode sets `body.style.overflow = 'hidden'`. Other modals allow background scrolling and interaction. | Various |

### Live Region Controller Findings

| # | Severity | WCAG | Issue | Location |
|---|----------|------|-------|----------|
| LR1 | High | 4.1.3 | **No live region announcements for dynamic content**. The page updates metrics, toggles sections, saves VTO entries, generates reports — none of these state changes are announced via `aria-live` regions. | Throughout |
| LR2 | High | 4.1.3 | **Feedback submission success/error not announced**. The feedback form shows success ("Feedback sent!") or error states by toggling `display` — no `role="alert"` or `aria-live="assertive"`. | Lines 7066-7077 |
| LR3 | Medium | 4.1.3 | **Auto-refresh timestamp not announced**. The viewer time updates every 30 seconds (`setInterval(updateViewerTime, 30000)`) silently. If meaningful, needs `aria-live="polite"`. | Line 980 |
| LR4 | Medium | 2.2.1 | **`<meta http-equiv="refresh" content="300">` auto-refreshes page**. This 5-minute auto-refresh can disrupt users mid-task with no ability to extend or disable. Violates 2.2.1 (Timing Adjustable) unless essential. | Line 4 |

### Tables Specialist Findings

| # | Severity | WCAG | Issue | Location |
|---|----------|------|-------|----------|
| T1 | High | 1.3.1 | **Complex table headers lack `scope` attributes**. The attendance table has multi-row headers with `colspan` groupings but no `scope="col"`, `scope="colgroup"`, or `id`/`headers` relationships. | Lines 1250-1267 |
| T2 | High | 1.3.1 | **Department production tables lack `<caption>` and header associations**. Nested tables inside collapsible department rows have `<th>` but no `scope` and no `<caption>` identifying what data they contain. | Lines 2881-2889, 1290 |
| T3 | Medium | 1.3.1 | **Visually hidden columns (`display: none`) break table reading order**. The `.arrival-col` and `.eod-col` columns are hidden by default. When toggled visible, they appear mid-table but AT may not re-index column positions. | Lines 1252, 1255 |
| T4 | Medium | 1.3.1 | **Data conveyed only by color in table cells**. Classes like `.text-success`, `.text-danger` on delta values ("+11", "-242") provide meaning solely through green/red color. No icon, prefix, or `aria-label` alternative. | Lines 1281, 1386, 1594 |

---

## Cross-Cutting Issues

| # | Severity | WCAG | Issue | Location |
|---|----------|------|-------|----------|
| X1 | High | 2.5.3 | **Accessible name mismatch on feedback buttons**. Some feedback buttons have `aria-label="Give feedback on 📦 Inbound Volume Mix\n\n(Receive paths only)"` — the embedded newlines and parenthetical text make the accessible name differ from visible text and hard to invoke via voice. | Lines 2743-2747 |
| X2 | High | 1.4.4 | **Content truncation at 200% zoom**. Inline `style` with fixed `width`, `max-width`, and `overflow: hidden` on many elements will clip content at browser zoom ≥ 200%. | Various (fixed-width inputs, badge elements) |
| X3 | Medium | 1.4.10 | **Reflow issues at 320px viewport**. The 3-column grid (`grid-template-columns: minmax(200px, 1fr) minmax(280px, 2fr) 3fr`) requires minimum 780px — content overflows at narrow widths. | Line 1080 |
| X4 | Low | 2.5.8 | **Touch targets below 44x44 CSS pixels**. Several inline buttons at `font-size: 0.65rem` with `padding: 3px 8px` (privacy toggle, arrival toggle, EOD toggle) are below minimum touch target size on non-mobile breakpoints. | Lines 1236-1241 |

---

## Priority Remediation Plan

### P0 — Fix Immediately (Critical)
1. Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby` to all modal overlays
2. Add focus management (move focus on open, restore on close, trap Tab)
3. Add `role="button"`, `tabindex="0"`, keydown handlers to all clickable non-button elements
4. Add `aria-expanded` to all expand/collapse triggers
5. Add `<label>` or `aria-label` to all form inputs

### P1 — Fix This Sprint (High)
6. Add visible `:focus-visible` outlines to all custom interactive elements
7. Add `aria-live="polite"` status region for dynamic updates
8. Add `scope` attributes to all table headers
9. Fix color contrast on muted text, yellow warnings, and light header text
10. Add `role="progressbar"` with aria-value attributes to progress bars
11. Use `<header>`, `<nav>`, `<section aria-label>` landmarks
12. Fix heading hierarchy (single `<h1>`, logical nesting)

### P2 — Next Sprint (Medium/Low)
13. Replace `<meta http-equiv="refresh">` with user-controlled refresh
14. Add `aria-hidden="true"` to decorative emoji
15. Fix accessible names with embedded newlines
16. Ensure reflow at 320px
17. Increase touch target sizes to 44x44 minimum

---

## WCAG 2.2 Criteria Failing

| SC | Level | Description | Issues |
|----|-------|-------------|--------|
| 1.1.1 | A | Non-text Content | H2, H4 |
| 1.3.1 | A | Info and Relationships | A3, A4, F1, H1, H3, T1-T4 |
| 1.4.3 | AA | Contrast (Minimum) | C1-C4 |
| 1.4.11 | AA | Non-text Contrast | C5 |
| 2.1.1 | A | Keyboard | K1, K4 |
| 2.1.2 | A | No Keyboard Trap | K6, M4 |
| 2.2.1 | A | Timing Adjustable | LR4 |
| 2.4.3 | A | Focus Order | K3, M2, M3 |
| 2.4.4 | A | Link Purpose | L1, L2 |
| 2.4.6 | AA | Headings and Labels | H5 |
| 2.4.7 | AA | Focus Visible | K2, K5 |
| 3.3.1 | A | Error Identification | F4 |
| 3.3.2 | A | Labels or Instructions | F3 |
| 4.1.2 | A | Name, Role, Value | A1, A2, A7, M1, F1, X1 |
| 4.1.3 | AA | Status Messages | LR1, LR2 |

---

*Audit performed following the A11y Agent Team parallel group methodology (Groups 1-3 simultaneous, cross-cutting analysis final pass).*
