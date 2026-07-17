# packages/

Shared libraries live here as tools migrate into the monorepo:

- `engine/` — the expression parser/evaluator (from Warp's `src/lib`)
- `ui/` — shared components: expression list, onboarding tour, lesson player
- `state/` — the URL-hash state codec (the public, versioned scene format)

Empty for now — the landing page came first, functionality migrates next.
