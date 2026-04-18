import { useEffect, useRef, useState } from "react";
import type { PDFHandle } from "react-to-pdf";

export default function ResumeExample() {
  const [pkg, setPkg] = useState<any>(null);

  useEffect(() => {
    import("react-to-pdf")
      .then((mod: any) => setPkg(mod))
      .catch((err) => console.error("[ResumeExample] failed to load:", err));
  }, []);

  if (!pkg) return <Skeleton />;

  return <Demo PDF={pkg.PDF} Margin={pkg.Margin} />;
}

function Demo({ PDF, Margin }: { PDF: any; Margin: any }) {
  const pdfRef = useRef<PDFHandle>(null);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
      className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-5"
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => pdfRef.current?.save("jane-doe-resume.pdf")}
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
          ⬇ Download Resume
        </button>
        <span style={{ fontSize: 13, color: "#475569" }}>
          Rendered with <strong>engine: "html"</strong> so recruiters can
          copy-paste bullet points and ATS systems can index the text.
        </span>
      </div>

      <PDF
        ref={pdfRef}
        engine="html"
        preview="embed"
        page={{ format: "a4", margin: Margin.MEDIUM }}
        html={{ autoPaging: "text" }}
        embedProps={{ width: "100%", height: 640 }}
      >
        <article
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            color: "#0f172a",
            padding: 40,
            background: "white",
            lineHeight: 1.5,
          }}
        >
          <header style={{ borderBottom: "2px solid #0ea5e9", paddingBottom: 10 }}>
            <h1 style={{ margin: 0, fontSize: 28, color: "#0ea5e9" }}>
              Jane Doe
            </h1>
            <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 13 }}>
              Senior Frontend Engineer · San Francisco, CA · jane@example.com · (555) 010-2040
            </p>
          </header>

          <section style={{ marginTop: 18 }}>
            <h2 style={Heading}>Summary</h2>
            <p style={{ margin: "6px 0 0", color: "#334155" }}>
              Eight years building design-system-driven React applications
              for fintech and healthcare teams. Shipped a checkout flow that
              raised conversion by 11% and led the migration of a legacy
              monolith to a Next.js platform serving 3M MAU.
            </p>
          </section>

          <section style={{ marginTop: 18 }}>
            <h2 style={Heading}>Experience</h2>
            <Role
              title="Senior Frontend Engineer"
              company="Acme Health"
              dates="2022 – Present"
              bullets={[
                "Own the patient-portal platform (React 18, Next.js, TypeScript).",
                "Migrated 40+ screens from class components to hooks, cutting bundle size by 22%.",
                "Partnered with Design to codify a typography + spacing system used by 6 squads.",
              ]}
            />
            <Role
              title="Frontend Engineer"
              company="Paystream"
              dates="2018 – 2022"
              bullets={[
                "Built the merchant dashboard's reporting module (≈200k daily users).",
                "Introduced Playwright e2e tests, reducing regressions reaching prod by 60%.",
                "Mentored three junior engineers through the promotion ladder.",
              ]}
            />
          </section>

          <section style={{ marginTop: 18 }}>
            <h2 style={Heading}>Education</h2>
            <p style={{ margin: "6px 0 0", color: "#334155" }}>
              <strong>B.Sc. Computer Science</strong>, University of California, Berkeley — 2014
            </p>
          </section>

          <section style={{ marginTop: 18 }}>
            <h2 style={Heading}>Skills</h2>
            <p style={{ margin: "6px 0 0", color: "#334155" }}>
              React · TypeScript · Next.js · Node · Playwright · Tailwind CSS · Storybook · Accessibility
            </p>
          </section>
        </article>
      </PDF>
    </div>
  );
}

const Heading: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#0ea5e9",
};

function Role({
  title,
  company,
  dates,
  bullets,
}: {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
}) {
  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span style={{ fontWeight: 700, color: "#0f172a" }}>
          {title} · {company}
        </span>
        <span style={{ fontSize: 12, color: "#64748b" }}>{dates}</span>
      </div>
      <ul style={{ margin: "6px 0 0 20px", color: "#334155", padding: 0 }}>
        {bullets.map((b) => (
          <li key={b} style={{ marginTop: 4 }}>
            {b}
          </li>
        ))}
      </ul>
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
