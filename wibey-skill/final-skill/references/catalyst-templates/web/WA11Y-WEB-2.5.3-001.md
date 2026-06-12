# Catalyst Template: Label in Name: Accessible Name Does Not Match Visible Text

**Template ID:** `WA11Y-WEB-2.5.3-001`
**Platform:** Web
**WCAG Criterion:** WCAG-2.5.3

---

## 🛑 The Problem
The accessible name provided doesn’t match the visually presented text, causing confusion for assistive technology users.

**Expected Result:** Accessible names should include the visible text content.
**Actual Result:** Screen reader output differs from the visible text displayed to users.

---

## ✅ The Fix Patterns

> **Recommendation:** Ensure that the accessible name matches the visible text. The full visible text must be included in the name.

### Standard Implementation
```html
// Best: Visible Text
        <button>Read more about Walmart Plus</button>
        
        // Good: aria-label
        <button aria-label="Read more about Walmart Plus">Learn More</button>
```

---

## 🧠 Tier 1 Automated Fix Rules
1. Apply standard WCAG guidance.
2. If fixing a WCP or LD component, verify the props against `final-skill/design-system-docs/web/` before applying raw HTML.

---

---

## Metadata

| Field | Value |
|---|---|
| Jira | GPUGC-22861 |
| PR | #160850 |
| Commit | `f5f700926e659d5e117b642e50c8b60ddc8ff37e` |
| Author | Udisha Shubham (Udisha.Shubham@walmartlabs.com) |
| WCAG Criterion | 2.5.3 — Label in Name (Level A) |
| Template ID | WA11Y-WEB-2.5.3-001 (existing — new variation) |
| Domain | Discovery |
| Team | Item Page / Reviews |
| Primary File | `libs/item/reviews/ui-components/src/lib/reviews-summary/bulleted-summary-cta.tsx` |
| Secondary File | `libs/item/reviews/ui-components/src/lib/reviews-summary/bulleted-summary-content.tsx` |

---

## Template Routing Decision

**EXISTING VARIATION** — `WA11Y-WEB-2.5.3-001`

Template `WA11Y-WEB-2.5.3-001` covers the root cause: an `aria-label` that does not match or include the element's visible text, violating WCAG 2.5.3. This PR introduces **two distinct sub-patterns** of that violation, both worth capturing as named variations.

---

## Variation 1 — aria-label Contains Hidden Extra Context Instead of Visible Label Only

**Component:** `BulletedSummaryContent` — keyword pill links in the reviews bullet summary list

### Bad Code

```tsx
// libs/item/reviews/ui-components/src/lib/reviews-summary/bulleted-summary-content.tsx

// ❌ WCAG 2.5.3 VIOLATION:
// aria-label is constructed as `${pills} ${summary}` — concatenating the visible
// pill label (e.g., "Comfortable") with the full review summary paragraph text.
// The visible label on the element is ONLY "Comfortable" (the pill text).
// Screen readers announce a label that does not match the visible text — users
// activating the link by its spoken name cannot reconcile what they hear with
// what they see on screen.

const ariaLabel = `${pills} ${summary}`;  // ❌ includes hidden summary — does not match visible text

return (
  <li className="f6 f5-m dark-gray sans-serif mb2 lh-title lh-copy-m">
    <InlineButton
      className="underline f6 f5-m fw4 dark-gray sans-serif lh-title lh-copy-m"
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}           // ❌ announces pill + full summary text
      onClick={() => router.push(getReviewsPageURL(aspectId))}
      onLinkName={AnalyticsName.REVIEW_SUMMARY_KEYWORDS}
      onLinkExtras={getAnalyticsPayload(/* ... */)}
    >
      {pills}                          {/* visible text is ONLY the pill label */}
    </InlineButton>
  </li>
);
```

### Good Code

```tsx
// ✅ FIXED:
// aria-label is set to exactly the visible pill label.
// The accessible name now matches the visible text — WCAG 2.5.3 satisfied.

return (
  <li className="f6 f5-m dark-gray sans-serif mb2 lh-title lh-copy-m">
    <InlineButton
      className="underline f6 f5-m fw4 dark-gray sans-serif lh-title lh-copy-m"
      role="link"
      tabIndex={0}
      aria-label={pills}               // ✅ matches the visible pill text exactly
      onClick={() => router.push(getReviewsPageURL(aspectId))}
      onLinkName={AnalyticsName.REVIEW_SUMMARY_KEYWORDS}
      onLinkExtras={getAnalyticsPayload(/* ... */)}
    >
      {pills}
    </InlineButton>
  </li>
);
```

