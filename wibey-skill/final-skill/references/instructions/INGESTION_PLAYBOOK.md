# 📖 Batch Ingestion Playbook

*Distilled from 4 swarm runs, 19 tickets, and one forensic telemetry audit. Read this before starting any new batch run.*

---

## ✅ The Ideal Prompt (Copy-Paste Template)

Use this exact phrasing when asking Wibey to run a new batch. Every word in this prompt triggers the right protocol.

```
Hey Wibey, please add these tickets to the batch queue in final-skill/BATCH_QUEUE.md
and run the full swarm ingestion.

Tickets:
| Jira | PR | WCAG hint |
|------|-----|-----------|
| JIRA-XXXXX | #12345 | 1.3.1 Heading Role is Missing |
| JIRA-YYYYY | #67890 | 1.4.3 Text Contrast — gray text |

Target repo: /Users/g0c073y/Desktop/githubs/Walmart-Web-2

CRITICAL EXECUTION RULES:
1. Follow Step 8 Swarm Orchestration from SKILL.md
2. Run the Pre-Flight hash resolution BEFORE spawning any agents
3. Launch ALL agents in a SINGLE tool-use message block
4. Each agent writes ONLY to /tmp/draft-<TICKET_ID>.md (no shared file writes)
5. Run the Bash merge fence ([ -s /tmp/draft-*.md ]) BEFORE merging any results
6. Route each result to the DESTINATION header in the temp file:
   - Existing template found → append to catalyst-templates/web/<ID>.md
   - NOT_FOUND → append to RECOMMENDED_TEMPLATES.md
7. Record the run trace in EXECUTION_LOGS.md (prepend as Run #N)
8. Mark all processed rows ✅ DONE in BATCH_QUEUE.md and update the stats table
```

**Why each rule matters:**
- Rule 2 (pre-flight): Eliminates `git log --grep` from sub-agents — saves 2-3 min per ticket on large monorepos
- Rule 3 (single block): Eliminates parent think-time between agents
- Rule 4 (isolated writes): Prevents merge conflicts on shared files
- Rule 5 (merge fence): Catches silent agent failures before corrupting shared files
- Rule 6 (DESTINATION routing): Run #3 incorrectly dumped all results into `RECOMMENDED_TEMPLATES.md` instead of directly updating catalyst templates

---

## ⚡ Pre-Flight Script (Give This to Wibey Explicitly)

If you want to be sure the pre-flight runs correctly, include this in your prompt:

```
Before spawning any agents, resolve all commit hashes with:

REPO=/Users/g0c073y/Desktop/githubs/Walmart-Web-2
for PR in <PR1> <PR2> <PR3>; do
  HASH=$(git -C $REPO log --all --oneline --grep="$PR" | head -1 | awk '{print $1}')
  echo "$PR => $HASH"
done

Then pass each resolved HASH directly into the sub-agent Task prompt with the instruction:
"The commit hash is already resolved: $HASH. Skip git log entirely. Start from git show --stat."
```

---

## 🚦 Queue Entry Format (Best Practice)

Always include the WCAG hint column. It cuts ~10s per agent by letting `find-template.sh` hit on the first keyword try.

```
| # | Status | Jira | PR | Notes |
|---|---|---|---|---|
| 1 | ⏳ PENDING | JIRA-XXXXX | #12345 | 1.3.1 Heading Role is Missing — WCP Heading no `as` prop |
| 2 | ⏳ PENDING | JIRA-YYYYY | #67890 | 1.4.3 Text Contrast — Tachyons `gray` text on white |
```

Better hint = faster `find-template.sh` keyword match = faster per-agent runtime.

---

## 🧠 Known Template Inventory (Fast Lookup)

Before queuing a ticket, check if we already have coverage. If the template is fleshed out (> 35 lines), only ingest if the fix is architecturally different.

