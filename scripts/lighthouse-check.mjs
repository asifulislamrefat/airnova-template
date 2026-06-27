#!/usr/bin/env node
// Runs Lighthouse against a sample of blog pages and fails if SEO score or
// structured-data coverage drops below configurable thresholds.
//
// Usage:
//   SEO_BASE_URL=https://airnova-template.lovable.app \
//   SEO_BLOG_SLUGS=slug-a,slug-b \
//   LH_SEO_MIN=0.9 LH_PERF_MIN=0.7 \
//   node scripts/lighthouse-check.mjs
//
// Requires (installed in CI): lighthouse, chrome-launcher.

import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const BASE = (process.env.SEO_BASE_URL || "https://airnova-template.lovable.app").replace(/\/$/, "");
const SLUGS = (process.env.SEO_BLOG_SLUGS ||
  "how-to-create-content-that-actually-converts,where-creativity-meets-strategy,explore-the-future-of-digital-design"
).split(",").map((s) => s.trim()).filter(Boolean);

const LH_SEO_MIN = Number(process.env.LH_SEO_MIN ?? 0.9);
const LH_PERF_MIN = Number(process.env.LH_PERF_MIN ?? 0.7);
const LH_BEST_MIN = Number(process.env.LH_BEST_MIN ?? 0.85);
const LH_A11Y_MIN = Number(process.env.LH_A11Y_MIN ?? 0.85);

// Structured-data audits that must pass on every blog page.
const STRUCTURED_DATA_AUDITS = ["structured-data", "is-crawlable", "meta-description", "document-title", "http-status-code", "canonical"];

const failures = [];
const ok = (m) => console.log(`  ok  ${m}`);
const fail = (m) => { failures.push(m); console.log(`  FAIL ${m}`); };

const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
try {
  for (const slug of SLUGS) {
    const url = `${BASE}/blog/${slug}`;
    console.log(`\nLighthouse → ${url}`);
    const runner = await lighthouse(url, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "seo", "best-practices", "accessibility"],
    });
    const lhr = runner.lhr;
    const cats = lhr.categories;
    const scores = {
      seo: cats.seo?.score ?? 0,
      performance: cats.performance?.score ?? 0,
      "best-practices": cats["best-practices"]?.score ?? 0,
      accessibility: cats.accessibility?.score ?? 0,
    };
    console.log(`  scores: ${JSON.stringify(scores)}`);

    if (scores.seo < LH_SEO_MIN) fail(`${url}: SEO ${scores.seo} < ${LH_SEO_MIN}`); else ok(`${url}: SEO ${scores.seo}`);
    if (scores.performance < LH_PERF_MIN) fail(`${url}: performance ${scores.performance} < ${LH_PERF_MIN}`); else ok(`${url}: perf ${scores.performance}`);
    if (scores["best-practices"] < LH_BEST_MIN) fail(`${url}: best-practices ${scores["best-practices"]} < ${LH_BEST_MIN}`); else ok(`${url}: best-practices ${scores["best-practices"]}`);
    if (scores.accessibility < LH_A11Y_MIN) fail(`${url}: accessibility ${scores.accessibility} < ${LH_A11Y_MIN}`); else ok(`${url}: a11y ${scores.accessibility}`);

    for (const id of STRUCTURED_DATA_AUDITS) {
      const audit = lhr.audits[id];
      if (!audit) { console.log(`  skip ${url}: audit "${id}" not produced`); continue; }
      // score === null means "informative / not applicable" — don't fail.
      if (audit.score === null) ok(`${url}: ${id} (informative)`);
      else if (audit.score < 1) fail(`${url}: audit "${id}" failed (${audit.title})`);
      else ok(`${url}: ${id}`);
    }
  }
} finally {
  await chrome.kill();
}

console.log("");
if (failures.length) {
  console.error(`Lighthouse check failed with ${failures.length} issue(s).`);
  process.exit(1);
}
console.log("All Lighthouse checks passed.");