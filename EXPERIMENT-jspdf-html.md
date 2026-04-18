# Experiment: jsPDF `doc.html()` approach, now landed as `engine: "html"`

Branch: `explore-jspdf-html-method` (off `new-internal-api-page-v2`).

## Status

- ✅ Proof-of-concept validated via `docs-site/src/components/JsPdfHtmlExperiment.tsx`.
- ✅ **Folded into the library.** `usePDF`, `generatePDF`, and `<PDF>` now accept an
  `engine: "html"` option alongside the default `"canvas"` engine.
- ✅ Legacy options (`resolution`, `align`, `size`, `hooks.before/afterAddCanvasToPage`,
  `canvas.qualityRatio`, …) still work. They're forwarded in `resolveOptions()` with a
  one-time `console.warn` in dev.

## What shipped

| Location | Responsibility |
| --- | --- |
| `src/types.ts` | New `Options` shape: flat shared keys + nested `canvas` / `html` objects. |
| `src/options.ts` | `resolveOptions()`: defaults, legacy forwarding, and dev warnings. |
| `src/body/canvas.ts` | `renderCanvasBody(doc, targets, opts)` replaces the `DocumentConverter` / `CanvasConverter` / `PageImagesBuilder` / `PageImagesPositioner` / `Document` / `Image` / `Page` class tree. |
| `src/body/html.ts` | `renderHtmlBody(doc, targets, opts, reservedTop, reservedBottom)` wraps `jsPDF.html()` with `autoPaging: "text"` by default. |
| `src/overlay/headerFooter.ts` | Engine-agnostic per-page overlay. One loop for both engines. |
| `src/overlay/renderFragments.ts` | Renders header/footer React components into detached roots when used through the hook API. |
| `src/document.ts` | Thin facade over jsPDF: `save`, `open`, `print`, `getInstance`, `getBlob`, `getBlobURL`, `getNumberOfPages`. ~40 lines, down from ~150. |
| `src/index.ts` | Unified dispatcher. ~175 lines including the hook and four helper functions. |

Deleted: `src/services/` (5 files) and `src/models/` (4 files). Their behaviour
is preserved in `body/canvas.ts` and `document.ts`.

## Using it

```ts
// Default, unchanged behaviour
const { targetRef, toPDF } = usePDF({ filename: "doc.pdf" });

// Canvas engine with explicit options
const { targetRef, toPDF } = usePDF({
  canvas: { resolution: 3, align: "center-xy" },
});

// HTML engine, vectorised, selectable body text
const { targetRef, toPDF } = usePDF({
  engine: "html",
  html: { autoPaging: "text" },
});

// HTML engine with React-component header/footer (works on both engines)
const { targetRef, toPDF } = usePDF({
  engine: "html",
  header: ({ page, pages }) => <Header page={page} total={pages} />,
  footer: ({ page, pages }) => <Footer page={page} total={pages} />,
});
```

## Engine trade-offs

| | canvas (default) | html |
| --- | --- | --- |
| Body is | a rasterised screenshot via html2canvas | jsPDF-native text (when `autoPaging: "text"`) |
| Text is | non-selectable | **selectable / searchable** |
| Fidelity | high, whatever the browser paints | limited, no custom webfonts, simpler CSS subset |
| Performance | scales with resolution | similar to canvas; uses html2canvas only for layout measurement |
| Header/footer | React → html2canvas → stamp | React → html2canvas → stamp (same path) |

## Legacy-option forwarding

These still work; the dev warning tells you where to move them next:

| Old | New |
| --- | --- |
| `options.resolution` | `options.canvas.resolution` |
| `options.align` / `options.size` | `options.canvas.align` / `options.canvas.size` |
| `options.canvas.qualityRatio` | `options.canvas.quality` |
| `options.canvas.useCORS` / `logging` | `options.canvas.overrides.useCORS` / `.logging` |
| `options.hooks.beforeAddCanvasToPage` | `options.canvas.hooks.beforeAddPage` |
| `options.hooks.afterAddCanvasToPage` | `options.canvas.hooks.afterAddPage` |
| `PDFHandle.getDocument()` | `PDFHandle.getPdf()` (returns the raw jsPDF) |

## Known caveats

1. **Font fallback on the html engine.** jsPDF only ships Helvetica/Courier/Times. Custom
   webfonts in body text render with a fallback. To preserve custom fonts, register them
   via `doc.addFileToVFS` + `doc.addFont` or use the canvas engine.
2. **Single-body constraint on html engine.** `renderHtmlBody` throws if given more than
   one `<Body>`. Wrap multiple bodies in a container or stay on canvas.
3. **Visual-diff snapshots.** The canvas-engine output was kept behaviourally equivalent,
   but minor rounding differences are possible. Cypress visual-diff tests will catch any
   drift. Verify before release.

## How to run

```sh
cd docs-site && npm run dev
# http://localhost:4321/react-to-pdf/experiments/jspdf-html
```

The experiment page uses a self-contained PoC (raw `jsPDF` + `html2canvas`) rather
than the library's new `engine: "html"` option, because `docs-site` pins to the
published `react-to-pdf@3.2.2`. Once the library is published, the demo should be
switched to `usePDF({ engine: "html" })`.

## Library tests

Unit tests pass under jsdom with body renderers stubbed:

```
✓ src/constants.test.ts       (12 tests)
✓ src/tests/utils.test.ts     (11 tests)
✓ src/tests/index.test.ts     (17 tests)
✓ src/components/*.test.tsx   (19 tests)
```

The old class-level tests (`CanvasConverter`, `PageImagesBuilder`, `PageImagesPositioner`,
`Document`, `Image`, `Page`, `FooterHeaderService`, `DocumentConverter`) were deleted
alongside the classes they covered. Cypress visual-diff still exercises the whole canvas
path end-to-end.
