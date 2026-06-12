import fs from "node:fs/promises";
import path from "node:path";
import { exec } from "node:child_process";
import { chromium } from "playwright";
import { Agent } from "@cursor/sdk";

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
const RESULTS_DIR = path.join(ROOT, "accessibility-audit-skill", "results");
const V1_PROMPT_PATH = path.join(
  ROOT,
  "accessibility-audit-skill",
  "sub-skills",
  "headings",
  "SKILL_V1.md",
);
const LEGACY_PROMPT_PATH = path.join(ROOT, "existing-skills", "01-headings.md");
const VISUAL_HEADING_PROMPT = `You are an expert accessibility auditor specializing in web heading structure.

Analyze the screenshot only. Identify visible text that functions as a page or section heading.

Rules:
- Include the main page title and section headings that organize content below them.
- Exclude buttons, labels, data values, badges, table cell values, chart labels, and decorative text.
- Return only a JSON array. Do not use markdown fences.
- Each finding must include: text, level, reason, bbox.
- Use bbox as [x, y, width, height] in screenshot pixel coordinates.

Example:
[
  { "text": "Dashboard", "level": "H1", "reason": "Main page title", "bbox": [24, 16, 180, 32] }
]`;
const WALMART_LLM_BASE_URL =
  process.env.WALMART_LLM_BASE_URL || "https://wmtllmgateway.stage.walmart.com/wmtllmgateway";
const DEFAULT_WALMART_MODEL = process.env.WALMART_LLM_MODEL || "claude-opus-4";

function resolveBackend() {
  if (process.env.USE_MOCK_AI === "true") return "mock";
  if (process.env.RESULTS_FILE) return "results-file";
  if (process.env.AI_BACKEND) return process.env.AI_BACKEND;
  if (process.env.ELEMENT_API_KEY || process.env.WALMART_LLM_API_KEY) return "walmart-llm";
  return "cursor-sdk";
}

function parseArgs() {
  const args = process.argv.slice(2);
  let pagePath;
  let all = false;

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--all") {
      all = true;
    } else if (args[i] === "--page" && args[i + 1]) {
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

async function loadPromptCore(markdownPath) {
  const raw = await fs.readFile(markdownPath, "utf8");
  const match = raw.match(/```text([\s\S]*?)```/);
  return (match?.[1] ?? raw).trim();
}

async function loadLegacyPass2A(markdownPath) {
  const raw = await fs.readFile(markdownPath, "utf8");
  const section = raw.match(
    /## PASS 2A[\s\S]*?```text?([\s\S]*?)```|## PASS 2A[\s\S]*?```([\s\S]*?)```/,
  );
  if (section?.[1]) return section[1].trim();
  if (section?.[2]) return section[2].trim();
  return raw;
}

async function extractHtml(page) {
  return page.evaluate(() => document.documentElement.outerHTML);
}

async function extractHeadingCandidates(page) {
  return page.evaluate(() => {
    const cssEscape = window.CSS?.escape || ((value) => String(value).replace(/["\\#.:,[\]>+~*'=]/g, "\\$&"));
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

    const nodes = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6,[role='heading']"));
    return nodes
      .map((node) => {
        const text = (node.textContent || "").trim();
        if (!text) return null;
        const rect = node.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        const style = window.getComputedStyle(node);
        return {
          text,
          tag: node.tagName.toLowerCase(),
          role: node.getAttribute("role") || "",
          selector: selectorFor(node),
          headingLevel: node.getAttribute("aria-level") || node.tagName.replace(/^H/i, ""),
          fontSizePx: Number.parseFloat(style.fontSize || "0"),
          fontWeight: style.fontWeight || "",
          fontFamily: style.fontFamily || "",
          bbox: [rect.x, rect.y, rect.width, rect.height],
        };
      })
      .filter(Boolean);
  });
}

function parseMarkdownTable(text) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") && l.endsWith("|"));
  if (lines.length < 3) return [];

  const headers = lines[0]
    .slice(1, -1)
    .split("|")
    .map((h) => h.trim());

  return lines
    .slice(2)
    .map((line) => line.slice(1, -1).split("|").map((v) => v.trim()))
    .map((values) => {
      const row = {};
      headers.forEach((h, i) => {
        row[h] = values[i];
      });
      return row;
    });
}

function parseFirstJsonArray(text) {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start < 0 || end < 0 || end <= start) return [];
  const maybe = text.slice(start, end + 1);
  try {
    return JSON.parse(maybe);
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
  const userText = [
    prompt,
    "",
    "Return only the requested structured output. Do not wrap the response in markdown unless the prompt explicitly asks for a markdown table.",
  ].join("\n");

  if (provider === "claude") {
    return {
      model,
      messages: [
        {
          role: "user",
          content: [
            base64Image
              ? {
                  type: "image",
                  source: { type: "base64", media_type: mediaType, data: base64Image },
                }
              : null,
            { type: "text", text: userText },
          ].filter(Boolean),
        },
      ],
      temperature: 0.1,
      max_tokens: 4096,
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
              base64Image ? { inline_data: { mime_type: mediaType, data: base64Image } } : null,
              { text: userText },
            ].filter(Boolean),
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
          base64Image
            ? { type: "image_url", image_url: { url: `data:${mediaType};base64,${base64Image}` } }
            : null,
          { type: "text", text: userText },
        ].filter(Boolean),
      },
    ],
    temperature: 0.1,
    max_tokens: 4096,
  };
}

