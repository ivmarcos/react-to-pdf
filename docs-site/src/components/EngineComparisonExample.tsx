import { useState } from "react";
import { usePDF } from "react-to-pdf";
import type { Options } from "react-to-pdf";

type Engine = "canvas" | "html";

interface RunResult {
  engine: Engine;
  pages: number;
  elapsedMs: number;
  sizeBytes: number;
  blobUrl: string;
  downloadName: string;
}

const SECTION_COUNT = 8;

function DocumentBody() {
  return (
    <div
      style={{
        padding: 32,
        fontFamily: "Arial, Helvetica, sans-serif",
        color: "#0f172a",
        background: "white",
        lineHeight: 1.6,
      }}
    >
      <h1 style={{ color: "#0ea5e9", marginTop: 0 }}>Quarterly Report 2026</h1>
      <p style={{ color: "#475569" }}>
        This document is long enough to span several pages so you can compare
        how each engine handles pagination. The canvas engine rasterises the
        DOM and slices the resulting image; the html engine asks jsPDF to
        paginate the body itself and emits real text.
      </p>

      {Array.from({ length: SECTION_COUNT }).map((_, i) => (
        <section key={i} style={{ marginTop: 28 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              color: "#0f172a",
              borderLeft: "4px solid #0ea5e9",
              paddingLeft: 10,
            }}
          >
            Section {i + 1}: Findings &amp; Trends
          </h2>
          <p style={{ marginTop: 8, color: "#334155" }}>
            Revenue grew by <strong>{12 + i}%</strong> quarter-over-quarter,
            driven primarily by enterprise accounts in the EMEA region. Margins
            remained stable at <strong>{(42 - i * 0.3).toFixed(1)}%</strong>,
            and cash on hand increased to{" "}
            <strong>${(120 + i * 3).toFixed(1)}M</strong>.
          </p>
          <p style={{ marginTop: 8, color: "#334155" }}>
            Try selecting this paragraph inside the generated PDF. The html
            engine produces real text you can highlight, copy, and search with
            Ctrl+F. The canvas engine gives you a pixel-perfect screenshot,
            but the text layer is empty.
          </p>
        </section>
      ))}
    </div>
  );
}

function buildOptions(engine: Engine): Options {
  return {
    filename: `report-${engine}.pdf`,
    engine,
    // method: "build" so we get the jsPDF back without auto-saving. We want
    // to embed it inline first; the button below triggers the explicit save.
    method: "build",
    page: { margin: 12, format: "a4" },
    header: ({ page, pages }) => (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderBottom: "2px solid #0ea5e9",
          fontFamily: "Arial, sans-serif",
          color: "#0ea5e9",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <span>react-to-pdf · engine comparison</span>
        <span style={{ color: "#64748b" }}>
          Page {page} / {pages}
        </span>
      </div>
    ),
    footer: ({ page, pages }) => (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderTop: "1px solid #cbd5e1",
          fontFamily: "Arial, sans-serif",
          color: "#64748b",
          fontSize: 11,
        }}
      >
        <span>Generated {new Date().toLocaleDateString()}</span>
        <span>
          {page} / {pages}
        </span>
      </div>
    ),
    canvas: { resolution: 2, size: "shrink-to-fit" },
    html: { autoPaging: "text" },
  };
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function ResultCard({
  result,
  contrast,
}: {
  result: RunResult;
  contrast?: RunResult | null;
}) {
  const label = result.engine === "canvas" ? "canvas (raster)" : "html (vector text)";
  const selectable =
    result.engine === "html"
      ? "✅ text is selectable, copy-able, searchable"
      : "❌ text layer is empty (it's an image)";
  const delta =
    contrast &&
    `${(((result.sizeBytes - contrast.sizeBytes) / contrast.sizeBytes) * 100).toFixed(
      0
    )}% vs ${contrast.engine}`;

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        overflow: "hidden",
        background: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "10px 16px",
          background:
            result.engine === "html"
              ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
              : "#334155",
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>engine: {label}</span>
        <span style={{ fontSize: 12, opacity: 0.85 }}>
          {result.pages} page{result.pages === 1 ? "" : "s"} ·{" "}
          {(result.elapsedMs / 1000).toFixed(2)}s · {formatBytes(result.sizeBytes)}
          {delta ? ` · ${delta}` : ""}
        </span>
      </div>

      <iframe
        title={`preview-${result.engine}`}
        src={result.blobUrl}
        style={{ width: "100%", height: 500, border: "none", background: "#f1f5f9" }}
      />

      <div
        style={{
          padding: "10px 16px",
          fontSize: 13,
          color: "#334155",
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <p style={{ margin: 0 }}>{selectable}</p>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 12 }}>
          Try selecting text in the preview above, then{" "}
          <a
            href={result.blobUrl}
            download={result.downloadName}
            style={{ color: "#0284c7", fontWeight: 600 }}
          >
            download the file
          </a>{" "}
          and open it in any PDF viewer.
        </p>
      </div>
    </div>
  );
}

