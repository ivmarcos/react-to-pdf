import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-to-pdf": "../src",
    },
  },
  test: {
    globals: true,
  },
});
