import { useEffect, useRef, useState } from "react";
import type { PDFHandle } from "react-to-pdf";

type Mode = "embed" | "children";

export default function PreviewModeExample() {
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    import("react-to-pdf")
      .then((mod: any) => setPkg(mod))
      .catch((err) =>
        console.error("[PreviewModeExample] failed to load:", err)
      );
  }, []);

  if (!pkg) return <Skeleton />;

  return <Demo PDF={pkg.PDF} Margin={pkg.Margin} />;
}

function Demo({ PDF, Margin }: { PDF: any; Margin: any }) {
  const [mode, setMode] = useState<Mode>("embed");
  const pdfRef = useRef<PDFHandle>(null);

  return (
    <div
      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          role="tablist"
          style={{
            display: "inline-flex",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <ModeButton
            active={mode === "embed"}
            onClick={() => setMode("embed")}
          >
            preview="embed"
          </ModeButton>
          <ModeButton
            active={mode === "children"}
            onClick={() => setMode("children")}
          >
            preview="children"
          </ModeButton>
        </div>

        <button
          onClick={() => pdfRef.current?.save("preview-example.pdf")}
          style={{
            background: "linear-gradient(135deg,#0ea5e9,#d946ef)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(14,165,233,0.25)",
          }}
        >
          ⬇ Download PDF
        </button>

        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "#475569",
            maxWidth: 420,
          }}
        >
          {mode === "embed"
            ? "The PDF is rendered inside an <embed> — this is the actual generated file, updated after each build."
            : "The children render inline on the page. What you see is the captured HTML, not the PDF."}
        </p>
      </div>

      {/* Key remounts PDF when the mode flips so it picks up the new preview prop. */}
      <PDF
        key={mode}
        ref={pdfRef}
        preview={mode}
        page={{ format: "a4", margin: Margin.MEDIUM }}
        embedProps={{ width: "100%", height: 480 }}
        loading={<LoadingEmbed />}
      >
        <div
          style={{
            background: "white",
            color: "#0f172a",
            padding: 32,
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h1 style={{ margin: 0, color: "#0ea5e9", fontSize: 24 }}>
            Preview-mode demo
          </h1>
          <p style={{ marginTop: 10, color: "#475569", lineHeight: 1.6 }}>
            Flip the tabs above to compare the two ways <InlineCode>&lt;PDF&gt;</InlineCode>
            {" "}can show its content while the file is being built.
          </p>
          <ul style={{ color: "#475569", lineHeight: 1.8 }}>
            <li>
              <InlineCode>preview="embed"</InlineCode> — the actual generated
              PDF is displayed via <InlineCode>&lt;embed&gt;</InlineCode>. It
              re-embeds on every build, so users can scroll pages, zoom, and
              print from here.
            </li>
            <li>
              <InlineCode>preview="children"</InlineCode> — the React children
              render normally on the page. Good when you want the user to see
              the content before they download.
            </li>
          </ul>

          <p style={{ marginTop: 18, color: "#475569" }}>
            The usage below renders identically whether you're looking at it
            on the page or inside the embedded PDF:
          </p>
          <HighlightedSnippet />
        </div>
      </PDF>
    </div>
  );
}

/**
 * Hand-tokenised snippet so the code reads the same whether it's rendered
 * on the page or captured into the PDF via html2canvas. Inline styles
 * only, to avoid depending on the docs' prose / Shiki output (which lives
 * outside the offscreen portal the PDF captures from).
 */
function HighlightedSnippet() {
  const KW = "#d946ef"; // keywords
  const STR = "#16a34a"; // strings
  const COM = "#94a3b8"; // comments
  const TYP = "#f59e0b"; // jsx tag names

  const span = (color: string, children: React.ReactNode) => (
    <span style={{ color }}>{children}</span>
  );

  return (
    <pre
      style={{
        marginTop: 6,
        background: "#0b1220",
        color: "#e2e8f0",
        padding: "14px 16px",
        borderRadius: 8,
        fontFamily:
          "Fira Code, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        fontSize: 12,
        lineHeight: 1.55,
        overflow: "hidden",
        whiteSpace: "pre",
      }}
    >
      {span(KW, "import")} {"{"} useRef {"}"} {span(KW, "from")} {span(STR, '"react"')};{"\n"}
      {span(KW, "import")} {"{"} PDF, Margin, PDFHandle {"}"} {span(KW, "from")} {span(STR, '"react-to-pdf"')};{"\n"}
      {"\n"}
      {span(KW, "function")} {span(TYP, "PreviewDemo")}() {"{"}{"\n"}
      {"  "}{span(KW, "const")} pdfRef = useRef{"<"}PDFHandle{">"}({span(KW, "null")});{"\n"}
      {"  "}{span(KW, "return")} ({"\n"}
      {"    "}{span(TYP, "<PDF")}{"\n"}
      {"      "}ref={"{"}pdfRef{"}"}{"\n"}
      {"      "}preview={span(STR, '"embed"')}  {span(COM, '// live inline preview')}{"\n"}
      {"      "}page={"{"}{"{"} format: {span(STR, '"a4"')}, margin: Margin.MEDIUM {"}"}{"}"}{"\n"}
      {"    "}{span(TYP, ">")}{"\n"}
      {"      "}{span(TYP, "<article>")}Hello PDF!{span(TYP, "</article>")}{"\n"}
      {"    "}{span(TYP, "</PDF>")}{"\n"}
      {"  "});{"\n"}
      {"}"}
    </pre>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  // Explicit inline styles so the code looks the same whether the children
  // render inline (inside the docs' .prose wrapper) or offscreen via the
  // <PDF> portal (which is outside .prose, so the typography plugin's dark
  // code background would otherwise leak through).
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

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        background: active ? "#0ea5e9" : "white",
        color: active ? "white" : "#0f172a",
        border: "none",
        padding: "8px 14px",
        fontSize: 13,
        fontWeight: 600,
        cursor: active ? "default" : "pointer",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      {children}
    </button>
  );
}

function LoadingEmbed() {
  return (
    <div
      style={{
        height: 480,
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
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 text-sm text-gray-500 dark:text-gray-400">
      Loading example…
    </div>
  );
}
