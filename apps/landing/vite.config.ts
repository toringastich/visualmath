import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The landing page is served from the domain root (secantlabs.org), so base is
// "/" and not the Pages project path. public/CNAME is what claims the domain,
// and the two have to move together -- mismatch either way serves a page whose
// assets 404. That is not hypothetical: attaching the custom domain in Pages
// settings before this commit shipped left secantlabs.org serving the previous
// build, still asking for /visualmath/assets/* at a root that no longer has it.
//
// That CNAME is also why this repo can only ever publish ONE site. A GitHub
// Pages site takes a single custom domain, so apps/warp/public/CNAME
// (warp.us.com) must not reach the same gh-pages branch -- whichever CNAME
// landed at the root would decide the domain for both. deploy.yml publishes
// apps/landing/dist alone, which is what keeps them apart.
export default defineConfig({
  base: "/",
  plugins: [react()],
  server: { port: 5174, strictPort: true },
});
