import fs from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { chromium } from "playwright";

async function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  let raw;
  try {
    raw = await fs.readFile(envPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

await loadEnvFile();

const ROOT = process.cwd();
const DEFAULT_PAGE = path.join(ROOT, "broken-pages-for-testing", "page1.html");
const RUN_ID = process.env.SCANNER_RUN_ID || new Date().toISOString().replace(/[:.]/g, "-");
const RESULTS_DIR = path.join(ROOT, "accessibility-audit-skill", "scanner-runs", "images", RUN_ID);
const WALMART_LLM_BASE_URL =
  process.env.WALMART_LLM_BASE_URL || "https://wmtllmgateway.stage.walmart.com/wmtllmgateway";
const DEFAULT_WALMART_MODEL = process.env.WALMART_LLM_MODEL || "claude-sonnet-4-6";

const VISUAL_GAP_PROMPT = `You are an expert WCAG 1.1.1 image, icon, emoji, and illustration accessibility auditor.

Analyze the screenshot and identify visual images/icons/emojis/illustrations/charts that are NOT represented in the provided DOM image/icon scan.

Rules:
- The DOM image/icon scan is already covered. Do not repeat those items.
- Only return missing visual image-like content that may need text alternative review.
- Include charts/canvas snapshots, image-only icons, standalone emojis, meaningful illustrations, and background images if visually important.
- Exclude decorative color blocks, borders, layout containers, and text-only content.
- Return only a JSON array. Do not use markdown fences.
- Each finding must include: description, classification, reason, suggested_alt, issue_type, bbox.
- bbox must be [x, y, width, height] in screenshot pixel coordinates.
- Return [] if the DOM scan covers the meaningful image-like content.

Example:
[
  {
    "description": "Trend chart",
    "classification": "Informative",
    "reason": "Chart conveys operational trend data not present in DOM image scan",
    "suggested_alt": "Summarize the chart trend and key threshold",
    "issue_type": "visual_gap",
    "bbox": [240, 120, 360, 180]
  }
]`;

function resolveBackend() {
  if (process.env.USE_MOCK_AI === "true") return "mock";
  if (process.env.RESULTS_FILE) return "results-file";
  if (process.env.AI_BACKEND) return process.env.AI_BACKEND;
  if (process.env.ELEMENT_API_KEY || process.env.WALMART_LLM_API_KEY) return "walmart-llm";
  return "mock";
}

function parseArgs() {
  const args = process.argv.slice(2);
  let pagePath;
  let all = false;

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--all") all = true;
    else if (args[i] === "--page" && args[i + 1]) {
      pagePath = args[i + 1];
      i += 1;
    }
  }

  return { pagePath, all };
}

async function listPages(all, pagePath) {
  if (all) {
    const dir = path.join(ROOT, "broken-pages-for-testing");
    const entries = await fs.readdir(dir);
    return entries
      .filter((f) => f.endsWith(".html"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => path.join(dir, f));
  }

  if (pagePath) return [path.resolve(ROOT, pagePath)];
  return [DEFAULT_PAGE];
}

function sanitizePageId(pagePath) {
  return path.basename(pagePath, path.extname(pagePath));
}

function parseFirstJsonArray(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start < 0 || end < 0 || end <= start) return [];
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return [];
  }
}

function providerForModel(model) {
  const m = model.toLowerCase();
  if (m.startsWith("claude")) return "claude";
  if (m.startsWith("gemini")) return "gemini";
  if (m.includes("llama") && m.includes("vision")) return "llama";
  if (m.startsWith("gpt-") || m.startsWith("o1") || m.startsWith("o3")) return "gpt";
  throw new Error(`Unknown WalmartLLM provider for model "${model}".`);
}

function walmartEndpointForProvider(provider) {
  if (provider === "claude") return `${WALMART_LLM_BASE_URL}/v1/messages`;
  if (provider === "gemini") return `${WALMART_LLM_BASE_URL}/v1/google-genai`;
  return `${WALMART_LLM_BASE_URL}/v1/chat/completions`;
}