export default function EngineComparisonExample() {
  const [busy, setBusy] = useState<Engine | null>(null);
  const [results, setResults] = useState<Record<Engine, RunResult | null>>({
    canvas: null,
    html: null,
  });

  // Shared body ref; both engines capture the same DOM tree.
  const { targetRef, toPDF } = usePDF();

  const run = async (engine: Engine) => {
    setBusy(engine);
    const prevUrl = results[engine]?.blobUrl;
    const t0 = performance.now();
    try {
      const pdf = await toPDF(buildOptions(engine));
      const blobBytes = pdf.output("arraybuffer") as ArrayBuffer;
      const blob = new Blob([blobBytes], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      if (prevUrl) URL.revokeObjectURL(prevUrl);
      setResults((prev) => ({
        ...prev,
        [engine]: {
          engine,
          pages: pdf.getNumberOfPages(),
          elapsedMs: performance.now() - t0,
          sizeBytes: blob.size,
          blobUrl,
          downloadName: `report-${engine}.pdf`,
        },
      }));
    } catch (err) {
      console.error(`[EngineComparison:${engine}] failed`, err);
    } finally {
      setBusy(null);
    }
  };

  const runBoth = async () => {
    await run("canvas");
    await run("html");
  };

  const canvasResult = results.canvas;
  const htmlResult = results.html;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          padding: 16,
          borderRadius: 12,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
        }}
      >
        <button
          onClick={runBoth}
          disabled={busy !== null}
          style={{
            background: busy
              ? "#94a3b8"
              : "linear-gradient(135deg,#0ea5e9,#d946ef)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            cursor: busy ? "wait" : "pointer",
            boxShadow: busy ? "none" : "0 4px 10px rgba(14,165,233,0.25)",
          }}
        >
          {busy
            ? `Running ${busy}…`
            : results.canvas && results.html
              ? "⟳ Regenerate both"
              : "⚡ Generate with both engines"}
        </button>

        <button
          onClick={() => run("canvas")}
          disabled={busy !== null}
          style={{
            border: "1px solid #334155",
            background: "white",
            color: "#334155",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            cursor: busy ? "wait" : "pointer",
          }}
        >
          canvas only
        </button>
        <button
          onClick={() => run("html")}
          disabled={busy !== null}
          style={{
            border: "1px solid #0ea5e9",
            background: "white",
            color: "#0369a1",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 13,
            cursor: busy ? "wait" : "pointer",
          }}
        >
          html only
        </button>

        {(canvasResult || htmlResult) && (
          <span style={{ fontSize: 13, color: "#475569" }}>
            Results appear below. Try selecting text in each preview.
          </span>
        )}
      </div>

      {(canvasResult || htmlResult) && (
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          }}
        >
          {canvasResult && (
            <ResultCard result={canvasResult} contrast={htmlResult ?? null} />
          )}
          {htmlResult && (
            <ResultCard result={htmlResult} contrast={canvasResult ?? null} />
          )}
        </div>
      )}

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        <p
          style={{
            margin: 0,
            padding: "8px 16px",
            fontSize: 12,
            color: "#64748b",
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          ↓ The source document both engines are capturing
        </p>
        <div ref={targetRef}>
          <DocumentBody />
        </div>
      </div>
    </div>
  );
}
