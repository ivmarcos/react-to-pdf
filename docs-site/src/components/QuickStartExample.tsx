import { useEffect, useState } from 'react';

export default function QuickStartExample() {
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
      console.error('[QuickStartExample] Failed to load react-to-pdf:', error);
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

  return <QuickStartContent usePDF={usePDF} />;
}

function QuickStartContent({ usePDF }: { usePDF: any }) {
  const { targetRef, toPDF } = usePDF({ filename: 'page.pdf' });

  return (
    <div style={{
      padding: '30px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginTop: '30px',
      marginBottom: '30px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => toPDF()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#0ea5e9',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 500,
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
        >
          Download PDF
        </button>
      </div>

      <div ref={targetRef} style={{
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h1 style={{
          fontSize: '32px',
          color: '#0f172a',
          margin: '0 0 16px 0'
        }}>
          Hello PDF!
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          lineHeight: '1.6',
          margin: 0
        }}>
          This content will be converted to PDF when you click the button above.
        </p>
      </div>

      <p style={{
        marginTop: '20px',
        fontSize: '14px',
        color: '#64748b',
        fontStyle: 'italic',
        textAlign: 'center'
      }}>
        👆 Try clicking "Download PDF" to see it in action!
      </p>
    </div>
  );
}

