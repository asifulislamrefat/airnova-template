#!/usr/bin/env node
// Parses each blog page's JSON-LD and asserts required schema.org fields.
// Optionally cross-checks against Schema.org's public validator
// (https://validator.schema.org/) when SEO_USE_REMOTE_VALIDATOR=1.
//
// Usage:
//   SEO_BASE_URL=https://airnova-template.lovable.app \
//   SEO_BLOG_SLUGS=slug-a,slug-b \
//   node scripts/validate-jsonld.mjs

const BASE = (process.env.SEO_BASE_URL || "https://airnova-template.lovable.app").replace(/\/$/, "");
const SLUGS = (process.env.SEO_BLOG_SLUGS ||
  "how-to-create-content-that-actually-converts,where-creativity-meets-strategy,explore-the-future-of-digital-design,innovative-thinking-for-digital-success,creative-tips-for-modern-designers,your-source-for-design-inspiration"
).split(",").map((s) => s.trim()).filter(Boolean);
const USE_REMOTE = process.env.SEO_USE_REMOTE_VALIDATOR === "1";

const REQUIRED = ["@context", "@type", "headline", "datePublished", "dateModified", "author", "publisher", "image", "mainEntityOfPage"];
const ALLOWED_TYPES = new Set(["BlogPosting", "Article", "NewsArticle"]);

const failures = [];
const pass = (m) => console.log(`  ok  ${m}`);
const fail = (m) => { failures.push(m); console.log(`  FAIL ${m}`); };

function isAbsUrl(v) {
  return typeof v === "string" && /^https?:\/\//.test(v);
}
function isIsoDate(v) {
  if (typeof v !== "string") return false;
  const d = new Date(v);
  return !isNaN(d.getTime());
}
function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1].trim()));
    } catch (err) {
      blocks.push({ __parseError: err.message, __raw: m[1].slice(0, 200) });
    }
  }
  return blocks;
}

function validateBlogPosting(path, data) {
  if (data.__parseError) {
    fail(`${path}: JSON-LD parse error — ${data.__parseError}`);
    return;
  }
  for (const key of REQUIRED) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      fail(`${path}: missing field "${key}"`);
    } else {
      pass(`${path}: has ${key}`);
    }
  }
  if (data["@context"] && !String(data["@context"]).includes("schema.org")) {
    fail(`${path}: @context must reference schema.org`);
  }
  if (data["@type"] && !ALLOWED_TYPES.has(data["@type"])) {
    fail(`${path}: @type "${data["@type"]}" not one of ${[...ALLOWED_TYPES].join("/")}`);
  }
  if (data.datePublished && !isIsoDate(data.datePublished)) fail(`${path}: datePublished not a valid date`);
  if (data.dateModified && !isIsoDate(data.dateModified)) fail(`${path}: dateModified not a valid date`);

  const author = data.author;
  const authors = Array.isArray(author) ? author : [author];
  for (const a of authors) {
    if (!a || typeof a !== "object") { fail(`${path}: author must be an object`); continue; }
    if (!a["@type"]) fail(`${path}: author missing @type`);
    if (!a.name) fail(`${path}: author missing name`);
  }

  const pub = data.publisher;
  if (!pub || typeof pub !== "object") fail(`${path}: publisher must be an object`);
  else {
    if (!pub["@type"]) fail(`${path}: publisher missing @type`);
    if (!pub.name) fail(`${path}: publisher missing name`);
    if (!pub.logo || !(pub.logo.url || isAbsUrl(pub.logo))) fail(`${path}: publisher missing logo.url`);
  }

  const images = Array.isArray(data.image) ? data.image : [data.image];
  if (!images.length) fail(`${path}: image is empty`);
  for (const img of images) {
    const url = typeof img === "string" ? img : img?.url;
    if (!isAbsUrl(url)) fail(`${path}: image "${url}" must be an absolute URL`);
  }

  const mep = data.mainEntityOfPage;
  const mepId = typeof mep === "string" ? mep : mep?.["@id"];
  if (!isAbsUrl(mepId)) fail(`${path}: mainEntityOfPage must be an absolute URL`);
}

async function validateRemotely(path, data) {
  // Schema.org's validator exposes an undocumented endpoint used by validator.schema.org.
  // We POST the JSON-LD blob; the response includes "errors" for any structural issues.
  try {
    const res = await fetch("https://validator.schema.org/validate", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code: JSON.stringify(data) }).toString(),
    });
    const text = await res.text();
    // Response is wrapped in `)]}'\n` per Google convention.
    const json = JSON.parse(text.replace(/^\)\]\}'\n?/, ""));
    const errs = json?.errors || json?.tripleGroups?.flatMap?.((g) => g?.nodes?.flatMap?.((n) => n?.errors || []) || []) || [];
    if (errs.length) fail(`${path}: remote validator returned ${errs.length} error(s): ${JSON.stringify(errs).slice(0, 300)}`);
    else pass(`${path}: remote validator clean`);
  } catch (err) {
    console.log(`  warn ${path}: remote validator unreachable (${err.message})`);
  }
}

for (const slug of SLUGS) {
  const path = `/blog/${slug}`;
  console.log(`\n${path}`);
  const res = await fetch(`${BASE}${path}`, { headers: { "user-agent": "airnova-jsonld-validator" } });
  if (res.status !== 200) { fail(`${path} status ${res.status}`); continue; }
  const html = await res.text();
  const blocks = extractJsonLd(html);
  if (!blocks.length) { fail(`${path}: no JSON-LD blocks found`); continue; }
  const posting = blocks.find((b) => ALLOWED_TYPES.has(b?.["@type"]));
  if (!posting) { fail(`${path}: no BlogPosting/Article JSON-LD block`); continue; }
  validateBlogPosting(path, posting);
  if (USE_REMOTE) await validateRemotely(path, posting);
}

console.log("");
if (failures.length) {
  console.error(`JSON-LD validation failed with ${failures.length} issue(s).`);
  process.exit(1);
}
console.log("All JSON-LD checks passed.");