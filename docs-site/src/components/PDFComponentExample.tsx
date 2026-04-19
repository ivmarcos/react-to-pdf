import { useEffect, useRef, useState } from "react";
import type { PDFHandle } from "react-to-pdf";

export default function PDFComponentExample() {
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    import("react-to-pdf")
      .then((mod: any) => setPkg(mod))
      .catch((err) =>
        console.error("[PDFComponentExample] failed to load:", err)
      );
  }, []);

  if (!pkg) return <Skeleton />;

  return <Demo PDF={pkg.PDF} Margin={pkg.Margin} />;
}

function Demo({ PDF, Margin }: { PDF: any; Margin: any }) {
  const pdfRef = useRef<PDFHandle>(null);

  return (
    <div
      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <button
        onClick={() => pdfRef.current?.save("component-example.pdf")}
        style={{
          alignSelf: "flex-start",
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

      <PDF
        ref={pdfRef}
        preview="children"
        page={{ format: "a4", margin: Margin.MEDIUM }}
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
          <h1 style={{ margin: 0, color: "#0ea5e9", fontSize: 26 }}>
            Hello from the PDF component
          </h1>
          <p
            style={{
              marginTop: 10,
              color: "#475569",
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            This block is rendered by <Accent>&lt;PDF&gt;</Accent> with{" "}
            <Accent>preview="children"</Accent>, so you see the same content
            that gets captured into the file. Click{" "}
            <strong>Download PDF</strong> to trigger{" "}
            <Accent>pdfRef.current.save()</Accent>.
          </p>
          <ul style={{ color: "#475569", lineHeight: 1.8, fontSize: 14 }}>
            <li>
              Imperative <Accent>save / open / print / update / getPdf</Accent> via ref.
            </li>
            <li>
              <Accent>preview="children"</Accent> renders inline,{" "}
              <Accent>preview="embed"</Accent> shows an embedded PDF preview.
            </li>
            <li>
              Works with the canvas engine (default) or{" "}
              <Accent>engine: "html"</Accent>.
            </li>
          </ul>
        </div>
      </PDF>
    </div>
  );
}

/**
 * Inline emphasis that reads as "code-ish" without actually using a
 * monospace font. The canvas engine rasterises whatever the browser
 * paints, and switching font-family mid-line produces different glyph
 * metrics / baseline per family — in html2canvas that shows up as the
 * last line of the code bit getting cropped. Keeping the same sans
 * family and just tweaking colour/background avoids that.
 */
function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: "#f1f5f9",
        color: "#0f172a",
        padding: "1px 6px",
        borderRadius: 4,
        fontFamily: "inherit",
        fontWeight: 600,
        fontSize: "0.95em",
      }}
    >
      {children}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 text-sm text-gray-500 dark:text-gray-400">
      Loading example…
    </div>
  );
}
