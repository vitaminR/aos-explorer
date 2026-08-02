// Section 508 / WCAG 2.1 AA gate for the aOS Explorer (task-0305).
//
// RUN:
//   cd 7.aOS-Explorer
//   node tools/a11y/axe-508-check.mjs                 # defaults to explorer.html
//   node tools/a11y/axe-508-check.mjs index.html      # any local page
//
// EXIT CODE: 1 if any CRITICAL violation is found, else 0. Critical is the gate;
// serious/moderate/minor are reported in full but do not fail the build, so the
// gate can be adopted immediately without blocking every commit on pre-existing
// debt. Raise the bar by changing FAIL_ON below once the critical count is 0.
//
// WHY axe AND NOT A HAND CHECK: Revised Section 508 incorporates WCAG 2.0 AA by
// reference, and this repo's own quality rule is that we judge the rendered
// artifact BY THE NUMBERS, never the source by eye. axe measures the painted
// accessibility tree in a real browser, which is the only thing a screen reader
// user actually meets.
//
// HONESTY NOTE: axe is a floor, not a ceiling. It automatically detects roughly
// a third of WCAG issues - keyboard traps, focus order, meaningful alt text and
// reading order still need a human pass. A clean axe run is NOT a conformance
// claim, and the VPAT this feeds must say so.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const TARGET = process.argv[2] || "explorer.html";
const FAIL_ON = ["critical"];
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "section508"];
const OUT = "tools/a11y/axe-report.json";

const file = resolve(TARGET);
const url = pathToFileURL(file).href;
const axeSource = readFileSync(resolve("node_modules/axe-core/axe.min.js"), "utf8");

// Use the installed Chrome channel rather than Playwright's bundled build. The
// bundled revision pinned by this Playwright version is not on this machine, and
// the house Argus runner already drives Chrome the same way - so this matches the
// existing measurement path instead of pulling a second ~150MB browser.
// Override with AXE_CHANNEL= to use a downloaded Playwright chromium instead.
const channel = process.env.AXE_CHANNEL ?? "chrome";
const browser = await chromium.launch(channel ? { channel } : {});
const page = await browser.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e).slice(0, 200)));

await page.goto(url, { waitUntil: "load" });
// The Explorer builds its cards client-side; give the DOM a beat to settle so we
// audit what a user actually sees rather than an empty shell.
await page.waitForTimeout(2500);

await page.addScriptTag({ content: axeSource });
const results = await page.evaluate(async (tags) => {
  // eslint-disable-next-line no-undef
  return await axe.run(document, { runOnly: { type: "tag", values: tags } });
}, TAGS);

await browser.close();

const byImpact = { critical: [], serious: [], moderate: [], minor: [], null: [] };
for (const v of results.violations) (byImpact[v.impact ?? "null"] ??= []).push(v);
const count = (k) => (byImpact[k] || []).length;
const nodes = (k) => (byImpact[k] || []).reduce((n, v) => n + v.nodes.length, 0);

console.log(`Section 508 / WCAG 2.1 AA gate - ${TARGET}`);
console.log(`axe-core ${results.testEngine.version} | tags: ${TAGS.join(", ")}`);
console.log("");
console.log(`  CRITICAL  ${count("critical")} rule(s), ${nodes("critical")} element(s)`);
console.log(`  serious   ${count("serious")} rule(s), ${nodes("serious")} element(s)`);
console.log(`  moderate  ${count("moderate")} rule(s), ${nodes("moderate")} element(s)`);
console.log(`  minor     ${count("minor")} rule(s), ${nodes("minor")} element(s)`);
console.log(`  passes    ${results.passes.length} rule(s)`);
console.log(`  incomplete ${results.incomplete.length} rule(s) - NEED A HUMAN, axe could not decide`);
console.log("");

for (const impact of ["critical", "serious", "moderate", "minor"]) {
  for (const v of byImpact[impact] || []) {
    console.log(`  [${impact.toUpperCase()}] ${v.id} - ${v.help}`);
    console.log(`      ${v.nodes.length} element(s); first: ${String(v.nodes[0]?.target?.[0] ?? "").slice(0, 90)}`);
    console.log(`      ${v.helpUrl}`);
  }
}
if (results.incomplete.length) {
  console.log("\n  INCOMPLETE (axe could not decide - a human must check these):");
  for (const v of results.incomplete) console.log(`      ${v.id} - ${v.help} (${v.nodes.length} node(s))`);
}
if (consoleErrors.length) {
  console.log(`\n  page errors during audit: ${consoleErrors.length}`);
  for (const e of consoleErrors.slice(0, 3)) console.log(`      ${e}`);
}

writeFileSync(OUT, JSON.stringify({
  target: TARGET,
  axe: results.testEngine.version,
  tags: TAGS,
  timestamp_note: "stamped by the caller; this file records COUNTS, not a conformance claim",
  summary: {
    critical: count("critical"), serious: count("serious"),
    moderate: count("moderate"), minor: count("minor"),
    passes: results.passes.length, incomplete: results.incomplete.length,
  },
  violations: results.violations.map((v) => ({
    id: v.id, impact: v.impact, help: v.help, helpUrl: v.helpUrl,
    nodes: v.nodes.map((n) => ({ target: n.target, failureSummary: n.failureSummary })),
  })),
  incomplete: results.incomplete.map((v) => ({ id: v.id, help: v.help, nodes: v.nodes.length })),
}, null, 2) + "\n");
console.log(`\n  full report written to ${OUT}`);

const failing = FAIL_ON.reduce((n, k) => n + count(k), 0);
if (failing) {
  console.log(`\nRESULT: FAIL - ${failing} ${FAIL_ON.join("/")} violation rule(s). Section 508 gate blocks.`);
  process.exit(1);
}
console.log("\nRESULT: PASS on the critical gate. NOT a conformance claim - axe covers roughly a third of WCAG; keyboard, focus order and meaningful alt text still need a human pass.");
process.exit(0);
