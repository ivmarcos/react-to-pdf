import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import * as React from 'react';

// Example templates
const examples = {
  basic: {
    title: 'Basic Example',
    code: `import { usePDF } from 'react-to-pdf';

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
    code: `import { usePDF } from 'react-to-pdf';

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
    code: `import { usePDF } from 'react-to-pdf';

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
}`
  }
};

export default function LivePlayground() {
  const [mounted, setMounted] = useState(false);
  const [usePDF, setUsePDF] = useState<any>(null);
  const [selectedExample, setSelectedExample] = useState<'basic' | 'styled' | 'table'>('basic');
  const [code, setCode] = useState(examples.basic.code);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only import and initialize on client side
    import('react-to-pdf').then((module) => {
      const pkg = module as any;
      const usePDFFunc = pkg.usePDF || pkg.default?.usePDF;
      setUsePDF(() => usePDFFunc);
      setMounted(true);
    }).catch((error) => {
      console.error('[LivePlayground] Failed to load react-to-pdf:', error);
    });
  }, []);

  const handleExampleChange = (example: 'basic' | 'styled' | 'table') => {
    setSelectedExample(example);
    setCode(examples[example].code);
    setError(null);
  };

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

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Example Selector */}
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {(Object.keys(examples) as Array<keyof typeof examples>).map((key) => (
          <button
            key={key}
            onClick={() => handleExampleChange(key)}
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
            {examples[key].title}
          </button>
        ))}
      </div>

      {/* Code Editor and Preview Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        padding: '0 20px'
      }}>
        {/* Code Editor Section */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#0f172a', fontSize: '18px', fontWeight: '600' }}>
            ✏️ Live Editor
          </h3>
          <div style={{
            border: '1px solid #334155',
            borderRadius: '8px',
            overflow: 'hidden',
            height: '600px'
          }}>
            <Editor
              height="600px"
              defaultLanguage="typescript"
              value={code}
              onChange={(value) => {
                setCode(value || '');
                setError(null);
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          </div>
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
            minHeight: '600px',
            maxHeight: '600px',
            overflow: 'auto'
          }}>
            {error ? (
              <div style={{
                padding: '20px',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#991b1b'
              }}>
                <strong>Error:</strong>
                <pre style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>{error}</pre>
              </div>
            ) : (
              <LivePreview code={code} usePDF={usePDF} onError={setError} />
            )}
          </div>
          <p style={{
            marginTop: '15px',
            fontSize: '14px',
            color: '#64748b',
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            👆 Edit the code and see the preview update in real-time!
          </p>
        </div>
      </div>
    </div>
  );
}

// Component that evaluates and renders the user's code
function LivePreview({ code, usePDF, onError }: { code: string; usePDF: any; onError: (error: string | null) => void }) {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    async function compileAndRender() {
      try {
        // Dynamically import Babel
        const Babel = await import('@babel/standalone');

        // Extract the component code (remove import statement)
        const componentCode = code.replace(/import.*from.*['"];?\s*/g, '');

        // Transform JSX to JavaScript using Babel
        const transformedCode = Babel.transform(componentCode, {
          presets: ['react'],
          filename: 'playground.tsx'
        }).code;

        // Create a function that returns the component
        const createComponent = new Function(
          'React',
          'usePDF',
          `
          const { useState, useEffect, useRef, useCallback, createElement } = React;
          ${transformedCode}

          // Return the first function found (the component)
          const functionNames = ${JSON.stringify(extractFunctionNames(code))};
          if (functionNames.length > 0) {
            return eval(functionNames[0]);
          }
          throw new Error('No component function found in code');
          `
        );

        const ComponentFunc = createComponent(
          React,
          usePDF
        );

        setComponent(() => ComponentFunc);
        onError(null);
      } catch (err: any) {
        console.error('Error evaluating code:', err);
        onError(err.message || 'Failed to compile or evaluate code');
        setComponent(null);
      }
    }

    compileAndRender();
  }, [code, usePDF, onError]);

  if (!Component) {
    return null;
  }

  try {
    return <Component />;
  } catch (err: any) {
    onError(err.message || 'Error rendering component');
    return null;
  }
}

// Helper function to extract function names from code
function extractFunctionNames(code: string): string[] {
  const functionRegex = /function\s+(\w+)/g;
  const names: string[] = [];
  let match;

  while ((match = functionRegex.exec(code)) !== null) {
    names.push(match[1]);
  }

  return names;
}
