import { useEffect, useState } from "react";

export default function PDFComponentExample() {
  const [mounted, setMounted] = useState(false);
  const [PDF, setPDF] = useState<any>(null);

  useEffect(() => {
    // Only import and initialize on client side
    import("react-to-pdf")
      .then((module) => {
        const pkg = module as any;
        setPDF(() => pkg.PDF || pkg.default?.PDF);
        setMounted(true);
      })
      .catch((error) => {
        console.error(
          "[PDFComponentExample] Failed to load react-to-pdf:",
          error
        );
      });
  }, []);

  if (!mounted || !PDF) {
    return (
      <div
        style={{
          padding: "30px",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          marginTop: "30px",
          marginBottom: "30px",
          textAlign: "center",
          color: "#64748b",
        }}
      >
        Loading example...
      </div>
    );
  }

  return <PDFContent PDF={PDF} />;
}

function PDFContent({ PDF }: { PDF: any }) {
  return (
    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
      <PDF
        filename="simple-document.pdf"
        page={{
          format: "a4",
          orientation: "portrait",
          margin: 15,
        }}
        canvas={{
          scale: 2,
        }}
      >
        {({ targetRef, toPDF }: any) => (
          <div>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <button
                onClick={toPDF}
                style={{
                  padding: "12px 32px",
                  backgroundColor: "#0ea5e9",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                  boxShadow: "0 4px 6px rgba(14, 165, 233, 0.3)",
                }}
              >
                📥 Download PDF (Using PDF Component)
              </button>
            </div>

            <div
              ref={targetRef}
              style={{
                backgroundColor: "white",
                padding: "40px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontFamily: "Arial, sans-serif",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h1
                style={{
                  margin: "0 0 10px 0",
                  color: "#0f172a",
                  fontSize: "28px",
                  fontWeight: "700",
                  borderBottom: "3px solid #0ea5e9",
                  paddingBottom: "15px",
                }}
              >
                Using the PDF Component
              </h1>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "14px",
                  marginTop: "5px",
                  marginBottom: "30px",
                }}
              >
                A declarative approach to PDF generation
              </p>

              <h2
                style={{
                  color: "#0f172a",
                  fontSize: "20px",
                  fontWeight: "600",
                  marginTop: "30px",
                  marginBottom: "15px",
                }}
              >
                What is the PDF Component?
              </h2>

              <p
                style={{
                  color: "#475569",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                }}
              >
                The PDF component provides a declarative API for generating
                PDFs. Instead of using hooks, you can wrap your content with the
                PDF component and access the generation functionality through a
                render prop.
              </p>

              <h2
                style={{
                  color: "#0f172a",
                  fontSize: "20px",
                  fontWeight: "600",
                  marginTop: "30px",
                  marginBottom: "15px",
                }}
              >
                Key Benefits
              </h2>

              <ul
                style={{
                  color: "#475569",
                  lineHeight: "1.8",
                  marginBottom: "20px",
                  paddingLeft: "20px",
                }}
              >
                <li>
                  <strong>Declarative API:</strong> More intuitive for React
                  developers
                </li>
                <li>
                  <strong>Render Props Pattern:</strong> Flexible and composable
                </li>
                <li>
                  <strong>Same Options:</strong> All usePDF options are
                  available
                </li>
                <li>
                  <strong>Better Encapsulation:</strong> PDF logic stays with
                  the component
                </li>
              </ul>

              <h2
                style={{
                  color: "#0f172a",
                  fontSize: "20px",
                  fontWeight: "600",
                  marginTop: "30px",
                  marginBottom: "15px",
                }}
              >
                Configuration Options
              </h2>

              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "30px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f1f5f9" }}>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#0f172a",
                        borderBottom: "2px solid #cbd5e1",
                      }}
                    >
                      Option
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#0f172a",
                        borderBottom: "2px solid #cbd5e1",
                      }}
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e2e8f0",
                        color: "#475569",
                        fontFamily: "monospace",
                        fontSize: "13px",
                      }}
                    >
                      filename
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e2e8f0",
                        color: "#475569",
                        fontSize: "14px",
                      }}
                    >
                      Name of the generated PDF file
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e2e8f0",
                        color: "#475569",
                        fontFamily: "monospace",
                        fontSize: "13px",
                      }}
                    >
                      page
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e2e8f0",
                        color: "#475569",
                        fontSize: "14px",
                      }}
                    >
                      Page configuration (format, orientation, margins)
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e2e8f0",
                        color: "#475569",
                        fontFamily: "monospace",
                        fontSize: "13px",
                      }}
                    >
                      canvas
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e2e8f0",
                        color: "#475569",
                        fontSize: "14px",
                      }}
                    >
                      Canvas rendering options (scale, useCORS)
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e2e8f0",
                        color: "#475569",
                        fontFamily: "monospace",
                        fontSize: "13px",
                      }}
                    >
                      method
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e2e8f0",
                        color: "#475569",
                        fontSize: "14px",
                      }}
                    >
                      Output method: 'save', 'open', or 'build'
                    </td>
                  </tr>
                </tbody>
              </table>

              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "8px",
                  marginTop: "30px",
                }}
              >
                <p
                  style={{
                    margin: "0",
                    color: "#1e40af",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  <strong>💡 Tip:</strong> The PDF component is perfect for
                  creating reusable PDF templates. You can extract common
                  configurations into a wrapper component and reuse it across
                  your application.
                </p>
              </div>
            </div>
          </div>
        )}
      </PDF>
    </div>
  );
}
