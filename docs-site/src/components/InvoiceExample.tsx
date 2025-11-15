import { useEffect, useState } from 'react';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function InvoiceExample() {
  const [mounted, setMounted] = useState(false);
  const [usePDF, setUsePDF] = useState<any>(null);

  useEffect(() => {
    // Only import and initialize on client side
    import('react-to-pdf').then((module) => {
      const pkg = module as any;
      setUsePDF(() => pkg.usePDF || pkg.default?.usePDF);
      setMounted(true);
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

  return <InvoiceContent usePDF={usePDF} />;
}

function InvoiceContent({ usePDF }: { usePDF: any }) {
  const { targetRef, toPDF } = usePDF({
    filename: 'invoice.pdf',
    page: {
      format: 'a4',
      margin: 10
    }
  });

  const invoiceData = {
    invoiceNumber: 'INV-2024-001',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    from: {
      name: 'Your Company Inc.',
      address: '123 Business St',
      city: 'San Francisco, CA 94102',
      email: 'billing@yourcompany.com'
    },
    to: {
      name: 'Acme Corporation',
      address: '456 Client Ave',
      city: 'New York, NY 10001',
      email: 'accounts@acmecorp.com'
    },
    items: [
      { description: 'Web Development Services', quantity: 40, rate: 150, amount: 6000 },
      { description: 'UI/UX Design', quantity: 20, rate: 120, amount: 2400 },
      { description: 'Consulting', quantity: 10, rate: 200, amount: 2000 }
    ] as InvoiceItem[],
    subtotal: 10400,
    tax: 1040,
    total: 11440
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
          📥 Download Invoice PDF
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', paddingBottom: '20px', borderBottom: '3px solid #0ea5e9' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '24px' }}>{invoiceData.from.name}</h1>
            <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>{invoiceData.from.address}</p>
            <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>{invoiceData.from.city}</p>
            <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>{invoiceData.from.email}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: '0 0 15px 0', color: '#0ea5e9', fontSize: '28px' }}>INVOICE</h2>
            <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
            <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}><strong>Date:</strong> {invoiceData.date}</p>
            <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}><strong>Due Date:</strong> {invoiceData.dueDate}</p>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '16px', textTransform: 'uppercase' }}>Bill To:</h3>
          <p style={{ margin: '5px 0', fontWeight: '600', color: '#0f172a' }}>{invoiceData.to.name}</p>
          <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>{invoiceData.to.address}</p>
          <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>{invoiceData.to.city}</p>
          <p style={{ margin: '5px 0', color: '#64748b', fontSize: '14px' }}>{invoiceData.to.email}</p>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#0f172a', fontWeight: '600', borderBottom: '2px solid #cbd5e1' }}>Description</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#0f172a', fontWeight: '600', borderBottom: '2px solid #cbd5e1' }}>Quantity</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#0f172a', fontWeight: '600', borderBottom: '2px solid #cbd5e1' }}>Rate</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#0f172a', fontWeight: '600', borderBottom: '2px solid #cbd5e1' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, i) => (
              <tr key={i}>
                <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>{item.description}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'right' }}>${item.rate.toFixed(2)}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'right' }}>${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ marginLeft: 'auto', width: '300px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', color: '#64748b' }}>
            <span>Subtotal:</span>
            <span>${invoiceData.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', color: '#64748b' }}>
            <span>Tax (10%):</span>
            <span>${invoiceData.tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 15px', backgroundColor: '#f1f5f9', fontSize: '18px', color: '#0f172a', marginTop: '10px', borderRadius: '4px', fontWeight: '700' }}>
            <span>Total:</span>
            <span>${invoiceData.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: '30px', borderTop: '1px solid #e2e8f0', color: '#64748b', fontSize: '14px' }}>
          <p style={{ margin: '5px 0' }}>Payment is due within 30 days of the invoice date.</p>
          <p style={{ margin: '5px 0' }}>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}