function buildWalmartPayload(provider, model, prompt, base64Image) {
  const mediaType = "image/png";
  if (provider === "claude") {
    return {
      model,
      system: "You are an expert accessibility auditor. Return only valid JSON for the requested accessibility findings.",
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64Image } },
            { type: "text", text: prompt },
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 8192,
    };
  }

  if (provider === "gemini") {
    return {
      model,
      "model-version": "001",
      task: "generateContent",
      "model-params": {
        contents: [
          {
            role: "user",
            parts: [
              { inline_data: { mime_type: mediaType, data: base64Image } },
              { text: prompt },
            ],
          },
        ],
        generation_config: { temperature: 0.1, max_output_tokens: 8192 },
      },
    };
  }

  return {
    model,
    messages: [
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${mediaType};base64,${base64Image}` } },
          { type: "text", text: prompt },
        ],
      },
    ],
    temperature: 0.1,
    max_tokens: 4096,
  };
}

function extractWalmartText(provider, data) {
  if (provider === "claude") return (data.content || []).find((block) => block.type === "text")?.text || "";
  if (provider === "gemini") return data.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === "string")?.text || "";
  return data.choices?.[0]?.message?.content || "";
}

async function runWalmartPrompt(prompt, base64Image) {
  const apiKey = process.env.ELEMENT_API_KEY || process.env.WALMART_LLM_API_KEY;
  if (!apiKey) throw new Error("ELEMENT_API_KEY or WALMART_LLM_API_KEY is required when AI_BACKEND=walmart-llm.");

  const model = DEFAULT_WALMART_MODEL;
  const provider = providerForModel(model);
  const response = await fetch(walmartEndpointForProvider(provider), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(provider === "claude"
        ? { "x-api-key": apiKey, "anthropic-version": "vertex-2023-10-16" }
        : { "X-Api-Key": apiKey }),
    },
    body: JSON.stringify(buildWalmartPayload(provider, model, prompt, base64Image)),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WalmartLLM request failed (${response.status}): ${body.slice(0, 500)}`);
  }

  return extractWalmartText(provider, await response.json());
}

