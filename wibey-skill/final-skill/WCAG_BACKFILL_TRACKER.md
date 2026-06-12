# WCAG Backfill Tracker

Track which catalyst templates have been reviewed and backfilled to their WCAG examples fallback files.

**How to use:**
1. Review each template's code examples (click the template link)
2. Mark "Code Reviewed" when you've verified the code is good
3. Tell Wibey to backfill the approved rows
4. Wibey marks "Backfilled" after appending condensed examples to the WCAG file

---

## WCAG 1.1.1 — Non-text Content

Target: `WCAG-Rules/1.1.1-examples.md` (currently has generic HTML only)

| # | Template ID | Description | Variations | Code Reviewed | Backfilled |
|---|---|---|---|---|---|
| 1 | [`WA11Y-WEB-1.1.1-001`](references/catalyst-templates/web/WA11Y-WEB-1.1.1-001.md) | Alt text, `role="img"`, `aria-hidden`, WCP Icon, feature-flag conditional alt, Hero CMS | 4+ | [ ] | [ ] |
| 2 | [`WA11Y-WEB-1.1.1-002`](references/catalyst-templates/web/WA11Y-WEB-1.1.1-002.md) | Decorative image missing `aria-hidden` / empty alt | Ingested | [ ] | [ ] |

---

## WCAG 1.3.1 — Info and Relationships

Target: `WCAG-Rules/1.3.1-examples.md` (currently has generic HTML only)

| # | Template ID | Description | Variations | Code Reviewed | Backfilled |
|---|---|---|---|---|---|
| 3 | [`WA11Y-WEB-1.3.1-001`](references/catalyst-templates/web/WA11Y-WEB-1.3.1-001.md) | Heading role — `<div>` to h2/h3, WCP `<Heading as>`, `as="h6"` size hack, missing `as`, duplicate h1, Link-in-Heading | 7 | [ ] | [ ] |
| 4 | [`WA11Y-WEB-1.3.1-002`](references/catalyst-templates/web/WA11Y-WEB-1.3.1-002.md) | `div` to `ul/li` semantic list structure | Ingested | [ ] | [ ] |
| 5 | [`WA11Y-WEB-1.3.1-004`](references/catalyst-templates/web/WA11Y-WEB-1.3.1-004.md) | Radio group `name` / `role="radiogroup"` labelling | 2 | [ ] | [ ] |

---

## WCAG 1.4.3 — Contrast (Minimum)

