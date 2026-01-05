import path from "path";
import { defineConfig } from "cypress";
import { comparePdfToSnapshot } from "pdf-visual-diff";

interface ComparisonResult {
  status: "passed" | "failed";
  message?: string;
}

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        async compareFile(filename: string): Promise<ComparisonResult> {
          const actualPath = path.join(process.cwd(), "cypress", "downloads", filename);
          const snapshotDir = path.join(process.cwd(), "cypress", "baseline");

          try {
            // comparePdfToSnapshot returns true if PDFs match, false if they don't
            const matches = await comparePdfToSnapshot(
              actualPath,
              snapshotDir,
              filename,
              {
                tolerance: 0.1,
                pdf2PngOptions: {
                  dpi: 150,
                },
              }
            );

            if (matches) {
              return { status: "passed" };
            } else {
              return {
                status: "failed",
                message: `PDF comparison failed: ${filename} does not match baseline`,
              };
            }
          } catch (error) {
            return {
              status: "failed",
              message: `PDF comparison error: ${error instanceof Error ? error.message : String(error)}`,
            };
          }
        },
      });
    },
  },
});
