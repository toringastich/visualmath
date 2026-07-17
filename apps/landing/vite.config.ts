import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base must match the GitHub Pages project path (repo name). When the
// umbrella gets its own domain, change this to "/".
export default defineConfig({
  base: "/visualmath/",
  plugins: [react()],
  server: { port: 5174, strictPort: true },
});
