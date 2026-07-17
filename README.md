# visualmath

Free, interactive sandboxes for the undergrad math courses where intuition
goes missing — type a mathematical object, watch it act on space. Everything
runs client-side in the browser: no installs, no accounts, no backend.

The flagship tool is [Warp](https://warp.us.com) (linear algebra). This
monorepo is the umbrella for the family of tools that follows it.

> "visualmath" is a working title — the site name lives in one constant in
> `apps/landing/src/App.tsx`, and renaming the repo redirects old URLs.

## Structure

```
apps/
  landing/    The landing page: cards for each tool (live and planned)
              — future: warp/, complex/, vectorcalc/, lessons/
packages/     Shared libraries as tools migrate in
              — future: engine/ (expression parser/evaluator),
                ui/ (expression list, tour, lesson player), state/ (URL codec)
```

## Getting started

Requires Node 18+.

```bash
npm install
npm run dev      # landing page dev server
npm run build    # type-check + production build
```

Pushes to `main` deploy the landing page to GitHub Pages via
`.github/workflows/deploy.yml`.
