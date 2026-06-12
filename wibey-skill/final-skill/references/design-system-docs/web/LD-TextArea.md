# LD `TextArea` Component — Web (React) Props Reference

**System:** Living Design (LD)
**Platform:** Web / React
**Component Map Key:** `DS-CE-Component-LD-TextArea`
**Doc Site:** https://digitaltoolkit.livingdesign.walmart.com/develop/react/components/text-area
**Date Ingested:** 2026-03-27
**Source:** Official LD Digital Toolkit (verified against source)

---

## Overview

The LD `TextArea` is a multi-line text input for longer freeform content (comments, descriptions, addresses). It requires a `label` prop (mandatory) — a placeholder alone is not a substitute. Error state is surfaced by passing the error message directly to the `error` prop (type `ReactNode`). Note: `error` overrides `helperText` when both are set. Supports an `isMagic` prop for AI-generated content indicators.

---

## Standard Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| `label` | `ReactNode` | — | ✅ | Visible label for the text area. Rendered as a `<label>` element associated to the textarea. |
| `onChange` | `(event: ChangeEvent<HTMLTextAreaElement>) => void` | — | ✅ | Callback fired when the text area value changes. |
| `value` | `string` | `""` | — | Controlled value. |
| `error` | `ReactNode` | — | — | Error message displayed below the field. Overrides `helperText` when set. Surfaced to AT programmatically. |
| `helperText` | `ReactNode` | — | — | Supplemental hint text below the field. Overridden by `error` when both are set. |
| `maxLength` | `number` | — | — | Maximum character count. Displays a character counter when set. |
| `maxLengthA11yAnnouncement` | `string` | `"${maxLength - value.length} characters left."` | — | Accessible announcement for the character counter. Override for localization. |
| `size` | `'small' \| 'large'` | `'large'` | — | Size of the text area. Two sizes only — no `medium`. |
| `disabled` | `boolean` | `false` | — | Disables the text area. |
| `readOnly` | `boolean` | `false` | — | Makes the field read-only. |
| `id` | `string` | auto-generated | — | HTML `id` for the `<textarea>`. Used to associate the label. |
| `isMagic` | `boolean` | `false` | — | Applies "magic" visual styles indicating AI-generated content. Adds an accessible description to the input. |
| `a11yMagicLabel` | `string` | `"AI Generated"` | — | Accessible description added when `isMagic` is true. Override for localization. |
| `textAreaProps` | `Omit<DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "ref">` | `{}` | — | Additional props spread directly to the underlying `<textarea>` element (e.g., `placeholder`, `rows`, `aria-describedby`). |
| `UNSAFE_className` | `string` | — | — | Additional CSS class override. Use with caution. |
| `UNSAFE_style` | `CSSProperties` | — | — | Inline style override. Use with caution. |

---

## ♿ Accessibility Props & Guidance

| Approach | How | WCAG Criterion | Notes |
|---|---|---|---|
| Visible label | `label` prop | **1.3.1 Info and Relationships** | Required. Rendered as a `<label>` element associated via `id`/`htmlFor`. Never omit. |
| Error message | `error` prop | **3.3.1 Error Identification** | Pass the error message string/node directly: `error="Description is required"`. This is surfaced programmatically to AT. Note: `error` overrides `helperText`. |
| Helper text | `helperText` prop | **3.3.2 Labels or Instructions** | Provides supplemental instructions. Suppressed when `error` is set. |
| Character count | `maxLength` + `maxLengthA11yAnnouncement` | **1.3.1 Info and Relationships** | When `maxLength` is set, LD renders a live character counter. `maxLengthA11yAnnouncement` controls the AT announcement — override for non-English locales. |
| AI content indicator | `isMagic` + `a11yMagicLabel` | **4.1.2 Name, Role, Value** | `isMagic` adds an accessible description (default: "AI Generated") to the textarea via `aria-describedby`. Override `a11yMagicLabel` for localization. |
| Native textarea attrs | `textAreaProps` | — | Use to pass `placeholder`, `rows`, `aria-describedby`, etc. directly to the underlying `<textarea>` element. |

> ⚠️ **`error` prop is `ReactNode`, not `boolean`.** Pass the error message directly: `error="This field is required"` — not `error={true}` with a separate `errorText`. There is no `errorText` prop.

> ⚠️ **There is no `medium` size.** Valid values are `'small'` and `'large'` only. Default is `'large'`.

> ⚠️ **Inline form validation is not supported by LD.** Per LD-991, inline validation is the consumer's responsibility. Ensure any custom error handling keeps form fields accessible.

---

## ⚠️ WCAG Failure Patterns

### ❌ Using `error={true}` Instead of Passing the Error Message

```tsx
// BAD — error prop takes the message, not a boolean
<TextArea label="Description" error={true} onChange={handleChange} />

// GOOD — pass the error message directly
<TextArea
  label="Description"
  error="Description is required and cannot be empty"
  onChange={handleChange}
/>
```

---

### ❌ Using `helpText` Instead of `helperText`

```tsx
// BAD — wrong prop name; helpText doesn't exist in LD TextArea
<TextArea label="Comments" helpText="Max 500 characters" onChange={handleChange} />

// GOOD — correct prop name
<TextArea label="Comments" helperText="Max 500 characters" onChange={handleChange} />
```

---

### ❌ Using Placeholder as the Only Label

```tsx
// BAD — no label; placeholder disappears on focus
<TextArea textAreaProps={{ placeholder: "Enter your comment" }} onChange={handleChange} />

// GOOD — explicit label + optional placeholder via textAreaProps
<TextArea
  label="Comment"
  textAreaProps={{ placeholder: "Share your thoughts..." }}
  onChange={handleChange}
/>
```

---

### ❌ `isMagic` Without Localizing `a11yMagicLabel`

```tsx
// BAD — English "AI Generated" hardcoded for all locales
<TextArea isMagic label="Description" onChange={handleChange} />

// GOOD — override with localized string
<TextArea
  isMagic
  a11yMagicLabel={m(messages, "aiGeneratedLabel")}
  label="Description"
  onChange={handleChange}
/>
```

---

### ❌ Character Counter Without Localized Announcement

```tsx
// BAD — English-only announcement for non-English users
<TextArea label="Bio" maxLength={200} onChange={handleChange} />

// GOOD — override announcement for localization
<TextArea
  label="Bio"
  maxLength={200}
  maxLengthA11yAnnouncement={m(messages, "charsRemaining", { count: remaining })}
  onChange={handleChange}
/>
```

---

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|---|---|---|
| 1.3.1 Info and Relationships | A | `label` is programmatically associated via `htmlFor`/`id`; `error` and `helperText` are associated via `aria-describedby`. |
| 2.1.1 Keyboard | A | TextArea is natively keyboard accessible. |
| 3.3.1 Error Identification | A | `error` prop surfaces the error message to AT. |
| 3.3.2 Labels or Instructions | A | `label` provides the persistent label; `helperText` provides supplemental instructions. |
| 4.1.2 Name, Role, Value | A | `label` provides the name; `isMagic` adds an accessible AI-generated description via `aria-describedby`. |