Target: `WCAG-Rules/1.4.3-examples.md` (iOS examples added Run #12)

| # | Template ID | Description | Variations | Code Reviewed | Backfilled |
|---|---|---|---|---|---|
| 6 | [`WA11Y-ALL-1.4.3-001`](references/catalyst-templates/web/WA11Y-ALL-1.4.3-001.md) | Tachyons `gray` (#777) to `dark-gray`/`mid-gray`; color reference table | 1 | [ ] | [ ] |
| 6b | [`WA11Y-IOS-1.4.3-001`](references/catalyst-templates/ios/WA11Y-IOS-1.4.3-001.md) | iOS: `UITextField` placeholder `attributedPlaceholder` + `WCPColor.gray6`; secondary label; SwiftUI adaptive | 1 | [x] | [x] |

---

## WCAG 1.4.11 — Non-text Contrast

Target: `WCAG-Rules/1.4.11-examples.md` (iOS examples added Run #12)

| # | Template ID | Description | Variations | Code Reviewed | Backfilled |
|---|---|---|---|---|---|
| 7 | [`WA11Y-ALL-1.4.11-001`](references/catalyst-templates/web/WA11Y-ALL-1.4.11-001.md) | WCP Rating star stroke (CSS specificity + `stroke: none`) | 1 | [ ] | [ ] |
| 7b | [`WA11Y-IOS-1.4.11-001`](references/catalyst-templates/ios/WA11Y-IOS-1.4.11-001.md) | iOS: `UIActivityIndicatorView` gray on image; `CAShapeLayer` white on white; adaptive scrim | 2 | [x] | [x] |

---

## WCAG 2.1.1 — Keyboard

Target: `WCAG-Rules/2.1.1-examples.md` (currently has generic HTML only)

| # | Template ID | Description | Variations | Code Reviewed | Backfilled |
|---|---|---|---|---|---|
| 8 | [`WA11Y-WEB-2.1.1-002`](references/catalyst-templates/web/WA11Y-WEB-2.1.1-002.md) | Non-native `role="button"` missing `tabIndex` + `onKeyDown` | 2 | [ ] | [ ] |
| 9 | [`WA11Y-WEB-2.1.1-003`](references/catalyst-templates/web/WA11Y-WEB-2.1.1-003.md) | `<Link href="#">` + `role="button"` non-keyboard | 2 | [ ] | [ ] |

---

## WCAG 2.4.3 — Focus Order

Target: `WCAG-Rules/2.4.3-examples.md` (iOS done, Web section missing)

| # | Template ID | Description | Variations | Code Reviewed | Backfilled |
|---|---|---|---|---|---|
| 10 | [`WA11Y-WEB-2.4.3-001`](references/catalyst-templates/web/WA11Y-WEB-2.4.3-001.md) | Modal open/close focus return — CSS stamp utility + `useRef<h2>` + rAF | 2 | [ ] | [ ] |
| 11 | [`WA11Y-WEB-2.4.3-002`](references/catalyst-templates/web/WA11Y-WEB-2.4.3-002.md) | Error alert focus — `role="alert"` + `validationAttemptCounter` dep | 2 | [ ] | [ ] |
| 12 | [`WA11Y-WEB-2.4.3-003`](references/catalyst-templates/web/WA11Y-WEB-2.4.3-003.md) | Focus loss on conditional slot unmount — synchronous `inputRef.current?.focus()` | 1 | [ ] | [ ] |
| 13 | [`WA11Y-WEB-2.4.3-004`](references/catalyst-templates/web/WA11Y-WEB-2.4.3-004.md) | General focus order — SPA mount, post-state-change (forwardRef), JSX reorder | 3 | [ ] | [ ] |
| 14 | [`WA11Y-IOS-2.4.3-001`](references/catalyst-templates/ios/WA11Y-IOS-2.4.3-001.md) | VoiceOver focus after collection view mutation — `performBatchUpdates` + `layoutChanged` | 1 | [x] | [x] |

---

## WCAG 2.5.3 — Label in Name

Target: `WCAG-Rules/2.5.3-examples.md` (iOS examples added Run #12)

| # | Template ID | Description | Variations | Code Reviewed | Backfilled |
|---|---|---|---|---|---|
| 15 | [`WA11Y-WEB-2.5.3-001`](references/catalyst-templates/web/WA11Y-WEB-2.5.3-001.md) | Pill `aria-label` = visible text only; phantom label on decorative icon; View More/Less visible-text-first | 2 | [ ] | [ ] |
| 15b | [`WA11Y-IOS-2.5.3-001`](references/catalyst-templates/ios/WA11Y-IOS-2.5.3-001.md) | iOS: `WcpQuantityStepper` accessible name must contain quantity + visible label; synonym trap; dynamic label patterns | 1 | [x] | [x] |

---

## WCAG 4.1.2 — Name, Role, Value

Target: `WCAG-Rules/4.1.2-examples.md` (currently has generic HTML only)

| # | Template ID | Description | Variations | Code Reviewed | Backfilled |
|---|---|---|---|---|---|
| 16 | [`WA11Y-WEB-4.1.2-001`](references/catalyst-templates/web/WA11Y-WEB-4.1.2-001.md) | Missing/incomplete accessible name — `aria-labelledby` multi-part; icon-only button; Maps Marker title | 3 | [ ] | [ ] |
| 17 | [`WA11Y-WEB-4.1.2-002`](references/catalyst-templates/web/WA11Y-WEB-4.1.2-002.md) | Inaccurate accessible name — stale brand rebrand; vague labels to i18n; `"--"` sentinel | 3+ | [ ] | [ ] |
| 18 | [`WA11Y-WEB-4.1.2-003`](references/catalyst-templates/web/WA11Y-WEB-4.1.2-003.md) | Duplicate CTA names — parameterized `getCtaAriaLabel(productName)` | 1 | [ ] | [ ] |
| 19 | [`WA11Y-WEB-4.1.2-004`](references/catalyst-templates/web/WA11Y-WEB-4.1.2-004.md) | Wrong role — `ui-link href=""` as action to `<Button>`; `<Button onClick>` for nav to add `href` | 3 | [ ] | [ ] |
| 20 | [`WA11Y-WEB-4.1.2-005`](references/catalyst-templates/web/WA11Y-WEB-4.1.2-005.md) | Missing link role — LD/ui-button needs `href` for navigation; conditional dual-mode role | 3 | [ ] | [ ] |
| 21 | [`WA11Y-WEB-4.1.2-007`](references/catalyst-templates/web/WA11Y-WEB-4.1.2-007.md) | State not announced — `aria-disabled={isDisabled}` on buttons | 1 | [ ] | [ ] |
| 22 | [`WA11Y-WEB-4.1.2-010`](references/catalyst-templates/web/WA11Y-WEB-4.1.2-010.md) | Accordion expanded/collapsed — `aria-expanded` + `aria-haspopup` + `aria-controls` triad | 1 | [ ] | [ ] |

---

## WCAG 4.1.3 — Status Messages

Target: `WCAG-Rules/4.1.3-examples.md` (currently empty placeholder)

| # | Template ID | Description | Variations | Code Reviewed | Backfilled |
|---|---|---|---|---|---|
| 23 | [`WA11Y-WEB-4.1.3-001`](references/catalyst-templates/web/WA11Y-WEB-4.1.3-001.md) | `aria-live="polite" role="alert"` on WCP Alert; `aria-live="assertive"` + useEffect; LD `announceAssertive`+`addSnack` | 3 | [ ] | [ ] |
| 24 | [`WA11Y-WEB-4.1.3-003`](references/catalyst-templates/web/WA11Y-WEB-4.1.3-003.md) | Snackbar — `announcePolite()` + `setTimeout(1000)` alongside `addSnack()` | 1 | [ ] | [ ] |

---

---

## iOS Ingested — Run #11 (2026-04-14)

iOS batch queue rows 6–17 processed. 5 new templates created + 1 enriched.

| # | Template ID | iOS Rule | Source Tickets | WCAG | Status |
|---|---|---|---|---|---|
| 25 | [`WA11Y-IOS-1.1.1-001`](references/catalyst-templates/ios/WA11Y-IOS-1.1.1-001.md) (enriched) | Alt Text: Banner image no label; `accessibilityHidden` on informative image; image+caption split | CEPG-343560, CRUISE-16235, CRUISE-16210 | 1.1.1 | ✅ Ingested — Var 1, 2, 3 added |
| 26 | [`WA11Y-IOS-1.3.1-001`](references/catalyst-templates/ios/WA11Y-IOS-1.3.1-001.md) (NOVEL) | Element Grouping — split labels; plan card over-grouping; UITableViewCell sub-labels | GPUGC-23161, CEPG-330737, CEPG-330734 | 1.3.1 | ✅ Ingested — founding + Var 2, 3 |
| 27 | [`WA11Y-IOS-4.1.2-001`](references/catalyst-templates/ios/WA11Y-IOS-4.1.2-001.md) (NOVEL) | Role: Button Role Missing — `.button` trait on `UIView` + `UICollectionViewCell` | CEPG-340598, CEPG-339158 | 4.1.2 | ✅ Ingested — founding + Var 2 |
| 28 | [`WA11Y-IOS-4.1.2-002`](references/catalyst-templates/ios/WA11Y-IOS-4.1.2-002.md) (NOVEL) | Name: Missing Accessible Name — icon-only `UIButton` no `accessibilityLabel` | CEPG-355941 | 4.1.2 | ✅ Ingested — founding |
| 29 | [`WA11Y-IOS-4.1.2-003`](references/catalyst-templates/ios/WA11Y-IOS-4.1.2-003.md) (NOVEL) | State: Expanded/Collapsed — `accessibilityValue` + `.layoutChanged` notification | CEPG-296542 | 4.1.2 | ✅ Ingested — founding |
| 30 | [`WA11Y-IOS-4.1.3-001`](references/catalyst-templates/ios/WA11Y-IOS-4.1.3-001.md) (NOVEL) | Status Message — `UIAccessibility.post(.announcement)` + debounce + snackbar multi-line | CEPG-332823, GPUGC-21403 | 4.1.3 | ✅ Ingested — founding + Var 2 |

---

## iOS Ingested — Run #12 (2026-04-14)

iOS batch queue rows 18–21 processed. 3 new NOVEL templates created covering previously missing rules (1.4.3, 1.4.11, 2.5.3).

| # | Template ID | iOS Rule | Source Tickets | WCAG | Status |
|---|---|---|---|---|---|
| 31 | [`WA11Y-IOS-1.4.3-001`](references/catalyst-templates/ios/WA11Y-IOS-1.4.3-001.md) (NOVEL) | Text Contrast — `UITextField` placeholder `attributedPlaceholder` + `WCPColor.gray6`; UILabel secondary text; SwiftUI adaptive foreground | GPUGC-23160 | 1.4.3 | ✅ Ingested — founding |
| 32 | [`WA11Y-IOS-1.4.11-001`](references/catalyst-templates/ios/WA11Y-IOS-1.4.11-001.md) (NOVEL) | Non-text Contrast — `UIActivityIndicatorView` gray on image; `CAShapeLayer` white on white; adaptive spinner color with scrim | CEPG-352365, CEPG-344504 | 1.4.11 | ✅ Ingested — founding + Var 2 |
| 33 | [`WA11Y-IOS-2.5.3-001`](references/catalyst-templates/ios/WA11Y-IOS-2.5.3-001.md) (NOVEL) | Label in Name — `WcpQuantityStepper` accessible name must contain visible quantity + action text; synonym trap patterns | COMM-1813 | 2.5.3 | ✅ Ingested — founding |
| 34 | [`WA11Y-IOS-4.1.2-004`](references/catalyst-templates/ios/WA11Y-IOS-4.1.2-004.md) (NOVEL) | Accessibility Not Enabled — button silenced by `isAccessibilityElement = true` on container; `accessibilityElements = [switch, button]` fix; Pharmacy Preference Center | PGSPHARM-59761 | 4.1.2 | ✅ Ingested — founding |
| 35 | [`WA11Y-IOS-4.1.2-005`](references/catalyst-templates/ios/WA11Y-IOS-4.1.2-005.md) (NOVEL) | Link Role Missing — `UIAccessibilityCustomAction` for inline paragraph links; `UITextView` + `NSLinkAttributeName` alternative; CCPA Privacy Notice | CECPRO-31015 | 4.1.2 | ✅ Ingested — founding |
| 36 | [`WA11Y-IOS-2.4.3-002`](references/catalyst-templates/ios/WA11Y-IOS-2.4.3-002.md) (NOVEL) | Stale accessibility tree in dynamic nudge/notification view — Edit button skipped on 2nd+ update + CTA container focus trap; `accessibilityElements` array + `UIAccessibility.post(.layoutChanged)` fix; Pharmacy RX Amends basket nudge | PGSPHARM-55747 | 2.4.3 | ✅ Ingested — founding |
| 37 | [`WA11Y-IOS-4.1.2-006`](references/catalyst-templates/ios/WA11Y-IOS-4.1.2-006.md) (NOVEL) | Custom-drawn signature/canvas view not focusable — `isAccessibilityElement = true` + descriptive label with medium description ("in cursive text") + `.staticText` trait; Sampling tax compliance e-sign flow | CEPG-340674 | 4.1.2 | ✅ Ingested — founding |
| 38 | [`WA11Y-IOS-4.1.2-007`](references/catalyst-templates/ios/WA11Y-IOS-4.1.2-007.md) (NOVEL) | Dual-action item card — "Add to Cart" button absorbed by card container; `accessibilityElements = [cardNavElement, addToCartButton]` — two independent VoiceOver stops; Autodeals List "Deals on saved items" | CELISTS-30299 | 4.1.2 | ✅ Ingested — founding |
| 39 | [`WA11Y-IOS-1.3.1-001`](references/catalyst-templates/ios/WA11Y-IOS-1.3.1-001.md) Var 4 | Delivery address + W+ membership composed into name label's `accessibilityLabel` — multi-field summary string composition; Subscriptions "Change Delivery Day" | CEPG-337790 | 1.3.1 | ✅ Ingested — enrichment |
| 40 | [`WA11Y-IOS-2.4.3-003`](references/catalyst-templates/ios/WA11Y-IOS-2.4.3-003.md) (NOVEL) | Dynamic badge injected async disrupts VoiceOver reading order — explicit `accessibilityElements` ordering on fulfillment container after each badge load; Item page fast-badging | OAMD-8344 | 2.4.3 | ✅ Ingested — founding |
| 41 | [`WA11Y-IOS-2.1.1-001`](references/catalyst-templates/ios/WA11Y-IOS-2.1.1-001.md) (NOVEL) | **First iOS 2.1.1 template** — Survey button focusable but not activatable; `UILongPressGestureRecognizer` incompatible with VoiceOver double-tap; `UIButton.touchUpInside` fix + `accessibilityActivate()` override; Delivery Survey | LD-6830 | 2.1.1 | ✅ Ingested — founding |
| 42 | [`WA11Y-IOS-4.1.2-001`](references/catalyst-templates/ios/WA11Y-IOS-4.1.2-001.md) Var 3 | Unified Delivery ILC Aisle info button not focusable — `UIView` with dynamic numeric label; `isAccessibilityElement = true` + `accessibilityLabel = NSLocalizedString("Aisle \(aisleNumber)", ...)` + `.button` trait; Item page in-store fulfillment | CEPG-283455 | 4.1.2 | ✅ Ingested — enrichment |
| 43 | [`WA11Y-IOS-4.1.2-001`](references/catalyst-templates/ios/WA11Y-IOS-4.1.2-001.md) Var 4 | Auto Care Center chevron `>` disclosure button not focusable — `UIImageView` with no `isAccessibilityElement`; contextual composite label: "Show details. \(vehicleName). \(statusText)"; Auto Care Center / Services | CEPG-296539 | 4.1.2 | ✅ Ingested — enrichment |
| 44 | [`WA11Y-IOS-4.1.2-001`](references/catalyst-templates/ios/WA11Y-IOS-4.1.2-001.md) Var 5 | Purchase History Disclaimer button not in accessibility tree + missing `.screenChanged` focus on bottomsheet open/dismiss; `isAccessibilityElement = true` + `.button` + label + focus transition; Order Totals / ads | AMENDS-878 | 4.1.2 | ✅ Ingested — enrichment |
| 45 | [`WA11Y-IOS-2.1.1-001`](references/catalyst-templates/ios/WA11Y-IOS-2.1.1-001.md) Var 2 | W+ MPS nudge "Make your pick" CTA announced as `.button` but double-tap does nothing — action handler on parent container unreachable via VoiceOver; `UIButton.touchUpInside` or `accessibilityActivate()` override; W+ Membership Hub | CEWMPLUS-136173 | 2.1.1 | ✅ Ingested — enrichment |
| 46 | [`WA11Y-IOS-2.1.2-001`](references/catalyst-templates/ios/WA11Y-IOS-2.1.2-001.md) (NOVEL) | **First iOS 2.1.2 template** — VoiceOver trapped between Service hours / Holiday Hours on Store details; root cause: `storeHourList.subAccessibilityElements` not cleared in `prepareForReuse()` — stale HourView instances persist after UITableViewCell reuse (PR #145371) | CEPG-341947 | 2.1.2 | ✅ Ingested — founding |
| 47 | [`WA11Y-IOS-2.1.2-001`](references/catalyst-templates/ios/WA11Y-IOS-2.1.2-001.md) Var 2 | Item Page FBT soft bundle tiles — backward VoiceOver trap on last tile; `accessibilityElements = [stackView]` (4-level nesting) → `accessibilityElements = stackView.accessibilityElements` + `containerView.isAccessibilityElement = true` per tile (PR #156713) | CEPG-341972 | 2.1.2 | ✅ Ingested — enrichment |

**Summary stats:** Total templates with ingested code: 47 (+14 new iOS since Run #11 — covering 2.1.1×2, 2.1.2×2 ⭐, 2.4.3×3, 4.1.2×8, 1.3.1 Var 4)

---

## Summary

| Status | Count |
|---|---|
| Total templates with ingested code | 47 (+20 new iOS post-Run #11) |
| iOS templates ingested (Run #11) | 6 (5 NOVEL + 1 enriched) |
| WCAG fallback files updated | 4 (1.1.1, 1.3.1, 4.1.2, 4.1.3 — iOS Examples sections added) |
| Code reviewed | 1 |
| Backfilled to WCAG | 1 |
| Remaining web | 23 |
| WCAG criteria to backfill | 9 (1.1.1, 1.3.1, 1.4.3, 1.4.11, 2.1.1, 2.4.3-web, 2.5.3, 4.1.2, 4.1.3) |

---

*Last updated: 2026-04-23 — Run #22 (amended): Replaced synthesized code with real diff code from glass-app clone. CEPG-341947 (Var 1) = stale `subAccessibilityElements` on cell reuse (PR #145371). CEPG-341972 (Var 2) = hierarchy flattening + composite tile element (PR #156713). PR numbers corrected across all files.*
