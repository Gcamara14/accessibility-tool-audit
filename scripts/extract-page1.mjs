import { chromium } from "playwright";
import path from "path";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${process.cwd()}/broken-pages-for-testing/page1.html`);

  const data = await page.evaluate(() => {
    const tags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "div", "a", "li", "label", "button"];
    const nodes = Array.from(document.querySelectorAll(tags.join(",")));
    return nodes
      .map((node) => {
        const text = (node.textContent || "").trim();
        if (!text || text.length > 100) return null; // Ignore huge text blocks
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        const style = window.getComputedStyle(node);
        return {
          text: text.replace(/\n/g, ' ').slice(0, 50),
          tag: node.tagName.toLowerCase(),
          className: node.className,
          fontSizePx: Number.parseFloat(style.fontSize || "0"),
          fontWeight: style.fontWeight || "",
          bbox: [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)]
        };
      })
      .filter(Boolean)
      .filter(n => n.fontSizePx > 16 || n.fontWeight >= 600 || n.tag.match(/^h[1-6]$/)) // Only heading-like things
      .slice(0, 30); // Get first 30 for analysis
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}
main();
