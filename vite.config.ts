import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // assets/ is pipeline input (incl. locked .HEIC on Windows -> EBUSY).
      // Vite only needs to watch src/ + public/media output, not raw sources.
      ignored: ["**/assets/**"],
    },
  },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1200,
  },
});
