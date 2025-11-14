import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-to-pdf": process.env.CI ? "../dist" : "../src",
    },
  },
});