### Explanation

The original code built a composite `ariaLabel` by joining the pill label with the full summary body text. The intent was likely to give screen reader users additional context about where the link leads. However, WCAG 2.5.3 requires that the accessible name **contains** the visible text — but the canonical fix for simple navigational links is to use the visible text as the entire accessible name. If additional context is genuinely needed for disambiguation, it should be appended after the visible text (e.g., `aria-label={`${pills}, see full reviews`}`), not mixed with unrelated copy. In this case the pill label alone is sufficient and descriptive.

---

## Variation 2 — aria-label Uses Different i18n Keys Than Visible Button Text

**Component:** `ViewMoreLessCta` — the expand/collapse CTA button at the bottom of the bullet summary

### Bad Code

```tsx
// libs/item/reviews/ui-components/src/lib/reviews-summary/bulleted-summary-cta.tsx

// ❌ WCAG 2.5.3 VIOLATION:
// The button's visible text is produced by m(messages, "viewMore") / m(messages, "viewLess")
// which resolve to "View more" / "View less".
//
// The aria-label was sourced from DIFFERENT i18n keys:
//   - m(messages, "viewLessDetails") → "View less details about given reviews"
//   - m(messages, "viewMoreInfo")    → "Expand to open detailed review summary"
//
// Both alternate strings share no common substring with the visible text.
// A speech-control user who says "click View more" cannot activate the button
// because its accessible name is "Expand to open detailed review summary".

<Button
  // ...
  aria-label={
    isExpanded
      ? m(messages, "viewLessDetails")    // ❌ "View less details about given reviews"
      : m(messages, "viewMoreInfo")       // ❌ "Expand to open detailed review summary"
  }
  aria-expanded={isExpanded}
>
  {isExpanded ? m(messages, "viewLess") : m(messages, "viewMore")}
  {/* visible: "View less" | "View more" */}
</Button>
```

### Good Code

```tsx
// ✅ FIXED:
// Derive the button label once from the same keys that produce the visible text.
// The aria-label is then built as `${buttonLabel} - ${m(messages, "reviewsSummary")}`,
// which STARTS WITH the visible text ("View more" / "View less") and appends context.
// WCAG 2.5.3 is satisfied because the visible text is contained within the accessible name.

const buttonLabel = isExpanded
  ? m(messages, "viewLess")              // ✅ same key as visible text
  : m(messages, "viewMore");             // ✅ same key as visible text

<Button
  // ...
  aria-label={`${buttonLabel} - ${m(messages, "reviewsSummary")}`}
  // e.g. "View more - Reviews Summary" or "View less - Reviews Summary"
  // ✅ accessible name BEGINS WITH visible text — WCAG 2.5.3 compliant
  aria-expanded={isExpanded}
>
  {buttonLabel}                          {/* ✅ single source of truth — DRY */}
</Button>
```

### Explanation

Two i18n keys (`viewLessDetails` and `viewMoreInfo`) were introduced specifically to provide a "more descriptive" accessible name for the expand/collapse button. However, both keys produced strings that bore no resemblance to the visible button text ("View less" / "View more"). Speech-control users who navigate by reading what they see on screen are blocked — they cannot activate the button by voice command because the spoken accessible name does not match the visual label.

The fix follows the correct WCAG 2.5.3 pattern: start the `aria-label` with the visible text and optionally append disambiguating context after a separator. The two redundant i18n keys (`viewLessDetails`, `viewMoreInfo`) were deleted from all six locale YAML files and `messages.tsx` — eliminating dead i18n keys and removing the temptation to reuse the pattern.

**Key rule:** If you need to augment a button's accessible name beyond its visible text, always structure it as `"[visible text] [additional context]"` — never replace the visible text with alternate copy.

---

## Human Review Checklist

