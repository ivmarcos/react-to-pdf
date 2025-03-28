import esbuild from "esbuild";

const buildDir = "dist";
const entryFile = "src/index.ts";

const configs = [
  {
    format: "esm",
    outFile: "index.mjs",
  },
  {
    format: "cjs",
    outFile: "index.js",
  },
];

configs.forEach((config) => {
  esbuild
    .build({
      entryPoints: [entryFile],
      outfile: `${buildDir}/${config.outFile}`,
      bundle: true,
      external: ["react", "react-dom", "jspdf", "html2canvas"],
      target: "esnext",
      format: config.format,
      platform: "neutral",
      sourcemap: true,
    })
    .catch(() => process.exit(1));
});
