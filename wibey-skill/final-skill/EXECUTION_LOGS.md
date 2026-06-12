# 📜 Swarm Execution Logs

*This document captures the output trace for every autonomous ingestion/fix executed by Wibey. Use this to audit what the swarm did while running the batch queue.*

---

## Run #10 — 2026-03-24 | Round 9: International Team — First 3.2.2 + 1.3.1-007 confirmed (3 tickets)

### Execution Parameters
| Field | Value |
|---|---|
| Date | 2026-03-24 |
| Rows | 57–59 |
| Tickets | INTX-17877, INTX-17645, INTX-18110 |
| WCAG Criteria | 3.2.2 (×1), 1.3.1 (×2) |
| Novel | 3 (WA11Y-WEB-3.2.2-001, WA11Y-WEB-1.3.1-007 Var 2, WA11Y-WEB-1.3.1-007 Var 3) |
| Variations | 0 |
| New Team Files | 2 (`teams/International/canada.md`, `teams/International/mexico.md`) |
| New Domain | International (`INTX-*` prefix) |

### DESTINATION Routing
| Ticket | Template | Classification |
|---|---|---|
| INTX-17877 | `RECOMMENDED_TEMPLATES.md` | NOVEL `WA11Y-WEB-3.2.2-001` — **first 3.2.2 On Input template** — `Tab` key branch in RangeSlider `handleKeyDown` commits value via `onChange` → triggers URL navigation + popover collapse |
| INTX-17645 | `RECOMMENDED_TEMPLATES.md` | NOVEL `WA11Y-WEB-1.3.1-007` Var 2 — `aria-label` on `<li>` (listitem) + `aria-hidden` on children in PolicyLine (Canada en-CA/fr-CA) |
| INTX-18110 | `RECOMMENDED_TEMPLATES.md` | NOVEL `WA11Y-WEB-1.3.1-007` Var 3 — same anti-pattern in PolicyLine (Mexico es-MX) — third confirmed instance validates promotion |

### Key Patterns Extracted
- **WCAG 3.2.2 On Input (new criterion):** Keyboard events that fire `onChange` (which triggers URL navigation or context change) must NOT include Tab — Tab's only job is to move focus; any value-commit side-effect on Tab key is an On Input violation. Remove the `Tab` branch from `handleKeyDown` entirely and let the browser handle focus movement.
- **`aria-label` on `<li>` (non-widget role):** `aria-label` on a structural listitem is silently discarded by most AT in reading/browse mode — AT traverses the DOM children directly. Fix: remove `aria-label` from the `<li>` and remove `aria-hidden` from the text children; let natural DOM text be the accessible content.
- **International PolicyLine pattern is cross-team:** Same anti-pattern (`<li aria-label> + <div aria-hidden>`) confirmed in both Canada (en-CA/fr-CA) and Mexico (es-MX) paths of the same component — suggests a systemic copy-paste pattern worth a grep sweep across `libs/international/` and `libs/marketplace/`.

---

## Run #9 — 2026-03-23 | Round 8: 4.1.3 Status Messages continued — LD announcement patterns (2 tickets)

### Execution Parameters
| Field | Value |
|---|---|
| Date | 2026-03-23 |
| Rows | 55–56 |
| Tickets | GPUGC-21456, CEPG-338731 |
| WCAG Criteria | 4.1.3 (×2) |
| Novel | 0 |
| Variations | 2 |
| New Team Files | 0 |

### DESTINATION Routing
| Ticket | Template | Classification |
|---|---|---|
| GPUGC-21456 | `WA11Y-WEB-4.1.3-001` | Variation 3 — LD `announceAssertive()` + `addSnack()` dual-mechanism in `ReviewList.onSuccess` (delete draft snackbar, reviewer-community) |
| CEPG-338731 | `WA11Y-WEB-4.1.3-003` | Variation 1 — `useA11yAnnouncement().announcePolite()` + 1s `setTimeout` alongside `addSnack()` (cart deal-recommendation snackbar) |

### Key Patterns Extracted
- **LD dual-mechanism pattern (GPUGC-21456):** When a user action produces both a visual snackbar and an AT announcement, call `announceAssertive()` and `addSnack()` together inside a single `showSnackMessage` helper — ensures neither channel fires without the other and prevents the common bug of visual-only feedback
- **`announcePolite` + `setTimeout(1000)` (CEPG-338731):** For snackbars that appear after async operations (add-to-cart), delay the announcement 1s to allow the DOM to settle before injection into the `aria-live` region — prevents the message being swallowed by concurrent DOM mutations
- **`useA11yAnnouncement` hook is the canonical LD pattern** for injecting text into `aria-live` regions — do NOT add raw `role="status"` divs alongside LD snackbar components; the hook already targets LD's managed live region

---

## Run #8 — 2026-03-23 | Round 7: Accessible Role + State + First 4.1.3 Status Messages — 4.1.2 (×7) + 4.1.3 (×2) (9 tickets)

