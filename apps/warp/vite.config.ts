import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Serves at the domain root (warp.us.com); the engine package is consumed
// as TypeScript source via the @vm/engine alias — no build step needed.
export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@vm/engine": resolve(__dirname, "../../packages/engine/src"),
    },
  },
  server: { port: 5175, strictPort: true },
});
