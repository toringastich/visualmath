# Warp Lessons

Click-through, fully interactive lessons built on [Warp](https://warp.us.com):
read a little, watch space move, then try it yourself in the sandbox.

The eigenvectors lesson is the entry for the **non-video category of
3Blue1Brown's Summer of Math Exposition 2026** (deadline Aug 15; no deploys
during peer review Aug 16–30 — the entry URL must stay frozen).

## How lessons work

A lesson step = a short piece of writing + a live Warp scene. Scenes load
through Warp's own URL-hash state format (`warp.us.com/#s=…`) inside an
iframe — so **authoring a step is just building the scene in Warp and
copying the address bar**. No lesson engine to maintain; the sandbox is the
renderer. See `src/lessons.ts`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5176/warp-lessons/
npm run build
```

Pushes to `main` deploy to GitHub Pages.
