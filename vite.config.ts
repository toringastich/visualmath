import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";

// base matches the GitHub Pages project path. For the SoME submission the
// article URL must stay frozen during peer review (Aug 16-30) — hold
// deploys then.
//
// Multi-page build: each article is its own static page with a clean,
// stable URL (…/warp-lessons/eigenvectors/). Adding an article = a new
// .mdx file + an entry in `input` + a stub index.html.
export default defineConfig({
  base: "/warp-lessons/",
  plugins: [
    { enforce: "pre", ...mdx({ jsxImportSource: "react" }) },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        eigenvectors: resolve(__dirname, "eigenvectors/index.html"),
        "cross-product": resolve(__dirname, "cross-product/index.html"),
        determinant: resolve(__dirname, "determinant/index.html"),
      },
    },
  },
  server: { port: 5176, strictPort: true },
});
