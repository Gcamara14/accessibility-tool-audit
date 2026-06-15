---
id: R-CMP-013
version: v1.0
owner: gio
status: draft
severity: must
wcag: ["4.1.3", "3.2.2", "2.2.2"]
applies_to: ["Toast", "Alert", "InlineAlert", "Banner"]
last_reviewed: "2026-06-15"
---

# Toast and Alert

## MUST
- Important status updates are announced with appropriate live-region semantics.
- Alerts provide clear text and not color-only differentiation.
- Auto-dismiss messages allow sufficient time or control where required.

## MUST NOT
- Do not show critical errors as silent visual-only toasts.
- Do not interrupt focus unexpectedly for non-critical notices.

## SHOULD (V1.1 candidates)
- Add severity-to-announcement policy (`status`, `alert`, polite vs assertive).

## Citations
- WCAG 2.1 SC 4.1.3, 3.2.2, 2.2.2
