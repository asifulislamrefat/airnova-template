#!/usr/bin/env node
// Compare two Lighthouse report directories and print a per-URL delta for
// accessibility / performance / SEO / best-practices, plus which audits
// flipped pass→fail or fail→pass.
//
// Usage:
//   node scripts/lh-diff.mjs <beforeDir> <afterDir> [--form-factor mobile|desktop|all]
//
// Expects files named "<slug>.<form-factor>.json" in each dir (the layout
// scripts/lighthouse-check.mjs already writes).

import { readdirSync, readFileSync } from "node:fs";
import { resolve, basename } from "node:path";

const [beforeDir, afterDir, ...rest] = process.argv.slice(2);
if (!beforeDir || !afterDir) {
  console.error("usage: node scripts/lh-diff.mjs <beforeDir> <afterDir> [--form-factor mobile|desktop|all]");
  process.exit(2);
}
const ffArg = (() => {
  const i = rest.indexOf("--form-factor");
  return i >= 0 ? rest[i + 1] : "all";
})();

const CATS = ["accessibility", "performance", "seo", "best-practices"];

function loadDir(dir) {
  const out = new Map(); // key = "<slug>.<form-factor>" → { scores, failing:Set }
  for (const f of readdirSync(resolve(dir))) {
    if (!f.endsWith(".json")) continue;
    const key = basename(f, ".json"); // e.g. "my-post.mobile"
    if (ffArg !== "all" && !key.endsWith(`.${ffArg}`)) continue;
    const lhr = JSON.parse(readFileSync(resolve(dir, f), "utf8"));
    const scores = Object.fromEntries(CATS.map((c) => [c, lhr.categories?.[c]?.score ?? null]));
    const failing = new Set(
      Object.entries(lhr.audits ?? {})
        .filter(([, a]) => a.score !== null && a.score < 1)
        .map(([id]) => id),
    );
    out.set(key, { scores, failing });
  }
  return out;
}

const before = loadDir(beforeDir);
const after = loadDir(afterDir);
const keys = [...new Set([...before.keys(), ...after.keys()])].sort();

const fmt = (n) => (n == null ? "  - " : n.toFixed(2));
const delta = (b, a) => {
  if (b == null || a == null) return "    ";
  const d = a - b;
  const sign = d > 0 ? "+" : d < 0 ? "-" : " ";
  return `${sign}${Math.abs(d).toFixed(2)}`;
};

let regressions = 0;
for (const key of keys) {
  const b = before.get(key);
  const a = after.get(key);
  console.log(`\n=== ${key} ===`);
  if (!b) { console.log("  (no before run — skipping diff)"); continue; }
  if (!a) { console.log("  (no after run — skipping diff)"); continue; }

  console.log("  category         before  after   Δ");
  for (const c of CATS) {
    const d = (a.scores[c] ?? 0) - (b.scores[c] ?? 0);
    if (d < -0.005) regressions++;
    console.log(`  ${c.padEnd(15)} ${fmt(b.scores[c])}    ${fmt(a.scores[c])}    ${delta(b.scores[c], a.scores[c])}`);
  }

  const fixed = [...b.failing].filter((id) => !a.failing.has(id));
  const broke = [...a.failing].filter((id) => !b.failing.has(id));
  if (fixed.length) console.log(`  fixed audits (${fixed.length}): ${fixed.join(", ")}`);
  if (broke.length) {
    console.log(`  NEW failing audits (${broke.length}): ${broke.join(", ")}`);
    regressions += broke.length;
  }
  if (!fixed.length && !broke.length) console.log("  no audit-pass changes");
}

console.log("");
if (regressions > 0) {
  console.error(`Found ${regressions} regression(s).`);
  process.exit(1);
}
console.log("No regressions.");