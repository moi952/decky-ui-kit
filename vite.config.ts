import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Every deploy targets its own path segment under /decky-ui-kit/ — a real
// version ("0.2.0") for a tagged release, or "preview" for a workflow_dispatch
// preview build — so multiple versions' demos can live side by side instead
// of each deploy overwriting the last. Defaults to "preview" for local dev.
const versionSegment = process.env.DEMO_VERSION_SEGMENT || "preview";

export default defineConfig({
  root: "demo",
  base: `/decky-ui-kit/${versionSegment}/`,
  plugins: [react()],
  resolve: {
    alias: {
      "@decky/ui": path.resolve(__dirname, "demo/mocks/decky-ui.tsx"),
    },
  },
  build: {
    outDir: "../demo-dist",
    emptyOutDir: true,
  },
  define: {
    __DEMO_VERSION__: JSON.stringify(versionSegment),
  },
});