- [ ] Screen reader test (VoiceOver + Safari, NVDA + Chrome): navigate to each keyword pill link and confirm the announced name matches the visible pill text exactly
- [ ] Speech-control test: activate the "View more" / "View less" button by voice — confirm it responds to the visible label
- [ ] Confirm all six locale YAML files (en-US, en-CA, es-US, es-MX, es-CL, fr-CA) and `messages.tsx` no longer contain `viewLessDetails` or `viewMoreInfo` keys (they were deleted in this commit)
- [ ] Verify `reviewsSummary` locale key resolves correctly in all locales (it is retained as the context suffix in the new `aria-label`)
- [ ] Regression: confirm `bulleted-summary-content.spec.tsx` and `reviews-summary.spec.tsx` pass (both were updated in this commit)
- [ ] Check if any other `InlineButton` or `Button` components in `libs/item/reviews/` construct `aria-label` by concatenating visible text with supplemental copy — this is the same anti-pattern

---

## TEAMS_UPDATE

File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Discovery/item-page.md

Content:
- Add `libs/item/reviews/ui-components/` as an explicit sub-path under the Item Page team's "Customer Feedback" section (previously only `libs/item/ratings-and-reviews` was listed).
- Add GPUGC as a known Jira prefix mapping to Discovery / Item Page / Reviews sub-team.
- Add the following accessibility pitfall entry:

  **[2026-03-23] GPUGC-22861 — aria-label Does Not Match Visible Text in Reviews Bullet Summary (WCAG 2.5.3):**
  Two violations in the reviews bullet summary feature (`libs/item/reviews/ui-components/src/lib/reviews-summary/`):

  1. **Keyword pill links** (`bulleted-summary-content.tsx`): `aria-label` was constructed as `${pills} ${summary}` — appending the full review body text to the pill label. The visible text is only the pill label. Fix: use `aria-label={pills}` (visible text only).

  2. **View More/Less CTA button** (`bulleted-summary-cta.tsx`): `aria-label` used entirely different i18n keys (`viewLessDetails`, `viewMoreInfo`) whose resolved strings shared no text with the visible button label ("View less" / "View more"). Speech-control users could not activate the button by voice. Fix: derive a single `buttonLabel` variable from the same i18n keys that render the visible text, then use `aria-label={`${buttonLabel} - ${m(messages, "reviewsSummary")}`}`.

  **Key rule for this codebase:** When adding context to a button/link accessible name, always structure it as `"[visible text] [additional context]"`. Never use separate i18n keys that produce a different string as the full `aria-label`.

  **i18n cleanup:** Two locale keys (`viewLessDetails`, `viewMoreInfo`) were deleted across all 6 locale YAMLs and `messages.tsx`. If you see these key references elsewhere in the codebase they are dead.

  Files:
  - `libs/item/reviews/ui-components/src/lib/reviews-summary/bulleted-summary-content.tsx`
  - `libs/item/reviews/ui-components/src/lib/reviews-summary/bulleted-summary-cta.tsx`
  - `libs/item/reviews/ui-components/src/lib/locale/{en-US,en-CA,es-US,es-MX,es-CL,fr-CA}.yaml`
  - `libs/item/reviews/ui-components/src/lib/locale/messages.tsx`

  See `WA11Y-WEB-2.5.3-001.md` Variations 1 and 2.

---

---

## Metadata

| Field | Value |
|---|---|
| **Jira** | CEPG-330592 |
| **PR** | #156721 |
| **Commit** | `394c13718aff` |
| **Author** | Nandhini Gx — vn57yx8 (NANDHINI.GX@walmart.com) |
| **WCAG Criterion** | 2.5.3 — Label in Name (Level A) |
| **Template ID** | WA11Y-WEB-2.5.3-001 (existing — adding variation) |
| **Template Routing** | EXISTING VARIATION |
| **Domain** | Omni-Services |
| **Team** | Omni Scheduler (omni-scheduler) |
| **Primary File** | `libs/omni-scheduler/scheduler-components/src/lib/ui/oil-packages/ServiceFooter.tsx` |
| **Supporting Files** | `libs/omni-scheduler/scheduler-components/src/lib/ui/oil-packages/PackageDetails.tsx`, `libs/omni-scheduler/scheduler-components/src/lib/ui/oil-packages/ServiceInfo.tsx`, `libs/omni-scheduler/scheduler-components/src/lib/ui/oil-packages/Packages.tsx` |

