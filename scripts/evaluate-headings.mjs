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
const LEGACY_PROMPT_PATH = path.join(ROOT, "existing-skills", "01-headings.md");
const VISUAL_GAP_PROMPT = `You are an expert accessibility auditor specializing in web heading structure.

Analyze the screenshot and identify visible heading-like text that is MISSING from the DOM heading scan.

Rules:
- The provided DOM heading list is already covered. Do not repeat those headings.
- Only return visual headings that are not represented by h1-h6 or role="heading".
- Include fake headings: styled div/span/card titles that visually organize content but are not semantic headings.
- Exclude buttons, labels, data values, badges, table cell values, chart labels, and decorative text.
- Return only a JSON array. Do not use markdown fences.
- Each finding must include: text, level, reason, issue_type, bbox.
- Use bbox as [x, y, width, height] in screenshot pixel coordinates.
- Return [] if the DOM heading scan already covers the visual heading structure.

Example:
[
  { "text": "Shipping Summary", "level": "H2", "reason": "Styled card title missing from DOM heading scan", "issue_type": "fake_heading", "bbox": [24, 160, 180, 24] }
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

function normalizeDomFinding(row) {
  return {
    source: "dom-heading-scan",
    text: row.heading_text || "",
    level: row.heading_level && row.heading_level !== "null" ? `H${row.heading_level}` : null,
    reason: row.notes || "",
    selector: row.selector_or_location || "",
    status: row.status || "",
    severity: row.severity || "",
    issue_type: row.hierarchy_issue_type || "",
    bbox: Array.isArray(row.bbox) ? row.bbox : null,
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

function candidateToDomRow(candidate, pageId, pagePath) {
  return {
    page_id: pageId,
    page_url_or_fixture: pagePath,
    skill_name: "dom_heading_scan",
    element_type: "heading",
    selector_or_location: candidate.selector,
    wcag_candidate: "1.3.1",
    severity: "info",
    status: "found",
    notes: "Existing semantic DOM heading found by Playwright scan",
    heading_text: candidate.text,
    heading_level: candidate.headingLevel || "",
    is_hierarchy_valid: "needs_review",
    hierarchy_issue_type: "none",
    bbox: candidate.bbox,
  };
}

function levelNumber(row) {
  const value = String(row.heading_level || "").trim();
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : null;
}

function analyzeHeadingHierarchy(rows) {
  const analyzed = rows.map((row) => ({ ...row }));
  const issues = [];
  const h1Rows = analyzed.filter((row) => levelNumber(row) === 1);

  if (h1Rows.length === 0) {
    issues.push({
      type: "missing_h1",
      severity: "high",
      message: "No H1 heading was found in the DOM heading scan.",
    });
  }

  if (h1Rows.length > 1) {
    issues.push({
      type: "multiple_h1",
      severity: "medium",
      message: `${h1Rows.length} H1 headings were found. Confirm this is intentional for the page structure.`,
    });
    h1Rows.slice(1).forEach((row) => {
      row.status = "needs_review";
      row.severity = "medium";
      row.notes = "Additional H1 found. Confirm whether multiple H1 headings are intentional.";
      row.is_hierarchy_valid = "needs_review";
      row.hierarchy_issue_type = "other";
    });
  }

  let previousLevel = null;
  analyzed.forEach((row) => {
    const level = levelNumber(row);
    const text = String(row.heading_text || "").trim();

    if (!text) {
      row.status = "fail";
      row.severity = "high";
      row.notes = "Empty heading found. Headings must contain accessible text.";
      row.is_hierarchy_valid = "false";
      row.hierarchy_issue_type = "empty_heading";
      issues.push({
        type: "empty_heading",
        severity: "high",
        message: `Empty heading found at ${row.selector_or_location}.`,
      });
      return;
    }

    if (!level || level < 1 || level > 6) {
      row.status = "fail";
      row.severity = "high";
      row.notes = "Invalid heading level found. Use h1-h6 or role=heading with aria-level 1-6.";
      row.is_hierarchy_valid = "false";
      row.hierarchy_issue_type = "other";
      issues.push({
        type: "invalid_level",
        severity: "high",
        message: `Invalid heading level for "${text}".`,
      });
      return;
    }

    if (previousLevel !== null && level > previousLevel + 1) {
      row.status = "fail";
      row.severity = "high";
      row.notes = `Skipped heading level: H${previousLevel} is followed by H${level}.`;
      row.is_hierarchy_valid = "false";
      row.hierarchy_issue_type = "skipped_level";
      issues.push({
        type: "skipped_level",
        severity: "high",
        message: `Skipped heading level before "${text}": H${previousLevel} to H${level}.`,
      });
    } else if (row.status === "found") {
      row.status = "pass";
      row.severity = "info";
      row.is_hierarchy_valid = "true";
      row.hierarchy_issue_type = "none";
    }

    previousLevel = level;
  });

  return { rows: analyzed, issues };
}

function normalizeVisualFinding(row) {
  return {
    source: "ai-visual-gaps",
    text: row.text || row.heading_text || "",
    level: row.level || row.level_guess || row.heading_level || null,
    reason: row.reason || row.notes || "",
    status: row.status || "needs_review",
    severity: row.severity || "medium",
    issue_type: row.issue_type || row.hierarchy_issue_type || "fake_heading",
    bbox: Array.isArray(row.bbox) ? row.bbox : null,
  };
}

function v1Color(row) {
  const status = String(row.status || "").toLowerCase();
  const issueType = String(row.hierarchy_issue_type || row.issue_type || "").toLowerCase();
  if (status === "fail" || issueType === "skipped_level" || issueType === "empty_heading") return "#dc2626";
  if (status === "needs_review" || status === "warn") return "#f59e0b";
  return "#16a34a";
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
        target.style.boxShadow = `0 0 0 4px ${payload.shadow}`;
        target.setAttribute("data-heading-skill", payload.label);
        target.setAttribute("title", payload.label);
      },
      {
        selector,
        color,
        shadow: color === "#16a34a" ? "rgba(22, 163, 74, 0.18)" : color === "#f59e0b" ? "rgba(245, 158, 11, 0.18)" : "rgba(220, 38, 38, 0.18)",
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

    const colorFor = (row) => {
      const status = String(row.status || "").toLowerCase();
      const issue = String(row.issue_type || row.hierarchy_issue_type || "").toLowerCase();
      if (status === "pass" || status === "found") return "#16a34a";
      if (status === "warn" || status === "needs_review") return "#f59e0b";
      if (issue === "fake_heading" || issue === "skipped_level" || status === "fail") return "#dc2626";
      return "#dc2626";
    };

    inRows.forEach((row) => {
      if (!Array.isArray(row.bbox) || row.bbox.length !== 4) return;
      const [x, y, w, h] = row.bbox;
      const color = colorFor(row);
      const box = document.createElement("div");
      box.style.position = "absolute";
      box.style.left = `${x}px`;
      box.style.top = `${y}px`;
      box.style.width = `${w}px`;
      box.style.height = `${h}px`;
      box.style.border = `4px solid ${color}`;
      box.style.boxSizing = "border-box";
      box.style.background = color === "#16a34a" ? "rgba(22,163,74,0.12)" : color === "#f59e0b" ? "rgba(245,158,11,0.12)" : "rgba(220,38,38,0.12)";

      const tag = document.createElement("div");
      tag.textContent = `legacy ${row.level}: ${row.text}`;
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

async function writeReport(outPath, pagePath, domRows, gapRows, domRaw, gapRaw, headingIssues = [], gapError = null) {
  const content = [
    "# Heading Skill Comparison Report",
    "",
    `- page: \`${pagePath}\``,
    `- DOM heading count: ${domRows.length}`,
    `- AI visual gap count: ${gapRows.length}`,
    `- heading hierarchy issue count: ${headingIssues.length}`,
    gapError ? `- AI visual gap error: ${gapError}` : "- AI visual gap error: none",
    "",
    "## Heading hierarchy issues",
    "```json",
    JSON.stringify(headingIssues, null, 2),
    "```",
    "",
    "## DOM headings found",
    "```json",
    JSON.stringify(domRows, null, 2),
    "```",
    "",
    "## AI visual gaps / fake headings",
    "```json",
    JSON.stringify(gapRows, null, 2),
    "```",
    "",
    "## DOM scan raw output",
    "```text",
    domRaw,
    "```",
    "",
    "## AI visual gap raw model output",
    "```text",
    gapRaw,
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
    .map((finding, findingIndex) => {
      const status = String(finding.status || finding.severity || finding.issue_type || "found").toLowerCase();
      const rowClass = status === "pass" || status === "found" || status === "info"
        ? "row-pass"
        : status === "fail" || status === "high" || status === "skipped_level" || status === "empty_heading"
          ? "row-fail"
          : "row-review";
      return `<tr class="${rowClass}">
        <td>${htmlEscape(finding.text)}</td>
        <td>${htmlEscape(finding.level || "n/a")}</td>
        <td><span class="status-chip ${rowClass}">${htmlEscape(finding.status || finding.severity || finding.issue_type || "found")}</span></td>
        <td>${htmlEscape(finding.reason)}</td>
        <td><button class="link-btn" type="button" onclick="openFindingDialog(${pageIndex}, ${runIndex}, ${findingIndex})">Review</button></td>
      </tr>`;
    })
    .join("\n");
}

