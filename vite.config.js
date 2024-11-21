import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // Core plugins
  plugins: [
    react(), // Add React support
  ],

  preview: {
    port: 3000,
    strictPort: true,
  },

  // Development server configuration
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    cors: true, // Enable CORS
  },

  // Build configuration
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "esbuild",
  },

  // Resolve configuration
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@commonComponents": path.resolve(__dirname, "./src/commonComponents"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },

  // CSS configuration
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },

  // Performance optimization
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
