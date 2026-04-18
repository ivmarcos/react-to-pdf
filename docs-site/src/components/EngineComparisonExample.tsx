import { useState } from "react";
import { usePDF } from "react-to-pdf";
import type { Options } from "react-to-pdf";

type Engine = "canvas" | "html";

const SECTION_COUNT = 10;

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
        how each engine handles pagination. The canvas engine rasterises the DOM
        and slices the resulting image; the html engine asks jsPDF to paginate
        the body itself and emits real text.
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
            <code> Ctrl+F</code>. The canvas engine gives you a pixel-perfect
            screenshot, but the text layer is empty.
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
    canvas: { resolution: 2 },
    html: { autoPaging: "text" },
  };
}

export default function EngineComparisonExample() {
  const [engine, setEngine] = useState<Engine>("canvas");
  const [busy, setBusy] = useState(false);
  const [lastResult, setLastResult] = useState<{
    engine: Engine;
    elapsed: number;
    pages: number;
  } | null>(null);

  // One hook for the shared targetRef. Options are passed at call time so the
  // engine toggle applies immediately without re-mounting the document.
  const { targetRef, toPDF } = usePDF();

  const handleDownload = async () => {
    setBusy(true);
    const t0 = performance.now();
    try {
      const pdf = await toPDF(buildOptions(engine));
      const pages = pdf.getNumberOfPages();
      setLastResult({ engine, elapsed: performance.now() - t0, pages });
    } catch (err) {
      console.error("[EngineComparison] generation failed:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
          padding: 16,
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          background: "#f8fafc",
          marginBottom: 20,
        }}
      >
        <label style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
          Engine
          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value as Engine)}
            disabled={busy}
            style={{
              marginLeft: 8,
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              fontSize: 14,
            }}
          >
            <option value="canvas">canvas (default, raster)</option>
            <option value="html">html (vectorised text)</option>
          </select>
        </label>

        <button
          onClick={handleDownload}
          disabled={busy}
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
          {busy ? "Generating…" : "⬇ Download PDF"}
        </button>

        {lastResult && (
          <span style={{ fontSize: 13, color: "#475569" }}>
            Last run: <strong>{lastResult.engine}</strong> engine generated{" "}
            <strong>{lastResult.pages}</strong> page
            {lastResult.pages === 1 ? "" : "s"} in{" "}
            <strong>{(lastResult.elapsed / 1000).toFixed(2)}s</strong>.
          </span>
        )}
      </div>

      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        <div ref={targetRef}>
          <DocumentBody />
        </div>
      </div>
    </div>
  );
}