async function extractImageCandidates(page) {
  return page.evaluate(() => {
    const cssEscape = window.CSS?.escape || ((value) => String(value).replace(/["\\#.:,[\]>+~*'=]/g, "\\$&"));
    const EMOJI_RE = /[\p{Extended_Pictographic}\u2600-\u27BF]/u;
    const ICON_CLASS_RE = /\b(icon|fa-|material-icons|glyph|sprite|emoji|illustration|avatar|logo)\b/i;
    const selectorFor = (node) => {
      if (node.id) return `#${cssEscape(node.id)}`;
      const parts = [];
      let current = node;
      while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
        const tag = current.tagName.toLowerCase();
        const siblings = Array.from(current.parentElement?.children || []).filter(
          (child) => child.tagName === current.tagName,
        );
        const index = siblings.indexOf(current) + 1;
        parts.unshift(siblings.length > 1 ? `${tag}:nth-of-type(${index})` : tag);
        current = current.parentElement;
      }
      return `body > ${parts.join(" > ")}`;
    };

    const directText = (node) => Array.from(node.childNodes)
      .filter((child) => child.nodeType === Node.TEXT_NODE)
      .map((child) => child.textContent || "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
    const accessibleName = (node) =>
      node.getAttribute("aria-label") ||
      node.getAttribute("title") ||
      node.getAttribute("alt") ||
      "";
    const isIconLikeElement = (node) => {
      const text = directText(node);
      const classAndId = `${node.className || ""} ${node.id || ""}`;
      if (node.getAttribute("role") === "img") return true;
      if (ICON_CLASS_RE.test(classAndId)) return true;
      if (!text || !EMOJI_RE.test(text)) return false;
      const withoutEmoji = text.replace(/[\p{Extended_Pictographic}\u2600-\u27BF]/gu, "").trim();
      return withoutEmoji.length <= 3 && text.length <= 12;
    };

    const nodes = Array.from(document.querySelectorAll("img,input[type='image'],svg,canvas,[role='img']"));
    const iconLikeNodes = Array.from(document.querySelectorAll("button,a,span,i,em,b,strong,div"))
      .filter(isIconLikeElement);
    const backgroundNodes = Array.from(document.querySelectorAll("body *")).filter((node) => {
      const style = window.getComputedStyle(node);
      return style.backgroundImage && style.backgroundImage !== "none";
    });

    return [...new Set([...nodes, ...iconLikeNodes, ...backgroundNodes])]
      .map((node) => {
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        const style = window.getComputedStyle(node);
        const tag = node.tagName.toLowerCase();
        const alt = node.getAttribute("alt");
        const ariaLabel = node.getAttribute("aria-label");
        const title = node.getAttribute("title");
        const role = node.getAttribute("role") || "";
        const ariaHidden = node.getAttribute("aria-hidden") === "true";
        const direct = directText(node);
        const isEmojiIcon = EMOJI_RE.test(direct) && node.tagName.toLowerCase() !== "svg";
        const source =
          tag === "img" || tag === "input"
            ? node.getAttribute("src") || ""
            : style.backgroundImage && style.backgroundImage !== "none"
              ? style.backgroundImage
              : isEmojiIcon
                ? `emoji/icon: ${direct}`
                : tag;

        return {
          tag,
          selector: selectorFor(node),
          source,
          alt,
          ariaLabel,
          title,
          role,
          ariaHidden,
          bbox: [rect.x, rect.y, rect.width, rect.height],
          text: direct || (node.textContent || "").trim().slice(0, 160),
          accessibleName: accessibleName(node),
          isEmojiIcon,
          isIconLike: isIconLikeElement(node),
        };
      })
      .filter(Boolean);
  });
}

function analyzeImageCandidate(candidate, pageId, pagePath) {
  const hasAlt = candidate.alt !== null;
  const altText = candidate.alt ?? "";
  const hasName = Boolean(altText.trim() || candidate.ariaLabel?.trim() || candidate.title?.trim());
  const isHidden = candidate.ariaHidden || candidate.role === "presentation" || candidate.role === "none";
  const isCanvas = candidate.tag === "canvas";
  const isSvg = candidate.tag === "svg";
  const isBackground = /^url\(/.test(candidate.source || "");
  const isEmojiIcon = candidate.isEmojiIcon || candidate.isIconLike;
  const source = candidate.ariaLabel ? "aria-label" : candidate.title ? "title" : hasAlt ? "alt" : "none";

  let status = "pass";
  let severity = "info";
  let altQuality = "present";
  let notes = "Image-like element has an accessible name or is explicitly hidden/decorative.";

  if (isHidden) {
    altQuality = "decorative";
    notes = "Element is explicitly hidden or presentational.";
  } else if (isEmojiIcon && hasName) {
    status = "pass";
    severity = "info";
    altQuality = "present";
    notes = "Emoji/icon-like element has an accessible name or text alternative.";
  } else if (isEmojiIcon && !hasName) {
    status = "needs_review";
    severity = "medium";
    altQuality = "missing";
    notes = "Emoji/icon-like element may convey meaning. Confirm it is decorative or provide an accessible name.";
  } else if (candidate.tag === "img" && !hasAlt) {
    status = "fail";
    severity = "high";
    altQuality = "missing";
    notes = "img element is missing an alt attribute.";
  } else if (candidate.tag === "img" && hasAlt && !altText.trim()) {
    status = "needs_review";
    severity = "medium";
    altQuality = "empty";
    notes = "img has empty alt text. Confirm it is decorative.";
  } else if ((isCanvas || isSvg || isBackground) && !hasName && !isHidden) {
    status = "needs_review";
    severity = isCanvas ? "high" : "medium";
    altQuality = "missing";
    notes = `${candidate.tag} image/icon-like element needs accessible text or confirmation it is decorative.`;
  }

  return {
    page_id: pageId,
    page_url_or_fixture: pagePath,
    skill_name: "dom_image_scan",
    element_type: isEmojiIcon ? "icon" : "image",
    selector_or_location: candidate.selector,
    wcag_candidate: "1.1.1",
    severity,
    status,
    notes,
    image_src: candidate.source,
    alt_text: altText,
    alt_quality: altQuality,
    is_decorative: isHidden || altQuality === "decorative" ? "true" : "needs_review",
    name_source: source,
    bbox: candidate.bbox,
    icon_text: candidate.text || "",
  };
}

function normalizeDomFinding(row) {
  return {
    source: "dom-image-scan",
    text: row.image_src || row.selector_or_location,
    level: row.alt_quality || "n/a",
    reason: row.notes,
    selector: row.selector_or_location,
    status: row.status,
    severity: row.severity,
    issue_type: row.alt_quality,
    bbox: row.bbox,
    alt_text: row.alt_text,
    name_source: row.name_source,
    icon_text: row.icon_text,
  };
}

function normalizeVisualFinding(row) {
  return {
    source: "ai-visual-image-gaps",
    text: row.description || row.text || "visual image gap",
    level: row.classification || "needs_review",
    reason: row.reason || "",
    status: row.status || "needs_review",
    severity: row.severity || "medium",
    issue_type: row.issue_type || "visual_gap",
    bbox: Array.isArray(row.bbox) ? row.bbox : null,
    suggested_alt: row.suggested_alt || "",
  };
}

function combineFindings(domFindings, gapFindings) {
  return [
    ...domFindings.map((finding) => ({ ...finding, run_source: "DOM scan" })),
    ...gapFindings.map((finding) => ({ ...finding, run_source: "AI visual gap" })),
  ];
}

function colorForStatus(status, issueType) {
  const s = String(status || "").toLowerCase();
  const issue = String(issueType || "").toLowerCase();
  if (s === "pass" || s === "found") return "#16a34a";
  if (s === "needs_review" || s === "warn" || issue === "empty") return "#f59e0b";
  return "#dc2626";
}

async function highlightDom(page, rows) {
  for (const row of rows) {
    const color = colorForStatus(row.status, row.alt_quality);
    await page.evaluate(
      (payload) => {
        let target;
        try {
          target = document.querySelector(payload.selector);
        } catch {
          return;
        }
        if (!target) return;
        const shadow = payload.color === "#16a34a"
          ? "rgba(22, 163, 74, 0.18)"
          : payload.color === "#f59e0b"
            ? "rgba(245, 158, 11, 0.18)"
            : "rgba(220, 38, 38, 0.18)";
        target.style.outline = `4px solid ${payload.color}`;
        target.style.outlineOffset = "2px";
        target.style.boxShadow = `0 0 0 4px ${shadow}`;
        target.setAttribute("data-image-skill", payload.label);
        target.setAttribute("title", payload.label);
      },
      { selector: row.selector_or_location, color, label: `${row.status}:${row.alt_quality}` },
    );
  }
}

async function highlightBBoxes(page, rows) {
  await page.evaluate((inRows) => {
    const old = document.getElementById("__image_gap_overlay__");
    if (old) old.remove();
    const container = document.createElement("div");
    container.id = "__image_gap_overlay__";
    container.style.position = "fixed";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = "2147483647";

    inRows.forEach((row) => {
      if (!Array.isArray(row.bbox) || row.bbox.length !== 4) return;
      const [x, y, w, h] = row.bbox;
      const color = "#dc2626";
      const box = document.createElement("div");
      box.style.position = "absolute";
      box.style.left = `${x}px`;
      box.style.top = `${y}px`;
      box.style.width = `${w}px`;
      box.style.height = `${h}px`;
      box.style.border = `4px solid ${color}`;
      box.style.boxSizing = "border-box";
      box.style.background = "rgba(220,38,38,0.12)";
      const tag = document.createElement("div");
      tag.textContent = `visual gap: ${row.description || row.text || "image"}`;
      tag.style.position = "absolute";
      tag.style.left = "0";
      tag.style.top = "-18px";
      tag.style.font = "11px/1.2 sans-serif";
      tag.style.background = color;
      tag.style.color = "white";
      tag.style.padding = "1px 4px";
      tag.style.maxWidth = "340px";
      tag.style.overflow = "hidden";
      tag.style.whiteSpace = "nowrap";
      tag.style.textOverflow = "ellipsis";
      box.appendChild(tag);
      container.appendChild(box);
    });
    document.body.appendChild(container);
  }, rows);
}

function htmlEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderFindingRows(pageIndex, runIndex, findings) {
  if (!findings.length) return '<tr><td colspan="5" class="empty">No findings returned.</td></tr>';
  return findings
    .map((finding, findingIndex) => {
      const status = String(finding.status || finding.severity || finding.issue_type || "found").toLowerCase();
      const rowClass = status === "pass" || status === "found" || status === "info"
        ? "row-pass"
        : status === "needs_review" || status === "medium"
          ? "row-review"
          : "row-fail";
      return `<tr class="${rowClass}">
        <td>${htmlEscape(finding.run_source || finding.source || "")}</td>
        <td>${htmlEscape(finding.text)}</td>
        <td>${htmlEscape(finding.alt_text || finding.suggested_alt || finding.level || "n/a")}</td>
        <td><span class="status-chip ${rowClass}">${htmlEscape(finding.status || finding.severity || finding.issue_type || "found")}</span></td>
        <td>${htmlEscape(finding.reason)}</td>
        <td><button class="link-btn" type="button" onclick="openFindingDialog(${pageIndex}, ${runIndex}, ${findingIndex})">Review</button></td>
      </tr>`;
    })
    .join("\n");
}

function renderSummary(title, count, kind) {
  const cls = kind === "fail" ? "alert" : kind === "ok" ? "ok" : "review";
  return `<div class="issue-summary ${cls}"><strong>${htmlEscape(title)}</strong><p>${count}</p></div>`;
}

async function writeReviewHtml(outPath, results) {
  const cards = results
    .map((result, pageIndex) => {
      const combined = result.runs.find((run) => run.skill === "combined-image-review");
      const combinedIndex = result.runs.indexOf(combined);
      const failing = combined.findings.filter((finding) => finding.status === "fail").length;
      const review = combined.findings.filter((finding) => finding.status === "needs_review").length;
      return `<section class="card">
        <div class="card-header">
          <div>
            <h2>${htmlEscape(result.page_id)}</h2>
            <p>${htmlEscape(result.page_path)}</p>
          </div>
          <div class="header-pills">
            <div class="pill">${htmlEscape(result.backend)} · ${htmlEscape(result.model)}</div>
            <div class="pill ${failing ? "danger" : "success"}">${failing} image/icon failures</div>
            <div class="pill ${review ? "warning" : "success"}">${review} needs review</div>
          </div>
        </div>
        ${failing ? renderSummary("Image/icon failures detected", `${failing} DOM image/icon issue(s) failed WCAG 1.1.1 checks.`, "fail") : renderSummary("No blocking DOM image/icon failures", "DOM image/icon scan completed.", "ok")}
        ${result.ai_visual_gap_error ? renderSummary("AI visual gap pass did not complete", result.ai_visual_gap_error, "fail") : ""}
        <div class="images">
          <figure><div class="image-scroll"><img src="${htmlEscape(result.original_image)}" alt="Original page screenshot"></div><figcaption>Original</figcaption></figure>
          <figure><button class="image-open" type="button" onclick="openRunDialog(${pageIndex}, ${combinedIndex})"><div class="image-scroll"><img src="${htmlEscape(combined.highlighted_image)}" alt="Combined image and icon highlights"></div></button><figcaption>Annotated findings · ${combined.findings_count} findings</figcaption></figure>
        </div>
        <div class="tables single">
          <div>
            <h3>Image / Icon / Emoji Findings</h3>
            <div class="table-scroll"><table><thead><tr><th>Source</th><th>Element</th><th>Alt / Suggestion</th><th>Status</th><th>Reason</th><th>Dialog</th></tr></thead><tbody>${renderFindingRows(pageIndex, combinedIndex, combined.findings)}</tbody></table></div>
          </div>
        </div>
      </section>`;
    })
    .join("\n");
  const resultsJson = JSON.stringify(results).replaceAll("<", "\\u003c");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Image/Icon Skill Review</title>
  <style>
    :root { color-scheme: light; --blue: #2563eb; --border: #e2e8f0; --bg: #f8fafc; --text: #334155; }
    body { margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--text); background: var(--bg); }
    header, .card { max-width: 1280px; margin: 0 auto 24px; background: white; border: 1px solid var(--border); border-radius: 10px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08); }
    header { padding: 24px; border-bottom: 4px solid var(--blue); }
    h1, h2, h3 { margin: 0; color: #0f172a; }
    h1 { font-size: 28px; }
    h2 { font-size: 18px; }
    h3 { font-size: 15px; margin-bottom: 10px; }
    p { margin: 6px 0 0; color: #64748b; font-size: 13px; }
    .card-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; padding: 18px; border-bottom: 1px solid var(--border); }
    .header-pills { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
    .pill { background: #dbeafe; color: #1d4ed8; border-radius: 999px; padding: 4px 10px; font-size: 12px; font-weight: 700; white-space: nowrap; }
    .pill.danger { background: #fee2e2; color: #991b1b; }
    .pill.success { background: #dcfce7; color: #166534; }
    .pill.warning { background: #fef3c7; color: #92400e; }
    .issue-summary { margin: 14px 18px 0; border-radius: 8px; padding: 12px 14px; font-size: 13px; }
    .issue-summary.ok { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .issue-summary.alert { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    .issue-summary.review { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
    .images { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 18px; }
    figure { margin: 0; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: #f1f5f9; }
    .image-scroll { height: 420px; overflow: auto; background: white; }
    img { display: block; width: 100%; height: auto; background: white; }
    .image-open { display: block; width: 100%; border: 0; padding: 0; background: transparent; cursor: zoom-in; text-align: inherit; }
    figcaption { padding: 8px 10px; font-size: 12px; font-weight: 700; background: #f8fafc; border-top: 1px solid var(--border); }
    .tables { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 0 18px 18px; }
    .tables.single { grid-template-columns: 1fr; }
    .table-scroll { max-height: 360px; overflow: auto; border: 1px solid var(--border); border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid var(--border); padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f8fafc; color: #475569; position: sticky; top: 0; z-index: 1; }
    tr.row-pass td { background: #f0fdf4; }
    tr.row-fail td { background: #fef2f2; border-color: #fecaca; }
    tr.row-review td { background: #fffbeb; border-color: #fde68a; }
    .status-chip { display: inline-block; border-radius: 999px; padding: 2px 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .status-chip.row-pass { background: #dcfce7; color: #166534; }
    .status-chip.row-fail { background: #fee2e2; color: #991b1b; }
    .status-chip.row-review { background: #fef3c7; color: #92400e; }
    .link-btn { border: 1px solid #dc2626; color: #dc2626; background: #fff; border-radius: 6px; padding: 4px 8px; font-size: 12px; font-weight: 700; cursor: pointer; }
    .link-btn:hover { background: #fef2f2; }
    .empty { color: #94a3b8; text-align: center; }
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.72); z-index: 9999; align-items: center; justify-content: center; padding: 24px; }
    .modal-overlay.open { display: flex; }
    .modal { width: min(1180px, 96vw); max-height: 92vh; overflow: hidden; background: white; border-radius: 12px; box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35); display: flex; flex-direction: column; }
    .modal-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px 20px; border-bottom: 1px solid var(--border); }
    .close-btn { border: 0; background: #fee2e2; color: #991b1b; border-radius: 999px; width: 32px; height: 32px; font-size: 22px; line-height: 1; cursor: pointer; }
    .modal-body { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr); gap: 18px; padding: 18px 20px 20px; overflow: hidden; min-height: 0; }
    .modal-image-scroll { overflow: auto; max-height: calc(92vh - 160px); border: 1px solid var(--border); border-radius: 8px; background: #f8fafc; }
    .modal-image-scroll img { width: 100%; min-width: 720px; }
    .modal-details { overflow-y: auto; max-height: calc(92vh - 160px); padding-right: 4px; }
    .detail-card { border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 10px; background: #f8fafc; }
    .detail-card.active { border-color: #dc2626; background: #fef2f2; }
    pre { white-space: pre-wrap; overflow: auto; max-height: 220px; background: #0f172a; color: #e2e8f0; border-radius: 8px; padding: 10px; font-size: 12px; }
    @media (max-width: 900px) { .images, .tables, .modal-body { grid-template-columns: 1fr; } .modal-image-scroll, .modal-details { max-height: 42vh; } }
  </style>
</head>
<body>
  <header>
    <h1>Image/Icon Skill Review</h1>
    <p>Scan DOM images, icons, emojis, illustrations, charts, and background images first, then use AI to find visual gaps.</p>
  </header>
  ${cards}
  <div id="detail-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal">
      <div class="modal-header">
        <div>
          <h2 id="modal-title">Finding details</h2>
          <p id="modal-subtitle"></p>
        </div>
        <button class="close-btn" type="button" onclick="closeDialog()" aria-label="Close dialog">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-image-scroll">
          <img id="modal-image" src="" alt="Highlighted screenshot">
        </div>
        <div class="modal-details">
          <div id="modal-findings"></div>
          <details>
            <summary>Raw response</summary>
            <pre id="modal-raw"></pre>
          </details>
        </div>
      </div>
    </div>
  </div>
  <script id="review-data" type="application/json">${resultsJson}</script>
  <script>
    const REVIEW_DATA = JSON.parse(document.getElementById('review-data').textContent);
    const modal = document.getElementById('detail-modal');
    function escapeHtml(value) {
      return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
    }
    function openRunDialog(pageIndex, runIndex) { openDialog(pageIndex, runIndex, 0); }
    function openFindingDialog(pageIndex, runIndex, findingIndex) { openDialog(pageIndex, runIndex, findingIndex); }
    function openDialog(pageIndex, runIndex, findingIndex) {
      const page = REVIEW_DATA[pageIndex];
      const run = page.runs[runIndex];
      const activeIndex = Number.isInteger(findingIndex) ? findingIndex : 0;
      document.getElementById('modal-title').textContent = run.label + ' · ' + run.findings_count + ' findings';
      document.getElementById('modal-subtitle').textContent = page.page_id + ' · ' + page.backend + ' · ' + page.model;
      document.getElementById('modal-image').src = run.highlighted_image;
      document.getElementById('modal-raw').textContent = run.raw_response || '';
      document.getElementById('modal-findings').innerHTML = run.findings.length
        ? run.findings.map((finding, index) => '<div class="detail-card ' + (index === activeIndex ? 'active' : '') + '">' +
            '<h3>' + escapeHtml(finding.text || '(no source)') + '</h3>' +
            '<p><strong>Source:</strong> ' + escapeHtml(finding.run_source || finding.source || '') + '</p>' +
            '<p><strong>Status:</strong> ' + escapeHtml(finding.status || finding.severity || '') + '</p>' +
            '<p><strong>Issue:</strong> ' + escapeHtml(finding.issue_type || '') + '</p>' +
            (finding.alt_text !== undefined ? '<p><strong>Alt:</strong> ' + escapeHtml(finding.alt_text || '(empty)') + '</p>' : '') +
            (finding.suggested_alt ? '<p><strong>Suggested alt:</strong> ' + escapeHtml(finding.suggested_alt) + '</p>' : '') +
            (finding.selector ? '<p><strong>Selector:</strong> <code>' + escapeHtml(finding.selector) + '</code></p>' : '') +
            (finding.bbox ? '<p><strong>BBox:</strong> <code>' + escapeHtml(JSON.stringify(finding.bbox)) + '</code></p>' : '') +
            '<p><strong>Reason:</strong> ' + escapeHtml(finding.reason || '') + '</p>' +
          '</div>').join('')
        : '<p class="empty">No findings returned.</p>';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const active = modal.querySelector('.detail-card.active');
        if (active) active.scrollIntoView({ block: 'nearest' });
      }, 0);
    }
    function closeDialog() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
    modal.addEventListener('click', (event) => { if (event.target === modal) closeDialog(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDialog(); });
  </script>
</body>
</html>`;

  await fs.writeFile(outPath, html, "utf8");
}

async function evaluatePage(pagePath) {
  const pageId = sanitizePageId(pagePath);
  const pageUri = `file://${pagePath}`;
  const backend = resolveBackend();
  const model = backend === "walmart-llm" ? DEFAULT_WALMART_MODEL : backend;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(pageUri);

  await fs.mkdir(RESULTS_DIR, { recursive: true });
  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const base64Image = screenshotBuffer.toString("base64");
  const originalImage = `${pageId}_original.png`;
  await fs.writeFile(path.join(RESULTS_DIR, originalImage), screenshotBuffer);

  const imageCandidates = await extractImageCandidates(page);
  const domRows = imageCandidates.map((candidate) => analyzeImageCandidate(candidate, pageId, pagePath));
  const domRaw = JSON.stringify(imageCandidates, null, 2);

  const gapPrompt = [
    VISUAL_GAP_PROMPT,
    "",
    `Page: ${pagePath}`,
    "DOM image/icon/emoji/illustration elements already found JSON:",
    JSON.stringify(
      imageCandidates.map((candidate) => ({
        tag: candidate.tag,
        source: candidate.source,
        alt: candidate.alt,
        ariaLabel: candidate.ariaLabel,
        role: candidate.role,
        selector: candidate.selector,
        bbox: candidate.bbox,
      })),
      null,
      2,
    ),
  ].join("\n");

  let gapRaw;
  let gapError = null;
  if (backend === "mock") {
    console.log("Running in MOCK mode (skipping SDK call)");
    gapRaw = "[]";
  } else if (backend === "results-file") {
    const resultsData = JSON.parse(await fs.readFile(process.env.RESULTS_FILE, "utf8"));
    gapRaw = resultsData.gapRaw || "[]";
  } else {
    try {
      gapRaw = await runWalmartPrompt(gapPrompt, base64Image);
    } catch (error) {
      gapError = error.message;
      gapRaw = "[]";
      console.warn(`AI image visual gap pass failed; continuing with DOM image report. ${error.message}`);
    }
  }

  const gapRows = parseFirstJsonArray(gapRaw);
  const domFindings = domRows.map(normalizeDomFinding);
  const gapFindings = gapRows.map(normalizeVisualFinding);
  const combinedFindings = combineFindings(domFindings, gapFindings);

  await highlightDom(page, domRows);
  await highlightBBoxes(page, gapRows);
  const combinedHighlightedImage = `${pageId}_image_findings_highlighted.png`;
  await page.screenshot({ path: path.join(RESULTS_DIR, combinedHighlightedImage), fullPage: true });

  const result = {
    page_id: pageId,
    page_path: pagePath,
    category: "images",
    backend,
    model,
    generated_at: new Date().toISOString(),
    original_image: originalImage,
    ai_visual_gap_error: gapError,
    runs: [
      {
        skill: "combined-image-review",
        label: "Image/icon findings",
        findings_count: combinedFindings.length,
        findings: combinedFindings,
        highlighted_image: combinedHighlightedImage,
        raw_response: JSON.stringify({ dom_scan: JSON.parse(domRaw), ai_visual_gaps: parseFirstJsonArray(gapRaw) }, null, 2),
      },
    ],
  };

  await fs.writeFile(path.join(RESULTS_DIR, `${pageId}_image_results.json`), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  await browser.close();
  return result;
}

async function main() {
  const { all, pagePath } = parseArgs();
  const pages = await listPages(all, pagePath);
  const results = [];
  for (const p of pages) results.push(await evaluatePage(p));
  await writeReviewHtml(path.join(RESULTS_DIR, "review.html"), results);
  console.log(`Completed image skill evaluation for ${pages.length} page(s).`);
  console.log(`Results saved to: ${RESULTS_DIR}`);
  console.log(`Review page: ${path.join(RESULTS_DIR, "review.html")}`);
  exec(`open "${path.join(RESULTS_DIR, "review.html")}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
