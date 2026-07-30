# Warp Lessons

**Live at [toringastich.github.io/warp-lessons/eigenvectors/](https://toringastich.github.io/warp-lessons/eigenvectors/)**

Interactive **articles** built on [Warp](https://warp.us.com): essay-style
exposition with live, manipulable Warp scenes embedded in the prose —
ending at the open sandbox.

The eigenvectors article is the entry for the **non-video category of
3Blue1Brown's Summer of Math Exposition 2026** (deadline Aug 15; no deploys
during peer review Aug 16–30 — the entry URL must stay frozen).

> **This copy does not deploy — not yet.** The source lives here now, but the
> live site is still published from the standalone `toringastich/warp-lessons`
> repo, because the judged URL above can only be produced by that repo's Pages
> site. Nothing here is wired into the monorepo's build or deploy scripts, and
> `vite.config.ts` keeps `base: "/warp-lessons/"` to match.
>
> Two things must therefore stay untouched until **Aug 31**: that repo's
> `gh-pages` branch, and **warp.us.com** — `WarpEmbed` iframes it and pins
> `e.origin` to it, so every scene in the judged article is a live frame of
> that origin. Moving or redirecting either one breaks the entry mid-judging.
>
> After Aug 30: point `base` at `/lessons/`, add lessons to the root `build`
> script and the deploy workflow, and let the old URL redirect.

## How articles work

Articles are MDX (`src/articles/*.mdx`): markdown prose with
`<WarpEmbed state={…} caption="…" />` dropped wherever a scene belongs.
Scenes load through Warp's own URL-hash state format (`warp.us.com/#s=…`) in
a lazily-mounted iframe — **authoring a scene is just building it in Warp
and copying the address bar** (constants live in `src/states.ts`). Embeds
boot only as the reader scrolls near them.

Each article is its own static page with a clean, stable URL
(`…/warp-lessons/eigenvectors/`). Adding an article = a new `.mdx` file, a
stub `<slug>/index.html`, an entry module in `src/pages/`, and one line each
in `vite.config.ts` and `src/articles/index.ts`.

Narration: the Listen button in the article header plays a recorded
voice-over when `audioUrl` is passed to `ArticleShell`, else falls back to
browser text-to-speech reading the article. Recordings can be added without
touching the player.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5176/warp-lessons/
npm run build
```

Pushes to `main` deploy to GitHub Pages.
