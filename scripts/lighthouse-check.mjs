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
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE = (process.env.SEO_BASE_URL || "https://airnova-template.lovable.app").replace(/\/$/, "");
const SLUGS = (process.env.SEO_BLOG_SLUGS ||
  "how-to-create-content-that-actually-converts,where-creativity-meets-strategy,explore-the-future-of-digital-design"
).split(",").map((s) => s.trim()).filter(Boolean);

const LH_SEO_MIN = Number(process.env.LH_SEO_MIN ?? 0.9);
const LH_PERF_MIN = Number(process.env.LH_PERF_MIN ?? 0.7);
const LH_BEST_MIN = Number(process.env.LH_BEST_MIN ?? 0.85);
const LH_A11Y_MIN = Number(process.env.LH_A11Y_MIN ?? 0.85);

// ---- Mobile performance budget (raw metric ceilings, not 0–1 scores) -------
// Applied on every run; defaults below are tuned for mobile (Moto G Power +
// Slow 4G). For a desktop pass, override via env to looser values or set
// LH_BUDGET_ENABLED=0 to skip the budget block entirely.
const LH_BUDGET_ENABLED = process.env.LH_BUDGET_ENABLED !== "0";
const LH_LCP_MAX_MS = Number(process.env.LH_LCP_MAX_MS ?? 2500);   // Core Web Vitals "good"
const LH_FCP_MAX_MS = Number(process.env.LH_FCP_MAX_MS ?? 1800);   // CWV "good"
const LH_CLS_MAX = Number(process.env.LH_CLS_MAX ?? 0.1);          // CWV "good"
const LH_FONT_MAX_MS = Number(process.env.LH_FONT_MAX_MS ?? 1500); // total woff/woff2 load time

// Form factor: "mobile" (Lighthouse default — Moto G Power, Slow 4G, 5.5x CPU
// throttle, 412x823 viewport) or "desktop" (1350x940, faster throttle).
// Mobile catches the regressions Google actually ranks on, so default there.
const LH_FORM_FACTOR = (process.env.LH_FORM_FACTOR || "mobile").toLowerCase();
if (!["mobile", "desktop"].includes(LH_FORM_FACTOR)) {
  console.error(`Invalid LH_FORM_FACTOR=${LH_FORM_FACTOR}. Use "mobile" or "desktop".`);
  process.exit(2);
}

// Where to write per-URL HTML + JSON Lighthouse reports. CI uploads this
// directory as a build artifact (see .github/workflows/seo-check.yml).
const LH_REPORT_DIR = resolve(process.env.LH_REPORT_DIR || "lighthouse-reports");
mkdirSync(LH_REPORT_DIR, { recursive: true });

console.log(`Lighthouse form factor: ${LH_FORM_FACTOR}`);
if (LH_BUDGET_ENABLED) {
  console.log(
    `Perf budget: LCP<=${LH_LCP_MAX_MS}ms  FCP<=${LH_FCP_MAX_MS}ms  CLS<=${LH_CLS_MAX}  font<=${LH_FONT_MAX_MS}ms`,
  );
}

// Pull total time spent loading font files (woff/woff2/ttf/otf) from the
// network-requests audit. We sum each request's (endTime - startTime), since
// fonts often load in parallel — this is the wall-clock time fonts kept the
// network busy, which is what actually delays text paint.
function fontLoadMsFromLhr(lhr) {
  const items = lhr.audits?.["network-requests"]?.details?.items ?? [];
  const fontReqs = items.filter((r) => {
    const url = String(r.url || "");
    const ct = String(r.mimeType || r.resourceType || "");
    return /\.(woff2?|ttf|otf)(\?|$)/i.test(url) || /font/i.test(ct);
  });
  if (!fontReqs.length) return { ms: 0, count: 0, urls: [] };
  const ms = fontReqs.reduce(
    (acc, r) => acc + Math.max(0, (r.endTime ?? 0) - (r.startTime ?? 0)),
    0,
  );
  return { ms: Math.round(ms), count: fontReqs.length, urls: fontReqs.map((r) => r.url) };
}

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
      output: ["html", "json"],
      logLevel: "error",
      onlyCategories: ["performance", "seo", "best-practices", "accessibility"],
      // `preset: "desktop"` swaps in desktop throttling + viewport; omitting it
      // uses Lighthouse's default mobile emulation (Moto G Power, Slow 4G).
      ...(LH_FORM_FACTOR === "desktop" ? { preset: "desktop" } : {}),
    });
    const lhr = runner.lhr;
    const [htmlReport, jsonReport] = runner.report;
    const safe = `${slug.replace(/[^a-z0-9-]+/gi, "_")}.${LH_FORM_FACTOR}`;
    writeFileSync(`${LH_REPORT_DIR}/${safe}.html`, htmlReport);
    writeFileSync(`${LH_REPORT_DIR}/${safe}.json`, jsonReport);
    console.log(`  report: ${LH_REPORT_DIR}/${safe}.{html,json}`);
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

    // ---- Performance budget: raw metric ceilings -----------------------------
    if (LH_BUDGET_ENABLED) {
      const lcpMs = Math.round(lhr.audits["largest-contentful-paint"]?.numericValue ?? 0);
      const fcpMs = Math.round(lhr.audits["first-contentful-paint"]?.numericValue ?? 0);
      const cls = Number((lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0).toFixed(4));
      const font = fontLoadMsFromLhr(lhr);
      console.log(
        `  budget: LCP=${lcpMs}ms  FCP=${fcpMs}ms  CLS=${cls}  fonts=${font.ms}ms (${font.count} file${font.count === 1 ? "" : "s"})`,
      );
      if (lcpMs > LH_LCP_MAX_MS) fail(`${url}: LCP ${lcpMs}ms > budget ${LH_LCP_MAX_MS}ms`);
      else ok(`${url}: LCP ${lcpMs}ms (budget ${LH_LCP_MAX_MS}ms)`);
      if (fcpMs > LH_FCP_MAX_MS) fail(`${url}: FCP ${fcpMs}ms > budget ${LH_FCP_MAX_MS}ms`);
      else ok(`${url}: FCP ${fcpMs}ms (budget ${LH_FCP_MAX_MS}ms)`);
      if (cls > LH_CLS_MAX) fail(`${url}: CLS ${cls} > budget ${LH_CLS_MAX}`);
      else ok(`${url}: CLS ${cls} (budget ${LH_CLS_MAX})`);
      if (font.ms > LH_FONT_MAX_MS) {
        fail(`${url}: font load ${font.ms}ms > budget ${LH_FONT_MAX_MS}ms — ${font.urls.join(", ")}`);
      } else {
        ok(`${url}: font load ${font.ms}ms (budget ${LH_FONT_MAX_MS}ms)`);
      }
    }

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