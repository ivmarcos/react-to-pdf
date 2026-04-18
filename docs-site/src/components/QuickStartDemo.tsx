import { useEffect, useMemo, useState } from "react";
import * as React from "react";

const DEFAULT_CODE = `import { usePDF } from 'react-to-pdf';

function MyDocument() {
  const { targetRef, toPDF } = usePDF({
    filename: 'hello.pdf',
    resolution: 1,
  });

  return (
    <div>
      <button
        onClick={() => toPDF()}
        style={{
          background: 'linear-gradient(135deg,#0ea5e9,#d946ef)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: 8,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(14,165,233,0.25)'
        }}
      >
        ⬇ Download PDF
      </button>

      <div
        ref={targetRef}
        style={{
          marginTop: 16,
          background: 'white',
          color: '#0f172a',
          padding: 32,
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(15,23,42,0.06)'
        }}
      >
        <h3 style={{ margin: 0, color: '#0ea5e9', fontSize: 22 }}>
          Hello PDF!
        </h3>
        <p style={{ marginTop: 8, color: '#475569', lineHeight: 1.6, fontSize: 14 }}>
          Edit this code and click Download PDF to render it as a real PDF.
        </p>
      </div>
    </div>
  );
}`;

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

function extractFunctionNames(code: string): string[] {
  const functionRegex = /function\s+(\w+)/g;
  const names: string[] = [];
  let match;
  while ((match = functionRegex.exec(code)) !== null) {
    names.push(match[1]);
  }
  return names;
}

export default function QuickStartDemo() {
  const [usePDF, setUsePDF] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    import("react-to-pdf")
      .then((mod: any) => {
        const fn = mod.usePDF || mod.default?.usePDF;
        setUsePDF(() => fn);
      })
      .catch((err) => {
        console.error("[QuickStartDemo] Failed to load react-to-pdf:", err);
        setLoadError("Unable to load react-to-pdf.");
      });
  }, []);

  if (loadError) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/40 p-6 text-sm text-red-800 dark:text-red-200">
        {loadError}
      </div>
    );
  }

  if (!usePDF) {
    return <LoadingState />;
  }

  return <Demo usePDF={usePDF} />;
}

function Demo({ usePDF }: { usePDF: any }) {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [compiledCode, setCompiledCode] = useState(DEFAULT_CODE);
  const [error, setError] = useState<string | null>(null);
  const isDark = useIsDark();

  useEffect(() => {
    const t = setTimeout(() => setCompiledCode(code), 400);
    return () => clearTimeout(t);
  }, [code]);

  return (
    <div className="grid md:grid-cols-2 gap-6 items-stretch">
      <CodeEditor value={code} onChange={setCode} isDark={isDark} />
      <PreviewPanel
        code={compiledCode}
        usePDF={usePDF}
        error={error}
        onError={setError}
        isDark={isDark}
      />
    </div>
  );
}

function CodeEditor({
  value,
  onChange,
  isDark,
}: {
  value: string;
  onChange: (v: string) => void;
  isDark: boolean;
}) {
  const lines = value.split("\n").length;
  const rows = Math.max(16, Math.min(lines + 1, 26));

  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{
        background: isDark ? "#0f172a" : "#0b1220",
        borderColor: isDark ? "#1f2937" : "#0b1220",
      }}
    >
      <div
        className="flex items-center justify-between px-4 h-9 text-xs font-medium"
        style={{
          background: isDark ? "#1e293b" : "#111827",
          color: "#94a3b8",
        }}
      >
        <span>example.tsx</span>
        <span className="opacity-70">editable</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        rows={rows}
        className="w-full block outline-none resize-none"
        style={{
          background: isDark ? "#0f172a" : "#0b1220",
          color: "#e2e8f0",
          caretColor: "#0ea5e9",
          fontFamily:
            "Fira Code, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: 13,
          lineHeight: "1.55",
          padding: "14px 16px",
          tabSize: 2,
          border: "none",
        }}
        aria-label="Editable code sample"
      />
    </div>
  );
}

function PreviewPanel({
  code,
  usePDF,
  error,
  onError,
  isDark,
}: {
  code: string;
  usePDF: any;
  error: string | null;
  onError: (e: string | null) => void;
  isDark: boolean;
}) {
  return (
    <div
      className="rounded-lg border p-6 flex flex-col"
      style={{
        background: isDark ? "#0f172a" : "#f8fafc",
        borderColor: isDark ? "#1f2937" : "#e2e8f0",
        minHeight: 360,
      }}
    >
      {error ? (
        <div
          style={{
            padding: "14px 16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            color: "#991b1b",
            fontSize: 13,
          }}
        >
          <strong>Compile error</strong>
          <pre style={{ marginTop: 8, whiteSpace: "pre-wrap", fontSize: 12 }}>
            {error}
          </pre>
        </div>
      ) : (
        <CompiledPreview code={code} usePDF={usePDF} onError={onError} />
      )}
    </div>
  );
}

function CompiledPreview({
  code,
  usePDF,
  onError,
}: {
  code: string;
  usePDF: any;
  onError: (e: string | null) => void;
}) {
  const [Component, setComponent] = useState<any>(null);
  const [compiling, setCompiling] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function compile() {
      setCompiling(true);
      try {
        const Babel = await import("@babel/standalone");
        const stripped = code.replace(/import[^\n]*from[^\n]*['"];?/g, "");
        const transformed = Babel.transform(stripped, {
          presets: ["react"],
          filename: "quick-start.tsx",
        }).code;

        const names = extractFunctionNames(code);
        if (names.length === 0) {
          throw new Error("No component function found");
        }

        const factory = new Function(
          "React",
          "usePDF",
          `
          const { useState, useEffect, useRef, useCallback, createElement } = React;
          ${transformed}
          return ${names[0]};
          `
        );

        const ComponentFunc = factory(React, usePDF);
        if (!cancelled) {
          setComponent(() => ComponentFunc);
          onError(null);
        }
      } catch (err: any) {
        console.error("[QuickStartDemo] compile error:", err);
        if (!cancelled) {
          onError(err.message || "Failed to compile code");
          setComponent(null);
        }
      } finally {
        if (!cancelled) setCompiling(false);
      }
    }

    compile();
    return () => {
      cancelled = true;
    };
  }, [code, usePDF, onError]);

  if (compiling && !Component) {
    return (
      <div style={{ fontSize: 13, color: "#94a3b8" }}>Compiling…</div>
    );
  }

  if (!Component) return null;

  try {
    return <Component />;
  } catch (err: any) {
    onError(err.message || "Error rendering component");
    return null;
  }
}

function LoadingState() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-900 min-h-[360px] animate-pulse" />
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 min-h-[360px] animate-pulse" />
    </div>
  );
}
