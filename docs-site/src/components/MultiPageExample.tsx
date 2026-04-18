import { useEffect, useRef, useState } from "react";
import type { PDFHandle } from "react-to-pdf";

export default function MultiPageExample() {
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    import("react-to-pdf")
      .then((mod: any) => setPkg(mod))
      .catch((err) =>
        console.error("[MultiPageExample] failed to load:", err)
      );
  }, []);

  if (!pkg) return <Skeleton />;

  return <Demo PDF={pkg.PDF} Margin={pkg.Margin} />;
}

function Demo({ PDF, Margin }: { PDF: any; Margin: any }) {
  const pdfRef = useRef<PDFHandle>(null);

  const header = ({ page, pages }: { page: number; pages: number }) => (
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
      <span>Annual Report 2026</span>
      <span style={{ color: "#64748b" }}>
        Page {page} / {pages}
      </span>
    </div>
  );

  const footer = ({ page, pages }: { page: number; pages: number }) => (
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
      <span>Confidential</span>
      <span>
        {page} of {pages}
      </span>
    </div>
  );

  return (
    <div
      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <button
        onClick={() => pdfRef.current?.save("multi-page-report.pdf")}
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
        ⬇ Download multi-page PDF
      </button>

      <PDF
        ref={pdfRef}
        preview="children"
        page={{
          format: "a4",
          margin: Margin.MEDIUM,
        }}
        header={header}
        footer={footer}
      >
        <div
          style={{
            background: "white",
            color: "#0f172a",
            padding: 32,
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            fontFamily: "Arial, sans-serif",
            maxHeight: 420,
            overflow: "auto",
          }}
        >
          <h1 style={{ margin: 0, color: "#0ea5e9", fontSize: 24 }}>
            Executive summary
          </h1>
          <p style={{ marginTop: 10, color: "#475569", lineHeight: 1.6 }}>
            Revenue this year grew by 23%, driven by enterprise expansion
            across the EMEA region. Net margins improved by 180bps on the back
            of operating leverage and disciplined hiring.
          </p>

          {Array.from({ length: 6 }).map((_, i) => (
            <section key={i} style={{ marginTop: 28 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  borderLeft: "4px solid #0ea5e9",
                  paddingLeft: 10,
                }}
              >
                Section {i + 1}
              </h2>
              <p style={{ marginTop: 8, color: "#334155", lineHeight: 1.6 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                semper metus a dui consequat, eget tempor lectus tincidunt.
                Fusce at mauris sit amet dolor placerat cursus. Nullam ac
                pharetra justo, id pulvinar nunc. The header and footer
                appear on every page. Open the PDF to see <em>Page N / M</em>{" "}
                repeat throughout.
              </p>
            </section>
          ))}
        </div>
      </PDF>
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
