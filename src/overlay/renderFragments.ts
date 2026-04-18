import * as React from "react";
import type { FooterHeaderProps, FooterHeaderRenderProps } from "../types";

type Unmount = () => void;
type Mount = (host: HTMLElement, node: React.ReactNode) => Unmount;

let cachedMount: Mount | null = null;

/**
 * Choose between React 18's `createRoot` (preferred) and the legacy
 * `ReactDOM.render` path. Detection is lazy + cached so the first call pays
 * a dynamic import and every subsequent call is sync.
 */
async function getMount(): Promise<Mount> {
  if (cachedMount) return cachedMount;

  try {
    // Build the specifier at runtime so bundlers don't try to resolve
    // `react-dom/client` statically in projects that still ship React 16/17.
    const clientSpecifier = "react-dom" + "/client";
    const clientMod: any = await import(
      /* @vite-ignore */ /* webpackIgnore: true */ clientSpecifier
    );
    if (clientMod?.createRoot) {
      cachedMount = (host, node) => {
        const root = clientMod.createRoot(host);
        root.render(node);
        return () => {
          try {
            root.unmount();
          } catch {
            /* no-op */
          }
        };
      };
      return cachedMount;
    }
  } catch {
    /* React 17 or below: fall through to ReactDOM.render. */
  }

  const legacy: any = await import("react-dom");
  cachedMount = (host, node) => {
    legacy.render(node, host);
    return () => {
      try {
        legacy.unmountComponentAtNode(host);
      } catch {
        /* no-op */
      }
    };
  };
  return cachedMount;
}

/**
 * Mount a React render function once per page into detached containers so it
 * can be rasterised by the header/footer overlay pass. Returns the hosting
 * elements plus a cleanup function. Header/footer receive
 * `{ page, pages }` on each render.
 *
 * Works on React 16.8+. On React 18+ it uses `createRoot`; on older React
 * it falls back to `ReactDOM.render`.
 */
export async function renderFragmentsPerPage(
  config: FooterHeaderProps | null,
  numberOfPages: number
): Promise<{ elements: (HTMLElement | null)[]; cleanup: () => void }> {
  if (!config || numberOfPages === 0) {
    return { elements: [], cleanup: () => undefined };
  }

  const mount = await getMount();
  const hosts: HTMLElement[] = [];
  const unmounts: Unmount[] = [];

  for (let i = 1; i <= numberOfPages; i++) {
    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.left = "-10000px";
    host.style.top = "-10000px";
    host.style.pointerEvents = "none";
    document.body.appendChild(host);
    const props: FooterHeaderRenderProps = { page: i, pages: numberOfPages };
    unmounts.push(
      mount(host, React.createElement(config.render as any, props))
    );
    hosts.push(host);
  }

  // Let React flush before html2canvas reads the DOM.
  await new Promise((resolve) => setTimeout(resolve, 20));

  const cleanup = () => {
    unmounts.forEach((fn) => fn());
    hosts.forEach((host) => host.remove());
  };

  return { elements: hosts, cleanup };
}
