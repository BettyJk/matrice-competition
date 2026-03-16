import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Vite configuration for Capgemini Skill Forge
// Uses React SWC for fast compilation and alias resolution for clean imports
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      // Alias @ to the src directory for cleaner imports
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