function renderIssueSummary(issues) {
  if (!issues?.length) {
    return '<div class="issue-summary ok"><strong>No heading hierarchy issues detected.</strong></div>';
  }

  return `<div class="issue-summary alert">
    <strong>${issues.length} heading issue${issues.length === 1 ? "" : "s"} detected</strong>
    <ul>
      ${issues.map((issue) => `<li><span class="severity">${htmlEscape(issue.severity)}</span> ${htmlEscape(issue.message)}</li>`).join("")}
    </ul>
  </div>`;
}

function renderAiError(error) {
  if (!error) return "";
  return `<div class="issue-summary alert">
    <strong>AI visual gap pass did not complete</strong>
    <p>${htmlEscape(error)}</p>
  </div>`;
}

async function writeReviewHtml(outPath, results) {
  const cards = results
    .map((result, pageIndex) => {
      const dom = result.runs.find((run) => run.skill === "dom-heading-scan");
      const gaps = result.runs.find((run) => run.skill === "ai-visual-gaps");
      const domIndex = result.runs.indexOf(dom);
      const gapsIndex = result.runs.indexOf(gaps);
      return `<section class="card">
        <div class="card-header">
          <div>
            <h2>${htmlEscape(result.page_id)}</h2>
            <p>${htmlEscape(result.page_path)}</p>
          </div>
          <div class="header-pills">
            <div class="pill">${htmlEscape(result.backend)} · ${htmlEscape(result.model)}</div>
            <div class="pill ${result.heading_issues?.length ? "danger" : "success"}">${result.heading_issues?.length || 0} hierarchy issues</div>
          </div>
        </div>
        ${renderIssueSummary(result.heading_issues || [])}
        ${renderAiError(result.ai_visual_gap_error)}
        <div class="images">
          <figure><div class="image-scroll"><img src="${htmlEscape(result.original_image)}" alt="Original page screenshot"></div><figcaption>Original</figcaption></figure>
          <figure><button class="image-open" type="button" onclick="openRunDialog(${pageIndex}, ${domIndex})"><div class="image-scroll"><img src="${htmlEscape(dom.highlighted_image)}" alt="DOM heading scan highlighted headings"></div></button><figcaption>DOM headings found · ${dom.findings_count} findings</figcaption></figure>
          <figure><button class="image-open" type="button" onclick="openRunDialog(${pageIndex}, ${gapsIndex})"><div class="image-scroll"><img src="${htmlEscape(gaps.highlighted_image)}" alt="AI visual gaps highlighted headings"></div></button><figcaption>AI visual gaps / fake headings · ${gaps.findings_count} findings</figcaption></figure>
        </div>
        <div class="tables">
          <div>
            <h3>DOM Headings Found</h3>
            <div class="table-scroll"><table><thead><tr><th>Text</th><th>Level</th><th>Status</th><th>Reason</th><th>Dialog</th></tr></thead><tbody>${renderFindingRows(pageIndex, domIndex, dom.findings)}</tbody></table></div>
          </div>
          <div>
            <h3>AI Visual Gaps / Fake Headings</h3>
            <div class="table-scroll"><table><thead><tr><th>Text</th><th>Level</th><th>Status</th><th>Reason</th><th>Dialog</th></tr></thead><tbody>${renderFindingRows(pageIndex, gapsIndex, gaps.findings)}</tbody></table></div>
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
    .header-pills { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
    .pill { background: #dbeafe; color: #1d4ed8; border-radius: 999px; padding: 4px 10px; font-size: 12px; font-weight: 700; white-space: nowrap; }
    .pill.danger { background: #fee2e2; color: #991b1b; }
    .pill.success { background: #dcfce7; color: #166534; }
    .issue-summary { margin: 14px 18px 0; border-radius: 8px; padding: 12px 14px; font-size: 13px; }
    .issue-summary.ok { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
    .issue-summary.alert { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
    .issue-summary ul { margin: 8px 0 0; padding-left: 18px; }
    .severity { text-transform: uppercase; font-size: 11px; font-weight: 800; margin-right: 4px; }
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
    <p>Scan real DOM headings first, then use AI to find visual headings the DOM scan missed.</p>
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
            (finding.issue_type ? '<p><strong>Issue:</strong> ' + escapeHtml(finding.issue_type) + '</p>' : '') +
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

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(pageUri);

  // Capture screenshot for AI vision context
  await fs.mkdir(RESULTS_DIR, { recursive: true });
  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const base64Image = screenshotBuffer.toString("base64");
  const originalImage = `${pageId}_original.png`;
  await fs.writeFile(path.join(RESULTS_DIR, originalImage), screenshotBuffer);

  const headingCandidates = await extractHeadingCandidates(page);
  const domAnalysis = analyzeHeadingHierarchy(
    headingCandidates.map((candidate) => candidateToDomRow(candidate, pageId, pagePath)),
  );
  const domRows = domAnalysis.rows;
  const headingIssues = domAnalysis.issues;
  const domRaw = JSON.stringify(headingCandidates, null, 2);

  const gapPrompt = [
    VISUAL_GAP_PROMPT,
    "",
    `Page: ${pagePath}`,
    "DOM headings already found JSON:",
    JSON.stringify(
      headingCandidates.map((candidate) => ({
        text: candidate.text,
        level: candidate.headingLevel,
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
    gapRaw = `[
      { "text": "Fake Heading", "level": "H2", "reason": "Mock styled heading missing from DOM scan", "issue_type": "fake_heading", "bbox": [10, 60, 200, 30] }
    ]`;
  } else if (backend === "results-file") {
    console.log(`Reading AI results from ${process.env.RESULTS_FILE}`);
    const resultsData = JSON.parse(await fs.readFile(process.env.RESULTS_FILE, "utf8"));
    gapRaw = resultsData.gapRaw || resultsData.visualRaw || resultsData.legacyRaw || "[]";
  } else {
    try {
      gapRaw = await runSkillPrompt(gapPrompt, base64Image);
    } catch (error) {
      gapError = error.message;
      gapRaw = "[]";
      console.warn(`AI visual gap pass failed; continuing with DOM heading report. ${error.message}`);
    }
  }
  const gapRows = parseFirstJsonArray(gapRaw);

  await highlightV1(page, domRows);
  const domHighlightedImage = `${pageId}_dom_headings_highlighted.png`;
  await page.screenshot({ path: path.join(RESULTS_DIR, domHighlightedImage), fullPage: true });

  await page.reload();
  await highlightLegacy(page, gapRows);
  const gapHighlightedImage = `${pageId}_ai_visual_gaps_highlighted.png`;
  await page.screenshot({ path: path.join(RESULTS_DIR, gapHighlightedImage), fullPage: true });

  await writeReport(path.join(RESULTS_DIR, `${pageId}_comparison_report.md`), pagePath, domRows, gapRows, domRaw, gapRaw, headingIssues, gapError);
  const result = {
    page_id: pageId,
    page_path: pagePath,
    category: "headings",
    backend,
    model,
    generated_at: new Date().toISOString(),
    original_image: originalImage,
    heading_issues: headingIssues,
    ai_visual_gap_error: gapError,
    runs: [
      {
        skill: "dom-heading-scan",
        label: "DOM headings found",
        findings_count: domRows.length,
        findings: domRows.map(normalizeDomFinding),
        highlighted_image: domHighlightedImage,
        raw_response: domRaw,
      },
      {
        skill: "ai-visual-gaps",
        label: "AI visual gaps / fake headings",
        findings_count: gapRows.length,
        findings: gapRows.map(normalizeVisualFinding),
        highlighted_image: gapHighlightedImage,
        raw_response: gapRaw,
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

