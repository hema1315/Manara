import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api-gutendex": {
        target: "https://gutendex.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-gutendex/, ""),
      },
    },
  },
});
