import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface FooterHeaderContext {
  page: number;
  totalPages: number;
}

type FooterHeaderRender = (ctx: FooterHeaderContext) => ReactNode;

interface UsePdfHtmlOptions {
  filename?: string;
  format?: string | number[];
  orientation?: "portrait" | "landscape";
  unit?: "pt" | "mm" | "in" | "px";
  margin?: [number, number, number, number]; // top, right, bottom, left, same unit
  headerHeight?: number; // reserved top area, same unit
  footerHeight?: number; // reserved bottom area, same unit
  header?: FooterHeaderRender;
  footer?: FooterHeaderRender;
  // Rasterization scale for header/footer. doc.html() handles body on its own.
  fragmentScale?: number;
}

function useUsePdfHtml(options: UsePdfHtmlOptions) {
  const bodyRef = useRef<HTMLDivElement>(null);

  const toPDF = async () => {
    const body = bodyRef.current;
    if (!body) {
      throw new Error("bodyRef has no current element");
    }

    const {
      filename = "document.pdf",
      format = "a4",
      orientation = "portrait",
      unit = "pt",
      margin = [40, 40, 40, 40],
      headerHeight = options.header ? 60 : 0,
      footerHeight = options.footer ? 40 : 0,
      header,
      footer,
      fragmentScale = 2,
    } = options;

    const doc = new jsPDF({ unit, format, orientation });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const [mTop, mRight, mBottom, mLeft] = margin;

    const topMargin = mTop + headerHeight;
    const bottomMargin = mBottom + footerHeight;
    const contentWidth = pageWidth - mLeft - mRight;

    // Body: jsPDF's own html() handles auto-pagination
    await new Promise<void>((resolve) => {
      doc.html(body, {
        x: mLeft,
        y: topMargin,
        width: contentWidth,
        windowWidth: body.scrollWidth || 800,
        margin: [topMargin, mRight, bottomMargin, mLeft],
        autoPaging: "text",
        html2canvas: {
          useCORS: true,
          scale: 0.6,
          logging: false,
        },
        callback: () => resolve(),
      });
    });

    // Overlay header + footer per page
    const totalPages = doc.getNumberOfPages();

    if (header || footer) {
      for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);

        if (header) {
          const { dataUrl, width, height } = await renderReactToImage(
            header({ page, totalPages }),
            { targetWidth: contentWidth, scale: fragmentScale }
          );
          const drawWidth = contentWidth;
          const drawHeight = (height / width) * drawWidth;
          doc.addImage(
            dataUrl,
            "PNG",
            mLeft,
            mTop,
            drawWidth,
            Math.min(drawHeight, headerHeight)
          );
        }

        if (footer) {
          const { dataUrl, width, height } = await renderReactToImage(
            footer({ page, totalPages }),
            { targetWidth: contentWidth, scale: fragmentScale }
          );
          const drawWidth = contentWidth;
          const drawHeight = (height / width) * drawWidth;
          doc.addImage(
            dataUrl,
            "PNG",
            mLeft,
            pageHeight - mBottom - Math.min(drawHeight, footerHeight),
            drawWidth,
            Math.min(drawHeight, footerHeight)
          );
        }
      }
    }

    doc.save(filename);
    return doc;
  };

  return { bodyRef, toPDF };
}

/**
 * Mount a React tree to a detached element, paint it, rasterize via
 * html2canvas, then tear it down. Only used for small fragments
 * (headers/footers). The body itself is rendered by jsPDF.html().
 */
async function renderReactToImage(
  node: ReactNode,
  { targetWidth, scale }: { targetWidth: number; scale: number }
): Promise<{ dataUrl: string; width: number; height: number }> {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.top = "-10000px";
  host.style.left = "-10000px";
  // targetWidth is in PDF units; map to pixels roughly via a large pixel width.
  host.style.width = `${Math.max(targetWidth * 2, 600)}px`;
  host.style.background = "transparent";
  document.body.appendChild(host);

  let root: Root | null = null;
  try {
    root = createRoot(host);
    root.render(<>{node}</>);
    // Give React a tick to paint.
    await new Promise((r) => setTimeout(r, 20));
    const canvas = await html2canvas(host, {
      scale,
      backgroundColor: null,
      useCORS: true,
      logging: false,
    });
    return {
      dataUrl: canvas.toDataURL("image/png"),
      width: canvas.width,
      height: canvas.height,
    };
  } finally {
    if (root) root.unmount();
    host.remove();
  }
}

export default function JsPdfHtmlExperiment() {
  const [busy, setBusy] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const { bodyRef, toPDF } = useUsePdfHtml({
    filename: "jspdf-html-experiment.pdf",
    format: "a4",
    unit: "pt",
    margin: [40, 40, 40, 40],
    headerHeight: 50,
    footerHeight: 34,
    header: ({ page, totalPages }) => (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          borderBottom: "2px solid #0ea5e9",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <strong style={{ color: "#0ea5e9", fontSize: 18 }}>
          React to PDF, jsPDF.html() PoC
        </strong>
        <span style={{ color: "#475569", fontSize: 12 }}>
          Page {page} of {totalPages}
        </span>
      </div>
    ),
    footer: ({ page, totalPages }) => (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 0",
          borderTop: "1px solid #cbd5e1",
          color: "#64748b",
          fontSize: 11,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <span>Generated {new Date().toLocaleDateString()} · react-to-pdf</span>
        <span>
          {page} / {totalPages}
        </span>
      </div>
    ),
  });

  const handleDownload = async () => {
    setBusy(true);
    setElapsed(null);
    const t0 = performance.now();
    try {
      await toPDF();
    } finally {
      setBusy(false);
      setElapsed(performance.now() - t0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
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
          {busy ? "Generating…" : "⬇ Download PDF (jsPDF.html method)"}
        </button>

        {elapsed !== null && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Last run: <strong>{(elapsed / 1000).toFixed(2)}s</strong>
          </span>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
          Body (rendered by doc.html, autoPaging: 'text')
        </h3>
        <div
          ref={bodyRef}
          style={{
            background: "white",
            color: "#0f172a",
            padding: 24,
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h1 style={{ margin: 0, color: "#0ea5e9", fontSize: 28 }}>
            A long-form document
          </h1>
          <p style={{ marginTop: 12, color: "#475569", lineHeight: 1.6 }}>
            The body is rendered through <code>doc.html()</code>, which
            paginates automatically and can produce selectable text when
            <code>autoPaging: "text"</code> is set. The header and footer are
            overlaid on every page via a light React-to-image pass so you can
            still use component-based customisation (page numbers, timestamps,
            branding, etc.).
          </p>
          {Array.from({ length: 12 }).map((_, i) => (
            <section key={i} style={{ marginTop: 24 }}>
              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                  fontSize: 18,
                  borderLeft: "4px solid #0ea5e9",
                  paddingLeft: 10,
                }}
              >
                Section {i + 1}
              </h2>
              <p
                style={{
                  marginTop: 8,
                  color: "#334155",
                  lineHeight: 1.6,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed
                nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis
                ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.
                Mauris massa. Vestibulum lacinia arcu eget nulla.
              </p>
              <p
                style={{
                  marginTop: 8,
                  color: "#334155",
                  lineHeight: 1.6,
                }}
              >
                Class aptent taciti sociosqu ad litora torquent per conubia
                nostra, per inceptos himenaeos. Curabitur sodales ligula in
                libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellen­
                tesque nibh. Aenean quam. In scelerisque sem at dolor.
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
