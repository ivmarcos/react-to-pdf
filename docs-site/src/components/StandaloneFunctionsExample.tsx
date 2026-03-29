import React, { useRef, useState } from "react";
import { save, open, create } from "react-to-pdf";

export default function StandaloneFunctionsExample() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>("");

  const handleSave = async () => {
    if (!contentRef.current) return;
    setStatus("Generating PDF...");
    try {
      await save(() => contentRef.current, {
        filename: "standalone-example.pdf",
        page: { format: "a4", margin: 10 },
      });
      setStatus("PDF downloaded!");
    } catch {
      setStatus("Error generating PDF");
    }
  };

  const handleOpen = async () => {
    if (!contentRef.current) return;
    setStatus("Opening PDF...");
    try {
      await open(() => contentRef.current, {
        page: { format: "a4", margin: 10 },
      });
      setStatus("PDF opened in new tab!");
    } catch {
      setStatus("Error opening PDF");
    }
  };

  const handleCreate = async () => {
    if (!contentRef.current) return;
    setStatus("Creating PDF...");
    try {
      const doc = await create(() => contentRef.current, {
        page: { format: "a4", margin: 10 },
      });
      if (doc) {
        const pages = doc.getNumberOfPages();
        setStatus(
          `PDF created with ${pages} page(s) — use doc.save() or doc.open() to export`
        );
      }
    } catch {
      setStatus("Error creating PDF");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleSave}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          save() — Download PDF
        </button>
        <button
          onClick={handleOpen}
          style={{
            padding: "10px 20px",
            backgroundColor: "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          open() — Preview in Tab
        </button>
        <button
          onClick={handleCreate}
          style={{
            padding: "10px 20px",
            backgroundColor: "#059669",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          create() — Get Document
        </button>
      </div>

      {status && (
        <div
          style={{
            padding: "10px 16px",
            backgroundColor: "#f0f9ff",
            border: "1px solid #bae6fd",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "14px",
            color: "#0369a1",
          }}
        >
          {status}
        </div>
      )}

      <div
        ref={contentRef}
        style={{
          padding: "40px",
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ color: "#0f172a", marginTop: 0 }}>
          Standalone Functions Example
        </h2>
        <p style={{ color: "#64748b", lineHeight: 1.6 }}>
          This content is converted to PDF using the standalone{" "}
          <code>save()</code>, <code>open()</code>, and <code>create()</code>{" "}
          functions — no hooks needed.
        </p>
        <div
          style={{
            padding: "20px",
            backgroundColor: "#f8fafc",
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3 style={{ marginTop: 0, color: "#1e293b" }}>
            When to use standalone functions
          </h3>
          <ul style={{ color: "#475569", lineHeight: 1.8 }}>
            <li>
              <strong>create()</strong> — Get a Document instance for custom
              processing
            </li>
            <li>
              <strong>save()</strong> — Download the PDF directly
            </li>
            <li>
              <strong>open()</strong> — Preview in a new browser tab
            </li>
            <li>
              <strong>print()</strong> — Trigger the browser print dialog
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
