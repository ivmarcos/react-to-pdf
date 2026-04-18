import { useEffect, useRef, useState } from "react";
import type { PDFHandle } from "react-to-pdf";

interface FormState {
  fullName: string;
  email: string;
  requestType: string;
  summary: string;
}

const initial: FormState = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  requestType: "Bug report",
  summary: "The checkout submit button becomes unresponsive after switching tabs.",
};

export default function FormExample() {
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    import("react-to-pdf")
      .then((mod: any) => setPkg(mod))
      .catch((err) => console.error("[FormExample] failed to load:", err));
  }, []);

  if (!pkg) return <Skeleton />;

  return <Demo PDF={pkg.PDF} Margin={pkg.Margin} />;
}

function Demo({ PDF, Margin }: { PDF: any; Margin: any }) {
  const [state, setState] = useState(initial);
  const pdfRef = useRef<PDFHandle>(null);

  const update =
    <K extends keyof FormState>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setState((s) => ({ ...s, [field]: e.target.value }));

  return (
    <div
      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5"
      style={{ display: "grid", gap: 18 }}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <Field label="Full name">
          <input
            type="text"
            value={state.fullName}
            onChange={update("fullName")}
            style={InputStyle}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={state.email}
            onChange={update("email")}
            style={InputStyle}
          />
        </Field>
        <Field label="Request type">
          <select
            value={state.requestType}
            onChange={update("requestType")}
            style={InputStyle}
          >
            <option>Bug report</option>
            <option>Feature request</option>
            <option>Billing question</option>
            <option>General feedback</option>
          </select>
        </Field>
        <Field label="Summary">
          <textarea
            value={state.summary}
            onChange={update("summary")}
            rows={3}
            style={{ ...InputStyle, resize: "vertical" }}
          />
        </Field>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={() =>
            pdfRef.current?.save(
              `${state.fullName.replace(/\s+/g, "-").toLowerCase()}-submission.pdf`
            )
          }
          style={{
            background: "linear-gradient(135deg,#0ea5e9,#d946ef)",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(14,165,233,0.25)",
          }}
        >
          ⬇ Download Submission PDF
        </button>
        <span style={{ fontSize: 13, color: "#475569" }}>
          Edit any field — the embed updates when you click Download.
        </span>
      </div>

      <PDF
        ref={pdfRef}
        engine="html"
        preview="embed"
        page={{ format: "a4", margin: Margin.MEDIUM }}
        html={{ autoPaging: "text" }}
        embedProps={{ width: "100%", height: 520 }}
      >
        <article
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            color: "#0f172a",
            padding: 40,
            background: "white",
          }}
        >
          <header style={{ borderBottom: "2px solid #0ea5e9", paddingBottom: 10 }}>
            <h1 style={{ margin: 0, fontSize: 24, color: "#0ea5e9" }}>
              Support request
            </h1>
            <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 12 }}>
              Submitted {new Date().toLocaleDateString()}
            </p>
          </header>

          <Row label="Full name" value={state.fullName} />
          <Row label="Email" value={state.email} />
          <Row label="Request type" value={state.requestType} />
          <Row label="Summary" value={state.summary} block />

          <p style={{ marginTop: 30, color: "#64748b", fontSize: 12 }}>
            Generated in-browser with React to PDF (engine: html). Because the
            text is vectorised, you can search for any field value with
            Ctrl+F inside any PDF viewer.
          </p>
        </article>
      </PDF>
    </div>
  );
}

const InputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #cbd5e1",
  borderRadius: 6,
  fontSize: 14,
  fontFamily: "inherit",
  background: "white",
  color: "#0f172a",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: 4,
        fontSize: 12,
        fontWeight: 600,
        color: "#0f172a",
      }}
    >
      {label}
      {children}
    </label>
  );
}

function Row({
  label,
  value,
  block,
}: {
  label: string;
  value: string;
  block?: boolean;
}) {
  return (
    <div
      style={{
        marginTop: 14,
        display: block ? "block" : "grid",
        gridTemplateColumns: block ? undefined : "140px 1fr",
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#64748b",
        }}
      >
        {label}
      </span>
      <span style={{ color: "#0f172a", display: "block", marginTop: block ? 4 : 0 }}>
        {value || "—"}
      </span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 text-sm text-gray-500 dark:text-gray-400">
      Loading example…
    </div>
  );
}
