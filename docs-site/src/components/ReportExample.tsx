import { useEffect, useState } from 'react';

export default function ReportExample() {
  const [mounted, setMounted] = useState(false);
  const [usePDF, setUsePDF] = useState<any>(null);

  useEffect(() => {
    // Only import and initialize on client side
    import('react-to-pdf').then((module) => {
      const pkg = module as any;
      const usePDFFunc = pkg.usePDF || pkg.default?.usePDF;
      setUsePDF(() => usePDFFunc);
      setMounted(true);
    }).catch((error) => {
      console.error('[ReportExample] Failed to load react-to-pdf:', error);
    });
  }, []);

  if (!mounted || !usePDF) {
    return (
      <div style={{
        padding: '30px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        marginTop: '30px',
        marginBottom: '30px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        Loading example...
      </div>
    );
  }

  return <ReportContent usePDF={usePDF} />;
}

function ReportContent({ usePDF }: { usePDF: any }) {
  const { targetRef, toPDF } = usePDF({
    filename: 'sales-report.pdf',
    page: {
      format: 'a4',
      margin: 10
    }
  });

  const reportData = {
    title: 'Q1 2024 Sales Report',
    date: 'March 31, 2024',
    period: 'January 1 - March 31, 2024',
    summary: {
      totalRevenue: 485000,
      totalOrders: 1247,
      avgOrderValue: 389,
      growth: 23.5
    },
    salesByCategory: [
      { category: 'Electronics', sales: 185000, orders: 412, percentage: 38 },
      { category: 'Clothing', sales: 142000, orders: 521, percentage: 29 },
      { category: 'Home & Garden', sales: 98000, orders: 198, percentage: 20 },
      { category: 'Sports', sales: 60000, orders: 116, percentage: 13 }
    ],
    topProducts: [
      { name: 'Wireless Headphones Pro', sales: 45000, units: 300 },
      { name: 'Smart Watch Series 5', sales: 38000, units: 190 },
      { name: 'Premium Laptop Bag', sales: 28000, units: 400 }
    ]
  };

  return (
    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={() => toPDF()}
          style={{
            padding: '12px 32px',
            backgroundColor: '#0ea5e9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(14, 165, 233, 0.3)'
          }}
        >
          📥 Download Report PDF
        </button>
      </div>

      <div ref={targetRef} style={{
        backgroundColor: 'white',
        padding: '40px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          borderBottom: '3px solid #0ea5e9',
          paddingBottom: '20px',
          marginBottom: '30px'
        }}>
          <h1 style={{
            margin: '0 0 10px 0',
            color: '#0f172a',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            {reportData.title}
          </h1>
          <p style={{
            margin: '5px 0',
            color: '#64748b',
            fontSize: '14px'
          }}>
            Report Period: {reportData.period}
          </p>
          <p style={{
            margin: '5px 0',
            color: '#64748b',
            fontSize: '14px'
          }}>
            Generated: {reportData.date}
          </p>
        </div>

        {/* Summary cards */}
        <h2 style={{
          margin: '0 0 15px 0',
          color: '#0f172a',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          Executive Summary
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px'
          }}>
            <p style={{
              margin: '0 0 5px 0',
              color: '#64748b',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Revenue
            </p>
            <p style={{
              margin: '0',
              color: '#0f172a',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              ${reportData.summary.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px'
          }}>
            <p style={{
              margin: '0 0 5px 0',
              color: '#64748b',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Orders
            </p>
            <p style={{
              margin: '0',
              color: '#0f172a',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              {reportData.summary.totalOrders.toLocaleString()}
            </p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#fef3c7',
            border: '1px solid #fde047',
            borderRadius: '8px'
          }}>
            <p style={{
              margin: '0 0 5px 0',
              color: '#64748b',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Avg Order Value
            </p>
            <p style={{
              margin: '0',
              color: '#0f172a',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              ${reportData.summary.avgOrderValue}
            </p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#f5f3ff',
            border: '1px solid #ddd6fe',
            borderRadius: '8px'
          }}>
            <p style={{
              margin: '0 0 5px 0',
              color: '#64748b',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Growth
            </p>
            <p style={{
              margin: '0',
              color: '#0f172a',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              +{reportData.summary.growth}%
            </p>
          </div>
        </div>

        {/* Sales by category */}
        <h2 style={{
          margin: '30px 0 15px 0',
          color: '#0f172a',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          Sales by Category
        </h2>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '30px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                color: '#0f172a',
                fontWeight: '600',
                borderBottom: '2px solid #cbd5e1',
                fontSize: '14px'
              }}>
                Category
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                color: '#0f172a',
                fontWeight: '600',
                borderBottom: '2px solid #cbd5e1',
                fontSize: '14px'
              }}>
                Sales
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                color: '#0f172a',
                fontWeight: '600',
                borderBottom: '2px solid #cbd5e1',
                fontSize: '14px'
              }}>
                Orders
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                color: '#0f172a',
                fontWeight: '600',
                borderBottom: '2px solid #cbd5e1',
                fontSize: '14px'
              }}>
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {reportData.salesByCategory.map((item, i) => (
              <tr key={i}>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  fontSize: '14px'
                }}>
                  {item.category}
                </td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  ${item.sales.toLocaleString()}
                </td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  textAlign: 'right',
                  fontSize: '14px'
                }}>
                  {item.orders}
                </td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  textAlign: 'right',
                  fontSize: '14px'
                }}>
                  {item.percentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Top products */}
        <h2 style={{
          margin: '30px 0 15px 0',
          color: '#0f172a',
          fontSize: '20px',
          fontWeight: '600'
        }}>
          Top Performing Products
        </h2>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '30px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                color: '#0f172a',
                fontWeight: '600',
                borderBottom: '2px solid #cbd5e1',
                fontSize: '14px'
              }}>
                Product
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                color: '#0f172a',
                fontWeight: '600',
                borderBottom: '2px solid #cbd5e1',
                fontSize: '14px'
              }}>
                Revenue
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                color: '#0f172a',
                fontWeight: '600',
                borderBottom: '2px solid #cbd5e1',
                fontSize: '14px'
              }}>
                Units Sold
              </th>
            </tr>
          </thead>
          <tbody>
            {reportData.topProducts.map((item, i) => (
              <tr key={i}>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  fontSize: '14px'
                }}>
                  {item.name}
                </td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  ${item.sales.toLocaleString()}
                </td>
                <td style={{
                  padding: '12px',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  textAlign: 'right',
                  fontSize: '14px'
                }}>
                  {item.units}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{
          marginTop: '40px',
          paddingTop: '20px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          color: '#94a3b8',
          fontSize: '12px'
        }}>
          <p style={{ margin: '5px 0' }}>
            This report is confidential and intended for internal use only.
          </p>
          <p style={{ margin: '5px 0' }}>
            Generated by React to PDF • {reportData.date}
          </p>
        </div>
      </div>
    </div>
  );
}
