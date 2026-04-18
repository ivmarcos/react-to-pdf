import type { APIRoute } from "astro";

type RawFile = string;

const rawFiles = import.meta.glob<RawFile>("./docs/**/*.mdx", {
  eager: true,
  query: "?raw",
  import: "default",
});

function extractFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fm[m[1]] = value;
  }
  return fm;
}

function stripToText(raw: string): string {
  return raw
    .replace(/^---[\s\S]*?---\s*/, "")
    .replace(/^import[^\n]+from[^\n]+$/gm, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<\/?[a-zA-Z][^>]*>/g, " ")
    .replace(/[`*_~>#\[\]{}()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const GET: APIRoute = async () => {
  const index = Object.entries(rawFiles).map(([path, raw]) => {
    const slug = path.replace(/^\.\//, "").replace(/\.mdx$/, "");
    const url = `/react-to-pdf/${slug}`;
    const fm = extractFrontmatter(raw);
    const title = fm.title ?? slug;
    const description = fm.description ?? "";
    const text = stripToText(raw).slice(0, 2000);
    return { url, title, description, text };
  });

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
