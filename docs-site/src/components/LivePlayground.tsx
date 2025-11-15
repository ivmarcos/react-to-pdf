import { useEffect, useState } from 'react';

function BasicExample({ usePDF }: { usePDF: any }) {
  const { targetRef, toPDF } = usePDF({
    filename: 'document.pdf'
  });

  return (
    <div>
      <button
        onClick={() => toPDF()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0ea5e9',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '20px',
          fontWeight: '500'
        }}
      >
        Download PDF
      </button>

      <div ref={targetRef} style={{
        padding: '40px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        <h1 style={{ margin: '0 0 15px 0', color: '#0f172a' }}>Hello PDF!</h1>
        <p style={{ margin: 0, color: '#64748b' }}>This is a basic example.</p>
      </div>
    </div>
  );
}

function StyledExample({ usePDF }: { usePDF: any }) {
  const { targetRef, toPDF } = usePDF({
    filename: 'styled-document.pdf'
  });

  return (
    <div>
      <button
        onClick={() => toPDF()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0ea5e9',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '20px',
          fontWeight: '500'
        }}
      >
        Download PDF
      </button>

      <div ref={targetRef} style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        <h1 style={{
          color: '#0ea5e9',
          borderBottom: '3px solid #0ea5e9',
          paddingBottom: '10px',
          marginTop: 0
        }}>
          Styled Document
        </h1>
        <p style={{ lineHeight: '1.6', color: '#64748b' }}>
          This document has custom styling applied!
        </p>
      </div>
    </div>
  );
}

function TableExample({ usePDF }: { usePDF: any }) {
  const { targetRef, toPDF } = usePDF({
    filename: 'table-document.pdf'
  });

  const data = [
    { name: 'Item 1', price: 100 },
    { name: 'Item 2', price: 200 },
    { name: 'Item 3', price: 150 }
  ];

  return (
    <div>
      <button
        onClick={() => toPDF()}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0ea5e9',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '20px',
          fontWeight: '500'
        }}
      >
        Download PDF
      </button>

      <div ref={targetRef} style={{
        padding: '40px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        <h2 style={{ marginTop: 0, color: '#0f172a' }}>Invoice</h2>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                Item
              </th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #cbd5e1' }}>
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{item.name}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  \${item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', textAlign: 'right', fontWeight: 'bold' }}>
          Total: $450
        </div>
      </div>
    </div>
  );
}

const examples = {
  basic: {
    title: 'Basic Example',
    component: BasicExample,
    code: `import pkg from 'react-to-pdf';
const { usePDF } = pkg as any;

function MyDocument() {
  const { targetRef, toPDF } = usePDF({
    filename: 'document.pdf'
  });

  return (
    <div>
      <button onClick={() => toPDF()}>
        Download PDF
      </button>
      <div ref={targetRef}>
        <h1>Hello PDF!</h1>
        <p>This is a basic example.</p>
      </div>
    </div>
  );
}`
  },
  styled: {
    title: 'Styled Example',
    component: StyledExample,
    code: `import pkg from 'react-to-pdf';
const { usePDF } = pkg as any;

function StyledDocument() {
  const { targetRef, toPDF } = usePDF({
    filename: 'styled-document.pdf'
  });

  return (
    <div>
      <button onClick={() => toPDF()}>
        Download PDF
      </button>
      <div ref={targetRef} style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{
          color: '#0ea5e9',
          borderBottom: '3px solid #0ea5e9'
        }}>
          Styled Document
        </h1>
        <p style={{ lineHeight: '1.6', color: '#64748b' }}>
          This document has custom styling applied!
        </p>
      </div>
    </div>
  );
}`
  },
  table: {
    title: 'Table Example',
    component: TableExample,
    code: `import pkg from 'react-to-pdf';
const { usePDF } = pkg as any;

function TableDocument() {
  const { targetRef, toPDF } = usePDF({
    filename: 'table-document.pdf'
  });

  const data = [
    { name: 'Item 1', price: 100 },
    { name: 'Item 2', price: 200 },
    { name: 'Item 3', price: 150 }
  ];

  return (
    <div>
      <button onClick={() => toPDF()}>
        Download PDF
      </button>
      <div ref={targetRef} style={{ padding: '40px' }}>
        <h2>Invoice</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Item</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td style={{ padding: '12px' }}>{item.name}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  \\\${item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', textAlign: 'right', fontWeight: 'bold' }}>
          Total: $450
        </div>
      </div>
    </div>
  );
}`
  }
};

export default function LivePlayground() {
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
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '60px 20px',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '16px'
      }}>
        Loading playground...
      </div>
    );
  }

  return <PlaygroundContent usePDF={usePDF} />;
}

function PlaygroundContent({ usePDF }: { usePDF: any }) {
  const [selectedExample, setSelectedExample] = useState<'basic' | 'styled' | 'table'>('basic');

  const examplesWithProps = {
    basic: {
      title: 'Basic Example',
      component: () => <BasicExample usePDF={usePDF} />,
      code: examples.basic.code
    },
    styled: {
      title: 'Styled Example',
      component: () => <StyledExample usePDF={usePDF} />,
      code: examples.styled.code
    },
    table: {
      title: 'Table Example',
      component: () => <TableExample usePDF={usePDF} />,
      code: examples.table.code
    }
  };

  const CurrentComponent = examplesWithProps[selectedExample].component;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Example Selector */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {(Object.keys(examplesWithProps) as Array<keyof typeof examplesWithProps>).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedExample(key)}
            style={{
              padding: '12px 24px',
              backgroundColor: selectedExample === key ? '#0ea5e9' : '#ffffff',
              color: selectedExample === key ? 'white' : '#0f172a',
              border: selectedExample === key ? '2px solid #0ea5e9' : '2px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              transition: 'all 0.2s',
              boxShadow: selectedExample === key ? '0 4px 6px rgba(14, 165, 233, 0.2)' : 'none'
            }}
          >
            {examplesWithProps[key].title}
          </button>
        ))}
      </div>

      {/* Code and Preview Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        padding: '0 20px'
      }}>
        {/* Code Section */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0f172a', fontSize: '18px', fontWeight: '600' }}>
            📝 Code
          </h3>
          <pre style={{
            backgroundColor: '#1e293b',
            color: '#e2e8f0',
            padding: '20px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '13px',
            lineHeight: '1.6',
            fontFamily: 'Monaco, Menlo, Consolas, monospace',
            maxHeight: '600px',
            margin: 0,
            border: '1px solid #334155'
          }}>
            <code>{examplesWithProps[selectedExample].code}</code>
          </pre>
        </div>

        {/* Live Preview Section */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0f172a', fontSize: '18px', fontWeight: '600' }}>
            🎯 Live Preview
          </h3>
          <div style={{
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            minHeight: '200px'
          }}>
            <CurrentComponent />
          </div>
          <p style={{
            marginTop: '15px',
            fontSize: '14px',
            color: '#64748b',
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            👆 Click "Download PDF" to generate the PDF in your browser!
          </p>
        </div>
      </div>
    </div>
  );
}
