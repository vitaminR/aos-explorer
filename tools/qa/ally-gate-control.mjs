// MUST-DENY / MUST-ALLOW suite for the Ally-Only origin gate.
//
// This extracts isAllyOrigin FROM THE REPO AT RUN TIME rather than importing a
// frozen snapshot. A snapshot would keep passing after the real gate changed —
// the control would be testing code that no longer ships, which is the exact
// failure this harness exists to catch. Pass a ref as argv[2] (default: HEAD).
//
//   node tools/qa/ally-gate-control.mjs            # HEAD
//   node tools/qa/ally-gate-control.mjs 3cec81a    # a specific tip
//   node tools/qa/ally-gate-control.mjs --worktree # the working copy on disk

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SRC = 'js/firebase-community.js';
const ref = process.argv[2] || 'HEAD';

let source, provenance;
if (ref === '--worktree') {
  source = readFileSync(SRC, 'utf8');
  provenance = 'working copy on disk (UNCOMMITTED — not what ships)';
} else {
  source = execFileSync('git', ['show', `${ref}:${SRC}`], { encoding: 'utf8', maxBuffer: 32e6 });
  const sha = execFileSync('git', ['rev-parse', '--short', ref], { encoding: 'utf8' }).trim();
  provenance = `${SRC} @ ${sha}`;
}

// Extract the allowlist Set and the gate function by structure, not line number.
const lines = source.split('\n');
const setStart = lines.findIndex(l => /^const ALLY_ORIGIN_CODES/.test(l));
const fnStart = lines.findIndex(l => /^function isAllyOrigin\b/.test(l));
if (setStart === -1 || fnStart === -1) {
  console.error(`EXTRACTION FAILED in ${provenance}.`);
  console.error('Expected a top-level `const ALLY_ORIGIN_CODES` and `function isAllyOrigin`.');
  console.error('The gate was renamed or restructured. FIX THIS CONTROL rather than trusting it —');
  console.error('a suite that cannot find the code under test must never report a pass.');
  process.exit(2);
}
const setEnd = lines.findIndex((l, i) => i >= setStart && /^\]\);/.test(l));
const fnEnd = lines.findIndex((l, i) => i > fnStart && /^\}/.test(l));
if (setEnd === -1 || fnEnd === -1) { console.error('EXTRACTION FAILED: unterminated block.'); process.exit(2); }

const mod = [
  lines.slice(setStart, setEnd + 1).join('\n'),
  lines.slice(fnStart, fnEnd + 1).join('\n'),
  'export { isAllyOrigin, ALLY_ORIGIN_CODES };',
].join('\n\n');
const dir = mkdtempSync(join(tmpdir(), 'allygate-'));
const file = join(dir, 'gate.mjs');
writeFileSync(file, mod);
const { isAllyOrigin, ALLY_ORIGIN_CODES } = await import('file://' + file);

// Sanity: an allowlist that admits nothing would score a perfect MUST-DENY.
if (!(ALLY_ORIGIN_CODES instanceof Set) || ALLY_ORIGIN_CODES.size < 20) {
  console.error(`SUSPECT ALLOWLIST: size ${ALLY_ORIGIN_CODES?.size}. Refusing to report a pass.`);
  process.exit(2);
}

const MUST_DENY = [
  'China', 'CN', 'PRC', 'P.R.C.', 'Russia', 'RU', 'Russian Federation',
  'Iran', 'IR', 'Iranian', 'Iran, Islamic Republic of',
  'North Korea', 'KP', 'DPRK', 'Korea, Democratic Peoples Republic of',
  '', '  ', null, undefined, 42, {}, 'X', 'A'.repeat(200),
];
const MUST_ALLOW = [
  'United States', 'US', 'U.S.', 'united states', 'Germany', 'Japan', 'Taiwan',
  'Israel', 'Canada', 'Australia', 'United-Kingdom', 'new_zealand', '  France  ',
];

const call = v => { try { return isAllyOrigin(v); } catch (e) { return 'THREW: ' + e.message; } };
const leaks = MUST_DENY.filter(v => call(v) === true).map(v => JSON.stringify(v));
const blocked = MUST_ALLOW.filter(v => call(v) !== true).map(v => `${JSON.stringify(v)} -> ${call(v)}`);

console.log(`ALLY-ORIGIN GATE — ${provenance}`);
console.log(`  allowlist entries : ${ALLY_ORIGIN_CODES.size}`);
console.log(`  MUST-DENY leaked  : ${leaks.length}/${MUST_DENY.length}${leaks.length ? '  ' + leaks.join(', ') : ''}`);
console.log(`  MUST-ALLOW blocked: ${blocked.length}/${MUST_ALLOW.length}`);
for (const b of blocked) console.log(`     ${b}`);
console.log(`  RESULT: ${leaks.length === 0 && blocked.length === 0 ? 'PASS' : leaks.length ? 'FAIL (denied origin admitted)' : 'REVIEW (ally wrongly refused)'}`);

// A leak is a security failure and must break the build. A false positive is a
// usability defect and must not — it fails closed.
process.exit(leaks.length ? 1 : 0);
