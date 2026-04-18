import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import * as React from "react";

// Example templates
const examples = {
  basic: {
    title: "Basic Example",
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
}`,
  },
  styled: {
    title: "Styled Example",
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
}`,
  },
  table: {
    title: "Table Example",
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
}`,
  },
};

interface LivePlaygroundProps {
  compact?: boolean;
  heightPx?: number;
  showSelector?: boolean;
}

function useIsDark() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const read = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    read();
    const handler = () => read();
    window.addEventListener("themechange", handler);
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      window.removeEventListener("themechange", handler);
      observer.disconnect();
    };
  }, []);

  return isDark;
}

export default function LivePlayground({
  compact = false,
  heightPx = 600,
  showSelector = true,
}: LivePlaygroundProps) {
  const [mounted, setMounted] = useState(false);
  const [usePDF, setUsePDF] = useState<any>(null);
  const [selectedExample, setSelectedExample] = useState<
    "basic" | "styled" | "table"
  >("basic");
  const [code, setCode] = useState(examples.basic.code);
  const [error, setError] = useState<string | null>(null);
  const isDark = useIsDark();

  useEffect(() => {
    import("react-to-pdf")
      .then((module) => {
        const pkg = module as any;
        const usePDFFunc = pkg.usePDF || pkg.default?.usePDF;
        setUsePDF(() => usePDFFunc);
        setMounted(true);
      })
      .catch((error) => {
        console.error("[LivePlayground] Failed to load react-to-pdf:", error);
        setError("Failed to load react-to-pdf. Check the console for details.");
        setMounted(true);
      });
  }, []);

  const handleExampleChange = (example: "basic" | "styled" | "table") => {
    setSelectedExample(example);
    setCode(examples[example].code);
    setError(null);
  };

  const editorHeight = `${heightPx}px`;
  const previewBg = isDark ? "#0f172a" : "#f8fafc";
  const previewBorder = isDark ? "#1f2937" : "#e2e8f0";
  const previewText = isDark ? "#e2e8f0" : "#0f172a";
  const labelColor = isDark ? "#f1f5f9" : "#0f172a";
  const hintColor = isDark ? "#94a3b8" : "#64748b";
  const editorBorder = isDark ? "#334155" : "#cbd5e1";

  if (!mounted) {
    return (
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
          color: hintColor,
          fontSize: "16px",
        }}
      >
        Loading playground…
      </div>
    );
  }

  if (!usePDF) {
    return (
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "30px",
          border: "1px solid #fecaca",
          background: "#fef2f2",
          color: "#991b1b",
          borderRadius: "8px",
        }}
      >
        <strong>Playground unavailable.</strong>{" "}
        {error ?? "react-to-pdf failed to load."}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {showSelector && (
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {(Object.keys(examples) as Array<keyof typeof examples>).map(
            (key) => {
              const selected = selectedExample === key;
              return (
                <button
                  key={key}
                  onClick={() => handleExampleChange(key)}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: selected
                      ? "#0ea5e9"
                      : isDark
                        ? "#1e293b"
                        : "#ffffff",
                    color: selected ? "white" : labelColor,
                    border: selected
                      ? "2px solid #0ea5e9"
                      : `2px solid ${editorBorder}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: 600,
                    transition: "all 0.2s",
                    boxShadow: selected
                      ? "0 4px 6px rgba(14, 165, 233, 0.2)"
                      : "none",
                  }}
                >
                  {examples[key].title}
                </button>
              );
            }
          )}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: compact ? "1fr 1fr" : "1fr 1fr",
          gap: "24px",
          padding: compact ? "0" : "0 20px",
        }}
      >
        <div>
          {!compact && (
            <h3
              style={{
                marginTop: 0,
                marginBottom: "15px",
                color: labelColor,
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              ✏️ Live Editor
            </h3>
          )}
          <div
            style={{
              border: `1px solid ${editorBorder}`,
              borderRadius: "8px",
              overflow: "hidden",
              height: editorHeight,
            }}
          >
            <Editor
              height={editorHeight}
              defaultLanguage="typescript"
              value={code}
              onChange={(value) => {
                setCode(value || "");
                setError(null);
              }}
              theme={isDark ? "vs-dark" : "light"}
              beforeMount={(monaco) => {
                monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions(
                  {
                    noSemanticValidation: true,
                    noSyntaxValidation: true,
                  }
                );
                monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                  {
                    noSemanticValidation: true,
                    noSyntaxValidation: true,
                  }
                );
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>
        </div>

        <div>
          {!compact && (
            <h3
              style={{
                marginTop: 0,
                marginBottom: "15px",
                color: labelColor,
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              🎯 Live Preview
            </h3>
          )}
          <div
            style={{
              padding: "20px",
              backgroundColor: previewBg,
              color: previewText,
              borderRadius: "8px",
              border: `1px solid ${previewBorder}`,
              height: editorHeight,
              overflow: "auto",
            }}
          >
            {error ? (
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#fee2e2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  color: "#991b1b",
                }}
              >
                <strong>Error:</strong>
                <pre style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
                  {error}
                </pre>
              </div>
            ) : (
              <LivePreview
                code={code}
                usePDF={usePDF}
                onError={setError}
                isDark={isDark}
              />
            )}
          </div>
          {!compact && (
            <p
              style={{
                marginTop: "15px",
                fontSize: "14px",
                color: hintColor,
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              👆 Edit the code and see the preview update in real-time!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function LivePreview({
  code,
  usePDF,
  onError,
  isDark,
}: {
  code: string;
  usePDF: any;
  onError: (error: string | null) => void;
  isDark: boolean;
}) {
  const [Component, setComponent] = useState<any>(null);
  const [compiling, setCompiling] = useState(true);

  useEffect(() => {
    async function compileAndRender() {
      setCompiling(true);
      try {
        const Babel = await import("@babel/standalone");
        const componentCode = code.replace(/import.*from.*['"];?\s*/g, "");
        const transformedCode = Babel.transform(componentCode, {
          presets: ["react"],
          filename: "playground.tsx",
        }).code;

        const functionNames = extractFunctionNames(code);
        if (functionNames.length === 0) {
          throw new Error("No component function found in code");
        }

        const createComponent = new Function(
          "React",
          "usePDF",
          `
          const { useState, useEffect, useRef, useCallback, createElement } = React;
          ${transformedCode}
          return ${functionNames[0]};
          `
        );

        const ComponentFunc = createComponent(React, usePDF);
        setComponent(() => ComponentFunc);
        onError(null);
      } catch (err: any) {
        console.error("[LivePlayground] compile error:", err);
        onError(err.message || "Failed to compile or evaluate code");
        setComponent(null);
      } finally {
        setCompiling(false);
      }
    }

    compileAndRender();
  }, [code, usePDF, onError]);

  if (compiling && !Component) {
    return (
      <div style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>
        Compiling…
      </div>
    );
  }

  if (!Component) {
    return null;
  }

  try {
    return <Component />;
  } catch (err: any) {
    onError(err.message || "Error rendering component");
    return null;
  }
}

function extractFunctionNames(code: string): string[] {
  const functionRegex = /function\s+(\w+)/g;
  const names: string[] = [];
  let match;
  while ((match = functionRegex.exec(code)) !== null) {
    names.push(match[1]);
  }
  return names;
}
