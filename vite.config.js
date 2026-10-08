import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React setup. No extra config needed for this prototype.
export default defineConfig({
  plugins: [react()],
});
