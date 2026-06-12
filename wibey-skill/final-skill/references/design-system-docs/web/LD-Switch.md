# LD Switch — Living Design Web Component

**Source verified:** `/Users/g0c073y/Desktop/githubs/digital-toolkit/docs/components/switch/guidelines/SwitchGuidelines.tsx`
**Import:** `import { Switch } from "@livingdesign/react"`

## Props (SOURCE-VERIFIED)

| Prop | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `isOn` | boolean | no | `false` (stateful) | Current on/off state |
| `label` | string | no | — | Visible label text; also the accessible name |
| `onClick` | Function | no | — | e.g. `() => setIsOn(!isOn)` |
| `disabled` | boolean | no | `false` | |

> **⚠️ CRITICAL:** The prop is `isOn` (NOT `checked`). The callback is `onClick` (NOT `onChange`). Using `checked` or `onChange` will silently fail.

## Usage Examples

```tsx
const [isOn, setIsOn] = React.useState(false);

<Switch
  isOn={isOn}
  label="Impulse engines"
  onClick={() => setIsOn(!isOn)}
/>

// Disabled
<Switch
  isOn={false}
  label="Warp drive (offline)"
  onClick={() => {}}
  disabled
/>
```

## A11Y Notes

- `label` is the accessible name. Omitting it leaves the switch unnamed (WCAG 4.1.2 failure).
- `isOn` drives `aria-checked` automatically — do not manually set `aria-checked`.
- The component renders with `role="switch"` — do not substitute a `<button>` with `aria-pressed`.

## ⚠️ WCAG Failure Patterns

### ❌ Wrong prop names (very common error)
```tsx
// BAD — checked and onChange do NOT exist on Switch
<Switch checked={isOn} onChange={(e) => setIsOn(e.target.checked)} label="Dark mode" />

// GOOD — correct prop names are isOn and onClick
<Switch isOn={isOn} onClick={() => setIsOn(!isOn)} label="Dark mode" />
```

### ❌ Missing label
```tsx
// BAD — no accessible name
<Switch isOn={isOn} onClick={() => setIsOn(!isOn)} />

// GOOD
<Switch isOn={isOn} onClick={() => setIsOn(!isOn)} label="Enable notifications" />
```

## WCAG Criteria Addressed

| Criterion | Level | Notes |
|-----------|-------|-------|
| 2.1.1 Keyboard | A | Space toggles the switch. |
| 4.1.2 Name, Role, Value | A | `label` provides name; `role="switch"` + `aria-checked` managed automatically. |
