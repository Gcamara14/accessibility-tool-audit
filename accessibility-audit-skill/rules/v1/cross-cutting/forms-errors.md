---
id: R-CC-007
version: v1.0
owner: gio
status: approved
severity: must
wcag:
  - "1.3.1"
  - "3.3.1"
  - "3.3.2"
  - "3.3.3"
applies_to:
  - "all form controls and validation flows"
last_reviewed: "2026-06-15"
---

# Forms and Errors

## Why this rule exists

Forms fail quickly when labels, instructions, and errors are not explicit and associated with fields.

## MUST

- Inputs MUST have persistent labels.
- Required fields MUST be indicated and machine-readable.
- Error messages MUST be associated with specific fields and clear.

## MUST NOT

- Do not use placeholders as the only label.
- Do not show generic errors without field-level context.

## SHOULD (V1.1 candidates)

- Add suggestion text for common error recovery scenarios.
- Add autocomplete attributes for identity/payment fields where applicable.

## Good Example

```tsx
<label htmlFor="email">Email</label>
<input id="email" name="email" aria-describedby="email-error" required />
<p id="email-error">Enter a valid email address.</p>
```

## Bad Example

```tsx
<input placeholder="Email" />
<span style={{ color: "red" }}>Invalid</span>
```

## 30-Second Test

1. Submit empty form.
2. Confirm each failing field has clear message.
3. Confirm messages are associated in accessibility tree.

## Citations

- WCAG 2.1 SC 1.3.1 Info and Relationships
- WCAG 2.1 SC 3.3.1 Error Identification
- WCAG 2.1 SC 3.3.2 Labels or Instructions
- WCAG 2.1 SC 3.3.3 Error Suggestion

## Rule Changelog

- v1.0: Initial approved version.