### Execution Parameters
| Field | Value |
|---|---|
| Date | 2026-03-23 |
| Rows | 46–54 |
| Tickets | CEPG-337572, CEPG-341096, CEPG-330761, WSC-4050, CEPG-337628, CEPG-337392, CRUISE-16218, CEPG-335616, HVCE-12342 |
| WCAG Criteria | 4.1.2 (×7), 4.1.3 (×2) |
| Novel | 2 (WA11Y-WEB-4.1.2-013, WA11Y-WEB-4.1.3-001) |
| Variations | 7 (4.1.2-004 ×2, 4.1.2-005 ×2, 4.1.2-007 ×1, 4.1.2-010 ×1, 4.1.3-001 Var 2) |
| New Team Files | 2 (`teams/Discovery/content-gcomm.md`, `teams/Subscriptions/manage-dashboard.md`) |

### DESTINATION Routing
| Ticket | Template | Classification |
|---|---|---|
| CEPG-337572 | `WA11Y-WEB-4.1.2-004` | Variation 2 — `ui-link href="#"` text-expander → `<Button variant="tertiary">` (GComm RecipeDescription) |
| CEPG-330761 | `WA11Y-WEB-4.1.2-004` | Variation 3 — `<Button onClick>` navigation CTA missing `href` → `<Button href={redirectUrl}>` (thankyou-generic-banner) |
| WSC-4050 | `WA11Y-WEB-4.1.2-005` | Variation 2 — LD Button missing `href={signInUrl}` in global-header desktop flyout + mobile menu |
| CEPG-341096 | `WA11Y-WEB-4.1.2-005` | Variation 3 — conditional dual-mode `exitRole` derived from wizard-step state (TaxEntryNav) |
| CEPG-337628 | `WA11Y-WEB-4.1.2-007` | Variation 1 — `aria-disabled={isDisabled}` on Auto Care Center workflow list buttons (first variation on skeleton) |
| CEPG-337392 | `RECOMMENDED_TEMPLATES.md` | NOVEL `WA11Y-WEB-4.1.2-013` — hardcoded `aria-pressed="false"` string → dynamic `aria-label` via `getAriaLabel()` + `checkIsSelected()` |
| CRUISE-16218 | `WA11Y-WEB-4.1.2-010` | Variation 1 — popup menu trigger missing `aria-expanded`/`aria-haspopup`/`aria-controls` + panel `id` (SubscriptionItemsOption) |
| CEPG-335616 | `RECOMMENDED_TEMPLATES.md` | NOVEL `WA11Y-WEB-4.1.3-001` Var 1 — `aria-live="polite" role="alert"` on WCP `<Alert variant="success">` (manage-dashboard) — **first 4.1.3 template** |
| HVCE-12342 | `RECOMMENDED_TEMPLATES.md` | NOVEL `WA11Y-WEB-4.1.3-001` Var 2 — `aria-live="assertive"` + `useEffect` focus on VTO InformationCard (face-scan status, Health-Vision) |

### Key Patterns Extracted
- **Role intent mismatch (bidirectional):** `ui-link` (link) used for action → swap to `<Button variant="tertiary">`; `<Button onClick>` (button) used for navigation → add `href` prop. `@walmart-web/ui-button` is polymorphic: `href` present = renders as `<a>`; no `href` = `<button>`
- **Conditional dual-mode role:** When a control toggles between navigation and modal-trigger depending on runtime state, derive `role` from state: `exitRole = willShowExitModal ? "button" : "link"`
- **`aria-disabled` vs `disabled`:** Use `aria-disabled={true}` (not HTML `disabled`) when the element must remain keyboard-focusable so AT users can still discover and understand the disabled state
- **Static `aria-pressed="false"` bug class:** `aria-pressed="false"` as a JSX string literal is semantically worse than omitting the attribute — it permanently lies to AT. Replace with dynamic `aria-label` that encodes selection state (or wire to proper `aria-pressed={isSelected}` boolean)
- **Accordion/disclosure:** Popup menu triggers need the triad: `aria-haspopup`, `aria-expanded={isOpen}`, `aria-controls={panelId}` — missing `aria-controls` breaks the panel relationship
- **4.1.3 Status Messages (first template):** Two sub-patterns: (1) `aria-live="polite" role="alert"` on WCP `<Alert>` for post-action confirmation messages; (2) `aria-live="assertive"` + `useRef`/`useEffect` focus for real-time status streams where timing is critical
- **`role="alert"` + `aria-live="polite"` pairing:** Intentionally overrides `role="alert"`'s default assertive behavior — use when the status is confirmatory (not urgent/error) to avoid interrupting AT output mid-stream

---

## Run #7 — 2026-03-23 | Round 6: Label in Name + Accessible Name/Role — 2.5.3 (×2) + 4.1.2 (×7) (9 tickets)

