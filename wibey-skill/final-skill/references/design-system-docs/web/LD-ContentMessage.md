# LD ContentMessage — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/content-message/guidelines/ContentMessageGuidelines.tsx`
**Import:** `import { ContentMessage } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `title` | `string` | Yes | — | Primary heading of the message. |
| `children` | `ReactNode` | Yes | — | Body text providing additional context. |
| `actions` | `ReactNode` | No | — | CTA button(s) (e.g., `<Button>Try again</Button>`). Single slot — compose multiple buttons inside if needed. |
| `media` | `ReactNode` | No | — | Decorative illustration or image. Should use `alt=""` or `aria-hidden="true"` to hide from AT. |
| `size` | `"small" \| "large"` | No | `"small"` | Controls the size/layout of the component. |

> Note: Props `description`, `illustration`, `primaryAction`, and `secondaryAction` do not appear in the sandbox. The correct prop names are `children` (body text), `media` (illustration), and `actions` (CTA).

## Usage Examples

```tsx
import { Button, ContentMessage } from "@livingdesign/react";

// Basic empty state
<ContentMessage
  title="Warp reactor core primary coolant failure."
  media={<img alt="" height="200" src="/SearchNotFoundCircle.svg" width="200" />}
  actions={
    <Button size="medium" variant="primary">
      Adjust shield harmonics
    </Button>
  }
>
  Adjust shield harmonics to try again.
</ContentMessage>

// Large size
<ContentMessage
  size="large"
  title="No results found"
  media={<img alt="" height="200" src="/no-results.svg" width="200" />}
  actions={<Button variant="primary">Clear filters</Button>}
>
  Try adjusting your search or filters.
</ContentMessage>
```

## A11Y Notes

- The `media` prop should contain an image with `alt=""` (empty alt text) so AT treats it as decorative. All meaningful content is conveyed via `title` and `children`.
- The `title` renders as a heading element — ensure it fits the document heading hierarchy so AT users can navigate by heading.
- Content in the `actions` slot must have descriptive text. Avoid generic labels like "Click here" — use "Shop all products" or "Try again" so the purpose is clear out of context.
- `ContentMessage` is static inline content, not a live region. If it appears in response to a user action, the surrounding context or focus management should guide users to it.

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 1.1.1 Non-text Content | A | `media` illustration uses `alt=""` or `aria-hidden`; meaningful content is in `title` and `children`. |
| 1.3.1 Info and Relationships | A | `title` renders as a heading in the document hierarchy. |
| 2.4.4 Link Purpose (In Context) | A | CTA buttons/links in `actions` must have descriptive labels. |