---

## Template Routing Decision

**Decision:** EXISTING VARIATION — add to `WA11Y-WEB-2.5.3-001`

**Rationale:** The existing `WA11Y-WEB-2.5.3-001` template covers the case where the accessible name does not match the visible text on interactive elements. This PR surfaces a related but distinct sub-pattern: a **decorative icon carrying a phantom `aria-label`** that announces text to screen readers that has no visible text equivalent at all. The `<Icon>` in `ServiceFooter.tsx` was given `role="img" aria-label={m(messages, "includedServices")}` — screen readers would announce "included services" (or equivalent locale string) even though no such text appears visually. The adjacent visible text describing the service is in a sibling `<span>` — the icon label was thus a fabricated, non-visible announcement violating 2.5.3 (the accessible name must be derivable from or contain the visible text).

A secondary 2.5.3 signal exists in `PackageDetails.tsx`: the `<Image>` carried `alt={m(messages, "altTextForImage")}` — a localized label like "image" or similar — as the accessible name for what is a purely decorative product thumbnail. This manufactured accessible name bore no relationship to visible text, again violating 2.5.3. The fix changes it to `alt=""` with `aria-hidden="true"`, correctly marking it as decorative.

---

## Variation Detail

### Variation Title
Decorative Icon / Image with Phantom `aria-label` — Accessible Name Has No Visible Text Counterpart

### The Problem

An icon or image is given an explicit `aria-label` (or non-empty `alt`) even though:
1. The element is decorative — the adjacent sibling text already describes the action or content.
2. The label string is fabricated (from an i18n message key) and does not match any text visible on screen.

Screen readers announce the phantom label, creating a mismatch between what sighted users see and what AT users hear — a direct WCAG 2.5.3 violation.

**Expected Result:** Screen reader announces the visible text content of the adjacent label/item, not a separate fabricated string from the icon.
**Actual Result:** Screen reader announces the icon's `aria-label` ("included services", "image", etc.) separately from the visible text, creating a confusing double announcement or an announcement with no visible counterpart.

---

### Bad Code — ServiceFooter.tsx (Primary 2.5.3 violation)

```tsx
// ❌ WCAG 2.5.3 VIOLATION: Icon has aria-label "included services" (from i18n message key).
// The visible text of what is "included" lives in the sibling <span>{service.servicesDetail}</span>.
// The accessible name on the icon does not match and has no visible text counterpart.
{courtesyServices.servicesList.map((service, index) => (
  <div key={index} className="mt2">
    {service.servicesSign === "TICK" && (
      <Icon
        name="Check"
        className="pr2"
        size="small"
        role="img"
        aria-label={m(messages, "includedServices")}  // ❌ phantom label — no matching visible text
      />
    )}
    <span>{service.servicesDetail}</span>
  </div>
))}
```

### Good Code — ServiceFooter.tsx

```tsx
// ✅ FIXED: Icon is purely decorative — the sibling <span> text describes the service.
// aria-hidden="true" removes the icon from the AT tree entirely.
// role="img" and aria-label removed — screen reader only announces service detail text.
<ul className="pa0 mv1 list">
  {courtesyServices.servicesList.map((service, index) => (
    <li key={index} className="mt2">
      {service.servicesSign === "TICK" && (
        <Icon
          name="Check"
          className="pr2"
          size="small"
          aria-hidden="true"     // ✅ decorative icon hidden from AT
        />
      )}
      <span>{service.servicesDetail}</span>
    </li>
  ))}
</ul>
```

---

### Bad Code — PackageDetails.tsx (Secondary 2.5.3 violation)

```tsx
// ❌ WCAG 2.5.3 VIOLATION: Product thumbnail image has alt text from i18n message key.
// "altTextForImage" resolves to a generic string (e.g. "image") with no visible text counterpart.
// This image is decorative — the package name and description in adjacent text already identify the item.
<Image
  src={item?.imageInfo?.thumbnailUrl || ""}
  className="flex flex-column justify-start mr3"
  preload={false}
  width="48"
  height="48"
  alt={m(messages, "altTextForImage")}  // ❌ fabricated accessible name, no visible text match
/>
```

### Good Code — PackageDetails.tsx

