import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repository = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.GITHUB_ACTIONS && repository ? `/${repository}/` : "/";

export default defineConfig({
  base,
  build: {
    outDir: "dist/client",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("cytoscape")) return "graph";
          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils")) return "motion";
          if (id.includes("node_modules/react") || id.includes("react-router")) return "react";
          return undefined;
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local", "localhost", "127.0.0.1"],
    warmup: {
      clientFiles: ["./src/main.tsx"],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["tests/**", "node_modules/**"],
  },
  plugins: [react()],
});
