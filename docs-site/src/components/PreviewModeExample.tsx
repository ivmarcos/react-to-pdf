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
            Flip the tabs above to compare the two ways <code>&lt;PDF&gt;</code>
            {" "}can show its content while the file is being built.
          </p>
          <ul style={{ color: "#475569", lineHeight: 1.8 }}>
            <li>
              <code>preview="embed"</code> — the actual generated PDF is
              displayed via <code>&lt;embed&gt;</code>. It re-embeds on every
              build, so users can scroll pages, zoom, and print from here.
            </li>
            <li>
              <code>preview="children"</code> — the React children render
              normally on the page. Good when you want the user to see the
              content before they download.
            </li>
          </ul>
        </div>
      </PDF>
    </div>
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
