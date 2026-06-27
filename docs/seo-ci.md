# SEO CI checks

## Lighthouse form factor (`LH_FORM_FACTOR`)

`scripts/lighthouse-check.mjs` accepts `LH_FORM_FACTOR=mobile|desktop`
(default `mobile`). Mobile uses Lighthouse's built-in Moto G Power +
Slow 4G + 5.5× CPU throttle preset and a 412×823 viewport; desktop uses
the `desktop` preset (1350×940, lighter throttling).

The GitHub workflow runs both: a desktop pass against the standard
thresholds, then a mobile pass with `LH_MOBILE_PERF_MIN` (default `0.6`)
and `LH_MOBILE_SEO_MIN` (default `0.9`). Override via workflow_dispatch
inputs (`lh_mobile_perf_min`, `lh_mobile_seo_min`) or repo Variables
(`LH_MOBILE_PERF_MIN`, `LH_MOBILE_SEO_MIN`). Reports land in
`lighthouse-reports/<slug>.<form-factor>.{html,json}` so the uploaded
artifact contains both runs side-by-side.

## Mobile performance budget

Beyond category scores, the mobile pass enforces raw metric ceilings (Core
Web Vitals "good" thresholds + a font-load cap):

| Env var          | Default | What it checks                                     |
| ---------------- | ------- | -------------------------------------------------- |
| `LH_LCP_MAX_MS`  | `2500`  | Largest Contentful Paint (ms)                      |
| `LH_FCP_MAX_MS`  | `1800`  | First Contentful Paint (ms)                        |
| `LH_CLS_MAX`     | `0.1`   | Cumulative Layout Shift (unitless)                 |
| `LH_FONT_MAX_MS` | `1500`  | Sum of woff/woff2/ttf/otf request durations (ms)   |

Each per-URL run logs the actual values and `ok` / `FAIL` lines, e.g.:

```
  budget: LCP=2210ms  FCP=1420ms  CLS=0.003  fonts=380ms (1 file)
  ok  …/blog/slug: LCP 2210ms (budget 2500ms)
  FAIL …/blog/slug: font load 1820ms > budget 1500ms — https://…/inter-…woff2
```

Any violation fails the job. Override via workflow_dispatch inputs
(`lh_lcp_max_ms`, `lh_fcp_max_ms`, `lh_cls_max`, `lh_font_max_ms`) or repo
Variables of the same uppercase names. Set `LH_BUDGET_ENABLED=0` to skip
the budget block (the desktop pass already does this).

Three scripts run in `.github/workflows/seo-check.yml` on every successful
deployment, daily at 06:00 UTC, and on manual dispatch:

| Step                       | Script                            | Purpose                                                                 |
| -------------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| SEO regression scrape      | `scripts/seo-check.mjs`           | Verifies `/sitemap.xml`, `/rss.xml`, og/twitter/canonical/robots meta.  |
| JSON-LD validation         | `scripts/validate-jsonld.mjs`     | Asserts schema.org BlogPosting fields; optional remote validator call. |
| Lighthouse thresholds      | `scripts/lighthouse-check.mjs`    | Runs Lighthouse and fails on score / structured-data audit drops.       |

All three accept the same environment variables — set them in the workflow
`env:` block, in repository **Settings → Secrets and variables → Actions →
Variables**, or inline when running locally.

## Shared variables

| Variable                   | Default                                           | Used by                                       | Notes                                                                                                          |
| -------------------------- | ------------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `SEO_BASE_URL`             | `https://airnova-template.lovable.app`            | all                                           | Site to scrape. The workflow auto-uses the deployment's `target_url` when triggered by `deployment_status`.    |
| `SEO_BLOG_SLUGS`           | 6 seeded slugs (validator) / 3 (others)           | `validate-jsonld.mjs`, `lighthouse-check.mjs` | Comma-separated slug list (no `/blog/` prefix). Pick fewer for faster Lighthouse runs.                         |
| `SEO_BLOG_SAMPLE`          | 3 seeded slugs                                    | `seo-check.mjs`                               | Same idea, kept separate so the lightweight scrape can cover a different set than Lighthouse.                  |
| `SEO_USE_REMOTE_VALIDATOR` | unset (`"1"` enables)                             | `validate-jsonld.mjs`                         | When `"1"`, cross-checks each JSON-LD blob against `validator.schema.org`.                                     |

## Lighthouse thresholds

Scores are 0–1. A page must meet **every** threshold or the build fails.
Lower these to triage flakes; raise them once the site is stable.

| Variable        | Default | Lighthouse category |
| --------------- | ------- | ------------------- |
| `LH_SEO_MIN`    | `0.9`   | SEO                 |
| `LH_PERF_MIN`   | `0.7`   | Performance         |
| `LH_BEST_MIN`   | `0.85`  | Best Practices      |
| `LH_A11Y_MIN`   | `0.85`  | Accessibility       |

## Lighthouse report artifacts

The workflow uploads `lighthouse-reports/` as a GitHub Actions build artifact
(`lighthouse-reports-<run_id>-<attempt>`) on every run, including failures.
Each sampled blog page produces two files:

- `<slug>.html` — the interactive Lighthouse report (open in a browser).
- `<slug>.json` — the raw `lhr` for diffing or piping into other tools.

Download them from the run page's **Artifacts** section. Override the local
output directory with `LH_REPORT_DIR=/tmp/lh node scripts/lighthouse-check.mjs`.

The script also fails on any of these Lighthouse audits scoring < 1
(non-applicable audits with `score === null` are ignored):

- `structured-data`
- `is-crawlable`
- `meta-description`
- `document-title`
- `http-status-code`
- `canonical`

## Running locally

```bash
# Lightweight scrape — no install required
SEO_BASE_URL=https://airnova-template.lovable.app \
  node scripts/seo-check.mjs

# JSON-LD validation with the remote validator
SEO_BASE_URL=https://airnova-template.lovable.app \
SEO_USE_REMOTE_VALIDATOR=1 \
  node scripts/validate-jsonld.mjs

# Lighthouse (one-off install)
npm install --no-save lighthouse@12 chrome-launcher@1
SEO_BASE_URL=https://airnova-template.lovable.app \
SEO_BLOG_SLUGS=where-creativity-meets-strategy,creative-tips-for-modern-designers \
LH_SEO_MIN=0.9 LH_PERF_MIN=0.75 LH_BEST_MIN=0.85 LH_A11Y_MIN=0.9 \
  node scripts/lighthouse-check.mjs
```

## Tuning the CI defaults

Edit `.github/workflows/seo-check.yml` and override the relevant variables in
the step's `env:` block. Example — tighten SEO, sample two pages:

```yaml
- name: Lighthouse SEO + structured data thresholds
  env:
    SEO_BASE_URL: ${{ inputs.base_url || 'https://airnova-template.lovable.app' }}
    SEO_BLOG_SLUGS: "where-creativity-meets-strategy,creative-tips-for-modern-designers"
    LH_SEO_MIN: "0.95"
    LH_PERF_MIN: "0.8"
  run: node scripts/lighthouse-check.mjs
```

Prefer repository-level **Variables** when the same value should apply to
every step — reference them as `${{ vars.LH_PERF_MIN }}`.