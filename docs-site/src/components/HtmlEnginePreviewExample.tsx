import { useEffect, useRef, useState } from "react";
import type { PDFHandle } from "react-to-pdf";

export default function HtmlEnginePreviewExample() {
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    import("react-to-pdf")
      .then((mod: any) => setPkg(mod))
      .catch((err) =>
        console.error("[HtmlEnginePreviewExample] failed to load:", err)
      );
  }, []);

  if (!pkg) return <Skeleton />;

  return <Demo PDF={pkg.PDF} Margin={pkg.Margin} />;
}

function Demo({ PDF, Margin }: { PDF: any; Margin: any }) {
  const pdfRef = useRef<PDFHandle>(null);

  return (
    <div
      style={{
        position: "relative",
        padding: 2,
        borderRadius: 20,
        background: "linear-gradient(135deg,#0ea5e9,#d946ef)",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg,#0ea5e9,#d946ef)",
              color: "white",
              fontWeight: 700,
              fontSize: 11,
              padding: "3px 10px",
              borderRadius: 999,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            New
          </span>
          <strong style={{ color: "#0f172a", fontSize: 16 }}>
            Vector body text + live inline preview
          </strong>
          <button
            onClick={() =>
              pdfRef.current?.save("vector-preview-landing.pdf")
            }
            style={{
              marginLeft: "auto",
              background: "linear-gradient(135deg,#0ea5e9,#d946ef)",
              color: "white",
              border: "none",
              padding: "9px 18px",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(14,165,233,0.25)",
            }}
          >
            ⬇ Download PDF
          </button>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          The embed below is the actual generated PDF, rendered through the
          new <Code>engine: "html"</Code> path so every paragraph is real,
          selectable text. Try <Code>Ctrl+F</Code> inside the preview.
        </p>

        <PDF
          ref={pdfRef}
          engine="html"
          preview="embed"
          page={{ format: "a4", margin: Margin.MEDIUM }}
          html={{ autoPaging: "text" }}
          embedProps={{ width: "100%", height: 520 }}
          loading={<LoadingEmbed />}
        >
          <div
            style={{
              background: "white",
              color: "#0f172a",
              padding: 28,
              fontFamily: "Arial, sans-serif",
              lineHeight: 1.55,
            }}
          >
            <h1 style={{ margin: 0, color: "#0ea5e9", fontSize: 22 }}>
              Searchable by default
            </h1>
            <p style={{ marginTop: 10, color: "#475569" }}>
              React to PDF now ships two rendering engines. The html engine
              walks the DOM and emits real PDF text operators, so the output
              is a vector file you can select, copy, and search with a
              regular PDF viewer.
            </p>

            <h2
              style={{
                marginTop: 22,
                fontSize: 16,
                borderLeft: "4px solid #0ea5e9",
                paddingLeft: 10,
              }}
            >
              How it differs from the canvas engine
            </h2>
            <ul
              style={{
                marginTop: 6,
                color: "#334155",
                paddingLeft: 20,
                lineHeight: 1.7,
              }}
            >
              <li>
                Text is vectorised, not screenshotted: select this sentence
                right now in the preview.
              </li>
              <li>
                File sizes shrink ~50% on text-heavy documents.
              </li>
              <li>
                Screen readers and full-text indexers can read the body.
              </li>
            </ul>

            <MiniSnippet />

            <p style={{ marginTop: 16, color: "#64748b", fontSize: 12 }}>
              Visit the Rendering Engines docs for the full feature matrix.
            </p>
          </div>
        </PDF>
      </div>
    </div>
  );
}

function MiniSnippet() {
  const KW = "#d946ef";
  const STR = "#16a34a";
  const COM = "#94a3b8";
  const TYP = "#f59e0b";
  const span = (c: string, n: React.ReactNode) => (
    <span style={{ color: c }}>{n}</span>
  );
  return (
    <pre
      style={{
        marginTop: 18,
        background: "#0b1220",
        color: "#e2e8f0",
        padding: "14px 16px",
        borderRadius: 8,
        fontFamily:
          "Fira Code, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        fontSize: 12,
        lineHeight: 1.55,
        whiteSpace: "pre",
      }}
    >
      {span(KW, "const")} {"{"} targetRef, toPDF {"}"} = usePDF({"{"}
      {"\n"}
      {"  "}engine: {span(STR, '"html"')},           {span(COM, "// vector")}
      {"\n"}
      {"  "}html: {"{"} autoPaging: {span(STR, '"text"')} {"}"},
      {"\n"}
      {"}"});
      {"\n"}
      {"\n"}
      {span(KW, "return")} {span(TYP, "<PDF")} preview={span(STR, '"embed"')} engine={span(STR, '"html"')} {span(TYP, "/>")};
    </pre>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      style={{
        background: "#f1f5f9",
        color: "#0f172a",
        padding: "2px 6px",
        borderRadius: 4,
        fontFamily:
          "Fira Code, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        fontSize: "0.9em",
      }}
    >
      {children}
    </code>
  );
}

function LoadingEmbed() {
  return (
    <div
      style={{
        height: 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#64748b",
        background: "#f1f5f9",
        borderRadius: 8,
        border: "1px dashed #cbd5e1",
        fontSize: 14,
      }}
    >
      Building the PDF…
    </div>
  );
}

function Skeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 text-sm text-gray-500 dark:text-gray-400">
      Loading example…
    </div>
  );
}