| WCAG | Template ID | What's Covered | Status |
|---|---|---|---|
| 1.1.1 | `WA11Y-WEB-1.1.1-001` | Alt text, `role="img"`, `aria-hidden`, WCP Icon, feature-flag conditional alt, Hero CMS | Rich — 4+ variations |
| 1.3.1 | `WA11Y-WEB-1.3.1-001` | Heading role — `<div>` → h2/h3, WCP `<Heading as>`, `as="h6"` size hack, missing `as`, duplicate h1→h2, Link-in-Heading | Rich — 7 variations |
| 1.3.1 | `WA11Y-WEB-1.3.1-002` | `div` → `ul/li` semantic list structure | Moderate |
| 1.3.1 | `WA11Y-WEB-1.3.1-004` | Radio group `name` / `role="radiogroup"` labelling | 2 variations |
| 1.3.1 | `WA11Y-WEB-1.3.1-007` | `aria-label` on roleless `<div>` is no-op; `aria-hidden` silently wins | **NOVEL — proposed, not yet promoted** |
| 1.4.3 | `WA11Y-ALL-1.4.3-001` | Tachyons `gray` (#777) → `dark-gray`/`mid-gray`; color reference table | 1 variation |
| 1.4.11 | `WA11Y-ALL-1.4.11-001` | Non-text contrast — WCP Rating star stroke (CSS specificity + `stroke: none`) | 1 variation |
| 2.1.1 | `WA11Y-WEB-2.1.1-002` | Non-native `role="button"` missing `tabIndex` + `onKeyDown` | 2 variations |
| 2.1.1 | `WA11Y-WEB-2.1.1-003` | `<Link href="#">` + `role="button"` non-keyboard | 2 variations |
| 2.1.1 | `WA11Y-WEB-2.1.1-004` | LD ProgressIndicator `label` slot traps interactive button | **NOVEL — proposed, not yet promoted** |
| 2.1.2 | `WA11Y-WEB-2.1.2-001` | No Keyboard Trap — 4 sub-patterns: phantom AT node, DatePicker noop, stretched-link, onKeyDown no e.key filter | **NOVEL — 4 sub-pattern drafts in RECOMMENDED_TEMPLATES.md, not yet promoted** |
| 2.4.3 | `WA11Y-WEB-2.4.3-001` | Modal open/close focus return — CSS stamp utility + `useRef<h2>` + rAF | 2 variations |
| 2.4.3 | `WA11Y-WEB-2.4.3-002` | Error alert focus — `role="alert"` + `validationAttemptCounter` dep | 2 variations |
| 2.4.3 | `WA11Y-WEB-2.4.3-003` | Focus loss on conditional slot unmount — synchronous `inputRef.current?.focus()` | 1 variation |
| 2.4.3 | `WA11Y-WEB-2.4.3-004` | General focus order — SPA mount, post-state-change (forwardRef), JSX reorder | 3 variations |
| 2.5.3 | `WA11Y-WEB-2.5.3-001` | Label in Name — pill `aria-label` = visible text only; phantom `aria-label` on decorative icon → `aria-hidden`; View More/Less visible-text-first structure | 2 variations |
| 4.1.2 | `WA11Y-WEB-4.1.2-001` | Missing/incomplete accessible name — `aria-labelledby` multi-part construction; icon-only `InlineButton`; Google Maps `Marker.title` | 3 variations |
| 4.1.2 | `WA11Y-WEB-4.1.2-002` | Inaccurate accessible name — stale brand after CCM-gated rebrand; vague labels → i18n interpolation; `"--"` sentinel → `ValueText` wrapper | 3+ variations |
| 4.1.2 | `WA11Y-WEB-4.1.2-003` | Duplicate CTA names — parameterized `getCtaAriaLabel(productName)` with suppression cases | 1 variation |
| 4.1.2 | `WA11Y-WEB-4.1.2-004` | Wrong role (bidirectional) — `ui-link href=""` or `href="#"` as action-only → `<Button>`; `<Button onClick>` for navigation → add `href` | 3 variations |
| 4.1.2 | `WA11Y-WEB-4.1.2-005` | Missing link role — LD/ui-button always needs `href` for navigation; conditional dual-mode role via runtime state | 3 variations |
| 4.1.2 | `WA11Y-WEB-4.1.2-007` | State not announced (generic) — `aria-disabled={isDisabled}` on buttons where visual CSS/JS hides disabled state | 1 variation |
| 4.1.2 | `WA11Y-WEB-4.1.2-010` | Accordion expanded/collapsed — popup trigger triad: `aria-expanded` + `aria-haspopup` + `aria-controls` | 1 variation |
| 4.1.2 | `WA11Y-WEB-4.1.2-012` | LD Modal `titleId` render-prop pattern | **NOVEL — proposed, not yet promoted** |
| 4.1.2 | `WA11Y-WEB-4.1.2-013` | Static `aria-pressed="false"` never updated → dynamic `aria-label` via `getAriaLabel()` + `checkIsSelected()` | **NOVEL — proposed, not yet promoted** |
| 4.1.3 | `WA11Y-WEB-4.1.3-001` | Status Messages — `aria-live="polite" role="alert"` on WCP `<Alert>`; `aria-live="assertive"` + `useEffect` focus; LD `announceAssertive`+`addSnack` dual-mechanism | 1 variation in template + 2 in RECOMMENDED_TEMPLATES.md |
| 4.1.3 | `WA11Y-WEB-4.1.3-003` | Snackbar messages — `useA11yAnnouncement().announcePolite()` + `setTimeout(1000)` alongside `addSnack()` for async operations | 1 variation |
| 3.2.2 | `WA11Y-WEB-3.2.2-001` | On Input — Tab key branch in `handleKeyDown` commits value via `onChange` → URL navigation + context change | **NOVEL — proposed, not yet promoted** |

---

## 🔍 Known Systemic Grep Opportunities

These patterns are known to appear across many components in `Walmart-Web-2`. Instead of ingesting ticket-by-ticket, run a single grep sprint and fix in bulk.

### 1 — WCP Heading Missing `as` Prop
```bash
# Find every <Heading> usage missing an `as` prop
grep -rn '<Heading' /path/to/repo/libs/ \
  --include="*.tsx" \
  | grep -v 'as=' \
  | grep -v '.stories.' \
  | grep -v '.spec.'
```
**Pattern:** `<Heading size="..." >` or `<Heading UNSAFE_className="...">` with no `as=` prop → add `as="hN"` based on structural context.

### 2 — Tachyons `gray` Text (WCAG 1.4.3)
```bash
grep -rn '\bgray\b' /path/to/repo/libs/ \
  --include="*.tsx" --include="*.ts" \
  | grep 'className' \
  | grep -v 'bg-gray\|border-gray\|fill-gray\|stroke-gray\|hover:gray'
```
**Pattern:** Any `gray` text class → swap to `dark-gray` (large text / icons) or `mid-gray` (body text). See `WA11Y-ALL-1.4.3-001.md` for the full color reference table.

### 3 — Radio `name` Anti-Pattern (per-item unique value)
```bash
grep -rn 'name={' /path/to/repo/libs/ \
  --include="*.tsx" \
  | grep -i 'radio\|Radio'
```
**Pattern:** If `name` is derived from a loop variable (e.g. `name={item.id}`, `name={locale}`, `name={index}`), it's broken. All radios in a group must share one static string.

### 4 — Unlabelled `role="radiogroup"`
```bash
grep -rn 'role="radiogroup"' /path/to/repo/libs/ \
  --include="*.tsx" \
  | grep -v 'aria-labelledby\|aria-label'
```
**Pattern:** Any `role="radiogroup"` without `aria-labelledby` or `aria-label` → add `VisuallyHidden` span + `aria-labelledby`. See `WA11Y-WEB-1.3.1-004.md` Variation 1.

---

## ⚠️ Anti-Patterns That Cause Slow Runs

| Anti-Pattern | Root Cause | Fix |
|---|---|---|
| `git log --all --grep` inside sub-agents | 2-3 min per agent × N agents = 30+ min total | Parent pre-flight resolves all hashes before spawning |
| Full `git show` without `-- <file>` filter | Dumps 500+ line monorepo diffs into agent context | Always use `git show $HASH -- <specific-file>` |
| Launching agents in multiple tool-use messages | Parent think-time between each agent call adds up | Single tool-use block for all agents |
| Sub-agents writing to shared files | Race condition, last-writer-wins corruption | All sub-agents write to `/tmp/draft-<TICKET>.md` only |
| Merging without fence check | Silent agent failure goes undetected | `[ -s /tmp/draft-<TICKET>.md ]` bash check before any merge |
| Dumping all results into `RECOMMENDED_TEMPLATES.md` | Bypasses DESTINATION routing; pollutes staging file | Read `DESTINATION:` header from each temp file first |
| Skipping WCAG examples dual-write (Step 4.5) | Fallback layer has no real code examples; runtime skill produces generic fixes when no template matches | Always write `WCAG_FALLBACK:` header in temp file AND append condensed example to `WCAG-Rules/<criterion>-examples.md` |

---

## 📐 Execution Model Reality

**Wibey runs sub-agents synchronously** (`run_in_background: false` is required by the UI).

- "Single block dispatch" = eliminates parent think-time between agents ✅
- "True parallelism" = NOT possible in Wibey's sync model ❌
- **Wall-clock time = sum of all agent runtimes** (not max)
- **Per-agent time budget target: < 90 seconds**

The only way to reduce total runtime is to minimize per-agent work. Pre-flight hash resolution is the single biggest lever.

**Practical estimates:**
| Batch Size | Optimized (pre-flight) | Unoptimized (git log inside agents) |
|---|---|---|
| 3 tickets | ~4 min | ~30 min |
| 9 tickets | ~12-14 min | ~90 min |
| 10 tickets (cap) | ~15 min | ~100+ min |

---

## 🗂️ Routing Decision Tree

```
Agent finds template in find-template.sh?
├── YES → Is template a skeleton (< 35 lines)?
│   ├── YES → Append variation to catalyst-templates/<platform>/<ID>.md
│   │         AND append condensed example to WCAG-Rules/<criterion>-examples.md (Step 4.5)
│   └── NO  → Is this fix architecturally different?
│       ├── YES → Append variation to catalyst-templates/<platform>/<ID>.md
│       │         AND append condensed example to WCAG-Rules/<criterion>-examples.md (Step 4.5)
│       └── NO  → Mark as SKIP in queue
└── NO  → Template NOT_FOUND
    └── Write full draft to RECOMMENDED_TEMPLATES.md (Step 5b)
         → Propose new template ID: WA11Y-[PLATFORM]-[CRITERION]-NNN
         AND append condensed example to WCAG-Rules/<criterion>-examples.md (Step 4.5)
```

**DESTINATION header in /tmp file:**
```
DESTINATION: final-skill/catalyst-templates/web/WA11Y-WEB-1.3.1-001.md  ← existing template
WCAG_FALLBACK: final-skill/references/WCAG-Rules/1.3.1-examples.md      ← dual-write fallback (Step 4.5)
```
or for novel templates:
```
DESTINATION: final-skill/RECOMMENDED_TEMPLATES.md                         ← new template needed
WCAG_FALLBACK: final-skill/references/WCAG-Rules/2.4.3-examples.md      ← dual-write fallback (Step 4.5)
```

---

## 🏷️ Team Domain → Jira Prefix Mapping

| Domain | Jira Prefix | Known Teams File |
|---|---|---|
| Discovery / Item Page | `CEPG-`, `GPUGC-`, `OAMD-` | `teams/Discovery/item-page.md` |
| Discovery / Search | `A11Y-US-Team-Search`, `OAMFD-` | `teams/Discovery/search.md` |
| Transaction / Payments + GIC | `CEPG-` | `teams/Transaction/payments-checkout.md` |
| Accounts / Identity | `WSC-` | `teams/Accounts/identity-next.md` |
| Accounts / Orders | `CEPG-` | `teams/Accounts/order-history.md` |
| Accounts / Protection Plans | `CEPG-` | `teams/Accounts/protection-plans.md` |
| Marketplace / MQD | `CEPG-` | `teams/Marketplace/mqd-modal.md` |
| Health & Vision | `HVCE-` | `teams/Health-Vision/vision-center-orders.md` |
| Subscriptions / W+ | `CEWMPLUS-` | `teams/Subscriptions/wplus-landing-page.md` |
| Subscriptions / Manage Optimizations | `CRUISE-` | `teams/Subscriptions/manage-optimizations.md` |
| Post-Transaction / Reviewer Community | `CEPG-` | `teams/Post-Transaction/reviewer-community.md` |
| Omni / Services | `CEPG-` | `teams/Omni-Services/omni-scheduler.md` |
| Health & Vision / Pharmacy | `PGSPHARM-` | `teams/Health-Vision/pharmacy.md` |
| Design Components | `BCPA-` | `teams/Design-Components/wcp-flag.md` |
| Customer Care | `WSC-` | `teams/Customer-Care/` |
| Fulfillment | — | `teams/Fulfillment/` |
| International (Canada/Mexico) | `INTX-` | `teams/International/canada.md`, `teams/International/mexico.md` |

> ⚠️ `CEPG-` is used across multiple domains. Use the PR file path (`libs/<team>/...`) as the true domain signal, not the Jira prefix alone.

---

## 🔢 Run History Quick Reference

| Run | Tickets | WCAG | Novel | Variations | Key Protocol Fix |
|---|---|---|---|---|---|
| Run #1 | 3 | 4.1.2, 1.4.3, 1.1.1 | 1 | 2 | Discovered `gh` unavailable; fixed Step 5b two-step diff |
| Run #2 | 4 | 1.1.1, 4.1.2 | 0 | 4 | First swarm; only 1/4 agents truly parallel (fixed in Run #3) |
| Run #3 | 3 | 1.3.1 | 1 | 2 | True single-block dispatch; sequential fix chain detected |
| Run #4 | 9 | 1.3.1×7, 4.1.2, 1.4.11 | 0 | 9 | Pre-flight hash resolution; first run of optimized protocol |
| Run #5 | 8 | 2.1.1×4, 2.4.3×4 | 1 | 7 | New WCAG criteria (2.1.1, 2.4.3); GPUGC prefix mapped; LD slot trap novel pattern |
| Run #6 | 9 | 2.1.2×4, 2.4.3×3, 1.3.1×2 | 4 | 5 | First 2.1.2 templates (4 sub-patterns); 3 new prefixes (OAMFD-, OAMD-, CRUISE-); 2 new team files |
| Run #7 | 9 | 2.5.3×2, 4.1.2×7 | 0 | 9 | New Pharmacy domain (PGSPHARM-); Google Maps Marker title pattern; BNPL rebrand ARIA surface audit rule; ValueText `"--"` sentinel; parameterized `getCtaAriaLabel()` |
| Run #8 | 9 | 4.1.2×7, 4.1.3×2 | 2 | 7 | First 4.1.3 templates (WA11Y-WEB-4.1.3-001); `ui-button` polymorphic role rule; `aria-disabled` vs `disabled`; static `aria-pressed` bug class; accordion triad pattern |
| Run #9 | 2 | 4.1.3×2 | 0 | 2 | LD `useA11yAnnouncement` dual-mechanism (assertive+snack); `announcePolite`+`setTimeout(1000)` for async snackbars |
| Run #10 | 3 | 3.2.2×1, 1.3.1×2 | 3 | 0 | First 3.2.2 template (WA11Y-WEB-3.2.2-001); WA11Y-WEB-1.3.1-007 Var 2+3 validated for promotion; new International domain (INTX-) |
| **Total** | **59** | — | **13** | **46** | |

---

*Last updated: 2026-03-24 after Run #10*