```tsx
// ✅ FIXED: Image is decorative. alt="" marks it as decorative for AT.
// aria-hidden="true" additionally ensures the image element is fully removed from the AT tree.
// The package name and description in sibling elements already communicate the content.
<Image
  src={item?.imageInfo?.thumbnailUrl || ""}
  preload={false}
  width="48"
  height="48"
  aria-hidden="true"   // ✅ removes decorative image from AT tree
  alt=""               // ✅ empty alt = decorative per HTML spec
/>
```

---

### Explanation

WCAG 2.5.3 (Label in Name) requires that when a UI component has a visible text label, its accessible name must contain that visible text. The inverse pitfall — which this PR demonstrates — is manufacturing an accessible name from an i18n string key for an element that has **no** visible text label at all. When the icon or image announces a fabricated string, AT users receive information that sighted users never see, which is equally a 2.5.3 violation (accessible name does not match — or correspond to — any visible text).

**The decision rule:**

| Element type | Has meaningful visible sibling text? | Correct accessible name strategy |
|---|---|---|
| Decorative icon (check mark, bullet, arrow) | Yes — adjacent span/text describes the item | `aria-hidden="true"` — remove from AT tree entirely |
| Decorative product thumbnail image | Yes — package name/description in sibling elements | `alt=""` + `aria-hidden="true"` — mark as decorative |
| Meaningful standalone icon (no adjacent text) | No | `aria-label` containing text matching or clearly derived from visible context |

**Do not** use i18n message keys to manufacture accessible names for decorative elements. The temptation arises because i18n message keys appear "clean" and localizable, but if the resulting string has no visible text counterpart it violates 2.5.3 and also creates a confusing dual announcement (the icon label fires, then the real content text fires).

---

### Bonus: Related Fixes in Same PR (Not 2.5.3 — for cross-reference)

**ServiceHeader.tsx — Heading level correction:**
```tsx
// ❌ Before: <Heading as="h1"> — incorrect heading hierarchy inside a section
// ✅ After:  <Heading as="h2"> — correct semantic level for this subsection heading
```
Maps to WCAG 1.3.1 (Info and Relationships). Not a 2.5.3 issue but included here for complete PR context.

**Packages.tsx + PackageDetails.tsx — role="button" → role="option" inside listbox:**
```tsx
// ❌ Before (PackageDetails.tsx):
//   role="button" aria-pressed={isSelected}
//   No parent listbox — buttons inside an ad-hoc list

// ✅ After:
//   Packages.tsx wraps items in <ul className="list pl0">
//   PackageDetails.tsx renders as <li><div role="option" aria-selected={isSelected}>...</div></li>
//   Correct listbox > option pattern for a single-select package chooser
```
This is a WCAG 4.1.2 (Name, Role, Value) fix. The `role="option"` with `aria-selected` gives AT the correct semantics for a selection widget; `role="button"` with `aria-pressed` inside an unstructured list was the wrong pattern.

**ServiceInfo.tsx — `<Link>` gains `aria-label` for CTA:**
```tsx
// ❌ Before: <Link href="#" onClick={...}>{inclusiveServices.inclusiveServicesDisclaimerLink}</Link>
//    — visible text from CMS data, no aria-label
// ✅ After:  <Link role="button" aria-label={m(messages, "viewDetail")} ...>
//    — aria-label provides a consistent, localized accessible name
```
Note for reviewers: verify the `aria-label` value matches or contains the visible link text to remain 2.5.3 compliant — if the CMS-driven link text and `m(messages, "viewDetail")` diverge across locales, a new 2.5.3 violation is possible.

---

### Human Review Checklist

