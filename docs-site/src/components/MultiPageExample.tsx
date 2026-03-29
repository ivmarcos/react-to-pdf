import { useEffect, useState } from "react";

export default function MultiPageExample() {
  const [mounted, setMounted] = useState(false);
  const [PDF, setPDF] = useState<any>(null);
  const [Header, setHeader] = useState<any>(null);
  const [Body, setBody] = useState<any>(null);
  const [Footer, setFooter] = useState<any>(null);

  useEffect(() => {
    // Only import and initialize on client side
    import("react-to-pdf")
      .then((module) => {
        const pkg = module as any;
        setPDF(() => pkg.PDF || pkg.default?.PDF);
        setHeader(() => pkg.Header || pkg.default?.Header);
        setBody(() => pkg.Body || pkg.default?.Body);
        setFooter(() => pkg.Footer || pkg.default?.Footer);
        setMounted(true);
      })
      .catch((error) => {
        console.error("[MultiPageExample] Failed to load react-to-pdf:", error);
      });
  }, []);

  if (!mounted || !PDF || !Header || !Body || !Footer) {
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

  return (
    <MultiPageContent PDF={PDF} Header={Header} Body={Body} Footer={Footer} />
  );
}

function MultiPageContent({
  PDF,
  Header,
  Body,
  Footer,
}: {
  PDF: any;
  Header: any;
  Body: any;
  Footer: any;
}) {
  return (
    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
      <PDF
        filename="multi-page-report.pdf"
        page={{
          format: "a4",
          margin: { top: 20, right: 15, bottom: 20, left: 15 },
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
                📥 Download Multi-Page PDF
              </button>
            </div>

            <div
              ref={targetRef}
              style={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                fontFamily: "Arial, sans-serif",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              {/* Header - appears on every page */}
              <Header>
                <div
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8fafc",
                    borderBottom: "3px solid #0ea5e9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        margin: "0",
                        fontSize: "24px",
                        color: "#0f172a",
                      }}
                    >
                      Annual Report 2024
                    </h1>
                    <p
                      style={{
                        margin: "5px 0 0",
                        fontSize: "14px",
                        color: "#64748b",
                      }}
                    >
                      Company Financial Overview
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      textAlign: "right",
                    }}
                  >
                    <p style={{ margin: "0" }}>
                      Generated: {new Date().toLocaleDateString()}
                    </p>
                    <p style={{ margin: "5px 0 0" }}>Status: Confidential</p>
                  </div>
                </div>
              </Header>

              {/* Body - main content */}
              <Body>
                <div style={{ padding: "40px 30px" }}>
                  {/* Page 1 Content */}
                  <h2
                    style={{
                      color: "#0f172a",
                      fontSize: "20px",
                      marginTop: "0",
                    }}
                  >
                    Executive Summary
                  </h2>
                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6",
                      marginBottom: "20px",
                    }}
                  >
                    This comprehensive report provides a detailed analysis of
                    our company's performance throughout the fiscal year 2024.
                    We have achieved significant milestones across all
                    departments and exceeded our initial revenue targets by 23%.
                  </p>

                  <h2
                    style={{
                      color: "#0f172a",
                      fontSize: "20px",
                      marginTop: "30px",
                    }}
                  >
                    Financial Highlights
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "15px",
                      marginBottom: "30px",
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
                      <p
                        style={{
                          margin: "0 0 5px",
                          fontSize: "13px",
                          color: "#64748b",
                          textTransform: "uppercase",
                        }}
                      >
                        Total Revenue
                      </p>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "28px",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        $8.5M
                      </p>
                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: "12px",
                          color: "#10b981",
                        }}
                      >
                        ↑ 23% from 2023
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
                      <p
                        style={{
                          margin: "0 0 5px",
                          fontSize: "13px",
                          color: "#64748b",
                          textTransform: "uppercase",
                        }}
                      >
                        Net Profit
                      </p>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "28px",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        $2.1M
                      </p>
                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: "12px",
                          color: "#10b981",
                        }}
                      >
                        ↑ 18% from 2023
                      </p>
                    </div>

                    <div
                      style={{
                        padding: "20px",
                        backgroundColor: "#fef3c7",
                        borderRadius: "8px",
                        border: "1px solid #fde047",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 5px",
                          fontSize: "13px",
                          color: "#64748b",
                          textTransform: "uppercase",
                        }}
                      >
                        Active Customers
                      </p>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "28px",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        12,450
                      </p>
                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: "12px",
                          color: "#10b981",
                        }}
                      >
                        ↑ 31% from 2023
                      </p>
                    </div>

                    <div
                      style={{
                        padding: "20px",
                        backgroundColor: "#f5f3ff",
                        borderRadius: "8px",
                        border: "1px solid #ddd6fe",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 5px",
                          fontSize: "13px",
                          color: "#64748b",
                          textTransform: "uppercase",
                        }}
                      >
                        Team Growth
                      </p>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "28px",
                          fontWeight: "700",
                          color: "#0f172a",
                        }}
                      >
                        145
                      </p>
                      <p
                        style={{
                          margin: "5px 0 0",
                          fontSize: "12px",
                          color: "#10b981",
                        }}
                      >
                        ↑ 28 new hires
                      </p>
                    </div>
                  </div>

                  {/* Simulate page break with lots of content */}
                  <h2
                    style={{
                      color: "#0f172a",
                      fontSize: "20px",
                      marginTop: "40px",
                    }}
                  >
                    Quarterly Performance
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
                          Quarter
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#0f172a",
                            borderBottom: "2px solid #cbd5e1",
                          }}
                        >
                          Revenue
                        </th>
                        <th
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#0f172a",
                            borderBottom: "2px solid #cbd5e1",
                          }}
                        >
                          Growth
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
                          }}
                        >
                          Q1 2024
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#475569",
                            textAlign: "right",
                            fontWeight: "600",
                          }}
                        >
                          $1.9M
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#10b981",
                            textAlign: "right",
                          }}
                        >
                          +15%
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#475569",
                          }}
                        >
                          Q2 2024
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#475569",
                            textAlign: "right",
                            fontWeight: "600",
                          }}
                        >
                          $2.1M
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#10b981",
                            textAlign: "right",
                          }}
                        >
                          +21%
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#475569",
                          }}
                        >
                          Q3 2024
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#475569",
                            textAlign: "right",
                            fontWeight: "600",
                          }}
                        >
                          $2.3M
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#10b981",
                            textAlign: "right",
                          }}
                        >
                          +28%
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#475569",
                          }}
                        >
                          Q4 2024
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#475569",
                            textAlign: "right",
                            fontWeight: "600",
                          }}
                        >
                          $2.2M
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #e2e8f0",
                            color: "#10b981",
                            textAlign: "right",
                          }}
                        >
                          +26%
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <h2
                    style={{
                      color: "#0f172a",
                      fontSize: "20px",
                      marginTop: "40px",
                    }}
                  >
                    Department Overview
                  </h2>
                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6",
                      marginBottom: "20px",
                    }}
                  >
                    Each department has contributed significantly to our overall
                    success. Here's a breakdown of key achievements across the
                    organization:
                  </p>

                  <h3
                    style={{
                      color: "#0ea5e9",
                      fontSize: "16px",
                      marginTop: "25px",
                    }}
                  >
                    Engineering
                  </h3>
                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6",
                      marginBottom: "15px",
                    }}
                  >
                    The engineering team successfully delivered 12 major product
                    releases, reduced technical debt by 35%, and improved system
                    uptime to 99.98%. Key initiatives included migrating to
                    microservices architecture and implementing automated
                    testing across all repositories.
                  </p>

                  <h3
                    style={{
                      color: "#0ea5e9",
                      fontSize: "16px",
                      marginTop: "25px",
                    }}
                  >
                    Sales & Marketing
                  </h3>
                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6",
                      marginBottom: "15px",
                    }}
                  >
                    Our sales and marketing efforts resulted in a 45% increase
                    in qualified leads and a 31% growth in customer acquisition.
                    The team launched successful campaigns across digital
                    channels and expanded our presence in three new markets.
                  </p>

                  <h3
                    style={{
                      color: "#0ea5e9",
                      fontSize: "16px",
                      marginTop: "25px",
                    }}
                  >
                    Customer Success
                  </h3>
                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6",
                      marginBottom: "15px",
                    }}
                  >
                    Customer satisfaction scores reached an all-time high of
                    4.8/5.0. The team reduced average response time by 40% and
                    increased customer retention rate to 94%. We also
                    implemented a new customer onboarding program that reduced
                    time-to-value by 50%.
                  </p>

                  <h2
                    style={{
                      color: "#0f172a",
                      fontSize: "20px",
                      marginTop: "40px",
                    }}
                  >
                    Future Outlook
                  </h2>
                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6",
                      marginBottom: "15px",
                    }}
                  >
                    Looking ahead to 2025, we are well-positioned for continued
                    growth. Our strategic initiatives focus on product
                    innovation, market expansion, and operational excellence. We
                    project a 30% revenue increase and plan to expand our team
                    by 35%.
                  </p>
                  <p
                    style={{
                      color: "#475569",
                      lineHeight: "1.6",
                      marginBottom: "30px",
                    }}
                  >
                    With our strong foundation, talented team, and clear vision,
                    we are confident in our ability to achieve these ambitious
                    goals and create lasting value for our stakeholders.
                  </p>
                </div>
              </Body>

              {/* Footer - appears on every page */}
              <Footer>
                <div
                  style={{
                    padding: "15px 20px",
                    backgroundColor: "#f8fafc",
                    borderTop: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  <span>© 2024 Your Company. All rights reserved.</span>
                  <span>Confidential - Internal Use Only</span>
                </div>
              </Footer>
            </div>
          </div>
        )}
      </PDF>
    </div>
  );
}
