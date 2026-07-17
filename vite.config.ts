import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base matches the GitHub Pages project path. For the SoME submission this
// URL must stay frozen during peer review (Aug 16-30) — hold deploys then.
export default defineConfig({
  base: "/warp-lessons/",
  plugins: [react()],
  server: { port: 5176, strictPort: true },
});
