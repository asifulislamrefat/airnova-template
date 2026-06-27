# Fluid Scaling System

All sizing in the app is driven by a single root font-size that scales
linearly with the viewport. Because `html { font-size: var(--size-font) }`
is the base of both `em` and `rem`, every Tailwind `*-N` utility, every
`em` value, and every component-level `rem` value scales together.

Defined in `src/styles.css` (top of file, immediately after the global
resets).

## The five core variables

| Variable | Role | Notes |
| --- | --- | --- |
| `--size-unit` | Design body font-size, unitless (px number). | `16` matches the Figma default. Do not change unless the Figma design uses a different base. |
| `--size-container-ideal` | Figma frame width for the current breakpoint, unitless. | Drives the scaling ratio. Per-breakpoint: `1280` desktop, `834` tablet, `550` mobile L, `390` mobile P. |
| `--size-container-min` | Lower clamp of the viewport range. | Below this, scaling freezes (text stops shrinking). |
| `--size-container-max` | Upper clamp of the viewport range AND the `container-x` max-width. | Above this, scaling freezes (text stops growing). |
| `--container-padding` | Side gutter for `container-x` / `container-x-inset`. | In `em`, so it scales with `--size-font`. |

Derived:

```css
--size-container: clamp(var(--size-container-min), 100vw, var(--size-container-max));
--size-font: calc(var(--size-container) / (var(--size-container-ideal) / var(--size-unit)));
```

At the ideal viewport, `--size-font` equals `--size-unit` px (16px →
`1rem` = 16px). As the viewport shrinks toward `--size-container-min`,
`--size-font` shrinks proportionally; at `--size-container-max` it caps.

## Breakpoint table

| Breakpoint | Media query | ideal | min | max | padding |
| --- | --- | --- | --- | --- | --- |
| Desktop | (default) | 1280 | 992px | 1280px | 3.25em |
| Tablet | `max-width: 991px` | 834 | 768px | 991px | 1.5em |
| Mobile L | `max-width: 767px` | 550 | 480px | 767px | 1em |
| Mobile P | `max-width: 479px` | 390 | 320px | 479px | 1em |

Each breakpoint overrides only the four variables in its row; everything
else (Tailwind utilities, spacing tokens, radii) re-derives automatically.

## How to author with it

- **Prefer Tailwind sizing utilities** (`text-base`, `p-4`, `gap-6`,
  `h-12`, etc.). They emit `rem` and inherit the fluid scale for free.
- **Use `em` for component-internal spacing** that should scale with the
  component's own font-size (e.g. button padding relative to its label).
- **Use the spacing tokens** (`--spacing-xs … --spacing-section`) and
  fluid radii (`--radius-sm-fluid`, `--radius-md-fluid`,
  `--radius-lg-fluid`, `--radius-pill`) for shared, semantic values.
- **Avoid raw `px`** for typography, spacing, and radii. Reserve `px` for
  hairline borders (`1px`), media queries, and the clamp endpoints
  themselves.
- **Layout containers**: use `container-x` (or `container-x-inset` inside
  a card chrome) — never re-implement `mx-auto max-w-[...]  px-*`.

## How to extend

- **Change the desktop design width**: edit `--size-container-ideal`
  and `--size-container-max` in `:root`. Update the breakpoint table
  above to keep it in sync.
- **Add a new breakpoint**: add a `@media screen and (max-width: …px)`
  block that overrides the same four variables.
- **Add a new spacing token**: append `--spacing-…: <Nem>` in the same
  `:root` block. Reference it from CSS as `var(--spacing-…)`. If you
  want a Tailwind utility for it, map it under `@theme` (`--spacing-…`
  → generates `p-…`, `m-…`, `gap-…`).
- **Add a new radius**: same pattern under the radius group; for
  Tailwind exposure, map to `--radius-*` in `@theme inline`.

## Sanity checks

- At ≥1280px viewport, `getComputedStyle(document.documentElement).fontSize`
  should be `16px`.
- At exactly 992px desktop, the value should still be `~12.4px`
  (`992 / 1280 * 16`) — text shrinks proportionally before the tablet
  breakpoint takes over at 991px.
- At 834px (tablet ideal), it should be `16px` again; at 550px and 390px
  the same identity holds for their respective breakpoints.

## Out of scope

- Color and font tokens (see the `@theme` / `:root` color blocks).
- Animation and transition tokens.
- Per-component max-widths that constrain text/image blocks inside the
  container (those remain literal `max-w-[…]px` values).