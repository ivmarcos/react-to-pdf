import path from "path";
import { defineConfig } from "cypress";
import ComparePdf, { ComparePdfConfig } from "compare-pdf";

const comparePDFConfig: ComparePdfConfig = {
  paths: {
    actualPdfRootFolder: path.join(process.cwd(), "cypress", "downloads"),
    baselinePdfRootFolder: path.join(process.cwd(), "cypress", "baseline"),
    actualPngRootFolder: path.join(
      process.cwd(),
      "cypress",
      "downloads",
      "png"
    ),
    baselinePngRootFolder: path.join(
      process.cwd(),
      "cypress",
      "baseline",
      "png"
    ),
    diffPngRootFolder: path.join(process.cwd(), "cypress", "baseline", "diff"),
  },
  settings: {
    imageEngine: "native",
    density: 150,
    quality: 80,
    tolerance: 0,
    threshold: 0.1,
    cleanPngPaths: false,
    matchPageCount: true,
    disableFontFace: true,
    verbosity: 0,
  },
};

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("task", {
        async compareFile(filename: string) {
          const comparisonResults = await new ComparePdf(comparePDFConfig)
            .actualPdfFile(filename)
            .baselinePdfFile(filename)
            .compare();
          return comparisonResults;
        },
      });
    },
  },
});
