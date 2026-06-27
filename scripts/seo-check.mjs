#!/usr/bin/env node
// Re-scrapes /sitemap.xml, /rss.xml, and a sample of /blog/ pages to catch SEO regressions.
// Usage: SEO_BASE_URL=https://airnova-template.lovable.app node scripts/seo-check.mjs

const BASE = (process.env.SEO_BASE_URL || "https://airnova-template.lovable.app").replace(/\/$/, "");
const BLOG_SAMPLE = (process.env.SEO_BLOG_SAMPLE || "the-art-of-creative-design,where-creativity-meets-strategy,explore-the-future-of-digital-design").split(",");

const failures = [];
const pass = (m) => console.log(`  ok  ${m}`);
const fail = (m) => { failures.push(m); console.log(`  FAIL ${m}`); };

async function get(path, expectedType) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { headers: { "user-agent": "airnova-seo-check" } });
  const body = await res.text();
  console.log(`\n${path} -> ${res.status} ${res.headers.get("content-type") || ""}`);
  if (res.status !== 200) fail(`${path} status ${res.status}`);
  if (expectedType && !(res.headers.get("content-type") || "").includes(expectedType)) {
    fail(`${path} expected content-type ${expectedType}`);
  }
  return body;
}

function assertIncludes(path, body, needle, label) {
  if (body.includes(needle)) pass(`${path}: ${label}`);
  else fail(`${path}: missing ${label} (${needle})`);
}

const sitemap = await get("/sitemap.xml", "xml");
assertIncludes("/sitemap.xml", sitemap, "<urlset", "<urlset>");
for (const slug of BLOG_SAMPLE) assertIncludes("/sitemap.xml", sitemap, `/blog/${slug}`, `slug ${slug}`);

const rss = await get("/rss.xml", "rss+xml");
assertIncludes("/rss.xml", rss, "<rss", "<rss>");
assertIncludes("/rss.xml", rss, "<item>", "at least one <item>");

for (const slug of BLOG_SAMPLE) {
  const path = `/blog/${slug}`;
  const html = await get(path);
  assertIncludes(path, html, `property="og:image"`, "og:image");
  assertIncludes(path, html, `name="twitter:image"`, "twitter:image");
  assertIncludes(path, html, `name="twitter:card" content="summary_large_image"`, "twitter:card");
  assertIncludes(path, html, `rel="canonical"`, "canonical");
  assertIncludes(path, html, `name="robots"`, "robots meta");
  assertIncludes(path, html, `application/ld+json`, "JSON-LD");
  assertIncludes(path, html, `"BlogPosting"`, "BlogPosting schema");
  // Absolute URL checks
  if (!/property="og:image"\s+content="https?:\/\//.test(html)) fail(`${path}: og:image not absolute`);
  else pass(`${path}: og:image absolute`);
}

console.log("");
if (failures.length) {
  console.error(`SEO check failed with ${failures.length} issue(s).`);
  process.exit(1);
}
console.log("All SEO checks passed.");