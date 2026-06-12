# Catalyst Template: Non-Text Content — JavaScript Injection to Add Alt Text to Server-Driven Images in `WKWebView`

**Template ID:** `WA11Y-IOS-1.1.1-006`
**Platform:** iOS
**WCAG Criterion:** 1.1.1 Non-Text Content
**Jira Label:** `WA11Y-IOS-1.1.1-006`
**Source Tickets:** CEPG-369682
**Source PRs:** [glass-app #158114](https://gecgithub01.walmart.com/Walmart-iOS/glass-app/pull/158114)
**Date Ingested:** 2026-05-07

---

## 🛑 The Problem

The "About the brand" section loads server-driven HTML into a `WKWebView`. The HTML content may contain `<img>` elements without `alt` attributes. When VoiceOver encounters these, it announces them as:

> **"image"** — no description of what the image shows

The HTML is produced by a back-end or CMS and cannot always be guaranteed to include `alt` attributes. The iOS client cannot control the HTML source but can inject JavaScript after the page loads to retroactively add `alt` text derived from available context (image title, aria-label, surrounding figcaption, or filename).

**Symptom (Jira):** "VoiceOver says just 'image' for brand images", "Screen reader announces marketing content images non-descriptively", "Brand page images have no alt text for VoiceOver".

---

## ✅ The Fix Pattern

### Inject JavaScript in `webView(_:didFinish:)` to add alt text to images missing it

```swift
// BrandMarketingContentView.swift  (or equivalent WKWebView host)

// MARK: - WKNavigationDelegate

func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    // ✅ After HTML loads, inject a11y fix for images lacking alt text
    enhanceWebViewAccessibility()
}

// MARK: - CEPG-369682 Accessibility

/// Inject JavaScript to ensure images in the marketing content HTML have
/// proper alternative text for VoiceOver (WCAG 1.1.1).
/// Server-driven HTML may contain images of text without `alt` attributes,
/// causing VoiceOver to announce them non-descriptively as just "image".
private func enhanceWebViewAccessibility() {
    let script = """
    (function() {
        var images = document.querySelectorAll('img');
        images.forEach(function(img) {
            var alt = (img.getAttribute('alt') || '').trim();
            // Only fix images that are missing alt text
            if (alt) return;

            var derived = '';

            // Tier 1: aria-label on the image itself
            derived = (img.getAttribute('aria-label') || '').trim();
            if (derived) { img.setAttribute('alt', derived); return; }

            // Tier 2: title attribute on the image
            derived = (img.getAttribute('title') || '').trim();
            if (derived) { img.setAttribute('alt', derived); return; }

            // Tier 3: figcaption text in the enclosing <figure>
            var figure = img.closest('figure');
            if (figure) {
                var caption = figure.querySelector('figcaption');
                if (caption) {
                    derived = (caption.textContent || '').trim();
                    if (derived) { img.setAttribute('alt', derived); return; }
                }
            }

            // Tier 4: surrounding paragraph or heading text (contextual)
            var parent = img.parentElement;
            if (parent) {
                var siblings = Array.from(parent.childNodes)
                    .filter(function(n) { return n.nodeType === Node.TEXT_NODE || n.nodeName === 'P' || n.nodeName === 'SPAN'; })
                    .map(function(n) { return (n.textContent || '').trim(); })
                    .filter(function(t) { return t.length > 0; });
                if (siblings.length > 0) {
                    derived = siblings.join(' ').substring(0, 120);
                    img.setAttribute('alt', derived);
                    return;
                }
            }

            // Tier 5: filename from src (last resort — better than "image")
            var src = img.getAttribute('src') || '';
            var filename = src.split('/').pop().split('?')[0].replace(/[_-]/g, ' ').replace(/\\.[^.]+$/, '');
            if (filename) {
                img.setAttribute('alt', filename);
            }
        });
    })();
    """

    webView.evaluateJavaScript(script) { result, error in
        if let error = error {
            // Log but do not crash — accessibility enhancement is best-effort
            Logger.accessibility.debug("Alt text injection failed: \\(error)")
        }
    }
}
```

---

### ❌ Bad Code — no post-load alt text fix

```swift
// ❌ Before fix:
func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    // ← No accessibility enhancement
    // ← Server HTML with missing alt attributes remains as-is
    // ← VoiceOver: "image" for every brand marketing image
}
```

---

### When to use this pattern vs. fixing the server

| Approach | When to use |
|---|---|
| JavaScript injection (this template) | Server-driven HTML you cannot control; short-term fix |
| Server-side alt text in HTML | Preferred long-term fix; add `alt` attribute in CMS/API response |
| `WKWebView` `accessibilityLabel` | Not applicable — only hides the entire web view from VoiceOver |

**Always file a ticket with the back-end/CMS team** to add `alt` attributes to server-generated images. The JavaScript injection is a client-side workaround for content you cannot immediately fix at the source.

---

### Alt text derivation priority

```
Image has alt="" (empty string) → skip (intentionally hidden from VoiceOver)
Image has alt="..." (non-empty) → skip (already accessible)

For images with no alt attribute:
1. aria-label on the <img>          → use directly
2. title on the <img>               → use directly
3. <figcaption> in enclosing figure → use caption text
4. Sibling text nodes in parent     → use up to 120 chars of context
5. Filename from src URL            → derive from filename (last resort)
```

**Do not set `alt=""` (empty string) via JavaScript.** An empty alt means the image is explicitly decorative. Only add a non-empty alt — if no source is available after all tiers, leave the alt unset rather than setting it to empty.

---

### Unit test approach

```swift
// BrandMarketingContentViewTests.swift

func test_ada_imageAltTextInjected_whenImageLacksAlt() {
    // Given — HTML with an <img> that has no alt, plus surrounding text
    let htmlWithImage = """
    <html><body>
    <p>Premium dog food brand</p>
    <img src="https://cdn.example.com/brand-logo.jpg" />
    </body></html>
    """

    let view = BrandMarketingContentView()
    view.loadHTML(htmlWithImage)

    // When — simulate webView:didFinish: (triggers enhanceWebViewAccessibility)
    view.webView(view.webView, didFinish: nil)

    // Then — evaluate the DOM to verify alt was derived
    let expectation = XCTestExpectation(description: "alt text injected")
    view.webView.evaluateJavaScript("document.querySelector('img').getAttribute('alt')") { result, _ in
        let alt = result as? String ?? ""
        XCTAssertFalse(alt.isEmpty, "Image alt text must be injected when original HTML has none")
        expectation.fulfill()
    }
    wait(for: [expectation], timeout: 5.0)
}
```

---

### `WKWebView` and VoiceOver: additional considerations

- `WKWebView` renders web content in a separate process. VoiceOver can traverse the web DOM's accessibility tree natively when the web content is properly structured.
- Images with `alt=""` (empty string) are treated as decorative by VoiceOver — VoiceOver skips them entirely. Do not inject `alt=""` — only inject meaningful non-empty text.
- Images with no `alt` attribute are announced as "image" with no further description — this is the bug this template fixes.
- For fully decorative images that should be hidden: inject `role="presentation"` or `alt=""` to explicitly mark them decorative (do not derive text from filename for purely decorative images).

---

## 🔑 Key Rules

- **Inject JavaScript in `webView(_:didFinish:)`, not `webView(_:didStartProvisionalNavigation:)`** — at `didFinish`, the DOM is fully loaded and all images are present. At earlier delegate callbacks, images may not yet be in the DOM.
- **Only fix images with no `alt` attribute** — images with `alt=""` (intentionally decorative) and images with a non-empty `alt` must be left unchanged.
- **Use a multi-tier derivation hierarchy** — `aria-label` → `title` → `figcaption` → sibling text → filename. Each tier provides progressively less accurate text; stop at the first successful tier.
- **Truncate derived alt text** — contextual text from sibling nodes can be very long. Truncate to a reasonable length (120 characters) to avoid excessively long VoiceOver announcements.
- **File a server-side ticket** — JavaScript injection is a stopgap. The canonical fix is adding `alt` attributes to server-generated HTML. Track the server-side fix as a follow-up.
- **Log injection errors, do not crash** — `evaluateJavaScript` can fail if the web view is not in the window hierarchy. Catch errors and log them; do not let accessibility enhancement break the page rendering.

---

## ⚠️ WCAG Failure Without This Fix

- **1.1.1 (Non-Text Content):** All non-text content that is presented to the user has a text alternative that serves the equivalent purpose. Images in server-driven HTML without `alt` attributes are presented to VoiceOver as "image" — a generic announcement that serves no equivalent purpose. The JavaScript injection post-load fix patches the DOM to add `alt` attributes derived from available context, ensuring that brand marketing images have meaningful alternative text accessible to VoiceOver users.

