# Team Architecture: Subscriptions — Manage Optimizations

**Domain Area:** Subscriptions
**Jira Label Mapping:** `CRUISE-*` (Subscription Manage Optimizations / Post-Purchase Subscription Management)
**Last Updated:** 2026-03-23

---

## 📍 Where the Code Lives

- **Monorepo:** `git@gecgithub01.walmart.com:walmart-web/walmart.git`
- **Library root:** `libs/subscription/manage-optimizations/src/lib/`

### Key Component Paths
| Component | Path |
|---|---|
| Subscription Items Container | `libs/subscription/manage-optimizations/src/lib/subscription-items-components/subscription-items-container.tsx` |
| Upcoming Orders Container | `libs/subscription/manage-optimizations/src/lib/upcoming-orders-components/upcoming-subscription-orders-container.tsx` |
| Change Delivery Date Selection | `libs/subscription/manage-optimizations/src/lib/change-delivery-date-components/change-delivery-date-selection.tsx` |
| Address Change Dialog | `libs/subscription/manage-optimizations/src/lib/address-payment-options-components/address-change-dialog.tsx` |
| Subscription Items Option | `libs/subscription/manage-optimizations/src/lib/subscription-items-components/subscription-items-option.tsx` |
| Subscription Alerts | `libs/subscription/manage-optimizations/src/lib/utils-components/subscription-alerts.tsx` |

---

## 🛠️ Tech Stack & Constraints

- **Framework:** React (TypeScript / TSX)
- **Design System:** WCP Living Design — `@walmart-web/livingdesign-components` (`<Heading>`, `<DatePicker>`, `<SubscriptionModalAlert>`)
- **i18n:** `@walmart-web/platform-i18n` (`m(messages, key)` pattern)
- **Heading component:** Polymorphic WCP `<Heading>` — `as` sets semantic level; `size` sets visual weight (these are fully independent)

---

## ♿ Known Accessibility Pitfalls (Historical Memory)

- **[2026-03-23] PR #161559 — ChangeDeliveryDateSelection: LD DatePicker always-open state caused WCAG 2.1.2 keyboard focus trap:**
  The `ChangeDeliveryDateSelection` component rendered `<DatePicker isOpen onClose={noop} onOpen={noop} />` — hardcoding the calendar open and silencing all lifecycle callbacks. Because LD DatePicker captures Tab/Arrow key focus while open, keyboard focus was permanently trapped inside the calendar widget.

  ```tsx
  // ❌ WRONG — always open, focus trap inevitable
  <DatePicker
    isOpen             // hardcoded — calendar never closes
    onClose={noop}     // lifecycle silenced
    onOpen={noop}      // lifecycle silenced
    ...
  />

  // ✅ CORRECT — controlled state; calendar only opens on user intent
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  <DatePicker
    isOpen={isDatePickerOpen}
    onOpen={() => setIsDatePickerOpen(true)}
    onClose={() => setIsDatePickerOpen(false)}
    ...
  />
  ```

  Container height also collapses via CSS transition when closed (`height: isDatePickerOpen ? "410px" : "80px"`).

  **Rule for this lib:** Never use `noop` for `onClose`/`onOpen` on LD components that capture keyboard focus (DatePicker, Dialog, Menu, Popover). Always use controlled state (`useState`).
  **See:** `RECOMMENDED_TEMPLATES.md` Draft `WA11Y-WEB-2.1.2-001` · File: `libs/subscription/manage-optimizations/src/lib/change-delivery-date-components/change-delivery-date-selection.tsx`

- **[2026-03-23] CRUISE-16221 (PR #161792) — Duplicate h1 in sub-section containers (WCAG 1.3.1):**
  Both `SubscriptionItemsContainer` and `UpcomingSubscriptionOrdersContainer` used `<Heading as="h1">` for section headings that sit inside a page already headed by a top-level h1. This created duplicate h1 elements and prevented AT users from using heading navigation between sections.

  ```tsx
  // ❌ WRONG — sub-section container using h1 (duplicate; structural hierarchy broken)
  <Heading as="h1" size="medium" weight={700}>
    {m(messages, "subscriptionItems")}
  </Heading>

  // ✅ CORRECT — h2 properly subordinates this heading under the page h1
  <Heading as="h2" size="medium" weight={700}>
    {m(messages, "subscriptionItems")}
  </Heading>
  ```

  **Rule:** In the Manage Optimizations library, section-level container headings must use `as="h2"` (or deeper). Never use `as="h1"` for content that is embedded within a routed page view — the page view owns the single h1.
  **See:** `WA11Y-WEB-1.3.1-001.md` Variation 7 · Files: `subscription-items-container.tsx` + `upcoming-subscription-orders-container.tsx`

- **[2026-01-27] CRUISE-17627 (PR #174225) — AvoidFeeHeading chevron InlineButton missing accessible name (WCAG 4.1.2):**
  The `AvoidFeeHeading` shared component rendered a chevron `InlineButton` (conditionally shown when `isMinFeeEligible` is true) with no accessible name — contained only an icon and announced as bare "button" to screen readers. Fix: add `aria-label` via the standard `m(messages, key)` i18n pattern.

  ```tsx
  // ❌ WRONG — icon-only InlineButton, no label
  <InlineButton onClick={handleGoToMyItemsPage} data-dca-id="B:DA3FAA84BA" ...>
    {/* chevron icon only — no text, no aria-label */}
  </InlineButton>

  // ✅ CORRECT — i18n-backed aria-label
  import { m } from "@walmart-web/platform-i18n";
  import * as messages from "./locale/messages";

  <InlineButton
    onClick={handleGoToMyItemsPage}
    aria-label={m(messages, "viewMoreEligibleItemsAriaLabel")}
    data-dca-id="B:DA3FAA84BA" ...
  >
    {/* chevron icon only */}
  </InlineButton>
  ```

  **Rule:** Any icon-only interactive element in `libs/subscription/shared-components/` that renders without visible text MUST have `aria-label` via a typed i18n key — never a hardcoded JSX string. The key must be registered in `messages.ts` AND all 6 locale YAML files (en-US, en-CA, es-US, es-MX, es-CL, fr-CA) before merge.
  **File:** `libs/subscription/shared-components/avoid-fee-heading/src/lib/avoid-fee-heading.tsx`
  **See:** `WA11Y-WEB-4.1.2-001.md` Variation 2

### CRUISE-16218 — 4.1.2 State: Accordion Expanded/Collapsed | PR #161792
- **File:** `libs/subscription/manage-optimizations/src/lib/subscription-items-components/subscription-items-option.tsx`
- **Fix:** Added `aria-haspopup`, `aria-expanded={isMenuOpen}`, and `aria-controls` to the "more options" menu trigger button; added matching `id` to the menu panel so the `aria-controls` relationship resolves.
- **Pattern:** WA11Y-WEB-4.1.2-010 Var 1
