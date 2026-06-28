#!/usr/bin/env node
/**
 * Container spacing regression check.
 *
 * Loads each route at mobile + desktop viewports and asserts that EVERY
 * `.container-x` element on the page measures the same horizontal padding
 * and edge offset. Diverging values mean a section escaped the global
 * container rule and needs to be migrated back to `container-x`.
 *
 * `.container-x-inset` is measured separately because it's intentionally
 * 10/30 px narrower (sits inside a full-bleed chrome on Projects / Cta).
 *
 * Usage:
 *   node scripts/container-spacing-check.mjs              # localhost:8080
 *   BASE_URL=https://airnova-template.lovable.app node scripts/container-spacing-check.mjs
 *
 * Exits 0 when every route is consistent, 1 on the first mismatch.
 */
import { chromium } from "playwright";

const BASE_URL = (process.env.BASE_URL || "http://localhost:8080").replace(/\/$/, "");

/** Routes to audit. Add new pages here as the app grows. */
const ROUTES = [
  "/",
  "/about",
  "/studio",
  "/services",
  "/services/branding",
  "/projects",
  "/projects/neuraflow-ai-platform",
  "/blog",
  "/pricing",
  "/contact",
];

/** Viewports. Mobile is the primary regression target; desktop is a sanity check. */
const DEVICES = [
  { name: "mobile", width: 412, height: 1400 },
  { name: "desktop", width: 1440, height: 1400 },
];

/** Rounding slack — sub-pixel layout means a 0.01 px drift is not a regression. */
const TOLERANCE = 1;

const COLLECT = `() => {
  return Array.from(document.querySelectorAll('.container-x, .container-x-inset')).map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const variant = el.classList.contains('container-x-inset') ? 'container-x-inset' : 'container-x';
    return {
      variant,
      left: r.left,
      right: window.innerWidth - r.right,
      padL: parseFloat(cs.paddingLeft),
      padR: parseFloat(cs.paddingRight),
    };
  });
}`;

const failures = [];

function approxEqual(a, b) {
  return Math.abs(a - b) <= TOLERANCE;
}

/** Group measurements by variant and assert all entries within a group match. */
function checkRoute(route, device, items) {
  const byVariant = items.reduce((acc, it) => {
    (acc[it.variant] ||= []).push(it);
    return acc;
  }, {});

  for (const [variant, entries] of Object.entries(byVariant)) {
    if (entries.length === 0) continue;
    const ref = entries[0];
    const mismatch = entries.find(
      (e) =>
        !approxEqual(e.padL, ref.padL) ||
        !approxEqual(e.padR, ref.padR) ||
        !approxEqual(e.left, ref.left) ||
        !approxEqual(e.right, ref.right),
    );
    if (mismatch) {
      failures.push({
        route,
        device: device.name,
        variant,
        reference: ref,
        mismatch,
        total: entries.length,
      });
    }
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const device of DEVICES) {
      const context = await browser.newContext({
        viewport: { width: device.width, height: device.height },
      });
      const page = await context.newPage();

      for (const route of ROUTES) {
        const url = `${BASE_URL}${route}`;
        try {
          await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
          await page.waitForTimeout(400);
        } catch (err) {
          failures.push({ route, device: device.name, error: String(err) });
          continue;
        }

        const items = await page.evaluate(COLLECT);
        if (!items || items.length === 0) {
          failures.push({
            route,
            device: device.name,
            error: "No .container-x elements found — section likely missing the global container.",
          });
          continue;
        }
        checkRoute(route, device, items);
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  if (failures.length === 0) {
    console.log(
      `\u2713 container-x spacing consistent across ${ROUTES.length} route(s) \u00d7 ${DEVICES.length} viewport(s).`,
    );
    process.exit(0);
  }

  console.error(`\u2717 container-x spacing regressions:\n`);
  for (const f of failures) {
    if (f.error) {
      console.error(`  [${f.device}] ${f.route} — ${f.error}`);
      continue;
    }
    console.error(
      `  [${f.device}] ${f.route} (${f.variant}, n=${f.total}):\n` +
        `      reference: padL=${f.reference.padL}px padR=${f.reference.padR}px left=${f.reference.left}px right=${f.reference.right}px\n` +
        `      mismatch:  padL=${f.mismatch.padL}px padR=${f.mismatch.padR}px left=${f.mismatch.left}px right=${f.mismatch.right}px`,
    );
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});