- [ ] **Screen reader test — ServiceFooter:** Navigate to the Oil Package courtesy services list. Verify each service item is announced once (the service detail text only). Confirm the check icon does not produce a separate announcement.
- [ ] **Screen reader test — PackageDetails:** Navigate to the package selection cards. Verify the product thumbnail image produces no announcement. Confirm only the package name, description, price, and unit quantity are announced per card.
- [ ] **ServiceInfo Link — 2.5.3 check:** Confirm `m(messages, "viewDetail")` produces a string that matches or contains the visible link text (`inclusiveServices.inclusiveServicesDisclaimerLink`) in all supported locales (en-US, en-CA, es-US, es-MX, fr-CA). If the strings diverge, the `aria-label` will introduce a new 2.5.3 violation.
- [ ] **role="option" semantic check:** Verify the `<ul>` in `Packages.tsx` does not need `role="listbox"` to properly contextualize the `role="option"` children. Per ARIA spec, `role="option"` must be owned by a `role="listbox"` — a plain `<ul>` without `role="listbox"` means the options are not in a valid ARIA-owned context. Consider whether `<ul role="listbox">` should be added to `Packages.tsx`.
- [ ] **i18n message key audit:** Confirm `altTextForImage` and `includedServices` message keys are no longer referenced in any component after this PR. Dead i18n keys should be cleaned from locale YAML files.
- [ ] **Heading hierarchy:** Confirm `<Heading as="h2">` in `ServiceHeader.tsx` is semantically correct in the page outline — there should be an `h1` ancestor in the parent page/modal. Verify with a browser heading outline tool.
- [ ] **Tachyons contrast:** Verify all service list items maintain WCAG 1.4.3 contrast. The `className="flex flex-column justify-start mr3"` was removed from the `<Image>` wrapper in `PackageDetails.tsx` — confirm layout is unchanged after the removal (visual regression).

---

## TEAMS_UPDATE

File: /Users/g0c073y/Documents/GitHub/wibey-skill/final-skill/teams/Omni-Services/omni-scheduler.md

Content:

- **[2026-03-23] CEPG-330592 / PR #156721 — Phantom `aria-label` on Decorative Icons/Images in Oil Package Selection (WCAG 2.5.3):**
  The `ServiceFooter.tsx` check icon carried `role="img" aria-label={m(messages, "includedServices")}` — a fabricated accessible name from an i18n key with no visible text counterpart. `PackageDetails.tsx` thumbnail image carried `alt={m(messages, "altTextForImage")}` — same pattern, different element type. Both are WCAG 2.5.3 violations (accessible name does not match/correspond to visible text). Fix: `aria-hidden="true"` on the icon, `alt="" aria-hidden="true"` on the image.

  **Pitfall pattern for this team:** Using i18n message keys to manufacture `aria-label` / `alt` values for decorative elements that already have visible sibling text. The accessible name must be derivable from visible text — if the element has no visible text of its own and its sibling already describes it, the element must be hidden from AT, not labelled with a phantom string.

  ```tsx
  // ❌ Phantom label pattern — do not do this for decorative icons
  <Icon name="Check" role="img" aria-label={m(messages, "includedServices")} />
  <span>{service.servicesDetail}</span>   // actual visible description lives here

  // ✅ Correct — icon is decorative, hide it from AT
  <Icon name="Check" aria-hidden="true" />
  <span>{service.servicesDetail}</span>
  ```

- **[2026-03-23] CEPG-330592 / PR #156721 — role="option" requires listbox owner (WCAG 4.1.2 watch item):**
  `PackageDetails.tsx` now renders `role="option"` inside a `<ul>` in `Packages.tsx`. The ARIA spec requires `role="option"` to be owned by `role="listbox"`. The current fix wraps options in a plain `<ul>` without `role="listbox"`. Reviewers should verify whether `Packages.tsx` needs `<ul role="listbox">` (or a wrapping `<div role="listbox">`) to complete the ownership chain. If AT reports orphaned options, this is the cause.

  - **File to watch:** `libs/omni-scheduler/scheduler-components/src/lib/ui/oil-packages/Packages.tsx`
  - **Fix if needed:** `<ul role="listbox" className="list pl0" aria-label={...}>` with an appropriate accessible name for the selection group.

- **[2026-03-23] CEPG-330592 / PR #156721 — `<Link aria-label>` divergence risk (WCAG 2.5.3):**
  `ServiceInfo.tsx` `<Link>` now uses `role="button" aria-label={m(messages, "viewDetail")}`. If CMS-driven `inclusiveServices.inclusiveServicesDisclaimerLink` text ever differs from the `viewDetail` i18n string across locales, a 2.5.3 violation reappears. Locale files involved: `en-US.yaml`, `en-CA.yaml`, `es-US.yaml`, `es-MX.yaml`, `es-CL.yaml`, `fr-CA.yaml`. Monitor this pairing in future i18n updates.