### Execution Parameters
| Field | Value |
|---|---|
| Date | 2026-03-23 |
| Rows | 37–45 |
| Tickets | GPUGC-22861, CEPG-330592, CRUISE-17627, CEPG-337758, CEPG-366918, CEPG-344607, CEPG-330515-A (#158467), CEPG-330515-B (#157006), PGSPHARM-51056 |
| WCAG Criteria | 2.5.3 (×2), 4.1.2 (×7) |
| Novel | 0 |
| Variations | 9 |
| New Team Files | 1 (`teams/Health-Vision/pharmacy.md`) |
| New Jira Prefix | `PGSPHARM-` → Health-Vision / Pharmacy |

### DESTINATION Routing
| Ticket | Template | Classification |
|---|---|---|
| GPUGC-22861 | `WA11Y-WEB-2.5.3-001` | Variation — pill `aria-label` = visible text only; View More/Less visible-text-first |
| CEPG-330592 | `WA11Y-WEB-2.5.3-001` | Variation — phantom `aria-label` on decorative icon/image → `aria-hidden` |
| CRUISE-17627 | `WA11Y-WEB-4.1.2-001` | Variation — icon-only `InlineButton` missing `aria-label` |
| CEPG-337758 | `WA11Y-WEB-4.1.2-001` | Variation — Google Maps `Marker.title` as accessible name; state in `<p>` `aria-label` |
| CEPG-366918 | `WA11Y-WEB-4.1.2-002` | Variation — stale BNPL brand name in `aria-label` after CCM-gated rebrand |
| CEPG-344607 | `WA11Y-WEB-4.1.2-002` | Variation — 3× vague Protection Plans labels → i18n interpolated with product context |
| CEPG-330515-A | `WA11Y-WEB-4.1.2-002` | Variation — Pharmacy `"--"` sentinel → `ValueText` wrapper (`aria-label="Empty"` + `aria-hidden`) |
| CEPG-330515-B | `WA11Y-WEB-4.1.2-003` | Variation — duplicate CTA names → parameterized `getCtaAriaLabel(productName)` |
| PGSPHARM-51056 | `WA11Y-WEB-4.1.2-004` | Variation — `ui-link href=""` as action button → `<Button variant="tertiary">` |

### Key Patterns Extracted
- **2.5.3 pill labels:** `aria-label` must equal visible text only — never append summary body text to a pill accessible name
- **2.5.3 View More/Less:** Structure as `"[visible text] [additional context]"` — never use separate i18n keys that produce a different full string
- **Phantom aria-label anti-pattern:** Decorative icons/images with visible sibling text must use `aria-hidden="true"`, not fabricated `aria-label` from an i18n key
- **Google Maps accessible name:** `title` in `Marker` constructor is the only valid hook for imperative third-party DOM; `aria-pressed`/`aria-selected` invalid on `<p>` — embed state into `aria-label` string
- **CCM-gated rebrand:** ALL ARIA surfaces (CTA buttons, links, WcpAlert title/body) must be updated with flag-conditional locale keys in the same PR as the visual rebrand
- **ValueText pattern:** Sentinel `"--"` wrapped as `<span aria-label="Empty"><span aria-hidden="true">--</span></span>` — prevents "dash dash" announcement
- **Parameterized CTA label:** `getCtaAriaLabel(actionText, ..., productName)` — suppression cases: `signIn` button and `wholeBannerClickable`
- **`ui-link href=""` = button wearing link clothes:** Use `<Button variant="tertiary">` for pure action controls with no navigation intent

---

## Run #6 — 2026-03-23 | Round 5: No Keyboard Trap + Focus Order + Heading Structure — 2.1.2 (×4) + 2.4.3 (×3) + 1.3.1 (×2) (9 tickets)

### Execution Parameters
| Field | Value |
|---|---|
| Mode | Step 8 Swarm Orchestration (MapReduce) — with Pre-Flight hash resolution |
| Target Repo | `/Users/g0c073y/Desktop/githubs/Walmart-Web-2` |
| Tickets | CEPG-341100, CEPG-338329, CEPG-306542, OAMFD-10325, PR-161559, CEPG-335619, OAMD-7124, CEPG-341113, CRUISE-16221 |
| WCAG Criteria | 2.4.3 (×3), 2.1.2 (×4), 1.3.1 (×2) |
| Parallelism | ✅ All 9 agents launched in single tool-use block |
| Pre-Flight | ✅ All 9 hashes resolved by parent before spawning (no `git log` inside sub-agents) |
| Merge Fence | ✅ All 9 /tmp files present and non-empty |

### Map Phase — Agent Results

| # | Ticket | Hash | Template Found | Classification |
|---|---|---|---|---|
| 1 | CEPG-341100 | `7fc17a77bf2a` | WA11Y-WEB-2.4.3-004 | Variation 1 — page-mount SPA focus |
| 2 | CEPG-338329 | `0743c5fe06d9` | WA11Y-WEB-2.4.3-004 | Variation 2 — post-state-change focus (forwardRef) |
| 3 | CEPG-306542 | `b31602906f48` | WA11Y-WEB-2.4.3-004 | Variation 3 — pure JSX reorder (GIC drawer) |
| 4 | OAMFD-10325 | `967bbabc1d10` | NOT_FOUND | **NOVEL** — `WA11Y-WEB-2.1.2-001` Sub-pattern A (phantom AT node, aria-hidden fix) |
| 5 | PR-161559 | `211d9188b23d` | NOT_FOUND | **NOVEL** — `WA11Y-WEB-2.1.2-001` Sub-pattern B (DatePicker noop trap) |
| 6 | CEPG-335619 | `6028cf2d3998` | NOT_FOUND | **NOVEL** — `WA11Y-WEB-2.1.2-001` Sub-pattern C (stretched-link + spurious tabIndex) |
| 7 | OAMD-7124 | `0aa75ed0e518` | NOT_FOUND | **NOVEL** — `WA11Y-WEB-2.1.2-001` Sub-pattern D (onKeyDown no e.key filter) |
| 8 | CEPG-341113 | `5b88b1f553f0` | WA11Y-WEB-1.3.1-001 | Variation 6 — missing `as` prop + Link-in-Heading nesting fix |
| 9 | CRUISE-16221 | `42baa1a0b44a` | WA11Y-WEB-1.3.1-001 | Variation 7 — duplicate `as="h1"` in sub-section containers → `as="h2"` |

### Reduce Phase — Merge Actions

| Step | Action | Result |
|---|---|---|
| 1 | Merge fence: all 9 `[ -s /tmp/draft-*.md ]` | ✅ All 9 present |
| 2 | Append 3 variations to `WA11Y-WEB-2.4.3-004.md` | ✅ Done |
| 3 | Append 4 novel drafts to `RECOMMENDED_TEMPLATES.md` (all 4 proposed as `WA11Y-WEB-2.1.2-001`) | ✅ Done |
| 4 | Append 2 variations to `WA11Y-WEB-1.3.1-001.md` | ✅ Done |
| 5 | Append to `teams/Accounts/protection-plans.md` (CEPG-341100) | ✅ Done |
| 6 | Append to `teams/Transaction/payments-checkout.md` (CEPG-306542) | ✅ Done |
| 7 | Append to `teams/Discovery/search.md` (OAMFD-10325 + CEPG-335619) | ✅ Done |
| 8 | Append to `teams/Discovery/item-page.md` (OAMD-7124 + CEPG-338329) | ✅ Done |
| 9 | Create `teams/Post-Transaction/reviewer-community.md` (CEPG-341113) | ✅ Done |
| 10 | Create `teams/Subscriptions/manage-optimizations.md` (PR-161559 + CRUISE-16221) | ✅ Done |
| 11 | Update `INGESTION_PLAYBOOK.md`: domain table (OAMFD-, OAMD-, CRUISE-) + run history | ✅ Done |
| 12 | Update `BATCH_QUEUE.md` rows 28–36 + stats table | ✅ Done |

### Notable Findings

**1. First WCAG 2.1.2 Templates — 4 Distinct Root-Cause Patterns:**
All 4 WCAG 2.1.2 tickets proposed `WA11Y-WEB-2.1.2-001` as the template ID (first in the web catalog). Each represents a distinct trap mechanism:
- **Sub-pattern A (OAMFD-10325):** Invalid `aria-selected` on roleless `<span>` creates phantom AT node → fix: `aria-hidden="true"` on the wrapper span
- **Sub-pattern B (PR-161559):** `noop` wired to LD DatePicker `onClose`/`onOpen` with `isOpen` hardcoded → fix: `useState` controlled open state
- **Sub-pattern C (CEPG-335619):** Interactive buttons nested inside `<Link>` anchor → fix: stretched-link pattern + remove `tabIndex={0}` from non-interactive containers
- **Sub-pattern D (OAMD-7124):** `onKeyDown={handler}` without `e.key` filter opens modal on Tab → fix: remove `onKeyDown` entirely (or scope to Enter/Space)

**2. WA11Y-WEB-2.4.3-004 Now Has 3 Concrete Variations:**
Previously an empty skeleton, this template now documents three production-proven mechanisms for fixing focus order:
- Var 1: On-mount focus for SPA page titles (`tabIndex={-1}` wrapper + `useEffect([], [])`)
- Var 2: Post-state-change focus for interactive→confirmation transitions (`forwardRef` + boolean flag + `useEffect`)
- Var 3: Pure DOM/JSX reorder (no React hooks needed — move dismiss controls after content)

**3. Three New Jira Prefix Mappings:**
- `OAMFD-` → Discovery / Search team (`libs/search/typeahead/`)
- `OAMD-` → Discovery / Item Page team (`libs/item/modal-marketing-content/`)
- `CRUISE-` → Subscriptions / Manage Optimizations (`libs/subscription/manage-optimizations/`)

**4. WA11Y-WEB-1.3.1-001 Variation 6 Bonus Find (CEPG-341113):**
Beyond the missing `as` prop fix, this ticket also fixed a `<Link>` nested inside a `<Heading>` in `recognized-reviewer.tsx`. This secondary anti-pattern (interactive element as heading child) is a recurring risk in any component library that uses WCP `<Heading>` alongside icon links for section info affordances. Extract to `<div className="flex items-center">` wrapper with heading and link as siblings.

**5. PR-161559 Has No Jira Ticket:**
Ingested as `PR-161559` using PR number as identifier. The author's inline comment in the diff explicitly describes the focus trap: *"Can't keep it open after date selection because otherwise focus will again be trapped in modal"* — rare case of the developer documenting the WCAG violation in the code they were replacing.

---

## Run #5 — 2026-03-23 | Round 4: Keyboard + Focus Order Swarm — 2.1.1 (×4) + 2.4.3 (×4) (8 tickets)

### Execution Parameters
| Field | Value |
|---|---|
| Mode | Step 8 Swarm Orchestration (MapReduce) — with Pre-Flight hash resolution |
| Target Repo | `/Users/g0c073y/Desktop/githubs/Walmart-Web-2` |
| Tickets | CEPG-340591, CEPG-330695, CEPG-341082, CEPG-340199, CEPG-367778, CEPG-339304, GPUGC-24707, BCPA-822 |
| WCAG Criteria | 2.1.1 (×4), 2.4.3 (×4) |
| Parallelism | ✅ All 8 agents launched in single tool-use block |
| Pre-Flight | ✅ All 8 hashes resolved by parent before spawning (no `git log` inside sub-agents) |
| Merge Fence | ✅ All 8 /tmp files present and non-empty |

### Map Phase — Agent Results

| # | Ticket | Hash | Lines | Template Found | Classification |
|---|---|---|---|---|---|
| 1 | CEPG-340591 | `42e7b5a` | 137 | WA11Y-WEB-2.1.1-002 | Variation 1 |
| 2 | CEPG-330695 | `6807d98` | 144 | WA11Y-WEB-2.1.1-002 | Variation 2 |
| 3 | CEPG-341082 | `d3ab073` | 118 | WA11Y-WEB-2.1.1-003 | Variation 2 |
| 4 | CEPG-340199 | `f264cef` | 183 | NOT_FOUND | **NOVEL** — `WA11Y-WEB-2.1.1-004` proposed |
| 5 | CEPG-367778 | `af8723d` | 218 | WA11Y-WEB-2.4.3-001 | Variation 1 |
| 6 | CEPG-339304 | `fbaefc7` | 279 | WA11Y-WEB-2.4.3-001 | Variation 2 |
| 7 | GPUGC-24707 | `6edc7fb` | 187 | WA11Y-WEB-2.4.3-002 | Variation 2 |
| 8 | BCPA-822 | `15d7ad5` | 181 | WA11Y-WEB-2.4.3-003 | Variation 1 |

### Reduce Phase — Merge Actions

| Step | Action | Result |
|---|---|---|
| 1 | Merge fence: all 8 `[ -s /tmp/draft-*.md ]` | ✅ All 8 present |
| 2 | Append 2 variations to `WA11Y-WEB-2.1.1-002.md` | ✅ Done |
| 3 | Append 1 variation to `WA11Y-WEB-2.1.1-003.md` | ✅ Done |
| 4 | Append novel draft to `RECOMMENDED_TEMPLATES.md` (`WA11Y-WEB-2.1.1-004`) | ✅ Done |
| 5 | Append 2 variations to `WA11Y-WEB-2.4.3-001.md` | ✅ Done |
| 6 | Append 1 variation to `WA11Y-WEB-2.4.3-002.md` | ✅ Done |
| 7 | Append 1 variation to `WA11Y-WEB-2.4.3-003.md` | ✅ Done |
| 8 | Append to `teams/Accounts/identity-next.md` | ✅ Done |
| 9 | Append to `teams/Accounts/protection-plans.md` | ✅ Done |
| 10 | Append to `teams/Marketplace/mqd-modal.md` | ✅ Done |
| 11 | Append to `teams/Transaction/payments-checkout.md` (×3 tickets) | ✅ Done |
| 12 | Append to `teams/Discovery/item-page.md` (GPUGC prefix + write-review path) | ✅ Done |
| 13 | Append to `teams/Design-Components/wcp-flag.md` | ✅ Done |
| 14 | Update `INGESTION_PLAYBOOK.md` domain mapping: `GPUGC-` → Discovery / Item Page | ✅ Done |
| 15 | Update `BATCH_QUEUE.md` rows 20–27 + stats table | ✅ Done |

### Notable Findings

**1. Non-Native `role="button"` Missing `tabIndex` + `onKeyDown` — Recurring Anti-Pattern (CEPG-340591, CEPG-330695):**
Two separate tickets in the same run (Accounts/KYC and Accounts/Protection Plans) share the identical root cause: a non-native element (`<Icon>` and `<Link>`) with `role="button"` and `onClick` was missing both `tabIndex={0}` AND `onKeyDown`. Both halves are required — `tabIndex` makes the element focusable; `onKeyDown` makes it operable. Missing either one breaks WCAG 2.1.1. This pattern is a strong candidate for a bulk grep audit: `role="button"` without co-located `tabIndex`.

**2. NOVEL — LD ProgressIndicator `label` Slot Traps Interactive Elements (CEPG-340199):**
A button placed inside the LD `ProgressIndicator`'s `label` render prop became inaccessible from the keyboard because the LD component's DOM structure renders `label` slot content inside a non-interactive container. Fix: extract the interactive element to sibling DOM position and use `a11yLabelledBy` to associate the external label by `id`. Proposed as `WA11Y-WEB-2.1.1-004`. Systemic risk: any LD component that accepts a `label` render prop (Progress, Stepper, etc.) may share this anti-pattern.

**3. Checkout Payments Shared ADA Utility — Established Pattern (CEPG-367778):**
The `@walmart-web/payments-shared-ada-utilities` package provides `addClassToEventTargetElement` / `removeClassNameAfterDelay` for focus return on modal triggers in checkout. This is an established team standard — all new modal open/close handlers in checkout payment components must follow this pattern. Documented in `teams/Transaction/payments-checkout.md`.

**4. Cart AOS Modal — Focus Must Target Heading on Panel Transitions (CEPG-339304):**
When a modal has internal panel transitions (select → details), focus should land on the panel's `<h2>` heading (with `tabIndex={-1}`), not on an action button. Pattern: `useRef<HTMLHeadingElement>` + `requestAnimationFrame(() => ref.current?.focus())`. Also: `<VisuallyHidden><legend>` is invalid — correct nesting is `<legend><VisuallyHidden>`.

**5. GPUGC Prefix Identified — Discovery / Item Page / Reviews Sub-Team:**
GPUGC-24707 traces to `libs/item/reviews/write-review/`. GPUGC was a previously unmapped Jira prefix. Now documented in both INGESTION_PLAYBOOK.md domain table and `teams/Discovery/item-page.md`. Also found: `validationAttemptCounter` pattern — monotonically-incrementing state as a `useEffect` dependency to guarantee focus fires on every validation failure, even when the error message content doesn't change.

**6. WCP SearchBar Focus-Loss on Conditional Slot Unmount (BCPA-822):**
React's conditional rendering (`{condition && <Component>}`) causes a focus-loss bug when the activated element's action also clears the condition, unmounting it mid-interaction. Single-line fix: `inputRef.current?.focus()` synchronously in the same handler before React reconciles. Systemic risk: any WCP component with conditional `trailing`/`leading` slots where activation toggles the condition.

---

## Run #4 — 2026-03-20 | Round 3: Mixed WCAG Swarm — Headings, Form Grouping, Labels, Non-text Contrast (9 tickets)

### Execution Parameters
| Field | Value |
|---|---|
| Mode | Step 8 Swarm Orchestration (MapReduce) — with Pre-Flight hash resolution |
| Target Repo | `/Users/g0c073y/Desktop/githubs/Walmart-Web-2` |
| Tickets | HVCE-13625, CEPG-353780, CEPG-344616, CEPG-344615, CEPG-340974, CEPG-330702, WSC-3897, CEPG-340528, BCPA-821 |
| WCAG Criteria | 1.3.1 (×7), 4.1.2 (×1), 1.4.11 (×1) |
| Parallelism | ✅ All 9 agents launched in single tool-use block |
| Pre-Flight | ✅ All 9 hashes resolved by parent before spawning (no `git log` inside sub-agents) |
| Merge Fence | ✅ All 9 /tmp files present and non-empty |

### Map Phase — Agent Results

| # | Ticket | Hash | Lines | Template Found | Classification |
|---|---|---|---|---|---|
| 1 | HVCE-13625 | `9a6f61c` | 92 | WA11Y-WEB-1.3.1-001 | Variation 1 |
| 2 | CEPG-353780 | `3e064b7` | 86 | WA11Y-WEB-1.3.1-001 | Variation 2 |
| 3 | CEPG-344616 | `e31f14b` | 74 | WA11Y-WEB-1.3.1-001 | Variation 3 |
| 4 | CEPG-344615 | `75bbbfc` | 69 | WA11Y-WEB-1.3.1-001 | Variation 4 |
| 5 | CEPG-340974 | `1385819` | 49 | WA11Y-WEB-1.3.1-001 | Variation 5 |
| 6 | CEPG-330702 | `6034b90` | 89 | WA11Y-WEB-1.3.1-004 | Variation 1 |
| 7 | WSC-3897 | `c0743e2` | 131 | WA11Y-WEB-1.3.1-004 | Variation 2 |
| 8 | CEPG-340528 | `21e2c92` | 132 | WA11Y-WEB-4.1.2-001 | Variation 1 |
| 9 | BCPA-821 | `759184c` | 159 | WA11Y-ALL-1.4.11-001 | Variation 1 |

### Reduce Phase — Merge Actions

| Step | Action | Result |
|---|---|---|
| 1 | Merge fence: all 9 `[ -s /tmp/draft-*.md ]` | ✅ All 9 present |
| 2 | Append 5 variations to `WA11Y-WEB-1.3.1-001.md` | ✅ Done |
| 3 | Append 2 variations to `WA11Y-WEB-1.3.1-004.md` | ✅ Done |
| 4 | Append 1 variation to `WA11Y-WEB-4.1.2-001.md` | ✅ Done |
| 5 | Append 1 variation to `WA11Y-ALL-1.4.11-001.md` | ✅ Done |
| 6 | Append to `teams/Health-Vision/vision-center-orders.md` (×2 tickets) | ✅ Done |
| 7 | Append to `teams/Discovery/item-page.md` | ✅ Done |
| 8 | Append to `teams/Accounts/identity-next.md` | ✅ Done |
| 9 | Append to `teams/Design-Components/wcp-flag.md` | ✅ Done |
| 10 | Create `teams/Marketplace/mqd-modal.md` (NEW domain) | ✅ Done |
| 11 | Create `teams/Accounts/protection-plans.md` (NEW) | ✅ Done |
| 12 | Create `teams/Accounts/order-history.md` (NEW) | ✅ Done |
| 13 | Update `BATCH_QUEUE.md` rows 11–19 + stats | ✅ Done |

### Notable Findings

**1. WCP Heading `as` Prop is Mandatory — Systemic Gap:**
At least 2 separate tickets (HVCE-13625 in `ErrorPage`, CEPG-344615 in Order Item Tile) fixed missing `as` on the WCP `<Heading>` component. The component is polymorphic — omitting `as` silently produces a styled-but-roleless node. Fast grep signal for bulk audit: `<Heading` without `as=` in `libs/`.

**2. `as="h6"` Used as Visual Size Hack (CEPG-344616):**
Developers used `as="h6"` to get small visual text, conflating semantic level with font size. Rule now codified in `WA11Y-WEB-1.3.1-001.md` Variation 3: `as` = structural hierarchy; visual size = `UNSAFE_className` Tachyons (`f3`, `f5`, `f6`).

**3. Radio `name` Anti-Pattern: Unique Per-Item Value (WSC-3897):**
`name={loc}` (where `loc` is `"en"`, `"es"` etc.) gives each radio a unique `name`, making each its own independent group of one. Harder to spot than "missing name" because the prop is present. New Variation 2 added to `WA11Y-WEB-1.3.1-004.md`.

**4. WCAG 1.4.11 vs 1.4.3 — CSS Specificity Root Cause (BCPA-821):**
Star stroke-width failure traced to sibling CSS selectors (`.small, .medium {}`) instead of child-modifier selectors (`&.small {}`) — a pure CSS specificity issue causing a non-text contrast failure. Added 1.4.11 vs 1.4.3 distinction note to `WA11Y-ALL-1.4.11-001.md`.

**5. Pre-Flight Protocol Validated:**
First run using the new Step 8 Pre-Flight hash resolution. Parent resolved all 9 hashes in one bash loop before spawning. Sub-agents received pre-resolved hashes and skipped `git log` entirely.

---

## Run #3 — 2026-03-20 | Round 2: WCAG 1.3.1 List Structure Swarm (3 tickets)

### Execution Parameters
| Field | Value |
|---|---|
| Mode | Step 8 Swarm Orchestration (MapReduce) |
| Target Repo | `/Users/g0c073y/Desktop/githubs/Walmart-Web-2` |
| Tickets | CEPG-348108, CEPG-330816, CEPG-330551 |
| WCAG Criterion | 1.3.1 — Info and Relationships (Level A) |
| Parallelism | ✅ All 3 agents launched in single tool-use block |
| Merge Fence | ✅ Bash `[ -s ]` check passed for all 3 /tmp files |

### Map Phase — Agent Results

| Agent | Ticket | /tmp File | Lines | Status | Classification |
|---|---|---|---|---|---|
| Agent 1 | CEPG-348108 | `/tmp/draft-CEPG-348108.md` | 135 | ✅ PRESENT | **NOVEL** — `WA11Y-WEB-1.3.1-007` proposed |
| Agent 2 | CEPG-330816 | `/tmp/draft-CEPG-330816.md` | 119 | ✅ PRESENT | Variation of `WA11Y-WEB-1.3.1-002` |
| Agent 3 | CEPG-330551 | `/tmp/draft-CEPG-330551.md` | 121 | ✅ PRESENT | Variation of `WA11Y-WEB-1.3.1-002` + bonus 1.4.3 |

### Reduce Phase — Merge Actions

| Step | Action | Result |
|---|---|---|
| 1 | Merge fence: `[ -s /tmp/draft-CEPG-*.md ]` | ✅ All 3 files present and non-empty |
| 2 | Read all 3 /tmp drafts in parallel | ✅ Complete |
| 3 | Append Draft #8 (CEPG-348108) to `RECOMMENDED_TEMPLATES.md` | ✅ Done |
| 4 | Append Draft #9 (CEPG-330816) to `RECOMMENDED_TEMPLATES.md` | ✅ Done |
| 5 | Append Draft #10 (CEPG-330551) to `RECOMMENDED_TEMPLATES.md` | ✅ Done |
| 6 | Create `teams/Omni-Services/omni-scheduler.md` | ✅ Done (this run) |
| 7 | Append pitfalls to `teams/Discovery/item-page.md` | ✅ Done (this run) |
| 8 | Update `BATCH_QUEUE.md` rows 8–10 + stats | ✅ Done (this run) |

### Notable Findings

**1. Sequential Fix Detected (Cross-PR Dependency):**
Drafts #8 (CEPG-348108, PR #171966) and #9 (CEPG-330816, PR #166589) both modify `libs/item/product-highlights/src/lib/at-a-glance-content.tsx`. PR #166589 first converted `div→ul/li` and added `tabIndex={0}`, then PR #171966 removed the inadvertent `aria-hidden="true"` and `aria-label` that PR #166589 introduced on the tile content. The two PRs form a sequential fix chain — neither is complete without the other. Cross-references were added to both drafts.

**2. Novel Pattern Identified (Draft #8):**
Root cause: a developer used `aria-label` on a `<div>` with no `role` attribute, expecting it to serve as the sole announcement. Because `<div>` is a generic element, AT silently discards the `aria-label`. The developer then applied `aria-hidden="true"` to all child content to prevent "double announcement" — but with the `aria-label` discarded, only the `aria-hidden` took effect, leaving the tiles completely invisible to screen readers while fully visible on screen. Proposed template ID: `WA11Y-WEB-1.3.1-007`.

**3. Bonus 1.4.3 Find (Draft #10):**
CEPG-330551 also swapped `gray` → `mid-gray` in the `<span>` disclaimer text and `<Link>` element in `ServiceInfo.tsx`. This incidentally fixes a WCAG 1.4.3 contrast failure — pattern already documented in Draft #2 / `WA11Y-ALL-1.4.3-001.md`. Cross-referenced in Draft #10.

---

## Run #2 — 2026-03-20 | Round 1: WCAG 1.1.1 + 1.4.3 + 4.1.2 Swarm (4 tickets)

| Agent | Ticket | Draft | Classification | Team File |
|---|---|---|---|---|
| Agent 1 | CEPG-367463 | #4 | Variation — `WA11Y-WEB-1.1.1-001` | `Transaction/payments-checkout.md` |
| Agent 2 | CEPG-366913 | #5 | Variation — `WA11Y-ALL-1.1.1-001` | `Discovery/item-page.md` |
| Agent 3 | HVCE-13794 | #6 | Variation — `WA11Y-WEB-1.1.1-001` | `Health-Vision/vision-center-orders.md` (new) |
| Agent 4 | CEWMPLUS-144536 | #7 | Variation — `WA11Y-WEB-1.1.1-001` | `Subscriptions/wplus-landing-page.md` (new) |

**Post-mortem note:** Only 1 of 4 agents was truly parallel (CEPG-366913 via Task tool). Agents 1, 3, 4 were synthesized inline from /tmp files. Run #3 corrected this by launching all 3 in a single tool-use block.

---

## Run #1 — 2026-03-20 | Individual Ingestions (3 tickets)

| Ticket | Draft | Classification | Wall-Clock Time | Notes |
|---|---|---|---|---|
| CEPG-337717 | #1 | Novel — `WA11Y-WEB-4.1.2-012` | ~11 min | Protocol violation: `gh` unavailable, full git log grep, Edit tool failure |
| CEPG-355995 | #2 | Variation — `WA11Y-ALL-1.4.3-001` | ~90s | First use of two-step diff script; new `BATCH_QUEUE.md` created |
| BCPA-819 | #3 | Variation — `WA11Y-WEB-1.1.1-001` | ~75s | Storybook-only fix; new `Design-Components/wcp-flag.md` created |

**SKILL.md fix applied after Run #1:** Step 5b updated with `gh pr diff` fast path and two-step `git show --stat` / `git show -- <file>` fallback.

---
