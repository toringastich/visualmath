# Secant Labs

**Live at [secantlabs.org](https://secantlabs.org)**

Free, interactive tools for the undergrad math courses where intuition goes
missing — type a mathematical object, watch it act on space. Everything runs
client-side in the browser: no installs, no accounts, no backend.

The flagship tool is [Warp](https://warp.us.com) (linear algebra). This monorepo
is the umbrella for the family of tools that follows it.

## Structure

```
apps/
  landing/    secantlabs.org — the org page and the tool cards
  warp/       Warp, the linear algebra sandbox (warp.us.com)
  lessons/    Interactive MDX articles that embed live Warp scenes
packages/
  engine/     @secantlabs/engine — the pure math kernel: 2x2/3x3 linear
              algebra, polynomials, and the expression parser/evaluator.
              No rendering dependencies, and the only tested package.
```

`apps/warp` is the single source of truth for Warp. The standalone
`toringastich/warp` repo it grew out of is frozen: its history was absorbed into
this one, and it now exists only to keep serving warp.us.com from its last
build. Nothing there should be edited again.

## Getting started

Requires Node 18+.

```bash
npm install
npm run dev          # landing page      → localhost:5174
npm run dev:warp     # Warp              → localhost:5175
npm run dev:lessons  # lessons           → localhost:5176/warp-lessons/
npm test             # engine test suite (35 tests)
npm run build        # type-check + build landing and warp
```

To develop lesson scenes against a local Warp instead of production:

```bash
VITE_WARP_URL=http://localhost:5175 npm run dev:lessons
```

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`, which tests the engine,
builds, and publishes **`apps/landing/dist` only** to the `gh-pages` branch.

That "only" is load-bearing. A GitHub Pages site takes exactly one custom
domain, and this repo has two CNAME files wanting different ones —
`apps/landing/public/CNAME` (secantlabs.org) and `apps/warp/public/CNAME`
(warp.us.com). If both ever reached the same `gh-pages` branch, whichever landed
at the root would silently decide the domain for both.

| Site | Served from | URL |
| --- | --- | --- |
| Landing | this repo's `gh-pages` | secantlabs.org |
| Warp | `toringastich/warp`'s `gh-pages` (frozen build) | warp.us.com |
| Lessons | `toringastich/warp-lessons`' `gh-pages` | toringastich.github.io/warp-lessons/ |

Warp and lessons still publish from their original repos. That is deliberate and
temporary — see below.

## Frozen until Aug 31, 2026

The singular values article is the entry for the non-video category of
**3Blue1Brown's Summer of Math Exposition 2026**. Peer review runs Aug 16–30 and
the entry URL must not move or change during it.

Two things carry that entry, not one:

1. **`toringastich.github.io/warp-lessons/`** — the judged URL. Only that repo's
   Pages site can serve that path, so that repo stays the publisher.
   `apps/lessons` holds the source but is wired into no build or deploy script,
   and keeps `base: "/warp-lessons/"` to match.
2. **warp.us.com** — every scene in the article is a live iframe of it, and
   `WarpEmbed` pins `e.origin` to that exact origin. Redirecting it to
   secantlabs.org/warp would change the origin, fail that check, and kill the
   autoplay handshake inside the judged article.

So until Aug 31: don't deploy lessons from here, don't move warp.us.com, and
don't transfer either source repo to the org — a transfer moves its Pages URL.

After Aug 31 the cutover is small: point `apps/lessons` at `base: "/lessons/"`,
add both apps to the root `build` script and the deploy workflow, decide how
warp.us.com should be served (a cross-repo publish from here keeps the origin
intact), and let the old URLs redirect.


Copyright (c) 2026 Secant Labs. All rights reserved.

This software is proprietary. No license, express or implied, is granted
to use, copy, modify, merge, publish, distribute, sublicense, or sell
copies of this software except under separate written agreement.

For licensing inquiries: toringastich@gmail.com
