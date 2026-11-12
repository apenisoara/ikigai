/**
 * Playwright verification for the interactive SVG Ikigai diagram (#26).
 * Run: node scripts/verify-interactive-diagram.mjs
 * Expects a static server at BASE_URL (default http://127.0.0.1:8765).
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:8765";
const outDir =
  process.env.DIAGRAM_OUT_DIR ||
  path.join(repoRoot, "..", "..", "cursor", "stores", "self", "media", "interactive-diagram");

fs.mkdirSync(outDir, { recursive: true });

const results = [];

function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });

try {
  await page.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".ikigai-diagram-svg", { timeout: 10000 });

  // Dismiss monitoring consent if present so it does not cover the diagram.
  const accept = page.locator("#monitoring-accept");
  if (await accept.isVisible().catch(() => false)) {
    await accept.click();
  }

  const diagram = page.locator(".ikigai-diagram");
  await diagram.waitFor({ state: "visible" });

  const svgCount = await page.locator(".ikigai-diagram-svg").count();
  record("svg present", svgCount === 1, `count=${svgCount}`);

  const circleCount = await page.locator(".diagram-circle").count();
  record("four vector circles", circleCount === 4, `count=${circleCount}`);

  const divCircles = await page.locator(".ikigai-diagram > .circle").count();
  record("no legacy div.circle", divCircles === 0, `count=${divCircles}`);

  const groupRole = await diagram.getAttribute("role");
  record("diagram role=group", groupRole === "group", `role=${groupRole}`);

  const love = page.locator('.diagram-circle[data-circle="love"]');
  const loveTab = await love.getAttribute("tabindex");
  record("love circle focusable", loveTab === "0", `tabindex=${loveTab}`);

  const loveAria = await love.getAttribute("aria-label");
  record("love aria-label set", Boolean(loveAria && loveAria.length > 2), `aria="${loveAria}"`);

  // Idle shimmer: animation name should be applied (unless reduced motion).
  const idleAnim = await love.evaluate((el) => getComputedStyle(el).animationName);
  record(
    "idle shimmer animation",
    idleAnim.includes("diagram-idle-shimmer"),
    `animationName=${idleAnim}`
  );

  await page.screenshot({
    path: path.join(outDir, "diagram_idle.png"),
    fullPage: false,
    clip: await diagram.boundingBox()
  });

  // Hover the exclusive top crescent of "love" (bbox center is under overlaps).
  const loveBox = await love.boundingBox();
  if (!loveBox) throw new Error("love circle has no bounding box");
  await page.mouse.move(
    loveBox.x + loveBox.width * 0.5,
    loveBox.y + loveBox.height * 0.18
  );
  await page.waitForTimeout(280);
  const interacting = await diagram.evaluate((el) => el.classList.contains("is-interacting"));
  const loveActive = await love.evaluate((el) => el.classList.contains("is-active"));
  const loveOpacity = await love.evaluate((el) => getComputedStyle(el).fillOpacity);
  record("hover sets is-interacting", interacting, `is-interacting=${interacting}`);
  record("hover sets is-active on love", loveActive, `is-active=${loveActive}`);
  record(
    "hovered circle fill denser",
    Number(loveOpacity) >= 0.75,
    `fillOpacity=${loveOpacity}`
  );

  const goodOpacity = await page
    .locator('.diagram-circle[data-circle="good"]')
    .evaluate((el) => getComputedStyle(el).fillOpacity);
  record(
    "sibling still visible for labels",
    Number(goodOpacity) >= 0.3 && Number(goodOpacity) < Number(loveOpacity),
    `goodFillOpacity=${goodOpacity}`
  );

  await page.screenshot({
    path: path.join(outDir, "diagram_hover_love.png"),
    fullPage: false,
    clip: await diagram.boundingBox()
  });

  // Keyboard focus
  await page.locator("body").click({ position: { x: 5, y: 5 } });
  await love.focus();
  await page.waitForTimeout(200);
  const focusedActive = await love.evaluate((el) => el.classList.contains("is-active"));
  record("keyboard focus activates circle", focusedActive);

  await page.screenshot({
    path: path.join(outDir, "diagram_focus_love.png"),
    fullPage: false,
    clip: await diagram.boundingBox()
  });

  // prefers-reduced-motion disables idle animation
  const reduced = await browser.newPage({
    viewport: { width: 1100, height: 900 },
    reducedMotion: "reduce"
  });
  await reduced.goto(`${baseUrl}/index.html`, { waitUntil: "domcontentloaded" });
  await reduced.waitForSelector(".ikigai-diagram-svg", { timeout: 10000 });
  const reducedAccept = reduced.locator("#monitoring-accept");
  if (await reducedAccept.isVisible().catch(() => false)) {
    await reducedAccept.click();
  }
  const reducedLove = reduced.locator('.diagram-circle[data-circle="love"]');
  const reducedAnim = await reducedLove.evaluate((el) => getComputedStyle(el).animationName);
  record(
    "reduced-motion disables shimmer",
    reducedAnim === "none",
    `animationName=${reducedAnim}`
  );
  await reduced.close();

  // Labels still visible / readable
  const labelLoveVisible = await page.locator(".label-love").isVisible();
  const centerVisible = await page.locator(".diagram-center").isVisible();
  record("labels remain visible", labelLoveVisible && centerVisible);

  // Parallax: move through the diagram center and expect non-zero offsets.
  const dbox = await diagram.boundingBox();
  await page.mouse.move(dbox.x + dbox.width * 0.5, dbox.y + dbox.height * 0.5, {
    steps: 8
  });
  await page.waitForTimeout(350);
  const parallaxSample = await love.evaluate((el) => ({
    x: getComputedStyle(el).getPropertyValue("--parallax-x").trim(),
    y: getComputedStyle(el).getPropertyValue("--parallax-y").trim(),
    parallaxing: el.closest(".ikigai-diagram")?.classList.contains("is-parallaxing")
  }));
  const parallaxX = Number.parseFloat(parallaxSample.x) || 0;
  const parallaxY = Number.parseFloat(parallaxSample.y) || 0;
  record(
    "parallax offsets while pointer inside",
    parallaxSample.parallaxing && (Math.abs(parallaxX) > 0.5 || Math.abs(parallaxY) > 0.5),
    `x=${parallaxSample.x} y=${parallaxSample.y} parallaxing=${parallaxSample.parallaxing}`
  );

  await page.screenshot({
    path: path.join(outDir, "diagram_parallax_center.png"),
    fullPage: false,
    clip: await diagram.boundingBox()
  });

  // Locale aria updates
  await page.selectOption("#lang-select", "de");
  await page.waitForTimeout(100);
  const deAria = await love.getAttribute("aria-label");
  record(
    "i18n updates circle aria (de)",
    deAria === "Was du liebst",
    `aria="${deAria}"`
  );

  // Explore form still present / untouched surface
  const form = page.locator("#ikigai-form");
  const findBtn = page.locator("#find-button");
  record("explore form intact", (await form.count()) === 1 && (await findBtn.count()) === 1);

  fs.writeFileSync(
    path.join(outDir, "pw_diagram_summary.json"),
    JSON.stringify(results, null, 2)
  );
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
console.log(`Artifacts: ${outDir}`);
