
## Example: Small text fails AAA 7:1 contrast ratio

**What failed**: For AAA compliance, text contrast must be at least 7:1.

**Bad Code**:
```html
<p class="low-contrast-small-aaa">This small text does not have enough contrast</p>
```

**How it was fixed**: Applied the correct semantic fix.

**Corrected Code**:
```html
<p class="low-contrast-small-aaa" style="color: #333333;">This small text does not have enough contrast</p>
```
