/**
 * Playwright check: favicon <link> tags on HTML entry points.
 * Run: node scripts/verify-favicon.mjs
 * Expects a static server at BASE_URL (default http://127.0.0.1:8000).
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8000";
const outDir =
  process.env.FAVICON_OUT_DIR ||
  "/cursor/stores/self/media/favicon";

fs.mkdirSync(outDir, { recursive: true });

const pages = ["index.html", "about.html", "privacy.html"];
const required = [
  { rel: "icon", type: "image/svg+xml", hrefEnds: "assets/favicon.svg" },
  { rel: "icon", type: "image/png", sizes: "32x32", hrefEnds: "assets/favicon-32.png" },
  { rel: "icon", type: "image/png", sizes: "16x16", hrefEnds: "assets/favicon-16.png" },
  { rel: "shortcut icon", hrefEnds: "assets/favicon.ico" },
  { rel: "apple-touch-icon", sizes: "180x180", hrefEnds: "assets/apple-touch-icon.png" },
];

const results = [];
function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } });

try {
  for (const html of pages) {
    await page.goto(`${baseUrl}/${html}`, { waitUntil: "domcontentloaded" });

    const links = await page.$$eval('link[rel*="icon"], link[rel="apple-touch-icon"]', (els) =>
      els.map((el) => ({
        rel: el.getAttribute("rel") || "",
        type: el.getAttribute("type") || "",
        sizes: el.getAttribute("sizes") || "",
        href: el.getAttribute("href") || "",
      }))
    );

    for (const req of required) {
      const hit = links.find((l) => {
        const rel = l.rel.trim().toLowerCase();
        if (req.rel === "icon") {
          if (rel !== "icon") return false;
        } else if (rel !== req.rel.toLowerCase()) {
          return false;
        }
        if (req.type && l.type !== req.type) return false;
        if (req.sizes && l.sizes !== req.sizes) return false;
        return l.href.endsWith(req.hrefEnds) || l.href.includes(req.hrefEnds);
      });
      record(`${html} → ${req.hrefEnds}`, Boolean(hit), hit ? hit.href : "missing");
    }

    // Confirm SVG asset loads
    const svgOk = await page.evaluate(async () => {
      const link = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
      if (!link) return false;
      const res = await fetch(link.href);
      return res.ok && (await res.text()).includes("<svg");
    });
    record(`${html} favicon.svg fetchable`, svgOk);

    if (html === "index.html") {
      await page.screenshot({
        path: path.join(outDir, "browser-tab-index.png"),
        fullPage: false,
      });
      record("screenshot browser-tab-index.png", true, outDir);
    }
  }

  // Copy asset previews into media store
  for (const file of [
    "favicon.svg",
    "favicon-16.png",
    "favicon-32.png",
    "apple-touch-icon.png",
  ]) {
    const src = path.join(repoRoot, "assets", file);
    const dest = path.join(outDir, file);
    fs.copyFileSync(src, dest);
  }
  record("copied asset previews to media/favicon", true, outDir);
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed`);