function extractWalmartText(provider, data) {
  if (provider === "claude") {
    return (data.content || []).find((block) => block.type === "text")?.text || "";
  }
  if (provider === "gemini") {
    const parts = data.candidates?.[0]?.content?.parts || [];
    return parts.find((part) => typeof part.text === "string")?.text || "";
  }
  return data.choices?.[0]?.message?.content || "";
}

async function runWalmartPrompt(prompt, base64Image) {
  const apiKey = process.env.ELEMENT_API_KEY || process.env.WALMART_LLM_API_KEY;
  if (!apiKey) {
    throw new Error("ELEMENT_API_KEY or WALMART_LLM_API_KEY is required when AI_BACKEND=walmart-llm.");
  }

  const model = DEFAULT_WALMART_MODEL;
  const provider = providerForModel(model);
  const endpoint = walmartEndpointForProvider(provider);
  const payload = buildWalmartPayload(provider, model, prompt, base64Image);
  const headers = {
    "Content-Type": "application/json",
    ...(provider === "claude"
      ? { "x-api-key": apiKey, "anthropic-version": "vertex-2023-10-16" }
      : { "X-Api-Key": apiKey }),
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WalmartLLM request failed (${response.status}): ${body.slice(0, 500)}`);
  }

  return extractWalmartText(provider, await response.json());
}

function sanitizePageId(pagePath) {
  return path.basename(pagePath, path.extname(pagePath));
}

async function runSkillPrompt(prompt, base64Image) {
  const backend = resolveBackend();
  if (backend === "walmart-llm") {
    return runWalmartPrompt(prompt, base64Image);
  }

  if (backend !== "cursor-sdk") {
    throw new Error(`runSkillPrompt does not support backend "${backend}" directly.`);
  }

  const message = base64Image ? {
    text: prompt,
    images: [{ data: base64Image, mimeType: "image/png" }]
  } : prompt;

  const result = await Agent.prompt(message, {
    apiKey: process.env.CURSOR_API_KEY,
    model: { id: "composer-2.5" },
    local: { cwd: ROOT },
  });
  return result.result ?? "";
}

function normalizeV1Finding(row) {
  return {
    source: "heading-screenshot-code",
    text: row.heading_text || "",
    level: row.heading_level && row.heading_level !== "null" ? `H${row.heading_level}` : null,
    reason: row.notes || "",
    selector: row.selector_or_location || "",
    status: row.status || "",
    severity: row.severity || "",
    issue_type: row.hierarchy_issue_type || "",
  };
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
}

function candidateToCodeRow(candidate, sourceRow) {
  return {
    ...sourceRow,
    selector_or_location: candidate.selector,
    heading_text: candidate.text,
    heading_level: candidate.headingLevel || sourceRow.heading_level || "",
    notes: sourceRow.notes || `Concrete candidate selector for ${candidate.text}`,
    hierarchy_issue_type: sourceRow.hierarchy_issue_type || "none",
  };
}

function repairCodeRows(rows, candidates) {
  const usedSelectors = new Set();
  const repaired = [];

  for (const row of rows) {
    const selector = row.selector_or_location || "";
    const rowText = normalizeText(row.heading_text);
    const isGrouped =
      /\bmultiple\b/i.test(selector) ||
      /^various\b/i.test(row.heading_text || "") ||
      /\bvarious\b/i.test(row.notes || "");

    if (isGrouped) {
      const tagMatch = selector.match(/\b(h[1-6])\b/i);
      const matchingCandidates = candidates.filter((candidate) => {
        if (tagMatch && candidate.tag !== tagMatch[1].toLowerCase()) return false;
        return !usedSelectors.has(candidate.selector);
      });

      for (const candidate of matchingCandidates) {
        usedSelectors.add(candidate.selector);
        repaired.push(candidateToCodeRow(candidate, row));
      }
      continue;
    }

    const exactCandidate = candidates.find((candidate) => {
      if (usedSelectors.has(candidate.selector)) return false;
      if (selector === candidate.selector) return true;
      return rowText && normalizeText(candidate.text) === rowText;
    });

    if (exactCandidate) {
      usedSelectors.add(exactCandidate.selector);
      repaired.push(candidateToCodeRow(exactCandidate, row));
    } else {
      repaired.push(row);
    }
  }

  return repaired;
}

function normalizeVisualFinding(row) {
  return {
    source: "heading-screenshot-only",
    text: row.text || row.heading_text || "",
    level: row.level || row.heading_level || null,
    reason: row.reason || row.notes || "",
    bbox: Array.isArray(row.bbox) ? row.bbox : null,
  };
}

function v1Color(row) {
  return "#dc2626";
}

async function highlightV1(page, rows) {
  for (const row of rows) {
    const selector = row.selector_or_location;
    if (!selector || selector === "none") continue;
    const color = v1Color(row);
    await page.evaluate(
      (payload) => {
        const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
        let candidates = [];
        try {
          candidates = Array.from(document.querySelectorAll(payload.selector));
        } catch {
          return;
        }
        if (!candidates.length) return;

        const wantedText = normalize(payload.text);
        const target =
          candidates.find((el) => !el.hasAttribute("data-heading-skill") && normalize(el.textContent) === wantedText) ||
          candidates.find((el) => !el.hasAttribute("data-heading-skill") && normalize(el.textContent).includes(wantedText)) ||
          candidates.find((el) => !el.hasAttribute("data-heading-skill")) ||
          candidates[0];

        target.style.outline = `4px solid ${payload.color}`;
        target.style.outlineOffset = "2px";
        target.style.boxShadow = `0 0 0 4px rgba(220, 38, 38, 0.18)`;
        target.setAttribute("data-heading-skill", payload.label);
        target.setAttribute("title", payload.label);
      },
      {
        selector,
        color,
        text: row.heading_text || "",
        label: `${row.status || "unknown"}:${row.hierarchy_issue_type || "none"}`,
      },
    );
  }
}

async function highlightLegacy(page, rows) {
  await page.evaluate((inRows) => {
    const old = document.getElementById("__legacy_heading_overlay__");
    if (old) old.remove();
    const container = document.createElement("div");
    container.id = "__legacy_heading_overlay__";
    container.style.position = "fixed";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = "2147483647";

    inRows.forEach((row) => {
      if (!Array.isArray(row.bbox) || row.bbox.length !== 4) return;
      const [x, y, w, h] = row.bbox;
      const box = document.createElement("div");
      box.style.position = "absolute";
      box.style.left = `${x}px`;
      box.style.top = `${y}px`;
      box.style.width = `${w}px`;
      box.style.height = `${h}px`;
      box.style.border = "4px solid #dc2626";
      box.style.boxSizing = "border-box";
      box.style.background = "rgba(220,38,38,0.12)";

      const tag = document.createElement("div");
      tag.textContent = `legacy ${row.level}: ${row.text}`;
      tag.style.position = "absolute";
      tag.style.left = "0";
      tag.style.top = "-18px";
      tag.style.font = "11px/1.2 sans-serif";
      tag.style.background = "#dc2626";
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

async function writeReport(outPath, pagePath, visualRows, codeRows, visualRaw, codeRaw) {
  const content = [
    "# Heading Skill Comparison Report",
    "",
    `- page: \`${pagePath}\``,
    `- screenshot-only finding count: ${visualRows.length}`,
    `- screenshot + code finding count: ${codeRows.length}`,
    "",
    "## Screenshot-only parsed rows",
    "```json",
    JSON.stringify(visualRows, null, 2),
    "```",
    "",
    "## Screenshot + code parsed rows",
    "```json",
    JSON.stringify(codeRows, null, 2),
    "```",
    "",
    "## Screenshot-only raw model output",
    "```text",
    visualRaw,
    "```",
    "",
    "## Screenshot + code raw model output",
    "```text",
    codeRaw,
    "```",
    "",
  ].join("\n");

  await fs.writeFile(outPath, content, "utf8");
}

