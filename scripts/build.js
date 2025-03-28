import esbuild from "esbuild";
import { execSync } from "child_process";

const entryFile = "src/index.ts";
const outFile = "dist/index.js";
const dtsFile = "dist/index.d.ts";

// Run TypeScript compiler to generate declaration file
execSync(
  `tsc ${entryFile} --declaration --emitDeclarationOnly --outFile ${dtsFile}`
);

// Run esbuild to bundle the JavaScript output
esbuild
  .build({
    entryPoints: [entryFile],
    outfile: outFile,
    bundle: true,
    external: ["react", "react-dom", "jspdf", "html2canvas"],
    target: "esnext",
    format: "esm",
    platform: "neutral",
    sourcemap: true,
  })
  .catch(() => process.exit(1));
