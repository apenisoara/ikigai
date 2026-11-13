/**
 * Keep the Content-Security-Policy meta tag in sync across root HTML pages.
 *
 * Source of truth: csp-policy.txt (repo root)
 *
 * Usage:
 *   node scripts/apply-csp.mjs           # write CSP block into every root *.html
 *   node scripts/apply-csp.mjs --check   # exit 1 if any page drifts (lint)
 *
 * New pages: add either a full <!-- csp-meta:begin -->…<!-- csp-meta:end -->
 * block, a lone <!-- csp-meta --> marker after viewport, or nothing — the
 * script will insert the block after the viewport meta (or after <head>).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const policyPath = path.join(repoRoot, "csp-policy.txt");

const BEGIN = "<!-- csp-meta:begin -->";
const END = "<!-- csp-meta:end -->";
const PLACEHOLDER = "<!-- csp-meta -->";

const checkOnly = process.argv.includes("--check");

function readPolicyContent() {
  const raw = fs.readFileSync(policyPath, "utf8");
  const lines = raw.split(/\r?\n/);
  const notes = [];
  const directives = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) {
      const note = trimmed.replace(/^#\s?/, "").trim();
      // Keep explanatory notes; drop usage instructions.
      if (
        note &&
        !/^Edit this file/i.test(note) &&
        !/^Lint drift/i.test(note) &&
        !/^First-party Content-Security-Policy for GitHub Pages/i.test(note)
      ) {
        notes.push(note);
      }
      continue;
    }
    directives.push(trimmed.replace(/;$/, ""));
  }

  if (!directives.length) {
    throw new Error(`${path.relative(repoRoot, policyPath)} has no CSP directives`);
  }

  // Trailing semicolon keeps the serialized policy stable for diffs.
  return { content: `${directives.join("; ")};`, notes };
}

function buildBlock(policyContent, notes) {
  const commentLines = [
    "First-party CSP for GitHub Pages (no custom response headers).",
    "Generated from csp-policy.txt — edit that file, then: node scripts/apply-csp.mjs",
    ...notes,
  ];

  return [
    `  ${BEGIN}`,
    "  <!--",
    ...commentLines.map((line) => `    ${line}`),
    "  -->",
    `  <meta http-equiv="Content-Security-Policy" content="${policyContent}">`,
    `  ${END}`,
  ].join("\n");
}

function listRootHtmlFiles() {
  return fs
    .readdirSync(repoRoot)
    .filter((name) => name.endsWith(".html"))
    .sort()
    .map((name) => path.join(repoRoot, name));
}

/** Remove prior generated/legacy CSP metas (and a CSP-ish HTML comment above them). */
function stripLegacyCsp(html) {
  let out = html;

  // Marked blocks first.
  out = out.replace(
    new RegExp(
      `\\s*${escapeRegExp(BEGIN)}[\\s\\S]*?${escapeRegExp(END)}\\s*`,
      "g"
    ),
    "\n"
  );

  // Standalone placeholder.
  out = out.replace(new RegExp(`\\s*${escapeRegExp(PLACEHOLDER)}\\s*`, "g"), "\n");

  // Legacy: optional HTML comment mentioning CSP/Content-Security, then the meta.
  // Only swallow spaces/tabs after the meta so the next tag keeps its indent.
  out = out.replace(
    /[ \t]*\n?[ \t]*(?:<!--[\s\S]*?(?:Content-Security-Policy|First-party CSP|csp-policy)[\s\S]*?-->[ \t]*\n?[ \t]*)?<meta\s+http-equiv=["']Content-Security-Policy["'][^>]*>[ \t]*\n?/gi,
    "\n"
  );

  return out;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function insertBlock(html, block) {
  const viewportMatch = html.match(
    /(<meta\s+name=["']viewport["'][^>]*>)(\s*)/i
  );
  if (viewportMatch) {
    const at = viewportMatch.index + viewportMatch[1].length;
    return `${html.slice(0, at)}\n${block}\n${html.slice(at).replace(/^\s*\n/, "\n")}`;
  }

  const headMatch = html.match(/(<head[^>]*>)(\s*)/i);
  if (headMatch) {
    const at = headMatch.index + headMatch[1].length;
    return `${html.slice(0, at)}\n${block}\n${html.slice(at).replace(/^\s*\n/, "\n")}`;
  }

  throw new Error("no <head> or viewport meta found to anchor CSP block");
}

function applyToHtml(html, block) {
  const beginIdx = html.indexOf(BEGIN);
  const endIdx = html.indexOf(END);

  if (beginIdx !== -1 && endIdx !== -1 && endIdx > beginIdx) {
    // Replace only the marked region; keep surrounding markup intact.
    const before = html.slice(0, beginIdx).replace(/[ \t]*$/, "");
    const after = html.slice(endIdx + END.length).replace(/^[ \t]*\n?/, "\n");
    const prefix = before.endsWith("\n") ? before : `${before}\n`;
    return `${prefix}${block}${after}`;
  }

  if (html.includes(PLACEHOLDER)) {
    return html.replace(PLACEHOLDER, block.trim());
  }

  const stripped = stripLegacyCsp(html);
  return insertBlock(stripped, block);
}

const { content: policyContent, notes } = readPolicyContent();
const block = buildBlock(policyContent, notes);
const files = listRootHtmlFiles();

if (!files.length) {
  console.error("No root *.html files found");
  process.exit(1);
}

let drift = 0;
let written = 0;

for (const file of files) {
  const rel = path.relative(repoRoot, file);
  const original = fs.readFileSync(file, "utf8");
  let next;
  try {
    next = applyToHtml(original, block);
  } catch (error) {
    console.error(`FAIL  ${rel} — ${error.message}`);
    drift += 1;
    continue;
  }

  if (next === original) {
    console.log(`OK    ${rel}`);
    continue;
  }

  if (checkOnly) {
    console.log(`DRIFT ${rel}`);
    drift += 1;
    continue;
  }

  fs.writeFileSync(file, next);
  console.log(`WRITE ${rel}`);
  written += 1;
}

if (checkOnly) {
  if (drift) {
    console.error(
      `\n${drift} page(s) out of sync with csp-policy.txt. Run: node scripts/apply-csp.mjs`
    );
    process.exit(1);
  }
  console.log(`\nAll ${files.length} root HTML page(s) match csp-policy.txt`);
  process.exit(0);
}

console.log(
  `\nDone. Updated ${written} file(s); ${files.length - written} already current.`
);
