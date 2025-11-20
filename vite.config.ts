import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) {
              return "charts";
            }
            if (id.includes("@mui/icons-material")) {
              return "mui-icons";
            }
            if (id.includes("@mui/material")) {
              return "mui-material";
            }
            if (id.includes("@mui/lab")) {
              return "mui-lab";
            }
            if (id.includes("@emotion")) {
              return "mui-emotion";
            }
            if (id.includes("@mui")) {
              return "mui-shared";
            }
            if (id.includes("react-router")) {
              return "router";
            }
            if (id.includes("react-redux") || id.includes("@reduxjs/toolkit")) {
              return "redux";
            }
            if (
              id.includes("react-dom") ||
              id.includes("react/jsx-runtime") ||
              id.includes("react")
            ) {
              return "react-vendor";
            }
          }
          return undefined;
        },
      },
    },
  },
});
