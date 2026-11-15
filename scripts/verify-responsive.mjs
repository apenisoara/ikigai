/**
 * Playwright verification for responsive resize overhaul (#39).
 * Run: BASE_URL=http://127.0.0.1:8765 node scripts/verify-responsive.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8765";
const outDir =
  process.env.RESPONSIVE_OUT_DIR ||
  "/cursor/stores/self/media/issue-39";

fs.mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: "phone-se", width: 375, height: 667, expectCols: 1, minLabelPx: 11.5 },
  { name: "phone-wide", width: 390, height: 844, expectCols: 1, minLabelPx: 11.5 },
  { name: "tablet-portrait", width: 768, height: 1024, expectCols: 2, minLabelPx: 12 },
  { name: "tablet-landscape", width: 1024, height: 768, expectCols: 2, minLabelPx: 12 },
  { name: "desktop", width: 1280, height: 900, expectCols: 2, minLabelPx: 12 },
];

const results = [];

function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

function parsePx(value) {
  return Number.parseFloat(String(value).replace("px", "")) || 0;
}

const browser = await chromium.launch({ headless: true });

try {
  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".ikigai-diagram", { timeout: 10000 });

    const accept = page.locator("#monitoring-accept");
    if (await accept.isVisible().catch(() => false)) {
      await accept.click();
      await page.locator("#monitoring-consent").waitFor({ state: "hidden", timeout: 5000 }).catch(() => {});
    }

    const metrics = await page.evaluate(() => {
      const overflowX =
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      const labelFont = getComputedStyle(document.querySelector(".diagram-label")).fontSize;
      const centerFont = getComputedStyle(document.querySelector(".diagram-center")).fontSize;
      const h1Font = getComputedStyle(document.querySelector("h1")).fontSize;
      const textareaFont = getComputedStyle(document.querySelector("textarea")).fontSize;
      const gridCols = getComputedStyle(document.querySelector(".question-grid"))
        .gridTemplateColumns.split(" ")
        .filter(Boolean).length;
      const headerH = Math.round(
        document.querySelector(".site-header").getBoundingClientRect().height
      );
      const note = document.querySelector(".header-note:not(a)");
      const noteVisible = note
        ? getComputedStyle(note).display !== "none" && note.getBoundingClientRect().height > 0
        : false;
      const wordmark = document.querySelector(".wordmark").getBoundingClientRect();
      const tools = document.querySelector(".header-tools").getBoundingClientRect();
      return {
        overflowX,
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        labelFont,
        centerFont,
        h1Font,
        textareaFont,
        gridCols,
        headerH,
        noteVisible,
        headerSameRow: Math.abs(wordmark.top - tools.top) < 12,
      };
    });

    const labelPx = parsePx(metrics.labelFont);
    const textareaPx = parsePx(metrics.textareaFont);
    const prefix = vp.name;

    record(`${prefix}: no horizontal overflow`, !metrics.overflowX, `scroll=${metrics.scrollW}`);
    record(
      `${prefix}: question columns`,
      metrics.gridCols === vp.expectCols,
      `cols=${metrics.gridCols}`
    );
    record(
      `${prefix}: diagram labels readable`,
      labelPx >= vp.minLabelPx,
      `fontSize=${metrics.labelFont}`
    );
    record(
      `${prefix}: header compact`,
      metrics.headerH <= (vp.width <= 480 ? 72 : 120),
      `headerH=${metrics.headerH}`
    );

    if (vp.width <= 480) {
      record(`${prefix}: tagline hidden`, !metrics.noteVisible, `noteVisible=${metrics.noteVisible}`);
      record(
        `${prefix}: textarea ≥16px (no iOS zoom)`,
        textareaPx >= 16,
        `fontSize=${metrics.textareaFont}`
      );
      record(
        `${prefix}: wordmark + tools same row`,
        metrics.headerSameRow,
        `sameRow=${metrics.headerSameRow}`
      );
    }

    await page.screenshot({
      path: path.join(outDir, `${prefix}-index.png`),
      fullPage: true,
    });
    await page.locator(".ikigai-diagram").screenshot({
      path: path.join(outDir, `${prefix}-diagram.png`),
    });

    await page.goto(`${baseUrl}/about.html`, { waitUntil: "domcontentloaded" });
    if (await accept.isVisible().catch(() => false)) {
      await accept.click();
    }
    const aboutOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    record(`${prefix}: about no overflow`, !aboutOverflow);
    await page.screenshot({
      path: path.join(outDir, `${prefix}-about.png`),
      fullPage: true,
    });

    await page.close();
  }
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
const summary = {
  passed: results.filter((r) => r.ok).length,
  failed: failed.length,
  results,
};
fs.writeFileSync(path.join(outDir, "pw_responsive_summary.json"), JSON.stringify(summary, null, 2));
console.log(`\nSummary: ${summary.passed} passed, ${summary.failed} failed`);
console.log(`Artifacts: ${outDir}`);
if (failed.length) process.exit(1);
