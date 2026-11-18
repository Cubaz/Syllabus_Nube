import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    fs: {
      // Permite importar las reglas de validación compartidas con el backend (../shared).
      allow: [fileURLToPath(new URL("..", import.meta.url))],
    },
  },
});
