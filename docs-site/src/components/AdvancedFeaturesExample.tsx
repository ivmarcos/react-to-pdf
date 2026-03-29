import React, { useRef, useState } from "react";
import { usePDF, Margin, Resolution, Size } from "react-to-pdf";

type AlignOption = "top-left" | "center-x" | "center-y" | "center-xy";
type SizeOption = "original" | "fill-page" | "shrink-to-fit";
type MethodOption = "save" | "open" | "build";

export default function AdvancedFeaturesExample() {
  const [align, setAlign] = useState<AlignOption>("top-left");
  const [size, setSize] = useState<SizeOption>("original");
  const [method, setMethod] = useState<MethodOption>("save");
  const [margin, setMargin] = useState<number>(Margin.MEDIUM);
  const [resolution, setResolution] = useState<number>(Resolution.MEDIUM);
  const [status, setStatus] = useState("");

  const { targetRef, toPDF } = usePDF({
    filename: "advanced-example.pdf",
    method,
    resolution,
    align,
    size,
    page: {
      format: "a4",
      orientation: "portrait",
      margin,
    },
  });

  const handleGenerate = async () => {
    setStatus("Generating...");
    try {
      const result = await toPDF();
      if (method === "build") {
        setStatus(
          `PDF built — jsPDF instance returned (${result?.getNumberOfPages()} pages)`
        );
      } else if (method === "open") {
        setStatus("PDF opened in new tab");
      } else {
        setStatus("PDF downloaded");
      }
    } catch {
      setStatus("Error generating PDF");
    }
  };

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "white",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "4px",
    display: "block",
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "16px",
          marginBottom: "20px",
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div>
          <label style={labelStyle}>Alignment</label>
          <select
            value={align}
            onChange={(e) => setAlign(e.target.value as AlignOption)}
            style={selectStyle}
          >
            <option value="top-left">Top Left</option>
            <option value="center-x">Center X</option>
            <option value="center-y">Center Y</option>
            <option value="center-xy">Center XY</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Size</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as SizeOption)}
            style={selectStyle}
          >
            <option value="original">Original</option>
            <option value="fill-page">Fill Page</option>
            <option value="shrink-to-fit">Shrink to Fit</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as MethodOption)}
            style={selectStyle}
          >
            <option value="save">Save (download)</option>
            <option value="open">Open (new tab)</option>
            <option value="build">Build (get instance)</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Margin (mm)</label>
          <select
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            style={selectStyle}
          >
            <option value={Margin.NONE}>None (0)</option>
            <option value={Margin.SMALL}>Small (5)</option>
            <option value={Margin.MEDIUM}>Medium (10)</option>
            <option value={Margin.LARGE}>Large (25)</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(Number(e.target.value))}
            style={selectStyle}
          >
            <option value={Resolution.LOW}>Low (1x)</option>
            <option value={Resolution.NORMAL}>Normal (2x)</option>
            <option value={Resolution.MEDIUM}>Medium (3x)</option>
            <option value={Resolution.HIGH}>High (7x)</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={handleGenerate}
          style={{
            padding: "10px 24px",
            backgroundColor: "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "15px",
          }}
        >
          Generate PDF
        </button>
        {status && (
          <span style={{ fontSize: "14px", color: "#64748b" }}>{status}</span>
        )}
      </div>

      <div
        ref={targetRef}
        style={{
          padding: "40px",
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ color: "#0f172a", marginTop: 0 }}>
          Advanced Features Demo
        </h2>
        <p style={{ color: "#64748b", lineHeight: 1.6 }}>
          Use the controls above to experiment with alignment, size, method,
          margin, and resolution options. The PDF output will reflect your
          selections.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "#eff6ff",
              borderRadius: "8px",
              border: "1px solid #bfdbfe",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#1e40af" }}>
              Alignment: {align}
            </h3>
            <p style={{ color: "#3b82f6", fontSize: "14px", margin: 0 }}>
              Controls how content is positioned on the page.
            </p>
          </div>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f0fdf4",
              borderRadius: "8px",
              border: "1px solid #bbf7d0",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#166534" }}>Size: {size}</h3>
            <p style={{ color: "#16a34a", fontSize: "14px", margin: 0 }}>
              Controls how content is scaled to fit the page.
            </p>
          </div>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fdf4ff",
              borderRadius: "8px",
              border: "1px solid #e9d5ff",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#7e22ce" }}>Method: {method}</h3>
            <p style={{ color: "#a855f7", fontSize: "14px", margin: 0 }}>
              Controls how the generated PDF is delivered.
            </p>
          </div>
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fff7ed",
              borderRadius: "8px",
              border: "1px solid #fed7aa",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#9a3412" }}>
              Margin: {margin}mm / Resolution: {resolution}x
            </h3>
            <p style={{ color: "#ea580c", fontSize: "14px", margin: 0 }}>
              Higher resolution = better quality but larger file size.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
