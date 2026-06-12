# 🚀 Accessibility Ingestion Batch Queue

This file is the **intake manifest** for batch ingestion runs. Add Jira + PR pairs to the queue below. When you're ready to process, tell Wibey in YOLO mode:

> **"Hey Wibey, run the full batch queue in BATCH_QUEUE.md"**

Wibey will launch one parallel sub-agent per ticket simultaneously. Each agent runs the complete Step 5b Ingestion Protocol (two-step diff, find-template.sh, RECOMMENDED_TEMPLATES.md append, self-doc loop) and returns a summary. Total runtime ≈ max(single ticket time) regardless of queue size.

---

## 📋 Queue Legend

| Status | Meaning |
|---|---|
| ⏳ `PENDING` | Not yet processed |
| ✅ `DONE` | Ingested — see `RECOMMENDED_TEMPLATES.md` |
| ⚠️ `SKIP` | Duplicate / already covered by existing template |
| ❌ `FAILED` | Error during ingestion — needs manual review |

---

## 🗂️ Queue

| # | Status | Jira | PR | Notes |
|---|---|---|---|---|
| 1 | ✅ DONE | [CEPG-337717](https://jira.walmart.com/browse/CEPG-337717) | [#180471](https://gecgithub01.walmart.com/walmart-web/walmart/pull/180471) | LD Modal titleId render-prop → Draft #1 |
| 2 | ✅ DONE | [CEPG-355995](https://jira.walmart.com/browse/CEPG-355995) | [#175800](https://gecgithub01.walmart.com/walmart-web/walmart/pull/175800) | Tachyons gray→dark-gray → Draft #2 |
| 3 | ✅ DONE | [BCPA-819](https://jira.walmart.com/browse/BCPA-819) | [#173407](https://gecgithub01.walmart.com/walmart-web/walmart/pull/173407) | WCP Icon role="img"+aria-label → Draft #3 |
| 4 | ✅ DONE | [CEPG-367463](https://jira.walmart.com/browse/CEPG-367463) | [#181218](https://gecgithub01.walmart.com/walmart-web/walmart/pull/181218) | Feature-flag conditional alt → Draft #4 |
| 5 | ✅ DONE | [CEPG-366913](https://jira.walmart.com/browse/CEPG-366913) | [#181094](https://gecgithub01.walmart.com/walmart-web/walmart/pull/181094) | i18n oneLoans inaccurate name → Draft #5 |
| 6 | ✅ DONE | [HVCE-13794](https://jira.walmart.com/browse/HVCE-13794) | [#177550](https://gecgithub01.walmart.com/walmart-web/walmart/pull/177550) | Decorative Store icon aria-hidden → Draft #6 |
| 7 | ✅ DONE | [CEWMPLUS-144536](https://jira.walmart.com/browse/CEWMPLUS-144536) | [#175481](https://gecgithub01.walmart.com/walmart-web/walmart/pull/175481) | Hero img alt="" + tabIndex removal → Draft #7 |
| 8 | ✅ DONE | [CEPG-348108](https://jira.walmart.com/browse/CEPG-348108) | [#171966](https://gecgithub01.walmart.com/walmart-web/walmart/pull/171966) | 1.3.1 aria-hidden on visible list content — NOVEL → Draft #8 |
| 9 | ✅ DONE | [CEPG-330816](https://jira.walmart.com/browse/CEPG-330816) | [#166589](https://gecgithub01.walmart.com/walmart-web/walmart/pull/166589) | 1.3.1 div→ul/li At-a-Glance tiles → Draft #9 |
| 10 | ✅ DONE | [CEPG-330551](https://jira.walmart.com/browse/CEPG-330551) | [#156721](https://gecgithub01.walmart.com/walmart-web/walmart/pull/156721) | 1.3.1 Oil Package services list + bonus 1.4.3 gray → Draft #10 |
| 11 | ✅ DONE | [HVCE-13625](https://jira.walmart.com/browse/HVCE-13625) | [#176121](https://gecgithub01.walmart.com/walmart-web/walmart/pull/176121) | 1.3.1 WCP Heading missing `as` prop → `WA11Y-WEB-1.3.1-001` Var 1 |
| 12 | ✅ DONE | [CEPG-353780](https://jira.walmart.com/browse/CEPG-353780) | [#172800](https://gecgithub01.walmart.com/walmart-web/walmart/pull/172800) | 1.3.1 `<div class="b">` → h2/h3/h4 in MQD modal → `WA11Y-WEB-1.3.1-001` Var 2 |
| 13 | ✅ DONE | [CEPG-344616](https://jira.walmart.com/browse/CEPG-344616) | [#166718](https://gecgithub01.walmart.com/walmart-web/walmart/pull/166718) | 1.3.1 Heading `as="h6"` size hack → `as="h3"` → `WA11Y-WEB-1.3.1-001` Var 3 |
| 14 | ✅ DONE | [CEPG-344615](https://jira.walmart.com/browse/CEPG-344615) | [#167215](https://gecgithub01.walmart.com/walmart-web/walmart/pull/167215) | 1.3.1 `<div>` → `<Heading as="h2">` Order Item Tile → `WA11Y-WEB-1.3.1-001` Var 4 |
| 15 | ✅ DONE | [CEPG-340974](https://jira.walmart.com/browse/CEPG-340974) | [#164018](https://gecgithub01.walmart.com/walmart-web/walmart/pull/164018) | 1.3.1 `<div>` → `<h3>` direct-spends subtitle → `WA11Y-WEB-1.3.1-001` Var 5 |
| 16 | ✅ DONE | [CEPG-330702](https://jira.walmart.com/browse/CEPG-330702) | [#163703](https://gecgithub01.walmart.com/walmart-web/walmart/pull/163703) | 1.3.1 `role="radiogroup"` unlabelled → VisuallyHidden+aria-labelledby → `WA11Y-WEB-1.3.1-004` Var 1 |
| 17 | ✅ DONE | [WSC-3897](https://jira.walmart.com/browse/WSC-3897) | [#158092](https://gecgithub01.walmart.com/walmart-web/walmart/pull/158092) | 1.3.1 Radio `name={loc}` unique per-item → `name="selectLanguage"` → `WA11Y-WEB-1.3.1-004` Var 2 |
| 18 | ✅ DONE | [CEPG-340528](https://jira.walmart.com/browse/CEPG-340528) | [#163460](https://gecgithub01.walmart.com/walmart-web/walmart/pull/163460) | 4.1.2 Incomplete aria-labelledby omits price node → `WA11Y-WEB-4.1.2-001` Var 1 |
| 19 | ✅ DONE | [BCPA-821](https://jira.walmart.com/browse/BCPA-821) | [#173994](https://gecgithub01.walmart.com/walmart-web/walmart/pull/173994) | 1.4.11 Star stroke CSS specificity + stroke:none fix → `WA11Y-ALL-1.4.11-001` Var 1 |
| 20 | ✅ DONE | [CEPG-340591](https://jira.walmart.com/browse/CEPG-340591) | [#163616](https://gecgithub01.walmart.com/walmart-web/walmart/pull/163616) | 2.1.1 Icon `role="button"` missing `tabIndex`+`onKeyDown` → `WA11Y-WEB-2.1.1-002` Var 1 |
| 21 | ✅ DONE | [CEPG-330695](https://jira.walmart.com/browse/CEPG-330695) | [#161703](https://gecgithub01.walmart.com/walmart-web/walmart/pull/161703) | 2.1.1 `<Link role="button">` missing `tabIndex`+`onKeyDown` → `WA11Y-WEB-2.1.1-002` Var 2 |
| 22 | ✅ DONE | [CEPG-341082](https://jira.walmart.com/browse/CEPG-341082) | [#163959](https://gecgithub01.walmart.com/walmart-web/walmart/pull/163959) | 2.1.1 `<Link href="#">`+`role="button"` non-keyboard → `WA11Y-WEB-2.1.1-003` Var 2 |
| 23 | ✅ DONE | [CEPG-340199](https://jira.walmart.com/browse/CEPG-340199) | [#163581](https://gecgithub01.walmart.com/walmart-web/walmart/pull/163581) | 2.1.1 LD ProgressIndicator `label` slot traps button — NOVEL → Draft `WA11Y-WEB-2.1.1-004` |
| 24 | ✅ DONE | [CEPG-367778](https://jira.walmart.com/browse/CEPG-367778) | [#181887](https://gecgithub01.walmart.com/walmart-web/walmart/pull/181887) | 2.4.3 `addClassToEventTargetElement` modal trigger → `WA11Y-WEB-2.4.3-001` Var 1 |
| 25 | ✅ DONE | [CEPG-339304](https://jira.walmart.com/browse/CEPG-339304) | [#163562](https://gecgithub01.walmart.com/walmart-web/walmart/pull/163562/files) | 2.4.3 Cart AOS panel `useRef<h2>`+`rAF focus` → `WA11Y-WEB-2.4.3-001` Var 2 |
| 26 | ✅ DONE | [GPUGC-24707](https://jira.walmart.com/browse/GPUGC-24707) | [#170008](https://gecgithub01.walmart.com/walmart-web/walmart/pull/170008) | 2.4.3 Error alert counter-dep focus pattern → `WA11Y-WEB-2.4.3-002` Var 2 |
| 27 | ✅ DONE | [BCPA-822](https://jira.walmart.com/browse/BCPA-822) | [#173829](https://gecgithub01.walmart.com/walmart-web/walmart/pull/173829) | 2.4.3 WCP SearchBar ClearButton unmount focus loss → `WA11Y-WEB-2.4.3-003` Var 1 |
| 28 | ✅ DONE | [CEPG-341100](https://jira.walmart.com/browse/CEPG-341100) | [#164426](https://gecgithub01.walmart.com/walmart-web/walmart/pull/164426) | 2.4.3 page-mount SPA focus: `tabIndex={-1}` wrapper + `useRef` + `useEffect` on mount → `WA11Y-WEB-2.4.3-004` Var 1 |
| 29 | ✅ DONE | [CEPG-338329](https://jira.walmart.com/browse/CEPG-338329) | [#165684](https://gecgithub01.walmart.com/walmart-web/walmart/pull/165684) | 2.4.3 post-state-change focus: `forwardRef` + `tabIndex={-1}` + flag + `useEffect` → `WA11Y-WEB-2.4.3-004` Var 2 |
| 30 | ✅ DONE | [CEPG-306542](https://jira.walmart.com/browse/CEPG-306542) | [#142253](https://gecgithub01.walmart.com/walmart-web/walmart/pull/142253) | 2.4.3 pure JSX reorder (GIC DrawerBottom before Button) → `WA11Y-WEB-2.4.3-004` Var 3 |
| 31 | ✅ DONE | [OAMFD-10325](https://jira.walmart.com/browse/OAMFD-10325) | [#175430](https://gecgithub01.walmart.com/walmart-web/walmart/pull/175430) | 2.1.2 phantom AT node: `aria-selected` on roleless span → `aria-hidden="true"` fix — NOVEL → Draft `WA11Y-WEB-2.1.2-001` |
| 32 | ✅ DONE | [PR only — no Jira](https://gecgithub01.walmart.com/walmart-web/walmart/pull/161559) | [#161559](https://gecgithub01.walmart.com/walmart-web/walmart/pull/161559) | 2.1.2 LD DatePicker `isOpen` hardcoded + `noop` callbacks → `useState` controlled — NOVEL → Draft `WA11Y-WEB-2.1.2-001` |
| 33 | ✅ DONE | [CEPG-335619](https://jira.walmart.com/browse/CEPG-335619) | [#166765](https://gecgithub01.walmart.com/walmart-web/walmart/pull/166765) | 2.1.2 stretched-link pattern + remove spurious `tabIndex={0}` from containers — NOVEL → Draft `WA11Y-WEB-2.1.2-001` |
| 34 | ✅ DONE | [OAMD-7124](https://jira.walmart.com/browse/OAMD-7124) | [#121820](https://gecgithub01.walmart.com/walmart-web/walmart/pull/121820) | 2.1.2 `onKeyDown` fires on Tab (no `e.key` filter) → remove `onKeyDown` — NOVEL → Draft `WA11Y-WEB-2.1.2-001` |
| 35 | ✅ DONE | [CEPG-341113](https://jira.walmart.com/browse/CEPG-341113) | [#166628](https://gecgithub01.walmart.com/walmart-web/walmart/pull/166628) | 1.3.1 WCP `<Heading>` missing `as` prop + `<Link>` nested in heading → `WA11Y-WEB-1.3.1-001` Var 6 |
| 36 | ✅ DONE | [CRUISE-16221](https://jira.walmart.com/browse/CRUISE-16221) | [#161792](https://gecgithub01.walmart.com/walmart-web/walmart/pull/161792) | 1.3.1 duplicate `as="h1"` in sub-section containers → `as="h2"` → `WA11Y-WEB-1.3.1-001` Var 7 |
| 37 | ✅ DONE | [GPUGC-22861](https://jira.walmart.com/browse/GPUGC-22861) | [#160850](https://gecgithub01.walmart.com/walmart-web/walmart/pull/160850) | 2.5.3 pill aria-label = visible text only + View More/Less visible-text-first → `WA11Y-WEB-2.5.3-001` Var 1 |
| 38 | ✅ DONE | [CEPG-330592](https://jira.walmart.com/browse/CEPG-330592) | [#156721](https://gecgithub01.walmart.com/walmart-web/walmart/pull/156721) | 2.5.3 phantom aria-label on decorative icon/image → `aria-hidden="true"` → `WA11Y-WEB-2.5.3-001` Var 2 |
| 39 | ✅ DONE | [CRUISE-17627](https://jira.walmart.com/browse/CRUISE-17627) | [#174225](https://gecgithub01.walmart.com/walmart-web/walmart/pull/174225) | 4.1.2 icon-only InlineButton missing aria-label, Subscriptions/avoid-fee-heading → `WA11Y-WEB-4.1.2-001` Var 2 |
| 40 | ✅ DONE | [CEPG-337758](https://jira.walmart.com/browse/CEPG-337758) | [#165691](https://gecgithub01.walmart.com/walmart-web/walmart/pull/165691) | 4.1.2 Google Maps Marker `title` as accessible name + state in `<p>` aria-label → `WA11Y-WEB-4.1.2-001` Var 3 |
| 41 | ✅ DONE | [CEPG-366918](https://jira.walmart.com/browse/CEPG-366918) | [#180582](https://gecgithub01.walmart.com/walmart-web/walmart/pull/180582) | 4.1.2 stale BNPL brand in aria-label after rebrand → CCM-gated new locale key → `WA11Y-WEB-4.1.2-002` Var |
| 42 | ✅ DONE | [CEPG-344607](https://jira.walmart.com/browse/CEPG-344607) | [#166541](https://gecgithub01.walmart.com/walmart-web/walmart/pull/166541) | 4.1.2 3× vague Protection Plans labels → i18n interpolated with planTitle/headerTitle → `WA11Y-WEB-4.1.2-002` Var |
| 43 | ✅ DONE | [CEPG-330515](https://jira.walmart.com/browse/CEPG-330515) | [#158467](https://gecgithub01.walmart.com/walmart-web/walmart/pull/158467) | 4.1.2 Pharmacy "--" sentinel → `ValueText` + aria-label="Empty" + aria-hidden inner → `WA11Y-WEB-4.1.2-002` Var 1 |
| 44 | ✅ DONE | [CEPG-330515](https://jira.walmart.com/browse/CEPG-330515) | [#157006](https://gecgithub01.walmart.com/walmart-web/walmart/pull/157006) | 4.1.2 duplicate CTA names in ProductPromo → parameterized `getCtaAriaLabel()` + productName → `WA11Y-WEB-4.1.2-003` Var |
| 45 | ✅ DONE | [PGSPHARM-51056](https://jira.walmart.com/browse/PGSPHARM-51056) | [#149879](https://gecgithub01.walmart.com/walmart-web/walmart/pull/149879) | 4.1.2 `ui-link href=""` used as button → `<Button variant="tertiary">`, Pharmacy ConsentModal → `WA11Y-WEB-4.1.2-004` Var 1 |
| 46 | ✅ DONE | [CEPG-337572](https://jira.walmart.com/browse/CEPG-337572) | [#161148](https://gecgithub01.walmart.com/walmart-web/walmart/pull/161148) | 4.1.2 Role: Button Role is Missing → `ui-link href="#"` text-expander → `<Button variant="tertiary">` in GComm RecipeDescription → `WA11Y-WEB-4.1.2-004` Var 2 |
| 47 | ✅ DONE | [CEPG-341096](https://jira.walmart.com/browse/CEPG-341096) | [#166022](https://gecgithub01.walmart.com/walmart-web/walmart/pull/166022) | 4.1.2 Role: Link Role is Missing → conditional dual-mode `exitRole` (button|link) in TaxEntryNav → `WA11Y-WEB-4.1.2-005` Var 3 |
| 48 | ✅ DONE | [CEPG-330761](https://jira.walmart.com/browse/CEPG-330761) | [#156900](https://gecgithub01.walmart.com/walmart-web/walmart/pull/156900) | 4.1.2 Role: Link Role is Missing → `<Button>` navigation CTA missing `href` → `<Button href={redirectUrl}>` in thankyou-generic-banner → `WA11Y-WEB-4.1.2-004` Var 3 |
| 49 | ✅ DONE | [WSC-4050](https://jira.walmart.com/browse/WSC-4050) | [#165320](https://gecgithub01.walmart.com/walmart-web/walmart/pull/165320) | 4.1.2 Role: Generic Interactive Role is Missing → LD Button missing `href={signInUrl}` in global-header desktop flyout + mobile menu → `WA11Y-WEB-4.1.2-005` Var 2 |
| 50 | ✅ DONE | [CEPG-337628](https://jira.walmart.com/browse/CEPG-337628) | [#164835](https://gecgithub01.walmart.com/walmart-web/walmart/pull/164835) | 4.1.2 State: State Information Not Announced → `aria-disabled={isDisabled}` on Auto Care Center workflow list buttons → `WA11Y-WEB-4.1.2-007` Var 1 |
| 51 | ✅ DONE | [CEPG-337392](https://jira.walmart.com/browse/CEPG-337392) | [#161195](https://gecgithub01.walmart.com/walmart-web/walmart/pull/161195) | 4.1.2 State: Toggle Button Pressed/Not Pressed → hardcoded `aria-pressed="false"` on service-type selector → dynamic `aria-label` via `getAriaLabel()` + `checkIsSelected()` — NOVEL → `WA11Y-WEB-4.1.2-013` |
| 52 | ✅ DONE | [CRUISE-16218](https://jira.walmart.com/browse/CRUISE-16218) | [#161792](https://gecgithub01.walmart.com/walmart-web/walmart/pull/161792) | 4.1.2 State: Accordion Expanded/Collapsed → popup menu trigger missing `aria-expanded`/`aria-haspopup`/`aria-controls` in SubscriptionItemsOption → `WA11Y-WEB-4.1.2-010` Var 1 |
| 53 | ✅ DONE | [CEPG-335616](https://jira.walmart.com/browse/CEPG-335616) | [#164343](https://gecgithub01.walmart.com/walmart-web/walmart/pull/164343) | 4.1.3 Status Message: Success Messages → `aria-live="polite" role="alert"` on WCP `<Alert variant="success">` in manage-dashboard — NOVEL → `WA11Y-WEB-4.1.3-001` Var 1 (first 4.1.3 template) |
| 54 | ✅ DONE | [HVCE-12342](https://jira.walmart.com/browse/HVCE-12342) | [#163872](https://gecgithub01.walmart.com/walmart-web/walmart/pull/163872) | 4.1.3 Status Message: Success Messages → `aria-live="assertive"` + `useEffect` focus hook on VTO InformationCard for face-scan status — NOVEL → `WA11Y-WEB-4.1.3-001` Var 2 |
| 55 | ✅ DONE | [GPUGC-21456](https://jira.walmart.com/browse/GPUGC-21456) | [#157085](https://gecgithub01.walmart.com/walmart-web/walmart/pull/157085) | 4.1.3 Status Message → LD `announceAssertive()` + `addSnack()` dual-mechanism in `ReviewList.onSuccess` (reviewer-community delete draft) → `WA11Y-WEB-4.1.3-001` Var 3 |
| 56 | ✅ DONE | [CEPG-338731](https://jira.walmart.com/browse/CEPG-338731) | [#166745](https://gecgithub01.walmart.com/walmart-web/walmart/pull/166745) | 4.1.3 Status Message: Snackbar → `useA11yAnnouncement().announcePolite()` + 1s `setTimeout` alongside `addSnack()` in cart deal-recommendation → `WA11Y-WEB-4.1.3-003` Var 1 |
| 57 | ✅ DONE | [INTX-17877](https://jira.walmart.com/browse/INTX-17877) | [#179062](https://gecgithub01.walmart.com/walmart-web/walmart/pull/179062) | 3.2.2 On Input — `Tab` key branch in RangeSlider `handleKeyDown` committed value via `onChange` → URL navigation + popover collapse; removed Tab branch to restore native focus-move behavior — NOVEL → `WA11Y-WEB-3.2.2-001` |
| 58 | ✅ DONE | [INTX-17645](https://jira.walmart.com/browse/INTX-17645) | [#179293](https://gecgithub01.walmart.com/walmart-web/walmart/pull/179293) | 1.3.1 `aria-label` on `<li>` + `aria-hidden` on children in PolicyLine (Canada en-CA/fr-CA) — NOVEL Var 2 → `WA11Y-WEB-1.3.1-007` |
| 59 | ✅ DONE | [INTX-18110](https://jira.walmart.com/browse/INTX-18110) | [#179293](https://gecgithub01.walmart.com/walmart-web/walmart/pull/179293) | 1.3.1 same `aria-label` on `<li>` + `aria-hidden` anti-pattern in PolicyLine (Mexico es-MX) — NOVEL Var 3 → `WA11Y-WEB-1.3.1-007` |
| 60 | ✅ DONE | [PGSPHARM-49831](https://jira.walmart.com/browse/PGSPHARM-49831) | [#183288](https://gecgithub01.walmart.com/walmart-web/walmart/pull/183288) | 4.1.3 Filter cleared announcement via `WcpVisuallyHidden` + `aria-live` + `setTimeout` debounce → `WA11Y-WEB-4.1.3-001` Var enrichment |
| 61 | ✅ DONE | *(no Jira)* | [#183468](https://gecgithub01.walmart.com/walmart-web/walmart/pull/183468) | 1.1.1 Icon `aria-label` → `aria-hidden` + `WcpVisuallyHidden` group label (Marketplace About Seller / Opening Hours + Location icons) — NOVEL Var 1 → `WA11Y-WEB-1.1.1-003` |
| 62 | ✅ DONE | [PGSPHARM-59277](https://jira.walmart.com/browse/PGSPHARM-59277) | [#182869](https://gecgithub01.walmart.com/walmart-web/walmart/pull/182869) | 4.1.3 Search result count via inline `aria-live="assertive"` + `blur()`→`focus()` cycle (replaces off-screen `left:-9999px` hack) → `WA11Y-WEB-4.1.3-001` Var enrichment |
| 63 | ✅ DONE | *(no Jira)* | *(commit a2061a9e6fc)* | **NEW CRITERION 1.3.3** Strikethrough pricing `text-decoration:line-through` has no AT alternative → `WcpVisuallyHidden` "Was/Now" prefix + `aria-hidden` on visual span — NOVEL → `WA11Y-WEB-1.3.3-001` (first-ever 1.3.3 template) |

---

## 📱 iOS Queue

| # | Status | Jira | PR | Notes |
|---|---|---|---|---|
| 1 | ✅ DONE | [COMM-1808](https://jira.walmart.com/browse/COMM-1808) | [#155389](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/155389) | 2.4.3 VoiceOver focus jumps to top after add/remove photo — `reloadData()` → `performBatchUpdates()` + `UIAccessibility.layoutChanged` focus targeting — NOVEL → `WA11Y-IOS-2.4.3-001` |
| 2 | ✅ DONE | [WSC-1658](https://jira.walmart.com/browse/WSC-1658) | [#45513](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/45513) | 1.4.4 Dynamic Type — GlobalBanner horizontal→manual layout + `traitCollectionDidChange` reflow + adaptive spacing (DT-004, DT-006) — NOVEL → `WA11Y-IOS-1.4.4-001` Var 1 |
| 3 | ✅ DONE | [WSC-1657](https://jira.walmart.com/browse/WSC-1657) | [#45516](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/45516) | 1.4.4 Dynamic Type — Queue timer fixed-width removal + `UIScrollView` wrapping (DT-004, DT-005) → `WA11Y-IOS-1.4.4-001` Var 2 |
| 4 | ✅ DONE | [WSC-578](https://jira.walmart.com/browse/WSC-578) | [#50077](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/50077) | 1.4.4 Dynamic Type — ProductList price: `UILabel`→`LDLabel` + compression resistance + adaptive spacing (DT-003, DT-004, DT-007) → `WA11Y-IOS-1.4.4-001` Var 3 |
| 5 | ✅ DONE | [OAMD-5080](https://jira.walmart.com/browse/OAMD-5080) | [#63646](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/63646) | 1.4.4 Dynamic Type — eBooks: `adjustsFontForContentSizeCategory` + `numberOfLines=0` + proportional width constraints (DT-002, DT-003, DT-004) → `WA11Y-IOS-1.4.4-001` Var 4 |
| 6 | ✅ DONE | [CEPG-343560](https://jira.walmart.com/browse/CEPG-343560) | [#142350](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/142350) | 1.1.1 Alt Text — OnePay Later banner `WCPImageView` no label, container swallows children → `WA11Y-IOS-1.1.1-001` Var 1 |
| 7 | ✅ DONE | [CRUISE-16235](https://jira.walmart.com/browse/CRUISE-16235) | [#137727](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/137727) | 1.1.1 Alt Text — SwiftUI `Image` accidentally `accessibilityHidden(true)` on View Subscriptions screen → `WA11Y-IOS-1.1.1-001` Var 2 |
| 8 | ✅ DONE | [CRUISE-16210](https://jira.walmart.com/browse/CRUISE-16210) | [#137732](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/137732) | 1.1.1 Alt Text — `UIImageView` + `UILabel` split elements; container `accessibilityLabel` combines both → `WA11Y-IOS-1.1.1-001` Var 3 |
| 9 | ✅ DONE | [GPUGC-23161](https://jira.walmart.com/browse/GPUGC-23161) | [#137811](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/137811) | 1.3.1 Element Grouping — "Free items remaining: X items" split labels; `isAccessibilityElement = true` on container + dynamic `accessibilityLabel` — NOVEL → `WA11Y-IOS-1.3.1-001` (founding) |
| 10 | ✅ DONE | [CEPG-330737](https://jira.walmart.com/browse/CEPG-330737) | [#137770](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/137770) | 1.3.1 Element Grouping — PHTS plan card: over-grouping silenced "Details" button; `accessibilityElements = [summaryContainer, detailsButton]` → `WA11Y-IOS-1.3.1-001` Var 2 |
| 11 | ✅ DONE | [CEPG-330734](https://jira.walmart.com/browse/CEPG-330734) | [#138640](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/138640) | 1.3.1 Element Grouping — `UITableViewCell` with 4 plan sub-labels; override `accessibilityLabel` to compose single sentence → `WA11Y-IOS-1.3.1-001` Var 3 |
| 12 | ✅ DONE | [CEPG-340598](https://jira.walmart.com/browse/CEPG-340598) | [#139305](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/139305) | 4.1.2 Role: Button Role — custom `UIView` + `UITapGestureRecognizer` missing `accessibilityTraits = .button` — NOVEL → `WA11Y-IOS-4.1.2-001` (founding) |
| 13 | ✅ DONE | [CEPG-339158](https://jira.walmart.com/browse/CEPG-339158) | [#138162](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/138162) | 4.1.2 Role: Button Role — `UICollectionViewCell` override `accessibilityTraits` getter: `isSelected ? [.button, .selected] : .button` → `WA11Y-IOS-4.1.2-001` Var 2 |
| 14 | ✅ DONE | [CEPG-355941](https://jira.walmart.com/browse/CEPG-355941) | [#137541](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/137541) | 4.1.2 Name: Missing Accessible Name — icon-only `UIButton` no `accessibilityLabel`; set localized label + hint — NOVEL → `WA11Y-IOS-4.1.2-002` (founding) |
| 15 | ✅ DONE | [CEPG-296542](https://jira.walmart.com/browse/CEPG-296542) | [#116120](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/116120) | 4.1.2 State: Expanded/Collapsed — FAQ header `accessibilityValue = "expanded"/"collapsed"` + `.layoutChanged` notification — NOVEL → `WA11Y-IOS-4.1.2-003` (founding) |
| 16 | ✅ DONE | [CEPG-332823](https://jira.walmart.com/browse/CEPG-332823) | [#137713](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/137713) | 4.1.3 Status Message — `UIAccessibility.post(.announcement)` + `asyncAfter(0.1s)` + `DispatchWorkItem` debounce for filter count — NOVEL → `WA11Y-IOS-4.1.3-001` (founding) |
| 17 | ✅ DONE | [GPUGC-21403](https://jira.walmart.com/browse/GPUGC-21403) | [#135495](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/135495) | 4.1.3 Status Message — `WCPSnackbar` title+subtitle combined + `asyncAfter(0.5s)` + `accessibilityViewIsModal = false` → `WA11Y-IOS-4.1.3-001` Var 2 |
| 18 | ✅ DONE | [GPUGC-23160](https://jira.walmart.com/browse/GPUGC-23160) | [#139729](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/139729) | 1.4.3 Contrast — Sampling browse `UITextField` placeholder fails 4.5:1; `attributedPlaceholder` + `WCPColor.gray6` — NOVEL → `WA11Y-IOS-1.4.3-001` (founding) |
| 19 | ✅ DONE | [CEPG-352365](https://jira.walmart.com/browse/CEPG-352365) | [#147441](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/147441) | 1.4.11 Non-text Contrast — W+ BEN Fuel grey `UIActivityIndicatorView` over background image; white spinner + scrim — NOVEL → `WA11Y-IOS-1.4.11-001` (founding) |
| 20 | ✅ DONE | [CEPG-344504](https://jira.walmart.com/browse/CEPG-344504) | [#142246](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/142246) | 1.4.11 Non-text Contrast — PHTS Purchase Plan `CAShapeLayer` white stroke on white; `WCPColor.blue1` fix → `WA11Y-IOS-1.4.11-001` Var 2 |
| 21 | ✅ DONE | [COMM-1813](https://jira.walmart.com/browse/COMM-1813) | [#154214](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/154214) | 2.5.3 Label in Name — `WcpQuantityStepper` "Add to registry" missing quantity in `accessibilityLabel` — NOVEL → `WA11Y-IOS-2.5.3-001` (founding) |
| 22 | ✅ DONE | [PGSPHARM-59761](https://jira.walmart.com/browse/PGSPHARM-59761) | [#43278](https://gecgithub01.walmart.com/walmart-web/walmart/pull/43278) | 4.1.2 Accessibility Not Enabled — "View Authorization" button absorbed by `isAccessibilityElement = true` container; `accessibilityElements = [switch, button]` fix — NOVEL → `WA11Y-IOS-4.1.2-004` (founding) |
| 23 | ✅ DONE | [CECPRO-31015](https://jira.walmart.com/browse/CECPRO-31015) | [#145602](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/145602) | 4.1.2 Link Role Missing — "Privacy Notice" link absorbed by paragraph `UILabel`; `UIAccessibilityCustomAction` + `UITextView` NSLinkAttributeName alternative — NOVEL → `WA11Y-IOS-4.1.2-005` (founding) |
| 24 | ✅ DONE | [PGSPHARM-55747](https://jira.walmart.com/browse/PGSPHARM-55747) | [#140485](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/140485) | 2.4.3 Stale accessibility tree in nudge/notification view — Edit button skipped on 2nd+ update + CTA container focus trap; `accessibilityElements` ordering + `UIAccessibility.post(.layoutChanged)` fix — NOVEL → `WA11Y-IOS-2.4.3-002` (founding) |
| 25 | ✅ DONE | [CEPG-340674](https://jira.walmart.com/browse/CEPG-340674) | [#139253](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/139253) | 4.1.2 Custom-drawn signature view not focusable/announced — `isAccessibilityElement = true` + `accessibilityLabel = "Signature generated, it says \(name), in cursive text"` + `.staticText` trait — NOVEL → `WA11Y-IOS-4.1.2-006` (founding) |
| 26 | ✅ DONE | [CELISTS-30299](https://jira.walmart.com/browse/CELISTS-30299) | [#139149](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/139149) | 4.1.2 Dual-action item card — "Add to Cart" absorbed by container; `accessibilityElements = [cardNavElement, addToCartButton]` — two independent VoiceOver stops — NOVEL → `WA11Y-IOS-4.1.2-007` (founding) |
| 27 | ✅ DONE | [CEPG-337790](https://jira.walmart.com/browse/CEPG-337790) | [#138247](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/138247) | 1.3.1 Delivery address not announced in Subscriptions "Change Delivery Day" — address + W+ membership composed into name label's `accessibilityLabel` → `WA11Y-IOS-1.3.1-001` Var 4 |
| 28 | ✅ DONE | [OAMD-8344](https://jira.walmart.com/browse/OAMD-8344) | [#142832](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/142832) | 2.4.3 Dynamic fast-delivery badge injected after address disrupts VoiceOver order — `accessibilityElements = [addressView, badgeView]` on fulfillment container — NOVEL → `WA11Y-IOS-2.4.3-003` (founding) |
| 29 | ✅ DONE | [LD-6830](https://jira.walmart.com/browse/LD-6830) | [#121773](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/121773) | 2.1.1 Survey buttons focusable but double-tap does nothing — `UILongPressGestureRecognizer` incompatible with VoiceOver; `UIButton.touchUpInside` + `accessibilityActivate()` override — NOVEL → `WA11Y-IOS-2.1.1-001` (founding — first iOS 2.1.1 template) |
| 30 | ✅ DONE | [CEPG-283455](https://jira.walmart.com/browse/CEPG-283455) | [#110051](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/110051) | 4.1.2 Unified Delivery ILC Aisle info button not focusable — `UIView` with dynamic numeric label missing `isAccessibilityElement = true` + `accessibilityLabel = NSLocalizedString("Aisle \(aisleNumber)", ...)` → `WA11Y-IOS-4.1.2-001` Var 3 |
| 31 | ✅ DONE | [CEPG-296539](https://jira.walmart.com/browse/CEPG-296539) | [#116516](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/116516) | 4.1.2 Auto Care Center chevron `>` disclosure button not focusable — `UIImageView` with no `isAccessibilityElement`; fix: `isAccessibilityElement = true` + `.button` trait + contextual composite label ("Show details. \(vehicleName). \(statusText)") → `WA11Y-IOS-4.1.2-001` Var 4 |
| 32 | ✅ DONE | [AMENDS-878](https://jira.walmart.com/browse/AMENDS-878) | _(PR link incorrect — backend repo, iOS fix in glass-app)_ | 4.1.2 Purchase History Disclaimer button not in accessibility tree + missing bottomsheet focus transition; `isAccessibilityElement = true` + `.button` + `accessibilityLabel` + `UIAccessibility.post(.screenChanged, ...)` on present/dismiss → `WA11Y-IOS-4.1.2-001` Var 5 |
| 33 | ✅ DONE | [CEWMPLUS-136173](https://jira.walmart.com/browse/CEWMPLUS-136173) | [#139408](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/139408) | 2.1.1 W+ MPS nudge "Make your pick" CTA announced as `.button` but double-tap does nothing — action handler on parent container not reachable via VoiceOver; `UIButton.touchUpInside` fix or `accessibilityActivate()` override → `WA11Y-IOS-2.1.1-001` Var 2 |
| 34 | ✅ DONE | [CEPG-341947](https://jira.walmart.com/browse/CEPG-341947) | [#145371](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/145371) | 2.1.2 Store details — VoiceOver trapped between Service hours / Holiday Hours; `storeHourList.subAccessibilityElements` not cleared in `prepareForReuse()` — stale HourView instances confuse VoiceOver traversal — NOVEL → `WA11Y-IOS-2.1.2-001` (founding — first iOS 2.1.2 template) |
| 35 | ✅ DONE | [CEPG-341972](https://jira.walmart.com/browse/CEPG-341972) | [#156713](https://gecgithub01.walmart.com/walmart-ios/glass-app/pull/156713) | 2.1.2 Item Page FBT soft bundle items — swipe-left backward VoiceOver trap on last tile; `accessibilityElements = [stackView]` (4-level nesting) → `accessibilityElements = stackView.accessibilityElements` + `containerView.isAccessibilityElement = true` per tile → `WA11Y-IOS-2.1.2-001` Var 2 |

---

## ⚙️ Batch Run Instructions

### Option A — Full Queue (all PENDING tickets)
```
Hey Wibey, run the full batch queue in final-skill/BATCH_QUEUE.md.
Target repo: /Users/g0c073y/Desktop/githubs/Walmart-Web-2
```

### Option B — Single ticket from queue
```
Hey Wibey, run ticket #3 from the batch queue in BATCH_QUEUE.md.
Target repo: /Users/g0c073y/Desktop/githubs/Walmart-Web-2
```

### Option C — Add tickets and run immediately
```
Hey Wibey, add these to the batch queue and run them all:
- Jira: https://jira.walmart.com/browse/XXX-123, PR: https://gecgithub01.walmart.com/walmart-web/walmart/pull/99999
- Jira: https://jira.walmart.com/browse/XXX-456, PR: https://gecgithub01.walmart.com/walmart-web/walmart/pull/88888
Target repo: /Users/g0c073y/Desktop/githubs/Walmart-Web-2
```

---

## 🔧 What Each Agent Does (Per Ticket)

1. **Step 1** — `find-template.sh <keyword> Web` fast-path search
2. **Step 1.5** — Teams-First Routing (check `teams/` folder for known file paths)
3. **Step 5b** — Two-step diff extraction (no bloated `git show` dumps):
   ```bash
   git show --stat $HASH          # file names only
   git show $HASH -- <file>       # targeted source diff only
   ```
4. **Append** to `RECOMMENDED_TEMPLATES.md` with Bad/Good code, WCAG mapping, why-it-works explanation
5. **Self-doc loop** — update `teams/[Domain]/[Team].md` with any new architectural context

---

## ⚡ Bulk Scale-Up Tips & Learnings

*Notes from running the first two ingestions. Read these before queuing a large batch.*

---

### 🏎️ Tip 1 — Pre-Screen for Uniqueness Before Running

Not every closed PR is worth ingesting. Before adding a ticket to the queue, do a 10-second sanity check:

```bash
# Does a template already exist AND have real code examples?
bash final-skill/find-template.sh "<wcag-keyword>" Web
cat final-skill/catalyst-templates/web/<RETURNED_ID>.md | wc -l
```

- **< 35 lines** → skeleton only → still worth ingesting as a concrete variation (like Draft #2)
- **> 35 lines** → already fleshed out → only ingest if the fix is architecturally different
- **NOT_FOUND** → always ingest (Step 5b full protocol)

**Why it matters:** Running 20 agents that all produce duplicates wastes cycles and clutters `RECOMMENDED_TEMPLATES.md`.

---

### 🗂️ Tip 2 — Group Tickets by Team/Domain Before Batching

Agents from the same domain will often touch the same `teams/` file (e.g., multiple Discovery tickets all updating `item-page.md`). Concurrent writes to the same file can produce merge conflicts.

**Strategy:** Sort your queue by domain first, then run domain groups sequentially:

```
Round 1 (parallel): All CEPG-* (Transaction/Payments) tickets
Round 2 (parallel): All item/buy-box (Discovery) tickets
Round 3 (parallel): All identity/auth (Accounts) tickets
```

Or just tell Wibey: *"Run these 5 tickets but don't let more than one agent write to the same teams/ file at a time."*

---

### 🔍 Tip 3 — Include the WCAG Criterion in the Queue Notes Column

The faster Wibey knows the criterion, the better keyword it picks for `find-template.sh` on the first try. Saves ~10s per agent.

**Before:**
```
| 3 | ⏳ PENDING | CEPG-99999 | #12345 | — |
```

**After:**
```
| 3 | ⏳ PENDING | CEPG-99999 | #12345 | 1.4.3 contrast — gray text on white |
```

You can usually get the criterion from the Jira title in 5 seconds before pasting it here.

---

### 💡 Tip 4 — The `gray` Tachyons Pattern is a Known Bulk Target

From Draft #2 (CEPG-355995): `gray` in Tachyons = `#777777` = **fails 4.5:1** against white. This is likely scattered across dozens of components in the monorepo.

**Instead of ingesting 15 separate `gray` tickets one by one**, run a single grep sprint first:

```bash
# Find every POTENTIAL contrast failure in the monorepo (takes ~30s)
grep -rn '\bgray\b' /Users/g0c073y/Desktop/githubs/Walmart-Web-2/libs/ \
  --include="*.tsx" --include="*.ts" \
  | grep 'className' \
  | grep -v 'bg-gray\|border-gray\|fill-gray\|stroke-gray' \
  > /tmp/gray-failures.txt

wc -l /tmp/gray-failures.txt   # How many potential failures?
```

If the output is large, one batch run can fix them all at once. Wibey can read `gray-failures.txt` and auto-apply the `gray → dark-gray` swap across every file in a single pass — no per-ticket ingestion needed.

---

### 🤖 Tip 5 — Two Classes of Batch Work (Know the Difference)

| Type | Description | Best Approach |
|---|---|---|
| **Ingestion batch** | Learn from closed PRs → populate `RECOMMENDED_TEMPLATES.md` | Queue in this file, run parallel agents |
| **Fix batch** | Actually apply a known fix to many files in the live repo | Give Wibey a grep result + a known template ID → one agent, many `Edit` calls |

Don't conflate them. Ingestion = knowledge building. Fix batch = code surgery. They use different agent strategies.

---

### ⏱️ Tip 6 — Realistic Time Estimates

Based on first two runs:

| Scenario | Est. Time |
|---|---|
| 1 ticket (cold, `gh` unavailable) | ~60–90s with optimized diff script |
| 8 tickets in parallel | ~90s total (same as slowest single ticket) |
| 20 tickets in parallel | ~120–150s (I/O contention on git log) |
| `gray` grep sweep + bulk fix (no ingestion) | ~45s for detection + ~3min for all edits |

> Rule of thumb: parallel agents scale nearly linearly up to ~10 tickets before git I/O becomes the bottleneck. Beyond 10, split into two rounds of 10.

---

### 🧠 Tip 7 — After a Big Batch: Run the De-Dupe Pass

After ingesting 10+ tickets, `RECOMMENDED_TEMPLATES.md` may contain near-duplicate drafts (e.g., 3 different `gray` contrast tickets). Before promoting to official templates, ask Wibey:

```
Hey Wibey, read RECOMMENDED_TEMPLATES.md and identify any drafts
that cover the same root pattern. Merge duplicates into a single
richer draft and mark the others as CONSOLIDATED.
```

This keeps the template library clean and avoids redundant official IDs.

---

## 📊 Ingestion Stats

| Metric | Value |
|---|---|
| Total processed | 68 (63 Web + 5 iOS) |
| Novel patterns (new template needed) | 16 (Draft #1: WA11Y-WEB-4.1.2-012, Draft #8: WA11Y-WEB-1.3.1-007, Run #5 row 23: WA11Y-WEB-2.1.1-004, Run #6 rows 31–34: 4× WA11Y-WEB-2.1.2-001 variations, Run #8: WA11Y-WEB-4.1.2-013 + WA11Y-WEB-4.1.3-001 ×2 vars, Run #10: WA11Y-WEB-3.2.2-001 + WA11Y-WEB-1.3.1-007 Var 2+3, iOS #1: WA11Y-IOS-2.4.3-001, iOS #2: WA11Y-IOS-1.4.4-001, **Run #11: WA11Y-WEB-1.3.3-001** first-ever WCAG 1.3.3) |
| Variations of existing templates | 49 (Drafts #2–#7, #9–#10, rows 11–22, 24–27, Run #6: +5, Run #7: +9, Run #8: +6, Run #9: +2, **Run #11: WA11Y-WEB-1.1.1-003 Var 1** + 4.1.3-001 +2 var enrichments) |
| Duplicates / skipped | 0 |
| Failed | 0 |
| New team files created | 18 (Transaction, Design-Components, Health-Vision/vision-center, Subscriptions/wplus, Omni-Services/omni-scheduler, Marketplace/mqd-modal, Accounts/protection-plans, Accounts/order-history, Post-Transaction/reviewer-community, Subscriptions/manage-optimizations, Health-Vision/pharmacy, Discovery/content-gcomm, Subscriptions/manage-dashboard, International/canada, International/mexico, **Run #11: Health-Vision/immunization-store-finder, Marketplace/about-seller-lmp**) |
| New domains discovered | 5 (Health-Vision, Subscriptions, Omni-Services, Marketplace, International) |
| New Jira prefix mappings | GPUGC → Discovery/Item Page/Reviews (Run #5); OAMFD- → Discovery/Search, OAMD- → Discovery/Item Page, CRUISE- → Subscriptions/Manage Optimizations (Run #6); PGSPHARM- → Health-Vision/Pharmacy (Run #7); INTX- → International (Canada/Mexico) (Run #10) |
| Templates enriched (Run #4) | `WA11Y-WEB-1.3.1-001` (+5 variations), `WA11Y-WEB-1.3.1-004` (+2 variations), `WA11Y-WEB-4.1.2-001` (+1 variation), `WA11Y-ALL-1.4.11-001` (+1 variation) |
| Templates enriched (Run #5) | `WA11Y-WEB-2.1.1-002` (+2 variations), `WA11Y-WEB-2.1.1-003` (+1 variation), `WA11Y-WEB-2.4.3-001` (+2 variations), `WA11Y-WEB-2.4.3-002` (+1 variation), `WA11Y-WEB-2.4.3-003` (+1 variation) |
| Templates enriched (Run #6) | `WA11Y-WEB-2.4.3-004` (+3 variations: page-mount SPA, post-state-change, JSX reorder), `WA11Y-WEB-1.3.1-001` (+2 variations: missing `as`, duplicate h1→h2) |
| Templates enriched (Run #7) | `WA11Y-WEB-2.5.3-001` (+2 var: visible-text aria-label rule, phantom label fix), `WA11Y-WEB-4.1.2-001` (+2 var: icon-only button, Maps Marker title), `WA11Y-WEB-4.1.2-002` (+3 var: BNPL rebrand, Protection Plans×3, Pharmacy "--" sentinel), `WA11Y-WEB-4.1.2-003` (+1 var: parameterized getCtaAriaLabel), `WA11Y-WEB-4.1.2-004` (+1 var: ui-link→Button) |
| Templates enriched (Run #8) | `WA11Y-WEB-4.1.2-004` (+2 var: ui-link text-expander→Button, Button nav CTA→href), `WA11Y-WEB-4.1.2-005` (+2 var: global-header sign-in href, conditional dual-mode exitRole), `WA11Y-WEB-4.1.2-007` (+1 var: aria-disabled on workflow list), `WA11Y-WEB-4.1.2-010` (+1 var: accordion popup trigger aria-expanded+aria-controls) |
| Templates enriched (Run #9) | `WA11Y-WEB-4.1.3-001` (+1 var: LD announceAssertive + addSnack dual-mechanism, reviewer-community), `WA11Y-WEB-4.1.3-003` (+1 var: announcePolite + setTimeout alongside addSnack, cart snackbar) |
| Novel proposals (Run #10) | `WA11Y-WEB-3.2.2-001` (first-ever 3.2.2 On Input template — Tab key commits value via onChange, RangeSlider Canada); `WA11Y-WEB-1.3.1-007` Var 2+3 (aria-label on listitem + aria-hidden children, International Canada/Mexico PolicyLine) |
| Templates enriched (Run #11) | `WA11Y-WEB-1.1.1-003` (+1 var: Icon aria-label→aria-hidden + WcpVisuallyHidden group, Marketplace About Seller); `WA11Y-WEB-4.1.3-001` (+2 var enrichments: filter clearance WcpVisuallyHidden + aria-live, search result blur/focus cycle) |
| Novel proposals (Run #11) | `WA11Y-WEB-1.3.3-001` (first-ever WCAG 1.3.3 Sensory Characteristics — strikethrough pricing no AT alternative → WcpVisuallyHidden "Was/Now" + aria-hidden on visual span) |
| New Jira prefix mappings (iOS) | COMM- → iOS/WCP Design Components (glass-app); WSC- → iOS/GlassUI (glass-app); OAMD- → iOS/ItemDetails (glass-app) |
| Sequential fix chains detected | 1 (CEPG-330816 → CEPG-348108, same file `at-a-glance-content.tsx`) |
| Bonus cross-criterion finds | 1 (CEPG-330551: WCAG 1.4.3 gray→mid-gray inside a 1.3.1 ticket) |