async function writeJsonResult(outPath, result) {
  await fs.writeFile(outPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
}

function htmlEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderFindingRows(pageIndex, runIndex, findings) {
  if (!findings.length) {
    return '<tr><td colspan="5" class="empty">No findings returned.</td></tr>';
  }

  return findings
    .map(
      (finding) => `<tr>
        <td>${htmlEscape(finding.text)}</td>
        <td>${htmlEscape(finding.level || "n/a")}</td>
        <td>${htmlEscape(finding.status || finding.severity || finding.issue_type || "found")}</td>
        <td>${htmlEscape(finding.reason)}</td>
        <td><button class="link-btn" type="button" onclick="openFindingDialog(${pageIndex}, ${runIndex}, ${findings.indexOf(finding)})">Review</button></td>
      </tr>`,
    )
    .join("\n");
}

async function writeReviewHtml(outPath, results) {
  const cards = results
    .map((result, pageIndex) => {
      const visual = result.runs.find((run) => run.skill === "heading-screenshot-only");
      const code = result.runs.find((run) => run.skill === "heading-screenshot-code");
      const visualIndex = result.runs.indexOf(visual);
      const codeIndex = result.runs.indexOf(code);
      return `<section class="card">
        <div class="card-header">
          <div>
            <h2>${htmlEscape(result.page_id)}</h2>
            <p>${htmlEscape(result.page_path)}</p>
          </div>
          <div class="pill">${htmlEscape(result.backend)} · ${htmlEscape(result.model)}</div>
        </div>
        <div class="images">
          <figure><div class="image-scroll"><img src="${htmlEscape(result.original_image)}" alt="Original page screenshot"></div><figcaption>Original</figcaption></figure>
          <figure><button class="image-open" type="button" onclick="openRunDialog(${pageIndex}, ${visualIndex})"><div class="image-scroll"><img src="${htmlEscape(visual.highlighted_image)}" alt="Screenshot-only highlighted headings"></div></button><figcaption>Screenshot only · ${visual.findings_count} findings</figcaption></figure>
          <figure><button class="image-open" type="button" onclick="openRunDialog(${pageIndex}, ${codeIndex})"><div class="image-scroll"><img src="${htmlEscape(code.highlighted_image)}" alt="Screenshot plus code highlighted headings"></div></button><figcaption>Screenshot + code · ${code.findings_count} findings</figcaption></figure>
        </div>
        <div class="tables">
          <div>
            <h3>Screenshot-Only Headings</h3>
            <div class="table-scroll"><table><thead><tr><th>Text</th><th>Level</th><th>Status</th><th>Reason</th><th>Dialog</th></tr></thead><tbody>${renderFindingRows(pageIndex, visualIndex, visual.findings)}</tbody></table></div>
          </div>
          <div>
            <h3>Screenshot + Code Headings</h3>
            <div class="table-scroll"><table><thead><tr><th>Text</th><th>Level</th><th>Status</th><th>Reason</th><th>Dialog</th></tr></thead><tbody>${renderFindingRows(pageIndex, codeIndex, code.findings)}</tbody></table></div>
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
  <title>Heading Skill Review</title>
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
    .pill { background: #dbeafe; color: #1d4ed8; border-radius: 999px; padding: 4px 10px; font-size: 12px; font-weight: 700; white-space: nowrap; }
    .images { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding: 18px; }
    figure { margin: 0; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: #f1f5f9; }
    .image-scroll { height: 420px; overflow: auto; background: white; }
    img { display: block; width: 100%; height: auto; background: white; }
    .image-open { display: block; width: 100%; border: 0; padding: 0; background: transparent; cursor: zoom-in; text-align: inherit; }
    figcaption { padding: 8px 10px; font-size: 12px; font-weight: 700; background: #f8fafc; border-top: 1px solid var(--border); }
    .tables { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding: 0 18px 18px; }
    .table-scroll { max-height: 360px; overflow: auto; border: 1px solid var(--border); border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid var(--border); padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f8fafc; color: #475569; position: sticky; top: 0; z-index: 1; }
    .link-btn { border: 1px solid #dc2626; color: #dc2626; background: #fff; border-radius: 6px; padding: 4px 8px; font-size: 12px; font-weight: 700; cursor: pointer; }
    .link-btn:hover { background: #fef2f2; }
    .empty { color: #94a3b8; text-align: center; }
    .modal-overlay { display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.72); z-index: 9999; align-items: center; justify-content: center; padding: 24px; }
    .modal-overlay.open { display: flex; }
    .modal { width: min(1180px, 96vw); max-height: 92vh; overflow: hidden; background: white; border-radius: 12px; box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35); display: flex; flex-direction: column; }
    .modal-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 18px 20px; border-bottom: 1px solid var(--border); }
    .modal-header p { margin-top: 4px; }
    .close-btn { border: 0; background: #fee2e2; color: #991b1b; border-radius: 999px; width: 32px; height: 32px; font-size: 22px; line-height: 1; cursor: pointer; }
    .modal-body { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr); gap: 18px; padding: 18px 20px 20px; overflow: hidden; min-height: 0; }
    .modal-image-scroll { overflow: auto; max-height: calc(92vh - 160px); border: 1px solid var(--border); border-radius: 8px; background: #f8fafc; }
    .modal-image-scroll img { width: 100%; min-width: 720px; }
    .modal-details { overflow-y: auto; max-height: calc(92vh - 160px); padding-right: 4px; }
    .detail-card { border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 10px; background: #f8fafc; }
    .detail-card.active { border-color: #dc2626; background: #fef2f2; }
    .detail-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 800; margin-bottom: 3px; }
    pre { white-space: pre-wrap; overflow: auto; max-height: 220px; background: #0f172a; color: #e2e8f0; border-radius: 8px; padding: 10px; font-size: 12px; }
    @media (max-width: 900px) { .images, .tables, .modal-body { grid-template-columns: 1fr; } .modal-image-scroll, .modal-details { max-height: 42vh; } }
  </style>
</head>
<body>
  <header>
    <h1>Heading Skill Review</h1>
    <p>Compare screenshot-only heading detection against screenshot + code heading detection.</p>
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
            <summary>Raw model response</summary>
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
      return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
    }

    function findingStatus(finding) {
      return finding.status || finding.severity || finding.issue_type || 'found';
    }

    function openRunDialog(pageIndex, runIndex) {
      openDialog(pageIndex, runIndex, 0);
    }

    function openFindingDialog(pageIndex, runIndex, findingIndex) {
      openDialog(pageIndex, runIndex, findingIndex);
    }

    function openDialog(pageIndex, runIndex, findingIndex) {
      const page = REVIEW_DATA[pageIndex];
      const run = page.runs[runIndex];
      const activeIndex = Number.isInteger(findingIndex) ? findingIndex : 0;

      document.getElementById('modal-title').textContent = run.skill + ' · ' + run.findings_count + ' findings';
      document.getElementById('modal-subtitle').textContent = page.page_id + ' · ' + page.backend + ' · ' + page.model;
      document.getElementById('modal-image').src = run.highlighted_image;
      document.getElementById('modal-raw').textContent = run.raw_response || '';
      document.getElementById('modal-findings').innerHTML = run.findings.length
        ? run.findings.map((finding, index) => '<div class="detail-card ' + (index === activeIndex ? 'active' : '') + '">' +
            '<div class="detail-label">Finding ' + (index + 1) + '</div>' +
            '<h3>' + escapeHtml(finding.text || '(no text)') + '</h3>' +
            '<p><strong>Level:</strong> ' + escapeHtml(finding.level || 'n/a') + '</p>' +
            '<p><strong>Status:</strong> ' + escapeHtml(findingStatus(finding)) + '</p>' +
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

    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeDialog();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeDialog();
    });
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

  const v1PromptTemplate = await loadPromptCore(V1_PROMPT_PATH);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(pageUri);

  // Capture screenshot for AI vision context
  await fs.mkdir(RESULTS_DIR, { recursive: true });
  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const base64Image = screenshotBuffer.toString("base64");
  const originalImage = `${pageId}_original.png`;
  await fs.writeFile(path.join(RESULTS_DIR, originalImage), screenshotBuffer);

  const [html, headingCandidates] = await Promise.all([extractHtml(page), extractHeadingCandidates(page)]);
  const codePrompt = v1PromptTemplate
    .replace("{{PAGE_ID}}", pageId)
    .replace("{{PAGE_FIXTURE}}", pagePath)
    .replace("{{HTML_CONTENT}}", html) + [
      "",
      "Highlighting contract:",
      "- Return one table row per concrete heading element. Never group findings.",
      "- Do not use selectors like `h2 (multiple)`, `h3`, `various`, or `div with font-weight`.",
      "- For every real heading, use the exact `selector` value from the candidate list below in selector_or_location.",
      "- If a heading is not in the candidate list, set status to needs_review and do not invent a selector.",
      "",
      "Concrete heading candidates JSON:",
      JSON.stringify(headingCandidates, null, 2),
    ].join("\n");

  const visualPrompt = [
    VISUAL_HEADING_PROMPT,
    "",
    `Page: ${pagePath}`,
    "Use the screenshot as your only source of truth. Do not use or infer from DOM/code.",
  ].join("\n");

  let visualRaw, codeRaw;
  if (backend === "mock") {
    console.log("Running in MOCK mode (skipping SDK call)");
    codeRaw = `| page_id | page_url_or_fixture | skill_name | element_type | selector_or_location | wcag_candidate | severity | status | notes | heading_text | heading_level | is_hierarchy_valid | hierarchy_issue_type |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PG-001 | mock | headings_inventory | heading | h1 | 1.3.1 | low | pass | Mock valid heading | Mock H1 | 1 | true | none |
| PG-001 | mock | headings_inventory | heading | .fake-heading | 1.3.1 | high | fail | Mock fake heading | Fake Heading | null | false | fake_heading |`;
    visualRaw = `[
      { "text": "Mock H1", "level": "H1", "reason": "Mock valid heading", "bbox": [10, 10, 200, 40] },
      { "text": "Fake Heading", "level": "H2", "reason": "Mock fake heading", "bbox": [10, 60, 200, 30] }
    ]`;
  } else if (backend === "results-file") {
    console.log(`Reading AI results from ${process.env.RESULTS_FILE}`);
    const resultsData = JSON.parse(await fs.readFile(process.env.RESULTS_FILE, "utf8"));
    visualRaw = resultsData.visualRaw || resultsData.legacyRaw;
    codeRaw = resultsData.codeRaw || resultsData.v1Raw;
  } else {
    [visualRaw, codeRaw] = await Promise.all([
      runSkillPrompt(visualPrompt, base64Image),
      runSkillPrompt(codePrompt, base64Image)
    ]);
  }
  const visualRows = parseFirstJsonArray(visualRaw);
  const codeRows = repairCodeRows(parseMarkdownTable(codeRaw), headingCandidates);

  await highlightLegacy(page, visualRows);
  const visualHighlightedImage = `${pageId}_screenshot_only_highlighted.png`;
  await page.screenshot({ path: path.join(RESULTS_DIR, visualHighlightedImage), fullPage: true });

  await page.reload();
  await highlightV1(page, codeRows);
  const codeHighlightedImage = `${pageId}_screenshot_code_highlighted.png`;
  await page.screenshot({ path: path.join(RESULTS_DIR, codeHighlightedImage), fullPage: true });

  await writeReport(path.join(RESULTS_DIR, `${pageId}_comparison_report.md`), pagePath, visualRows, codeRows, visualRaw, codeRaw);
  const result = {
    page_id: pageId,
    page_path: pagePath,
    category: "headings",
    backend,
    model,
    generated_at: new Date().toISOString(),
    original_image: originalImage,
    runs: [
      {
        skill: "heading-screenshot-only",
        label: "Screenshot only",
        findings_count: visualRows.length,
        findings: visualRows.map(normalizeVisualFinding),
        highlighted_image: visualHighlightedImage,
        raw_response: visualRaw,
      },
      {
        skill: "heading-screenshot-code",
        label: "Screenshot + code",
        findings_count: codeRows.length,
        findings: codeRows.map(normalizeV1Finding),
        highlighted_image: codeHighlightedImage,
        raw_response: codeRaw,
      },
    ],
  };
  await writeJsonResult(path.join(RESULTS_DIR, `${pageId}_headings_results.json`), result);
  await browser.close();
  return result;
}

async function main() {
  const backend = resolveBackend();
  if (backend === "cursor-sdk" && !process.env.CURSOR_API_KEY) {
    throw new Error("CURSOR_API_KEY is required when AI_BACKEND=cursor-sdk. Or set AI_BACKEND=walmart-llm, USE_MOCK_AI=true, or RESULTS_FILE.");
  }
  if (backend === "walmart-llm" && !process.env.ELEMENT_API_KEY && !process.env.WALMART_LLM_API_KEY) {
    throw new Error("ELEMENT_API_KEY or WALMART_LLM_API_KEY is required when AI_BACKEND=walmart-llm.");
  }

  const { all, pagePath } = parseArgs();
  const pages = await listPages(all, pagePath);
  const results = [];
  for (const p of pages) results.push(await evaluatePage(p));
  await writeReviewHtml(path.join(RESULTS_DIR, "review.html"), results);
  console.log(`Completed heading skill evaluation for ${pages.length} page(s).`);
  console.log(`Results saved to: ${RESULTS_DIR}`);
  console.log(`Review page: ${path.join(RESULTS_DIR, "review.html")}`);
  
  // Automatically open the review page on macOS.
  exec(`open "${path.join(RESULTS_DIR, "review.html")}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

